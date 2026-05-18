/**
 * Client Content Resolution Utilities
 *
 * This module provides utilities for resolving client-specific content,
 * eliminating hardcoded values and supporting dynamic content rendering
 * based on client configuration.
 *
 * Supports:
 * - Tool ecosystem mapping (TestRail vs Cucumber, Jira vs Linear)
 * - Governance style content (formal vs informal)
 * - Crisis language handling (dramatic vs neutral)
 * - Process maturity language ("first time" vs established)
 */

import type { ClientConfig } from '@/data/schemas/client-schema';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Content resolution options for different contexts */
export interface ContentResolutionContext {
  /** Type of content being resolved */
  type: 'tool_reference' | 'process_description' | 'governance_language' | 'crisis_language';
  /** Fallback content if client configuration is incomplete */
  fallback?: string;
  /** Whether to use neutral/professional language */
  neutral?: boolean;
}

// ---------------------------------------------------------------------------
// Tool Resolution
// ---------------------------------------------------------------------------

/**
 * Get the appropriate testing tool based on client configuration
 */
export function getTestingTool(client: ClientConfig | undefined): string {
  if (!client) {
    return 'TestRail';
  }

  // Direct configuration takes precedence
  if (client.domainTerms?.testing_tool) {
    return client.domainTerms.testing_tool;
  }

  // Industry-based defaults (generic)
  // Note: PREFERRED_TRACKING is an optional template variable

  // Industry defaults
  if (client.industry === 'Software Development') {
    return 'Cucumber';
  }
  if (client.industry === 'Biometric Identity Verification') {
    return 'TestRail';
  }

  return 'TestRail'; // Conservative default
}

/**
 * Get the appropriate tracking tool based on client configuration
 */
export function getTrackingTool(client: ClientConfig | undefined): string {
  if (!client) {
    return 'Jira';
  }

  // Direct configuration takes precedence
  if (client.domainTerms?.tracking_tool) {
    return client.domainTerms.tracking_tool;
  }

  // Industry-based defaults (generic)

  // Industry defaults
  if (client.industry === 'Software Development') {
    return 'Linear';
  }
  if (client.industry === 'Biometric Identity Verification') {
    return 'Jira';
  }

  return 'Jira'; // Conservative default
}

/**
 * Get the version control system (VCS) tool based on client configuration.
 * Used in commands/workflows that reference CLI tooling (gh vs glab).
 */
export function getVcsTool(client: ClientConfig | undefined): string {
  if (!client) {
    return 'GitHub';
  }

  if (client.domainTerms?.vcs_tool) {
    return client.domainTerms.vcs_tool;
  }

  return 'GitHub';
}

/**
 * Get the VCS CLI command name for the client's VCS.
 * GitHub → "gh", GitLab → "glab", default → "gh".
 */
export function getVcsCli(client: ClientConfig | undefined): string {
  const vcs = getVcsTool(client).toLowerCase();
  if (vcs === 'gitlab') {
    return 'glab';
  }
  return 'gh';
}

/**
 * Get the appropriate documentation system based on client configuration
 */
export function getDocumentationSystem(client: ClientConfig | undefined): string {
  if (!client) {
    return 'Confluence';
  }

  if (client.domainTerms?.doc_system) {
    return client.domainTerms.doc_system;
  }

  // Use configuration or fallback to generic
  return 'Confluence';
}

/**
 * Get the complete tool ecosystem for a client
 */
export function getToolEcosystem(client: ClientConfig | undefined): string[] {
  if (!client) {
    return ['Jira', 'TestRail', 'Confluence', 'GitHub'];
  }

  if (client.domainTerms?.workflow_tools) {
    // Parse the comma-separated string into an array
    return client.domainTerms.workflow_tools.split(',').map((tool) => tool.trim());
  }

  // Construct from individual tools
  const tools = [
    getTrackingTool(client),
    getTestingTool(client),
    getDocumentationSystem(client),
    'GitHub',
  ];

  // Add industry-standard tools
  if (client.industry === 'Software Development') {
    tools.push('Docker', 'Jenkins');
  }
  // Add security tools based on industry requirements
  if (client.industry === 'Biometric Identity Verification') {
    tools.push('SonarQube', 'OWASP ZAP');
  }

  return [...new Set(tools)]; // Remove duplicates
}

// ---------------------------------------------------------------------------
// Content Resolution
// ---------------------------------------------------------------------------

/**
 * Resolve governance-style content based on client configuration
 */
export function getGovernanceLanguage(
  client: ClientConfig | undefined,
  formal: string,
  informal: string
): string {
  if (!client) {
    return formal;
  }

  const style = client.domainTerms?.governance_style || client.templateVars?.GOVERNANCE_STYLE;

  if (style?.toLowerCase().includes('informal') || style?.toLowerCase().includes('collaborative')) {
    return informal;
  }

  return formal;
}

/**
 * Resolve crisis language based on client configuration
 */
export function getCrisisLanguage(
  client: ClientConfig | undefined,
  dramatic: string,
  neutral: string
): string {
  if (!client) {
    return neutral;
  }

  const crisisStyle = client.templateVars?.CRISIS_LANGUAGE;

  if (
    crisisStyle?.toLowerCase().includes('collaborative') ||
    crisisStyle?.toLowerCase().includes('neutral')
  ) {
    return neutral;
  }

  return dramatic;
}

/**
 * Resolve process maturity language (remove "primera vez" claims for established clients)
 */
