/**
 * @file Handoffs Templates Data
 * @description Extracted data from HandoffsTemplates.tsx - comprehensive SDLC templates, phases, and handoff information
 */

import type { Node, Edge } from '@xyflow/react';
import { n, e } from '@/app/components/shared/ReactFlowDiagram';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface Template {
  code: string;
  name: string;
  desc: string;
  format: string;
  owner: string;
  mandatory: boolean;
  aiAssist?: 'skill' | 'rule' | 'command' | 'hook' | 'agent' | 'mcp';
  claudePath?: string;
}

export interface PhaseTemplates {
  fase: string;
  faseNum: number;
  color: string;
  borderColor: string;
  gate: string;
  /** Precondiciones de entrada (DoR) */
  dor: string[];
  /** Condiciones de salida unificadas (DoD + Criterios de Aceptacion fusionados) */
  exitCriteria: string[];
  /** Criterios especificos del Gate que no estan cubiertos por exitCriteria */
  gateSpecific?: string[];
  templates: Template[];
}

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

export interface CrossCuttingArtifact {
  category: string;
  title: string;
  desc: string;
  icon: string;
}

export interface AIAssistanceType {
  type: 'skill' | 'rule' | 'command' | 'hook' | 'agent' | 'mcp';
  icon: string;
  label: string;
  color: string;
}

// =============================================================================
// HANDOFF DIAGRAM DATA
// =============================================================================

export const handoffNodes: Node[] = [
  n('f1', -70, 0, 'FASE 1: Originación', 'purple'),
  n('h1', 210, 0, '📦 Handoff 1', 'amber', 'Business Case + Kick-off'),
  n('f2', 420, 0, 'FASE 2: Discovery & PRD', 'blue'),
  n('h2', 700, 0, '📦 Handoff 2', 'amber', 'PRDs aprobados'),
  n('f3', -70, 120, 'FASE 3: Especificación', 'cyan'),
  n('h3', 210, 120, '📦 Handoff 3', 'amber', 'RFs + NFRs + RTM'),
  n('f4', 420, 120, 'FASE 4: Planning', 'violet'),
  n('h4', 700, 120, '📦 Handoff 4', 'amber', 'Sprint Committed'),
  n('f5', -70, 240, 'FASE 5: Desarrollo', 'orange'),
  n('h5', 210, 240, '📦 Handoff 5', 'amber', 'Código Integrado'),
  n('f6', 420, 240, 'FASE 6: QA', 'sky'),
  n('h6', 700, 240, '📦 Handoff 6', 'amber', 'QA Sign-off'),
  n('f7', -70, 360, 'FASE 7: Seguridad', 'red'),
  n('h7', 210, 360, '📦 Handoff 7', 'amber', 'Security Sign-off'),
  n('f8', 420, 360, 'FASE 8: Despliegue', 'emerald'),
  n('h8', 700, 360, '📦 Handoff 8', 'amber', 'Release a PROD'),
];

export const handoffEdges: Edge[] = [
  e('e1', 'f1', 'h1', '', { sourceHandle: 'right', targetHandle: 'left' }),
  e('e2', 'h1', 'f2', '', { sourceHandle: 'right', targetHandle: 'left' }),
  e('e3', 'f2', 'h2', '', { sourceHandle: 'right', targetHandle: 'left' }),
  e('e4', 'h2', 'f3', '', { targetHandle: 'left' }),
  e('e5', 'f3', 'h3', '', { sourceHandle: 'right', targetHandle: 'left' }),
  e('e6', 'h3', 'f4', '', { sourceHandle: 'right', targetHandle: 'left' }),
  e('e7', 'f4', 'h4', '', { sourceHandle: 'right', targetHandle: 'left' }),
  e('e8', 'h4', 'f5', '', { targetHandle: 'left' }),
  e('e9', 'f5', 'h5', '', { sourceHandle: 'right', targetHandle: 'left' }),
  e('e10', 'h5', 'f6', '', { sourceHandle: 'right', targetHandle: 'left' }),
  e('e11', 'f6', 'h6', '', { sourceHandle: 'right', targetHandle: 'left' }),
  e('e12', 'h6', 'f7', '', { targetHandle: 'left' }),
  e('e13', 'f7', 'h7', '', { sourceHandle: 'right', targetHandle: 'left' }),
  e('e14', 'h7', 'f8', '', { sourceHandle: 'right', targetHandle: 'left' }),
  e('e15', 'f8', 'h8', '', { sourceHandle: 'right', targetHandle: 'left' }),
];

// =============================================================================
// HANDOFF RESPONSIBILITIES DATA
// =============================================================================

