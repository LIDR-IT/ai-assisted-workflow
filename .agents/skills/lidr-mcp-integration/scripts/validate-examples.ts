#!/usr/bin/env tsx
/**
 * validate-examples.ts - MCP Integration Skill Example Validator
 *
 * Validates that mcp-integration skill examples contain proper structure
 * for Model Context Protocol server configuration and external service integration.
 *
 * Validates:
 * - MCP server configuration JSON format and structure
 * - Correct server type specifications (stdio, sse, http, ws)
 * - Environment variable usage and security patterns
 * - Plugin root path usage and portability
 * - Authentication configuration for different server types
 *
 * Usage: npx tsx scripts/validate-examples.ts
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/* ────────────────────────────────────────────────────────────────────
   VALIDATION RULES
──────────────────────────────────────────────────────────────────── */

interface ValidationRule {
  name: string;
  description: string;
  check: (content: string) => boolean;
  severity: "ERROR" | "WARN";
}

const JSON_STRUCTURE_RULES: ValidationRule[] = [
  {
    name: "Valid JSON Format",
    description: "Must be valid JSON without syntax errors",
    check: (content) => {
      try {
        JSON.parse(content);
        return true;
      } catch {
        return false;
      }
    },
    severity: "ERROR",
  },
  {
    name: "Server Configuration Objects",
    description: "Must contain server configuration objects with proper structure",
    check: (content) => {
      try {
        const config = JSON.parse(content);
        const serverCount = Object.keys(config).filter((key) => !key.startsWith("_")).length;
        return serverCount >= 1;
      } catch {
        return false;
      }
    },
    severity: "ERROR",
  },
  {
    name: "Documentation Comments",
    description: "Should include _comment field for documentation",
    check: (content) => content.includes("_comment"),
    severity: "WARN",
  },
];

const STDIO_SERVER_RULES: ValidationRule[] = [
  {
    name: "Command Specification",
    description: "stdio servers must specify command field",
    check: (content) => {
      try {
        const config = JSON.parse(content);
        const stdioServers = Object.values(config).filter(
          (server: any) => server.command !== undefined
        );
        return stdioServers.length > 0
          ? stdioServers.every(
              (server: any) => typeof server.command === "string" && server.command.length > 0
            )
          : true;
      } catch {
        return false;
      }
    },
    severity: "ERROR",
  },
  {
    name: "Arguments Array",
    description: "stdio servers should include args array for command parameters",
    check: (content) => {
      try {
        const config = JSON.parse(content);
        const stdioServers = Object.values(config).filter(
          (server: any) => server.command !== undefined
        );
        return stdioServers.length > 0
          ? stdioServers.some((server: any) => Array.isArray(server.args))
          : true;
      } catch {
        return false;
      }
    },
    severity: "WARN",
  },
  {
    name: "Plugin Root Path Usage",
    description: "Should use ${CLAUDE_PLUGIN_ROOT} for portable paths",
    check: (content) => content.includes("${CLAUDE_PLUGIN_ROOT}"),
    severity: "WARN",
  },
  {
    name: "Environment Variables",
    description: "stdio servers should include env object for environment configuration",
    check: (content) => {
      try {
        const config = JSON.parse(content);
        const stdioServers = Object.values(config).filter(
          (server: any) => server.command !== undefined
        );
        return stdioServers.length > 0
          ? stdioServers.some((server: any) => server.env && typeof server.env === "object")
          : true;
      } catch {
        return false;
      }
    },
    severity: "WARN",
  },
];

const SSE_SERVER_RULES: ValidationRule[] = [
  {
    name: "SSE Type Declaration",
    description: 'SSE servers must specify type as "sse"',
    check: (content) => {
      try {
        const config = JSON.parse(content);
        const sseServers = Object.values(config).filter((server: any) => server.type === "sse");
        return sseServers.length > 0 ? true : content.includes('"type": "sse"');
      } catch {
        return false;
      }
    },
    severity: "ERROR",
  },
  {
    name: "SSE URL Specification",
    description: "SSE servers must include valid URL",
    check: (content) => {
      try {
        const config = JSON.parse(content);
        const sseServers = Object.values(config).filter((server: any) => server.type === "sse");
        return sseServers.length > 0
          ? sseServers.every(
              (server: any) =>
                server.url && typeof server.url === "string" && server.url.startsWith("https://")
            )
          : true;
      } catch {
        return false;
      }
    },
    severity: "ERROR",
  },
  {
    name: "HTTPS URLs Only",
    description: "SSE servers must use HTTPS URLs for security",
    check: (content) => {
      try {
        const config = JSON.parse(content);
        const sseServers = Object.values(config).filter((server: any) => server.type === "sse");
        return sseServers.length > 0
          ? sseServers.every((server: any) => !server.url || server.url.startsWith("https://"))
          : true;
      } catch {
        return false;
      }
    },
    severity: "ERROR",
  },
  {
    name: "SSE Headers Configuration",
    description: "SSE servers may include headers for authentication",
    check: (content) => {
      try {
        const config = JSON.parse(content);
        const sseServers = Object.values(config).filter((server: any) => server.type === "sse");
        return sseServers.length > 0
          ? sseServers.some((server: any) => server.headers && typeof server.headers === "object")
          : true;
      } catch {
        return false;
      }
    },
    severity: "WARN",
  },
];

