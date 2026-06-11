#!/usr/bin/env tsx
/**
 * validate-examples.ts - Generate NFR Skill Example Validator
 *
 * Validates that generate-nfr skill examples contain proper structure
 * for generating measurable Non-Functional Requirements (NFRs).
 *
 * Validates:
 * - NFR structure with measurable criteria and metrics
 * - Performance, scalability, security, availability requirements
 * - Compliance with regulatory requirements (regulatory-agnostic)
 * - Testing and validation approaches for each NFR
 * - Priority classification and business impact assessment
 * - Technical implementation guidelines
 *
 * The DEFAULT validation set is 100% DOMAIN-AGNOSTIC: the compliance rule only
 * asks for regulatory framing, never a specific regulation — LIDR is a
 * multi-industry framework. An OPTIONAL biometric/identity domain pack
 * (GDPR/PSD2-specific compliance rule + extra example fixtures) is preserved as
 * BIOMETRIC_DOMAIN_PACK_RULES / BIOMETRIC_DOMAIN_PACK_FILES below and applied
 * only when LIDR_DOMAIN_PACK === 'biometric'. Example only — NOT the active default.
 *
 * Usage: npx tsx scripts/validate-examples.ts
 *        LIDR_DOMAIN_PACK=biometric npx tsx scripts/validate-examples.ts
 */

import { readFileSync, existsSync } from "fs";
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

const GENERATE_NFR_RULES: ValidationRule[] = [
  {
    name: "NFR Structure and Format",
    description: "Must follow standard NFR format with ID, description, and measurable criteria",
    check: (content) =>
      content.includes("NFR-") && content.includes("measurable") && content.includes("criteria"),
    severity: "ERROR",
  },
  {
    name: "Performance Requirements",
    description: "Must include specific performance requirements with quantifiable metrics",
    check: (content) =>
      content.includes("performance") &&
      (content.includes("ms") || content.includes("seconds") || content.includes("response time")),
    severity: "ERROR",
  },
  {
    name: "Scalability Requirements",
    description: "Must define scalability requirements with load and capacity metrics",
    check: (content) =>
      content.includes("scalability") &&
      (content.includes("users") || content.includes("transactions") || content.includes("load")),
    severity: "ERROR",
  },
  {
    name: "Security Requirements",
    description: "Must include security requirements with specific compliance standards",
    check: (content) =>
      content.includes("security") &&
      (content.includes("encryption") ||
        content.includes("authentication") ||
        content.includes("compliance")),
    severity: "ERROR",
  },
  {
    name: "Availability Requirements",
    description: "Must specify availability requirements with uptime metrics and SLAs",
    check: (content) =>
      content.includes("availability") &&
      (content.includes("%") || content.includes("uptime") || content.includes("SLA")),
    severity: "ERROR",
  },
  {
    name: "Maintainability Requirements",
    description:
      "Must address maintainability concerns with code quality and documentation standards",
    check: (content) =>
      content.includes("maintainability") &&
      (content.includes("code") || content.includes("documentation")),
    severity: "ERROR",
  },
  {
    name: "Usability Requirements",
    description: "Must include usability requirements with user experience metrics",
    check: (content) =>
      content.includes("usability") && (content.includes("user") || content.includes("interface")),
    severity: "WARN",
  },
  {
    name: "Compliance Requirements",
    description: "Must address regulatory compliance requirements where applicable",
    check: (content) =>
      content.includes("compliance") &&
      (content.includes("regulatory") ||
        content.includes("regulation") ||
        content.includes("standard")),
    severity: "ERROR",
  },
  {
    name: "Measurable Acceptance Criteria",
    description: "Must define measurable acceptance criteria for each NFR",
    check: (content) => content.includes("acceptance criteria") && content.includes("measurable"),
    severity: "ERROR",
  },
  {
    name: "Testing Approach Definition",
    description: "Must specify testing approaches and validation methods for NFRs",
    check: (content) => content.includes("testing") && content.includes("validation"),
    severity: "ERROR",
  },
  {
    name: "Priority Classification",
    description: "Must classify NFRs by priority (Critical, High, Medium, Low)",
    check: (content) =>
      content.includes("priority") &&
      (content.includes("Critical") || content.includes("High") || content.includes("Medium")),
    severity: "ERROR",
  },
  {
    name: "Business Impact Assessment",
    description: "Must assess business impact of not meeting each NFR",
    check: (content) => content.includes("business impact") || content.includes("impact"),
    severity: "ERROR",
  },
  {
    name: "Implementation Guidelines",
    description: "Must provide technical implementation guidelines for achieving NFRs",
    check: (content) => content.includes("implementation") && content.includes("technical"),
    severity: "ERROR",
  },
  {
    name: "Monitoring and Alerting",
    description: "Must specify monitoring requirements and alerting thresholds",
    check: (content) => content.includes("monitoring") && content.includes("alert"),
    severity: "WARN",
  },
  {
    name: "Capacity Planning",
    description: "Must include capacity planning considerations and growth projections",
    check: (content) => content.includes("capacity") && content.includes("planning"),
    severity: "WARN",
  },
  {
    name: "Recovery Requirements",
    description: "Must define recovery time and recovery point objectives",
    check: (content) =>
      content.includes("recovery") &&
      (content.includes("RTO") || content.includes("RPO") || content.includes("backup")),
    severity: "WARN",
  },
  {
    name: "Cross-Platform Compatibility",
    description: "Must address cross-platform compatibility requirements where applicable",
    check: (content) => content.includes("compatibility") || content.includes("platform"),
    severity: "WARN",
  },
  {
    name: "Data Protection Requirements",
    description: "Must address data protection and privacy requirements",
    check: (content) => content.includes("data protection") || content.includes("privacy"),
    severity: "ERROR",
  },
  {
    name: "Integration Requirements",
    description: "Must specify integration performance and reliability requirements",
    check: (content) => content.includes("integration") && content.includes("API"),
    severity: "WARN",
  },
  {
    name: "Resource Constraints",
    description: "Must consider resource constraints and optimization requirements",
    check: (content) =>
      content.includes("resource") &&
      (content.includes("memory") || content.includes("CPU") || content.includes("optimization")),
    severity: "WARN",
  },
];

