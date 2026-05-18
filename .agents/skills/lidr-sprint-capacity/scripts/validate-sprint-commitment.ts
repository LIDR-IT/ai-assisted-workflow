#!/usr/bin/env tsx

/**
 * Sprint Commitment Validation Script
 * Validates capacity vs commitment alignment, buffer validation, and historical velocity
 * Critical for sustainable sprint planning and team performance
 */

import {
  ValidationResult,
  ValidationIssue,
  ValidationSeverity,
} from "../../../_shared/validators/types.js";
import * as fs from "fs";
import * as path from "path";

interface SprintCommitmentOptions {
  minBufferPercent: number; // Minimum buffer percentage
  maxBufferPercent: number; // Maximum buffer percentage
  maxCommitmentPercent: number; // Max commitment vs capacity
  validateVelocity: boolean; // Check against historical velocity
  velocityVarianceThreshold: number; // Max acceptable velocity variance
}

interface TeamMember {
  name: string;
  role: string;
  hoursPerSprint: number;
  efficiency: number; // 0.7-0.9 typical
  unavailableHours: number;
  specializations: string[];
}

interface SprintCapacity {
  sprintLength: number; // Days
  team: TeamMember[];
  totalGrossHours: number;
  totalUnavailableHours: number;
  bufferHours: number;
  netCapacityHours: number;
  commitmentHours: number;
  bufferPercentage: number;
  commitmentPercentage: number;
}

interface HistoricalSprint {
  sprintNumber: number;
  planned: number;
  completed: number;
  velocity: number;
  spillover: number;
  defects: number;
}

interface VelocityAnalysis {
  historicalSprints: HistoricalSprint[];
  averageVelocity: number;
  velocityTrend: "increasing" | "decreasing" | "stable";
  variance: number;
  predictedCapacity: number;
}

const DEFAULT_OPTIONS: SprintCommitmentOptions = {
  minBufferPercent: 15,
  maxBufferPercent: 25,
  maxCommitmentPercent: 90,
  validateVelocity: true,
  velocityVarianceThreshold: 0.2, // 20%
};

/**
 * Validates sprint commitment against capacity and historical data
 */
