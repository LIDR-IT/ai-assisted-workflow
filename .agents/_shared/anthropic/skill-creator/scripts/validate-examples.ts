#!/usr/bin/env tsx

/**
 * Skill Creator Examples Validator
 *
 * Validates skill creation workflow examples for:
 * - Complete iterative development process
 * - Test-driven development methodology
 * - User feedback integration and iteration cycles
 * - Quantitative benchmarking and evaluation
 * - Description optimization and triggering accuracy
 * - Final packaging and quality metrics
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

interface SkillCreationWorkflow {
  phases: number;
  iterations: number;
  testCases: number;
  finalPassRate: number;
  userFeedbackCycles: number;
}

class SkillCreatorValidator {
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

    // Validate skill creation workflow example
    const workflowPath = join(this.examplesDir, "data-exporter-skill-creation.md");
    if (!existsSync(workflowPath)) {
      result.errors.push("Missing data-exporter-skill-creation.md example");
      return result;
    }

    try {
      const workflowContent = readFileSync(workflowPath, "utf-8");
      const workflowValidation = this.validateCreationWorkflow(workflowContent);
      totalScore += workflowValidation.score;
      result.errors.push(...workflowValidation.errors);
      result.warnings.push(...workflowValidation.warnings);
      result.details.creationWorkflow = workflowValidation.details;
    } catch (error) {
      result.errors.push(`Failed to validate creation workflow: ${error}`);
    }

    result.score = Math.round((totalScore / maxScore) * 100);
    result.valid = result.errors.length === 0 && result.score >= 70;

    return result;
  }

  private validateCreationWorkflow(content: string): {
    score: number;
    errors: string[];
    warnings: string[];
    details: any;
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const details: any = {};
    let score = 0;

    // Validate 8-phase skill creation methodology (20 points)
    const expectedPhases = [
      "Phase 1: Capture Intent",
      "Phase 2: Draft SKILL.md",
      "Phase 3: Test Case Development",
      "Phase 4: Iteration 1",
      "Phase 5: Iteration 2",
      "Phase 6: Iteration 3",
      "Phase 7: Description Optimization",
      "Phase 8: Final Packaging",
    ];

    let phasesFound = 0;
    expectedPhases.forEach((phase) => {
      if (content.includes(phase)) {
        phasesFound++;
      }
    });

    if (phasesFound >= 7) {
      score += 15;
    } else {
      errors.push(`Only ${phasesFound}/8 skill creation phases found`);
      score += Math.round((phasesFound / 8) * 15);
    }

    // Check for user interview process
    if (content.includes("User Interview") && content.includes("Key Questions & Answers")) {
      score += 5;
    } else {
      warnings.push("Missing user interview and requirements capture process");
    }

    // Validate test-driven development approach (15 points)
    if (content.includes("Test Cases Created") && content.includes("evals/evals.json")) {
      score += 5;
    }

    if (content.includes("expected_output") && content.includes("assertions")) {
      score += 5;
    } else {
      errors.push("Missing test case structure with expected outputs and assertions");
    }

    // Check for parallel test execution
    if (
      content.includes("Spawned") &&
      content.includes("parallel") &&
      content.includes("with-skill") &&
      content.includes("baseline")
    ) {
      score += 5;
    } else {
      warnings.push("Missing parallel test execution with baseline comparison");
    }

    // Validate iteration cycles with user feedback (15 points)
    const iterationMatches = content.match(/Iteration \d+/g);
    if (!iterationMatches) {
      errors.push("No iteration cycles found");
    } else {
      const iterationCount = iterationMatches.length;
      if (iterationCount >= 3) {
        score += 10;
      } else {
        score += Math.round((iterationCount / 3) * 10);
      }
    }

    // Check for user feedback integration
    if (
      content.includes("User Feedback") &&
      content.includes("feedback.json") &&
      content.includes("reviews")
    ) {
      score += 5;
    } else {
      warnings.push("Missing user feedback collection and integration");
    }

    // Validate quantitative evaluation and benchmarking (15 points)
    if (content.includes("benchmark_summary") || content.includes("Performance Metrics")) {
      score += 5;
    }

    if (
      content.includes("pass_rate") &&
      content.includes("avg_duration_seconds") &&
      content.includes("avg_tokens")
    ) {
      score += 5;
    } else {
      warnings.push("Missing comprehensive performance metrics");
    }

    // Check for assertion-based testing
    if (
      content.includes("assertions") &&
      content.includes("file_exists") &&
      content.includes("excel_sheet_count")
    ) {
      score += 5;
    } else {
      warnings.push("Missing detailed assertion-based test validation");
    }

    // Validate description optimization workflow (10 points)
    if (
      content.includes("Description Optimization") ||
      content.includes("Trigger Evaluation Set")
    ) {
      score += 5;

      if (
        content.includes("should_trigger") &&
        content.includes("Initial description") &&
        content.includes("Final description")
      ) {
        score += 5;
      }
    } else {
      warnings.push("Missing description optimization and triggering accuracy improvement");
    }

    // Validate skill packaging and production readiness (10 points)
    if (content.includes("Final Packaging") && content.includes(".skill")) {
      score += 5;
    }

    if (
      content.includes("Quality Metrics Final") &&
      content.includes("Production Usage Guidelines")
    ) {
      score += 5;
    } else {
      warnings.push("Missing production readiness and packaging guidance");
    }

    // Validate realistic metrics and ROI analysis (10 points)
    const passRateMatch = content.match(/pass_rate.*?(\d+(?:\.\d+)?)/);
    if (passRateMatch) {
      const passRate = parseFloat(passRateMatch[1]);
      if (passRate >= 0.8 && passRate <= 1.0) {
        score += 5;
      } else if (passRate > 1.0) {
        warnings.push("Unrealistic pass rate value detected");
      }
    }

    // Check for ROI analysis
    if (
      content.includes("ROI Analysis") &&
      content.includes("Time Savings") &&
      content.includes("Before:") &&
      content.includes("After:")
    ) {
      score += 5;
    } else {
      warnings.push("Missing ROI and business value analysis");
    }

    // Validate realistic skill development timeline (5 points)
    const durationMatch = content.match(/(\d+) hours? (\d+) minutes?/);
    if (durationMatch) {
      const hours = parseInt(durationMatch[1]);
      const minutes = parseInt(durationMatch[2]);
      const totalMinutes = hours * 60 + minutes;

      if (totalMinutes >= 60 && totalMinutes <= 480) {
        // 1-8 hours reasonable
        score += 3;
      } else {
        warnings.push("Unrealistic skill development timeline");
      }
    }

    // Check for lesson learned section
    if (content.includes("Lessons Learned") && content.includes("What Worked Well")) {
      score += 2;
    }

    // Validate skill structure and organization (5 points)
    if (
      content.includes("scripts/") &&
      content.includes("references/") &&
      content.includes("assets/") &&
      content.includes("evals/")
    ) {
      score += 3;
    } else {
      warnings.push("Missing complete skill directory structure");
    }

    if (content.includes("Progressive Disclosure") && content.includes("500 lines")) {
      score += 2;
    }

    // Validate examples include concrete deliverables (5 points)
    if (content.includes("Excel") && content.includes("charts") && content.includes(".xlsx")) {
      score += 3;
    }

    if (content.includes("test_data/") && content.includes(".csv") && content.includes(".json")) {
      score += 2;
    }

    details.score = score;
    details.phasesFound = phasesFound;
    details.iterationCount = iterationMatches ? iterationMatches.length : 0;
    details.hasUserFeedback = content.includes("User Feedback");
    details.hasBenchmarking = content.includes("benchmark_summary");
    details.hasDescriptionOptimization = content.includes("Description Optimization");
    details.hasPackaging = content.includes("Final Packaging");
    details.hasROIAnalysis = content.includes("ROI Analysis");

    return { score, errors, warnings, details };
  }
}

// CLI execution
if (require.main === module) {
  const skillPath = process.argv[2] || dirname(dirname(__filename));
  const validator = new SkillCreatorValidator(skillPath);

  validator
    .validate()
    .then((result) => {
      console.log("\n=== Skill Creator Examples Validation ===");
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

export { SkillCreatorValidator };
