/**
 * @file Metrics Data - Extracted from legacy MetricsDashboard.tsx
 * @description Centralized metrics data supporting multi-client configurations (FacePhi/Docline)
 */

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface MetricCardData {
  title: string;
  value: string;
  target: string;
  trend: 'up' | 'down' | 'stable';
  trendGood: boolean;
  delta: string;
  iconType: 'trending-up' | 'activity' | 'bug' | 'rocket' | 'timer' | 'gauge';
  source: string;
}

export interface SprintMetrics {
  sprint: string;
  planned: number;
  completed: number;
  avgLine: number;
}

export interface CarryoverMetrics {
  sprint: string;
  carryover: number;
  target: number;
}

export interface BugEscapeMetrics {
  sprint: string;
  found_qa: number;
  escaped_prod: number;
  rate: number;
}

export interface DoraMetrics {
  month: string;
  deploys?: number;
  days?: number;
  rate?: number;
  hours?: number;
}

export interface DoraRadarData {
  metric: string;
  current: number;
  elite: number;
}

export interface DoraLevel {
  metric: string;
  elite: string;
  high: string;
  medium: string;
  low: string;
  current: string;
  currentLevel: 'elite' | 'high' | 'medium' | 'low';
}

// =============================================================================
// MOCK DATA - SPRINT METRICS
// =============================================================================

export const velocityData: SprintMetrics[] = [
  { sprint: 'S1', planned: 34, completed: 28, avgLine: 31 },
  { sprint: 'S2', planned: 32, completed: 30, avgLine: 31 },
  { sprint: 'S3', planned: 35, completed: 33, avgLine: 31 },
  { sprint: 'S4', planned: 33, completed: 31, avgLine: 31 },
  { sprint: 'S5', planned: 36, completed: 34, avgLine: 31 },
  { sprint: 'S6', planned: 34, completed: 32, avgLine: 31 },
  { sprint: 'S7', planned: 35, completed: 35, avgLine: 31 },
  { sprint: 'S8', planned: 36, completed: 34, avgLine: 31 },
];

export const carryoverData: CarryoverMetrics[] = [
  { sprint: 'S1', carryover: 18, target: 10 },
  { sprint: 'S2', carryover: 12, target: 10 },
  { sprint: 'S3', carryover: 8, target: 10 },
  { sprint: 'S4', carryover: 6, target: 10 },
  { sprint: 'S5', carryover: 9, target: 10 },
  { sprint: 'S6', carryover: 5, target: 10 },
  { sprint: 'S7', carryover: 3, target: 10 },
  { sprint: 'S8', carryover: 4, target: 10 },
];

export const bugEscapeData: BugEscapeMetrics[] = [
  { sprint: 'S1', found_qa: 12, escaped_prod: 3, rate: 20 },
  { sprint: 'S2', found_qa: 15, escaped_prod: 2, rate: 12 },
  { sprint: 'S3', found_qa: 10, escaped_prod: 1, rate: 9 },
  { sprint: 'S4', found_qa: 14, escaped_prod: 1, rate: 7 },
  { sprint: 'S5', found_qa: 11, escaped_prod: 0, rate: 0 },
  { sprint: 'S6', found_qa: 13, escaped_prod: 1, rate: 7 },
  { sprint: 'S7', found_qa: 9, escaped_prod: 0, rate: 0 },
  { sprint: 'S8', found_qa: 12, escaped_prod: 0, rate: 0 },
];

// =============================================================================
// MOCK DATA - DORA METRICS
// =============================================================================

export const deployFreqData: DoraMetrics[] = [
  { month: 'Oct', deploys: 2 },
  { month: 'Nov', deploys: 3 },
  { month: 'Dic', deploys: 4 },
  { month: 'Ene', deploys: 5 },
  { month: 'Feb', deploys: 6 },
  { month: 'Mar', deploys: 8 },
];

export const leadTimeData: DoraMetrics[] = [
  { month: 'Oct', days: 28 },
  { month: 'Nov', days: 22 },
  { month: 'Dic', days: 18 },
  { month: 'Ene', days: 14 },
  { month: 'Feb', days: 11 },
  { month: 'Mar', days: 8 },
];

export const changeFailureData: DoraMetrics[] = [
  { month: 'Oct', rate: 25 },
  { month: 'Nov', rate: 18 },
  { month: 'Dic', rate: 15 },
  { month: 'Ene', rate: 10 },
  { month: 'Feb', rate: 8 },
  { month: 'Mar', rate: 5 },
];

export const mttrData: DoraMetrics[] = [
  { month: 'Oct', hours: 48 },
  { month: 'Nov', hours: 36 },
  { month: 'Dic', hours: 24 },
  { month: 'Ene', hours: 12 },
  { month: 'Feb', hours: 8 },
  { month: 'Mar', hours: 4 },
];

// =============================================================================
// DORA MATURITY DATA
// =============================================================================

export const doraRadarData: DoraRadarData[] = [
  { metric: 'Deploy Freq', current: 70, elite: 100 },
  { metric: 'Lead Time', current: 70, elite: 100 },
  { metric: 'Change Failure', current: 70, elite: 100 },
  { metric: 'MTTR', current: 70, elite: 100 },
];

