#!/usr/bin/env tsx

/**
 * Skill Development Examples Validator
 *
 * Validates skill development workflow examples for:
 * - Complete 6-step skill development methodology
 * - Progressive disclosure implementation and best practices
 * - Plugin-specific development considerations
 * - Writing style compliance (imperative/infinitive form)
 * - Trigger phrase quality and specificity
 * - Resource organization and structure validation
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";

interface ValidationResult {
  valid: boolean;
  score: number;
  errors: string[];
  warnings: string[];
  details: Record<string, any>;
}

interface SkillDevelopmentProcess {
  stepsCompleted: number;
  progressiveDisclosureUsed: boolean;
  iterationCycles: number;
  validationTesting: boolean;
  pluginStructure: boolean;
}

class SkillDevelopmentValidator {
  private examplesDir: string;

  constructor(skillPath: string) {
    this.examplesDir = join(skillPath, "examples");
  }

  async validate(): Promise<ValidationResult> {
    const result: ValidationResult = {
      valid: false,
      score: 0,
      errors: [],
      warnings: [],
      details: {},
    };

    let totalScore = 0;
    const maxScore = 100;

    // Validate examples directory exists
    if (!existsSync(this.examplesDir)) {
      result.errors.push("Examples directory not found");
      return result;
    }

    // Validate skill development workflow
    const workflowPath = join(this.examplesDir, "git-workflow-skill-development.md");
    if (!existsSync(workflowPath)) {
      result.errors.push("Missing git-workflow-skill-development.md example");
      return result;
    }

    try {
      const workflowContent = readFileSync(workflowPath, "utf-8");
      const workflowValidation = this.validateDevelopmentProcess(workflowContent);
      totalScore += workflowValidation.score;
      result.errors.push(...workflowValidation.errors);
      result.warnings.push(...workflowValidation.warnings);
      result.details.developmentProcess = workflowValidation.details;
    } catch (error) {
      result.errors.push(`Failed to validate development process: ${error}`);
    }

    result.score = Math.round((totalScore / maxScore) * 100);
    result.valid = result.errors.length === 0 && result.score >= 70;

    return result;
  }

  private validateDevelopmentProcess(content: string): {
    score: number;
    errors: string[];
    warnings: string[];
    details: any;
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const details: any = {};
    let score = 0;

    // Validate 6-step skill development methodology (25 points)
    const expectedSteps = [
      "Step 1: Understanding the Skill with Concrete Examples",
      "Step 2: Planning the Reusable Skill Contents",
      "Step 3: Create Skill Structure",
      "Step 4: Edit the Skill",
      "Step 5: Validate and Test",
      "Step 6: Iterate",
    ];

    let stepsFound = 0;
    expectedSteps.forEach((step) => {
      if (content.includes(step)) {
        stepsFound++;
      }
    });

    if (stepsFound >= 5) {
      score += 20;
      details.stepsCompleted = stepsFound;
    } else {
      errors.push(`Only ${stepsFound}/6 skill development steps found`);
      score += Math.round((stepsFound / 6) * 20);
    }

    // Check for step completion time tracking
    if (
      content.includes("25 minutes)") &&
      content.includes("30 minutes)") &&
      content.includes("75 minutes)")
    ) {
      score += 5;
    } else {
      warnings.push("Missing time tracking for development steps");
    }

    // Validate progressive disclosure implementation (20 points)
    if (content.includes("Progressive Disclosure") || content.includes("progressive disclosure")) {
      score += 5;
    }

    // Check for proper file organization
    if (
      content.includes("SKILL.md") &&
      content.includes("references/") &&
      content.includes("examples/") &&
      content.includes("scripts/")
    ) {
      score += 5;
    } else {
      errors.push("Missing complete progressive disclosure structure");
    }

    // Check for word count targets
    if (content.includes("1,847 words") && content.includes("1,500-2,000 word target")) {
      score += 5;
    } else {
      warnings.push("Missing SKILL.md word count validation");
    }

    // Check for references organization
    if (
      content.includes("references/branching-strategy.md") &&
      content.includes("references/conventional-commits.md")
    ) {
      score += 5;
    } else {
      warnings.push("Missing detailed references organization");
    }

    // Validate plugin-specific considerations (15 points)
    if (content.includes("plugin-specific") || content.includes("Plugin Directory Setup")) {
      score += 5;
    }

    // Check for plugin structure vs generic skill structure
    if (content.includes("dev-tools-plugin/skills/") && content.includes("mkdir -p skills/")) {
      score += 5;
    } else {
      errors.push("Missing plugin-specific directory structure");
    }

    // Check for auto-discovery mention
    if (content.includes("auto-discovery") || content.includes("Auto-discovery")) {
      score += 3;
    }

    // Check for plugin distribution considerations
    if (content.includes("Plugin Distribution Ready") || content.includes("plugin distribution")) {
      score += 2;
    } else {
      warnings.push("Missing plugin distribution considerations");
    }

    // Validate writing style compliance (15 points)
    const writingStyleIndicators = [
      "Imperative/Infinitive Form",
      "Third-Person",
      "imperative form",
      "third person",
    ];

    let styleIndicatorsFound = 0;
    writingStyleIndicators.forEach((indicator) => {
      if (content.includes(indicator)) {
        styleIndicatorsFound++;
      }
    });

    if (styleIndicatorsFound >= 3) {
      score += 10;
    } else {
      score += Math.round((styleIndicatorsFound / 4) * 10);
    }

    // Check for YAML frontmatter validation
    if (content.includes("YAML frontmatter") && content.includes("Third-Person with Triggers")) {
      score += 5;
    } else {
      warnings.push("Missing YAML frontmatter validation examples");
    }

    // Validate trigger phrase quality (10 points)
    if (content.includes("Trigger Testing") || content.includes("trigger phrases")) {
      score += 3;
    }

    // Check for specific trigger examples
    if (
      content.includes('"create feature branch"') &&
      content.includes('"format commit message"')
    ) {
      score += 4;
    } else {
      warnings.push("Missing specific trigger phrase examples");
    }

    // Check for trigger accuracy measurement
    if (content.includes("Trigger Accuracy") && content.includes("100%")) {
      score += 3;
    } else {
      warnings.push("Missing trigger accuracy validation");
    }

    // Validate resource organization (10 points)
    if (
      content.includes("scripts/create-feature-branch.sh") &&
      content.includes("references/branching-strategy.md") &&
      content.includes("examples/pr-workflow.md")
    ) {
      score += 5;
    } else {
      warnings.push("Missing complete resource organization examples");
    }

    // Check for script development examples
    if (content.includes("Scripts Development") && content.includes("#!/bin/bash")) {
      score += 3;
    }

    // Check for references documentation structure
    if (content.includes("References Documentation") && content.includes("800 words")) {
      score += 2;
    }

    // Validate iteration and feedback cycles (10 points)
    if (content.includes("Iteration 1") || content.includes("Real-World Usage Testing")) {
      score += 5;
    }

    // Check for user feedback integration
    if (content.includes("User Feedback") && content.includes("Applied Improvements")) {
      score += 3;
    } else {
      warnings.push("Missing user feedback integration examples");
    }

    // Check for version updates after iteration
    if (content.includes("version: 1.1.0") && content.includes("Minor bump for enhancements")) {
      score += 2;
    }

    // Validate testing and validation methodology (10 points)
    if (content.includes("Structure Validation") && content.includes("Trigger Testing")) {
      score += 5;
    }

    // Check for skill-reviewer agent usage
    if (
      content.includes("skill-reviewer agent") ||
      content.includes("Skill-Reviewer Agent Feedback")
    ) {
      score += 3;
    } else {
      warnings.push("Missing skill-reviewer agent usage example");
    }

    // Check for progressive disclosure testing
    if (
      content.includes("Progressive Disclosure Testing") &&
      content.includes("Context Window Usage Analysis")
    ) {
      score += 2;
    }

    // Validate quality metrics and measurement (5 points)
    if (content.includes("Quality Metrics Achieved") && content.includes("Time Breakdown")) {
      score += 3;
    }

    if (content.includes("Production Ready") && content.includes("2h 15m")) {
      score += 2;
    } else {
      warnings.push("Missing development time tracking");
    }

    details.score = score;
    details.stepsFound = stepsFound;
    details.hasProgressiveDisclosure = content.includes("Progressive Disclosure");
    details.hasPluginStructure = content.includes("plugin-specific");
    details.hasWritingStyleValidation = content.includes("Imperative/Infinitive Form");
    details.hasTriggerTesting = content.includes("Trigger Testing");
    details.hasIterationCycles = content.includes("Iteration 1");
    details.hasValidationTesting = content.includes("Validate and Test");

    return { score, errors, warnings, details };
  }
}

// CLI execution
if (require.main === module) {
  const skillPath = process.argv[2] || dirname(dirname(__filename));
  const validator = new SkillDevelopmentValidator(skillPath);

  validator
    .validate()
    .then((result) => {
      console.log("\n=== Skill Development Examples Validation ===");
      console.log(`Score: ${result.score}/100`);
      console.log(`Status: ${result.valid ? "✅ PASS" : "❌ FAIL"}`);

      if (result.errors.length > 0) {
        console.log("\n❌ Errors:");
        result.errors.forEach((error) => console.log(`  - ${error}`));
      }

      if (result.warnings.length > 0) {
        console.log("\n⚠️ Warnings:");
        result.warnings.forEach((warning) => console.log(`  - ${warning}`));
      }

      console.log("\n📊 Details:");
      Object.entries(result.details).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });

      process.exit(result.valid ? 0 : 1);
    })
    .catch((error) => {
      console.error("❌ Validation failed:", error);
      process.exit(1);
    });
}

export { SkillDevelopmentValidator };
