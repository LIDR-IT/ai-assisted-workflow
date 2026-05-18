#!/usr/bin/env tsx
/**
 * validate-examples.ts - Risk Log Skill Example Validator
 *
 * Validates that risk-log skill examples contain proper structure
 * for biometric project risk management throughout SDLC lifecycle.
 *
 * Validates:
 * - Risk identification with biometric-specific categories
 * - Risk assessment with probability and impact scoring
 * - Mitigation strategies with ownership and timelines
 * - Risk monitoring and status tracking
 * - Compliance and regulatory risk assessment
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

const RISK_STRUCTURE_RULES: ValidationRule[] = [
  {
    name: "Risk Log Header",
    description: "Must contain project information and risk log metadata",
    check: (content) => content.includes("Risk Log") && content.includes("Project"),
    severity: "ERROR",
  },
  {
    name: "Risk Categories",
    description: "Must categorize risks by type (Technical, Business, Compliance, etc.)",
    check: (content) => content.includes("Technical") && content.includes("Business"),
    severity: "ERROR",
  },
  {
    name: "Risk Assessment Matrix",
    description: "Must include probability and impact assessment",
    check: (content) => content.includes("Probability") && content.includes("Impact"),
    severity: "ERROR",
  },
  {
    name: "Mitigation Strategies",
    description: "Must include specific mitigation plans for each risk",
    check: (content) => content.includes("Mitigation") && content.includes("Strategy"),
    severity: "ERROR",
  },
  {
    name: "Risk Ownership",
    description: "Must assign ownership for each risk",
    check: (content) => content.includes("Owner") && content.includes("Assigned"),
    severity: "ERROR",
  },
];

const BIOMETRIC_DOMAIN_RULES: ValidationRule[] = [
  {
    name: "Biometric Technical Risks",
    description: "Must identify biometric-specific technical risks",
    check: (content) =>
      content.includes("accuracy") || content.includes("template") || content.includes("matching"),
    severity: "ERROR",
  },
  {
    name: "GDPR Compliance Risks",
    description: "Must address GDPR Article 9 compliance risks",
    check: (content) => content.includes("GDPR") && content.includes("compliance"),
    severity: "ERROR",
  },
  {
    name: "Anti-Spoofing Risks",
    description: "Should identify anti-spoofing and security risks",
    check: (content) => content.includes("spoofing") || content.includes("security"),
    severity: "WARN",
  },
  {
    name: "Performance Risks",
    description: "Should identify performance and scalability risks",
    check: (content) => content.includes("performance") || content.includes("latency"),
    severity: "WARN",
  },
];

function validateFile(filePath: string, rules: ValidationRule[]): any {
  const content = readFileSync(filePath, "utf-8");
  const result = { file: filePath, passed: 0, failed: 0, warnings: 0, issues: [] as any[] };

  for (const rule of rules) {
    if (rule.check(content)) {
      result.passed++;
    } else {
      if (rule.severity === "ERROR") result.failed++;
      else result.warnings++;
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
      file: "biometric-project-risk-log.md",
      rules: [...RISK_STRUCTURE_RULES, ...BIOMETRIC_DOMAIN_RULES],
      description: "Biometric Project Risk Log Structure",
    },
  ];

  console.log("🔍 Validating Risk Log Skill Examples...\n");

  let totalPassed = 0,
    totalFailed = 0,
    totalWarnings = 0,
    allValid = true;

  for (const testCase of validationCases) {
    const filePath = join(examplesDir, testCase.file);

    if (!existsSync(filePath)) {
      console.log(`❌ ${testCase.description}\n   File not found: ${testCase.file}\n`);
      allValid = false;
      continue;
    }

    const result = validateFile(filePath, testCase.rules);
    totalPassed += result.passed;
    totalFailed += result.failed;
    totalWarnings += result.warnings;

    if (result.failed === 0) {
      console.log(`✅ ${testCase.description}\n   ✓ ${result.passed} rules passed`);
      if (result.warnings > 0) console.log(`   ⚠️ ${result.warnings} warnings`);
      console.log();
    } else {
      console.log(
        `❌ ${testCase.description}\n   ✓ ${result.passed} rules passed\n   ❌ ${result.failed} rules failed`
      );
      if (result.warnings > 0) console.log(`   ⚠️ ${result.warnings} warnings`);
      for (const issue of result.issues) {
        const icon = issue.severity === "ERROR" ? "❌" : "⚠️";
        console.log(`   ${icon} ${issue.rule}: ${issue.description}`);
      }
      console.log();
      allValid = false;
    }
  }

  console.log("─".repeat(60));
  console.log(
    `📊 Validation Summary:\n   ✅ ${totalPassed} rules passed\n   ❌ ${totalFailed} rules failed\n   ⚠️ ${totalWarnings} warnings`
  );

  if (allValid) {
    console.log(
      "\n🎉 All Risk Log examples are properly structured!\n   Ready for comprehensive biometric project risk management."
    );
  } else {
    console.log(
      "\n💡 Fix the validation errors to ensure effective risk identification and mitigation."
    );
  }

  process.exit(allValid ? 0 : 1);
}

if (typeof import.meta !== "undefined" && import.meta.url.endsWith("validate-examples.ts")) {
  main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}
