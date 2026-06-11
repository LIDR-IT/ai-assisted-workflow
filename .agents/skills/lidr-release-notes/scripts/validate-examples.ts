#!/usr/bin/env tsx
/**
 * validate-examples.ts - Release Notes Skill Example Validator
 *
 * Validates that release-notes skill examples contain proper structure
 * for automated release notes generation with business impact analysis.
 *
 * The DEFAULT validation set is 100% domain-agnostic — it applies to any
 * product, stack, or industry. Domain-specific rule packs (e.g. biometric)
 * are opt-in and only activate when `LIDR_DOMAIN_PACK` is set; example
 * fixtures for a domain live under `examples/domains/<domain>/` per the
 * documented example convention.
 *
 * Validates (default, domain-agnostic):
 * - Executive summary with key metrics and business impact
 * - What's new section with categorized features
 * - Technical enhancements with detailed specifications
 * - Developer experience improvements
 * - Migration guidance and deployment instructions
 * - Proper versioning and compatibility information
 *
 * Optional domain packs (set LIDR_DOMAIN_PACK to enable):
 * - biometric: identity/liveness/anti-spoof/FAR-FRR/GDPR-Art9 terminology
 *
 * Usage:
 *   npx tsx scripts/validate-examples.ts                       # generic only
 *   LIDR_DOMAIN_PACK=biometric npx tsx scripts/validate-examples.ts  # + biometric pack
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* ────────────────────────────────────────────────────────────────────
   VALIDATION RULES
──────────────────────────────────────────────────────────────────── */

interface ValidationRule {
  name: string;
  description: string;
  check: (content: string) => boolean;
  severity: "ERROR" | "WARN";
}

const RELEASE_HEADER_RULES: ValidationRule[] = [
  {
    name: "Release Header Information",
    description: "Must contain version, release date, build info, and compatibility",
    check: (content) =>
      content.includes("**Release Date**:") &&
      content.includes("**Version**:") &&
      content.includes("**Build**:") &&
      content.includes("**Compatibility**:"),
    severity: "ERROR",
  },
  {
    name: "Version Format",
    description: "Must follow semantic versioning format (X.Y.Z)",
    check: (content) => /\*\*Version\*\*:\s+(\d+\.\d+\.\d+|\{\{VERSION\}\})/.test(content),
    severity: "ERROR",
  },
  {
    name: "Release Title",
    description: "Must have clear release title with product and version",
    check: (content) =>
      content.includes("Release Notes") &&
      (/v\d+\.\d+\.\d+/.test(content) || content.includes("{{VERSION}}")),
    severity: "ERROR",
  },
  {
    name: "Compatibility Information",
    description: "Must specify platform compatibility requirements",
    check: (content) =>
      content.includes("iOS") ||
      content.includes("Android") ||
      content.includes("Web") ||
      content.includes("{{COMPATIBILITY_REQUIREMENTS}}"),
    severity: "ERROR",
  },
];

const EXECUTIVE_SUMMARY_RULES: ValidationRule[] = [
  {
    name: "Executive Summary Section",
    description: "Must have executive summary with high-level overview",
    check: (content) =>
      content.includes("## 🎯 Executive Summary") || content.includes("## Executive Summary"),
    severity: "ERROR",
  },
  {
    name: "Key Metrics Improvement",
    description: "Must include quantified metrics showing improvement",
    check: (content) =>
      content.includes("Key Metrics") &&
      (content.includes("%") || /\{\{IMPROVEMENT_\d+\}\}/.test(content)) &&
      (content.includes("→") || content.includes("up from") || content.includes("improved")),
    severity: "ERROR",
  },
  {
    name: "Business Impact Section",
    description: "Must articulate business value and impact",
    check: (content) => content.includes("Business Impact") && content.includes("**"),
    severity: "ERROR",
  },
  {
    name: "Performance Metrics",
    description: "Should include specific performance improvements with numbers",
    check: (content) =>
      (content.includes("faster") ||
        content.includes("speed") ||
        content.includes("performance")) &&
      (content.includes("%") || content.includes("ms") || content.includes("s")),
    severity: "WARN",
  },
  {
    name: "Accuracy Improvements",
    description: "Should highlight accuracy or quality improvements",
    check: (content) =>
      content.includes("accuracy") || content.includes("precision") || content.includes("false"),
    severity: "WARN",
  },
];