const HTTP_SERVER_RULES: ValidationRule[] = [
  {
    name: "HTTP Type Declaration",
    description: 'HTTP servers must specify type as "http"',
    check: (content) => {
      try {
        const config = JSON.parse(content);
        const httpServers = Object.values(config).filter((server: any) => server.type === "http");
        return httpServers.length > 0 ? true : content.includes('"type": "http"');
      } catch {
        return false;
      }
    },
    severity: "ERROR",
  },
  {
    name: "HTTP URL Specification",
    description: "HTTP servers must include valid API URL",
    check: (content) => {
      try {
        const config = JSON.parse(content);
        const httpServers = Object.values(config).filter((server: any) => server.type === "http");
        return httpServers.length > 0
          ? httpServers.every(
              (server: any) =>
                server.url && typeof server.url === "string" && server.url.startsWith("https://")
            )
          : true;
      } catch {
        return false;
      }
    },
    severity: "ERROR",
  },
  {
    name: "HTTP Authentication Headers",
    description: "HTTP servers should include authentication headers",
    check: (content) => {
      try {
        const config = JSON.parse(content);
        const httpServers = Object.values(config).filter((server: any) => server.type === "http");
        return httpServers.length > 0
          ? httpServers.some(
              (server: any) =>
                server.headers && (server.headers.Authorization || server.headers.authorization)
            )
          : true;
      } catch {
        return false;
      }
    },
    severity: "WARN",
  },
  {
    name: "Content Type Headers",
    description: "HTTP servers should specify Content-Type header",
    check: (content) => {
      try {
        const config = JSON.parse(content);
        const httpServers = Object.values(config).filter((server: any) => server.type === "http");
        return httpServers.length > 0
          ? httpServers.some((server: any) => server.headers && server.headers["Content-Type"])
          : true;
      } catch {
        return false;
      }
    },
    severity: "WARN",
  },
];

const SECURITY_RULES: ValidationRule[] = [
  {
    name: "Environment Variable Usage",
    description: "Sensitive data must use environment variables (${VAR_NAME})",
    check: (content) => {
      const hasTokens =
        content.includes("token") ||
        content.includes("Token") ||
        content.includes("KEY") ||
        content.includes("Bearer");
      const usesEnvVars = content.includes("${") && content.includes("}");
      return !hasTokens || usesEnvVars;
    },
    severity: "ERROR",
  },
  {
    name: "No Hardcoded Secrets",
    description: "Must not contain hardcoded API keys, tokens, or passwords",
    check: (content) => {
      const secretPatterns = [
        /["']sk-[a-zA-Z0-9]{32,}["']/, // API keys
        /["']ghp_[a-zA-Z0-9]{36}["']/, // GitHub tokens
        /["']xoxb-[a-zA-Z0-9-]{50,}["']/, // Slack tokens
        /["'][a-zA-Z0-9]{32,}["']/, // Generic long strings that might be secrets
      ];
      return !secretPatterns.some((pattern) => pattern.test(content));
    },
    severity: "ERROR",
  },
  {
    name: "HTTPS URLs Required",
    description: "All external URLs must use HTTPS for security",
    check: (content) => {
      const httpUrls = content.match(/["']http:\/\/[^"']+["']/g);
      return !httpUrls || httpUrls.length === 0;
    },
    severity: "ERROR",
  },
];

const CONFIGURATION_QUALITY_RULES: ValidationRule[] = [
  {
    name: "Meaningful Server Names",
    description: "Server names should be descriptive and follow naming conventions",
    check: (content) => {
      try {
        const config = JSON.parse(content);
        const serverNames = Object.keys(config).filter((key) => !key.startsWith("_"));
        return serverNames.every(
          (name) =>
            name.length >= 3 &&
            !name.includes(" ") &&
            (name.includes("-") || name.includes("_") || /^[a-z]+$/.test(name))
        );
      } catch {
        return false;
      }
    },
    severity: "WARN",
  },
  {
    name: "Service Integration Coverage",
    description: "Should cover different types of service integrations",
    check: (content) => {
      const services = ["github", "jira", "asana", "api", "database", "custom"];
      const foundServices = services.filter((service) => content.toLowerCase().includes(service));
      return foundServices.length >= 2;
    },
    severity: "WARN",
  },
  {
    name: "Environment Configuration",
    description: "Should demonstrate environment variable configuration patterns",
    check: (content) => {
      const envVarPatterns = ["${API_TOKEN}", "${DATABASE_URL}", "${CLIENT_ID}", "${LOG_LEVEL}"];
      const foundPatterns = envVarPatterns.filter((pattern) => content.includes(pattern));
      return foundPatterns.length >= 2;
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

  const validationCases = [
    {
      file: "stdio-server.json",
      rules: [
        ...JSON_STRUCTURE_RULES,
        ...STDIO_SERVER_RULES,
        ...SECURITY_RULES,
        ...CONFIGURATION_QUALITY_RULES,
      ],
      description: "STDIO MCP Server Configuration",
    },
    {
      file: "sse-server.json",
      rules: [
        ...JSON_STRUCTURE_RULES,
        ...SSE_SERVER_RULES,
        ...SECURITY_RULES,
        ...CONFIGURATION_QUALITY_RULES,
      ],
      description: "SSE MCP Server Configuration",
    },
    {
      file: "http-server.json",
      rules: [
        ...JSON_STRUCTURE_RULES,
        ...HTTP_SERVER_RULES,
        ...SECURITY_RULES,
        ...CONFIGURATION_QUALITY_RULES,
      ],
      description: "HTTP MCP Server Configuration",
    },
  ];

  console.log("🔍 Validating MCP Integration Skill Examples...\n");

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
    console.log("\n🎉 All MCP integration examples are properly structured!");
    console.log("   Ready for external service integration and workflow automation.");
  } else {
    console.log("\n💡 Fix the validation errors to ensure secure MCP configuration.");
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
