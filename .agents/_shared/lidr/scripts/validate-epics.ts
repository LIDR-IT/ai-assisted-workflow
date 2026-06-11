#!/usr/bin/env tsx

/**
 * Epic Breakdown Validation Script
 * Validates epic decomposition quality for Phase 3→4 transition
 * Critical for Sprint Planning success
 */

import {
  ValidationResult,
  ValidationIssue,
  ValidationSeverity,
} from "../../../_shared/validators/types.js";
import { validateAcceptanceCriteria } from "../../../_shared/validators/validate-acceptance-criteria.js";
import { validateBDDPatterns } from "../../../_shared/validators/validate-bdd-patterns.js";
import * as fs from "fs";
import * as path from "path";

interface EpicBreakdownOptions {
  maxEpicSize: number; // Maximum story points per epic
  minEpicsPerMaster: number; // Minimum sub-epics for master epic
  maxEpicsPerMaster: number; // Maximum sub-epics for master epic
  requireTraceability: boolean; // Require RF traceability
  validateSizing: boolean; // Validate epic sizing estimates
}

interface EpicData {
  id: string;
  title: string;
  description: string;
  size: number;
  dependencies: string[];
  acceptanceCriteria: string[];
  linkedRequirements: string[];
  phase: number;
  priority: "high" | "medium" | "low";
}

interface EpicHierarchy {
  masterEpic: EpicData;
  subEpics: EpicData[];
  totalSize: number;
  dependencyChain: string[];
}

const DEFAULT_OPTIONS: EpicBreakdownOptions = {
  maxEpicSize: 40, // 40 story points max per epic (2 sprints)
  minEpicsPerMaster: 3,
  maxEpicsPerMaster: 8,
  requireTraceability: true,
  validateSizing: true,
};

/**
 * Validates epic breakdown quality and structure
 */
