#!/usr/bin/env tsx
/**
 * validate-examples.ts - Test Plan Skill Example Validator
 *
 * Validates that test-plan skill examples contain proper structure
 * for automated test plan generation with risk-based approach.
 *
 * Validates:
 * - Test strategy with risk-based approach and priorities
 * - Test scope and coverage with entry/exit criteria
 * - Test case design methodology and automation strategy
 * - Resource allocation and timeline planning
 * - Biometric domain-specific testing requirements
 * - Integration with automated testing frameworks
 *
 * Usage: npx tsx scripts/validate-examples.ts
 */

import { readFileSync, existsSync, readdirSync } from "fs";
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

const TEST_STRATEGY_RULES: ValidationRule[] = [
  {
    name: "Test Strategy Section",
    description: "Must contain test strategy with risk-based approach",
    check: (content) => content.includes("Test Strategy") && content.includes("risk"),
    severity: "ERROR",
  },
  {
    name: "Test Objectives",
    description: "Must define clear test objectives and goals",
    check: (content) =>
      content.includes("Test Objectives") || content.includes("Testing Objectives"),
    severity: "ERROR",
  },
  {
    name: "Risk Assessment",
    description: "Must include risk assessment and risk-based testing approach",
    check: (content) => content.includes("Risk Assessment") && content.includes("risk-based"),
    severity: "ERROR",
  },
  {
    name: "Test Priorities",
    description: "Must define test priorities based on risk levels",
    check: (content) =>
      content.includes("Priority") &&
      (content.includes("High") || content.includes("Medium") || content.includes("Low")),
    severity: "ERROR",
  },
  {
    name: "Testing Types Coverage",
    description: "Must cover different testing types (functional, non-functional, security)",
    check: (content) => content.includes("functional") && content.includes("non-functional"),
    severity: "ERROR",
  },
];

const TEST_SCOPE_RULES: ValidationRule[] = [
  {
    name: "Test Scope Definition",
    description: "Must clearly define test scope and boundaries",
    check: (content) =>
      content.includes("Test Scope") &&
      content.includes("In Scope") &&
      content.includes("Out of Scope"),
    severity: "ERROR",
  },
  {
    name: "Entry Criteria",
    description: "Must define entry criteria for testing phases",
    check: (content) => content.includes("Entry Criteria") && content.includes("criteria"),
    severity: "ERROR",
  },
  {
    name: "Exit Criteria",
    description: "Must define exit criteria with measurable metrics",
    check: (content) => content.includes("Exit Criteria") && content.includes("%"),
    severity: "ERROR",
  },
  {
    name: "Test Coverage Metrics",
    description: "Must specify test coverage requirements and metrics",
    check: (content) => content.includes("Test Coverage") && content.includes("%"),
    severity: "ERROR",
  },
  {
    name: "Acceptance Criteria",
    description: "Must include acceptance criteria for test completion",
    check: (content) =>
      content.includes("Acceptance Criteria") || content.includes("acceptance criteria"),
    severity: "ERROR",
  },
];

const TEST_CASE_DESIGN_RULES: ValidationRule[] = [
  {
    name: "Test Case Design Methodology",
    description: "Must define test case design methodology and techniques",
    check: (content) => content.includes("Test Case Design") && content.includes("methodology"),
    severity: "ERROR",
  },
  {
    name: "BDD Integration",
    description: "Must include BDD (Behavior-Driven Development) approach",
    check: (content) =>
      content.includes("BDD") || content.includes("Gherkin") || content.includes("Given-When-Then"),
    severity: "ERROR",
  },
  {
    name: "Test Data Strategy",
    description: "Must define test data strategy and data management",
    check: (content) => content.includes("Test Data") && content.includes("strategy"),
    severity: "ERROR",
  },
  {
    name: "Equivalence Partitioning",
    description: "Should include test design techniques like equivalence partitioning",
    check: (content) =>
      content.includes("Equivalence") ||
      content.includes("Boundary") ||
      content.includes("partitioning"),
    severity: "WARN",
  },
  {
    name: "Negative Testing Strategy",
    description: "Must include negative testing and error handling validation",
    check: (content) => content.includes("negative testing") || content.includes("error handling"),
    severity: "ERROR",
  },
];

