#!/usr/bin/env tsx
/**
 * validate-examples.ts - PRD Técnico Skill Example Validator
 *
 * Validates that prd-tecnico skill examples contain proper structure
 * for technical feasibility documentation in Discovery phase.
 *
 * Validates:
 * - Technical architecture with component details
 * - Non-functional requirements with measurable metrics
 * - Security architecture and data protection compliance
 * - Integration patterns and deployment specifications
 * - Performance requirements and capacity planning
 * - PoC areas and technical risk assessment
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

const PRD_TECHNICAL_STRUCTURE_RULES: ValidationRule[] = [
  {
    name: "Technical Header Information",
    description: "Must contain project, owner, reviewers and technical version",
    check: (content) =>
      content.includes("**Proyecto**:") &&
      content.includes("**Owner**:") &&
      content.includes("**Reviewers**:"),
    severity: "ERROR",
  },
  {
    name: "Executive Summary Technical",
    description: "Must have technical objective and scope",
    check: (content) =>
      content.includes("## 1. Executive Summary") && content.includes("Objetivo Técnico"),
    severity: "ERROR",
  },
  {
    name: "System Architecture Section",
    description: "Must include detailed system architecture documentation",
    check: (content) =>
      content.includes("## 2. Arquitectura del Sistema") &&
      content.includes("Architecture Overview"),
    severity: "ERROR",
  },
  {
    name: "Component Architecture",
    description: "Must define component architecture with technologies",
    check: (content) =>
      content.includes("Component Architecture") && content.includes("Technology:"),
    severity: "ERROR",
  },
  {
    name: "Security Architecture",
    description: "Must have dedicated security architecture section",
    check: (content) =>
      content.includes("Security Architecture") && content.includes("Data Flow Security"),
    severity: "ERROR",
  },
  {
    name: "Performance Requirements",
    description: "Must specify measurable performance criteria",
    check: (content) =>
      content.includes("Performance") &&
      (content.includes("ms") || content.includes("/día") || content.includes("/min")),
    severity: "ERROR",
  },
];

const ARCHITECTURE_DOCUMENTATION_RULES: ValidationRule[] = [
  {
    name: "Technology Stack Specification",
    description: "Must specify exact technologies and versions",
    check: (content) =>
      content.includes("Technology:") &&
      (content.includes("Node.js") || content.includes("Python") || content.includes("PostgreSQL")),
    severity: "ERROR",
  },
  {
    name: "API Endpoints Documentation",
    description: "Must document specific API endpoints and methods",
    check: (content) =>
      content.includes("Endpoints:") && (content.includes("POST") || content.includes("GET")),
    severity: "ERROR",
  },
  {
    name: "Database Schema Design",
    description: "Must specify database technology and schemas",
    check: (content) => content.includes("Database:") && content.includes("Schemas:"),
    severity: "ERROR",
  },
  {
    name: "Integration Dependencies",
    description: "Must list integration points and dependencies",
    check: (content) => content.includes("Dependencies:") || content.includes("Integration:"),
    severity: "ERROR",
  },
  {
    name: "Deployment Architecture",
    description: "Should specify deployment patterns and infrastructure",
    check: (content) =>
      content.includes("Deployment:") ||
      content.includes("Kubernetes") ||
      content.includes("Container"),
    severity: "WARN",
  },
];

const SECURITY_COMPLIANCE_RULES: ValidationRule[] = [
  {
    name: "Data Flow Security",
    description: "Must document end-to-end data flow security",
    check: (content) => content.includes("Data Flow Security") && content.includes("TLS"),
    severity: "ERROR",
  },
  {
    name: "Encryption Standards",
    description: "Must specify encryption algorithms and key management",
    check: (content) =>
      content.includes("AES") || content.includes("encryption") || content.includes("HSM"),
    severity: "ERROR",
  },
  {
    name: "GDPR Compliance Architecture",
    description: "Must address GDPR Article 9 for biometric data",
    check: (content) => content.includes("GDPR") && content.includes("biometric"),
    severity: "ERROR",
  },
  {
    name: "Audit Trail Implementation",
    description: "Must specify audit logging and compliance trail",
    check: (content) =>
      content.includes("audit") && (content.includes("immutable") || content.includes("trail")),
    severity: "ERROR",
  },
  {
    name: "PCI DSS Compliance",
    description: "Should reference PCI DSS for payment card data",
    check: (content) => content.includes("PCI DSS"),
    severity: "WARN",
  },
];

const PERFORMANCE_NFR_RULES: ValidationRule[] = [
  {
    name: "Response Time Requirements",
    description: "Must specify latency requirements in milliseconds",
    check: (content) =>
      content.includes("ms") &&
      (content.includes("<") || content.includes("P95") || content.includes("P99")),
    severity: "ERROR",
  },
  {
    name: "Throughput Requirements",
    description: "Must specify concurrent users and transaction volumes",
    check: (content) =>
      content.includes("concurrent") || content.includes("/día") || content.includes("/min"),
    severity: "ERROR",
  },
  {
    name: "Availability Requirements",
    description: "Must specify uptime SLA and availability targets",
    check: (content) =>
      content.includes("99.") ||
      content.includes("disponibilidad") ||
      content.includes("availability"),
    severity: "ERROR",
  },
  {
    name: "Scalability Requirements",
    description: "Should specify horizontal/vertical scaling patterns",
    check: (content) =>
      content.includes("scalability") || content.includes("scaling") || content.includes("growth"),
    severity: "WARN",
  },
  {
    name: "Capacity Planning",
    description: "Should include capacity planning and resource allocation",
    check: (content) => content.includes("capacity") || content.includes("resource"),
    severity: "WARN",
  },
];

const BIOMETRIC_TECHNICAL_RULES: ValidationRule[] = [
  {
    name: "Biometric Processing Architecture",
    description: "Must specify biometric template processing flow",
    check: (content) => content.includes("template") && content.includes("biometric"),
    severity: "ERROR",
  },
  {
    name: "Anti-Spoofing Technical Implementation",
    description: "Must detail liveness detection and anti-spoofing mechanisms",
    check: (content) =>
      content.includes("liveness") ||
      content.includes("anti-spoofing") ||
      content.includes("spoofing"),
    severity: "ERROR",
  },
  {
    name: "Matching Algorithm Specifications",
    description: "Must specify matching thresholds and accuracy metrics",
    check: (content) =>
      content.includes("matching") && (content.includes("threshold") || content.includes("score")),
    severity: "ERROR",
  },
  {
    name: "OCR Engine Integration",
    description: "Should specify document OCR processing capabilities",
    check: (content) => content.includes("OCR") && content.includes("document"),
    severity: "WARN",
  },
  {
    name: "NFC Reading Support",
    description: "Should mention NFC chip reading for enhanced security",
    check: (content) => content.includes("NFC") && content.includes("chip"),
    severity: "WARN",
  },
];

const POC_RISK_ASSESSMENT_RULES: ValidationRule[] = [
  {
    name: "Technical Risk Classification",
    description: "Must classify technical risks by severity",
    check: (content) =>
      content.includes("Riesgos") &&
      (content.includes("High") || content.includes("Medium") || content.includes("Low")),
    severity: "ERROR",
  },
  {
    name: "PoC Areas Identification",
    description: "Should identify areas requiring proof of concept",
    check: (content) =>
      content.includes("PoC") ||
      content.includes("proof of concept") ||
      content.includes("validation"),
    severity: "WARN",
  },
  {
    name: "Integration Complexity Assessment",
    description: "Should assess integration complexity with existing systems",
    check: (content) => content.includes("Integration") && content.includes("complexity"),
    severity: "WARN",
  },
  {
    name: "Compliance Risk Assessment",
    description: "Must assess compliance implementation risks",
    check: (content) =>
      content.includes("compliance") && (content.includes("risk") || content.includes("challenge")),
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

  const SYSTEM_DESIGN_RULES: ValidationRule[] = [
    {
      name: "Architecture Overview",
      description: "Must include architecture overview section",
      check: (content) => content.includes("Architecture") && content.includes("Overview"),
      severity: "ERROR",
    },
    {
      name: "Service Inventory Table",
      description: "Must include service inventory table with columns",
      check: (content) =>
        content.includes("Service") &&
        content.includes("Responsibility") &&
        content.includes("Database"),
      severity: "ERROR",
    },
    {
      name: "Architecture Diagram",
      description: "Must include Mermaid architecture diagram",
      check: (content) => content.includes("flowchart") && content.includes("subgraph"),
      severity: "ERROR",
    },
    {
      name: "ClassDef Styles",
      description: "Should include classDef styles for diagram consistency",
      check: (content) => content.includes("classDef"),
      severity: "WARN",
    },
    {
      name: "Event-Driven Pattern",
      description: "Should document event-driven integration patterns",
      check: (content) => content.includes("event") || content.includes("Event"),
      severity: "WARN",
    },
    {
      name: "Identity Layer",
      description: "Should document identity and authentication approach",
      check: (content) =>
        content.includes("identity") ||
        content.includes("Identity") ||
        content.includes("OIDC") ||
        content.includes("SSO"),
      severity: "WARN",
    },
  ];

  const validationCases = [
    {
      file: "prd-tecnico-selphid-platform-integration.md",
      rules: [
        ...PRD_TECHNICAL_STRUCTURE_RULES,
        ...ARCHITECTURE_DOCUMENTATION_RULES,
        ...SECURITY_COMPLIANCE_RULES,
        ...PERFORMANCE_NFR_RULES,
        ...BIOMETRIC_TECHNICAL_RULES,
        ...POC_RISK_ASSESSMENT_RULES,
      ],
      description: "Platform Integration Technical PRD Structure",
    },
    {
      file: "example-system-design-microservices.md",
      rules: SYSTEM_DESIGN_RULES,
      description: "System Design Microservices Example (NEW)",
    },
  ];

  console.log("🔍 Validating PRD Técnico Skill Examples...\n");

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
    console.log("\n🎉 All PRD Técnico examples are properly structured!");
    console.log("   Ready for technical feasibility assessment and Gate 1 evaluation.");
  } else {
    console.log("\n💡 Fix the validation errors to ensure technical readiness for development.");
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
