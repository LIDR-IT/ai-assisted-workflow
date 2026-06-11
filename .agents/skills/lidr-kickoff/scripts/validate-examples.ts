#!/usr/bin/env tsx
/**
 * validate-examples.ts - Kickoff Skill Example Validator
 *
 * Validates that kickoff skill examples contain proper structure
 * for project initiation meetings and stakeholder alignment.
 *
 * Validates:
 * - Project header information and meeting logistics
 * - Stakeholder representation and team structure
 * - Scope definition with in/out/future scope clarity
 * - Timeline and milestone planning
 * - Risk identification and mitigation planning
 * - Communication and governance structure
 *
 * Usage: npx tsx scripts/validate-examples.ts
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/* ────────────────────────────────────────────────────────────────────
   VALIDATION RULES
──────────────────────────────────────────────────────────────────── */

interface ValidationRule {
  name: string;
  description: string;
  check: (content: string) => boolean;
  severity: "ERROR" | "WARN";
}

const MEETING_LOGISTICS_RULES: ValidationRule[] = [
  {
    name: "Meeting Header Information",
    description: "Must include project name, date, duration, and facilitator",
    check: (content) =>
      content.includes("Date") &&
      content.includes("Duration") &&
      content.includes("Facilitator") &&
      content.includes("Project"),
    severity: "ERROR",
  },
  {
    name: "Meeting Duration Specification",
    description: "Must specify meeting duration (ideally ≤90 minutes)",
    check: (content) => content.includes("90 minutes") || content.includes("Duration"),
    severity: "ERROR",
  },
  {
    name: "Project Code Format",
    description: "Must include project code in format like SDLC-XXX or PROJECT-XXX",
    check: (content) => {
      const projectCodePattern = /[A-Z]+-[0-9]+/;
      return projectCodePattern.test(content);
    },
    severity: "ERROR",
  },
];

const ATTENDEE_RULES: ValidationRule[] = [
  {
    name: "Attendee List Structure",
    description: "Must include structured attendee list with roles and responsibilities",
    check: (content) =>
      content.includes("Role") && content.includes("Name") && content.includes("Responsibilities"),
    severity: "ERROR",
  },
  {
    name: "Key Role Coverage",
    description: "Must include essential project roles (PME, PO, Tech Lead, QA, Security)",
    check: (content) => {
      const roles = ["PME", "Product Owner", "Tech Lead", "QA", "Security"];
      const foundRoles = roles.filter((role) => content.includes(role));
      return foundRoles.length >= 4;
    },
    severity: "ERROR",
  },
  {
    name: "Attendance Tracking",
    description: "Must track attendance with checkmarks or presence indicators",
    check: (content) => content.includes("✅") || content.includes("Present"),
    severity: "ERROR",
  },
  {
    name: "Role Responsibility Definition",
    description: "Must define clear responsibilities for each role",
    check: (content) =>
      content.includes("governance") ||
      content.includes("requirements") ||
      content.includes("architecture"),
    severity: "WARN",
  },
];

const SCOPE_DEFINITION_RULES: ValidationRule[] = [
  {
    name: "Scope Section Structure",
    description: "Must include In Scope, Out of Scope, and optionally Future Scope sections",
    check: (content) => content.includes("In Scope") && content.includes("Out of Scope"),
    severity: "ERROR",
  },
  {
    name: "Success Metrics Definition",
    description: "Must define measurable success criteria",
    check: (content) =>
      content.includes("Success") &&
      (content.includes("%") || content.includes("seconds") || content.includes("accuracy")),
    severity: "ERROR",
  },
  {
    name: "Clear Scope Boundaries",
    description: "Must clearly distinguish what is and is not included",
    check: (content) => content.includes("✅") && content.includes("❌"),
    severity: "ERROR",
  },
  {
    name: "Business Objective Alignment",
    description: "Must include business context and objectives",
    check: (content) =>
      content.includes("Objective") || content.includes("Business") || content.includes("Market"),
    severity: "ERROR",
  },
];

const TECHNICAL_ARCHITECTURE_RULES: ValidationRule[] = [
  {
    name: "Technical Architecture Section",
    description: "Must include technical architecture or technology stack information",
    check: (content) =>
      content.includes("Architecture") ||
      content.includes("Technology") ||
      content.includes("Integration"),
    severity: "ERROR",
  },
  {
    name: "Security Requirements",
    description: "Must address security requirements and compliance",
    check: (content) =>
      content.includes("Security") ||
      content.includes("GDPR") ||
      content.includes("encrypt") ||
      content.includes("compliance"),
    severity: "ERROR",
  },
  {
    name: "Integration Points",
    description: "Must identify key integration points and dependencies",
    check: (content) => content.includes("Integration") && content.includes("API"),
    severity: "WARN",
  },
];