export async function validateEpics(
  epicDataPath: string,
  requirementsPath?: string,
  options: Partial<EpicBreakdownOptions> = {}
): Promise<ValidationResult> {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const issues: ValidationIssue[] = [];

  try {
    // Load epic data
    const epicHierarchy = await loadEpicHierarchy(epicDataPath);

    if (!epicHierarchy) {
      return createFailureResult([
        {
          severity: ValidationSeverity.ERROR,
          message: "No epic hierarchy found",
          context: `Unable to parse epic data from ${epicDataPath}`,
          suggestion: "Ensure epic breakdown file exists and follows expected format",
          ruleId: "EPIC-001",
        },
      ]);
    }

    // Validate master epic
    validateMasterEpic(epicHierarchy.masterEpic, config, issues);

    // Validate sub-epics count
    validateSubEpicCount(epicHierarchy.subEpics, config, issues);

    // Validate individual sub-epics
    for (const [index, subEpic] of epicHierarchy.subEpics.entries()) {
      validateSubEpic(subEpic, index + 1, config, issues);
    }

    // Validate epic sizing
    if (config.validateSizing) {
      validateEpicSizing(epicHierarchy, config, issues);
    }

    // Validate dependency management
    validateDependencies(epicHierarchy, issues);

    // Validate requirements traceability
    if (config.requireTraceability && requirementsPath) {
      await validateRequirementsTraceability(epicHierarchy, requirementsPath, issues);
    }

    // Validate implementability
    validateImplementability(epicHierarchy, issues);

    // Validate acceptance criteria for all epics
    await validateAllAcceptanceCriteria(epicHierarchy, issues);

    const score = calculateEpicScore(epicHierarchy, issues);

    return {
      success: issues.filter((i) => i.severity === ValidationSeverity.ERROR).length === 0,
      score,
      issues,
      metadata: {
        validator: "validate-epics",
        timestamp: new Date().toISOString(),
        fileCount: 1,
      },
    };
  } catch (error) {
    return createFailureResult([
      {
        severity: ValidationSeverity.ERROR,
        message: `Validation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        context: "Unable to complete epic validation",
        suggestion: "Check file format and accessibility",
        ruleId: "EPIC-000",
      },
    ]);
  }
}

async function loadEpicHierarchy(epicDataPath: string): Promise<EpicHierarchy | null> {
  if (!fs.existsSync(epicDataPath)) {
    return null;
  }

  const content = fs.readFileSync(epicDataPath, "utf-8");

  // Try to parse as markdown with structured sections
  if (epicDataPath.endsWith(".md")) {
    return parseMarkdownEpics(content);
  }

  // Try to parse as JSON
  if (epicDataPath.endsWith(".json")) {
    try {
      const data = JSON.parse(content);
      return validateJsonEpicStructure(data) ? data : null;
    } catch {
      return null;
    }
  }

  return null;
}

function parseMarkdownEpics(content: string): EpicHierarchy | null {
  const sections = content.split(/^## /m).filter((section) => section.trim());

  const masterEpic = extractMasterEpic(content);
  const subEpics = extractSubEpics(content);

  if (!masterEpic || subEpics.length === 0) {
    return null;
  }

  const totalSize = subEpics.reduce((sum, epic) => sum + epic.size, 0);
  const dependencyChain = extractDependencyChain(subEpics);

  return {
    masterEpic,
    subEpics,
    totalSize,
    dependencyChain,
  };
}

function extractMasterEpic(content: string): EpicData | null {
  const masterMatch = content.match(/^# (.+)$/m);
  if (!masterMatch) return null;

  const title = masterMatch[1];
  // Language-neutral: accept the configured language's "Description" heading
  // (English default, or any client-language equivalent). Structure, not a
  // single hardcoded language literal.
  const description =
    extractSectionContent(content, "(?:Description|Descripción|Descrição|Beschreibung)") || "";
  const acceptanceCriteria = extractAcceptanceCriteria(content);

  return {
    id: "master",
    title,
    description,
    size: 0, // Master epic size is sum of sub-epics
    dependencies: [],
    acceptanceCriteria,
    linkedRequirements: extractLinkedRequirements(content),
    phase: 3, // Master epic is from Phase 3
    priority: "high",
  };
}

function extractSubEpics(content: string): EpicData[] {
  const subEpics: EpicData[] = [];
  const epicSections = content.split(/^## /m).filter((section) => section.trim());

  for (const section of epicSections) {
    const lines = section.split("\n");
    const titleMatch = lines[0]?.match(/^(.+)/);
    if (!titleMatch) continue;

    const title = titleMatch[1];
    const sectionContent = lines.slice(1).join("\n");

    const epic: EpicData = {
      id: generateEpicId(title),
      title,
      description: extractDescription(sectionContent),
      size: extractSize(sectionContent),
      dependencies: extractDependencies(sectionContent),
      acceptanceCriteria: extractAcceptanceCriteria(sectionContent),
      linkedRequirements: extractLinkedRequirements(sectionContent),
      phase: extractPhase(sectionContent),
      priority: extractPriority(sectionContent),
    };

    subEpics.push(epic);
  }

  return subEpics;
}

function extractSectionContent(content: string, sectionTitle: string): string | null {
  const regex = new RegExp(`^#{2,3}\\s*${sectionTitle}[\\s\\S]*?(?=^#{2,3}|$)`, "m");
  const match = content.match(regex);
  return match ? match[0].replace(/^#{2,3}.*\n/, "").trim() : null;
}

function extractAcceptanceCriteria(content: string): string[] {
  const criteria: string[] = [];
  // Language-neutral heading match: English default + client-language equivalents.
  const criteriaMatch = content.match(
    /###\s*(?:Acceptance Criteria|Criterios de Aceptación|Critérios de Aceitação|Critères d'acceptation|Akzeptanzkriterien)([\s\S]*?)(?=###|$)/i
  );

  if (criteriaMatch) {
    const lines = criteriaMatch[1].split("\n");
    for (const line of lines) {
      const criterion = line.match(/^[-*+]\s+(.+)$/);
      if (criterion) {
        criteria.push(criterion[1]);
      }
    }
  }

  return criteria;
}

function extractLinkedRequirements(content: string): string[] {
  const requirements: string[] = [];
  const rfMatches = content.match(/RF-\d+/g);
  if (rfMatches) {
    requirements.push(...rfMatches);
  }
  return [...new Set(requirements)]; // Remove duplicates
}

function extractSize(content: string): number {
  // Language-neutral label match: English "Size" default + client-language equivalents.
  const sizeMatch =
    content.match(/(?:Size|Tamaño|Tamanho|Taille|Größe):\s*(\d+)/i) ||
    content.match(/(\d+)\s*story points/i);
  return sizeMatch ? parseInt(sizeMatch[1]) : 0;
}

function extractDependencies(content: string): string[] {
  const deps: string[] = [];
  // Language-neutral label match: English "Dependencies" default + equivalents.
  const depsMatch = content.match(
    /(?:Dependencies|Dependencias|Dependências|Dépendances|Abhängigkeiten):\s*(.+)/i
  );
  if (depsMatch) {
    deps.push(...depsMatch[1].split(",").map((d) => d.trim()));
  }
  return deps;
}

function extractDescription(content: string): string {
  const lines = content.split("\n").filter((line) => line.trim());
  const firstParagraph = lines.find((line) => !line.startsWith("#") && !line.match(/^\w+:/));
  return firstParagraph || "";
}

function extractPhase(content: string): number {
  // Language-neutral label match: English "Phase" default + equivalents.
  const phaseMatch = content.match(/(?:Phase|Fase|Phase|Phase):\s*(\d+)/i);
  return phaseMatch ? parseInt(phaseMatch[1]) : 4; // Default to Phase 4 (Sprint Planning)
}

function extractPriority(content: string): "high" | "medium" | "low" {
  // Language-neutral label + value match: English default + client-language equivalents.
  const priorityMatch = content.match(
    /(?:Priority|Prioridad|Prioridade|Priorité|Priorität):\s*(alta|media|baja|alto|baixo|haute|basse|hoch|niedrig|high|medium|low)/i
  );
  if (!priorityMatch) return "medium";

  const priority = priorityMatch[1].toLowerCase();
  if (["alta", "alto", "haute", "hoch", "high"].includes(priority)) return "high";
  if (["baja", "baixo", "basse", "niedrig", "low"].includes(priority)) return "low";
  return "medium";
}

function generateEpicId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 30);
}

function extractDependencyChain(subEpics: EpicData[]): string[] {
  const chain: string[] = [];
  const visited = new Set<string>();

  function buildChain(epic: EpicData) {
    if (visited.has(epic.id)) return;
    visited.add(epic.id);

    for (const depId of epic.dependencies) {
      const dep = subEpics.find((e) => e.id === depId);
      if (dep) {
        buildChain(dep);
      }
    }
    chain.push(epic.id);
  }

  for (const epic of subEpics) {
    if (!visited.has(epic.id)) {
      buildChain(epic);
    }
  }

  return chain;
}

function validateJsonEpicStructure(data: any): boolean {
  return (
    data &&
    data.masterEpic &&
    Array.isArray(data.subEpics) &&
    typeof data.totalSize === "number" &&
    Array.isArray(data.dependencyChain)
  );
}

function validateMasterEpic(
  masterEpic: EpicData,
  config: EpicBreakdownOptions,
  issues: ValidationIssue[]
): void {
  if (!masterEpic.title || masterEpic.title.length < 5) {
    issues.push({
      severity: ValidationSeverity.ERROR,
      message: "Master epic title is too short or missing",
      context: `Title: "${masterEpic.title}"`,
      suggestion: "Provide a descriptive title (at least 5 characters)",
      ruleId: "EPIC-002",
    });
  }

  if (!masterEpic.description || masterEpic.description.length < 20) {
    issues.push({
      severity: ValidationSeverity.ERROR,
      message: "Master epic description is insufficient",
      context: "Master epic should clearly describe the overall goal",
      suggestion: "Add detailed description explaining the epic's purpose and value",
      ruleId: "EPIC-003",
    });
  }

  if (masterEpic.linkedRequirements.length === 0 && config.requireTraceability) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: "Master epic has no linked requirements",
      context: "Epic should trace back to functional requirements (RFs)",
      suggestion: "Add RF-XXX references to show requirement traceability",
      ruleId: "EPIC-004",
    });
  }
}

