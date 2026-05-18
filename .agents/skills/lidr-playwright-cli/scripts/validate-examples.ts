#!/usr/bin/env tsx

/**
 * Playwright CLI Examples Validator
 *
 * Validates playwright-cli web testing workflow examples for:
 * - Complete browser automation workflows
 * - Proper playwright-cli command usage
 * - Test case structure and verification
 * - Performance metrics and session management
 * - Error handling and edge case coverage
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

interface PlaywrightTestWorkflow {
  testCases: number;
  passedTests: number;
  duration: string;
  browserCommands: number;
  verificationSteps: number;
}

class PlaywrightExamplesValidator {
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

    // Validate web testing workflow
    const workflowPath = join(this.examplesDir, "web-app-testing-workflow.md");
    if (!existsSync(workflowPath)) {
      result.errors.push("Missing web-app-testing-workflow.md example");
      return result;
    }

    try {
      const workflowContent = readFileSync(workflowPath, "utf-8");
      const workflowValidation = this.validateTestingWorkflow(workflowContent);
      totalScore += workflowValidation.score;
      result.errors.push(...workflowValidation.errors);
      result.warnings.push(...workflowValidation.warnings);
      result.details.testingWorkflow = workflowValidation.details;
    } catch (error) {
      result.errors.push(`Failed to validate testing workflow: ${error}`);
    }

    result.score = Math.round((totalScore / maxScore) * 100);
    result.valid = result.errors.length === 0 && result.score >= 70;

    return result;
  }

  private validateTestingWorkflow(content: string): {
    score: number;
    errors: string[];
    warnings: string[];
    details: any;
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const details: any = {};
    let score = 0;

    // Validate test case structure (25 points)
    const testCaseMatches = content.match(/## Test Case \d+:/g);
    if (!testCaseMatches) {
      errors.push("No test cases found");
    } else {
      const testCaseCount = testCaseMatches.length;
      if (testCaseCount >= 6) {
        score += 20;
        details.testCaseCount = testCaseCount;
      } else {
        warnings.push(`Only ${testCaseCount} test cases found, recommended 6+`);
        score += Math.round((testCaseCount / 6) * 20);
      }

      // Check test case structure
      if (
        content.includes("### Objective") &&
        content.includes("### Execution") &&
        content.includes("### Verification")
      ) {
        score += 5;
      } else {
        errors.push("Test cases missing standard structure (Objective/Execution/Verification)");
      }
    }

    // Validate playwright-cli command usage (20 points)
    const playwrightCommands = [
      "playwright-cli open",
      "playwright-cli click",
      "playwright-cli fill",
      "playwright-cli snapshot",
      "playwright-cli eval",
      "playwright-cli close",
    ];

    let commandsFound = 0;
    playwrightCommands.forEach((cmd) => {
      if (content.includes(cmd)) {
        commandsFound++;
      }
    });

    if (commandsFound >= 5) {
      score += 15;
    } else {
      warnings.push(`Only ${commandsFound}/6 core playwright-cli commands found`);
      score += Math.round((commandsFound / 6) * 15);
    }

    // Check for advanced commands
    const advancedCommands = ["tab-new", "state-save", "network", "route", "screenshot"];
    let advancedFound = 0;
    advancedCommands.forEach((cmd) => {
      if (content.includes(cmd)) {
        advancedFound++;
      }
    });

    if (advancedFound >= 2) {
      score += 5;
    }

    // Validate verification and assertions (15 points)
    const evalStatements = content.match(/playwright-cli eval/g);
    if (!evalStatements) {
      errors.push("Missing verification eval statements");
    } else {
      const evalCount = evalStatements.length;
      if (evalCount >= 10) {
        score += 10;
      } else {
        score += Math.round((evalCount / 10) * 10);
      }
    }

    // Check for result verification patterns
    if (content.includes("# Returns:") && content.includes("✅ Result")) {
      score += 5;
    } else {
      warnings.push("Missing result verification patterns");
    }

    // Validate test execution summary (10 points)
    if (
      content.includes("## Test Execution Summary") &&
      content.includes("| Test Case | Status | Duration | Issues Found |")
    ) {
      score += 5;
    }

    if (
      content.includes("**Total Tests**") &&
      content.includes("**Passed**") &&
      content.includes("**Success Rate**")
    ) {
      score += 5;
    } else {
      warnings.push("Missing comprehensive test summary metrics");
    }

    // Validate performance metrics (10 points)
    if (content.includes("## Performance Metrics") || content.includes("### Page Load Times")) {
      score += 5;
    }

    if (content.includes("### Network Analysis") && content.includes("playwright-cli network")) {
      score += 5;
    } else {
      warnings.push("Missing network performance analysis");
    }

    // Validate session management (10 points)
    if (
      content.includes("## Browser Session Management") ||
      content.includes("### Multi-Tab Testing")
    ) {
      score += 5;
    }

    if (
      content.includes("playwright-cli state-save") ||
      content.includes("playwright-cli localstorage-") ||
      content.includes("playwright-cli cookie-")
    ) {
      score += 5;
    } else {
      warnings.push("Missing storage state management examples");
    }

    // Validate error handling (10 points)
    if (content.includes("## Error Handling") || content.includes("### Edge Cases")) {
      score += 5;

      if (content.includes("playwright-cli route") && content.includes("--status=503")) {
        score += 5;
      } else {
        warnings.push("Missing error simulation with route mocking");
      }
    } else {
      warnings.push("Missing error handling and edge case testing");
    }

    // Validate realistic test data and URLs (5 points)
    if (
      content.includes("demo.commerce.app") ||
      content.includes("example.com") ||
      content.includes("test data")
    ) {
      score += 3;
    }

    if (
      content.includes("4111111111111111") && // Test credit card
      content.includes("john.doe@example.com")
    ) {
      // Test email
      score += 2;
    }

    // Validate cleanup procedures (5 points)
    if (
      content.includes("## Session Cleanup") ||
      content.includes("playwright-cli delete-data") ||
      content.includes("playwright-cli cookie-clear")
    ) {
      score += 5;
    } else {
      warnings.push("Missing session cleanup procedures");
    }

    details.score = score;
    details.playwrightCommandsFound = commandsFound;
    details.advancedCommandsFound = advancedFound;
    details.evalStatementsCount = evalStatements ? evalStatements.length : 0;
    details.hasPerformanceMetrics = content.includes("## Performance Metrics");
    details.hasSessionManagement = content.includes("Browser Session Management");
    details.hasErrorHandling = content.includes("Error Handling");

    return { score, errors, warnings, details };
  }
}

// CLI execution
if (require.main === module) {
  const skillPath = process.argv[2] || dirname(dirname(__filename));
  const validator = new PlaywrightExamplesValidator(skillPath);

  validator
    .validate()
    .then((result) => {
      console.log("\n=== Playwright CLI Examples Validation ===");
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

export { PlaywrightExamplesValidator };
