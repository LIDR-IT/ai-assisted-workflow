/**
 * BDD Pattern Validation - Shared across skills
 * Validates Given/When/Then format compliance
 */

import { ValidationResult, ValidationIssue, ValidationSeverity, BDDPattern } from "./types.js";

export interface BDDValidationOptions {
  requireAll: boolean; // Require all Given/When/Then
  allowMultiple: boolean; // Allow multiple Given/When/Then
  strict: boolean; // Strict format validation
}

const DEFAULT_OPTIONS: BDDValidationOptions = {
  requireAll: true,
  allowMultiple: true,
  strict: true,
};

/**
 * Validates BDD format in acceptance criteria
 */
export function validateBDDPatterns(
  content: string,
  options: Partial<BDDValidationOptions> = {}
): ValidationResult {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const issues: ValidationIssue[] = [];
  const patterns: BDDPattern[] = [];

  const lines = content.split("\n");
  let currentPattern: Partial<BDDPattern> = { given: [], when: [], then: [] };
  let inCriteria = false;
  let lineNumber = 0;

  for (const line of lines) {
    lineNumber++;
    const trimmedLine = line.trim();

    // Detect acceptance criteria sections
    if (trimmedLine.match(/^#{2,4}\s*(criterios?\s+de\s+aceptaci[oó]n|acceptance\s+criteria)/i)) {
      inCriteria = true;
      continue;
    }

    if (!inCriteria) continue;

    // End of section
    if (trimmedLine.startsWith("#") && !trimmedLine.match(/given|when|then/i)) {
      if (
        currentPattern.given?.length ||
        currentPattern.when?.length ||
        currentPattern.then?.length
      ) {
        const pattern: BDDPattern = {
          given: currentPattern.given || [],
          when: currentPattern.when || [],
          then: currentPattern.then || [],
          isValid: validatePattern(currentPattern),
        };
        patterns.push(pattern);

        if (!pattern.isValid) {
          issues.push({
            severity: ValidationSeverity.ERROR,
            message: "Incomplete BDD pattern detected",
            context: `Pattern missing required Given/When/Then components`,
            lineNumber: lineNumber - 1,
            suggestion: "Ensure each scenario has Given (context), When (action), Then (outcome)",
            ruleId: "BDD-001",
          });
        }

        currentPattern = { given: [], when: [], then: [] };
      }
      inCriteria = false;
      continue;
    }

    // Parse BDD patterns
    const givenMatch = trimmedLine.match(/^-?\s*\*?\s*(dado\s+que|given)\s+(.+)/i);
    const whenMatch = trimmedLine.match(/^-?\s*\*?\s*(cuando|when)\s+(.+)/i);
    const thenMatch = trimmedLine.match(/^-?\s*\*?\s*(entonces|then)\s+(.+)/i);

    if (givenMatch) {
      const context = givenMatch[2].trim();
      if (validateContextClause(context)) {
        currentPattern.given?.push(context);
      } else {
        issues.push({
          severity: ValidationSeverity.WARNING,
          message: "Given clause may not provide sufficient context",
          context: `"${context}"`,
          lineNumber,
          suggestion: "Given should describe initial state or preconditions",
          ruleId: "BDD-002",
        });
      }
    }

    if (whenMatch) {
      const action = whenMatch[2].trim();
      if (validateActionClause(action)) {
        currentPattern.when?.push(action);
      } else {
        issues.push({
          severity: ValidationSeverity.WARNING,
          message: "When clause should describe a user action",
          context: `"${action}"`,
          lineNumber,
          suggestion: "When should describe user action or system event",
          ruleId: "BDD-003",
        });
      }
    }

    if (thenMatch) {
      const outcome = thenMatch[2].trim();
      if (validateOutcomeClause(outcome)) {
        currentPattern.then?.push(outcome);
      } else {
        issues.push({
          severity: ValidationSeverity.WARNING,
          message: "Then clause should be observable and testable",
          context: `"${outcome}"`,
          lineNumber,
          suggestion: "Then should describe observable system response or outcome",
          ruleId: "BDD-004",
        });
      }
    }
  }

  // Validate final pattern if exists
  if (currentPattern.given?.length || currentPattern.when?.length || currentPattern.then?.length) {
    const pattern: BDDPattern = {
      given: currentPattern.given || [],
      when: currentPattern.when || [],
      then: currentPattern.then || [],
      isValid: validatePattern(currentPattern),
    };
    patterns.push(pattern);

    if (!pattern.isValid) {
      issues.push({
        severity: ValidationSeverity.ERROR,
        message: "Incomplete BDD pattern detected at end of content",
        context: "Final pattern missing required components",
        suggestion: "Complete the Given/When/Then pattern",
        ruleId: "BDD-001",
      });
    }
  }

  // Overall validation
  if (inCriteria && patterns.length === 0) {
    issues.push({
      severity: ValidationSeverity.ERROR,
      message: "Acceptance criteria section found but no valid BDD patterns detected",
      context: "Content has acceptance criteria heading but missing Given/When/Then patterns",
      suggestion: "Add proper BDD scenarios with Given/When/Then format",
      ruleId: "BDD-005",
    });
  }

  const score = calculateBDDScore(patterns, issues);

  return {
    success: issues.filter((i) => i.severity === ValidationSeverity.ERROR).length === 0,
    score,
    issues,
    metadata: {
      validator: "validate-bdd-patterns",
      timestamp: new Date().toISOString(),
      linesValidated: lines.length,
    },
  };
}

function validatePattern(pattern: Partial<BDDPattern>): boolean {
  return !!(pattern.given?.length && pattern.when?.length && pattern.then?.length);
}

function validateContextClause(context: string): boolean {
  // Should describe state, conditions, or setup
  const contextPatterns = [
    /\b(el\s+usuario|user)\b/i, // user context
    /\b(el\s+sistema|system)\b/i, // system state
    /\b(existe|exists?)\b/i, // existence
    /\b(configurado|configured)\b/i, // configuration
    /\b(autenticado|authenticated)\b/i, // auth state
    /\b(tiene|has|have)\b/i, // possession
  ];
  return contextPatterns.some((pattern) => pattern.test(context));
}

function validateActionClause(action: string): boolean {
  // Should describe user action or system event
  const actionPatterns = [
    /\b(hace\s+clic|clicks?)\b/i,
    /\b(introduce|enters?|inputs?)\b/i,
    /\b(selecciona|selects?)\b/i,
    /\b(navega|navigates?)\b/i,
    /\b(env[íi]a|sends?|submits?)\b/i,
    /\b(ejecuta|executes?|runs?)\b/i,
    /\b(solicita|requests?)\b/i,
  ];
  return actionPatterns.some((pattern) => pattern.test(action));
}

function validateOutcomeClause(outcome: string): boolean {
  // Should describe observable result
  const outcomePatterns = [
    /\b(deber[íi]a|should|must)\b/i,
    /\b(se\s+muestra|shows?|displays?)\b/i,
    /\b(recibe|receives?|gets?)\b/i,
    /\b(redirige|redirects?)\b/i,
    /\b(confirma|confirms?)\b/i,
    /\b(error|errors?|fails?)\b/i,
    /\b([éeé]xito|success)\b/i,
  ];
  return outcomePatterns.some((pattern) => pattern.test(outcome));
}

function calculateBDDScore(patterns: BDDPattern[], issues: ValidationIssue[]): number {
  if (patterns.length === 0) return 0;

  const validPatterns = patterns.filter((p) => p.isValid).length;
  const completenessScore = (validPatterns / patterns.length) * 2.5; // Max 2.5 for completeness

  const errorPenalty = issues.filter((i) => i.severity === ValidationSeverity.ERROR).length * 0.5;
  const warningPenalty =
    issues.filter((i) => i.severity === ValidationSeverity.WARNING).length * 0.2;

  const qualityScore = 2.5 - errorPenalty - warningPenalty; // Max 2.5 for quality

  return Math.max(0, Math.min(5, completenessScore + qualityScore));
}

/**
 * Extract BDD patterns from content for analysis
 */
export function extractBDDPatterns(content: string): BDDPattern[] {
  const result = validateBDDPatterns(content);
  // This is a simplified version - in full implementation, would return the patterns
  return [];
}