/* ────────────────────────────────────────────────────────────────────
   OPTIONAL BIOMETRIC/IDENTITY DOMAIN PACK — example only, NOT the default.
   Spread into the active rules only when LIDR_DOMAIN_PACK === 'biometric'.
   These rules assert industry-specific regulatory framing (GDPR/PSD2) that
   must NOT be required of a generic, multi-industry artifact.
──────────────────────────────────────────────────────────────────── */
const BIOMETRIC_DOMAIN_PACK_RULES: ValidationRule[] = [
  {
    name: "Domain Regulatory Compliance (GDPR/PSD2)",
    description: "Must address GDPR/PSD2 compliance for identity/financial data",
    check: (content) =>
      content.includes("compliance") && (content.includes("GDPR") || content.includes("PSD2")),
    severity: "ERROR",
  },
];

// OPTIONAL biometric/identity example fixtures — example only, NOT the default.
const BIOMETRIC_DOMAIN_PACK_FILES = [
  "biometric-platform-nfrs.md",
  "nfr-selphid-banking-platform.md",
  "security-compliance-nfrs.md",
];

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

  // DEFAULT example files + rules — DOMAIN-AGNOSTIC generic NFR artifacts.
  const exampleFiles = [
    "nfr-requirements.md",
    "api-performance-requirements.md",
    "security-compliance-nfrs.md",
  ];

  const domainPack = process.env.LIDR_DOMAIN_PACK === "biometric";
  const activeRules = domainPack
    ? [...GENERATE_NFR_RULES, ...BIOMETRIC_DOMAIN_PACK_RULES]
    : GENERATE_NFR_RULES;
  const filesToCheck = domainPack
    ? [...exampleFiles, ...BIOMETRIC_DOMAIN_PACK_FILES]
    : exampleFiles;

  const validationCases = [];

  for (const file of filesToCheck) {
    const filePath = join(examplesDir, file);
    if (existsSync(filePath)) {
      validationCases.push({
        file,
        rules: activeRules,
        description: `NFR Generation Example: ${file}`,
      });
    }
  }

  if (validationCases.length === 0) {
    console.log("⚠️ No example files found to validate");
    console.log(`Expected files: ${filesToCheck.join(", ")}`);
    process.exit(0);
  }

  console.log("🔍 Validating Generate-NFR Skill Examples...\n");

  let totalPassed = 0;
  let totalFailed = 0;
  let totalWarnings = 0;
  let allValid = true;

  for (const testCase of validationCases) {
    const filePath = join(examplesDir, testCase.file);
    const result = validateFile(filePath, testCase.rules);
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
  console.log("─".repeat(60));
  console.log(`📊 Validation Summary:`);
  console.log(`   ✅ ${totalPassed} rules passed`);
  console.log(`   ❌ ${totalFailed} rules failed`);
  console.log(`   ⚠️ ${totalWarnings} warnings`);

  if (allValid) {
    console.log("\n🎉 All generate-NFR examples are properly structured!");
    console.log("   Ready for measurable non-functional requirements generation.");
  } else {
    console.log("\n💡 Fix the validation errors to ensure comprehensive NFR coverage.");
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
