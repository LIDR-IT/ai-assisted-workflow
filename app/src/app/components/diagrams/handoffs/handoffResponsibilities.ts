/**
 * Handoff Responsibilities Data
 *
 * Defines the responsibilities, artifacts, and AI automation for each handoff between phases.
 * Extracted from HandoffsTemplates.tsx for better maintainability.
 */

export interface HandoffResponsibility {
  id: number;
  name: string;
  from: string;
  to: string;
  gate: string;
  gateNum: number;
  producer: { role: string; action: string }[];
  receiver: { role: string; action: string }[];
  artifacts: string[];
  aiAutomation?: string;
  color: string;
  borderColor: string;
}

/**
 * Creates handoff responsibilities with client-specific tool names
 */
export const createHandoffs = (trackingTool: string): HandoffResponsibility[] => [
  {
    id: 1,
    name: 'Business Case + Kick-off',
    from: 'Fase 1: Originacion',
    to: 'Fase 2: Discovery & PRD',
    gate: 'Gate 0',
    gateNum: 0,
    producer: [
      {
        role: 'PME',
        action: `Coordina kick-off, documenta acta, gestiona epica en ${trackingTool}`,
      },
      { role: 'Negocio / Sponsor', action: 'Define problema de negocio, ROI, vision estrategica' },
    ],
    receiver: [
      { role: 'Producto (PO)', action: 'Recibe Business Case como input para PRD Funcional' },
      { role: 'R&D / Core', action: 'Recibe vision tecnica como input para PRD Tecnico' },
    ],
    artifacts: [
      'Business Case (T-ORI-001)',
      'Acta de Kick-off (T-ORI-002)',
      'Stakeholder Map (T-ORI-003)',
      `Epica ${trackingTool} (T-ORI-004)`,
    ],
    aiAutomation: 'Skills: business-case, kickoff, stakeholder-map, tracking-integration',
    color: 'bg-purple-50',
    borderColor: 'border-purple-300',
  },
  {
    id: 2,
    name: 'PRDs Aprobados',
    from: 'Fase 2: Discovery & PRD',
    to: 'Fase 3: Especificacion',
    gate: 'Gate 1',
    gateNum: 1,
    producer: [
      { role: 'Producto (PO)', action: 'Redacta PRD Funcional con journeys, alcance y metricas' },
      { role: 'R&D / Core', action: 'Redacta PRD Tecnico con algoritmos, PoC y arquitectura' },
      { role: 'Producto + R&D', action: 'Ejecutan review cruzado (cl-review) y firman acuerdo' },
    ],
    receiver: [
      { role: 'Producto (PO)', action: 'Usa PRDs como input para generar RFs con generate-rf' },
      { role: 'Tech Lead', action: 'Usa PRD-T para generar NFRs con generate-nfr' },
      { role: 'QA Lead', action: 'Revisa PRDs para anticipar estrategia de testing' },
    ],
    artifacts: [
      'PRD Tecnico (T-PRD-001)',
      'PRD Funcional (T-PRD-002)',
      'Review Cruzado (T-PRD-003)',
      'Risk Log (T-PRD-004)',
    ],
    aiAutomation: 'Skills: prd-tecnico, prd-funcional, risk-log. Rule: cl-review',
    color: 'bg-blue-50',
    borderColor: 'border-blue-300',
  },
  {
    id: 3,
    name: 'RFs + NFRs + RTM',
    from: 'Fase 3: Especificacion',
    to: 'Fase 4: Sprint Planning',
    gate: 'Gate 2',
    gateNum: 2,
    producer: [
      { role: 'Producto (PO)', action: 'Genera y valida RFs con criterios BDD' },
      { role: 'Tech Lead', action: 'Genera y valida NFRs con metricas medibles' },
      { role: 'PO + Tech Lead', action: 'Generan RTM y ejecutan epic-breakdown' },
    ],
    receiver: [
      { role: 'PO', action: 'Convierte RFs en User Stories para sprint backlog' },
      { role: 'Scrum Master', action: 'Facilita refinement con US listas' },
      { role: 'QA Lead', action: 'Valida que RFs son testables (BDD-ready)' },
    ],
    artifacts: [
      'RFs con BDD (T-RF-001)',
      'NFRs (T-NFR-001)',
      'RTM (T-RF-004)',
      'Epic Breakdown (T-RF-005)',
    ],
    aiAutomation:
      'Command: /validate-requirements. Skills: generate-rf, generate-nfr, epic-breakdown',
    color: 'bg-cyan-50',
    borderColor: 'border-cyan-300',
  },
  {
    id: 4,
    name: 'Sprint Committed',
    from: 'Fase 4: Sprint Planning',
    to: 'Fase 5: Desarrollo',
    gate: 'Gate 3',
    gateNum: 3,
    producer: [
      { role: 'PO', action: 'Prioriza US, define sprint goal, firma commitment' },
      { role: 'Tech Lead', action: 'Valida capacidad tecnica, firma commitment' },
      { role: 'Scrum Master', action: 'Calcula capacity con buffer 15-20%' },
    ],
    receiver: [
      { role: 'Dev Team', action: 'Recibe sprint backlog con US que cumplen DoR' },
      { role: 'QA', action: 'Anticipa scope de testing desde US del sprint' },
    ],
    artifacts: [
      'US con BDD (T-SPR-001)',
      'DoR Checklist (T-SPR-002)',
      'Sprint Capacity (T-SPR-003)',
      'Sprint Commitment (T-SPR-004)',
    ],
    aiAutomation: 'Skills: user-stories, sprint-capacity. Rules: cl-dor, sprint-commitment',
    color: 'bg-violet-50',
    borderColor: 'border-violet-300',
  },
  {
    id: 5,
    name: 'Codigo Integrado + Handoff Dev->QA',
    from: 'Fase 5: Desarrollo',
    to: 'Fase 6: QA',
    gate: 'Gate 4',
    gateNum: 4,
    producer: [
      { role: 'Dev', action: 'Implementa, crea PR, genera handoff dev->QA' },
      { role: 'Tech Lead', action: 'Code review, valida DoD, aprueba merge' },
    ],
    receiver: [
      { role: 'QA Lead', action: 'Recibe handoff con instrucciones de testing' },
      { role: 'QA', action: 'Genera test cases BDD desde handoff + ticket + diff' },
    ],
    artifacts: [
      'PR aprobado (T-DEV-001)',
      'DoD Checklist (T-DEV-002)',
      'Handoff Dev->QA (T-IA-DEV-003)',
    ],
    aiAutomation:
      'Command: /implement-ticket. Skills: pr-description, dev-handoff-qa. Hook: dtc-write-guard. SubAgent: qa-agent',
    color: 'bg-orange-50',
    borderColor: 'border-orange-300',
  },
  {
    id: 6,
    name: 'QA Sign-off',
    from: 'Fase 6: QA',
    to: 'Fase 7: Seguridad',
    gate: 'Gate 5',
    gateNum: 5,
    producer: [
      { role: 'QA', action: 'Ejecuta test cases (funcional + BDD + regresion)' },
      { role: 'QA Lead', action: 'Firma so-qa sign-off (firma humana obligatoria)' },
    ],
    receiver: [
      { role: 'Sec Lead', action: 'Recibe confirmacion de calidad funcional' },
      { role: 'Seguridad', action: 'Inicia DAST + pen testing sobre codigo validado' },
    ],
    artifacts: [
      'Test Plan (T-QA-001)',
      'Test Cases BDD (T-QA-002)',
      'Execution Report (T-QA-004)',
      'QA Sign-off (T-QA-005)',
    ],
    aiAutomation: 'Command: /prepare-testing. SubAgent: qa-agent',
    color: 'bg-sky-50',
    borderColor: 'border-sky-300',
  },
  {
    id: 7,
    name: 'Security Sign-off',
    from: 'Fase 7: Seguridad',
    to: 'Fase 8: Despliegue',
    gate: 'Gate 6',
    gateNum: 6,
    producer: [
      { role: 'Seguridad', action: 'Ejecuta DAST, pen testing, evalua OWASP' },
      { role: 'Sec Lead', action: 'Firma so-security (firma humana obligatoria)' },
    ],
    receiver: [
      { role: 'PME', action: 'Prepara Change Request con security clearance' },
      { role: 'DevOps', action: 'Inicia preparacion de deployment' },
    ],
    artifacts: [
      'Vuln Assessment (T-SEC-001)',
      'DAST Report (T-SEC-002)',
      'Pen Test (T-SEC-003)',
      'Security Sign-off (T-SEC-004)',
    ],
    aiAutomation: 'SubAgent: security-agent',
    color: 'bg-red-50',
    borderColor: 'border-red-300',
  },
  {
    id: 8,
    name: 'Release a Produccion',
    from: 'Fase 8: Despliegue',
    to: 'Post-deploy & Retrospectiva',
    gate: 'Gate 7',
    gateNum: 7,
    producer: [
      { role: 'PME', action: 'Prepara CR, coordina aprobacion del Comite' },
      { role: 'DevOps', action: 'Ejecuta deploy, rollback plan, monitoreo' },
      { role: 'PO + Dev', action: 'Generan release notes (negocio + tecnico)' },
    ],
    receiver: [
      { role: 'Scrum Master + PME', action: 'Facilitan retrospectiva data-driven' },
      { role: 'Stakeholders', action: 'Reciben release notes' },
    ],
    artifacts: [
      'Change Request (T-DEP-001)',
      'Rollback Plan (T-DEP-002)',
      'Release Notes (T-DEP-003)',
      'Post-deploy CL (T-DEP-004)',
    ],
    aiAutomation: 'Command: /create-release-notes. SubAgents: release-agent, metrics-agent',
    color: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
  },
];
