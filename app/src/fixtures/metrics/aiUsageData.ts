/**
 * @file AI Usage Data Fixtures
 * @description Mock data for IA automation, skill execution tracking, and time savings analysis
 */

import type { FixtureFactory } from '../types';

// AI skill usage data
export interface IASkillUsage {
  skill: string;
  category: 'development' | 'qa' | 'governance' | 'planning' | 'security' | 'deployment';
  executions: number;
  timesSaved: number; // hours
  automationLevel: 'automated' | 'assisted' | 'manual';
  avgExecutionTime: number; // minutes
  successRate: number; // percentage
  phase: number;
}

// Mock IA usage data for skills
export const iaUsageData: IASkillUsage[] = [
  {
    skill: 'validate-requirements',
    category: 'governance',
    executions: 45,
    timesSaved: 180,
    automationLevel: 'automated',
    avgExecutionTime: 5,
    successRate: 94,
    phase: 3,
  },
  {
    skill: 'user-stories',
    category: 'planning',
    executions: 38,
    timesSaved: 152,
    automationLevel: 'automated',
    avgExecutionTime: 15,
    successRate: 89,
    phase: 4,
  },
  {
    skill: 'tech-debt',
    category: 'development',
    executions: 32,
    timesSaved: 192,
    automationLevel: 'automated',
    avgExecutionTime: 5,
    successRate: 91,
    phase: 5,
  },
  {
    skill: 'test-plan',
    category: 'qa',
    executions: 28,
    timesSaved: 84,
    automationLevel: 'automated',
    avgExecutionTime: 5,
    successRate: 87,
    phase: 6,
  },
  {
    skill: 'security-checklist',
    category: 'security',
    executions: 24,
    timesSaved: 96,
    automationLevel: 'automated',
    avgExecutionTime: 5,
    successRate: 93,
    phase: 7,
  },
  {
    skill: 'release-notes',
    category: 'deployment',
    executions: 22,
    timesSaved: 44,
    automationLevel: 'automated',
    avgExecutionTime: 5,
    successRate: 96,
    phase: 8,
  },
  {
    skill: 'rollback-plan',
    category: 'deployment',
    executions: 20,
    timesSaved: 80,
    automationLevel: 'automated',
    avgExecutionTime: 5,
    successRate: 89,
    phase: 8,
  },
  {
    skill: 'regression-suite',
    category: 'qa',
    executions: 18,
    timesSaved: 135,
    automationLevel: 'automated',
    avgExecutionTime: 30,
    successRate: 92,
    phase: 6,
  },
  // Assisted skills
  {
    skill: 'prd-tecnico',
    category: 'planning',
    executions: 42,
    timesSaved: 168,
    automationLevel: 'assisted',
    avgExecutionTime: 120,
    successRate: 85,
    phase: 2,
  },
  {
    skill: 'business-case',
    category: 'governance',
    executions: 35,
    timesSaved: 140,
    automationLevel: 'assisted',
    avgExecutionTime: 90,
    successRate: 82,
    phase: 1,
  },
  {
    skill: 'architecture-doc',
    category: 'development',
    executions: 25,
    timesSaved: 150,
    automationLevel: 'assisted',
    avgExecutionTime: 180,
    successRate: 78,
    phase: 2,
  },
  // Manual skills (for comparison)
  {
    skill: 'stakeholder-interview',
    category: 'governance',
    executions: 15,
    timesSaved: 0,
    automationLevel: 'manual',
    avgExecutionTime: 240,
    successRate: 100,
    phase: 1,
  },
];

// Aggregated statistics
export interface UsageStats {
  totalExecutions: number;
  totalTimeSaved: number;
  totalSkills: number;
  automatedSkills: number;
  assistedSkills: number;
  manualSkills: number;
  avgSuccessRate: number;
}

// Factory function for creating usage data
export const createIASkillUsage: FixtureFactory<IASkillUsage> = (overrides = {}) => ({
  skill: 'default-skill',
  category: 'development',
  executions: 10,
  timesSaved: 40,
  automationLevel: 'assisted',
  avgExecutionTime: 30,
  successRate: 85,
  phase: 5,
  ...overrides,
});

// Computed usage statistics
export const getUsageStats = (): UsageStats => {
  const totalExecutions = iaUsageData.reduce((sum, skill) => sum + skill.executions, 0);
  const totalTimeSaved = iaUsageData.reduce((sum, skill) => sum + skill.timesSaved, 0);
  const totalSkills = iaUsageData.length;
  const automatedSkills = iaUsageData.filter(
    (skill) => skill.automationLevel === 'automated'
  ).length;
  const assistedSkills = iaUsageData.filter((skill) => skill.automationLevel === 'assisted').length;
  const manualSkills = iaUsageData.filter((skill) => skill.automationLevel === 'manual').length;
  const avgSuccessRate =
    iaUsageData.reduce((sum, skill) => sum + skill.successRate, 0) / totalSkills;

  return {
    totalExecutions,
    totalTimeSaved,
    totalSkills,
    automatedSkills,
    assistedSkills,
    manualSkills,
    avgSuccessRate: Math.round(avgSuccessRate),
  };
};

// Helper functions for data aggregation (extracted from UsageSection.tsx)
export const getTopSkillsByExecution = (limit: number = 8): IASkillUsage[] => {
  return iaUsageData.sort((a, b) => b.executions - a.executions).slice(0, limit);
};

export const getTopSkillsByTimeSaved = (limit: number = 8): IASkillUsage[] => {
  return iaUsageData.sort((a, b) => b.timesSaved - a.timesSaved).slice(0, limit);
};

// Category breakdown
export interface CategoryBreakdown {
  category: string;
  executions: number;
  timesSaved: number;
  count: number;
  avgExecutionTime: number;
}

export const getCategoryBreakdown = (): CategoryBreakdown[] => {
  const categoryStats = iaUsageData.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = { executions: 0, timesSaved: 0, count: 0, totalTime: 0 };
      }
      acc[skill.category]!.executions += skill.executions;
      acc[skill.category]!.timesSaved += skill.timesSaved;
      acc[skill.category]!.count += 1;
      acc[skill.category]!.totalTime += skill.avgExecutionTime;
      return acc;
    },
    {} as Record<
      string,
      { executions: number; timesSaved: number; count: number; totalTime: number }
    >
  );

  return Object.entries(categoryStats).map(([category, stats]) => ({
    category,
    executions: stats.executions,
    timesSaved: stats.timesSaved,
    count: stats.count,
    avgExecutionTime: Math.round(stats.totalTime / stats.count),
  }));
};

// Automation level breakdown
export interface AutomationBreakdown {
  level: string;
  count: number;
  timesSaved: number;
  avgSuccessRate: number;
}

export const getAutomationBreakdown = (): AutomationBreakdown[] => {
  const automationStats = iaUsageData.reduce(
    (acc, skill) => {
      if (!acc[skill.automationLevel]) {
        acc[skill.automationLevel] = { count: 0, timesSaved: 0, totalSuccessRate: 0 };
      }
      acc[skill.automationLevel]!.count += 1;
      acc[skill.automationLevel]!.timesSaved += skill.timesSaved;
      acc[skill.automationLevel]!.totalSuccessRate += skill.successRate;
      return acc;
    },
    {} as Record<string, { count: number; timesSaved: number; totalSuccessRate: number }>
  );

  return Object.entries(automationStats).map(([level, stats]) => ({
    level,
    count: stats.count,
    timesSaved: stats.timesSaved,
    avgSuccessRate: Math.round(stats.totalSuccessRate / stats.count),
  }));
};
