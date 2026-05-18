/**
 * @file Overview Stats Fixtures
 * @description Mock data for MetricsDashboard overview section
 */

import type { MetricData, MetricsOverview, DORAMetric, FixtureFactory } from '../types';

// Base overview metrics that can be computed from ecosystem
export const baseOverviewMetrics: MetricsOverview = {
  totalSkills: 57,
  automatedSkills: 9,
  totalCommands: 23,
  roiHours: 775,
  validationScripts: 55,
  workflows: 17,
};

// DORA radar chart data
export const doraRadarData: DORAMetric[] = [
  {
    metric: 'Lead Time',
    current: 45,
    elite: 90,
    description: 'Time from commit to production',
  },
  {
    metric: 'Deploy Frequency',
    current: 60,
    elite: 95,
    description: 'How often we deploy to production',
  },
  {
    metric: 'MTTR',
    current: 70,
    elite: 85,
    description: 'Mean time to recovery from incidents',
  },
  {
    metric: 'Change Failure Rate',
    current: 85,
    elite: 90,
    description: 'Percentage of changes that succeed',
  },
];

// Factory function for creating overview stats
export const createOverviewStats: FixtureFactory<MetricsOverview> = (overrides = {}) => ({
  ...baseOverviewMetrics,
  ...overrides,
});

// Factory for individual metric cards
export const createMetricCard: FixtureFactory<MetricData> = (overrides = {}) => ({
  label: 'Sample Metric',
  value: 100,
  change: 5,
  trend: 'up' as const,
  icon: 'TrendingUp',
  unit: '',
  ...overrides,
});

// Pre-built metric collections for different clients
export const facephiMetrics: MetricData[] = [
  createMetricCard({
    label: 'Skills Estandarizados',
    value: 57,
    change: 12,
    trend: 'up',
    icon: 'BookOpen',
  }),
  createMetricCard({
    label: 'Automatización IA',
    value: 9,
    change: 2,
    trend: 'up',
    icon: 'Bot',
  }),
  createMetricCard({
    label: 'Commands Tier-1',
    value: 23,
    change: 3,
    trend: 'up',
    icon: 'Terminal',
  }),
  createMetricCard({
    label: 'ROI Anual (horas)',
    value: 775,
    change: 150,
    trend: 'up',
    icon: 'Clock',
    unit: 'h',
  }),
  createMetricCard({
    label: 'Scripts Validación',
    value: 55,
    change: 8,
    trend: 'up',
    icon: 'CheckCircle',
  }),
  createMetricCard({
    label: 'Workflows SDLC',
    value: 17,
    change: 1,
    trend: 'stable',
    icon: 'GitBranch',
  }),
];

export const doclineMetrics: MetricData[] = [
  createMetricCard({
    label: 'Procesos Documentados',
    value: 42,
    change: 8,
    trend: 'up',
    icon: 'FileText',
  }),
  createMetricCard({
    label: 'Mejoras Implementadas',
    value: 15,
    change: 3,
    trend: 'up',
    icon: 'TrendingUp',
  }),
  createMetricCard({
    label: 'Tiempo Ahorro (sem)',
    value: 24,
    change: 6,
    trend: 'up',
    icon: 'Clock',
    unit: 'h/sem',
  }),
  createMetricCard({
    label: 'Adopción Equipo',
    value: 87,
    change: 15,
    trend: 'up',
    icon: 'Users',
    unit: '%',
  }),
];

// Environment-aware loading
export const getOverviewMetricsForClient = (clientName?: string): MetricData[] => {
  if (!clientName) {
    return []; // No default - client must be specified explicitly
  }

  switch (clientName.toLowerCase()) {
    case 'docline':
      return doclineMetrics;
    case 'facephi':
      return facephiMetrics;
    default:
      return []; // No fallback - return empty for unknown clients
  }
};
