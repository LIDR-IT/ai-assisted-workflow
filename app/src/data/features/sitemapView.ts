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
    docPath: '.claude/CLAUDE.md',
  },
  {
    name: '.claude-env',
    type: 'file',
    iconName: 'Settings',
    badge: { label: 'Env Config', color: 'bg-slate-100 text-slate-700' },
    desc: 'Variables de entorno de Claude Code: PROJECT_TYPE, DTC_ACTIVE, etc.',
    docPath: '.claude-env',
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
            docPath: '.claude/rules/org.md',
          },
          {
            name: 'tech-stack.md',
            type: 'file',
            desc: 'Convenciones técnicas del stack → @docs/standards/tech-*.md',
            badge: { label: 'Rule', color: getComponentColor('rule') },
            docPath: '.claude/rules/tech-stack.md',
          },
          {
            name: 'project.md',
            type: 'file',
            desc: 'Contexto del framework y stack tecnológico activo',
            badge: { label: 'Rule', color: getComponentColor('rule') },
            docPath: '.claude/rules/project.md',
          },
          {
            name: 'documentation.md',
            type: 'file',
            desc: 'Governance: frontmatter, versionado, staleness, naming',
            badge: { label: 'Rule', color: 'bg-indigo-100 text-indigo-700' },
            docPath: '.claude/rules/documentation.md',
          },
          {
            name: 'workflows.md',
            type: 'file',
            desc: 'Mapa de workflows: roles → commands → encadenamiento',
            badge: { label: 'Rule', color: 'bg-indigo-100 text-indigo-700' },
            docPath: '.claude/rules/workflows.md',
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
            badge: { label: '2 skills', color: 'bg-slate-100 text-slate-700' },
            children: [
              {
                name: 'project-classifier/',
                type: 'folder',
                iconName: 'FolderOpen',
                desc: '🤖 Auto-detecta tipo de proyecto y tech stack en <30s (LIDR SDLC-inspired)',
                children: [
                  {
                    name: 'SKILL.md',
                    type: 'file',
                    desc: 'Definición y lógica del skill',
                    docPath: '.claude/skills/project-classifier/SKILL.md',
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
                name: 'document-discovery/ + 45 more...',
                type: 'file',
                desc: `Todos los ${ecosystemStats.skills} skills siguen la estructura self-contained mostrada arriba`,
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
                name: 'business-case/SKILL.md',
                type: 'file',
                desc: 'Genera borrador de Business Case',
                docPath: '.claude/skills/business-case/SKILL.md',
              },
              {
                name: 'kickoff/SKILL.md',
                type: 'file',
                desc: 'Genera acta de kick-off pre-llenada',
                docPath: '.claude/skills/kickoff/SKILL.md',
              },
              {
                name: 'stakeholder-map/SKILL.md',
                type: 'file',
                desc: 'Sugiere mapa de interesados',
                docPath: '.claude/skills/stakeholder-map/SKILL.md',
              },
              {
                name: 'tracking-integration/SKILL.md',
                type: 'file',
                desc: 'Pre-llena épica Jira desde BC',
                docPath: '.claude/skills/tracking-integration/SKILL.md',
              },
            ],
          },
          {
            name: 'Fase 2 — Discovery',
            type: 'folder',
            iconName: 'FolderOpen',
            badge: { label: '7 skills', color: getPhaseColorClass(2) },
            children: [
              {
                name: 'prd-tecnico/SKILL.md',
                type: 'file',
                desc: 'Genera PRD Técnico',
                docPath: '.claude/skills/prd-tecnico/SKILL.md',
              },
              {
                name: 'prd-funcional/SKILL.md',
                type: 'file',
                desc: 'Genera PRD Funcional',
                docPath: '.claude/skills/prd-funcional/SKILL.md',
              },
              {
                name: 'review-cruzado/SKILL.md',
                type: 'file',
                desc: 'Compara PRD-T vs PRD-F',
                docPath: '.claude/skills/review-cruzado/SKILL.md',
              },
              {
                name: 'risk-log/SKILL.md',
                type: 'file',
                desc: 'Sugiere riesgos por tipo de proyecto',
                docPath: '.claude/skills/risk-log/SKILL.md',
              },
              {
                name: 'poc-report/SKILL.md',
                type: 'file',
                desc: 'Estructura reporte de PoC',
                docPath: '.claude/skills/poc-report/SKILL.md',
              },
              {
                name: 'domain-research/SKILL.md',
                type: 'file',
                desc: 'LIDR SDLC systematic domain research y competitive analysis',
                docPath: '.claude/skills/domain-research/SKILL.md',
              },
              {
                name: 'technical-research/SKILL.md',
                type: 'file',
                desc: 'LIDR SDLC technical feasibility investigation y architecture evaluation',
                docPath: '.claude/skills/technical-research/SKILL.md',
              },
            ],
          },
          {
            name: 'Fase 3 — Especificación',
            type: 'folder',
            iconName: 'FolderOpen',
            badge: { label: '5 skills', color: getPhaseColorClass(3) },
            children: [
              {
                name: 'generate-rf/SKILL.md',
                type: 'file',
                desc: 'Genera RFs completos con BDD desde PRD',
                docPath: '.claude/skills/generate-rf/SKILL.md',
              },
              {
                name: 'generate-nfr/SKILL.md',
                type: 'file',
                desc: 'Genera NFRs standalone medibles desde PRD-T §5',
                docPath: '.claude/skills/generate-nfr/SKILL.md',
              },
              {
                name: 'validate-requirements/SKILL.md',
                type: 'file',
                desc: '🤖 AUTOMATED: 5-pass validation (6h → 5min). Valida RFs + NFRs, genera RTM, detecta gaps',
                docPath: '.claude/skills/validate-requirements/SKILL.md',
              },
              {
                name: 'epic-breakdown/SKILL.md',
                type: 'file',
                desc: 'Descompone epica master en sub-epicas desde requisitos',
                docPath: '.claude/skills/epic-breakdown/SKILL.md',
              },
              {
                name: 'bdd-patterns/SKILL.md',
                type: 'file',
                desc: 'LIDR SDLC BDD patterns library y criteria standards',
                docPath: '.claude/skills/bdd-patterns/SKILL.md',
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
                name: 'user-stories/SKILL.md',
                type: 'file',
                desc: '🤖 AUTOMATED: US con BDD desde RFs (3h → 15min). Genera User Stories bien formateadas con criterios de aceptación BDD',
                docPath: '.claude/skills/user-stories/SKILL.md',
              },
              {
                name: 'sprint-capacity/SKILL.md',
                type: 'file',
                desc: 'Calcula capacidad, velocity y commitment',
                docPath: '.claude/skills/sprint-capacity/SKILL.md',
              },
              {
                name: 'refinement-notes/SKILL.md',
                type: 'file',
                desc: 'Genera notas de refinement estructuradas',
                docPath: '.claude/skills/refinement-notes/SKILL.md',
              },
            ],
          },
          {
            name: 'Fase 5 — Desarrollo',
            type: 'folder',
            iconName: 'FolderOpen',
            badge: { label: '4 skills', color: getPhaseColorClass(5) },
            children: [
              {
                name: 'pr-description/SKILL.md',
                type: 'file',
                desc: 'Genera PR description desde commits',
                docPath: '.claude/skills/pr-description/SKILL.md',
              },
              {
                name: 'adr/SKILL.md',
                type: 'file',
                desc: 'Crea Architecture Decision Record',
                docPath: '.claude/skills/adr/SKILL.md',
              },
              {
                name: 'tech-debt/SKILL.md',
                type: 'file',
                desc: '🤖 AUTOMATED: Detecta y cataloga deuda técnica (6h → 5min)',
                docPath: '.claude/skills/tech-debt/SKILL.md',
              },
              {
                name: 'dev-handoff-qa/SKILL.md',
                type: 'file',
                desc: 'Genera handoff dev→QA completo',
                docPath: '.claude/skills/dev-handoff-qa/SKILL.md',
              },
            ],
          },
          {
            name: 'Fase 6 — QA',
            type: 'folder',
            iconName: 'FolderOpen',
            badge: { label: '5 skills', color: getPhaseColorClass(6) },
            children: [
              {
                name: 'test-plan/SKILL.md',
                type: 'file',
                desc: '🤖 AUTOMATED: Test plan desde RFs (3h → 5min)',
                docPath: '.claude/skills/test-plan/SKILL.md',
              },
              {
                name: 'create-test-cases/SKILL.md',
                type: 'file',
                desc: 'Genera test cases BDD desde RFs',
                docPath: '.claude/skills/create-test-cases/SKILL.md',
              },
              {
                name: 'bug-report/SKILL.md',
                type: 'file',
                desc: 'Estructura bug reports detallados',
                docPath: '.claude/skills/bug-report/SKILL.md',
              },
              {
                name: 'test-execution-report/SKILL.md',
                type: 'file',
                desc: 'Reporta ejecución de testing',
                docPath: '.claude/skills/test-execution-report/SKILL.md',
              },
              {
                name: 'regression-suite/SKILL.md',
                type: 'file',
                desc: '🤖 AUTOMATED: Selecciona tests de regresión (8h → 30min)',
                docPath: '.claude/skills/regression-suite/SKILL.md',
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
                name: 'vuln-assessment/SKILL.md',
                type: 'file',
                desc: 'Interpreta reportes SAST/SCA',
                docPath: '.claude/skills/vuln-assessment/SKILL.md',
              },
              {
                name: 'dast-interpretation/SKILL.md',
                type: 'file',
                desc: 'Interpreta reportes DAST/IAST',
                docPath: '.claude/skills/dast-interpretation/SKILL.md',
              },
              {
                name: 'pentest-report/SKILL.md',
                type: 'file',
                desc: 'Estructura reporte de pentesting',
                docPath: '.claude/skills/pentest-report/SKILL.md',
              },
              {
                name: 'security-checklist/SKILL.md',
                type: 'file',
                desc: '🤖 AUTOMATED: Security compliance (4h → 5min)',
                docPath: '.claude/skills/security-checklist/SKILL.md',
              },
            ],
          },
          {
            name: 'Fase 8 — Despliegue',
            type: 'folder',
            iconName: 'FolderOpen',
            badge: { label: '5 skills', color: getPhaseColorClass(8) },
            children: [
              {
                name: 'change-request/SKILL.md',
                type: 'file',
                desc: 'Genera Change Request formal',
                docPath: '.claude/skills/change-request/SKILL.md',
              },
              {
                name: 'rollback-plan/SKILL.md',
                type: 'file',
                desc: '🤖 AUTOMATED: Plan de rollback (4h → 5min)',
                docPath: '.claude/skills/rollback-plan/SKILL.md',
              },
              {
                name: 'release-notes/SKILL.md',
                type: 'file',
                desc: '🤖 AUTOMATED: Release notes desde PRs (2h → 5min)',
                docPath: '.claude/skills/release-notes/SKILL.md',
              },
              {
                name: 'retrospective/SKILL.md',
                type: 'file',
                desc: 'Facilita retrospectiva data-driven',
                docPath: '.claude/skills/retrospective/SKILL.md',
              },
              {
                name: 'postmortem/SKILL.md',
                type: 'file',
                desc: 'Conduce postmortem blameless',
                docPath: '.claude/skills/postmortem/SKILL.md',
              },
            ],
          },
          {
            name: 'Cross-cutting — Documentación',
            type: 'folder',
            iconName: 'FolderOpen',
            badge: { label: '12 skills', color: 'bg-indigo-100 text-indigo-700' },
            children: [
              {
                name: 'generate-rule/SKILL.md',
                type: 'file',
                desc: 'Crea nueva rule del ecosistema',
                docPath: '.claude/skills/generate-rule/SKILL.md',
              },
              {
                name: 'architecture-doc/SKILL.md',
                type: 'file',
                desc: 'Genera doc de arquitectura (Arc42/C4)',
                docPath: '.claude/skills/architecture-doc/SKILL.md',
              },
              {
                name: 'ux-design-spec/SKILL.md',
                type: 'file',
                desc: 'Especifica UX/UI desde PRD',
                docPath: '.claude/skills/ux-design-spec/SKILL.md',
              },
              {
                name: 'implementation-phases/SKILL.md',
                type: 'file',
                desc: 'Descompone proyecto en fases',
                docPath: '.claude/skills/implementation-phases/SKILL.md',
              },
              {
                name: 'epic-review/SKILL.md',
                type: 'file',
                desc: 'Review formal: plan vs actual',
                docPath: '.claude/skills/epic-review/SKILL.md',
              },
              {
                name: 'audit-standards/SKILL.md',
                type: 'file',
                desc: 'LIDR SDLC audit compliance standards y validation frameworks',
                docPath: '.claude/skills/audit-standards/SKILL.md',
              },
              {
                name: 'sdlc-tracking/SKILL.md',
                type: 'file',
                desc: 'LIDR SDLC workflow tracking y portfolio management',
                docPath: '.claude/skills/sdlc-tracking/SKILL.md',
              },
              {
                name: 'external-sync/SKILL.md',
                type: 'file',
                desc: 'LIDR SDLC external stakeholder synchronization',
                docPath: '.claude/skills/external-sync/SKILL.md',
              },
              {
                name: 'automated-handoffs/SKILL.md',
                type: 'file',
                desc: 'LIDR SDLC automated workflow handoffs y phase transitions',
                docPath: '.claude/skills/automated-handoffs/SKILL.md',
              },
              {
                name: 'brainstorming/SKILL.md',
                type: 'file',
                desc: 'LIDR SDLC structured brainstorming techniques',
                docPath: '.claude/skills/brainstorming/SKILL.md',
              },
              {
                name: 'business-case/SKILL.md',
                type: 'file',
                desc: 'LIDR SDLC comprehensive business case framework',
                docPath: '.claude/skills/business-case/SKILL.md',
              },
              {
                name: 'playwright-cli/SKILL.md',
                type: 'file',
                desc: 'LIDR SDLC E2E testing automation con Playwright',
                docPath: '.claude/skills/playwright-cli/SKILL.md',
              },
            ],
          },
          {
            name: 'Development — Ecosystem',
            type: 'folder',
            iconName: 'FolderOpen',
            badge: { label: '6 skills', color: 'bg-cyan-100 text-cyan-700' },
            children: [
              {
                name: 'skill-creator/SKILL.md',
                type: 'file',
                desc: 'Meta-skill: crea nuevos skills',
                docPath: '.claude/skills/skill-creator/SKILL.md',
              },
              {
                name: 'skill-development/SKILL.md',
                type: 'file',
                desc: 'LIDR SDLC skill development methodology',
                docPath: '.claude/skills/skill-development/SKILL.md',
              },
              {
                name: 'command-development/SKILL.md',
                type: 'file',
                desc: 'LIDR SDLC command development y orchestration patterns',
                docPath: '.claude/skills/command-development/SKILL.md',
              },
              {
                name: 'hook-development/SKILL.md',
                type: 'file',
                desc: 'LIDR SDLC hook development y automation frameworks',
                docPath: '.claude/skills/hook-development/SKILL.md',
              },
              {
                name: 'agent-development/SKILL.md',
                type: 'file',
                desc: 'LIDR SDLC autonomous agent development',
                docPath: '.claude/skills/agent-development/SKILL.md',
              },
              {
                name: 'mcp-integration/SKILL.md',
                type: 'file',
                desc: 'LIDR SDLC MCP integration y external system connectivity',
                docPath: '.claude/skills/mcp-integration/SKILL.md',
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
        desc: 'Workflows orquestadores — 10 Tier 1 + 12 Tier 2 + 1 Utility',
        children: [
          {
            name: 'check-readiness.md',
            type: 'file',
            desc: 'Pre-implementation validation: PRD, team, dependencies, readiness score',
            docPath: '.claude/commands/check-readiness.md',
          },
          {
            name: 'validate-prd.md',
            type: 'file',
            desc: 'LIDR SDLC Methodology PRD quality validation with automated scoring and actionable recommendations',
            docPath: '.claude/commands/validate-prd.md',
          },
          {
            name: 'course-correct.md',
            type: 'file',
            desc: 'Mid-project course correction for managing deviations and realigning projects',
            docPath: '.claude/commands/course-correct.md',
          },
          {
            name: 'document-project.md',
            type: 'file',
            desc: 'Workflow LIDR SDLC completo de documentación',
            docPath: '.claude/commands/document-project.md',
          },
          {
            name: 'product-brief.md',
            type: 'file',
            desc: 'Producto brief ligero LIDR SDLC Methodology para definición rápida de productos',
            docPath: '.claude/commands/product-brief.md',
          },
          {
            name: 'quick-dev.md',
            type: 'file',
            desc: 'Quick development workflow for small features and fixes',
            docPath: '.claude/commands/quick-dev.md',
          },
          {
            name: 'quick-spec.md',
            type: 'file',
            desc: 'Especificación ligera para features pequeñas (≤40h)',
            docPath: '.claude/commands/quick-spec.md',
          },
          {
            name: 'sprint-health.md',
            type: 'file',
            desc: 'Monitoreo activo de salud del sprint con detección de riesgos según LIDR SDLC',
            docPath: '.claude/commands/sprint-health.md',
          },
          {
            name: 'sync-docs.md',
            type: 'file',
            desc: 'Sincroniza docs vs código',
            docPath: '.claude/commands/sync-docs.md',
          },
          {
            name: 'validate-prd.md',
            type: 'file',
            desc: 'LIDR SDLC Methodology PRD quality validation with automated scoring and actionable recommendations',
            docPath: '.claude/commands/validate-prd.md',
          },
          {
            name: 'lidr-help.md',
            type: 'file',
            desc: `Busca en ${ecosystemStats.totalWorkflowArtifacts} artefactos, sugiere ${summaryStrings.workflowsAvailable}`,
            docPath: '.claude/commands/lidr-help.md',
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
            docPath: '.claude/hooks/load-context.sh',
          },
          {
            name: 'frontmatter-guard.sh',
            type: 'file',
            desc: 'Validates frontmatter in .md files during write operations',
            docPath: '.claude/hooks/frontmatter-guard.sh',
          },
          {
            name: 'validate-ecosystem-counts.sh',
            type: 'file',
            desc: 'Cross-validates ecosystem counts between different sources',
            docPath: '.claude/hooks/validate-ecosystem-counts.sh',
          },
          {
            name: 'notify.sh',
            type: 'file',
            desc: 'Desktop notifications for build failures and security alerts',
            docPath: '.claude/hooks/notify.sh',
          },
        ],
      },
      {
        name: 'agents/',
        type: 'folder',
        iconName: 'Bot',
        badge: { label: '6 agents', color: 'bg-cyan-100 text-cyan-700' },
        desc: '6 subagentes autónomos con memoria persistente (scope: project) — evolucionan de commands maduros',
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
        name: '.claude/_shared/validators/',
        type: 'folder',
        iconName: 'ShieldCheck',
        desc: 'Master validation scripts para coherencia del ecosistema (12 shared)',
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