function validateSubEpicCount(
  subEpics: EpicData[],
  config: EpicBreakdownOptions,
  issues: ValidationIssue[]
): void {
  if (subEpics.length < config.minEpicsPerMaster) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: `Too few sub-epics (${subEpics.length} < ${config.minEpicsPerMaster})`,
      context: "Complex features usually require multiple implementation phases",
      suggestion: "Consider if the master epic can be broken down further",
      ruleId: "EPIC-005",
    });
  }

  if (subEpics.length > config.maxEpicsPerMaster) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: `Too many sub-epics (${subEpics.length} > ${config.maxEpicsPerMaster})`,
      context: "Too many epics can be difficult to manage",
      suggestion: "Consider grouping related epics or creating multiple master epics",
      ruleId: "EPIC-006",
    });
  }
}

function validateSubEpic(
  epic: EpicData,
  index: number,
  config: EpicBreakdownOptions,
  issues: ValidationIssue[]
): void {
  const epicContext = `Sub-epic ${index}: "${epic.title}"`;

  if (!epic.title || epic.title.length < 5) {
    issues.push({
      severity: ValidationSeverity.ERROR,
      message: "Sub-epic title too short",
      context: epicContext,
      suggestion: "Provide descriptive title indicating the epic's deliverable",
      ruleId: "EPIC-007",
    });
  }

  if (!epic.description || epic.description.length < 15) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: "Sub-epic description insufficient",
      context: epicContext,
      suggestion: "Add description explaining what will be delivered",
      ruleId: "EPIC-008",
    });
  }

  if (epic.size === 0) {
    issues.push({
      severity: ValidationSeverity.ERROR,
      message: "Sub-epic has no size estimate",
      context: epicContext,
      suggestion: "Add story point estimate for planning purposes",
      ruleId: "EPIC-009",
    });
  } else if (epic.size > config.maxEpicSize) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: `Sub-epic too large (${epic.size} > ${config.maxEpicSize} points)`,
      context: epicContext,
      suggestion: "Consider breaking down into smaller epics",
      ruleId: "EPIC-010",
    });
  }

  if (epic.acceptanceCriteria.length === 0) {
    issues.push({
      severity: ValidationSeverity.ERROR,
      message: "Sub-epic missing acceptance criteria",
      context: epicContext,
      suggestion: "Add clear acceptance criteria for epic completion",
      ruleId: "EPIC-011",
    });
  }
}