const WHATS_NEW_RULES: ValidationRule[] = [
  {
    name: "What's New Section",
    description: "Must have dedicated section for new features",
    check: (content) => content.includes("## ✨ What's New") || content.includes("## What's New"),
    severity: "ERROR",
  },
  {
    name: "Feature Categorization",
    description: "Must categorize new features by type or domain",
    check: (content) => content.includes("### ") && content.includes("**"),
    severity: "ERROR",
  },
  {
    name: "Feature Descriptions",
    description: "Must provide detailed descriptions of new features",
    check: (content) => content.includes("- **") && content.includes(":"),
    severity: "ERROR",
  },
  {
    name: "Security Enhancements",
    description: "Should highlight security improvements",
    check: (content) => content.includes("Security") || content.includes("security"),
    severity: "WARN",
  },
  {
    name: "User Experience Improvements",
    description: "Should mention user experience enhancements",
    check: (content) =>
      content.includes("User Experience") || content.includes("UX") || content.includes("user"),
    severity: "WARN",
  },
];

const TECHNICAL_DETAILS_RULES: ValidationRule[] = [
  {
    name: "Technical Enhancements Section",
    description: "Must include technical implementation details",
    check: (content) =>
      content.includes("## 🔧 Technical Enhancements") || content.includes("## Technical"),
    severity: "ERROR",
  },
  {
    name: "Algorithm Improvements",
    description: "Must detail core algorithm improvements",
    check: (content) =>
      (content.includes("Algorithm") && content.includes("Engine")) ||
      /\{\{TECHNICAL_CATEGORY_\d+\}\}/.test(content),
    severity: "ERROR",
  },
  {
    name: "API Changes",
    description: "Must document API improvements and changes",
    check: (content) =>
      content.includes("API") &&
      (content.includes("Improvements") ||
        content.includes("API Changes") ||
        /\{\{API_ENHANCEMENT_\d+\}\}/.test(content)),
    severity: "ERROR",
  },
  {
    name: "Code Examples",
    description: "Should include code examples or configuration snippets",
    check: (content) =>
      content.includes("```") &&
      (content.includes("javascript") || content.includes("json") || content.includes("yaml")),
    severity: "WARN",
  },
  {
    name: "Technical Specifications",
    description: "Should provide specific technical parameters and thresholds",
    check: (content) =>
      content.includes("MB") ||
      content.includes("GB") ||
      content.includes("MHz") ||
      content.includes("dimensional"),
    severity: "WARN",
  },
];

const DEVELOPER_EXPERIENCE_RULES: ValidationRule[] = [
  {
    name: "Developer Experience Section",
    description: "Should include developer-focused improvements",
    check: (content) =>
      content.includes("## 🏗️ Developer Experience") || content.includes("## Developer"),
    severity: "WARN",
  },
  {
    name: "SDK Integration Improvements",
    description: "Should mention SDK or integration enhancements",
    check: (content) =>
      content.includes("SDK") || content.includes("Integration") || content.includes("integration"),
    severity: "WARN",
  },
  {
    name: "Documentation Updates",
    description: "Should mention documentation improvements",
    check: (content) => content.includes("Documentation") || content.includes("documentation"),
    severity: "WARN",
  },
  {
    name: "Testing Improvements",
    description: "Should mention testing tools or capabilities",
    check: (content) =>
      content.includes("Testing") || content.includes("test") || content.includes("Debug"),
    severity: "WARN",
  },
];

/* ────────────────────────────────────────────────────────────────────
   OPT-IN DOMAIN PACK — BIOMETRIC / IDENTITY
   These rules are NOT part of the default (domain-agnostic) validation set.
   They are spread into validationCases ONLY when LIDR_DOMAIN_PACK==='biometric'.
   The default validator path must never reference biometric / liveness /
   anti-spoof / FAR / FRR / GDPR-Art9 / ISO-30107 / Selphi terminology.
──────────────────────────────────────────────────────────────────── */
const BIOMETRIC_DOMAIN_PACK: ValidationRule[] = [
  {
    name: "Biometric Terminology",
    description: "Should use proper biometric domain terminology",
    check: (content) =>
      content.includes("biometric") ||
      content.includes("template") ||
      content.includes("facial") ||
      content.includes("liveness"),
    severity: "WARN",
  },
  {
    name: "Anti-Spoofing Details",
    description: "Should detail anti-spoofing improvements",
    check: (content) =>
      content.includes("anti-spoofing") ||
      content.includes("spoofing") ||
      content.includes("deepfake"),
    severity: "WARN",
  },
  {
    name: "Accuracy Metrics",
    description: "Should include biometric accuracy metrics (FAR/FRR)",
    check: (content) =>
      content.includes("False Accept") ||
      content.includes("False Reject") ||
      content.includes("accuracy"),
    severity: "WARN",
  },
  {
    name: "GDPR Compliance",
    description: "Should mention GDPR compliance for biometric data",
    check: (content) => content.includes("GDPR") && content.includes("compliance"),
    severity: "WARN",
  },
  {
    name: "Template Management",
    description: "Should mention biometric template handling",
    check: (content) =>
      content.includes("template") &&
      (content.includes("encryption") || content.includes("storage")),
    severity: "WARN",
  },
];

