#!/usr/bin/env tsx
/**
 * validate-examples.ts - Brainstorming Skill Example Validator
 *
 * Validates that brainstorming skill examples contain proper BMAD methodology
 * structure for innovation and problem-solving in biometric domain.
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

const BRAINSTORMING_RULES: ValidationRule[] = [
  {
    name: "BMAD Methodology",
    description: "Must reference BMAD methodology principles",
    check: (content) => content.includes("BMAD") || content.includes("methodology"),
    severity: "ERROR",
  },
  {
    name: "Problem Definition",
    description: "Must clearly define the problem or challenge",
    check: (content) => content.includes("problem") || content.includes("challenge"),
    severity: "ERROR",
  },
  {
    name: "Ideation Process",
    description: "Should outline structured ideation process",
    check: (content) => content.includes("ideation") || content.includes("brainstorm"),
    severity: "WARN",
  },
  {
    name: "Biometric Domain Focus",
    description: "Should include biometric domain-specific considerations",
    check: (content) => content.includes("biometric") || content.includes("identity"),
    severity: "WARN",
  },
];

const validationCases = [
  {
    file: "bmad-innovation-session.md",
    rules: BRAINSTORMING_RULES,
    description: "BMAD Innovation Session Template",
  },
];

async function main(): Promise<void> {
  console.log("🔍 Validating Brainstorming Skill Examples...\n");

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
