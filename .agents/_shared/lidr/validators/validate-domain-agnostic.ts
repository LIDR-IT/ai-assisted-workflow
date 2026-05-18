/**
 * Domain Agnostic Validator
 * Ensures skills and documents are portable across organizations and domains
 */

import { ValidationResult, ValidationIssue, ValidationSeverity } from "./types.js";

export interface DomainAgnosticOptions {
  strictMode: boolean;
  allowExamples: boolean; // Allow domain terms in examples
  allowMinimalReferences: number; // Allow up to N references per term
}

const DEFAULT_OPTIONS: DomainAgnosticOptions = {
  strictMode: false,
  allowExamples: true,
  allowMinimalReferences: 3,
};

// Domain-specific terms that reduce portability
const BIOMETRIC_DOMAIN_TERMS = {
  company: ["docline", "selphi", "selphid"],
  biometric: [
    "biometric",
    "biométrico",
    "biometría",
    "facial",
    "reconocimiento",
    "template",
    "liveness",
    "matching",
    "enrollment",
    "far",
    "frr",
    "eer",
    "pad",
    "spoof",
  ],
  identity: [
    "onboarding",
    "kyc",
    "aml",
    "identity",
    "documento",
    "pasaporte",
    "dni",
    "id card",
    "ocr",
    "nfc",
    "eid",
    "eidas",
  ],
  fintech: [
    "banking",
    "fintech",
    "payment",
    "psd2",
    "sca",
    "strong customer authentication",
    "fraud",
    "anti-money laundering",
  ],
  regulation: ["gdpr", "ccpa", "lgpd", "hipaa", "sox", "pci", "iso 27001", "dpia"],
};

// Terms that indicate organization-specific processes
const ORGANIZATIONAL_TERMS = [
  "confluence",
  "jira",
  "slack",
  "github",
  "sprint",
  "scrum master",
  "product owner",
  "tech lead",
  "pme",
  "devops",
  "qa lead",
];

/**
 * Validates content for domain-agnostic language
 */
export function validateDomainAgnostic(
  content: string,
  options: Partial<DomainAgnosticOptions> = {}
): ValidationResult {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const issues: ValidationIssue[] = [];

  // Split content into sections for context-aware analysis
  const sections = splitIntoSections(content);

  // Check each section
  for (const section of sections) {
    validateSectionAgnostic(section, config, issues);
  }

  // Global checks
  validateOverallPortability(content, config, issues);

  const score = calculateAgnosticScore(content, issues);

  return {
    success: issues.filter((i) => i.severity === ValidationSeverity.ERROR).length === 0,
    score,
    issues,
    metadata: {
      validator: "validate-domain-agnostic",
      timestamp: new Date().toISOString(),
      linesValidated: content.split("\n").length,
    },
  };
}

interface ContentSection {
  title: string;
  content: string;
  startLine: number;
  isExample: boolean;
}

