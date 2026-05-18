#!/usr/bin/env tsx
/**
 * validate-examples.ts - Domain Research Skill Example Validator
 *
 * Validates that domain-research skill examples contain proper structure
 * for systematic domain knowledge investigation and analysis.
 *
 * Validates:
 * - Domain research methodology and investigation structure
 * - Market pattern analysis and competitive intelligence
 * - Industry best practices documentation
 * - Technology landscape assessment
 * - Regulatory and compliance environment analysis
 * - Domain expert knowledge capture
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

const DOMAIN_RESEARCH_RULES: ValidationRule[] = [
  {
    name: "Research Methodology Structure",
    description: "Must contain structured research methodology with clear phases and approaches",
    check: (content) =>
      content.includes("methodology") &&
      content.includes("research") &&
      content.includes("approach"),
    severity: "ERROR",
  },
  {
    name: "Market Analysis Framework",
    description: "Must include market analysis framework with pattern identification",
    check: (content) =>
      content.includes("market") && content.includes("analysis") && content.includes("pattern"),
    severity: "ERROR",
  },
  {
    name: "Competitive Intelligence",
    description: "Must analyze competitive landscape and positioning",
    check: (content) => content.includes("competitive") && content.includes("competitor"),
    severity: "ERROR",
  },
  {
    name: "Industry Best Practices",
    description: "Must document industry best practices and standards",
    check: (content) => content.includes("best practices") && content.includes("industry"),
    severity: "ERROR",
  },
  {
    name: "Technology Landscape Assessment",
    description: "Must assess current technology landscape and trends",
    check: (content) => content.includes("technology") && content.includes("landscape"),
    severity: "ERROR",
  },
  {
    name: "Regulatory Environment Analysis",
    description: "Must analyze regulatory and compliance requirements in the domain",
    check: (content) => content.includes("regulatory") || content.includes("compliance"),
    severity: "ERROR",
  },
  {
    name: "Domain Expert Knowledge",
    description: "Must capture and synthesize domain expert knowledge",
    check: (content) => content.includes("domain expert") || content.includes("expert knowledge"),
    severity: "ERROR",
  },
  {
    name: "Research Sources Documentation",
    description: "Must document research sources and methodology for verification",
    check: (content) => content.includes("sources") && content.includes("research"),
    severity: "ERROR",
  },
  {
    name: "Key Findings Summary",
    description: "Must provide executive summary of key research findings",
    check: (content) => content.includes("key findings") || content.includes("findings"),
    severity: "ERROR",
  },
  {
    name: "Trend Analysis",
    description: "Must identify and analyze domain trends and future directions",
    check: (content) => content.includes("trend") && content.includes("future"),
    severity: "ERROR",
  },
  {
    name: "Risk Assessment",
    description: "Must assess domain-specific risks and challenges",
    check: (content) => content.includes("risk") && content.includes("challenge"),
    severity: "ERROR",
  },
  {
    name: "Opportunity Identification",
    description: "Must identify market opportunities and gaps",
    check: (content) => content.includes("opportunity") || content.includes("gap"),
    severity: "ERROR",
  },
  {
    name: "Stakeholder Ecosystem Mapping",
    description: "Must map key stakeholders and ecosystem participants",
    check: (content) => content.includes("stakeholder") && content.includes("ecosystem"),
    severity: "WARN",
  },
  {
    name: "Data-Driven Insights",
    description: "Must include quantitative data and metrics where available",
    check: (content) =>
      content.includes("data") && (content.includes("%") || content.includes("metric")),
    severity: "WARN",
  },
  {
    name: "Strategic Recommendations",
    description: "Must provide actionable strategic recommendations based on research",
    check: (content) => content.includes("recommendation") && content.includes("strategic"),
    severity: "ERROR",
  },
  {
    name: "Research Validation",
    description: "Must include validation approaches and confidence levels",
    check: (content) => content.includes("validation") || content.includes("confidence"),
    severity: "WARN",
  },
  {
    name: "Domain Terminology",
    description: "Must define and use domain-specific terminology correctly",
    check: (content) => content.includes("terminology") || content.includes("definition"),
    severity: "WARN",
  },
  {
    name: "Benchmark Analysis",
    description: "Must include benchmark analysis against industry standards",
    check: (content) => content.includes("benchmark") || content.includes("standard"),
    severity: "WARN",
  },
  {
    name: "Impact Assessment",
    description: "Must assess potential impact of research findings on business decisions",
    check: (content) => content.includes("impact") && content.includes("business"),
    severity: "ERROR",
  },
  {
    name: "Knowledge Gaps Identification",
    description: "Must identify areas requiring further research or investigation",
    check: (content) => content.includes("knowledge gap") || content.includes("further research"),
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
    "biometric-domain-research.md",
    "fintech-market-analysis.md",
    "regulatory-landscape-study.md",
  ];
  const validationCases = [];

  for (const file of exampleFiles) {
    const filePath = join(examplesDir, file);
    if (existsSync(filePath)) {
      validationCases.push({
        file,
        rules: DOMAIN_RESEARCH_RULES,
        description: `Domain Research Example: ${file}`,
      });
    }
  }

  if (validationCases.length === 0) {
    console.log("⚠️ No example files found to validate");
    console.log(
      "Expected files: biometric-domain-research.md, fintech-market-analysis.md, regulatory-landscape-study.md"
    );
    process.exit(0);
  }

  console.log("🔍 Validating Domain-Research Skill Examples...\n");

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
    console.log("\n🎉 All domain research examples are properly structured!");
    console.log("   Ready for comprehensive domain knowledge investigation.");
  } else {
    console.log("\n💡 Fix the validation errors to ensure thorough domain research coverage.");
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
