import { createElement } from 'react';
import {
  Brain,
  Terminal,
  FileCode2,
  Bot,
  Cable,
  Zap,
  Settings,
  BookOpen,
  ShieldCheck,
  FolderOpen,
  FolderTree,
  FileText,
} from 'lucide-react';
import { ecosystemStats, summaryStrings } from '@/data/computed/stats';

// Inline color helpers
export const getPhaseColorClass = (phaseId: number) => {
  const colors = {
    1: 'border-purple-500/30 bg-purple-50',
    2: 'border-blue-500/30 bg-blue-50',
    3: 'border-cyan-500/30 bg-cyan-50',
    4: 'border-green-500/30 bg-green-50',
    5: 'border-orange-500/30 bg-orange-50',
    6: 'border-red-500/30 bg-red-50',
    7: 'border-pink-500/30 bg-pink-50',
    8: 'border-indigo-500/30 bg-indigo-50',
  };
  return colors[phaseId as keyof typeof colors] || 'border-gray-500/30 bg-gray-50';
};

export const getComponentColor = (type: string) => {
  const colors = {
    skill: 'text-emerald-600',
    command: 'text-blue-600',
    rule: 'text-purple-600',
    hook: 'text-orange-600',
    orchestrator: 'text-indigo-600',
  };
  return colors[type as keyof typeof colors] || 'text-gray-600';
};

export interface TreeNode {
  name: string;
  type: 'file' | 'folder';
  iconName?: string;
  badge?: { label: string; color: string };
  desc?: string;
  children?: TreeNode[];
  /** Path to the markdown file (relative to project root, no leading slash) */
  docPath?: string;
  /** Direct route link (e.g. '/agents') — marks item as completed and navigable */
  linkTo?: string;
}

// Icon helper function
export function getIcon(iconName: string) {
  const iconMap = {
    BookOpen,
    Settings,
    FolderTree,
    FileCode2,
    Brain,
    FolderOpen,
    Terminal,
    Zap,
    Bot,
    Cable,
    FileText,
    ShieldCheck,
  };

  const IconComponent = iconMap[iconName as keyof typeof iconMap];
  return IconComponent ? createElement(IconComponent, { size: 14 }) : null;
}

