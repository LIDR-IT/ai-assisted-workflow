/**
 * Skill Completeness Validator
 * Validates that each skill has all required sections and follows ecosystem standards
 */

import {
  ValidationResult,
  ValidationIssue,
  ValidationSeverity,
  SkillValidationContext,
} from "./types.js";
import * as fs from "fs";
import * as path from "path";

export interface SkillCompletenessOptions {
  validateExamples: boolean;
  validateScripts: boolean;
  validateReferences: boolean;
  strictMode: boolean;
}

const DEFAULT_OPTIONS: SkillCompletenessOptions = {
  validateExamples: true,
  validateScripts: false, // Scripts are bonus, not required
  validateReferences: true,
  strictMode: false,
};

const REQUIRED_SECTIONS = [
  "contexto del skill",
  "input requerido",
  "proceso paso a paso",
  "validaciones automáticas",
  "handoff al siguiente skill",
  "criterios de completitud",
  "ejemplo de ejecución",
  "documentos de referencia",
];

const OPTIONAL_SECTIONS = [
  "automatización disponible",
  "personalización por dominio",
  "métricas de calidad",
  "troubleshooting",
];

/**
 * Validates skill completeness according to ecosystem standards
 */
export function validateSkillCompleteness(
  skillContext: SkillValidationContext,
  options: Partial<SkillCompletenessOptions> = {}
): ValidationResult {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const issues: ValidationIssue[] = [];

  // Validate SKILL.md exists and is readable
  if (!fs.existsSync(skillContext.files.skillMd)) {
    return createSkillNotFoundResult(skillContext.skillName);
  }

  const skillContent = fs.readFileSync(skillContext.files.skillMd, "utf-8");

  // Validate frontmatter
  validateFrontmatter(skillContent, skillContext, issues);

  // Validate required sections
  validateRequiredSections(skillContent, issues);

  // Validate file structure
  validateFileStructure(skillContext, config, issues);

  // Validate cross-references
  if (config.validateReferences) {
    validateCrossReferences(skillContent, skillContext, issues);
  }

  // Validate domain-agnostic language
  validateDomainAgnosticLanguage(skillContent, issues);

  // Validate automation indicators
  validateAutomationIndicators(skillContent, skillContext, issues);

  const score = calculateCompletenessScore(skillContent, skillContext, issues);

  return {
    success: issues.filter((i) => i.severity === ValidationSeverity.ERROR).length === 0,
    score,
    issues,
    metadata: {
      validator: "validate-skill-completeness",
      timestamp: new Date().toISOString(),
      fileCount: getFileCount(skillContext),
    },
  };
}

function validateFrontmatter(
  content: string,
  context: SkillValidationContext,
  issues: ValidationIssue[]
): void {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (!frontmatterMatch) {
    issues.push({
      severity: ValidationSeverity.ERROR,
      message: "Missing YAML frontmatter",
      context: "All skills must have frontmatter with id, version, status, etc.",
      lineNumber: 1,
      suggestion: "Add frontmatter following .claude/rules/documentation.md standards",
      ruleId: "SKILL-001",
    });
    return;
  }

  const frontmatter = frontmatterMatch[1];

  // Check required frontmatter fields
  const requiredFields = [
    "id",
    "version",
    "last_updated",
    "updated_by",
    "status",
    "phase",
    "owner_role",
  ];

  for (const field of requiredFields) {
    if (!frontmatter.includes(`${field}:`)) {
      issues.push({
        severity: ValidationSeverity.ERROR,
        message: `Missing required frontmatter field: ${field}`,
        context: "Required for skill tracking and governance",
        lineNumber: 2,
        suggestion: `Add "${field}: [value]" to frontmatter`,
        ruleId: "SKILL-002",
      });
    }
  }

  // Validate id matches skill name
  const idMatch = frontmatter.match(/^id:\s*(.+)$/m);
  if (idMatch && idMatch[1].trim() !== context.skillName) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: "Skill ID does not match directory name",
      context: `ID: ${idMatch[1].trim()}, Directory: ${context.skillName}`,
      suggestion: "Ensure consistency between skill ID and directory name",
      ruleId: "SKILL-003",
    });
  }

  // Validate phase matches context
  const phaseMatch = frontmatter.match(/^phase:\s*(\d+)$/m);
  if (phaseMatch && parseInt(phaseMatch[1]) !== context.phase) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: "Frontmatter phase does not match skill context",
      context: `Frontmatter: ${phaseMatch[1]}, Context: ${context.phase}`,
      suggestion: "Update phase to match SDLC placement",
      ruleId: "SKILL-004",
    });
  }
}

