/**
 * Template Engine — Variable resolution for LIDR SDLC Methodology templates
 *
 * Resolves {{VARIABLE}} placeholders from two sources:
 *   1. Client configuration (src/data/client.ts)
 *   2. Industry packs (src/data/industries/)
 *
 * The engine merges both sources into a single variable map,
 * with client-level values taking precedence over industry defaults.
 *
 * Part of the Q3 productization effort for multi-client portability.
 */

import { getCurrentClient } from './client-registry';
import type { ClientConfig } from './schemas/client-schema';
import { getIndustryPack } from './industries';
import type { IndustryPack } from './industries';
import { methodology } from './methodology';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** All template variables recognized by the engine */
export interface TemplateVariables {
  readonly CLIENT_NAME: string;
  readonly CLIENT_FULL_NAME: string;
  readonly CLIENT_CODE: string;
  readonly PROJECT_NAME: string;
  readonly DOMAIN: string;
  readonly INDUSTRY: string;
  readonly METHODOLOGY: string;
  readonly CLIENT_REGULATIONS: string;
  readonly STAKEHOLDER_TYPES: string;
  readonly DOMAIN_SYSTEMS: string;
  readonly SENSITIVE_DATA_TYPE: string;
  readonly COMPLIANCE_FRAMEWORK: string;
  // Enhanced template variables for dynamic content
  readonly GOVERNANCE_STYLE: string;
  readonly TEAM_STRUCTURE: string;
  readonly CRISIS_LANGUAGE: string;
  readonly TOOL_ECOSYSTEM: string;
  readonly PROCESS_MATURITY: string;
  readonly DELIVERY_PRESSURE: string;
}

export interface TemplateValidationResult {
  /** Whether all variables in the template are resolvable */
  readonly valid: boolean;
  /** Variable names that could not be resolved */
  readonly unresolvedVars: readonly string[];
}

export interface ProcessingResult {
  /** The processed content with variables replaced */
  readonly content: string;
  /** Variables that were successfully replaced */
  readonly resolvedVars: readonly string[];
  /** Variables that remain unresolved (no value found) */
  readonly unresolvedVars: readonly string[];
}

// ---------------------------------------------------------------------------
// Variable resolution
// ---------------------------------------------------------------------------

/** Regex to match {{VARIABLE_NAME}} placeholders (uppercase + underscores) */
const TEMPLATE_VAR_PATTERN = /\{\{([A-Z][A-Z0-9_]*)\}\}/g;

/**
 * Build the complete variable map by merging client config and industry pack.
 *
 * Resolution order (highest priority first):
 *   1. clientConfig.templateVars  (explicit overrides)
 *   2. Industry pack domainTerms  (industry defaults)
 *   3. Derived fields from clientConfig + methodology
 */
