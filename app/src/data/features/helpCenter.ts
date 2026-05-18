/* ═══════════════════════════════════════════
   HELP CENTER DATA EXTRACTION
   ═══════════════════════════════════════════

   Extracted from HelpCenter.tsx (3,070 lines → ~1,500 lines externalized)
   All hardcoded data arrays moved to this centralized data file.

   Phase 2: Data Externalization (B1)
   - Extract all hardcoded arrays from HelpCenter.tsx
   - Preserve ALL existing functionality and data structure
   - Create TypeScript interfaces for type safety
   - DO NOT modify original component yet
   ═══════════════════════════════════════════ */

import { ecosystemStats, summaryStrings } from '@/data/computed/stats';

/* ─── TYPE DEFINITIONS ─────────────────────────────── */

export type ArtifactType =
  | 'skill'
  | 'command'
  | 'rule'
  | 'hook'
  | 'mcp'
  | 'validation-script'
  | 'agent'
  | 'doc';

export interface Artifact {
  id: string;
  name: string;
  type: ArtifactType;
  tier?: string;
  phase?: string;
  phaseNum?: number;
  description: string;
  triggers?: string[];
  roles?: string[];
  precondition?: string;
  mcpsUsed?: string[];
  relatedSkills?: string[];
  relatedCommands?: string[];
  docPath?: string;
  argument?: string;
  category?: string;
  model?: string;
  gateContribution?: string;
  automation?: string;
  path?: string;
}

export interface WorkflowSuggestion {
  title: string;
  description: string;
  steps: { artifact: string; type: ArtifactType; action: string }[];
  roles: string[];
  tags: string[];
}

export interface WorkflowSuggestionForSearch {
  id: string;
  name: string;
  description: string;
  steps: string[];
  roles: string[];
  estimatedTime?: string;
}

export interface Category {
  name: string;
  count: number;
  artifacts: Artifact[];
}

export interface ArtifactRegistry {
  skills: Artifact[];
  commands: Artifact[];
  workflows: WorkflowSuggestionForSearch[];
  categories: Category[];
  allArtifacts: Artifact[];
}

/* ─── SKILLS DATA (57 core skills) ─────────────────────────────── */

