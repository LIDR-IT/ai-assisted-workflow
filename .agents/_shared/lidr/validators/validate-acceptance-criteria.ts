/**
 * Acceptance Criteria Validation - SMART criteria compliance
 * Validates testability, measurability, and quality of acceptance criteria
 */

import {
  ValidationResult,
  ValidationIssue,
  ValidationSeverity,
  AcceptanceCriteria,
} from "./types.js";

export interface AcceptanceCriteriaOptions {
  requireSMART: boolean;
  requireBDD: boolean;
  minCriteria: number;
  maxCriteria: number;
}

const DEFAULT_OPTIONS: AcceptanceCriteriaOptions = {
  requireSMART: true,
  requireBDD: true,
  minCriteria: 1,
  maxCriteria: 10,
};

/**
 * Validates acceptance criteria for SMART compliance and testability
 */
export function validateAcceptanceCriteria(
  content: string,
  options: Partial<AcceptanceCriteriaOptions> = {}
): ValidationResult {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const issues: ValidationIssue[] = [];

  const criteria = extractAcceptanceCriteria(content);

  if (criteria.length === 0) {
    issues.push({
      severity: ValidationSeverity.ERROR,
      message: "No acceptance criteria found",
      context: "Requirement must have explicit acceptance criteria",
      suggestion: 'Add "## Criterios de Aceptación" or "## Acceptance Criteria" section',
      ruleId: "AC-001",
    });
    return createFailureResult(issues);
  }

  if (criteria.length < config.minCriteria) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: `Too few acceptance criteria (${criteria.length} < ${config.minCriteria})`,
      context: "Complex requirements typically need multiple criteria",
      suggestion: "Consider adding more specific acceptance criteria",
      ruleId: "AC-002",
    });
  }

  if (criteria.length > config.maxCriteria) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: `Too many acceptance criteria (${criteria.length} > ${config.maxCriteria})`,
      context: "Consider breaking down into smaller requirements",
      suggestion: "Split complex requirements into multiple user stories",
      ruleId: "AC-003",
    });
  }

  // Validate each criterion
  criteria.forEach((criterion, index) => {
    const lineNumber = findCriterionLineNumber(content, criterion);
    validateSingleCriterion(criterion, index + 1, lineNumber, issues);
  });

  // Validate BDD compliance if required
  if (config.requireBDD) {
    validateBDDCompliance(criteria, issues);
  }

  // Check for measurability
  const measurableCriteria = criteria.filter((c) => isMeasurable(c));
  if (measurableCriteria.length === 0) {
    issues.push({
      severity: ValidationSeverity.ERROR,
      message: "No measurable acceptance criteria found",
      context: "All criteria should be testable and measurable",
      suggestion: "Add specific, quantifiable success conditions",
      ruleId: "AC-010",
    });
  }

  const score = calculateAcceptanceScore(criteria, issues);

  return {
    success: issues.filter((i) => i.severity === ValidationSeverity.ERROR).length === 0,
    score,
    issues,
    metadata: {
      validator: "validate-acceptance-criteria",
      timestamp: new Date().toISOString(),
      fileCount: 1,
    },
  };
}

function extractAcceptanceCriteria(content: string): string[] {
  const criteria: string[] = [];
  const lines = content.split("\n");
  let inCriteria = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Start of acceptance criteria section
    if (trimmed.match(/^#{2,4}\s*(criterios?\s+de\s+aceptaci[oó]n|acceptance\s+criteria)/i)) {
      inCriteria = true;
      continue;
    }

    // End of section (new heading)
    if (inCriteria && trimmed.startsWith("#")) {
      break;
    }

    // Extract criteria (bullets or numbered)
    if (inCriteria && trimmed.match(/^[-*+]\s+|^\d+\.\s+/)) {
      const criterion = trimmed.replace(/^[-*+]\s+|^\d+\.\s+/, "").trim();
      if (criterion) {
        criteria.push(criterion);
      }
    }
  }

  return criteria;
}

function validateSingleCriterion(
  criterion: string,
  index: number,
  lineNumber: number | null,
  issues: ValidationIssue[]
): void {
  // SMART criteria validation
  const smart = assessSMARTCompliance(criterion);

  if (!smart.specific) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: `Criterion ${index}: Not specific enough`,
      context: `"${criterion}"`,
      lineNumber: lineNumber || undefined,
      suggestion: "Be more specific about what exactly should happen",
      ruleId: "AC-004",
    });
  }

  if (!smart.measurable) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: `Criterion ${index}: Not measurable`,
      context: `"${criterion}"`,
      lineNumber: lineNumber || undefined,
      suggestion: "Add quantifiable success conditions (time, count, percentage)",
      ruleId: "AC-005",
    });
  }

  if (!smart.testable) {
    issues.push({
      severity: ValidationSeverity.ERROR,
      message: `Criterion ${index}: Not testable`,
      context: `"${criterion}"`,
      lineNumber: lineNumber || undefined,
      suggestion: "Rewrite to describe observable behavior that can be tested",
      ruleId: "AC-006",
    });
  }

  // Check for vague language
  const vagueTerms = ["properly", "correctly", "appropriately", "good", "bad", "nice", "better"];
  const hasVague = vagueTerms.some((term) => criterion.toLowerCase().includes(term.toLowerCase()));

  if (hasVague) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: `Criterion ${index}: Contains vague language`,
      context: `"${criterion}"`,
      lineNumber: lineNumber || undefined,
      suggestion: "Replace vague terms with specific, measurable conditions",
      ruleId: "AC-007",
    });
  }

  // Check minimum length
  if (criterion.length < 10) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: `Criterion ${index}: Too brief`,
      context: `"${criterion}" (${criterion.length} chars)`,
      lineNumber: lineNumber || undefined,
      suggestion: "Provide more detailed acceptance conditions",
      ruleId: "AC-008",
    });
  }
}

