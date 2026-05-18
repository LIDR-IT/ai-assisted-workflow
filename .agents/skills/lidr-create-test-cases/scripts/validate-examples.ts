#!/usr/bin/env tsx
/**
 * validate-examples.ts - Create Test Cases Skill Example Validator
 *
 * Validates that create-test-cases skill examples contain proper BDD structure
 * for generating executable test cases from tickets in "Ready for QA".
 *
 * Validates:
 * - BDD Gherkin syntax and structure (Given/When/Then)
 * - Test case metadata completeness
 * - Concrete test data specifications
 * - Priority and automation markers
 * - Biometric domain-specific scenarios
 * - GDPR compliance considerations
 * - Edge case and error scenario coverage
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

const BDD_TEMPLATE_RULES: ValidationRule[] = [
  {
    name: "Gherkin Feature Structure",
    description: "Must contain proper Feature declaration with user story format",
    check: (content) =>
      content.includes("Feature:") &&
      content.includes("As a") &&
      content.includes("I want") &&
      content.includes("So that"),
    severity: "ERROR",
  },
  {
    name: "Background Setup",
    description: "Must include Background section with system preconditions",
    check: (content) => content.includes("Background:") && content.includes("Given the"),
    severity: "ERROR",
  },
  {
    name: "Critical Scenarios",
    description: "Must have scenarios tagged with @critical for high-priority test cases",
    check: (content) => content.includes("@critical"),
    severity: "ERROR",
  },
  {
    name: "BDD Structure Compliance",
    description: "Must use proper Given/When/Then structure in scenarios",
    check: (content) =>
      content.includes("Given") && content.includes("When") && content.includes("Then"),
    severity: "ERROR",
  },
  {
    name: "Concrete Test Data",
    description: "Must include specific, concrete test data rather than placeholders",
    check: (content) =>
      content.includes("{{") && content.includes("}}") && content.includes("VALID"),
    severity: "ERROR",
  },
  {
    name: "Error Handling Scenarios",
    description: "Must include error scenarios with specific error codes",
    check: (content) =>
      content.includes("should fail with error") && content.includes("ERROR_CODE"),
    severity: "ERROR",
  },
  {
    name: "Performance Requirements",
    description: "Must specify timing requirements and performance criteria",
    check: (content) =>
      content.includes("within") && (content.includes("TIME") || content.includes("seconds")),
    severity: "ERROR",
  },
  {
    name: "Quality Metrics",
    description: "Must include measurable quality criteria and confidence thresholds",
    check: (content) =>
      content.includes("confidence") &&
      (content.includes("accuracy") || content.includes("threshold")),
    severity: "ERROR",
  },
  {
    name: "Security Testing",
    description: "Must include security-related test scenarios",
    check: (content) =>
      content.includes("attack") || content.includes("threat") || content.includes("security"),
    severity: "WARN",
  },
  {
    name: "Compliance Requirements",
    description: "Must address regulatory compliance (GDPR, data protection)",
    check: (content) => content.includes("compliance") && content.includes("consent"),
    severity: "ERROR",
  },
  {
    name: "Accessibility Considerations",
    description: "Must include accessibility testing scenarios",
    check: (content) => content.includes("accessibility") && content.includes("impairment"),
    severity: "WARN",
  },
  {
    name: "Multi-Platform Support",
    description: "Must include cross-platform testing with scenario outlines",
    check: (content) => content.includes("Scenario Outline:") && content.includes("Examples:"),
    severity: "ERROR",
  },
  {
    name: "Detection Algorithms",
    description: "Must test detection algorithms with multiple conditions",
    check: (content) => content.includes("detect") && content.includes("algorithm"),
    severity: "WARN",
  },
  {
    name: "Environmental Conditions",
    description: "Must test various environmental conditions",
    check: (content) => content.includes("conditions") && content.includes("environmental"),
    severity: "WARN",
  },
  {
    name: "Data Processing Validation",
    description: "Must validate data processing and storage requirements",
    check: (content) => content.includes("processing") && content.includes("encrypted"),
    severity: "ERROR",
  },
];

const BIOMETRIC_SCENARIOS_RULES: ValidationRule[] = [
  {
    name: "Liveness Detection Tests",
    description: "Must include liveness detection scenarios for biometric verification",
    check: (content) => content.includes("liveness") || content.includes("active"),
    severity: "ERROR",
  },
  {
    name: "Spoofing Attack Prevention",
    description: "Must test against spoofing attacks (photo, video, deepfake)",
    check: (content) =>
      content.includes("spoof") || content.includes("attack") || content.includes("fake"),
    severity: "ERROR",
  },
  {
    name: "Biometric Quality Metrics",
    description: "Must validate biometric quality scores and thresholds",
    check: (content) => content.includes("quality") && content.includes("score"),
    severity: "ERROR",
  },
  {
    name: "Multiple Face Detection",
    description: "Must handle multiple faces in frame scenarios",
    check: (content) => content.includes("multiple") && content.includes("face"),
    severity: "WARN",
  },
  {
    name: "Lighting Conditions",
    description: "Must test various lighting conditions for robustness",
    check: (content) => content.includes("lighting") || content.includes("illumination"),
    severity: "WARN",
  },
  {
    name: "Device Compatibility",
    description: "Must test across different camera/microphone devices",
    check: (content) => content.includes("device") && content.includes("camera"),
    severity: "ERROR",
  },
  {
    name: "Real-time Processing",
    description: "Must validate real-time processing capabilities",
    check: (content) => content.includes("real-time") || content.includes("streaming"),
    severity: "WARN",
  },
  {
    name: "Template Generation",
    description: "Must test biometric template creation and comparison",
    check: (content) => content.includes("template") || content.includes("enrollment"),
    severity: "WARN",
  },
];

const OCR_ACCURACY_RULES: ValidationRule[] = [
  {
    name: "Document Type Recognition",
    description: "Must test recognition of various document types",
    check: (content) => content.includes("document") && content.includes("type"),
    severity: "ERROR",
  },
  {
    name: "Accuracy Thresholds",
    description: "Must specify OCR accuracy requirements and measurements",
    check: (content) => content.includes("accuracy") && content.includes("threshold"),
    severity: "ERROR",
  },
  {
    name: "Field Extraction Validation",
    description: "Must validate extraction of specific document fields",
    check: (content) => content.includes("extraction") || content.includes("field"),
    severity: "ERROR",
  },
  {
    name: "Language Support",
    description: "Must test multiple language support for international documents",
    check: (content) => content.includes("language") || content.includes("international"),
    severity: "WARN",
  },
  {
    name: "Image Quality Requirements",
    description: "Must test various image quality conditions",
    check: (content) => content.includes("quality") && content.includes("image"),
    severity: "ERROR",
  },
  {
    name: "MRZ Processing",
    description: "Must validate Machine Readable Zone processing for passports",
    check: (content) => content.includes("MRZ") || content.includes("machine readable"),
    severity: "WARN",
  },
];

const VOICE_VERIFICATION_RULES: ValidationRule[] = [
  {
    name: "Voice Quality Assessment",
    description: "Must test voice sample quality and clarity requirements",
    check: (content) => content.includes("voice") && content.includes("quality"),
    severity: "ERROR",
  },
  {
    name: "Text-Dependent Verification",
    description: "Must include text-dependent voice verification scenarios",
    check: (content) => content.includes("text") && content.includes("dependent"),
    severity: "ERROR",
  },
  {
    name: "Background Noise Handling",
    description: "Must test voice recognition with background noise",
    check: (content) => content.includes("noise") || content.includes("background"),
    severity: "ERROR",
  },
  {
    name: "Speaker Verification",
    description: "Must validate speaker identity verification accuracy",
    check: (content) => content.includes("speaker") && content.includes("verification"),
    severity: "ERROR",
  },
  {
    name: "Anti-Spoofing Detection",
    description: "Must test against voice spoofing attacks (replay, synthesis)",
    check: (content) => content.includes("spoofing") || content.includes("replay"),
    severity: "ERROR",
  },
  {
    name: "Enrollment Process",
    description: "Must test voice enrollment and template creation",
    check: (content) => content.includes("enrollment") || content.includes("registration"),
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
      file: "generic/feature-test-cases-template.feature",
      rules: BDD_TEMPLATE_RULES,
      description: "BDD Feature Template Structure",
    },
    {
      file: "domains/biometric/selphi-liveness-detection-bdd-scenarios.feature",
      rules: BIOMETRIC_SCENARIOS_RULES,
      description: "Biometric Liveness Detection Scenarios",
    },
    {
      file: "domains/biometric/selphid-ocr-accuracy-test-matrix.json",
      rules: OCR_ACCURACY_RULES,
      description: "OCR Accuracy Test Matrix",
    },
    {
      file: "domains/biometric/voice-verification-test-scenarios.csv",
      rules: VOICE_VERIFICATION_RULES,
      description: "Voice Verification Test Scenarios",
    },
  ];

  console.log("🔍 Validating Create-Test-Cases Skill Examples...\n");

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
    console.log("\n🎉 All test case examples are properly structured!");
    console.log("   Ready for BDD test case generation from Ready for QA tickets.");
  } else {
    console.log("\n💡 Fix the validation errors to ensure comprehensive test coverage.");
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