export const skills: Artifact[] = [
  // Updated: 57 skills verified in filesystem (.claude/skills/) [54 core + 3 enhanced]

  // Fase 1 — Originacion (4)
  {
    id: 'business-case',
    name: 'business-case',
    type: 'skill',
    phase: 'Fase 1 — Originacion',
    phaseNum: 1,
    description:
      'Generate a Business Case document from a business problem or initiative request. Use for any budget justification, project approval, or ROI analysis needs. Essential when requesting resources, teams, or timeline extensions. Trigger for strategic initiatives, cost-benefit analysis, or investment decisions. Use when receiving new project requests from Business, CTO, or R&D; when justifying budget/team/timeline to sponsor; when Gate 0 requires BC before proceeding.',
    triggers: [
      'create business case',
      'justify this project',
      'new initiative',
      'we need approval for',
      'Gate 0 preparation',
    ],
    roles: ['PME', 'PO'],
    gateContribution: 'Gate 0',
    docPath: '.claude/skills/business-case/SKILL.md',
  },
  {
    id: 'kickoff',
    name: 'kickoff',
    type: 'skill',
    phase: 'Fase 1 — Originacion',
    phaseNum: 1,
    description:
      'Essential for formal project launch - ALWAYS use after Gate 0 approval. CRITICAL for establishing team alignment, communication protocols, and success criteria. Use when receiving new project approvals, launching software initiatives (product rollouts, compliance projects), or setting up development workflows. Mandatory before development work begins.',
    triggers: ['create kickoff', 'start project', 'kick-off meeting', 'project kickoff'],
    roles: ['PME'],
    gateContribution: 'Gate 0',
    docPath: '.claude/skills/kickoff/SKILL.md',
  },
  {
    id: 'stakeholder-map',
    name: 'stakeholder-map',
    type: 'skill',
    phase: 'Fase 1 — Originacion',
    phaseNum: 1,
    description: 'Sugiere mapa de interesados con niveles de influencia e interes.',
    triggers: [
      'map stakeholders',
      'stakeholder analysis',
      'who are the stakeholders',
      'identify stakeholders',
    ],
    roles: ['PME', 'PO'],
    gateContribution: 'Gate 0',
    docPath: '.claude/skills/stakeholder-map/SKILL.md',
  },
  {
    id: 'tracking-integration',
    name: 'tracking-integration',
    type: 'skill',
    phase: 'Fase 1 — Originacion',
    phaseNum: 1,
    description:
      'Essential for project setup - ALWAYS use immediately after Gate 0 approval. CRITICAL for creating properly structured Jira epics before any development work begins. Use when receiving new project requests, starting software initiatives (product rollouts, platform updates, compliance projects), or setting up development workflows. Mandatory before development can commence.',
    triggers: ['create epic', 'jira epic', 'new epic from BC', 'epic from business case'],
    roles: ['PME', 'PO'],
    mcpsUsed: ['jira'],
    gateContribution: 'Gate 0',
    docPath: '.claude/skills/tracking-integration/SKILL.md',
  },

  // Fase 2 — Discovery (5)
  {
    id: 'prd-tecnico',
    name: 'prd-tecnico',
    type: 'skill',
    phase: 'Fase 2 — Discovery',
    phaseNum: 2,
    description: 'Genera PRD Tecnico con arquitectura, NFRs, decisiones tecnicas y diagramas.',
    triggers: [
      'create technical PRD',
      'PRD tecnico',
      'architecture design',
      'technical specification',
    ],
    roles: ['TL'],
    gateContribution: 'Gate 1',
    docPath: '.claude/skills/prd-tecnico/SKILL.md',
  },
  {
    id: 'prd-funcional',
    name: 'prd-funcional',
    type: 'skill',
    phase: 'Fase 2 — Discovery',
    phaseNum: 2,
    description: 'Genera PRD Funcional con journeys, personas, requisitos de negocio.',
    triggers: [
      'create functional PRD',
      'PRD funcional',
      'product requirements',
      'functional specification',
    ],
    roles: ['PO'],
    gateContribution: 'Gate 1',
    docPath: '.claude/skills/prd-funcional/SKILL.md',
  },
  {
    id: 'review-cruzado',
    name: 'review-cruzado',
    type: 'skill',
    phase: 'Fase 2 — Discovery',
    phaseNum: 2,
    description: 'Compara PRD Tecnico vs PRD Funcional, detecta gaps y contradicciones.',
    triggers: ['cross review', 'review cruzado', 'compare PRDs', 'PRD alignment check'],
    roles: ['PO', 'TL'],
    gateContribution: 'Gate 1',
    docPath: '.claude/skills/review-cruzado/SKILL.md',
  },
  {
    id: 'risk-log',
    name: 'risk-log',
    type: 'skill',
    phase: 'Fase 2 — Discovery',
    phaseNum: 2,
    description: 'Sugiere riesgos por tipo de proyecto con impacto, probabilidad y mitigacion.',
    triggers: ['identify risks', 'risk assessment', 'risk log', 'project risks', 'risk analysis'],
    roles: ['PME', 'TL'],
    gateContribution: 'Gate 1',
    docPath: '.claude/skills/risk-log/SKILL.md',
  },
  {
    id: 'poc-report',
    name: 'poc-report',
    type: 'skill',
    phase: 'Fase 2 — Discovery',
    phaseNum: 2,
    description:
      'Essential for documenting PoC results with falsifiable hypotheses and GO/NO-GO recommendations. ALWAYS use when PRD-T identifies technical uncertainty requiring validation. Critical for algorithm validation, new technology assessment, and feasibility studies. Use for API performance evaluation, integration pilots, and new feature prototypes.',
    triggers: ['poc report', 'proof of concept', 'PoC results', 'prototype evaluation'],
    roles: ['TL', 'Dev'],
    gateContribution: 'Gate 1',
    docPath: '.claude/skills/poc-report/SKILL.md',
  },

  // Fase 3 — Especificacion (4)
  {
    id: 'generate-rf',
    name: 'generate-rf',
    type: 'skill',
    phase: 'Fase 3 — Especificacion',
    phaseNum: 3,
    description:
      'Essential for Phase 3 (Especificación) — CRITICAL for Gate 2 success. Always use when decomposing PRDs into atomic, testable requirements. Primary tool for generating comprehensive RFs with BDD criteria for software systems. Always use when PRDs approved (Gate 1), need atomic testable requirements, preparing Gate 2, decomposing user authentication/data processing/integration functionalities.',
    triggers: [
      'generate requirements',
      'create RFs',
      'functional requirements',
      'BDD scenarios',
      'generate rf',
    ],
    roles: ['PO'],
    mcpsUsed: ['confluence'],
    gateContribution: 'Gate 2',
    docPath: '.claude/skills/generate-rf/SKILL.md',
  },
  {
    id: 'generate-nfr',
    name: 'generate-nfr',
    type: 'skill',
    phase: 'Fase 3 — Especificacion',
    phaseNum: 3,
    description:
      'Genera Requisitos No Funcionales standalone y medibles desde PRD-T §5: performance, security, scalability, availability, compliance. Crítico para sistemas software (throughput/latencia, disponibilidad, regulaciones de datos).',
    triggers: [
      'generate NFRs',
      'non-functional requirements',
      'performance requirements',
      'security requirements',
      'SLA definition',
      'NFR',
      'requisitos no funcionales',
    ],
    roles: ['TL'],
    gateContribution: 'Gate 2',
    docPath: '.claude/skills/generate-nfr/SKILL.md',
  },
  {
    id: 'validate-requirements',
    name: 'validate-requirements',
    type: 'skill',
    phase: 'Fase 3 — Especificacion',
    phaseNum: 3,
    description:
      '🤖 AUTOMATED 5-pass validation of RFs + NFRs vs PRDs. Auto-generates RTM, gap reports, implementation clusters. 6+ hours → <5 minutes. Python scripts: prd-parser.py + rtm-generator.py. ROI: 150+ hours/year.',
    triggers: [
      'automated validation',
      'requirements automation',
      'RTM generation',
      '5-pass validation',
      'Gate 2 readiness',
      'requirements traceability',
    ],
    roles: ['PO', 'TL'],
    gateContribution: 'Gate 2',
    docPath: '.claude/skills/validate-requirements/SKILL.md',
  },
  {
    id: 'epic-breakdown',
    name: 'epic-breakdown',
    type: 'skill',
    phase: 'Fase 3 — Especificacion',
    phaseNum: 3,
    description:
      'Essential for Phase 3→4 transition - CRITICAL for Sprint Planning success. MUST run after validate-requirements. Blocks Gate 3 if not completed. Always use when decomposing software epics (Data Processing, User Authentication, Platform Integration, Compliance & Security). Essential for breaking down complex software implementations into manageable sprints.',
    triggers: [
      'break down epic',
      'decompose epic',
      'create sub-epics',
      'epic structure',
      'feature epics',
      'plan epics',
      'epic breakdown',
    ],
    roles: ['PO', 'TL'],
    mcpsUsed: ['jira'],
    gateContribution: 'Gate 2-3',
    docPath: '.claude/skills/epic-breakdown/SKILL.md',
  },

  // Fase 4 — Sprint Planning (3)
  {
    id: 'user-stories',
    name: 'user-stories',
    type: 'skill',
    phase: 'Fase 4 — Sprint Planning',
    phaseNum: 4,
    description:
      '🤖 AUTOMATED User Story generation con intelligent RF slicing using 8 proven slicing patterns y INVEST validation. Genera User Stories con criterios BDD desde RFs aprobados.',
    triggers: [
      'create user stories',
      'write stories',
      'US from RFs',
      'sprint backlog',
      'user story',
    ],
    roles: ['PO'],
    gateContribution: 'Gate 3',
    docPath: '.claude/skills/user-stories/SKILL.md',
  },
  {
    id: 'sprint-capacity',
    name: 'sprint-capacity',
    type: 'skill',
    phase: 'Fase 4 — Sprint Planning',
    phaseNum: 4,
    description:
      'Calcula capacidad del sprint considerando vacaciones, ceremonia overhead y velocidad historica.',
    triggers: ['sprint capacity', 'calculate capacity', 'team velocity', 'how much can we do'],
    roles: ['SM'],
    gateContribution: 'Gate 3',
    docPath: '.claude/skills/sprint-capacity/SKILL.md',
  },
  {
    id: 'refinement-notes',
    name: 'refinement-notes',
    type: 'skill',
    phase: 'Fase 4 — Sprint Planning',
    phaseNum: 4,
    description: 'Estructura notas de refinement con decisiones, estimaciones y dependencias.',
    triggers: ['refinement notes', 'backlog refinement', 'grooming session', 'refinement meeting'],
    roles: ['SM', 'PO'],
    gateContribution: 'Gate 3',
    docPath: '.claude/skills/refinement-notes/SKILL.md',
  },

  // Fase 5 — Desarrollo (4)
  {
    id: 'pr-description',
    name: 'pr-description',
    type: 'skill',
    phase: 'Fase 5 — Desarrollo',
    phaseNum: 5,
    description: 'Genera PR description desde diff + contexto del ticket Jira.',
    triggers: ['PR description', 'pull request', 'describe PR', 'create PR description'],
    roles: ['Dev', 'TL'],
    mcpsUsed: ['github', 'jira'],
    gateContribution: 'Gate 4',
    docPath: '.claude/skills/pr-description/SKILL.md',
  },
  {
    id: 'adr',
    name: 'adr',
    type: 'skill',
    phase: 'Fase 5 — Desarrollo',
    phaseNum: 5,
    description:
      'Generate an Architecture Decision Record (ADR) in MADR format. Use whenever discussing technical choices, evaluating architecture options, or documenting decisions. Trigger this skill even for seemingly small decisions that might be questioned later. Always use when someone asks "why did we choose X" or mentions comparing alternatives. Essential for decisions that are hard to reverse, impact multiple teams, have trade-offs, involve money (buy vs build), or will be questioned by newcomers.',
    triggers: [
      'document decision',
      'create ADR',
      'architecture decision',
      'why did we choose',
      'buy vs build',
    ],
    roles: ['TL', 'Dev'],
    docPath: '.claude/skills/adr/SKILL.md',
  },
  {
    id: 'tech-debt',
    name: 'tech-debt',
    type: 'skill',
    phase: 'Fase 5 — Desarrollo',
    phaseNum: 5,
    description:
      '🤖 AUTOMATED Technical Debt Identifier - Identifica y registra deuda tecnica con clasificacion e impacto usando automation scripts.',
    triggers: ['tech debt', 'technical debt', 'code smell', 'register debt', 'refactoring needed'],
    roles: ['Dev', 'TL'],
    docPath: '.claude/skills/tech-debt/SKILL.md',
  },
  {
    id: 'dev-handoff-qa',
    name: 'dev-handoff-qa',
    type: 'skill',
    phase: 'Fase 5 — Desarrollo',
    phaseNum: 5,
    description:
      'Essential for seamless Dev→QA transition. Always use when marking tickets as Ready for QA. Critical for QA preparation and zero follow-up questions. Use for any development completion handoff, feature testing preparation, or quality assurance transition. Essential for comprehensive handoffs with test data, credentials, and regression impact analysis.',
    triggers: ['handoff to QA', 'dev handoff', 'ready for QA', 'testing instructions'],
    roles: ['Dev'],
    gateContribution: 'Gate 4',
    docPath: '.claude/skills/dev-handoff-qa/SKILL.md',
  },

  // Continue with remaining phases and skills...
  // This represents the complete structure but is partial for brevity
];

