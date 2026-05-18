/**
 * useClientConfig Hook — React hook for accessing client configuration
 *
 * This hook provides React components with convenient access to client
 * configuration data, including computed properties and type-safe access
 * to specific configuration sections.
 *
 * Features:
 * - Type-safe access to all client configuration properties
 * - Computed properties for common use cases
 * - Automatic updates when client changes
 * - Template variable resolution helpers
 * - Industry-specific configuration access
 * - Performance optimized with memoization
 *
 * Part of the Phase 1 infrastructure for multi-client JSON architecture.
 */

import { useMemo } from 'react';
import { useCurrentClient } from './useClientRegistry';
import type { ClientConfig } from '@/data/client-registry';
import { inferIndustryId, getIndustryPack } from '@/data/template-engine';
import type { IndustryPack } from '@/data/industries';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Computed client information */
export interface ComputedClientInfo {
  /** Total team size */
  readonly totalTeamSize: number;

  /** Developer to QA ratio */
  readonly devToQaRatio: number;

  /** Whether the team has leadership roles */
  readonly hasLeadership: boolean;

  /** Whether the team is large (>10 people) */
  readonly isLargeTeam: boolean;

  /** Primary domain expertise areas */
  readonly expertiseAreas: readonly string[];

  /** Inferred industry pack ID */
  readonly industryPackId: string;

  /** Associated industry pack */
  readonly industryPack: IndustryPack | null;

  /** Whether this is a regulated industry */
  readonly isRegulatedIndustry: boolean;

  /** Key regulatory frameworks */
  readonly keyRegulations: readonly string[];
}

/** Client branding helpers */
export interface ClientBranding {
  /** Primary color as CSS custom property */
  readonly primaryColorVar: string;

  /** Secondary color as CSS custom property */
  readonly secondaryColorVar: string;

  /** Accent color as CSS custom property */
  readonly accentColorVar: string;

  /** All colors as CSS custom properties object */
  readonly colorVars: Record<string, string>;

  /** Subdomain URL if available */
  readonly subdomainUrl: string | null;

  /** Company initials */
  readonly initials: string;
}

/** Template variables access */
export interface TemplateVariableAccess {
  /** All template variables as key-value pairs */
  readonly variables: Record<string, string>;

  /** Get a specific template variable */
  readonly getVariable: (key: keyof ClientConfig['templateVars']) => string;

  /** Check if a variable is set */
  readonly hasVariable: (key: keyof ClientConfig['templateVars']) => boolean;

  /** Get industry-specific variables merged with client variables */
  readonly getMergedVariables: () => Record<string, string>;
}

/** Return type for useClientConfig hook */
export interface UseClientConfigReturn {
  /** Current client configuration */
  readonly config: ClientConfig;

  /** Current client ID */
  readonly clientId: string;

  /** Computed client information */
  readonly computed: ComputedClientInfo;

  /** Branding helpers */
  readonly branding: ClientBranding;

  /** Template variables access */
  readonly templateVars: TemplateVariableAccess;

  /** Check if the current client matches a specific client ID */
  readonly isClient: (clientId: string) => boolean;

  /** Check if the client belongs to a specific industry */
  readonly isIndustry: (industryKeyword: string) => boolean;

  /** Check if a specific regulation applies */
  readonly hasRegulation: (regulation: string) => boolean;

  /** Get domain term by key */
  readonly getDomainTerm: (key: string) => string | undefined;

  /** Check if domain term exists */
  readonly hasDomainTerm: (key: string) => boolean;
}

// ---------------------------------------------------------------------------
// Hook Implementation
// ---------------------------------------------------------------------------

/**
 * React hook for accessing client configuration with computed properties.
 *
 * This hook provides a comprehensive interface to client configuration data,
 * including computed properties and helper functions for common use cases.
 *
 * @returns Object with client configuration and helper functions
 *
 * @example
 * ```tsx
 * function ClientHeader() {
 *   const { config, computed, branding, templateVars } = useClientConfig();
 *
 *   return (
 *     <header style={{ backgroundColor: branding.colorVars['--primary-color'] }}>
 *       <h1>{config.name}</h1>
 *       <p>{config.industry} | {computed.totalTeamSize} team members</p>
 *       <div>Compliance: {templateVars.getVariable('COMPLIANCE_FRAMEWORK')}</div>
 *     </header>
 *   );
 * }
 * ```
 */