function splitIntoSections(content: string): ContentSection[] {
  const sections: ContentSection[] = [];
  const lines = content.split("\n");

  let currentSection: Partial<ContentSection> = {
    title: "Header",
    content: "",
    startLine: 1,
    isExample: false,
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect section headers
    if (line.startsWith("#")) {
      // Save previous section
      if (currentSection.content) {
        sections.push(currentSection as ContentSection);
      }

      // Start new section
      const title = line.replace(/^#+\s*/, "");
      const isExample = /ejemplo|example|sample|demo/i.test(title);

      currentSection = {
        title,
        content: "",
        startLine: i + 1,
        isExample,
      };
    } else {
      currentSection.content += line + "\n";
    }
  }

  // Add final section
  if (currentSection.content) {
    sections.push(currentSection as ContentSection);
  }

  return sections;
}

function validateSectionAgnostic(
  section: ContentSection,
  config: DomainAgnosticOptions,
  issues: ValidationIssue[]
): void {
  const { title, content, startLine, isExample } = section;

  // Skip examples if allowed
  if (isExample && config.allowExamples) {
    return;
  }

  // Check for domain-specific terms
  Object.entries(BIOMETRIC_DOMAIN_TERMS).forEach(([category, terms]) => {
    terms.forEach((term) => {
      const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
      const matches = content.match(regex);

      if (matches && matches.length > config.allowMinimalReferences) {
        const severity = isExample ? ValidationSeverity.INFO : ValidationSeverity.WARNING;

        issues.push({
          severity,
          message: `Frequent use of domain-specific term: "${term}"`,
          context: `${matches.length} occurrences in section "${title}" (category: ${category})`,
          lineNumber: startLine,
          suggestion: "Consider using generic terminology or moving to examples",
          ruleId: `DOMAIN-${category.toUpperCase()}-001`,
        });
      }
    });
  });

  // Check for organizational terms
  ORGANIZATIONAL_TERMS.forEach((term) => {
    const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    const matches = content.match(regex);

    if (matches && matches.length > 0) {
      issues.push({
        severity: ValidationSeverity.INFO,
        message: `Organization-specific term: "${term}"`,
        context: `${matches.length} occurrences in section "${title}"`,
        lineNumber: startLine,
        suggestion: "Consider making process descriptions more generic",
        ruleId: "DOMAIN-ORG-001",
      });
    }
  });

  // Check for hardcoded values that may be company-specific
  validateHardcodedValues(content, title, startLine, issues);
}

function validateHardcodedValues(
  content: string,
  sectionTitle: string,
  startLine: number,
  issues: ValidationIssue[]
): void {
  // Email domains
  const emailMatches = content.match(/@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
  if (emailMatches) {
    const domains = emailMatches
      .map((m) => m.substring(1))
      .filter((value, index, self) => self.indexOf(value) === index);
    domains.forEach((domain) => {
      if (!["example.com", "test.com", "acme.com"].includes(domain)) {
        issues.push({
          severity: ValidationSeverity.WARNING,
          message: `Hardcoded email domain: ${domain}`,
          context: `Found in section "${sectionTitle}"`,
          lineNumber: startLine,
          suggestion: "Use example.com or variable placeholders",
          ruleId: "DOMAIN-HARDCODE-001",
        });
      }
    });
  }

  // URLs with specific domains
  const urlMatches = content.match(/https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
  if (urlMatches) {
    urlMatches.forEach((url) => {
      const domain = new URL(url).hostname;
      if (!["example.com", "localhost", "api.example.com"].includes(domain)) {
        issues.push({
          severity: ValidationSeverity.INFO,
          message: `Specific URL domain: ${domain}`,
          context: `Found in section "${sectionTitle}"`,
          lineNumber: startLine,
          suggestion: "Consider using example.com or environment variables",
          ruleId: "DOMAIN-HARDCODE-002",
        });
      }
    });
  }

  // File paths with organization names
  const pathMatches = content.match(/\/[a-zA-Z0-9._-]*docline[a-zA-Z0-9._-]*/gi);
  if (pathMatches) {
    pathMatches.forEach((pathMatch) => {
      issues.push({
        severity: ValidationSeverity.WARNING,
        message: `Organization-specific path: ${pathMatch}`,
        context: `Found in section "${sectionTitle}"`,
        lineNumber: startLine,
        suggestion: "Use generic path names or variable placeholders",
        ruleId: "DOMAIN-HARDCODE-003",
      });
    });
  }

  // Database/schema names
  const dbMatches = content.match(/\b(docline|selphi|biometric)_[a-zA-Z0-9_]+\b/gi);
  if (dbMatches) {
    dbMatches.forEach((dbMatch) => {
      issues.push({
        severity: ValidationSeverity.INFO,
        message: `Domain-specific database name: ${dbMatch}`,
        context: `Found in section "${sectionTitle}"`,
        lineNumber: startLine,
        suggestion: 'Use generic schema names like "app_users", "main_db"',
        ruleId: "DOMAIN-HARDCODE-004",
      });
    });
  }
}

function validateOverallPortability(
  content: string,
  config: DomainAgnosticOptions,
  issues: ValidationIssue[]
): void {
  // Calculate domain concentration
  let totalDomainTerms = 0;
  const totalWords = content.split(/\s+/).length;

  Object.values(BIOMETRIC_DOMAIN_TERMS)
    .flat()
    .forEach((term) => {
      const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
      const matches = content.match(regex);
      if (matches) {
        totalDomainTerms += matches.length;
      }
    });

  const domainDensity = totalDomainTerms / totalWords;

  if (domainDensity > 0.05) {
    // More than 5% domain-specific terms
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: `High domain-specific term density: ${(domainDensity * 100).toFixed(1)}%`,
      context: `${totalDomainTerms} domain terms out of ${totalWords} words`,
      suggestion: "Consider making content more generic to improve portability",
      ruleId: "DOMAIN-DENSITY-001",
    });
  }

  // Check for domain-agnostic indicators
  const agnosticIndicators = [
    "domain-agnostic",
    "generic",
    "portable",
    "configurable",
    "customizable",
    "adaptable",
    "organization",
    "company",
    "project",
    "system",
    "application",
  ];

  const hasAgnosticLanguage = agnosticIndicators.some((indicator) =>
    new RegExp(`\\b${indicator}\\b`, "i").test(content)
  );

  if (!hasAgnosticLanguage && domainDensity > 0.02) {
    issues.push({
      severity: ValidationSeverity.INFO,
      message: "Consider adding domain-agnostic language",
      context: "Document appears domain-specific but lacks portable terminology",
      suggestion:
        'Add phrases like "configurable for different domains" or "adaptable to various organizations"',
      ruleId: "DOMAIN-AGNOSTIC-001",
    });
  }
}

function calculateAgnosticScore(content: string, issues: ValidationIssue[]): number {
  const totalWords = content.split(/\s+/).length;

  // Base score from content length (longer content gets higher base)
  const baseScore = Math.min(2, Math.log10(totalWords) - 1); // Max 2 points

  // Calculate domain term density penalty
  let domainTerms = 0;
  Object.values(BIOMETRIC_DOMAIN_TERMS)
    .flat()
    .forEach((term) => {
      const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
      const matches = content.match(regex);
      if (matches) {
        domainTerms += matches.length;
      }
    });

  const domainDensity = domainTerms / totalWords;
  const densityPenalty = Math.min(2, domainDensity * 40); // Penalty up to 2 points

  // Issue penalties
  const errorPenalty = issues.filter((i) => i.severity === ValidationSeverity.ERROR).length * 0.5;
  const warningPenalty =
    issues.filter((i) => i.severity === ValidationSeverity.WARNING).length * 0.3;
  const infoPenalty = issues.filter((i) => i.severity === ValidationSeverity.INFO).length * 0.1;

  // Bonus for agnostic language
  const agnosticBonus = hasAgnosticLanguage(content) ? 1 : 0;

  const finalScore =
    baseScore + agnosticBonus - densityPenalty - errorPenalty - warningPenalty - infoPenalty + 2; // +2 base

  return Math.max(0, Math.min(5, finalScore));
}

function hasAgnosticLanguage(content: string): boolean {
  const agnosticPatterns = [
    /\bconfigurable\b/i,
    /\badaptable\b/i,
    /\bgeneric\b/i,
    /\bdomain[- ]agnostic\b/i,
    /\bportable\b/i,
    /\bcustomizable\b/i,
    /\borganization[- ]independent\b/i,
  ];

  return agnosticPatterns.some((pattern) => pattern.test(content));
}

/**
 * Extract domain-specific terms for analysis
 */
export function extractDomainTerms(content: string): Record<string, string[]> {
  const foundTerms: Record<string, string[]> = {};

  Object.entries(BIOMETRIC_DOMAIN_TERMS).forEach(([category, terms]) => {
    foundTerms[category] = [];

    terms.forEach((term) => {
      const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
      const matches = content.match(regex);
      if (matches && matches.length > 0) {
        foundTerms[category].push(`${term} (${matches.length})`);
      }
    });
  });

  return foundTerms;
}

/**
 * Suggest generic alternatives for domain-specific terms
 */
export function suggestGenericAlternatives(term: string): string[] {
  const alternatives: Record<string, string[]> = {
    biometric: ["authentication factor", "verification method", "identity proof"],
    template: ["reference data", "stored pattern", "comparison baseline"],
    liveness: ["live detection", "real-time verification", "active proof"],
    matching: ["comparison", "verification", "validation"],
    enrollment: ["registration", "setup", "initialization"],
    onboarding: ["user registration", "account creation", "setup process"],
    kyc: ["identity verification", "customer verification", "compliance check"],
    docline: ["your organization", "the company", "the system provider"],
    selphi: ["the service", "the component", "the verification module"],
  };

  return (
    alternatives[term.toLowerCase()] || [
      "generic term",
      "configurable value",
      "system-specific term",
    ]
  );
}
