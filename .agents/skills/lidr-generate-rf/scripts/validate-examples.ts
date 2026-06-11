#!/usr/bin/env tsx
/**
 * validate-examples.ts - Generate RF Skill Example Validator
 *
 * Validates that generate-rf skill examples contain proper structure
 * for generating structured Functional Requirements (RFs) with BDD criteria.
 *
 * Validates:
 * - RF structure with proper ID, description, and BDD criteria
 * - Given/When/Then format and clarity
 * - Business rule integration and traceability
 * - Actor/Action/Value pattern compliance
 * - Testability and measurability of requirements
 * - Priority classification and business value mapping
 *
 * The DEFAULT validation set is 100% DOMAIN-AGNOSTIC (structure, completeness,
 * format, BDD, measurability, traceability) — LIDR is a multi-industry framework.
 * An OPTIONAL biometric/identity domain pack of extra example fixtures is
 * preserved as BIOMETRIC_DOMAIN_PACK below and applied only when
 * LIDR_DOMAIN_PACK === 'biometric'. It is an example only — NOT the active default.
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

const GENERATE_RF_RULES: ValidationRule[] = [
  {
    name: "RF Structure and Format",
    description: "Must follow standard RF format with ID, title, description, and BDD criteria",
    check: (content) =>
      content.includes("RF-") &&
      content.includes("Given") &&
      content.includes("When") &&
      content.includes("Then"),
    severity: "ERROR",
  },
  {
    name: "Actor/Action/Value Pattern",
    description: "Must follow Actor/Action/Value user story pattern",
    check: (content) =>
      content.includes("As a") && content.includes("I want") && content.includes("So that"),
    severity: "ERROR",
  },
  {
    name: "BDD Criteria Completeness",
    description: "Must include complete BDD scenarios with Given/When/Then structure",
    check: (content) =>
      content.includes("Given") && content.includes("When") && content.includes("Then"),
    severity: "ERROR",
  },
  {
    name: "Business Rule Integration",
    description: "Must integrate relevant business rules and constraints",
    check: (content) => content.includes("business rule") || content.includes("constraint"),
    severity: "ERROR",
  },
  {
    name: "Testable Acceptance Criteria",
    description: "Must define testable and verifiable acceptance criteria",
    check: (content) => content.includes("acceptance criteria") && content.includes("testable"),
    severity: "ERROR",
  },
  {
    name: "Priority Classification",
    description: "Must classify requirements by priority (Must Have, Should Have, Could Have)",
    check: (content) =>
      content.includes("priority") &&
      (content.includes("Must Have") ||
        content.includes("Should Have") ||
        content.includes("Could Have")),
    severity: "ERROR",
  },
  {
    name: "Business Value Mapping",
    description: "Must map requirements to business value and impact",
    check: (content) => content.includes("business value") || content.includes("value"),
    severity: "ERROR",
  },
  {
    name: "Traceability Links",
    description: "Must provide traceability links to PRD sections and user stories",
    check: (content) => content.includes("traceability") || content.includes("PRD"),
    severity: "ERROR",
  },
  {
    name: "Error Scenarios Coverage",
    description: "Must include error scenarios and exception handling requirements",
    check: (content) => content.includes("error") && content.includes("exception"),
    severity: "ERROR",
  },
  {
    name: "Data Validation Rules",
    description: "Must specify data validation rules and input constraints",
    check: (content) => content.includes("validation") && content.includes("input"),
    severity: "ERROR",
  },
  {
    name: "Security Requirements Integration",
    description: "Must integrate security requirements where applicable",
    check: (content) => content.includes("security") || content.includes("authentication"),
    severity: "WARN",
  },
  {
    name: "Performance Considerations",
    description: "Must include performance requirements and response time criteria",
    check: (content) => content.includes("performance") || content.includes("response time"),
    severity: "WARN",
  },
  {
    name: "Integration Requirements",
    description: "Must specify integration requirements with external systems",
    check: (content) => content.includes("integration") || content.includes("external"),
    severity: "WARN",
  },
  {
    name: "User Interface Requirements",
    description: "Must specify user interface and user experience requirements",
    check: (content) => content.includes("interface") || content.includes("UI"),
    severity: "WARN",
  },
  {
    name: "Compliance Requirements",
    description: "Must address regulatory compliance requirements where applicable",
    check: (content) => content.includes("compliance") || content.includes("regulatory"),
    severity: "WARN",
  },
  {
    name: "Alternative Flow Coverage",
    description: "Must cover alternative flows and edge cases",
    check: (content) => content.includes("alternative") || content.includes("edge case"),
    severity: "ERROR",
  },
  {
    name: "Success Criteria Definition",
    description: "Must define clear success criteria and completion conditions",
    check: (content) => content.includes("success criteria") || content.includes("completion"),
    severity: "ERROR",
  },
  {
    name: "Dependency Mapping",
    description: "Must map dependencies on other requirements or systems",
    check: (content) => content.includes("dependency") || content.includes("depends"),
    severity: "WARN",
  },
  {
    name: "Assumptions Documentation",
    description: "Must document assumptions and constraints",
    check: (content) => content.includes("assumption") || content.includes("constraint"),
    severity: "WARN",
  },
  {
    name: "Review and Approval Criteria",
    description: "Must specify review criteria and approval process",
    check: (content) => content.includes("review") || content.includes("approval"),
    severity: "WARN",
  },
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

  // DEFAULT example files — DOMAIN-AGNOSTIC generic RF artifacts.
  const exampleFiles = ["functional-requirements.md", "api-functional-specs.md"];

  // OPTIONAL biometric/identity domain pack — example fixtures only, NOT the
  // active default. Applied only when LIDR_DOMAIN_PACK === 'biometric'.
  const BIOMETRIC_DOMAIN_PACK = [
    "biometric-verification-rfs.md",
    "identity-platform-requirements.md",
    "requirements-selphid-banking-complex.md",
  ];

  const filesToCheck =
    process.env.LIDR_DOMAIN_PACK === "biometric"
      ? [...exampleFiles, ...BIOMETRIC_DOMAIN_PACK]
      : exampleFiles;

  const validationCases = [];

  for (const file of filesToCheck) {
    const filePath = join(examplesDir, file);
    if (existsSync(filePath)) {
      validationCases.push({
        file,
        rules: GENERATE_RF_RULES,
        description: `RF Generation Example: ${file}`,
      });
    }
  }

  if (validationCases.length === 0) {
    console.log("⚠️ No example files found to validate");
    console.log(`Expected files: ${filesToCheck.join(", ")}`);
    process.exit(0);
  }

  console.log("🔍 Validating Generate-RF Skill Examples...\n");

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
    console.log("\n🎉 All generate-RF examples are properly structured!");
    console.log("   Ready for functional requirements generation with BDD criteria.");
  } else {
    console.log("\n💡 Fix the validation errors to ensure comprehensive RF coverage.");
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
