#!/usr/bin/env tsx
/**
 * validate-examples.ts - Rollback Plan Skill Example Validator
 *
 * Validates that rollback-plan skill examples contain proper structure
 * for automated rollback planning with deployment risk analysis.
 *
 * The DEFAULT validation set is 100% domain-agnostic — it validates a generic
 * deployment rollback plan and works for any technology stack or industry.
 *
 * Validates:
 * - Change analysis with deployment components
 * - Rollback procedures with detailed steps
 * - Risk assessment for rollback operations
 * - Testing validation for rollback scenarios
 * - Communication plan and stakeholder notification
 *
 * Domain packs: example fixtures under `examples/domains/<domain>/` are an
 * opt-in convention. Set `LIDR_DOMAIN_PACK=biometric` to additionally validate
 * the biometric/identity example fixtures (see BIOMETRIC_DOMAIN_PACK below).
 *
 * Usage:
 *   npx tsx scripts/validate-examples.ts                       # generic only
 *   LIDR_DOMAIN_PACK=biometric npx tsx scripts/validate-examples.ts  # + biometric pack
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";

interface ValidationRule {
  name: string;
  description: string;
  check: (content: string) => boolean;
  severity: "ERROR" | "WARN";
}

const ROLLBACK_STRUCTURE_RULES: ValidationRule[] = [
  {
    name: "Rollback Plan Header",
    description: "Must contain deployment information and rollback plan metadata",
    check: (content) => content.includes("Rollback Plan") && content.includes("Deployment"),
    severity: "ERROR",
  },
  {
    name: "Change Analysis",
    description: "Must analyze changes being deployed and their impact",
    check: (content) => content.includes("Change Analysis") && content.includes("Impact"),
    severity: "ERROR",
  },
  {
    name: "Rollback Procedures",
    description: "Must include detailed step-by-step rollback procedures",
    check: (content) => content.includes("Rollback Procedures") && content.includes("Step"),
    severity: "ERROR",
  },
  {
    name: "Database Rollback",
    description: "Must address database migration rollback if applicable",
    check: (content) => content.includes("Database") && content.includes("migration"),
    severity: "WARN",
  },
  {
    name: "Testing Validation",
    description: "Must include post-rollback validation steps",
    check: (content) => content.includes("Testing") && content.includes("Validation"),
    severity: "ERROR",
  },
];

const RISK_ASSESSMENT_RULES: ValidationRule[] = [
  {
    name: "Rollback Risk Assessment",
    description: "Must assess risks associated with rollback operation",
    check: (content) => content.includes("Risk Assessment") && content.includes("rollback"),
    severity: "ERROR",
  },
  {
    name: "Downtime Estimate",
    description: "Must estimate downtime required for rollback",
    check: (content) => content.includes("downtime") && content.includes("minutes"),
    severity: "ERROR",
  },
  {
    name: "Dependencies Impact",
    description: "Should identify impact on dependent systems",
    check: (content) => content.includes("Dependencies") || content.includes("dependent"),
    severity: "WARN",
  },
  {
    name: "Data Loss Risk",
    description: "Should assess potential data loss risks",
    check: (content) => content.includes("data loss") || content.includes("Data"),
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

  // DEFAULT validation set — 100% domain-agnostic.
  const validationCases = [
    {
      file: "generic/deployment-rollback-plan-template.md",
      rules: [...ROLLBACK_STRUCTURE_RULES, ...RISK_ASSESSMENT_RULES],
      description: "Generic Deployment Rollback Plan Structure",
    },
  ];

  // Opt-in biometric/identity domain pack. The validation RULES are identical
  // and domain-agnostic; only the example FIXTURES under examples/domains/biometric/
  // are biometric. Spread into validationCases ONLY when the domain pack is selected.
  const BIOMETRIC_DOMAIN_PACK = [
    {
      file: "domains/biometric/platform-api-gateway-rollback.md",
      rules: [...ROLLBACK_STRUCTURE_RULES, ...RISK_ASSESSMENT_RULES],
      description: "Biometric Platform API Gateway Rollback Plan Structure",
    },
    {
      file: "domains/biometric/selphi-algorithm-rollback-plan.md",
      rules: [...ROLLBACK_STRUCTURE_RULES, ...RISK_ASSESSMENT_RULES],
      description: "Biometric Algorithm Rollback Plan Structure",
    },
  ];

  if (process.env.LIDR_DOMAIN_PACK === "biometric") {
    validationCases.push(...BIOMETRIC_DOMAIN_PACK);
  }

  console.log("🔍 Validating Rollback Plan Skill Examples...\n");

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
      "\n🎉 All Rollback Plan examples are properly structured!\n   Ready for automated deployment risk analysis and rollback planning."
    );
  } else {
    console.log("\n💡 Fix the validation errors to ensure reliable rollback procedures.");
  }

  process.exit(allValid ? 0 : 1);
}

if (typeof import.meta !== "undefined" && import.meta.url.endsWith("validate-examples.ts")) {
  main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}
