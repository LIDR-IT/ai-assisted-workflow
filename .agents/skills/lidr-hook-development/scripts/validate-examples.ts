#!/usr/bin/env tsx
/**
 * validate-examples.ts - Hook Development Skill Example Validator
 *
 * Validates that hook-development skill examples contain proper structure
 * for Claude Code hook implementation and event-driven workflow automation.
 *
 * Validates:
 * - Hook script executable permissions and shebang
 * - Security validation patterns and input sanitization
 * - JSON output format compliance for hook responses
 * - Environment variable usage and error handling
 * - Hook event patterns (PreToolUse, SessionStart, PostToolUse)
 *
 * Usage: npx tsx scripts/validate-examples.ts
 */

import { readFileSync, existsSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/* ────────────────────────────────────────────────────────────────────
   VALIDATION RULES
──────────────────────────────────────────────────────────────────── */

interface ValidationRule {
  name: string;
  description: string;
  check: (content: string, filePath?: string) => boolean;
  severity: "ERROR" | "WARN";
}

const BASH_SCRIPT_RULES: ValidationRule[] = [
  {
    name: "Executable Shebang",
    description: "Must start with #!/bin/bash shebang for execution",
    check: (content) => content.startsWith("#!/bin/bash"),
    severity: "ERROR",
  },
  {
    name: "Strict Mode Enabled",
    description: "Must use set -euo pipefail for error handling",
    check: (content) => content.includes("set -euo pipefail"),
    severity: "ERROR",
  },
  {
    name: "JSON Input Reading",
    description: "Must read input from stdin using input=$(cat)",
    check: (content) => content.includes("input=$(cat)") || content.includes("input=`cat`"),
    severity: "ERROR",
  },
  {
    name: "JQ JSON Parsing",
    description: "Must use jq for JSON parsing of tool inputs",
    check: (content) => content.includes("jq -r") && content.includes(".tool_input"),
    severity: "ERROR",
  },
  {
    name: "Hook Output Format",
    description:
      "Must output valid JSON for hook responses with permissionDecision or continue fields",
    check: (content) =>
      (content.includes("permissionDecision") && content.includes('"deny"')) ||
      content.includes('"continue"') ||
      content.includes("systemMessage"),
    severity: "ERROR",
  },
  {
    name: "Error Exit Handling",
    description: "Must use exit 2 for blocking errors and exit 0 for success",
    check: (content) => content.includes("exit 2") && content.includes("exit 0"),
    severity: "ERROR",
  },
  {
    name: "Variable Quoting",
    description: 'Must quote shell variables to prevent injection (e.g., "$variable")',
    check: (content) => {
      // Check for unquoted variables - look for common patterns
      const quotedVars = content.match(/"\$[a-zA-Z_][a-zA-Z0-9_]*"/g) || [];
      const unquotedVars = content.match(/[^"]\$[a-zA-Z_][a-zA-Z0-9_]*[^"]/g) || [];
      return quotedVars.length > 0 && unquotedVars.length === 0;
    },
    severity: "WARN",
  },
  {
    name: "Security Validation Logic",
    description: "Must include security checks (path validation, dangerous commands, etc.)",
    check: (content) =>
      content.includes("path") ||
      content.includes("command") ||
      content.includes("dangerous") ||
      content.includes("system"),
    severity: "ERROR",
  },
];

const WRITE_VALIDATION_RULES: ValidationRule[] = [
  {
    name: "File Path Extraction",
    description: "Must extract file_path from tool_input",
    check: (content) => content.includes("file_path") && content.includes(".tool_input.file_path"),
    severity: "ERROR",
  },
  {
    name: "Path Traversal Protection",
    description: "Must check for path traversal attacks (..)",
    check: (content) =>
      content.includes("..") && (content.includes("deny") || content.includes("block")),
    severity: "ERROR",
  },
  {
    name: "System Directory Protection",
    description: "Must block writes to system directories (/etc, /sys, /usr)",
    check: (content) =>
      (content.includes("/etc") && content.includes("/sys")) || content.includes("/usr"),
    severity: "ERROR",
  },
  {
    name: "Sensitive File Detection",
    description: "Must detect sensitive files (.env, secrets, credentials)",
    check: (content) =>
      (content.includes(".env") || content.includes("secret") || content.includes("credentials")) &&
      (content.includes("ask") || content.includes("sensitive")),
    severity: "ERROR",
  },
];

const BASH_VALIDATION_RULES: ValidationRule[] = [
  {
    name: "Command Extraction",
    description: "Must extract command from tool_input",
    check: (content) => content.includes("command") && content.includes(".tool_input.command"),
    severity: "ERROR",
  },
  {
    name: "Safe Command Whitelist",
    description: "Must include whitelist of safe commands (ls, pwd, echo)",
    check: (content) =>
      (content.includes("ls") && content.includes("pwd")) || content.includes("echo"),
    severity: "ERROR",
  },
  {
    name: "Dangerous Command Detection",
    description: "Must detect and block dangerous commands (rm -rf, dd, mkfs)",
    check: (content) =>
      content.includes("rm -rf") || content.includes("dd if=") || content.includes("mkfs"),
    severity: "ERROR",
  },
  {
    name: "Privilege Escalation Check",
    description: "Must check for privilege escalation commands (sudo, su)",
    check: (content) => content.includes("sudo") && content.includes("su"),
    severity: "ERROR",
  },
];

const CONTEXT_LOADING_RULES: ValidationRule[] = [
  {
    name: "Project Directory Navigation",
    description: "Must navigate to CLAUDE_PROJECT_DIR",
    check: (content) => content.includes("CLAUDE_PROJECT_DIR") && content.includes("cd"),
    severity: "ERROR",
  },
  {
    name: "Environment Variable Setting",
    description: "Must set environment variables using CLAUDE_ENV_FILE",
    check: (content) => content.includes("CLAUDE_ENV_FILE") && content.includes("export"),
    severity: "ERROR",
  },
  {
    name: "Project Type Detection",
    description: "Must detect project type (package.json, Cargo.toml, etc.)",
    check: (content) =>
      content.includes("package.json") ||
      content.includes("Cargo.toml") ||
      content.includes("go.mod"),
    severity: "ERROR",
  },
  {
    name: "Multiple Project Support",
    description: "Must support multiple project types (Node.js, Rust, Go, Python)",
    check: (content) => {
      const projectTypes = ["nodejs", "rust", "go", "python", "java"].filter((type) =>
        content.toLowerCase().includes(type)
      );
      return projectTypes.length >= 3;
    },
    severity: "ERROR",
  },
  {
    name: "TypeScript Detection",
    description: "Must check for TypeScript configuration (tsconfig.json)",
    check: (content) => content.includes("tsconfig.json") && content.includes("TYPESCRIPT"),
    severity: "WARN",
  },
  {
    name: "CI Configuration Detection",
    description: "Must detect CI/CD configuration files",
    check: (content) =>
      content.includes(".github") || content.includes(".gitlab") || content.includes("HAS_CI"),
    severity: "WARN",
  },
];

const FILE_PERMISSIONS_RULES: ValidationRule[] = [
  {
    name: "Script Executable Permission",
    description: "Hook scripts must be executable",
    check: (content, filePath) => {
      if (!filePath) return false;
      try {
        const stats = statSync(filePath);
        // Check if file is executable (owner execute bit)
        return (stats.mode & parseInt("100", 8)) !== 0;
      } catch {
        return false;
      }
    },
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
    const isValid = rule.check(content, filePath);
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
      file: "validate-write.sh",
      rules: [...BASH_SCRIPT_RULES, ...WRITE_VALIDATION_RULES, ...FILE_PERMISSIONS_RULES],
      description: "Write Hook Validation Script",
    },
    {
      file: "validate-bash.sh",
      rules: [...BASH_SCRIPT_RULES, ...BASH_VALIDATION_RULES, ...FILE_PERMISSIONS_RULES],
      description: "Bash Hook Validation Script",
    },
    {
      file: "load-context.sh",
      rules: [...BASH_SCRIPT_RULES, ...CONTEXT_LOADING_RULES, ...FILE_PERMISSIONS_RULES],
      description: "SessionStart Context Loading Script",
    },
  ];

  console.log("🔍 Validating Hook Development Skill Examples...\n");

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
    console.log("\n🎉 All hook development examples are properly structured!");
    console.log("   Ready for Claude Code event-driven automation.");
  } else {
    console.log("\n💡 Fix the validation errors to ensure hook security and compliance.");
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
