#!/usr/bin/env tsx
/**
 * validate-examples.ts - Technical Research Skill Example Validator
 *
 * Validates that technical-research skill examples contain proper structure
 * for systematic technical feasibility investigation and engineering decisions.
 *
 * Validates:
 * - Research methodology with clear questions and constraints
 * - Evaluation framework with weighted criteria and success thresholds
 * - Investigation results with evidence-based scoring
 * - Option comparison with strengths/weaknesses analysis
 * - Risk assessment and mitigation strategies
 * - Implementation recommendations with next steps
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

const RESEARCH_STRUCTURE_RULES: ValidationRule[] = [
  {
    name: "Executive Summary Section",
    description: "Must contain executive summary with research question and recommendation",
    check: (content) =>
      content.includes("Executive Summary") &&
      content.includes("Research Question") &&
      content.includes("Recommendation"),
    severity: "ERROR",
  },
  {
    name: "Research Scope Definition",
    description: "Must define research scope with primary questions",
    check: (content) => content.includes("Research Scope") && content.includes("Primary Questions"),
    severity: "ERROR",
  },
  {
    name: "Investigation Constraints",
    description: "Must document time, budget, resources, and risk tolerance constraints",
    check: (content) =>
      content.includes("Investigation Constraints") &&
      content.includes("Time:") &&
      content.includes("Budget:"),
    severity: "ERROR",
  },
  {
    name: "Methodology Section",
    description: "Must describe research approaches and methods used",
    check: (content) => content.includes("Methodology") && content.includes("Research Approaches"),
    severity: "ERROR",
  },
  {
    name: "Evaluation Framework",
    description: "Must define evaluation criteria with weights and success thresholds",
    check: (content) =>
      content.includes("Evaluation Framework") &&
      content.includes("Weight") &&
      content.includes("Success Threshold"),
    severity: "ERROR",
  },
];

const INVESTIGATION_QUALITY_RULES: ValidationRule[] = [
  {
    name: "Quantitative Scoring System",
    description: "Must use numerical scoring system for option evaluation (e.g., X.X/10)",
    check: (content) => /\d+\.\d+\/10/.test(content) || /Score.*:\s*\d+\.\d+/.test(content),
    severity: "ERROR",
  },
  {
    name: "Evidence-Based Analysis",
    description:
      "Must include concrete evidence for each finding (benchmarks, consultations, testing)",
    check: (content) =>
      content.includes("Evidence") &&
      (content.includes("Benchmark") ||
        content.includes("consultation") ||
        content.includes("testing")),
    severity: "ERROR",
  },
  {
    name: "Comparative Analysis",
    description: "Must compare multiple options with structured strengths/weaknesses",
    check: (content) =>
      content.includes("Strengths") && content.includes("Weaknesses") && content.includes("Option"),
    severity: "ERROR",
  },
  {
    name: "Performance Metrics",
    description: "Must include specific performance metrics with measurable criteria",
    check: (content) =>
      /\d+(\.\d+)?(ms|s|MB|GB|%)/.test(content) &&
      (content.includes("P95") || content.includes("P99") || content.includes("target")),
    severity: "ERROR",
  },
  {
    name: "Expert Consultation Documentation",
    description: "Must document expert consultations with specific teams or vendors",
    check: (content) =>
      content.includes("consultation") &&
      (content.includes("team") || content.includes("vendor") || content.includes("expert")),
    severity: "WARN",
  },
];

const TECHNICAL_DEPTH_RULES: ValidationRule[] = [
  {
    name: "Technical Architecture Analysis",
    description: "Must analyze technical architecture implications and integration complexity",
    check: (content) =>
      content.includes("architecture") &&
      (content.includes("integration") || content.includes("complexity")),
    severity: "ERROR",
  },
  {
    name: "Scalability Assessment",
    description: "Must assess scalability characteristics and performance at scale",
    check: (content) =>
      content.includes("scalability") ||
      content.includes("performance") ||
      content.includes("scale"),
    severity: "WARN",
  },
  {
    name: "Security Considerations",
    description: "Must address security implications and risk assessment",
    check: (content) =>
      content.includes("security") || content.includes("Security") || content.includes("risk"),
    severity: "WARN",
  },
  {
    name: "Maintenance and Support",
    description: "Must consider maintenance overhead and long-term support implications",
    check: (content) =>
      content.includes("maintenance") ||
      content.includes("support") ||
      content.includes("overhead"),
    severity: "WARN",
  },
];

const DECISION_FRAMEWORK_RULES: ValidationRule[] = [
  {
    name: "Clear Recommendation",
    description: "Must provide clear recommendation with specific option selection",
    check: (content) =>
      content.includes("Recommendation") &&
      (content.includes("TensorFlow") ||
        content.includes("PyTorch") ||
        content.includes("recommended")),
    severity: "ERROR",
  },
  {
    name: "Business Impact Analysis",
    description: "Must quantify business impact with specific metrics or percentages",
    check: (content) => content.includes("Impact") && /\d+%/.test(content),
    severity: "ERROR",
  },
  {
    name: "Next Steps Definition",
    description: "Must define concrete next steps for implementation or further validation",
    check: (content) =>
      content.includes("Next Steps") &&
      (content.includes("PoC") ||
        content.includes("implementation") ||
        content.includes("validation")),
    severity: "ERROR",
  },
  {
    name: "Risk Mitigation Strategy",
    description: "Must address potential risks and mitigation strategies",
    check: (content) => content.includes("risk") && content.includes("mitigation"),
    severity: "WARN",
  },
  {
    name: "Timeline and Resource Requirements",
    description: "Must specify timeline and resource requirements for next steps",
    check: (content) =>
      content.includes("weeks") || content.includes("days") || content.includes("resources"),
    severity: "WARN",
  },
];

const DOMAIN_SPECIFIC_RULES: ValidationRule[] = [
  {
    name: "Technology Stack Analysis",
    description: "Must analyze specific technology stacks, frameworks, or platforms",
    check: (content) =>
      content.includes("TensorFlow") ||
      content.includes("PyTorch") ||
      content.includes("framework") ||
      content.includes("platform"),
    severity: "ERROR",
  },
  {
    name: "Cross-Platform Considerations",
    description: "Must consider cross-platform compatibility (iOS/Android, browser support, etc.)",
    check: (content) =>
      content.includes("iOS") ||
      content.includes("Android") ||
      content.includes("cross-platform") ||
      content.includes("compatibility"),
    severity: "WARN",
  },
  {
    name: "Performance Benchmarking",
    description: "Must include actual performance benchmarking data",
    check: (content) =>
      content.includes("benchmark") && content.includes("performance") && /\d+\.\d+s/.test(content),
    severity: "ERROR",
  },
  {
    name: "Cost-Benefit Analysis",
    description: "Must include cost considerations (compute, licensing, development effort)",
    check: (content) =>
      content.includes("cost") || content.includes("Budget") || content.includes("effort"),
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
      file: "biometric-framework-evaluation.md",
      rules: [
        ...RESEARCH_STRUCTURE_RULES,
        ...INVESTIGATION_QUALITY_RULES,
        ...TECHNICAL_DEPTH_RULES,
        ...DECISION_FRAMEWORK_RULES,
        ...DOMAIN_SPECIFIC_RULES,
      ],
      description: "Biometric Framework Evaluation Research",
    },
    {
      file: "cloud-migration-research.md",
      rules: [
        ...RESEARCH_STRUCTURE_RULES,
        ...INVESTIGATION_QUALITY_RULES,
        ...TECHNICAL_DEPTH_RULES,
        ...DECISION_FRAMEWORK_RULES,
        {
          name: "Cloud Provider Analysis",
          description: "Must analyze multiple cloud providers with cost and feature comparison",
          check: (content) =>
            content.includes("AWS") ||
            content.includes("Azure") ||
            content.includes("GCP") ||
            content.includes("cloud provider"),
          severity: "ERROR",
        },
        {
          name: "Migration Strategy",
          description: "Must define migration strategy with phases and risk assessment",
          check: (content) =>
            content.includes("migration") &&
            content.includes("strategy") &&
            content.includes("phases"),
          severity: "ERROR",
        },
      ],
      description: "Cloud Migration Research Analysis",
    },
  ];

  console.log("🔍 Validating Technical Research Skill Examples...\n");

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
  console.log("─".repeat(70));
  console.log(`📊 Technical Research Validation Summary:`);
  console.log(`   ✅ ${totalPassed} rules passed`);
  console.log(`   ❌ ${totalFailed} rules failed`);
  console.log(`   ⚠️ ${totalWarnings} warnings`);

  if (allValid) {
    console.log("\n🎉 All technical research examples are properly structured!");
    console.log("   Ready for systematic technical feasibility investigation.");
    console.log("   🔬 Evidence-based analysis with quantitative scoring validated");
  } else {
    console.log("\n💡 Fix the validation errors to ensure research quality standards.");
    console.log("   Focus on evidence-based analysis and quantitative evaluation framework.");
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
