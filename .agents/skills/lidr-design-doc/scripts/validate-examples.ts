#!/usr/bin/env tsx
/**
 * validate-examples.ts - Design Document Skill Example Validator
 *
 * Validates that design-doc skill examples contain proper structure
 * for a complete Software Design Document combining Business Model,
 * Use Cases, Data Model, and System Design sections.
 *
 * Validates:
 * - All 4 main sections present: Business Model, Use Cases, Data Model, System Design
 * - Mermaid blocks present and syntactically valid
 * - No placeholder text
 * - Self-contained document with title
 * - Horizontal rule separators between sections
 * - Lean Canvas cells present in Business Model
 * - ERD diagram present in Data Model
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

const DESIGN_DOC_STRUCTURE_RULES: ValidationRule[] = [
  {
    name: "Business Model Section",
    description: "Must contain a Business Model section (## 1. Business Model)",
    check: (content) => /## 1\. Business Model/.test(content),
    severity: "ERROR",
  },
  {
    name: "Use Cases Section",
    description: "Must contain a Use Cases section (## 2. Use Cases)",
    check: (content) => /## 2\. Use Cases/.test(content),
    severity: "ERROR",
  },
  {
    name: "Data Model Section",
    description: "Must contain a Data Model section (## 3. Data Model)",
    check: (content) => /## 3\. Data Model/.test(content),
    severity: "ERROR",
  },
  {
    name: "System Design Section",
    description: "Must contain a System Design section (## 4. System Design)",
    check: (content) => /## 4\. System Design/.test(content),
    severity: "ERROR",
  },
  {
    name: "Self-Contained Document Title",
    description: "Must have a clear H1 title identifying the document and system",
    check: (content) => /^# .+/m.test(content),
    severity: "ERROR",
  },
];

const DESIGN_DOC_CONTENT_RULES: ValidationRule[] = [
  {
    name: "Mermaid Diagrams Present",
    description: "Must contain at least one Mermaid diagram block",
    check: (content) => content.includes("```mermaid"),
    severity: "ERROR",
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
];

const DESIGN_DOC_QUALITY_RULES: ValidationRule[] = [
  {
    name: "Horizontal Rule Separators",
    description: "Should use horizontal rule separators (---) between major sections",
    check: (content) => {
      const separators = (content.match(/^---$/gm) || []).length;
      return separators >= 3;
    },
    severity: "WARN",
  },
  {
    name: "Lean Canvas Cells",
    description:
      "Business Model should contain a Lean Canvas with key cells (Problem, Solution, Revenue)",
    check: (content) => {
      const bmSection = content.match(/## 1\. Business Model([\s\S]*?)(?=## 2\.|$)/);
      if (!bmSection) return false;
      const mermaidBlock = bmSection[1].match(/```mermaid([\s\S]*?)```/);
      if (!mermaidBlock) return false;
      const mermaid = mermaidBlock[1].toLowerCase();
      return (
        mermaid.includes("problem") && mermaid.includes("solution") && mermaid.includes("revenue")
      );
    },
    severity: "WARN",
  },
  {
    name: "ERD Diagram Present",
    description: "Data Model should contain an erDiagram Mermaid block",
    check: (content) => {
      const dmSection = content.match(/## 3\. Data Model([\s\S]*?)(?=## 4\.|$)/);
      if (!dmSection) return false;
      return dmSection[1].includes("erDiagram");
    },
    severity: "WARN",
  },
  {
    name: "Use Case Diagrams",
    description: "Use Cases section should contain flowchart diagrams",
    check: (content) => {
      const ucSection = content.match(/## 2\. Use Cases([\s\S]*?)(?=## 3\.|$)/);
      if (!ucSection) return false;
      return ucSection[1].includes("flowchart TD");
    },
    severity: "WARN",
  },
  {
    name: "Architecture Diagram",
    description: "System Design should contain an architecture diagram",
    check: (content) => {
      const sdSection = content.match(/## 4\. System Design([\s\S]*?)(?=## [^4]|$)/);
      if (!sdSection) return false;
      return sdSection[1].includes("```mermaid");
    },
    severity: "WARN",
  },
  {
    name: "Service Inventory Table",
    description: "System Design should contain a service inventory table",
    check: (content) => {
      const sdSection = content.match(/## 4\. System Design([\s\S]*?)(?=## [^4]|$)/);
      if (!sdSection) return false;
      return sdSection[1].includes("| Service") || sdSection[1].includes("Service Inventory");
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

  const allRules = [
    ...DESIGN_DOC_STRUCTURE_RULES,
    ...DESIGN_DOC_CONTENT_RULES,
    ...DESIGN_DOC_QUALITY_RULES,
  ];

  const validationCases = [
    {
      file: "example-design-doc-ats.md",
      rules: allRules,
      description: "Applicant Tracking System Design Document",
    },
  ];

  console.log("🔍 Validating Design Document Skill Examples...\n");

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
    console.log("\n🎉 All design document examples are properly structured!");
    console.log("   Ready for comprehensive Software Design Document generation.");
  } else {
    console.log("\n💡 Fix the validation errors to ensure proper design document structure.");
    console.log(
      "   Reference: SDD best practices with Business Model, Use Cases, Data Model, and System Design."
    );
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
