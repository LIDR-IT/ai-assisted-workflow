/**
 * Central validation orchestrator for the SDLC ecosystem
 * Coordinates all validation scripts and provides unified interface
 */

export * from "./types.js";
export * from "./validate-bdd-patterns.js";
export * from "./validate-acceptance-criteria.js";
export * from "./validate-skill-completeness.js";
export * from "./validate-domain-agnostic.js";
export * from "./validate-ecosystem-coherence.js";
export * from "./ecosystem-validation.js";
export * from "./mcp-stability-audit.js";

import { ValidationResult, ValidationSeverity, ValidationIssue } from "./types.js";
import { validateBDDPatterns } from "./validate-bdd-patterns.js";
import { validateAcceptanceCriteria } from "./validate-acceptance-criteria.js";
import { validateSkillCompleteness } from "./validate-skill-completeness.js";
import { validateDomainAgnostic } from "./validate-domain-agnostic.js";
import { validateEcosystemCoherence } from "./validate-ecosystem-coherence.js";
import {
  validateEcosystemHealth,
  validateBeforeWrite,
  validateForGateAdvancement,
} from "./ecosystem-validation.js";
import * as fs from "fs";
import * as path from "path";

interface ValidationSuite {
  skillValidation?: boolean;
  domainAgnosticValidation?: boolean;
  ecosystemCoherence?: boolean;
  bddCompliance?: boolean;
  acceptanceCriteriaQuality?: boolean;
  customValidators?: string[];
}

interface SuiteResult {
  totalValidations: number;
  passedValidations: number;
  failedValidations: number;
  averageScore: number;
  overallSuccess: boolean;
  results: Map<string, ValidationResult>;
  summary: {
    errors: number;
    warnings: number;
    infos: number;
  };
}

const DEFAULT_SUITE: ValidationSuite = {
  skillValidation: true,
  domainAgnosticValidation: true,
  ecosystemCoherence: true,
  bddCompliance: false, // Only when BDD content is expected
  acceptanceCriteriaQuality: false, // Only when AC content is expected
  customValidators: [],
};

/**
 * Comprehensive validation suite for SDLC artifacts
 */
export async function runValidationSuite(
  targetPath: string,
  suite: Partial<ValidationSuite> = {}
): Promise<SuiteResult> {
  const config = { ...DEFAULT_SUITE, ...suite };
  const results = new Map<string, ValidationResult>();
  let totalErrors = 0;
  let totalWarnings = 0;
  let totalInfos = 0;

  console.log(`🔍 Running validation suite on: ${targetPath}`);

  // Determine what type of artifact we're validating
  const artifactType = determineArtifactType(targetPath);
  console.log(`📋 Detected artifact type: ${artifactType}`);

  try {
    // Core validations based on artifact type
    if (artifactType === "skill" || artifactType === "ecosystem") {
      if (config.skillValidation) {
        console.log("⚙️  Validating skill completeness...");
        const skillResult = await validateSingleSkillOrEcosystem(targetPath);
        if (skillResult) {
          results.set("skill-completeness", skillResult);
          countIssues(skillResult.issues, totalErrors, totalWarnings, totalInfos);
        }
      }

      if (config.domainAgnosticValidation) {
        console.log("🌐 Validating domain-agnostic patterns...");
        const domainResult = await validateDomainAgnosticArtifact(targetPath);
        if (domainResult) {
          results.set("domain-agnostic", domainResult);
          countIssues(domainResult.issues, totalErrors, totalWarnings, totalInfos);
        }
      }
    }

    // Ecosystem-wide validation
    if (config.ecosystemCoherence) {
      console.log("🏗️  Validating ecosystem coherence...");
      const ecosystemResult = await validateEcosystemCoherence(targetPath);
      results.set("ecosystem-coherence", ecosystemResult);
      countIssues(ecosystemResult.issues, totalErrors, totalWarnings, totalInfos);
    }

    // Content-specific validations
    if (config.bddCompliance) {
      console.log("🎭 Validating BDD patterns...");
      const bddResult = await validateBDDInPath(targetPath);
      if (bddResult) {
        results.set("bdd-patterns", bddResult);
        countIssues(bddResult.issues, totalErrors, totalWarnings, totalInfos);
      }
    }

    if (config.acceptanceCriteriaQuality) {
      console.log("✅ Validating acceptance criteria...");
      const acResult = await validateAcceptanceCriteriaInPath(targetPath);
      if (acResult) {
        results.set("acceptance-criteria", acResult);
        countIssues(acResult.issues, totalErrors, totalWarnings, totalInfos);
      }
    }

    // Custom validators
    if (config.customValidators && config.customValidators.length > 0) {
      for (const validatorPath of config.customValidators) {
        console.log(`🔧 Running custom validator: ${path.basename(validatorPath)}`);
        const customResult = await runCustomValidator(validatorPath, targetPath);
        if (customResult) {
          results.set(path.basename(validatorPath, ".ts"), customResult);
          countIssues(customResult.issues, totalErrors, totalWarnings, totalInfos);
        }
      }
    }
  } catch (error) {
    console.error(`❌ Validation suite failed: ${error}`);
  }

  // Calculate summary
  const validationResults = Array.from(results.values());
  const totalValidations = validationResults.length;
  const passedValidations = validationResults.filter((r) => r.success).length;
  const failedValidations = totalValidations - passedValidations;
  const averageScore =
    totalValidations > 0
      ? validationResults.reduce((sum, r) => sum + r.score, 0) / totalValidations
      : 0;

  const suiteResult: SuiteResult = {
    totalValidations,
    passedValidations,
    failedValidations,
    averageScore,
    overallSuccess: failedValidations === 0,
    results,
    summary: {
      errors: totalErrors,
      warnings: totalWarnings,
      infos: totalInfos,
    },
  };

  printSuiteResults(suiteResult);
  return suiteResult;
}

