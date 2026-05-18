/**
 * ECOSYSTEM VALIDATION ENGINE - Phase 1 Critical Fix
 * Comprehensive validation engine that synchronizes filesystem reality with tracked data
 * Integration point for dtc-write-guard hook and advance-gate command
 *
 * Version: 1.0.0
 * Author: SDLC Enhancement Team
 * Date: 2026-03-17
 */

import * as fs from "fs";
import * as path from "path";
import { ValidationResult, ValidationSeverity, ValidationIssue } from "./types.js";

interface EcosystemCount {
  filesystem: number;
  tracked: number;
  drift: number;
  driftPercentage: number;
}

interface EcosystemHealth {
  skills: EcosystemCount;
  commands: EcosystemCount;
  validationScripts: EcosystemCount;
  docs: EcosystemCount;
  hooks: EcosystemCount;
  mcps: EcosystemCount;
  overallHealth: number; // 0-100%
  criticalIssues: string[];
  recommendations: string[];
}

interface FileSystemScan {
  path: string;
  exists: boolean;
  size: number;
  lastModified: Date;
  hasValidContent: boolean; // Not empty, not placeholder
}

/**
 * PHASE 1 CRITICAL FIX: Comprehensive Ecosystem Health Check
 * Detects drift between filesystem reality and system tracking
 */
export async function validateEcosystemHealth(
  claudePath: string = ".claude"
): Promise<EcosystemHealth> {
  console.log("🔍 Starting comprehensive ecosystem health validation...");

  const health: EcosystemHealth = {
    skills: await validateSkillsCount(claudePath),
    commands: await validateCommandsCount(claudePath),
    validationScripts: await validateValidationScriptsCount(claudePath),
    docs: await validateDocsCount(),
    hooks: await validateHooksCount(claudePath),
    mcps: await validateMCPsCount(),
    overallHealth: 0,
    criticalIssues: [],
    recommendations: [],
  };

  // Calculate overall health score
  const counts = [
    health.skills,
    health.commands,
    health.validationScripts,
    health.docs,
    health.hooks,
    health.mcps,
  ];
  const avgDrift =
    counts.reduce((sum, count) => sum + Math.abs(count.driftPercentage), 0) / counts.length;
  health.overallHealth = Math.max(0, 100 - avgDrift);

  // Identify critical issues
  counts.forEach((count) => {
    if (Math.abs(count.driftPercentage) > 50) {
      health.criticalIssues.push(
        `Severe drift detected: ${Math.abs(count.drift)} items difference (${count.driftPercentage.toFixed(1)}%)`
      );
    }
  });

  // Generate recommendations
  if (health.skills.drift > 0) {
    health.recommendations.push(
      `Update HelpCenter.tsx and src/data/artifacts/skills.ts to track all ${health.skills.filesystem} skills`
    );
  }
  if (health.validationScripts.drift !== 0) {
    health.recommendations.push(
      `Synchronize validation scripts tracking (found ${health.validationScripts.filesystem}, tracking ${health.validationScripts.tracked})`
    );
  }

  console.log(`📊 Ecosystem health: ${health.overallHealth.toFixed(1)}%`);
  return health;
}

async function validateSkillsCount(claudePath: string): Promise<EcosystemCount> {
  // Filesystem scan
  const skillFiles = await scanDirectory(`${claudePath}/skills`, "SKILL.md");
  const filesystemCount = skillFiles.length;

  // Read tracked count from centralized data
  let trackedCount = 54; // Current HelpCenter claim
  try {
    const skillsData = await import("../../src/data/artifacts/skills.js");
    trackedCount = skillsData.skills?.length || 54;
  } catch (error) {
    console.warn("Could not read skills.ts, using hardcoded value");
  }

  return calculateDrift(filesystemCount, trackedCount);
}

async function validateCommandsCount(claudePath: string): Promise<EcosystemCount> {
  // Filesystem scan
  const commandFiles = await scanDirectory(`${claudePath}/commands`, "*.md");
  const filesystemCount = commandFiles.length;

  // Read tracked count
  let trackedCount = 20; // Current CLAUDE.md claim
  try {
    const commandsData = await import("../../src/data/artifacts/commands.js");
    trackedCount = commandsData.commands?.length || 20;
  } catch (error) {
    console.warn("Could not read commands.ts, using hardcoded value");
  }

  return calculateDrift(filesystemCount, trackedCount);
}

