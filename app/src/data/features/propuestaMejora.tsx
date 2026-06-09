/**
 * @fileoverview PropuestaMejora — remaining shared data after the JSON-driven migration (F3).
 *
 * The 3 tabs (Flujo, Diagnóstico, Mejoras) now consume per-client JSONs from
 * src/data/clients/<clientId>/propuesta/{diagnostico,mejoras,flujo}.json
 * with src/data/clients/base/propuesta/ as the universal fallback.
 *
 * What lives here:
 *   - tabsConfig + TabId  → consumed by PropuestaMejora.tsx for tab navigation
 *   - roadmapTabData + RoadmapItem → consumed by RoadmapTab.tsx (not yet migrated to JSON)
 *   - mejorasIntroData → consumed by PropuestaHero.tsx (metodological hero, not per-client)
 *
 * What used to live here (now in JSON):
 *   - flowTabData → src/data/clients/<id>/propuesta/flujo.json
 *   - diagnosticoTabData → src/data/clients/<id>/propuesta/diagnostico.json
 *   - mejorasTabData → src/data/clients/<id>/propuesta/mejoras.json
 */

import { ecosystemStats, summaryStrings, automationStats } from '@/data';

// =============================================================================
// TYPES
// =============================================================================

export interface TabConfig {
  readonly id: string;
  readonly label: string;
}

export interface RoadmapItem {
  readonly fase: string;
  readonly color: string;
  readonly items: readonly string[];
}

// =============================================================================
// MEJORAS INTRO DATA (consumed by PropuestaHero)
// =============================================================================

export const mejorasIntroData = {
  automatedWorkflows: [
    {
      skill: 'validate-requirements',
      before: '6h manual',
      after: '5min script',
      roiAnual: '150+ horas',
    },
    { skill: 'tech-debt', before: '6h análisis', after: '5min SonarQube', roiAnual: '120+ horas' },
    {
      skill: 'user-stories',
      before: '3h escritura',
      after: '15min slicing',
      roiAnual: '80+ horas',
    },
    {
      skill: 'regression-suite',
      before: '8h selección',
      after: '30min impact',
      roiAnual: '120+ horas',
    },
    {
      skill: 'security-checklist',
      before: '4h compliance',
      after: '5min analysis',
      roiAnual: '80+ horas',
    },
    {
      skill: 'test-plan',
      before: '3h planning',
      after: '5min risk analysis',
      roiAnual: '60+ horas',
    },
    {
      skill: 'release-notes',
      before: '2h manual',
      after: '5min git analysis',
      roiAnual: '50+ horas',
    },
    {
      skill: 'rollback-plan',
      before: '4h risk analysis',
      after: '5min automation',
      roiAnual: '45+ horas',
    },
  ],

  sddPrinciples: [
    {
      title: 'Spec-First',
      description:
        'Si no tiene spec, no tiene código. La especificación impulsa la implementación (PRD → RF → US → Code).',
    },
    {
      title: 'Trazabilidad Obligatoria',
      description: 'Cadena inquebrantable desde Business Case hasta Release Notes. RTM automática.',
    },
    {
      title: 'Quality Gates Obligatorios',
      description: `Ningún artefacto avanza sin cumplir criterios de salida. ${summaryStrings.qualityGatesCount} (0-7), checklists automatizados, sign-offs formales.`,
    },
  ],
} as const;

// =============================================================================
// ROADMAP TAB DATA
// =============================================================================

