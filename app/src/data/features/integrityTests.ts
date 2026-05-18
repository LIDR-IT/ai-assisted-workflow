// ═══════════════════════════════════════════════════════════════════════════════
// IntegrityTests Data - Extracted from IntegrityTests.tsx component
// ═══════════════════════════════════════════════════════════════════════════════
//
// This module contains all hardcoded data extracted from IntegrityTests.tsx
// to enable the component refactoring into a test execution architecture:
// - IntegrityTests.tsx (350 lines) - Container principal
// - TestRunner.tsx (120 lines) - Ejecutor tests
// - TestSuite.tsx (100 lines) - Lista de tests paginada
// - TestResults.tsx (80 lines) - Resultados + scoring

import { ecosystemStats } from '@/data/computed/stats';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type TestStatus = 'idle' | 'running' | 'pass' | 'fail' | 'warn';

export interface TestResult {
  id: string;
  name: string;
  category: string;
  status: TestStatus;
  message: string;
  details?: string[];
  duration?: number;
}

export interface TestDefinition {
  id: string;
  name: string;
  category: string;
  type: 'sync' | 'async';
  description: string;
  expectedData?: {
    paths?: string[];
    counts?: Record<string, number>;
    patterns?: string[];
  };
}

export interface TestCategory {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  color: string;
}