export const DORA_CLASSIFICATION: DoraLevel[] = [
  {
    metric: 'Deployment Frequency',
    elite: 'On demand (multiple/day)',
    high: '1/semana - 1/mes',
    medium: '1/mes - 1/6 meses',
    low: '< 1/6 meses',
    current: 'High range',
    currentLevel: 'high',
  },
  {
    metric: 'Lead Time for Changes',
    elite: '< 1 hora',
    high: '1 dia - 1 semana',
    medium: '1 semana - 1 mes',
    low: '> 1 mes',
    current: 'High range',
    currentLevel: 'high',
  },
  {
    metric: 'Change Failure Rate',
    elite: '0-5%',
    high: '5-10%',
    medium: '10-15%',
    low: '> 15%',
    current: 'Elite range',
    currentLevel: 'elite',
  },
  {
    metric: 'Mean Time to Recovery',
    elite: '< 1 hora',
    high: '< 1 dia',
    medium: '1 dia - 1 semana',
    low: '> 1 semana',
    current: 'High range',
    currentLevel: 'high',
  },
];

export const LEVEL_COLORS: Record<string, string> = {
  elite: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  high: 'bg-blue-100 text-blue-800 border-blue-300',
  medium: 'bg-amber-100 text-amber-800 border-amber-300',
  low: 'bg-red-100 text-red-800 border-red-300',
};

// =============================================================================
// CLIENT-SPECIFIC CONFIGURATIONS
// =============================================================================

export interface MetricsConfig {
  trackingTool: string;
  testingTool: string;
  focusAreas: string[];
  customMetrics?: MetricCardData[];
}

export const getClientMetricsConfig = (clientId: string): MetricsConfig => {
  const configs: Record<string, MetricsConfig> = {
    facephi: {
      trackingTool: 'Jira',
      testingTool: 'TestRail',
      focusAreas: ['Code Quality', 'Security Compliance', 'API Performance'],
      // Industry-specific metrics should be configured post-discovery interview
      // customMetrics: [], // Removed overly specific "Biometric Accuracy"
    },
    docline: {
      trackingTool: 'Linear',
      testingTool: 'Linear', // Based on transcript: Linear used for test management
      focusAreas: ['System Uptime', 'Data Security', 'Compliance Monitoring'],
      // Industry-specific metrics should be configured post-discovery interview
      // customMetrics: [], // Removed overly specific "HIPAA Compliance"
    },
  };

  const config = configs[clientId];
  return config ?? configs.facephi!;
};

// =============================================================================
// OVERVIEW KPI CARDS DATA
// =============================================================================

export const getOverviewMetrics = (clientConfig: MetricsConfig): MetricCardData[] => [
  {
    title: 'Velocity (promedio)',
    value: '33 pts',
    target: 'Estable +/-10%',
    trend: 'up',
    trendGood: true,
    delta: 'Mejorando',
    iconType: 'trending-up',
    source: `${clientConfig.trackingTool} MCP`,
  },
  {
    title: 'Trabajo Arrastrado',
    value: '4%',
    target: '< 10%',
    trend: 'down',
    trendGood: true,
    delta: 'En target',
    iconType: 'activity',
    source: `${clientConfig.trackingTool} MCP`,
  },
  {
    title: 'Bug Escape Rate',
    value: '0%',
    target: '< 5%',
    trend: 'down',
    trendGood: true,
    delta: 'Excelente',
    iconType: 'bug',
    source: `${clientConfig.trackingTool} MCP`,
  },
  {
    title: 'Deploy Frequency',
    value: '8/mes',
    target: '>= 1/sprint',
    trend: 'up',
    trendGood: true,
    delta: 'Superando target',
    iconType: 'rocket',
    source: 'CI/CD',
  },
  {
    title: 'Lead Time',
    value: '8 dias',
    target: '< 4 semanas',
    trend: 'down',
    trendGood: true,
    delta: 'En target',
    iconType: 'timer',
    source: `${clientConfig.trackingTool} + GitHub`,
  },
  {
    title: 'MTTR',
    value: '4h',
    target: '< 1 dia',
    trend: 'down',
    trendGood: true,
    delta: 'En target',
    iconType: 'gauge',
    source: 'CI/CD',
  },
];

// =============================================================================
// SECTION CONFIGURATION
// =============================================================================

export type Section = 'overview' | 'sprint' | 'dora' | 'adoption' | 'uso-ia';

export const sections = [
  { id: 'overview' as const, label: 'Resumen' },
  { id: 'sprint' as const, label: 'Sprint Metrics' },
  { id: 'dora' as const, label: 'DORA Metrics' },
  { id: 'adoption' as const, label: 'Adopcion IA' },
  { id: 'uso-ia' as const, label: 'Uso IA' },
];

// =============================================================================
// IA ADOPTION METRICS DATA
// =============================================================================

// IA-related interfaces removed - data now handled via external tools

// Note: IA adoption and usage data removed - now handled via external tools
