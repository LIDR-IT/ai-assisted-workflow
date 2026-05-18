#!/usr/bin/env tsx
/**
 * validate-examples.ts - PRD Funcional Skill Example Validator
 *
 * Validates that prd-funcional skill examples contain proper structure
 * for functional product specification in Discovery phase.
 *
 * Validates:
 * - Executive summary with measurable metrics
 * - User personas with specific demographics and pain points
 * - Detailed user journeys with TO-BE flows
 * - Functional requirements with business rules
 * - Compliance sections (GDPR, biometric-specific)
 * - Error handling and recovery flows
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

const PRD_STRUCTURE_RULES: ValidationRule[] = [
  {
    name: "PRD Header Information",
    description: "Must contain project name, version, owner, and date",
    check: (content) =>
      content.includes("**Proyecto**:") &&
      content.includes("**Versión**:") &&
      content.includes("**Owner**:") &&
      content.includes("**Fecha**:"),
    severity: "ERROR",
  },
  {
    name: "Executive Summary",
    description: "Must have clear product objective and business value proposition",
    check: (content) =>
      content.includes("## 1. Resumen Ejecutivo") || content.includes("## 1. Visión del Producto"),
    severity: "ERROR",
  },
  {
    name: "Problem Statement",
    description: "Must describe current situation and pain points",
    check: (content) =>
      (content.includes("## 2. Contexto y Problema") ||
        content.includes("## 3. Problema y Contexto")) &&
      content.includes("Pain point"),
    severity: "ERROR",
  },
  {
    name: "User Personas Section",
    description: "Must define primary and secondary user personas",
    check: (content) =>
      content.includes("## 3. Usuarios y Personas") ||
      content.includes("## 2. Usuarios y Personas"),
    severity: "ERROR",
  },
  {
    name: "User Journeys",
    description: "Must include detailed user journey mappings",
    check: (content) =>
      (content.includes("User Journey") && content.includes("Happy Path")) ||
      content.includes("Journey Objetivo"),
    severity: "ERROR",
  },
  {
    name: "Functional Requirements",
    description: "Must have structured functional requirements with F1, F2 identifiers",
    check: (content) =>
      content.includes("Funcionalidades") &&
      (content.includes("### F1:") || content.includes("#### F1:")),
    severity: "ERROR",
  },
];

const PERSONA_RULES: ValidationRule[] = [
  {
    name: "Persona Demographics",
    description: "Each persona must have demographics and age ranges",
    check: (content) => content.includes("Demographics") && content.includes("años"),
    severity: "ERROR",
  },
  {
    name: "Persona Pain Points",
    description: "Each persona must have explicit pain points",
    check: (content) => content.includes("Pain points") && content.includes('"'),
    severity: "ERROR",
  },
  {
    name: "Persona Motivations",
    description: "Each persona should include motivations and goals",
    check: (content) => content.includes("Motivaciones") || content.includes("Objetivos"),
    severity: "WARN",
  },
  {
    name: "Persona Quotes",
    description: "Personas should include representative quotes for empathy",
    check: (content) => content.includes("Quote") && content.includes('"'),
    severity: "WARN",
  },
  {
    name: "Tech Savviness Level",
    description: "Must specify technical comfort level for UX design",
    check: (content) =>
      content.includes("Tech") || content.includes("Nivel técnico") || content.includes("técnico"),
    severity: "WARN",
  },
];

const BIOMETRIC_DOMAIN_RULES: ValidationRule[] = [
  {
    name: "Biometric Terminology",
    description: "Must use proper biometric domain terminology",
    check: (content) =>
      content.includes("liveness") ||
      content.includes("template") ||
      content.includes("biométric") ||
      content.includes("facial") ||
      content.includes("Selphi"),
    severity: "ERROR",
  },
  {
    name: "Identity Verification Flow",
    description: "Must describe document + selfie verification flow",
    check: (content) => content.includes("documento") && content.includes("selfie"),
    severity: "ERROR",
  },
  {
    name: "GDPR Compliance",
    description: "Must reference GDPR Article 9 for biometric data",
    check: (content) => content.includes("GDPR") && content.includes("consentimiento"),
    severity: "ERROR",
  },
  {
    name: "Anti-Spoofing Requirements",
    description: "Must mention anti-spoofing or liveness detection",
    check: (content) =>
      content.includes("anti-spoofing") ||
      content.includes("liveness") ||
      content.includes("authenticity"),
    severity: "ERROR",
  },
  {
    name: "Matching Thresholds",
    description: "Should specify matching thresholds for 1:1 verification",
    check: (content) =>
      content.includes("umbral") ||
      content.includes("threshold") ||
      content.includes("0.8") ||
      content.includes("score"),
    severity: "WARN",
  },
];

const BUSINESS_RULES_VALIDATION: ValidationRule[] = [
  {
    name: "Business Rules Format",
    description: "Must have numbered business rules (RN-FX-NN format)",
    check: (content) =>
      (content.includes("RN-F") && content.includes("-01")) ||
      content.includes("Reglas de Negocio"),
    severity: "ERROR",
  },
  {
    name: "Must/Should/Could Prioritization",
    description: "Features must be prioritized with Must/Should/Could",
    check: (content) =>
      content.includes("Must") && (content.includes("Should") || content.includes("Could")),
    severity: "ERROR",
  },
  {
    name: "Error Handling Scenarios",
    description: "Must include error flows and recovery actions",
    check: (content) =>
      content.includes("Error") &&
      (content.includes("Recovery") || content.includes("escalamiento")),
    severity: "ERROR",
  },
  {
    name: "Measurable Success Metrics",
    description: "Must include quantifiable KPIs and success metrics",
    check: (content) =>
      content.includes("Métrica") && (content.includes("%") || content.includes("minuto")),
    severity: "ERROR",
  },
  {
    name: "Regulatory Compliance",
    description: "Must reference relevant regulations (PSD2, AML, etc.)",
    check: (content) =>
      content.includes("PSD2") ||
      content.includes("AML") ||
      content.includes("KYC") ||
      content.includes("regulación"),
    severity: "WARN",
  },
];

const JOURNEY_MAPPING_RULES: ValidationRule[] = [
  {
    name: "Journey Steps Detail",
    description: "User journeys must have numbered steps with time estimates",
    check: (content) =>
      content.includes("1.") &&
      content.includes("2.") &&
      (content.includes("min") || content.includes("segundo")),
    severity: "ERROR",
  },
  {
    name: "Happy Path Definition",
    description: "Must clearly define the optimal user experience flow",
    check: (content) =>
      content.includes("Happy Path") ||
      content.includes("Flujo óptimo") ||
      content.includes("Core Flow"),
    severity: "ERROR",
  },
  {
    name: "Alternative Flows",
    description: "Must include alternative paths for edge cases",
    check: (content) =>
      content.includes("Alternative") ||
      content.includes("Error Path") ||
      content.includes("Alternat"),
    severity: "ERROR",
  },
  {
    name: "Touchpoint Mapping",
    description: "Should specify number of touchpoints and timeline",
    check: (content) =>
      content.includes("Touchpoint") || content.includes("Timeline") || content.includes("tiempo"),
    severity: "WARN",
  },
  {
    name: "Effort Score",
    description: "Should include user effort scoring for UX optimization",
    check: (content) => content.includes("Effort Score") || content.includes("esfuerzo"),
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
      file: "prd-funcional-selphi-banking-onboarding.md",
      rules: [
        ...PRD_STRUCTURE_RULES,
        ...PERSONA_RULES,
        ...BIOMETRIC_DOMAIN_RULES,
        ...BUSINESS_RULES_VALIDATION,
        ...JOURNEY_MAPPING_RULES,
      ],
      description: "Banking Onboarding PRD Structure",
    },
    {
      file: "prd-funcional-voice-call-center.md",
      rules: [...PRD_STRUCTURE_RULES, ...PERSONA_RULES, ...BUSINESS_RULES_VALIDATION],
      description: "Voice Call Center PRD Structure",
    },
  ];

  console.log("🔍 Validating PRD Funcional Skill Examples...\n");

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
    console.log("\n🎉 All PRD Funcional examples are properly structured!");
    console.log("   Ready for Discovery phase and Gate 1 evaluation.");
  } else {
    console.log("\n💡 Fix the validation errors to ensure Gate 1 readiness.");
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
