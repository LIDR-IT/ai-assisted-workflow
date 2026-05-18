#!/usr/bin/env tsx
/**
 * validate-examples.ts - Regression Suite Skill Example Validator
 *
 * Validates that regression-suite skill examples contain proper structure
 * for automated regression test selection and impact analysis.
 *
 * Validates:
 * - Change impact analysis with risk assessment
 * - File change mapping to test suites
 * - Test prioritization by risk level (P0/P1/P2)
 * - Execution plan with time estimates
 * - Risk assessment and dependency identification
 * - Automation coverage metrics
 *
 * Usage: npx tsx scripts/validate-examples.ts
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* ────────────────────────────────────────────────────────────────────
   VALIDATION RULES
──────────────────────────────────────────────────────────────────── */

interface ValidationRule {
  name: string;
  description: string;
  check: (content: string) => boolean;
  severity: "ERROR" | "WARN";
}

const IMPACT_ANALYSIS_RULES: ValidationRule[] = [
  {
    name: "Analysis Header Information",
    description: "Must contain project, date, change description, and analyst",
    check: (content) =>
      content.includes("**Project**:") &&
      content.includes("**Analysis Date**:") &&
      content.includes("**Change**:") &&
      content.includes("**Analyst**:"),
    severity: "ERROR",
  },
  {
    name: "Change Impact Summary Table",
    description: "Must include impact area summary with risk levels and test counts",
    check: (content) =>
      content.includes("## Change Impact Summary") &&
      content.includes("Impact Area | Risk Level | Tests Required | Priority"),
    severity: "ERROR",
  },
  {
    name: "Risk Level Classification",
    description: "Must classify risks as HIGH, MEDIUM, LOW, or CRITICAL",
    check: (content) =>
      content.includes("HIGH") &&
      content.includes("MEDIUM") &&
      (content.includes("LOW") || content.includes("CRITICAL")),
    severity: "ERROR",
  },
  {
    name: "Test Count and Execution Estimate",
    description: "Must specify total tests and estimated execution time",
    check: (content) => content.includes("Total Regression Tests") && content.includes("hours"),
    severity: "ERROR",
  },
  {
    name: "Automation Coverage Metric",
    description: "Must specify automation percentage for selected tests",
    check: (content) => content.includes("Automation Coverage") && content.includes("%"),
    severity: "ERROR",
  },
];

const FILE_CHANGE_MAPPING_RULES: ValidationRule[] = [
  {
    name: "Files Changed Analysis",
    description: "Must list specific files that changed with context",
    check: (content) =>
      content.includes("## Files Changed Analysis") && content.includes("Core Changes"),
    severity: "ERROR",
  },
  {
    name: "File Path Specification",
    description: "Must specify actual file paths and change types",
    check: (content) => content.includes("src/") && content.includes(".ts"),
    severity: "ERROR",
  },
  {
    name: "Test Impact Mapping",
    description: "Must map changed files to affected test suites",
    check: (content) =>
      content.includes("Test Impact Mapping") &&
      content.includes("Changed File | Affected Test Suites"),
    severity: "ERROR",
  },
  {
    name: "Configuration Changes",
    description: "Should identify configuration and infrastructure changes",
    check: (content) => content.includes("Configuration Changes") || content.includes("config/"),
    severity: "WARN",
  },
  {
    name: "Database Schema Impact",
    description: "Should identify database migrations and schema changes",
    check: (content) =>
      content.includes("migration") || content.includes("schema") || content.includes("database"),
    severity: "WARN",
  },
];

const TEST_SELECTION_RULES: ValidationRule[] = [
  {
    name: "Regression Test Selection Section",
    description: "Must have dedicated test selection section with priorities",
    check: (content) => content.includes("## Regression Test Selection") && content.includes("P0"),
    severity: "ERROR",
  },
  {
    name: "Priority Classification",
    description: "Must classify tests by priority (P0/P1/P2)",
    check: (content) => content.includes("P0") && content.includes("P1") && content.includes("P2"),
    severity: "ERROR",
  },
  {
    name: "Critical Path Tests",
    description: "Must identify critical path tests that must run",
    check: (content) => content.includes("Critical Path") || content.includes("Must Run"),
    severity: "ERROR",
  },
  {
    name: "Test File Specifications",
    description: "Must specify actual test file paths",
    check: (content) => content.includes("test/") && content.includes(".spec.ts"),
    severity: "ERROR",
  },
  {
    name: "Extended Coverage Tests",
    description: "Should include extended or optional test coverage",
    check: (content) => content.includes("Extended") || content.includes("Optional"),
    severity: "WARN",
  },
];