const MIGRATION_DEPLOYMENT_RULES: ValidationRule[] = [
  {
    name: "Breaking Changes Section",
    description: "Should identify breaking changes and migration steps",
    check: (content) =>
      content.includes("Breaking") ||
      content.includes("Migration") ||
      content.includes("migration"),
    severity: "WARN",
  },
  {
    name: "Deployment Instructions",
    description: "Should provide deployment guidance",
    check: (content) =>
      content.includes("deployment") || content.includes("install") || content.includes("upgrade"),
    severity: "WARN",
  },
  {
    name: "Known Issues",
    description: "Should list known issues or limitations",
    check: (content) => content.includes("Known Issues") || content.includes("Limitations"),
    severity: "WARN",
  },
  {
    name: "Support Information",
    description: "Should provide support or contact information",
    check: (content) =>
      content.includes("Support") || content.includes("contact") || content.includes("help"),
    severity: "WARN",
  },
];

/* ────────────────────────────────────────────────────────────────────
   VALIDATION ENGINE
──────────────────────────────────────────────────────────────────── */

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

/* ────────────────────────────────────────────────────────────────────
   MAIN VALIDATION
──────────────────────────────────────────────────────────────────── */

async function main(): Promise<void> {
  const examplesDir = join(__dirname, "../examples");

  if (!existsSync(examplesDir)) {
    console.error("❌ Examples directory not found");
    process.exit(1);
  }

  // DEFAULT validation set — 100% domain-agnostic. Runs for every product/stack.
  const validationCases = [
    {
      file: "generic/release-notes-template.md",
      rules: [
        ...RELEASE_HEADER_RULES,
        ...EXECUTIVE_SUMMARY_RULES,
        ...WHATS_NEW_RULES,
        ...TECHNICAL_DETAILS_RULES,
        ...MIGRATION_DEPLOYMENT_RULES,
      ],
      description: "Generic Release Notes Template Structure",
    },
  ];

  // OPT-IN domain pack — biometric/identity. Only active when explicitly enabled.
  // The example fixture under examples/domains/biometric/ is a documented
  // example convention (example data, not a default rule).
  if (process.env.LIDR_DOMAIN_PACK === "biometric") {
    validationCases.push({
      file: "domains/biometric/selphi-sdk-v4.2.1-release-notes.md",
      rules: [
        ...RELEASE_HEADER_RULES,
        ...EXECUTIVE_SUMMARY_RULES,
        ...WHATS_NEW_RULES,
        ...TECHNICAL_DETAILS_RULES,
        ...DEVELOPER_EXPERIENCE_RULES,
        ...BIOMETRIC_DOMAIN_PACK,
        ...MIGRATION_DEPLOYMENT_RULES,
      ],
      description: "Biometric SDK Release Notes Structure (LIDR_DOMAIN_PACK=biometric)",
    });
  }

  console.log("🔍 Validating Release Notes Skill Examples...\n");

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

  // Summary
  console.log("─".repeat(60));
  console.log(`📊 Validation Summary:`);
  console.log(`   ✅ ${totalPassed} rules passed`);
  console.log(`   ❌ ${totalFailed} rules failed`);
  console.log(`   ⚠️ ${totalWarnings} warnings`);

  if (allValid) {
    console.log("\n🎉 All Release Notes examples are properly structured!");
    console.log("   Ready for automated release notes generation and publication.");
  } else {
    console.log("\n💡 Fix the validation errors to ensure comprehensive release documentation.");
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
