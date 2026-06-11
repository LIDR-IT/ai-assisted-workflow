#!/usr/bin/env tsx
/**
 * validate-examples.ts - ADR Skill Example Validator
 *
 * Validates that ADR skill examples contain proper MADR (Markdown Architecture Decision Record) structure
 * for documenting significant technical decisions with context, alternatives, and trade-offs.
 *
 * The DEFAULT validation set is DOMAIN-AGNOSTIC: the validation rules check only
 * generic MADR structure/quality/numbering, and the default fixtures are the
 * generic ADR templates. LIDR is a multi-industry framework, so no industry
 * fixture is validated by default.
 *
 * An overridable EXAMPLE industry pack (biometric identity) is preserved below
 * as BIOMETRIC_DOMAIN_PACK_CASES. Those fixtures are NOT validated by default —
 * apply them only behind the explicit flag LIDR_DOMAIN_PACK==='biometric'.
 *
 * Validates:
 * - MADR format compliance with proper section structure
 * - Metadata completeness (status, date, deciders, technical area)
 * - Decision context and problem statement clarity
 * - Decision drivers documentation with business/technical rationale
 * - Comprehensive options analysis with pros/cons
 * - Clear decision outcome with justification
 * - Consequence documentation (positive, negative, neutral)
 * - Proper ADR numbering and cross-references
 *
 * Usage: npx tsx scripts/validate-examples.ts
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/* ────────────────────────────────────────────────────────────────────
   VALIDATION RULES
──────────────────────────────────────────────────────────────────── */

interface ValidationRule {
  name: string;
  description: string;
  check: (content: string) => boolean;
  severity: "ERROR" | "WARN";
}

