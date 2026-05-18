/**
 * SINGLE SOURCE OF TRUTH - Commands Registry
 * Centralizes all commands data to eliminate duplication
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
  // Tier 1 — Orchestrators (7)
  {
    id: 'advance-gate',
    name: 'advance-gate',
    tier: 'orchestrator',
    description: 'Evalúa gate, genera handoff package y transiciona fase formalmente',
    authorizedRoles: ['PME', 'PO', 'TL', 'QA', 'Sec', 'DevOps'],
    precondition: 'Gate N-1 PASS',
    argument: '[N]',
    model: 'opus',
    gateContribution: 'All Gates 0-7',
    docPath: '.claude/commands/advance-gate.md',
    relatedSkills: ['business-case', 'prd-tecnico', 'validate-requirements', 'security-checklist'],
  },
  {
    id: 'check-readiness',
    name: 'check-readiness',
    tier: 'orchestrator',
    description: 'Pre-implementation validation: PRD, team, dependencies, readiness score',
    authorizedRoles: ['PME', 'PO', 'TL', 'QA'],
    precondition: 'Ninguna',
    argument: '[name]',
    model: 'sonnet',
    gateContribution: 'Pre-Gate 3',
    docPath: '.claude/commands/check-readiness.md',
    relatedSkills: ['epic-breakdown', 'sprint-capacity'],
  },
  {
    id: 'course-correct',
    name: 'course-correct',
    tier: 'orchestrator',
    description: 'Mid-project course correction for managing deviations and realigning projects',
    authorizedRoles: ['PME', 'PO', 'TL'],
    precondition: 'Proyecto en progreso',
    argument: '[project] [type]',
    model: 'sonnet',
    gateContribution: 'All Gates',
    docPath: '.claude/commands/course-correct.md',
    relatedSkills: ['risk-log', 'retrospective', 'epic-review'],
  },
  {
    id: 'validate-prd',
    name: 'validate-prd',
    tier: 'orchestrator',
    description:
      'LIDR SDLC PRD quality validation with automated scoring and actionable recommendations',
    authorizedRoles: ['PO', 'TL', 'QA', 'PME'],
    precondition: 'PRDs en draft completados',
    argument: '[name]',
    model: 'sonnet',
    gateContribution: 'Gate 1',
    docPath: '.claude/commands/validate-prd.md',
    relatedSkills: ['prd-funcional', 'prd-tecnico', 'review-cruzado'],
  },
  {
    id: 'implement-ticket',
    name: 'implement-ticket',
    tier: 'orchestrator',
    description: 'Workflow completo: ticket → plan → implementación → PR → handoff QA',
    authorizedRoles: ['Dev', 'TL'],
    precondition: 'Ticket status "Ready for Dev"',
    argument: '[ID]',
    model: 'sonnet',
    gateContribution: 'Gate 4',
    docPath: '.claude/commands/implement-ticket.md',
    relatedSkills: ['pr-description', 'dev-handoff-qa', 'adr', 'tech-debt'],
  },
  {
    id: 'prepare-testing',
    name: 'prepare-testing',
    tier: 'orchestrator',
    description: 'Genera suite de testing completa desde ticket Ready for QA',
    authorizedRoles: ['QA', 'QA Lead'],
    precondition: 'Ticket status "Ready for QA"',
    argument: '[ID]',
    model: 'sonnet',
    gateContribution: 'Gate 5',
    docPath: '.claude/commands/prepare-testing.md',
    relatedSkills: [
      'test-plan',
      'create-test-cases',
      'bug-report',
      'test-execution-report',
      'regression-suite',
    ],
  },
  {
    id: 'validate-requirements',
    name: 'validate-requirements',
    tier: 'orchestrator',
    description: 'Orquesta Fase 3: genera RFs + NFRs + RTM + epic breakdown',
    authorizedRoles: ['PO', 'TL'],
    precondition: 'Gate 1 PASS (PRDs aprobados)',
    argument: '[name]',
    model: 'sonnet',
    gateContribution: 'Gate 2',
    docPath: '.claude/commands/validate-requirements.md',
    relatedSkills: ['generate-rf', 'generate-nfr', 'validate-requirements', 'epic-breakdown'],
  },
  {
    id: 'init-project-docs',
    name: 'init-project-docs',
    tier: 'orchestrator',
    description: 'Scaffolding documental completo desde templates',
    authorizedRoles: ['TL', 'PO', 'PME'],
    precondition: 'Proyecto nuevo aprobado',
    argument: '[name]',
    model: 'sonnet',
    docPath: '.claude/commands/init-project-docs.md',
    relatedSkills: ['architecture-doc', 'generate-rule'],
  },
  {
    id: 'validate-project-docs',
    name: 'validate-project-docs',
    tier: 'orchestrator',
    description: 'Valida documentación contra criterios de templates',
    authorizedRoles: ['TL', 'PO', 'QA', 'PME'],
    precondition: 'Framework documentation and rules exist',
    argument: '[name]',
    model: 'sonnet',
    docPath: '.claude/commands/validate-project-docs.md',
  },
  {
    id: 'document-project',
    name: 'document-project',
    tier: 'orchestrator',
    description:
      'LIDR SDLC workflow orchestration for complete project documentation with step-by-step guidance and validation integration',
    authorizedRoles: ['TL', 'PO', 'PME'],
    precondition: 'Project approved for documentation',
    argument: '[name]',
    model: 'sonnet',
    docPath: '.claude/commands/document-project.md',
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
  },

  // Tier 2 — Tactical (6)
  {
    id: 'create-release-notes',
    name: 'create-release-notes',
    tier: 'tactical',
    description: 'Genera changelog desde PRs mergeados con executive summary',
    authorizedRoles: ['DevOps', 'TL', 'Release Manager'],
    precondition: 'PRs mergeados desde último tag',
    model: 'sonnet',
    gateContribution: 'Gate 7',
    docPath: '.claude/commands/create-release-notes.md',
    relatedSkills: ['release-notes'],
  },
  {
    id: 'product-brief',
    name: 'product-brief',
    tier: 'tactical',
    description: 'Producto brief ligero LIDR SDLC para definición rápida de productos',
    authorizedRoles: ['PME', 'PO', 'TL'],
    precondition: 'Concepto de producto inicial',
    argument: '[name]',
    model: 'sonnet',
    gateContribution: 'Pre-Gate 0',
    docPath: '.claude/commands/product-brief.md',
    relatedSkills: ['business-case', 'stakeholder-map'],
  },
  {
    id: 'sprint-health',
    name: 'sprint-health',
    tier: 'tactical',
    description: 'Monitoreo activo de salud del sprint con detección de riesgos LIDR SDLC',
    authorizedRoles: ['SM', 'PME', 'TL', 'QA'],
    precondition: 'Sprint activo en progreso',
    argument: '[sprint-id]',
    model: 'sonnet',
    gateContribution: 'Gates 3-6',
    docPath: '.claude/commands/sprint-health.md',
    relatedSkills: ['sprint-capacity', 'retrospective', 'risk-log'],
  },
  {
    id: 'create-branch',
    name: 'create-branch',
    tier: 'tactical',
    description: 'Crea feature branch desde ticket Jira con naming conventions',
    authorizedRoles: ['Dev', 'TL'],
    precondition: 'Ticket asignado al dev',
    argument: '[ID]',
    model: 'haiku',
    docPath: '.claude/commands/create-branch.md',
  },
  {
    id: 'create-pr',
    name: 'create-pr',
    tier: 'tactical',
    description: 'Crea PR con description auto-generada desde contexto',
    authorizedRoles: ['Dev', 'TL'],
    precondition: 'Branch con commits listos',
    argument: '[ID]',
    model: 'sonnet',
    gateContribution: 'Gate 4',
    docPath: '.claude/commands/create-pr.md',
    relatedSkills: ['pr-description'],
  },
  {
    id: 'quick-spec',
    name: 'quick-spec',
    tier: 'tactical',
    description: 'Especificación ligera para features pequeñas (≤40h effort) basada en LIDR SDLC',
    authorizedRoles: ['PO', 'TL', 'Dev'],
    precondition: 'Feature < 40h effort estimate',
    argument: '[feature-name] [--type=enhancement|bugfix|integration|api] [--effort=hours]',
    model: 'sonnet',
    gateContribution: 'Pre-Gate 2 (lightweight requirements)',
    docPath: '.claude/commands/quick-spec.md',
    relatedSkills: ['generate-rf', 'user-stories', 'validate-requirements', 'create-test-cases'],
  },
  {
    id: 'quick-dev',
    name: 'quick-dev',
    tier: 'tactical',
    description: 'Flujo de desarrollo rápido para tareas pequeñas (< 8 horas)',
    authorizedRoles: ['Dev', 'TL'],
    precondition: 'Tarea < 8h effort estimate',
    argument: '[task-id]',
    model: 'sonnet',
    gateContribution: 'Gate 4',
    docPath: '.claude/commands/quick-dev.md',
    relatedSkills: ['pr-description', 'dev-handoff-qa'],
  },
  {
    id: 'update-changelog',
    name: 'update-changelog',
    tier: 'tactical',
    description: 'Actualiza CHANGELOG.md con versión nueva',
    authorizedRoles: ['DevOps', 'TL', 'Release Manager'],
    precondition: 'Release notes generadas',
    argument: '[version]',
    model: 'haiku',
    docPath: '.claude/commands/update-changelog.md',
  },
  {
    id: 'sync-docs',
    name: 'sync-docs',
    tier: 'tactical',
    description: 'Sincroniza documentación tras cambios de código',
    authorizedRoles: ['Dev', 'TL', 'QA'],
    precondition: 'Cambios mergeados',
    argument: '[scope]',
    model: 'sonnet',
    docPath: '.claude/commands/sync-docs.md',
  },

  {
    id: 'create-branch-enhanced',
    name: '/create-branch-enhanced',
    tier: 'tactical',
    description: 'Enhanced branch creation with SDLC tracking integration',
    authorizedRoles: ['Dev', 'Tech Lead'],
    precondition: 'Ticket asignado al dev',
    argument: '[ID]',
    model: 'sonnet',
    gateContribution: 'Pre-Gate 4',
    docPath: '.claude/commands/create-branch-enhanced.md',
    relatedSkills: ['sdlc-tracking', 'external-sync'],
  },
  {
    id: 'create-pr-enhanced',
    name: '/create-pr-enhanced',
    tier: 'tactical',
    description: 'Enhanced PR creation with automated handoffs and validation',
    authorizedRoles: ['Dev', 'Tech Lead'],
    precondition: 'Branch con commits listos',
    argument: '[ID]',
    model: 'sonnet',
    gateContribution: 'Gate 4',
    docPath: '.claude/commands/create-pr-enhanced.md',
    relatedSkills: ['automated-handoffs', 'dev-handoff-qa', 'sdlc-tracking'],
  },
  {
    id: 'track-sdlc',
    name: '/track-sdlc',
    tier: 'orchestrator',
    description: 'Centralized SDLC tracking with portfolio management',
    authorizedRoles: ['PME', 'PO', 'TL'],
    precondition: 'Ninguna',
    argument: '[project-id] [action]',
    model: 'sonnet',
    gateContribution: 'All Gates',
    docPath: '.claude/commands/track-sdlc.md',
    relatedSkills: ['sdlc-tracking', 'external-sync'],
  },

  // Tier 3 — Utility (1)
  {
    id: 'lidr-help',
    name: 'help',
    tier: 'utility',
    description: 'Busca en ecosistema de 155+ artefactos y recomienda workflows',
    authorizedRoles: ['ALL'],
    precondition: 'Ninguna',
    argument: '[query]',
    model: 'haiku',
    docPath: '.claude/commands/lidr-help.md',
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
