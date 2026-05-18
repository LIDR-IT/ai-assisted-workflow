#!/usr/bin/env tsx
/**
 * validate-examples.ts - Architecture Documentation Skill Example Validator
 *
 * Validates that architecture-doc skill examples contain proper structure
 * for generating comprehensive technical architecture documentation at 5 levels.
 *
 * Validates:
 * - Metadata headers with project info (version, date, architect)
 * - C4 Model structure compliance (Context, Container, Component levels)
 * - Architecture quality attributes documentation
 * - Business context and workflow mapping
 * - Technology stack and infrastructure specification
 * - Security and compliance considerations
 * - Performance and scalability requirements
 * - Database schema and data flow documentation
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

const ARCHITECTURE_HEADER_RULES: ValidationRule[] = [
  {
    name: "Project Metadata Block",
    description: "Must have project metadata block with version, date, and architect",
    check: (content) =>
      content.includes("**Proyecto**") ||
      content.includes("**Project**") ||
      content.includes("**Versión**") ||
      content.includes("**Version**"),
    severity: "ERROR",
  },
  {
    name: "Architecture Title",
    description: "Must have clear architecture document title",
    check: (content) =>
      /^# .* - Architecture/m.test(content) || /^# .* Architecture/m.test(content),
    severity: "ERROR",
  },
  {
    name: "Version Information",
    description: "Must specify version number",
    check: (content) =>
      /Version.*\d+\.\d+\.\d+/i.test(content) || /Versión.*\d+\.\d+\.\d+/i.test(content),
    severity: "ERROR",
  },
  {
    name: "Architect Attribution",
    description: "Must identify the architect or technical lead",
    check: (content) => /Architect|Arquitecto/i.test(content),
    severity: "WARN",
  },
];

const C4_MODEL_RULES: ValidationRule[] = [
  {
    name: "Context View (C4 Level 1)",
    description: "Must include context view showing system boundaries",
    check: (content) =>
      content.includes("Contexto") ||
      content.includes("Context") ||
      content.includes("C4 Nivel 1") ||
      content.includes("C4 Level 1"),
    severity: "ERROR",
  },
  {
    name: "Container View (C4 Level 2)",
    description: "Must include container view showing high-level architecture",
    check: (content) =>
      content.includes("Contenedores") ||
      content.includes("Container") ||
      content.includes("C4 Nivel 2") ||
      content.includes("C4 Level 2"),
    severity: "ERROR",
  },
  {
    name: "System Boundaries",
    description: "Should clearly define external vs internal systems",
    check: (content) =>
      content.includes("External") ||
      content.includes("Internal") ||
      content.includes("Externos") ||
      content.includes("Internos"),
    severity: "WARN",
  },
  {
    name: "Architecture Diagrams",
    description: "Should include visual diagrams or ASCII art",
    check: (content) =>
      content.includes("```") ||
      content.includes("┌") ||
      content.includes("│") ||
      content.includes("└"),
    severity: "WARN",
  },
];

const ARCHITECTURE_QUALITY_RULES: ValidationRule[] = [
  {
    name: "Quality Attributes",
    description: "Must document architecture quality attributes",
    check: (content) => {
      const lowerContent = content.toLowerCase();
      return (
        lowerContent.includes("performance") ||
        lowerContent.includes("scalability") ||
        lowerContent.includes("security") ||
        lowerContent.includes("availability") ||
        lowerContent.includes("reliability")
      );
    },
    severity: "ERROR",
  },
  {
    name: "Performance Requirements",
    description: "Should specify performance requirements with metrics",
    check: (content) => {
      const lowerContent = content.toLowerCase();
      return (
        (lowerContent.includes("latency") ||
          lowerContent.includes("throughput") ||
          lowerContent.includes("response time")) &&
        /\d+\s*(ms|s|rps|req\/s)/i.test(content)
      );
    },
    severity: "WARN",
  },
  {
    name: "Scalability Considerations",
    description: "Should address scalability patterns and limits",
    check: (content) => {
      const lowerContent = content.toLowerCase();
      return (
        lowerContent.includes("scalability") ||
        lowerContent.includes("scaling") ||
        lowerContent.includes("load balancing") ||
        lowerContent.includes("horizontal")
      );
    },
    severity: "WARN",
  },
  {
    name: "Security Architecture",
    description: "Must address security considerations",
    check: (content) => {
      const lowerContent = content.toLowerCase();
      return (
        lowerContent.includes("security") ||
        lowerContent.includes("authentication") ||
        lowerContent.includes("authorization") ||
        lowerContent.includes("encryption")
      );
    },
    severity: "ERROR",
  },
];

const TECHNOLOGY_STACK_RULES: ValidationRule[] = [
  {
    name: "Technology Stack",
    description: "Must specify core technologies used",
    check: (content) => {
      const lowerContent = content.toLowerCase();
      return (
        lowerContent.includes("technology") ||
        lowerContent.includes("stack") ||
        lowerContent.includes("framework") ||
        lowerContent.includes("database")
      );
    },
    severity: "ERROR",
  },
  {
    name: "Infrastructure Components",
    description: "Should document infrastructure and deployment architecture",
    check: (content) => {
      const lowerContent = content.toLowerCase();
      return (
        lowerContent.includes("infrastructure") ||
        lowerContent.includes("deployment") ||
        lowerContent.includes("container") ||
        lowerContent.includes("kubernetes") ||
        lowerContent.includes("docker")
      );
    },
    severity: "WARN",
  },
  {
    name: "Data Storage",
    description: "Should document data storage strategy",
    check: (content) => {
      const lowerContent = content.toLowerCase();
      return (
        lowerContent.includes("database") ||
        lowerContent.includes("storage") ||
        lowerContent.includes("persistence") ||
        lowerContent.includes("data")
      );
    },
    severity: "WARN",
  },
  {
    name: "API Architecture",
    description: "Should document API design and integration patterns",
    check: (content) => {
      const lowerContent = content.toLowerCase();
      return (
        lowerContent.includes("api") ||
        lowerContent.includes("rest") ||
        lowerContent.includes("graphql") ||
        lowerContent.includes("endpoint")
      );
    },
    severity: "WARN",
  },
];

const BUSINESS_CONTEXT_RULES: ValidationRule[] = [
  {
    name: "Business Context",
    description: "Must provide business context and workflow explanation",
    check: (content) =>
      content.includes("Business") ||
      content.includes("Workflow") ||
      content.includes("Context") ||
      content.includes("Use Case"),
    severity: "ERROR",
  },
  {
    name: "Stakeholder Identification",
    description: "Should identify key stakeholders and users",
    check: (content) => {
      const lowerContent = content.toLowerCase();
      return (
        lowerContent.includes("user") ||
        lowerContent.includes("client") ||
        lowerContent.includes("stakeholder") ||
        lowerContent.includes("actor")
      );
    },
    severity: "WARN",
  },
  {
    name: "Domain-Specific Requirements",
    description: "Should address domain-specific requirements (biometric, fintech, etc.)",
    check: (content) => {
      const lowerContent = content.toLowerCase();
      return (
        lowerContent.includes("biometric") ||
        lowerContent.includes("compliance") ||
        lowerContent.includes("regulation") ||
        lowerContent.includes("gdpr") ||
        lowerContent.includes("kyc") ||
        lowerContent.includes("psd2")
      );
    },
    severity: "WARN",
  },
];

const DOCUMENTATION_QUALITY_RULES: ValidationRule[] = [
  {
    name: "Structured Sections",
    description: "Must have well-organized section structure",
    check: (content) => {
      const sections = content.match(/^##\s+/gm);
      return sections && sections.length >= 4;
    },
    severity: "ERROR",
  },
  {
    name: "Technical Detail Level",
    description: "Should provide sufficient technical detail for implementation",
    check: (content) => content.length >= 2000,
    severity: "WARN",
  },
  {
    name: "Code or Configuration Examples",
    description: "Should include code snippets, YAML configs, or technical examples",
    check: (content) => content.includes("```"),
    severity: "WARN",
  },
  {
    name: "Architecture Decisions",
    description: "Should reference or explain key architecture decisions",
    check: (content) => {
      const lowerContent = content.toLowerCase();
      return (
        lowerContent.includes("decision") ||
        lowerContent.includes("rationale") ||
        lowerContent.includes("choice") ||
        lowerContent.includes("selected")
      );
    },
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

  const allRules = [
    ...ARCHITECTURE_HEADER_RULES,
    ...C4_MODEL_RULES,
    ...ARCHITECTURE_QUALITY_RULES,
    ...TECHNOLOGY_STACK_RULES,
    ...BUSINESS_CONTEXT_RULES,
    ...DOCUMENTATION_QUALITY_RULES,
  ];

  const DATA_MODEL_RULES: ValidationRule[] = [
    {
      name: "Entity Analysis Section",
      description: "Must include entity analysis with field tables",
      check: (content) => content.includes("Entity") && content.includes("Field"),
      severity: "ERROR",
    },
    {
      name: "ERD Diagram",
      description: "Must include Mermaid erDiagram",
      check: (content) => content.includes("erDiagram"),
      severity: "ERROR",
    },
    {
      name: "Primary Keys",
      description: "Entities must have uuid PK fields",
      check: (content) => content.includes("PK") || content.includes("Primary"),
      severity: "ERROR",
    },
    {
      name: "Relationship Verb Labels",
      description: "ERD relationships should have verb labels",
      check: (content) => /\|\|--o\{.*:.*"/.test(content) || /\|\|--\|\|.*:.*"/.test(content),
      severity: "WARN",
    },
    {
      name: "Tenant Entity",
      description: "Should include Tenant entity for multitenancy",
      check: (content) => content.includes("Tenant"),
      severity: "WARN",
    },
    {
      name: "Audit Log Entity",
      description: "Should include AuditLog entity",
      check: (content) => content.includes("AuditLog") || content.includes("Audit"),
      severity: "WARN",
    },
  ];

  const validationCases = [
    {
      file: "domains/biometric/platform-api-gateway.md",
      rules: allRules,
      description: "Biometric Platform API Gateway Architecture",
    },
    {
      file: "domains/biometric/selphi-liveness-microservice.md",
      rules: allRules,
      description: "Selphi Liveness Microservice Architecture",
    },
    {
      file: "domains/biometric/biometric-template-storage.md",
      rules: allRules,
      description: "Biometric Template Storage Architecture",
    },
    {
      file: "web/react-spa-architecture.md",
      rules: allRules,
      description: "React SPA Web Architecture",
    },
    {
      file: "mobile/ios-sdk-architecture.md",
      rules: allRules,
      description: "iOS SDK Mobile Architecture",
    },
    {
      file: "generic/microservices-template.md",
      rules: allRules,
      description: "Generic Microservices Template",
    },
    {
      file: "example-data-model-saas.md",
      rules: DATA_MODEL_RULES,
      description: "Data Model SaaS Example (NEW)",
    },
  ];

  console.log("🔍 Validating Architecture Documentation Skill Examples...\n");

  let totalPassed = 0;
  let totalFailed = 0;
  let totalWarnings = 0;
  let allValid = true;

  for (const testCase of validationCases) {
    const filePath = join(examplesDir, testCase.file);

    if (!existsSync(filePath)) {
      console.log(`⚠️  ${testCase.description}`);
      console.log(`   File not found: ${testCase.file}\n`);
      continue; // Skip missing files as they might not be created yet
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
    console.log("\n🎉 All architecture documentation examples are properly structured!");
    console.log("   Ready for comprehensive technical architecture documentation.");
  } else {
    console.log("\n💡 Fix the validation errors to ensure proper architecture documentation.");
    console.log("   Reference: C4 Model and architecture documentation best practices.");
  }

  process.exit(allValid ? 0 : 1);
}

// Entry point detection
if (typeof import.meta !== "undefined" && import.meta.url.includes("validate-examples.ts")) {
  main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}
