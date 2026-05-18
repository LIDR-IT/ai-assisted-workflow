#!/usr/bin/env tsx
/**
 * validate-examples.ts - Dev-Handoff-QA Skill Example Validator
 *
 * Validates that dev-handoff-qa skill examples contain proper structure
 * for comprehensive Dev-to-QA handoff documentation.
 *
 * Validates:
 * - Complete handoff structure with all required sections
 * - Concrete test data and user-friendly language
 * - Technical implementation details for QA context
 * - Regression impact analysis and testing priorities
 * - Error scenario coverage and edge cases
 * - Prerequisites checklist and test environment setup
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

const DEV_HANDOFF_RULES: ValidationRule[] = [
  {
    name: "Handoff Header Structure",
    description: "Must contain complete header with ticket, RF, PR, and environment information",
    check: (content) =>
      content.includes("Handoff Dev → QA") &&
      content.includes("Ticket") &&
      content.includes("RF Origen") &&
      content.includes("PR"),
    severity: "ERROR",
  },
  {
    name: "Functional Description Section",
    description: "Must include user-friendly functional description of implementation",
    check: (content) =>
      content.includes("¿Qué se Implementó?") && content.includes("Descripción Funcional"),
    severity: "ERROR",
  },
  {
    name: "Visible Changes Documentation",
    description: "Must document all visible changes with locations and screenshots",
    check: (content) => content.includes("Cambios Visibles") && content.includes("screenshot"),
    severity: "ERROR",
  },
  {
    name: "Exclusions Documentation",
    description: "Must explicitly document what was NOT implemented to prevent false bug reports",
    check: (content) =>
      content.includes("Lo que NO se Implementó") && content.includes("exclusions"),
    severity: "ERROR",
  },
  {
    name: "Technical Changes Section",
    description: "Must detail technical changes relevant for QA testing",
    check: (content) => content.includes("Cambios Técnicos Relevantes para QA"),
    severity: "ERROR",
  },
  {
    name: "Endpoints Documentation",
    description: "Must list all new/modified API endpoints with methods and descriptions",
    check: (content) =>
      content.includes("Endpoints") && content.includes("Method") && content.includes("Path"),
    severity: "ERROR",
  },
  {
    name: "Database Changes Documentation",
    description: "Must document database schema changes and QA testing impact",
    check: (content) =>
      content.includes("Base de Datos") &&
      content.includes("Migration") &&
      content.includes("QA Impact"),
    severity: "ERROR",
  },
  {
    name: "Configuration Changes",
    description: "Must list configuration changes and staging environment values",
    check: (content) => content.includes("Configuración") && content.includes("Staging Value"),
    severity: "WARN",
  },
  {
    name: "External Dependencies",
    description: "Must identify external service dependencies and failure impacts",
    check: (content) =>
      content.includes("Dependencias Externas") && content.includes("Impact if down"),
    severity: "WARN",
  },
  {
    name: "Testing Instructions",
    description: "Must provide comprehensive testing instructions with prerequisites",
    check: (content) => content.includes("Cómo Probarlo") && content.includes("Prerequisitos"),
    severity: "ERROR",
  },
  {
    name: "Happy Path Testing",
    description: "Must document main flow testing with concrete steps and expected results",
    check: (content) =>
      content.includes("Flujo Principal") &&
      content.includes("Happy Path") &&
      content.includes("Expected Result"),
    severity: "ERROR",
  },
  {
    name: "Error Scenarios Coverage",
    description: "Must include error scenarios with reproduction steps and expected behavior",
    check: (content) =>
      content.includes("Escenarios de Error") && content.includes("How to Reproduce"),
    severity: "ERROR",
  },
  {
    name: "Edge Cases Documentation",
    description: "Must document edge cases and boundary conditions for testing",
    check: (content) => content.includes("Edge Cases") && content.includes("Expected"),
    severity: "ERROR",
  },
  {
    name: "Test Data Specification",
    description: "Must provide specific test data with concrete file names and users",
    check: (content) => content.includes("Datos de Prueba") && content.includes("Test Documents"),
    severity: "ERROR",
  },
  {
    name: "Test Users Documentation",
    description: "Must specify test users with credentials, roles, and status information",
    check: (content) =>
      content.includes("Test Users") && content.includes("Password") && content.includes("Role"),
    severity: "ERROR",
  },
  {
    name: "Regression Analysis",
    description: "Must identify regression areas and impact assessment for existing functionality",
    check: (content) => content.includes("Áreas de Regresión") && content.includes("Impact areas"),
    severity: "ERROR",
  },
  {
    name: "Smoke Test Recommendations",
    description: "Must suggest prioritized smoke tests to run first",
    check: (content) => content.includes("Suggested Smoke Test") && content.includes("top 5"),
    severity: "ERROR",
  },
  {
    name: "Risk Assessment",
    description: "Must document risks, limitations, and workarounds for testing",
    check: (content) =>
      content.includes("Riesgos y Limitaciones") && content.includes("Testing Impact"),
    severity: "ERROR",
  },
  {
    name: "Visual Evidence",
    description: "Must include screenshots or demo materials for key functionality",
    check: (content) => content.includes("Screenshots") && content.includes("Demo"),
    severity: "WARN",
  },
  {
    name: "Concrete Test Data",
    description: "Must use specific test data rather than generic placeholders",
    check: (content) =>
      content.includes("test-data") || content.includes(".jpg") || content.includes("dni-"),
    severity: "ERROR",
  },
  {
    name: "User Language Usage",
    description: "Must use user-friendly language rather than technical jargon",
    check: (content) => content.includes("usuario puede") && content.includes("verificar"),
    severity: "WARN",
  },
  {
    name: "Feature Flag Documentation",
    description: "Must document feature flag status and impact on testing",
    check: (content) =>
      content.includes("Feature Flag") &&
      (content.includes("ON") || content.includes("OFF") || content.includes("Sin flag")),
    severity: "WARN",
  },
  {
    name: "Environment Information",
    description: "Must specify staging environment URL and deployment information",
    check: (content) => content.includes("Entorno") && content.includes("deployed"),
    severity: "ERROR",
  },
  {
    name: "Verifiable Prerequisites",
    description: "Must provide verifiable checklist of testing prerequisites",
    check: (content) => content.includes("verifiable checklist"),
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
      file: "feature-handoff-example.md",
      rules: DEV_HANDOFF_RULES,
      description: "Dev-to-QA Feature Handoff Example",
    },
  ];

  console.log("🔍 Validating Dev-Handoff-QA Skill Examples...\n");

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
    console.log("\n🎉 All dev-handoff-qa examples are properly structured!");
    console.log("   Ready for seamless development-to-testing transitions.");
  } else {
    console.log("\n💡 Fix the validation errors to ensure complete QA handoff documentation.");
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