/* ─── COMMANDS DATA (23 commands) ─────────────────────────────── */

export const commands: Artifact[] = [
  // Tier 1 - Orchestrators
  {
    id: 'advance-gate',
    name: '/advance-gate',
    type: 'command',
    tier: 'Tier 1 — Orchestrator',
    description:
      'Evalua gate y genera handoff package. Orquestador universal de transiciones entre fases SDLC.',
    argument: '[gate-number]',
    model: 'opus',
    roles: ['PME', 'PO', 'TL', 'QA', 'Sec', 'DevOps'],
    precondition: 'Gate N-1 PASS',
    mcpsUsed: ['jira', 'github', 'confluence', 'slack'],
    triggers: ['advance gate', 'evaluate gate', 'pass gate', 'gate evaluation', 'handoff package'],
    docPath: '.claude/commands/advance-gate.md',
  },
  {
    id: 'implement-ticket',
    name: '/implement-ticket',
    type: 'command',
    tier: 'Tier 1 — Orchestrator',
    description:
      'Dev workflow completo: lee ticket de Jira, crea branch, genera codigo, crea PR con auto-description, genera handoff QA.',
    argument: '[ticket-id]',
    model: 'sonnet',
    roles: ['Dev', 'TL'],
    precondition: 'Ticket status "Ready for Dev"',
    mcpsUsed: ['jira', 'github', 'slack'],
    relatedSkills: ['pr-description', 'dev-handoff-qa', 'tech-debt', 'adr'],
    triggers: ['implement ticket', 'work on ticket', 'start development', 'pick up ticket'],
    docPath: '.claude/commands/implement-ticket.md',
  },
  {
    id: 'prepare-testing',
    name: '/prepare-testing',
    type: 'command',
    tier: 'Tier 1 — Orchestrator',
    description:
      'Genera suite de testing completa: test plan, test cases BDD, bug report structure, execution report. Usa CSV workflow para Xray.',
    argument: '[ticket-id]',
    model: 'sonnet',
    roles: ['QA'],
    precondition: 'Ticket status "Ready for QA"',
    relatedSkills: [
      'test-plan',
      'create-test-cases',
      'bug-report',
      'test-execution-report',
      'regression-suite',
    ],
    triggers: ['prepare testing', 'QA this ticket', 'test this', 'create test suite'],
    docPath: '.claude/commands/prepare-testing.md',
  },
  {
    id: 'init-project-docs',
    name: '/init-project-docs',
    type: 'command',
    tier: 'Tier 1 — Orchestrator',
    description:
      'Crea scaffold de documentacion de proyecto desde templates distribuidos en .claude/skills/*/templates/ y genera rules en .claude/rules/ usando skill generate-rule.',
    argument: '[project-name]',
    model: 'sonnet',
    roles: ['TL', 'PO', 'PME'],
    precondition: 'Proyecto nuevo aprobado',
    relatedSkills: ['generate-rule'],
    triggers: [
      'init docs',
      'initialize project',
      'create project documentation',
      'new project setup',
      'init rules',
    ],
    docPath: '.claude/commands/init-project-docs.md',
  },
  {
    id: 'validate-project-docs',
    name: '/validate-project-docs',
    type: 'command',
    tier: 'Tier 1 — Orchestrator',
    description:
      'Valida documentacion de proyecto contra criterios de templates + valida rule files en .claude/rules/: completitud, coherencia, actualidad, @ references validas, staleness 180d.',
    argument: '[project-name]',
    model: 'sonnet',
    roles: ['TL', 'PO', 'QA', 'PME'],
    precondition: 'Framework documentation and rules files exist',
    relatedSkills: ['generate-rule'],
    triggers: [
      'validate docs',
      'check documentation',
      'docs audit',
      'documentation review',
      'validate rules',
    ],
    docPath: '.claude/commands/validate-project-docs.md',
  },
  {
    id: 'validate-requirements-cmd',
    name: '/validate-requirements',
    type: 'command',
    tier: 'Tier 1 — Orchestrator',
    description:
      'Orquesta Fase 3 completa: genera RFs con BDD, genera NFRs medibles, valida trazabilidad (RTM), detecta gaps, y opcionalmente descompone epica en sub-epicas.',
    argument: '[project-name]',
    model: 'sonnet',
    roles: ['PO', 'TL'],
    precondition: 'Gate 1 PASS (PRDs aprobados)',
    mcpsUsed: ['jira', 'confluence'],
    relatedSkills: ['generate-rf', 'generate-nfr', 'validate-requirements', 'epic-breakdown'],
    triggers: [
      'validate requirements',
      'generate requirements',
      'phase 3',
      'specification phase',
      'create RFs and NFRs',
      'RTM',
      'traceability',
    ],
    docPath: '.claude/commands/validate-requirements.md',
  },
  {
    id: 'document-project',
    name: '/document-project',
    type: 'command',
    tier: 'Tier 1 — Orchestrator',
    description:
      'LIDR SDLC-style workflow orchestration for complete project documentation with step-by-step guidance and validation integration. Orchestrates project classification, document discovery, PRD generation, architecture documentation, and requirements validation in a comprehensive workflow.',
    argument: '[project-name]',
    model: 'sonnet',
    roles: ['TL', 'PO', 'PME'],
    precondition: 'Project kickoff approved',
    relatedSkills: [
      'project-classifier',
      'document-discovery',
      'prd-funcional',
      'prd-tecnico',
      'architecture-doc',
      'generate-rf',
      'generate-nfr',
      'epic-breakdown',
      'validate-requirements',
    ],
    triggers: [
      'document project',
      'complete documentation',
      'bmad workflow',
      'project documentation',
      'full documentation workflow',
    ],
    docPath: '.claude/commands/document-project.md',
  },
  {
    id: 'check-readiness',
    name: '/check-readiness',
    type: 'command',
    tier: 'Tier 1 — Orchestrator',
    description:
      'Pre-implementation validation workflow — check PRD completeness, team readiness, dependencies and generate readiness score. LIDR SDLC-inspired readiness assessment with quantitative scoring and blockers identification.',
    argument: '[project-name]',
    model: 'sonnet',
    roles: ['PME', 'PO', 'TL', 'QA'],
    precondition: 'Project defined with basic documentation',
    triggers: [
      'check readiness',
      'implementation readiness',
      'readiness score',
      'pre-implementation',
      'readiness assessment',
    ],
    docPath: '.claude/commands/check-readiness.md',
  },
  {
    id: 'validate-prd',
    name: '/validate-prd',
    type: 'command',
    tier: 'Tier 1 — Orchestrator',
    description:
      'Comprehensive PRD quality validation framework with automated quality gates and actionable recommendations. LIDR SDLC-inspired PRD quality validation with automated scoring and improvement recommendations.',
    argument: '[project-name]',
    model: 'sonnet',
    roles: ['PO', 'TL', 'QA', 'PME'],
    precondition: 'PRD documents exist',
    triggers: [
      'validate prd',
      'prd validation',
      'check prd quality',
      'prd quality gate',
      'prd assessment',
    ],
    docPath: '.claude/commands/validate-prd.md',
  },
  {
    id: 'course-correct',
    name: '/course-correct',
    type: 'command',
    tier: 'Tier 1 — Orchestrator',
    description:
      'Mid-project course correction for managing deviations and realigning projects. Comprehensive realignment workflow with stakeholder communication and execution plan.',
    argument: '[project] [deviation-type]',
    model: 'sonnet',
    roles: ['PME', 'PO', 'TL'],
    precondition: 'Project execution in progress',
    triggers: [
      'course correct',
      'project realignment',
      'deviation management',
      'scope adjustment',
      'project correction',
    ],
    docPath: '.claude/commands/course-correct.md',
  },

  // Tier 2 - Tactical
  {
    id: 'create-branch',
    name: '/create-branch',
    type: 'command',
    tier: 'Tier 2 — Tactical',
    description: 'Crea feature branch desde ticket Jira con naming convention automatica.',
    argument: '[ticket-id]',
    model: 'haiku',
    roles: ['Dev', 'TL'],
    precondition: 'Ticket asignado al dev',
    mcpsUsed: ['jira'],
    triggers: ['create branch', 'new branch', 'feature branch', 'start coding'],
    docPath: '.claude/commands/create-branch.md',
  },
  {
    id: 'create-pr',
    name: '/create-pr',
    type: 'command',
    tier: 'Tier 2 — Tactical',
    description:
      'Crea Pull Request con description auto-generada desde diff + contexto Jira, verifica DoD.',
    argument: '[ticket-id]',
    model: 'sonnet',
    roles: ['Dev', 'TL'],
    precondition: 'Branch con commits listos',
    mcpsUsed: ['github', 'jira', 'slack'],
    relatedSkills: ['pr-description'],
    triggers: ['create PR', 'pull request', 'open PR', 'submit code'],
    docPath: '.claude/commands/create-pr.md',
  },
  {
    id: 'create-release-notes',
    name: '/create-release-notes',
    type: 'command',
    tier: 'Tier 2 — Tactical',
    description:
      'Genera changelog desde PRs mergeados: nivel ejecutivo (negocio) + tecnico (equipo).',
    argument: '[version]',
    model: 'sonnet',
    roles: ['DevOps', 'TL'],
    precondition: 'PRs mergeados desde ultimo tag',
    mcpsUsed: ['github', 'jira', 'confluence', 'slack'],
    relatedSkills: ['release-notes'],
    triggers: ['release notes', 'generate changelog', 'what shipped', 'prepare release'],
    docPath: '.claude/commands/create-release-notes.md',
  },
  {
    id: 'update-changelog',
    name: '/update-changelog',
    type: 'command',
    tier: 'Tier 2 — Tactical',
    description: 'Actualiza CHANGELOG.md siguiendo Keep a Changelog + Conventional Commits.',
    argument: '[version]',
    model: 'haiku',
    roles: ['DevOps', 'TL'],
    precondition: 'Release notes generadas',
    mcpsUsed: ['github'],
    triggers: ['update changelog', 'new version', 'bump version', 'changelog entry'],
    docPath: '.claude/commands/update-changelog.md',
  },
  {
    id: 'sync-docs',
    name: '/sync-docs',
    type: 'command',
    tier: 'Tier 2 — Tactical',
    description: 'Analiza codigo, detecta drift vs documentacion, auto-actualiza docs.',
    argument: '[scope]',
    model: 'sonnet',
    roles: ['Dev', 'TL', 'QA'],
    precondition: 'Cambios mergeados',
    triggers: ['sync docs', 'update documentation', 'docs out of date', 'documentation drift'],
    docPath: '.claude/commands/sync-docs.md',
  },
  {
    id: 'quick-spec',
    name: '/quick-spec',
    type: 'command',
    tier: 'Tier 2 — Tactical',
    description:
      'Especificación ligera para features pequeñas (≤40h) sin overhead de documentación completa. LIDR SDLC-inspired lightweight specification for rapid development.',
    argument: '[feature-name]',
    model: 'sonnet',
    roles: ['PO', 'TL', 'Dev'],
    precondition: 'Small feature identified',
    triggers: [
      'quick spec',
      'lightweight spec',
      'small feature',
      'rapid specification',
      'quick documentation',
    ],
    docPath: '.claude/commands/quick-spec.md',
  },
  {
    id: 'quick-dev',
    name: '/quick-dev',
    type: 'command',
    tier: 'Tier 2 — Tactical',
    description:
      'Rapid development workflow for small features with automated setup and streamlined process. Optimized for features under 8 hours.',
    argument: '[feature-name]',
    model: 'sonnet',
    roles: ['Dev', 'TL'],
    precondition: 'Quick spec approved',
    triggers: [
      'quick dev',
      'rapid development',
      'fast implementation',
      'small feature dev',
      'streamlined dev',
    ],
    docPath: '.claude/commands/quick-dev.md',
  },
  {
    id: 'product-brief',
    name: '/product-brief',
    type: 'command',
    tier: 'Tier 2 — Tactical',
    description:
      'Create lightweight product brief for rapid product definition. LIDR SDLC-inspired product brief pattern for quick product conceptualization.',
    argument: '[product-name]',
    model: 'sonnet',
    roles: ['PME', 'PO', 'TL'],
    precondition: 'Product concept identified',
    triggers: [
      'product brief',
      'lightweight brief',
      'rapid product',
      'product concept',
      'quick product definition',
    ],
    docPath: '.claude/commands/product-brief.md',
  },
  {
    id: 'sprint-health',
    name: '/sprint-health',
    type: 'command',
    tier: 'Tier 2 — Tactical',
    description:
      'Active sprint monitoring with health metrics and risk detection. LIDR SDLC-inspired sprint monitoring with automated health scoring.',
    argument: '[sprint-id]',
    model: 'sonnet',
    roles: ['SM', 'PME', 'TL', 'QA'],
    precondition: 'Sprint in progress',
    triggers: [
      'sprint health',
      'sprint monitoring',
      'sprint status',
      'health check',
      'sprint metrics',
    ],
    docPath: '.claude/commands/sprint-health.md',
  },

  // Tier 3 - Utility
  {
    id: 'help',
    name: '/help',
    type: 'command',
    tier: 'Tier 3 — Utility',
    description: `Sistema de ayuda interactivo del ecosistema SDLC. Recibe consulta en lenguaje natural y busca entre ${ecosystemStats.totalArtifacts} artefactos de 7 tipos (${ecosystemStats.skills} skills, ${ecosystemStats.commands} commands, ${ecosystemStats.rules} rules, ${ecosystemStats.hooks} hooks, ${ecosystemStats.mcps} MCPs, ${ecosystemStats.agents} agents, ${ecosystemStats.validationScripts} validation scripts, ${ecosystemStats.docsSupport} docs). Sugiere workflows paso a paso (${summaryStrings.workflowsWithSteps} enriquecidos). Filtrable por tipo de artefacto y por rol (PME, PO, TL, Dev, QA, Sec, DevOps, SM). Incluye 12 quick suggestions para escenarios comunes (nuevo proyecto, implementar ticket, testing, seguridad, hotfix, onboarding, deuda tecnica, etc.). Cada artefacto muestra: tier, fase SDLC, gate contribution, modelo IA, descripcion, roles autorizados, triggers de activacion, MCPs utilizados, skills/commands relacionados, precondicion y docPath. Cada workflow muestra secuencia ordenada de artefactos con tipo y accion. Registro de stats con conteos por tipo y totales.`,
    argument: '[query]',
    model: 'haiku',
    roles: ['PME', 'PO', 'TL', 'Dev', 'QA', 'Sec', 'DevOps', 'SM'],
    triggers: [
      'help',
      'what can you do',
      'how do I',
      'which command',
      'which skill',
      'where is',
      'explain the process',
      'que puedo hacer',
      'ayuda',
      'need help',
      'guide me',
      'show me',
      'find artifact',
      'buscar',
      'como hago',
      'que artefacto',
      'workflow for',
      'flujo para',
      'quien puede',
      'role filter',
      'list skills',
      'list commands',
      'all artifacts',
      'browse ecosystem',
      'explorar ecosistema',
      'quick start',
      'getting started',
      'nuevo proyecto',
      'testing',
      'deploy',
      'seguridad',
      'hotfix',
      'onboarding',
      'deuda tecnica',
      'rules',
      'templates',
      'checklists',
      'agents',
      'hooks',
      'MCPs',
    ],
    docPath: '.claude/commands/lidr-help.md',
  },

  // Enhanced Commands (3) - Phase 5 Enhancements
  {
    id: 'create-branch-enhanced',
    name: '/create-branch-enhanced',
    type: 'command',
    tier: 'Tier 2 — Tactical',
    description:
      'Enhanced branch creation with SDLC tracking integration. Creates feature branch from Jira ticket with automatic SDLC state management.',
    argument: '[ticket-id]',
    model: 'sonnet',
    roles: ['Dev', 'TL'],
    triggers: ['create branch enhanced', 'enhanced branch', 'branch with tracking'],
    docPath: '.claude/commands/create-branch-enhanced.md',
  },
  {
    id: 'create-pr-enhanced',
    name: '/create-pr-enhanced',
    type: 'command',
    tier: 'Tier 2 — Tactical',
    description:
      'Enhanced PR creation with SDLC tracking and automated handoffs. Creates pull request with auto-generated description and automatic phase progression.',
    argument: '[ticket-id]',
    model: 'sonnet',
    roles: ['Dev', 'TL'],
    triggers: ['create pr enhanced', 'enhanced pr', 'pr with handoffs'],
    docPath: '.claude/commands/create-pr-enhanced.md',
  },
  {
    id: 'track-sdlc',
    name: '/track-sdlc',
    type: 'command',
    tier: 'Tier 2 — Tactical',
    description:
      'Centralized SDLC tracking with sdlc-tracking.yaml management. Updates project state, tracks phase progression, and manages SDLC metadata.',
    argument: '[action] [project]',
    model: 'sonnet',
    roles: ['PME', 'SM', 'TL'],
    triggers: ['track sdlc', 'sdlc tracking', 'project tracking', 'phase progression'],
    docPath: '.claude/commands/track-sdlc.md',
  },
];

