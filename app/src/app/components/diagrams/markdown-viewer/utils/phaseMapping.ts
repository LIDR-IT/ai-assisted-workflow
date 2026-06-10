/**
 * Phase Mapping Utility - Maps file paths to SDLC phases
 *
 * Determines the appropriate SDLC phase and styling for different skill/document types.
 */

import type { PhaseInfo } from '../types';

const phaseMap: Record<string, PhaseInfo> = {
  // Phase 1 - Originación
  'business-case': {
    label: 'Fase 1 — Analysis',
    color: 'bg-purple-100 text-purple-700',
  },
  kickoff: {
    label: 'Fase 1 — Analysis',
    color: 'bg-purple-100 text-purple-700',
  },
  'stakeholder-map': {
    label: 'Fase 1 — Analysis',
    color: 'bg-purple-100 text-purple-700',
  },
  'tracking-integration': {
    label: 'Fase 1 — Analysis',
    color: 'bg-purple-100 text-purple-700',
  },

  // Phase 2 - Discovery
  'review-cruzado': {
    label: 'Fase 2 — Planning',
    color: 'bg-blue-100 text-blue-700',
  },
  'risk-log': {
    label: 'Fase 2 — Planning',
    color: 'bg-blue-100 text-blue-700',
  },
  'poc-report': {
    label: 'Fase 2 — Planning',
    color: 'bg-blue-100 text-blue-700',
  },

  // Phase 3 - Especificación
  'generate-rf': {
    label: 'Fase 3 — Solutioning (specification)',
    color: 'bg-cyan-100 text-cyan-700',
  },
  'generate-nfr': {
    label: 'Fase 3 — Solutioning (specification)',
    color: 'bg-cyan-100 text-cyan-700',
  },
  'validate-requirements': {
    label: 'Fase 3 — Solutioning (specification)',
    color: 'bg-cyan-100 text-cyan-700',
  },
  'epic-breakdown': {
    label: 'Fase 3 — Solutioning (specification)',
    color: 'bg-cyan-100 text-cyan-700',
  },

  // Phase 4 - Sprint Planning
  'user-stories': {
    label: 'Fase 3 — Solutioning (sprint planning)',
    color: 'bg-violet-100 text-violet-700',
  },
  'sprint-capacity': {
    label: 'Fase 3 — Solutioning (sprint planning)',
    color: 'bg-violet-100 text-violet-700',
  },
  'refinement-notes': {
    label: 'Fase 3 — Solutioning (sprint planning)',
    color: 'bg-violet-100 text-violet-700',
  },

  // Phase 5 - Desarrollo
  'pr-description': {
    label: 'Fase 4 — Implementation (development)',
    color: 'bg-green-100 text-green-700',
  },
  adr: {
    label: 'Fase 4 — Implementation (development)',
    color: 'bg-green-100 text-green-700',
  },
  'tech-debt': {
    label: 'Fase 4 — Implementation (development)',
    color: 'bg-green-100 text-green-700',
  },
  'dev-handoff-qa': {
    label: 'Fase 4 — Implementation (development)',
    color: 'bg-green-100 text-green-700',
  },

  // Phase 6 - QA & Testing
  'test-plan': {
    label: 'Fase 4 — Implementation (qa)',
    color: 'bg-yellow-100 text-yellow-700',
  },
  'create-test-cases': {
    label: 'Fase 4 — Implementation (qa)',
    color: 'bg-yellow-100 text-yellow-700',
  },
  'bug-report': {
    label: 'Fase 4 — Implementation (qa)',
    color: 'bg-yellow-100 text-yellow-700',
  },
  'test-execution-report': {
    label: 'Fase 4 — Implementation (qa)',
    color: 'bg-yellow-100 text-yellow-700',
  },
  'regression-suite': {
    label: 'Fase 4 — Implementation (qa)',
    color: 'bg-yellow-100 text-yellow-700',
  },

  // Phase 7 - Seguridad
  'vuln-assessment': {
    label: 'Fase 4 — Implementation (security)',
    color: 'bg-orange-100 text-orange-700',
  },
  'dast-interpretation': {
    label: 'Fase 4 — Implementation (security)',
    color: 'bg-orange-100 text-orange-700',
  },
  'pentest-report': {
    label: 'Fase 4 — Implementation (security)',
    color: 'bg-orange-100 text-orange-700',
  },
  'security-checklist': {
    label: 'Fase 4 — Implementation (security)',
    color: 'bg-orange-100 text-orange-700',
  },

  // Phase 8 - Despliegue
  'change-request': {
    label: 'Fase 4 — Implementation (release)',
    color: 'bg-red-100 text-red-700',
  },
  'rollback-plan': {
    label: 'Fase 4 — Implementation (release)',
    color: 'bg-red-100 text-red-700',
  },
  'release-notes': {
    label: 'Fase 4 — Implementation (release)',
    color: 'bg-red-100 text-red-700',
  },
  retrospective: {
    label: 'Fase 4 — Implementation (release)',
    color: 'bg-red-100 text-red-700',
  },
  postmortem: {
    label: 'Fase 4 — Implementation (release)',
    color: 'bg-red-100 text-red-700',
  },

  // Cross-cutting
  'generate-rule': {
    label: 'Cross-cutting',
    color: 'bg-slate-100 text-slate-700',
  },
  'architecture-doc': {
    label: 'Cross-cutting',
    color: 'bg-slate-100 text-slate-700',
  },
  'implementation-phases': {
    label: 'Cross-cutting',
    color: 'bg-slate-100 text-slate-700',
  },
  'audit-standards': {
    label: 'Cross-cutting',
    color: 'bg-slate-100 text-slate-700',
  },

  // Development & Tools
  'skill-creator': {
    label: 'Development',
    color: 'bg-indigo-100 text-indigo-700',
  },
  'skill-development': {
    label: 'Development',
    color: 'bg-indigo-100 text-indigo-700',
  },
  'command-development': {
    label: 'Development',
    color: 'bg-indigo-100 text-indigo-700',
  },
  'hook-development': {
    label: 'Development',
    color: 'bg-indigo-100 text-indigo-700',
  },
  'agent-development': {
    label: 'Development',
    color: 'bg-indigo-100 text-indigo-700',
  },
  'mcp-integration': {
    label: 'Development',
    color: 'bg-indigo-100 text-indigo-700',
  },
};