const ADR_STRUCTURE_RULES: ValidationRule[] = [
  {
    name: "ADR Title Format",
    description: 'Must have title in format "# ADR-{NNN}: {descriptive title}"',
    check: (content) => /^# ADR-\d+:/.test(content.trim()),
    severity: "ERROR",
  },
  {
    name: "Metadata Table",
    description: "Must contain metadata table with ID, Date, Status, Deciders, Technical Area",
    check: (content) =>
      content.includes("## Metadata") &&
      content.includes("| Field | Value |") &&
      content.includes("**ID**") &&
      content.includes("**Date**") &&
      content.includes("**Status**"),
    severity: "ERROR",
  },
  {
    name: "Context Section",
    description: "Must have ## Context section explaining the problem and constraints",
    check: (content) => content.includes("## Context"),
    severity: "ERROR",
  },
  {
    name: "Decision Drivers",
    description: "Must document decision drivers with bullet points",
    check: (content) => content.includes("## Decision Drivers") && content.includes("- "),
    severity: "ERROR",
  },
  {
    name: "Considered Options",
    description: "Must list multiple considered options (minimum 2)",
    check: (content) => {
      const optionsSection = content.match(/## Considered Options([\s\S]*?)(?=##|$)/);
      if (!optionsSection) return false;
      const optionCount = (optionsSection[1].match(/^\d+\./gm) || []).length;
      return optionCount >= 2;
    },
    severity: "ERROR",
  },
  {
    name: "Decision Outcome",
    description: "Must have clear decision outcome with chosen option and justification",
    check: (content) =>
      content.includes("## Decision Outcome") &&
      content.includes("**Chosen option:") &&
      content.includes("because"),
    severity: "ERROR",
  },
  {
    name: "Consequences Section",
    description: "Must document consequences with Good, Bad, and Neutral subsections",
    check: (content) =>
      content.includes("### Consequences") &&
      content.includes("**Good:") &&
      content.includes("**Bad:"),
    severity: "ERROR",
  },
  {
    name: "Pros and Cons Analysis",
    description: "Must provide detailed pros and cons for each option with ✅/❌ indicators",
    check: (content) =>
      content.includes("## Pros and Cons of Options") &&
      content.includes("✅") &&
      content.includes("❌"),
    severity: "ERROR",
  },
  {
    name: "Status Values",
    description: "Status must be one of: Proposed, Accepted, Deprecated, or Superseded",
    check: (content) =>
      /\*\*Status\*\*.*\|\s*(Proposed|Accepted|Deprecated|Superseded)/.test(content),
    severity: "ERROR",
  },
  {
    name: "Date Format",
    description: "Date must be in YYYY-MM-DD format",
    check: (content) => /\*\*Date\*\*.*\|\s*\d{4}-\d{2}-\d{2}/.test(content),
    severity: "ERROR",
  },
  {
    name: "Technical Area",
    description:
      "Must specify technical area (Architecture/Infrastructure/Security/Data/API/Frontend)",
    check: (content) =>
      /\*\*Technical Area\*\*.*\|\s*(Architecture|Infrastructure|Security|Data|API|Frontend)/.test(
        content
      ),
    severity: "WARN",
  },
  {
    name: "Deciders Documentation",
    description: "Must list decision makers with roles and names",
    check: (content) => content.includes("**Deciders**") && content.includes(":"),
    severity: "ERROR",
  },
  {
    name: "Links Section",
    description: "Should include links to related documentation",
    check: (content) => content.includes("## Links") && content.includes("["),
    severity: "WARN",
  },
  {
    name: "Chosen Option Indicator",
    description: "Should mark the chosen option in pros/cons section",
    check: (content) => content.includes("(chosen)") || content.includes("**chosen**"),
    severity: "WARN",
  },
  {
    name: "Quantified Decision Drivers",
    description: "Should include measurable requirements in decision drivers",
    check: (content) => {
      const driversSection = content.match(/## Decision Drivers([\s\S]*?)(?=##|$)/);
      if (!driversSection) return false;
      return (
        /\d+[KMG]?/.test(driversSection[1]) ||
        /\$/.test(driversSection[1]) ||
        /%/.test(driversSection[1])
      );
    },
    severity: "WARN",
  },
];

const ADR_QUALITY_RULES: ValidationRule[] = [
  {
    name: "Problem Statement Clarity",
    description: "Context should clearly explain why the decision is needed",
    check: (content) => {
      const contextSection = content.match(/## Context([\s\S]*?)(?=##|$)/);
      if (!contextSection) return false;
      const contextText = contextSection[1].toLowerCase();
      return (
        contextText.includes("need") ||
        contextText.includes("problem") ||
        contextText.includes("challenge") ||
        contextText.includes("requirement")
      );
    },
    severity: "ERROR",
  },
  {
    name: "Trade-off Documentation",
    description: "Bad consequences should document accepted trade-offs",
    check: (content) => {
      const badSection = content.match(/\*\*Bad:\*\*([\s\S]*?)(?=\*\*|##|$)/);
      return badSection && badSection[1].trim().length > 10;
    },
    severity: "ERROR",
  },
  {
    name: "Business Impact",
    description: "Should document business impact or value in decision drivers",
    check: (content) => {
      const driversSection = content.match(/## Decision Drivers([\s\S]*?)(?=##|$)/);
      if (!driversSection) return false;
      const driversText = driversSection[1].toLowerCase();
      return (
        driversText.includes("business") ||
        driversText.includes("customer") ||
        driversText.includes("cost") ||
        driversText.includes("revenue") ||
        driversText.includes("time to market")
      );
    },
    severity: "WARN",
  },
  {
    name: "Technical Constraints",
    description: "Should document technical constraints and requirements",
    check: (content) => {
      const driversSection = content.match(/## Decision Drivers([\s\S]*?)(?=##|$)/);
      if (!driversSection) return false;
      const driversText = driversSection[1].toLowerCase();
      return (
        driversText.includes("performance") ||
        driversText.includes("scalability") ||
        driversText.includes("security") ||
        driversText.includes("integration") ||
        driversText.includes("compatibility")
      );
    },
    severity: "WARN",
  },
  {
    name: "Detailed Option Analysis",
    description: "Each option should have at least 2 pros and 2 cons",
    check: (content) => {
      const prosConsSection = content.match(/## Pros and Cons of Options([\s\S]*?)(?=##|$)/);
      if (!prosConsSection) return false;
      const options = prosConsSection[1].split(/### Option/);
      return (
        options.length >= 2 &&
        options.slice(1).every((option) => {
          const pros = (option.match(/✅/g) || []).length;
          const cons = (option.match(/❌/g) || []).length;
          return pros >= 2 && cons >= 1;
        })
      );
    },
    severity: "WARN",
  },
  {
    name: "Implementation Considerations",
    description: "Should consider implementation complexity in analysis",
    check: (content) => {
      const lowerContent = content.toLowerCase();
      return (
        lowerContent.includes("implementation") ||
        lowerContent.includes("develop") ||
        lowerContent.includes("effort") ||
        lowerContent.includes("complexity") ||
        lowerContent.includes("timeline")
      );
    },
    severity: "WARN",
  },
  {
    name: "Future Considerations",
    description: "Should consider future evolution and maintenance",
    check: (content) => {
      const lowerContent = content.toLowerCase();
      return (
        lowerContent.includes("future") ||
        lowerContent.includes("evolv") ||
        lowerContent.includes("maintain") ||
        lowerContent.includes("extend") ||
        lowerContent.includes("upgrade")
      );
    },
    severity: "WARN",
  },
  {
    name: "Evidence-Based Decision",
    description: "Should reference benchmarks, PoCs, or other supporting evidence",
    check: (content) => {
      const lowerContent = content.toLowerCase();
      return (
        lowerContent.includes("benchmark") ||
        lowerContent.includes("poc") ||
        lowerContent.includes("proof of concept") ||
        lowerContent.includes("test") ||
        lowerContent.includes("metric") ||
        lowerContent.includes("measurement")
      );
    },
    severity: "WARN",
  },
];

const ADR_NUMBERING_RULES: ValidationRule[] = [
  {
    name: "Consistent ADR Numbering",
    description: "ADR number in title should match ID in metadata",
    check: (content) => {
      const titleMatch = content.match(/# ADR-(\d+):/);
      const idMatch = content.match(/\*\*ID\*\*.*ADR-(\d+)/);
      return titleMatch && idMatch && titleMatch[1] === idMatch[1];
    },
    severity: "ERROR",
  },
  {
    name: "Valid Cross References",
    description: "ADR references should follow ADR-{NNN} format",
    check: (content) => {
      const references = content.match(/ADR-\d+/g);
      return !references || references.every((ref) => /^ADR-\d{3}$/.test(ref));
    },
    severity: "WARN",
  },
  {
    name: "Superseding Documentation",
    description: "If status is Superseded, should reference the superseding ADR",
    check: (content) => {
      const isSuperseded = content.includes("Superseded");
      if (!isSuperseded) return true;
      return content.includes("Superseded by ADR-");
    },
    severity: "ERROR",
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

  const ALL_ADR_RULES = [...ADR_STRUCTURE_RULES, ...ADR_QUALITY_RULES, ...ADR_NUMBERING_RULES];

  // DEFAULT validation set — DOMAIN-AGNOSTIC generic ADR fixtures only.
  const validationCases: Array<{ file: string; rules: ValidationRule[]; description: string }> = [
    {
      file: "generic/adr-template-architecture-pattern.md",
      rules: ALL_ADR_RULES,
      description: "Generic Architecture Pattern ADR",
    },
    {
      file: "generic/adr-template-technology-selection.md",
      rules: ALL_ADR_RULES,
      description: "Generic Technology Selection ADR",
    },
  ];

  /* ──────────────────────────────────────────────────────────────────
     OVERRIDABLE EXAMPLE — biometric-identity industry pack fixtures.

     These are EXAMPLE fixtures, NOT validated by default. They use the same
     generic MADR rules. Apply them only behind the explicit flag
     LIDR_DOMAIN_PACK==='biometric'. Descriptions are kept domain-neutral.
  ────────────────────────────────────────────────────────────────── */
  const BIOMETRIC_DOMAIN_PACK_CASES: Array<{
    file: string;
    rules: ValidationRule[];
    description: string;
  }> = [
    {
      file: "domains/biometric/adr-001-biometric-template-format.md",
      rules: ALL_ADR_RULES,
      description: "Data Format ADR",
    },
    {
      file: "domains/biometric/adr-002-liveness-detection-architecture.md",
      rules: ALL_ADR_RULES,
      description: "Detection Architecture ADR",
    },
    {
      file: "domains/biometric/adr-003-gdpr-compliance-automation.md",
      rules: ALL_ADR_RULES,
      description: "Compliance Automation ADR",
    },
  ];

  if (process.env.LIDR_DOMAIN_PACK === "biometric") {
    validationCases.push(...BIOMETRIC_DOMAIN_PACK_CASES);
  }

  console.log("🔍 Validating ADR Skill Examples...\n");

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
    console.log("\n🎉 All ADR examples follow MADR format correctly!");
    console.log("   Ready for documenting architecture decisions with proper structure.");
  } else {
    console.log("\n💡 Fix the validation errors to ensure proper ADR documentation.");
    console.log("   Reference: https://adr.github.io/madr/ for MADR format guidelines.");
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
