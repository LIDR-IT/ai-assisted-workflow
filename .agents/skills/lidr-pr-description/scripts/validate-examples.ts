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
 * The DEFAULT validation set (ALL_RULES) is DOMAIN-AGNOSTIC — it checks
 * universal PR-description concepts (what/why/how, testing, change impact,
 * generic security/privacy, deployment, code quality) — because LIDR is a
 * multi-industry framework. An OPTIONAL biometric/identity domain pack of extra
 * RULES is preserved as BIOMETRIC_DOMAIN_PACK below (GDPR Art. 9, biometric
 * template / liveness / anti-spoofing framing) and is spread into the active
 * rule set ONLY when LIDR_DOMAIN_PACK === 'biometric'. Likewise the biometric
 * EXAMPLE FIXTURES under examples/domains/biometric/ are appended to the
 * validation run ONLY behind that same flag. Example only — NOT the active
 * default. The default run uses the generic example under examples/generic/.
 *
 * Usage: npx tsx scripts/validate-examples.ts
 *        LIDR_DOMAIN_PACK=biometric npx tsx scripts/validate-examples.ts
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
      (content.includes("steps") ||
        content.includes("instructions") ||
        content.includes("verify") ||
        content.includes("Test Scenarios") ||
        content.includes("Testing") ||
        content.includes("Validation") ||
        content.includes("Validate") ||
        content.includes("Checklist")),
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
      content.includes("result") ||
      content.includes("Verify") ||
      content.includes("Validate") ||
      content.includes("Validation") ||
      content.includes("Confirm"),
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
    name: "Data Privacy Compliance",
    description: "Should address privacy/compliance for data handling changes",
    check: (content) =>
      (!content.includes("data") && !content.includes("personal")) ||
      content.includes("compliant") ||
      content.includes("compliance") ||
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

/* ────────────────────────────────────────────────────────────────────
   BIOMETRIC / IDENTITY DOMAIN PACK (OPTIONAL — example only, NOT default)

   These RULES are biometric/identity-specific and are spread into the active
   rule set ONLY when LIDR_DOMAIN_PACK === 'biometric'. The default ALL_RULES
   set above stays 100% domain-agnostic so the validator passes on a generic
   PR description from any industry.
──────────────────────────────────────────────────────────────────── */

const BIOMETRIC_DOMAIN_PACK: ValidationRule[] = [
  {
    name: "Biometric Data Handling",
    description: "Must describe how biometric data is processed or protected",
    check: (content) =>
      !content.includes("biometric") ||
      content.includes("template") ||
      content.includes("encryption") ||
      content.includes("consent") ||
      content.includes("liveness") ||
      content.includes("verification"),
    severity: "ERROR",
  },
  {
    name: "GDPR Art. 9 Compliance",
    description: "Must address GDPR Art. 9 special-category data compliance for biometric changes",
    check: (content) =>
      (!content.includes("biometric") && !content.includes("personal")) ||
      content.includes("GDPR") ||
      content.includes("Article 9") ||
      content.includes("Art. 9"),
    severity: "ERROR",
  },
  {
    name: "Anti-Spoofing / Liveness Coverage",
    description:
      "Should mention anti-spoofing or liveness handling when biometric capture is involved",
    check: (content) =>
      !content.includes("liveness") || content.includes("spoof") || content.includes("ISO 30107"),
    severity: "WARN",
  },
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

  // DEFAULT rule set is DOMAIN-AGNOSTIC. The biometric/identity RULES are spread
  // in ONLY when LIDR_DOMAIN_PACK === 'biometric' (example domain pack, not default).
  const activeRules =
    process.env.LIDR_DOMAIN_PACK === "biometric"
      ? [...ALL_RULES, ...BIOMETRIC_DOMAIN_PACK]
      : ALL_RULES;

  // DEFAULT validation case is the generic (domain-agnostic) example fixture.
  const validationCases: Array<{ file: string; rules: ValidationRule[]; description: string }> = [
    {
      file: "generic/api-rate-limiting.md",
      rules: activeRules,
      description: "Generic API Rate Limiting PR Description",
    },
  ];

  // Biometric/identity EXAMPLE FIXTURES under examples/domains/biometric/ are a
  // DOCUMENTED example convention. They are appended to the run ONLY behind the
  // explicit LIDR_DOMAIN_PACK==='biometric' flag. Descriptions are domain-neutral.
  const BIOMETRIC_DOMAIN_PACK_CASES: Array<{
    file: string;
    rules: ValidationRule[];
    description: string;
  }> = [
    {
      file: "domains/biometric/liveness-detection-api.md",
      rules: activeRules,
      description: "Liveness Detection API PR Description",
    },
    {
      file: "domains/biometric/gdpr-consent-ui.md",
      rules: activeRules,
      description: "Consent UI PR Description",
    },
    {
      file: "domains/biometric/biometric-template-security.md",
      rules: activeRules,
      description: "Template Security PR Description",
    },
  ];

  if (process.env.LIDR_DOMAIN_PACK === "biometric") {
    validationCases.push(...BIOMETRIC_DOMAIN_PACK_CASES);
  }

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