const TIMELINE_MILESTONES_RULES: ValidationRule[] = [
  {
    name: "Timeline Structure",
    description: "Must include project timeline with phases or milestones",
    check: (content) => content.includes("Timeline") && content.includes("Phase"),
    severity: "ERROR",
  },
  {
    name: "Milestone Definition",
    description: "Must define key project milestones with dates",
    check: (content) => content.includes("Milestones") && content.includes("Week"),
    severity: "ERROR",
  },
  {
    name: "Phase-based Planning",
    description: "Must organize work into logical phases",
    check: (content) => {
      const phaseCount = (content.match(/Phase \d+:/g) || []).length;
      return phaseCount >= 2;
    },
    severity: "ERROR",
  },
  {
    name: "Deliverable Tracking",
    description: "Must track deliverables with checkboxes or completion status",
    check: (content) => content.includes("[ ]") && content.includes("-"),
    severity: "ERROR",
  },
];

const RISK_MANAGEMENT_RULES: ValidationRule[] = [
  {
    name: "Risk Assessment Section",
    description: "Must include risk assessment and mitigation planning",
    check: (content) => content.includes("Risk") && content.includes("Mitigation"),
    severity: "ERROR",
  },
  {
    name: "Risk Classification",
    description: "Must classify risks by probability and impact",
    check: (content) =>
      (content.includes("Probability") || content.includes("Impact")) &&
      (content.includes("High") || content.includes("Medium") || content.includes("Low")),
    severity: "ERROR",
  },
  {
    name: "Risk Categories",
    description: "Must cover multiple risk categories (technical, business, operational)",
    check: (content) => {
      const categories = ["Technical", "Business", "Operational"];
      const foundCategories = categories.filter((cat) => content.includes(cat));
      return foundCategories.length >= 2;
    },
    severity: "ERROR",
  },
  {
    name: "Mitigation Strategies",
    description: "Must provide specific mitigation strategies for identified risks",
    check: (content) => content.includes("Mitigation") && content.includes("|"),
    severity: "ERROR",
  },
];

const COMMUNICATION_GOVERNANCE_RULES: ValidationRule[] = [
  {
    name: "Communication Plan",
    description: "Must define communication plan and regular meetings",
    check: (content) => content.includes("Communication") && content.includes("Meetings"),
    severity: "ERROR",
  },
  {
    name: "Escalation Path",
    description: "Must define escalation paths for different types of issues",
    check: (content) => content.includes("Escalation") && content.includes("→"),
    severity: "ERROR",
  },
  {
    name: "Regular Reporting",
    description: "Must establish regular reporting and status update mechanisms",
    check: (content) =>
      content.includes("Reports") || content.includes("Status") || content.includes("Weekly"),
    severity: "WARN",
  },
];

const ACTION_ITEMS_RULES: ValidationRule[] = [
  {
    name: "Action Items Section",
    description: "Must include action items with owners and due dates",
    check: (content) =>
      content.includes("Action") && content.includes("Owner") && content.includes("Due"),
    severity: "ERROR",
  },
  {
    name: "SMART Action Items",
    description: "Action items must be specific, measurable, and time-bound",
    check: (content) => content.includes("2026-") && content.includes("|"),
    severity: "ERROR",
  },
  {
    name: "Action Status Tracking",
    description: "Must track action item status with indicators",
    check: (content) =>
      content.includes("🔄") || content.includes("📋") || content.includes("Status"),
    severity: "WARN",
  },
  {
    name: "Next Meeting Planning",
    description: "Must plan next meeting or checkpoint",
    check: (content) =>
      content.includes("Next Meeting") || (content.includes("Next") && content.includes("2026-")),
    severity: "ERROR",
  },
];

const ACCEPTANCE_CRITERIA_RULES: ValidationRule[] = [
  {
    name: "Success Criteria Definition",
    description: "Must define clear success criteria and acceptance criteria",
    check: (content) => content.includes("Success Criteria") || content.includes("Acceptance"),
    severity: "ERROR",
  },
  {
    name: "Technical Acceptance",
    description: "Must include technical acceptance criteria",
    check: (content) =>
      content.includes("Technical") && (content.includes("[ ]") || content.includes("accuracy")),
    severity: "ERROR",
  },
  {
    name: "Business Acceptance",
    description: "Must include business acceptance criteria",
    check: (content) => content.includes("Business") && content.includes("criteria"),
    severity: "WARN",
  },
  {
    name: "Quantitative Metrics",
    description: "Success criteria must include quantitative metrics",
    check: (content) => {
      const quantitative =
        content.includes("%") ||
        content.includes("<") ||
        content.includes(">") ||
        content.includes("seconds") ||
        content.includes("accuracy");
      return quantitative;
    },
    severity: "ERROR",
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
      file: "project-kickoff-output.md",
      rules: [
        ...MEETING_LOGISTICS_RULES,
        ...ATTENDEE_RULES,
        ...SCOPE_DEFINITION_RULES,
        ...TECHNICAL_ARCHITECTURE_RULES,
        ...TIMELINE_MILESTONES_RULES,
        ...RISK_MANAGEMENT_RULES,
        ...COMMUNICATION_GOVERNANCE_RULES,
        ...ACTION_ITEMS_RULES,
        ...ACCEPTANCE_CRITERIA_RULES,
      ],
      description: "Project Kickoff Meeting Output",
    },
  ];

  console.log("🔍 Validating Kickoff Skill Examples...\n");

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
    console.log("\n🎉 All kickoff examples are properly structured!");
    console.log("   Ready for project initiation and stakeholder alignment.");
  } else {
    console.log("\n💡 Fix the validation errors to ensure kickoff meeting success.");
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
