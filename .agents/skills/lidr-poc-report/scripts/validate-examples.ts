#!/usr/bin/env tsx
/**
 * validate-examples.ts - PoC Report Skill Example Validator
 *
 * Validates that poc-report skill examples contain proper structure
 * for technical feasibility validation and proof of concept documentation.
 *
 * Validates:
 * - Objective and hypothesis definition
 * - Methodology and approach documentation
 * - Results and findings with quantitative metrics
 * - Technical feasibility assessment and recommendations
 * - Risk analysis and next steps planning
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

const POC_STRUCTURE_RULES: ValidationRule[] = [
  {
    name: "Objective Definition",
    description: "Must clearly define PoC objective and hypothesis",
    check: (content) => content.includes("Objective") && content.includes("Hypothesis"),
    severity: "ERROR",
  },
  {
    name: "Methodology Section",
    description: "Must document methodology and approach used",
    check: (content) => content.includes("Methodology") || content.includes("Approach"),
    severity: "ERROR",
  },
  {
    name: "Results Documentation",
    description: "Must include results section with findings",
    check: (content) => content.includes("Results") && content.includes("Findings"),
    severity: "ERROR",
  },
  {
    name: "Conclusion and Recommendations",
    description: "Must provide conclusion and next steps recommendations",
    check: (content) => content.includes("Conclusion") && content.includes("Recommendations"),
    severity: "ERROR",
  },
];

const TECHNICAL_VALIDATION_RULES: ValidationRule[] = [
  {
    name: "Technical Feasibility Assessment",
    description: "Must assess technical feasibility of the concept",
    check: (content) => content.includes("Technical") && content.includes("Feasibility"),
    severity: "ERROR",
  },
  {
    name: "Performance Metrics",
    description: "Must include quantitative performance metrics",
    check: (content) =>
      (content.includes("Performance") || content.includes("Metrics")) &&
      (content.includes("%") || content.includes("ms") || content.includes("seconds")),
    severity: "ERROR",
  },
  {
    name: "Technology Stack",
    description: "Must document technology stack and tools used",
    check: (content) =>
      content.includes("Technology") || content.includes("Stack") || content.includes("Tools"),
    severity: "WARN",
  },
  {
    name: "Limitations Analysis",
    description: "Must identify limitations and constraints",
    check: (content) => content.includes("Limitations") || content.includes("Constraints"),
    severity: "ERROR",
  },
];

const EVIDENCE_RULES: ValidationRule[] = [
  {
    name: "Supporting Evidence",
    description: "Must include supporting evidence (screenshots, logs, data)",
    check: (content) =>
      content.includes("Evidence") ||
      content.includes("Screenshot") ||
      content.includes("Data") ||
      content.includes("Log"),
    severity: "ERROR",
  },
  {
    name: "Test Cases",
    description: "Must document test cases or scenarios executed",
    check: (content) =>
      content.includes("Test") && (content.includes("Cases") || content.includes("Scenarios")),
    severity: "WARN",
  },
  {
    name: "Reproducibility Instructions",
    description: "Must provide instructions for reproducing results",
    check: (content) =>
      content.includes("Reproduce") ||
      content.includes("Instructions") ||
      (content.includes("Steps") && content.includes("Setup")),
    severity: "WARN",
  },
];

const RISK_ASSESSMENT_RULES: ValidationRule[] = [
  {
    name: "Risk Analysis",
    description: "Must include risk analysis for implementation",
    check: (content) => content.includes("Risk") && content.includes("Analysis"),
    severity: "ERROR",
  },
  {
    name: "Implementation Challenges",
    description: "Must identify potential implementation challenges",
    check: (content) =>
      content.includes("Challenges") ||
      content.includes("Issues") ||
      content.includes("Difficulties"),
    severity: "WARN",
  },
  {
    name: "Success Criteria",
    description: "Must define success criteria for production implementation",
    check: (content) => content.includes("Success") && content.includes("Criteria"),
    severity: "ERROR",
  },
];

const ALL_RULES = [
  ...POC_STRUCTURE_RULES,
  ...TECHNICAL_VALIDATION_RULES,
  ...EVIDENCE_RULES,
  ...RISK_ASSESSMENT_RULES,
];

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

async function main(): Promise<void> {
  const examplesDir = join(__dirname, "../examples");

  if (!existsSync(examplesDir)) {
    console.error("❌ Examples directory not found");
    process.exit(1);
  }

  const validationCases = [
    {
      file: "edge-computing-biometrics.md",
      rules: ALL_RULES,
      description: "Edge Computing Biometrics PoC Report",
    },
    {
      file: "quantum-resistant-biometrics.md",
      rules: ALL_RULES,
      description: "Quantum Resistant Biometrics PoC Report",
    },
  ];

  console.log("🔍 Validating PoC Report Skill Examples...\n");

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

  console.log("─".repeat(60));
  console.log(`📊 Validation Summary:`);
  console.log(`   ✅ ${totalPassed} rules passed`);
  console.log(`   ❌ ${totalFailed} rules failed`);
  console.log(`   ⚠️ ${totalWarnings} warnings`);

  if (allValid) {
    console.log("\n🎉 All PoC report examples are properly structured!");
    console.log("   Ready for technical feasibility validation.");
  } else {
    console.log("\n💡 Fix the validation errors to ensure PoC report quality.");
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
