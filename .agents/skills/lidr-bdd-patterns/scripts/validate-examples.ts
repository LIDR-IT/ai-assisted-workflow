#!/usr/bin/env tsx
/**
 * validate-examples.ts - BDD Patterns Skill Example Validator
 *
 * Validates that bdd-patterns skill examples contain proper BDD structure
 * for Given-When-Then scenarios, Gherkin syntax, and acceptance criteria.
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

const BDD_SYNTAX_RULES: ValidationRule[] = [
  {
    name: "Given-When-Then Structure",
    description: "Must contain properly formatted Given-When-Then scenarios",
    check: (content) =>
      content.includes("Given") && content.includes("When") && content.includes("Then"),
    severity: "ERROR",
  },
  {
    name: "Scenario Keywords",
    description: "Must use proper Gherkin scenario keywords",
    check: (content) => content.includes("Scenario:") || content.includes("Feature:"),
    severity: "ERROR",
  },
  {
    name: "BDD Pattern Examples",
    description: "Should include multiple BDD pattern examples",
    check: (content) => (content.match(/Scenario:/g) || []).length >= 2,
    severity: "WARN",
  },
  {
    name: "Acceptance Criteria",
    description: "Should demonstrate acceptance criteria formatting",
    check: (content) => content.includes("acceptance") || content.includes("criteria"),
    severity: "WARN",
  },
];

const validationCases = [
  {
    file: "bdd-scenario-examples.md",
    rules: BDD_SYNTAX_RULES,
    description: "BDD Scenario Examples",
  },
  {
    file: "gherkin-syntax-guide.md",
    rules: BDD_SYNTAX_RULES,
    description: "Gherkin Syntax Guide",
  },
];

async function main(): Promise<void> {
  console.log("🔍 Validating BDD Patterns Skill Examples...\n");

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