export interface TestSummary {
  total: number;
  pass: number;
  fail: number;
  warn: number;
  totalDuration: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPECTED COUNTS - Dynamic values from ecosystem stats (single source of truth)
// ═══════════════════════════════════════════════════════════════════════════════

export const EXPECTED_COUNTS = {
  // DYNAMIC VALUES FROM ecosystemStats (single source of truth)
  skills: ecosystemStats.skills, // 61 (filesystem reality)
  automatedSkills: ecosystemStats.automatedSkills, // 9
  commands: ecosystemStats.commands, // 23
  rules: ecosystemStats.rules, // 5
  hooks: ecosystemStats.hooks, // 4
  mcps: ecosystemStats.mcps, // 4
  checklists: ecosystemStats.checklists, // 0 - integrated into skills
  signoffs: ecosystemStats.signoffs, // 0 - integrated into skills
  templates: ecosystemStats.templates, // 0 - integrated into skills
  validationScripts: ecosystemStats.validationScripts, // 55
  agents: ecosystemStats.agents, // 6
  docs: ecosystemStats.docsSupport, // 41 (from docsSupport)
  total: ecosystemStats.totalArtifacts, // Dynamic computed total (195)
};

// ═══════════════════════════════════════════════════════════════════════════════
// VALID ROLES - Canonical set for the ecosystem
// ═══════════════════════════════════════════════════════════════════════════════

export const VALID_ROLES = new Set([
  'PME',
  'PO',
  'TL',
  'Dev',
  'QA',
  'QA Lead',
  'Sec',
  'Sec Lead',
  'DevOps',
  'SM',
  'UX',
]);

// ═══════════════════════════════════════════════════════════════════════════════
// DOCPATHS - Known document paths for validation
// ═══════════════════════════════════════════════════════════════════════════════

// HelpCenter docPaths - all docPaths registered in HelpCenter that should resolve to files
export const HELPCENTER_DOCPATHS: string[] = [
  // Core
  '.claude/CLAUDE.md',

  // Configuration files
  '.claude/settings.json',
  '.mcp.json',
  '.claude-env',

  // Rules (5)
  '.claude/rules/org.md',
  '.claude/rules/tech-stack.md',
  '.claude/rules/project.md',
  '.claude/rules/documentation.md',
  '.claude/rules/workflows.md',

  // Agents (6)
  '.claude/agents/qa-agent.md',
  '.claude/agents/release-agent.md',
  '.claude/agents/security-agent.md',
  '.claude/agents/onboarding-agent.md',
  '.claude/agents/docs-agent.md',
  '.claude/agents/metrics-agent.md',

  // Hooks (4)
  '.claude/hooks/load-context.sh',
  '.claude/hooks/frontmatter-guard.sh',
  '.claude/hooks/notify.sh',
  '.claude/hooks/validate-ecosystem-counts.sh',

  // Skills (60: 54 core + 3 enhanced + 3 new)
  '.claude/skills/business-case/SKILL.md',
  '.claude/skills/business-model/SKILL.md',
  '.claude/skills/kickoff/SKILL.md',
  '.claude/skills/stakeholder-map/SKILL.md',
  '.claude/skills/tracking-integration/SKILL.md',
  '.claude/skills/prd-tecnico/SKILL.md',
  '.claude/skills/prd-funcional/SKILL.md',
  '.claude/skills/review-cruzado/SKILL.md',
  '.claude/skills/risk-log/SKILL.md',
  '.claude/skills/poc-report/SKILL.md',
  '.claude/skills/domain-research/SKILL.md',
  '.claude/skills/technical-research/SKILL.md',
  '.claude/skills/generate-rf/SKILL.md',
  '.claude/skills/generate-nfr/SKILL.md',
  '.claude/skills/validate-requirements/SKILL.md',
  '.claude/skills/epic-breakdown/SKILL.md',
  '.claude/skills/bdd-patterns/SKILL.md',
  '.claude/skills/user-stories/SKILL.md',
  '.claude/skills/sprint-capacity/SKILL.md',
  '.claude/skills/refinement-notes/SKILL.md',
  '.claude/skills/pr-description/SKILL.md',
  '.claude/skills/adr/SKILL.md',
  '.claude/skills/tech-debt/SKILL.md',
  '.claude/skills/dev-handoff-qa/SKILL.md',
  '.claude/skills/test-plan/SKILL.md',
  '.claude/skills/create-test-cases/SKILL.md',
  '.claude/skills/bug-report/SKILL.md',
  '.claude/skills/test-execution-report/SKILL.md',
  '.claude/skills/regression-suite/SKILL.md',
  '.claude/skills/vuln-assessment/SKILL.md',
  '.claude/skills/dast-interpretation/SKILL.md',
  '.claude/skills/design-doc/SKILL.md',
  '.claude/skills/pentest-report/SKILL.md',
  '.claude/skills/security-checklist/SKILL.md',
  '.claude/skills/change-request/SKILL.md',
  '.claude/skills/rollback-plan/SKILL.md',
  '.claude/skills/release-notes/SKILL.md',
  '.claude/skills/retrospective/SKILL.md',
  '.claude/skills/postmortem/SKILL.md',
  '.claude/skills/generate-rule/SKILL.md',
  '.claude/skills/architecture-doc/SKILL.md',
  '.claude/skills/ux-design-spec/SKILL.md',
  '.claude/skills/implementation-phases/SKILL.md',
  '.claude/skills/epic-review/SKILL.md',
  '.claude/skills/use-cases/SKILL.md',
  '.claude/skills/audit-standards/SKILL.md',
  '.claude/skills/multi-agent-audit/SKILL.md',
  '.claude/skills/playwright-cli/SKILL.md',
  '.claude/skills/brainstorming/SKILL.md',
  '.claude/skills/document-discovery/SKILL.md',
  '.claude/skills/project-classifier/SKILL.md',

  // Development skills (6)
  '.claude/skills/skill-creator/SKILL.md',
  '.claude/skills/skill-development/SKILL.md',
  '.claude/skills/command-development/SKILL.md',
  '.claude/skills/hook-development/SKILL.md',
  '.claude/skills/agent-development/SKILL.md',
  '.claude/skills/mcp-integration/SKILL.md',

  // Enhanced Skills (3)
  '.claude/skills/automated-handoffs/SKILL.md',
  '.claude/skills/external-sync/SKILL.md',
  '.claude/skills/sdlc-tracking/SKILL.md',

  // Commands (23)
  '.claude/commands/advance-gate.md',
  '.claude/commands/check-readiness.md',
  '.claude/commands/course-correct.md',
  '.claude/commands/implement-ticket.md',
  '.claude/commands/prepare-testing.md',
  '.claude/commands/validate-requirements.md',
  '.claude/commands/validate-prd.md',
  '.claude/commands/init-project-docs.md',
  '.claude/commands/validate-project-docs.md',
  '.claude/commands/document-project.md',
  '.claude/commands/create-branch.md',
  '.claude/commands/create-pr.md',
  '.claude/commands/product-brief.md',
  '.claude/commands/quick-spec.md',
  '.claude/commands/sprint-health.md',
  '.claude/commands/create-release-notes.md',
  '.claude/commands/update-changelog.md',
  '.claude/commands/sync-docs.md',
  '.claude/commands/lidr-help.md',
  '.claude/commands/quick-dev.md',

  // Enhanced Commands (3)
  '.claude/commands/create-branch-enhanced.md',
  '.claude/commands/create-pr-enhanced.md',
  '.claude/commands/track-sdlc.md',

  // Docs/Standards
  'docs/adr/ADR-0001-context-loading-strategy.md',
  'docs/adr/ADR-0002-react-flow-interactive-diagrams.md',
  'docs/adr/ADR-0003-tailwind-css-v4-configuration.md',
  'docs/adr/ADR-0005-multi-client-architecture.md',
  'docs/adr/ADR-0006-test-strategy.md',
  'docs/guides/claude-code/README.md',
  'docs/guides/claude-code/agent-development.md',
  'docs/guides/claude-code/command-development.md',
  'docs/guides/claude-code/hook-development.md',
  'docs/guides/claude-code/mcp-integration.md',
  'docs/guides/claude-code/rule-development.md',
  'docs/guides/claude-code/skill-development-guide.md',
  'docs/guides/claude-code/skill-template-architecture.md',
  'docs/guides/client-creation-guide.md',
  'docs/guides/developer-guide.md',
  'docs/guides/user-setup-guide.md',
  'docs/hooks/README.md',
  'docs/hooks/load-context.md',
  'docs/hooks/validate-ecosystem-counts.md',
  'docs/hooks/dtc-write-guard.md',
  'docs/hooks/notify.md',
  'docs/settings-reference.md',
  'docs/standards/hooks-strategy.md',
  'docs/standards/org.md',
  'docs/standards/sprint-commitment.md',
  'docs/standards/tool-integrations.md',
  'docs/standards/testing/unit-testing-guide.md',
  'docs/standards/testing/visual-regression-testing.md',

  // Guidelines
  'guidelines/Guidelines.md',
];

// SitemapView docPaths - all docPaths in SitemapView
export const SITEMAP_DOCPATHS: string[] = [
  '.claude/CLAUDE.md',

  // Agents (6) - same as HELPCENTER_DOCPATHS
  ...HELPCENTER_DOCPATHS.filter((path) => path.includes('/agents/')),

  // Rules (5)
  '.claude/rules/org.md',
  '.claude/rules/tech-stack.md',
  '.claude/rules/project.md',
  '.claude/rules/documentation.md',
  '.claude/rules/workflows.md',

  // Skills (57: 54 core + 3 enhanced) - same as HELPCENTER_DOCPATHS
  ...HELPCENTER_DOCPATHS.filter((path) => path.includes('/skills/')),

  // Commands (23) - same as HELPCENTER_DOCPATHS
  ...HELPCENTER_DOCPATHS.filter((path) => path.includes('/commands/')),

  // Hooks (2 actual shell scripts on disk)
  '.claude/hooks/load-context.sh',
  '.claude/hooks/frontmatter-guard.sh',

  // Docs/Standards
  'docs/adr/ADR-0001-context-loading-strategy.md',
  'docs/adr/ADR-0002-react-flow-interactive-diagrams.md',
  'docs/adr/ADR-0003-tailwind-css-v4-configuration.md',
  'docs/guides/claude-code/README.md',
  'docs/guides/claude-code/agent-development.md',
  'docs/guides/claude-code/command-development.md',
  'docs/guides/claude-code/hook-development.md',
  'docs/guides/claude-code/mcp-integration.md',
  'docs/guides/claude-code/rule-development.md',
  'docs/guides/claude-code/skill-development-guide.md',
  'docs/guides/claude-code/skill-template-architecture.md',
  'docs/hooks/README.md',
  'docs/hooks/load-context.md',
  'docs/hooks/validate-ecosystem-counts.md',
  'docs/hooks/dtc-write-guard.md',
  'docs/hooks/notify.md',
  'docs/settings-reference.md',
  'docs/standards/hooks-strategy.md',
  'docs/standards/org.md',
  'docs/standards/sprint-commitment.md',
  'docs/standards/tool-integrations.md',
];

// ═══════════════════════════════════════════════════════════════════════════════
// TEST CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════════

export const TEST_CATEGORIES: TestCategory[] = [
  {
    id: 'data-integrity',
    name: 'Integridad de Datos',
    description: 'Verificación de que todos los paths documentados resuelven a archivos reales',
    icon: 'ShieldCheck',
    color: 'emerald',
  },
  {
    id: 'cross-reference',
    name: 'Cross-Referencia',
    description: 'Consistencia entre diferentes fuentes de datos del ecosistema',
    icon: 'Brain',
    color: 'blue',
  },
  {
    id: 'legacy-cleanup',
    name: 'Legacy Cleanup',
    description: 'Detección de archivos o patrones obsoletos que deben eliminarse',
    icon: 'FileText',
    color: 'amber',
  },
  {
    id: 'naming-convention',
    name: 'Naming Convention',
    description: 'Verificación de que todos los archivos siguen las convenciones de nomenclatura',
    icon: 'Terminal',
    color: 'purple',
  },
  {
    id: 'counters',
    name: 'Contadores',
    description: 'Validación de que los contadores de artefactos son correctos',
    icon: 'Zap',
    color: 'orange',
  },
  {
    id: 'coverage',
    name: 'Cobertura',
    description: 'Verificación de cobertura completa del ecosistema',
    icon: 'Cable',
    color: 'teal',
  },
  {
    id: 'relational-validation',
    name: 'Validacion Relacional',
    description: 'Validación de relaciones entre diferentes elementos del ecosistema',
    icon: 'Link2',
    color: 'indigo',
  },
  {
    id: 'content-validation',
    name: 'Validacion de Contenido',
    description: 'Verificación del contenido interno de los archivos',
    icon: 'Search',
    color: 'pink',
  },
  {
    id: 'ecosystem-health',
    name: 'Salud del Ecosistema',
    description: 'Métricas generales de salud y completitud del ecosistema',
    icon: 'Workflow',
    color: 'cyan',
  },
  {
    id: 'sanity-check',
    name: 'Sanity Check',
    description: 'Verificaciones básicas de consistencia y lógica',
    icon: 'Users',
    color: 'green',
  },
  {
    id: 'dtc-traceability',
    name: 'Trazabilidad DTC',
    description: 'Documentation Travel With Code compliance verification',
    icon: 'Link2',
    color: 'red',
  },
  {
    id: 'agents',
    name: 'Agents',
    description: 'Verificación de compliance de especificaciones de agents',
    icon: 'Users',
    color: 'slate',
  },
  {
    id: 'cross-cutting',
    name: 'Cross-cutting',
    description: 'Verificaciones transversales del ecosistema',
    icon: 'Link2',
    color: 'gray',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// TEST DEFINITIONS - 32 tests total (T1-T32)
// ═══════════════════════════════════════════════════════════════════════════════

export const TEST_DEFINITIONS: TestDefinition[] = [
  // Sync Tests (T1-T32)
  {
    id: 't1',
    name: 'HelpCenter docPaths resuelven a archivos reales',
    category: 'data-integrity',
    type: 'sync',
    description:
      'Verifica que todos los docPaths en HelpCenter resuelven a archivos del filesystem',
    expectedData: {
      paths: HELPCENTER_DOCPATHS,
    },
  },
  {
    id: 't2',
    name: 'SitemapView docPaths resuelven a archivos reales',
    category: 'data-integrity',
    type: 'sync',
    description:
      'Verifica que todos los docPaths en SitemapView resuelven a archivos del filesystem',
    expectedData: {
      paths: SITEMAP_DOCPATHS,
    },
  },
  {
    id: 't3',
    name: 'Triple match: HelpCenter skills = SitemapView skills = Filesystem',
    category: 'cross-reference',
    type: 'sync',
    description: 'Verifica simetría perfecta entre skills en HelpCenter, SitemapView y Filesystem',
  },
  {
    id: 't4',
    name: 'Cero archivos SKILLS.md legacy (plural)',
    category: 'legacy-cleanup',
    type: 'sync',
    description: 'Detecta y reporta archivos legacy con naming incorrecto',
    expectedData: {
      patterns: ['SKILLS.md'],
    },
  },
  {
    id: 't5',
    name: 'Todos los skills usan SKILL.md (singular)',
    category: 'naming-convention',
    type: 'sync',
    description: 'Verifica convención de nomenclatura para archivos de skills',
    expectedData: {
      patterns: ['**/skills/*/SKILL.md'],
    },
  },
  {
    id: 't6',
    name: 'Conteo de artefactos HelpCenter = esperado (10 tipos)',
    category: 'counters',
    type: 'sync',
    description:
      'Valida que los contadores de HelpCenter coinciden con los esperados del ecosistema',
    expectedData: {
      counts: EXPECTED_COUNTS,
    },
  },
  {
    id: 't7',
    name: 'Sin docPaths duplicados en HelpCenter',
    category: 'data-integrity',
    type: 'sync',
    description: 'Detecta docPaths duplicados que pueden causar inconsistencias',
  },
  {
    id: 't8',
    name: 'Sin docPaths duplicados en SitemapView',
    category: 'data-integrity',
    type: 'sync',
    description: 'Detecta docPaths duplicados en SitemapView',
  },
  {
    id: 't9',
    name: 'Sin documentos huerfanos en filesystem (no registrados)',
    category: 'coverage',
    type: 'sync',
    description:
      'Encuentra archivos .md en filesystem que no están registrados en HelpCenter ni SitemapView',
  },
  {
    id: 't10',
    name: 'MarkdownViewer glob coverage',
    category: 'coverage',
    type: 'sync',
    description:
      'Verifica que todos los archivos necesarios están cubiertos por los globs de MarkdownViewer',
  },
  {
    id: 't11',
    name: 'HelpCenter <-> SitemapView symmetry for shared docPaths',
    category: 'cross-reference',
    type: 'sync',
    description:
      'Valida simetría entre HelpCenter y SitemapView para tipos core (skills, rules, commands)',
  },
  {
    id: 't12',
    name: 'Available filesystem docs count',
    category: 'counters',
    type: 'sync',
    description: 'Cuenta y valida número total de documentos disponibles en filesystem',
  },
  {
    id: 't13',
    name: 'Frontmatter YAML valido en todos los SKILL.md',
    category: 'content-validation',
    type: 'async',
    description: 'Verifica que todos los archivos SKILL.md tienen frontmatter YAML válido',
  },
  {
    id: 't14',
    name: 'Frontmatter YAML valido en todos los command .md',
    category: 'content-validation',
    type: 'async',
    description:
      'Verifica que todos los archivos de commands tienen frontmatter YAML válido con description',
  },
  {
    id: 't15',
    name: 'relatedSkills ref to valid skill IDs',
    category: 'relational-validation',
    type: 'sync',
    description: 'Verifica que todas las referencias relatedSkills apuntan a skill IDs válidos',
  },
  {
    id: 't16',
    name: 'Workflow artifact refs resolve to real artifact IDs',
    category: 'relational-validation',
    type: 'sync',
    description: 'Valida que las referencias de artefactos en workflows existen realmente',
  },
  {
    id: 't17',
    name: 'Triple match for commands (HC = SM = FS)',
    category: 'cross-reference',
    type: 'sync',
    description:
      'Verifica simetría perfecta entre commands en HelpCenter, SitemapView y Filesystem',
  },
  {
    id: 't18',
    name: 'Triple match for docs (checklists + signoffs + templates)',
    category: 'cross-reference',
    type: 'sync',
    description: 'Verifica consistencia de documentos de apoyo entre fuentes',
  },
  {
    id: 't19',
    name: 'Roles consistency — all roles in valid set',
    category: 'sanity-check',
    type: 'sync',
    description: 'Verifica que todos los roles usados están en el set de roles válidos',
    expectedData: {
      patterns: Array.from(VALID_ROLES),
    },
  },
  {
    id: 't20',
    name: 'Workflow coverage by SDLC phase (0-7)',
    category: 'ecosystem-health',
    type: 'sync',
    description: 'Verifica que cada fase SDLC (0-7) tiene workflows asociados',
  },
  {
    id: 't21',
    name: 'Gate contribution coverage — every gate 0-7 has >= 1 skill',
    category: 'ecosystem-health',
    type: 'sync',
    description: 'Verifica que cada gate del SDLC tiene al menos un skill que contribuye',
  },
  {
    id: 't22',
    name: 'Trigger uniqueness — intra-type duplicates are problematic, cross-type are healthy',
    category: 'sanity-check',
    type: 'sync',
    description: 'Analiza unicidad de triggers y detecta problemas potenciales',
  },
  {
    id: 't23',
    name: 'Repo-structure checklist covers all required categories',
    category: 'coverage',
    type: 'sync',
    description:
      'Verifica que el checklist de repo-structure cubre todas las categorías necesarias',
  },
  {
    id: 't24',
    name: 'Governance templates (README, CONTRIBUTING, SECURITY, CHANGELOG) registered',
    category: 'coverage',
    type: 'sync',
    description: 'Verifica que todos los templates de governance están registrados',
  },
  {
    id: 't25',
    name: 'Every filesystem doc is referenced by ≥1 HelpCenter artifact',
    category: 'coverage',
    type: 'sync',
    description: 'Detecta documentos en filesystem que no están referenciados',
  },
  {
    id: 't26',
    name: 'Document Ownership Matrix — every doc with docPath has owner via artifact type',
    category: 'sanity-check',
    type: 'sync',
    description:
      'Verifica que cada documento tiene un owner claro definido por su tipo de artefacto',
  },
  {
    id: 't27',
    name: 'Agent Spec Compliance — every agent .md has required frontmatter fields',
    category: 'agents',
    type: 'sync',
    description: 'Verifica que todos los agents tienen frontmatter completo según spec',
  },
  {
    id: 't28',
    name: 'Rule Ecosystem Completeness — validate rule tooling exists',
    category: 'cross-cutting',
    type: 'sync',
    description: 'Verifica que el ecosistema de rules está completo con herramientas necesarias',
  },
  {
    id: 't29',
    name: 'Stats Synchronization (simple-stats.ts vs EXPECTED_COUNTS)',
    category: 'counters',
    type: 'sync',
    description: 'Verifica sincronización entre simple-stats.ts y EXPECTED_COUNTS',
  },
  {
    id: 't30',
    name: 'Automation Scripts Existence',
    category: 'cross-cutting',
    type: 'sync',
    description: 'Verifica que todos los scripts de automatización prometidos existen',
  },
  {
    id: 't31',
    name: 'ROI Calculation Consistency',
    category: 'cross-cutting',
    type: 'sync',
    description: 'Valida consistencia en los cálculos de ROI reportados',
  },
  {
    id: 't32',
    name: 'Documentation Travel With Code (DTC) Compliance',
    category: 'dtc-traceability',
    type: 'sync',
    description: 'Verifica compliance con reglas DTC del ecosistema',
  },
  {
    id: 't33',
    name: 'Coherence Validation Test',
    category: 'ecosystem-health',
    type: 'async',
    description: 'Ejecuta validate:coherence para detectar drift en datos hardcodeados',
  },
  {
    id: 't34',
    name: 'Client Registry Integrity Test',
    category: 'ecosystem-health',
    type: 'sync',
    description: 'Verifica configuración completa de todos los clientes registrados',
  },
  {
    id: 't35',
    name: 'Route Configuration Test',
    category: 'ecosystem-health',
    type: 'sync',
    description: 'Valida que todas las rutas tienen componentes válidos y funcionales',
  },
  {
    id: 't36',
    name: 'Data Source Sync Test',
    category: 'cross-reference',
    type: 'sync',
    description: 'Verifica sincronización entre HelpCenter, SitemapView y MarkdownViewer',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function getTestsByCategory(categoryId: string): TestDefinition[] {
  return TEST_DEFINITIONS.filter((test) => test.category === categoryId);
}

export function getTestById(id: string): TestDefinition | undefined {
  return TEST_DEFINITIONS.find((test) => test.id === id);
}

export function getSyncTests(): TestDefinition[] {
  return TEST_DEFINITIONS.filter((test) => test.type === 'sync');
}

export function getAsyncTests(): TestDefinition[] {
  return TEST_DEFINITIONS.filter((test) => test.type === 'async');
}

export function getCategoryById(id: string): TestCategory | undefined {
  return TEST_CATEGORIES.find((category) => category.id === id);
}

export function getStatusColor(status: TestStatus): string {
  switch (status) {
    case 'pass':
      return 'bg-emerald-50 border-emerald-200';
    case 'fail':
      return 'bg-red-50 border-red-200';
    case 'warn':
      return 'bg-amber-50 border-amber-200';
    case 'running':
      return 'bg-blue-50 border-blue-200';
    default:
      return 'bg-slate-50 border-slate-200';
  }
}

export function getCategoryColor(categoryId: string): string {
  const category = getCategoryById(categoryId);
  return category?.color || 'slate';
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST EXECUTION CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

export const TEST_EXECUTION_CONFIG = {
  /** Number of tests shown in placeholder during loading */
  PLACEHOLDER_COUNT: 32,
  /** Page size for paginated test display */
  TESTS_PER_PAGE: 10,
  /** Default timeout for async tests in ms */
  ASYNC_TEST_TIMEOUT: 5000,
  /** Categories that support real-time execution */
  REAL_TIME_CATEGORIES: ['data-integrity', 'counters', 'coverage'],
  /** Maximum details items shown per test */
  MAX_DETAILS_ITEMS: 50,
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  TEST_DEFINITIONS,
  TEST_CATEGORIES,
  EXPECTED_COUNTS,
  VALID_ROLES,
  HELPCENTER_DOCPATHS,
  SITEMAP_DOCPATHS,
  TEST_EXECUTION_CONFIG,
};