async function validateValidationScriptsCount(claudePath: string): Promise<EcosystemCount> {
  // Filesystem scan - shared validators + skill-specific validators
  const sharedValidators = await scanDirectory(`${claudePath}/_shared/validators`, "*.ts");
  const skillValidators = await scanDirectory(`${claudePath}/skills`, "validate-examples.ts");

  // Filter out index.ts and types.ts from shared validators
  const actualSharedValidators = sharedValidators.filter(
    (f) => !f.path.includes("index.ts") && !f.path.includes("types.ts")
  );

  const filesystemCount = actualSharedValidators.length + skillValidators.length;
  const trackedCount = 55; // Current CLAUDE.md claim (50 + 5)

  return calculateDrift(filesystemCount, trackedCount);
}

async function validateDocsCount(): Promise<EcosystemCount> {
  // Filesystem scan of docs/ directory
  const docsFiles = await scanDirectory("docs", "*.md");
  const filesystemCount = docsFiles.length;

  const trackedCount = 41; // Current CLAUDE.md claim
  return calculateDrift(filesystemCount, trackedCount);
}

async function validateHooksCount(claudePath: string): Promise<EcosystemCount> {
  // Check for actual hook implementation files in .claude/hooks/
  const hookFiles = await scanDirectory(`${claudePath}/hooks`, "*.sh");
  // All .sh files in .claude/hooks are considered valid hooks
  const actualHooks = hookFiles.filter((f) => f.hasValidContent);

  const filesystemCount = actualHooks.length;
  const trackedCount = 4; // Current CLAUDE.md claim
  return calculateDrift(filesystemCount, trackedCount);
}

async function validateMCPsCount(): Promise<EcosystemCount> {
  // Read .mcp.json to count configured MCPs
  let mcpCount = 4; // Default claim
  try {
    const mcpConfig = JSON.parse(fs.readFileSync(".mcp.json", "utf8"));
    mcpCount = Object.keys(mcpConfig.mcpServers || {}).length;
  } catch (error) {
    console.warn("Could not read .mcp.json");
  }

  // For MCPs, filesystem count is same as tracked count (config-driven)
  return calculateDrift(mcpCount, mcpCount);
}

async function scanDirectory(dirPath: string, pattern: string): Promise<FileSystemScan[]> {
  const results: FileSystemScan[] = [];

  if (!fs.existsSync(dirPath)) {
    console.warn(`Directory ${dirPath} does not exist`);
    return results;
  }

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Recursively scan subdirectories
        const subResults = await scanDirectory(fullPath, pattern);
        results.push(...subResults);
      } else if (entry.isFile()) {
        // Check if file matches pattern
        if (pattern === "*.md" && entry.name.endsWith(".md")) {
          results.push(await scanFile(fullPath));
        } else if (pattern === "*.ts" && entry.name.endsWith(".ts")) {
          results.push(await scanFile(fullPath));
        } else if (entry.name === pattern) {
          results.push(await scanFile(fullPath));
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
  }

  return results;
}

async function scanFile(filePath: string): Promise<FileSystemScan> {
  const stats = fs.statSync(filePath);
  let hasValidContent = false;

  try {
    const content = fs.readFileSync(filePath, "utf8");
    // Content is valid if >100 chars and doesn't contain only placeholder text
    hasValidContent =
      content.length > 100 &&
      !content.match(/^(TBD|TODO|PLACEHOLDER|Coming soon|Under construction)/i);
  } catch (error) {
    console.warn(`Could not read content of ${filePath}`);
  }

  return {
    path: filePath,
    exists: true,
    size: stats.size,
    lastModified: stats.mtime,
    hasValidContent,
  };
}

function calculateDrift(filesystem: number, tracked: number): EcosystemCount {
  const drift = filesystem - tracked;
  const driftPercentage = tracked === 0 ? 100 : (drift / tracked) * 100;

  return {
    filesystem,
    tracked,
    drift,
    driftPercentage,
  };
}

/**
 * Integration point for dtc-write-guard hook
 * Called before any Write/Edit operation to validate ecosystem health
 */
export async function validateBeforeWrite(
  filePath: string,
  operation: "write" | "edit"
): Promise<ValidationResult> {
  const issues: ValidationIssue[] = [];

  // Check if the file being written affects ecosystem counts
  const affectsTracking =
    filePath.includes("HelpCenter.tsx") ||
    filePath.includes("src/data/") ||
    filePath.includes("CLAUDE.md");

  if (affectsTracking) {
    console.log("🚨 File affects ecosystem tracking, running health validation...");
    const health = await validateEcosystemHealth();

    if (health.overallHealth < 70) {
      issues.push({
        severity: ValidationSeverity.ERROR,
        message: `Ecosystem health too low (${health.overallHealth.toFixed(1)}%) for tracking changes`,
        location: filePath,
        suggestion: "Fix ecosystem drift before modifying tracking files",
      });
    }

    health.criticalIssues.forEach((issue) => {
      issues.push({
        severity: ValidationSeverity.WARNING,
        message: issue,
        location: "ecosystem",
        suggestion: "Run ecosystem synchronization",
      });
    });
  }

  const success = issues.filter((i) => i.severity === ValidationSeverity.ERROR).length === 0;
  const score = success ? 4.0 : 2.0;

  return {
    success,
    score,
    issues,
    context: {
      operation,
      filePath,
      ecosystemValidation: affectsTracking,
    },
  };
}