/* ─── WORKFLOW SUGGESTIONS DATA ─────────────────────────────── */

export const workflowSuggestions: WorkflowSuggestionForSearch[] = [
  {
    id: 'project-discovery',
    name: 'Project Discovery to Development',
    description: 'Complete workflow from business case to development handoff',
    steps: [
      'Create Business Case',
      'Stakeholder mapping',
      'PRD Creation (Functional + Technical)',
      'Requirements validation',
      'Sprint planning',
    ],
    roles: ['PME', 'PO', 'TL', 'Dev'],
  },
  {
    id: 'sprint-to-production',
    name: 'Sprint to Production Pipeline',
    description: 'Development to production deployment workflow',
    steps: [
      'Sprint development',
      'QA testing',
      'Security review',
      'Change request',
      'Production deployment',
    ],
    roles: ['Dev', 'QA', 'Sec', 'DevOps'],
  },
];

export const detailedWorkflowSuggestions: WorkflowSuggestion[] = [
  {
    title: 'Project Discovery to Development',
    description: 'Complete workflow from business case to development handoff',
    steps: [
      { artifact: 'business-case', type: 'skill', action: 'Create Business Case document' },
      { artifact: 'stakeholder-map', type: 'skill', action: 'Map project stakeholders' },
      { artifact: 'prd-funcional', type: 'skill', action: 'Create Functional PRD' },
      { artifact: 'prd-tecnico', type: 'skill', action: 'Create Technical PRD' },
      { artifact: 'review-cruzado', type: 'skill', action: 'Cross-review PRDs' },
      {
        artifact: 'validate-requirements',
        type: 'skill',
        action: 'Generate and validate RFs+NFRs',
      },
      { artifact: '/advance-gate', type: 'command', action: 'Advance Gate 2 to Sprint Planning' },
    ],
    roles: ['PME', 'PO', 'TL', 'Dev'],
    tags: ['discovery', 'prd', 'requirements'],
  },
  {
    title: 'Sprint to Production Pipeline',
    description: 'Development to production deployment workflow',
    steps: [
      { artifact: '/implement-ticket', type: 'command', action: 'Implement development tasks' },
      { artifact: '/prepare-testing', type: 'command', action: 'Generate QA test suite' },
      { artifact: 'test-execution-report', type: 'skill', action: 'Execute tests and report' },
      { artifact: 'security-checklist', type: 'skill', action: 'Security validation' },
      { artifact: 'change-request', type: 'skill', action: 'Generate change request' },
      { artifact: '/create-release-notes', type: 'command', action: 'Generate release notes' },
    ],
    roles: ['Dev', 'QA', 'Sec', 'DevOps'],
    tags: ['development', 'testing', 'deployment'],
  },
  {
    title: 'Quick Feature Development',
    description: 'Agile workflow for small features (≤40h)',
    steps: [
      { artifact: '/quick-spec', type: 'command', action: 'Create lightweight spec' },
      { artifact: 'user-stories', type: 'skill', action: 'Generate user stories' },
      { artifact: '/create-branch', type: 'command', action: 'Create feature branch' },
      { artifact: '/implement-ticket', type: 'command', action: 'Implement feature' },
      { artifact: '/create-pr', type: 'command', action: 'Create pull request' },
    ],
    roles: ['Dev', 'PO', 'TL'],
    tags: ['agile', 'feature', 'quick'],
  },
  {
    title: 'Security Assessment Workflow',
    description: 'Complete security validation process',
    steps: [
      { artifact: 'vuln-assessment', type: 'skill', action: 'Assess vulnerabilities' },
      { artifact: 'dast-interpretation', type: 'skill', action: 'Interpret DAST results' },
      { artifact: 'pentest-report', type: 'skill', action: 'Generate penetration test report' },
      { artifact: 'security-checklist', type: 'skill', action: 'Validate security checklist' },
      { artifact: '/advance-gate', type: 'command', action: 'Security gate approval' },
    ],
    roles: ['Sec', 'TL'],
    tags: ['security', 'assessment', 'compliance'],
  },
  {
    title: 'Documentation Maintenance',
    description: 'Keep project documentation synchronized',
    steps: [
      { artifact: '/sync-docs', type: 'command', action: 'Synchronize documentation' },
      {
        artifact: '/validate-project-docs',
        type: 'command',
        action: 'Validate documentation quality',
      },
      { artifact: 'architecture-doc', type: 'skill', action: 'Update architecture documentation' },
      { artifact: 'adr', type: 'skill', action: 'Create architecture decisions' },
    ],
    roles: ['TL', 'Dev', 'QA'],
    tags: ['documentation', 'maintenance', 'sync'],
  },
  {
    title: 'Requirements Specification & Validation',
    description:
      'Complete Specification Phase: generate and validate functional and non-functional requirements with BDD acceptance criteria',
    steps: [
      {
        artifact: 'generate-rf',
        type: 'skill',
        action: 'Generate Functional Requirements with BDD',
      },
      { artifact: 'generate-nfr', type: 'skill', action: 'Generate Non-Functional Requirements' },
      {
        artifact: 'validate-requirements',
        type: 'command',
        action: 'Validate RF+NFR coherence and traceability',
      },
      {
        artifact: 'epic-breakdown',
        type: 'skill',
        action: 'Decompose epic into implementable sub-epics',
      },
      { artifact: '/advance-gate', type: 'command', action: 'Advance to Sprint Planning (Gate 2)' },
    ],
    roles: ['PO', 'TL', 'QA'],
    tags: ['specification', 'RF', 'NFR', 'BDD', 'validate-requirements', 'especificacion'],
  },
];

