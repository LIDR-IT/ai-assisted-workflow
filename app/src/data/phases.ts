/**
 * SINGLE SOURCE OF TRUTH - SDLC Phases & Gates
 *
 * Unified phase model (BMad numbering × LIDR gates) per
 * `.agents/_shared/lidr/UNIFIED-PHASES.md`:
 * - 5 unified phases (0-4) exported as `unifiedPhases`
 * - The legacy LIDR phases 0-8 survive as STAGES (granular `phases` entries
 *   keep their ids and gain `stage` + `unifiedPhase` fields)
 * - Gates G0-G7 keep their IDs; only transition labels changed
 */

export type StageSlug =
  | 'context'
  | 'anytime'
  | 'analysis'
  | 'planning'
  | 'specification'
  | 'sprint-planning'
  | 'development'
  | 'qa'
  | 'security'
  | 'release';

export interface Gate {
  id: number;
  name: string;
  title: string;
  criteria: string;
  approver: string[];
  blocker: boolean; // true = hard gate, false = advisory
}

export interface Phase {
  id: number;
  name: string;
  shortName: string;
  description: string;
  color: string; // Tailwind color class
  bgColor: string;
  borderColor: string;
  duration: string; // typical duration
  /** Stage slug inside the unified phase model (UNIFIED-PHASES.md §1) */
  stage: StageSlug;
  /** Unified phase id (0-4, BMad numbering) this granular phase belongs to */
  unifiedPhase: number;
  entryGate?: Gate;
  exitGate?: Gate;
  keyRoles: string[];
  keyArtifacts: string[];
  dorCriteria: string[];
  dodCriteria: string[];
}

export interface UnifiedPhase {
  id: number;
  /** Display name, e.g. 'Fase 2 — Planning' */
  name: string;
  englishName: string;
  description: string;
  color: string;
  /** Granular phase ids (legacy LIDR phases, now stages) grouped here */
  stages: number[];
  /** Gate ids that close this phase (or its stages) */
  gates: number[];
}

// Gates Definition (8 gates: 0-7)
export const gates: Gate[] = [
  {
    id: 0,
    name: 'gate-0',
    title: 'Gate 0: Analysis → Planning (Intake)',
    criteria:
      'Business Case aprobado, sponsor identificado, presupuesto confirmado, alineación estratégica',
    approver: ['PME', 'Sponsor'],
    blocker: true,
  },
  {
    id: 1,
    name: 'gate-1',
    title: 'Gate 1: Planning → Solutioning (PRD Approved)',
    criteria: 'PRD unificado (F+T) completo, review cruzado ejecutado, riesgos identificados',
    approver: ['Producto', 'R&D'],
    blocker: true,
  },
  {
    id: 2,
    name: 'gate-2',
    title: 'Gate 2: Solutioning — Specs Complete',
    criteria: 'RFs con BDD, NFRs medibles, RTM completo, epic breakdown ejecutado',
    approver: ['Producto', 'QA'],
    blocker: true,
  },
  {
    id: 3,
    name: 'gate-3',
    title: 'Gate 3: Solutioning → Implementation (Ready to Implement)',
    criteria: 'DoR cumplida, capacidad confirmada, commitment firmado',
    approver: ['PO', 'Tech Lead'],
    blocker: true,
  },
  {
    id: 4,
    name: 'gate-4',
    title: 'Gate 4: Implementation — Dev → QA (DoD)',
    criteria: '0 vulnerabilidades Críticas/Altas, code review aprobado, tests pasan',
    approver: ['Dev', 'Seguridad'],
    blocker: true,
  },
  {
    id: 5,
    name: 'gate-5',
    title: 'Gate 5: Implementation — QA → Security (QA Sign-off)',
    criteria: 'Todos los test cases PASS, 0 bugs bloqueantes, regresión limpia',
    approver: ['QA Lead'],
    blocker: true,
  },
  {
    id: 6,
    name: 'gate-6',
    title: 'Gate 6: Implementation — Security → Release (Security Sign-off)',
    criteria: 'DAST limpio, pen test completado, vulnerabilidades remediadas',
    approver: ['CISO'],
    blocker: true,
  },
  {
    id: 7,
    name: 'gate-7',
    title: 'Gate 7: Implementation — Release → Producción (Gate Final)',
    criteria: 'CR aprobado, rollback plan validado, post-deploy checklist ready',
    approver: ['Comité de Cambios'],
    blocker: true,
  },
];

