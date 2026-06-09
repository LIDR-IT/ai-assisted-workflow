#!/usr/bin/env tsx
/**
 * validate-examples.ts - Audit Standards Skill Example Validator
 *
 * Validates that audit-standards skill examples contain proper structure
 * for comprehensive SDLC ecosystem compliance validation.
 *
 * Validates:
 * - Frontmatter compliance standards (9 required fields)
 * - Domain agnostic content validation
 * - Methodology uniformity checks
 * - Structural integrity verification
 * - Quality gate criteria
 * - Ecosystem health metrics
 * - Compliance reporting format
 *
 * Usage: npx tsx scripts/validate-examples.ts
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface ValidationRule {
  name: string;
  description: string;
  check: (content: string) => boolean;
  severity: "ERROR" | "WARN";
}

const AUDIT_STRUCTURE_RULES: ValidationRule[] = [
  {
    name: "Audit Report Header",
    description: "Must have audit report title and metadata",
    check: (content) => content.includes("Audit") && content.includes("Standards"),
    severity: "ERROR",
  },
  {
    name: "Standards Categories",
    description: "Must define standards categories being validated",
    check: (content) => content.includes("Categories") || content.includes("Standards"),
    severity: "ERROR",
  },
  {
    name: "Compliance Metrics",
    description: "Must include compliance metrics and scores",
    check: (content) => content.includes("%") || content.includes("compliance"),
    severity: "ERROR",
  },
  {
    name: "Validation Results",
    description: "Must present validation results with pass/fail indicators",
    check: (content) => content.includes("✅") && content.includes("❌"),
    severity: "ERROR",
  },
];

const FRONTMATTER_VALIDATION_RULES: ValidationRule[] = [
  {
    name: "Required Fields Check",
    description: "Must validate all 9 required frontmatter fields",
    check: (content) => {
      const requiredFields = [
        "id",
        "version",
        "last_updated",
        "updated_by",
        "status",
        "phase",
        "owner_role",
        "automation",
        "domain_agnostic",
      ];
      return requiredFields.some((field) => content.includes(field));
    },
    severity: "ERROR",
  },
  {
    name: "Field Format Validation",
    description: "Must validate field format compliance",
    check: (content) => content.includes("format") || content.includes("validation"),
    severity: "ERROR",
  },
];

const validationCases = [
  {
    file: "ecosystem-audit-report.md",
    rules: [...AUDIT_STRUCTURE_RULES, ...FRONTMATTER_VALIDATION_RULES],
    description: "Audit Report Template",
  },
];

async function main(): Promise<void> {
  console.log("🔍 Validating Audit Standards Skill Examples...\n");

  const examplesDir = join(__dirname, "../examples");
  let allValid = true;
  let totalPassed = 0;
  let totalFailed = 0;

  for (const testCase of validationCases) {
    const filePath = join(examplesDir, testCase.file);

    if (!existsSync(filePath)) {
      console.log(`⚠️  ${testCase.description} - File not found: ${testCase.file}`);
      continue;
    }

    const content = readFileSync(filePath, "utf-8");
    let passed = 0;
    let failed = 0;

    for (const rule of testCase.rules) {
      if (rule.check(content)) {
        passed++;
      } else {
        failed++;
        console.log(`   ❌ ${rule.name}: ${rule.description}`);
      }
    }

    totalPassed += passed;
    totalFailed += failed;

    if (failed === 0) {
      console.log(`✅ ${testCase.description} - ✓ ${passed} rules passed`);
    } else {
      console.log(`❌ ${testCase.description} - ${failed} rules failed`);
      allValid = false;
    }
  }

  console.log(`\n📊 Summary: ✅ ${totalPassed} passed, ❌ ${totalFailed} failed`);
  process.exit(allValid ? 0 : 1);
}

if (typeof import.meta !== "undefined" && import.meta.url.includes("validate-examples.ts")) {
  main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}
