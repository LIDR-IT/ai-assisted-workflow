#!/usr/bin/env tsx
/**
 * validate-examples.ts - Risk Log Skill Example Validator
 *
 * Validates that risk-log skill examples contain proper structure
 * for project risk management throughout the SDLC lifecycle.
 *
 * The DEFAULT validation set is 100% domain-agnostic (risk log header,
 * risk categories, probability/impact matrix, mitigation strategies, risk
 * ownership, plus generic technical/compliance/security/performance risk
 * checks). An overridable EXAMPLE industry pack (biometric identity) is
 * preserved below as the BIOMETRIC_DOMAIN_PACK constant and is applied ONLY
 * behind an explicit flag (`LIDR_DOMAIN_PACK=biometric`). It is
 * documentation/example only and is NOT part of the default behavior.
 *
 * Validates:
 * - Risk identification with structured risk categories
 * - Risk assessment with probability and impact scoring
 * - Mitigation strategies with ownership and timelines
 * - Risk monitoring and status tracking
 * - Compliance and regulatory risk assessment
 *
 * Usage: npx tsx scripts/validate-examples.ts
 *        LIDR_DOMAIN_PACK=biometric npx tsx scripts/validate-examples.ts
 */

import { readFileSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

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

// DOMAIN-AGNOSTIC: applies to every risk log regardless of industry.
const CORE_RISK_DOMAIN_RULES: ValidationRule[] = [
  {
    name: "Technical Risks",
    description: "Must identify technical risks (accuracy, reliability, integration, data)",
    check: (content) =>
      content.includes("accuracy") ||
      content.includes("reliability") ||
      content.includes("integration") ||
      content.includes("data"),
    severity: "ERROR",
  },
  {
    name: "Compliance Risks",
    description: "Must address regulatory / compliance risks",
    check: (content) =>
      content.includes("compliance") ||
      content.includes("Compliance") ||
      content.includes("regulatory") ||
      content.includes("regulation"),
    severity: "ERROR",
  },
  {
    name: "Security Risks",
    description: "Should identify security and threat risks",
    check: (content) => content.includes("security") || content.includes("Security"),
    severity: "WARN",
  },
  {
    name: "Performance Risks",
    description: "Should identify performance and scalability risks",
    check: (content) => content.includes("performance") || content.includes("latency"),
    severity: "WARN",
  },
];

/* ────────────────────────────────────────────────────────────────────
   OVERRIDABLE EXAMPLE — biometric-identity industry pack (NOT DEFAULT).
   These rules are applied ONLY when LIDR_DOMAIN_PACK=biometric. They are
   documentation/example content showing how a domain pack layers extra,
   domain-specific risk checks (biometric accuracy/template, GDPR Art. 9,
   anti-spoofing/liveness) on top of the agnostic defaults. They are NOT
   spread into the default validation set.
──────────────────────────────────────────────────────────────────── */

const BIOMETRIC_DOMAIN_PACK: ValidationRule[] = [
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
    description: "Should identify anti-spoofing and liveness security risks",
    check: (content) => content.includes("spoofing") || content.includes("liveness"),
    severity: "WARN",
  },
];

const DOMAIN_PACK_ENABLED = process.env.LIDR_DOMAIN_PACK === "biometric";

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

  // DEFAULT (domain-agnostic) rule set applied to every risk-log example.
  const DEFAULT_RISK_RULES = [...RISK_STRUCTURE_RULES, ...CORE_RISK_DOMAIN_RULES];

  // Optional biometric domain pack — appended ONLY when LIDR_DOMAIN_PACK=biometric.
  const activeRules = DOMAIN_PACK_ENABLED
    ? [...DEFAULT_RISK_RULES, ...BIOMETRIC_DOMAIN_PACK]
    : DEFAULT_RISK_RULES;

  // Discover all .md example files (excluding validation reports) so the
  // validator runs against whatever risk-log examples are present.
  const findMdFiles = (dir: string): string[] => {
    const files: string[] = [];
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...findMdFiles(fullPath));
      } else if (
        entry.isFile() &&
        entry.name.endsWith(".md") &&
        !entry.name.includes("validation")
      ) {
        files.push(fullPath);
      }
    }
    return files;
  };

  const mdFiles = findMdFiles(examplesDir);
  const validationCases = mdFiles.map((filePath) => ({
    file: filePath.replace(examplesDir + "/", ""),
    fullPath: filePath,
    rules: activeRules,
    description: `Risk Log: ${filePath.split("/").pop()?.replace(".md", "") || "Unknown"}`,
  }));

  console.log("🔍 Validating Risk Log Skill Examples...\n");
  if (DOMAIN_PACK_ENABLED) {
    console.log("ℹ️  LIDR_DOMAIN_PACK=biometric — applying optional biometric domain rules.\n");
  }

  let totalPassed = 0,
    totalFailed = 0,
    totalWarnings = 0,
    allValid = true;

  for (const testCase of validationCases) {
    if (!existsSync(testCase.fullPath)) {
      console.log(`❌ ${testCase.description}\n   File not found: ${testCase.file}\n`);
      allValid = false;
      continue;
    }

    const result = validateFile(testCase.fullPath, testCase.rules);
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
      "\n🎉 All Risk Log examples are properly structured!\n   Ready for comprehensive project risk management."
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
