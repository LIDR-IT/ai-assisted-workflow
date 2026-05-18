/**
 * @file Fixtures Types
 * @description Type definitions for all fixture data to ensure type safety
 */

// Metrics fixtures
export interface MetricData {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon?: string;
  unit?: string;
}

export interface DORAMetric {
  metric: string;
  current: number;
  elite: number;
  description: string;
}

export interface MetricsOverview {
  totalSkills: number;
  automatedSkills: number;
  totalCommands: number;
  roiHours: number;
  validationScripts: number;
  workflows: number;
  customMetrics?: MetricData[];
}

// SDLC fixtures
export interface PhaseTemplate {
  id: string;
  name: string;
  phase: number;
  type: 'template' | 'checklist' | 'signoff';
  automated: boolean;
  description: string;
  path?: string;
}

export interface HandoffRole {
  role: string;
  action: string;
}

export interface PhaseHandoff {
  phase: number;
  gate: string;
  producer: HandoffRole[];
  receiver: HandoffRole[];
  aiAutomation?: string;
}

// Content fixtures
export interface SkillMetadata {
  id: string;
  name: string;
  phase: number;
  automated: boolean;
  roi: number;
  type: 'orchestrator' | 'tactical' | 'cross-cutting';
  tier?: number;
}

export interface ArtifactStats {
  skills: number;
  commands: number;
  validationScripts: number;
  workflows: number;
  total: number;
}

// Testing fixtures
export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface MockProject {
  id: string;
  name: string;
  type: string;
  phase: number;
  status: 'active' | 'completed' | 'paused';
  team: string[];
}

// Factory function types
export type FixtureOverrides<T> = Partial<T>;
export type FixtureFactory<T> = (overrides?: FixtureOverrides<T>) => T;
