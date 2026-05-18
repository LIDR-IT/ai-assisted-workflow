#!/usr/bin/env tsx
/**
 * validate-examples.ts - Epic Breakdown Skill Example Validator
 *
 * Validates that epic-breakdown skill examples contain proper structure
 * for decomposing master epics into feature-level sub-epics.
 *
 * Validates:
 * - Epic hierarchy structure with master and sub-epics
 * - Feature-level decomposition with clear boundaries
 * - Dependencies mapping and critical path analysis
 * - Sprint planning readiness with proper sizing
 * - Risk assessment and mitigation strategies
 * - Team assignment and capacity alignment
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

const EPIC_BREAKDOWN_RULES: ValidationRule[] = [
  {
    name: "Epic Hierarchy Structure",
    description: "Must contain clear epic hierarchy with master epic and sub-epics",
    check: (content) =>
      content.includes("epic hierarchy") ||
      (content.includes("master epic") && content.includes("sub-epic")),
    severity: "ERROR",
  },
  {
    name: "Feature-Level Decomposition",
    description: "Must decompose epics at feature level with clear functional boundaries",
    check: (content) => content.includes("feature") && content.includes("decomposition"),
    severity: "ERROR",
  },
  {
    name: "Dependencies Mapping",
    description: "Must map dependencies between epics and external systems",
    check: (content) => content.includes("dependencies") && content.includes("mapping"),
    severity: "ERROR",
  },
  {
    name: "Sprint Planning Readiness",
    description: "Must ensure epics are sized appropriately for sprint planning",
    check: (content) => content.includes("sprint") && content.includes("planning"),
    severity: "ERROR",
  },
  {
    name: "Effort Estimation",
    description: "Must include effort estimation for each epic component",
    check: (content) => content.includes("effort") && content.includes("estimation"),
    severity: "ERROR",
  },
  {
    name: "Acceptance Criteria",
    description: "Must define clear acceptance criteria for each sub-epic",
    check: (content) => content.includes("acceptance criteria") && content.includes("Given"),
    severity: "ERROR",
  },
  {
    name: "Team Assignment Strategy",
    description: "Must consider team capabilities and assignment strategies",
    check: (content) => content.includes("team") && content.includes("assignment"),
    severity: "ERROR",
  },
  {
    name: "Risk Assessment",
    description: "Must assess risks at epic level with mitigation strategies",
    check: (content) => content.includes("risk") && content.includes("mitigation"),
    severity: "ERROR",
  },
  {
    name: "Critical Path Analysis",
    description: "Must identify critical path and potential bottlenecks",
    check: (content) => content.includes("critical path") || content.includes("bottleneck"),
    severity: "WARN",
  },
  {
    name: "Value Stream Mapping",
    description: "Must map value delivery across epic components",
    check: (content) =>
      content.includes("value") && (content.includes("stream") || content.includes("delivery")),
    severity: "WARN",
  },
  {
    name: "Technical Architecture Alignment",
    description: "Must align epic breakdown with technical architecture boundaries",
    check: (content) => content.includes("technical") && content.includes("architecture"),
    severity: "ERROR",
  },
  {
    name: "Business Value Prioritization",
    description: "Must prioritize epics based on business value delivery",
    check: (content) => content.includes("business value") && content.includes("priorit"),
    severity: "ERROR",
  },
  {
    name: "Definition of Done",
    description: "Must define completion criteria for each epic level",
    check: (content) =>
      content.includes("Definition of Done") || content.includes("completion criteria"),
    severity: "ERROR",
  },
  {
    name: "User Story Readiness",
    description: "Must ensure epics are ready for user story decomposition",
    check: (content) => content.includes("user story") && content.includes("ready"),
    severity: "ERROR",
  },
  {
    name: "Integration Points",
    description: "Must identify integration points and external interfaces",
    check: (content) => content.includes("integration") && content.includes("interface"),
    severity: "WARN",
  },
  {
    name: "Testing Strategy Alignment",
    description: "Must align with overall testing strategy and QA approach",
    check: (content) => content.includes("testing") && content.includes("strategy"),
    severity: "WARN",
  },
  {
    name: "Release Planning Impact",
    description: "Must consider impact on release planning and delivery milestones",
    check: (content) => content.includes("release") && content.includes("milestone"),
    severity: "WARN",
  },
  {
    name: "Stakeholder Communication",
    description: "Must include stakeholder communication and approval processes",
    check: (content) => content.includes("stakeholder") && content.includes("communication"),
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

  // Look for example files in the directory
  const exampleFiles = [
    "biometric-platform-epic-breakdown.md",
    "identity-verification-epic-structure.md",
  ];
  const validationCases = [];

  for (const file of exampleFiles) {
    const filePath = join(examplesDir, file);
    if (existsSync(filePath)) {
      validationCases.push({
        file,
        rules: EPIC_BREAKDOWN_RULES,
        description: `Epic Breakdown Example: ${file}`,
      });
    }
  }

  if (validationCases.length === 0) {
    console.log("⚠️ No example files found to validate");
    console.log(
      "Expected files: biometric-platform-epic-breakdown.md, identity-verification-epic-structure.md"
    );
    process.exit(0);
  }

  console.log("🔍 Validating Epic-Breakdown Skill Examples...\n");

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
    console.log("\n🎉 All epic breakdown examples are properly structured!");
    console.log("   Ready for Phase 3→4 transition and sprint planning success.");
  } else {
    console.log("\n💡 Fix the validation errors to ensure actionable epic decomposition.");
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