export const handoffs: HandoffResponsibility[] = [
  {
    id: 1,
    name: 'Business Case + Kick-off',
    from: 'Fase 1: Originacion',
    to: 'Fase 2: Discovery & PRD',
    gate: 'Gate 0',
    gateNum: 0,
    producer: [
      { role: 'PME', action: 'Coordina kick-off, documenta acta, gestiona épica en Jira' },
      { role: 'Negocio / Sponsor', action: 'Define problema de negocio, ROI, vision estratégica' },
    ],
    receiver: [
      { role: 'Producto (PO)', action: 'Recibe Business Case como input para PRD Funcional' },
      { role: 'R&D / Core', action: 'Recibe visión técnica como input para PRD Técnico' },
    ],
    artifacts: [
      'Business Case (T-ORI-001)',
      'Acta de Kick-off (T-ORI-002)',
      'Stakeholder Map (T-ORI-003)',
      'Épica Template (T-ORI-004)',
    ],
    aiAutomation:
      'Skills business-case + kickoff generan borradores estructurados; humano aporta ROI real',
    color: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  {
    id: 2,
    name: 'PRDs aprobados',
    from: 'Fase 2: Discovery & PRD',
    to: 'Fase 3: Especificación',
    gate: 'Gate 1',
    gateNum: 1,
    producer: [
      { role: 'Producto (PO)', action: 'Entrega PRD Funcional aprobado con vision clara' },
      { role: 'R&D / Core', action: 'Entrega PRD Técnico aprobado con limitaciones y capacidades' },
    ],
    receiver: [
      { role: 'Producto (PO)', action: 'Usa PRDs como input para generar Requisitos Funcionales' },
      { role: 'Tech Lead', action: 'Usa PRD-T como input para generar NFRs técnicos medibles' },
    ],
    artifacts: [
      'PRD Técnico (T-PRD-001)',
      'PRD Funcional (T-PRD-002)',
      'Review Cruzado (T-PRD-003)',
      'Risk Log (T-PRD-004)',
      'PoC Report (T-PRD-005)',
    ],
    aiAutomation:
      'Skills prd-tecnico + prd-funcional + review-cruzado + risk-log orquestan toda la fase',
    color: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    id: 3,
    name: 'RFs + NFRs + RTM',
    from: 'Fase 3: Especificación',
    to: 'Fase 4: Planning',
    gate: 'Gate 2',
    gateNum: 2,
    producer: [
      { role: 'Producto (PO)', action: 'Entrega RFs completos con criterios BDD' },
      { role: 'Tech Lead', action: 'Entrega NFRs medibles con umbrales definidos' },
    ],
    receiver: [
      { role: 'Scrum Master', action: 'Usa RFs+NFRs para estimar User Stories' },
      { role: 'QA Lead', action: 'Usa RFs+NFRs para generar Test Plan' },
    ],
    artifacts: [
      'Requisitos Funcionales (T-RF-001)',
      'Requisitos No Funcionales (T-NFR-001)',
      'Dependency Matrix (T-RF-002)',
      'Coherence Checklist (T-RF-003)',
      'NFR Compliance (T-NFR-002)',
      'RTM (T-RF-004)',
      'Epic Breakdown (T-RF-005)',
      'User Journey Map (T-RF-006)',
      'API Contract (T-RF-007)',
      'Data Model (T-RF-008)',
      'Security Requirements (T-RF-009)',
      'Integration Requirements (T-RF-010)',
    ],
    aiAutomation:
      'Skills generate-rf + generate-nfr + validate-requirements + epic-breakdown automatizan toda la fase',
    color: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
  },
  {
    id: 4,
    name: 'Sprint Committed',
    from: 'Fase 4: Planning',
    to: 'Fase 5: Desarrollo',
    gate: 'Gate 3',
    gateNum: 3,
    producer: [
      { role: 'Scrum Master', action: 'Entrega Sprint Planning con capacidad confirmada' },
      { role: 'Producto (PO)', action: 'Entrega User Stories priorizadas con DoR cumplida' },
    ],
    receiver: [
      { role: 'Developers', action: 'Reciben tickets asignados con Definition of Ready' },
      { role: 'QA', action: 'Recibe User Stories para preparación anticipada' },
    ],
    artifacts: [
      'User Stories (T-SPR-001)',
      'Sprint Planning (T-SPR-002)',
      'Capacity Planning (T-SPR-003)',
      'Refinement Notes (T-SPR-004)',
      'Sprint Commitment (T-SPR-005)',
    ],
    aiAutomation: 'Skills user-stories + sprint-capacity + refinement-notes optimizan el planning',
    color: 'bg-violet-50',
    borderColor: 'border-violet-200',
  },
  {
    id: 5,
    name: 'Código Integrado',
    from: 'Fase 5: Desarrollo',
    to: 'Fase 6: QA',
    gate: 'Gate 4',
    gateNum: 4,
    producer: [
      { role: 'Developers', action: 'Entregan código con DoD cumplida y handoff completo' },
      { role: 'Tech Lead', action: 'Valida code quality y aprueba merge' },
    ],
    receiver: [
      { role: 'QA', action: 'Recibe handoff para iniciar testing formal' },
      { role: 'Security', action: 'Recibe código para SAST/SCA analysis' },
    ],
    artifacts: [
      'PR Description (T-DEV-001)',
      'Code Review (T-DEV-002)',
      'Handoff dev→QA (T-DEV-003)',
      'Unit Tests (T-DEV-004)',
      'Tech Debt Log (T-DEV-005)',
      'ADR (T-DEV-006)',
      'API Documentation (T-DEV-007)',
    ],
    aiAutomation:
      'Skills pr-description + dev-handoff-qa + tech-debt + adr automatizan documentación',
    color: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  {
    id: 6,
    name: 'QA Sign-off',
    from: 'Fase 6: QA',
    to: 'Fase 7: Seguridad',
    gate: 'Gate 5',
    gateNum: 5,
    producer: [
      { role: 'QA Lead', action: 'Entrega sign-off formal con todos los test cases PASS' },
      { role: 'QA Engineers', action: 'Entregan test execution report y bug status' },
    ],
    receiver: [
      { role: 'Security', action: 'Recibe build estable para security testing' },
      { role: 'DevOps', action: 'Recibe artefactos para preparar deploy' },
    ],
    artifacts: [
      'Test Plan (T-QA-001)',
      'Test Cases (T-QA-002)',
      'Test Execution Report (T-QA-003)',
      'Bug Report (T-QA-004)',
      'Regression Suite (T-QA-005)',
      'QA Sign-off (T-QA-006)',
      'Performance Test Results (T-QA-007)',
      'User Acceptance Results (T-QA-008)',
    ],
    aiAutomation:
      'Skills test-plan + create-test-cases + regression-suite + bug-report + test-execution-report',
    color: 'bg-sky-50',
    borderColor: 'border-sky-200',
  },
  {
    id: 7,
    name: 'Security Sign-off',
    from: 'Fase 7: Seguridad',
    to: 'Fase 8: Despliegue',
    gate: 'Gate 6',
    gateNum: 6,
    producer: [
      {
        role: 'Security / CISO',
        action: 'Entrega security sign-off con vulnerabilidades resueltas',
      },
      { role: 'DevOps', action: 'Entrega pipeline security validado' },
    ],
    receiver: [
      { role: 'DevOps', action: 'Recibe autorización para deploy a producción' },
      { role: 'PME', action: 'Recibe documentación para Change Request' },
    ],
    artifacts: [
      'Vulnerability Assessment (T-SEC-001)',
      'DAST Report (T-SEC-002)',
      'Penetration Test (T-SEC-003)',
      'Security Checklist (T-SEC-004)',
      'Security Sign-off (T-SEC-005)',
      'Compliance Report (T-SEC-006)',
      'Security Documentation (T-SEC-007)',
    ],
    aiAutomation:
      'Skills vuln-assessment + dast-interpretation + pentest-report + security-checklist',
    color: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  {
    id: 8,
    name: 'Release a PROD',
    from: 'Fase 8: Despliegue',
    to: 'Post-Deploy',
    gate: 'Gate 7 (Final)',
    gateNum: 7,
    producer: [
      { role: 'DevOps', action: 'Ejecuta deploy a producción con rollback plan' },
      { role: 'PME', action: 'Coordina Change Request y comunicación' },
    ],
    receiver: [
      { role: 'Business', action: 'Recibe funcionalidad en producción' },
      { role: 'Support', action: 'Recibe documentación para soporte' },
    ],
    artifacts: [
      'Change Request (T-DEP-001)',
      'Rollback Plan (T-DEP-002)',
      'Release Notes (T-DEP-003)',
      'Deploy Checklist (T-DEP-004)',
      'Post-Deploy Validation (T-DEP-005)',
      'Monitoring Setup (T-DEP-006)',
      'Retrospective (T-DEP-007)',
      'Postmortem (T-DEP-008)',
      'User Documentation (T-DEP-009)',
    ],
    aiAutomation:
      'Skills change-request + rollback-plan + release-notes + retrospective + postmortem',
    color: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
];

// =============================================================================
// PHASES DATA (Complete 8 Phases with Templates)
// =============================================================================

export const phases: PhaseTemplates[] = [
  {
    fase: 'Originación & Intake',
    faseNum: 1,
    color: 'bg-purple-50',
    borderColor: 'border-purple-200',
    gate: 'Gate 0: Intake Aprobado',
    dor: [
      'Sponsor ejecutivo identificado',
      'Problema de negocio claramente articulado',
      'Criterios de éxito de alto nivel definidos',
    ],
    exitCriteria: [
      'Business Case documentado en Confluence y aprobado por sponsor',
      'Épica creada en Jira con metadatos completos',
      'Kick-off realizado con asistentes clave y acta distribuida',
      'Stakeholder map completado',
    ],
    gateSpecific: [
      'Presupuesto y recursos identificados',
      'Alineación con roadmap estratégico confirmada',
    ],
    templates: [
      {
        code: 'T-ORI-001',
        name: 'Business Case Template',
        desc: 'Justificación de negocio: problema, solución propuesta, ROI estimado, riesgos, timeline alto nivel. IA genera borrador estructurado desde el problema de negocio; el humano aporta datos reales, valida ROI y firma.',
        format: 'Confluence',
        owner: 'Negocio / PME',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/business-case/SKILL.md',
      },
      {
        code: 'T-ORI-002',
        name: 'Acta de Kick-off',
        desc: 'Participantes, objetivos, alcance preliminar, próximos pasos, decisiones tomadas. IA genera estructura pre-llenada desde el Business Case; el humano captura las decisiones reales de la reunión. Incluye examples/ con actas modelo.',
        format: 'Confluence',
        owner: 'PME',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/kickoff/SKILL.md',
      },
      {
        code: 'T-ORI-003',
        name: 'Stakeholder Map',
        desc: 'Mapa de interesados: rol, nivel de influencia, expectativas, canales de comunicación. IA sugiere estructura y preguntas clave; el humano llena con conocimiento político/organizacional real. Incluye reference/ con ejemplos de mapas.',
        format: 'Confluence',
        owner: 'PME',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/stakeholder-map/SKILL.md',
      },
      {
        code: 'T-ORI-004',
        name: 'Épica Template (Jira)',
        desc: 'Campos obligatorios: descripción, sponsor, prioridad estratégica, fecha objetivo, equipo asignado. IA pre-llena campos desde Business Case vía Jira MCP; el humano valida y ajusta.',
        format: 'Jira',
        owner: 'PME',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/tracking-integration/SKILL.md',
      },
    ],
  },
  {
    fase: 'Discovery & PRD',
    faseNum: 2,
    color: 'bg-blue-50',
    borderColor: 'border-blue-200',
    gate: 'Gate 1: PRD Aprobado',
    dor: [
      'Business Case aprobado (Gate 0 passed)',
      'Equipo de producto y R&D asignados',
      'Acceso a stakeholders para entrevistas',
    ],
    exitCriteria: [
      'PRD Técnico publicado en Confluence',
      'PRD Funcional publicado en Confluence',
      'Review cruzado documentado con sign-off mutuo',
      'Riesgos identificados, mitigados y registrados en risk log',
    ],
    gateSpecific: ['Alcance confirmado y firmado por stakeholders'],
    templates: [
      {
        code: 'T-PRD-001',
        name: 'PRD Técnico Template',
        desc: 'Algoritmos, capacidades técnicas, limitaciones, PoC resultados, arquitectura propuesta, dependencias técnicas. IA genera borrador estructurado desde Business Case + notas de discovery; el humano aporta profundidad técnica, resultados de PoC y validación arquitectónica.',
        format: 'Confluence',
        owner: 'R&D / Core',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/prd-tecnico/SKILL.md',
      },
      {
        code: 'T-PRD-002',
        name: 'PRD Funcional Template',
        desc: 'Overview, alcance, funcionalidades clave, user journeys, roadmap, métricas de éxito. IA estructura el documento desde Business Case + entrevistas; el humano valida journeys, prioriza funcionalidades y define métricas reales.',
        format: 'Confluence',
        owner: 'Producto',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/prd-funcional/SKILL.md',
      },
      {
        code: 'T-PRD-003',
        name: 'Review Cruzado Checklist',
        desc: 'Estándar siempre en contexto: consistencia técnica-funcional, gaps, acuerdos, action items. La rule referencia @.claude/skills/review-cruzado/checklists/review-cruzado.md para que la IA lo aplique en toda revisión cruzada automáticamente.',
        format: 'Confluence',
        owner: 'Producto + R&D',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/review-cruzado/checklists/review-cruzado.md',
      },
      {
        code: 'T-PRD-004',
        name: 'Risk Log Template',
        desc: 'Riesgo, probabilidad, impacto, mitigación, owner, status. IA sugiere riesgos comunes según tipo de proyecto + stack tecnológico; el humano aporta riesgos específicos del contexto organizacional y prioriza.',
        format: 'Confluence/Excel',
        owner: 'PME',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/risk-log/SKILL.md',
      },
      {
        code: 'T-PRD-005',
        name: 'PoC Report Template',
        desc: 'Hipótesis, metodología, resultados, conclusiones, recomendación go/no-go. IA estructura el reporte desde reference/ con ejemplos de PoCs anteriores; el humano ejecuta el PoC y documenta resultados reales.',
        format: 'Confluence',
        owner: 'R&D',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/poc-report/SKILL.md',
      },
    ],
  },
  {
    fase: 'Especificación (RF + NFR)',
    faseNum: 3,
    color: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    gate: 'Gate 2: Requisitos Completos',
    dor: [
      'PRDs aprobados (Gate 1 passed)',
      'Skills generate-rf + generate-nfr disponibles con SKILL.md + reference/',
      'PRD-T §5 con NFRs de alto nivel disponible como input para generate-nfr',
      'Equipo de producto, QA y Tech Lead disponibles para revisión',
    ],
    exitCriteria: [
      'Todos los RFs documentados con estructura completa y criterios BDD',
      'NFRs standalone con métricas medibles y umbral definido',
      'Coherencia interna validada (entre RFs, entre NFRs)',
      'Coherencia externa validada (RFs <-> PRD-F, NFRs <-> PRD-T §5)',
      'RTM generada: US -> RF/NFR -> PRD -> Business Case',
      'Epic breakdown aprobado con sub-épicas en Jira',
      'Dependencias mapeadas y documentadas',
      'QA confirma que los requisitos son testables (BDD-ready)',
    ],
    templates: [
      {
        code: 'T-RF-001',
        name: 'Requisito Funcional Template',
        desc: 'Formato estándar siempre en contexto: ID (RF-PROY-NUM), descripción, comportamiento, criterios BDD. La rule referencia @.claude/skills/generate-rf/templates/rf-format.md para que la IA lo use como formato obligatorio al generar RFs con el skill generate-rf.',
        format: 'Confluence',
        owner: 'Producto',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/generate-rf/templates/rf-format.md',
      },
      {
        code: 'T-NFR-001',
        name: 'Requisito No Funcional Template',
        desc: 'Formato estándar siempre en contexto: ID (NFR-PROY-NUM), categoría (rendimiento, seguridad, disponibilidad, escalabilidad), métrica medible, umbral aceptable, método de verificación. La rule referencia @.claude/skills/generate-nfr/templates/nfr-format.md; la IA lo usa al generar NFRs con generate-nfr.',
        format: 'Confluence',
        owner: 'Tech Lead + Producto',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/generate-nfr/templates/nfr-format.md',
      },
      {
        code: 'T-RF-002',
        name: 'Dependency Matrix',
        desc: 'Matriz de dependencias entre RFs y NFRs: depende de, es prerequisito de, relacionado con, orden de implementación. IA analiza los requisitos generados y sugiere dependencias cruzadas via scripts/; el humano valida relaciones que requieren conocimiento de dominio.',
        format: 'Confluence/Excel',
        owner: 'Producto',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/generate-rf/scripts/',
      },
      {
        code: 'T-RF-003',
        name: 'Coherence Checklist',
        desc: 'Estándar siempre en contexto: sin contradicciones entre RFs, alineado con PRD, sin ambigüedades, criterios claros. La rule referencia @.claude/skills/validate-requirements/checklists/rf-coherence.md; la IA lo aplica automáticamente al validar RFs.',
        format: 'Confluence',
        owner: 'Producto + QA',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/validate-requirements/checklists/rf-coherence.md',
      },
      {
        code: 'T-NFR-002',
        name: 'NFR Compliance Checklist',
        desc: 'Estándar siempre en contexto: verifica que cada NFR tiene métrica medible, umbral definido, método de verificación, y es trazable a PRD-T §5. La rule referencia @.claude/skills/generate-nfr/checklists/nfr-compliance.md; la IA lo aplica al validar NFRs.',
        format: 'Confluence',
        owner: 'Tech Lead + QA',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/generate-nfr/checklists/nfr-compliance.md',
      },
      {
        code: 'T-RF-004',
        name: 'RTM (Requirements Traceability Matrix)',
        desc: 'Trazabilidad completa US -> RF/NFR -> PRD -> Business Case. El skill validate-requirements genera la RTM automáticamente cruzando todos los requisitos; el PO y Tech Lead validan completitud y trazabilidad.',
        format: 'Confluence/Excel',
        owner: 'Producto + Tech Lead',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/validate-requirements/templates/rtm.md',
      },
      {
        code: 'T-RF-005',
        name: 'Epic Breakdown Template',
        desc: 'Descomposición de épica master en sub-épicas desde requisitos aprobados. Incluye: scope por sub-épica, RFs/NFRs asignados, dependencias entre sub-épicas, orden de implementación sugerido. IA genera desglose; PO y Tech Lead validan agrupaciones.',
        format: 'Jira/Confluence',
        owner: 'PO + Tech Lead',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/epic-breakdown/templates/epics.md',
      },
      {
        code: 'T-RF-006',
        name: 'RF/NFR Review Record',
        desc: 'Registro de revisiones: fecha, participantes, hallazgos, decisiones, status. IA genera resumen estructurado de la sesión de revisión usando examples/ como modelo; el humano captura decisiones y contexto que solo él conoce.',
        format: 'Confluence',
        owner: 'Producto',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/generate-rf/examples/',
      },
      {
        code: 'T-IA-RF-001',
        name: 'Skill: Generar RFs desde PRD',
        desc: 'Genera RFs con estructura estándar, criterios BDD y mapa de dependencias a partir de PRDs. SKILL.md contiene instrucciones + formato. Subcarpetas: reference/ (material de apoyo), examples/ (RFs modelo), scripts/ (dependency analysis).',
        format: '.claude/skills/',
        owner: 'Producto + IA',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/generate-rf/SKILL.md',
      },
      {
        code: 'T-IA-NFR-001',
        name: 'Skill: Generar NFRs desde PRD-T',
        desc: 'Genera NFRs standalone medibles desde PRD Técnico §5. Cada NFR con: categoría, métrica, umbral, método de verificación. Complementa RFs con requisitos de calidad (rendimiento, seguridad, disponibilidad, escalabilidad).',
        format: '.claude/skills/',
        owner: 'Tech Lead + IA',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/generate-nfr/SKILL.md',
      },
      {
        code: 'T-IA-RF-002',
        name: 'Command: Validar Requisitos',
        desc: 'Workflow orquestador invocado con /validate-requirements [name]. Encadena Fase 3 completa: (1) genera RFs con generate-rf -> (2) genera NFRs con generate-nfr -> (3) valida coherencia -> (4) genera RTM -> (5) ejecuta epic-breakdown. Orquesta todos los skills de especificación en secuencia.',
        format: '.claude/commands/',
        owner: 'PO + Tech Lead + IA',
        mandatory: true,
        aiAssist: 'command',
        claudePath: '.claude/commands/validate-requirements.md',
      },
      {
        code: 'T-IA-RF-003',
        name: 'Skill: Epic Breakdown',
        desc: 'Descompone épica master en sub-épicas desde requisitos aprobados (RFs + NFRs). Agrupa por dominio funcional, identifica dependencias entre sub-épicas, sugiere orden de implementación. El PO valida agrupaciones y priorización.',
        format: '.claude/skills/',
        owner: 'PO + IA',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/epic-breakdown/SKILL.md',
      },
    ],
  },
  {
    fase: 'Sprint Planning',
    faseNum: 4,
    color: 'bg-violet-50',
    borderColor: 'border-violet-200',
    gate: 'Gate 3: Sprint Committed',
    dor: [
      'RFs + NFRs aprobados y RTM validada (Gate 2 passed)',
      'Epic breakdown aprobado con sub-épicas en Jira',
      'User Stories con criterios de aceptación BDD-ready',
      'Dependencias técnicas identificadas',
    ],
    exitCriteria: [
      'Todas las US cumplen Definition of Ready',
      'Estimación en horas completada',
      'Capacidad del equipo confirmada con buffer 15-20%',
      'Sprint backlog definido en Jira',
      'PO + Tech Lead firman compromiso formal',
      'Sin ambigüedades ni dependencias no resueltas',
    ],
    templates: [
      {
        code: 'T-SPR-001',
        name: 'User Story Template',
        desc: 'Como [actor] quiero [acción] para [valor]. Criterios BDD (Given/When/Then). Prioridad, estimación, dependencias. IA genera US desde RFs aprobados con examples/ de US modelo; el PO valida valor de negocio, prioriza y ajusta estimaciones.',
        format: 'Jira',
        owner: 'PO',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/user-stories/SKILL.md',
      },
      {
        code: 'T-SPR-002',
        name: 'Definition of Ready (DoR) Checklist',
        desc: 'Estándar siempre en contexto: US debe tener descripción clara, criterios BDD, estimación, sin dependencias bloqueantes. La rule referencia @skills/refinement-notes/checklists/dor.md; la IA lo aplica automáticamente al evaluar US candidatas al sprint.',
        format: 'Confluence',
        owner: 'PO + Team',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/refinement-notes/checklists/dor.md',
      },
      {
        code: 'T-SPR-003',
        name: 'Sprint Capacity Template',
        desc: 'Capacidad por miembro: días disponibles, % dedicación, horas efectivas, buffer (15-20%). IA calcula capacity desde datos históricos usando scripts/; el Scrum Master ajusta con vacaciones y contexto real del equipo.',
        format: 'Confluence/Excel',
        owner: 'Scrum Master',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/sprint-capacity/SKILL.md',
      },
      {
        code: 'T-SPR-004',
        name: 'Sprint Commitment Record',
        desc: 'Formato oficial siempre en contexto: sprint goal, US comprometidas, capacidad total, riesgos, firmas PO + Tech Lead. La rule referencia @docs/standards/sprint-commitment.md; la IA lo usa como formato obligatorio.',
        format: 'Confluence',
        owner: 'PO + Tech Lead',
        mandatory: true,
        aiAssist: 'rule',
        claudePath: 'docs/standards/sprint-commitment.md',
      },
      {
        code: 'T-SPR-005',
        name: 'Refinement Session Notes',
        desc: 'US discutidas, preguntas resueltas, estimaciones acordadas, action items, decisiones técnicas. IA estructura notas usando reference/ con sesiones modelo; el humano captura decisiones y matices que solo el equipo conoce.',
        format: 'Confluence',
        owner: 'Scrum Master',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/refinement-notes/SKILL.md',
      },
    ],
  },
  {
    fase: 'Desarrollo',
    faseNum: 5,
    color: 'bg-orange-50',
    borderColor: 'border-orange-200',
    gate: 'Gate 4: DoD + Code Quality',
    dor: [
      'Sprint committed (Gate 3 passed)',
      'Entorno de desarrollo operativo',
      'Acceso a test cases de QA para referencia',
      '.claude/rules/ configurado con contexto del proyecto',
    ],
    exitCriteria: [
      'PR aprobado por >=1 peer + Tech Lead',
      'cl-dod checklist cumplida (hook dtc-write-guard valida automáticamente)',
      'SAST/SCA sin vulnerabilidades Críticas o Altas',
      'Tests unitarios pasan al 100%',
      'PR description generada (skill pr-description)',
      'Handoff dev->QA generado y adjunto al ticket',
      'Estado Jira actualizado a "Ready for QA"',
    ],
    templates: [
      {
        code: 'T-DEV-001',
        name: 'Pull Request Template',
        desc: 'Descripción del cambio generada por IA (skill: lee diff + ticket -> genera qué cambió, por qué, cómo probarlo, breaking changes). Ticket Jira vinculado, tipo de cambio, checklist (tests, docs). El command /implement-ticket lo invoca automáticamente.',
        format: 'GitHub/GitLab',
        owner: 'Dev',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/pr-description/SKILL.md',
      },
      {
        code: 'T-DEV-002',
        name: 'Definition of Done (DoD) Checklist',
        desc: 'Guardia automática event-driven: hook dtc-write-guard (PreToolUse: Write|Edit) valida DTC + DoD, código revisado, tests pasan, SAST/SCA limpio, handoff generado. Criterios definidos en @.claude/skills/pr-description/checklists/dod.md; el hook los evalúa antes de permitir el push.',
        format: 'Confluence/Jira',
        owner: 'Dev + Tech Lead',
        mandatory: true,
        aiAssist: 'hook',
        claudePath: '.claude/skills/pr-description/checklists/dod.md',
      },
      {
        code: 'T-DEV-003',
        name: 'Architecture Decision Record (ADR)',
        desc: 'Contexto, decisión, alternativas consideradas, consecuencias, status. IA genera borrador desde la discusión técnica + código usando examples/ de ADRs anteriores; el Tech Lead aporta visión arquitectónica y trade-offs.',
        format: 'Confluence',
        owner: 'Tech Lead',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/adr/SKILL.md',
      },
    ],
  },
  {
    fase: 'QA & Testing',
    faseNum: 6,
    color: 'bg-sky-50',
    borderColor: 'border-sky-200',
    gate: 'Gate 5: QA Sign-off',
    dor: [
      'Código integrado y desplegado en staging (Gate 4 passed)',
      'Handoff dev->QA recibido con contexto completo',
      'Test cases previamente generados y revisados',
      'Entorno de staging operativo y estable',
    ],
    exitCriteria: [
      'Todos los test cases ejecutados (funcional + BDD + regresión) PASS',
      '0 bugs bloqueantes o críticos abiertos',
      'Test execution report generado en TestRail',
      'Regresión ejecutada sin fallos',
      'QA Lead firma sign-off formal (so-qa)',
    ],
    templates: [
      {
        code: 'T-QA-001',
        name: 'Test Plan Template',
        desc: 'Alcance del testing, estrategia (funcional, BDD, regresión, performance), criterios de entrada/salida. IA genera borrador desde RFs + arquitectura del proyecto usando reference/ con planes modelo; QA Lead ajusta estrategia según experiencia y riesgos reales.',
        format: 'TestRail/Confluence',
        owner: 'QA Lead',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/test-plan/SKILL.md',
      },
      {
        code: 'T-QA-002',
        name: 'Test Case Template (BDD)',
        desc: 'ID, US vinculada, precondiciones, escenario Given/When/Then, datos de prueba, resultado esperado, severidad. Skill genera test cases desde ticket + handoff (happy path, edge cases, errores, regresión). QA revisa, ajusta y ejecuta.',
        format: 'TestRail',
        owner: 'QA',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/create-test-cases/SKILL.md',
      },
      {
        code: 'T-QA-003',
        name: 'Bug Report Template',
        desc: 'Severidad, US afectada, pasos para reproducir, resultado esperado vs actual, entorno, screenshots/logs, assignee. Skill estructura el reporte con reference/ de formatos estandarizados.',
        format: 'Jira',
        owner: 'QA',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/bug-report/SKILL.md',
      },
    ],
  },
  {
    fase: 'Seguridad',
    faseNum: 7,
    color: 'bg-red-50',
    borderColor: 'border-red-200',
    gate: 'Gate 6: Security Sign-off',
    dor: [
      'QA sign-off completado (Gate 5 passed)',
      'App desplegada en pre-producción',
      'Resultados SAST/SCA previos disponibles',
    ],
    exitCriteria: [
      'DAST ejecutado en entorno pre-producción',
      'Pen testing manual completado',
      'Todas las vulnerabilidades críticas/altas remediadas y verificadas',
      'Vulnerability Assessment Report generado',
      'Compliance checklist (OWASP) completada',
      'Sec Lead firma security sign-off (so-security)',
    ],
    templates: [
      {
        code: 'T-SEC-001',
        name: 'Vulnerability Assessment Report',
        desc: 'IA interpreta resultados de scanners via scripts/, prioriza hallazgos por impacto real y genera plan de remediación. reference/ contiene criterios OWASP de priorización. Seguridad valida priorización y ejecuta fixes.',
        format: 'Confluence',
        owner: 'Seguridad',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/vuln-assessment/SKILL.md',
      },
      {
        code: 'T-SEC-002',
        name: 'DAST Scan Report',
        desc: 'IA resume hallazgos del scanner DAST y sugiere fixes con código via scripts/. reference/ mapea OWASP Top 10 a remediation patterns. Seguridad valida que las correcciones no introduzcan nuevos riesgos.',
        format: 'Herramienta DAST',
        owner: 'Seguridad',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/dast-interpretation/SKILL.md',
      },
    ],
  },
  {
    fase: 'Despliegue & Post-deploy',
    faseNum: 8,
    color: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    gate: 'Gate 7: Deploy to Production',
    dor: [
      'Security sign-off completado (Gate 6 passed)',
      'Todos los entornos previos validados',
      'Change request aprobado por Comité',
    ],
    exitCriteria: [
      'CR aprobado por Comité de Cambios',
      'Rollback plan documentado y probado',
      'Release notes generadas y distribuidas',
      'Desplegado en producción exitosamente',
      'Smoke test post-deploy PASS',
      'Monitoreo activo 24h sin incidentes',
      'Retrospectiva programada',
    ],
    templates: [
      {
        code: 'T-DEP-001',
        name: 'Change Request Template',
        desc: 'Descripción del cambio, impacto, riesgos, rollback plan, ventana de despliegue, aprobaciones. IA genera borrador desde historial de PRs + release notes usando scripts/; PME valida impacto organizacional y gestiona aprobaciones del comité.',
        format: 'Confluence/Jira',
        owner: 'PME',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/change-request/SKILL.md',
      },
      {
        code: 'T-DEP-002',
        name: 'Rollback Plan Template',
        desc: 'Criterios de rollback, procedimiento paso a paso, responsables, tiempo estimado, comunicación. IA genera plan basado en tipo de deployment + infraestructura usando reference/ con planes modelo; DevOps valida viabilidad técnica.',
        format: 'Confluence',
        owner: 'DevOps',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/rollback-plan/SKILL.md',
      },
      {
        code: 'T-DEP-003',
        name: 'Release Notes Template',
        desc: 'Versión, fecha, nuevas funcionalidades, bugs corregidos, known issues, breaking changes. Skill genera changelog a 2 niveles (negocio + técnico) desde PRs mergeados. examples/ con changelogs modelo.',
        format: 'Confluence',
        owner: 'PO + Dev',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/release-notes/SKILL.md',
      },
    ],
  },
];

// =============================================================================
// CROSS-CUTTING ARTIFACTS DATA
// =============================================================================

export const crossCuttingArtifacts: CrossCuttingArtifact[] = [
  {
    category: 'Rules',
    title: '¿Quienes somos?',
    desc: 'Siempre cargadas',
    icon: '📋',
  },
  {
    category: 'Skills',
    title: '¿Qué sabemos hacer?',
    desc: 'SKILL.md + ref/ + ex/ + scripts/',
    icon: '🧠',
  },
  {
    category: 'Commands',
    title: '¿Cuándo "go"?',
    desc: 'Orquestadores de acción',
    icon: '⚡',
  },
  {
    category: 'Subagents',
    title: '¿Quién autónomo?',
    desc: 'Evolución de commands',
    icon: '🤖',
  },
  {
    category: 'Hooks',
    title: '¿Qué ante evento?',
    desc: 'Evalúan checklists docs/',
    icon: '🔗',
  },
  {
    category: 'MCPs',
    title: '¿Dónde conectamos?',
    desc: 'Cables a herramientas',
    icon: '🔌',
  },
  {
    category: 'docs/',
    title: '¿Dónde está la verdad?',
    desc: 'Fuente: checklists, signoffs',
    icon: '📚',
  },
];

// =============================================================================
// AI ASSISTANCE TYPES
// =============================================================================

export const aiAssistanceTypes: AIAssistanceType[] = [
  {
    type: 'skill',
    icon: '🧠',
    label: 'Skill',
    color: 'bg-violet-100 text-violet-700 border-violet-200',
  },
  {
    type: 'rule',
    icon: '📋',
    label: 'Rule',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  {
    type: 'command',
    icon: '⚡',
    label: 'Command',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  },
  {
    type: 'hook',
    icon: '🔗',
    label: 'Hook',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  {
    type: 'agent',
    icon: '🤖',
    label: 'Agent',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
  },
  {
    type: 'mcp',
    icon: '🔌',
    label: 'MCP',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
];

// =============================================================================
// COMPUTED STATS & UTILITIES
// =============================================================================

export const getPhaseByNumber = (faseNum: number): PhaseTemplates | undefined => {
  return phases.find((phase) => phase.faseNum === faseNum);
};

export const getHandoffByGateNumber = (gateNum: number): HandoffResponsibility | undefined => {
  return handoffs.find((handoff) => handoff.gateNum === gateNum);
};

export const getAllTemplates = (): Template[] => {
  return phases.reduce((acc, phase) => [...acc, ...phase.templates], [] as Template[]);
};

export const getTemplatesByPhase = (faseNum: number): Template[] => {
  const phase = getPhaseByNumber(faseNum);
  return phase?.templates || [];
};

export const getTemplatesWithAI = (): Template[] => {
  return getAllTemplates().filter((template) => template.aiAssist);
};

export const getHandoffStats = () => {
  const allTemplates = getAllTemplates();
  const mandatoryTemplates = allTemplates.filter((t) => t.mandatory);
  const aiTemplates = allTemplates.filter((t) => t.aiAssist);

  return {
    totalPhases: phases.length,
    totalHandoffs: handoffs.length,
    totalTemplates: allTemplates.length,
    mandatoryTemplates: mandatoryTemplates.length,
    aiTemplates: aiTemplates.length,
  };
};