function determineArtifactType(
  targetPath: string
): "skill" | "command" | "template" | "ecosystem" | "document" {
  if (targetPath.includes("skills/") && fs.existsSync(path.join(targetPath, "SKILL.md"))) {
    return "skill";
  }

  if (targetPath.includes("commands/") && targetPath.endsWith(".md")) {
    return "command";
  }

  if (targetPath.includes("templates/") && targetPath.endsWith(".md")) {
    return "template";
  }

  if (targetPath.includes(".claude")) {
    return "ecosystem";
  }

  return "document";
}

async function validateSingleSkillOrEcosystem(
  targetPath: string
): Promise<ValidationResult | null> {
  try {
    if (fs.existsSync(path.join(targetPath, "SKILL.md"))) {
      // Single skill validation
      const skillContext = {
        skillName: path.basename(targetPath),
        skillPath: targetPath,
        phase: extractPhaseFromPath(targetPath),
        ownerRole: "unknown",
        files: {
          skillMd: path.join(targetPath, "SKILL.md"),
          references: [],
          examples: [],
          templates: [],
        },
      };

      return await validateSkillCompleteness(skillContext);
    }

    return null;
  } catch (error) {
    console.warn(`⚠️  Skill validation failed: ${error}`);
    return null;
  }
}

function extractPhaseFromPath(skillPath: string): number {
  // Try to extract phase from skill path or content
  const phaseMap: Record<string, number> = {
    "business-case": 1,
    kickoff: 1,
    // PRD is BMad-owned now (unified F+T via bmad-prd) — Phase 2.
    prd: 2,
    "bmad-prd": 2,
    requirements: 3,
    "epic-breakdown": 3,
    "user-stories": 4,
    "sprint-capacity": 4,
    "pr-description": 5,
    "dev-handoff-qa": 5,
    "test-plan": 6,
    "security-checklist": 7,
    "change-request": 8,
    "release-notes": 8,
  };

  const skillName = path.basename(skillPath);
  return phaseMap[skillName] || 4; // Default to phase 4
}

async function validateDomainAgnosticArtifact(
  targetPath: string
): Promise<ValidationResult | null> {
  try {
    const content = await readArtifactContent(targetPath);
    if (content) {
      return validateDomainAgnostic(content);
    }
    return null;
  } catch (error) {
    console.warn(`⚠️  Domain-agnostic validation failed: ${error}`);
    return null;
  }
}

async function validateBDDInPath(targetPath: string): Promise<ValidationResult | null> {
  try {
    const content = await readArtifactContent(targetPath);
    if (
      content &&
      (content.includes("Given") || content.includes("When") || content.includes("Then"))
    ) {
      return validateBDDPatterns(content);
    }
    return null;
  } catch (error) {
    console.warn(`⚠️  BDD validation failed: ${error}`);
    return null;
  }
}

async function validateAcceptanceCriteriaInPath(
  targetPath: string
): Promise<ValidationResult | null> {
  try {
    const content = await readArtifactContent(targetPath);
    if (content && /criterios de aceptaci[oó]n|acceptance criteria/i.test(content)) {
      return validateAcceptanceCriteria(content);
    }
    return null;
  } catch (error) {
    console.warn(`⚠️  Acceptance criteria validation failed: ${error}`);
    return null;
  }
}

async function readArtifactContent(targetPath: string): Promise<string | null> {
  if (fs.lstatSync(targetPath).isDirectory()) {
    // Try to find main content file
    const candidates = ["SKILL.md", "README.md", "index.md"];
    for (const candidate of candidates) {
      const filePath = path.join(targetPath, candidate);
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, "utf-8");
      }
    }
    return null;
  } else if (targetPath.endsWith(".md")) {
    return fs.readFileSync(targetPath, "utf-8");
  }

  return null;
}