// Phases Definition (8 phases: 1-8, plus phase 0)
export const phases: Phase[] = [
  {
    id: 0,
    name: 'Preparación',
    shortName: 'Prep',
    description: 'Clasificación automática de proyecto y discovery documental',
    color: 'gray',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-300',
    duration: '1-2 días',
    stage: 'context',
    unifiedPhase: 0,
    exitGate: gates[0],
    keyRoles: ['TL', 'PME'],
    keyArtifacts: ['Project Classification', 'Document Inventory'],
    dorCriteria: ['Proyecto inicializado'],
    dodCriteria: ['Tipo de proyecto determinado', 'Docs existentes inventariados'],
  },
  {
    id: 1,
    name: 'Originación',
    shortName: 'Orig',
    description: 'Definición del problema de negocio y justificación estratégica',
    color: 'purple',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    duration: '1-2 semanas',
    stage: 'analysis',
    unifiedPhase: 1,
    entryGate: gates[0],
    exitGate: gates[0],
    keyRoles: ['PME', 'PO', 'Sponsor'],
    keyArtifacts: ['Business Case', 'Kick-off', 'Stakeholder Map', 'Epic Jira'],
    dorCriteria: ['Problema claramente definido', 'Sponsor confirmado'],
    dodCriteria: ['Business Case aprobado', 'Stakeholders mapeados', 'Epic creada en Jira'],
  },
  {
    id: 2,
    name: 'Discovery & PRD',
    shortName: 'Disc',
    description: 'Análisis de viabilidad técnica y funcional',
    color: 'blue',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    duration: '2-4 semanas',
    stage: 'planning',
    unifiedPhase: 2,
    entryGate: gates[0],
    exitGate: gates[1],
    keyRoles: ['PO', 'R&D', 'TL'],
    keyArtifacts: ['PRD unificado (F+T)', 'Review Cruzado', 'Risk Log'],
    dorCriteria: ['Business Case aprobado', 'Equipo asignado'],
    dodCriteria: [
      'PRD unificado (F+T) completo',
      'Review cruzado ejecutado',
      'Riesgos identificados',
    ],
  },
  {
    id: 3,
    name: 'Especificación',
    shortName: 'Spec',
    description: 'Generación de requisitos funcionales y no funcionales',
    color: 'cyan',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-300',
    duration: '1-2 semanas',
    stage: 'specification',
    unifiedPhase: 3,
    entryGate: gates[1],
    exitGate: gates[2],
    keyRoles: ['PO', 'TL', 'QA'],
    keyArtifacts: ['RFs con BDD', 'NFRs medibles', 'RTM', 'Epic Breakdown'],
    dorCriteria: ['PRDs aprobados', 'QA disponible para revisión'],
    dodCriteria: ['RFs con criterios BDD', 'NFRs medibles', 'RTM 100%', 'Epics descompuestas'],
  },
  {
    id: 4,
    name: 'Sprint Planning',
    shortName: 'Plan',
    description: 'Planificación detallada y commitment del sprint',
    color: 'teal',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-300',
    duration: '2-3 días',
    stage: 'sprint-planning',
    unifiedPhase: 3,
    entryGate: gates[2],
    exitGate: gates[3],
    keyRoles: ['PO', 'SM', 'TL', 'Dev'],
    keyArtifacts: ['User Stories', 'Sprint Capacity', 'Refinement Notes', 'Sprint Commitment'],
    dorCriteria: ['RFs completos', 'Equipo disponible', 'Capacity conocida'],
    dodCriteria: ['US con DoR', 'Sprint committed', 'Capacity confirmada'],
  },
  {
    id: 5,
    name: 'Desarrollo',
    shortName: 'Dev',
    description: 'Implementación con quality gates automáticos',
    color: 'orange',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    duration: '1-3 semanas',
    stage: 'development',
    unifiedPhase: 4,
    entryGate: gates[3],
    exitGate: gates[4],
    keyRoles: ['Dev', 'TL'],
    keyArtifacts: ['Código', 'PR Description', 'Dev Handoff', 'ADRs'],
    dorCriteria: ['Sprint committed', 'Environment ready'],
    dodCriteria: ['Code review aprobado', 'SAST/SCA limpio', 'Tests pasan', 'Handoff QA completo'],
  },
  {
    id: 6,
    name: 'QA & Testing',
    shortName: 'QA',
    description: 'Testing exhaustivo y validación funcional',
    color: 'sky',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-300',
    duration: '1-2 semanas',
    stage: 'qa',
    unifiedPhase: 4,
    entryGate: gates[4],
    exitGate: gates[5],
    keyRoles: ['QA', 'QA Lead'],
    keyArtifacts: ['Test Plan', 'Test Cases', 'Test Execution Report', 'Bug Reports'],
    dorCriteria: ['Handoff dev completo', 'Environment estable'],
    dodCriteria: ['Test cases ejecutados', '0 bugs bloqueantes', 'QA sign-off'],
  },
  {
    id: 7,
    name: 'Seguridad',
    shortName: 'Sec',
    description: 'Validación de seguridad y compliance',
    color: 'red',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    duration: '3-5 días',
    stage: 'security',
    unifiedPhase: 4,
    entryGate: gates[5],
    exitGate: gates[6],
    keyRoles: ['Security', 'CISO'],
    keyArtifacts: ['DAST Report', 'Pen Test Report', 'Vuln Assessment', 'Security Checklist'],
    dorCriteria: ['QA sign-off', 'Pre-prod environment ready'],
    dodCriteria: ['DAST limpio', 'Pen test aprobado', 'Security sign-off'],
  },
  {
    id: 8,
    name: 'Despliegue',
    shortName: 'Deploy',
    description: 'Release a producción con monitoreo',
    color: 'emerald',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    duration: '1-2 días',
    stage: 'release',
    unifiedPhase: 4,
    entryGate: gates[6],
    exitGate: gates[7],
    keyRoles: ['DevOps', 'PME'],
    keyArtifacts: ['Change Request', 'Release Notes', 'Rollback Plan', 'Post-deploy Checklist'],
    dorCriteria: ['Security sign-off', 'CR aprobado'],
    dodCriteria: ['Deploy exitoso', 'Monitoreo activo', 'Post-deploy checklist completo'],
  },
  {
    id: 99,
    name: 'Cross-cutting',
    shortName: 'Cross',
    description:
      'Skills que aplican a múltiples fases del SDLC sin estar atados a una fase específica',
    color: 'violet',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-300',
    duration: 'Variable',
    stage: 'anytime',
    unifiedPhase: 0,
    keyRoles: ['TL', 'Architect', 'UX'],
    keyArtifacts: ['Architecture Doc', 'UX Design Spec', 'Rules', 'Implementation Phases'],
    dorCriteria: ['Contexto de proyecto disponible'],
    dodCriteria: ['Artefacto cross-cutting completado'],
  },
  {
    id: 100,
    name: 'Development',
    shortName: 'Dev',
    description: 'Skills para desarrollo y mejora del propio ecosistema SDLC',
    color: 'indigo',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-300',
    duration: 'Variable',
    stage: 'anytime',
    unifiedPhase: 0,
    keyRoles: ['TL', 'DevOps', 'Architect'],
    keyArtifacts: ['Skills', 'Commands', 'Hooks', 'Agents', 'MCPs'],
    dorCriteria: ['Ecosistema SDLC activo'],
    dodCriteria: ['Nuevo skill/command/hook funcionando'],
  },
  {
    // DEPRECATED: kept for backward compat only. BMad skills now resolve
    // through the unified phases (0-4) — do not assign new artifacts here.
    id: 200,
    name: 'BMad Library',
    shortName: 'BMad',
    description:
      'BMad Method framework: agents, CIS innovation, test architect, PRD, architecture, sprint, review, meta, utilities',
    color: 'amber',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    duration: 'On-demand',
    stage: 'anytime',
    unifiedPhase: 0,
    keyRoles: ['PO', 'TL', 'Dev', 'QA', 'PME', 'SM'],
    keyArtifacts: ['Agents', 'PRDs', 'Stories', 'Test Plans', 'Architecture'],
    dorCriteria: ['BMad framework installed in _bmad/'],
    dodCriteria: ['BMad skill invoked successfully'],
  },
];

