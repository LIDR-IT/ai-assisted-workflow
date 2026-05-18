/**
 * @file Sprint Metrics Fixtures
 * @description Mock data for sprint-specific metrics and DORA tracking
 */

import type { FixtureFactory } from '../types';

export interface SprintData {
  sprintNumber: number;
  name: string;
  startDate: string;
  endDate: string;
  capacity: number;
  committed: number;
  delivered: number;
  velocity: number;
  carryOver: number;
}

export interface VelocityTrend {
  sprint: string;
  planned: number;
  delivered: number;
  carryOver: number;
}

// Sprint capacity and velocity data
export const mockSprintData: SprintData[] = [
  {
    sprintNumber: 24,
    name: 'Sprint 24 - Q1 Finalization',
    startDate: '2026-03-01',
    endDate: '2026-03-14',
    capacity: 280,
    committed: 252,
    delivered: 248,
    velocity: 248,
    carryOver: 4,
  },
  {
    sprintNumber: 23,
    name: 'Sprint 23 - Security Features',
    startDate: '2026-02-15',
    endDate: '2026-02-28',
    capacity: 280,
    committed: 260,
    delivered: 245,
    velocity: 245,
    carryOver: 15,
  },
  {
    sprintNumber: 22,
    name: 'Sprint 22 - Architecture Refactor',
    startDate: '2026-02-01',
    endDate: '2026-02-14',
    capacity: 275,
    committed: 240,
    delivered: 235,
    velocity: 235,
    carryOver: 5,
  },
];

// Velocity trend for charts
export const velocityTrendData: VelocityTrend[] = [
  { sprint: 'Spr 20', planned: 220, delivered: 215, carryOver: 5 },
  { sprint: 'Spr 21', planned: 230, delivered: 225, carryOver: 10 },
  { sprint: 'Spr 22', planned: 240, delivered: 235, carryOver: 5 },
  { sprint: 'Spr 23', planned: 260, delivered: 245, carryOver: 15 },
  { sprint: 'Spr 24', planned: 252, delivered: 248, carryOver: 4 },
];

// DORA metrics over time
export interface DORATimeSeriesData {
  date: string;
  leadTime: number; // hours
  deployFreq: number; // deploys per week
  mttr: number; // hours
  changeFailureRate: number; // percentage
}

export const doraTimeSeriesData: DORATimeSeriesData[] = [
  {
    date: '2026-01-01',
    leadTime: 72,
    deployFreq: 2.1,
    mttr: 4.2,
    changeFailureRate: 8.5,
  },
  {
    date: '2026-02-01',
    leadTime: 68,
    deployFreq: 2.3,
    mttr: 3.8,
    changeFailureRate: 7.2,
  },
  {
    date: '2026-03-01',
    leadTime: 65,
    deployFreq: 2.5,
    mttr: 3.5,
    changeFailureRate: 6.8,
  },
];

// Factory functions
export const createSprintData: FixtureFactory<SprintData> = (overrides = {}) => ({
  sprintNumber: 1,
  name: 'Sprint 1',
  startDate: '2026-01-01',
  endDate: '2026-01-14',
  capacity: 280,
  committed: 250,
  delivered: 240,
  velocity: 240,
  carryOver: 10,
  ...overrides,
});

// Current sprint summary
export const getCurrentSprint = (): SprintData => {
  const sprint = mockSprintData[0]; // Latest sprint
  if (!sprint) {
    throw new Error('No sprint data available');
  }
  return sprint;
};

// Sprint health indicators
export interface SprintHealth {
  onTrack: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  blockers: number;
  burndownTrend: 'good' | 'concerning' | 'poor';
  teamMorale: number; // 1-10
}

export const currentSprintHealth: SprintHealth = {
  onTrack: true,
  riskLevel: 'low',
  blockers: 1,
  burndownTrend: 'good',
  teamMorale: 8.5,
};
