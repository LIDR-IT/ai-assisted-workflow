#!/usr/bin/env tsx
/**
 * validate-examples.ts - Stakeholder Map Skill Example Validator
 *
 * Validates that stakeholder-map skill examples contain proper structure
 * for project stakeholder identification and engagement planning.
 *
 * The DEFAULT validation set is 100% domain-agnostic (project overview,
 * power/interest matrix, detailed analysis, communication strategy, generic
 * regulatory/compliance stakeholders, risk assessment, engagement planning). An
 * overridable EXAMPLE industry pack (biometric identity / banking) is preserved
 * below as the BIOMETRIC_DOMAIN_PACK_RULES constant and is applied ONLY behind
 * an explicit flag (`LIDR_DOMAIN_PACK=biometric`). It is documentation/example
 * only and is NOT part of the default behavior.
 *
 * Validates:
 * - Power/Interest matrix with proper stakeholder categorization
 * - Detailed stakeholder analysis with roles and responsibilities
 * - Communication strategy and engagement planning
 * - Risk assessment and mitigation strategies
 * - Regulatory and compliance stakeholder considerations
 * - Project-specific stakeholder requirements
 *
 * Usage: npx tsx scripts/validate-examples.ts
 *        LIDR_DOMAIN_PACK=biometric npx tsx scripts/validate-examples.ts
 */

import { readFileSync, existsSync, readdirSync } from "fs";
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

const PROJECT_OVERVIEW_RULES: ValidationRule[] = [
  {
    name: "Project Overview Section",
    description: "Must contain project overview with initiative, timeline, and budget",
    check: (content) =>
      content.includes("Project Overview") &&
      content.includes("Timeline") &&
      content.includes("Budget"),
    severity: "ERROR",
  },
  {
    name: "Key Objectives",
    description: "Must define key project objectives and success criteria",
    check: (content) => content.includes("Key Objectives") || content.includes("Objectives"),
    severity: "ERROR",
  },
  {
    name: "Project Context",
    description: "Must provide project context and business rationale",
    check: (content) =>
      content.includes("Context") ||
      content.includes("background") ||
      content.includes("rationale"),
    severity: "ERROR",
  },
  {
    name: "Scope Definition",
    description: "Must clearly define project scope",
    check: (content) => content.includes("Scope") || content.includes("scope"),
    severity: "ERROR",
  },
];

const STAKEHOLDER_MATRIX_RULES: ValidationRule[] = [
  {
    name: "Stakeholder Matrix Section",
    description: "Must contain stakeholder matrix with power/interest analysis",
    check: (content) =>
      content.includes("Stakeholder Matrix") && content.includes("Power/Interest"),
    severity: "ERROR",
  },
  {
    name: "Four Quadrant Structure",
    description: "Must include all four power/interest quadrants",
    check: (content) =>
      content.includes("MANAGE CLOSELY") &&
      content.includes("KEEP SATISFIED") &&
      content.includes("KEEP INFORMED") &&
      content.includes("MONITOR"),
    severity: "ERROR",
  },
  {
    name: "Visual Matrix Representation",
    description: "Should use visual representation (ASCII art, emojis) for matrix",
    check: (content) =>
      (content.includes("🔴") || content.includes("High Power, High Interest")) &&
      (content.includes("🟡") || content.includes("High Power, Low Interest")),
    severity: "WARN",
  },
  {
    name: "Stakeholder Categorization",
    description: "Must properly categorize stakeholders into appropriate quadrants",
    check: (content) => content.includes("├──") || content.includes("└──") || content.includes("-"),
    severity: "WARN",
  },
];

const DETAILED_ANALYSIS_RULES: ValidationRule[] = [
  {
    name: "Detailed Stakeholder Analysis",
    description: "Must provide detailed analysis section for key stakeholders",
    check: (content) =>
      content.includes("Detailed Stakeholder Analysis") || content.includes("Stakeholder Analysis"),
    severity: "ERROR",
  },
  {
    name: "Critical Success Factors",
    description: "Must identify critical success factors for high-priority stakeholders",
    check: (content) =>
      content.includes("Critical Success Factors") || content.includes("MANAGE CLOSELY"),
    severity: "ERROR",
  },
  {
    name: "Stakeholder Roles and Responsibilities",
    description: "Must define roles and responsibilities for each stakeholder group",
    check: (content) =>
      content.includes("Role") ||
      content.includes("Responsibilities") ||
      content.includes("Function"),
    severity: "ERROR",
  },
  {
    name: "Influence and Impact Assessment",
    description: "Must assess stakeholder influence and potential project impact",
    check: (content) =>
      content.includes("Influence") || content.includes("Impact") || content.includes("Authority"),
    severity: "WARN",
  },
  {
    name: "Stakeholder Interests and Motivations",
    description: "Should describe stakeholder interests and motivations",
    check: (content) =>
      content.includes("Interest") || content.includes("Motivation") || content.includes("Concern"),
    severity: "WARN",
  },
];

