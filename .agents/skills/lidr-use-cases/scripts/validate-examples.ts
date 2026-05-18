#!/usr/bin/env tsx
/**
 * validate-examples.ts - Use Cases Skill Example Validator
 *
 * Validates that use-cases skill examples contain proper structure
 * for documenting system interactions with flowchart diagrams.
 *
 * Validates:
 * - Exactly 3 use cases with UC-N headers
 * - Each use case has a Description paragraph
 * - Each use case has a Mermaid flowchart diagram
 * - classDef styles for actor, system, decision, terminal
 * - System boundary subgraph present
 * - No placeholder text
 * - No em-dashes in Mermaid blocks
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

const USE_CASE_STRUCTURE_RULES: ValidationRule[] = [
  {
    name: "Exactly 3 Use Cases",
    description: "Must contain exactly 3 use cases with ## UC-N headers",
    check: (content) => {
      const ucHeaders = content.match(/^## UC-\d+:/gm);
      return ucHeaders !== null && ucHeaders.length === 3;
    },
    severity: "ERROR",
  },
  {
    name: "UC-1 Description",
    description: "UC-1 must have a Description subsection with substantive content",
    check: (content) => {
      const uc1Section = content.match(/## UC-1:([\s\S]*?)(?=## UC-2:|$)/);
      if (!uc1Section) return false;
      return (
        uc1Section[1].includes("### Description") &&
        uc1Section[1].match(/### Description([\s\S]*?)(?=###|$)/)?.[1]?.trim().length! > 100
      );
    },
    severity: "ERROR",
  },
  {
    name: "UC-2 Description",
    description: "UC-2 must have a Description subsection with substantive content",
    check: (content) => {
      const uc2Section = content.match(/## UC-2:([\s\S]*?)(?=## UC-3:|$)/);
      if (!uc2Section) return false;
      return (
        uc2Section[1].includes("### Description") &&
        uc2Section[1].match(/### Description([\s\S]*?)(?=###|$)/)?.[1]?.trim().length! > 100
      );
    },
    severity: "ERROR",
  },
  {
    name: "UC-3 Description",
    description: "UC-3 must have a Description subsection with substantive content",
    check: (content) => {
      const uc3Section = content.match(/## UC-3:([\s\S]*?)(?=\n## [^#U]|$)/);
      if (!uc3Section) return false;
      return (
        uc3Section[1].includes("### Description") &&
        uc3Section[1].match(/### Description([\s\S]*?)(?=###|$)/)?.[1]?.trim().length! > 100
      );
    },
    severity: "ERROR",
  },
];

const USE_CASE_DIAGRAM_RULES: ValidationRule[] = [
  {
    name: "UC-1 Mermaid Flowchart",
    description: "UC-1 must have a Mermaid flowchart TD diagram",
    check: (content) => {
      const uc1Section = content.match(/## UC-1:([\s\S]*?)(?=## UC-2:|$)/);
      if (!uc1Section) return false;
      return uc1Section[1].includes("```mermaid") && uc1Section[1].includes("flowchart TD");
    },
    severity: "ERROR",
  },
  {
    name: "UC-2 Mermaid Flowchart",
    description: "UC-2 must have a Mermaid flowchart TD diagram",
    check: (content) => {
      const uc2Section = content.match(/## UC-2:([\s\S]*?)(?=## UC-3:|$)/);
      if (!uc2Section) return false;
      return uc2Section[1].includes("```mermaid") && uc2Section[1].includes("flowchart TD");
    },
    severity: "ERROR",
  },
  {
    name: "UC-3 Mermaid Flowchart",
    description: "UC-3 must have a Mermaid flowchart TD diagram",
    check: (content) => {
      const uc3Section = content.match(/## UC-3:([\s\S]*?)(?=\n## [^#U]|$)/);
      if (!uc3Section) return false;
      return uc3Section[1].includes("```mermaid") && uc3Section[1].includes("flowchart TD");
    },
    severity: "ERROR",
  },
];

const USE_CASE_QUALITY_RULES: ValidationRule[] = [
  {
    name: "ClassDef Styles - Actor",
    description: "Diagrams should define classDef actor with green styling",
    check: (content) => {
      const mermaidBlocks = content.match(/```mermaid([\s\S]*?)```/g);
      if (!mermaidBlocks) return false;
      return mermaidBlocks.every((block) => block.includes("classDef actor"));
    },
    severity: "WARN",
  },
  {
    name: "ClassDef Styles - System",
    description: "Diagrams should define classDef system with blue styling",
    check: (content) => {
      const mermaidBlocks = content.match(/```mermaid([\s\S]*?)```/g);
      if (!mermaidBlocks) return false;
      return mermaidBlocks.every((block) => block.includes("classDef system"));
    },
    severity: "WARN",
  },
  {
    name: "ClassDef Styles - Decision",
    description: "Diagrams should define classDef decision with yellow styling",
    check: (content) => {
      const mermaidBlocks = content.match(/```mermaid([\s\S]*?)```/g);
      if (!mermaidBlocks) return false;
      return mermaidBlocks.every((block) => block.includes("classDef decision"));
    },
    severity: "WARN",
  },
  {
    name: "ClassDef Styles - Terminal",
    description: "Diagrams should define classDef terminal with gray styling",
    check: (content) => {
      const mermaidBlocks = content.match(/```mermaid([\s\S]*?)```/g);
      if (!mermaidBlocks) return false;
      return mermaidBlocks.every((block) => block.includes("classDef terminal"));
    },
    severity: "WARN",
  },
  {
    name: "System Boundary Subgraph",
    description: "Diagrams should include a system boundary subgraph to define scope",
    check: (content) => {
      const mermaidBlocks = content.match(/```mermaid([\s\S]*?)```/g);
      if (!mermaidBlocks) return false;
      return mermaidBlocks.every((block) => block.includes("subgraph"));
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

  const allRules = [
    ...USE_CASE_STRUCTURE_RULES,
    ...USE_CASE_DIAGRAM_RULES,
    ...USE_CASE_QUALITY_RULES,
  ];

  const validationCases = [
    {
      file: "example-identity-verification.md",
      rules: allRules,
      description: "Identity Verification Platform Use Cases",
    },
  ];

  console.log("🔍 Validating Use Cases Skill Examples...\n");

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
    console.log("\n🎉 All use case examples are properly structured!");
    console.log("   Ready for documenting system interactions with flowchart diagrams.");
  } else {
    console.log("\n💡 Fix the validation errors to ensure proper use case documentation.");
    console.log("   Reference: Use case diagram best practices and Mermaid flowchart syntax.");
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
