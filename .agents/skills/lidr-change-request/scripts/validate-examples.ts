#!/usr/bin/env tsx
/**
 * validate-examples.ts - Change Request Skill Example Validator
 *
 * Validates that change-request skill examples contain proper structure
 * for formal change management with risk assessment, approval workflow, and rollback plans.
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

const CHANGE_REQUEST_RULES: ValidationRule[] = [
  {
    name: "Change Request Title",
    description: "Must have clear change request title and ID",
    check: (content) =>
      content.includes("Change Request") || content.includes("CR-") || content.includes("#"),
    severity: "ERROR",
  },
  {
    name: "Change Description",
    description: "Must describe what changes are being made",
    check: (content) => content.includes("Description") || content.includes("Change"),
    severity: "ERROR",
  },
  {
    name: "Business Justification",
    description: "Must include business justification for the change",
    check: (content) =>
      content.includes("Justification") ||
      content.includes("Business") ||
      content.includes("Reason"),
    severity: "ERROR",
  },
  {
    name: "Risk Assessment",
    description: "Must include risk assessment and impact analysis",
    check: (content) => content.includes("Risk") && content.includes("Impact"),
    severity: "ERROR",
  },
  {
    name: "Testing Plan",
    description: "Should include testing and validation plan",
    check: (content) =>
      content.includes("Test") ||
      content.includes("Validation") ||
      content.includes("Verification"),
    severity: "WARN",
  },
  {
    name: "Rollback Plan",
    description: "Must include rollback or backout plan",
    check: (content) =>
      content.includes("Rollback") || content.includes("Backout") || content.includes("Revert"),
    severity: "ERROR",
  },
  {
    name: "Approval Workflow",
    description: "Should specify approval process and approvers",
    check: (content) =>
      content.includes("Approval") || content.includes("Approver") || content.includes("Sign-off"),
    severity: "WARN",
  },
  {
    name: "Implementation Timeline",
    description: "Should specify implementation schedule",
    check: (content) =>
      content.includes("Timeline") || content.includes("Schedule") || content.includes("Date"),
    severity: "WARN",
  },
];

const validationCases = [
  {
    file: "production-deployment-cr.md",
    rules: CHANGE_REQUEST_RULES,
    description: "Production Deployment Change Request",
  },
  {
    file: "security-patch-cr.md",
    rules: CHANGE_REQUEST_RULES,
    description: "Security Patch Change Request",
  },
];

async function main(): Promise<void> {
  console.log("🔍 Validating Change Request Skill Examples...\n");

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
      failed.forEach((rule) => console.log(`   ❌ ${rule.name}: ${rule.description}`));
      allValid = false;
    }
  }

  process.exit(allValid ? 0 : 1);
}

if (typeof import.meta !== "undefined" && import.meta.url.includes("validate-examples.ts")) {
  main();
}
