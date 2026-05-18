#!/usr/bin/env tsx
/**
 * validate-examples.ts - Test Execution Report Skill Example Validator
 *
 * Validates that test-execution-report skill examples contain proper structure
 * for biometric QA sign-off and Gate 5 approval requirements.
 *
 * Validates:
 * - Test execution summary with pass/fail metrics
 * - Test case results with evidence and traceability
 * - Defect analysis and risk assessment
 * - Environment and configuration validation
 * - Biometric-specific testing requirements
 * - QA sign-off criteria and Gate 5 readiness
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

const EXECUTION_SUMMARY_RULES: ValidationRule[] = [
  {
    name: "Test Execution Summary",
    description: "Must contain test execution summary with overall statistics",
    check: (content) =>
      content.includes("Test Execution Summary") || content.includes("Execution Summary"),
    severity: "ERROR",
  },
  {
    name: "Pass/Fail Metrics",
    description: "Must include pass/fail statistics with percentages",
    check: (content) => content.includes("Pass") && content.includes("Fail") && /%/.test(content),
    severity: "ERROR",
  },
  {
    name: "Test Coverage Metrics",
    description: "Must report test coverage statistics",
    check: (content) => content.includes("coverage") && content.includes("%"),
    severity: "ERROR",
  },
  {
    name: "Execution Timeline",
    description: "Must include test execution timeline and duration",
    check: (content) =>
      content.includes("Duration") ||
      content.includes("Timeline") ||
      content.includes("Execution Period"),
    severity: "ERROR",
  },
  {
    name: "Environment Information",
    description: "Must specify test environment and configuration details",
    check: (content) => content.includes("Environment") && content.includes("Test Environment"),
    severity: "ERROR",
  },
];

const TEST_RESULTS_RULES: ValidationRule[] = [
  {
    name: "Test Case Results Section",
    description: "Must contain detailed test case results",
    check: (content) => content.includes("Test Case Results") || content.includes("Test Results"),
    severity: "ERROR",
  },
  {
    name: "Test Case Traceability",
    description: "Must trace test cases to requirements or user stories",
    check: (content) =>
      content.includes("Requirement") ||
      content.includes("User Story") ||
      content.includes("RF-") ||
      content.includes("US-"),
    severity: "ERROR",
  },
  {
    name: "Evidence Documentation",
    description: "Must provide evidence for test execution (screenshots, logs, data)",
    check: (content) =>
      content.includes("Evidence") ||
      content.includes("Screenshots") ||
      content.includes("Logs") ||
      content.includes("proof"),
    severity: "ERROR",
  },
  {
    name: "Test Data Management",
    description: "Must document test data used and data management practices",
    check: (content) =>
      content.includes("Test Data") || content.includes("data") || content.includes("dataset"),
    severity: "WARN",
  },
  {
    name: "Automated vs Manual Test Results",
    description: "Should distinguish between automated and manual test results",
    check: (content) => content.includes("Automated") && content.includes("Manual"),
    severity: "WARN",
  },
];

const DEFECT_ANALYSIS_RULES: ValidationRule[] = [
  {
    name: "Defect Analysis Section",
    description: "Must contain defect analysis and categorization",
    check: (content) =>
      content.includes("Defect Analysis") ||
      content.includes("Bug Analysis") ||
      content.includes("Defects Found"),
    severity: "ERROR",
  },
  {
    name: "Defect Severity Classification",
    description: "Must classify defects by severity (Critical, High, Medium, Low)",
    check: (content) =>
      content.includes("Critical") && content.includes("High") && content.includes("Medium"),
    severity: "ERROR",
  },
  {
    name: "Defect Root Cause Analysis",
    description: "Should include root cause analysis for critical defects",
    check: (content) =>
      content.includes("Root Cause") || content.includes("root cause") || content.includes("RCA"),
    severity: "WARN",
  },
  {
    name: "Defect Resolution Status",
    description: "Must report defect resolution status and timelines",
    check: (content) => content.includes("Resolution") && content.includes("Status"),
    severity: "ERROR",
  },
  {
    name: "Blocking Defects Assessment",
    description: "Must identify any blocking defects that prevent release",
    check: (content) =>
      content.includes("blocking") || content.includes("Blocking") || content.includes("blocker"),
    severity: "ERROR",
  },
];

const BIOMETRIC_TESTING_RULES: ValidationRule[] = [
  {
    name: "Biometric Testing Coverage",
    description: "Must include biometric-specific testing coverage",
    check: (content) =>
      content.includes("biometric") ||
      content.includes("Biometric") ||
      content.includes("identity") ||
      content.includes("facial") ||
      content.includes("voice") ||
      content.includes("document"),
    severity: "ERROR",
  },
  {
    name: "Algorithm Accuracy Testing",
    description: "Must include algorithm accuracy and performance testing results",
    check: (content) =>
      content.includes("accuracy") ||
      content.includes("Accuracy") ||
      content.includes("algorithm") ||
      content.includes("performance") ||
      content.includes("matching"),
    severity: "ERROR",
  },
  {
    name: "Anti-Spoofing Validation",
    description: "Must validate anti-spoofing and liveness detection",
    check: (content) =>
      content.includes("anti-spoofing") ||
      content.includes("liveness") ||
      content.includes("spoof") ||
      content.includes("presentation attack"),
    severity: "WARN",
  },
  {
    name: "Cross-Platform Compatibility",
    description: "Must test cross-platform compatibility (iOS/Android/Web)",
    check: (content) =>
      (content.includes("iOS") && content.includes("Android")) ||
      content.includes("cross-platform"),
    severity: "ERROR",
  },
  {
    name: "Data Privacy Compliance Testing",
    description: "Should include GDPR Article 9 and data privacy compliance testing",
    check: (content) =>
      content.includes("GDPR") ||
      content.includes("privacy") ||
      content.includes("data protection"),
    severity: "WARN",
  },
];

const PERFORMANCE_TESTING_RULES: ValidationRule[] = [
  {
    name: "Performance Test Results",
    description: "Must include performance testing results and metrics",
    check: (content) =>
      content.includes("Performance") && content.includes("test") && /\d+ms/.test(content),
    severity: "ERROR",
  },
  {
    name: "Load Testing Results",
    description: "Should include load testing results for concurrent users",
    check: (content) => content.includes("Load") && content.includes("concurrent"),
    severity: "WARN",
  },
  {
    name: "Response Time Analysis",
    description: "Must include response time analysis with percentiles",
    check: (content) =>
      content.includes("response time") && (content.includes("P95") || content.includes("P99")),
    severity: "ERROR",
  },
  {
    name: "Resource Utilization",
    description: "Should report resource utilization (CPU, memory, disk)",
    check: (content) =>
      content.includes("CPU") || content.includes("memory") || content.includes("resource"),
    severity: "WARN",
  },
];

const QA_SIGNOFF_RULES: ValidationRule[] = [
  {
    name: "QA Sign-off Section",
    description: "Must contain QA sign-off section with recommendations",
    check: (content) =>
      content.includes("QA Sign-off") ||
      content.includes("Quality Sign-off") ||
      content.includes("QA Recommendation"),
    severity: "ERROR",
  },
  {
    name: "Gate 5 Readiness Assessment",
    description: "Must assess Gate 5 readiness with clear recommendation",
    check: (content) =>
      content.includes("Gate 5") &&
      (content.includes("PASS") || content.includes("FAIL") || content.includes("CONDITIONAL")),
    severity: "ERROR",
  },
  {
    name: "Exit Criteria Validation",
    description: "Must validate exit criteria for testing phase",
    check: (content) => content.includes("Exit Criteria") || content.includes("exit criteria"),
    severity: "ERROR",
  },
  {
    name: "Outstanding Issues Summary",
    description: "Must summarize any outstanding issues and their impact",
    check: (content) =>
      content.includes("Outstanding Issues") || content.includes("remaining issues"),
    severity: "ERROR",
  },
  {
    name: "Risk Assessment for Release",
    description: "Must provide risk assessment for production release",
    check: (content) => content.includes("Risk Assessment") && content.includes("release"),
    severity: "ERROR",
  },
];

const COMPLIANCE_RULES: ValidationRule[] = [
  {
    name: "Regulatory Compliance Testing",
    description: "Must include regulatory compliance testing results",
    check: (content) => content.includes("compliance") || content.includes("regulatory"),
    severity: "WARN",
  },
  {
    name: "Security Testing Results",
    description: "Should include security testing results and validation",
    check: (content) => content.includes("Security") && content.includes("test"),
    severity: "WARN",
  },
  {
    name: "Accessibility Testing",
    description: "Should include accessibility testing for biometric interfaces",
    check: (content) => content.includes("accessibility") || content.includes("WCAG"),
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
      ...EXECUTION_SUMMARY_RULES,
      ...TEST_RESULTS_RULES,
      ...DEFECT_ANALYSIS_RULES,
      ...BIOMETRIC_TESTING_RULES,
      ...PERFORMANCE_TESTING_RULES,
      ...QA_SIGNOFF_RULES,
      ...COMPLIANCE_RULES,
    ],
    description: `Test Execution Report: ${filePath.split("/").pop()?.replace(".md", "") || "Unknown"}`,
  }));

  console.log("🔍 Validating Test Execution Report Skill Examples...\n");

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
  console.log(`📊 Test Execution Report Validation Summary:`);
  console.log(`   ✅ ${totalPassed} rules passed`);
  console.log(`   ❌ ${totalFailed} rules failed`);
  console.log(`   ⚠️ ${totalWarnings} warnings`);

  if (allValid) {
    console.log("\n🎉 All test execution report examples are properly structured!");
    console.log("   Ready for biometric QA sign-off and Gate 5 approval.");
    console.log("   🧪 Test results, defect analysis, and QA sign-off criteria validated");
  } else {
    console.log("\n💡 Fix the validation errors to ensure Gate 5 compatibility.");
    console.log("   Focus on QA sign-off criteria and biometric testing coverage.");
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
