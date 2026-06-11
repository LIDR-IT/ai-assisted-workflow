#!/usr/bin/env tsx
/**
 * validate-examples.ts - Refinement Notes Skill Example Validator
 *
 * Validates that refinement-notes skill examples contain proper structure
 * for user story refinement during Sprint Planning.
 *
 * The DEFAULT validation set is 100% domain-agnostic (session metadata, user
 * story refinement structure, BDD/Gherkin acceptance criteria, estimation, DoR
 * checklist, dependencies). An overridable EXAMPLE industry pack (biometric
 * identity) is preserved below as the BIOMETRIC_DOMAIN_PACK_RULES constant and
 * is applied ONLY behind an explicit flag (`LIDR_DOMAIN_PACK=biometric`). It is
 * documentation/example only and is NOT part of the default behavior.
 *
 * Validates:
 * - Session metadata and participant information
 * - User story refinement structure
 * - BDD acceptance criteria scenarios
 * - Estimation and complexity assessment
 * - DoR checklist completion and dependencies
 * - Action items and readiness assessment
 *
 * Usage: npx tsx scripts/validate-examples.ts
 *        LIDR_DOMAIN_PACK=biometric npx tsx scripts/validate-examples.ts
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

const SESSION_METADATA_RULES: ValidationRule[] = [
  {
    name: "Session Header Information",
    description: "Must contain session date, sprint number, and participants",
    check: (content) =>
      content.includes("**Session Date**:") &&
      content.includes("**Sprint**:") &&
      content.includes("**Participants**:"),
    severity: "ERROR",
  },
  {
    name: "Product Owner and Scrum Master",
    description: "Must identify Product Owner and Scrum Master",
    check: (content) =>
      content.includes("**Product Owner**:") && content.includes("**Scrum Master**:"),
    severity: "ERROR",
  },
  {
    name: "Session Overview Section",
    description: "Must have session overview with focus area and objectives",
    check: (content) => content.includes("## Session Overview") && content.includes("Focus Area"),
    severity: "ERROR",
  },
  {
    name: "Epic Context",
    description: "Must reference the parent epic and business value",
    check: (content) => content.includes("Epic Context") && content.includes("Business Value"),
    severity: "ERROR",
  },
  {
    name: "Refinement Objectives",
    description: "Must list specific refinement objectives",
    check: (content) => content.includes("Refinement Objectives") && content.includes("1."),
    severity: "ERROR",
  },
];

const USER_STORY_REFINEMENT_RULES: ValidationRule[] = [
  {
    name: "User Stories Section",
    description: "Must have dedicated section for refined user stories",
    check: (content) =>
      content.includes("## User Stories Refined") || content.includes("## Stories Refined"),
    severity: "ERROR",
  },
  {
    name: "Story ID and Description",
    description: "Each story must have ID and initial description",
    check: (content) => content.includes("Initial Story Description") && content.includes('"As a'),
    severity: "ERROR",
  },
  {
    name: "Refinement Discussion",
    description: "Must capture team discussion and decision rationale",
    check: (content) => content.includes("Refinement Discussion") && content.includes("**"),
    severity: "ERROR",
  },
  {
    name: "Refined Acceptance Criteria",
    description: "Must include BDD scenarios in Gherkin format",
    check: (content) =>
      content.includes("Refined Acceptance Criteria") &&
      content.includes("```gherkin") &&
      content.includes("Given") &&
      content.includes("When") &&
      content.includes("Then"),
    severity: "ERROR",
  },
  {
    name: "Estimation and Complexity",
    description: "Must include effort estimation and complexity breakdown",
    check: (content) =>
      content.includes("Estimation") &&
      content.includes("Complexity") &&
      (content.includes("Story Points") || content.includes("hours")),
    severity: "ERROR",
  },
];

/* ────────────────────────────────────────────────────────────────────
   OVERRIDABLE EXAMPLE — biometric-identity industry pack (NOT DEFAULT).
   These rules are applied ONLY when LIDR_DOMAIN_PACK=biometric. They are
   documentation/example content showing how a domain pack layers extra,
   domain-specific checks (FAR/FRR, anti-spoofing, GDPR Art. 9) on top of the
   agnostic defaults. They are NOT spread into the default validation set.
──────────────────────────────────────────────────────────────────── */

const BIOMETRIC_DOMAIN_PACK_RULES: ValidationRule[] = [
  {
    name: "Biometric Considerations",
    description: "Must include biometric-specific technical considerations",
    check: (content) =>
      content.includes("Biometric-Specific Considerations") ||
      content.includes("Biometric Requirements"),
    severity: "ERROR",
  },
  {
    name: "Algorithm Accuracy Requirements",
    description: "Must specify FAR/FRR or accuracy thresholds",
    check: (content) =>
      content.includes("False Accept Rate") ||
      content.includes("False Reject Rate") ||
      content.includes("accuracy"),
    severity: "ERROR",
  },
  {
    name: "Performance Requirements",
    description: "Must specify response time and throughput requirements",
    check: (content) =>
      content.includes("seconds") || content.includes("ms") || content.includes("performance"),
    severity: "WARN",
  },
  {
    name: "GDPR Compliance Mention",
    description: "Must reference GDPR compliance for biometric data",
    check: (content) => content.includes("GDPR") && content.includes("Article 9"),
    severity: "ERROR",
  },
  {
    name: "Anti-Spoofing Considerations",
    description: "Should mention anti-spoofing or liveness detection",
    check: (content) =>
      content.includes("anti-spoofing") ||
      content.includes("liveness") ||
      content.includes("spoofing"),
    severity: "WARN",
  },
];

