#!/usr/bin/env tsx

/**
 * User Stories Validation Script
 * Validates BDD format, INVEST criteria, and traceability for automated user story generation
 * Critical for Phase 4 Sprint Planning success
 */

import {
  ValidationResult,
  ValidationIssue,
  ValidationSeverity,
} from "../../../_shared/validators/types.js";
import { validateBDDPatterns } from "../../../_shared/validators/validate-bdd-patterns.js";
import { validateAcceptanceCriteria } from "../../../_shared/validators/validate-acceptance-criteria.js";
import * as fs from "fs";
import * as path from "path";

interface UserStoryOptions {
  requireINVEST: boolean; // Validate INVEST criteria
  requireBDD: boolean; // Require Given/When/Then format
  maxStorySize: number; // Maximum story points per story
  minStoriesPerEpic: number; // Minimum stories per epic
  validateTraceability: boolean; // Check RF traceability
  checkSlicingPatterns: boolean; // Validate slicing patterns used
}

interface UserStory {
  id: string;
  title: string;
  description: string;
  actorActionValue: {
    actor: string;
    action: string;
    value: string;
  };
  acceptanceCriteria: string[];
  size: number;
  priority: "high" | "medium" | "low";
  epic: string;
  linkedRequirements: string[];
  tags: string[];
  slicingPattern?: string; // Which pattern was used to create this story
}

interface INVESTCriteria {
  independent: boolean;
  negotiable: boolean;
  valuable: boolean;
  estimable: boolean;
  small: boolean;
  testable: boolean;
}

interface SlicingPattern {
  name: string;
  description: string;
  indicators: string[];
}

const DEFAULT_OPTIONS: UserStoryOptions = {
  requireINVEST: true,
  requireBDD: true,
  maxStorySize: 13, // Fibonacci: max 13 points per story
  minStoriesPerEpic: 3,
  validateTraceability: true,
  checkSlicingPatterns: true,
};

const SLICING_PATTERNS: SlicingPattern[] = [
  {
    name: "workflow-steps",
    description: "Stories broken by workflow steps",
    indicators: ["step", "phase", "process", "workflow"],
  },
  {
    name: "crud-operations",
    description: "Stories by CRUD operations",
    indicators: ["create", "read", "update", "delete", "list", "search"],
  },
  {
    name: "data-variations",
    description: "Stories by data types or variations",
    indicators: ["type", "format", "variation", "different"],
  },
  {
    name: "user-roles",
    description: "Stories by user roles or personas",
    indicators: ["admin", "user", "guest", "manager", "role"],
  },
  {
    name: "input-methods",
    description: "Stories by input methods or interfaces",
    indicators: ["ui", "api", "mobile", "web", "interface"],
  },
  {
    name: "business-rules",
    description: "Stories by business rules or constraints",
    indicators: ["rule", "constraint", "validation", "policy"],
  },
  {
    name: "happy-sad-paths",
    description: "Stories by scenario types",
    indicators: ["happy", "error", "exception", "failure", "success"],
  },
  {
    name: "acceptance-criteria",
    description: "Stories by acceptance criteria",
    indicators: ["criteria", "condition", "requirement", "acceptance"],
  },
];

/**
 * Validates user stories for quality, format, and INVEST compliance
 */
