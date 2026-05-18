/**
 * @file Fixtures Index
 * @description Unified export point for all fixture data with environment-aware loading
 */

// Type exports
export type * from './types';

// Metrics fixtures
export * from './metrics/overviewStats';
export * from './metrics/sprintMetrics';
export * from './metrics/aiUsageData';

// Content fixtures
export * from './content/helpCenterStats';

// UI fixtures
export * from './ui/colorSchemes';
import { CATEGORY_COLORS } from './ui/colorSchemes';

// Environment-aware fixture loading
export const getFixtures = async () => {
  if (process.env.NODE_ENV === 'test') {
    // In test environment, return minimal fixtures
    return {
      metrics: {
        overview: await import('./metrics/overviewStats'),
        sprint: await import('./metrics/sprintMetrics'),
        aiUsage: await import('./metrics/aiUsageData'),
      },
      content: {
        helpCenter: await import('./content/helpCenterStats'),
      },
      ui: {
        colors: await import('./ui/colorSchemes'),
      },
    };
  }

  // In development/production, return full fixtures
  return {
    metrics: {
      overview: await import('./metrics/overviewStats'),
      sprint: await import('./metrics/sprintMetrics'),
      aiUsage: await import('./metrics/aiUsageData'),
    },
    content: {
      helpCenter: await import('./content/helpCenterStats'),
    },
    ui: {
      colors: await import('./ui/colorSchemes'),
    },
  };
};

// Direct imports for synchronous usage
export {
  // Overview metrics
  baseOverviewMetrics,
  doraRadarData,
  createOverviewStats,
  createMetricCard,
  facephiMetrics,
  doclineMetrics,
  getOverviewMetricsForClient,
} from './metrics/overviewStats';

export {
  // Sprint metrics
  mockSprintData,
  velocityTrendData,
  doraTimeSeriesData,
  createSprintData,
  getCurrentSprint,
  currentSprintHealth,
} from './metrics/sprintMetrics';

export {
  // AI Usage data
  iaUsageData,
  createIASkillUsage,
  getUsageStats,
  getTopSkillsByExecution,
  getTopSkillsByTimeSaved,
  getCategoryBreakdown,
  getAutomationBreakdown,
} from './metrics/aiUsageData';

export {
  // Help Center stats
  baseArtifactStats,
  helpCenterStatCards,
  popularSearchTerms,
  createArtifactStats,
  createStatCard,
  getFacephiStats,
  getDoclineStats,
  getStatsForClient,
} from './content/helpCenterStats';

export {
  // Color schemes
  CATEGORY_COLORS,
  AUTOMATION_COLORS,
  TEAM_COLORS,
  ICON_COLORS,
  STATUS_COLORS,
  DORA_COLORS,
  PHASE_COLORS,
  SPRINT_HEALTH_COLORS,
  CHART_PALETTE,
  getCategoryColor,
  getAutomationColor,
  getTeamColor,
  // Note: getPhaseColor removed - use getPhaseColor from @/data/phases instead
} from './ui/colorSchemes';

// Utility functions for fixture management
export const createTestFixtures = (
  overrides: {
    metrics?: Record<string, any>;
    ui?: Record<string, any>;
  } = {}
) => ({
  metrics: {
    totalSkills: 57,
    automatedSkills: 9,
    totalCommands: 23,
    roiHours: 775,
    ...(overrides.metrics || {}),
  },
  ui: {
    theme: 'light',
    colors: CATEGORY_COLORS,
    ...(overrides.ui || {}),
  },
});

// Reset fixtures for testing
export const resetFixtures = () => {
  // This function can be used in tests to reset any stateful fixture data
  console.warn('Fixtures reset - use only in test environment');
};
