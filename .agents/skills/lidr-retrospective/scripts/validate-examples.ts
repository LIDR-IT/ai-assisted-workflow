#!/usr/bin/env tsx
/**
 * validate-examples.ts - Retrospective Skill Example Validator
 *
 * Validates that retrospective skill examples contain proper structure
 * for data-driven retrospective analysis with metrics and action items.
 *
 * Validates:
 * - Sprint metrics analysis with quantified data
 * - What Went Well section with specific achievements
 * - What Didn't Go Well with root cause analysis
 * - Action items with owners and deadlines
 * - Team feedback and improvement suggestions
 *
 * Usage: npx tsx scripts/validate-examples.ts
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

const RETROSPECTIVE_STRUCTURE_RULES: ValidationRule[] = [
  {
    name: "Sprint Information",
    description: "Must contain sprint number, dates, and team information",
    check: (content) =>
      content.includes("Sprint") && content.includes("Date") && content.includes("Team"),
    severity: "ERROR",
  },
  {
    name: "Sprint Metrics Summary",
    description: "Must include quantified sprint metrics",
    check: (content) =>
      content.includes("Metrics") && (content.includes("Velocity") || content.includes("velocity")),
    severity: "ERROR",
  },
  {
    name: "What Went Well Section",
    description: "Must have positive achievements section",
    check: (content) =>
      content.includes("What Went Well") ||
      content.includes("Went Well") ||
      content.includes("Positive"),
    severity: "ERROR",
  },
  {
    name: "What Didn't Go Well Section",
    description: "Must identify problems and challenges",
    check: (content) =>
      content.includes("Didn't Go Well") ||
      content.includes("Problems") ||
      content.includes("Challenges"),
    severity: "ERROR",
  },
  {
    name: "Action Items",
    description: "Must include specific action items with owners",
    check: (content) => content.includes("Action Items") && content.includes("Owner"),
    severity: "ERROR",
  },
];

const METRICS_ANALYSIS_RULES: ValidationRule[] = [
  {
    name: "Velocity Tracking",
    description: "Must track velocity with historical comparison",
    check: (content) => content.includes("Velocity") && content.includes("points"),
    severity: "ERROR",
  },
  {
    name: "Bug Metrics",
    description: "Must include bug-related metrics",
    check: (content) =>
      content.includes("bugs") || content.includes("defects") || content.includes("Bug"),
    severity: "ERROR",
  },
  {
    name: "Commitment vs Delivery",
    description: "Must compare committed vs delivered work",
    check: (content) =>
      content.includes("committed") ||
      content.includes("delivered") ||
      content.includes("completion"),
    severity: "ERROR",
  },
  {
    name: "Quality Metrics",
    description: "Should include quality-related metrics",
    check: (content) =>
      content.includes("quality") || content.includes("test") || content.includes("coverage"),
    severity: "WARN",
  },
];

const ACTION_ITEMS_RULES: ValidationRule[] = [
  {
    name: "Specific Action Items",
    description: "Must have concrete, actionable items",
    check: (content) => content.includes("Action Items") && content.includes("-"),
    severity: "ERROR",
  },
  {
    name: "Action Item Owners",
    description: "Each action item must have assigned owner",
    check: (content) => content.includes("Owner:") || content.includes("Assigned:"),
    severity: "ERROR",
  },
  {
    name: "Action Item Deadlines",
    description: "Should include deadlines for action items",
    check: (content) =>
      content.includes("Due:") || content.includes("Deadline:") || content.includes("Target:"),
    severity: "WARN",
  },
  {
    name: "SMART Action Items",
    description: "Action items should be specific and measurable",
    check: (content) =>
      content.includes("improve") || content.includes("implement") || content.includes("reduce"),
    severity: "WARN",
  },
];

/* ────────────────────────────────────────────────────────────────────
   VALIDATION ENGINE & MAIN
──────────────────────────────────────────────────────────────────── */

interface ValidationResult {
  file: string;
  passed: number;
  failed: number;
  warnings: number;
  issues: Array<{ rule: string; severity: "ERROR" | "WARN"; description: string }>;
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
      if (rule.severity === "ERROR") result.failed++;
      else result.warnings++;
      result.issues.push({
        rule: rule.name,
        severity: rule.severity,
        description: rule.description,
      });
    }
  }
  return result;
}

async function main(): Promise<void> {
  const examplesDir = join(__dirname, "../examples");
  if (!existsSync(examplesDir)) {
    console.error("❌ Examples directory not found");
    process.exit(1);
  }

  const validationCases = [
    {
      file: "domains/biometric/sprint-24-biometric-team-retrospective.md",
      rules: [...RETROSPECTIVE_STRUCTURE_RULES, ...METRICS_ANALYSIS_RULES, ...ACTION_ITEMS_RULES],
      description: "Biometric Team Sprint Retrospective Structure",
    },
  ];

  console.log("🔍 Validating Retrospective Skill Examples...\n");

  let totalPassed = 0,
    totalFailed = 0,
    totalWarnings = 0,
    allValid = true;

  for (const testCase of validationCases) {
    const filePath = join(examplesDir, testCase.file);

    if (!existsSync(filePath)) {
      console.log(`❌ ${testCase.description}\n   File not found: ${testCase.file}\n`);
      allValid = false;
      continue;
    }

    const result = validateFile(filePath, testCase.rules);
    totalPassed += result.passed;
    totalFailed += result.failed;
    totalWarnings += result.warnings;

    if (result.failed === 0) {
      console.log(`✅ ${testCase.description}\n   ✓ ${result.passed} rules passed`);
      if (result.warnings > 0) console.log(`   ⚠️ ${result.warnings} warnings`);
      console.log();
    } else {
      console.log(
        `❌ ${testCase.description}\n   ✓ ${result.passed} rules passed\n   ❌ ${result.failed} rules failed`
      );
      if (result.warnings > 0) console.log(`   ⚠️ ${result.warnings} warnings`);
      for (const issue of result.issues) {
        const icon = issue.severity === "ERROR" ? "❌" : "⚠️";
        console.log(`   ${icon} ${issue.rule}: ${issue.description}`);
      }
      console.log();
      allValid = false;
    }
  }

  console.log("─".repeat(60));
  console.log(
    `📊 Validation Summary:\n   ✅ ${totalPassed} rules passed\n   ❌ ${totalFailed} rules failed\n   ⚠️ ${totalWarnings} warnings`
  );

  if (allValid) {
    console.log(
      "\n🎉 All Retrospective examples are properly structured!\n   Ready for data-driven sprint retrospective analysis."
    );
  } else {
    console.log("\n💡 Fix the validation errors to ensure effective retrospective meetings.");
  }

  process.exit(allValid ? 0 : 1);
}

if (typeof import.meta !== "undefined" && import.meta.url.endsWith("validate-examples.ts")) {
  main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}
