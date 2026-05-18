#!/usr/bin/env tsx
/**
 * validate-examples.ts - Document Discovery Skill Example Validator
 *
 * Validates that document-discovery skill examples contain proper BMAD-style
 * document discovery and inventory methodology structure.
 *
 * Validates:
 * - Document discovery methodology and inventory structure
 * - BMAD-style classification and categorization
 * - Document quality assessment and freshness analysis
 * - Gap identification and remediation recommendations
 * - Stakeholder mapping and ownership attribution
 * - Documentation health metrics and scoring
 *
 * Usage: npx tsx scripts/validate-examples.ts
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

const DOCUMENT_DISCOVERY_RULES: ValidationRule[] = [
  {
    name: "Discovery Methodology Structure",
    description: "Must contain structured document discovery methodology with clear phases",
    check: (content) =>
      content.includes("methodology") && content.includes("discovery") && content.includes("phase"),
    severity: "ERROR",
  },
  {
    name: "BMAD-Style Classification",
    description: "Must use BMAD-inspired classification and categorization approach",
    check: (content) => content.includes("BMAD") && content.includes("classification"),
    severity: "ERROR",
  },
  {
    name: "Document Inventory Structure",
    description: "Must provide systematic document inventory with metadata",
    check: (content) => content.includes("inventory") && content.includes("metadata"),
    severity: "ERROR",
  },
  {
    name: "Quality Assessment Framework",
    description: "Must include document quality assessment criteria and scoring",
    check: (content) =>
      content.includes("quality") && content.includes("assessment") && content.includes("scoring"),
    severity: "ERROR",
  },
  {
    name: "Freshness Analysis",
    description: "Must analyze document freshness and staleness indicators",
    check: (content) => content.includes("freshness") && content.includes("stale"),
    severity: "ERROR",
  },
  {
    name: "Gap Identification",
    description: "Must identify documentation gaps and missing artifacts",
    check: (content) => content.includes("gap") && content.includes("missing"),
    severity: "ERROR",
  },
  {
    name: "Stakeholder Ownership Mapping",
    description: "Must map document ownership to stakeholders and roles",
    check: (content) => content.includes("stakeholder") && content.includes("ownership"),
    severity: "ERROR",
  },
  {
    name: "Health Metrics Definition",
    description: "Must define measurable documentation health metrics",
    check: (content) => content.includes("health") && content.includes("metrics"),
    severity: "ERROR",
  },
  {
    name: "Automated Discovery Tools",
    description: "Must leverage automated tools for document discovery",
    check: (content) => content.includes("automated") && content.includes("tool"),
    severity: "WARN",
  },
  {
    name: "Version Control Integration",
    description: "Must integrate with version control systems for tracking",
    check: (content) => content.includes("version control") || content.includes("git"),
    severity: "WARN",
  },
  {
    name: "Documentation Standards Compliance",
    description: "Must check compliance with established documentation standards",
    check: (content) => content.includes("standards") && content.includes("compliance"),
    severity: "ERROR",
  },
  {
    name: "Remediation Recommendations",
    description: "Must provide actionable remediation recommendations for gaps",
    check: (content) => content.includes("remediation") && content.includes("recommendations"),
    severity: "ERROR",
  },
  {
    name: "Discovery Report Template",
    description: "Must provide structured template for discovery reporting",
    check: (content) => content.includes("template") && content.includes("report"),
    severity: "ERROR",
  },
  {
    name: "Cross-Reference Analysis",
    description: "Must analyze cross-references and dependencies between documents",
    check: (content) => content.includes("cross-reference") || content.includes("dependencies"),
    severity: "WARN",
  },
  {
    name: "Access Pattern Analysis",
    description: "Must analyze document access patterns and usage metrics",
    check: (content) => content.includes("access") && content.includes("usage"),
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

  // Look for example files in the directory
  const exampleFiles = [
    "document-discovery-report.md",
    "bmad-inventory-example.md",
    "documentation-health-audit.md",
  ];
  const validationCases = [];

  for (const file of exampleFiles) {
    const filePath = join(examplesDir, file);
    if (existsSync(filePath)) {
      validationCases.push({
        file,
        rules: DOCUMENT_DISCOVERY_RULES,
        description: `Document Discovery Example: ${file}`,
      });
    }
  }

  if (validationCases.length === 0) {
    console.log("⚠️ No example files found to validate");
    console.log(
      "Expected files: document-discovery-report.md, bmad-inventory-example.md, documentation-health-audit.md"
    );
    process.exit(0);
  }

  console.log("🔍 Validating Document-Discovery Skill Examples...\n");

  let totalPassed = 0;
  let totalFailed = 0;
  let totalWarnings = 0;
  let allValid = true;

  for (const testCase of validationCases) {
    const filePath = join(examplesDir, testCase.file);
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
    console.log("\n🎉 All document discovery examples are properly structured!");
    console.log("   Ready for BMAD-style document discovery and inventory.");
  } else {
    console.log("\n💡 Fix the validation errors to ensure comprehensive document discovery.");
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