// Unified Phases Definition (5 phases, BMad numbering — UNIFIED-PHASES.md §1)
export const unifiedPhases: UnifiedPhase[] = [
  {
    id: 0,
    name: 'Fase 0 — Context & Anytime',
    englishName: 'Context & Anytime',
    description:
      'Contexto de proyecto (brownfield) y skills transversales invocables en cualquier momento. Stages: context, anytime.',
    color: 'gray',
    stages: [0, 99, 100],
    gates: [], // checklist "Context Ready" se evalúa como evidencia en G0
  },
  {
    id: 1,
    name: 'Fase 1 — Analysis',
    englishName: 'Analysis',
    description:
      'Análisis y originación: business case, research, brief. Stage: analysis (ex-Fase 1 Originación). Cierra con Gate 0 (Intake).',
    color: 'purple',
    stages: [1],
    gates: [0],
  },
  {
    id: 2,
    name: 'Fase 2 — Planning',
    englishName: 'Planning',
    description:
      'PRD unificado, UX y riesgos. Stage: planning (ex-Fase 2 Discovery & PRD). Cierra con Gate 1 (PRD Approved).',
    color: 'blue',
    stages: [2],
    gates: [1],
  },
  {
    id: 3,
    name: 'Fase 3 — Solutioning',
    englishName: 'Solutioning',
    description:
      'Arquitectura, RFs/NFRs, epics y sprint planning. Stages: specification (ex-Fase 3) → Gate 2 (Specs Complete), sprint-planning (ex-Fase 4) → Gate 3 (Ready to Implement).',
    color: 'cyan',
    stages: [3, 4],
    gates: [2, 3],
  },
  {
    id: 4,
    name: 'Fase 4 — Implementation',
    englishName: 'Implementation',
    description:
      'Stage-gates: development (ex-Fase 5) → G4, qa (ex-Fase 6) → G5, security (ex-Fase 7) → G6, release (ex-Fase 8) → G7.',
    color: 'orange',
    stages: [5, 6, 7, 8],
    gates: [4, 5, 6, 7],
  },
];