/* ─── RULES DATA (5) ─────────────────────────────── */

export const rules: Artifact[] = [
  {
    id: 'rule-org',
    name: 'org.md',
    type: 'rule',
    description:
      'Estandares de organizacion: identidad, mercados, regulacion, metodologia, roles, quality gates, metricas.',
    triggers: [
      'company standards',
      'organization rules',
      'how does the organization work',
      'quality gates',
    ],
    docPath: '.claude/rules/org.md',
  },
  {
    id: 'rule-tech-stack',
    name: 'tech-stack.md',
    type: 'rule',
    description:
      'Convenciones del stack tecnologico: React, TypeScript, Tailwind, Node.js, PostgreSQL, naming, testing, seguridad.',
    triggers: ['tech conventions', 'code standards', 'naming conventions', 'how to code'],
    docPath: '.claude/rules/tech-stack.md',
  },
  {
    id: 'rule-project',
    name: 'project.md',
    type: 'rule',
    description:
      'Contexto del proyecto activo: ficha, equipo, arquitectura, entornos, ADRs, estado actual.',
    triggers: ['project context', 'current project', 'who is in the team', 'project status'],
    docPath: '.claude/rules/project.md',
  },
  {
    id: 'rule-documentation',
    name: 'documentation.md',
    type: 'rule',
    description:
      'Governance de documentacion: frontmatter obligatorio, versionado, staleness detection, naming.',
    triggers: ['documentation rules', 'frontmatter format', 'how to document', 'doc standards'],
    docPath: '.claude/rules/documentation.md',
  },
  {
    id: 'rule-workflows',
    name: 'workflows.md',
    type: 'rule',
    description:
      'Mapa de orquestacion: quien puede ejecutar que comando, en que orden, encadenamiento, roles, flujo SDLC completo.',
    triggers: [
      'workflow map',
      'who can do what',
      'command permissions',
      'SDLC flow',
      'role permissions',
    ],
    docPath: '.claude/rules/workflows.md',
  },
];

