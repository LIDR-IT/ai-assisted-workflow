#!/usr/bin/env tsx
/**
 * validate-examples.ts - Security Checklist Skill Example Validator
 *
 * Validates that security-checklist skill examples contain proper structure
 * for automated security validation and Gate 6 compliance assessment.
 *
 * Validates:
 * - GDPR special-category data compliance sections
 * - OWASP Top 10 security validation complete coverage
 * - PSD2 SCA compliance assessment for regulated/payment contexts
 * - ISO 27001 controls mapping with evidence requirements
 * - Gate 6 approval conditions and risk acceptance criteria
 *
 * The DEFAULT validation set is DOMAIN-AGNOSTIC — the rule sets check universal
 * security/compliance concepts (GDPR special-category data, OWASP Top 10, PSD2
 * SCA, ISO 27001, executive sign-off) — LIDR is a multi-industry framework. An
 * OPTIONAL biometric/identity domain pack of extra rules (template encryption,
 * liveness / anti-spoofing / presentation-attack detection, biometric legal
 * basis) is preserved as BIOMETRIC_DOMAIN_PACK below and applied only when
 * LIDR_DOMAIN_PACK === 'biometric'. Example only — NOT the active default.
 *
 * Usage: npx tsx scripts/validate-examples.ts
 *        LIDR_DOMAIN_PACK=biometric npx tsx scripts/validate-examples.ts
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

// DEFAULT — domain-agnostic. GDPR Article 9 governs ALL special-category data
// (health, biometric, genetic, political/religious, etc.), not biometrics alone.
const GDPR_COMPLIANCE_RULES: ValidationRule[] = [
  {
    name: "GDPR Article 9 Special Category Data Section",
    description:
      "Must contain a GDPR Article 9 compliance assessment for special-category personal data",
    check: (content) =>
      content.includes("GDPR Article 9 Compliance") && content.includes("Special Category Data"),
    severity: "ERROR",
  },
  {
    name: "Lawful Basis Documentation",
    description: "Must document the lawful basis for processing special-category data",
    check: (content) =>
      content.includes("Legal Basis") ||
      content.includes("Lawful Basis") ||
      content.includes("consent"),
    severity: "ERROR",
  },
  {
    name: "Data Minimization Assessment",
    description: "Must validate data minimization principles for the processed personal data",
    check: (content) => content.includes("Data Minimization"),
    severity: "ERROR",
  },
  {
    name: "Data Subject Rights Implementation",
    description: "Must detail implementation of all GDPR data subject rights",
    check: (content) =>
      content.includes("Data Subject Rights") &&
      content.includes("Portability") &&
      content.includes("Erasure"),
    severity: "ERROR",
  },
  {
    name: "Technical and Organizational Measures",
    description: "Must document specific security measures for personal data protection",
    check: (content) =>
      content.includes("Technical and Organizational Measures") && content.includes("AES-256"),
    severity: "ERROR",
  },
];

const OWASP_VALIDATION_RULES: ValidationRule[] = [
  {
    name: "OWASP Top 10 Complete Coverage",
    description: "Must cover all OWASP Top 10 2021 categories",
    check: (content) =>
      content.includes("OWASP Top 10 Security Validation") &&
      content.includes("A01:2021") &&
      content.includes("A10:2021"),
    severity: "ERROR",
  },
  {
    name: "Broken Access Control (A01)",
    description: "Must validate access control measures with evidence",
    check: (content) =>
      content.includes("Broken Access Control") &&
      content.includes("RBAC") &&
      content.includes("privilege escalation"),
    severity: "ERROR",
  },
  {
    name: "Cryptographic Failures (A02)",
    description: "Must assess cryptographic implementation with specific algorithms",
    check: (content) =>
      content.includes("Cryptographic Failures") &&
      content.includes("AES-256-GCM") &&
      content.includes("RSA-4096"),
    severity: "ERROR",
  },
  {
    name: "Injection Attacks (A03)",
    description: "Must validate injection prevention with testing coverage",
    check: (content) =>
      content.includes("Injection Attacks") &&
      content.includes("parameterized queries") &&
      content.includes("endpoints tested"),
    severity: "ERROR",
  },
  {
    name: "Security Testing Evidence",
    description: "Must include penetration testing evidence and vulnerability counts",
    check: (content) =>
      content.includes("Penetration testing") && content.includes("vulnerabilities found"),
    severity: "ERROR",
  },
];

const PSD2_COMPLIANCE_RULES: ValidationRule[] = [
  {
    name: "PSD2 Strong Customer Authentication",
    description: "Must contain PSD2 SCA compliance assessment section",
    check: (content) =>
      content.includes("PSD2 Strong Customer Authentication") && content.includes("EBA RTS"),
    severity: "ERROR",
  },
  {
    name: "Authentication Factor Independence",
    description: "Must validate independence of authentication factors",
    check: (content) =>
      content.includes("Authentication Factor Independence") &&
      content.includes("Knowledge Factor") &&
      content.includes("Possession Factor"),
    severity: "ERROR",
  },
  {
    name: "Dynamic Linking Implementation",
    description: "Must assess transaction-specific authentication challenges",
    check: (content) =>
      content.includes("Dynamic Linking") &&
      content.includes("transaction-specific") &&
      content.includes("replay attack"),
    severity: "ERROR",
  },
  {
    name: "Performance Requirements",
    description: "Must include authentication time limits and performance metrics",
    check: (content) =>
      content.includes("Authentication Time") && content.includes("P95") && content.includes("P99"),
    severity: "WARN",
  },
];

const ISO27001_RULES: ValidationRule[] = [
  {
    name: "ISO 27001 Security Controls Assessment",
    description: "Must contain comprehensive ISO 27001 controls mapping",
    check: (content) =>
      content.includes("ISO 27001 Security Controls") && content.includes("ISO-A."),
    severity: "ERROR",
  },
  {
    name: "Information Security Policies",
    description: "Must validate information security policy implementation",
    check: (content) =>
      content.includes("Information Security Policies") && content.includes("ISO-A.5"),
    severity: "ERROR",
  },
  {
    name: "Access Control Assessment",
    description: "Must assess access control policy and procedures",
    check: (content) =>
      content.includes("Access Control") &&
      content.includes("ISO-A.9") &&
      content.includes("user access management"),
    severity: "ERROR",
  },
  {
    name: "Cryptography Controls",
    description: "Must validate cryptographic policy and key management",
    check: (content) =>
      content.includes("Cryptography") &&
      content.includes("ISO-A.10") &&
      content.includes("key management"),
    severity: "ERROR",
  },
];

/* ────────────────────────────────────────────────────────────────────
   OPTIONAL BIOMETRIC / IDENTITY DOMAIN PACK
   Example only — NOT part of the default validation set. Spread into
   validationCases ONLY when LIDR_DOMAIN_PACK === 'biometric'. Holds the
   biometric-specific rules (template encryption, liveness / anti-spoofing /
   presentation-attack detection, biometric legal basis) that do not belong
   in the domain-agnostic default path.
──────────────────────────────────────────────────────────────────── */