function validateRequiredSections(content: string, issues: ValidationIssue[]): void {
  const lowercaseContent = content.toLowerCase();

  for (const section of REQUIRED_SECTIONS) {
    const sectionRegex = new RegExp(`##\\s*${section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i");

    if (!sectionRegex.test(content)) {
      issues.push({
        severity: ValidationSeverity.ERROR,
        message: `Missing required section: "${section}"`,
        context: "All skills must have complete structure",
        suggestion: `Add "## ${section}" section with appropriate content`,
        ruleId: "SKILL-005",
      });
    } else {
      // Check if section has content
      const sectionMatch = content.match(
        new RegExp(`##\\s*${section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?(?=##|$)`, "i")
      );
      if (sectionMatch && sectionMatch[0].replace(/##.*/, "").trim().length < 50) {
        issues.push({
          severity: ValidationSeverity.WARNING,
          message: `Section "${section}" appears to be incomplete`,
          context: "Sections should have substantial content",
          suggestion: "Add detailed content to this section",
          ruleId: "SKILL-006",
        });
      }
    }
  }
}

function validateFileStructure(
  context: SkillValidationContext,
  config: SkillCompletenessOptions,
  issues: ValidationIssue[]
): void {
  const skillDir = path.dirname(context.files.skillMd);

  // Check for examples/ directory if validation enabled
  if (config.validateExamples) {
    const examplesDir = path.join(skillDir, "examples");
    if (!fs.existsSync(examplesDir)) {
      issues.push({
        severity: ValidationSeverity.WARNING,
        message: "Missing examples/ directory",
        context: "Examples help users understand skill usage",
        suggestion: "Create examples/ directory with sample inputs and outputs",
        ruleId: "SKILL-007",
      });
    } else {
      const exampleFiles = fs.readdirSync(examplesDir);
      if (exampleFiles.length === 0) {
        issues.push({
          severity: ValidationSeverity.WARNING,
          message: "Empty examples/ directory",
          context: "Examples directory should contain sample files",
          suggestion: "Add example input/output files",
          ruleId: "SKILL-008",
        });
      }
    }
  }

  // Check for reference/ directory if validation enabled
  if (config.validateReferences) {
    const refDir = path.join(skillDir, "reference");
    if (!fs.existsSync(refDir)) {
      issues.push({
        severity: ValidationSeverity.INFO,
        message: "Missing reference/ directory",
        context: "Reference materials can improve skill quality",
        suggestion: "Consider adding reference/ directory with related templates",
        ruleId: "SKILL-009",
      });
    }
  }

  // Check for scripts/ directory if validation enabled
  if (config.validateScripts) {
    const scriptsDir = path.join(skillDir, "scripts");
    if (!fs.existsSync(scriptsDir)) {
      issues.push({
        severity: ValidationSeverity.INFO,
        message: "No automation scripts found",
        context: "Automation can improve efficiency for repetitive skills",
        suggestion: "Consider adding scripts/ directory with automation tools",
        ruleId: "SKILL-010",
      });
    }
  }
}

function validateCrossReferences(
  content: string,
  context: SkillValidationContext,
  issues: ValidationIssue[]
): void {
  // Find all @ references
  const references = content.match(/@[\w\-\/\.]+\.md/g) || [];

  for (const ref of references) {
    const refPath = ref.substring(1); // Remove @
    const fullPath = path.resolve(path.dirname(context.skillPath), "../../..", refPath);

    if (!fs.existsSync(fullPath)) {
      issues.push({
        severity: ValidationSeverity.ERROR,
        message: `Broken reference: ${ref}`,
        context: "Referenced document does not exist",
        suggestion: "Fix the path or remove the broken reference",
        ruleId: "SKILL-011",
      });
    }
  }

  // Check for minimum references
  if (references.length === 0) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: "No document references found",
      context: "Skills should reference relevant templates and checklists",
      suggestion: "Add @docs/... references to related materials",
      ruleId: "SKILL-012",
    });
  }
}

function validateDomainAgnosticLanguage(content: string, issues: ValidationIssue[]): void {
  // Check for domain-specific terms that make skill less portable
  const biometricTerms = [
    "docline",
    "biometric",
    "biométrico",
    "facial",
    "reconocimiento",
    "template",
    "liveness",
    "matching",
    "onboarding",
    "kyc",
  ];

  const problematicTerms: string[] = [];

  for (const term of biometricTerms) {
    const regex = new RegExp(`\\b${term}\\b`, "gi");
    const matches = content.match(regex);
    if (matches && matches.length > 2) {
      // Allow some mentions for examples
      problematicTerms.push(term);
    }
  }

  if (problematicTerms.length > 0) {
    issues.push({
      severity: ValidationSeverity.INFO,
      message: "Skill may be domain-specific",
      context: `Found multiple references to: ${problematicTerms.join(", ")}`,
      suggestion: "Consider making examples and language more generic",
      ruleId: "SKILL-013",
    });
  }
}

