#!/usr/bin/env tsx

/**
 * Multi-Agent Audit Examples Validator
 *
 * Validates multi-agent ecosystem audit execution reports for:
 * - Complete agent distribution and coordination
 * - Compliance scoring matrix validation
 * - Performance metrics and efficiency calculations
 * - Remediation roadmap prioritization
 * - Archive and results structure
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

interface MultiAgentAuditReport {
  sessionId: string;
  executionDate: string;
  skillsAudited: string;
  agentsDeployed: number;
  executionTime: string;
  successRate: string;
  averageScore: number;
  complianceRate: string;
  excellenceRate: string;
  criticalIssues: number;
}

class MultiAgentAuditValidator {
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

    // Validate audit execution report
    const auditReportPath = join(this.examplesDir, "ecosystem-audit-execution.md");
    if (!existsSync(auditReportPath)) {
      result.errors.push("Missing ecosystem-audit-execution.md example");
      return result;
    }

    try {
      const auditContent = readFileSync(auditReportPath, "utf-8");
      const auditValidation = this.validateAuditReport(auditContent);
      totalScore += auditValidation.score;
      result.errors.push(...auditValidation.errors);
      result.warnings.push(...auditValidation.warnings);
      result.details.auditReport = auditValidation.details;
    } catch (error) {
      result.errors.push(`Failed to validate audit report: ${error}`);
    }

    result.score = Math.round((totalScore / maxScore) * 100);
    result.valid = result.errors.length === 0 && result.score >= 70;

    return result;
  }

  private validateAuditReport(content: string): {
    score: number;
    errors: string[];
    warnings: string[];
    details: any;
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const details: any = {};
    let score = 0;

    // Validate session metadata (20 points)
    const sessionIdMatch = content.match(/\*\*Audit Session ID\*\*:\s*(.+)/);
    const executionDateMatch = content.match(/\*\*Execution Date\*\*:\s*(.+)/);
    const skillsAuditedMatch = content.match(
      /\*\*Total Skills Audited\*\*:\s*(\d+)\/(\d+)\s*ecosystem skills/
    );

    if (!sessionIdMatch) {
      errors.push("Missing audit session ID");
    } else if (
      !sessionIdMatch[1].includes("audit-workspace-") ||
      !sessionIdMatch[1].match(/\d{8}-\d{6}/)
    ) {
      errors.push("Invalid session ID format (should be audit-workspace-YYYYMMDD-HHMMSS)");
    } else {
      score += 5;
    }

    if (!executionDateMatch) {
      errors.push("Missing execution date");
    } else {
      score += 5;
    }

    if (!skillsAuditedMatch) {
      errors.push("Missing skills audited information");
    } else {
      const audited = parseInt(skillsAuditedMatch[1]);
      const total = parseInt(skillsAuditedMatch[2]);
      if (audited !== total && audited < total - 5) {
        warnings.push(`Low audit coverage: ${audited}/${total} skills`);
      }
      score += 10;
    }

    // Validate agent distribution (15 points)
    const agentTableMatch = content.match(
      /\| Agent \| Assigned Skills \| Count \| Completion Time \| Status \|/
    );
    if (!agentTableMatch) {
      errors.push("Missing agent work distribution table");
    } else {
      // Count agent rows
      const agentRows = content.match(/\| \*\*Agent [A-J]\*\* \|/g);
      if (!agentRows || agentRows.length !== 10) {
        errors.push(`Expected 10 agents, found ${agentRows ? agentRows.length : 0}`);
      } else {
        score += 10;
      }

      // Verify agent completion status
      const completedAgents = content.match(/✅ Complete/g);
      if (completedAgents && completedAgents.length >= 9) {
        score += 5;
      } else {
        warnings.push("Some agents failed or incomplete");
      }
    }

    // Validate compliance score distribution (25 points)
    const excellenceTierMatch = content.match(
      /### Excellence Tier \(90-100 points\): (\d+) skills/
    );
    const goodTierMatch = content.match(/### Good Tier \(80-89 points\): (\d+) skills/);
    const acceptableTierMatch = content.match(/### Acceptable Tier \(70-79 points\): (\d+) skills/);
    const criticalTierMatch = content.match(/### Critical Tier \(0-59 points\): (\d+) skills/);

    if (!excellenceTierMatch || !goodTierMatch || !acceptableTierMatch) {
      errors.push("Missing compliance score distribution tiers");
    } else {
      score += 15;

      // Validate realistic distribution
      const excellence = parseInt(excellenceTierMatch[1]);
      const good = parseInt(goodTierMatch[1]);
      const acceptable = parseInt(acceptableTierMatch[1]);

      if (excellence + good + acceptable > 0) {
        score += 5;
      }

      // Check for detailed skill listings in each tier
      if (
        content.includes("| Skill | Score | Agent | Key Strengths |") ||
        content.includes("| Skill | Score | Agent | Key Areas for Improvement |")
      ) {
        score += 5;
      }
    }

    // Validate detailed findings by category (15 points)
    const categories = [
      "Frontmatter Compliance",
      "Domain-Agnostic Implementation",
      "Description Quality",
      "Structure & Organization",
      "Phase Alignment",
      "Automation Integration",
      "References & Cross-Links",
      "Language & Clarity",
    ];

    let categoriesFound = 0;
    categories.forEach((category) => {
      if (content.includes(category)) {
        categoriesFound++;
      }
    });

    if (categoriesFound >= 6) {
      score += 15;
    } else {
      warnings.push(`Only ${categoriesFound}/8 audit categories found`);
      score += Math.round((categoriesFound / 8) * 15);
    }

    // Validate performance metrics (10 points)
    if (
      content.includes("### Execution Efficiency") &&
      content.includes("**Total Audit Time**") &&
      content.includes("time reduction")
    ) {
      score += 5;
    }

    if (content.includes("**Memory Peak**") || content.includes("**CPU Utilization**")) {
      score += 5;
    }

    // Validate remediation roadmap (15 points)
    if (content.includes("## Remediation Roadmap")) {
      score += 5;

      if (
        content.includes("### Phase 1: Critical Fixes") &&
        content.includes("### Phase 2:") &&
        content.includes("### Phase 3:")
      ) {
        score += 5;
      }

      if (content.includes("**Estimated Effort**") && content.includes("hours")) {
        score += 5;
      }
    } else {
      errors.push("Missing remediation roadmap section");
    }

    // Validate executive summary metrics are realistic
    const avgScoreMatch = content.match(/\*\*Average Compliance Score\*\* \| ([\d.]+)\/100/);
    if (avgScoreMatch) {
      const avgScore = parseFloat(avgScoreMatch[1]);
      if (avgScore < 0 || avgScore > 100) {
        errors.push("Invalid average compliance score range");
      } else if (avgScore < 50) {
        warnings.push("Very low average compliance score - verify realistic");
      } else if (avgScore > 95) {
        warnings.push("Very high average compliance score - verify realistic");
      }
    }

    details.score = score;
    details.categoriesFound = categoriesFound;
    details.hasAgentDistribution = agentTableMatch !== null;
    details.hasRemediationRoadmap = content.includes("## Remediation Roadmap");

    return { score, errors, warnings, details };
  }
}

// CLI execution
if (require.main === module) {
  const skillPath = process.argv[2] || dirname(dirname(__filename));
  const validator = new MultiAgentAuditValidator(skillPath);

  validator
    .validate()
    .then((result) => {
      console.log("\n=== Multi-Agent Audit Examples Validation ===");
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

export { MultiAgentAuditValidator };
