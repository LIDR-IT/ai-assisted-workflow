#!/usr/bin/env tsx
/**
 * validate-examples.ts - DAST Interpretation Skill Example Validator
 *
 * Validates that dast-interpretation skill examples contain proper structure
 * for analyzing Dynamic Application Security Testing (DAST) reports.
 *
 * Validates:
 * - DAST report structure and format
 * - Security vulnerability categorization (CVSS scores, priorities)
 * - Biometric domain-specific security considerations
 * - Infrastructure and configuration analysis
 * - Compliance assessment (GDPR, PSD2, eIDAS)
 * - Remediation roadmap and business impact
 * - Runtime performance under attack scenarios
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

const DAST_REPORT_RULES: ValidationRule[] = [
  {
    name: "Executive Summary Structure",
    description: "Must contain comprehensive executive summary with DAST overview",
    check: (content) =>
      content.includes("Executive Summary") && content.includes("DAST Assessment Overview"),
    severity: "ERROR",
  },
  {
    name: "Security Posture Assessment",
    description: "Must include overall security rating and vulnerability counts by severity",
    check: (content) =>
      content.includes("Critical Vulnerabilities") &&
      content.includes("High Risk Issues") &&
      content.includes("Medium Risk Issues"),
    severity: "ERROR",
  },
  {
    name: "CVSS Scoring Integration",
    description: "Must use CVSS scores for vulnerability severity assessment",
    check: (content) =>
      content.includes("CVSS") && content.includes("Critical") && content.includes("High"),
    severity: "ERROR",
  },
  {
    name: "Vulnerability Categorization",
    description:
      "Must categorize vulnerabilities by type (Authentication, Session Management, etc.)",
    check: (content) =>
      content.includes("Authentication") && content.includes("Session Management"),
    severity: "ERROR",
  },
  {
    name: "Technical Analysis Detail",
    description: "Must provide technical root cause analysis for vulnerabilities",
    check: (content) => content.includes("Root Cause") && content.includes("Technical Analysis"),
    severity: "ERROR",
  },
  {
    name: "Business Impact Assessment",
    description: "Must assess business impact and regulatory implications",
    check: (content) => content.includes("Business Impact") && content.includes("regulatory"),
    severity: "ERROR",
  },
  {
    name: "Runtime Behavior Analysis",
    description: "Must analyze runtime behavior and performance under attack scenarios",
    check: (content) => content.includes("Runtime Behavior") && content.includes("Under Attack"),
    severity: "ERROR",
  },
  {
    name: "Biometric-Specific Testing",
    description: "Must include biometric domain-specific security considerations",
    check: (content) =>
      content.includes("Biometric") &&
      content.includes("template") &&
      content.includes("verification"),
    severity: "ERROR",
  },
  {
    name: "Infrastructure Assessment",
    description: "Must analyze infrastructure and configuration security",
    check: (content) => content.includes("Infrastructure") && content.includes("Configuration"),
    severity: "ERROR",
  },
  {
    name: "Load Testing Integration",
    description: "Must test security under load conditions",
    check: (content) =>
      content.includes("load") && content.includes("performance") && content.includes("Under Load"),
    severity: "ERROR",
  },
  {
    name: "Compliance Framework Analysis",
    description: "Must address regulatory compliance (GDPR, PSD2, eIDAS)",
    check: (content) =>
      content.includes("GDPR") && content.includes("PSD2") && content.includes("Compliance"),
    severity: "ERROR",
  },
  {
    name: "Remediation Roadmap",
    description: "Must provide detailed remediation roadmap with priorities and timelines",
    check: (content) =>
      content.includes("Remediation Roadmap") && content.includes("Immediate Actions"),
    severity: "ERROR",
  },
  {
    name: "False Positive Analysis",
    description: "Must distinguish between true positives and false positives/mitigated findings",
    check: (content) => content.includes("False Positive") || content.includes("Mitigated"),
    severity: "WARN",
  },
  {
    name: "Anti-Spoofing Testing",
    description: "Must test anti-spoofing mechanisms for biometric systems",
    check: (content) => content.includes("spoofing") || content.includes("liveness"),
    severity: "ERROR",
  },
  {
    name: "Rate Limiting Validation",
    description: "Must test rate limiting and DoS protection mechanisms",
    check: (content) => content.includes("Rate Limiting") && content.includes("DoS"),
    severity: "ERROR",
  },
  {
    name: "Session Management Testing",
    description: "Must validate session management security across the application",
    check: (content) => content.includes("Session") && content.includes("Management"),
    severity: "ERROR",
  },
  {
    name: "API Security Assessment",
    description: "Must assess API-specific security vulnerabilities",
    check: (content) => content.includes("API") && content.includes("endpoint"),
    severity: "ERROR",
  },
  {
    name: "Performance Impact Analysis",
    description: "Must analyze performance impact of security controls and attacks",
    check: (content) =>
      content.includes("Performance Impact") && content.includes("Resource Utilization"),
    severity: "ERROR",
  },
  {
    name: "Financial Impact Assessment",
    description: "Must provide financial risk and ROI analysis for remediation",
    check: (content) => content.includes("Financial Impact") && content.includes("ROI"),
    severity: "WARN",
  },
  {
    name: "Auto-Scaling Behavior",
    description: "Must test auto-scaling response under attack conditions",
    check: (content) => content.includes("Auto-scaling") || content.includes("scaling"),
    severity: "WARN",
  },
  {
    name: "Monitoring and Alerting",
    description: "Must assess monitoring and alerting capabilities",
    check: (content) => content.includes("Monitoring") && content.includes("alerting"),
    severity: "WARN",
  },
  {
    name: "Success Metrics Definition",
    description: "Must define measurable success metrics for security improvements",
    check: (content) => content.includes("Success Metrics") && content.includes("%"),
    severity: "WARN",
  },
  {
    name: "Strategic Recommendations",
    description: "Must provide strategic recommendations for long-term security posture",
    check: (content) =>
      content.includes("Strategic Recommendations") && content.includes("Long-term"),
    severity: "ERROR",
  },
  {
    name: "Data Protection Analysis",
    description: "Must analyze data protection mechanisms for sensitive biometric data",
    check: (content) => content.includes("Data Protection") || content.includes("Article 9"),
    severity: "ERROR",
  },
  {
    name: "Multi-Factor Authentication Testing",
    description: "Must test multi-factor authentication security",
    check: (content) => content.includes("Multi-factor") || content.includes("multi-factor"),
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
      file: "api-runtime-security-scan.md",
      rules: DAST_REPORT_RULES,
      description: "DAST API Runtime Security Assessment Report",
    },
  ];

  console.log("🔍 Validating DAST-Interpretation Skill Examples...\n");

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
    console.log("\n🎉 All DAST interpretation examples are properly structured!");
    console.log("   Ready for runtime security testing and vulnerability assessment.");
  } else {
    console.log("\n💡 Fix the validation errors to ensure comprehensive DAST analysis.");
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
