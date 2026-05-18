import { useState } from 'react';
import { ecosystemStats, summaryStrings } from '@/data/computed/stats';
import {
  ArrowRightLeft,
  CheckCircle2,
  Layers,
  AlertTriangle,
  Brain,
  Cable,
  Terminal,
  Bot,
  FileCode2,
  Zap,
  Users,
  ArrowRight,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { DiagramCard, PageHeader } from '@/app/components/shared/FlowComponents';
import { FlowDiagram, n, e } from '@/app/components/shared/ReactFlowDiagram';
import { useCurrentClient } from '@/hooks/useClientRegistry';
import type { Node, Edge } from '@xyflow/react';

/* ===================================================================
   HANDOFF DIAGRAM
   =================================================================== */
const handoffNodes: Node[] = [
  n('f1', -70, 0, 'FASE 1: Originaci\u00f3n', 'purple'),
  n('h1', 210, 0, '\ud83d\udce6 Handoff 1', 'amber', 'Business Case + Kick-off'),
  n('f2', 420, 0, 'FASE 2: Discovery & PRD', 'blue'),
  n('h2', 700, 0, '\ud83d\udce6 Handoff 2', 'amber', 'PRDs aprobados'),
  n('f3', -70, 120, 'FASE 3: Especificaci\u00f3n', 'cyan'),
  n('h3', 210, 120, '\ud83d\udce6 Handoff 3', 'amber', 'RFs + NFRs + RTM'),
  n('f4', 420, 120, 'FASE 4: Planning', 'violet'),
  n('h4', 700, 120, '\ud83d\udce6 Handoff 4', 'amber', 'Sprint Committed'),
  n('f5', -70, 240, 'FASE 5: Desarrollo', 'orange'),
  n('h5', 210, 240, '\ud83d\udce6 Handoff 5', 'amber', 'C\u00f3digo Integrado'),
  n('f6', 420, 240, 'FASE 6: QA', 'sky'),
  n('h6', 700, 240, '\ud83d\udce6 Handoff 6', 'amber', 'QA Sign-off'),
  n('f7', -70, 360, 'FASE 7: Seguridad', 'red'),
  n('h7', 210, 360, '\ud83d\udce6 Handoff 7', 'amber', 'Security Sign-off'),
  n('f8', 420, 360, 'FASE 8: Despliegue', 'emerald'),
  n('h8', 700, 360, '\ud83d\udce6 Handoff 8', 'amber', 'Release a PROD'),
];

const handoffEdges: Edge[] = [
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

/* ===================================================================
   HANDOFF RESPONSIBILITIES
   =================================================================== */
interface HandoffResponsibility {
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

// Create handoffs function to be called inside component with client-specific tools
const createHandoffs = (trackingTool: string): HandoffResponsibility[] => [
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

/* ===================================================================
   TEMPLATES DATA
   =================================================================== */
interface Template {
  code: string;
  name: string;
  desc: string;
  format: string;
  owner: string;
  mandatory: boolean;
  aiAssist?: 'skill' | 'rule' | 'command' | 'hook' | 'agent' | 'mcp';
  claudePath?: string;
}

interface PhaseTemplates {
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

// Helper function to dynamically replace tool names and content in content
const replaceToolNames = (
  content: string,
  trackingTool: string,
  testingTool: string,
  docTool: string,
  clientName?: string
): string => {
  return (
    content
      // Tool replacements
      .replace(/\bJira\b/g, trackingTool)
      .replace(/\bTestRail\b/g, testingTool)
      .replace(/\bConfluence\b/g, docTool)
      .replace(
        /\bXray\/TestRail\b/g,
        clientName === 'Docline' ? testingTool : `Xray/${testingTool}`
      )
      // Contextual tool phrases
      .replace(/\ben TestRail\b/g, `en ${testingTool}`)
      .replace(/\bvía TestRail\b/g, `vía ${testingTool}`)
      .replace(/\bdesde TestRail\b/g, `desde ${testingTool}`)
      .replace(/\ben Jira\b/g, `en ${trackingTool}`)
      .replace(/\bvía Jira\b/g, `vía ${trackingTool}`)
      .replace(/\bdesde Jira\b/g, `desde ${trackingTool}`)
      .replace(/\ben Confluence\b/g, `en ${docTool}`)
      .replace(/\bvía Confluence\b/g, `vía ${docTool}`)
      .replace(/\bdesde Confluence\b/g, `desde ${docTool}`)
      // Format specific replacements
      .replace(/\bTestRail\/Confluence\b/g, `${testingTool}/${docTool}`)
      // Remove "primera vez" claims for Docline
      .replace(
        /primera implementación formal del SDLC/g,
        clientName === 'Docline'
          ? 'implementación del SDLC'
          : 'primera implementación formal del SDLC'
      )
      .replace(
        /primer proyecto piloto/g,
        clientName === 'Docline' ? 'proyecto de mejora' : 'primer proyecto piloto'
      )
  );
};

// Create phases function to be called inside component with client-specific tools
const createPhases = (): PhaseTemplates[] => [
  {
    fase: 'Originaci\u00f3n & Intake',
    faseNum: 1,
    color: 'bg-purple-50',
    borderColor: 'border-purple-200',
    gate: 'Gate 0: Intake Aprobado',
    dor: [
      'Sponsor ejecutivo identificado',
      'Problema de negocio claramente articulado',
      'Criterios de \u00e9xito de alto nivel definidos',
    ],
    exitCriteria: [
      'Business Case documentado en Confluence y aprobado por sponsor',
      '\u00c9pica creada en Jira con metadatos completos',
      'Kick-off realizado con asistentes clave y acta distribuida',
      'Stakeholder map completado',
    ],
    gateSpecific: [
      'Presupuesto y recursos identificados',
      'Alineaci\u00f3n con roadmap estrat\u00e9gico confirmada',
    ],
    templates: [
      {
        code: 'T-ORI-001',
        name: 'Business Case Template',
        desc: 'Justificaci\u00f3n de negocio: problema, soluci\u00f3n propuesta, ROI estimado, riesgos, timeline alto nivel. IA genera borrador estructurado desde el problema de negocio; el humano aporta datos reales, valida ROI y firma.',
        format: 'Confluence',
        owner: 'Negocio / PME',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/business-case/SKILL.md',
      },
      {
        code: 'T-ORI-002',
        name: 'Acta de Kick-off',
        desc: 'Participantes, objetivos, alcance preliminar, pr\u00f3ximos pasos, decisiones tomadas. IA genera estructura pre-llenada desde el Business Case; el humano captura las decisiones reales de la reuni\u00f3n. Incluye examples/ con actas modelo.',
        format: 'Confluence',
        owner: 'PME',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/kickoff/SKILL.md',
      },
      {
        code: 'T-ORI-003',
        name: 'Stakeholder Map',
        desc: 'Mapa de interesados: rol, nivel de influencia, expectativas, canales de comunicaci\u00f3n. IA sugiere estructura y preguntas clave; el humano llena con conocimiento pol\u00edtico/organizacional real. Incluye reference/ con ejemplos de mapas.',
        format: 'Confluence',
        owner: 'PME',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/stakeholder-map/SKILL.md',
      },
      {
        code: 'T-ORI-004',
        name: '\u00c9pica Template (Jira)',
        desc: 'Campos obligatorios: descripci\u00f3n, sponsor, prioridad estrat\u00e9gica, fecha objetivo, equipo asignado. IA pre-llena campos desde Business Case v\u00eda Jira MCP; el humano valida y ajusta.',
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
      'PRD T\u00e9cnico publicado en Confluence',
      'PRD Funcional publicado en Confluence',
      'Review cruzado documentado con sign-off mutuo',
      'Riesgos identificados, mitigados y registrados en risk log',
    ],
    gateSpecific: ['Alcance confirmado y firmado por stakeholders'],
    templates: [
      {
        code: 'T-PRD-001',
        name: 'PRD T\u00e9cnico Template',
        desc: 'Algoritmos, capacidades t\u00e9cnicas, limitaciones, PoC resultados, arquitectura propuesta, dependencias t\u00e9cnicas. IA genera borrador estructurado desde Business Case + notas de discovery; el humano aporta profundidad t\u00e9cnica, resultados de PoC y validaci\u00f3n arquitect\u00f3nica.',
        format: 'Confluence',
        owner: 'R&D / Core',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/prd-tecnico/SKILL.md',
      },
      {
        code: 'T-PRD-002',
        name: 'PRD Funcional Template',
        desc: 'Overview, alcance, funcionalidades clave, user journeys, roadmap, m\u00e9tricas de \u00e9xito. IA estructura el documento desde Business Case + entrevistas; el humano valida journeys, prioriza funcionalidades y define m\u00e9tricas reales.',
        format: 'Confluence',
        owner: 'Producto',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/prd-funcional/SKILL.md',
      },
      {
        code: 'T-PRD-003',
        name: 'Review Cruzado Checklist',
        desc: 'Est\u00e1ndar siempre en contexto: consistencia t\u00e9cnica-funcional, gaps, acuerdos, action items. La rule referencia @.claude/skills/review-cruzado/checklists/review-cruzado.md para que la IA lo aplique en toda revisi\u00f3n cruzada autom\u00e1ticamente.',
        format: 'Confluence',
        owner: 'Producto + R&D',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/review-cruzado/checklists/review-cruzado.md',
      },
      {
        code: 'T-PRD-004',
        name: 'Risk Log Template',
        desc: 'Riesgo, probabilidad, impacto, mitigaci\u00f3n, owner, status. IA sugiere riesgos comunes seg\u00fan tipo de proyecto + stack tecnol\u00f3gico; el humano aporta riesgos espec\u00edficos del contexto organizacional y prioriza.',
        format: 'Confluence/Excel',
        owner: 'PME',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/risk-log/SKILL.md',
      },
      {
        code: 'T-PRD-005',
        name: 'PoC Report Template',
        desc: 'Hip\u00f3tesis, metodolog\u00eda, resultados, conclusiones, recomendaci\u00f3n go/no-go. IA estructura el reporte desde reference/ con ejemplos de PoCs anteriores; el humano ejecuta el PoC y documenta resultados reales.',
        format: 'Confluence',
        owner: 'R&D',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/poc-report/SKILL.md',
      },
    ],
  },
  {
    fase: 'Especificaci\u00f3n (RF + NFR)',
    faseNum: 3,
    color: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    gate: 'Gate 2: Requisitos Completos',
    dor: [
      'PRDs aprobados (Gate 1 passed)',
      'Skills generate-rf + generate-nfr disponibles con SKILL.md + reference/',
      'PRD-T \u00a75 con NFRs de alto nivel disponible como input para generate-nfr',
      'Equipo de producto, QA y Tech Lead disponibles para revisi\u00f3n',
    ],
    exitCriteria: [
      'Todos los RFs documentados con estructura completa y criterios BDD',
      'NFRs standalone con m\u00e9tricas medibles y umbral definido',
      'Coherencia interna validada (entre RFs, entre NFRs)',
      'Coherencia externa validada (RFs <-> PRD-F, NFRs <-> PRD-T \u00a75)',
      'RTM generada: US -> RF/NFR -> PRD -> Business Case',
      'Epic breakdown aprobado con sub-\u00e9picas en Jira',
      'Dependencias mapeadas y documentadas',
      'QA confirma que los requisitos son testables (BDD-ready)',
    ],
    templates: [
      {
        code: 'T-RF-001',
        name: 'Requisito Funcional Template',
        desc: 'Formato est\u00e1ndar siempre en contexto: ID (RF-PROY-NUM), descripci\u00f3n, comportamiento, criterios BDD. La rule referencia @.claude/skills/generate-rf/templates/rf-format.md para que la IA lo use como formato obligatorio al generar RFs con el skill generate-rf.',
        format: 'Confluence',
        owner: 'Producto',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/generate-rf/templates/rf-format.md',
      },
      {
        code: 'T-NFR-001',
        name: 'Requisito No Funcional Template',
        desc: 'Formato est\u00e1ndar siempre en contexto: ID (NFR-PROY-NUM), categor\u00eda (rendimiento, seguridad, disponibilidad, escalabilidad), m\u00e9trica medible, umbral aceptable, m\u00e9todo de verificaci\u00f3n. La rule referencia @.claude/skills/generate-nfr/templates/nfr-format.md; la IA lo usa al generar NFRs con generate-nfr.',
        format: 'Confluence',
        owner: 'Tech Lead + Producto',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/generate-nfr/templates/nfr-format.md',
      },
      {
        code: 'T-RF-002',
        name: 'Dependency Matrix',
        desc: 'Matriz de dependencias entre RFs y NFRs: depende de, es prerequisito de, relacionado con, orden de implementaci\u00f3n. IA analiza los requisitos generados y sugiere dependencias cruzadas via scripts/; el humano valida relaciones que requieren conocimiento de dominio.',
        format: 'Confluence/Excel',
        owner: 'Producto',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/generate-rf/scripts/',
      },
      {
        code: 'T-RF-003',
        name: 'Coherence Checklist',
        desc: 'Est\u00e1ndar siempre en contexto: sin contradicciones entre RFs, alineado con PRD, sin ambig\u00fcedades, criterios claros. La rule referencia @.claude/skills/validate-requirements/checklists/rf-coherence.md; la IA lo aplica autom\u00e1ticamente al validar RFs.',
        format: 'Confluence',
        owner: 'Producto + QA',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/validate-requirements/checklists/rf-coherence.md',
      },
      {
        code: 'T-NFR-002',
        name: 'NFR Compliance Checklist',
        desc: 'Est\u00e1ndar siempre en contexto: verifica que cada NFR tiene m\u00e9trica medible, umbral definido, m\u00e9todo de verificaci\u00f3n, y es trazable a PRD-T \u00a75. La rule referencia @.claude/skills/generate-nfr/checklists/nfr-compliance.md; la IA lo aplica al validar NFRs.',
        format: 'Confluence',
        owner: 'Tech Lead + QA',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/generate-nfr/checklists/nfr-compliance.md',
      },
      {
        code: 'T-RF-004',
        name: 'RTM (Requirements Traceability Matrix)',
        desc: 'Trazabilidad completa US -> RF/NFR -> PRD -> Business Case. El skill validate-requirements genera la RTM autom\u00e1ticamente cruzando todos los requisitos; el PO y Tech Lead validan completitud y trazabilidad.',
        format: 'Confluence/Excel',
        owner: 'Producto + Tech Lead',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/validate-requirements/templates/rtm.md',
      },
      {
        code: 'T-RF-005',
        name: 'Epic Breakdown Template',
        desc: 'Descomposici\u00f3n de \u00e9pica master en sub-\u00e9picas desde requisitos aprobados. Incluye: scope por sub-\u00e9pica, RFs/NFRs asignados, dependencias entre sub-\u00e9picas, orden de implementaci\u00f3n sugerido. IA genera desglose; PO y Tech Lead validan agrupaciones.',
        format: 'Jira/Confluence',
        owner: 'PO + Tech Lead',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/epic-breakdown/templates/epics.md',
      },
      {
        code: 'T-RF-006',
        name: 'RF/NFR Review Record',
        desc: 'Registro de revisiones: fecha, participantes, hallazgos, decisiones, status. IA genera resumen estructurado de la sesi\u00f3n de revisi\u00f3n usando examples/ como modelo; el humano captura decisiones y contexto que solo \u00e9l conoce.',
        format: 'Confluence',
        owner: 'Producto',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/generate-rf/examples/',
      },
      {
        code: 'T-IA-RF-001',
        name: 'Skill: Generar RFs desde PRD',
        desc: 'Genera RFs con estructura est\u00e1ndar, criterios BDD y mapa de dependencias a partir de PRDs. SKILL.md contiene instrucciones + formato. Subcarpetas: reference/ (material de apoyo), examples/ (RFs modelo), scripts/ (dependency analysis).',
        format: '.claude/skills/',
        owner: 'Producto + IA',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/generate-rf/SKILL.md',
      },
      {
        code: 'T-IA-NFR-001',
        name: 'Skill: Generar NFRs desde PRD-T',
        desc: 'Genera NFRs standalone medibles desde PRD T\u00e9cnico \u00a75. Cada NFR con: categor\u00eda, m\u00e9trica, umbral, m\u00e9todo de verificaci\u00f3n. Complementa RFs con requisitos de calidad (rendimiento, seguridad, disponibilidad, escalabilidad).',
        format: '.claude/skills/',
        owner: 'Tech Lead + IA',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/generate-nfr/SKILL.md',
      },
      {
        code: 'T-IA-RF-002',
        name: 'Command: Validar Requisitos',
        desc: 'Workflow orquestador invocado con /validate-requirements [name]. Encadena Fase 3 completa: (1) genera RFs con generate-rf -> (2) genera NFRs con generate-nfr -> (3) valida coherencia -> (4) genera RTM -> (5) ejecuta epic-breakdown. Orquesta todos los skills de especificaci\u00f3n en secuencia.',
        format: '.claude/commands/',
        owner: 'PO + Tech Lead + IA',
        mandatory: true,
        aiAssist: 'command',
        claudePath: '.claude/commands/validate-requirements.md',
      },
      {
        code: 'T-IA-RF-003',
        name: 'Skill: Epic Breakdown',
        desc: 'Descompone \u00e9pica master en sub-\u00e9picas desde requisitos aprobados (RFs + NFRs). Agrupa por dominio funcional, identifica dependencias entre sub-\u00e9picas, sugiere orden de implementaci\u00f3n. El PO valida agrupaciones y priorizaci\u00f3n.',
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
      'Epic breakdown aprobado con sub-\u00e9picas en Jira',
      'User Stories con criterios de aceptaci\u00f3n BDD-ready',
      'Dependencias t\u00e9cnicas identificadas',
    ],
    exitCriteria: [
      'Todas las US cumplen Definition of Ready',
      'Estimaci\u00f3n en horas completada',
      'Capacidad del equipo confirmada con buffer 15-20%',
      'Sprint backlog definido en Jira',
      'PO + Tech Lead firman compromiso formal',
      'Sin ambig\u00fcedades ni dependencias no resueltas',
    ],
    templates: [
      {
        code: 'T-SPR-001',
        name: 'User Story Template',
        desc: 'Como [actor] quiero [acci\u00f3n] para [valor]. Criterios BDD (Given/When/Then). Prioridad, estimaci\u00f3n, dependencias. IA genera US desde RFs aprobados con examples/ de US modelo; el PO valida valor de negocio, prioriza y ajusta estimaciones.',
        format: 'Jira',
        owner: 'PO',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/user-stories/SKILL.md',
      },
      {
        code: 'T-SPR-002',
        name: 'Definition of Ready (DoR) Checklist',
        desc: 'Est\u00e1ndar siempre en contexto: US debe tener descripci\u00f3n clara, criterios BDD, estimaci\u00f3n, sin dependencias bloqueantes. La rule referencia @skills/refinement-notes/checklists/dor.md; la IA lo aplica autom\u00e1ticamente al evaluar US candidatas al sprint.',
        format: 'Confluence',
        owner: 'PO + Team',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/refinement-notes/checklists/dor.md',
      },
      {
        code: 'T-SPR-003',
        name: 'Sprint Capacity Template',
        desc: 'Capacidad por miembro: d\u00edas disponibles, % dedicaci\u00f3n, horas efectivas, buffer (15-20%). IA calcula capacity desde datos hist\u00f3ricos usando scripts/; el Scrum Master ajusta con vacaciones y contexto real del equipo.',
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
        desc: 'US discutidas, preguntas resueltas, estimaciones acordadas, action items, decisiones t\u00e9cnicas. IA estructura notas usando reference/ con sesiones modelo; el humano captura decisiones y matices que solo el equipo conoce.',
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
      'cl-dod checklist cumplida (hook dtc-write-guard valida autom\u00e1ticamente)',
      'SAST/SCA sin vulnerabilidades Cr\u00edticas o Altas',
      'Tests unitarios pasan al 100%',
      'PR description generada (skill pr-description)',
      'Handoff dev->QA generado y adjunto al ticket',
      'Estado Jira actualizado a "Ready for QA"',
    ],
    templates: [
      {
        code: 'T-DEV-001',
        name: 'Pull Request Template',
        desc: 'Descripci\u00f3n del cambio generada por IA (skill: lee diff + ticket -> genera qu\u00e9 cambi\u00f3, por qu\u00e9, c\u00f3mo probarlo, breaking changes). Ticket Jira vinculado, tipo de cambio, checklist (tests, docs). El command /implement-ticket lo invoca autom\u00e1ticamente.',
        format: 'GitHub/GitLab',
        owner: 'Dev',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/pr-description/SKILL.md',
      },
      {
        code: 'T-DEV-002',
        name: 'Definition of Done (DoD) Checklist',
        desc: 'Guardia autom\u00e1tica event-driven: hook dtc-write-guard (PreToolUse: Write|Edit) valida DTC + DoD, c\u00f3digo revisado, tests pasan, SAST/SCA limpio, handoff generado. Criterios definidos en @.claude/skills/pr-description/checklists/dod.md; el hook los eval\u00faa antes de permitir el push. El humano confirma items que requieren juicio.',
        format: 'Confluence/Jira',
        owner: 'Dev + Tech Lead',
        mandatory: true,
        aiAssist: 'hook',
        claudePath: '.claude/skills/pr-description/checklists/dod.md',
      },
      {
        code: 'T-DEV-003',
        name: 'Architecture Decision Record (ADR)',
        desc: 'Contexto, decisi\u00f3n, alternativas consideradas, consecuencias, status. IA genera borrador desde la discusi\u00f3n t\u00e9cnica + c\u00f3digo usando examples/ de ADRs anteriores; el Tech Lead aporta visi\u00f3n arquitect\u00f3nica y trade-offs.',
        format: 'Confluence',
        owner: 'Tech Lead',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/adr/SKILL.md',
      },
      {
        code: 'T-DEV-004',
        name: 'Technical Debt Log',
        desc: 'Item de deuda, severidad, impacto, esfuerzo estimado, sprint planificado. IA identifica deuda t\u00e9cnica desde c\u00f3digo (code smells, TODOs, complejidad) usando scripts/ de an\u00e1lisis; el Tech Lead prioriza seg\u00fan impacto real al negocio.',
        format: 'Jira/Confluence',
        owner: 'Tech Lead',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/tech-debt/SKILL.md',
      },
      {
        code: 'T-IA-DEV-001',
        name: 'AI Context Rules (5 niveles)',
        desc: 'Contexto persistente que la IA carga SIEMPRE. 5 rules: org.md (est\u00e1ndares organizaci\u00f3n), tech-stack.md (TypeScript strict, React 18+), project.md (contexto proyecto activo), documentation.md (governance docs), workflows.md (mapa roles->commands).',
        format: '.claude/rules/',
        owner: 'Tech Lead + Equipo',
        mandatory: true,
        aiAssist: 'rule',
        claudePath: '.claude/rules/',
      },
      {
        code: 'T-IA-DEV-002',
        name: 'Command: Implementar Ticket',
        desc: 'Workflow orquestador invocado por el dev con /implement-ticket [ID]. Encadena skills + MCPs en secuencia: (1) Lee ticket v\u00eda Jira MCP -> (2) Usa skill de desglose -> (3) Dev implementa con contexto de rules -> (4) Usa skill de auto-revisi\u00f3n pre-PR -> (5) Crea PR v\u00eda GitHub CLI.',
        format: '.claude/commands/',
        owner: 'Dev + IA',
        mandatory: true,
        aiAssist: 'command',
        claudePath: '.claude/commands/implement-ticket.md',
      },
      {
        code: 'T-IA-DEV-003',
        name: 'Skill: Handoff Dev->QA',
        desc: 'SKILL.md ense\u00f1a a la IA c\u00f3mo generar el documento de entrega para QA: ticket referencia, qu\u00e9 se implement\u00f3 (lenguaje funcional), cambios relevantes (endpoints, DB, config), c\u00f3mo probarlo. reference/ con handoffs modelo, examples/ con outputs reales.',
        format: '.claude/skills/',
        owner: 'Dev + IA',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/dev-handoff-qa/SKILL.md',
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
      'C\u00f3digo integrado y desplegado en staging (Gate 4 passed)',
      'Handoff dev->QA recibido con contexto completo',
      'Test cases previamente generados y revisados',
      'Entorno de staging operativo y estable',
    ],
    exitCriteria: [
      'Todos los test cases ejecutados (funcional + BDD + regresi\u00f3n) PASS',
      '0 bugs bloqueantes o cr\u00edticos abiertos',
      'Test execution report generado en TestRail',
      'Regresi\u00f3n ejecutada sin fallos',
      'QA Lead firma sign-off formal (so-qa)',
    ],
    templates: [
      {
        code: 'T-QA-001',
        name: 'Test Plan Template',
        desc: 'Alcance del testing, estrategia (funcional, BDD, regresi\u00f3n, performance), criterios de entrada/salida. IA genera borrador desde RFs + arquitectura del proyecto usando reference/ con planes modelo; QA Lead ajusta estrategia seg\u00fan experiencia y riesgos reales.',
        format: 'TestRail/Confluence',
        owner: 'QA Lead',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/test-plan/SKILL.md',
      },
      {
        code: 'T-QA-002',
        name: 'Test Case Template (BDD)',
        desc: 'ID, US vinculada, precondiciones, escenario Given/When/Then, datos de prueba, resultado esperado, severidad. Skill genera test cases desde ticket + handoff (happy path, edge cases, errores, regresi\u00f3n). QA revisa, ajusta y ejecuta.',
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
      {
        code: 'T-QA-004',
        name: 'Test Execution Report',
        desc: 'Resumen: total cases, passed, failed, blocked. Cobertura por US. Bugs encontrados. Recomendaci\u00f3n go/no-go. IA interpreta resultados de TestRail via scripts/ y genera resumen ejecutivo; QA Lead valida conclusiones y firma.',
        format: 'TestRail',
        owner: 'QA Lead',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/test-execution-report/SKILL.md',
      },
      {
        code: 'T-QA-005',
        name: 'QA Sign-off Record',
        desc: 'Formato oficial siempre en contexto: fecha, versi\u00f3n testeada, resultados, bugs pendientes con justificaci\u00f3n, firma QA Lead. La rule referencia @.claude/skills/test-execution-report/signoffs/qa-signoff.md; la IA pre-llena desde resultados de ejecuci\u00f3n. QA Lead revisa y firma.',
        format: 'Confluence',
        owner: 'QA Lead',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/test-execution-report/signoffs/qa-signoff.md',
      },
      {
        code: 'T-QA-006',
        name: 'Regression Test Suite',
        desc: 'Suite de regresi\u00f3n acumulativa. IA sugiere qu\u00e9 tests incluir seg\u00fan an\u00e1lisis de impacto del cambio via scripts/ de impact analysis; QA decide cobertura final. reference/ contiene criterios de selecci\u00f3n de regresi\u00f3n.',
        format: 'TestRail',
        owner: 'QA',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/regression-suite/SKILL.md',
      },
      {
        code: 'T-IA-QA-001',
        name: 'Command: Preparar Testing',
        desc: 'Workflow orquestador invocado por QA con /prepare-testing [ID]. Encadena: lee ticket v\u00eda Jira MCP -> lee diff v\u00eda GitHub CLI -> usa skill de test cases -> escribe en Xray CSV. QA obtiene suite lista para revisi\u00f3n.',
        format: '.claude/commands/',
        owner: 'QA + IA',
        mandatory: false,
        aiAssist: 'command',
        claudePath: '.claude/commands/prepare-testing.md',
      },
      {
        code: 'T-IA-QA-002',
        name: 'Agent: qa-agent',
        desc: 'Subagente aut\u00f3nomo event-driven. Se activa al detectar ticket "Ready for QA" en Jira. Prepara suite de testing completa: test plan -> test cases BDD -> regression suite -> genera CSV para importar a Xray. Preloads: test-plan, create-test-cases, regression-suite, bug-report, test-execution-report, dev-handoff-qa. MCPs: Jira, GitHub CLI (gh). Memoria persistente (scope: project).',
        format: '.claude/agents/',
        owner: 'QA Lead + IA',
        mandatory: false,
        aiAssist: 'agent',
        claudePath: '.claude/agents/qa-agent.md',
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
      'App desplegada en pre-producci\u00f3n',
      'Resultados SAST/SCA previos disponibles',
    ],
    exitCriteria: [
      'DAST ejecutado en entorno pre-producci\u00f3n',
      'Pen testing manual completado',
      'Todas las vulnerabilidades cr\u00edticas/altas remediadas y verificadas',
      'Vulnerability Assessment Report generado',
      'Compliance checklist (OWASP) completada',
      'Sec Lead firma security sign-off (so-security)',
    ],
    templates: [
      {
        code: 'T-SEC-001',
        name: 'Vulnerability Assessment Report',
        desc: 'IA interpreta resultados de scanners via scripts/, prioriza hallazgos por impacto real y genera plan de remediaci\u00f3n. reference/ contiene criterios OWASP de priorizaci\u00f3n. Seguridad valida priorizaci\u00f3n y ejecuta fixes.',
        format: 'Confluence',
        owner: 'Seguridad',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/vuln-assessment/SKILL.md',
      },
      {
        code: 'T-SEC-002',
        name: 'DAST Scan Report',
        desc: 'IA resume hallazgos del scanner DAST y sugiere fixes con c\u00f3digo via scripts/. reference/ mapea OWASP Top 10 a remediation patterns. Seguridad valida que las correcciones no introduzcan nuevos riesgos.',
        format: 'Herramienta DAST',
        owner: 'Seguridad',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/dast-interpretation/SKILL.md',
      },
      {
        code: 'T-SEC-003',
        name: 'Pen Testing Report',
        desc: 'Alcance, metodolog\u00eda, hallazgos detallados, severidad, pasos de reproducci\u00f3n, recomendaciones, re-test status. IA estructura el reporte usando reference/ con formato OWASP; el pentester humano ejecuta las pruebas y documenta hallazgos reales.',
        format: 'Confluence',
        owner: 'Seguridad',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/pentest-report/SKILL.md',
      },
      {
        code: 'T-SEC-004',
        name: 'Security Sign-off Record',
        desc: 'Formato oficial siempre en contexto: versi\u00f3n evaluada, resumen de hallazgos, riesgo residual aceptado, condiciones, firma Sec Lead. La rule referencia @.claude/skills/security-checklist/signoffs/security-signoff.md; la IA pre-llena desde resultados de assessment + DAST + pen test.',
        format: 'Confluence',
        owner: 'Sec Lead',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/security-checklist/signoffs/security-signoff.md',
      },
      {
        code: 'T-SEC-005',
        name: 'Security Compliance Checklist',
        desc: 'Guardia autom\u00e1tica event-driven: skill security-checklist eval\u00faa cumplimiento OWASP, cifrado, sesiones, logging, headers pre-deploy. Criterios en @.claude/skills/security-checklist/checklists/security-compliance.md; el skill los eval\u00faa contra el c\u00f3digo y configuraci\u00f3n. Security Lead valida items manuales + firma sign-off.',
        format: 'Confluence',
        owner: 'Seguridad',
        mandatory: false,
        aiAssist: 'hook',
        claudePath: '.claude/skills/security-checklist/checklists/security-compliance.md',
      },
      {
        code: 'T-SEC-006',
        name: 'Security Checklist Evaluation',
        desc: 'IA eval\u00faa checklist completo pre-deploy: OWASP Top 10, security headers, sessions, data privacy, API security, secrets, CI/CD. Pre-llena desde scanners (SAST/SCA/DAST), marca items de inspecci\u00f3n manual. Genera scoring y decisi\u00f3n PASS/FAIL/CONDITIONAL con remediation plan.',
        format: 'Confluence',
        owner: 'Security Lead',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/security-checklist/SKILL.md',
      },
      {
        code: 'T-IA-SEC-001',
        name: 'Agent: security-agent',
        desc: 'Subagente aut\u00f3nomo event-driven. Se activa al detectar resultados de scanners SAST/SCA/DAST. Interpreta vulnerabilidades, prioriza por impacto real, sugiere fixes con c\u00f3digo, crea tickets de remediaci\u00f3n en Jira. Preloads: vuln-assessment, dast-interpretation, pentest-report, security-checklist. MCPs: Jira, GitHub, Confluence. Memoria persistente con falsos positivos confirmados.',
        format: '.claude/agents/',
        owner: 'Sec Lead + IA',
        mandatory: false,
        aiAssist: 'agent',
        claudePath: '.claude/agents/security-agent.md',
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
      'Change request aprobado por Comit\u00e9',
    ],
    exitCriteria: [
      'CR aprobado por Comit\u00e9 de Cambios',
      'Rollback plan documentado y probado',
      'Release notes generadas y distribuidas',
      'Desplegado en producci\u00f3n exitosamente',
      'Smoke test post-deploy PASS',
      'Monitoreo activo 24h sin incidentes',
      'Retrospectiva programada',
    ],
    templates: [
      {
        code: 'T-DEP-001',
        name: 'Change Request Template',
        desc: 'Descripci\u00f3n del cambio, impacto, riesgos, rollback plan, ventana de despliegue, aprobaciones. IA genera borrador desde historial de PRs + release notes usando scripts/; PME valida impacto organizacional y gestiona aprobaciones del comit\u00e9.',
        format: 'Confluence/Jira',
        owner: 'PME',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/change-request/SKILL.md',
      },
      {
        code: 'T-DEP-002',
        name: 'Rollback Plan Template',
        desc: 'Criterios de rollback, procedimiento paso a paso, responsables, tiempo estimado, comunicaci\u00f3n. IA genera plan basado en tipo de deployment + infraestructura usando reference/ con planes modelo; DevOps valida viabilidad t\u00e9cnica.',
        format: 'Confluence',
        owner: 'DevOps',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/rollback-plan/SKILL.md',
      },
      {
        code: 'T-DEP-003',
        name: 'Release Notes Template',
        desc: 'Versi\u00f3n, fecha, nuevas funcionalidades, bugs corregidos, known issues, breaking changes. Skill genera changelog a 2 niveles (negocio + t\u00e9cnico) desde PRs mergeados. examples/ con changelogs modelo.',
        format: 'Confluence',
        owner: 'PO + Dev',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/release-notes/SKILL.md',
      },
      {
        code: 'T-DEP-004',
        name: 'Post-deploy Checklist',
        desc: 'Guardia autom\u00e1tica event-driven: se dispara post-deploy y valida smoke tests, endpoints, monitoreo, alertas, comunicaci\u00f3n. Criterios en @.claude/skills/change-request/checklists/post-deploy.md; el hook los eval\u00faa contra el entorno desplegado. DevOps confirma items manuales.',
        format: 'Confluence',
        owner: 'DevOps + QA',
        mandatory: true,
        aiAssist: 'hook',
        claudePath: '.claude/skills/change-request/checklists/post-deploy.md',
      },
      {
        code: 'T-DEP-005',
        name: 'Retrospectiva Data-Driven',
        desc: 'Qu\u00e9 fue bien, qu\u00e9 mejorar, action items con owner. M\u00e9tricas integradas: velocity, carryover %, bug count, lead time, deploy frequency, gate pass rate. IA recopila m\u00e9tricas via scripts/ desde Jira + GitHub; el equipo aporta reflexiones cualitativas.',
        format: 'Confluence/Dashboard',
        owner: 'Scrum Master + PME',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/retrospective/SKILL.md',
      },
      {
        code: 'T-DEP-006',
        name: 'Blameless Postmortem',
        desc: 'IA estructura postmortem de incidente: resumen ejecutivo, timeline preciso, Five Whys hasta root cause sist\u00e9mica, impacto cuantitativo (usuarios, revenue, SLA), qu\u00e9 funcion\u00f3 bien, action items SMART categorizados (prevention, detection, response, testing). Cultura blameless: analiza sistemas, no culpa personas.',
        format: 'Confluence',
        owner: 'Tech Lead + IC',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/postmortem/SKILL.md',
      },
      {
        code: 'T-IA-DEP-001',
        name: 'Command: Crear Release Notes',
        desc: 'Workflow orquestador invocado con /create-release-notes. Encadena: lee PRs v\u00eda GitHub CLI -> usa skill release-notes -> publica en Confluence MCP -> notifica en Slack MCP.',
        format: '.claude/commands/',
        owner: 'DevOps + IA',
        mandatory: false,
        aiAssist: 'command',
        claudePath: '.claude/commands/create-release-notes.md',
      },
      {
        code: 'T-IA-DEP-002',
        name: 'Agent: release-agent',
        desc: 'Subagente aut\u00f3nomo event-driven. Se activa al detectar merge a main en GitHub. Genera release notes a 2 niveles (negocio + t\u00e9cnico), actualiza changelog, prepara Change Request para Comit\u00e9 de Cambios, notifica en Slack. Preloads: release-notes, change-request, rollback-plan, retrospective. MCPs: GitHub, Confluence, Slack. Memoria persistente con patrones de release.',
        format: '.claude/agents/',
        owner: 'DevOps + IA',
        mandatory: false,
        aiAssist: 'agent',
        claudePath: '.claude/agents/release-agent.md',
      },
      {
        code: 'T-IA-DEP-003',
        name: 'Agent: metrics-agent',
        desc: 'Subagente aut\u00f3nomo scheduled. Se activa al cierre de sprint. Recopila m\u00e9tricas Sprint (velocity, carryover, bug count) + DORA (lead time, deploy frequency, MTTR, change failure rate) desde Jira y GitHub. Genera dashboard de retrospectiva data-driven. Preloads: retrospective, sprint-capacity. MCPs: Jira, GitHub. Memoria persistente con baselines y correlaciones hist\u00f3ricas.',
        format: '.claude/agents/',
        owner: 'Scrum Master + IA',
        mandatory: false,
        aiAssist: 'agent',
        claudePath: '.claude/agents/metrics-agent.md',
      },
    ],
  },
];

/* ===================================================================
   CROSS-CUTTING AI TEMPLATES
   =================================================================== */
const _aiCrossCuttingTemplates = [
  {
    code: 'T-IA-CORE-001',
    name: 'CLAUDE.md Orquestador Central',
    desc: `Índice viviente del ecosistema: ${summaryStrings.artifactsOperational} (${ecosystemStats.skills} skills, ${ecosystemStats.templates} templates, ${ecosystemStats.commands} commands, ${ecosystemStats.checklists} checklists, ${ecosystemStats.agents} agents, ${ecosystemStats.rules} rules, ${ecosystemStats.mcps} MCPs, ${ecosystemStats.hooks} hooks, ${ecosystemStats.signoffs} signoffs, ${ecosystemStats.docsSupport} docs). Punto de entrada para toda la IA del equipo.`,
    format: 'Ra\u00edz proyecto',
    owner: 'Tech Lead',
    role: 'Todos',
    level: 'Orquestador',
  },
  {
    code: 'T-IA-CORE-002',
    name: 'Rules: Organizaci\u00f3n',
    desc: 'Est\u00e1ndares de la empresa: coding standards, pol\u00edticas de seguridad, convenciones de naming, procesos obligatorios, cultura de ingenier\u00eda.',
    format: '.claude/rules/',
    owner: 'CTO / Leads',
    role: 'Todos',
    level: 'Nivel 1',
  },
  {
    code: 'T-IA-CORE-003',
    name: 'Rules: Tecnolog\u00eda',
    desc: 'Convenciones espec\u00edficas del stack: React patterns, Node.js best practices, testing conventions, linting rules, estructura de proyecto.',
    format: '.claude/rules/',
    owner: 'Tech Lead',
    role: 'Dev',
    level: 'Nivel 1',
  },
  {
    code: 'T-IA-CORE-004',
    name: 'Rules: Proyecto',
    desc: 'Contexto espec\u00edfico del proyecto: dominio de negocio, estructura de directorios, patrones arquitect\u00f3nicos, APIs, convenciones propias.',
    format: '.claude/rules/',
    owner: 'Tech Lead',
    role: 'Dev',
    level: 'Nivel 1',
  },
  {
    code: 'T-IA-CORE-005',
    name: 'Rules: Documentaci\u00f3n',
    desc: 'Governance documental: frontmatter YAML obligatorio, staleness detection (TTL por tipo), naming conventions, estructura de skills.',
    format: '.claude/rules/',
    owner: 'Tech Lead',
    role: 'Todos',
    level: 'Nivel 1',
  },
  {
    code: 'T-IA-CORE-006',
    name: 'Rules: Workflows',
    desc: 'Mapa de orquestaci\u00f3n: qu\u00e9 rol ejecuta qu\u00e9 command, encadenamiento de skills + MCPs, flujos recomendados por fase SDLC.',
    format: '.claude/rules/',
    owner: 'Tech Lead',
    role: 'Todos',
    level: 'Nivel 1',
  },
  {
    code: 'T-IA-CORE-007',
    name: 'MCP Config: Jira',
    desc: 'Conexi\u00f3n IA -> Jira: lee tickets, crea subtareas, actualiza estados, adjunta documentos. El MCP m\u00e1s cr\u00edtico para reducir cambios de contexto.',
    format: '.mcp.json',
    owner: 'DevOps',
    role: 'Todos',
    level: 'Nivel 2',
  },
  {
    code: 'T-IA-CORE-008',
    name: 'MCP Config: GitHub',
    desc: 'Conexi\u00f3n IA -> GitHub: lee diffs, crea PRs con descripci\u00f3n, gestiona branches, lee PRs para release notes.',
    format: '.mcp.json',
    owner: 'DevOps',
    role: 'Dev',
    level: 'Nivel 2',
  },
  {
    code: 'T-IA-CORE-009',
    name: 'MCP Config: Confluence',
    desc: 'Conexi\u00f3n IA -> Confluence: lee documentaci\u00f3n (PRDs, RFs), escribe release notes, publica reportes.',
    format: '.mcp.json',
    owner: 'DevOps',
    role: 'Todos',
    level: 'Nivel 2',
  },
  {
    code: 'T-IA-CORE-010',
    name: 'MCP Config: Xray/TestRail',
    desc: 'Conexi\u00f3n IA -> Xray/TestRail: escribe test cases generados, lee resultados de ejecuci\u00f3n.',
    format: '.mcp.json',
    owner: 'DevOps',
    role: 'QA',
    level: 'Nivel 2',
  },
  {
    code: 'T-IA-CORE-011',
    name: 'MCP Config: Slack',
    desc: 'Conexi\u00f3n IA -> Slack: env\u00eda notificaciones de handoff, alertas de release, actualizaciones de estado.',
    format: '.mcp.json',
    owner: 'DevOps',
    role: 'Todos',
    level: 'Nivel 2',
  },
  {
    code: 'T-IA-CORE-012',
    name: 'Settings: Equipo',
    desc: 'Configuraci\u00f3n compartida: modelo preferido, permisos, l\u00edmites de autonom\u00eda de la IA, defaults. Commiteado al repo.',
    format: '.claude/settings.json',
    owner: 'Tech Lead',
    role: 'Todos',
    level: 'Config',
  },
  {
    code: 'T-IA-AGT-001',
    name: 'Agent: docs-agent',
    desc: 'Subagente aut\u00f3nomo event-driven transversal. Mantiene 8 fuentes de verdad sincronizadas, ejecuta 32 integrity tests (T1-T32), detecta y corrige drift entre archivos. Valida rule staleness (180d TTL). Se activa al detectar cambios en docs/ o .claude/. Preloads: architecture-doc, implementation-phases. MCPs: Confluence, GitHub. Memoria persistente con drift recurrente y owners de docs.',
    format: '.claude/agents/',
    owner: 'Tech Lead + IA',
    role: 'Todos',
    level: 'Nivel 2',
  },
  {
    code: 'T-IA-AGT-002',
    name: 'Agent: onboarding-agent',
    desc: 'Subagente aut\u00f3nomo manual transversal. Gu\u00eda a nuevos miembros del equipo con plan personalizado por rol (Dev, QA, PO, DevOps). Genera reading list, explica arquitectura, responde FAQ. Preloads: architecture-doc, implementation-phases. MCPs: Confluence, Slack. Memoria persistente con FAQ por rol y confusiones comunes.',
    format: '.claude/agents/',
    owner: 'Tech Lead + IA',
    role: 'Nuevos miembros',
    level: 'Nivel 2',
  },
  {
    code: 'T-IA-CROSS-001',
    name: 'Skill: generate-rule',
    desc: 'Genera o actualiza archivos de rule (.claude/rules/*.md) desde contexto del proyecto. Soporta los 5 tipos: org, tech-stack, project, documentation, workflows. Usado por /init-project-docs para ecosistemas nuevos y /validate-project-docs para validaci\u00f3n. Template: .claude/skills/generate-rule/templates/rule.md.',
    format: '.claude/skills/',
    owner: 'Tech Lead + IA',
    role: 'TL, PO, PME',
    level: 'Nivel 1',
  },
];

/* ===================================================================
   AI ASSIST BADGE
   =================================================================== */
function AIBadge({ type, claudePath }: { type: Template['aiAssist']; claudePath?: string }) {
  if (!type) {
    return null;
  }
  const config = {
    skill: {
      icon: <Brain size={10} />,
      label: 'Skill',
      color: 'bg-violet-100 text-violet-700 border-violet-200',
    },
    rule: {
      icon: <FileCode2 size={10} />,
      label: 'Rule',
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    },
    command: {
      icon: <Terminal size={10} />,
      label: 'Command',
      color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    },
    hook: {
      icon: <Zap size={10} />,
      label: 'Hook',
      color: 'bg-amber-100 text-amber-700 border-amber-200',
    },
    agent: {
      icon: <Bot size={10} />,
      label: 'Agent',
      color: 'bg-orange-100 text-orange-700 border-orange-200',
    },
    mcp: {
      icon: <Cable size={10} />,
      label: 'MCP',
      color: 'bg-blue-100 text-blue-700 border-blue-200',
    },
  };
  const c = config[type];
  return (
    <span
      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border text-[9px] font-semibold ${c.color}`}
      title={claudePath}
    >
      {c.icon} {c.label}
    </span>
  );
}

/* ===================================================================
   COMPONENT
   =================================================================== */
export function HandoffsTemplates() {
  const { client } = useCurrentClient();
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Dynamic tools based on client configuration
  const trackingTool =
    client?.domainTerms?.tracking_tool || (client?.name === 'Docline' ? 'Linear' : 'Jira');
  const testingTool =
    client?.domainTerms?.testing_tool || (client?.name === 'Docline' ? 'Cucumber' : 'TestRail');
  const docTool =
    client?.domainTerms?.doc_system ||
    (client?.name === 'Docline' ? 'Sistema de documentación' : 'Confluence');

  // Generate dynamic handoffs and phases with client-specific tools
  const handoffs = createHandoffs(trackingTool);
  const phases = createPhases();

  const totalTemplates = phases.reduce((acc, p) => acc + p.templates.length, 0);
  const mandatoryTemplates = phases.reduce(
    (acc, p) => acc + p.templates.filter((t) => t.mandatory).length,
    0
  );
  const aiTemplates = phases.reduce(
    (acc, p) => acc + p.templates.filter((t) => t.aiAssist).length,
    0
  );

  const allPhaseNums = phases.map((p) => p.faseNum);
  const allExpanded = allPhaseNums.every((num) => expandedPhases.has(num));

  const togglePhase = (num: number) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(num)) {
        next.delete(num);
      } else {
        next.add(num);
      }
      return next;
    });
  };

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedPhases(new Set());
    } else {
      setExpandedPhases(new Set(allPhaseNums));
    }
  };

  return (
    <div>
      <PageHeader
        title="Handoffs & Templates"
        subtitle="Entregables obligatorios, criterios de transicion entre fases, catalogo de templates y artefactos de IA con Claude Code (.claude/)"
      />

      {/* Summary banner */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm text-center">
          <div className="text-2xl font-bold text-indigo-700">{phases.length}</div>
          <div className="text-xs text-slate-500">Fases</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm text-center">
          <div className="text-2xl font-bold text-amber-700">{phases.length}</div>
          <div className="text-xs text-slate-500">Handoffs</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm text-center">
          <div className="text-2xl font-bold text-emerald-700">{totalTemplates}</div>
          <div className="text-xs text-slate-500">Templates Total</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm text-center">
          <div className="text-2xl font-bold text-red-700">{mandatoryTemplates}</div>
          <div className="text-xs text-slate-500">Obligatorios</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm text-center">
          <div className="text-2xl font-bold text-violet-700">{aiTemplates}</div>
          <div className="text-xs text-slate-500">Con asistencia IA</div>
        </div>
      </div>

      {/* Handoff Diagram */}
      <DiagramCard>
        <h2 className="text-lg font-semibold text-slate-700 mb-2 text-center">
          Mapa de Handoffs entre Fases
        </h2>
        <p className="text-xs text-slate-500 text-center mb-4">
          Cada Handoff es un punto formal de transferencia con entregables y criterios especificos
        </p>
        <FlowDiagram
          nodes={handoffNodes}
          edges={handoffEdges}
          height={400}
          exportName="Mapa de Handoffs entre Fases"
        />
      </DiagramCard>

      {/* ======= UNIFIED: Handoffs, Responsables & Templates por Fase ======= */}
      <div className="mt-6">
        <DiagramCard>
          <h2 className="text-lg font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <Layers className="text-indigo-600" size={20} />
            Fases SDLC: Handoffs, Gates y Templates
          </h2>
          <p className="text-xs text-slate-500 mb-2">
            Cada fase tiene 2 bloques conceptuales (Fase + Gate) y su catalogo de templates. Haz
            clic para expandir.
          </p>

          {/* Legends */}
          <div className="flex flex-wrap gap-3 mb-3 bg-slate-50 rounded-lg p-3 border border-slate-200">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] text-slate-600 font-semibold">Productor (entrega)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="text-[10px] text-slate-600 font-semibold">Receptor (recibe)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="text-[10px] text-slate-600 font-semibold">Gate de transicion</span>
            </div>
            <span className="text-[10px] text-slate-400">|</span>
            <span className="text-[10px] text-slate-500 font-semibold">IA:</span>
            <AIBadge type="skill" />
            <AIBadge type="rule" />
            <AIBadge type="command" />
            <AIBadge type="hook" />
            <AIBadge type="agent" />
            <AIBadge type="mcp" />
          </div>

          <div className="flex justify-end mb-3">
            <button
              onClick={toggleAll}
              className="px-3 py-1.5 text-xs font-semibold rounded-md border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
            >
              {allExpanded ? 'Colapsar todos' : 'Expandir todos'}
            </button>
          </div>

          <div className="space-y-3">
            {phases.map((phase) => {
              const isExpanded = expandedPhases.has(phase.faseNum);
              const phaseAiCount = phase.templates.filter((t) => t.aiAssist).length;
              const handoff = handoffs[phase.faseNum - 1];
              const phaseBlockKey = `phase-${phase.faseNum}`;
              const gateBlockKey = `gate-${phase.faseNum}`;
              const templatesKey = `templates-${phase.faseNum}`;
              const isPhaseBlockOpen = expandedSections.has(phaseBlockKey);
              const isGateBlockOpen = expandedSections.has(gateBlockKey);
              const isTemplatesOpen = expandedSections.has(templatesKey);

              return (
                <div
                  key={phase.faseNum}
                  className={`rounded-lg border-2 overflow-hidden transition-all ${phase.borderColor}`}
                >
                  {/* Phase Header */}
                  <button
                    onClick={() => togglePhase(phase.faseNum)}
                    className={`w-full flex items-center justify-between px-5 py-4 text-left ${phase.color} hover:opacity-90 transition-opacity`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-white/80 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold text-slate-700 shadow-sm">
                        {phase.faseNum}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-800 text-sm">
                          Fase {phase.faseNum}: {phase.fase}
                        </div>
                        <div className="text-xs text-slate-500">
                          {phase.templates.length} templates {'\u00B7'} {phase.gate}
                          {phaseAiCount > 0 && (
                            <span className="ml-2 inline-flex items-center gap-0.5 bg-violet-100 text-violet-700 rounded px-1.5 py-0 text-[10px] font-semibold">
                              <Brain size={10} /> {phaseAiCount} IA
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-slate-400 text-lg">{isExpanded ? '\u2212' : '+'}</div>
                  </button>

                  {/* Expanded content with 2 conceptual blocks + templates */}
                  {isExpanded && (
                    <div className="bg-white divide-y divide-slate-100">
                      {/* == BLOQUE 1: FASE — Handoff, Artefactos, Automatizacion == */}
                      {handoff && (
                        <div>
                          <button
                            onClick={() => toggleSection(phaseBlockKey)}
                            className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-slate-50/50 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Users size={15} className="text-indigo-500" />
                              <span className="text-sm font-semibold text-slate-700">
                                Fase: Handoff & Artefactos
                              </span>
                              <span className="text-[10px] text-slate-400 hidden sm:flex items-center gap-1">
                                {handoff.from} <ArrowRight size={9} className="text-slate-300" />{' '}
                                {handoff.to}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-200">
                                {handoff.artifacts.length} artefactos
                              </span>
                              <span className="text-slate-400 text-sm">
                                {isPhaseBlockOpen ? '\u2212' : '+'}
                              </span>
                            </div>
                          </button>
                          {isPhaseBlockOpen && (
                            <div className="px-5 pb-4 space-y-3">
                              {/* Productores / Receptores */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <div className="flex items-center gap-1.5 mb-2">
                                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                    <span className="text-xs font-semibold text-emerald-800">
                                      Productores (quienes entregan)
                                    </span>
                                  </div>
                                  <div className="space-y-1.5">
                                    {handoff.producer.map((p, i) => (
                                      <div
                                        key={`prod-${handoff.id}-${i}`}
                                        className="bg-emerald-50 rounded-lg px-3 py-2 border border-emerald-200"
                                      >
                                        <div className="text-xs font-semibold text-emerald-800">
                                          {p.role}
                                        </div>
                                        <div className="text-[11px] text-emerald-600 mt-0.5">
                                          {replaceToolNames(
                                            p.action,
                                            trackingTool,
                                            testingTool,
                                            docTool,
                                            client?.name
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5 mb-2">
                                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                                    <span className="text-xs font-semibold text-blue-800">
                                      Receptores (quienes reciben)
                                    </span>
                                  </div>
                                  <div className="space-y-1.5">
                                    {handoff.receiver.map((r, i) => (
                                      <div
                                        key={`recv-${handoff.id}-${i}`}
                                        className="bg-blue-50 rounded-lg px-3 py-2 border border-blue-200"
                                      >
                                        <div className="text-xs font-semibold text-blue-800">
                                          {r.role}
                                        </div>
                                        <div className="text-[11px] text-blue-600 mt-0.5">
                                          {replaceToolNames(
                                            r.action,
                                            trackingTool,
                                            testingTool,
                                            docTool,
                                            client?.name
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              {/* Artefactos + Automatizacion IA */}
                              <div
                                className={`grid grid-cols-1 ${handoff.aiAutomation ? 'md:grid-cols-2' : ''} gap-3`}
                              >
                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                                    <FileText size={11} className="text-slate-400" /> Artefactos
                                    producidos
                                  </div>
                                  <div className="space-y-1">
                                    {handoff.artifacts.map((a, i) => (
                                      <div
                                        key={`art-${handoff.id}-${i}`}
                                        className="text-[11px] text-slate-700 flex items-start gap-1.5"
                                      >
                                        <CheckCircle2
                                          size={10}
                                          className="text-slate-400 flex-shrink-0 mt-0.5"
                                        />
                                        {a}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                {handoff.aiAutomation && (
                                  <div className="bg-violet-50 rounded-lg p-3 border border-violet-200">
                                    <div className="text-[10px] font-semibold text-violet-600 uppercase tracking-wide mb-2 flex items-center gap-1">
                                      <Brain size={11} className="text-violet-500" /> Automatizacion
                                      IA
                                    </div>
                                    <div className="text-[11px] text-violet-700 leading-relaxed">
                                      {handoff.aiAutomation}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* == BLOQUE 2: GATE — DoR (entrada) + Criterios de Salida (DoD unificado) + Gate-especifico == */}
                      <div>
                        <button
                          onClick={() => toggleSection(gateBlockKey)}
                          className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-slate-50/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <ShieldCheck size={15} className="text-amber-600" />
                            <span className="text-sm font-semibold text-slate-700">
                              {phase.gate}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              DoR + Criterios de Salida
                            </span>
                          </div>
                          <span className="text-slate-400 text-sm">
                            {isGateBlockOpen ? '\u2212' : '+'}
                          </span>
                        </button>
                        {isGateBlockOpen && (
                          <div className="px-5 pb-4">
                            <div
                              className={`grid grid-cols-1 ${phase.gateSpecific && phase.gateSpecific.length > 0 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-3`}
                            >
                              {/* DoR — Precondiciones de entrada */}
                              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                <div className="font-semibold text-sm text-blue-800 mb-2 flex items-center gap-1.5">
                                  <ArrowRightLeft size={14} className="text-blue-600" />
                                  Precondiciones de Entrada (DoR)
                                </div>
                                <ul className="space-y-1.5">
                                  {phase.dor.map((d, i) => (
                                    <li
                                      key={`dor-${phase.faseNum}-${i}`}
                                      className="text-xs text-blue-700 flex items-start gap-1.5"
                                    >
                                      <ArrowRightLeft
                                        size={10}
                                        className="mt-0.5 flex-shrink-0 text-blue-400"
                                      />{' '}
                                      {d}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              {/* Exit Criteria — DoD + Acceptance unificados */}
                              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                                <div className="font-semibold text-sm text-emerald-800 mb-2 flex items-center gap-1.5">
                                  <CheckCircle2 size={14} className="text-emerald-600" />
                                  Criterios de Salida (DoD)
                                </div>
                                <ul className="space-y-1.5">
                                  {phase.exitCriteria.map((d, i) => (
                                    <li
                                      key={`exit-${phase.faseNum}-${i}`}
                                      className="text-xs text-emerald-700 flex items-start gap-1.5"
                                    >
                                      <CheckCircle2
                                        size={10}
                                        className="mt-0.5 flex-shrink-0 text-emerald-400"
                                      />{' '}
                                      {replaceToolNames(
                                        d,
                                        trackingTool,
                                        testingTool,
                                        docTool,
                                        client?.name
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              {/* Gate-specific (solo si hay items adicionales) */}
                              {phase.gateSpecific && phase.gateSpecific.length > 0 && (
                                <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                                  <div className="font-semibold text-sm text-amber-800 mb-2 flex items-center gap-1.5">
                                    <AlertTriangle size={14} className="text-amber-600" />
                                    Criterios adicionales del Gate
                                  </div>
                                  <ul className="space-y-1.5">
                                    {phase.gateSpecific.map((c, i) => (
                                      <li
                                        key={`gate-${phase.faseNum}-${i}`}
                                        className="text-xs text-amber-700 flex items-start gap-1.5"
                                      >
                                        <AlertTriangle
                                          size={10}
                                          className="mt-0.5 flex-shrink-0 text-amber-400"
                                        />{' '}
                                        {c}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* == BLOQUE 3: TEMPLATES (catalogo) == */}
                      <div>
                        <button
                          onClick={() => toggleSection(templatesKey)}
                          className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-slate-50/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Layers size={15} className="text-indigo-500" />
                            <span className="text-sm font-semibold text-slate-700">
                              Templates ({phase.templates.length})
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {phase.templates.filter((t) => t.mandatory).length} obligatorios{' '}
                              {'\u00B7'} {phase.templates.filter((t) => t.aiAssist).length} con IA
                            </span>
                          </div>
                          <span className="text-slate-400 text-sm">
                            {isTemplatesOpen ? '\u2212' : '+'}
                          </span>
                        </button>
                        {isTemplatesOpen && (
                          <div className="px-5 pb-4">
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm border-collapse">
                                <thead>
                                  <tr className="bg-slate-50">
                                    <th className="px-3 py-2 text-left font-semibold text-slate-700 border-b border-slate-200 w-28">
                                      Codigo
                                    </th>
                                    <th className="px-3 py-2 text-left font-semibold text-slate-700 border-b border-slate-200 w-48">
                                      Template
                                    </th>
                                    <th className="px-3 py-2 text-left font-semibold text-slate-700 border-b border-slate-200">
                                      Contenido
                                    </th>
                                    <th className="px-3 py-2 text-center font-semibold text-slate-700 border-b border-slate-200 w-28">
                                      Formato
                                    </th>
                                    <th className="px-3 py-2 text-center font-semibold text-slate-700 border-b border-slate-200 w-32">
                                      Owner
                                    </th>
                                    <th className="px-3 py-2 text-center font-semibold text-slate-700 border-b border-slate-200 w-20">
                                      Req.
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {phase.templates.map((t, i) => (
                                    <tr
                                      key={t.code}
                                      className={`${t.aiAssist ? 'bg-violet-50/40' : i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                                    >
                                      <td className="px-3 py-2 border-b border-slate-100">
                                        <div className="font-mono text-xs text-indigo-600">
                                          {t.code}
                                        </div>
                                        {t.aiAssist && (
                                          <div className="mt-1">
                                            <AIBadge type={t.aiAssist} claudePath={t.claudePath} />
                                          </div>
                                        )}
                                      </td>
                                      <td className="px-3 py-2 font-semibold text-slate-800 text-xs border-b border-slate-100">
                                        {t.name}
                                        {t.claudePath && (
                                          <div className="font-mono text-[9px] text-violet-500 font-normal mt-0.5">
                                            {t.claudePath}
                                          </div>
                                        )}
                                      </td>
                                      <td className="px-3 py-2 text-xs text-slate-600 border-b border-slate-100">
                                        {replaceToolNames(
                                          t.desc,
                                          trackingTool,
                                          testingTool,
                                          docTool,
                                          client?.name
                                        )}
                                      </td>
                                      <td className="px-3 py-2 text-center border-b border-slate-100">
                                        <span
                                          className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold ${
                                            t.format.includes('.claude/')
                                              ? 'bg-violet-100 text-violet-600'
                                              : 'bg-slate-100 text-slate-600'
                                          }`}
                                        >
                                          {replaceToolNames(
                                            t.format,
                                            trackingTool,
                                            testingTool,
                                            docTool,
                                            client?.name
                                          )}
                                        </span>
                                      </td>
                                      <td className="px-3 py-2 text-center text-xs text-slate-600 border-b border-slate-100">
                                        {t.owner}
                                      </td>
                                      <td className="px-3 py-2 text-center border-b border-slate-100">
                                        {t.mandatory ? (
                                          <span className="inline-block bg-red-100 text-red-700 rounded px-2 py-0.5 text-[10px] font-semibold">
                                            Si
                                          </span>
                                        ) : (
                                          <span className="inline-block bg-slate-100 text-slate-500 rounded px-2 py-0.5 text-[10px]">
                                            Opc.
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </DiagramCard>
      </div>
    </div>
  );
}
