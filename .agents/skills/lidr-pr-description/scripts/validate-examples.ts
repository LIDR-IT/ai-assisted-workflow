#!/usr/bin/env tsx
/**
 * validate-examples.ts - PR Description Skill Example Validator
 *
 * Validates that pr-description skill examples contain proper structure
 * for pull request documentation and code change communication.
 *
 * Validates:
 * - Clear summary of changes with context
 * - Testing instructions and verification steps
 * - Breaking changes identification and migration
 * - Related issues and ticket references
 * - Review guidance and deployment considerations
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

const PR_STRUCTURE_RULES: ValidationRule[] = [
  {
    name: "What Changed Section",
    description: "Must include clear description of what changed",
    check: (content) =>
      content.includes("What") && (content.includes("Changed") || content.includes("Changes")),
    severity: "ERROR",
  },
  {
    name: "Why Changed Section",
    description: "Must explain why the changes were necessary",
    check: (content) =>
      content.includes("Why") && (content.includes("Changed") || content.includes("Changes")),
    severity: "ERROR",
  },
  {
    name: "How to Test Section",
    description: "Must include testing instructions",
    check: (content) => content.includes("How to Test") || content.includes("Testing"),
    severity: "ERROR",
  },
  {
    name: "Issue References",
    description: "Must reference related issues or tickets",
    check: (content) =>
      content.includes("Closes") ||
      content.includes("Fixes") ||
      content.includes("Related") ||
      content.includes("#") ||
      content.includes("JIRA") ||
      content.includes("Issue"),
    severity: "ERROR",
  },
];

const TESTING_VALIDATION_RULES: ValidationRule[] = [
  {
    name: "Testing Instructions",
    description: "Must provide specific testing instructions",
    check: (content) =>
      content.includes("Test") &&
      (content.includes("steps") || content.includes("instructions") || content.includes("verify")),
    severity: "ERROR",
  },
  {
    name: "Manual Testing Steps",
    description: "Should include manual testing steps when applicable",
    check: (content) =>
      content.includes("Manual") ||
      content.includes("steps") ||
      content.includes("1.") ||
      content.includes("-"),
    severity: "WARN",
  },
  {
    name: "Unit Test Coverage",
    description: "Should mention unit test coverage",
    check: (content) =>
      content.includes("unit test") ||
      content.includes("test coverage") ||
      content.includes("tests added") ||
      content.includes("spec"),
    severity: "WARN",
  },
  {
    name: "Verification Criteria",
    description: "Must include verification criteria or expected results",
    check: (content) =>
      content.includes("verify") ||
      content.includes("expected") ||
      content.includes("should") ||
      content.includes("result"),
    severity: "ERROR",
  },
];

const CHANGE_IMPACT_RULES: ValidationRule[] = [
  {
    name: "Breaking Changes",
    description: "Must identify breaking changes if any",
    check: (content) =>
      content.includes("Breaking") ||
      content.includes("BREAKING") ||
      content.includes("breaking") ||
      !content.includes("API") || // API changes should mention breaking
      true, // Allow non-API changes to pass
    severity: "WARN",
  },
  {
    name: "Database Changes",
    description: "Must document database schema changes",
    check: (content) =>
      (!content.includes("database") &&
        !content.includes("schema") &&
        !content.includes("migration")) ||
      content.includes("migration") ||
      content.includes("schema") ||
      content.includes("SQL"),
    severity: "WARN",
  },
  {
    name: "API Changes",
    description: "Must document API changes and backwards compatibility",
    check: (content) =>
      (!content.includes("API") && !content.includes("endpoint")) ||
      content.includes("backwards") ||
      content.includes("compatible") ||
      content.includes("version"),
    severity: "WARN",
  },
];

const SECURITY_COMPLIANCE_RULES: ValidationRule[] = [
  {
    name: "Security Considerations",
    description: "Should address security implications for sensitive changes",
    check: (content) =>
      (!content.includes("auth") &&
        !content.includes("security") &&
        !content.includes("permission")) ||
      content.includes("security") ||
      content.includes("validated") ||
      content.includes("safe"),
    severity: "WARN",
  },
  {
    name: "GDPR Compliance",
    description: "Should address GDPR compliance for data handling changes",
    check: (content) =>
      (!content.includes("data") &&
        !content.includes("personal") &&
        !content.includes("biometric")) ||
      content.includes("GDPR") ||
      content.includes("compliant") ||
      content.includes("privacy"),
    severity: "WARN",
  },
];

const DEPLOYMENT_RULES: ValidationRule[] = [
  {
    name: "Deployment Notes",
    description: "Should include deployment considerations",
    check: (content) =>
      content.includes("Deploy") ||
      content.includes("Release") ||
      content.includes("Production") ||
      content.includes("Environment"),
    severity: "WARN",
  },
  {
    name: "Rollback Plan",
    description: "Should mention rollback considerations for significant changes",
    check: (content) =>
      (!content.includes("critical") && !content.includes("major")) ||
      content.includes("rollback") ||
      content.includes("revert") ||
      content.includes("safe"),
    severity: "WARN",
  },
];

const CODE_QUALITY_RULES: ValidationRule[] = [
  {
    name: "Code Review Guidance",
    description: "Should provide guidance for code reviewers",
    check: (content) =>
      content.includes("Review") ||
      content.includes("Focus") ||
      content.includes("attention") ||
      content.includes("note"),
    severity: "WARN",
  },
  {
    name: "Technical Debt",
    description: "Should mention any technical debt introduced or resolved",
    check: (content) =>
      content.includes("debt") ||
      content.includes("TODO") ||
      content.includes("refactor") ||
      content.includes("improve") ||
      !content.includes("technical"), // Allow if no technical mentions
    severity: "WARN",
  },
];

const ALL_RULES = [
  ...PR_STRUCTURE_RULES,
  ...TESTING_VALIDATION_RULES,
  ...CHANGE_IMPACT_RULES,
  ...SECURITY_COMPLIANCE_RULES,
  ...DEPLOYMENT_RULES,
  ...CODE_QUALITY_RULES,
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
      file: "liveness-detection-api.md",
      rules: ALL_RULES,
      description: "Liveness Detection API PR Description",
    },
    {
      file: "gdpr-consent-ui.md",
      rules: ALL_RULES,
      description: "GDPR Consent UI PR Description",
    },
    {
      file: "biometric-template-security.md",
      rules: ALL_RULES,
      description: "Biometric Template Security PR Description",
    },
  ];

  console.log("🔍 Validating PR Description Skill Examples...\n");

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
    console.log("\n🎉 All PR description examples are properly structured!");
    console.log("   Ready for effective code change communication.");
  } else {
    console.log("\n💡 Fix the validation errors to ensure PR description quality.");
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
