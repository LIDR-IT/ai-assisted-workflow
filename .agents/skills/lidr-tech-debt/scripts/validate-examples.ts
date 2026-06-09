#!/usr/bin/env tsx
/**
 * validate-examples.ts - Technical Debt Skill Example Validator
 *
 * Validates that tech-debt skill examples contain proper structure
 * for automated technical debt analysis and sprint planning.
 *
 * Validates:
 * - SonarQube analysis format with severity classification
 * - Technical debt registry with quadrant prioritization
 * - User stories with BDD criteria for debt resolution
 * - Required fields for automation integration
 *
 * Usage: npx tsx scripts/validate-examples.ts
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

/* ────────────────────────────────────────────────────────────────────
   VALIDATION RULES
──────────────────────────────────────────────────────────────────── */

interface ValidationRule {
  name: string;
  description: string;
  check: (content: string) => boolean;
  severity: "ERROR" | "WARN";
}

const SONARQUBE_RULES: ValidationRule[] = [
  {
    name: "Executive Summary Table",
    description: "Must contain severity categorization table (Critical|High|Medium|Low)",
    check: (content) =>
      content.includes("Critical") &&
      content.includes("High") &&
      content.includes("Medium") &&
      content.includes("Low") &&
      content.includes("Code Smell"),
    severity: "ERROR",
  },
  {
    name: "Top Critical Issues",
    description: "Must detail specific critical vulnerabilities and bugs",
    check: (content) =>
      content.includes("Critical Code Smells") && content.includes("Critical Bugs"),
    severity: "ERROR",
  },
  {
    name: "Business Impact Classification",
    description: "Must classify issues by business impact",
    check: (content) =>
      content.includes("Business Impact") && content.includes("User-facing Impact"),
    severity: "ERROR",
  },
  {
    name: "Priority Matrix",
    description: "Must include quadrant prioritization (DO FIRST, PLAN, etc.)",
    check: (content) =>
      content.includes("DO FIRST") && content.includes("PLAN") && content.includes("DEFER"),
    severity: "ERROR",
  },
];

const DEBT_REGISTRY_RULES: ValidationRule[] = [
  {
    name: "Debt Overview Table",
    description: "Must contain debt categorization with effort estimates",
    check: (content) =>
      content.includes("Category") &&
      content.includes("Items") &&
      content.includes("Effort (hours)") &&
      content.includes("Business Impact"),
    severity: "ERROR",
  },
  {
    name: "Critical Priority Section",
    description: "Must detail critical priority debt items",
    check: (content) =>
      content.includes("CRITICAL PRIORITY") && content.includes("Must fix next sprint"),
    severity: "ERROR",
  },
  {
    name: "Debt Item Structure",
    description: "Each debt item must have category, origin, impact, effort, assignee",
    check: (content) =>
      content.includes("Category**:") &&
      content.includes("Origin**:") &&
      content.includes("Business Impact**:") &&
      content.includes("Effort Estimate**:"),
    severity: "ERROR",
  },
  {
    name: "Sprint Capacity Planning",
    description: "Must include capacity allocation and metrics",
    check: (content) =>
      content.includes("Sprint Capacity Planning") && content.includes("Allocated Capacity"),
    severity: "ERROR",
  },
  {
    name: "Quadrant Classification",
    description: "Debt items must be classified by quadrant (DO FIRST, PLAN, OPPORTUNISTIC, DEFER)",
    check: (content) =>
      content.includes("Quadrant**: DO FIRST") ||
      content.includes("Quadrant**: PLAN") ||
      content.includes("Quadrant**: OPPORTUNISTIC"),
    severity: "ERROR",
  },
];

const USER_STORIES_RULES: ValidationRule[] = [
  {
    name: "User Story Format",
    description: 'Must follow "As a... I want... So that..." pattern',
    check: (content) =>
      content.includes("**As a**") &&
      content.includes("**I want**") &&
      content.includes("**So that**"),
    severity: "ERROR",
  },
  {
    name: "BDD Acceptance Criteria",
    description: "Must contain Given/When/Then scenarios in Gherkin format",
    check: (content) =>
      content.includes("```gherkin") &&
      content.includes("Given") &&
      content.includes("When") &&
      content.includes("Then"),
    severity: "ERROR",
  },
  {
    name: "Technical Tasks",
    description: "Must include checklist of technical implementation tasks",
    check: (content) => content.includes("Technical Tasks") && content.includes("- [ ]"),
    severity: "ERROR",
  },
  {
    name: "Definition of Done",
    description: "Must include DoD checklist for debt resolution",
    check: (content) => content.includes("Definition of Done") && content.includes("- [ ]"),
    severity: "ERROR",
  },
  {
    name: "Sprint Information",
    description: "Must include effort estimate, priority, and sprint assignment",
    check: (content) =>
      content.includes("**Effort**:") &&
      content.includes("**Priority**:") &&
      content.includes("**Sprint**:"),
    severity: "ERROR",
  },
  {
    name: "Security Focus",
    description: "For security debt, must reference compliance requirements",
    check: (content) =>
      content.includes("GDPR") || content.includes("security") || content.includes("compliance"),
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
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const examplesDir = join(scriptDir, "../examples");

  if (!existsSync(examplesDir)) {
    console.error("❌ Examples directory not found");
    process.exit(1);
  }

  const validationCases = [
    {
      file: "sonarqube-analysis-output.md",
      rules: SONARQUBE_RULES,
      description: "SonarQube Analysis Output Format",
    },
    {
      file: "technical-debt-registry.md",
      rules: DEBT_REGISTRY_RULES,
      description: "Technical Debt Registry Structure",
    },
    {
      file: "user-stories-debt-resolution.md",
      rules: USER_STORIES_RULES,
      description: "User Stories for Debt Resolution",
    },
  ];

  console.log("🔍 Validating Technical Debt Skill Examples...\n");

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
    console.log("\n🎉 All technical debt examples are properly structured!");
    console.log("   Ready for automated debt analysis and sprint planning.");
  } else {
    console.log("\n💡 Fix the validation errors to ensure automation compatibility.");
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