function validateEpicSizing(
  hierarchy: EpicHierarchy,
  config: EpicBreakdownOptions,
  issues: ValidationIssue[]
): void {
  const totalSize = hierarchy.totalSize;
  const subEpicCount = hierarchy.subEpics.length;

  if (totalSize === 0) {
    issues.push({
      severity: ValidationSeverity.ERROR,
      message: "No sizing provided for any sub-epic",
      context: "Epic sizing is essential for sprint planning",
      suggestion: "Add story point estimates to all sub-epics",
      ruleId: "EPIC-020",
    });
    return;
  }

  const averageSize = totalSize / subEpicCount;
  if (averageSize < 5) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: `Average epic size very small (${averageSize.toFixed(1)} points)`,
      context: "Epics might be too granular",
      suggestion: "Consider combining related functionality into larger epics",
      ruleId: "EPIC-021",
    });
  }

  if (averageSize > 30) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: `Average epic size very large (${averageSize.toFixed(1)} points)`,
      context: "Epics might be too complex",
      suggestion: "Consider breaking down into smaller, more manageable epics",
      ruleId: "EPIC-022",
    });
  }

  // Check size distribution
  const sizeVariance = calculateSizeVariance(hierarchy.subEpics);
  if (sizeVariance > 400) {
    // High variance in sizes
    issues.push({
      severity: ValidationSeverity.INFO,
      message: "High variance in epic sizes",
      context: "Some epics are much larger/smaller than others",
      suggestion: "Consider re-balancing epic scope for more predictable delivery",
      ruleId: "EPIC-023",
    });
  }
}