const COMMUNICATION_STRATEGY_RULES: ValidationRule[] = [
  {
    name: "Communication Strategy Section",
    description: "Must include communication strategy and engagement planning",
    check: (content) =>
      content.includes("Communication Strategy") || content.includes("Engagement Strategy"),
    severity: "ERROR",
  },
  {
    name: "Communication Methods",
    description: "Must define communication methods for different stakeholder groups",
    check: (content) =>
      content.includes("communication") &&
      (content.includes("email") || content.includes("meeting") || content.includes("report")),
    severity: "ERROR",
  },
  {
    name: "Communication Frequency",
    description: "Must specify communication frequency for each stakeholder group",
    check: (content) =>
      content.includes("frequency") ||
      content.includes("weekly") ||
      content.includes("monthly") ||
      content.includes("quarterly"),
    severity: "WARN",
  },
  {
    name: "Escalation Procedures",
    description: "Should define escalation procedures for stakeholder issues",
    check: (content) =>
      content.includes("escalation") ||
      content.includes("Escalation") ||
      content.includes("issue resolution"),
    severity: "WARN",
  },
];

const REGULATORY_COMPLIANCE_RULES: ValidationRule[] = [
  {
    name: "Regulatory Stakeholder Identification",
    description: "Must identify regulatory and compliance stakeholders",
    check: (content) =>
      content.includes("Regulators") ||
      content.includes("Authority") ||
      content.includes("Compliance"),
    severity: "ERROR",
  },
  {
    name: "Data Protection Authorities",
    description: "Should include data protection / privacy authorities where relevant",
    check: (content) =>
      content.includes("Data Protection") ||
      content.includes("Privacy") ||
      content.includes("regulator"),
    severity: "WARN",
  },
  {
    name: "Industry-Specific Regulators",
    description: "Must identify industry-specific regulatory bodies",
    check: (content) =>
      content.includes("Regulator") ||
      content.includes("regulatory") ||
      content.includes("Authority") ||
      content.includes("Compliance"),
    severity: "WARN",
  },
  {
    name: "Compliance Requirements",
    description: "Should reference relevant compliance requirements/standards",
    check: (content) =>
      content.includes("compliance requirements") ||
      content.includes("Compliance") ||
      content.includes("standard") ||
      content.includes("regulation"),
    severity: "WARN",
  },
];

// DOMAIN-AGNOSTIC: applies to every stakeholder map regardless of industry.
const CORE_STAKEHOLDER_GROUPS_RULES: ValidationRule[] = [
  {
    name: "Privacy and Security Stakeholders",
    description: "Must include privacy and security stakeholders",
    check: (content) =>
      content.includes("Security") ||
      content.includes("Privacy") ||
      content.includes("CISO") ||
      content.includes("Legal"),
    severity: "ERROR",
  },
  {
    name: "End User Considerations",
    description: "Should consider end users and customer support representatives",
    check: (content) =>
      content.includes("Customer") ||
      content.includes("User") ||
      content.includes("Support") ||
      content.includes("End user"),
    severity: "WARN",
  },
];

/* ────────────────────────────────────────────────────────────────────
   OVERRIDABLE EXAMPLE — biometric-identity / banking industry pack (NOT
   DEFAULT). These rules are applied ONLY when LIDR_DOMAIN_PACK=biometric. They
   are documentation/example content showing how a domain pack layers extra,
   domain-specific stakeholder checks on top of the agnostic defaults. They are
   NOT spread into the default validation set.
──────────────────────────────────────────────────────────────────── */

const BIOMETRIC_DOMAIN_PACK_RULES: ValidationRule[] = [
  {
    name: "Biometric Domain Context",
    description: "Should address biometric-specific stakeholder considerations",
    check: (content) =>
      content.includes("biometric") ||
      content.includes("Biometric") ||
      content.includes("identity") ||
      content.includes("authentication") ||
      content.includes("verification"),
    severity: "WARN",
  },
  {
    name: "Banking Integration Stakeholders",
    description: "For banking projects, must identify banking integration stakeholders",
    check: (content) =>
      content.includes("Banking") ||
      content.includes("Financial") ||
      content.includes("Tier-1") ||
      content.includes("IT Security"),
    severity: "WARN",
  },
];

const DOMAIN_PACK_ENABLED = process.env.LIDR_DOMAIN_PACK === "biometric";

