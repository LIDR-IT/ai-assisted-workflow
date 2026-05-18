#!/usr/bin/env tsx
/**
 * validate-examples.ts - Business Model Skill Example Validator
 *
 * Validates that business-model skill examples contain proper structure
 * for documenting system description, competitive advantages, features,
 * and Lean Canvas analysis.
 *
 * Validates:
 * - System Description section with substantive content
 * - Competitive Advantages section with 5+ bullet points
 * - Main Features table with 8+ entries
 * - Lean Canvas Mermaid diagram with all 9 cells
 * - No placeholder text
 * - Valid Mermaid syntax (no em-dashes)
 *
 * Usage: npx tsx scripts/validate-examples.ts
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

const BUSINESS_MODEL_RULES: ValidationRule[] = [
  {
    name: "System Description Section",
    description: "Must have a System Description section with substantive content (2+ paragraphs)",
    check: (content) => {
      const section = content.match(/## 1\. System Description([\s\S]*?)(?=## \d|$)/);
      if (!section) return false;
      const paragraphs = section[1]
        .trim()
        .split(/\n\n+/)
        .filter((p) => p.trim().length > 50);
      return paragraphs.length >= 2;
    },
    severity: "ERROR",
  },
  {
    name: "Competitive Advantages Section",
    description: "Must have an Added Value section with 5+ competitive advantages as bullet points",
    check: (content) => {
      const section = content.match(/## 2\. Added Value([\s\S]*?)(?=## \d|$)/);
      if (!section) return false;
      const bullets = (section[1].match(/^- \*\*/gm) || []).length;
      return bullets >= 5;
    },
    severity: "ERROR",
  },
  {
    name: "Main Features Table",
    description: "Must have a Main Features table with 8+ feature rows",
    check: (content) => {
      const section = content.match(/## 3\. Main Features([\s\S]*?)(?=## \d|$)/);
      if (!section) return false;
      const tableRows = (section[1].match(/^\| \d+/gm) || []).length;
      return tableRows >= 8;
    },
    severity: "ERROR",
  },
  {
    name: "Lean Canvas Mermaid Diagram",
    description: "Must have a Lean Canvas section with a Mermaid graph TB diagram",
    check: (content) => {
      const section = content.match(/## 4\. Lean Canvas([\s\S]*?)(?=## |$)/);
      if (!section) return false;
      return section[1].includes("```mermaid") && section[1].includes("graph TB");
    },
    severity: "ERROR",
  },
  {
    name: "Lean Canvas - All 9 Cells",
    description:
      "Lean Canvas should contain all 9 standard cells: Problem, Customer Segments, Unique Value, Solution, Channels, Revenue, Cost, Metrics, Unfair Advantage",
    check: (content) => {
      const requiredCells = [
        "Problem",
        "Customer",
        "Unique Value",
        "Solution",
        "Channel",
        "Revenue",
        "Cost",
        "Metric",
        "Unfair Advantage",
      ];
      const mermaidBlock = content.match(/```mermaid([\s\S]*?)```/);
      if (!mermaidBlock) return false;
      const mermaidContent = mermaidBlock[1];
      return requiredCells.every((cell) =>
        mermaidContent.toLowerCase().includes(cell.toLowerCase())
      );
    },
    severity: "WARN",
  },
  {
    name: "No Placeholder Text",
    description: "Must not contain placeholder text such as TBD, TODO, PLACEHOLDER, or Lorem ipsum",
    check: (content) => {
      const lowerContent = content.toLowerCase();
      return (
        !lowerContent.includes("[tbd]") &&
        !lowerContent.includes("[todo]") &&
        !lowerContent.includes("[placeholder]") &&
        !lowerContent.includes("lorem ipsum")
      );
    },
    severity: "ERROR",
  },
  {
    name: "Mermaid Syntax - No Em-dashes",
    description: "Mermaid blocks should not contain em-dashes which can break rendering",
    check: (content) => {
      const mermaidBlocks = content.match(/```mermaid([\s\S]*?)```/g);
      if (!mermaidBlocks) return true;
      return mermaidBlocks.every((block) => !block.includes("\u2014") && !block.includes("\u2013"));
    },
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

  const validationCases = [
    {
      file: "example-saas-platform.md",
      rules: BUSINESS_MODEL_RULES,
      description: "SaaS Collaboration Platform Business Model",
    },
  ];

  console.log("🔍 Validating Business Model Skill Examples...\n");

  let totalPassed = 0;
  let totalFailed = 0;
  let totalWarnings = 0;
  let allValid = true;

  for (const testCase of validationCases) {
    const filePath = join(examplesDir, testCase.file);

    if (!existsSync(filePath)) {
      console.log(`⚠️  ${testCase.description}`);
      console.log(`   File not found: ${testCase.file}\n`);
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
    console.log("\n🎉 All business model examples are properly structured!");
    console.log("   Ready for Lean Canvas and competitive analysis documentation.");
  } else {
    console.log("\n💡 Fix the validation errors to ensure proper business model documentation.");
    console.log("   Reference: Lean Canvas methodology and business model best practices.");
  }

  process.exit(allValid ? 0 : 1);
}

// Entry point detection
if (typeof import.meta !== "undefined" && import.meta.url.includes("validate-examples.ts")) {
  main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}