async function runCustomValidator(
  validatorPath: string,
  targetPath: string
): Promise<ValidationResult | null> {
  try {
    // Dynamic import of custom validator
    const validator = await import(validatorPath);
    if (validator.validate && typeof validator.validate === "function") {
      return await validator.validate(targetPath);
    }
    return null;
  } catch (error) {
    console.warn(`⚠️  Custom validator ${validatorPath} failed: ${error}`);
    return null;
  }
}

function countIssues(
  issues: ValidationIssue[],
  totalErrors: number,
  totalWarnings: number,
  totalInfos: number
): void {
  issues.forEach((issue) => {
    switch (issue.severity) {
      case ValidationSeverity.ERROR:
        totalErrors++;
        break;
      case ValidationSeverity.WARNING:
        totalWarnings++;
        break;
      case ValidationSeverity.INFO:
        totalInfos++;
        break;
    }
  });
}

function printSuiteResults(result: SuiteResult): void {
  console.log("\n📊 Validation Suite Results");
  console.log("============================");
  console.log(`Overall Success: ${result.overallSuccess ? "✅" : "❌"}`);
  console.log(`Average Score: ${result.averageScore.toFixed(1)}/5.0`);
  console.log(`Validations: ${result.passedValidations}/${result.totalValidations} passed`);
  console.log(
    `Issues: ${result.summary.errors} errors, ${result.summary.warnings} warnings, ${result.summary.infos} infos`
  );

  console.log("\nDetailed Results:");
  console.log("-----------------");

  result.results.forEach((validationResult, validatorName) => {
    const status = validationResult.success ? "✅" : "❌";
    const score = validationResult.score.toFixed(1);
    const issues = validationResult.issues.length;

    console.log(`${status} ${validatorName}: ${score}/5.0 (${issues} issues)`);

    // Show top 3 issues for failed validations
    if (!validationResult.success && issues > 0) {
      const topIssues = validationResult.issues.slice(0, 3);
      topIssues.forEach((issue) => {
        const icon = issue.severity === "error" ? "🔴" : issue.severity === "warning" ? "🟡" : "🔵";
        console.log(`   ${icon} ${issue.message}`);
      });
      if (issues > 3) {
        console.log(`   ... and ${issues - 3} more issues`);
      }
    }
  });
}

/**
 * Quick validation helper for single files
 */
export async function quickValidate(filePath: string): Promise<ValidationResult> {
  const content = fs.readFileSync(filePath, "utf-8");

  // Auto-detect validation type based on content
  if (/criterios de aceptaci[oó]n|acceptance criteria/i.test(content)) {
    return validateAcceptanceCriteria(content);
  }

  if (/given|when|then|dado|cuando|entonces/i.test(content)) {
    return validateBDDPatterns(content);
  }

  // Default to domain-agnostic validation
  return validateDomainAgnostic(content);
}

/**
 * CLI interface for validation suite
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const targetPath = process.argv[2];
  const validationType = process.argv[3];

  if (!targetPath) {
    console.error("Usage: tsx index.ts <target-path> [validation-type]");
    console.error("Validation types: skill, domain, ecosystem, bdd, acceptance, all");
    process.exit(1);
  }

  const suiteConfig: Partial<ValidationSuite> = {};

  switch (validationType) {
    case "skill":
      suiteConfig.skillValidation = true;
      suiteConfig.domainAgnosticValidation = false;
      suiteConfig.ecosystemCoherence = false;
      break;
    case "domain":
      suiteConfig.domainAgnosticValidation = true;
      suiteConfig.skillValidation = false;
      suiteConfig.ecosystemCoherence = false;
      break;
    case "ecosystem":
      suiteConfig.ecosystemCoherence = true;
      suiteConfig.skillValidation = false;
      suiteConfig.domainAgnosticValidation = false;
      break;
    case "bdd":
      suiteConfig.bddCompliance = true;
      suiteConfig.skillValidation = false;
      suiteConfig.domainAgnosticValidation = false;
      suiteConfig.ecosystemCoherence = false;
      break;
    case "acceptance":
      suiteConfig.acceptanceCriteriaQuality = true;
      suiteConfig.skillValidation = false;
      suiteConfig.domainAgnosticValidation = false;
      suiteConfig.ecosystemCoherence = false;
      break;
    case "all":
    default:
      // Use defaults (all validations enabled where appropriate)
      break;
  }

  runValidationSuite(targetPath, suiteConfig)
    .then((result) => {
      process.exit(result.overallSuccess ? 0 : 1);
    })
    .catch((error) => {
      console.error("❌ Validation suite failed:", error);
      process.exit(1);
    });
}
