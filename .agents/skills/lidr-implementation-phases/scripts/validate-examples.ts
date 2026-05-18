#!/usr/bin/env tsx
/**
 * validate-examples.ts - Implementation Phases Skill Example Validator
 *
 * Validates that implementation-phases skill examples contain proper structure
 * for incremental project delivery with phased milestones and risk management.
 *
 * Validates:
 * - Phase decomposition strategy and justification
 * - Milestone structure with clear success criteria
 * - Risk management per phase with mitigation strategies
 * - Team assignment and capacity allocation
 * - Dependencies and exit criteria for each phase
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

const PROJECT_METADATA_RULES: ValidationRule[] = [
  {
    name: "Project Header Information",
    description: "Must include project name, planning date, total effort, team size",
    check: (content) =>
      content.includes("**Project**:") &&
      content.includes("**Planning Date**:") &&
      content.includes("**Total Effort**:") &&
      content.includes("**Team Size**:"),
    severity: "ERROR",
  },
  {
    name: "Risk Level Assessment",
    description: "Must include risk level classification (Low, Medium, High)",
    check: (content) =>
      content.includes("**Risk Level**:") &&
      (content.includes("Low") || content.includes("Medium") || content.includes("High")),
    severity: "ERROR",
  },
  {
    name: "Implementation Strategy",
    description: "Must document phase decomposition strategy with approach explanation",
    check: (content) =>
      content.includes("Phase Decomposition Strategy") &&
      content.includes("Incremental Delivery Approach"),
    severity: "ERROR",
  },
];

const PHASE_STRUCTURE_RULES: ValidationRule[] = [
  {
    name: "Phase Numbering",
    description: "Must have numbered phases (Phase 1, Phase 2, etc.)",
    check: (content) => content.includes("Phase 1:") && content.includes("Phase 2:"),
    severity: "ERROR",
  },
  {
    name: "Phase Goals",
    description: "Each phase must have clear goal statement",
    check: (content) => content.includes("**Goal**:"),
    severity: "ERROR",
  },
  {
    name: "Team Focus Assignment",
    description: "Each phase must specify team focus area",
    check: (content) => content.includes("**Team Focus**:"),
    severity: "ERROR",
  },
  {
    name: "Phase Deliverables",
    description: "Each phase must specify concrete deliverables",
    check: (content) => content.includes("**Deliverables**:") || content.includes("Deliverables"),
    severity: "ERROR",
  },
  {
    name: "Exit Criteria",
    description: "Each phase must have measurable exit criteria",
    check: (content) => content.includes("Exit Criteria") && content.includes("✅"),
    severity: "ERROR",
  },
];

const MILESTONE_RULES: ValidationRule[] = [
  {
    name: "Milestone Table Structure",
    description:
      "Must include milestone table with Milestone, Week, Owner, Success Criteria columns",
    check: (content) =>
      content.includes("| Milestone | Week | Owner | Success Criteria |") ||
      (content.includes("Milestone") && content.includes("Week") && content.includes("Owner")),
    severity: "ERROR",
  },
  {
    name: "Milestone Timing",
    description: "Milestones must specify week numbers or timeframes",
    check: (content) =>
      content.includes("Week") && (content.includes("1") || content.includes("2")),
    severity: "ERROR",
  },
  {
    name: "Milestone Ownership",
    description: "Each milestone must have assigned owner",
    check: (content) =>
      content.includes("Lead") || content.includes("Team") || content.includes("Dev"),
    severity: "ERROR",
  },
  {
    name: "Success Criteria Definition",
    description: "Milestones must have measurable success criteria",
    check: (content) => content.includes("Success Criteria") && content.includes("|"),
    severity: "ERROR",
  },
];

const TECHNICAL_TASK_RULES: ValidationRule[] = [
  {
    name: "Technical Task Lists",
    description: "Must include technical task checklists for each phase",
    check: (content) => content.includes("Technical Tasks") && content.includes("- [ ]"),
    severity: "ERROR",
  },
  {
    name: "Task Specificity",
    description: "Technical tasks must be specific and actionable",
    check: (content) => {
      const taskMatches = content.match(/- \[ \] .+/g) || [];
      const specificTasks = taskMatches.filter(
        (task) =>
          task.includes("implement") ||
          task.includes("setup") ||
          task.includes("integration") ||
          task.includes("testing") ||
          task.includes("configuration")
      );
      return specificTasks.length >= 3;
    },
    severity: "ERROR",
  },
  {
    name: "Implementation Coverage",
    description: "Tasks must cover key implementation areas (backend, frontend, testing, security)",
    check: (content) => {
      const areas = ["backend", "frontend", "mobile", "api", "testing", "security", "database"];
      const foundAreas = areas.filter((area) => content.toLowerCase().includes(area));
      return foundAreas.length >= 3;
    },
    severity: "ERROR",
  },
];

const RISK_MANAGEMENT_RULES: ValidationRule[] = [
  {
    name: "Risk Management Section",
    description: "Must include risk management section with per-phase analysis",
    check: (content) =>
      content.includes("Risk Management") && content.includes("Phase") && content.includes("Risks"),
    severity: "ERROR",
  },
  {
    name: "Risk Classification",
    description: "Risks must be classified by severity (High, Medium, Low)",
    check: (content) =>
      content.includes("High") && content.includes("Medium") && content.includes("Low"),
    severity: "ERROR",
  },
  {
    name: "Risk Mitigation",
    description: "Must include mitigation strategies for identified risks",
    check: (content) => content.includes("Mitigation") && content.includes(":"),
    severity: "ERROR",
  },
  {
    name: "Risk Checkpoints",
    description: "Must define risk checkpoints within phases",
    check: (content) => content.includes("Risk Checkpoints") || content.includes("Checkpoint"),
    severity: "WARN",
  },
];

const DEPENDENCY_RULES: ValidationRule[] = [
  {
    name: "Dependency Tracking",
    description: "Must track dependencies between phases and external systems",
    check: (content) => content.includes("Dependencies") && content.includes("Phase"),
    severity: "ERROR",
  },
  {
    name: "External Dependencies",
    description: "Must identify external dependencies that could impact timeline",
    check: (content) => content.includes("External") && content.includes(":"),
    severity: "WARN",
  },
  {
    name: "Parallel Work Streams",
    description: "Must document parallel work streams for efficiency",
    check: (content) => content.includes("Parallel Work Streams") && content.includes("Stream"),
    severity: "WARN",
  },
];

const TEAM_CAPACITY_RULES: ValidationRule[] = [
  {
    name: "Team Assignment Table",
    description: "Must include team assignment and capacity allocation table",
    check: (content) =>
      content.includes("Team Assignments") &&
      content.includes("Capacity") &&
      content.includes("Role"),
    severity: "ERROR",
  },
  {
    name: "Capacity Percentages",
    description: "Must specify capacity allocation percentages for team members",
    check: (content) => content.includes("%") && content.includes("|"),
    severity: "ERROR",
  },
  {
    name: "Role Coverage",
    description: "Must cover key roles (Dev, QA, DevOps, Lead)",
    check: (content) => {
      const roles = ["Dev", "QA", "DevOps", "Lead"];
      const foundRoles = roles.filter((role) => content.includes(role));
      return foundRoles.length >= 3;
    },
    severity: "ERROR",
  },
];

const SUCCESS_METRICS_RULES: ValidationRule[] = [
  {
    name: "Success Metrics Section",
    description: "Must define success metrics for each phase",
    check: (content) => content.includes("Success Metrics") && content.includes("Phase"),
    severity: "ERROR",
  },
  {
    name: "Quantitative Metrics",
    description: "Metrics must be quantitative and measurable",
    check: (content) => {
      const quantitative =
        content.includes("%") ||
        content.includes("<") ||
        content.includes(">") ||
        content.includes("seconds") ||
        content.includes("users") ||
        content.includes("score");
      return quantitative;
    },
    severity: "ERROR",
  },
  {
    name: "Performance Targets",
    description: "Must include performance and quality targets",
    check: (content) =>
      (content.includes("performance") || content.includes("Performance")) &&
      (content.includes("response time") ||
        content.includes("uptime") ||
        content.includes("accuracy")),
    severity: "ERROR",
  },
];

const CHECKPOINT_RULES: ValidationRule[] = [
  {
    name: "Checkpoint Reviews",
    description: "Must define checkpoint reviews and go/no-go decisions",
    check: (content) => content.includes("Checkpoint Reviews") && content.includes("Review"),
    severity: "ERROR",
  },
  {
    name: "Go/No-Go Decisions",
    description: "Must include go/no-go decision points",
    check: (content) => content.includes("Go/No-Go") || content.includes("decision"),
    severity: "WARN",
  },
  {
    name: "Review Frequency",
    description: "Must specify review frequency and schedule",
    check: (content) =>
      content.includes("Weekly") || content.includes("Monthly") || content.includes("review"),
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
      file: "phase-decomposition-plan.md",
      rules: [
        ...PROJECT_METADATA_RULES,
        ...PHASE_STRUCTURE_RULES,
        ...MILESTONE_RULES,
        ...TECHNICAL_TASK_RULES,
        ...RISK_MANAGEMENT_RULES,
        ...DEPENDENCY_RULES,
        ...TEAM_CAPACITY_RULES,
        ...SUCCESS_METRICS_RULES,
        ...CHECKPOINT_RULES,
      ],
      description: "Implementation Phases Decomposition Plan",
    },
  ];

  console.log("🔍 Validating Implementation Phases Skill Examples...\n");

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
    console.log("\n🎉 All implementation phases examples are properly structured!");
    console.log("   Ready for incremental delivery planning and risk management.");
  } else {
    console.log("\n💡 Fix the validation errors to ensure phased delivery success.");
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