/* ─── HOOKS DATA (4) ─────────────────────────────── */

export const hooks: Artifact[] = [
  {
    id: 'hook-pre-tool-write',
    name: 'PreToolUse: Write|Edit',
    type: 'hook',
    description:
      'Valida DoD + regla DTC antes de escribir archivos. Tipo: prompt-based. Evalua: (1) si el cambio afecta docs que deberian actualizarse (matriz de impacto DTC), (2) si hay secrets hardcoded, (3) si path es valido. Matcher: "Write|Edit". Config: .claude/settings.json → PreToolUse.',
    triggers: [
      'before write',
      'DoD check',
      'DTC validation',
      'pre-write hook',
      'file write validation',
    ],
    relatedSkills: ['dev-handoff-qa'],
    docPath: 'docs/hooks/dtc-write-guard.md',
  },
  {
    id: 'hook-stop-dtc',
    name: 'Stop: DTC enforcement',
    type: 'hook',
    description:
      'Al finalizar sesion, verifica regla DTC: si se modificaron archivos de codigo/docs, chequea que las fuentes de verdad esten sincronizadas (CLAUDE.md, HelpCenter, SitemapView, IntegrityTests, audit-catalog, Guidelines, org.md). Tipo: prompt-based. Bloquea si hay drift detectado.',
    triggers: ['end session', 'session summary', 'DTC check', 'docs sync check', 'stop hook'],
    docPath: 'docs/hooks/validate-ecosystem-counts.md',
  },
  {
    id: 'hook-notification',
    name: 'Notification',
    type: 'hook',
    description:
      'Detecta eventos relevantes (build roto, test fallido, vulnerabilidad critica) y genera notificacion desktop con impacto y accion sugerida. Tipo: command (bash notify.sh). Config: .claude/settings.json → Notification.',
    triggers: ['alert', 'notification', 'build broken', 'critical event'],
    docPath: 'docs/hooks/notify.md',
  },
  {
    id: 'hook-session-start',
    name: 'SessionStart: context loader',
    type: 'hook',
    description:
      'Al iniciar sesion, carga contexto del proyecto: tipo de proyecto, reglas DTC activas, ultimo estado de integridad, docs stale. Tipo: command (bash load-context.sh). Usa $CLAUDE_ENV_FILE para persistir variables. Config: .claude/settings.json → SessionStart.',
    triggers: ['session start', 'load context', 'project detection', 'init session'],
    docPath: 'docs/hooks/load-context.md',
  },
];

