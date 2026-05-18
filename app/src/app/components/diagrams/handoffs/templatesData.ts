/**
 * Templates Data
 *
 * This file will contain the createPhases function and related template data.
 * For now, we'll re-export the function from the original file to maintain functionality
 * while we progressively refactor the component structure.
 *
 * TODO: Extract the full createPhases function data in a future refactoring iteration.
 */

import type { PhaseTemplates } from './handoffTypes';

// Cross-cutting AI templates data
export const aiCrossCuttingTemplates = [
  {
    code: 'T-IA-CORE-001',
    name: 'CLAUDE.md Orquestador Central',
    desc: 'Índice viviente del ecosistema con todos los artefactos operacionales. Punto de entrada para toda la IA del equipo.',
    format: 'Raíz proyecto',
    owner: 'Tech Lead',
    role: 'Todos',
    level: 'Orquestador',
  },
  {
    code: 'T-IA-CORE-002',
    name: 'Rules: Organización',
    desc: 'Estándares de la empresa: coding standards, políticas de seguridad, convenciones de naming, procesos obligatorios.',
    format: '.claude/rules/',
    owner: 'CTO / Leads',
    role: 'Todos',
    level: 'Nivel 1',
  },
  {
    code: 'T-IA-CORE-003',
    name: 'Rules: Tecnología',
    desc: 'Convenciones específicas del stack: React patterns, Node.js best practices, testing conventions.',
    format: '.claude/rules/',
    owner: 'Tech Lead',
    role: 'Desarrolladores',
    level: 'Nivel 1',
  },
];

/**
 * Creates phase templates data
 * TODO: This is a placeholder - the actual implementation should be extracted
 * from the original HandoffsTemplates.tsx file in a future refactoring.
 */
export const createPhases = (): PhaseTemplates[] => {
  // For now, we'll need to import this from the original file
  // This is a temporary solution while we refactor
  throw new Error('createPhases function needs to be extracted from HandoffsTemplates.tsx');
};
