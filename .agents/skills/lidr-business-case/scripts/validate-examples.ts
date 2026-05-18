#!/usr/bin/env tsx
/**
 * validate-examples.ts - Business Case Skill Example Validator
 *
 * Validates that business-case skill examples contain proper structure
 * for comprehensive business case documentation with ROI analysis and stakeholder justification.
 *
 * Usage: npx tsx scripts/validate-examples.ts
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";

interface ValidationRule {
  name: string;
  description: string;
  check: (content: string) => boolean;
  severity: "ERROR" | "WARN";
}

const BUSINESS_CASE_RULES: ValidationRule[] = [
  {
    name: "Executive Summary",
    description: "Must include executive summary section",
    check: (content) => content.includes("Executive Summary") || content.includes("Summary"),
    severity: "ERROR",
  },
  {
    name: "Problem Statement",
    description: "Must clearly define the business problem or opportunity",
    check: (content) =>
      content.includes("Problem") ||
      content.includes("Opportunity") ||
      content.includes("Challenge"),
    severity: "ERROR",
  },
  {
    name: "Financial Analysis",
    description: "Must include financial analysis with costs and benefits",
    check: (content) =>
      (content.includes("Cost") && content.includes("Benefit")) || content.includes("ROI"),
    severity: "ERROR",
  },
  {
    name: "Risk Assessment",
    description: "Should include risk assessment and mitigation strategies",
    check: (content) => content.includes("Risk") || content.includes("Mitigation"),
    severity: "WARN",
  },
  {
    name: "Implementation Timeline",
    description: "Should provide implementation timeline or phases",
    check: (content) =>
      content.includes("Timeline") || content.includes("Phase") || content.includes("Schedule"),
    severity: "WARN",
  },
  {
    name: "Success Metrics",
    description: "Should define success metrics and KPIs",
    check: (content) =>
      content.includes("Metric") || content.includes("KPI") || content.includes("Success"),
    severity: "WARN",
  },
];

const validationCases = [
  {
    file: "biometric-platform-business-case.md",
    rules: BUSINESS_CASE_RULES,
    description: "Biometric Platform Business Case",
  },
  {
    file: "compliance-automation-business-case.md",
    rules: BUSINESS_CASE_RULES,
    description: "Compliance Automation Business Case",
  },
];

async function main(): Promise<void> {
  console.log("🔍 Validating Business Case Skill Examples...\n");

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