function assessSMARTCompliance(criterion: string): {
  specific: boolean;
  measurable: boolean;
  achievable: boolean;
  relevant: boolean;
  timeBound: boolean;
  testable: boolean;
} {
  const text = criterion.toLowerCase();

  // Specific: Has concrete nouns/actions
  const specific =
    /\b(usuario|user|sistema|system|interfaz|interface|button|field|form|page|data|response)\b/.test(
      text
    );

  // Measurable: Has quantifiable elements
  const measurable =
    /\b(\d+|menos\s+de|more\s+than|within|en\s+menos|percentage|tiempo|time|seconds?|minutos?|minutes?)\b/.test(
      text
    );

  // Testable: Describes observable behavior
  const testable =
    /\b(muestra|shows?|displays?|redirect|error|success|confirm|appears?|hidden|visible|enabled|disabled)\b/.test(
      text
    );

  // Achievable: Not overly complex for single criterion
  const achievable = criterion.split(/\s+and\s+|y\s+/).length <= 3;

  // Relevant: Related to user/system behavior
  const relevant = /\b(usuario|user|sistema|system|funcionalidad|feature|requirement)\b/.test(text);

  // Time-bound: Has temporal constraints (optional for most criteria)
  const timeBound = /\b(inmediatamente|immediately|within|en\s+menos|timeout|expir)\b/.test(text);

  return {
    specific,
    measurable,
    achievable,
    relevant,
    timeBound,
    testable,
  };
}

function isMeasurable(criterion: string): boolean {
  return assessSMARTCompliance(criterion).measurable;
}

function validateBDDCompliance(criteria: string[], issues: ValidationIssue[]): void {
  const bddPatterns = criteria.filter((c) =>
    /\b(given|cuando|when|then|entonces|dado\s+que)\b/i.test(c)
  );

  if (bddPatterns.length === 0) {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: "No BDD-style acceptance criteria found",
      context: "Consider using Given/When/Then format for clarity",
      suggestion: 'Rewrite criteria using "Given X, When Y, Then Z" pattern',
      ruleId: "AC-009",
    });
  }
}

function findCriterionLineNumber(content: string, criterion: string): number | null {
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(criterion)) {
      return i + 1;
    }
  }
  return null;
}

function calculateAcceptanceScore(criteria: string[], issues: ValidationIssue[]): number {
  if (criteria.length === 0) return 0;

  // Base score from criteria count (normalized)
  const countScore = Math.min(2, criteria.length * 0.5); // Max 2 points

  // Quality score from SMART compliance
  const smartScores = criteria.map((c) => {
    const smart = assessSMARTCompliance(c);
    return Object.values(smart).filter(Boolean).length / 6; // 6 SMART+testable criteria
  });
  const avgSmartScore = smartScores.reduce((a, b) => a + b, 0) / smartScores.length;
  const qualityScore = avgSmartScore * 2; // Max 2 points

  // Penalty for issues
  const errorPenalty = issues.filter((i) => i.severity === ValidationSeverity.ERROR).length * 0.5;
  const warningPenalty =
    issues.filter((i) => i.severity === ValidationSeverity.WARNING).length * 0.2;

  const finalScore = countScore + qualityScore - errorPenalty - warningPenalty + 1; // +1 base point

  return Math.max(0, Math.min(5, finalScore));
}

function createFailureResult(issues: ValidationIssue[]): ValidationResult {
  return {
    success: false,
    score: 0,
    issues,
    metadata: {
      validator: "validate-acceptance-criteria",
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Extract structured acceptance criteria for analysis
 */
export function extractStructuredCriteria(content: string): AcceptanceCriteria {
  const criteria = extractAcceptanceCriteria(content);
  const bddCompliant = criteria.some((c) =>
    /\b(given|cuando|when|then|entonces|dado\s+que)\b/i.test(c)
  );

  const measurable = criteria.some((c) => isMeasurable(c));
  const testable = criteria.every((c) => assessSMARTCompliance(c).testable);

  // Calculate overall SMART compliance
  const smartAnalysis = criteria.map((c) => assessSMARTCompliance(c));
  const avgSmart = smartAnalysis.reduce(
    (acc, smart) => ({
      specific: acc.specific + (smart.specific ? 1 : 0),
      measurable: acc.measurable + (smart.measurable ? 1 : 0),
      achievable: acc.achievable + (smart.achievable ? 1 : 0),
      relevant: acc.relevant + (smart.relevant ? 1 : 0),
      timeBound: acc.timeBound + (smart.timeBound ? 1 : 0),
    }),
    { specific: 0, measurable: 0, achievable: 0, relevant: 0, timeBound: 0 }
  );

  const smartCompliance = {
    specific: avgSmart.specific > criteria.length / 2,
    measurable: avgSmart.measurable > criteria.length / 2,
    achievable: avgSmart.achievable > criteria.length / 2,
    relevant: avgSmart.relevant > criteria.length / 2,
    timeBound: avgSmart.timeBound > criteria.length / 2,
  };

  return {
    criteria,
    isMeasurable: measurable,
    isTestable: testable,
    followsBDD: bddCompliant,
    smartCompliance,
  };
}