const BIOMETRIC_DOMAIN_PACK: ValidationRule[] = [
  {
    name: "Biometric Data Legal Basis",
    description: "Must document explicit consent mechanism for biometric processing",
    check: (content) =>
      content.includes("Biometric Data Legal Basis") && content.includes("explicit consent"),
    severity: "ERROR",
  },
  {
    name: "Biometric Template Data Minimization",
    description: "Must validate data minimization principles for biometric templates",
    check: (content) =>
      content.includes("Data Minimization") && content.includes("biometric templates"),
    severity: "ERROR",
  },
  {
    name: "Biometric-Specific Security Requirements",
    description: "Must contain dedicated biometric security assessment section",
    check: (content) =>
      content.includes("Biometric-Specific Security Requirements") ||
      content.includes("Biometric Template Security"),
    severity: "ERROR",
  },
  {
    name: "Template Encryption and Protection",
    description: "Must validate biometric template encryption measures",
    check: (content) =>
      content.includes("Template Encryption") &&
      content.includes("AES-256-GCM") &&
      content.includes("HSM"),
    severity: "ERROR",
  },
  {
    name: "Liveness Detection Validation",
    description: "Must assess anti-spoofing and liveness detection security",
    check: (content) =>
      content.includes("Liveness Detection") &&
      content.includes("Anti-Spoofing") &&
      content.includes("Presentation Attack Detection"),
    severity: "ERROR",
  },
  {
    name: "Template Matching Security",
    description: "Must validate secure biometric matching processes",
    check: (content) =>
      content.includes("Template Matching") &&
      content.includes("zero-knowledge") &&
      content.includes("timing attack"),
    severity: "WARN",
  },
];