const AUTOMATION_STRATEGY_RULES: ValidationRule[] = [
  {
    name: "Test Automation Strategy",
    description: "Must define test automation strategy and framework selection",
    check: (content) =>
      content.includes("Automation Strategy") || content.includes("Test Automation"),
    severity: "ERROR",
  },
  {
    name: "Automation vs Manual Split",
    description: "Must define the split between automated and manual testing",
    check: (content) =>
      content.includes("Automated") && content.includes("Manual") && content.includes("%"),
    severity: "ERROR",
  },
  {
    name: "Automation Framework",
    description: "Must specify automation framework and tools",
    check: (content) =>
      content.includes("framework") &&
      (content.includes("Playwright") ||
        content.includes("Cypress") ||
        content.includes("Selenium")),
    severity: "ERROR",
  },
  {
    name: "CI/CD Integration",
    description: "Must include CI/CD integration for automated testing",
    check: (content) => content.includes("CI/CD") && content.includes("integration"),
    severity: "ERROR",
  },
  {
    name: "Automation ROI Analysis",
    description: "Should include ROI analysis for test automation",
    check: (content) => content.includes("ROI") || content.includes("return on investment"),
    severity: "WARN",
  },
];

const BIOMETRIC_TESTING_RULES: ValidationRule[] = [
  {
    name: "Biometric Testing Requirements",
    description: "Must include biometric-specific testing requirements",
    check: (content) =>
      content.includes("biometric") ||
      content.includes("Biometric") ||
      content.includes("facial") ||
      content.includes("voice") ||
      content.includes("document"),
    severity: "ERROR",
  },
  {
    name: "Algorithm Testing Strategy",
    description: "Must include algorithm accuracy and performance testing",
    check: (content) => content.includes("algorithm") && content.includes("accuracy"),
    severity: "ERROR",
  },
  {
    name: "Anti-Spoofing Testing",
    description: "Must include anti-spoofing and liveness detection testing",
    check: (content) =>
      content.includes("anti-spoofing") ||
      content.includes("liveness") ||
      content.includes("presentation attack"),
    severity: "WARN",
  },
  {
    name: "Cross-Platform Testing",
    description: "Must include cross-platform compatibility testing",
    check: (content) =>
      content.includes("cross-platform") ||
      (content.includes("iOS") && content.includes("Android")),
    severity: "ERROR",
  },
  {
    name: "Compliance Testing Strategy",
    description: "Should include GDPR and regulatory compliance testing",
    check: (content) =>
      content.includes("GDPR") || content.includes("compliance") || content.includes("privacy"),
    severity: "WARN",
  },
];

const RESOURCE_PLANNING_RULES: ValidationRule[] = [
  {
    name: "Resource Allocation",
    description: "Must define resource allocation and team assignments",
    check: (content) => content.includes("Resource") && content.includes("allocation"),
    severity: "ERROR",
  },
  {
    name: "Timeline and Milestones",
    description: "Must include testing timeline with key milestones",
    check: (content) => content.includes("Timeline") && content.includes("milestone"),
    severity: "ERROR",
  },
  {
    name: "Skill Requirements",
    description: "Must identify required skills and expertise",
    check: (content) =>
      content.includes("skill") || content.includes("expertise") || content.includes("competency"),
    severity: "ERROR",
  },
  {
    name: "Environment Requirements",
    description: "Must specify test environment requirements",
    check: (content) => content.includes("Environment") && content.includes("requirements"),
    severity: "ERROR",
  },
  {
    name: "Tool Requirements",
    description: "Must list required tools and licenses",
    check: (content) => content.includes("tools") || content.includes("Tools"),
    severity: "ERROR",
  },
];

