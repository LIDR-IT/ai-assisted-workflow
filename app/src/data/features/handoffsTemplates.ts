/**
 * @file Handoffs Templates Data
 * @description SDLC phases, handoffs and template catalog aligned 1:1 with the
 * unified phase model (.agents/_shared/lidr/UNIFIED-PHASES.md v1.1.1) and the
 * gate evidence manifest (.agents/_shared/lidr/gate-evidence.yaml v2.1.0).
 *
 * Model: 5 unified phases (0-4) x 9 stages x 8 gates (G0-G7).
 *
 * Inclusion criterion (strict): a template row exists ONLY if it is
 *   (a) an evidence entry (bmad_evidence / lidr_evidence) in gate-evidence.yaml,
 *   (b) a gate sign-off, or
 *   (c) part of the core BMad dev cycle (create-story/dev-story + code-review) / the hard G4 DoD.
 * Supporting skills (kickoff, user-stories, pr-description, bug-report, etc.) are
 * intentionally NOT listed as templates — they appear only in flow descriptions.
 *
 * - `mandatory: true` == `required: true` evidence in gate-evidence.yaml (or sign-off / hard DoD).
 * - Every code referenced in `handoffs[].artifacts` exists as a row in `phases[].templates`,
 *   so #tpl-<CODE> deep-links always resolve.
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
  /** true == evidencia `required: true` del gate en gate-evidence.yaml (o sign-off / DoD duro) */
  mandatory: boolean;
  aiAssist?: 'skill' | 'rule' | 'command' | 'hook' | 'agent' | 'mcp';
  claudePath?: string;
}

export interface PhaseTemplates {
  fase: string;
  /** Identificador único de la sección (0-8): 0 = Context & Anytime, 1-8 = etapas con gate */
  faseNum: number;
  /** Fase unificada BMad (0-4) a la que pertenece la etapa */
  unifiedPhase: number;
  /** Stage del modelo unificado */
  stage: string;
  /** Gate de salida (G0-G7); undefined para Fase 0 (sin gate) */
  gateNum?: number;
  color: string;
  borderColor: string;
  gate: string;
  /** Precondiciones de entrada (DoR) */
  dor: string[];
  /** Condiciones de salida (checklist del gate en gate-evidence.yaml) */
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
  n('f0', -70, -120, 'FASE 0: Context & Anytime', 'slate', 'Sin gate · checklist Context Ready'),
  n('f1', -70, 0, 'FASE 1: Analysis', 'purple'),
  n('h1', 210, 0, '📦 Handoff 1 · G0', 'amber', 'Business Case + Intake'),
  n('f2', 420, 0, 'FASE 2: Planning', 'blue'),
  n('h2', 700, 0, '📦 Handoff 2 · G1', 'amber', 'PRD aprobado'),
  n('f3', -70, 120, 'FASE 3: Solutioning · specification', 'cyan'),
  n('h3', 210, 120, '📦 Handoff 3 · G2', 'amber', 'Specs completas'),
  n('f4', 420, 120, 'FASE 3: Solutioning · sprint-planning', 'violet'),
  n('h4', 700, 120, '📦 Handoff 4 · G3', 'amber', 'Ready to Implement'),
  n('f5', -70, 240, 'FASE 4: Implementation · development', 'orange'),
  n('h5', 210, 240, '📦 Handoff 5 · G4', 'amber', 'DoD + Handoff dev→QA'),
  n('f6', 420, 240, 'FASE 4: Implementation · qa', 'sky'),
  n('h6', 700, 240, '📦 Handoff 6 · G5', 'amber', 'QA Sign-off'),
  n('f7', -70, 360, 'FASE 4: Implementation · security', 'red'),
  n('h7', 210, 360, '📦 Handoff 7 · G6', 'amber', 'Security Sign-off'),
  n('f8', 420, 360, 'FASE 4: Implementation · release', 'emerald'),
  n('h8', 700, 360, '📦 Handoff 8 · G7', 'amber', 'Release a PROD'),
];