function calculateSizeVariance(epics: EpicData[]): number {
  if (epics.length === 0) return 0;

  const sizes = epics.map((e) => e.size);
  const mean = sizes.reduce((sum, size) => sum + size, 0) / sizes.length;
  const squaredDiffs = sizes.map((size) => Math.pow(size - mean, 2));
  return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / sizes.length;
}

function validateDependencies(hierarchy: EpicHierarchy, issues: ValidationIssue[]): void {
  const epicIds = new Set(hierarchy.subEpics.map((e) => e.id));

  for (const epic of hierarchy.subEpics) {
    for (const depId of epic.dependencies) {
      if (!epicIds.has(depId)) {
        issues.push({
          severity: ValidationSeverity.WARNING,
          message: `Unknown dependency: ${depId}`,
          context: `Sub-epic "${epic.title}" depends on non-existent epic`,
          suggestion: "Remove invalid dependency or add missing epic",
          ruleId: "EPIC-030",
        });
      }
    }
  }

  // Check for circular dependencies
  const cycles = findCircularDependencies(hierarchy.subEpics);
  if (cycles.length > 0) {
    issues.push({
      severity: ValidationSeverity.ERROR,
      message: `Circular dependencies detected: ${cycles.join(" -> ")}`,
      context: "Circular dependencies prevent proper sequencing",
      suggestion: "Remove or restructure dependencies to eliminate cycles",
      ruleId: "EPIC-031",
    });
  }

  // Check dependency chain length
  const maxChainLength = findLongestDependencyChain(hierarchy.subEpics);
  if (maxChainLength > 5) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: `Very long dependency chain (${maxChainLength} levels)`,
      context: "Long chains can delay delivery if early epics are blocked",
      suggestion: "Consider parallel implementation paths where possible",
      ruleId: "EPIC-032",
    });
  }
}

function findCircularDependencies(epics: EpicData[]): string[] {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const epicMap = new Map(epics.map((e) => [e.id, e]));

  function hasCycle(epicId: string, path: string[]): string[] | null {
    if (recursionStack.has(epicId)) {
      const cycleStart = path.indexOf(epicId);
      return path.slice(cycleStart).concat(epicId);
    }

    if (visited.has(epicId)) {
      return null;
    }

    visited.add(epicId);
    recursionStack.add(epicId);

    const epic = epicMap.get(epicId);
    if (epic) {
      for (const depId of epic.dependencies) {
        const cycle = hasCycle(depId, [...path, epicId]);
        if (cycle) {
          return cycle;
        }
      }
    }

    recursionStack.delete(epicId);
    return null;
  }

  for (const epic of epics) {
    if (!visited.has(epic.id)) {
      const cycle = hasCycle(epic.id, []);
      if (cycle) {
        return cycle;
      }
    }
  }

  return [];
}

function findLongestDependencyChain(epics: EpicData[]): number {
  const epicMap = new Map(epics.map((e) => [e.id, e]));
  const memoized = new Map<string, number>();

  function getChainLength(epicId: string): number {
    if (memoized.has(epicId)) {
      return memoized.get(epicId)!;
    }

    const epic = epicMap.get(epicId);
    if (!epic || epic.dependencies.length === 0) {
      memoized.set(epicId, 1);
      return 1;
    }

    let maxDepth = 0;
    for (const depId of epic.dependencies) {
      maxDepth = Math.max(maxDepth, getChainLength(depId));
    }

    const chainLength = maxDepth + 1;
    memoized.set(epicId, chainLength);
    return chainLength;
  }

  let maxChainLength = 0;
  for (const epic of epics) {
    maxChainLength = Math.max(maxChainLength, getChainLength(epic.id));
  }

  return maxChainLength;
}