const DOMAIN_PACK_ENABLED = process.env.LIDR_DOMAIN_PACK === "biometric";

const DOR_DEPENDENCIES_RULES: ValidationRule[] = [
  {
    name: "Dependencies Section",
    description: "Must identify external and internal dependencies",
    check: (content) =>
      content.includes("Dependencies") &&
      (content.includes("External") || content.includes("Internal")),
    severity: "ERROR",
  },
  {
    name: "Definition of Ready Checklist",
    description: "Must include DoR checklist with checkboxes",
    check: (content) => content.includes("Definition of Ready") && content.includes("- [ ]"),
    severity: "ERROR",
  },
  {
    name: "Sprint Readiness Assessment",
    description: "Should indicate readiness status for sprint inclusion",
    check: (content) =>
      content.includes("sprint-ready") ||
      content.includes("ready") ||
      content.includes("Sprint Readiness"),
    severity: "WARN",
  },
  {
    name: "Blockers Identification",
    description: "Should identify any technical or compliance blockers",
    check: (content) =>
      content.includes("blocker") || content.includes("blocked") || content.includes("impediment"),
    severity: "WARN",
  },
  {
    name: "Action Items",
    description: "Should include specific action items with owners",
    check: (content) => content.includes("Action Items") || content.includes("Next Steps"),
    severity: "WARN",
  },
];

const BDD_SCENARIOS_RULES: ValidationRule[] = [
  {
    name: "Gherkin Syntax Compliance",
    description: "BDD scenarios must follow proper Gherkin syntax",
    check: (content) =>
      content.includes("Given") &&
      content.includes("When") &&
      content.includes("Then") &&
      content.includes("And"),
    severity: "ERROR",
  },
  {
    name: "Concrete Test Data",
    description: "Scenarios should include specific test values and thresholds",
    check: (content) =>
      content.includes("%") || content.includes("seconds") || content.includes("≥"),
    severity: "WARN",
  },
  {
    name: "Multiple Scenarios",
    description: "Should include both happy path and error scenarios",
    check: (content) =>
      content.includes("happy") || content.includes("error") || content.includes("fail"),
    severity: "WARN",
  },
  {
    name: "Domain Scenario Context",
    description: "Scenarios should be grounded in concrete domain workflows/entities",
    check: (content) =>
      content.includes("workflow") ||
      content.includes("scenario") ||
      content.includes("validation") ||
      content.includes("process"),
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

  // DEFAULT (domain-agnostic) rule sets applied to every refinement-notes example.
  const DEFAULT_REFINEMENT_RULES = [
    ...SESSION_METADATA_RULES,
    ...USER_STORY_REFINEMENT_RULES,
    ...DOR_DEPENDENCIES_RULES,
    ...BDD_SCENARIOS_RULES,
  ];

  // Optional biometric domain pack — appended ONLY when LIDR_DOMAIN_PACK=biometric.
  const domainExampleRules = DOMAIN_PACK_ENABLED
    ? [...DEFAULT_REFINEMENT_RULES, ...BIOMETRIC_DOMAIN_PACK_RULES]
    : DEFAULT_REFINEMENT_RULES;

  const validationCases = [
    {
      file: "domains/biometric/voice-biometric-v3-refinement-session.md",
      rules: domainExampleRules,
      description: "Voice Refinement Session Structure (biometric example fixture)",
    },
    {
      file: "domains/biometric/selphid-nfc-enhancement-backlog-grooming.md",
      rules: DOMAIN_PACK_ENABLED
        ? [
            ...SESSION_METADATA_RULES,
            ...USER_STORY_REFINEMENT_RULES,
            ...DOR_DEPENDENCIES_RULES,
            ...BIOMETRIC_DOMAIN_PACK_RULES,
          ]
        : [...SESSION_METADATA_RULES, ...USER_STORY_REFINEMENT_RULES, ...DOR_DEPENDENCIES_RULES],
      description: "NFC Enhancement Backlog Grooming Structure (biometric example fixture)",
    },
    {
      file: "generic/refinement-notes-template.md",
      rules: [...SESSION_METADATA_RULES, ...USER_STORY_REFINEMENT_RULES, ...DOR_DEPENDENCIES_RULES],
      description: "Generic Refinement Notes Template Structure",
    },
  ];

  console.log("🔍 Validating Refinement Notes Skill Examples...\n");
  if (DOMAIN_PACK_ENABLED) {
    console.log("ℹ️  LIDR_DOMAIN_PACK=biometric — applying optional biometric domain rules.\n");
  }

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
    console.log("\n🎉 All Refinement Notes examples are properly structured!");
    console.log("   Ready for user story refinement and sprint planning.");
  } else {
    console.log("\n💡 Fix the validation errors to ensure effective backlog grooming.");
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