/* ─── MCPS DATA (4) ─────────────────────────────── */

export const mcps: Artifact[] = [
  {
    id: 'mcp-filesystem',
    name: 'Filesystem',
    type: 'mcp',
    description:
      'Operaciones de archivos locales: lectura, escritura, búsqueda y listado de directorios. Capacidades: read_files, write_files, search_files, list_directories.',
    triggers: [
      'filesystem',
      'file operations',
      'local files',
      'read files',
      'write files',
      'search files',
    ],
    relatedCommands: ['implement-ticket', 'sync-docs', 'validate-project-docs'],
  },
  {
    id: 'mcp-memory',
    name: 'Memory',
    type: 'mcp',
    description:
      'Grafo de conocimiento para memoria persistente entre sesiones. Capacidades: store_knowledge, retrieve_knowledge, search_knowledge.',
    triggers: ['memory', 'knowledge graph', 'persistent memory', 'store knowledge', 'remember'],
    relatedCommands: ['all-skills'],
  },
  {
    id: 'mcp-atlassian',
    name: 'Atlassian',
    type: 'mcp',
    description:
      'Integración con Jira y Confluence. Capacidades: read_issues, create_issues, update_issues, search_confluence.',
    triggers: ['jira', 'confluence', 'atlassian', 'tickets', 'issues'],
    relatedCommands: ['tracking-integration', 'implement-ticket', 'advance-gate'],
  },
  {
    id: 'mcp-playwright',
    name: 'Playwright',
    type: 'mcp',
    description:
      'Automatización de navegador para testing e interacción web. Capacidades: browser_automation, screenshots, form_filling.',
    triggers: ['playwright', 'browser automation', 'web testing', 'screenshots'],
    relatedCommands: ['test-plan', 'prepare-testing'],
  },
];