export const handoffEdges: Edge[] = [
  e('e0', 'f0', 'f1', 'contexto', { sourceHandle: 'source-bottom', targetHandle: 'target-top' }),
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
// HANDOFF RESPONSIBILITIES DATA (G0-G7, desde gate-evidence.yaml)
// =============================================================================

export const handoffs: HandoffResponsibility[] = [
  {
    id: 1,
    name: 'Business Case + Intake',
    from: 'Fase 1 — Analysis (analysis)',
    to: 'Fase 2 — Planning (planning)',
    gate: 'Gate 0',
    gateNum: 0,
    producer: [
      { role: 'PME', action: 'Coordina kick-off, documenta acta, gestiona épica en tracking' },
      { role: 'Negocio / Sponsor', action: 'Define problema de negocio, ROI, visión estratégica' },
    ],
    receiver: [
      {
        role: 'Producto (PO)',
        action: 'Recibe Business Case + Product Brief como input para bmad-prd',
      },
      { role: 'Tech Lead', action: 'Recibe research técnico y contexto del proyecto' },
    ],
    artifacts: [
      '⭐ Business Case (T-ORI-001) — required',
      'Product Brief / PRFAQ (T-ORI-005) — BMad',
      'Research docs (T-ORI-006) — BMad',
      'Stakeholder Map (T-ORI-003)',
      'Sign-off PME: gate-0-handoff.md',
    ],
    aiAutomation:
      'BMad produce: bmad-brainstorming / bmad-*-research → bmad-product-brief | bmad-prfaq. LIDR verifica: lidr-business-case (⭐G0) + lidr-stakeholder-map. Brownfield: checklist "Context Ready" de Fase 0 es evidencia adicional del G0',
    color: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  {
    id: 2,
    name: 'PRD aprobado',
    from: 'Fase 2 — Planning (planning)',
    to: 'Fase 3 — Solutioning (specification)',
    gate: 'Gate 1',
    gateNum: 1,
    producer: [
      {
        role: 'Producto (PO)',
        action: 'Entrega PRD unificado (secciones F+T) generado con bmad-prd',
      },
      { role: 'UX', action: 'Entrega UX spec (bmad-ux) si la feature tiene superficie de UI' },
    ],
    receiver: [
      { role: 'Arquitecto / TL', action: 'Usa el PRD como input para bmad-create-architecture' },
      { role: 'Producto (PO)', action: 'Usa el PRD-F como input para lidr-generate-rf' },
    ],
    artifacts: [
      '⭐ PRD unificado F+T (T-PRD-001) — BMad, required',
      'UX Design Spec (T-PRD-002) — BMad',
      'Review Cruzado (T-PRD-003)',
      'Risk Log (T-PRD-004)',
      'Sign-off PO: gate-1-handoff.md',
    ],
    aiAutomation:
      'BMad produce: bmad-prd (PRD F+T en un solo doc, ⭐G1) + bmad-ux. LIDR verifica: lidr-review-cruzado valida F+T (checklist G1) y lidr-risk-log registra riesgos para la decisión del gate',
    color: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    id: 3,
    name: 'Specs completas (Arch + Epics + RFs + RTM)',
    from: 'Fase 3 — Solutioning (specification)',
    to: 'Fase 3 — Solutioning (sprint-planning)',
    gate: 'Gate 2',
    gateNum: 2,
    producer: [
      {
        role: 'Arquitecto / TL',
        action: 'Entrega architecture doc (bmad-create-architecture) + ADRs',
      },
      { role: 'Producto (PO)', action: 'Entrega RFs con BDD, epics y RTM sin huérfanos' },
    ],
    receiver: [
      { role: 'Scrum Master', action: 'Usa epics + RFs para sprint planning y user stories' },
      {
        role: 'QA Lead',
        action: 'Usa test design (bmad-testarch-test-design) como estrategia de testing',
      },
    ],
    artifacts: [
      '⭐ Architecture Doc (T-SOL-001) — BMad, required',
      '⭐ Epics & Stories (T-RF-005) — BMad, required',
      '⭐ Requisitos Funcionales BDD (T-RF-001) — required',
      '⭐ RTM (T-RF-004) — required',
      'Requisitos No Funcionales (T-NFR-001)',
      'Test Design (T-SOL-002) — BMad',
      'Variant Compatibility (T-SOL-004)',
      'Sign-off QA: gate-2-handoff.md',
    ],
    aiAutomation:
      'BMad produce: bmad-create-architecture (⭐G2) + bmad-create-epics-and-stories (⭐G2) + bmad-testarch-test-design. LIDR gobierna: lidr-generate-rf (⭐G2) + lidr-generate-nfr + lidr-validate-requirements genera la RTM (⭐G2); /lidr-validate-requirements orquesta la fase completa',
    color: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
  },
  {
    id: 4,
    name: 'Ready to Implement',
    from: 'Fase 3 — Solutioning (sprint-planning)',
    to: 'Fase 4 — Implementation (development)',
    gate: 'Gate 3',
    gateNum: 3,
    producer: [
      {
        role: 'Scrum Master',
        action: 'Entrega sprint-status.yaml (bmad-sprint-planning) + capacity con buffer',
      },
      { role: 'Producto (PO)', action: 'Entrega User Stories priorizadas con DoR cumplida' },
    ],
    receiver: [
      { role: 'Developers', action: 'Reciben stories comprometidas con Definition of Ready' },
      { role: 'QA', action: 'Recibe User Stories para preparación anticipada de test cases' },
    ],
    artifacts: [
      '⭐ sprint-status.yaml (T-SPR-004) — BMad, required',
      '⭐ Readiness Report (T-SPR-005) — BMad, required',
      '⭐ Sprint Capacity (T-SPR-003) — required',
      'Sign-off PO + TL: gate-3-handoff.md',
    ],
    aiAutomation:
      'BMad produce: bmad-check-implementation-readiness (⭐G3, valida PRD/UX/Arch/Epics) + bmad-sprint-planning (⭐G3, sprint-status.yaml). LIDR verifica: lidr-sprint-capacity (⭐G3, buffer 15-20%, commitment ≤90%) y el checklist exige DoR por cada story comprometida',
    color: 'bg-violet-50',
    borderColor: 'border-violet-200',
  },
  {
    id: 5,
    name: 'DoD + Handoff dev→QA',
    from: 'Fase 4 — Implementation (development)',
    to: 'Fase 4 — Implementation (qa)',
    gate: 'Gate 4',
    gateNum: 4,
    producer: [
      { role: 'Developers', action: 'Entregan código con DoD cumplida y handoff dev→QA completo' },
      { role: 'Tech Lead', action: 'Valida code quality (bmad-code-review) y aprueba merge' },
    ],
    receiver: [
      { role: 'QA', action: 'Recibe handoff dev→QA como input de lidr-create-test-cases' },
      { role: 'Security', action: 'Recibe código para análisis SAST/SCA continuo' },
    ],
    artifacts: [
      '⭐ Handoff Dev→QA (T-DEV-006) — required',
      '⭐ DoD Checklist (T-DEV-002) — gate duro G4',
      'Story implementada RUTA A (T-DEV-003) — BMad',
      'test-report.md RUTA B (T-DEV-005)',
      'Code Review (T-DEV-004) — BMad, checklist',
      'Runtime/Visual Review (T-DEV-007)',
      'Contract Impact (T-DEV-008)',
      'Sign-off TL: gate-4-handoff.md',
    ],
    aiAutomation:
      'RUTA A (BMad): bmad-create-story → bmad-dev-story → bmad-code-review pasan G4 vía DoD checklist. RUTA B (LIDR): /lidr-spec-new → ff → apply → verify genera test-report.md. En ambas: lidr-dev-handoff-qa (⭐G4) + lidr-playwright-cli (review visual)',
    color: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  {
    id: 6,
    name: 'QA Sign-off',
    from: 'Fase 4 — Implementation (qa)',
    to: 'Fase 4 — Implementation (security)',
    gate: 'Gate 5',
    gateNum: 5,
    producer: [
      { role: 'QA Lead', action: 'Firma sign-off formal con todos los test cases PASS' },
      { role: 'QA Engineers', action: 'Entregan test execution report y estado de bugs' },
    ],
    receiver: [
      { role: 'Security', action: 'Recibe build estable + focus areas para security testing' },
      { role: 'DevOps', action: 'Recibe artefactos para preparar el deploy' },
    ],
    artifacts: [
      '⭐ Test Execution Report (T-QA-004) — required',
      '⭐ QA Sign-off (T-QA-007) — signoffs/qa-signoff.md',
      'Test Cases BDD (T-QA-002)',
      'Regression Suite (T-QA-005) — BMad',
      'Traceability + Gate Decision (T-QA-006) — BMad',
    ],
    aiAutomation:
      'BMad produce: bmad-testarch-automate (regresión) + bmad-testarch-trace (trazabilidad + gate decision). LIDR verifica: lidr-create-test-cases + lidr-test-execution-report (⭐G5); el sign-off humano del QA Lead cierra el gate',
    color: 'bg-sky-50',
    borderColor: 'border-sky-200',
  },
  {
    id: 7,
    name: 'Security Sign-off',
    from: 'Fase 4 — Implementation (security)',
    to: 'Fase 4 — Implementation (release)',
    gate: 'Gate 6',
    gateNum: 6,
    producer: [
      {
        role: 'Security / CISO',
        action: 'Entrega security sign-off con 0 vulnerabilidades crit/high',
      },
      { role: 'DevOps', action: 'Entrega pipeline security validado en réplica de producción' },
    ],
    receiver: [
      { role: 'DevOps', action: 'Recibe requisitos de deploy, monitoring y rollback' },
      { role: 'PME', action: 'Recibe documentación para el Change Request' },
    ],
    artifacts: [
      '⭐ Security Checklist OWASP (T-SEC-004) — required',
      '⭐ Vulnerability Assessment (T-SEC-001) — required',
      '⭐ Security Sign-off CISO (T-SEC-005) — signoffs/security-signoff.md',
      'DAST Report (T-SEC-002)',
      'Pentest Report (T-SEC-003)',
    ],
    aiAutomation:
      'Fase 100% LIDR (BMad no tiene capa de seguridad): lidr-security-checklist (⭐G6, OWASP + compliance) + lidr-vuln-assessment (⭐G6, SAST/SCA) + lidr-dast-interpretation + lidr-pentest-report. Zero-tolerance: 0 crit/high (org.md §7)',
    color: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  {
    id: 8,
    name: 'Release a PROD',
    from: 'Fase 4 — Implementation (release)',
    to: 'Producción (post-deploy)',
    gate: 'Gate 7 (Final)',
    gateNum: 7,
    producer: [
      { role: 'DevOps', action: 'Ejecuta deploy a producción con rollback plan probado' },
      { role: 'PME', action: 'Coordina Change Request, aprobación del Comité y comunicación' },
    ],
    receiver: [
      { role: 'Business', action: 'Recibe funcionalidad en producción' },
      { role: 'Support', action: 'Recibe release notes y documentación de soporte' },
    ],
    artifacts: [
      '⭐ Change Request (T-DEP-001) — required',
      '⭐ Rollback Plan (T-DEP-002) — required',
      '⭐ Release Notes (T-DEP-003) — required',
      'Retrospective (T-DEP-005) — BMad, post-deploy',
      'Sign-off PME: gate-7-handoff.md',
    ],
    aiAutomation:
      'LIDR gobierna: lidr-change-request (⭐G7) + lidr-rollback-plan (⭐G7) + lidr-release-notes (⭐G7, via /lidr-create-release-notes). Post-deploy: bmad-retrospective (retro de épica) y lidr-postmortem solo si hubo incidente. Docs viajan con el código (rule DTC)',
    color: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
];

// =============================================================================
// PHASES DATA (5 fases unificadas · 9 etapas · 8 gates)
// =============================================================================

export const phases: PhaseTemplates[] = [
  {
    fase: 'Fase 0 — Context & Anytime (context · anytime)',
    faseNum: 0,
    unifiedPhase: 0,
    stage: 'context · anytime',
    color: 'bg-slate-50',
    borderColor: 'border-slate-200',
    gate: 'Sin gate — checklist "Context Ready" (evidencia de G0 en brownfield)',
    dor: [
      'Brownfield: codebase accesible para documentar',
      'Greenfield: opcional (solo rules + scaffold de docs)',
    ],
    exitCriteria: [
      'project-context.md existe y refleja el stack real (bmad-generate-project-context)',
      'docs/index.md inventaría la documentación existente (bmad-document-project)',
      'rules/project.md apunta al cliente activo correcto',
      'context-manifest.yaml actualizado (lidr-load-context lo carga al SessionStart)',
      'Deuda técnica conocida catalogada (lidr-tech-debt si aplica)',
    ],
    templates: [
      {
        code: 'T-CTX-001',
        name: 'Project Docs Index (bmad-document-project)',
        desc: 'Escaneo brownfield del codebase: docs/index.md + documentación del proyecto existente. Input de bmad-prd, bmad-create-architecture y bmad-create-epics-and-stories. Evidencia opcional del G0 en brownfield.',
        format: 'docs/',
        owner: 'Tech Lead',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/bmad-document-project/SKILL.md',
      },
      {
        code: 'T-CTX-002',
        name: 'Project Context (bmad-generate-project-context)',
        desc: 'Genera project-context.md (_bmad-output/): el contexto LLM que TODA sesión carga. Obligatorio en brownfield antes de cualquier análisis (checklist Context Ready del G0).',
        format: '_bmad-output/',
        owner: 'Tech Lead',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/bmad-generate-project-context/SKILL.md',
      },
    ],
  },
  {
    fase: 'Fase 1 — Analysis (analysis)',
    faseNum: 1,
    unifiedPhase: 1,
    stage: 'analysis',
    gateNum: 0,
    color: 'bg-purple-50',
    borderColor: 'border-purple-200',
    gate: 'Gate 0: Intake Aprobado',
    dor: [
      'Sponsor ejecutivo identificado',
      'Problema de negocio claramente articulado',
      'Brownfield: checklist "Context Ready" de Fase 0 cumplida',
    ],
    exitCriteria: [
      'Sponsor identificado y presupuesto/alineación estratégica confirmados',
      'Al menos uno poblado: Product Brief (BMad) o Business Case (LIDR)',
      'Business Case aprobado por sponsor (lidr-business-case — required G0)',
    ],
    gateSpecific: ['Sign-off PME en gate-0-handoff.md', 'Owners del gate: PME + Sponsor'],
    templates: [
      {
        code: 'T-ORI-001',
        name: 'Business Case',
        desc: 'Justificación de negocio: problema, solución propuesta, ROI estimado, riesgos, timeline alto nivel. Evidencia REQUIRED del G0 (docs/projects/{client}/business-case.md). IA genera borrador; el humano aporta ROI real y firma.',
        format: 'Confluence',
        owner: 'Negocio / PME',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/lidr-business-case/SKILL.md',
      },
      {
        code: 'T-ORI-005',
        name: 'Product Brief / PRFAQ (BMad)',
        desc: 'Brief del producto generado por bmad-product-brief (o bmad-prfaq estilo Amazon). INPUT principal de bmad-prd en Fase 2. Evidencia opcional del G0: el checklist exige al menos brief O business case poblado.',
        format: '_bmad-output/planning-artifacts/',
        owner: 'PO',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/bmad-product-brief/SKILL.md',
      },
      {
        code: 'T-ORI-006',
        name: 'Research Docs (BMad)',
        desc: 'Investigación previa al brief: bmad-brainstorming, bmad-market-research, bmad-domain-research, bmad-technical-research (este último produce el informe GO/NO-GO de PoC). Alimentan product-brief y PRD.',
        format: '_bmad-output/planning-artifacts/',
        owner: 'PO + R&D',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/bmad-brainstorming/SKILL.md',
      },
      {
        code: 'T-ORI-003',
        name: 'Stakeholder Map',
        desc: 'Mapa de interesados: rol, nivel de influencia, expectativas, canales de comunicación. Evidencia opcional del G0. IA sugiere estructura; el humano aporta el conocimiento político/organizacional real.',
        format: 'Confluence',
        owner: 'PME',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/lidr-stakeholder-map/SKILL.md',
      },
    ],
  },
  {
    fase: 'Fase 2 — Planning (planning)',
    faseNum: 2,
    unifiedPhase: 2,
    stage: 'planning',
    gateNum: 1,
    color: 'bg-blue-50',
    borderColor: 'border-blue-200',
    gate: 'Gate 1: PRD Aprobado',
    dor: [
      'Business Case aprobado (Gate 0 passed)',
      'Product Brief disponible como input de bmad-prd',
      'Equipo de producto y R&D asignados',
    ],
    exitCriteria: [
      'PRD cubre alcance funcional Y técnico — review cruzado passed (lidr-review-cruzado)',
      'UX spec existe si la feature tiene superficie de UI primaria (bmad-ux)',
      'Top riesgos registrados con owners de mitigación (lidr-risk-log)',
    ],
    gateSpecific: ['Sign-off PO en gate-1-handoff.md', 'Owners del gate: PO + TL'],
    templates: [
      {
        code: 'T-PRD-001',
        name: 'PRD Unificado F+T (BMad)',
        desc: 'PRD con secciones Funcional + Técnica en un solo documento, generado por bmad-prd desde el product-brief + business-case. Evidencia REQUIRED del G1 (_bmad-output/planning-artifacts/prds/**/prd.md). Input de bmad-ux, bmad-create-architecture y lidr-generate-rf.',
        format: '_bmad-output/planning-artifacts/',
        owner: 'PO + R&D',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/bmad-prd/SKILL.md',
      },
      {
        code: 'T-PRD-002',
        name: 'UX Design Spec (BMad)',
        desc: 'Especificación UX generada por bmad-ux desde el PRD. Evidencia opcional del G1; el checklist la exige cuando la feature tiene superficie de UI primaria. Input de architecture y user stories.',
        format: '_bmad-output/planning-artifacts/',
        owner: 'UX + PO',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/bmad-ux/SKILL.md',
      },
      {
        code: 'T-PRD-003',
        name: 'Review Cruzado',
        desc: 'Validación cruzada Producto↔Técnica de las secciones F+T del PRD (Gate-1 enforcer). El checklist del G1 exige "review-cruzado passed". Aplica .claude/skills/lidr-review-cruzado/checklists/review-cruzado.md.',
        format: 'docs/projects/{client}/',
        owner: 'Producto + R&D',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/lidr-review-cruzado/checklists/review-cruzado.md',
      },
      {
        code: 'T-PRD-004',
        name: 'Risk Log',
        desc: 'Riesgo, probabilidad, impacto, mitigación, owner, status. Evidencia opcional del G1; el checklist exige top riesgos con owners. Alimenta el buffer de lidr-sprint-capacity en G3.',
        format: 'Confluence/Excel',
        owner: 'PME',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/lidr-risk-log/SKILL.md',
      },
    ],
  },
  {
    fase: 'Fase 3 — Solutioning (specification)',
    faseNum: 3,
    unifiedPhase: 3,
    stage: 'specification',
    gateNum: 2,
    color: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    gate: 'Gate 2: Specs Completas',
    dor: [
      'PRD unificado aprobado (Gate 1 passed)',
      'UX spec disponible si hay UI',
      'Equipo de producto, QA y Tech Lead disponibles para revisión',
    ],
    exitCriteria: [
      'Architecture documenta los componentes principales y el data model (bmad-create-architecture)',
      'Cada RF tiene criterios de aceptación BDD Given/When/Then (lidr-generate-rf)',
      'RTM mapea RF ↔ epic/story ↔ test sin requisitos huérfanos (lidr-validate-requirements)',
      'Epics descompuestas en stories de 2-40h (bmad-create-epics-and-stories)',
      'NFRs standalone con métrica medible y umbral (lidr-generate-nfr)',
      'Estrategia de testing diseñada (bmad-testarch-test-design — opcional)',
    ],
    gateSpecific: ['Sign-off QA en gate-2-handoff.md', 'Owners del gate: PO + QA'],
    templates: [
      {
        code: 'T-SOL-001',
        name: 'Architecture Doc (BMad)',
        desc: 'Componentes principales, data model, decisiones arquitectónicas. Generado por bmad-create-architecture desde PRD+UX. Evidencia REQUIRED del G2 (movida desde G1 en el audit: architecture es 3-Solutioning en BMad, no Planning).',
        format: '_bmad-output/planning-artifacts/',
        owner: 'Arquitecto / TL',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/bmad-create-architecture/SKILL.md',
      },
      {
        code: 'T-RF-005',
        name: 'Epics & Stories (BMad)',
        desc: 'Descomposición de la épica master en epics y stories desde PRD + architecture (bmad-create-epics-and-stories). Evidencia REQUIRED del G2; el checklist exige stories de 2-40h. PO y TL validan agrupaciones.',
        format: '_bmad-output/planning-artifacts/',
        owner: 'PO + TL',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/bmad-create-epics-and-stories/SKILL.md',
      },
      {
        code: 'T-RF-001',
        name: 'Requisitos Funcionales (BDD)',
        desc: 'RFs con ID (RF-PROY-NUM), descripción, comportamiento y criterios BDD Given/When/Then generados desde el PRD-F (lidr-generate-rf, formato en templates/rf-format.md). Evidencia REQUIRED del G2 (requirements/RF-*.md). Input de user-stories, test-cases y RTM.',
        format: 'docs/projects/{client}/requirements/',
        owner: 'Producto',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/lidr-generate-rf/SKILL.md',
      },
      {
        code: 'T-RF-004',
        name: 'RTM (Requirements Traceability Matrix)',
        desc: 'Trazabilidad completa US → RF/NFR → PRD → Business Case sin huérfanos, generada por lidr-validate-requirements. Evidencia REQUIRED del G2 (rtm.md); también evidencia de trazabilidad en G5. /lidr-validate-requirements orquesta la fase completa.',
        format: 'docs/projects/{client}/rtm.md',
        owner: 'Producto + TL',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/lidr-validate-requirements/SKILL.md',
      },
      {
        code: 'T-NFR-001',
        name: 'Requisitos No Funcionales',
        desc: 'NFRs standalone con categoría, métrica medible, umbral y método de verificación, generados desde el PRD-T §5 (lidr-generate-nfr, formato en templates/nfr-format.md). Evidencia opcional del G2. Input de bmad-testarch-nfr y de la fase security.',
        format: 'docs/projects/{client}/requirements/',
        owner: 'TL + Producto',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/lidr-generate-nfr/SKILL.md',
      },
      {
        code: 'T-SOL-002',
        name: 'Test Design (BMad TEA)',
        desc: 'Estrategia de testing risk-based diseñada en Solutioning desde epics + NFRs (bmad-testarch-test-design, módulo TEA). Evidencia opcional del G2 (_bmad-output/test-artifacts/test-design/). Input de lidr-create-test-cases y bmad-testarch-automate en la fase qa.',
        format: '_bmad-output/test-artifacts/',
        owner: 'QA Lead',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/bmad-testarch-test-design/SKILL.md',
      },
      {
        code: 'T-SOL-004',
        name: 'Variant Compatibility (lidr-impact-analysis)',
        desc: 'Análisis de compatibilidad de RFs nuevos/modificados contra la matriz de variantes del cliente (registries/). Evidencia opcional del G2; cierra gaps clase PP-05/PP-06. Requiere registries del cliente.',
        format: 'docs/projects/{client}/impact/',
        owner: 'TL',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/lidr-impact-analysis/SKILL.md',
      },
    ],
  },
  {
    fase: 'Fase 3 — Solutioning (sprint-planning)',
    faseNum: 4,
    unifiedPhase: 3,
    stage: 'sprint-planning',
    gateNum: 3,
    color: 'bg-violet-50',
    borderColor: 'border-violet-200',
    gate: 'Gate 3: Ready to Implement',
    dor: [
      'Specs completas: Arch + Epics + RFs + RTM (Gate 2 passed)',
      'Equipo disponible para planning y refinement',
    ],
    exitCriteria: [
      'Equipo completo asignado vs roles requeridos (Dev/QA/TL/DevOps)',
      'Capacidad neta calculada con buffer 15-20%; commitment ≤90% de la neta (lidr-sprint-capacity)',
      'Skill-gap analysis hecho (expertise de dominio/compliance disponible)',
      'Dependencias de infra y equipos externos resueltas o mitigadas',
      'Definition of Ready cumplida para cada story comprometida',
      'Readiness report PASS: specs PRD/UX/Arch/Epics completas (bmad-check-implementation-readiness)',
      'sprint-status.yaml generado (bmad-sprint-planning)',
    ],
    gateSpecific: ['Sign-off PO + TL en gate-3-handoff.md (doble firma)'],
    templates: [
      {
        code: 'T-SPR-004',
        name: 'sprint-status.yaml (BMad)',
        desc: 'Plan de sprint generado por bmad-sprint-planning desde epics + capacity. Evidencia REQUIRED del G3 (_bmad-output/implementation-artifacts/sprint-status*.yaml). Input de bmad-create-story y /lidr-sprint-health. Nota: BMad lo archiva en implementation, pero LIDR ancla su gate en G3.',
        format: '_bmad-output/implementation-artifacts/',
        owner: 'Scrum Master',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/bmad-sprint-planning/SKILL.md',
      },
      {
        code: 'T-SPR-005',
        name: 'Readiness Report (BMad)',
        desc: 'Valida completitud de PRD/UX/Architecture/Epics antes de implementar (bmad-check-implementation-readiness). Evidencia REQUIRED del G3 (*readiness*.md). Absorbe el antiguo /lidr-check-readiness.',
        format: '_bmad-output/planning-artifacts/',
        owner: 'TL',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/bmad-check-implementation-readiness/SKILL.md',
      },
      {
        code: 'T-SPR-003',
        name: 'Sprint Capacity',
        desc: 'Capacidad por miembro: días disponibles, % dedicación, horas efectivas, buffer 15-20% (lidr-sprint-capacity, usa el risk-log para dimensionar buffer). Evidencia REQUIRED del G3 (sprint-capacity*.md). El checklist exige commitment ≤90% de la capacidad neta.',
        format: 'docs/projects/{client}/',
        owner: 'Scrum Master',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/lidr-sprint-capacity/SKILL.md',
      },
    ],
  },
  {
    fase: 'Fase 4 — Implementation (development)',
    faseNum: 5,
    unifiedPhase: 4,
    stage: 'development',
    gateNum: 4,
    color: 'bg-orange-50',
    borderColor: 'border-orange-200',
    gate: 'Gate 4: Code Quality (DoD)',
    dor: [
      'Sprint committed (Gate 3 passed)',
      'Entorno de desarrollo operativo',
      '.claude/rules/ configurado con contexto del proyecto',
    ],
    exitCriteria: [
      'DoD cumplida: code review aprobado (bmad-code-review o peer), unit tests pasan, SAST/SCA limpio 0 crit/high',
      'RUTA B: test-report.md con verdict PASSED (o WARNINGS aceptados explícitamente)',
      'Docs actualizadas en el mismo change — DTC (documentation.md)',
      'Runtime/visual review de UI cambiada passed (lidr-playwright-cli): render, flujos clave, console, a11y',
      'Handoff dev→QA generado y adjunto al ticket (lidr-dev-handoff-qa)',
    ],
    gateSpecific: [
      'Sign-off TL en gate-4-handoff.md',
      'DoD es el gate DURO: vinculante para RUTA A y RUTA B',
    ],
    templates: [
      {
        code: 'T-DEV-006',
        name: 'Handoff Dev→QA',
        desc: 'Contexto completo para QA: qué cambió, cómo probarlo, riesgos, datos de prueba (lidr-dev-handoff-qa). Evidencia REQUIRED del G4 (handoffs/dev-qa-*.md). INPUT directo de lidr-create-test-cases en la fase qa.',
        format: 'docs/projects/{client}/handoffs/',
        owner: 'Dev',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/lidr-dev-handoff-qa/SKILL.md',
      },
      {
        code: 'T-DEV-002',
        name: 'Definition of Done (DoD) Checklist',
        desc: 'Gate DURO del G4, vinculante para ambas rutas: code review aprobado, tests pasan, SAST/SCA limpio (.claude/skills/lidr-pr-description/checklists/dod.md). Guardias automáticas: hooks lidr-frontmatter-guard + protect-secrets. Evaluación formal: /lidr-advance-gate 4.',
        format: 'Checklist',
        owner: 'Dev + TL',
        mandatory: true,
        aiAssist: 'hook',
        claudePath: '.claude/skills/lidr-pr-description/checklists/dod.md',
      },
      {
        code: 'T-DEV-003',
        name: 'Story Implementada — RUTA A (BMad)',
        desc: 'Ciclo BMad puro: bmad-create-story (story contextualizada) → bmad-dev-story (código + tests). Pasa el G4 vía DoD checklist + bmad-code-review, sin test-report. Evidencia opcional (implementation-artifacts).',
        format: '_bmad-output/implementation-artifacts/',
        owner: 'Dev',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/bmad-dev-story/SKILL.md',
      },
      {
        code: 'T-DEV-005',
        name: 'test-report.md — RUTA B (/lidr-spec-verify)',
        desc: 'Producido solo por el spec lifecycle LIDR: /lidr-spec-new → ff → apply → verify. Verdict PASSED/WARNINGS/CRITICAL en changes/*/test-report.md. Evidencia opcional del G4 (required:false para no acoplar el gate a RUTA B).',
        format: 'docs/projects/{client}/changes/',
        owner: 'Dev',
        mandatory: false,
        aiAssist: 'command',
        claudePath: '.claude/commands/lidr-spec-verify.md',
      },
      {
        code: 'T-DEV-004',
        name: 'Code Review (BMad)',
        desc: 'Review adversarial del diff (bmad-code-review). No produce archivo — emite findings inline y enruta de vuelta a dev-story; se verifica como item del checklist DoD ("code review approved").',
        format: 'Inline findings',
        owner: 'TL + Dev',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/bmad-code-review/SKILL.md',
      },
      {
        code: 'T-DEV-007',
        name: 'Runtime/Visual Review',
        desc: 'Revisión runtime de la UI cambiada vía Playwright MCP (lidr-playwright-cli): renders, flujos clave, errores de consola, a11y. Complementa bmad-code-review; item del checklist G4. Evidencia opcional (reviews/runtime-review-*.md).',
        format: 'docs/projects/{client}/reviews/',
        owner: 'Dev',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/lidr-playwright-cli/SKILL.md',
      },
      {
        code: 'T-DEV-008',
        name: 'Contract Impact (lidr-impact-analysis)',
        desc: 'Análisis de impacto del diff contra el contract registry del cliente (registries/). Evidencia opcional del G4 (impact/contract-impact-*.md). Requiere registries del cliente.',
        format: 'docs/projects/{client}/impact/',
        owner: 'TL',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/lidr-impact-analysis/SKILL.md',
      },
    ],
  },
  {
    fase: 'Fase 4 — Implementation (qa)',
    faseNum: 6,
    unifiedPhase: 4,
    stage: 'qa',
    gateNum: 5,
    color: 'bg-sky-50',
    borderColor: 'border-sky-200',
    gate: 'Gate 5: QA Sign-off',
    dor: [
      'Código integrado con DoD cumplida (Gate 4 passed)',
      'Handoff dev→QA recibido con contexto completo',
      'Test design disponible desde Solutioning (T-SOL-002)',
      'Entorno de staging operativo y estable',
    ],
    exitCriteria: [
      'Todos los test cases planificados ejecutados; 0 defectos bloqueantes abiertos',
      'Suite de regresión verde (bmad-testarch-automate)',
      'Test execution report generado (lidr-test-execution-report)',
      'Handoff QA→Security incluye: resultados + cobertura, focus areas de security, checklist de vuln-assessment, verificación de compliance, resultados perf/load',
    ],
    gateSpecific: ['Sign-off QA Lead en signoffs/qa-signoff.md', 'Owner del gate: QA Lead'],
    templates: [
      {
        code: 'T-QA-004',
        name: 'Test Execution Report',
        desc: 'Resultados de la ejecución completa: funcional + BDD + regresión, cobertura, defectos (lidr-test-execution-report). Evidencia REQUIRED del G5 (test-execution-report*.md).',
        format: 'docs/projects/{client}/',
        owner: 'QA Lead',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/lidr-test-execution-report/SKILL.md',
      },
      {
        code: 'T-QA-007',
        name: 'QA Sign-off',
        desc: 'Firma formal del QA Lead que cierra el G5 (signoffs/qa-signoff.md). Requiere: 100% test cases ejecutados, 0 bloqueantes, regresión verde. Aprobación humana — la IA prepara la evidencia, el QA Lead firma.',
        format: 'docs/projects/{client}/signoffs/',
        owner: 'QA Lead',
        mandatory: true,
      },
      {
        code: 'T-QA-002',
        name: 'Test Cases (BDD)',
        desc: 'ID, US vinculada, precondiciones, Given/When/Then, datos de prueba, severidad — generados desde handoff dev→QA + RFs + test design (lidr-create-test-cases). Happy path, edge cases, errores y regresión; CSV-ready. Evidencia opcional del G5.',
        format: 'TestRail',
        owner: 'QA',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/lidr-create-test-cases/SKILL.md',
      },
      {
        code: 'T-QA-005',
        name: 'Regression Suite (BMad TEA)',
        desc: 'Suite de regresión automatizada generada desde el test design (bmad-testarch-automate). Evidencia opcional del G5 (_bmad-output/test-artifacts/). En brownfield la regresión sobre flujos afectados es obligatoria.',
        format: '_bmad-output/test-artifacts/',
        owner: 'QA',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/bmad-testarch-automate/SKILL.md',
      },
      {
        code: 'T-QA-006',
        name: 'Traceability + Gate Decision (BMad TEA)',
        desc: 'Matriz de trazabilidad RTM ↔ resultados + recomendación de gate decision (bmad-testarch-trace). Evidencia opcional del G5 (test-artifacts/traceability/).',
        format: '_bmad-output/test-artifacts/',
        owner: 'QA Lead',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/bmad-testarch-trace/SKILL.md',
      },
    ],
  },
  {
    fase: 'Fase 4 — Implementation (security)',
    faseNum: 7,
    unifiedPhase: 4,
    stage: 'security',
    gateNum: 6,
    color: 'bg-red-50',
    borderColor: 'border-red-200',
    gate: 'Gate 6: Security Sign-off',
    dor: [
      'QA sign-off completado (Gate 5 passed)',
      'App desplegada en réplica de producción',
      'Resultados SAST/SCA previos disponibles',
    ],
    exitCriteria: [
      '0 vulnerabilidades Critical/High abiertas (zero-tolerance, org.md §7)',
      'DAST limpio en entorno réplica de producción',
      'OWASP Top 10 + compliance aplicable (GDPR/PSD2) revisados',
      'Handoff Security→DevOps incluye: assessment, requisitos de deploy, monitoring/alerting, rollback + contactos de emergencia, cambios de infra/config',
    ],
    gateSpecific: ['Sign-off CISO en signoffs/security-signoff.md', 'Owner del gate: CISO'],
    templates: [
      {
        code: 'T-SEC-004',
        name: 'Security Checklist (OWASP + Compliance)',
        desc: 'Checklist OWASP Top 10 + compliance aplicable (lidr-security-checklist). Evidencia REQUIRED del G6 (security-checklist*.md). BMad no tiene capa de seguridad: esta fase es 100% gobernanza LIDR.',
        format: 'docs/projects/{client}/',
        owner: 'Seguridad',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/lidr-security-checklist/SKILL.md',
      },
      {
        code: 'T-SEC-001',
        name: 'Vulnerability Assessment',
        desc: 'IA interpreta resultados SAST/SCA, prioriza hallazgos por impacto real (criterios OWASP) y genera plan de remediación (lidr-vuln-assessment). Evidencia REQUIRED del G6 (vuln-assessment*.md).',
        format: 'docs/projects/{client}/',
        owner: 'Seguridad',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/lidr-vuln-assessment/SKILL.md',
      },
      {
        code: 'T-SEC-005',
        name: 'Security Sign-off',
        desc: 'Firma formal del CISO que cierra el G6 (signoffs/security-signoff.md). Requiere 0 crit/high + DAST limpio. Aprobación humana sobre la evidencia preparada por los skills.',
        format: 'docs/projects/{client}/signoffs/',
        owner: 'CISO',
        mandatory: true,
      },
      {
        code: 'T-SEC-002',
        name: 'DAST Report',
        desc: 'IA resume hallazgos del scanner DAST en pre-producción y sugiere fixes (lidr-dast-interpretation, mapeo OWASP Top 10 → remediation patterns). Evidencia opcional del G6; el checklist exige DAST limpio.',
        format: 'docs/projects/{client}/',
        owner: 'Seguridad',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/lidr-dast-interpretation/SKILL.md',
      },
      {
        code: 'T-SEC-003',
        name: 'Pentest Report',
        desc: 'Informe de penetration testing manual (lidr-pentest-report). Evidencia opcional del G6 (pentest-report*.md).',
        format: 'docs/projects/{client}/',
        owner: 'Seguridad',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/lidr-pentest-report/SKILL.md',
      },
    ],
  },
  {
    fase: 'Fase 4 — Implementation (release)',
    faseNum: 8,
    unifiedPhase: 4,
    stage: 'release',
    gateNum: 7,
    color: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    gate: 'Gate 7: Release (Gate Final)',
    dor: ['Security sign-off completado (Gate 6 passed)', 'Todos los entornos previos validados'],
    exitCriteria: [
      'Change Request aprobado por el Comité de Cambios',
      'Rollback plan documentado y probado',
      'Post-deploy checklist lista; release notes publicadas',
      'Post-deploy: bmad-retrospective programada (lidr-postmortem solo si incidente)',
    ],
    gateSpecific: ['Sign-off PME en gate-7-handoff.md', 'Owner del gate: Change Committee'],
    templates: [
      {
        code: 'T-DEP-001',
        name: 'Change Request',
        desc: 'Descripción del cambio, impacto, riesgos, rollback ref, ventana de despliegue, aprobaciones (ITIL; lidr-change-request, generado desde sign-offs G5+G6). Evidencia REQUIRED del G7 (change-request*.md).',
        format: 'Confluence/Jira',
        owner: 'PME',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/lidr-change-request/SKILL.md',
      },
      {
        code: 'T-DEP-002',
        name: 'Rollback Plan',
        desc: 'Criterios de rollback, procedimiento paso a paso, responsables, tiempo estimado, comunicación (lidr-rollback-plan desde architecture + deploy). Evidencia REQUIRED del G7 (rollback-plan*.md). DevOps valida viabilidad.',
        format: 'Confluence',
        owner: 'DevOps',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/lidr-rollback-plan/SKILL.md',
      },
      {
        code: 'T-DEP-003',
        name: 'Release Notes',
        desc: 'Changelog a 2 niveles (negocio + técnico) generado desde PRs mergeados (lidr-release-notes, via /lidr-create-release-notes). Evidencia REQUIRED del G7 (release-notes*.md). Redacción asistible con bmad-agent-tech-writer.',
        format: 'Confluence',
        owner: 'PO + Dev',
        mandatory: true,
        aiAssist: 'skill',
        claudePath: '.claude/skills/lidr-release-notes/SKILL.md',
      },
      {
        code: 'T-DEP-005',
        name: 'Retrospective (BMad)',
        desc: 'Retro de épica post-deploy (bmad-retrospective): lessons learned data-driven. Item del checklist G7 ("retro programada"); se ejecuta tras el release.',
        format: '_bmad-output/implementation-artifacts/',
        owner: 'Scrum Master',
        mandatory: false,
        aiAssist: 'skill',
        claudePath: '.claude/skills/bmad-retrospective/SKILL.md',
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
    desc: '6 hooks: lidr-frontmatter-guard, lidr-load-context, lidr-validate-ecosystem-counts + notify, auto-format, protect-secrets',
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
  const unifiedPhases = new Set(phases.map((p) => p.unifiedPhase));

  return {
    totalPhases: unifiedPhases.size,
    totalStages: phases.length,
    totalHandoffs: handoffs.length,
    totalTemplates: allTemplates.length,
    mandatoryTemplates: mandatoryTemplates.length,
    aiTemplates: aiTemplates.length,
  };
};
