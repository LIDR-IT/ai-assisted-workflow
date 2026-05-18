#!/usr/bin/env npx tsx
/**
 * Validation Script for Tracking Integration Skill
 *
 * Validates examples, adapter interfaces, and configuration patterns.
 * Ensures skill quality and compliance with ecosystem standards.
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";

interface ValidationResult {
  test: string;
  passed: boolean;
  message: string;
  severity: "error" | "warning" | "info";
}

const results: ValidationResult[] = [];

function addResult(
  test: string,
  passed: boolean,
  message: string,
  severity: "error" | "warning" | "info" = "error"
) {
  results.push({ test, passed, message, severity });
}

function validateFileExists(filePath: string, description: string): boolean {
  const exists = existsSync(filePath);
  addResult(
    `File Existence: ${description}`,
    exists,
    exists ? `✅ ${filePath}` : `❌ Missing: ${filePath}`,
    exists ? "info" : "error"
  );
  return exists;
}

function validateSkillStructure(): void {
  console.log("🔍 Validating Skill Structure...");

  const basePath = join(__dirname, "..");

  // Core files
  validateFileExists(join(basePath, "SKILL.md"), "Main skill documentation");
  validateFileExists(join(basePath, "scripts", "create-tracking.py"), "Main orchestrator script");

  // Adapters
  validateFileExists(join(basePath, "adapters", "jira-adapter.py"), "Jira adapter");
  validateFileExists(join(basePath, "adapters", "linear-adapter.py"), "Linear adapter");

  // Validation script itself
  validateFileExists(join(basePath, "scripts", "validate-examples.ts"), "Validation script");
}

function validateSkillFrontmatter(): void {
  console.log("🔍 Validating Frontmatter...");

  const skillPath = join(__dirname, "..", "SKILL.md");
  if (!existsSync(skillPath)) {
    addResult("Frontmatter Validation", false, "SKILL.md not found");
    return;
  }

  const content = readFileSync(skillPath, "utf-8");

  // Check for required frontmatter fields
  const requiredFields = [
    "id: tracking-integration",
    "domain_agnostic: true",
    "automation: false",
    "phase: 1",
    'owner_role: "PME"',
  ];

  let frontmatterValid = true;
  for (const field of requiredFields) {
    if (!content.includes(field)) {
      addResult("Frontmatter Field", false, `Missing or incorrect: ${field}`, "error");
      frontmatterValid = false;
    }
  }

  if (frontmatterValid) {
    addResult("Frontmatter Validation", true, "All required fields present", "info");
  }
}

function validateAdapterInterface(): void {
  console.log("🔍 Validating Adapter Interface...");

  const adapterPaths = [
    join(__dirname, "..", "adapters", "jira-adapter.py"),
    join(__dirname, "..", "adapters", "linear-adapter.py"),
  ];

  for (const adapterPath of adapterPaths) {
    if (!existsSync(adapterPath)) {
      continue;
    }

    const content = readFileSync(adapterPath, "utf-8");
    const adapterName = adapterPath.split("/").pop()?.replace(".py", "") || "unknown";

    // Check for required interface methods
    const requiredMethods = ["create_project", "create_sub_projects", "link_business_case"];

    let interfaceValid = true;
    for (const method of requiredMethods) {
      if (!content.includes(`def ${method}`)) {
        addResult(`Adapter Interface: ${adapterName}`, false, `Missing method: ${method}`, "error");
        interfaceValid = false;
      }
    }

    // Check for proper inheritance
    if (!content.includes("class TrackingToolAdapter(ABC)")) {
      addResult(
        `Adapter Base Class: ${adapterName}`,
        false,
        "Missing TrackingToolAdapter base class",
        "error"
      );
      interfaceValid = false;
    }

    // Check for security best practices (no hardcoded credentials)
    const securityIssues = [
      "api_token",
      "password",
      "secret",
      "key.*=.*[\"'].*[A-Za-z0-9]{10,}.*[\"']", // Pattern for potential keys
    ];

    for (const pattern of securityIssues) {
      const regex = new RegExp(pattern, "i");
      if (regex.test(content) && !content.includes("<YOUR_")) {
        addResult(
          `Security Check: ${adapterName}`,
          false,
          `Potential hardcoded credential: ${pattern}`,
          "warning"
        );
      }
    }

    if (interfaceValid) {
      addResult(
        `Adapter Interface: ${adapterName}`,
        true,
        "Interface correctly implemented",
        "info"
      );
    }
  }
}

function validateDocumentationQuality(): void {
  console.log("🔍 Validating Documentation Quality...");

  const skillPath = join(__dirname, "..", "SKILL.md");
  if (!existsSync(skillPath)) {
    return;
  }

  const content = readFileSync(skillPath, "utf-8");

  // Check for key sections
  const requiredSections = [
    "## Adaptive Architecture",
    "## Critical Success Workflow",
    "## Tool-Specific Examples",
    "## Adapter Implementation",
    "## Success Metrics",
  ];

  let docsValid = true;
  for (const section of requiredSections) {
    if (!content.includes(section)) {
      addResult("Documentation Section", false, `Missing section: ${section}`, "warning");
      docsValid = false;
    }
  }

  // Check for tool examples
  const toolExamples = ["Jira Epic", "Linear Project", "Notion Project"];
  for (const example of toolExamples) {
    if (!content.includes(example)) {
      addResult("Tool Examples", false, `Missing example: ${example}`, "warning");
      docsValid = false;
    }
  }

  // Check for domain-agnostic language
  const domainSpecificTerms = ["biometric", "banking", "finance", "healthcare"];

  for (const term of domainSpecificTerms) {
    const regex = new RegExp(`\\b${term}\\b`, "gi");
    const matches = content.match(regex);
    if (matches && matches.length > 2) {
      // Allow for a few mentions in examples
      addResult(
        "Domain Agnostic Check",
        false,
        `Potential domain-specific language: "${term}" appears ${matches.length} times`,
        "warning"
      );
    }
  }

  if (docsValid) {
    addResult("Documentation Quality", true, "All required sections present", "info");
  }
}

function validateExampleCompleteness(): void {
  console.log("🔍 Validating Example Completeness...");

  const skillPath = join(__dirname, "..", "SKILL.md");
  if (!existsSync(skillPath)) {
    return;
  }

  const content = readFileSync(skillPath, "utf-8");

  // Check for complete examples
  const examplePatterns = [
    /```json\s*{[\s\S]*?"projectKey"[\s\S]*?}/g, // Jira example
    /```json\s*{[\s\S]*?"teamId"[\s\S]*?}/g, // Linear example
    /```json\s*{[\s\S]*?"parent"[\s\S]*?}/g, // Notion example
  ];

  let examplesValid = true;
  for (let i = 0; i < examplePatterns.length; i++) {
    const matches = content.match(examplePatterns[i]);
    if (!matches || matches.length === 0) {
      const toolNames = ["Jira", "Linear", "Notion"];
      addResult(
        "Example Completeness",
        false,
        `Missing complete ${toolNames[i]} example`,
        "warning"
      );
      examplesValid = false;
    }
  }

  if (examplesValid) {
    addResult("Example Completeness", true, "All tool examples are complete", "info");
  }
}

function generateReport(): void {
  console.log("\n📊 Validation Report");
  console.log("=".repeat(50));

  let errors = 0;
  let warnings = 0;
  let passed = 0;

  for (const result of results) {
    const icon = result.passed ? "✅" : result.severity === "warning" ? "⚠️" : "❌";

    console.log(`${icon} ${result.test}: ${result.message}`);

    if (!result.passed) {
      if (result.severity === "error") errors++;
      else if (result.severity === "warning") warnings++;
    } else {
      passed++;
    }
  }

  console.log("\n📈 Summary:");
  console.log(`✅ Passed: ${passed}`);
  console.log(`⚠️ Warnings: ${warnings}`);
  console.log(`❌ Errors: ${errors}`);

  if (errors > 0) {
    console.log("\n🚨 Critical issues found. Skill needs fixes before release.");
    process.exit(1);
  } else if (warnings > 0) {
    console.log("\n⚠️ Some improvements recommended, but skill is functional.");
    process.exit(0);
  } else {
    console.log("\n🎉 All validations passed! Skill is ready for production.");
    process.exit(0);
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("🔍 Tracking Integration Skill Validation\n");

  validateSkillStructure();
  validateSkillFrontmatter();
  validateAdapterInterface();
  validateDocumentationQuality();
  validateExampleCompleteness();

  generateReport();
}

export {
  validateSkillStructure,
  validateSkillFrontmatter,
  validateAdapterInterface,
  validateDocumentationQuality,
  validateExampleCompleteness,
};