export async function validateUserStories(
  storiesPath: string,
  epicPath?: string,
  requirementsPath?: string,
  options: Partial<UserStoryOptions> = {}
): Promise<ValidationResult> {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const issues: ValidationIssue[] = [];

  try {
    // Load user stories
    const stories = await loadUserStories(storiesPath);

    if (stories.length === 0) {
      return createFailureResult([
        {
          severity: ValidationSeverity.ERROR,
          message: "No user stories found",
          context: `Unable to parse stories from ${storiesPath}`,
          suggestion: "Ensure user stories file exists and follows expected format",
          ruleId: "STORY-001",
        },
      ]);
    }

    // Validate story count and distribution
    validateStoryDistribution(stories, config, issues);

    // Validate individual stories
    for (const [index, story] of stories.entries()) {
      await validateSingleStory(story, index + 1, config, issues);
    }

    // Validate INVEST criteria across all stories
    if (config.requireINVEST) {
      validateINVESTCompliance(stories, issues);
    }

    // Validate BDD patterns in acceptance criteria
    if (config.requireBDD) {
      await validateBDDCompliance(stories, issues);
    }

    // Validate epic traceability
    if (epicPath) {
      await validateEpicTraceability(stories, epicPath, issues);
    }

    // Validate requirements traceability
    if (config.validateTraceability && requirementsPath) {
      await validateRequirementsTraceability(stories, requirementsPath, issues);
    }

    // Validate slicing patterns
    if (config.checkSlicingPatterns) {
      validateSlicingPatterns(stories, issues);
    }

    // Validate story independence and dependencies
    validateStoryIndependence(stories, issues);

    const score = calculateStoryScore(stories, issues);

    return {
      success: issues.filter((i) => i.severity === ValidationSeverity.ERROR).length === 0,
      score,
      issues,
      metadata: {
        validator: "validate-user-stories",
        timestamp: new Date().toISOString(),
        fileCount: 1,
      },
    };
  } catch (error) {
    return createFailureResult([
      {
        severity: ValidationSeverity.ERROR,
        message: `Validation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        context: "Unable to complete user story validation",
        suggestion: "Check file format and accessibility",
        ruleId: "STORY-000",
      },
    ]);
  }
}

async function loadUserStories(storiesPath: string): Promise<UserStory[]> {
  if (!fs.existsSync(storiesPath)) {
    return [];
  }

  const content = fs.readFileSync(storiesPath, "utf-8");

  // Try to parse as markdown with structured sections
  if (storiesPath.endsWith(".md")) {
    return parseMarkdownStories(content);
  }

  // Try to parse as JSON
  if (storiesPath.endsWith(".json")) {
    try {
      const data = JSON.parse(content);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  return [];
}

function parseMarkdownStories(content: string): UserStory[] {
  const stories: UserStory[] = [];

  // Split by story headers (e.g., "## Historia de Usuario 1:" or "## US-001:")
  const storyBlocks = content.split(/^## (?:Historia de Usuario|User Story|US-).*$/gm);

  // Remove first empty block
  storyBlocks.shift();

  for (const block of storyBlocks) {
    const story = parseStoryBlock(block.trim());
    if (story) {
      stories.push(story);
    }
  }

  return stories;
}

function parseStoryBlock(block: string): UserStory | null {
  const lines = block.split("\n");

  // Extract title (first non-empty line)
  const titleLine = lines.find((line) => line.trim() && !line.startsWith("#"));
  if (!titleLine) return null;

  // Parse Actor/Action/Value format
  const aavMatch = titleLine.match(
    /^(?:Como|As a?)\s+(.+?),?\s+(?:quiero|want|need)\s+(.+?)\s+(?:para|so that|in order to)\s+(.+)$/i
  );

  let actorActionValue = {
    actor: "",
    action: "",
    value: "",
  };

  let title = titleLine;

  if (aavMatch) {
    actorActionValue = {
      actor: aavMatch[1].trim(),
      action: aavMatch[2].trim(),
      value: aavMatch[3].trim(),
    };
    title = `${actorActionValue.actor} - ${actorActionValue.action}`;
  }

  // Extract other fields
  const id = generateStoryId(title);
  const description = extractDescription(block);
  const acceptanceCriteria = extractAcceptanceCriteria(block);
  const size = extractSize(block);
  const priority = extractPriority(block);
  const epic = extractEpic(block);
  const linkedRequirements = extractLinkedRequirements(block);
  const tags = extractTags(block);
  const slicingPattern = extractSlicingPattern(block);

  return {
    id,
    title,
    description,
    actorActionValue,
    acceptanceCriteria,
    size,
    priority,
    epic,
    linkedRequirements,
    tags,
    slicingPattern,
  };
}

function extractDescription(content: string): string {
  const descMatch = content.match(/### Descripción[:\s]*\n([\s\S]*?)(?=###|$)/i);
  return descMatch ? descMatch[1].trim() : "";
}

function extractAcceptanceCriteria(content: string): string[] {
  const criteria: string[] = [];
  const criteriaMatch = content.match(
    /### (?:Criterios de Aceptación|Acceptance Criteria)[:\s]*\n([\s\S]*?)(?=###|$)/i
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

function extractSize(content: string): number {
  const sizeMatch = content.match(/(?:Tamaño|Size|Points?):\s*(\d+)/i);
  return sizeMatch ? parseInt(sizeMatch[1]) : 0;
}

function extractPriority(content: string): "high" | "medium" | "low" {
  const priorityMatch = content.match(
    /(?:Prioridad|Priority):\s*(alta|alta|media|medium|baja|low)/i
  );
  if (!priorityMatch) return "medium";

  const priority = priorityMatch[1].toLowerCase();
  if (priority === "alta" || priority === "high") return "high";
  if (priority === "baja" || priority === "low") return "low";
  return "medium";
}

function extractEpic(content: string): string {
  const epicMatch = content.match(/(?:Epic|Épica):\s*(.+)/i);
  return epicMatch ? epicMatch[1].trim() : "";
}

function extractLinkedRequirements(content: string): string[] {
  const requirements: string[] = [];
  const rfMatches = content.match(/RF-\d+/g);
  if (rfMatches) {
    requirements.push(...rfMatches);
  }
  return [...new Set(requirements)]; // Remove duplicates
}

function extractTags(content: string): string[] {
  const tagMatch = content.match(/(?:Tags|Etiquetas):\s*(.+)/i);
  if (!tagMatch) return [];

  return tagMatch[1].split(",").map((tag) => tag.trim());
}

function extractSlicingPattern(content: string): string | undefined {
  const patternMatch = content.match(/(?:Slicing Pattern|Patrón):\s*(.+)/i);
  return patternMatch ? patternMatch[1].trim() : undefined;
}

function generateStoryId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 30);
}

function validateStoryDistribution(
  stories: UserStory[],
  config: UserStoryOptions,
  issues: ValidationIssue[]
): void {
  if (stories.length === 0) {
    return;
  }

  // Group by epic
  const epicGroups = new Map<string, UserStory[]>();
  stories.forEach((story) => {
    const epic = story.epic || "no-epic";
    if (!epicGroups.has(epic)) {
      epicGroups.set(epic, []);
    }
    epicGroups.get(epic)!.push(story);
  });

  // Check epic distribution
  epicGroups.forEach((epicStories, epicName) => {
    if (epicName !== "no-epic" && epicStories.length < config.minStoriesPerEpic) {
      issues.push({
        severity: ValidationSeverity.WARNING,
        message: `Too few stories for epic "${epicName}" (${epicStories.length} < ${config.minStoriesPerEpic})`,
        context: "Epics should typically have multiple stories",
        suggestion: "Consider if epic needs more stories or can be combined with others",
        ruleId: "STORY-002",
      });
    }
  });

  // Check for stories without epic
  const orphanStories = epicGroups.get("no-epic") || [];
  if (orphanStories.length > 0) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: `${orphanStories.length} stories not assigned to any epic`,
      context: "Stories should be linked to epics for better planning",
      suggestion: "Assign stories to appropriate epics",
      ruleId: "STORY-003",
    });
  }

  // Check size distribution
  const sizes = stories.map((s) => s.size).filter((s) => s > 0);
  if (sizes.length > 0) {
    const avgSize = sizes.reduce((a, b) => a + b, 0) / sizes.length;

    if (avgSize > 8) {
      issues.push({
        severity: ValidationSeverity.WARNING,
        message: `Average story size very large (${avgSize.toFixed(1)} points)`,
        context: "Large stories are harder to estimate and complete",
        suggestion: "Consider breaking down large stories further",
        ruleId: "STORY-004",
      });
    }

    if (avgSize < 2) {
      issues.push({
        severity: ValidationSeverity.INFO,
        message: `Average story size very small (${avgSize.toFixed(1)} points)`,
        context: "Very small stories might indicate over-slicing",
        suggestion: "Consider if some stories can be combined",
        ruleId: "STORY-005",
      });
    }
  }
}

async function validateSingleStory(
  story: UserStory,
  index: number,
  config: UserStoryOptions,
  issues: ValidationIssue[]
): Promise<void> {
  const storyContext = `Story ${index}: "${story.title}"`;

  // Validate title
  if (!story.title || story.title.length < 5) {
    issues.push({
      severity: ValidationSeverity.ERROR,
      message: "Story title too short",
      context: storyContext,
      suggestion: "Provide descriptive title indicating story purpose",
      ruleId: "STORY-010",
    });
  }

  // Validate Actor/Action/Value format
  validateAAVFormat(story, storyContext, issues);

  // Validate size
  if (story.size === 0) {
    issues.push({
      severity: ValidationSeverity.ERROR,
      message: "Story has no size estimate",
      context: storyContext,
      suggestion: "Add story point estimate (1, 2, 3, 5, 8, 13)",
      ruleId: "STORY-011",
    });
  } else if (story.size > config.maxStorySize) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: `Story too large (${story.size} > ${config.maxStorySize} points)`,
      context: storyContext,
      suggestion: "Break down into smaller stories",
      ruleId: "STORY-012",
    });
  }

  // Validate acceptance criteria
  if (story.acceptanceCriteria.length === 0) {
    issues.push({
      severity: ValidationSeverity.ERROR,
      message: "Story missing acceptance criteria",
      context: storyContext,
      suggestion: "Add clear, testable acceptance criteria",
      ruleId: "STORY-013",
    });
  } else if (story.acceptanceCriteria.length > 8) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: `Too many acceptance criteria (${story.acceptanceCriteria.length})`,
      context: storyContext,
      suggestion: "Consider if story is too complex and should be split",
      ruleId: "STORY-014",
    });
  }

  // Validate description
  if (story.description && story.description.length > 0) {
    if (story.description.length < 20) {
      issues.push({
        severity: ValidationSeverity.INFO,
        message: "Story description is very brief",
        context: storyContext,
        suggestion: "Add more context to help developers understand the story",
        ruleId: "STORY-015",
      });
    }
  }
}

function validateAAVFormat(story: UserStory, context: string, issues: ValidationIssue[]): void {
  const { actor, action, value } = story.actorActionValue;

  if (!actor || actor.length < 2) {
    issues.push({
      severity: ValidationSeverity.ERROR,
      message: "Missing or invalid actor in story format",
      context: `${context} - Actor: "${actor}"`,
      suggestion: 'Use format: "As a [actor], I want [action] so that [value]"',
      ruleId: "STORY-020",
    });
  }

  if (!action || action.length < 3) {
    issues.push({
      severity: ValidationSeverity.ERROR,
      message: "Missing or invalid action in story format",
      context: `${context} - Action: "${action}"`,
      suggestion: "Clearly describe what the user wants to do",
      ruleId: "STORY-021",
    });
  }

  if (!value || value.length < 3) {
    issues.push({
      severity: ValidationSeverity.ERROR,
      message: "Missing or invalid value in story format",
      context: `${context} - Value: "${value}"`,
      suggestion: "Explain the business value or benefit",
      ruleId: "STORY-022",
    });
  }

  // Check for common anti-patterns
  if (action.toLowerCase().includes("system") || action.toLowerCase().includes("application")) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: "Action describes system behavior instead of user intent",
      context: `${context} - Action: "${action}"`,
      suggestion: "Focus on what the user wants to accomplish, not how the system works",
      ruleId: "STORY-023",
    });
  }

  if (value.toLowerCase().includes("user") && value.length < 15) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: "Value statement is too generic",
      context: `${context} - Value: "${value}"`,
      suggestion: "Be specific about the business value or user benefit",
      ruleId: "STORY-024",
    });
  }
}

function validateINVESTCompliance(stories: UserStory[], issues: ValidationIssue[]): void {
  for (const [index, story] of stories.entries()) {
    const storyContext = `Story ${index + 1}: "${story.title}"`;
    const invest = assessINVESTCriteria(story);

    if (!invest.independent) {
      issues.push({
        severity: ValidationSeverity.WARNING,
        message: "Story may not be independent",
        context: storyContext,
        suggestion: "Ensure story can be developed and delivered independently",
        ruleId: "STORY-INVEST-01",
      });
    }

    if (!invest.negotiable) {
      issues.push({
        severity: ValidationSeverity.INFO,
        message: "Story may be too detailed/rigid",
        context: storyContext,
        suggestion: "Keep story open for discussion and implementation options",
        ruleId: "STORY-INVEST-02",
      });
    }

    if (!invest.valuable) {
      issues.push({
        severity: ValidationSeverity.WARNING,
        message: "Story business value not clear",
        context: storyContext,
        suggestion: "Clarify how this story delivers value to users/business",
        ruleId: "STORY-INVEST-03",
      });
    }

    if (!invest.estimable) {
      issues.push({
        severity: ValidationSeverity.ERROR,
        message: "Story not estimable",
        context: storyContext,
        suggestion: "Add more detail or break down into smaller, clearer stories",
        ruleId: "STORY-INVEST-04",
      });
    }

    if (!invest.small) {
      issues.push({
        severity: ValidationSeverity.WARNING,
        message: "Story too large",
        context: storyContext,
        suggestion: "Break down into smaller stories that can fit in one sprint",
        ruleId: "STORY-INVEST-05",
      });
    }

    if (!invest.testable) {
      issues.push({
        severity: ValidationSeverity.ERROR,
        message: "Story not testable",
        context: storyContext,
        suggestion: "Add clear acceptance criteria that can be verified",
        ruleId: "STORY-INVEST-06",
      });
    }
  }
}

function assessINVESTCriteria(story: UserStory): INVESTCriteria {
  // Independent: doesn't depend heavily on other stories
  const independent =
    !story.description.toLowerCase().includes("after") &&
    !story.description.toLowerCase().includes("depends on") &&
    !story.description.toLowerCase().includes("requires completion");

  // Negotiable: not overly detailed
  const negotiable =
    story.acceptanceCriteria.length <= 6 &&
    !story.description.includes("must use") &&
    !story.description.includes("exactly");

  // Valuable: clear business value
  const valuable =
    story.actorActionValue.value.length >= 10 &&
    (story.actorActionValue.value.includes("can") ||
      story.actorActionValue.value.includes("improve") ||
      story.actorActionValue.value.includes("enable") ||
      story.actorActionValue.value.includes("reduce"));

  // Estimable: clear and understandable
  const estimable =
    story.size > 0 &&
    story.acceptanceCriteria.length > 0 &&
    story.actorActionValue.action.length >= 5;

  // Small: can fit in one sprint
  const small = story.size <= 13 && story.size > 0;

  // Testable: has testable acceptance criteria
  const testable =
    story.acceptanceCriteria.length > 0 &&
    story.acceptanceCriteria.some(
      (criteria) =>
        criteria.includes("should") ||
        criteria.includes("must") ||
        criteria.includes("can") ||
        criteria.includes("verify")
    );

  return {
    independent,
    negotiable,
    valuable,
    estimable,
    small,
    testable,
  };
}

async function validateBDDCompliance(
  stories: UserStory[],
  issues: ValidationIssue[]
): Promise<void> {
  for (const [index, story] of stories.entries()) {
    const storyContext = `Story ${index + 1}: "${story.title}"`;
    const criteriaContent = story.acceptanceCriteria.join("\n");

    if (criteriaContent) {
      const bddResult = validateBDDPatterns(criteriaContent, {
        requireAll: false,
        allowMultiple: true,
        strict: false,
      });

      // Convert BDD issues to story-specific issues
      bddResult.issues.forEach((issue) => {
        if (issue.severity === ValidationSeverity.ERROR) {
          issues.push({
            ...issue,
            context: `${storyContext}: ${issue.context}`,
            ruleId: `STORY-BDD-${issue.ruleId}`,
          });
        }
      });

      // Check for BDD pattern presence
      const hasBDD = criteriaContent.match(/\b(given|cuando|when|then|entonces|dado\s+que)\b/i);
      if (!hasBDD) {
        issues.push({
          severity: ValidationSeverity.INFO,
          message: "Story acceptance criteria not in BDD format",
          context: storyContext,
          suggestion: "Consider using Given/When/Then format for clearer testing",
          ruleId: "STORY-BDD-FORMAT",
        });
      }
    }
  }
}

async function validateEpicTraceability(
  stories: UserStory[],
  epicPath: string,
  issues: ValidationIssue[]
): Promise<void> {
  if (!fs.existsSync(epicPath)) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: "Epic file not found for traceability validation",
      context: `Path: ${epicPath}`,
      suggestion: "Provide epic file or disable epic traceability validation",
      ruleId: "STORY-EPIC-001",
    });
    return;
  }

  const epicContent = fs.readFileSync(epicPath, "utf-8");
  const availableEpics = extractEpicNames(epicContent);

  for (const story of stories) {
    if (story.epic && !availableEpics.has(story.epic)) {
      issues.push({
        severity: ValidationSeverity.WARNING,
        message: `Story references unknown epic: ${story.epic}`,
        context: `Story: "${story.title}"`,
        suggestion: "Verify epic name or update epic documentation",
        ruleId: "STORY-EPIC-002",
      });
    }
  }
}

function extractEpicNames(epicContent: string): Set<string> {
  const epicNames = new Set<string>();

  // Extract epic names from headers
  const epicMatches = epicContent.match(/^## (.+)$/gm);
  if (epicMatches) {
    epicMatches.forEach((match) => {
      const epicName = match.replace(/^## /, "").trim();
      epicNames.add(epicName);
    });
  }

  return epicNames;
}

async function validateRequirementsTraceability(
  stories: UserStory[],
  requirementsPath: string,
  issues: ValidationIssue[]
): Promise<void> {
  if (!fs.existsSync(requirementsPath)) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: "Requirements file not found for traceability validation",
      context: `Path: ${requirementsPath}`,
      suggestion: "Provide requirements file or disable traceability validation",
      ruleId: "STORY-REQ-001",
    });
    return;
  }

  const requirementsContent = fs.readFileSync(requirementsPath, "utf-8");
  const availableRFs = extractRequirementIds(requirementsContent);

  let storiesWithoutTraceability = 0;

  for (const story of stories) {
    if (story.linkedRequirements.length === 0) {
      storiesWithoutTraceability++;
    } else {
      for (const rfId of story.linkedRequirements) {
        if (!availableRFs.has(rfId)) {
          issues.push({
            severity: ValidationSeverity.WARNING,
            message: `Story references unknown requirement: ${rfId}`,
            context: `Story: "${story.title}"`,
            suggestion: "Verify requirement ID or update requirements document",
            ruleId: "STORY-REQ-002",
          });
        }
      }
    }
  }

  if (storiesWithoutTraceability > stories.length * 0.3) {
    // More than 30% without traceability
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: `${storiesWithoutTraceability}/${stories.length} stories lack requirement traceability`,
      context: "Many stories are not linked to functional requirements",
      suggestion: "Add RF-XXX references to establish traceability",
      ruleId: "STORY-REQ-003",
    });
  }
}

function extractRequirementIds(requirementsContent: string): Set<string> {
  const rfMatches = requirementsContent.match(/RF-\d+/g) || [];
  return new Set(rfMatches);
}

function validateSlicingPatterns(stories: UserStory[], issues: ValidationIssue[]): void {
  const storiesWithPatterns = stories.filter((s) => s.slicingPattern);
  const patternUsage = new Map<string, number>();

  // Count pattern usage
  storiesWithPatterns.forEach((story) => {
    const pattern = story.slicingPattern!;
    patternUsage.set(pattern, (patternUsage.get(pattern) || 0) + 1);
  });

  // Check if documented patterns are actually used
  const usedPatterns = [...patternUsage.keys()];
  const recognizedPatterns = SLICING_PATTERNS.map((p) => p.name);

  const unrecognizedPatterns = usedPatterns.filter((p) => !recognizedPatterns.includes(p));
  if (unrecognizedPatterns.length > 0) {
    issues.push({
      severity: ValidationSeverity.INFO,
      message: `Unrecognized slicing patterns used: ${unrecognizedPatterns.join(", ")}`,
      context: "These patterns are not in the standard slicing pattern library",
      suggestion: "Document custom patterns or use standard patterns",
      ruleId: "STORY-SLICE-001",
    });
  }

  // Check for pattern diversity
  if (patternUsage.size === 1 && stories.length > 10) {
    const singlePattern = [...patternUsage.keys()][0];
    issues.push({
      severity: ValidationSeverity.INFO,
      message: `All stories use same slicing pattern: ${singlePattern}`,
      context: "Consider if other slicing patterns might be more appropriate for some stories",
      suggestion: "Review if varied slicing patterns could provide better story breakdown",
      ruleId: "STORY-SLICE-002",
    });
  }

  // Validate pattern appropriateness
  for (const story of storiesWithPatterns) {
    const pattern = SLICING_PATTERNS.find((p) => p.name === story.slicingPattern);
    if (pattern) {
      const hasIndicators = pattern.indicators.some(
        (indicator) =>
          story.title.toLowerCase().includes(indicator) ||
          story.description.toLowerCase().includes(indicator) ||
          story.acceptanceCriteria.some((ac) => ac.toLowerCase().includes(indicator))
      );

      if (!hasIndicators) {
        issues.push({
          severity: ValidationSeverity.INFO,
          message: `Story may not match assigned slicing pattern: ${pattern.name}`,
          context: `Story: "${story.title}"`,
          suggestion: "Verify the slicing pattern assignment is appropriate",
          ruleId: "STORY-SLICE-003",
        });
      }
    }
  }
}

function validateStoryIndependence(stories: UserStory[], issues: ValidationIssue[]): void {
  // Check for explicit dependencies
  for (const story of stories) {
    const dependencyKeywords = ["after", "before", "depends on", "requires", "once", "following"];
    const hasDependencyLanguage = dependencyKeywords.some(
      (keyword) =>
        story.description.toLowerCase().includes(keyword) ||
        story.acceptanceCriteria.some((ac) => ac.toLowerCase().includes(keyword))
    );

    if (hasDependencyLanguage) {
      issues.push({
        severity: ValidationSeverity.WARNING,
        message: "Story contains dependency language",
        context: `Story: "${story.title}"`,
        suggestion: "Consider restructuring to make story more independent",
        ruleId: "STORY-INDEP-001",
      });
    }
  }

  // Check for sequential numbering that might indicate dependencies
  const numericalTitles = stories.filter((s) => /\d+/.test(s.title));
  if (numericalTitles.length > stories.length * 0.5) {
    issues.push({
      severity: ValidationSeverity.INFO,
      message: "Many stories have numerical sequences in titles",
      context: "This might indicate procedural dependencies",
      suggestion: "Ensure stories can be implemented in any order",
      ruleId: "STORY-INDEP-002",
    });
  }
}

function calculateStoryScore(stories: UserStory[], issues: ValidationIssue[]): number {
  if (stories.length === 0) return 0;

  // Base score from story completeness (2 points max)
  const completeStories = stories.filter(
    (s) =>
      s.title &&
      s.actorActionValue.actor &&
      s.actorActionValue.action &&
      s.actorActionValue.value &&
      s.acceptanceCriteria.length > 0 &&
      s.size > 0
  ).length;
  const completenessScore = (completeStories / stories.length) * 2;

  // INVEST compliance score (1.5 points max)
  let totalINVEST = 0;
  stories.forEach((story) => {
    const invest = assessINVESTCriteria(story);
    const storyINVEST = Object.values(invest).filter(Boolean).length / 6; // 6 INVEST criteria
    totalINVEST += storyINVEST;
  });
  const investScore = (totalINVEST / stories.length) * 1.5;

  // Traceability score (1 point max)
  const storiesWithTraceability = stories.filter((s) => s.linkedRequirements.length > 0).length;
  const traceabilityScore = (storiesWithTraceability / stories.length) * 1;

  // BDD compliance bonus (0.5 points max)
  const storiesWithBDD = stories.filter((s) =>
    s.acceptanceCriteria.some((ac) => /\b(given|cuando|when|then|entonces|dado\s+que)\b/i.test(ac))
  ).length;
  const bddBonus = (storiesWithBDD / stories.length) * 0.5;

  // Penalty for issues
  const errorPenalty = issues.filter((i) => i.severity === ValidationSeverity.ERROR).length * 0.2;
  const warningPenalty =
    issues.filter((i) => i.severity === ValidationSeverity.WARNING).length * 0.1;

  const finalScore =
    completenessScore + investScore + traceabilityScore + bddBonus - errorPenalty - warningPenalty;

  return Math.max(0, Math.min(5, finalScore));
}

function createFailureResult(issues: ValidationIssue[]): ValidationResult {
  return {
    success: false,
    score: 0,
    issues,
    metadata: {
      validator: "validate-user-stories",
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * CLI entry point for script execution
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const storiesPath = process.argv[2];
  const epicPath = process.argv[3];
  const requirementsPath = process.argv[4];

  if (!storiesPath) {
    console.error(
      "Usage: tsx validate-user-stories.ts <stories-file> [epic-file] [requirements-file]"
    );
    process.exit(1);
  }

  validateUserStories(storiesPath, epicPath, requirementsPath)
    .then((result) => {
      console.log(`\n📖 User Stories Validation Results`);
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
