/**
 * @file Color Schemes Fixtures
 * @description Centralized color schemes to eliminate inline color definitions
 * @note Phase colors now use local implementation for UI-specific styling
 */

// Chart color palettes
export const CATEGORY_COLORS = {
  development: '#10b981',
  qa: '#3b82f6',
  governance: '#8b5cf6',
  planning: '#f59e0b',
  security: '#ef4444',
  deployment: '#06b6d4',
} as const;

export const AUTOMATION_COLORS = {
  automated: '#10b981',
  assisted: '#f59e0b',
  manual: '#ef4444',
} as const;

export const TEAM_COLORS = {
  Development: '#10b981',
  QA: '#3b82f6',
  Security: '#8b5cf6',
  DevOps: '#f59e0b',
  Product: '#ec4899',
  Design: '#06b6d4',
} as const;

// Icon color mappings for MetricCard
export const ICON_COLORS = {
  'trending-up': 'text-blue-600',
  activity: 'text-amber-600',
  bug: 'text-red-600',
  rocket: 'text-purple-600',
  timer: 'text-green-600',
  gauge: 'text-indigo-600',
} as const;

// Status indicator colors
export const STATUS_COLORS = {
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  neutral: '#6b7280',
} as const;

// DORA metric colors
export const DORA_COLORS = {
  elite: '#10b981',
  high: '#3b82f6',
  medium: '#f59e0b',
  low: '#ef4444',
} as const;

// Phase colors (dynamically generated from centralized phase data)
// This eliminates hardcoded duplication and uses src/data/phases.ts as source of truth
import { phaseColors as centralizedPhaseColors } from '@/data/phases';

const PHASE_COLOR_MAP = {
  slate: '#f8fafc', // slate-50
  purple: '#f3e8ff', // purple-50
  blue: '#dbeafe', // blue-100
  cyan: '#cffafe', // cyan-100
  teal: '#ccfbf1', // teal-100
  orange: '#fed7aa', // orange-200
  sky: '#e0f2fe', // sky-100
  red: '#fecaca', // red-200
  emerald: '#d1fae5', // emerald-100
  violet: '#ede9fe', // violet-100
  indigo: '#e0e7ff', // indigo-100
} as const;

// Generate phase colors from centralized data to eliminate hardcoding
const generatePhaseColors = () => {
  const phaseColors: Record<string, string> = {};
  Object.entries(centralizedPhaseColors).forEach(([phaseId, colorName]) => {
    const key = `phase${phaseId}`;
    const hexColor = PHASE_COLOR_MAP[colorName as keyof typeof PHASE_COLOR_MAP];
    if (hexColor) {
      phaseColors[key] = hexColor;
    }
  });
  return phaseColors;
};

export const PHASE_COLORS = generatePhaseColors();

// Sprint health colors
export const SPRINT_HEALTH_COLORS = {
  onTrack: '#10b981',
  atRisk: '#f59e0b',
  blocked: '#ef4444',
} as const;

// Utility function to get color by category
export const getCategoryColor = (category: keyof typeof CATEGORY_COLORS): string => {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.development;
};

// Utility function to get automation color
export const getAutomationColor = (level: keyof typeof AUTOMATION_COLORS): string => {
  return AUTOMATION_COLORS[level] || AUTOMATION_COLORS.manual;
};

// Utility function to get team color
export const getTeamColor = (team: keyof typeof TEAM_COLORS): string => {
  return TEAM_COLORS[team] || TEAM_COLORS.Development;
};

// Note: For phase colors, use getPhaseColor() from @/data/phases instead
// This maintains consistency with the centralized phase system

// Color palette for general charts (8 distinct colors)
export const CHART_PALETTE = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#84cc16', // lime
] as const;