export function getPhaseFromPath(path: string): PhaseInfo | null {
  // Extract skill name from path
  const skillMatch = path.match(/skills\/([^/]+)/);
  const ruleMatch = path.match(/rules\/([^/]+)/);
  const commandMatch = path.match(/commands\/([^/]+)/);

  if (skillMatch && skillMatch[1]) {
    return phaseMap[skillMatch[1]] || null;
  }

  if (ruleMatch && ruleMatch[1]) {
    return {
      label: 'Rules',
      color: 'bg-emerald-100 text-emerald-700',
    };
  }

  if (commandMatch && commandMatch[1]) {
    return {
      label: 'Commands',
      color: 'bg-sky-100 text-sky-700',
    };
  }

  return null;
}

export function getAllPhases(): PhaseInfo[] {
  return [
    { label: 'Fase 1 — Analysis', color: 'bg-purple-100 text-purple-700' },
    { label: 'Fase 2 — Planning', color: 'bg-blue-100 text-blue-700' },
    { label: 'Fase 3 — Solutioning (specification)', color: 'bg-cyan-100 text-cyan-700' },
    { label: 'Fase 3 — Solutioning (sprint planning)', color: 'bg-violet-100 text-violet-700' },
    { label: 'Fase 4 — Implementation (development)', color: 'bg-green-100 text-green-700' },
    { label: 'Fase 4 — Implementation (qa)', color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Fase 4 — Implementation (security)', color: 'bg-orange-100 text-orange-700' },
    { label: 'Fase 4 — Implementation (release)', color: 'bg-red-100 text-red-700' },
  ];
}
