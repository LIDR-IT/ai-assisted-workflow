#!/usr/bin/env tsx
/**
 * validate-examples.ts - Cross-Review Skill Example Validator
 *
 * Validates that review-cruzado skill examples contain proper structure
 * for PRD alignment validation before Gate 1.
 *
 * The DEFAULT validation set is 100% domain-agnostic (structure, severity
 * classification, status indicators, impact analysis, gate readiness). An
 * overridable EXAMPLE industry pack (biometric identity) is preserved below as
 * the BIOMETRIC_DOMAIN_PACK_* constants and is applied ONLY behind an explicit
 * flag (`LIDR_DOMAIN_PACK=biometric`). It is documentation/example only and is
 * NOT part of the default behavior.
 *
 * Validates:
 * - Cross-review findings reports with severity classification
 * - Alignment matrix structure with status indicators
 * - Compliance validation sections
 * - Gate readiness assessment format
 *
 * Usage: npx tsx scripts/validate-examples.ts
 *        LIDR_DOMAIN_PACK=biometric npx tsx scripts/validate-examples.ts
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";

/* ────────────────────────────────────────────────────────────────────
   VALIDATION RULES
──────────────────────────────────────────────────────────────────── */

interface ValidationRule {
  name: string;
  description: string;
  check: (content: string) => boolean;
  severity: "ERROR" | "WARN";
}

const FINDINGS_REPORT_RULES: ValidationRule[] = [
  {
    name: "Executive Summary Table",
    description: "Must contain dimension status table with critical/minor issue counts",
    check: (content) => content.includes("Dimension | Status | Critical Issues | Minor Issues"),
    severity: "ERROR",
  },
  {
    name: "Critical Findings Section",
    description: "Must detail critical findings with CF-XXX identifiers",
    check: (content) => content.includes("CRITICAL FINDINGS") && content.includes("CF-"),
    severity: "ERROR",
  },
  {
    name: "Status Indicators",
    description: "Must use standard status indicators (✅ ALIGNED, ⚠️ CONDITIONAL, ❌ MISALIGNED)",
    check: (content) =>
      content.includes("✅ ALIGNED") &&
      content.includes("❌ MISALIGNED") &&
      content.includes("⚠️ CONDITIONAL"),
    severity: "ERROR",
  },
  {
    name: "Compliance Section",
    description: "Must validate compliance/regulatory alignment between PRD-F and PRD-T",
    check: (content) =>
      content.includes("Compliance") ||
      content.includes("Regulatory") ||
      content.includes("compliance"),
    severity: "ERROR",
  },
  {
    name: "Impact Analysis",
    description:
      "Critical findings must include business impact, regulatory risk, and technical risk",
    check: (content) =>
      content.includes("Business Risk") &&
      content.includes("Regulatory Risk") &&
      content.includes("Technical Risk"),
    severity: "ERROR",
  },
  {
    name: "Action Items",
    description: "Must include assigned owners and deadlines for critical findings",
    check: (content) => content.includes("Assigned to") && content.includes("Resolution Deadline"),
    severity: "ERROR",
  },
  {
    name: "Gate Readiness Assessment",
    description: "Must provide clear Gate 1 readiness status and conditions",
    check: (content) =>
      content.includes("Gate 1 Readiness") && content.includes("Conditions for Gate 1"),
    severity: "ERROR",
  },
  {
    name: "Team Consensus",
    description: "Must document team alignment session with attendees",
    check: (content) => content.includes("Team Alignment Session") && content.includes("Attendees"),
    severity: "WARN",
  },
];