// Phase colors for React Flow diagrams
export const phaseColors = {
  0: 'slate', // Preparación
  1: 'purple', // Originación
  2: 'blue', // Discovery
  3: 'cyan', // Especificación
  4: 'teal', // Sprint Planning
  5: 'orange', // Desarrollo
  6: 'sky', // QA
  7: 'red', // Seguridad
  8: 'emerald', // Despliegue
  99: 'violet', // Cross-cutting
  100: 'indigo', // Development
};

// Component type colors for UI badges and categorization
export const componentColors = {
  rule: 'bg-emerald-100 text-emerald-700', // Rules (governance)
  skill: 'bg-blue-100 text-blue-700', // Skills by phase (see phaseColorClasses)
  command: 'bg-emerald-100 text-emerald-700', // Commands (orchestrators)
  hook: 'bg-amber-100 text-amber-700', // Hooks (guardians)
  agent: 'bg-violet-100 text-violet-700', // Agents (autonomous)
  template: 'bg-cyan-100 text-cyan-700', // Templates & docs
  config: 'bg-slate-100 text-slate-700', // Config files
  orchestrator: 'bg-indigo-100 text-indigo-700', // Special category
};

// Phase colors as Tailwind CSS classes for UI components
export const phaseColorClasses = {
  0: 'bg-gray-100 text-gray-700', // Preparación
  1: 'bg-purple-100 text-purple-700', // Originación
  2: 'bg-blue-100 text-blue-700', // Discovery
  3: 'bg-cyan-100 text-cyan-700', // Especificación
  4: 'bg-teal-100 text-teal-700', // Sprint Planning (using violet as close match)
  5: 'bg-orange-100 text-orange-700', // Desarrollo
  6: 'bg-sky-100 text-sky-700', // QA
  7: 'bg-red-100 text-red-700', // Seguridad
  8: 'bg-emerald-100 text-emerald-700', // Despliegue
  99: 'bg-violet-100 text-violet-700', // Cross-cutting
  100: 'bg-indigo-100 text-indigo-700', // Development
};

// Export utilities
export const getPhaseById = (id: number) => phases.find((p) => p.id === id);
export const getGateById = (id: number) => gates.find((g) => g.id === id);
/** Resolve the unified phase (0-4) that a granular phase / stage id (0-8, 99, 100, 200) belongs to */
export const getUnifiedPhase = (granularPhaseId: number): UnifiedPhase | undefined => {
  const granular = getPhaseById(granularPhaseId);
  if (!granular) {
    return undefined;
  }
  return unifiedPhases.find((u) => u.id === granular.unifiedPhase);
};
export const getUnifiedPhaseById = (id: number): UnifiedPhase | undefined =>
  unifiedPhases.find((u) => u.id === id);
export const getPhaseColor = (phaseId: number) =>
  phaseColors[phaseId as keyof typeof phaseColors] || 'gray';
export const getPhaseColorClass = (phaseId: number) =>
  phaseColorClasses[phaseId as keyof typeof phaseColorClasses] || componentColors.config;
export const getComponentColor = (type: keyof typeof componentColors) =>
  componentColors[type] || componentColors.config;

export const totalPhases = phases.length;
export const totalGates = gates.length;

// Phase progression
export const getNextPhase = (currentPhaseId: number) => getPhaseById(currentPhaseId + 1);
export const getPreviousPhase = (currentPhaseId: number) => getPhaseById(currentPhaseId - 1);