const RISK_ASSESSMENT_RULES: ValidationRule[] = [
  {
    name: "Risk Assessment Section",
    description: "Must include dedicated risk assessment section",
    check: (content) => content.includes("## Risk Assessment") && content.includes("HIGH RISK"),
    severity: "ERROR",
  },
  {
    name: "Risk Area Identification",
    description: "Must identify specific high-risk areas and explain why",
    check: (content) => content.includes("1.") && content.includes("2.") && content.includes("**"),
    severity: "ERROR",
  },
  {
    name: "Dependencies Identification",
    description: "Must identify dependencies that could affect testing",
    check: (content) => content.includes("Dependencies") || content.includes("depend"),
    severity: "ERROR",
  },
  {
    name: "Performance Impact Assessment",
    description: "Should assess performance impact of changes",
    check: (content) => content.includes("Performance") || content.includes("performance"),
    severity: "WARN",
  },
  {
    name: "Compliance Impact",
    description: "Should assess compliance and security impact",
    check: (content) =>
      content.includes("compliance") || content.includes("security") || content.includes("GDPR"),
    severity: "WARN",
  },
];

const EXECUTION_PLAN_RULES: ValidationRule[] = [
  {
    name: "Execution Plan Section",
    description: "Must include detailed execution plan with phases",
    check: (content) => content.includes("## Execution Plan") && content.includes("Phase"),
    severity: "ERROR",
  },
  {
    name: "Phased Execution Strategy",
    description: "Must define execution phases (smoke, core, extended)",
    check: (content) =>
      content.includes("Phase 1") && content.includes("Phase 2") && content.includes("Phase 3"),
    severity: "ERROR",
  },
  {
    name: "Time Estimates",
    description: "Must provide time estimates for each phase",
    check: (content) => content.includes("min") || content.includes("hours"),
    severity: "ERROR",
  },
  {
    name: "Total Execution Time",
    description: "Must specify total execution time",
    check: (content) => content.includes("Total") && content.includes("hours"),
    severity: "ERROR",
  },
  {
    name: "Manual vs Automated Split",
    description: "Should distinguish between automated and manual testing time",
    check: (content) => content.includes("automated") && content.includes("manual"),
    severity: "WARN",
  },
];

const BIOMETRIC_DOMAIN_RULES: ValidationRule[] = [
  {
    name: "Biometric Component Impact",
    description: "Should identify biometric-specific components affected",
    check: (content) =>
      content.includes("biometric") || content.includes("template") || content.includes("auth"),
    severity: "WARN",
  },
  {
    name: "Template Compatibility",
    description: "Should assess template compatibility and migration risks",
    check: (content) => content.includes("template") && content.includes("compatibility"),
    severity: "WARN",
  },
  {
    name: "Authentication Flow Impact",
    description: "Should assess impact on authentication workflows",
    check: (content) => content.includes("Authentication") || content.includes("auth"),
    severity: "WARN",
  },
  {
    name: "Encryption Impact Assessment",
    description: "Should assess encryption changes on biometric data",
    check: (content) => content.includes("encryption") || content.includes("Encryption"),
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

  const validationCases = [
    {
      file: "regression-impact-analysis.md",
      rules: [
        ...IMPACT_ANALYSIS_RULES,
        ...FILE_CHANGE_MAPPING_RULES,
        ...TEST_SELECTION_RULES,
        ...RISK_ASSESSMENT_RULES,
        ...EXECUTION_PLAN_RULES,
        ...BIOMETRIC_DOMAIN_RULES,
      ],
      description: "Regression Impact Analysis Structure",
    },
  ];

  console.log("🔍 Validating Regression Suite Skill Examples...\n");

  let totalPassed = 0;
  let totalFailed = 0;
  let totalWarnings = 0;
  let allValid = true;

  for (const testCase of validationCases) {
    const filePath = join(examplesDir, testCase.file);

    if (!existsSync(filePath)) {
      console.log(`❌ ${testCase.description}`);
      console.log(`   File not found: ${testCase.file}\n`);
      allValid = false;
      continue;
    }

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
    console.log("\n🎉 All Regression Suite examples are properly structured!");
    console.log("   Ready for automated regression test selection and impact analysis.");
  } else {
    console.log("\n💡 Fix the validation errors to ensure effective regression testing.");
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
