/**
 * SINGLE SOURCE OF TRUTH - Commands Registry
 * Centralizes all commands data to eliminate duplication
 *
 * Naming: every entry uses the real prefixed command name (`lidr-*`) matching
 * `.agents/commands/` on the filesystem. `lidr-help` is a SKILL (see
 * `artifacts/skills.ts`), not a command, and `lidr-product-brief` was removed
 * from the ecosystem — neither appears here.
 */

export interface Command {
  id: string;
  name: string;
  tier: 'orchestrator' | 'tactical' | 'utility';
  description: string;
  authorizedRoles: string[];
  precondition?: string;
  argument?: string;
  model?: string;
  gateContribution?: string;
  docPath?: string;
  relatedSkills?: string[];
}

export const commands: Command[] = [
  // Tier 1 — Orchestrators (8)
  {
    id: 'lidr-advance-gate',
    name: 'lidr-advance-gate',
    tier: 'orchestrator',
    description: 'Evalúa gate, genera handoff package y transiciona fase formalmente',
    authorizedRoles: ['PME', 'PO', 'TL', 'QA', 'Sec', 'DevOps'],
    precondition: 'Gate N-1 PASS',
    argument: '[N]',
    model: 'opus',
    gateContribution: 'All Gates 0-7',
    docPath: '.claude/commands/lidr-advance-gate.md',
    relatedSkills: [
      'lidr-business-case',
      'bmad-prd',
      'lidr-validate-requirements',
      'lidr-security-checklist',
    ],
  },
  {
    id: 'lidr-course-correct',
    name: 'lidr-course-correct',
    tier: 'orchestrator',
    description: 'Mid-project course correction for managing deviations and realigning projects',
    authorizedRoles: ['PME', 'PO', 'TL'],
    precondition: 'Proyecto en progreso',
    argument: '[project] [type]',
    model: 'sonnet',
    gateContribution: 'All Gates',
    docPath: '.claude/commands/lidr-course-correct.md',
    relatedSkills: ['lidr-risk-log', 'bmad-retrospective'],
  },
  {
    id: 'lidr-validate-prd',
    name: 'lidr-validate-prd',
    tier: 'orchestrator',
    description:
      'LIDR SDLC PRD quality validation with automated scoring and actionable recommendations',
    authorizedRoles: ['PO', 'TL', 'QA', 'PME'],
    precondition: 'PRDs en draft completados',
    argument: '[name]',
    model: 'sonnet',
    gateContribution: 'Gate 1',
    docPath: '.claude/commands/lidr-validate-prd.md',
    relatedSkills: ['bmad-prd', 'lidr-review-cruzado'],
  },
  {
    id: 'lidr-implement-ticket',
    name: 'lidr-implement-ticket',
    tier: 'orchestrator',
    description: 'Workflow completo: ticket → plan → implementación → PR → handoff QA',
    authorizedRoles: ['Dev', 'TL'],
    precondition: 'Ticket status "Ready for Dev"',
    argument: '[ID]',
    model: 'sonnet',
    gateContribution: 'Gate 4',
    docPath: '.claude/commands/lidr-implement-ticket.md',
    relatedSkills: ['lidr-pr-description', 'lidr-dev-handoff-qa', 'lidr-adr', 'lidr-tech-debt'],
  },
  {
    id: 'lidr-prepare-testing',
    name: 'lidr-prepare-testing',
    tier: 'orchestrator',
    description: 'Genera suite de testing completa desde ticket Ready for QA',
    authorizedRoles: ['QA', 'QA Lead'],
    precondition: 'Ticket status "Ready for QA"',
    argument: '[ID]',
    model: 'sonnet',
    gateContribution: 'Gate 5',
    docPath: '.claude/commands/lidr-prepare-testing.md',
    relatedSkills: [
      'bmad-testarch-test-design',
      'lidr-create-test-cases',
      'lidr-bug-report',
      'lidr-test-execution-report',
      'bmad-testarch-automate',
    ],
  },
  {
    id: 'lidr-validate-requirements',
    name: 'lidr-validate-requirements',
    tier: 'orchestrator',
    description:
      'Orquesta Phase 3 (Solutioning · specification): genera RFs + NFRs + RTM + epic breakdown',
    authorizedRoles: ['PO', 'TL'],
    precondition: 'Gate 1 PASS (PRDs aprobados)',
    argument: '[name]',
    model: 'sonnet',
    gateContribution: 'Gate 2',
    docPath: '.claude/commands/lidr-validate-requirements.md',
    relatedSkills: [
      'lidr-generate-rf',
      'lidr-generate-nfr',
      'lidr-validate-requirements',
      'bmad-create-epics-and-stories',
    ],
  },
  {
    id: 'lidr-init-project-docs',
    name: 'lidr-init-project-docs',
    tier: 'orchestrator',
    description: 'Scaffolding documental completo desde templates',
    authorizedRoles: ['TL', 'PO', 'PME'],
    precondition: 'Proyecto nuevo aprobado',
    argument: '[name]',
    model: 'sonnet',
    docPath: '.claude/commands/lidr-init-project-docs.md',
    relatedSkills: ['bmad-create-architecture', 'lidr-agents-architecture'],
  },
  {
    id: 'lidr-validate-project-docs',
    name: 'lidr-validate-project-docs',
    tier: 'orchestrator',
    description: 'Valida documentación contra criterios de templates',
    authorizedRoles: ['TL', 'PO', 'QA', 'PME'],
    precondition: 'Framework documentation and rules exist',
    argument: '[name]',
    model: 'sonnet',
    docPath: '.claude/commands/lidr-validate-project-docs.md',
  },
  // Tier 2 — Tactical (5)
  {
    id: 'lidr-create-release-notes',
    name: 'lidr-create-release-notes',
    tier: 'tactical',
    description: 'Genera changelog desde PRs mergeados con executive summary',
    authorizedRoles: ['DevOps', 'TL', 'Release Manager'],
    precondition: 'PRs mergeados desde último tag',
    model: 'sonnet',
    gateContribution: 'Gate 7',
    docPath: '.claude/commands/lidr-create-release-notes.md',
    relatedSkills: ['lidr-release-notes'],
  },
  {
    id: 'lidr-sprint-health',
    name: 'lidr-sprint-health',
    tier: 'tactical',
    description: 'Monitoreo activo de salud del sprint con detección de riesgos LIDR SDLC',
    authorizedRoles: ['SM', 'PME', 'TL', 'QA'],
    precondition: 'Sprint activo en progreso',
    argument: '[sprint-id]',
    model: 'sonnet',
    gateContribution: 'Gates 3-6',
    docPath: '.claude/commands/lidr-sprint-health.md',
    relatedSkills: ['lidr-sprint-capacity', 'bmad-retrospective', 'lidr-risk-log'],
  },
  {
    id: 'lidr-create-branch',
    name: 'lidr-create-branch',
    tier: 'tactical',
    description: 'Crea feature branch desde ticket Jira con naming conventions',
    authorizedRoles: ['Dev', 'TL'],
    precondition: 'Ticket asignado al dev',
    argument: '[ID]',
    model: 'haiku',
    docPath: '.claude/commands/lidr-create-branch.md',
  },
  {
    id: 'lidr-create-pr',
    name: 'lidr-create-pr',
    tier: 'tactical',
    description: 'Crea PR con description auto-generada desde contexto',
    authorizedRoles: ['Dev', 'TL'],
    precondition: 'Branch con commits listos',
    argument: '[ID]',
    model: 'sonnet',
    gateContribution: 'Gate 4',
    docPath: '.claude/commands/lidr-create-pr.md',
    relatedSkills: ['lidr-pr-description'],
  },
  {
    id: 'lidr-quick-spec',
    name: 'lidr-quick-spec',
    tier: 'tactical',
    description: 'Especificación ligera para features pequeñas (≤40h effort) basada en LIDR SDLC',
    authorizedRoles: ['PO', 'TL', 'Dev'],
    precondition: 'Feature < 40h effort estimate',
    argument: '[feature-name] [--type=enhancement|bugfix|integration|api] [--effort=hours]',
    model: 'sonnet',
    gateContribution: 'Pre-Gate 2 (lightweight requirements)',
    docPath: '.claude/commands/lidr-quick-spec.md',
    relatedSkills: [
      'lidr-generate-rf',
      'lidr-user-stories',
      'lidr-validate-requirements',
      'lidr-create-test-cases',
    ],
  },
  {
    id: 'lidr-quick-dev',
    name: 'lidr-quick-dev',
    tier: 'tactical',
    description: 'Flujo de desarrollo rápido para tareas pequeñas (< 8 horas)',
    authorizedRoles: ['Dev', 'TL'],
    precondition: 'Tarea < 8h effort estimate',
    argument: '[task-id]',
    model: 'sonnet',
    gateContribution: 'Gate 4',
    docPath: '.claude/commands/lidr-quick-dev.md',
    relatedSkills: ['lidr-pr-description', 'lidr-dev-handoff-qa'],
  },
  {
    id: 'lidr-update-changelog',
    name: 'lidr-update-changelog',
    tier: 'tactical',
    description: 'Actualiza CHANGELOG.md con versión nueva',
    authorizedRoles: ['DevOps', 'TL', 'Release Manager'],
    precondition: 'Release notes generadas',
    argument: '[version]',
    model: 'haiku',
    docPath: '.claude/commands/lidr-update-changelog.md',
  },
  {
    id: 'lidr-sync-docs',
    name: 'lidr-sync-docs',
    tier: 'tactical',
    description: 'Sincroniza documentación tras cambios de código',
    authorizedRoles: ['Dev', 'TL', 'QA'],
    precondition: 'Cambios mergeados',
    argument: '[scope]',
    model: 'sonnet',
    docPath: '.claude/commands/lidr-sync-docs.md',
  },

  {
    id: 'lidr-track-sdlc',
    name: 'lidr-track-sdlc',
    tier: 'orchestrator',
    description: 'Centralized SDLC tracking with portfolio management',
    authorizedRoles: ['PME', 'PO', 'TL'],
    precondition: 'Ninguna',
    argument: '[project-id] [action]',
    model: 'sonnet',
    gateContribution: 'All Gates',
    docPath: '.claude/commands/lidr-track-sdlc.md',
    relatedSkills: ['lidr-sdlc-tracking', 'lidr-external-sync'],
  },

  // Tier 2.5 — LIDR Spec Lifecycle (7) — paridad nativa con specboot,
  // Phase 4 (Implementation · development)
  {
    id: 'lidr-spec-new',
    name: 'lidr-spec-new',
    tier: 'tactical',
    description:
      'Crea un change container LIDR con scaffold vacío (proposal, design, tasks, spec, test-report) en docs/projects/{cliente}/changes/<name>/',
    authorizedRoles: ['Dev', 'TL'],
    precondition: 'Ticket asignado o decisión técnica clara',
    argument: '[change-name]',
    model: 'sonnet',
    gateContribution: 'Gate 4',
    docPath: '.claude/commands/lidr-spec-new.md',
    relatedSkills: ['lidr-using-git-worktrees'],
  },
  {
    id: 'lidr-spec-ff',
    name: 'lidr-spec-ff',
    tier: 'tactical',
    description:
      'Fast-forward planning: genera proposal.md, design.md, spec.md y tasks.md de un change en un solo pase. Requiere Opus high reasoning.',
    authorizedRoles: ['Dev', 'TL'],
    precondition: 'Container creado + Enriched US disponible',
    argument: '[change-name]',
    model: 'opus',
    gateContribution: 'Gate 4',
    docPath: '.claude/commands/lidr-spec-ff.md',
    relatedSkills: [
      'bmad-prd',
      'bmad-create-architecture',
      'lidr-generate-rf',
      'lidr-user-stories',
    ],
  },
  {
    id: 'lidr-spec-apply',
    name: 'lidr-spec-apply',
    tier: 'tactical',
    description:
      'Implementa task-by-task el tasks.md del change. AGENT MUST EXECUTE unit + curl + Playwright per spec-execution.md.',
    authorizedRoles: ['Dev', 'TL'],
    precondition: 'tasks.md válido (post-ff)',
    argument: '[change-name]',
    model: 'sonnet',
    gateContribution: 'Gate 4',
    docPath: '.claude/commands/lidr-spec-apply.md',
    relatedSkills: ['lidr-pr-description', 'lidr-dev-handoff-qa', 'lidr-adr'],
  },
  {
    id: 'lidr-spec-verify',
    name: 'lidr-spec-verify',
    tier: 'tactical',
    description:
      'Verificación final: re-ejecuta tests, detecta docs drift, genera test-report.md con verdict PASSED/WARNINGS/CRITICAL.',
    authorizedRoles: ['Dev', 'TL'],
    precondition: 'Apply completo',
    argument: '[change-name]',
    model: 'sonnet',
    gateContribution: 'Gate 4',
    docPath: '.claude/commands/lidr-spec-verify.md',
    relatedSkills: ['lidr-test-execution-report', 'bmad-testarch-automate', 'lidr-bug-report'],
  },
  {
    id: 'lidr-spec-archive',
    name: 'lidr-spec-archive',
    tier: 'tactical',
    description:
      'Archiva un change verificado moviéndolo a docs/projects/{cliente}/changes/archive/YYYY-MM-DD-<name>/ y actualiza índices.',
    authorizedRoles: ['Dev', 'TL'],
    precondition: 'test-report verdict PASSED (o WARNINGS aceptadas)',
    argument: '[change-name]',
    model: 'sonnet',
    gateContribution: 'Gate 4',
    docPath: '.claude/commands/lidr-spec-archive.md',
  },
  {
    id: 'lidr-spec-continue',
    name: 'lidr-spec-continue',
    tier: 'tactical',
    description:
      'Diagnostica el estado actual de un change pausado y dispatcha al siguiente paso del lifecycle.',
    authorizedRoles: ['Dev', 'TL'],
    precondition: 'Container existente',
    argument: '[change-name]',
    model: 'sonnet',
    gateContribution: 'Gate 4',
    docPath: '.claude/commands/lidr-spec-continue.md',
  },
  {
    id: 'lidr-spec-bulk-archive',
    name: 'lidr-spec-bulk-archive',
    tier: 'tactical',
    description:
      'Archiva todos los changes con verdict PASSED en una operación masiva, con confirmación interactiva.',
    authorizedRoles: ['TL'],
    precondition: 'Múltiples changes verificados',
    argument: '[glob-filter]',
    model: 'sonnet',
    gateContribution: 'Gate 4',
    docPath: '.claude/commands/lidr-spec-bulk-archive.md',
  },

  // Tier 2 — Tactical (4, generic ticket/dev workflow)
  {
    id: 'lidr-create-ticket',
    name: 'lidr-create-ticket',
    tier: 'tactical',
    description: 'Create a new ticket with full folder structure (ticket.md, plan.md, resources/)',
    authorizedRoles: ['Dev', 'TL', 'PO'],
    precondition: 'Ninguna',
    argument: '[type]',
    model: 'sonnet',
    docPath: '.claude/commands/lidr-create-ticket.md',
    relatedSkills: ['lidr-refinement-notes'],
  },
  {
    id: 'lidr-enrich-ticket',
    name: 'lidr-enrich-ticket',
    tier: 'tactical',
    description:
      'Validate ticket completeness and structure using the lidr-refinement-notes skill (ticket validation)',
    authorizedRoles: ['Dev', 'TL', 'PO'],
    precondition: 'Ticket existente en backlog/active/archived',
    argument: '[ticket-id]',
    model: 'sonnet',
    docPath: '.claude/commands/lidr-enrich-ticket.md',
    relatedSkills: ['lidr-refinement-notes'],
  },
  {
    id: 'lidr-commit',
    name: 'lidr-commit',
    tier: 'tactical',
    description: 'Create a conventional commit from staged changes following project standards',
    authorizedRoles: ['Dev', 'TL'],
    precondition: 'Cambios staged en git',
    argument: '[commit-message]',
    model: 'sonnet',
    docPath: '.claude/commands/lidr-commit.md',
    relatedSkills: [],
  },
  {
    id: 'lidr-improve-docs',
    name: 'lidr-improve-docs',
    tier: 'tactical',
    description: 'Audit and improve project documentation via the doc-improver agent',
    authorizedRoles: ['TL', 'Dev', 'QA'],
    precondition: 'Ninguna',
    argument: '[path]',
    model: 'sonnet',
    docPath: '.claude/commands/lidr-improve-docs.md',
    relatedSkills: ['lidr-audit-standards'],
  },

  // Tier 3 — Utility (2, generic)
  {
    id: 'sync-setup',
    name: 'sync-setup',
    tier: 'utility',
    description:
      'Sincroniza toda la configuración de AI (rules, skills, commands, agents, MCP, hooks)',
    authorizedRoles: ['ALL'],
    precondition: 'Ninguna',
    model: 'sonnet',
    docPath: '.claude/commands/sync-setup.md',
  },
  {
    id: 'test-hooks',
    name: 'test-hooks',
    tier: 'utility',
    description: 'Interactive testing for cross-platform hooks (platform-specific coverage)',
    authorizedRoles: ['ALL'],
    precondition: 'Ninguna',
    model: 'sonnet',
    docPath: '.claude/commands/test-hooks.md',
  },
];

// Export computed values
export const commandsCount = commands.length;
export const commandsByTier = commands.reduce(
  (acc, command) => {
    const tier = command.tier;
    if (!acc[tier]) {
      acc[tier] = [];
    }
    acc[tier].push(command);
    return acc;
  },
  {} as Record<string, Command[]>
);

export const getCommandsByTier = (tier: 'orchestrator' | 'tactical' | 'utility') =>
  commandsByTier[tier] || [];

export const getCommandById = (id: string) => commands.find((c) => c.id === id);

export const getOrchestratorCommands = () => getCommandsByTier('orchestrator');
export const getTacticalCommands = () => getCommandsByTier('tactical');
export const getUtilityCommands = () => getCommandsByTier('utility');