export function getProcessMaturityLanguage(
  client: ClientConfig | undefined,
  firstTime: string,
  established: string
): string {
  if (!client) {
    return established;
  }

  const maturity = client.templateVars?.PROCESS_MATURITY;

  if (
    maturity?.toLowerCase().includes('established') ||
    maturity?.toLowerCase().includes('existing')
  ) {
    return established;
  }

  return firstTime;
}

/**
 * Get testing approach description based on client configuration
 */
export function getTestingApproachDescription(client: ClientConfig | undefined): string {
  if (!client) {
    return 'gestión de pruebas en TestRail';
  }

  if (client.domainTerms?.testing_approach_detailed) {
    return client.domainTerms.testing_approach_detailed;
  }

  if (client.domainTerms?.testing_approach) {
    return client.domainTerms.testing_approach;
  }

  const tool = getTestingTool(client);

  if (tool === 'Cucumber') {
    return 'automatización BDD con Cucumber/Gherkin';
  }

  return `gestión de pruebas en ${tool}`;
}

/**
 * Get testing action description based on client configuration
 */
export function getTestingActionDescription(client: ClientConfig | undefined): string {
  if (!client) {
    return 'QA genera test cases en TestRail';
  }

  if (client.domainTerms?.testing_action) {
    return client.domainTerms.testing_action;
  }

  const tool = getTestingTool(client);

  if (tool === 'Cucumber') {
    return 'QA genera scenarios en Cucumber';
  }

  return `QA genera test cases en ${tool}`;
}

/**
 * Get testing reporting description based on client configuration
 */
export function getTestingReportingDescription(client: ClientConfig | undefined): string {
  if (!client) {
    return 'los resultados se reportan en TestRail';
  }

  if (client.domainTerms?.testing_reporting) {
    return client.domainTerms.testing_reporting;
  }

  const tool = getTestingTool(client);

  if (tool === 'Cucumber') {
    return 'los resultados se ejecutan automáticamente';
  }

  return `los resultados se reportan en ${tool}`;
}

// ---------------------------------------------------------------------------
// Advanced Content Resolution
// ---------------------------------------------------------------------------

/**
 * Resolve dynamic content with multiple fallback strategies
 */
export function resolveDynamicContent(
  client: ClientConfig | undefined,
  contentKey: keyof NonNullable<ClientConfig['domainTerms']>,
  context: ContentResolutionContext
): string {
  if (!client) {
    return context.fallback || '';
  }

  // Try direct domain term lookup
  if (client.domainTerms?.[contentKey]) {
    return client.domainTerms[contentKey] as string;
  }

  // Try template variables
  if (context.type === 'governance_language' && client.templateVars?.GOVERNANCE_STYLE) {
    return client.templateVars.GOVERNANCE_STYLE;
  }

  if (context.type === 'crisis_language' && client.templateVars?.CRISIS_LANGUAGE) {
    return client.templateVars.CRISIS_LANGUAGE;
  }

  if (context.type === 'process_description' && client.templateVars?.PROCESS_MATURITY) {
    return client.templateVars.PROCESS_MATURITY;
  }

  // Client-specific fallbacks
  const clientFallbacks = getClientFallbacks(client.name);
  if (clientFallbacks[contentKey as keyof typeof clientFallbacks]) {
    return clientFallbacks[contentKey as keyof typeof clientFallbacks] as string;
  }

  return context.fallback || '';
}

/**
 * Get client-specific fallback content
 */
function getClientFallbacks(_clientName: string): Record<string, string> {
  // Return generic fallbacks - client-specific content should come from configuration
  return {
    governance_style: 'balanced governance approach',
    team_structure: 'collaborative team structure',
    crisis_language: 'improvement opportunities',
    process_maturity: 'evolving practices with improvement potential',
  };
}

// ---------------------------------------------------------------------------
// Template Variable Resolution
// ---------------------------------------------------------------------------

/**
 * Replace template variables in content based on client configuration
 */
export function replaceTemplateVariables(
  content: string,
  client: ClientConfig | undefined
): string {
  if (!client) {
    return content;
  }

  let result = content;

  // Tool replacements
  result = result.replace(/\{\{TESTING_TOOL\}\}/g, getTestingTool(client));
  result = result.replace(/\{\{TRACKING_TOOL\}\}/g, getTrackingTool(client));
  result = result.replace(/\{\{DOC_SYSTEM\}\}/g, getDocumentationSystem(client));
  result = result.replace(/\{\{VCS_TOOL\}\}/g, getVcsTool(client));
  result = result.replace(/\{\{VCS_CLI\}\}/g, getVcsCli(client));

  // Template variables from client configuration
  if (client.templateVars) {
    Object.entries(client.templateVars).forEach(([key, value]) => {
      const pattern = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(pattern, value);
    });
  }

  return result;
}

/**
 * Check if content contains hardcoded references that should be dynamic
 */
export function detectHardcodedContent(content: string): {
  hasHardcodedTools: boolean;
  hasHardcodedProcess: boolean;
  hardcodedItems: string[];
} {
  const hardcodedPatterns = [
    /\b(TestRail|Cucumber)\b/g,
    /\b(Jira|Linear)\b/g,
    /\bprimera vez\b/gi,
    /\bformal(?:es)?\s/gi,
    /\binformal(?:es)?\s/gi,
  ];

  const hardcodedItems: string[] = [];
  let hasHardcodedTools = false;
  let hasHardcodedProcess = false;

  hardcodedPatterns.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches) {
      hardcodedItems.push(...matches);
      if (index < 2) {
        hasHardcodedTools = true;
      }
      if (index >= 2) {
        hasHardcodedProcess = true;
      }
    }
  });

  return {
    hasHardcodedTools,
    hasHardcodedProcess,
    hardcodedItems: [...new Set(hardcodedItems)],
  };
}
