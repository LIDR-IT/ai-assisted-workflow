#!/usr/bin/env tsx
/**
 * validate-examples.ts - Bug Report Skill Example Validator
 *
 * Validates that bug-report skill examples contain proper structure
 * for comprehensive bug reporting with reproduction steps and environment details.
 *
 * Usage: npx tsx scripts/validate-examples.ts
 */

import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface ValidationRule {
  name: string;
  description: string;
  check: (content: string) => boolean;
  severity: "ERROR" | "WARN";
}

const BUG_REPORT_RULES: ValidationRule[] = [
  {
    name: "Bug Title",
    description: "Must have clear, descriptive bug title",
    check: (content) =>
      content.includes("# ") || content.includes("Bug:") || content.includes("Issue:"),
    severity: "ERROR",
  },
  {
    name: "Reproduction Steps",
    description: "Must include step-by-step reproduction instructions",
    check: (content) =>
      content.includes("Steps") || content.includes("Reproduce") || content.includes("1."),
    severity: "ERROR",
  },
  {
    name: "Expected vs Actual",
    description: "Must specify expected vs actual behavior",
    check: (content) => content.includes("Expected") && content.includes("Actual"),
    severity: "ERROR",
  },
  {
    name: "Environment Details",
    description: "Should include environment and version information",
    check: (content) =>
      content.includes("Environment") || content.includes("Version") || content.includes("Browser"),
    severity: "WARN",
  },
  {
    name: "Severity Classification",
    description: "Should classify bug severity",
    check: (content) =>
      content.includes("Severity") || content.includes("Priority") || content.includes("Critical"),
    severity: "WARN",
  },
];

const validationCases = [
  {
    file: "platform-api-memory-leak.md",
    rules: BUG_REPORT_RULES,
    description: "Comprehensive Bug Report Template",
  },
  {
    file: "selphi-liveness-false-rejection-bug.md",
    rules: BUG_REPORT_RULES,
    description: "Biometric Verification Bug Report",
  },
];

async function main(): Promise<void> {
  console.log("🔍 Validating Bug Report Skill Examples...\n");

  const examplesDir = join(__dirname, "../examples");
  let allValid = true;

  for (const testCase of validationCases) {
    const filePath = join(examplesDir, testCase.file);
    if (!existsSync(filePath)) {
      console.log(`⚠️  ${testCase.description} - File not found`);
      continue;
    }

    const content = readFileSync(filePath, "utf-8");
    const failed = testCase.rules.filter((rule) => !rule.check(content));

    if (failed.length === 0) {
      console.log(`✅ ${testCase.description} - All rules passed`);
    } else {
      console.log(`❌ ${testCase.description} - ${failed.length} rules failed`);
      allValid = false;
    }
  }

  process.exit(allValid ? 0 : 1);
}

if (typeof import.meta !== "undefined" && import.meta.url.includes("validate-examples.ts")) {
  main();
}
