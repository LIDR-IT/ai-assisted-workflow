/**
 * @file OverviewSection Test Suite
 * @description Tests for OverviewSection component with fixture integration
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OverviewSection } from '../OverviewSection';
import type { MetricsConfig } from '@/data/features/metrics/metricsData';
import { getOverviewMetrics } from '@/data/features/metrics/metricsData';

// Mock recharts to avoid SVG rendering issues in tests
vi.mock('recharts', () => ({
  RadarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="radar-chart">{children}</div>
  ),
  Radar: ({ name, dataKey }: { name: string; dataKey: string }) => (
    <div data-testid="radar" data-name={name} data-key={dataKey} />
  ),
  PolarGrid: () => <div data-testid="polar-grid" />,
  PolarAngleAxis: ({ dataKey }: { dataKey: string }) => (
    <div data-testid="polar-angle-axis" data-key={dataKey} />
  ),
  PolarRadiusAxis: ({ angle, domain }: { angle: number; domain: number[] }) => (
    <div data-testid="polar-radius-axis" data-angle={angle} data-domain={domain.join(',')} />
  ),
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
}));

// Mock the data dependency
vi.mock('@/data/features/metrics/metricsData', () => ({
  getOverviewMetrics: vi.fn(),
  doraRadarData: [
    { metric: 'Deploy Freq', current: 70, elite: 100 },
    { metric: 'Lead Time', current: 70, elite: 100 },
    { metric: 'Change Failure', current: 70, elite: 100 },
    { metric: 'MTTR', current: 70, elite: 100 },
  ],
}));

// Mock fixtures
vi.mock('@/fixtures', () => ({
  ICON_COLORS: {
    'trending-up': 'text-blue-600',
    activity: 'text-amber-600',
    bug: 'text-red-600',
    rocket: 'text-purple-600',
    timer: 'text-green-600',
    gauge: 'text-indigo-600',
  },
}));

// Mock MetricCard and ChartCard to focus on OverviewSection logic
vi.mock('../MetricCard', () => ({
  createMetricCard: (data: any, key: string) => (
    <div key={key} data-testid={`metric-card-${key}`}>
      {data.title}: {data.value}
    </div>
  ),
}));

vi.mock('../ChartCard', () => ({
  ChartCard: ({ title, subtitle, children }: any) => (
    <div data-testid="chart-card">
      <h3>{title}</h3>
      <p>{subtitle}</p>
      {children}
    </div>
  ),
}));

describe('OverviewSection', () => {
  const mockGetOverviewMetrics = vi.mocked(getOverviewMetrics);

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock return
    mockGetOverviewMetrics.mockReturnValue([
      {
        title: 'Skills Estandarizados',
        value: '57',
        target: '60',
        trend: 'up',
        trendGood: true,
        delta: '+12%',
        iconType: 'trending-up',
        source: 'LIDR SDLC Analytics',
      },
      {
        title: 'Automatización IA',
        value: '9',
        target: '12',
        trend: 'up',
        trendGood: true,
        delta: '+2%',
        iconType: 'activity',
        source: 'Automation Engine',
      },
    ]);
  });

  describe('Basic Rendering', () => {
    const basicClientConfig = {
      trackingTool: 'Jira',
      testingTool: 'Jest',
      focusAreas: ['Development Velocity', 'Quality Gates'],
    };

    it('renders KPI cards from client configuration', () => {
      render(<OverviewSection clientConfig={basicClientConfig} />);

      expect(screen.getByTestId('metric-card-metric-0')).toBeInTheDocument();
      expect(screen.getByTestId('metric-card-metric-1')).toBeInTheDocument();
    });

    it('calls getOverviewMetrics with client configuration', () => {
      render(<OverviewSection clientConfig={basicClientConfig} />);

      expect(mockGetOverviewMetrics).toHaveBeenCalledWith(basicClientConfig);
    });

    it('renders DORA Maturity Radar chart', () => {
      render(<OverviewSection clientConfig={basicClientConfig} />);

      expect(screen.getByText('DORA Maturity Radar')).toBeInTheDocument();
      expect(screen.getByText('Posición actual vs Elite performance')).toBeInTheDocument();
      expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
    });

    it('renders component layout correctly', () => {
      render(<OverviewSection clientConfig={basicClientConfig} />);

      // Check grid layout for metrics cards exists
      const container = screen.getByTestId('metric-card-metric-0').closest('div.grid');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-6');

      // Check chart card is rendered
      expect(screen.getByTestId('chart-card')).toBeInTheDocument();
    });

    it('handles getOverviewMetrics errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockGetOverviewMetrics.mockImplementation(() => {
        throw new Error('Metrics computation failed');
      });

      render(<OverviewSection clientConfig={basicClientConfig} />);

      // Component should still render without crashing
      expect(screen.getByTestId('chart-card')).toBeInTheDocument();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to get overview metrics:', expect.any(Error));

      consoleSpy.mockRestore();
    });

    it('handles null metrics response', () => {
      mockGetOverviewMetrics.mockReturnValue([]);

      render(<OverviewSection clientConfig={basicClientConfig} />);

      // Component should still render chart even with no metrics
      expect(screen.getByTestId('chart-card')).toBeInTheDocument();
      expect(screen.queryByTestId('metric-card-metric-0')).not.toBeInTheDocument();
    });
  });

  describe('Custom Metrics Integration', () => {
    it('includes custom metrics when provided', () => {
      const configWithCustomMetrics: MetricsConfig = {
        trackingTool: 'Linear',
        testingTool: 'Vitest',
        focusAreas: ['Team Velocity'],
        customMetrics: [
          {
            title: 'Custom Metric',
            value: '42',
            target: '50',
            trend: 'stable',
            trendGood: true,
            delta: '0%',
            iconType: 'gauge',
            source: 'Custom Source',
          },
        ],
      };

      render(<OverviewSection clientConfig={configWithCustomMetrics} />);

      // Should render both standard metrics (2) + custom metrics (1) = 3 total
      expect(screen.getByTestId('metric-card-metric-0')).toBeInTheDocument();
      expect(screen.getByTestId('metric-card-metric-1')).toBeInTheDocument();
      expect(screen.getByTestId('metric-card-metric-2')).toBeInTheDocument();
    });

    it('renders only standard metrics when no custom metrics', () => {
      const configWithoutCustomMetrics = {
        trackingTool: 'Jira',
        testingTool: 'Jest',
        focusAreas: ['Quality'],
      };

      render(<OverviewSection clientConfig={configWithoutCustomMetrics} />);

      // Should render only standard metrics
      expect(screen.getByTestId('metric-card-metric-0')).toBeInTheDocument();
      expect(screen.getByTestId('metric-card-metric-1')).toBeInTheDocument();
      expect(screen.queryByTestId('metric-card-metric-2')).not.toBeInTheDocument();
    });
  });

  describe('Performance Optimizations', () => {
    it('memoizes overview metrics computation', () => {
      const clientConfig = {
        trackingTool: 'Jira',
        testingTool: 'Jest',
        focusAreas: ['Development'],
      };

      const { rerender } = render(<OverviewSection clientConfig={clientConfig} />);

      expect(mockGetOverviewMetrics).toHaveBeenCalledTimes(1);

      // Re-render with same config reference - component memo should prevent re-render
      rerender(<OverviewSection clientConfig={clientConfig} />);

      // Should not call getOverviewMetrics again due to memoization
      expect(mockGetOverviewMetrics).toHaveBeenCalledTimes(1);
    });

    it('recalculates metrics when client config changes', () => {
      const initialConfig = {
        trackingTool: 'Jira',
        testingTool: 'Jest',
        focusAreas: ['Development'],
      };

      const newConfig = {
        trackingTool: 'Linear',
        testingTool: 'Vitest',
        focusAreas: ['QA'],
      };

      const { rerender } = render(<OverviewSection clientConfig={initialConfig} />);

      expect(mockGetOverviewMetrics).toHaveBeenCalledWith(initialConfig);

      rerender(<OverviewSection clientConfig={newConfig} />);

      expect(mockGetOverviewMetrics).toHaveBeenCalledWith(newConfig);
      expect(mockGetOverviewMetrics).toHaveBeenCalledTimes(2);
    });

    it('memoizes all metrics array creation', () => {
      const clientConfig: MetricsConfig = {
        trackingTool: 'Jira',
        testingTool: 'Jest',
        focusAreas: ['Development'],
        customMetrics: [
          {
            title: 'Static Custom',
            value: '100',
            target: '100',
            trend: 'stable',
            trendGood: true,
            delta: '0%',
            iconType: 'gauge',
            source: 'Test',
          },
        ],
      };

      const { rerender } = render(<OverviewSection clientConfig={clientConfig} />);

      expect(mockGetOverviewMetrics).toHaveBeenCalledTimes(1);

      // Re-render with exact same config (including same custom metrics reference)
      rerender(<OverviewSection clientConfig={clientConfig} />);

      // Metrics should be memoized since config reference didn't change
      expect(mockGetOverviewMetrics).toHaveBeenCalledTimes(1);
    });
  });

  describe('Custom Component Comparison', () => {
    it('re-renders when client config deeply changes', () => {
      const config1 = {
        trackingTool: 'Jira',
        testingTool: 'Jest',
        focusAreas: ['Development'],
        nested: { value: 1 },
      };

      const config2 = {
        trackingTool: 'Jira',
        testingTool: 'Jest',
        focusAreas: ['Development'],
        nested: { value: 2 }, // Deep change
      };

      const { rerender } = render(<OverviewSection clientConfig={config1} />);

      expect(mockGetOverviewMetrics).toHaveBeenCalledTimes(1);

      rerender(<OverviewSection clientConfig={config2} />);

      // Should re-render and call metrics again due to deep change
      expect(mockGetOverviewMetrics).toHaveBeenCalledTimes(2);
    });

    it('prevents re-render when client config is deeply equal', () => {
      const config1 = {
        trackingTool: 'Jira',
        testingTool: 'Jest',
        focusAreas: ['Development'],
        nested: { value: 1 },
      };

      const config2 = {
        trackingTool: 'Jira',
        testingTool: 'Jest',
        focusAreas: ['Development'],
        nested: { value: 1 }, // Same deep structure
      };

      const { rerender } = render(<OverviewSection clientConfig={config1} />);

      expect(mockGetOverviewMetrics).toHaveBeenCalledTimes(1);

      rerender(<OverviewSection clientConfig={config2} />);

      // Component uses JSON.stringify comparison, so deeply equal objects prevent re-render
      expect(mockGetOverviewMetrics).toHaveBeenCalledTimes(1);
    });
  });

  describe('DORA Chart Integration', () => {
    it('renders DORA radar with correct data structure', () => {
      const clientConfig = {
        trackingTool: 'Jira',
        testingTool: 'Jest',
        focusAreas: ['DORA Metrics'],
      };

      render(<OverviewSection clientConfig={clientConfig} />);

      // Check that radar chart components are rendered
      expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
      expect(screen.getAllByTestId('radar')).toHaveLength(2); // Should have current and elite
      expect(screen.getByTestId('polar-grid')).toBeInTheDocument();
    });

    it('displays DORA legend correctly', () => {
      const clientConfig = {
        trackingTool: 'Jira',
        testingTool: 'Jest',
        focusAreas: ['DORA'],
      };

      render(<OverviewSection clientConfig={clientConfig} />);

      expect(screen.getByText('Estado Actual')).toBeInTheDocument();
      expect(screen.getByText('Elite Performance')).toBeInTheDocument();
    });
  });
});