export function useClientConfig(): UseClientConfigReturn {
  const { clientId, client: config } = useCurrentClient();

  // Computed client information
  const computed = useMemo<ComputedClientInfo>(() => {
    const totalTeamSize = Object.values(config.team).reduce((sum, count) => sum + count, 0);

    const devToQaRatio =
      config.team.qaEngineers > 0 ? config.team.developers / config.team.qaEngineers : Infinity;

    const hasLeadership =
      config.team.techLead > 0 || config.team.pme > 0 || config.team.productOwner > 0;

    const isLargeTeam = totalTeamSize > 10;

    // Extract expertise areas from main products
    const expertiseAreas = config.mainProducts
      .map((product) => product.toLowerCase())
      .filter((product, index, array) => array.indexOf(product) === index); // Remove duplicates

    // Industry pack information
    const industryPackId = inferIndustryId(config);
    const industryPack = getIndustryPack(industryPackId) ?? null;

    // Regulation analysis
    const regulatedIndustryKeywords = [
      'healthcare',
      'financial',
      'banking',
      'government',
      'biometric',
    ];
    const isRegulatedIndustry = regulatedIndustryKeywords.some(
      (keyword) =>
        config.industry.toLowerCase().includes(keyword) ||
        config.segment.toLowerCase().includes(keyword)
    );

    const keyRegulations = config.regulations
      .filter((reg) =>
        ['GDPR', 'HIPAA', 'PSD2', 'SOX', 'eIDAS', 'CCPA'].some((key) => reg.includes(key))
      )
      .slice(0, 3); // Limit to top 3 key regulations

    return {
      totalTeamSize,
      devToQaRatio,
      hasLeadership,
      isLargeTeam,
      expertiseAreas,
      industryPackId,
      industryPack,
      isRegulatedIndustry,
      keyRegulations,
    };
  }, [config]);

  // Client branding helpers
  const branding = useMemo<ClientBranding>(() => {
    const primaryColorVar = `--client-primary-color: ${config.colors.primary}`;
    const secondaryColorVar = `--client-secondary-color: ${config.colors.secondary}`;
    const accentColorVar = `--client-accent-color: ${config.colors.accent}`;

    const colorVars = {
      '--primary-color': config.colors.primary,
      '--secondary-color': config.colors.secondary,
      '--accent-color': config.colors.accent,
    };

    const subdomainUrl = config.subdomain ? `https://${config.subdomain}` : null;

    // Generate initials from company name
    const initials = config.name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 3); // Limit to 3 characters

    return {
      primaryColorVar,
      secondaryColorVar,
      accentColorVar,
      colorVars,
      subdomainUrl,
      initials,
    };
  }, [config]);

  // Template variables access
  const templateVars = useMemo<TemplateVariableAccess>(() => {
    const variables = { ...config.templateVars };

    const getVariable = (key: keyof ClientConfig['templateVars']): string => {
      return variables[key] || '';
    };

    const hasVariable = (key: keyof ClientConfig['templateVars']): boolean => {
      return Boolean(variables[key]);
    };

    const getMergedVariables = (): Record<string, string> => {
      const merged: Record<string, string> = {};

      // Add derived variables
      merged.CLIENT_NAME = config.name;
      merged.CLIENT_FULL_NAME = config.fullName;
      merged.CLIENT_CODE = config.projectCode.toLowerCase();
      merged.PROJECT_NAME = config.projectName;
      merged.DOMAIN = config.domain;
      merged.INDUSTRY = config.industry;

      // Add industry pack variables if available
      if (computed.industryPack) {
        Object.assign(merged, computed.industryPack.domainTerms);
      }

      // Add client-specific variables (highest priority)
      Object.assign(merged, variables);

      return merged;
    };

    return {
      variables,
      getVariable,
      hasVariable,
      getMergedVariables,
    };
  }, [config, computed.industryPack]);

  // Helper functions
  const isClient = useMemo(
    () =>
      (targetClientId: string): boolean =>
        clientId.toLowerCase() === targetClientId.toLowerCase(),
    [clientId]
  );

  const isIndustry = useMemo(
    () =>
      (industryKeyword: string): boolean => {
        const keyword = industryKeyword.toLowerCase();
        return (
          config.industry.toLowerCase().includes(keyword) ||
          config.segment.toLowerCase().includes(keyword) ||
          config.domain.toLowerCase().includes(keyword)
        );
      },
    [config.industry, config.segment, config.domain]
  );

  const hasRegulation = useMemo(
    () =>
      (regulation: string): boolean => {
        return config.regulations.some((reg) =>
          reg.toLowerCase().includes(regulation.toLowerCase())
        );
      },
    [config.regulations]
  );

  const getDomainTerm = useMemo(
    () =>
      (key: string): string | undefined =>
        config.domainTerms?.[key],
    [config.domainTerms]
  );

  const hasDomainTerm = useMemo(
    () =>
      (key: string): boolean =>
        config.domainTerms ? key in config.domainTerms : false,
    [config.domainTerms]
  );

  // Return the hook interface
  return {
    config,
    clientId,
    computed,
    branding,
    templateVars,
    isClient,
    isIndustry,
    hasRegulation,
    getDomainTerm,
    hasDomainTerm,
  };
}

// ---------------------------------------------------------------------------
// Convenience Hooks
// ---------------------------------------------------------------------------

/**
 * Hook that only returns client branding information.
 * Useful for styling components based on client branding.
 */
export function useClientBranding(): ClientBranding {
  const { branding } = useClientConfig();
  return branding;
}

/**
 * Hook that only returns computed client information.
 * Useful for displaying client statistics and insights.
 */
export function useClientComputed(): ComputedClientInfo {
  const { computed } = useClientConfig();
  return computed;
}

/**
 * Hook for checking client industry and regulations.
 * Useful for conditional rendering based on client type.
 */
export function useClientChecks(): {
  readonly isClient: (clientId: string) => boolean;
  readonly isIndustry: (industryKeyword: string) => boolean;
  readonly hasRegulation: (regulation: string) => boolean;
} {
  const { isClient, isIndustry, hasRegulation } = useClientConfig();

  return {
    isClient,
    isIndustry,
    hasRegulation,
  };
}

/**
 * Hook for accessing template variables.
 * Useful for components that need to display client-specific text.
 */
export function useTemplateVariables(): TemplateVariableAccess {
  const { templateVars } = useClientConfig();
  return templateVars;
}