function validateAutomationIndicators(
  content: string,
  context: SkillValidationContext,
  issues: ValidationIssue[]
): void {
  const hasAutomationSection = /##\s*automatización\s+disponible/i.test(content);
  const hasRobotEmoji = content.includes("🤖");
  const hasScripts = fs.existsSync(path.join(path.dirname(context.files.skillMd), "scripts"));

  if (hasRobotEmoji && !hasAutomationSection) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: "Robot emoji found but missing automation section",
      context: "Skills marked as automated should document automation capabilities",
      suggestion: 'Add "## Automatización Disponible" section',
      ruleId: "SKILL-014",
    });
  }

  if (hasScripts && !hasAutomationSection) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: "Scripts directory found but automation not documented",
      context: "Available automation should be documented in skill",
      suggestion: "Document automation capabilities and usage",
      ruleId: "SKILL-015",
    });
  }
}

function calculateCompletenessScore(
  content: string,
  context: SkillValidationContext,
  issues: ValidationIssue[]
): number {
  // Base score from required sections (2.5 points max)
  const requiredSectionCount = REQUIRED_SECTIONS.filter((section) => {
    const regex = new RegExp(`##\\s*${section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i");
    return regex.test(content);
  }).length;
  const sectionScore = (requiredSectionCount / REQUIRED_SECTIONS.length) * 2.5;

  // Content quality score (1.5 points max)
  const contentLength = content.length;
  const qualityScore = Math.min(1.5, contentLength / 2000); // Normalize by typical skill length

  // File structure bonus (0.5 points max)
  const hasExamples = fs.existsSync(path.join(path.dirname(context.files.skillMd), "examples"));
  const hasReferences = fs.existsSync(path.join(path.dirname(context.files.skillMd), "reference"));
  const structureBonus = (hasExamples ? 0.25 : 0) + (hasReferences ? 0.25 : 0);

  // Automation bonus (0.5 points max)
  const hasScripts = fs.existsSync(path.join(path.dirname(context.files.skillMd), "scripts"));
  const automationBonus = hasScripts ? 0.5 : 0;

  // Penalty for issues
  const errorPenalty = issues.filter((i) => i.severity === ValidationSeverity.ERROR).length * 0.5;
  const warningPenalty =
    issues.filter((i) => i.severity === ValidationSeverity.WARNING).length * 0.2;

  const finalScore =
    sectionScore + qualityScore + structureBonus + automationBonus - errorPenalty - warningPenalty;

  return Math.max(0, Math.min(5, finalScore));
}

function getFileCount(context: SkillValidationContext): number {
  let count = 1; // SKILL.md

  const skillDir = path.dirname(context.files.skillMd);

  ["examples", "reference", "scripts", "templates"].forEach((subdir) => {
    const dirPath = path.join(skillDir, subdir);
    if (fs.existsSync(dirPath)) {
      try {
        const files = fs.readdirSync(dirPath, { recursive: true });
        count += files.length;
      } catch (error) {
        // Directory exists but can't read - count as 0 additional files
      }
    }
  });

  return count;
}

function createSkillNotFoundResult(skillName: string): ValidationResult {
  return {
    success: false,
    score: 0,
    issues: [
      {
        severity: ValidationSeverity.ERROR,
        message: `Skill not found: ${skillName}`,
        context: "SKILL.md file is missing or inaccessible",
        suggestion: "Ensure skill directory and SKILL.md file exist",
        ruleId: "SKILL-000",
      },
    ],
    metadata: {
      validator: "validate-skill-completeness",
      timestamp: new Date().toISOString(),
      fileCount: 0,
    },
  };
}

/**
 * Quick validation check for skill existence
 */
export function validateSkillExists(skillPath: string): boolean {
  const skillMdPath = path.join(skillPath, "SKILL.md");
  return fs.existsSync(skillMdPath);
}

/**
 * Extract skill metadata from frontmatter
 */
export function extractSkillMetadata(skillContent: string): Record<string, any> {
  const frontmatterMatch = skillContent.match(/^---\n([\s\S]*?)\n---/);

  if (!frontmatterMatch) {
    return {};
  }

  const frontmatter = frontmatterMatch[1];
  const metadata: Record<string, any> = {};

  // Simple YAML parsing for basic fields
  const lines = frontmatter.split("\n");
  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      metadata[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
    }
  }

  return metadata;
}
