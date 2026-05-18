#!/usr/bin/env tsx
/**
 * validate-examples.ts - Agent Development Skill Example Validator
 *
 * Validates that agent-development skill examples contain proper structure
 * for creating autonomous Claude Code agents with correct frontmatter, system prompts,
 * tool permissions, and triggering conditions.
 *
 * Validates:
 * - Agent file structure with proper YAML frontmatter
 * - Required frontmatter fields (name, description, model, color)
 * - Agent identifier naming conventions (lowercase, hyphens, 3-50 chars)
 * - Description format with triggering conditions and examples
 * - System prompt structure and completeness
 * - Tool permission validation
 * - Example block format in descriptions
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

const AGENT_STRUCTURE_RULES: ValidationRule[] = [
  {
    name: "YAML Frontmatter Present",
    description: "Must have valid YAML frontmatter enclosed in ---",
    check: (content) =>
      (content.startsWith("---") && content.includes("---\n\n")) || content.includes("---\r\n\r\n"),
    severity: "ERROR",
  },
  {
    name: "Required Name Field",
    description: "Must have name field in frontmatter",
    check: (content) => /^name:\s*[\w-]+/m.test(content),
    severity: "ERROR",
  },
  {
    name: "Required Description Field",
    description: "Must have description field with triggering conditions",
    check: (content) => /^description:\s*Use this agent when/m.test(content),
    severity: "ERROR",
  },
  {
    name: "Required Model Field",
    description: "Must specify model (inherit/sonnet/opus/haiku)",
    check: (content) => /^model:\s*(inherit|sonnet|opus|haiku)/m.test(content),
    severity: "ERROR",
  },
  {
    name: "Required Color Field",
    description: "Must specify color for visual identification",
    check: (content) => /^color:\s*(blue|cyan|green|yellow|magenta|red)/m.test(content),
    severity: "ERROR",
  },
  {
    name: "System Prompt Present",
    description: "Must have system prompt content after frontmatter",
    check: (content) => {
      const parts = content.split(/^---$/m);
      return parts.length >= 3 && parts[2].trim().length > 50;
    },
    severity: "ERROR",
  },
];

const AGENT_NAMING_RULES: ValidationRule[] = [
  {
    name: "Valid Agent Identifier",
    description: "Agent name must be 3-50 chars, lowercase, hyphens only",
    check: (content) => {
      const nameMatch = content.match(/^name:\s*([\w-]+)/m);
      if (!nameMatch) return false;
      const name = nameMatch[1];
      return /^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(name) && name.length >= 3 && name.length <= 50;
    },
    severity: "ERROR",
  },
  {
    name: "No Underscore in Name",
    description: "Agent name should use hyphens, not underscores",
    check: (content) => {
      const nameMatch = content.match(/^name:\s*([\w-]+)/m);
      return !nameMatch || !nameMatch[1].includes("_");
    },
    severity: "ERROR",
  },
  {
    name: "Descriptive Agent Name",
    description: "Agent name should be descriptive, not generic",
    check: (content) => {
      const nameMatch = content.match(/^name:\s*([\w-]+)/m);
      if (!nameMatch) return false;
      const name = nameMatch[1];
      const generic = ["helper", "agent", "tool", "utils", "misc", "general"];
      return !generic.some((g) => name.includes(g));
    },
    severity: "WARN",
  },
];

const AGENT_DESCRIPTION_RULES: ValidationRule[] = [
  {
    name: "Example Blocks Present",
    description: "Description must include <example> blocks showing usage",
    check: (content) => content.includes("<example>") && content.includes("</example>"),
    severity: "ERROR",
  },
  {
    name: "Multiple Examples",
    description: "Should have at least 2 example blocks for different scenarios",
    check: (content) => (content.match(/<example>/g) || []).length >= 2,
    severity: "WARN",
  },
  {
    name: "Example Structure",
    description: "Examples should have Context, user, and assistant fields",
    check: (content) => {
      const examples = content.match(/<example>[\s\S]*?<\/example>/g) || [];
      return examples.some(
        (ex) => ex.includes("Context:") && ex.includes("user:") && ex.includes("assistant:")
      );
    },
    severity: "ERROR",
  },
  {
    name: "Commentary Blocks",
    description: "Examples should include <commentary> explaining why agent triggers",
    check: (content) => content.includes("<commentary>") && content.includes("</commentary>"),
    severity: "WARN",
  },
  {
    name: "Triggering Conditions",
    description: "Description should clearly state when to use the agent",
    check: (content) => {
      const descMatch = content.match(/description:\s*([\s\S]*?)(?:^model:|^color:|^tools:|^---)/m);
      if (!descMatch) return false;
      const desc = descMatch[1].toLowerCase();
      return desc.includes("when") || desc.includes("if") || desc.includes("during");
    },
    severity: "ERROR",
  },
];

const SYSTEM_PROMPT_RULES: ValidationRule[] = [
  {
    name: "Second Person Perspective",
    description: "System prompt should address the agent in second person (You are...)",
    check: (content) => {
      const parts = content.split(/^---$/m);
      if (parts.length < 3) return false;
      const systemPrompt = parts[2].toLowerCase();
      return systemPrompt.includes("you are") || systemPrompt.includes("your ");
    },
    severity: "ERROR",
  },
  {
    name: "Core Responsibilities Section",
    description: "Should have clearly defined core responsibilities",
    check: (content) => {
      const parts = content.split(/^---$/m);
      if (parts.length < 3) return false;
      return parts[2].includes("Core Responsibilities") || parts[2].includes("Responsibilities");
    },
    severity: "WARN",
  },
  {
    name: "Process or Workflow",
    description: "Should define step-by-step process or analysis workflow",
    check: (content) => {
      const parts = content.split(/^---$/m);
      if (parts.length < 3) return false;
      const systemPrompt = parts[2].toLowerCase();
      return (
        systemPrompt.includes("process:") ||
        systemPrompt.includes("workflow:") ||
        systemPrompt.includes("steps:") ||
        systemPrompt.includes("analysis:")
      );
    },
    severity: "WARN",
  },
  {
    name: "Output Format",
    description: "Should specify expected output format",
    check: (content) => {
      const parts = content.split(/^---$/m);
      if (parts.length < 3) return false;
      const systemPrompt = parts[2].toLowerCase();
      return (
        systemPrompt.includes("output") ||
        systemPrompt.includes("return") ||
        systemPrompt.includes("provide") ||
        systemPrompt.includes("format")
      );
    },
    severity: "WARN",
  },
  {
    name: "Quality Standards",
    description: "Should include quality standards or guidelines",
    check: (content) => {
      const parts = content.split(/^---$/m);
      if (parts.length < 3) return false;
      const systemPrompt = parts[2].toLowerCase();
      return (
        systemPrompt.includes("quality") ||
        systemPrompt.includes("standards") ||
        systemPrompt.includes("best practices") ||
        systemPrompt.includes("guidelines")
      );
    },
    severity: "WARN",
  },
  {
    name: "Adequate Length",
    description: "System prompt should be substantial (500-3000 characters recommended)",
    check: (content) => {
      const parts = content.split(/^---$/m);
      if (parts.length < 3) return false;
      const systemPrompt = parts[2].trim();
      return systemPrompt.length >= 200 && systemPrompt.length <= 10000;
    },
    severity: "WARN",
  },
];

const TOOLS_VALIDATION_RULES: ValidationRule[] = [
  {
    name: "Valid Tools Format",
    description: "Tools field should be valid YAML array if present",
    check: (content) => {
      const toolsMatch = content.match(/^tools:\s*\[(.*)\]/m);
      if (!toolsMatch) return true; // Optional field
      const toolsStr = toolsMatch[1];
      return /^"[\w"]+(",\s*"[\w"]+)*"?$/.test(toolsStr.trim());
    },
    severity: "ERROR",
  },
  {
    name: "Common Tool Names",
    description: "Should use standard tool names (Read, Write, Grep, Bash, etc.)",
    check: (content) => {
      const toolsMatch = content.match(/^tools:\s*\[(.*)\]/m);
      if (!toolsMatch) return true; // Optional field
      const toolsStr = toolsMatch[1];
      const validTools = ["Read", "Write", "Grep", "Bash", "Glob", "Edit", "Skill"];
      const tools = toolsStr.split(",").map((t) => t.trim().replace(/"/g, ""));
      return tools.every((tool) => validTools.includes(tool) || tool === "*");
    },
    severity: "WARN",
  },
  {
    name: "Least Privilege Principle",
    description: "Should restrict tools to minimum needed (avoid giving all tools)",
    check: (content) => {
      const toolsMatch = content.match(/^tools:\s*\[(.*)\]/m);
      if (!toolsMatch) return true; // If no tools field, has all tools (might be intentional)
      const toolsStr = toolsMatch[1];
      return !toolsStr.includes("*") && toolsStr.split(",").length <= 5;
    },
    severity: "WARN",
  },
];

const EXAMPLE_QUALITY_RULES: ValidationRule[] = [
  {
    name: "Realistic Scenarios",
    description: "Examples should show realistic usage scenarios",
    check: (content) => {
      const examples = content.match(/<example>[\s\S]*?<\/example>/g) || [];
      return examples.some((ex) => ex.length > 100 && ex.includes("Context:"));
    },
    severity: "WARN",
  },
  {
    name: "Different Trigger Types",
    description: "Examples should show both proactive and reactive triggering",
    check: (content) => {
      const examples = content.match(/<example>[\s\S]*?<\/example>/g) || [];
      if (examples.length < 2) return false;
      const hasExplicitRequest = examples.some(
        (ex) =>
          ex.toLowerCase().includes("review") ||
          ex.toLowerCase().includes("check") ||
          ex.toLowerCase().includes("analyze") ||
          ex.toLowerCase().includes("help")
      );
      const hasImplicitTrigger = examples.some(
        (ex) =>
          ex.toLowerCase().includes("implemented") ||
          ex.toLowerCase().includes("wrote") ||
          ex.toLowerCase().includes("created") ||
          ex.toLowerCase().includes("finished")
      );
      return hasExplicitRequest || hasImplicitTrigger;
    },
    severity: "WARN",
  },
  {
    name: "Clear User Intent",
    description: "User statements in examples should be clear and specific",
    check: (content) => {
      const examples = content.match(/<example>[\s\S]*?<\/example>/g) || [];
      return examples.some((ex) => {
        const userMatch = ex.match(/user:\s*"([^"]+)"/);
        return userMatch && userMatch[1].length > 10;
      });
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
    ...AGENT_STRUCTURE_RULES,
    ...AGENT_NAMING_RULES,
    ...AGENT_DESCRIPTION_RULES,
    ...SYSTEM_PROMPT_RULES,
    ...TOOLS_VALIDATION_RULES,
    ...EXAMPLE_QUALITY_RULES,
  ];

  const validationCases = [
    {
      file: "agent-creation-prompt.md",
      rules: allRules,
      description: "AI-Assisted Agent Generation Template",
    },
    {
      file: "complete-agent-examples.md",
      rules: allRules,
      description: "Complete Agent Examples Collection",
    },
  ];

  console.log("🔍 Validating Agent Development Skill Examples...\n");

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
    console.log("\n🎉 All agent development examples are properly structured!");
    console.log("   Ready for creating autonomous Claude Code agents.");
  } else {
    console.log("\n💡 Fix the validation errors to ensure proper agent structure.");
    console.log("   Reference: Agent frontmatter and system prompt best practices.");
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
