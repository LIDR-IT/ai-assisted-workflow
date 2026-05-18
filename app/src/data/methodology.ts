/**
 * LIDR SDLC Methodology - Our proprietary methodology
 *
 * Replaces "BMAD-inspired" references with LIDR's own systematic approach
 * to software development lifecycle management and AI integration.
 */

export const methodology = {
  // Identity
  name: 'LIDR SDLC Methodology',
  fullName: 'LIDR Software Development Lifecycle Methodology',
  version: '1.0.0',
  developed: 'Q1 2025 - Q4 2025',
  company: 'LIDR Consultorias',

  // Core Principles
  principles: [
    'Spec-Driven Development (SDD)',
    'Docs Travel with Code (DTC)',
    'Automation-First Pattern',
    'Quality Gates Enforcement',
    'AI-Human Collaboration',
    'Self-Contained Architecture',
    'Progressive Disclosure',
    'Retrieval > Pre-training',
  ],

  // Methodology Components
  components: {
    skills: '61 autonomous skills with self-contained architecture',
    commands: '23 orchestrator commands with role-based access',
    rules: '5 identity rules (Tier 1 + Tier 2)',
    gates: '8 formal quality gates (G0-G7)',
    hooks: '4 automated guards (DTC, context, notifications)',
    phases: '8 SDLC phases with clear handoffs',
  },

  // Key Innovations
  innovations: [
    'Self-Contained Skills Architecture (templates/checklists/signoffs integrated)',
    'AI Copilot Integration (Claude Code ecosystem)',
    '775+ hours/year automation ROI measured',
    'Domain-agnostic portability across industries',
    '8 sources of truth synchronization',
    'Memory system with MCP integration',
    'Workflow orchestration with role matrices',
  ],

  // Quality Standards
  qualityStandards: {
    frontmatterCompliance: '100% YAML frontmatter for all artifacts',
    traceability: 'Business Case → PRD → RF → US → Code → Test → Release',
    docsHealthScore: '90%+ target (architecture, rules, project docs)',
    automationCoverage: '9 of 61 skills fully automated',
    ruleCompliance: 'Tier 1 (always) + Tier 2 (on-demand) loading',
    gatePassRate: '85%+ first-time pass rate target',
  },

  // Measurements & ROI
  metrics: {
    totalArtifacts: 195,
    validationScripts: 55,
    integrityTests: 36,
    workflows: 17,
    estimatedROISavings: '775+ hours/year per team',
    scalabilityTarget: '~500 projects (PME portfolio)',
  },

  // Client Application Framework
  applicationFramework: {
    phases: [
      'Project Classification & Domain Research',
      'Team Onboarding & Role Matrix Setup',
      'Ecosystem Installation (.claude/ + docs/)',
      'Client-Specific Customization (domain terms, regulations)',
      'Pilot Implementation (1-2 sprints)',
      'Full Deployment & Training',
      'Continuous Improvement & Metrics Collection',
    ],
    timeToValue: '2-4 weeks (pilot) + 8-12 weeks (full deployment)',
    teamSizeSupport: '5-15 members per team',
    industryAgnostic: true,
  },
} as const;

export type Methodology = typeof methodology;

// Legacy mapping for migration
export const legacyReferences = {
  'BMAD methodology': methodology.name,
  'BMAD-inspired': `${methodology.name} approach`,
  'BMAD Method': methodology.name,
  'BMAD-style': `${methodology.name} standard`,
} as const;