export async function validateSprintCommitment(
  capacityDataPath: string,
  historicalDataPath?: string,
  options: Partial<SprintCommitmentOptions> = {}
): Promise<ValidationResult> {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const issues: ValidationIssue[] = [];

  try {
    // Load sprint capacity data
    const sprintCapacity = await loadSprintCapacity(capacityDataPath);

    if (!sprintCapacity) {
      return createFailureResult([
        {
          severity: ValidationSeverity.ERROR,
          message: "No sprint capacity data found",
          context: `Unable to parse capacity from ${capacityDataPath}`,
          suggestion: "Ensure sprint capacity file exists and follows expected format",
          ruleId: "SPRINT-001",
        },
      ]);
    }

    // Validate team composition
    validateTeamComposition(sprintCapacity.team, issues);

    // Validate capacity calculations
    validateCapacityCalculations(sprintCapacity, issues);

    // Validate buffer percentage
    validateBuffer(sprintCapacity, config, issues);

    // Validate commitment percentage
    validateCommitment(sprintCapacity, config, issues);

    // Validate individual team member allocations
    validateTeamMemberAllocations(sprintCapacity.team, issues);

    // Validate against historical velocity if data available
    if (config.validateVelocity && historicalDataPath) {
      const velocityAnalysis = await loadVelocityAnalysis(historicalDataPath);
      if (velocityAnalysis) {
        await validateAgainstVelocity(sprintCapacity, velocityAnalysis, config, issues);
      }
    }

    // Validate sprint sustainability
    validateSustainability(sprintCapacity, issues);

    // Validate role coverage and specialization balance
    validateRoleCoverage(sprintCapacity.team, issues);

    const score = calculateCommitmentScore(sprintCapacity, issues);

    return {
      success: issues.filter((i) => i.severity === ValidationSeverity.ERROR).length === 0,
      score,
      issues,
      metadata: {
        validator: "validate-sprint-commitment",
        timestamp: new Date().toISOString(),
        fileCount: 1,
      },
    };
  } catch (error) {
    return createFailureResult([
      {
        severity: ValidationSeverity.ERROR,
        message: `Validation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        context: "Unable to complete sprint commitment validation",
        suggestion: "Check file format and accessibility",
        ruleId: "SPRINT-000",
      },
    ]);
  }
}

async function loadSprintCapacity(capacityPath: string): Promise<SprintCapacity | null> {
  if (!fs.existsSync(capacityPath)) {
    return null;
  }

  const content = fs.readFileSync(capacityPath, "utf-8");

  // Try to parse as JSON
  if (capacityPath.endsWith(".json")) {
    try {
      const data = JSON.parse(content);
      return validateCapacityStructure(data) ? data : null;
    } catch {
      return null;
    }
  }

  // Try to parse as markdown
  if (capacityPath.endsWith(".md")) {
    return parseMarkdownCapacity(content);
  }

  return null;
}

function parseMarkdownCapacity(content: string): SprintCapacity | null {
  const sprintLength = extractSprintLength(content);
  const team = extractTeamMembers(content);
  const capacityData = extractCapacityData(content);

  if (!sprintLength || team.length === 0 || !capacityData) {
    return null;
  }

  // Calculate totals
  const totalGrossHours = team.reduce((sum, member) => sum + member.hoursPerSprint, 0);
  const totalUnavailableHours = team.reduce((sum, member) => sum + member.unavailableHours, 0);

  const netCapacityHours =
    capacityData.netCapacityHours ||
    totalGrossHours - totalUnavailableHours - capacityData.bufferHours;
  const bufferPercentage = (capacityData.bufferHours / totalGrossHours) * 100;
  const commitmentPercentage = (capacityData.commitmentHours / netCapacityHours) * 100;

  return {
    sprintLength,
    team,
    totalGrossHours,
    totalUnavailableHours,
    bufferHours: capacityData.bufferHours,
    netCapacityHours,
    commitmentHours: capacityData.commitmentHours,
    bufferPercentage,
    commitmentPercentage,
  };
}

function extractSprintLength(content: string): number {
  const match =
    content.match(/sprint\s+length:\s*(\d+)\s*days?/i) ||
    content.match(/duración:\s*(\d+)\s*días?/i);
  return match ? parseInt(match[1]) : 10; // Default 2 weeks
}

function extractTeamMembers(content: string): TeamMember[] {
  const team: TeamMember[] = [];

  // Look for team section
  const teamMatch = content.match(/## (?:Team|Equipo)([\s\S]*?)(?=##|$)/i);
  if (!teamMatch) return team;

  const teamSection = teamMatch[1];
  const lines = teamSection.split("\n");

  for (const line of lines) {
    // Parse team member lines: | Name | Role | Hours | Efficiency | Unavailable | Specializations |
    const match = line.match(
      /\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*(\d+)\s*\|\s*([\d.]+)\s*\|\s*(\d+)\s*\|\s*([^|]*)\s*\|/
    );
    if (match && match[1] !== "Name" && match[1] !== "Nombre") {
      const specializations = match[6]
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);

      team.push({
        name: match[1].trim(),
        role: match[2].trim(),
        hoursPerSprint: parseInt(match[3]),
        efficiency: parseFloat(match[4]),
        unavailableHours: parseInt(match[5]),
        specializations,
      });
    }
  }

  return team;
}

function extractCapacityData(content: string): {
  bufferHours: number;
  commitmentHours: number;
  netCapacityHours?: number;
} | null {
  const bufferMatch = content.match(/buffer[:\s]*(\d+)\s*hours?/i);
  const commitmentMatch =
    content.match(/commitment[:\s]*(\d+)\s*hours?/i) ||
    content.match(/comprometido[:\s]*(\d+)\s*horas?/i);

  if (!bufferMatch || !commitmentMatch) {
    return null;
  }

  return {
    bufferHours: parseInt(bufferMatch[1]),
    commitmentHours: parseInt(commitmentMatch[1]),
  };
}

async function loadVelocityAnalysis(velocityPath: string): Promise<VelocityAnalysis | null> {
  if (!fs.existsSync(velocityPath)) {
    return null;
  }

  const content = fs.readFileSync(velocityPath, "utf-8");

  try {
    const data = JSON.parse(content);
    return validateVelocityStructure(data) ? data : null;
  } catch {
    return null;
  }
}

function validateCapacityStructure(data: any): boolean {
  return (
    data &&
    typeof data.sprintLength === "number" &&
    Array.isArray(data.team) &&
    typeof data.totalGrossHours === "number" &&
    typeof data.commitmentHours === "number" &&
    typeof data.bufferHours === "number"
  );
}

function validateVelocityStructure(data: any): boolean {
  return (
    data &&
    Array.isArray(data.historicalSprints) &&
    typeof data.averageVelocity === "number" &&
    typeof data.variance === "number"
  );
}

function validateTeamComposition(team: TeamMember[], issues: ValidationIssue[]): void {
  if (team.length === 0) {
    issues.push({
      severity: ValidationSeverity.ERROR,
      message: "No team members defined",
      context: "Sprint planning requires team composition",
      suggestion: "Define team members with roles and capacity",
      ruleId: "SPRINT-010",
    });
    return;
  }

  if (team.length < 3) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: `Very small team (${team.length} members)`,
      context: "Small teams have higher bus factor risk",
      suggestion: "Consider team sustainability and knowledge sharing",
      ruleId: "SPRINT-011",
    });
  }

  if (team.length > 9) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: `Large team (${team.length} members)`,
      context: "Large teams may have coordination overhead",
      suggestion: "Consider if team can be split or if coordination is adequate",
      ruleId: "SPRINT-012",
    });
  }

  // Check for missing essential roles
  const roles = team.map((m) => m.role.toLowerCase());
  const essentialRoles = ["developer", "dev", "qa", "tester"];
  const hasEssentialRoles = essentialRoles.some((role) =>
    roles.some((memberRole) => memberRole.includes(role))
  );

  if (!hasEssentialRoles) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: "Team lacks essential development roles",
      context: "No clear developers or QA identified",
      suggestion: "Ensure team has necessary skills for sprint deliverables",
      ruleId: "SPRINT-013",
    });
  }
}

function validateCapacityCalculations(capacity: SprintCapacity, issues: ValidationIssue[]): void {
  const expectedGross = capacity.team.reduce((sum, member) => sum + member.hoursPerSprint, 0);
  const expectedUnavailable = capacity.team.reduce(
    (sum, member) => sum + member.unavailableHours,
    0
  );

  if (Math.abs(capacity.totalGrossHours - expectedGross) > 1) {
    issues.push({
      severity: ValidationSeverity.ERROR,
      message: "Gross hours calculation mismatch",
      context: `Calculated: ${expectedGross}, Reported: ${capacity.totalGrossHours}`,
      suggestion: "Verify team member hours are correctly summed",
      ruleId: "SPRINT-020",
    });
  }

  if (Math.abs(capacity.totalUnavailableHours - expectedUnavailable) > 1) {
    issues.push({
      severity: ValidationSeverity.ERROR,
      message: "Unavailable hours calculation mismatch",
      context: `Calculated: ${expectedUnavailable}, Reported: ${capacity.totalUnavailableHours}`,
      suggestion: "Verify unavailable hours are correctly summed",
      ruleId: "SPRINT-021",
    });
  }

  const expectedNet = expectedGross - expectedUnavailable - capacity.bufferHours;
  if (Math.abs(capacity.netCapacityHours - expectedNet) > 1) {
    issues.push({
      severity: ValidationSeverity.ERROR,
      message: "Net capacity calculation error",
      context: `Expected: ${expectedNet}, Actual: ${capacity.netCapacityHours}`,
      suggestion: "Net capacity = Gross - Unavailable - Buffer",
      ruleId: "SPRINT-022",
    });
  }
}

function validateBuffer(
  capacity: SprintCapacity,
  config: SprintCommitmentOptions,
  issues: ValidationIssue[]
): void {
  if (capacity.bufferPercentage < config.minBufferPercent) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: `Buffer too low (${capacity.bufferPercentage.toFixed(1)}% < ${config.minBufferPercent}%)`,
      context: "Insufficient buffer increases sprint failure risk",
      suggestion: "Increase buffer to account for unknowns and interruptions",
      ruleId: "SPRINT-030",
    });
  }

  if (capacity.bufferPercentage > config.maxBufferPercent) {
    issues.push({
      severity: ValidationSeverity.INFO,
      message: `Buffer very high (${capacity.bufferPercentage.toFixed(1)}% > ${config.maxBufferPercent}%)`,
      context: "High buffer reduces sprint productivity",
      suggestion: "Consider if buffer can be reduced for more commitment",
      ruleId: "SPRINT-031",
    });
  }

  if (capacity.bufferHours === 0) {
    issues.push({
      severity: ValidationSeverity.ERROR,
      message: "No buffer allocated",
      context: "Zero buffer is unrealistic for sustainable pace",
      suggestion: "Allocate 15-20% buffer for sustainable delivery",
      ruleId: "SPRINT-032",
    });
  }
}

function validateCommitment(
  capacity: SprintCapacity,
  config: SprintCommitmentOptions,
  issues: ValidationIssue[]
): void {
  if (capacity.commitmentPercentage > config.maxCommitmentPercent) {
    issues.push({
      severity: ValidationSeverity.ERROR,
      message: `Over-commitment (${capacity.commitmentPercentage.toFixed(1)}% > ${config.maxCommitmentPercent}%)`,
      context: "Over-commitment leads to sprint failure and burnout",
      suggestion: "Reduce commitment to sustainable levels",
      ruleId: "SPRINT-040",
    });
  }

  if (capacity.commitmentPercentage < 60) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: `Low commitment (${capacity.commitmentPercentage.toFixed(1)}%)`,
      context: "Very low commitment may indicate planning issues",
      suggestion: "Review if more work can be committed or if capacity is overestimated",
      ruleId: "SPRINT-041",
    });
  }

  if (capacity.commitmentHours > capacity.netCapacityHours) {
    issues.push({
      severity: ValidationSeverity.ERROR,
      message: "Commitment exceeds net capacity",
      context: `Commitment: ${capacity.commitmentHours}h, Capacity: ${capacity.netCapacityHours}h`,
      suggestion: "Reduce commitment or increase capacity",
      ruleId: "SPRINT-042",
    });
  }
}

function validateTeamMemberAllocations(team: TeamMember[], issues: ValidationIssue[]): void {
  for (const member of team) {
    const memberContext = `Team member: ${member.name} (${member.role})`;

    // Validate hours per sprint
    if (member.hoursPerSprint > 80) {
      // More than 2 weeks full time
      issues.push({
        severity: ValidationSeverity.WARNING,
        message: "Very high hours allocation",
        context: `${memberContext} - ${member.hoursPerSprint}h`,
        suggestion: "Verify if allocation is realistic and sustainable",
        ruleId: "SPRINT-050",
      });
    }

    if (member.hoursPerSprint < 10) {
      issues.push({
        severity: ValidationSeverity.INFO,
        message: "Very low hours allocation",
        context: `${memberContext} - ${member.hoursPerSprint}h`,
        suggestion: "Consider if member should be included in sprint planning",
        ruleId: "SPRINT-051",
      });
    }

    // Validate efficiency
    if (member.efficiency < 0.5) {
      issues.push({
        severity: ValidationSeverity.WARNING,
        message: "Very low efficiency factor",
        context: `${memberContext} - ${member.efficiency * 100}% efficiency`,
        suggestion: "Consider training or support needs",
        ruleId: "SPRINT-052",
      });
    }

    if (member.efficiency > 0.95) {
      issues.push({
        severity: ValidationSeverity.INFO,
        message: "Unusually high efficiency factor",
        context: `${memberContext} - ${member.efficiency * 100}% efficiency`,
        suggestion: "Verify if efficiency estimate is realistic",
        ruleId: "SPRINT-053",
      });
    }

    // Validate unavailable hours proportion
    const unavailablePercentage = (member.unavailableHours / member.hoursPerSprint) * 100;
    if (unavailablePercentage > 50) {
      issues.push({
        severity: ValidationSeverity.WARNING,
        message: "High unavailable time",
        context: `${memberContext} - ${unavailablePercentage.toFixed(1)}% unavailable`,
        suggestion: "Consider if member should participate in this sprint",
        ruleId: "SPRINT-054",
      });
    }

    // Validate specializations
    if (member.specializations.length === 0) {
      issues.push({
        severity: ValidationSeverity.INFO,
        message: "No specializations defined",
        context: memberContext,
        suggestion: "Define member specializations for better task allocation",
        ruleId: "SPRINT-055",
      });
    }
  }
}

async function validateAgainstVelocity(
  capacity: SprintCapacity,
  velocity: VelocityAnalysis,
  config: SprintCommitmentOptions,
  issues: ValidationIssue[]
): Promise<void> {
  // Check if commitment aligns with historical velocity
  const velocityDifference =
    Math.abs(capacity.commitmentHours - velocity.averageVelocity) / velocity.averageVelocity;

  if (velocityDifference > config.velocityVarianceThreshold) {
    const direction = capacity.commitmentHours > velocity.averageVelocity ? "higher" : "lower";
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: `Commitment significantly ${direction} than historical velocity`,
      context: `Commitment: ${capacity.commitmentHours}h, Historical avg: ${velocity.averageVelocity}h (${(velocityDifference * 100).toFixed(1)}% difference)`,
      suggestion: "Review if commitment aligns with team capability",
      ruleId: "SPRINT-060",
    });
  }

  // Check velocity trend
  if (
    velocity.velocityTrend === "decreasing" &&
    capacity.commitmentHours > velocity.averageVelocity
  ) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: "Commitment increases despite declining velocity trend",
      context: "Historical velocity is decreasing",
      suggestion: "Consider addressing velocity decline before increasing commitment",
      ruleId: "SPRINT-061",
    });
  }

  // Check variance
  if (velocity.variance > 0.3) {
    // High variance
    issues.push({
      severity: ValidationSeverity.INFO,
      message: "High historical velocity variance",
      context: `Variance: ${(velocity.variance * 100).toFixed(1)}%`,
      suggestion: "Consider adding extra buffer due to unpredictable delivery",
      ruleId: "SPRINT-062",
    });
  }

  // Check against recent performance
  if (velocity.historicalSprints.length > 0) {
    const lastThreeSprints = velocity.historicalSprints.slice(-3);
    const recentAverage =
      lastThreeSprints.reduce((sum, s) => sum + s.completed, 0) / lastThreeSprints.length;

    if (capacity.commitmentHours > recentAverage * 1.2) {
      issues.push({
        severity: ValidationSeverity.WARNING,
        message: "Commitment much higher than recent performance",
        context: `Commitment: ${capacity.commitmentHours}h, Recent avg: ${recentAverage.toFixed(1)}h`,
        suggestion: "Base commitment on recent performance rather than historical average",
        ruleId: "SPRINT-063",
      });
    }
  }
}

function validateSustainability(capacity: SprintCapacity, issues: ValidationIssue[]): void {
  // Check for sustainable pace indicators
  const avgHoursPerDay = capacity.totalGrossHours / capacity.sprintLength / capacity.team.length;

  if (avgHoursPerDay > 8.5) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: `High daily average (${avgHoursPerDay.toFixed(1)}h per person per day)`,
      context: "High daily hours may not be sustainable",
      suggestion: "Consider if team can maintain this pace throughout sprint",
      ruleId: "SPRINT-070",
    });
  }

  // Check for overtime indicators
  const totalNormalHours = capacity.team.length * capacity.sprintLength * 8; // 8h normal day
  const overtimeHours = capacity.totalGrossHours - totalNormalHours;

  if (overtimeHours > totalNormalHours * 0.1) {
    // More than 10% overtime
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: `Significant overtime planned (${overtimeHours}h)`,
      context: "Planned overtime may affect code quality and team morale",
      suggestion: "Consider reducing scope or extending timeline",
      ruleId: "SPRINT-071",
    });
  }

  // Check buffer distribution
  const bufferPerMember = capacity.bufferHours / capacity.team.length;
  if (bufferPerMember < 3) {
    // Less than 3h buffer per person
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: `Very low buffer per team member (${bufferPerMember.toFixed(1)}h)`,
      context: "Insufficient individual buffer for unknowns",
      suggestion: "Ensure adequate buffer for each team member",
      ruleId: "SPRINT-072",
    });
  }
}

function validateRoleCoverage(team: TeamMember[], issues: ValidationIssue[]): void {
  const roles = team.map((m) => m.role.toLowerCase());

  // Check for single points of failure
  const roleGroups = new Map<string, TeamMember[]>();
  team.forEach((member) => {
    const role = member.role.toLowerCase();
    if (!roleGroups.has(role)) {
      roleGroups.set(role, []);
    }
    roleGroups.get(role)!.push(member);
  });

  roleGroups.forEach((members, role) => {
    if (members.length === 1 && members[0].hoursPerSprint > 20) {
      issues.push({
        severity: ValidationSeverity.WARNING,
        message: `Single point of failure: ${role}`,
        context: `Only one ${role} with significant hours (${members[0].hoursPerSprint}h)`,
        suggestion: "Consider cross-training or backup coverage",
        ruleId: "SPRINT-080",
      });
    }
  });

  // Check specialization coverage
  const allSpecializations = new Set(team.flatMap((m) => m.specializations));
  const specializedMembers = team.filter((m) => m.specializations.length > 0);

  if (specializedMembers.length / team.length < 0.5) {
    issues.push({
      severity: ValidationSeverity.INFO,
      message: "Few team members have defined specializations",
      context: "Specializations help with optimal task allocation",
      suggestion: "Define specializations for better sprint planning",
      ruleId: "SPRINT-081",
    });
  }

  // Check for critical specializations
  const criticalSpecs = ["backend", "frontend", "database", "testing", "security", "devops"];
  const missingSpecs = criticalSpecs.filter(
    (spec) => ![...allSpecializations].some((s) => s.toLowerCase().includes(spec))
  );

  if (missingSpecs.length > 2) {
    issues.push({
      severity: ValidationSeverity.INFO,
      message: `Missing common specializations: ${missingSpecs.join(", ")}`,
      context: "Common specializations help identify skills gaps",
      suggestion: "Consider if team has needed skills for sprint work",
      ruleId: "SPRINT-082",
    });
  }
}

function calculateCommitmentScore(capacity: SprintCapacity, issues: ValidationIssue[]): number {
  // Base score from capacity structure (2 points max)
  const hasValidTeam = capacity.team.length > 0;
  const hasValidCalculations = capacity.totalGrossHours > 0 && capacity.netCapacityHours > 0;
  const structureScore = (hasValidTeam ? 1 : 0) + (hasValidCalculations ? 1 : 0);

  // Buffer health score (1 point max)
  const bufferInRange = capacity.bufferPercentage >= 15 && capacity.bufferPercentage <= 25;
  const bufferScore = bufferInRange
    ? 1
    : Math.max(0, 1 - Math.abs(capacity.bufferPercentage - 20) / 20);

  // Commitment health score (1 point max)
  const commitmentInRange =
    capacity.commitmentPercentage >= 60 && capacity.commitmentPercentage <= 90;
  const commitmentScore = commitmentInRange
    ? 1
    : Math.max(0, 1 - Math.abs(capacity.commitmentPercentage - 75) / 75);

  // Team composition score (1 point max)
  const teamSize = capacity.team.length;
  const teamSizeScore =
    teamSize >= 3 && teamSize <= 9 ? 1 : Math.max(0, 1 - Math.abs(teamSize - 6) / 6);

  // Penalty for issues
  const errorPenalty = issues.filter((i) => i.severity === ValidationSeverity.ERROR).length * 0.3;
  const warningPenalty =
    issues.filter((i) => i.severity === ValidationSeverity.WARNING).length * 0.1;

  const finalScore =
    structureScore + bufferScore + commitmentScore + teamSizeScore - errorPenalty - warningPenalty;

  return Math.max(0, Math.min(5, finalScore));
}

function createFailureResult(issues: ValidationIssue[]): ValidationResult {
  return {
    success: false,
    score: 0,
    issues,
    metadata: {
      validator: "validate-sprint-commitment",
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * CLI entry point for script execution
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const capacityPath = process.argv[2];
  const velocityPath = process.argv[3];

  if (!capacityPath) {
    console.error("Usage: tsx validate-sprint-commitment.ts <capacity-file> [velocity-file]");
    process.exit(1);
  }

  validateSprintCommitment(capacityPath, velocityPath)
    .then((result) => {
      console.log(`\n📊 Sprint Commitment Validation Results`);
      console.log(`Success: ${result.success ? "✅" : "❌"}`);
      console.log(`Score: ${result.score.toFixed(1)}/5.0\n`);

      if (result.issues.length > 0) {
        result.issues.forEach((issue) => {
          const icon =
            issue.severity === "error" ? "❌" : issue.severity === "warning" ? "⚠️" : "ℹ️";
          console.log(`${icon} ${issue.message}`);
          if (issue.context) console.log(`   Context: ${issue.context}`);
          if (issue.suggestion) console.log(`   💡 ${issue.suggestion}`);
          console.log("");
        });
      }

      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error("❌ Validation failed:", error);
      process.exit(1);
    });
}
