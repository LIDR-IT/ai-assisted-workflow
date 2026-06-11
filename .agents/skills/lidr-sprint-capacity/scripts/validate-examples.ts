#!/usr/bin/env tsx
/**
 * validate-examples.ts - Sprint Capacity Skill Example Validator
 *
 * Validates that sprint-capacity skill examples contain proper structure
 * for project sprint planning and capacity calculation.
 *
 * The DEFAULT validation set is 100% domain-agnostic (team composition,
 * availability analysis, capacity calculation, buffers, risk/contingency). An
 * overridable EXAMPLE industry pack (biometric identity) is preserved below as
 * the BIOMETRIC_DOMAIN_PACK_RULES constant and is applied ONLY behind an
 * explicit flag (`LIDR_DOMAIN_PACK=biometric`). It is documentation/example
 * only and is NOT part of the default behavior.
 *
 * Validates:
 * - Team composition with roles and specializations
 * - Availability analysis with impact mitigation
 * - Capacity calculations with buffers and risk factors
 * - Sprint commitment methodology and constraints
 * - Risk assessment and contingency planning
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

const SPRINT_BASIC_INFO_RULES: ValidationRule[] = [
  {
    name: "Sprint Header Information",
    description: "Must contain sprint duration, planning date, and key roles",
    check: (content) =>
      content.includes("Sprint Duration") &&
      content.includes("Planning Date") &&
      content.includes("Scrum Master"),
    severity: "ERROR",
  },
  {
    name: "Team Lead Assignments",
    description: "Must identify Product Owner and Tech Lead",
    check: (content) => content.includes("Product Owner") && content.includes("Tech Lead"),
    severity: "ERROR",
  },
  {
    name: "Sprint Timeline",
    description: "Must specify business days count (typically 10 business days for 2-week sprint)",
    check: (content) => content.includes("10 business days") || content.includes("business days"),
    severity: "ERROR",
  },
];

const TEAM_COMPOSITION_RULES: ValidationRule[] = [
  {
    name: "Core Development Team Section",
    description: "Must contain detailed development team composition with roles and capacities",
    check: (content) =>
      content.includes("Core Development Team") &&
      content.includes("Availability") &&
      content.includes("Capacity (hrs)"),
    severity: "ERROR",
  },
  {
    name: "QA Team Section",
    description: "Must include QA team with testing specializations",
    check: (content) => content.includes("Quality Assurance Team") && content.includes("QA"),
    severity: "ERROR",
  },
  {
    name: "Role Specializations",
    description: "Must document role specializations relevant to the development work",
    check: (content) => content.includes("Specialization") || content.includes("Specializations"),
    severity: "ERROR",
  },
  {
    name: "Individual Capacity Calculation",
    description: "Must show individual capacity in hours for each team member",
    check: (content) => /\d+h/.test(content) && content.includes("hrs"),
    severity: "ERROR",
  },
  {
    name: "Support and Consulting Roles",
    description: "Should include support roles like Security, UX, or Architecture",
    check: (content) =>
      content.includes("Support") &&
      (content.includes("Security") || content.includes("UX") || content.includes("DevOps")),
    severity: "WARN",
  },
];

const AVAILABILITY_ANALYSIS_RULES: ValidationRule[] = [
  {
    name: "Availability Details Section",
    description: "Must contain availability analysis with impact assessment",
    check: (content) => content.includes("Availability Details") && content.includes("Impact"),
    severity: "ERROR",
  },
  {
    name: "Reduced Availability Factors",
    description: "Must document reasons for reduced availability and mitigation strategies",
    check: (content) =>
      content.includes("Reduced Availability") && content.includes("Impact Mitigation"),
    severity: "ERROR",
  },
  {
    name: "Holiday and Time-Off Schedule",
    description: "Must account for holidays and planned time off",
    check: (content) => content.includes("Holiday") && content.includes("Time-Off"),
    severity: "ERROR",
  },
  {
    name: "Buffer and Risk Factors",
    description: "Must include buffer allocation and risk factors",
    check: (content) => content.includes("Buffer") && content.includes("Risk Factors"),
    severity: "ERROR",
  },
  {
    name: "Percentage-Based Buffer Allocation",
    description: "Must specify buffer percentages (typically 15% capacity buffer)",
    check: (content) => /\d+%.*buffer/.test(content) || /buffer.*\d+%/.test(content),
    severity: "ERROR",
  },
];

const CAPACITY_CALCULATION_RULES: ValidationRule[] = [
  {
    name: "Raw Capacity Calculation",
    description: "Must show raw capacity calculation with formula",
    check: (content) =>
      content.includes("Raw Capacity") &&
      content.includes("business days") &&
      content.includes("hours/day"),
    severity: "ERROR",
  },
  {
    name: "Realistic Available Capacity",
    description: "Must calculate realistic capacity considering availability factors",
    check: (content) =>
      content.includes("Realistic Available Capacity") || content.includes("Available Capacity"),
    severity: "ERROR",
  },
  {
    name: "Team Category Breakdown",
    description: "Must break down capacity by team categories (Dev, QA, DevOps, etc.)",
    check: (content) => content.includes("Development Team") && content.includes("QA Team"),
    severity: "ERROR",
  },
  {
    name: "Sprint Buffers and Allocations",
    description: "Must define specific buffer allocations with justifications",
    check: (content) => content.includes("Sprint Buffers") && content.includes("Justification"),
    severity: "ERROR",
  },
  {
    name: "Numerical Capacity Validation",
    description: "Must include numerical capacity calculations (hours)",
    check: (content) => /\d+h/.test(content) && /\d{2,3}h/.test(content),
    severity: "ERROR",
  },
];

/* ────────────────────────────────────────────────────────────────────
   OVERRIDABLE EXAMPLE — biometric-identity industry pack (NOT DEFAULT).
   These rules are applied ONLY when LIDR_DOMAIN_PACK=biometric. They are
   documentation/example content showing how a domain pack layers extra,
   domain-specific team-composition checks (biometric specializations, anti-
   spoofing, mobile SDK) on top of the agnostic defaults. They are NOT spread
   into the default validation set.
──────────────────────────────────────────────────────────────────── */