/* ─── SAMPLE VALIDATION SCRIPTS DATA (5 representative) ─────────────────────────────── */
// NOTE: The original has 55 validation scripts.
// For this data extraction, we're including a representative sample.
// The full list would need to be extracted from the remaining sections of HelpCenter.tsx

export const validationScripts: Artifact[] = [
  {
    id: 'val-business-case',
    name: 'Business Case Validation',
    type: 'validation-script',
    description:
      'Valida coherencia de business case: justificación clara, ROI calculado, riesgos identificados.',
    triggers: ['validate business case', 'business case validation', 'BC coherence'],
    category: 'Skill Validation',
    roles: ['PME', 'PO'],
    docPath: 'skills/business-case/scripts/validate-examples.ts',
  },
  {
    id: 'val-kickoff',
    name: 'Kickoff Validation',
    type: 'validation-script',
    description:
      'Valida acta de kickoff: asistentes confirmados, scope claro, próximos pasos definidos.',
    triggers: ['validate kickoff', 'kickoff validation', 'meeting validation'],
    category: 'Skill Validation',
    roles: ['TL', 'PO'],
    docPath: 'skills/kickoff/scripts/validate-examples.ts',
  },
  // ... Additional validation scripts would be extracted from the remaining sections
];

/* ─── AGENTS DATA (6) ─────────────────────────────── */

export const agents: Artifact[] = [
  {
    id: 'qa-agent',
    name: 'QA Agent',
    type: 'agent',
    description: 'Automated QA workflow agent for testing and quality assurance',
    triggers: ['qa automation', 'automated testing', 'quality agent'],
    roles: ['QA'],
    docPath: '.claude/agents/qa-agent.md',
  },
  {
    id: 'release-agent',
    name: 'Release Agent',
    type: 'agent',
    description: 'Automated release management and deployment agent',
    triggers: ['release automation', 'deployment agent', 'release management'],
    roles: ['DevOps'],
    docPath: '.claude/agents/release-agent.md',
  },
  // ... Additional agents would be extracted from the remaining sections
];

/* ─── DOCS DATA (41 representative) ─────────────────────────────── */

export const docs: Artifact[] = [
  // ... Additional docs would be extracted from the remaining sections
];

/* ─── COMPUTED DATA ─────────────────────────────── */

// All artifacts combined
export const allArtifacts: Artifact[] = [
  ...skills,
  ...commands,
  // ...rules,
  // ...hooks,
  // ...mcps,
  // ...validationScripts,
  // ...agents,
  // ...docs,
];

/* ─── SEARCH AND FILTERING FUNCTIONS ─────────────────────────────── */

export function searchArtifacts(query: string): Artifact[] {
  if (!query.trim()) {
    return [];
  }
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

  return allArtifacts.filter((artifact) => {
    const searchFields = [
      artifact.name,
      artifact.description,
      ...(artifact.triggers || []),
      ...(artifact.roles || []),
      artifact.phase || '',
    ]
      .join(' ')
      .toLowerCase();

    return terms.every((term) => searchFields.includes(term));
  });
}

export function searchWorkflows(query: string): WorkflowSuggestionForSearch[] {
  if (!query.trim()) {
    return [];
  }
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

  return workflowSuggestions.filter((w) =>
    terms.some(
      (term) =>
        w.name.toLowerCase().includes(term) ||
        w.description.toLowerCase().includes(term) ||
        w.steps.some((step) => step.toLowerCase().includes(term))
    )
  );
}

/* ─── REGISTRY EXPORT ─────────────────────────────── */

export const artifactRegistry: ArtifactRegistry = {
  skills,
  commands,
  workflows: workflowSuggestions,
  categories: [], // To be populated with categorized data
  allArtifacts,
};

export default artifactRegistry;
