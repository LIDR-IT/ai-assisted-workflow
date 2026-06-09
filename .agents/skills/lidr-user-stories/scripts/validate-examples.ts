#!/usr/bin/env tsx
/**
 * validate-examples.ts - User Stories Skill Example Validator
 *
 * Validates that user-stories skill examples contain proper structure
 * for automated user story generation with BDD acceptance criteria.
 *
 * Validates:
 * - User story format (As a...I want...So that...)
 * - BDD acceptance criteria with Gherkin syntax
 * - Technical tasks and Definition of Done
 * - Sprint information and effort estimation
 * - INVEST principles compliance
 * - Biometric domain-specific requirements
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

const USER_STORY_FORMAT_RULES: ValidationRule[] = [
  {
    name: "User Story Template Format",
    description: 'Must follow "Como...Quiero...Para..." or "As a...I want...So that..." format',
    check: (content) =>
      (content.includes("**Como**") &&
        content.includes("**Quiero**") &&
        content.includes("**Para**")) ||
      (content.includes("**As a**") &&
        content.includes("**I want**") &&
        content.includes("**So that**")),
    severity: "ERROR",
  },
  {
    name: "Epic and RF References",
    description: "Must reference Epic and RF (Functional Requirements)",
    check: (content) => content.includes("Epic") && content.includes("RF"),
    severity: "ERROR",
  },
  {
    name: "Story Details Section",
    description: "Must contain story details with priority, estimation, and dependencies",
    check: (content) =>
      content.includes("Story Details") &&
      content.includes("Priority") &&
      content.includes("Estimation"),
    severity: "ERROR",
  },
  {
    name: "Sprint Assignment",
    description: "Must include sprint assignment information",
    check: (content) =>
      content.includes("Sprint") &&
      (content.includes("Sprint ") || content.includes("Planificado")),
    severity: "ERROR",
  },
];

const BDD_ACCEPTANCE_CRITERIA_RULES: ValidationRule[] = [
  {
    name: "Gherkin Format",
    description: "Must contain BDD acceptance criteria in Gherkin format",
    check: (content) => content.includes("```gherkin") && content.includes("Scenario"),
    severity: "ERROR",
  },
  {
    name: "Given-When-Then Structure",
    description: "Must use proper Given-When-Then structure in scenarios",
    check: (content) =>
      content.includes("Given") && content.includes("When") && content.includes("Then"),
    severity: "ERROR",
  },
  {
    name: "Multiple Scenarios",
    description: "Should contain multiple scenarios covering different paths",
    check: (content) => (content.match(/Scenario:/g) || []).length >= 2,
    severity: "WARN",
  },
  {
    name: "Data Tables in Gherkin",
    description: "Should use data tables for structured test data",
    check: (content) =>
      (content.includes("|") && content.includes("Condición")) || content.includes("| Condition |"),
    severity: "WARN",
  },
  {
    name: "Spanish Context Adaptation",
    description: "For Spanish projects, must use Spanish Gherkin keywords appropriately",
    check: (content) =>
      content.includes("Dado") ||
      content.includes("Cuando") ||
      content.includes("Entonces") ||
      content.includes("Given"),
    severity: "WARN",
  },
];

const DEFINITION_OF_DONE_RULES: ValidationRule[] = [
  {
    name: "Definition of Done Section",
    description: "Must contain Definition of Done checklist",
    check: (content) => content.includes("Definition of Done") && content.includes("- [ ]"),
    severity: "ERROR",
  },
  {
    name: "Testing Requirements",
    description: "Must include testing requirements in DoD",
    check: (content) =>
      content.includes("test") &&
      (content.includes("Unit tests") ||
        content.includes("unit") ||
        content.includes("Integration tests")),
    severity: "ERROR",
  },
  {
    name: "Performance Requirements",
    description: "Must specify performance criteria",
    check: (content) =>
      content.includes("Performance") || content.includes("rendimiento") || /\d+s/.test(content),
    severity: "WARN",
  },
  {
    name: "Code Coverage Requirements",
    description: "Must specify code coverage thresholds",
    check: (content) => content.includes("coverage") && content.includes("%"),
    severity: "WARN",
  },
];

const TECHNICAL_TASKS_RULES: ValidationRule[] = [
  {
    name: "Technical Tasks Section",
    description: "Must contain technical implementation tasks",
    check: (content) => content.includes("Technical Tasks") && content.includes("Implement"),
    severity: "ERROR",
  },
  {
    name: "Component Implementation",
    description: "Must specify component implementation tasks",
    check: (content) => content.includes("component") && content.includes(".tsx"),
    severity: "ERROR",
  },
  {
    name: "Integration Tasks",
    description: "Must include integration or library integration tasks",
    check: (content) => content.includes("Integrar") || content.includes("librería"),
    severity: "WARN",
  },
  {
    name: "Testing Implementation",
    description: "Must include testing implementation tasks",
    check: (content) => content.includes("tests") && content.includes("Automated"),
    severity: "ERROR",
  },
];

const ESTIMATION_AND_PLANNING_RULES: ValidationRule[] = [
  {
    name: "Effort Estimation",
    description: "Must include effort estimation in hours",
    check: (content) => content.includes("horas") || content.includes("hours"),
    severity: "ERROR",
  },
  {
    name: "Story Points",
    description: "Should include story points estimation",
    check: (content) => content.includes("Story Points") && content.includes("**Story Points**:"),
    severity: "WARN",
  },
  {
    name: "Dependencies Documentation",
    description: "Must document dependencies or mark as None",
    check: (content) =>
      content.includes("Dependencies") && (content.includes("None") || content.includes("US-")),
    severity: "ERROR",
  },
  {
    name: "Total Project Estimation",
    description: "Document should have total estimation summary",
    check: (content) => content.includes("Total Estimation") && content.includes("horas"),
    severity: "WARN",
  },
];

const BIOMETRIC_DOMAIN_RULES: ValidationRule[] = [
  {
    name: "Biometric Context",
    description: "Should address biometric-specific functionality or compliance",
    check: (content) =>
      content.includes("biométric") ||
      content.includes("documento") ||
      content.includes("verificación") ||
      content.includes("identidad") ||
      content.includes("Selphi") ||
      content.includes("DNI"),
    severity: "WARN",
  },
  {
    name: "Compliance Considerations",
    description: "Should reference GDPR or compliance requirements when handling personal data",
    check: (content) =>
      content.includes("GDPR") || content.includes("compliance") || content.includes("privacidad"),
    severity: "WARN",
  },
  {
    name: "Mobile-First Approach",
    description: "Should specify mobile-first or responsive design requirements",
    check: (content) =>
      content.includes("mobile") ||
      content.includes("responsive") ||
      content.includes("iOS") ||
      content.includes("Android"),
    severity: "WARN",
  },
];

const INVEST_PRINCIPLES_RULES: ValidationRule[] = [
  {
    name: "Independent Stories",
    description: "Stories should be independent with minimal dependencies",
    check: (content) =>
      content.includes("Dependencies") &&
      (content.includes("None") || (content.match(/US-/g) || []).length <= 2),
    severity: "WARN",
  },
  {
    name: "Negotiable Requirements",
    description: "Should include priority and flexibility indicators",
    check: (content) =>
      content.includes("Priority") &&
      (content.includes("High") || content.includes("Medium") || content.includes("Low")),
    severity: "WARN",
  },
  {
    name: "Valuable to Business",
    description: 'Should clearly state business value in the "So that" clause',
    check: (content) =>
      (content.includes("**Para**") || content.includes("**So that**")) &&
      (content.includes("sin ir") ||
        content.includes("fácil") ||
        content.includes("verificar") ||
        content.includes("without")),
    severity: "ERROR",
  },
  {
    name: "Estimable Size",
    description: "Must have clear estimation in hours (should be ≤40h per story)",
    check: (content) => {
      const hourMatches = content.match(/(\d+)\s*horas?/g);
      return hourMatches
        ? hourMatches.some((match) => {
            const hours = parseInt(match);
            return hours <= 40;
          })
        : false;
    },
    severity: "WARN",
  },
  {
    name: "Small and Manageable",
    description: "Story estimation should be reasonable for one sprint (≤13 hours recommended)",
    check: (content) => {
      const hourMatches = content.match(/(\d+)\s*horas?/g);
      return hourMatches
        ? hourMatches.some((match) => {
            const hours = parseInt(match);
            return hours <= 13;
          })
        : false;
    },
    severity: "WARN",
  },
  {
    name: "Testable Criteria",
    description: "Must have testable acceptance criteria with clear pass/fail conditions",
    check: (content) =>
      content.includes("```gherkin") &&
      (content.includes("debe mostrar") ||
        content.includes("must show") ||
        content.includes("should")),
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
      file: "user-stories-document-capture-feature.md",
      rules: [
        ...USER_STORY_FORMAT_RULES,
        ...BDD_ACCEPTANCE_CRITERIA_RULES,
        ...DEFINITION_OF_DONE_RULES,
        ...TECHNICAL_TASKS_RULES,
        ...ESTIMATION_AND_PLANNING_RULES,
        ...BIOMETRIC_DOMAIN_RULES,
        ...INVEST_PRINCIPLES_RULES,
      ],
      description: "User Stories for Selphi Document Capture",
    },
  ];

  console.log("🔍 Validating User Stories Skill Examples...\n");

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
  console.log("─".repeat(70));
  console.log(`📊 User Stories Validation Summary:`);
  console.log(`   ✅ ${totalPassed} rules passed`);
  console.log(`   ❌ ${totalFailed} rules failed`);
  console.log(`   ⚠️ ${totalWarnings} warnings`);

  if (allValid) {
    console.log("\n🎉 All user stories examples are properly structured!");
    console.log("   Ready for automated user story generation with BDD criteria.");
    console.log("   📋 INVEST principles and Gherkin format validated");
  } else {
    console.log(
      "\n💡 Fix the validation errors to ensure automated story generation compatibility."
    );
    console.log("   Focus on BDD acceptance criteria and INVEST principles compliance.");
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
