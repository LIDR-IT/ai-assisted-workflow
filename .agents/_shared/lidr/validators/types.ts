/**
 * Shared validation types for SDLC ecosystem
 */

export enum ValidationSeverity {
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

export interface ValidationIssue {
  severity: ValidationSeverity;
  message: string;
  context?: string;
  lineNumber?: number;
  suggestion?: string;
  ruleId: string;
}

export interface ValidationResult {
  success: boolean;
  score: number; // 0-5 scale (BMAD-inspired)
  issues: ValidationIssue[];
  metadata?: {
    validator: string;
    timestamp: string;
    fileCount?: number;
    linesValidated?: number;
  };
}

export interface ValidatorConfig {
  strict?: boolean;
  skipWarnings?: boolean;
  customRules?: string[];
}

export interface SkillValidationContext {
  skillName: string;
  skillPath: string;
  phase: number;
  ownerRole: string;
  files: {
    skillMd: string;
    references?: string[];
    examples?: string[];
    templates?: string[];
  };
}

export interface BDDPattern {
  given: string[];
  when: string[];
  then: string[];
  isValid: boolean;
}

export interface AcceptanceCriteria {
  criteria: string[];
  isMeasurable: boolean;
  isTestable: boolean;
  followsBDD: boolean;
  smartCompliance: {
    specific: boolean;
    measurable: boolean;
    achievable: boolean;
    relevant: boolean;
    timeBound: boolean;
  };
}

export interface RequirementTraceability {
  sourceDocument: string;
  targetDocument: string;
  sourceId: string;
  targetId: string;
  verified: boolean;
}

export interface EcosystemCoherence {
  templateConsistency: boolean;
  crossReferences: RequirementTraceability[];
  namingConventions: boolean;
  versionAlignment: boolean;
}