async function validateRequirementsTraceability(
  hierarchy: EpicHierarchy,
  requirementsPath: string,
  issues: ValidationIssue[]
): Promise<void> {
  if (!fs.existsSync(requirementsPath)) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: "Requirements file not found for traceability validation",
      context: `Path: ${requirementsPath}`,
      suggestion: "Provide requirements file or disable traceability validation",
      ruleId: "EPIC-040",
    });
    return;
  }

  const requirementsContent = fs.readFileSync(requirementsPath, "utf-8");
  const availableRFs = extractRequirementIds(requirementsContent);

  // Check master epic traceability
  for (const rfId of hierarchy.masterEpic.linkedRequirements) {
    if (!availableRFs.has(rfId)) {
      issues.push({
        severity: ValidationSeverity.WARNING,
        message: `Master epic references unknown requirement: ${rfId}`,
        context: "Requirement not found in requirements document",
        suggestion: "Verify requirement ID or update requirements document",
        ruleId: "EPIC-041",
      });
    }
  }

  // Check sub-epic traceability
  for (const epic of hierarchy.subEpics) {
    if (epic.linkedRequirements.length === 0) {
      issues.push({
        severity: ValidationSeverity.INFO,
        message: `Sub-epic "${epic.title}" has no requirement traceability`,
        context: "Consider linking to specific functional requirements",
        suggestion: "Add RF-XXX references to establish traceability",
        ruleId: "EPIC-042",
      });
    }

    for (const rfId of epic.linkedRequirements) {
      if (!availableRFs.has(rfId)) {
        issues.push({
          severity: ValidationSeverity.WARNING,
          message: `Sub-epic references unknown requirement: ${rfId}`,
          context: `Epic: "${epic.title}"`,
          suggestion: "Verify requirement ID or update requirements document",
          ruleId: "EPIC-043",
        });
      }
    }
  }

  // Check coverage: are all requirements covered by epics?
  const coveredRequirements = new Set([
    ...hierarchy.masterEpic.linkedRequirements,
    ...hierarchy.subEpics.flatMap((e) => e.linkedRequirements),
  ]);

  const uncoveredRequirements = [...availableRFs].filter((rf) => !coveredRequirements.has(rf));
  if (uncoveredRequirements.length > 0) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: `Requirements not covered by epics: ${uncoveredRequirements.slice(0, 5).join(", ")}${uncoveredRequirements.length > 5 ? "..." : ""}`,
      context: `${uncoveredRequirements.length} requirements have no epic implementation`,
      suggestion: "Add epics to cover missing requirements or verify requirements are still needed",
      ruleId: "EPIC-044",
    });
  }
}

function extractRequirementIds(requirementsContent: string): Set<string> {
  const rfMatches = requirementsContent.match(/RF-\d+/g) || [];
  return new Set(rfMatches);
}

function validateImplementability(hierarchy: EpicHierarchy, issues: ValidationIssue[]): void {
  // Check if epics are implementable within reasonable sprint cycles
  const totalSize = hierarchy.totalSize;
  const sprintCapacity = 40; // Typical sprint capacity
  const estimatedSprints = Math.ceil(totalSize / sprintCapacity);

  if (estimatedSprints > 6) {
    // More than 3 months
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: `Epic hierarchy requires ${estimatedSprints} sprints (${totalSize} points)`,
      context: "Very large epic may be difficult to manage",
      suggestion: "Consider breaking into multiple releases or master epics",
      ruleId: "EPIC-050",
    });
  }

  // Check for epics without clear deliverables
  for (const epic of hierarchy.subEpics) {
    const hasDeliverable = epic.description.match(
      /\b(deliver|implement|create|build|develop|add|enable)\b/i
    );
    if (!hasDeliverable) {
      issues.push({
        severity: ValidationSeverity.INFO,
        message: `Epic "${epic.title}" description doesn't clearly state deliverable`,
        context: "Epic should clearly describe what will be implemented",
        suggestion: "Use action verbs to describe what will be delivered",
        ruleId: "EPIC-051",
      });
    }
  }
}

