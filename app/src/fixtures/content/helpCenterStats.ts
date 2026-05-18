/**
 * @file Help Center Stats Fixtures
 * @description Centralized artifact statistics for HelpCenter initial state
 */

import type { ArtifactStats, FixtureFactory } from '../types';
import { ecosystemStats } from '@/data/computed/stats';

// Base artifact statistics extracted from the ecosystem
export const baseArtifactStats: ArtifactStats = {
  skills: ecosystemStats.skills, // 61
  commands: ecosystemStats.commands, // 23
  validationScripts: ecosystemStats.validationScripts, // 55
  workflows: ecosystemStats.workflows, // 17
  total: ecosystemStats.totalArtifacts, // 195+ artifacts
};

// HelpCenter statistic cards data
export interface StatCard {
  value: number;
  label: string;
  color: string;
  description?: string;
}

// Factory for creating stat cards
export const createStatCard: FixtureFactory<StatCard> = (overrides = {}) => ({
  value: 0,
  label: 'Default',
  color: 'text-gray-600',
  ...overrides,
});

// Pre-configured stat cards for HelpCenter
export const helpCenterStatCards: StatCard[] = [
  createStatCard({
    value: baseArtifactStats.skills,
    label: 'Skills',
    color: 'text-blue-600',
    description: 'Workflows automatizados por fase SDLC',
  }),
  createStatCard({
    value: baseArtifactStats.commands,
    label: 'Commands',
    color: 'text-green-600',
    description: 'Comandos de orquestación y tácticos',
  }),
  createStatCard({
    value: baseArtifactStats.validationScripts,
    label: 'Validation Scripts',
    color: 'text-purple-600',
    description: 'Scripts de validación y quality gates',
  }),
  createStatCard({
    value: baseArtifactStats.workflows,
    label: 'Workflows',
    color: 'text-orange-600',
    description: 'Flujos de trabajo documentados',
  }),
];

// Search suggestions for HelpCenter
export const popularSearchTerms = [
  'business case',
  'testing',
  'security',
  'prd',
  'requirements',
  'architecture',
  'deployment',
  'validation',
  'qa',
  'development',
];

// Factory function for creating artifact stats
export const createArtifactStats: FixtureFactory<ArtifactStats> = (overrides = {}) => ({
  ...baseArtifactStats,
  ...overrides,
});

// Client-specific stat variations
export const getFacephiStats = (): StatCard[] => [
  ...helpCenterStatCards,
  createStatCard({
    value: 9,
    label: 'Automated Skills',
    color: 'text-indigo-600',
    description: 'Skills con automatización completa',
  }),
];

export const getDoclineStats = (): StatCard[] => [
  createStatCard({
    value: 42,
    label: 'Procesos',
    color: 'text-blue-600',
    description: 'Procesos documentados y estandarizados',
  }),
  createStatCard({
    value: 15,
    label: 'Mejoras',
    color: 'text-green-600',
    description: 'Mejoras implementadas en flujos',
  }),
  createStatCard({
    value: 24,
    label: 'Hrs Ahorradas',
    color: 'text-purple-600',
    description: 'Horas ahorradas por semana',
  }),
  createStatCard({
    value: 87,
    label: 'Adopción %',
    color: 'text-orange-600',
    description: 'Porcentaje de adopción del equipo',
  }),
];

// Environment-aware loading
export const getStatsForClient = (clientName: string = 'facephi'): StatCard[] => {
  switch (clientName.toLowerCase()) {
    case 'docline':
      return getDoclineStats();
    case 'facephi':
    default:
      return getFacephiStats();
  }
};