function buildVariableMap(
  config: ClientConfig,
  industry: IndustryPack | undefined
): ReadonlyMap<string, string> {
  const vars = new Map<string, string>();

  // Layer 1 — Derived fields from client config & methodology
  vars.set('CLIENT_NAME', config.name);
  vars.set('CLIENT_FULL_NAME', config.fullName);
  vars.set('CLIENT_CODE', config.projectCode.toLowerCase());
  vars.set('PROJECT_NAME', config.projectName);
  vars.set('DOMAIN', config.domain);
  vars.set('INDUSTRY', config.industry);
  vars.set('METHODOLOGY', methodology.name);

  // Layer 2 — Industry pack defaults (overwrite derived where applicable)
  if (industry) {
    const terms = industry.domainTerms;
    vars.set('CLIENT_REGULATIONS', terms.CLIENT_REGULATIONS);
    vars.set('STAKEHOLDER_TYPES', terms.STAKEHOLDER_TYPES);
    vars.set('DOMAIN_SYSTEMS', terms.DOMAIN_SYSTEMS);
    vars.set('SENSITIVE_DATA_TYPE', terms.SENSITIVE_DATA_TYPE);
    vars.set('COMPLIANCE_FRAMEWORK', terms.COMPLIANCE_FRAMEWORK);
  }

  // Layer 3 — Explicit client templateVars (highest priority, overwrites everything)
  const clientVars = config.templateVars;
  vars.set('CLIENT_REGULATIONS', clientVars.CLIENT_REGULATIONS);
  vars.set('STAKEHOLDER_TYPES', clientVars.STAKEHOLDER_TYPES);
  vars.set('DOMAIN_SYSTEMS', clientVars.DOMAIN_SYSTEMS);
  vars.set('SENSITIVE_DATA_TYPE', clientVars.SENSITIVE_DATA_TYPE);
  vars.set('COMPLIANCE_FRAMEWORK', clientVars.COMPLIANCE_FRAMEWORK);

  // Enhanced template variables for dynamic content
  vars.set('GOVERNANCE_STYLE', clientVars.GOVERNANCE_STYLE);
  vars.set('TEAM_STRUCTURE', clientVars.TEAM_STRUCTURE);
  vars.set('CRISIS_LANGUAGE', clientVars.CRISIS_LANGUAGE);
  vars.set('TOOL_ECOSYSTEM', clientVars.TOOL_ECOSYSTEM);
  vars.set('PROCESS_MATURITY', clientVars.PROCESS_MATURITY);
  vars.set('DELIVERY_PRESSURE', clientVars.DELIVERY_PRESSURE);

  return vars;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Return all {{VARIABLE}} names found in the template content.
 * Duplicates are removed.
 */
export function getUnresolvedVariables(content: string): string[] {
  const found = new Set<string>();
  let match: RegExpExecArray | null;
  const regex = new RegExp(TEMPLATE_VAR_PATTERN.source, 'g');

  while ((match = regex.exec(content)) !== null) {
    const varName = match[1];
    if (varName !== undefined) {
      found.add(varName);
    }
  }

  return Array.from(found);
}

/**
 * Validate a template: check whether all placeholder variables can be
 * resolved from the current client config + given industry.
 *
 * If `industryId` is omitted, the engine only validates against client config.
 */
export function validateTemplate(content: string, industryId?: string): TemplateValidationResult {
  const industry = industryId !== undefined ? getIndustryPack(industryId) : undefined;
  const variableMap = buildVariableMap(getCurrentClient(), industry);
  const placeholders = getUnresolvedVariables(content);

  const unresolved = placeholders.filter((name) => !variableMap.has(name));

  return {
    valid: unresolved.length === 0,
    unresolvedVars: unresolved,
  };
}

/**
 * Process a template string: replace every {{VARIABLE}} with its resolved
 * value from the client config and industry pack.
 *
 * Variables that cannot be resolved are left unchanged in the output so
 * callers can detect and handle them.
 */
export function processTemplate(
  content: string,
  config: ClientConfig,
  industryId: string
): ProcessingResult {
  // Handle undefined or null content
  if (content === undefined || content === null) {
    console.warn('processTemplate received undefined/null content');
    return {
      content: '',
      resolvedVars: [],
      unresolvedVars: [],
    };
  }

  // Ensure content is a string
  if (typeof content !== 'string') {
    console.warn('processTemplate received non-string content:', typeof content);
    content = String(content);
  }

  const industry = getIndustryPack(industryId);
  const variableMap = buildVariableMap(config, industry);

  const resolvedVars: string[] = [];
  const unresolvedSet = new Set<string>();

  const processed = content.replace(TEMPLATE_VAR_PATTERN, (fullMatch, varName: string) => {
    const value = variableMap.get(varName);
    if (value !== undefined) {
      if (!resolvedVars.includes(varName)) {
        resolvedVars.push(varName);
      }
      return value;
    }
    unresolvedSet.add(varName);
    return fullMatch; // leave the placeholder as-is
  });

  return {
    content: processed,
    resolvedVars,
    unresolvedVars: Array.from(unresolvedSet),
  };
}

/**
 * Convenience wrapper that uses the global `clientConfig` and returns just
 * the processed string. This mirrors the signature requested in the spec:
 *
 *   processFile(content, config, industryId) => string
 */
export function processFile(content: string, config: ClientConfig, industryId: string): string {
  return processTemplate(content, config, industryId).content;
}

/**
 * Quick helper: resolve a template using the current (default) client config.
 * Useful in UI components that always operate on the active client.
 */
export function resolveWithDefaults(content: string): string {
  // Determine industry from current client — fall back to the generic pack
  const currentClient = getCurrentClient();
  const industryId = inferIndustryId(currentClient);
  return processFile(content, currentClient, industryId);
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/**
 * Attempt to infer an industry pack ID from a ClientConfig's `industry` field.
 * Returns the best-matching pack ID or 'generic' (domain-agnostic) as a default.
 */
export function inferIndustryId(config: ClientConfig): string {
  const industry = config.industry.toLowerCase();

  if (industry.includes('biometric') || industry.includes('identity')) {
    return 'biometric-identity';
  }
  if (industry.includes('health') || industry.includes('clinical') || industry.includes('pharma')) {
    return 'healthcare';
  }
  if (
    industry.includes('fintech') ||
    industry.includes('payment') ||
    industry.includes('banking')
  ) {
    return 'fintech';
  }
  if (
    industry.includes('government') ||
    industry.includes('public') ||
    industry.includes('civic')
  ) {
    return 'government';
  }
  if (industry.includes('commerce') || industry.includes('retail') || industry.includes('shop')) {
    return 'ecommerce';
  }

  // Default fallback — neutral/domain-agnostic pack, NEVER a specific vertical
  return 'generic';
}

/** List all known template variable names */
export const KNOWN_VARIABLES: readonly string[] = [
  'CLIENT_NAME',
  'CLIENT_FULL_NAME',
  'CLIENT_CODE',
  'PROJECT_NAME',
  'DOMAIN',
  'INDUSTRY',
  'METHODOLOGY',
  'CLIENT_REGULATIONS',
  'STAKEHOLDER_TYPES',
  'DOMAIN_SYSTEMS',
  'SENSITIVE_DATA_TYPE',
  'COMPLIANCE_FRAMEWORK',
] as const;

// Re-export industry pack utilities for hooks
export { getIndustryPack } from './industries';
