#!/usr/bin/env tsx
/**
 * validate-examples.ts - Vulnerability Assessment Skill Example Validator
 *
 * Validates that vuln-assessment skill examples contain proper structure
 * for application security assessment with SAST/SCA scanner integration.
 *
 * The DEFAULT validation set is DOMAIN-AGNOSTIC (scan results, risk assessment,
 * vulnerability details, remediation, dependency analysis, compliance mapping,
 * reporting). LIDR is a multi-industry framework, so no industry-specific rule
 * is applied by default.
 *
 * An overridable EXAMPLE industry pack (biometric identity) is preserved below
 * as BIOMETRIC_DOMAIN_PACK. It is NOT spread into the default validationCases —
 * apply it only behind the explicit flag LIDR_DOMAIN_PACK==='biometric'.
 *
 * Validates:
 * - Vulnerability scan results analysis and interpretation
 * - Risk assessment and prioritization methodology
 * - SAST/SCA findings with severity classification
 * - Remediation recommendations with implementation guidance
 * - Compliance mapping and regulatory requirements
 *
 * Usage: npx tsx scripts/validate-examples.ts
 *   (optional) LIDR_DOMAIN_PACK=biometric npx tsx scripts/validate-examples.ts
 */

import { readFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";

/* ────────────────────────────────────────────────────────────────────
   VALIDATION RULES
──────────────────────────────────────────────────────────────────── */

interface ValidationRule {
  name: string;
  description: string;
  check: (content: string) => boolean;
  severity: "ERROR" | "WARN";
}

const SCAN_RESULTS_RULES: ValidationRule[] = [
  {
    name: "Vulnerability Scan Results Section",
    description: "Must contain vulnerability scan results with findings summary",
    check: (content) =>
      content.includes("Scan Results") || content.includes("Vulnerability Assessment"),
    severity: "ERROR",
  },
  {
    name: "SAST Results Analysis",
    description: "Must include SAST (Static Application Security Testing) results",
    check: (content) => content.includes("SAST") && content.includes("Static"),
    severity: "ERROR",
  },
  {
    name: "SCA Results Analysis",
    description: "Must include SCA (Software Composition Analysis) results",
    check: (content) => content.includes("SCA") && content.includes("Software Composition"),
    severity: "ERROR",
  },
  {
    name: "Vulnerability Count Summary",
    description: "Must provide vulnerability count summary by severity",
    check: (content) =>
      content.includes("Critical") &&
      content.includes("High") &&
      content.includes("Medium") &&
      content.includes("Low"),
    severity: "ERROR",
  },
  {
    name: "Scan Configuration Details",
    description: "Must document scan configuration and scope",
    check: (content) => content.includes("Scan Configuration") || content.includes("scan scope"),
    severity: "ERROR",
  },
];

const RISK_ASSESSMENT_RULES: ValidationRule[] = [
  {
    name: "Risk Assessment Section",
    description: "Must contain comprehensive risk assessment methodology",
    check: (content) => content.includes("Risk Assessment") && content.includes("risk score"),
    severity: "ERROR",
  },
  {
    name: "Severity Classification",
    description: "Must use standardized severity classification (Critical/High/Medium/Low)",
    check: (content) =>
      content.includes("Severity") &&
      content.includes("Critical") &&
      content.includes("classification"),
    severity: "ERROR",
  },
  {
    name: "CVSS Scoring",
    description: "Must include CVSS (Common Vulnerability Scoring System) scores",
    check: (content) => content.includes("CVSS") && /\d\.\d/.test(content),
    severity: "ERROR",
  },
  {
    name: "Business Impact Analysis",
    description: "Must assess business impact for each vulnerability category",
    check: (content) => content.includes("Business Impact") && content.includes("impact"),
    severity: "ERROR",
  },
  {
    name: "Exploitability Assessment",
    description: "Must assess exploitability and attack vectors",
    check: (content) => content.includes("exploitability") || content.includes("attack vector"),
    severity: "WARN",
  },
];

const VULNERABILITY_DETAILS_RULES: ValidationRule[] = [
  {
    name: "Vulnerability Details Section",
    description: "Must provide detailed analysis of critical and high vulnerabilities",
    check: (content) =>
      content.includes("Vulnerability Details") || content.includes("Critical Vulnerabilities"),
    severity: "ERROR",
  },
  {
    name: "CWE Classification",
    description: "Must include CWE (Common Weakness Enumeration) classification",
    check: (content) => content.includes("CWE") && /CWE-\d+/.test(content),
    severity: "ERROR",
  },
  {
    name: "Vulnerability Description",
    description: "Must provide clear description of vulnerability types",
    check: (content) => content.includes("Description") && content.includes("vulnerability"),
    severity: "ERROR",
  },
  {
    name: "Affected Components",
    description: "Must identify affected components and file locations",
    check: (content) =>
      content.includes("Affected") && (content.includes("component") || content.includes("file")),
    severity: "ERROR",
  },
  {
    name: "Proof of Concept",
    description: "Should include proof of concept or evidence for vulnerabilities",
    check: (content) =>
      content.includes("Proof of Concept") ||
      content.includes("PoC") ||
      content.includes("evidence"),
    severity: "WARN",
  },
];

const REMEDIATION_RULES: ValidationRule[] = [
  {
    name: "Remediation Recommendations",
    description: "Must provide specific remediation recommendations",
    check: (content) => content.includes("Remediation") && content.includes("recommendations"),
    severity: "ERROR",
  },
  {
    name: "Implementation Guidance",
    description: "Must include implementation guidance and code examples",
    check: (content) => content.includes("Implementation") && content.includes("guidance"),
    severity: "ERROR",
  },
  {
    name: "Remediation Priority",
    description: "Must prioritize remediation based on risk assessment",
    check: (content) => content.includes("Priority") && content.includes("remediation"),
    severity: "ERROR",
  },
  {
    name: "Timeline for Remediation",
    description: "Must provide timeline for vulnerability remediation",
    check: (content) =>
      content.includes("Timeline") || content.includes("deadline") || content.includes("SLA"),
    severity: "ERROR",
  },
  {
    name: "Validation Steps",
    description: "Must include steps to validate remediation effectiveness",
    check: (content) => content.includes("Validation") && content.includes("verify"),
    severity: "WARN",
  },
];

/* ────────────────────────────────────────────────────────────────────
   OVERRIDABLE EXAMPLE — biometric-identity industry pack.

   This is an EXAMPLE of an industry override, NOT the active default. It is
   intentionally NOT spread into the default validationCases below. Apply it
   only behind the explicit flag LIDR_DOMAIN_PACK==='biometric'. For the
   domain-agnostic (default) run the behavior is unchanged.
──────────────────────────────────────────────────────────────────── */
const BIOMETRIC_DOMAIN_PACK: ValidationRule[] = [
  {
    name: "Biometric Data Security",
    description: "Must address biometric data handling security vulnerabilities",
    check: (content) =>
      content.includes("biometric") ||
      content.includes("Biometric") ||
      content.includes("template"),
    severity: "ERROR",
  },
  {
    name: "Data Encryption Vulnerabilities",
    description: "Must assess encryption vulnerabilities for sensitive data",
    check: (content) => content.includes("encryption") && content.includes("vulnerability"),
    severity: "ERROR",
  },
  {
    name: "Authentication Bypass Risks",
    description: "Must assess authentication bypass and spoofing vulnerabilities",
    check: (content) =>
      content.includes("authentication") &&
      (content.includes("bypass") || content.includes("spoofing")),
    severity: "WARN",
  },
  {
    name: "API Security Assessment",
    description: "Must assess API security for biometric endpoints",
    check: (content) => content.includes("API") && content.includes("endpoint"),
    severity: "ERROR",
  },
  {
    name: "Privacy Compliance Risks",
    description: "Should assess GDPR Article 9 compliance risks",
    check: (content) =>
      content.includes("GDPR") || content.includes("privacy") || content.includes("compliance"),
    severity: "WARN",
  },
];

const DEPENDENCY_ANALYSIS_RULES: ValidationRule[] = [
  {
    name: "Dependency Vulnerability Analysis",
    description: "Must include analysis of vulnerable dependencies",
    check: (content) => content.includes("Dependencies") && content.includes("vulnerable"),
    severity: "ERROR",
  },
  {
    name: "License Compliance Check",
    description: "Should include license compliance analysis",
    check: (content) => content.includes("License") && content.includes("compliance"),
    severity: "WARN",
  },
  {
    name: "Outdated Component Analysis",
    description: "Must identify outdated components with security patches",
    check: (content) => content.includes("outdated") || content.includes("update"),
    severity: "ERROR",
  },
  {
    name: "Dependency Update Recommendations",
    description: "Must provide dependency update recommendations",
    check: (content) => content.includes("update") && content.includes("recommendation"),
    severity: "ERROR",
  },
];

const COMPLIANCE_MAPPING_RULES: ValidationRule[] = [
  {
    name: "Compliance Framework Mapping",
    description: "Must map vulnerabilities to compliance frameworks",
    check: (content) =>
      content.includes("compliance") &&
      (content.includes("OWASP") || content.includes("ISO") || content.includes("NIST")),
    severity: "ERROR",
  },
  {
    name: "OWASP Top 10 Mapping",
    description: "Must map findings to OWASP Top 10 categories",
    check: (content) => content.includes("OWASP Top 10") || content.includes("OWASP"),
    severity: "ERROR",
  },
  {
    name: "Regulatory Requirements",
    description: "Should reference relevant regulatory requirements",
    check: (content) =>
      content.includes("regulatory") || content.includes("PCI DSS") || content.includes("SOC 2"),
    severity: "WARN",
  },
  {
    name: "Industry Standards",
    description: "Should reference industry security standards",
    check: (content) =>
      content.includes("ISO 27001") || content.includes("NIST") || content.includes("standard"),
    severity: "WARN",
  },
];

const REPORTING_RULES: ValidationRule[] = [
  {
    name: "Executive Summary",
    description: "Must include executive summary with key findings",
    check: (content) => content.includes("Executive Summary") && content.includes("key findings"),
    severity: "ERROR",
  },
  {
    name: "Security Posture Assessment",
    description: "Must provide overall security posture assessment",
    check: (content) =>
      content.includes("Security Posture") || content.includes("security posture"),
    severity: "ERROR",
  },
  {
    name: "Trend Analysis",
    description: "Should include trend analysis comparing to previous scans",
    check: (content) =>
      content.includes("trend") || content.includes("comparison") || content.includes("previous"),
    severity: "WARN",
  },
  {
    name: "Metrics and KPIs",
    description: "Must include security metrics and KPIs",
    check: (content) =>
      content.includes("metrics") || content.includes("KPI") || content.includes("measurement"),
    severity: "ERROR",
  },
  {
    name: "Next Steps and Follow-up",
    description: "Must define next steps and follow-up actions",
    check: (content) => content.includes("Next Steps") && content.includes("follow-up"),
    severity: "ERROR",
  },
];

// Explicit opt-in flag for the biometric example industry pack (see
// BIOMETRIC_DOMAIN_PACK above). Default (unset) keeps the DOMAIN-AGNOSTIC set.
const DOMAIN_PACK_RULES: ValidationRule[] =
  process.env.LIDR_DOMAIN_PACK === "biometric" ? BIOMETRIC_DOMAIN_PACK : [];

/* ────────────────────────────────────────────────────────────────────
   VALIDATION ENGINE
──────────────────────────────────────────────────────────────────── */

interface ValidationResult {
  file: string;
  passed: number;
  failed: number;
  warnings: number;
  issues: Array<{
    rule: string;
    severity: "ERROR" | "WARN";
    description: string;
  }>;
}

function validateFile(filePath: string, rules: ValidationRule[]): ValidationResult {
  const content = readFileSync(filePath, "utf-8");
  const result: ValidationResult = {
    file: filePath,
    passed: 0,
    failed: 0,
    warnings: 0,
    issues: [],
  };

  for (const rule of rules) {
    const isValid = rule.check(content);
    if (isValid) {
      result.passed++;
    } else {
      if (rule.severity === "ERROR") {
        result.failed++;
      } else {
        result.warnings++;
      }
      result.issues.push({
        rule: rule.name,
        severity: rule.severity,
        description: rule.description,
      });
    }
  }

  return result;
}

/* ────────────────────────────────────────────────────────────────────
   MAIN VALIDATION
──────────────────────────────────────────────────────────────────── */

async function main(): Promise<void> {
  const examplesDir = join(__dirname, "../examples");

  if (!existsSync(examplesDir)) {
    console.error("❌ Examples directory not found");
    process.exit(1);
  }

  // Find all .md files in examples directory recursively
  const findMdFiles = (dir: string): string[] => {
    const files: string[] = [];
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...findMdFiles(fullPath));
      } else if (
        entry.isFile() &&
        entry.name.endsWith(".md") &&
        !entry.name.includes("validation")
      ) {
        files.push(fullPath);
      }
    }
    return files;
  };

  const mdFiles = findMdFiles(examplesDir);
  const validationCases = mdFiles.map((filePath) => ({
    file: filePath.replace(examplesDir + "/", ""),
    fullPath: filePath,
    rules: [
      ...SCAN_RESULTS_RULES,
      ...RISK_ASSESSMENT_RULES,
      ...VULNERABILITY_DETAILS_RULES,
      ...REMEDIATION_RULES,
      ...DEPENDENCY_ANALYSIS_RULES,
      ...COMPLIANCE_MAPPING_RULES,
      ...REPORTING_RULES,
      ...DOMAIN_PACK_RULES,
    ],
    description: `Vulnerability Assessment: ${filePath.split("/").pop()?.replace(".md", "") || "Unknown"}`,
  }));

  console.log("🔍 Validating Vulnerability Assessment Skill Examples...\n");

  let totalPassed = 0;
  let totalFailed = 0;
  let totalWarnings = 0;
  let allValid = true;

  for (const testCase of validationCases) {
    if (!existsSync(testCase.fullPath)) {
      console.log(`❌ ${testCase.description}`);
      console.log(`   File not found: ${testCase.file}\n`);
      allValid = false;
      continue;
    }

    const result = validateFile(testCase.fullPath, testCase.rules);
    totalPassed += result.passed;
    totalFailed += result.failed;
    totalWarnings += result.warnings;

    if (result.failed === 0) {
      console.log(`✅ ${testCase.description}`);
      console.log(`   ✓ ${result.passed} rules passed`);
      if (result.warnings > 0) {
        console.log(`   ⚠️ ${result.warnings} warnings`);
      }
      console.log();
    } else {
      console.log(`❌ ${testCase.description}`);
      console.log(`   ✓ ${result.passed} rules passed`);
      console.log(`   ❌ ${result.failed} rules failed`);
      if (result.warnings > 0) {
        console.log(`   ⚠️ ${result.warnings} warnings`);
      }

      for (const issue of result.issues) {
        const icon = issue.severity === "ERROR" ? "❌" : "⚠️";
        console.log(`   ${icon} ${issue.rule}: ${issue.description}`);
      }
      console.log();
      allValid = false;
    }
  }

  // Summary
  console.log("─".repeat(70));
  console.log(`📊 Vulnerability Assessment Validation Summary:`);
  console.log(`   ✅ ${totalPassed} rules passed`);
  console.log(`   ❌ ${totalFailed} rules failed`);
  console.log(`   ⚠️ ${totalWarnings} warnings`);

  if (allValid) {
    console.log("\n🎉 All vulnerability assessment examples are properly structured!");
    console.log("   Ready for comprehensive security vulnerability analysis.");
    console.log("   🔒 SAST/SCA integration, risk assessment, and remediation planning validated");
  } else {
    console.log("\n💡 Fix the validation errors to ensure security assessment compatibility.");
    console.log("   Focus on vulnerability analysis and remediation recommendations.");
  }

  process.exit(allValid ? 0 : 1);
}

// Entry point detection
if (typeof import.meta !== "undefined" && import.meta.url.endsWith("validate-examples.ts")) {
  main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}