const RISK_ASSESSMENT_RULES: ValidationRule[] = [
  {
    name: "Risk Assessment Section",
    description: "Must include stakeholder risk assessment and mitigation",
    check: (content) =>
      content.includes("Risk Assessment") ||
      content.includes("Risk") ||
      content.includes("Mitigation"),
    severity: "ERROR",
  },
  {
    name: "Stakeholder Resistance Analysis",
    description: "Should analyze potential stakeholder resistance and opposition",
    check: (content) =>
      content.includes("resistance") ||
      content.includes("opposition") ||
      content.includes("conflict"),
    severity: "WARN",
  },
  {
    name: "Dependency Risk Analysis",
    description: "Should identify dependency risks from key stakeholders",
    check: (content) =>
      content.includes("dependency") ||
      content.includes("dependencies") ||
      content.includes("critical path"),
    severity: "WARN",
  },
  {
    name: "Mitigation Strategies",
    description: "Must provide mitigation strategies for identified risks",
    check: (content) =>
      content.includes("mitigation") ||
      content.includes("strategy") ||
      content.includes("contingency"),
    severity: "ERROR",
  },
];

const ENGAGEMENT_PLANNING_RULES: ValidationRule[] = [
  {
    name: "Engagement Planning Section",
    description: "Must include stakeholder engagement planning and tactics",
    check: (content) => content.includes("Engagement") && content.includes("Plan"),
    severity: "ERROR",
  },
  {
    name: "Key Message Development",
    description: "Should develop key messages for different stakeholder groups",
    check: (content) =>
      content.includes("message") ||
      content.includes("Message") ||
      content.includes("communication"),
    severity: "WARN",
  },
  {
    name: "Success Metrics",
    description: "Should define success metrics for stakeholder engagement",
    check: (content) =>
      content.includes("Success Metrics") || content.includes("KPI") || content.includes("measure"),
    severity: "WARN",
  },
  {
    name: "Timeline and Milestones",
    description: "Should include engagement timeline and key milestones",
    check: (content) =>
      content.includes("Timeline") || content.includes("milestone") || content.includes("schedule"),
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

  // Find all .md files in examples directory recursively
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

  // DEFAULT (domain-agnostic) rule set applied to every stakeholder-map example.
  const DEFAULT_STAKEHOLDER_RULES = [
    ...PROJECT_OVERVIEW_RULES,
    ...STAKEHOLDER_MATRIX_RULES,
    ...DETAILED_ANALYSIS_RULES,
    ...COMMUNICATION_STRATEGY_RULES,
    ...REGULATORY_COMPLIANCE_RULES,
    ...CORE_STAKEHOLDER_GROUPS_RULES,
    ...RISK_ASSESSMENT_RULES,
    ...ENGAGEMENT_PLANNING_RULES,
  ];

  // Optional biometric domain pack — appended ONLY when LIDR_DOMAIN_PACK=biometric.
  const activeRules = DOMAIN_PACK_ENABLED
    ? [...DEFAULT_STAKEHOLDER_RULES, ...BIOMETRIC_DOMAIN_PACK_RULES]
    : DEFAULT_STAKEHOLDER_RULES;

  const mdFiles = findMdFiles(examplesDir);
  const validationCases = mdFiles.map((filePath) => ({
    file: filePath.replace(examplesDir + "/", ""),
    fullPath: filePath,
    rules: activeRules,
    description: `Stakeholder Map: ${filePath.split("/").pop()?.replace(".md", "") || "Unknown"}`,
  }));

  console.log("🔍 Validating Stakeholder Map Skill Examples...\n");
  if (DOMAIN_PACK_ENABLED) {
    console.log("ℹ️  LIDR_DOMAIN_PACK=biometric — applying optional biometric domain rules.\n");
  }

  let totalPassed = 0;
  let totalFailed = 0;
  let totalWarnings = 0;
  let allValid = true;

  for (const testCase of validationCases) {
    if (!existsSync(testCase.fullPath)) {
      console.log(`❌ ${testCase.description}`);
      console.log(`   File not found: ${testCase.file}\n`);
      allValid = false;
      continue;
    }

    const result = validateFile(testCase.fullPath, testCase.rules);
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
  console.log("─".repeat(70));
  console.log(`📊 Stakeholder Map Validation Summary:`);
  console.log(`   ✅ ${totalPassed} rules passed`);
  console.log(`   ❌ ${totalFailed} rules failed`);
  console.log(`   ⚠️ ${totalWarnings} warnings`);

  if (allValid) {
    console.log("\n🎉 All stakeholder map examples are properly structured!");
    console.log("   Ready for comprehensive stakeholder identification and engagement.");
    console.log(
      "   🎯 Power/interest matrix, communication strategy, and risk assessment validated"
    );
  } else {
    console.log("\n💡 Fix the validation errors to ensure stakeholder engagement compatibility.");
    console.log("   Focus on power/interest matrix and communication strategy definition.");
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
