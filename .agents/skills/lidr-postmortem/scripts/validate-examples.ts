#!/usr/bin/env tsx
/**
 * validate-examples.ts - Postmortem Skill Example Validator
 *
 * Validates that postmortem skill examples contain proper structure
 * for incident analysis and blameless retrospective documentation.
 *
 * Validates:
 * - Incident summary with timeline and impact
 * - Five Whys root cause analysis
 * - Blameless culture and systemic focus
 * - Action items with owners and timelines
 * - Prevention strategies and lessons learned
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

const INCIDENT_SUMMARY_RULES: ValidationRule[] = [
  {
    name: "Incident Summary",
    description: "Must include incident summary with clear description",
    check: (content) => content.includes("Summary") && content.includes("Incident"),
    severity: "ERROR",
  },
  {
    name: "Timeline Documentation",
    description: "Must include detailed timeline of events",
    check: (content) => content.includes("Timeline") && content.includes("UTC"),
    severity: "ERROR",
  },
  {
    name: "Impact Assessment",
    description: "Must document impact on users, systems, and business",
    check: (content) =>
      content.includes("Impact") && (content.includes("users") || content.includes("systems")),
    severity: "ERROR",
  },
  {
    name: "Duration and Detection",
    description: "Must specify incident duration and detection time",
    check: (content) => content.includes("Duration") && content.includes("Detected"),
    severity: "ERROR",
  },
];

const ROOT_CAUSE_ANALYSIS_RULES: ValidationRule[] = [
  {
    name: "Five Whys Analysis",
    description: "Must include Five Whys root cause analysis",
    check: (content) => content.includes("Five Whys") && content.includes("Why"),
    severity: "ERROR",
  },
  {
    name: "Root Cause Identification",
    description: "Must identify specific root cause(s)",
    check: (content) => content.includes("Root Cause") || content.includes("Root cause"),
    severity: "ERROR",
  },
  {
    name: "Contributing Factors",
    description: "Must identify contributing factors beyond immediate cause",
    check: (content) => content.includes("Contributing") && content.includes("Factors"),
    severity: "ERROR",
  },
  {
    name: "Systemic Issues",
    description: "Must address systemic issues and process failures",
    check: (content) => content.includes("Systemic") || content.includes("Process"),
    severity: "WARN",
  },
];

const BLAMELESS_CULTURE_RULES: ValidationRule[] = [
  {
    name: "Blameless Language",
    description: "Must use blameless language focused on systems, not individuals",
    check: (content) => {
      const blameWords = ["fault", "blame", "mistake", "error by", "failed to"];
      const blameCount = blameWords.filter((word) => content.toLowerCase().includes(word)).length;
      return blameCount <= 2; // Allow minimal usage in context
    },
    severity: "WARN",
  },
  {
    name: "System Focus",
    description: "Must focus on system improvements rather than individual actions",
    check: (content) =>
      content.includes("system") || content.includes("process") || content.includes("procedure"),
    severity: "ERROR",
  },
  {
    name: "Learning Culture",
    description: "Must emphasize learning and improvement over punishment",
    check: (content) =>
      content.includes("learn") || content.includes("improve") || content.includes("prevent"),
    severity: "WARN",
  },
];

const ACTION_ITEMS_RULES: ValidationRule[] = [
  {
    name: "Action Items Section",
    description: "Must include concrete action items for improvement",
    check: (content) => content.includes("Action") && content.includes("Items"),
    severity: "ERROR",
  },
  {
    name: "SMART Action Items",
    description: "Action items must be specific, measurable, and time-bound",
    check: (content) => {
      const hasOwners = content.includes("Owner") || content.includes("Assigned");
      const hasDeadlines =
        content.includes("deadline") || content.includes("by ") || content.includes("2026-");
      return hasOwners && hasDeadlines;
    },
    severity: "ERROR",
  },
  {
    name: "Preventive Actions",
    description: "Must include actions to prevent similar incidents",
    check: (content) => content.includes("Prevent") || content.includes("Prevention"),
    severity: "ERROR",
  },
  {
    name: "Detection Improvements",
    description: "Must include actions to improve incident detection",
    check: (content) =>
      content.includes("Detection") || content.includes("Monitoring") || content.includes("Alert"),
    severity: "WARN",
  },
];

const LESSONS_LEARNED_RULES: ValidationRule[] = [
  {
    name: "Lessons Learned Section",
    description: "Must include lessons learned section",
    check: (content) => content.includes("Lessons") && content.includes("Learned"),
    severity: "ERROR",
  },
  {
    name: "What Went Well",
    description: "Must document what went well during incident response",
    check: (content) => content.includes("What went well") || content.includes("What worked"),
    severity: "WARN",
  },
  {
    name: "Areas for Improvement",
    description: "Must identify areas for improvement in processes",
    check: (content) => content.includes("Improvement") || content.includes("Areas for"),
    severity: "ERROR",
  },
  {
    name: "Knowledge Sharing",
    description: "Must address knowledge sharing and documentation gaps",
    check: (content) => content.includes("Knowledge") || content.includes("Documentation"),
    severity: "WARN",
  },
];

const FOLLOW_UP_RULES: ValidationRule[] = [
  {
    name: "Follow-up Plan",
    description: "Must include follow-up plan and review schedule",
    check: (content) =>
      content.includes("Follow") && (content.includes("up") || content.includes("Review")),
    severity: "ERROR",
  },
  {
    name: "Success Metrics",
    description: "Must define metrics to measure improvement success",
    check: (content) => content.includes("Metrics") || content.includes("Measure"),
    severity: "WARN",
  },
];

const ALL_RULES = [
  ...INCIDENT_SUMMARY_RULES,
  ...ROOT_CAUSE_ANALYSIS_RULES,
  ...BLAMELESS_CULTURE_RULES,
  ...ACTION_ITEMS_RULES,
  ...LESSONS_LEARNED_RULES,
  ...FOLLOW_UP_RULES,
];

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

async function main(): Promise<void> {
  const examplesDir = join(__dirname, "../examples");

  if (!existsSync(examplesDir)) {
    console.error("❌ Examples directory not found");
    process.exit(1);
  }

  // Check for different directory structures
  const biometricDir = join(examplesDir, "domains", "biometric");
  const genericDir = join(examplesDir, "generic");

  const validationCases = [];

  if (existsSync(biometricDir)) {
    validationCases.push(
      {
        file: "domains/biometric/platform-outage-march-2024.md",
        rules: ALL_RULES,
        description: "Biometric Platform Outage Postmortem",
      },
      {
        file: "domains/biometric/data-breach-security-incident.md",
        rules: ALL_RULES,
        description: "Data Breach Security Incident Postmortem",
      }
    );
  }

  if (existsSync(genericDir)) {
    validationCases.push({
      file: "generic/postmortem-template.md",
      rules: ALL_RULES,
      description: "Generic Postmortem Template",
    });
  }

  // If no specific directories, look for files directly
  if (validationCases.length === 0) {
    const directFiles = [
      "platform-outage-march-2024.md",
      "data-breach-security-incident.md",
      "postmortem-template.md",
    ];
    for (const file of directFiles) {
      if (existsSync(join(examplesDir, file))) {
        validationCases.push({
          file,
          rules: ALL_RULES,
          description: `Postmortem Example: ${file}`,
        });
      }
    }
  }

  if (validationCases.length === 0) {
    console.error("❌ No valid example files found");
    process.exit(1);
  }

  console.log("🔍 Validating Postmortem Skill Examples...\n");

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

  console.log("─".repeat(60));
  console.log(`📊 Validation Summary:`);
  console.log(`   ✅ ${totalPassed} rules passed`);
  console.log(`   ❌ ${totalFailed} rules failed`);
  console.log(`   ⚠️ ${totalWarnings} warnings`);

  if (allValid) {
    console.log("\n🎉 All postmortem examples are properly structured!");
    console.log("   Ready for blameless incident analysis and improvement.");
  } else {
    console.log("\n💡 Fix the validation errors to ensure postmortem quality.");
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