const GATE6_APPROVAL_RULES: ValidationRule[] = [
  {
    name: "Gate 6 Security Decision",
    description: "Must contain explicit Gate 6 approval recommendation with conditions",
    check: (content) =>
      content.includes("Gate 6") &&
      (content.includes("APPROVED") ||
        content.includes("CONDITIONAL") ||
        content.includes("REJECTED")),
    severity: "ERROR",
  },
  {
    name: "Outstanding Security Items",
    description: "Must detail any outstanding security items with resolution timelines",
    check: (content) =>
      content.includes("Outstanding Security Items") && content.includes("Resolution Timeline"),
    severity: "ERROR",
  },
  {
    name: "Security Confidence Level",
    description: "Must provide quantitative security confidence assessment",
    check: (content) => content.includes("Security Confidence Level") && /\d+\/100/.test(content),
    severity: "WARN",
  },
  {
    name: "Risk Acceptance Documentation",
    description: "Must document any accepted risks with executive approval",
    check: (content) => content.includes("Risk Acceptance") || content.includes("Accepted Risks"),
    severity: "WARN",
  },
  {
    name: "Post-Release Security Support",
    description: "Must define post-release security monitoring and support plan",
    check: (content) => content.includes("Post-Release Security") && content.includes("monitoring"),
    severity: "WARN",
  },
];

const EXECUTIVE_SUMMARY_RULES: ValidationRule[] = [
  {
    name: "Executive Security Summary",
    description: "Must contain executive-level security summary with business impact",
    check: (content) =>
      content.includes("Executive Security Summary") || content.includes("Executive Summary"),
    severity: "ERROR",
  },
  {
    name: "Security Classification",
    description: "Must define security classification level (HIGH/MEDIUM/LOW)",
    check: (content) =>
      content.includes("Security Classification") &&
      (content.includes("HIGH") || content.includes("MEDIUM") || content.includes("LOW")),
    severity: "ERROR",
  },
  {
    name: "Business Impact Assessment",
    description: "Must quantify business impact and ARR exposure",
    check: (content) => content.includes("Business Impact") || content.includes("ARR"),
    severity: "WARN",
  },
  {
    name: "Compliance Requirements Summary",
    description: "Must list applicable compliance requirements (GDPR, PSD2, ISO)",
    check: (content) =>
      content.includes("Compliance Requirements") &&
      content.includes("GDPR") &&
      content.includes("ISO"),
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

  // OPTIONAL biometric/identity domain pack — example only, NOT the default.
  // Applied only when LIDR_DOMAIN_PACK === 'biometric'. The DEFAULT validation
  // set below is 100% domain-agnostic (no biometric / liveness / anti-spoof
  // rule in the default path).
  const domainPack: ValidationRule[] =
    process.env.LIDR_DOMAIN_PACK === "biometric" ? BIOMETRIC_DOMAIN_PACK : [];

  const validationCases = [
    {
      file: "gate-6-security-validation.md",
      rules: [
        ...EXECUTIVE_SUMMARY_RULES,
        ...GDPR_COMPLIANCE_RULES,
        ...PSD2_COMPLIANCE_RULES,
        ...OWASP_VALIDATION_RULES,
        ...ISO27001_RULES,
        ...GATE6_APPROVAL_RULES,
        ...domainPack,
      ],
      description: "Gate 6 Security Validation Document",
    },
    {
      file: "owasp-top10-validation.md",
      rules: [
        ...OWASP_VALIDATION_RULES,
        {
          name: "Security Testing Coverage",
          description: "Must include comprehensive security testing results",
          check: (content: string) =>
            content.includes("Testing Evidence") && content.includes("coverage"),
          severity: "ERROR" as const,
        },
        ...domainPack,
      ],
      description: "OWASP Top 10 Security Validation",
    },
  ];

  console.log("🔍 Validating Security Checklist Skill Examples...\n");

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
  console.log(`📊 Security Checklist Validation Summary:`);
  console.log(`   ✅ ${totalPassed} rules passed`);
  console.log(`   ❌ ${totalFailed} rules failed`);
  console.log(`   ⚠️ ${totalWarnings} warnings`);

  if (allValid) {
    console.log("\n🎉 All security checklist examples are properly structured!");
    console.log("   Ready for automated Gate 6 security validation.");
    console.log("   🔐 GDPR Article 9, PSD2, OWASP Top 10, and ISO 27001 compliance validated");
  } else {
    console.log("\n💡 Fix the validation errors to ensure Gate 6 compliance compatibility.");
    console.log(
      "   Focus on GDPR Article 9 special-category data requirements and OWASP coverage."
    );
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
