/**
 * Test Fixture Factory — Complete mock objects for testing
 *
 * This factory provides complete client configuration objects to replace
 * incomplete mocks like `{ name: string }` that cause TS2740 errors.
 *
 * Usage in tests:
 * ```typescript
 * import { createMockClientConfig } from '@/test/fixtures/client-factory';
 *
 * const mockClient = createMockClientConfig({ name: 'custom-test-name' });
 * ```
 */

import type { ClientConfig } from '@/data/schemas/client-schema';

/**
 * Creates a complete mock ClientConfig object with sensible defaults.
 * All properties are populated to avoid TS2740 "missing properties" errors.
 */
export function createMockClientConfig(overrides: Partial<ClientConfig> = {}): ClientConfig {
  return {
    // Client Identity
    name: 'test-client',
    fullName: 'Test Client Organization',
    industry: 'Software Development',
    segment: 'Technology Services',

    // Project Context
    projectCode: 'TEST-001',
    projectName: 'Test LIDR SDLC Implementation',
    domain: 'Software Development Lifecycle Testing',

    // Technical Context
    mainProducts: ['Test Portal', 'Test Management', 'Test Automation'],

    // Regulatory Context
    regulations: ['GDPR', 'ISO 27001'],

    // Domain-Specific Terminology (will be properly merged below)
    domainTerms: {
      sdlc: 'Software Development Lifecycle',
      sprint: 'Development iteration (typically 2 weeks)',
      epic: 'Large feature or initiative broken down into user stories',
      prd: 'Product Requirements Document',
      nfr: 'Non-Functional Requirement',
      dor: 'Definition of Ready',
      dod: 'Definition of Done',
      gate: 'Quality gate for phase transition',
      rtm: 'Requirements Traceability Matrix',
      tracking_tool: 'project management system',
      ...overrides.domainTerms,
    },

    // Branding (will be properly merged below)
    colors: {
      primary: '#4F46E5', // Indigo
      secondary: '#6B7280', // Gray
      accent: '#059669', // Green
      ...overrides.colors,
    },

    // Optional fields
    subdomain: 'test-sdlc.example.com',

    // Template Variables (merge properly with defaults)
    templateVars: {
      CLIENT_REGULATIONS: 'industry-specific compliance requirements for testing',
      STAKEHOLDER_TYPES: 'project stakeholders and team members for testing',
      DOMAIN_SYSTEMS: 'organizational systems and processes for testing',
      SENSITIVE_DATA_TYPE: 'confidential business and project data for testing',
      COMPLIANCE_FRAMEWORK: 'organizational governance and compliance standards for testing',
      GOVERNANCE_STYLE: 'agile governance approach for testing',
      TEAM_STRUCTURE: 'cross-functional teams with clear responsibilities for testing',
      CRISIS_LANGUAGE: 'escalation procedures and incident response protocols for testing',
      TOOL_ECOSYSTEM: 'integrated development and deployment tools for testing environments',
      PROCESS_MATURITY: 'established processes with continuous improvement mindset for testing',
      DELIVERY_PRESSURE: 'balanced delivery pace with quality focus for testing',
      ...overrides.templateVars,
    },

    // Team Configuration (merge properly with defaults)
    team: {
      pme: 1,
      productOwner: 1,
      techLead: 1,
      developers: 3,
      qaLead: 1,
      qaEngineers: 2,
      security: 1,
      devOps: 1,
      scrumMaster: 1,
      ...overrides.team,
    },

    // Apply any remaining overrides (excluding templateVars and team which are handled above)
    ...Object.fromEntries(
      Object.entries(overrides).filter(
        ([key]) => key !== 'templateVars' && key !== 'team' && key !== 'colors'
      )
    ),
  };
}

/**
 * Creates a minimal but valid client config for lightweight tests
 */
export function createMinimalClientConfig(overrides: Partial<ClientConfig> = {}): ClientConfig {
  return createMockClientConfig({
    name: 'minimal-test',
    fullName: 'Minimal Test Client',
    mainProducts: ['Test App'],
    domainTerms: {
      tracking_tool: 'test system',
    },
    ...overrides,
  });
}

/**
 * Creates client config for biometric identity testing scenarios
 */
export function createBiometricClientConfig(overrides: Partial<ClientConfig> = {}): ClientConfig {
  return createMockClientConfig({
    name: 'biometric-test',
    fullName: 'Biometric Test Client',
    industry: 'Biometric Identity Verification',
    segment: 'Identity Verification Services',
    domain: 'Biometric Authentication Testing',
    mainProducts: ['Identity Verification', 'Document Processing', 'Biometric Authentication'],
    regulations: ['GDPR', 'eIDAS', 'ISO 30107'],
    domainTerms: {
      ...createMockClientConfig().domainTerms,
      biometric: 'biological characteristics used for identification',
      verification: 'process of confirming identity claims',
      liveness: 'detection of live person vs presentation attack',
      tracking_tool: 'biometric project management system',
    },
    templateVars: {
      ...createMockClientConfig().templateVars,
      SENSITIVE_DATA_TYPE: 'biometric templates and identity verification data',
      CLIENT_REGULATIONS: 'GDPR Article 9 biometric data protection requirements',
      DOMAIN_SYSTEMS: 'biometric capture devices and verification engines',
    },
    ...overrides,
  });
}

/**
 * Creates client config for fintech testing scenarios
 */
export function createFintechClientConfig(overrides: Partial<ClientConfig> = {}): ClientConfig {
  return createMockClientConfig({
    name: 'fintech-test',
    fullName: 'Fintech Test Client',
    industry: 'Financial Technology',
    segment: 'Digital Banking Services',
    domain: 'Financial Technology Testing',
    mainProducts: ['Digital Banking', 'Payment Processing', 'Risk Assessment'],
    regulations: ['PSD2', 'AML/KYC', 'PCI DSS'],
    domainTerms: {
      ...createMockClientConfig().domainTerms,
      kyc: 'Know Your Customer verification process',
      aml: 'Anti-Money Laundering compliance',
      psd2: 'Payment Services Directive 2',
      tracking_tool: 'financial project management system',
    },
    templateVars: {
      ...createMockClientConfig().templateVars,
      SENSITIVE_DATA_TYPE: 'financial transaction data and customer PII',
      CLIENT_REGULATIONS: 'PSD2 and banking regulation compliance requirements',
      DOMAIN_SYSTEMS: 'core banking systems and payment gateways',
    },
    ...overrides,
  });
}

// Export commonly used mock patterns for easy import
export const mockClients = {
  default: createMockClientConfig,
  minimal: createMinimalClientConfig,
  biometric: createBiometricClientConfig,
  fintech: createFintechClientConfig,
} as const;

/**
 * Legacy compatibility - provides just the name field that older tests expect
 * @deprecated Use createMockClientConfig() for complete type safety
 */
export function createLegacyMockClient(name = 'test-client') {
  return { name };
}