const BIOMETRIC_DOMAIN_PACK_RULES: ValidationRule[] = [
  {
    name: "Biometric Specialization Focus",
    description: "Must highlight biometric-specific skills and specializations",
    check: (content) =>
      content.includes("Facial recognition") ||
      content.includes("biometric") ||
      content.includes("Selphi") ||
      content.includes("SelphID") ||
      content.includes("anti-spoofing"),
    severity: "ERROR",
  },
  {
    name: "Algorithm and ML Expertise",
    description: "Should identify machine learning and algorithm development expertise",
    check: (content) =>
      content.includes("ML Engineer") ||
      content.includes("algorithm") ||
      content.includes("Machine Learning"),
    severity: "WARN",
  },
  {
    name: "Mobile SDK Specialization",
    description: "Must identify mobile SDK development capabilities",
    check: (content) =>
      content.includes("Mobile Developer") &&
      (content.includes("SDK") || content.includes("iOS") || content.includes("Android")),
    severity: "ERROR",
  },
  {
    name: "Security Focus for Biometric Data",
    description: "Should include security expertise for biometric data handling",
    check: (content) =>
      content.includes("Security") &&
      (content.includes("DAST") || content.includes("pen test") || content.includes("biometric")),
    severity: "WARN",
  },
  {
    name: "Performance Testing Specialization",
    description: "Should identify performance testing capabilities for algorithm benchmarking",
    check: (content) => content.includes("Performance Test") && content.includes("algorithm"),
    severity: "WARN",
  },
];

const DOMAIN_PACK_ENABLED = process.env.LIDR_DOMAIN_PACK === "biometric";