export const projectTree: TreeNode[] = [
  {
    name: 'CLAUDE.md',
    type: 'file',
    iconName: 'BookOpen',
    badge: { label: 'Orquestrador', color: getComponentColor('orchestrator') },
    desc: 'Índice comprimido (~8KB) — contexto pasivo que la IA lee siempre. @ solo para 5 rules, resto como índice con paths recuperables',
    docPath: 'CLAUDE.md',
  },
  {
    name: '.claude-env',
    type: 'file',
    iconName: 'Settings',
    badge: { label: 'Env Config', color: 'bg-slate-100 text-slate-700' },
    desc: 'Variables de entorno de Claude Code: PROJECT_TYPE, DTC_ACTIVE, etc.',
  },
  {
    name: '.claude/',
    type: 'folder',
    iconName: 'FolderTree',
    badge: { label: 'IA Config', color: 'bg-violet-100 text-violet-700' },
    desc: 'Ecosistema completo de IA: rules, skills, commands, hooks, agents, MCPs',
    children: [
      {
        name: 'rules/',
        type: 'folder',
        iconName: 'FileCode2',
        badge: { label: 'Nivel 1', color: 'bg-emerald-100 text-emerald-700' },
        desc: 'Contexto persistente a 5 niveles — SIEMPRE cargado',
        children: [
          {
            name: 'org.md',
            type: 'file',
            desc: 'Estándares de organización → @docs/standards/org.md',
            badge: { label: 'Rule', color: getComponentColor('rule') },
            docPath: '.claude/rules/lidr-sdlc/org.md',
          },
          {
            name: 'tech-stack.md',
            type: 'file',
            desc: 'Convenciones técnicas del stack → @docs/standards/tech-*.md',
            badge: { label: 'Rule', color: getComponentColor('rule') },
            docPath: '.claude/rules/lidr-sdlc/tech-stack.md',
          },
          {
            name: 'project.md',
            type: 'file',
            desc: 'Contexto del framework y stack tecnológico activo',
            badge: { label: 'Rule', color: getComponentColor('rule') },
            docPath: '.claude/rules/lidr-sdlc/project.md',
          },
          {
            name: 'documentation.md',
            type: 'file',
            desc: 'Governance: frontmatter, versionado, staleness, naming',
            badge: { label: 'Rule', color: 'bg-indigo-100 text-indigo-700' },
            docPath: '.claude/rules/lidr-sdlc/documentation.md',
          },
          {
            name: 'workflows.md',
            type: 'file',
            desc: 'Mapa de workflows: roles → commands → encadenamiento',
            badge: { label: 'Rule', color: 'bg-indigo-100 text-indigo-700' },
            docPath: '.claude/rules/lidr-sdlc/workflows.md',
          },
        ],
      },
      {
        name: 'skills/',
        type: 'folder',
        iconName: 'Brain',
        badge: {
          label: `${ecosystemStats.skills} skills`,
          color: 'bg-emerald-100 text-emerald-700',
        },
        desc: 'Self-contained skills — cada uno con templates/, checklists/, signoffs/ y scripts/ internos',
        children: [
          {
            name: 'Fase 0 — Preparación',
            type: 'folder',
            iconName: 'FolderOpen',
            badge: { label: '1 skill', color: 'bg-slate-100 text-slate-700' },
            children: [
              {
                name: 'lidr-project-classifier/',
                type: 'folder',
                iconName: 'FolderOpen',
                desc: '🤖 Auto-detecta tipo de proyecto y tech stack en <30s (LIDR SDLC-inspired)',
                children: [
                  {
                    name: 'SKILL.md',
                    type: 'file',
                    desc: 'Definición y lógica del skill',
                    docPath: '.claude/skills/lidr-project-classifier/SKILL.md',
                  },
                  {
                    name: 'examples/',
                    type: 'folder',
                    desc: 'Casos de uso y ejemplos de salida',
                  },
                  {
                    name: 'templates/',
                    type: 'folder',
                    desc: 'Templates específicos del skill',
                  },
                  {
                    name: 'checklists/',
                    type: 'folder',
                    desc: 'Checklists para validación',
                  },
                  {
                    name: 'scripts/',
                    type: 'folder',
                    desc: 'Scripts de validación automática',
                  },
                ],
              },
              {
                name: '... (ver árbol completo por fases abajo)',
                type: 'file',
                desc: `Los ${ecosystemStats.skills} skills siguen la estructura self-contained. Ver árbol completo: LIDR (Fase 0-8 + Cross-cutting), BMad — Base flow (Fase 0-4 + Toolkit + Brownfield + Agents + CIS + Builder + Utilities), Claude meta-tooling.`,
              },
            ],
          },
          {
            name: 'Fase 1 — Originación',
            type: 'folder',
            iconName: 'FolderOpen',
            badge: { label: '4 skills', color: getPhaseColorClass(1) },
            children: [
              {
                name: 'lidr-business-case/SKILL.md',
                type: 'file',
                desc: 'Genera borrador de Business Case',
                docPath: '.claude/skills/lidr-business-case/SKILL.md',
              },
              {
                name: 'lidr-kickoff/SKILL.md',
                type: 'file',
                desc: 'Genera acta de kick-off pre-llenada',
                docPath: '.claude/skills/lidr-kickoff/SKILL.md',
              },
              {
                name: 'lidr-stakeholder-map/SKILL.md',
                type: 'file',
                desc: 'Sugiere mapa de interesados',
                docPath: '.claude/skills/lidr-stakeholder-map/SKILL.md',
              },
              {
                name: 'lidr-tracking-integration/SKILL.md',
                type: 'file',
                desc: 'Pre-llena épica Jira desde BC',
                docPath: '.claude/skills/lidr-tracking-integration/SKILL.md',
              },
            ],
          },
          {
            name: 'Fase 2 — Discovery',
            type: 'folder',
            iconName: 'FolderOpen',
            badge: { label: '2 skills', color: getPhaseColorClass(2) },
            desc: 'PRDs y PoC ahora se generan con bmad-prd y bmad-technical-research (ver sección BMad). LIDR aporta el Gate 1 enforcer y el risk registry formal.',
            children: [
              {
                name: 'lidr-review-cruzado/SKILL.md',
                type: 'file',
                desc: '🔴 Gate 1 enforcer: valida que el output de bmad-prd tenga F+T sections completas',
                docPath: '.claude/skills/lidr-review-cruzado/SKILL.md',
              },
              {
                name: 'lidr-risk-log/SKILL.md',
                type: 'file',
                desc: 'Risk registry formal con patrones por industria (compliance, dependencies, integración)',
                docPath: '.claude/skills/lidr-risk-log/SKILL.md',
              },
            ],
          },
          {
            name: 'Fase 3 — Especificación',
            type: 'folder',
            iconName: 'FolderOpen',
            badge: { label: '3 skills', color: getPhaseColorClass(3) },
            children: [
              {
                name: 'lidr-generate-rf/SKILL.md',
                type: 'file',
                desc: 'Genera RFs completos con BDD desde PRD',
                docPath: '.claude/skills/lidr-generate-rf/SKILL.md',
              },
              {
                name: 'lidr-generate-nfr/SKILL.md',
                type: 'file',
                desc: 'Genera NFRs standalone medibles desde PRD-T §5',
                docPath: '.claude/skills/lidr-generate-nfr/SKILL.md',
              },
              {
                name: 'lidr-validate-requirements/SKILL.md',
                type: 'file',
                desc: '🤖 AUTOMATED: 5-pass validation (6h → 5min). Valida RFs + NFRs, genera RTM, detecta gaps',
                docPath: '.claude/skills/lidr-validate-requirements/SKILL.md',
              },
            ],
          },
          {
            name: 'Fase 4 — Sprint Planning',
            type: 'folder',
            iconName: 'FolderOpen',
            badge: { label: '3 skills', color: getPhaseColorClass(4) },
            children: [
              {
                name: 'lidr-user-stories/SKILL.md',
                type: 'file',
                desc: '🤖 AUTOMATED: US con BDD desde RFs (3h → 15min). Genera User Stories bien formateadas con criterios de aceptación BDD',
                docPath: '.claude/skills/lidr-user-stories/SKILL.md',
              },
              {
                name: 'lidr-sprint-capacity/SKILL.md',
                type: 'file',
                desc: 'Calcula capacidad, velocity y commitment',
                docPath: '.claude/skills/lidr-sprint-capacity/SKILL.md',
              },
              {
                name: 'lidr-refinement-notes/SKILL.md',
                type: 'file',
                desc: 'Genera notas de refinement estructuradas',
                docPath: '.claude/skills/lidr-refinement-notes/SKILL.md',
              },
            ],
          },
          {
            name: 'Fase 5 — Desarrollo',
            type: 'folder',
            iconName: 'FolderOpen',
            badge: { label: '6 skills', color: getPhaseColorClass(5) },
            children: [
              {
                name: 'lidr-pr-description/SKILL.md',
                type: 'file',
                desc: 'Genera PR description desde commits',
                docPath: '.claude/skills/lidr-pr-description/SKILL.md',
              },
              {
                name: 'lidr-adr/SKILL.md',
                type: 'file',
                desc: 'Crea Architecture Decision Record',
                docPath: '.claude/skills/lidr-adr/SKILL.md',
              },
              {
                name: 'lidr-tech-debt/SKILL.md',
                type: 'file',
                desc: '🤖 AUTOMATED: Detecta y cataloga deuda técnica (6h → 5min)',
                docPath: '.claude/skills/lidr-tech-debt/SKILL.md',
              },
              {
                name: 'lidr-dev-handoff-qa/SKILL.md',
                type: 'file',
                desc: 'Genera handoff dev→QA completo',
                docPath: '.claude/skills/lidr-dev-handoff-qa/SKILL.md',
              },
              {
                name: 'lidr-using-git-worktrees/SKILL.md',
                type: 'file',
                desc: 'Crea, usa y limpia worktrees aislados para trabajo paralelo',
                docPath: '.agents/skills/lidr-using-git-worktrees/SKILL.md',
              },
              {
                name: 'lidr-run-parallel-tasks/SKILL.md',
                type: 'file',
                desc: '🤖 AUTOMATED: Lanza N changes en paralelo en worktrees (Opus high)',
                docPath: '.agents/skills/lidr-run-parallel-tasks/SKILL.md',
              },
            ],
          },
          {
            name: 'Fase 6 — QA',
            type: 'folder',
            iconName: 'FolderOpen',
            badge: { label: '3 skills', color: getPhaseColorClass(6) },
            children: [
              {
                name: 'lidr-create-test-cases/SKILL.md',
                type: 'file',
                desc: 'Genera test cases BDD desde RFs',
                docPath: '.claude/skills/lidr-create-test-cases/SKILL.md',
              },
              {
                name: 'lidr-bug-report/SKILL.md',
                type: 'file',
                desc: 'Estructura bug reports detallados',
                docPath: '.claude/skills/lidr-bug-report/SKILL.md',
              },
              {
                name: 'lidr-test-execution-report/SKILL.md',
                type: 'file',
                desc: 'Reporta ejecución de testing',
                docPath: '.claude/skills/lidr-test-execution-report/SKILL.md',
              },
            ],
          },
          {
            name: 'Fase 7 — Seguridad',
            type: 'folder',
            iconName: 'FolderOpen',
            badge: { label: '4 skills', color: getPhaseColorClass(7) },
            children: [
              {
                name: 'lidr-vuln-assessment/SKILL.md',
                type: 'file',
                desc: 'Interpreta reportes SAST/SCA',
                docPath: '.claude/skills/lidr-vuln-assessment/SKILL.md',
              },
              {
                name: 'lidr-dast-interpretation/SKILL.md',
                type: 'file',
                desc: 'Interpreta reportes DAST/IAST',
                docPath: '.claude/skills/lidr-dast-interpretation/SKILL.md',
              },
              {
                name: 'lidr-pentest-report/SKILL.md',
                type: 'file',
                desc: 'Estructura reporte de pentesting',
                docPath: '.claude/skills/lidr-pentest-report/SKILL.md',
              },
              {
                name: 'lidr-security-checklist/SKILL.md',
                type: 'file',
                desc: '🤖 AUTOMATED: Security compliance (4h → 5min)',
                docPath: '.claude/skills/lidr-security-checklist/SKILL.md',
              },
            ],
          },
          {
            name: 'Fase 8 — Despliegue',
            type: 'folder',
            iconName: 'FolderOpen',
            badge: { label: '4 skills', color: getPhaseColorClass(8) },
            children: [
              {
                name: 'lidr-change-request/SKILL.md',
                type: 'file',
                desc: 'Genera Change Request formal',
                docPath: '.claude/skills/lidr-change-request/SKILL.md',
              },
              {
                name: 'lidr-rollback-plan/SKILL.md',
                type: 'file',
                desc: '🤖 AUTOMATED: Plan de rollback (4h → 5min)',
                docPath: '.claude/skills/lidr-rollback-plan/SKILL.md',
              },
              {
                name: 'lidr-release-notes/SKILL.md',
                type: 'file',
                desc: '🤖 AUTOMATED: Release notes desde PRs (2h → 5min)',
                docPath: '.claude/skills/lidr-release-notes/SKILL.md',
              },
              {
                name: 'lidr-postmortem/SKILL.md',
                type: 'file',
                desc: 'Conduce postmortem blameless',
                docPath: '.claude/skills/lidr-postmortem/SKILL.md',
              },
            ],
          },
          {
            name: 'Cross-cutting — Governance & utilidades',
            type: 'folder',
            iconName: 'FolderOpen',
            badge: { label: '9 skills', color: 'bg-indigo-100 text-indigo-700' },
            desc: 'Skills que aplican transversalmente a múltiples fases (Gate orchestration, auditoría, tracking, handoffs, utilidades de Dev).',
            children: [
              {
                name: 'lidr-gate-evaluation/SKILL.md',
                type: 'file',
                desc: '🔴 Core del LIDR SDLC: evalúa cualquier Gate G0-G7 con criterios formales y handoff package',
                docPath: '.claude/skills/lidr-gate-evaluation/SKILL.md',
              },
              {
                name: 'lidr-audit-standards/SKILL.md',
                type: 'file',
                desc: 'Audita el ecosistema `.agents/` (frontmatter, drift, paths) — complementa bmad-review-adversarial-general',
                docPath: '.claude/skills/lidr-audit-standards/SKILL.md',
              },
              {
                name: 'lidr-sdlc-tracking/SKILL.md',
                type: 'file',
                desc: 'Portfolio state centralizado, métricas LIDR SDLC y health checks',
                docPath: '.claude/skills/lidr-sdlc-tracking/SKILL.md',
              },
              {
                name: 'lidr-automated-handoffs/SKILL.md',
                type: 'file',
                desc: 'Automatiza transiciones de fase Dev→QA→Sec→DevOps con notificaciones',
                docPath: '.claude/skills/lidr-automated-handoffs/SKILL.md',
              },
              {
                name: 'lidr-external-sync/SKILL.md',
                type: 'file',
                desc: 'Sincronización bidireccional Jira ↔ Linear ↔ Notion (opcional, multi-tool teams)',
                docPath: '.claude/skills/lidr-external-sync/SKILL.md',
              },
              {
                name: 'lidr-ticket-validation/SKILL.md',
                type: 'file',
                desc: 'Valida estructura de tickets LIDR/BMad (YAML frontmatter, AC, BDD, DoD) pre-refinement y pre-PR',
                docPath: '.claude/skills/lidr-ticket-validation/SKILL.md',
              },
              {
                name: 'lidr-commit-management/SKILL.md',
                type: 'file',
                desc: 'Conventional commits, rebase/squash con scope conventions LIDR',
                docPath: '.claude/skills/lidr-commit-management/SKILL.md',
              },
              {
                name: 'lidr-propuesta-builder/SKILL.md',
                type: 'file',
                desc: 'Genera UI JSONs para "Propuesta de Mejora" (opcional, consultoría multi-cliente)',
                docPath: '.claude/skills/lidr-propuesta-builder/SKILL.md',
              },
              {
                name: 'lidr-playwright-cli/SKILL.md',
                type: 'file',
                desc: 'E2E testing automation con Playwright (opcional, web QA)',
                docPath: '.claude/skills/lidr-playwright-cli/SKILL.md',
              },
            ],
          },
          {
            name: 'Claude meta-tooling (anytime)',
            type: 'folder',
            iconName: 'FolderOpen',
            badge: { label: '5 skills', color: 'bg-slate-200 text-slate-700' },
            desc: 'Skills para extender la plataforma Claude Code (no LIDR, no BMad). Opcional: solo si extiendes Claude Code.',
            children: [
              {
                name: 'claude-agents-architecture/SKILL.md',
                type: 'file',
                desc: 'Meta-skill: entry-point para crear skills/commands/subagents con sync automático cross-platform',
                docPath: '.claude/skills/claude-agents-architecture/SKILL.md',
              },
              {
                name: 'claude-command-development/SKILL.md',
                type: 'file',
                desc: 'Diseño e implementación de slash commands para Claude Code',
                docPath: '.claude/skills/claude-command-development/SKILL.md',
              },
              {
                name: 'claude-generate-rule/SKILL.md',
                type: 'file',
                desc: 'Generar Claude Code rules con frontmatter y estructura correcta',
                docPath: '.claude/skills/claude-generate-rule/SKILL.md',
              },
              {
                name: 'claude-hook-development/SKILL.md',
                type: 'file',
                desc: 'Hooks PreToolUse/PostToolUse/Stop/SessionStart para automation de quality gates',
                docPath: '.claude/skills/claude-hook-development/SKILL.md',
              },
              {
                name: 'claude-mcp-integration/SKILL.md',
                type: 'file',
                desc: 'Integración de MCP servers (stdio, SSE, HTTP) para conectar servicios externos al LLM',
                docPath: '.claude/skills/claude-mcp-integration/SKILL.md',
              },
            ],
          },
          {
            name: 'BMad — Base flow',
            type: 'folder',
            iconName: 'FolderOpen',
            badge: { label: '69 skills', color: 'bg-amber-100 text-amber-800' },
            desc: 'BMad Method: flujo base del SDLC organizado por las 5 fases oficiales del Vol I-V (docs/guides/bmad/). LIDR actúa como thin complement sobre estos outputs.',
            children: [
              {
                name: 'Fase 0 — Aprendizaje',
                type: 'folder',
                iconName: 'FolderOpen',
                badge: { label: '1 skill', color: 'bg-amber-50 text-amber-700' },
                children: [
                  {
                    name: 'bmad-teach-me-testing/SKILL.md',
                    type: 'file',
                    desc: 'Aprendizaje progresivo de testing para equipos adoptando TEA module',
                    docPath: '.claude/skills/bmad-teach-me-testing/SKILL.md',
                  },
                ],
              },
              {
                name: 'Fase 1 — Análisis',
                type: 'folder',
                iconName: 'FolderOpen',
                badge: { label: '6 skills', color: 'bg-amber-50 text-amber-700' },
                children: [
                  {
                    name: 'bmad-product-brief/SKILL.md',
                    type: 'file',
                    desc: 'Product brief lightweight para definición rápida',
                    docPath: '.claude/skills/bmad-product-brief/SKILL.md',
                  },
                  {
                    name: 'bmad-brainstorming/SKILL.md',
                    type: 'file',
                    desc: 'Sesiones interactivas de brainstorming con técnicas creativas',
                    docPath: '.claude/skills/bmad-brainstorming/SKILL.md',
                  },
                  {
                    name: 'bmad-advanced-elicitation/SKILL.md',
                    type: 'file',
                    desc: 'Refinamiento socrático (socratic, first principles, pre-mortem, red team)',
                    docPath: '.claude/skills/bmad-advanced-elicitation/SKILL.md',
                  },
                  {
                    name: 'bmad-domain-research/SKILL.md',
                    type: 'file',
                    desc: 'Research de dominio e industria',
                    docPath: '.claude/skills/bmad-domain-research/SKILL.md',
                  },
                  {
                    name: 'bmad-market-research/SKILL.md',
                    type: 'file',
                    desc: 'Market research sobre competencia y clientes',
                    docPath: '.claude/skills/bmad-market-research/SKILL.md',
                  },
                  {
                    name: 'bmad-technical-research/SKILL.md',
                    type: 'file',
                    desc: 'Research técnico de tecnologías y arquitectura',
                    docPath: '.claude/skills/bmad-technical-research/SKILL.md',
                  },
                ],
              },
              {
                name: 'Fase 2 — Planificación',
                type: 'folder',
                iconName: 'FolderOpen',
                badge: { label: '4 skills', color: 'bg-amber-50 text-amber-700' },
                children: [
                  {
                    name: 'bmad-prd/SKILL.md',
                    type: 'file',
                    desc: 'PRD unificado: crear/actualizar/validar (intent-based)',
                    docPath: '.claude/skills/bmad-prd/SKILL.md',
                  },
                  {
                    name: 'bmad-create-prd/SKILL.md',
                    type: 'file',
                    desc: 'DEPRECATED: consolidado en bmad-prd (create intent)',
                    docPath: '.claude/skills/bmad-create-prd/SKILL.md',
                  },
                  {
                    name: 'bmad-validate-prd/SKILL.md',
                    type: 'file',
                    desc: 'DEPRECATED: consolidado en bmad-prd (validate intent)',
                    docPath: '.claude/skills/bmad-validate-prd/SKILL.md',
                  },
                  {
                    name: 'bmad-create-ux-design/SKILL.md',
                    type: 'file',
                    desc: 'Plan de UX patterns y design specifications',
                    docPath: '.claude/skills/bmad-create-ux-design/SKILL.md',
                  },
                ],
              },
              {
                name: 'Fase 3 — Solución',
                type: 'folder',
                iconName: 'FolderOpen',
                badge: { label: '6 skills', color: 'bg-amber-50 text-amber-700' },
                children: [
                  {
                    name: 'bmad-create-architecture/SKILL.md',
                    type: 'file',
                    desc: 'Architecture solution design para AI agent consistency',
                    docPath: '.claude/skills/bmad-create-architecture/SKILL.md',
                  },
                  {
                    name: 'bmad-create-epics-and-stories/SKILL.md',
                    type: 'file',
                    desc: 'Descompone requisitos en epics y user stories',
                    docPath: '.claude/skills/bmad-create-epics-and-stories/SKILL.md',
                  },
                  {
                    name: 'bmad-check-implementation-readiness/SKILL.md',
                    type: 'file',
                    desc: 'Valida que PRD/UX/Arch/Epics estén completos',
                    docPath: '.claude/skills/bmad-check-implementation-readiness/SKILL.md',
                  },
                  {
                    name: 'bmad-testarch-test-design/SKILL.md',
                    type: 'file',
                    desc: 'Test plans system-level o epic-level con risk assessment',
                    docPath: '.claude/skills/bmad-testarch-test-design/SKILL.md',
                  },
                  {
                    name: 'bmad-testarch-framework/SKILL.md',
                    type: 'file',
                    desc: 'Initialize test framework (Playwright o Cypress)',
                    docPath: '.claude/skills/bmad-testarch-framework/SKILL.md',
                  },
                  {
                    name: 'bmad-testarch-ci/SKILL.md',
                    type: 'file',
                    desc: 'CI/CD quality pipeline con test execution',
                    docPath: '.claude/skills/bmad-testarch-ci/SKILL.md',
                  },
                ],
              },
              {
                name: 'Fase 4 — Implementación',
                type: 'folder',
                iconName: 'FolderOpen',
                badge: { label: '10 skills', color: 'bg-amber-50 text-amber-700' },
                children: [
                  {
                    name: 'bmad-sprint-planning/SKILL.md',
                    type: 'file',
                    desc: 'Sprint status tracking desde epics',
                    docPath: '.claude/skills/bmad-sprint-planning/SKILL.md',
                  },
                  {
                    name: 'bmad-sprint-status/SKILL.md',
                    type: 'file',
                    desc: 'Resumen de sprint y surface risks',
                    docPath: '.claude/skills/bmad-sprint-status/SKILL.md',
                  },
                  {
                    name: 'bmad-create-story/SKILL.md',
                    type: 'file',
                    desc: 'Crea story file dedicado para dev agent',
                    docPath: '.claude/skills/bmad-create-story/SKILL.md',
                  },
                  {
                    name: 'bmad-testarch-atdd/SKILL.md',
                    type: 'file',
                    desc: 'Red-phase acceptance test scaffolds con TDD cycle',
                    docPath: '.claude/skills/bmad-testarch-atdd/SKILL.md',
                  },
                  {
                    name: 'bmad-dev-story/SKILL.md',
                    type: 'file',
                    desc: 'Ejecuta story implementation con context filled spec',
                    docPath: '.claude/skills/bmad-dev-story/SKILL.md',
                  },
                  {
                    name: 'bmad-testarch-automate/SKILL.md',
                    type: 'file',
                    desc: 'Expand test automation coverage',
                    docPath: '.claude/skills/bmad-testarch-automate/SKILL.md',
                  },
                  {
                    name: 'bmad-code-review/SKILL.md',
                    type: 'file',
                    desc: 'Code review adversarial (Blind Hunter, Edge Case Hunter, Acceptance Auditor)',
                    docPath: '.claude/skills/bmad-code-review/SKILL.md',
                  },
                  {
                    name: 'bmad-testarch-nfr/SKILL.md',
                    type: 'file',
                    desc: 'NFR assessment (performance, security, reliability)',
                    docPath: '.claude/skills/bmad-testarch-nfr/SKILL.md',
                  },
                  {
                    name: 'bmad-testarch-test-review/SKILL.md',
                    type: 'file',
                    desc: 'Review test quality con best practices validation',
                    docPath: '.claude/skills/bmad-testarch-test-review/SKILL.md',
                  },
                  {
                    name: 'bmad-testarch-trace/SKILL.md',
                    type: 'file',
                    desc: 'Traceability matrix y quality gate decision',
                    docPath: '.claude/skills/bmad-testarch-trace/SKILL.md',
                  },
                  {
                    name: 'bmad-retrospective/SKILL.md',
                    type: 'file',
                    desc: 'Post-epic review para extraer lecciones',
                    docPath: '.claude/skills/bmad-retrospective/SKILL.md',
                  },
                ],
              },
              {
                name: 'Toolkit Anytime',
                type: 'folder',
                iconName: 'FolderOpen',
                badge: { label: '3 skills', color: 'bg-amber-50 text-amber-700' },
                desc: 'Skills invocables en cualquier momento durante el flujo',
                children: [
                  {
                    name: 'bmad-edit-prd/SKILL.md',
                    type: 'file',
                    desc: 'DEPRECATED: consolidado en bmad-prd (update intent)',
                    docPath: '.claude/skills/bmad-edit-prd/SKILL.md',
                  },
                  {
                    name: 'bmad-correct-course/SKILL.md',
                    type: 'file',
                    desc: 'Manage changes durante sprint execution',
                    docPath: '.claude/skills/bmad-correct-course/SKILL.md',
                  },
                  {
                    name: 'bmad-prfaq/SKILL.md',
                    type: 'file',
                    desc: 'Working Backwards PRFAQ challenge para forjar product concepts',
                    docPath: '.claude/skills/bmad-prfaq/SKILL.md',
                  },
                ],
              },
              {
                name: 'Brownfield',
                type: 'folder',
                iconName: 'FolderOpen',
                badge: { label: '4 skills', color: 'bg-amber-50 text-amber-700' },
                desc: 'Workflows para legacy projects existentes',
                children: [
                  {
                    name: 'bmad-document-project/SKILL.md',
                    type: 'file',
                    desc: 'Documenta brownfield projects para AI context',
                    docPath: '.claude/skills/bmad-document-project/SKILL.md',
                  },
                  {
                    name: 'bmad-generate-project-context/SKILL.md',
                    type: 'file',
                    desc: 'Crea project-context.md con AI rules',
                    docPath: '.claude/skills/bmad-generate-project-context/SKILL.md',
                  },
                  {
                    name: 'bmad-quick-dev/SKILL.md',
                    type: 'file',
                    desc: 'Implementa cambios rápidos siguiendo project conventions',
                    docPath: '.claude/skills/bmad-quick-dev/SKILL.md',
                  },
                  {
                    name: 'bmad-qa-generate-e2e-tests/SKILL.md',
                    type: 'file',
                    desc: 'Generar E2E tests para features existentes',
                    docPath: '.claude/skills/bmad-qa-generate-e2e-tests/SKILL.md',
                  },
                ],
              },
              {
                name: 'Persona Agents — BMM + TEA',
                type: 'folder',
                iconName: 'FolderOpen',
                badge: { label: '7 agents', color: 'bg-amber-50 text-amber-700' },
                desc: 'Conversational specialist agents (anytime)',
                children: [
                  {
                    name: 'bmad-agent-analyst/SKILL.md',
                    type: 'file',
                    desc: 'Mary — Business Analyst, strategic discovery',
                    docPath: '.claude/skills/bmad-agent-analyst/SKILL.md',
                  },
                  {
                    name: 'bmad-agent-pm/SKILL.md',
                    type: 'file',
                    desc: 'John — Product Manager, Jobs-to-be-Done',
                    docPath: '.claude/skills/bmad-agent-pm/SKILL.md',
                  },
                  {
                    name: 'bmad-agent-architect/SKILL.md',
                    type: 'file',
                    desc: 'Winston — System Architect, trade-offs',
                    docPath: '.claude/skills/bmad-agent-architect/SKILL.md',
                  },
                  {
                    name: 'bmad-agent-ux-designer/SKILL.md',
                    type: 'file',
                    desc: 'Sally — UX Designer, empathy con rigor',
                    docPath: '.claude/skills/bmad-agent-ux-designer/SKILL.md',
                  },
                  {
                    name: 'bmad-agent-dev/SKILL.md',
                    type: 'file',
                    desc: 'Amelia — Senior Software Engineer, test-first',
                    docPath: '.claude/skills/bmad-agent-dev/SKILL.md',
                  },
                  {
                    name: 'bmad-agent-tech-writer/SKILL.md',
                    type: 'file',
                    desc: 'Paige — Technical Writer, diagrams sobre prose',
                    docPath: '.claude/skills/bmad-agent-tech-writer/SKILL.md',
                  },
                  {
                    name: 'bmad-tea/SKILL.md',
                    type: 'file',
                    desc: 'Murat — Master Test Architect y Quality Advisor',
                    docPath: '.claude/skills/bmad-tea/SKILL.md',
                  },
                ],
              },
              {
                name: 'Persona Agents — CIS (Creative Intelligence Suite)',
                type: 'folder',
                iconName: 'FolderOpen',
                badge: { label: '6 agents', color: 'bg-amber-50 text-amber-700' },
                desc: 'Conversational specialists para innovation, design thinking, storytelling',
                children: [
                  {
                    name: 'bmad-cis-agent-brainstorming-coach/SKILL.md',
                    type: 'file',
                    desc: 'Carson — Brainstorming Specialist',
                    docPath: '.claude/skills/bmad-cis-agent-brainstorming-coach/SKILL.md',
                  },
                  {
                    name: 'bmad-cis-agent-creative-problem-solver/SKILL.md',
                    type: 'file',
                    desc: 'Dr. Quinn — Master Problem Solver',
                    docPath: '.claude/skills/bmad-cis-agent-creative-problem-solver/SKILL.md',
                  },
                  {
                    name: 'bmad-cis-agent-design-thinking-coach/SKILL.md',
                    type: 'file',
                    desc: 'Maya — Design Thinking Maestro',
                    docPath: '.claude/skills/bmad-cis-agent-design-thinking-coach/SKILL.md',
                  },
                  {
                    name: 'bmad-cis-agent-innovation-strategist/SKILL.md',
                    type: 'file',
                    desc: 'Victor — Disruptive Innovation Oracle',
                    docPath: '.claude/skills/bmad-cis-agent-innovation-strategist/SKILL.md',
                  },
                  {
                    name: 'bmad-cis-agent-presentation-master/SKILL.md',
                    type: 'file',
                    desc: 'Caravaggio — Presentation Expert',
                    docPath: '.claude/skills/bmad-cis-agent-presentation-master/SKILL.md',
                  },
                  {
                    name: 'bmad-cis-agent-storyteller/SKILL.md',
                    type: 'file',
                    desc: 'Sophia — Master Storyteller',
                    docPath: '.claude/skills/bmad-cis-agent-storyteller/SKILL.md',
                  },
                ],
              },
              {
                name: 'CIS Workflows — Creative Intelligence Suite',
                type: 'folder',
                iconName: 'FolderOpen',
                badge: { label: '4 skills', color: 'bg-amber-50 text-amber-700' },
                children: [
                  {
                    name: 'bmad-cis-design-thinking/SKILL.md',
                    type: 'file',
                    desc: 'Guide human-centered design con empathy-driven methodologies',
                    docPath: '.claude/skills/bmad-cis-design-thinking/SKILL.md',
                  },
                  {
                    name: 'bmad-cis-innovation-strategy/SKILL.md',
                    type: 'file',
                    desc: 'Identifica disruption opportunities y architect business model innovation',
                    docPath: '.claude/skills/bmad-cis-innovation-strategy/SKILL.md',
                  },
                  {
                    name: 'bmad-cis-problem-solving/SKILL.md',
                    type: 'file',
                    desc: 'Apply systematic problem-solving methodologies',
                    docPath: '.claude/skills/bmad-cis-problem-solving/SKILL.md',
                  },
                  {
                    name: 'bmad-cis-storytelling/SKILL.md',
                    type: 'file',
                    desc: 'Craft compelling narratives con story frameworks',
                    docPath: '.claude/skills/bmad-cis-storytelling/SKILL.md',
                  },
                ],
              },
              {
                name: 'BMad Builder (BMB) — Meta',
                type: 'folder',
                iconName: 'FolderOpen',
                badge: { label: '4 skills', color: 'bg-amber-50 text-amber-700' },
                desc: 'Meta-tooling para extender BMad mismo',
                children: [
                  {
                    name: 'bmad-bmb-setup/SKILL.md',
                    type: 'file',
                    desc: 'Setup BMad Builder module en un proyecto',
                    docPath: '.claude/skills/bmad-bmb-setup/SKILL.md',
                  },
                  {
                    name: 'bmad-agent-builder/SKILL.md',
                    type: 'file',
                    desc: 'Build, edit o analyze Agent Skills conversacionalmente',
                    docPath: '.claude/skills/bmad-agent-builder/SKILL.md',
                  },
                  {
                    name: 'bmad-module-builder/SKILL.md',
                    type: 'file',
                    desc: 'Plans, creates y validates BMad modules',
                    docPath: '.claude/skills/bmad-module-builder/SKILL.md',
                  },
                  {
                    name: 'bmad-workflow-builder/SKILL.md',
                    type: 'file',
                    desc: 'Build, edit, analyze workflows y skills',
                    docPath: '.claude/skills/bmad-workflow-builder/SKILL.md',
                  },
                ],
              },
              {
                name: 'Core Utilities',
                type: 'folder',
                iconName: 'FolderOpen',
                badge: { label: '13 skills', color: 'bg-amber-50 text-amber-700' },
                desc: 'Cross-cutting utilities: help, customize, doc-management, review',
                children: [
                  {
                    name: 'bmad-help/SKILL.md',
                    type: 'file',
                    desc: 'Recomienda next skill basado en estado actual y query',
                    docPath: '.claude/skills/bmad-help/SKILL.md',
                  },
                  {
                    name: 'bmad-customize/SKILL.md',
                    type: 'file',
                    desc: 'Customization overrides para installed BMad skills',
                    docPath: '.claude/skills/bmad-customize/SKILL.md',
                  },
                  {
                    name: 'bmad-shard-doc/SKILL.md',
                    type: 'file',
                    desc: 'Splits large markdown docs en archivos organizados',
                    docPath: '.claude/skills/bmad-shard-doc/SKILL.md',
                  },
                  {
                    name: 'bmad-index-docs/SKILL.md',
                    type: 'file',
                    desc: 'Genera/actualiza index.md para folder de docs',
                    docPath: '.claude/skills/bmad-index-docs/SKILL.md',
                  },
                  {
                    name: 'bmad-distillator/SKILL.md',
                    type: 'file',
                    desc: 'Lossless LLM-optimized compression de source documents',
                    docPath: '.claude/skills/bmad-distillator/SKILL.md',
                  },
                  {
                    name: 'bmad-party-mode/SKILL.md',
                    type: 'file',
                    desc: 'Group discussions multi-agent entre BMAD agents instalados',
                    docPath: '.claude/skills/bmad-party-mode/SKILL.md',
                  },
                  {
                    name: 'bmad-checkpoint-preview/SKILL.md',
                    type: 'file',
                    desc: 'LLM-assisted human-in-the-loop review pre-merge',
                    docPath: '.claude/skills/bmad-checkpoint-preview/SKILL.md',
                  },
                  {
                    name: 'bmad-investigate/SKILL.md',
                    type: 'file',
                    desc: 'Forensic case investigation con evidence-graded findings',
                    docPath: '.claude/skills/bmad-investigate/SKILL.md',
                  },
                  {
                    name: 'bmad-eval-runner/SKILL.md',
                    type: 'file',
                    desc: 'Run skill evals en clean Docker environment con grader subagents',
                    docPath: '.claude/skills/bmad-eval-runner/SKILL.md',
                  },
                  {
                    name: 'bmad-review-adversarial-general/SKILL.md',
                    type: 'file',
                    desc: 'Cynical Review con findings report',
                    docPath: '.claude/skills/bmad-review-adversarial-general/SKILL.md',
                  },
                  {
                    name: 'bmad-review-edge-case-hunter/SKILL.md',
                    type: 'file',
                    desc: 'Walk every branching path y boundary condition',
                    docPath: '.claude/skills/bmad-review-edge-case-hunter/SKILL.md',
                  },
                  {
                    name: 'bmad-editorial-review-prose/SKILL.md',
                    type: 'file',
                    desc: 'Clinical copy-editor para communication issues',
                    docPath: '.claude/skills/bmad-editorial-review-prose/SKILL.md',
                  },
                  {
                    name: 'bmad-editorial-review-structure/SKILL.md',
                    type: 'file',
                    desc: 'Structural editor para cuts, reorganization, simplification',
                    docPath: '.claude/skills/bmad-editorial-review-structure/SKILL.md',
                  },
                  {
                    name: 'bmad-teach-me-testing/SKILL.md',
                    type: 'file',
                    desc: 'Teach testing progresivamente (también en Fase 0)',
                    docPath: '.claude/skills/bmad-teach-me-testing/SKILL.md',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'commands/',
        type: 'folder',
        iconName: 'Terminal',
        badge: { label: 'Nivel 1+2', color: 'bg-blue-100 text-blue-700' },
        desc: 'Workflows orquestadores — 7 Tier 1 + 6 Tier 2 base + 7 Tier 2 LIDR Spec Lifecycle (lidr-spec-*) + 1 Utility',
        children: [
          {
            name: 'check-readiness.md',
            type: 'file',
            desc: 'Pre-implementation validation: PRD, team, dependencies, readiness score',
            docPath: '.claude/commands/lidr-check-readiness.md',
          },
          {
            name: 'validate-prd.md',
            type: 'file',
            desc: 'LIDR SDLC Methodology PRD quality validation with automated scoring and actionable recommendations',
            docPath: '.claude/commands/lidr-validate-prd.md',
          },
          {
            name: 'course-correct.md',
            type: 'file',
            desc: 'Mid-project course correction for managing deviations and realigning projects',
            docPath: '.claude/commands/lidr-course-correct.md',
          },
          {
            name: 'document-project.md',
            type: 'file',
            desc: 'Workflow LIDR SDLC completo de documentación',
            docPath: '.claude/commands/lidr-document-project.md',
          },
          {
            name: 'product-brief.md',
            type: 'file',
            desc: 'Producto brief ligero LIDR SDLC Methodology para definición rápida de productos',
            docPath: '.claude/commands/lidr-product-brief.md',
          },
          {
            name: 'quick-dev.md',
            type: 'file',
            desc: 'Quick development workflow for small features and fixes',
            docPath: '.claude/commands/lidr-quick-dev.md',
          },
          {
            name: 'quick-spec.md',
            type: 'file',
            desc: 'Especificación ligera para features pequeñas (≤40h)',
            docPath: '.claude/commands/lidr-quick-spec.md',
          },
          {
            name: 'sprint-health.md',
            type: 'file',
            desc: 'Monitoreo activo de salud del sprint con detección de riesgos según LIDR SDLC',
            docPath: '.claude/commands/lidr-sprint-health.md',
          },
          {
            name: 'sync-docs.md',
            type: 'file',
            desc: 'Sincroniza docs vs código',
            docPath: '.claude/commands/lidr-sync-docs.md',
          },
          {
            name: 'validate-prd.md',
            type: 'file',
            desc: 'LIDR SDLC Methodology PRD quality validation with automated scoring and actionable recommendations',
            docPath: '.claude/commands/lidr-validate-prd.md',
          },
          {
            name: 'lidr-help.md',
            type: 'file',
            desc: `Busca en ${ecosystemStats.totalWorkflowArtifacts} artefactos, sugiere ${summaryStrings.workflowsAvailable}`,
            docPath: '.claude/commands/lidr-help.md',
          },
          {
            name: 'lidr-spec-new.md',
            type: 'file',
            desc: 'LIDR Spec Lifecycle — crea change container en docs/projects/{cliente}/changes/',
            docPath: '.agents/commands/lidr-spec-new.md',
          },
          {
            name: 'lidr-spec-ff.md',
            type: 'file',
            desc: 'LIDR Spec Lifecycle — fast-forward: genera proposal+design+spec+tasks (Opus high)',
            docPath: '.agents/commands/lidr-spec-ff.md',
          },
          {
            name: 'lidr-spec-apply.md',
            type: 'file',
            desc: 'LIDR Spec Lifecycle — implementa task-by-task (AGENT MUST EXECUTE tests)',
            docPath: '.agents/commands/lidr-spec-apply.md',
          },
          {
            name: 'lidr-spec-verify.md',
            type: 'file',
            desc: 'LIDR Spec Lifecycle — verificación final + test-report.md (verdict)',
            docPath: '.agents/commands/lidr-spec-verify.md',
          },
          {
            name: 'lidr-spec-archive.md',
            type: 'file',
            desc: 'LIDR Spec Lifecycle — mueve change a changes/archive/YYYY-MM-DD-<name>/',
            docPath: '.agents/commands/lidr-spec-archive.md',
          },
          {
            name: 'lidr-spec-continue.md',
            type: 'file',
            desc: 'LIDR Spec Lifecycle — diagnostica estado y retoma change pausado',
            docPath: '.agents/commands/lidr-spec-continue.md',
          },
          {
            name: 'lidr-spec-bulk-archive.md',
            type: 'file',
            desc: 'LIDR Spec Lifecycle — archiva todos los changes con verdict PASSED',
            docPath: '.agents/commands/lidr-spec-bulk-archive.md',
          },
        ],
      },
      {
        name: 'hooks/',
        type: 'folder',
        iconName: 'Zap',
        badge: { label: 'Nivel 2', color: 'bg-orange-100 text-orange-700' },
        desc: '4 hooks Claude Code — 2 prompt-based (DTC) + 2 command (bash scripts)',
        children: [
          {
            name: 'load-context.sh',
            type: 'file',
            desc: 'SessionStart: carga PROJECT_TYPE, DTC_ACTIVE, stale docs',
            docPath: '.claude/hooks/scripts/load-context.sh',
          },
          {
            name: 'frontmatter-guard.sh',
            type: 'file',
            desc: 'Validates frontmatter in .md files during write operations',
            docPath: '.claude/hooks/scripts/frontmatter-guard.sh',
          },
          {
            name: 'validate-ecosystem-counts.sh',
            type: 'file',
            desc: 'Cross-validates ecosystem counts between different sources',
            docPath: '.claude/hooks/scripts/validate-ecosystem-counts.sh',
          },
          {
            name: 'notify.sh',
            type: 'file',
            desc: 'Desktop notifications for build failures and security alerts',
            docPath: '.claude/hooks/scripts/notify.sh',
          },
        ],
      },
      {
        name: 'agents/',
        type: 'folder',
        iconName: 'Bot',
        badge: { label: '7 agents', color: 'bg-cyan-100 text-cyan-700' },
        desc: '7 subagentes autónomos con memoria persistente (scope: project) — evolucionan de commands maduros. Incluye lidr-spec-orchestrator para el LIDR Spec Lifecycle end-to-end.',
        children: [
          {
            name: 'lidr-spec-orchestrator.md',
            type: 'file',
            desc: 'Orchestrates the full LIDR change lifecycle (new → ff → apply → verify → archive)',
            docPath: '.agents/subagents/lidr-spec-orchestrator.md',
          },
        ],
      },
      {
        name: 'agent-memory/',
        type: 'folder',
        iconName: 'Brain',
        badge: { label: 'Auto-generado', color: 'bg-purple-100 text-purple-700' },
        desc: 'Auto-generado por Claude Code cuando memory: project está en el frontmatter. Las primeras 200 lineas de MEMORY.md se inyectan en el system prompt del agent; si supera 200 lineas, el agent recibe instrucciones de curar/resumir.',
      },
      {
        name: 'settings.json',
        type: 'file',
        iconName: 'Settings',
        badge: { label: 'Config', color: 'bg-slate-100 text-slate-700' },
        desc: 'Modelo, permisos, hooks config',
        docPath: '.claude/settings.json',
      },
    ],
  },
  {
    name: '.mcp.json',
    type: 'file',
    iconName: 'Cable',
    badge: { label: 'MCP Config', color: 'bg-cyan-100 text-cyan-700' },
    desc: 'Conexiones MCP: filesystem (archivos locales), memory (grafo conocimiento), fetch (contenido web)',
  },
  {
    name: 'docs/',
    type: 'folder',
    iconName: 'BookOpen',
    badge: { label: 'Fuente de Verdad', color: 'bg-cyan-100 text-cyan-700' },
    desc: 'Documentos referenciados por rules y hooks via @',
    children: [
      {
        name: 'README.md',
        type: 'file',
        desc: 'Documentation overview and navigation guide',
        docPath: 'docs/README.md',
      },
      {
        name: 'adr/',
        type: 'folder',
        iconName: 'FileCode2',
        desc: 'Architecture Decision Records — decisiones técnicas significativas del ecosistema',
        children: [
          {
            name: 'ADR-0001-context-loading-strategy.md',
            type: 'file',
            desc: 'Context loading strategy for Claude Code',
            docPath: 'docs/adr/ADR-0001-context-loading-strategy.md',
          },
          {
            name: 'ADR-0002-react-flow-interactive-diagrams.md',
            type: 'file',
            desc: 'Interactive diagrams with React Flow library',
            docPath: 'docs/adr/ADR-0002-react-flow-interactive-diagrams.md',
          },
          {
            name: 'ADR-0003-tailwind-css-v4-configuration.md',
            type: 'file',
            desc: 'Tailwind CSS v4 configuration approach',
            docPath: 'docs/adr/ADR-0003-tailwind-css-v4-configuration.md',
          },
          {
            name: 'ADR-0005-multi-client-architecture.md',
            type: 'file',
            desc: 'Multi-client architecture design decisions',
            docPath: 'docs/adr/ADR-0005-multi-client-architecture.md',
          },
          {
            name: 'ADR-0006-test-strategy.md',
            type: 'file',
            desc: 'Testing strategy and framework decisions',
            docPath: 'docs/adr/ADR-0006-test-strategy.md',
          },
        ],
      },
      {
        name: '.agents/_shared/lidr/validators/',
        type: 'folder',
        iconName: 'ShieldCheck',
        desc: 'Master validation scripts para coherencia del ecosistema (9 archivos, ~3,482 LOC)',
      },
      {
        name: 'standards/',
        type: 'folder',
        iconName: 'FileText',
        desc: 'Estándares de organización y tecnología',
        children: [
          {
            name: 'hooks-strategy.md',
            type: 'file',
            desc: 'Hooks implementation strategy and guidelines',
            docPath: 'docs/standards/hooks-strategy.md',
          },
          {
            name: 'org.md',
            type: 'file',
            desc: 'Extended organizational standards',
            docPath: 'docs/standards/org.md',
          },
          {
            name: 'sprint-commitment.md',
            type: 'file',
            desc: 'Sprint commitment templates and standards',
            docPath: 'docs/standards/sprint-commitment.md',
          },
          {
            name: 'tool-integrations.md',
            type: 'file',
            desc: 'Tool integration patterns and CSV workflows',
            docPath: 'docs/standards/tool-integrations.md',
          },
          {
            name: 'testing/',
            type: 'folder',
            iconName: 'FileText',
            desc: 'Testing standards and guidelines',
            children: [
              {
                name: 'README.md',
                type: 'file',
                desc: 'Testing overview and strategy',
                docPath: 'docs/standards/testing/README.md',
              },
              {
                name: 'unit-testing-guide.md',
                type: 'file',
                desc: 'Unit testing guidelines and patterns',
                docPath: 'docs/standards/testing/unit-testing-guide.md',
              },
              {
                name: 'visual-regression-testing.md',
                type: 'file',
                desc: 'Visual regression testing with Playwright',
                docPath: 'docs/standards/testing/visual-regression-testing.md',
              },
            ],
          },
        ],
      },
      {
        name: 'guides/',
        type: 'folder',
        iconName: 'BookOpen',
        badge: { label: 'SDK Guides', color: 'bg-emerald-100 text-emerald-700' },
        desc: 'Guias de desarrollo Claude Code SDK — como crear rules, skills, commands, hooks, agents, MCPs',
        children: [
          {
            name: 'claude-code/',
            type: 'folder',
            iconName: 'FileCode2',
            desc: 'SDK Reference para artefactos del ecosistema',
            children: [
              {
                name: 'README.md',
                type: 'file',
                desc: 'Claude Code SDK overview and getting started',
                docPath: 'docs/guides/claude-code/README.md',
              },
              {
                name: 'agent-development.md',
                type: 'file',
                desc: 'Guide for developing autonomous Claude Code agents',
                docPath: 'docs/guides/claude-code/agent-development.md',
              },
              {
                name: 'command-development.md',
                type: 'file',
                desc: 'Guide for creating Claude Code slash commands',
                docPath: 'docs/guides/claude-code/command-development.md',
              },
              {
                name: 'hook-development.md',
                type: 'file',
                desc: 'Guide for developing Claude Code hooks',
                docPath: 'docs/guides/claude-code/hook-development.md',
              },
              {
                name: 'mcp-integration.md',
                type: 'file',
                desc: 'Model Context Protocol integration guide',
                docPath: 'docs/guides/claude-code/mcp-integration.md',
              },
              {
                name: 'rule-development.md',
                type: 'file',
                desc: 'Guide for creating Claude Code rules',
                docPath: 'docs/guides/claude-code/rule-development.md',
              },
              {
                name: 'skill-development-guide.md',
                type: 'file',
                desc: 'Comprehensive skill development guide',
                docPath: 'docs/guides/claude-code/skill-development-guide.md',
              },
              {
                name: 'skill-template-architecture.md',
                type: 'file',
                desc: 'Template architecture guide',
                docPath: 'docs/guides/claude-code/skill-template-architecture.md',
              },
            ],
          },
        ],
      },
      {
        name: 'hooks/',
        type: 'folder',
        iconName: 'Zap',
        desc: 'Hook documentation and specifications',
        children: [
          {
            name: 'README.md',
            type: 'file',
            desc: 'Hooks overview and implementation guide',
            docPath: 'docs/hooks/README.md',
          },
          {
            name: 'dtc-write-guard.md',
            type: 'file',
            desc: 'DTC write guard hook documentation',
            docPath: 'docs/hooks/dtc-write-guard.md',
          },
          {
            name: 'frontmatter-guard.md',
            type: 'file',
            desc: 'Frontmatter validation hook documentation',
            docPath: 'docs/hooks/frontmatter-guard.md',
          },
          {
            name: 'load-context.md',
            type: 'file',
            desc: 'Context loading hook documentation',
            docPath: 'docs/hooks/load-context.md',
          },
          {
            name: 'notify.md',
            type: 'file',
            desc: 'Desktop notification hook documentation',
            docPath: 'docs/hooks/notify.md',
          },
          {
            name: 'validate-ecosystem-counts.md',
            type: 'file',
            desc: 'Ecosystem validation hook documentation',
            docPath: 'docs/hooks/validate-ecosystem-counts.md',
          },
        ],
      },
      {
        name: 'audit-results/',
        type: 'folder',
        iconName: 'ShieldCheck',
        desc: 'Results and reports from ecosystem audits',
        children: [
          {
            name: 'README.md',
            type: 'file',
            desc: 'Audit results overview and summary',
            docPath: 'docs/audit-results/README.md',
          },
        ],
      },
      {
        name: 'project-guides/',
        type: 'folder',
        iconName: 'BookOpen',
        badge: { label: 'Project Guides', color: 'bg-blue-100 text-blue-700' },
        desc: 'Project setup and user guides',
        children: [
          {
            name: 'client-creation-guide.md',
            type: 'file',
            desc: 'Guide for creating new client configurations',
            docPath: 'docs/guides/client-creation-guide.md',
          },
          {
            name: 'developer-guide.md',
            type: 'file',
            desc: 'Developer setup and contribution guide',
            docPath: 'docs/guides/developer-guide.md',
          },
          {
            name: 'user-setup-guide.md',
            type: 'file',
            desc: 'User setup and installation guide',
            docPath: 'docs/guides/user-setup-guide.md',
          },
          {
            name: 'lidr-core/',
            type: 'folder',
            iconName: 'FileCode2',
            desc: 'LIDR Core methodology guides',
            children: [
              {
                name: 'client-discovery-interview-manual.md',
                type: 'file',
                desc: 'Client discovery interview manual and templates',
                docPath: 'docs/guides/lidr-core/client-discovery-interview-manual.md',
              },
            ],
          },
        ],
      },
      {
        name: 'proposals/',
        type: 'folder',
        iconName: 'FileText',
        desc: 'Propuestas arquitectonicas del ecosistema',
      },
      {
        name: 'reference/',
        type: 'folder',
        iconName: 'BookOpen',
        desc: 'Material de referencia tecnica',
      },
      {
        name: 'settings-reference.md',
        type: 'file',
        desc: 'Claude Code settings.json reference and configuration guide',
        docPath: 'docs/settings-reference.md',
      },
      {
        name: 'tools/',
        type: 'folder',
        iconName: 'Settings',
        desc: 'Herramientas operacionales del ecosistema',
      },
    ],
  },
  {
    name: 'guidelines/',
    type: 'folder',
    iconName: 'BookOpen',
    badge: { label: 'Referencia', color: 'bg-slate-100 text-slate-700' },
    desc: 'Directrices operativas de desarrollo del SDLC',
  },
];

// Stats calculation functions
export function countFiles(nodes: TreeNode[]): {
  files: number;
  folders: number;
  completed: number;
} {
  let files = 0;
  let folders = 0;
  let completed = 0;

  for (const node of nodes) {
    if (node.type === 'file') {
      files++;
      // Check if document is available or is a route
      if ((node.docPath && typeof node.docPath === 'string') || node.linkTo) {
        completed++;
      }
    } else if (node.type === 'folder') {
      folders++;
      if (node.children) {
        const childStats = countFiles(node.children);
        files += childStats.files;
        folders += childStats.folders;
        completed += childStats.completed;
      }
    }
  }
  return { files, folders, completed };
}

// Tree modes and default open folders
export const DEFAULT_OPEN_FOLDERS = new Set(['.claude/', 'skills/', 'docs/', 'guides/']);
export type TreeMode = 'default' | 'expanded' | 'collapsed';

export function getInitialOpen(node: TreeNode, mode: TreeMode): boolean {
  if (mode === 'expanded') {
    return true;
  }
  if (mode === 'collapsed') {
    return false;
  }
  // Default mode: open certain folders
  return DEFAULT_OPEN_FOLDERS.has(node.name);
}

export const stats = countFiles(projectTree);

// Page route data (currently unused but kept for reference)
export const pageRoutes = [
  { path: '/', title: 'Flujo General', description: 'Visión general del SDLC', completed: true },
  {
    path: '/requisitos',
    title: 'Fase de Requisitos',
    description: 'Captura y análisis de requisitos',
    completed: true,
  },
  {
    path: '/prd',
    title: 'Proceso PRD',
    description: 'Product Requirements Document',
    completed: true,
  },
  {
    path: '/requisitos-funcionales',
    title: 'Requisitos Funcionales',
    description: 'Especificación funcional detallada',
    completed: true,
  },
  {
    path: '/sprint',
    title: 'Planificación Sprint',
    description: 'Planning y estimación',
    completed: true,
  },
  {
    path: '/desarrollo',
    title: 'Proceso Desarrollo',
    description: 'Desarrollo y code review',
    completed: true,
  },
  {
    path: '/testing',
    title: 'Testing y QA',
    description: 'Testing y aseguramiento de calidad',
    completed: true,
  },
  {
    path: '/seguridad',
    title: 'Seguridad SDLC',
    description: 'Security testing y compliance',
    completed: true,
  },
  {
    path: '/despliegue',
    title: 'Entornos y Despliegue',
    description: 'Deploy y release management',
    completed: true,
  },
  {
    path: '/portafolio',
    title: 'Gestión Portafolio',
    description: 'Portfolio y métricas',
    completed: true,
  },
  {
    path: '/gobernanza',
    title: 'Gobernanza Workflow',
    description: 'Governance y compliance',
    completed: true,
  },
  {
    path: '/propuesta',
    title: 'Propuesta de Mejora',
    description: 'Análisis y roadmap de mejoras',
    completed: true,
  },
  {
    path: '/handoffs',
    title: 'Handoffs & Templates',
    description: 'Templates y handoffs entre fases',
    completed: true,
  },
  {
    path: '/sitemap',
    title: 'Sitemap',
    description: 'Mapa completo del proyecto',
    completed: true,
  },
  {
    path: '/agents',
    title: 'Arquitectura Agents',
    description: 'Subagentes autónomos',
    completed: true,
  },
  {
    path: '/help',
    title: 'Centro de Ayuda',
    description: 'Búsqueda de artefactos y workflows',
    completed: true,
  },
  {
    path: '/integrity',
    title: 'Tests de Integridad',
    description: 'Validación del ecosistema',
    completed: true,
  },
];