const ALIGNMENT_MATRIX_RULES: ValidationRule[] = [
  {
    name: "Matrix Overview",
    description: "Must explain alignment matrix purpose and status indicators",
    check: (content) =>
      content.includes("Alignment Matrix Overview") && content.includes("Matrix Key"),
    severity: "ERROR",
  },
  {
    name: "Functionalities Matrix",
    description: "Must map PRD-F functionalities to PRD-T capabilities",
    check: (content) =>
      content.includes("Functionalities Alignment") &&
      content.includes("PRD-F Functionality | PRD-T Capability"),
    severity: "ERROR",
  },
  {
    name: "User Journey API Mapping",
    description: "Must map user journey steps to API endpoints",
    check: (content) =>
      content.includes("User Journey ↔ API Flow Mapping") &&
      content.includes("PRD-F User Journey Step | PRD-T API Endpoint"),
    severity: "ERROR",
  },
  {
    name: "Compliance Matrix",
    description: "Must validate compliance requirements against technical implementation",
    check: (content) =>
      content.includes("Compliance ↔ Technical Implementation") ||
      content.includes("Compliance Matrix"),
    severity: "ERROR",
  },
  {
    name: "Performance Alignment",
    description: "Must compare performance expectations with system capabilities",
    check: (content) =>
      content.includes("Performance Expectations ↔ System Capabilities") &&
      content.includes("Performance Target"),
    severity: "ERROR",
  },
  {
    name: "Status Indicators",
    description: "Must use ✅ ALIGNED, ⚠️ PARTIAL, ❌ MISALIGNED, ⭕ MISSING indicators",
    check: (content) =>
      content.includes("✅ ALIGNED") &&
      content.includes("⚠️ PARTIAL") &&
      content.includes("❌ MISALIGNED") &&
      content.includes("⭕ MISSING"),
    severity: "ERROR",
  },
  {
    name: "Critical Gaps Summary",
    description: "Must summarize critical alignment gaps requiring resolution",
    check: (content) =>
      content.includes("Critical Alignment Gaps") &&
      content.includes("Immediate Resolution Required"),
    severity: "ERROR",
  },
];

/* ────────────────────────────────────────────────────────────────────
   OVERRIDABLE EXAMPLE — biometric-identity industry pack (NOT DEFAULT).
   These rules are applied ONLY when LIDR_DOMAIN_PACK=biometric. They are
   documentation/example content showing how a domain pack layers extra,
   domain-specific checks on top of the agnostic defaults above.
──────────────────────────────────────────────────────────────────── */

const BIOMETRIC_DOMAIN_PACK_FINDINGS_RULES: ValidationRule[] = [
  {
    name: "GDPR Article 9 Section",
    description: "Must validate GDPR Article 9 compliance alignment (biometric data)",
    check: (content) => content.includes("GDPR") && content.includes("Article 9"),
    severity: "ERROR",
  },
];

const BIOMETRIC_DOMAIN_PACK_MATRIX_RULES: ValidationRule[] = [
  {
    name: "GDPR Compliance Matrix",
    description: "Must validate GDPR requirements against technical implementation",
    check: (content) =>
      content.includes("GDPR Compliance ↔ Technical Implementation") &&
      content.includes("Right to Erasure"),
    severity: "ERROR",
  },
  {
    name: "Biometric-Specific Validation",
    description: "Must include biometric domain specifics (voice, face, liveness, templates)",
    check: (content) =>
      content.includes("Voice") && (content.includes("Face") || content.includes("Facial")),
    severity: "WARN",
  },
];

const DOMAIN_PACK_ENABLED = process.env.LIDR_DOMAIN_PACK === "biometric";

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

  const validationCases = [
    {
      file: "cross-review-findings-report.md",
      rules: DOMAIN_PACK_ENABLED
        ? [...FINDINGS_REPORT_RULES, ...BIOMETRIC_DOMAIN_PACK_FINDINGS_RULES]
        : FINDINGS_REPORT_RULES,
      description: "Cross-Review Findings Report Structure",
    },
    {
      file: "alignment-matrix-analysis.md",
      rules: DOMAIN_PACK_ENABLED
        ? [...ALIGNMENT_MATRIX_RULES, ...BIOMETRIC_DOMAIN_PACK_MATRIX_RULES]
        : ALIGNMENT_MATRIX_RULES,
      description: "Alignment Matrix Format",
    },
  ];

  if (DOMAIN_PACK_ENABLED) {
    console.log("ℹ️  LIDR_DOMAIN_PACK=biometric — applying optional biometric domain rules.\n");
  }

  console.log("🔍 Validating Review-Cruzado Skill Examples...\n");

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
    console.log("\n🎉 All cross-review examples are properly structured!");
    console.log("   Ready for PRD alignment validation before Gate 1.");
  } else {
    console.log("\n💡 Fix the validation errors to ensure Gate 1 readiness assessment.");
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