export const roadmapTabData: readonly RoadmapItem[] = [
  {
    fase: `Ecosistema Completado — ${summaryStrings.artifactsOperational} — COMPLETADO ✓`,
    color: 'border-emerald-300 bg-emerald-50',
    items: [
      `✓ CLAUDE.md orquestador central — índice de ${ecosystemStats.totalArtifacts} artefactos en 8 fuentes de verdad sincronizadas`,
      '✓ 5 rules: org.md, tech-stack.md, project.md, documentation.md, workflows.md',
      `✓ ${ecosystemStats.skills} skills completos (${ecosystemStats.automatedSkills} automatizados, ROI: ${automationStats.estimatedHoursSavedPerYear}h/año) con estructura SKILL.md + reference/ + examples/ + scripts/`,
      `✓ ${ecosystemStats.commands} commands: /implement-ticket, /prepare-testing, /create-release-notes, /advance-gate, /sync-docs, /help, etc.`,
      `✓ ${ecosystemStats.mcps} MCPs completos: filesystem, memory, fetch`,
      '✓ 4 hooks Claude Code operativos: dtc-write-guard, dtc-session-check, notify-desktop, context-loader',
      `✓ ${summaryStrings.qualityGatesCount} (0-7) con /advance-gate — Gate 4 automatizado con cl-dod + pr-description + dtc-write-guard`,
      `✓ ${ecosystemStats.checklists} checklists + ${ecosystemStats.signoffs} signoffs cubriendo los ${ecosystemStats.gates} gates: cl-dod, cl-dor, cl-rf, cl-review, cl-security, cl-postdeploy, cl-nfr, cl-repo-structure + so-qa + so-security`,
      `✓ ${ecosystemStats.templates} templates con docPath resolvible — 26 en templates/ + 8 en standards/projects/audits`,
      '✓ 6 agents operativos con memoria persistente: qa-agent, release-agent, security-agent, onboarding-agent, docs-agent, metrics-agent',
      `✓ ${summaryStrings.workflowsWithSteps} enriquecidos (checklist + signoff + gate contribution por paso)`,
      `✓ ${summaryStrings.integrityTestsCount} validando coherencia entre ${summaryStrings.sourcesOfTruthSync}`,
      '✓ Pipeline seguridad: 4 skills + cl-security + cl-nfr + so-security signoff + Gate 6',
      '✓ Handoff dev→QA + /implement-ticket estandarizado + sprint-capacity + cl-dor con buffer formalizado',
      '✓ release-notes + retrospective + 5 cross-cutting skills (generate-rule, architecture-doc, ux-design-spec, implementation-phases, epic-review)',
      `✓ Centro de excelencia: HelpCenter con ${ecosystemStats.totalArtifacts} artefactos + SitemapView + ${summaryStrings.integrityTestsCount} + ${summaryStrings.workflowsAvailable}`,
      '✓ Agentes autónomos multi-MCP — orquestación de skills + commands + hooks vía MCPs reales (6 agents spec completa)',
      '✓ Propuesta de Mejora — 3 tabs (Diagnóstico, Mejoras, Flujo) JSON-driven con fallback base → cliente (F3 completado)',
    ],
  },
  {
    fase: 'Corto Plazo — Finalización de la herramienta (0-4 semanas) — PENDIENTE',
    color: 'border-blue-300 bg-blue-50',
    items: [
      '⧖ 🔧 Git hooks Husky (pre-commit, commit-msg, pre-push, post-merge) — enforcement de Guidelines §2.2/2.5/4.2',
      '⧖ 🔧 Dashboard unificado de métricas: Sprint + DORA — UI con datos reales (tab Métricas implementado con datos mock)',
      '⧖ 🏢 Continuous deployment con feature flags — pipeline CI/CD real + entornos staging/prod',
      '⧖ 🏢 Validación en proyecto real: probar la propuesta de mejora SDLC en el proyecto en ejecución actual — pulir herramientas (skills, commands, hooks, MCPs) para adaptarlas al contexto real del equipo y estandarizar los formatos de entrega/salida en cada ciclo del desarrollo de software (Discovery, Especificación, Sprint, Desarrollo, QA, Seguridad, Despliegue, Retrospectiva)',
    ],
  },
  {
    fase: 'Medio Plazo — Escalamiento organizacional (3-6 meses) — PENDIENTE',
    color: 'border-amber-300 bg-amber-50',
    items: [
      '⧖ 🏢 Escalamiento organizacional — requiere rollout a múltiples equipos, onboarding de procesos, adaptación por proyecto',
    ],
  },
] as const;

// =============================================================================
// TAB CONFIGURATION
// =============================================================================

export const tabsConfig: readonly TabConfig[] = [
  { id: 'flujo', label: 'Flujo Obligatorio' },
  { id: 'pain', label: 'Diagnóstico' },
  { id: 'mejoras', label: 'Mejoras por Fase' },
  { id: 'metricas', label: 'Metricas' },
] as const;

export type TabId = (typeof tabsConfig)[number]['id'];