async function validateAllAcceptanceCriteria(
  hierarchy: EpicHierarchy,
  issues: ValidationIssue[]
): Promise<void> {
  // Validate master epic acceptance criteria
  const masterCriteriaContent = hierarchy.masterEpic.acceptanceCriteria.join("\n");
  if (masterCriteriaContent) {
    const masterResult = validateAcceptanceCriteria(masterCriteriaContent, {
      requireSMART: true,
      requireBDD: false,
      minCriteria: 3,
      maxCriteria: 8,
    });

    // Convert to epic-specific issues
    masterResult.issues.forEach((issue) => {
      issues.push({
        ...issue,
        context: `Master Epic: ${issue.context}`,
        ruleId: `EPIC-AC-${issue.ruleId}`,
      });
    });
  }

  // Validate sub-epic acceptance criteria
  for (const [index, epic] of hierarchy.subEpics.entries()) {
    const criteriaContent = epic.acceptanceCriteria.join("\n");
    if (criteriaContent) {
      const result = validateAcceptanceCriteria(criteriaContent, {
        requireSMART: true,
        requireBDD: false,
        minCriteria: 2,
        maxCriteria: 6,
      });

      result.issues.forEach((issue) => {
        issues.push({
          ...issue,
          context: `Sub-epic ${index + 1} "${epic.title}": ${issue.context}`,
          ruleId: `EPIC-AC-${issue.ruleId}`,
        });
      });
    }
  }
}

function calculateEpicScore(hierarchy: EpicHierarchy, issues: ValidationIssue[]): number {
  // Base score from epic structure (2 points max)
  const hasValidMaster = hierarchy.masterEpic.title && hierarchy.masterEpic.description;
  const hasValidSubs =
    hierarchy.subEpics.length >= 3 && hierarchy.subEpics.every((e) => e.title && e.size > 0);
  const structureScore = (hasValidMaster ? 1 : 0) + (hasValidSubs ? 1 : 0);

  // Traceability score (1 point max)
  const totalEpics = hierarchy.subEpics.length + 1; // +1 for master
  const epicsWithTraceability =
    hierarchy.subEpics.filter((e) => e.linkedRequirements.length > 0).length +
    (hierarchy.masterEpic.linkedRequirements.length > 0 ? 1 : 0);
  const traceabilityScore = epicsWithTraceability / totalEpics;

  // Sizing quality score (1 point max)
  const epicsWithSize = hierarchy.subEpics.filter((e) => e.size > 0).length;
  const sizingScore = epicsWithSize / hierarchy.subEpics.length;

  // Acceptance criteria score (1 point max)
  const epicsWithCriteria =
    hierarchy.subEpics.filter((e) => e.acceptanceCriteria.length > 0).length +
    (hierarchy.masterEpic.acceptanceCriteria.length > 0 ? 1 : 0);
  const criteriaScore = epicsWithCriteria / totalEpics;

  // Penalty for issues
  const errorPenalty = issues.filter((i) => i.severity === ValidationSeverity.ERROR).length * 0.3;
  const warningPenalty =
    issues.filter((i) => i.severity === ValidationSeverity.WARNING).length * 0.1;

  const finalScore =
    structureScore +
    traceabilityScore +
    sizingScore +
    criteriaScore -
    errorPenalty -
    warningPenalty;

  return Math.max(0, Math.min(5, finalScore));
}

function createFailureResult(issues: ValidationIssue[]): ValidationResult {
  return {
    success: false,
    score: 0,
    issues,
    metadata: {
      validator: "validate-epics",
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * CLI entry point for script execution
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const epicPath = process.argv[2];
  const requirementsPath = process.argv[3];

  if (!epicPath) {
    console.error("Usage: tsx validate-epics.ts <epic-file> [requirements-file]");
    process.exit(1);
  }

  validateEpics(epicPath, requirementsPath)
    .then((result) => {
      console.log(`\n🎯 Epic Breakdown Validation Results`);
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