const PERFORMANCE_TESTING_RULES: ValidationRule[] = [
  {
    name: "Performance Testing Strategy",
    description: "Must include performance testing strategy and objectives",
    check: (content) => content.includes("Performance Testing") && content.includes("strategy"),
    severity: "ERROR",
  },
  {
    name: "Load Testing Requirements",
    description: "Must define load testing requirements and scenarios",
    check: (content) => content.includes("Load Testing") || content.includes("load testing"),
    severity: "ERROR",
  },
  {
    name: "Performance Metrics",
    description: "Must specify performance metrics and acceptance criteria",
    check: (content) => content.includes("response time") && /\d+ms/.test(content),
    severity: "ERROR",
  },
  {
    name: "Scalability Testing",
    description: "Should include scalability testing requirements",
    check: (content) => content.includes("scalability") || content.includes("Scalability"),
    severity: "WARN",
  },
];

const QUALITY_GATES_RULES: ValidationRule[] = [
  {
    name: "Quality Gates Definition",
    description: "Must define quality gates and go/no-go criteria",
    check: (content) => content.includes("Quality Gates") || content.includes("quality gates"),
    severity: "ERROR",
  },
  {
    name: "Defect Management Strategy",
    description: "Must include defect management and triage process",
    check: (content) =>
      content.includes("Defect Management") ||
      content.includes("defect") ||
      content.includes("bug"),
    severity: "ERROR",
  },
  {
    name: "Risk Mitigation Plans",
    description: "Must include risk mitigation plans for testing",
    check: (content) => content.includes("Risk Mitigation") || content.includes("mitigation"),
    severity: "ERROR",
  },
  {
    name: "Contingency Planning",
    description: "Should include contingency plans for testing delays",
    check: (content) => content.includes("contingency") || content.includes("Contingency"),
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

  // Find all .md files in examples directory recursively
  const findMdFiles = (dir: string): string[] => {
    const files: string[] = [];
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...findMdFiles(fullPath));
      } else if (
        entry.isFile() &&
        entry.name.endsWith(".md") &&
        !entry.name.includes("validation")
      ) {
        files.push(fullPath);
      }
    }
    return files;
  };

  const mdFiles = findMdFiles(examplesDir);
  const validationCases = mdFiles.map((filePath) => ({
    file: filePath.replace(examplesDir + "/", ""),
    fullPath: filePath,
    rules: [
      ...TEST_STRATEGY_RULES,
      ...TEST_SCOPE_RULES,
      ...TEST_CASE_DESIGN_RULES,
      ...AUTOMATION_STRATEGY_RULES,
      ...BIOMETRIC_TESTING_RULES,
      ...RESOURCE_PLANNING_RULES,
      ...PERFORMANCE_TESTING_RULES,
      ...QUALITY_GATES_RULES,
    ],
    description: `Test Plan: ${filePath.split("/").pop()?.replace(".md", "") || "Unknown"}`,
  }));

  console.log("🔍 Validating Test Plan Skill Examples...\n");

  let totalPassed = 0;
  let totalFailed = 0;
  let totalWarnings = 0;
  let allValid = true;

  for (const testCase of validationCases) {
    if (!existsSync(testCase.fullPath)) {
      console.log(`❌ ${testCase.description}`);
      console.log(`   File not found: ${testCase.file}\n`);
      allValid = false;
      continue;
    }

    const result = validateFile(testCase.fullPath, testCase.rules);
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
  console.log(`📊 Test Plan Validation Summary:`);
  console.log(`   ✅ ${totalPassed} rules passed`);
  console.log(`   ❌ ${totalFailed} rules failed`);
  console.log(`   ⚠️ ${totalWarnings} warnings`);

  if (allValid) {
    console.log("\n🎉 All test plan examples are properly structured!");
    console.log("   Ready for automated test plan generation with risk-based approach.");
    console.log("   📋 Test strategy, automation framework, and biometric testing validated");
  } else {
    console.log("\n💡 Fix the validation errors to ensure test planning compatibility.");
    console.log("   Focus on test strategy definition and automation integration.");
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
