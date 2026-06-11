#!/usr/bin/env tsx
/**
 * validate-examples.ts - Business Case Skill Example Validator
 *
 * Validates that business-case skill examples contain proper structure
 * for comprehensive business case documentation with ROI analysis and stakeholder justification.
 *
 * The DEFAULT validation set is 100% DOMAIN-AGNOSTIC (executive summary, problem,
 * financial analysis, risk, timeline, metrics) — LIDR is a multi-industry framework.
 * An OPTIONAL biometric/identity domain pack of extra example fixtures is preserved
 * as BIOMETRIC_DOMAIN_PACK below and applied only when LIDR_DOMAIN_PACK === 'biometric'.
 * Example only — NOT the active default.
 *
 * Usage: npx tsx scripts/validate-examples.ts
 *        LIDR_DOMAIN_PACK=biometric npx tsx scripts/validate-examples.ts
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

// DEFAULT validation cases — DOMAIN-AGNOSTIC generic business cases.
const DEFAULT_CASES = [
  {
    file: "business-case.md",
    rules: BUSINESS_CASE_RULES,
    description: "Generic Business Case",
  },
  {
    file: "compliance-automation-business-case.md",
    rules: BUSINESS_CASE_RULES,
    description: "Compliance Automation Business Case",
  },
];

// OPTIONAL biometric/identity domain pack — example only, NOT the active default.
// Applied only when LIDR_DOMAIN_PACK === 'biometric'.
const BIOMETRIC_DOMAIN_PACK = [
  {
    file: "biometric-platform-business-case.md",
    rules: BUSINESS_CASE_RULES,
    description: "Biometric Platform Business Case",
  },
  {
    file: "business-case-selphid-banking.md",
    rules: BUSINESS_CASE_RULES,
    description: "Identity-Banking Business Case",
  },
];

const validationCases =
  process.env.LIDR_DOMAIN_PACK === "biometric"
    ? [...DEFAULT_CASES, ...BIOMETRIC_DOMAIN_PACK]
    : DEFAULT_CASES;

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