const SPRINT_COMMITMENT_RULES: ValidationRule[] = [
  {
    name: "Sprint Commitment Methodology",
    description: "Should explain sprint commitment approach and constraints",
    check: (content) => content.includes("Commitment") || content.includes("commitment"),
    severity: "WARN",
  },
  {
    name: "Velocity Considerations",
    description: "Should reference team velocity or historical performance",
    check: (content) =>
      content.includes("velocity") ||
      content.includes("historical") ||
      content.includes("previous sprint"),
    severity: "WARN",
  },
  {
    name: "Risk Assessment",
    description: "Must include risk assessment for capacity planning",
    check: (content) => content.includes("risk") && content.includes("assessment"),
    severity: "WARN",
  },
  {
    name: "Contingency Planning",
    description: "Should include contingency plans for capacity shortfalls",
    check: (content) =>
      content.includes("contingency") ||
      content.includes("mitigation") ||
      content.includes("backup"),
    severity: "WARN",
  },
];

const TECHNICAL_CONSIDERATIONS_RULES: ValidationRule[] = [
  {
    name: "Technical Debt Allocation",
    description: "Must allocate time for technical debt",
    check: (content) => content.includes("technical debt") && /\d+%/.test(content),
    severity: "ERROR",
  },
  {
    name: "Bug Fixing Allocation",
    description: "Must reserve capacity for bug fixing",
    check: (content) => content.includes("bug fixing") || content.includes("Bug fixing"),
    severity: "ERROR",
  },
  {
    name: "Knowledge Transfer Planning",
    description: "Should include time for knowledge transfer and cross-training",
    check: (content) =>
      content.includes("knowledge transfer") || content.includes("cross-training"),
    severity: "WARN",
  },
  {
    name: "CI/CD and Deployment Considerations",
    description: "Should account for deployment and infrastructure work",
    check: (content) =>
      content.includes("CI/CD") ||
      content.includes("deployment") ||
      content.includes("infrastructure"),
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

  // DEFAULT (domain-agnostic) rule set applied to every sprint-capacity example.
  const DEFAULT_CAPACITY_RULES = [
    ...SPRINT_BASIC_INFO_RULES,
    ...TEAM_COMPOSITION_RULES,
    ...AVAILABILITY_ANALYSIS_RULES,
    ...CAPACITY_CALCULATION_RULES,
    ...SPRINT_COMMITMENT_RULES,
    ...TECHNICAL_CONSIDERATIONS_RULES,
  ];

  // Optional biometric domain pack — appended ONLY when LIDR_DOMAIN_PACK=biometric.
  const activeRules = DOMAIN_PACK_ENABLED
    ? [...DEFAULT_CAPACITY_RULES, ...BIOMETRIC_DOMAIN_PACK_RULES]
    : DEFAULT_CAPACITY_RULES;

  const mdFiles = findMdFiles(examplesDir);
  const validationCases = mdFiles.map((filePath) => ({
    file: filePath.replace(examplesDir + "/", ""),
    fullPath: filePath,
    rules: activeRules,
    description: `Sprint Capacity Planning: ${filePath.split("/").pop()?.replace(".md", "") || "Unknown"}`,
  }));

  console.log("🔍 Validating Sprint Capacity Skill Examples...\n");
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
  console.log(`📊 Sprint Capacity Validation Summary:`);
  console.log(`   ✅ ${totalPassed} rules passed`);
  console.log(`   ❌ ${totalFailed} rules failed`);
  console.log(`   ⚠️ ${totalWarnings} warnings`);

  if (allValid) {
    console.log("\n🎉 All sprint capacity examples are properly structured!");
    console.log("   Ready for project sprint planning.");
    console.log("   📊 Team composition, capacity calculation, and risk assessment validated");
  } else {
    console.log("\n💡 Fix the validation errors to ensure sprint planning compatibility.");
    console.log("   Focus on capacity calculation methodology and team composition.");
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