/**
 * Integration point for advance-gate command
 * Validates ecosystem health as part of gate evaluation
 */
export async function validateForGateAdvancement(gateNumber: number): Promise<ValidationResult> {
  console.log(`🔍 Validating ecosystem health for Gate ${gateNumber}...`);

  const health = await validateEcosystemHealth();
  const issues: ValidationIssue[] = [];

  // Critical gates require higher ecosystem health
  const requiredHealth = [0, 1, 2, 7].includes(gateNumber) ? 90 : 70;

  if (health.overallHealth < requiredHealth) {
    issues.push({
      severity: ValidationSeverity.ERROR,
      message: `Ecosystem health ${health.overallHealth.toFixed(1)}% below required ${requiredHealth}% for Gate ${gateNumber}`,
      location: "ecosystem",
      suggestion: "Fix ecosystem drift before advancing gate",
    });
  }

  // Add specific recommendations as warnings
  health.recommendations.forEach((rec) => {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: rec,
      location: "ecosystem",
      suggestion: "Implement recommendation to improve health",
    });
  });

  const success = issues.filter((i) => i.severity === ValidationSeverity.ERROR).length === 0;
  const score = success ? health.overallHealth / 20 : 1.0; // Scale 0-100% to 0-5.0

  return {
    success,
    score,
    issues,
    context: {
      gateNumber,
      ecosystemHealth: health,
      requiredHealth,
    },
  };
}

/**
 * Generate ecosystem health report for dashboard
 */
export function generateHealthReport(health: EcosystemHealth): string {
  const report = [
    "# Ecosystem Health Report",
    "",
    `**Overall Health**: ${health.overallHealth.toFixed(1)}% ${health.overallHealth >= 90 ? "✅" : health.overallHealth >= 70 ? "⚠️" : "❌"}`,
    "",
    "## Count Analysis",
    "",
    "| Component | Filesystem | Tracked | Drift | Status |",
    "|-----------|------------|---------|-------|--------|",
    `| Skills | ${health.skills.filesystem} | ${health.skills.tracked} | ${health.skills.drift > 0 ? "+" : ""}${health.skills.drift} | ${Math.abs(health.skills.driftPercentage) < 10 ? "✅" : "❌"} |`,
    `| Commands | ${health.commands.filesystem} | ${health.commands.tracked} | ${health.commands.drift > 0 ? "+" : ""}${health.commands.drift} | ${Math.abs(health.commands.driftPercentage) < 10 ? "✅" : "❌"} |`,
    `| Validation Scripts | ${health.validationScripts.filesystem} | ${health.validationScripts.tracked} | ${health.validationScripts.drift > 0 ? "+" : ""}${health.validationScripts.drift} | ${Math.abs(health.validationScripts.driftPercentage) < 10 ? "✅" : "❌"} |`,
    `| Docs | ${health.docs.filesystem} | ${health.docs.tracked} | ${health.docs.drift > 0 ? "+" : ""}${health.docs.drift} | ${Math.abs(health.docs.driftPercentage) < 10 ? "✅" : "❌"} |`,
    "",
    "## Critical Issues",
    "",
  ];

  if (health.criticalIssues.length === 0) {
    report.push("✅ No critical issues detected");
  } else {
    health.criticalIssues.forEach((issue) => {
      report.push(`❌ ${issue}`);
    });
  }

  report.push("", "## Recommendations", "");

  if (health.recommendations.length === 0) {
    report.push("✅ No recommendations at this time");
  } else {
    health.recommendations.forEach((rec, i) => {
      report.push(`${i + 1}. ${rec}`);
    });
  }

  return report.join("\n");
}

/**
 * CLI interface for ecosystem validation
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  validateEcosystemHealth()
    .then((health) => {
      const report = generateHealthReport(health);
      console.log(report);
      process.exit(health.overallHealth >= 70 ? 0 : 1);
    })
    .catch((error) => {
      console.error("❌ Ecosystem validation failed:", error);
      process.exit(1);
    });
}
