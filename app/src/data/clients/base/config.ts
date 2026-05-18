/**
 * Base Client Configuration Template
 *
 * This is a base template for creating new client configurations.
 * Replace all placeholder values when creating a new client.
 */

import type { ClientConfig } from '@/data/schemas/client-schema';

export const baseClientConfig: ClientConfig = {
  // Client Identity
  name: 'BaseClient',
  fullName: 'Base Client Template Organization',
  industry: 'Software Development',
  segment: 'Technology Services',

  // Project Context
  projectCode: 'BASE-001',
  projectName: 'LIDR SDLC Implementation',
  domain: 'Software Development Lifecycle',

  // Technical Context
  mainProducts: ['SDLC Portal', 'Project Management', 'Quality Assurance'],

  // Regulatory Context
  regulations: ['GDPR', 'ISO 27001'],

  // Template Variables (generic placeholders)
  templateVars: {
    CLIENT_REGULATIONS: 'industry-specific compliance requirements',
    STAKEHOLDER_TYPES: 'project stakeholders and team members',
    DOMAIN_SYSTEMS: 'organizational systems and processes',
    SENSITIVE_DATA_TYPE: 'confidential business and project data',
    COMPLIANCE_FRAMEWORK: 'organizational governance and compliance standards',

    // Enhanced template variables required by schema
    GOVERNANCE_STYLE: 'agile governance approach',
    TEAM_STRUCTURE: 'cross-functional teams with clear responsibilities',
    CRISIS_LANGUAGE: 'escalation procedures and incident response protocols',
    TOOL_ECOSYSTEM: 'integrated development and deployment tools',
    PROCESS_MATURITY: 'established processes with continuous improvement mindset',
    DELIVERY_PRESSURE: 'balanced delivery pace with quality focus',
  },

  // Domain-Specific Terminology (empty - to be customized)
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
  },

  // Team Configuration (standard small team)
  team: {
    pme: 1,
    productOwner: 1,
    techLead: 1,
    developers: 4,
    qaLead: 1,
    qaEngineers: 2,
    security: 1,
    devOps: 1,
    scrumMaster: 1,
  },

  // Branding (neutral colors)
  colors: {
    primary: '#4F46E5', // Indigo
    secondary: '#6B7280', // Gray
    accent: '#059669', // Green
  },

  // Subdomain (placeholder)
  subdomain: 'sdlc.baseclient.com',
};
