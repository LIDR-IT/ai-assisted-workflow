#!/usr/bin/env tsx

/**
 * Project Classifier Examples Validator
 *
 * Validates project classification report examples for:
 * - BMAD-inspired classification methodology
 * - Technology stack detection accuracy
 * - Documentation requirements matrix
 * - Domain-specific analysis (biometric/general)
 * - Complexity assessment framework
 * - Integration recommendations
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

interface ProjectClassification {
  projectType: string;
  techStack: string[];
  complexity: string;
  confidence: number;
  documentationRequirements: number;
}

class ProjectClassifierValidator {
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

    // Validate project classification report
    const classificationPath = join(this.examplesDir, "biometric-web-app-classification.md");
    if (!existsSync(classificationPath)) {
      result.errors.push("Missing biometric-web-app-classification.md example");
      return result;
    }

    try {
      const classificationContent = readFileSync(classificationPath, "utf-8");
      const classificationValidation = this.validateClassificationReport(classificationContent);
      totalScore += classificationValidation.score;
      result.errors.push(...classificationValidation.errors);
      result.warnings.push(...classificationValidation.warnings);
      result.details.classificationReport = classificationValidation.details;
    } catch (error) {
      result.errors.push(`Failed to validate classification report: ${error}`);
    }

    result.score = Math.round((totalScore / maxScore) * 100);
    result.valid = result.errors.length === 0 && result.score >= 70;

    return result;
  }

  private validateClassificationReport(content: string): {
    score: number;
    errors: string[];
    warnings: string[];
    details: any;
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const details: any = {};
    let score = 0;

    // Validate executive summary (15 points)
    if (!content.includes("## Executive Summary")) {
      errors.push("Missing executive summary section");
    } else {
      score += 5;

      // Check for key classification attributes
      const summaryAttributes = [
        "Primary Type",
        "Architecture Pattern",
        "Complexity Level",
        "Domain Classification",
        "Confidence",
      ];

      let attributesFound = 0;
      summaryAttributes.forEach((attr) => {
        if (content.includes(`**${attr}**`)) {
          attributesFound++;
        }
      });

      if (attributesFound >= 4) {
        score += 5;
      } else {
        warnings.push(`Only ${attributesFound}/5 key attributes found in executive summary`);
      }

      // Check confidence levels
      const confidenceMatches = content.match(/(\d+)%/g);
      if (confidenceMatches && confidenceMatches.length >= 5) {
        score += 5;
      } else {
        warnings.push("Insufficient confidence metrics in classification");
      }
    }

    // Validate 5-phase BMAD analysis structure (25 points)
    const phases = [
      "Phase 1: File Pattern Detection",
      "Phase 2: Directory Structure Analysis",
      "Phase 3: Technology Stack",
      "Phase 4: Documentation Requirements Matrix",
      "Phase 5: Complexity Assessment",
    ];

    let phasesFound = 0;
    phases.forEach((phase) => {
      if (content.includes(phase) || content.includes(phase.replace("Phase ", "## Phase "))) {
        phasesFound++;
      }
    });

    if (phasesFound >= 4) {
      score += 20;
    } else {
      errors.push(`Only ${phasesFound}/5 BMAD phases found`);
      score += Math.round((phasesFound / 5) * 20);
    }

    // Check phase content depth
    if (
      content.includes("Technology Stack Indicators Found") &&
      content.includes("Frontend Patterns") &&
      content.includes("Backend Patterns")
    ) {
      score += 5;
    } else {
      warnings.push("Missing detailed technology pattern analysis");
    }

    // Validate technology stack detection (20 points)
    const techIndicators = ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker"];

    let techFound = 0;
    techIndicators.forEach((tech) => {
      if (content.includes(tech)) {
        techFound++;
      }
    });

    if (techFound >= 4) {
      score += 10;
    } else {
      score += Math.round((techFound / 5) * 10);
    }

    // Validate confidence scoring
    const confidencePattern = /Confidence:\s*(\d+)%/g;
    const confidenceMatches = [...content.matchAll(confidencePattern)];
    if (confidenceMatches.length >= 5) {
      score += 5;

      // Check confidence values are realistic (not all 100%)
      const confidenceValues = confidenceMatches.map((match) => parseInt(match[1]));
      const averageConfidence =
        confidenceValues.reduce((a, b) => a + b, 0) / confidenceValues.length;

      if (averageConfidence > 75 && averageConfidence < 100) {
        score += 5;
      } else if (averageConfidence === 100) {
        warnings.push("All confidence scores are 100% - may not be realistic");
      }
    } else {
      warnings.push("Insufficient confidence scoring throughout analysis");
    }

    // Validate documentation requirements matrix (15 points)
    if (
      content.includes("## Phase 4: Documentation Requirements Matrix") ||
      content.includes("### Critical Documents")
    ) {
      score += 5;

      // Check for proper prioritization
      if (content.includes("MUST HAVE") && content.includes("SHOULD HAVE")) {
        score += 5;
      }

      // Check for biometric-specific requirements
      if (
        content.includes("GDPR") &&
        content.includes("biometric") &&
        content.includes("compliance")
      ) {
        score += 5;
      } else {
        warnings.push("Missing biometric domain-specific documentation requirements");
      }
    } else {
      errors.push("Missing documentation requirements matrix");
    }

    // Validate complexity assessment (10 points)
    const complexityFactors = [
      "Code Complexity",
      "Architecture Complexity",
      "Domain Complexity",
      "Team Complexity",
    ];

    let complexityFound = 0;
    complexityFactors.forEach((factor) => {
      if (content.includes(factor)) {
        complexityFound++;
      }
    });

    if (complexityFound >= 3) {
      score += 5;
    }

    if (content.includes("HIGH") && content.includes("Lines of Code")) {
      score += 5;
    } else {
      warnings.push("Missing quantitative complexity metrics");
    }

    // Validate domain classification (10 points)
    if (
      content.includes("Domain Classification") ||
      content.includes("Biometric Identity Verification")
    ) {
      score += 5;

      if (content.includes("Secondary Domains") && content.includes("Financial Services")) {
        score += 3;
      }

      if (content.includes("Risk Classification") && content.includes("HIGH RISK")) {
        score += 2;
      }
    } else {
      warnings.push("Missing comprehensive domain classification");
    }

    // Validate recommendations and next steps (5 points)
    if (
      content.includes("Executive Recommendations") ||
      content.includes("Recommended Next Steps")
    ) {
      score += 3;

      if (
        content.includes("Immediate Actions") &&
        content.includes("Short Term") &&
        content.includes("Long Term")
      ) {
        score += 2;
      }
    } else {
      warnings.push("Missing actionable recommendations");
    }

    // Validate automation indicators (bonus points if present)
    if (content.includes("28.7 seconds") && content.includes("BMAD Project Classifier")) {
      score += 2; // Bonus for automation timing
    }

    // Check for realistic project details
    if (
      content.includes("~/47,000") && // Lines of code
      content.includes("342") && // Files
      content.includes("89 React components")
    ) {
      // Components
      score += 1; // Bonus for detailed metrics
    }

    details.score = score;
    details.phasesFound = phasesFound;
    details.techIndicatorsFound = techFound;
    details.complexityFactorsFound = complexityFound;
    details.hasDocumentationMatrix = content.includes("Documentation Requirements Matrix");
    details.hasDomainClassification = content.includes("Domain Classification");
    details.hasRecommendations = content.includes("Executive Recommendations");
    details.confidenceScoresCount = confidenceMatches ? confidenceMatches.length : 0;

    return { score, errors, warnings, details };
  }
}

// CLI execution
if (require.main === module) {
  const skillPath = process.argv[2] || dirname(dirname(__filename));
  const validator = new ProjectClassifierValidator(skillPath);

  validator
    .validate()
    .then((result) => {
      console.log("\n=== Project Classifier Examples Validation ===");
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

export { ProjectClassifierValidator };
