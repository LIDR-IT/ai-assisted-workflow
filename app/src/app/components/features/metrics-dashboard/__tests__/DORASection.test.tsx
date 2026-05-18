import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DORASection } from '../DORASection';
import type { MetricsConfig } from '@/data/features/metrics/metricsData';

// Mock Recharts components
vi.mock('recharts', () => ({
  BarChart: ({ children, data, 'data-testid': testId }: any) => (
    <div data-testid={testId || 'bar-chart'} data-chart-data={JSON.stringify(data)}>
      {children}
    </div>
  ),
  Bar: ({ dataKey, name, fill, 'data-testid': testId }: any) => (
    <div data-testid={testId || `bar-${dataKey}`} data-name={name} data-fill={fill}>
      Bar: {dataKey}
    </div>
  ),
  LineChart: ({ children, data, 'data-testid': testId }: any) => (
    <div data-testid={testId || 'line-chart'} data-chart-data={JSON.stringify(data)}>
      {children}
    </div>
  ),
  Line: ({ dataKey, name, stroke, strokeWidth, 'data-testid': testId }: any) => (
    <div
      data-testid={testId || `line-${dataKey}`}
      data-name={name}
      data-stroke={stroke}
      data-stroke-width={strokeWidth}
    >
      Line: {dataKey}
    </div>
  ),
  AreaChart: ({ children, data, 'data-testid': testId }: any) => (
    <div data-testid={testId || 'area-chart'} data-chart-data={JSON.stringify(data)}>
      {children}
    </div>
  ),
  Area: ({ dataKey, name, stroke, fill, fillOpacity, 'data-testid': testId }: any) => (
    <div
      data-testid={testId || `area-${dataKey}`}
      data-name={name}
      data-stroke={stroke}
      data-fill={fill}
      data-fill-opacity={fillOpacity}
    >
      Area: {dataKey}
    </div>
  ),
  XAxis: ({ dataKey, 'data-testid': testId }: any) => (
    <div data-testid={testId || 'x-axis'} data-key={dataKey}>
      XAxis
    </div>
  ),
  YAxis: ({ 'data-testid': testId }: any) => <div data-testid={testId || 'y-axis'}>YAxis</div>,
  CartesianGrid: ({ strokeDasharray: _strokeDasharray, stroke, 'data-testid': testId }: any) => (
    <div data-testid={testId || 'cartesian-grid'} data-stroke={stroke}>
      Grid
    </div>
  ),
  Tooltip: ({ contentStyle, 'data-testid': testId }: any) => (
    <div data-testid={testId || 'tooltip'} data-style={JSON.stringify(contentStyle)}>
      Tooltip
    </div>
  ),
  ResponsiveContainer: ({ children, width, height, 'data-testid': testId }: any) => (
    <div data-testid={testId || 'responsive-container'} data-width={width} data-height={height}>
      {children}
    </div>
  ),
  Legend: ({ wrapperStyle, 'data-testid': testId }: any) => (
    <div data-testid={testId || 'legend'} data-style={JSON.stringify(wrapperStyle)}>
      Legend
    </div>
  ),
}));

// Mock ChartCard component
vi.mock('../ChartCard', () => ({
  ChartCard: ({ title, subtitle, children, className = '' }: any) => (
    <div
      className={`bg-white rounded-xl border border-slate-200 p-5 shadow-sm ${className}`}
      data-testid="chart-card"
    >
      <div className="mb-4">
        <div className="font-semibold text-slate-700 text-sm">{title}</div>
        <div className="text-[11px] text-slate-400 mt-0.5">{subtitle}</div>
      </div>
      {children}
    </div>
  ),
}));

// Mock data imports
vi.mock('@/data/features/metrics/metricsData', () => ({
  deployFreqData: [
    { month: 'Oct', deploys: 2 },
    { month: 'Nov', deploys: 3 },
    { month: 'Dic', deploys: 4 },
    { month: 'Ene', deploys: 5 },
    { month: 'Feb', deploys: 6 },
    { month: 'Mar', deploys: 8 },
  ],
  leadTimeData: [
    { month: 'Oct', days: 28 },
    { month: 'Nov', days: 22 },
    { month: 'Dic', days: 18 },
    { month: 'Ene', days: 14 },
    { month: 'Feb', days: 11 },
    { month: 'Mar', days: 8 },
  ],
  changeFailureData: [
    { month: 'Oct', rate: 25 },
    { month: 'Nov', rate: 18 },
    { month: 'Dic', rate: 15 },
    { month: 'Ene', rate: 10 },
    { month: 'Feb', rate: 8 },
    { month: 'Mar', rate: 5 },
  ],
  mttrData: [
    { month: 'Oct', hours: 48 },
    { month: 'Nov', hours: 36 },
    { month: 'Dic', hours: 24 },
    { month: 'Ene', hours: 12 },
    { month: 'Feb', hours: 8 },
    { month: 'Mar', hours: 4 },
  ],
  DORA_CLASSIFICATION: [
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
  ],
  LEVEL_COLORS: {
    elite: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    high: 'bg-blue-100 text-blue-800 border-blue-300',
    medium: 'bg-amber-100 text-amber-800 border-amber-300',
    low: 'bg-red-100 text-red-800 border-red-300',
  },
}));

const mockClientConfig: MetricsConfig = {
  trackingTool: 'Jira',
  testingTool: 'Jest',
  focusAreas: ['Technology'],
};

const defaultProps = {
  clientConfig: mockClientConfig,
};

describe('DORASection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render all DORA metric cards', () => {
      render(<DORASection {...defaultProps} />);

      // Use getAllByText for elements that appear multiple times (chart title + table)
      expect(screen.getAllByText('Deployment Frequency')).toHaveLength(2);
      expect(screen.getAllByText('Lead Time for Changes')).toHaveLength(2);
      expect(screen.getAllByText('Change Failure Rate')).toHaveLength(2);
      // MTTR has different text in table vs chart title
      expect(screen.getByText('Mean Time to Recovery (MTTR)')).toBeInTheDocument();
      expect(screen.getByText('Mean Time to Recovery')).toBeInTheDocument();
    });

    it('should render DORA classification table', () => {
      render(<DORASection {...defaultProps} />);

      expect(screen.getByText('DORA Performance Classification')).toBeInTheDocument();
      expect(
        screen.getByText('Benchmarking actual performance against industry standards')
      ).toBeInTheDocument();
    });

    it('should render all chart cards', () => {
      render(<DORASection {...defaultProps} />);

      const chartCards = screen.getAllByTestId('chart-card');
      expect(chartCards).toHaveLength(5); // 4 metrics + 1 classification table
    });
  });

  describe('Deployment Frequency Chart', () => {
    it('should render deployment frequency bar chart', () => {
      render(<DORASection {...defaultProps} />);

      const barCharts = screen.getAllByTestId('bar-chart');
      expect(barCharts.length).toBeGreaterThan(0);
    });

    it('should configure deployment bar correctly', () => {
      render(<DORASection {...defaultProps} />);

      const deploysBar = screen.getByTestId('bar-deploys');
      expect(deploysBar).toHaveAttribute('data-name', 'Deploys');
      expect(deploysBar).toHaveAttribute('data-fill', '#10b981');
    });

    it('should display deployment frequency subtitle and target', () => {
      render(<DORASection {...defaultProps} />);

      expect(
        screen.getByText('Deploys per month — Elite target: multiple per day')
      ).toBeInTheDocument();
    });

    it('should include CI/CD pipeline source', () => {
      render(<DORASection {...defaultProps} />);

      // Text is split across elements: "Fuente:" in <strong> and the source text in plain text
      expect(screen.getAllByText('Fuente:')).toHaveLength(4);
      expect(screen.getByText(/CI\/CD Pipeline \+ GitHub Actions/)).toBeInTheDocument();
    });
  });

  describe('Lead Time Chart', () => {
    it('should render lead time area chart', () => {
      render(<DORASection {...defaultProps} />);

      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
      expect(screen.getByTestId('area-days')).toBeInTheDocument();
    });

    it('should configure lead time area correctly', () => {
      render(<DORASection {...defaultProps} />);

      const leadTimeArea = screen.getByTestId('area-days');
      expect(leadTimeArea).toHaveAttribute('data-name', 'Days');
      expect(leadTimeArea).toHaveAttribute('data-stroke', '#3b82f6');
      expect(leadTimeArea).toHaveAttribute('data-fill', '#3b82f6');
      expect(leadTimeArea).toHaveAttribute('data-fill-opacity', '0.3');
    });

    it('should display lead time subtitle and target', () => {
      render(<DORASection {...defaultProps} />);

      expect(
        screen.getByText('Days from commit to production — Elite target: < 1 hour')
      ).toBeInTheDocument();
    });

    it('should include tracking tool in source', () => {
      render(<DORASection {...defaultProps} />);

      // Text is split across elements
      expect(screen.getAllByText('Fuente:')).toHaveLength(4);
      expect(screen.getByText(/Jira \+ GitHub API \(commit → deploy time\)/)).toBeInTheDocument();
    });
  });

  describe('Change Failure Rate Chart', () => {
    it('should render change failure rate line chart', () => {
      render(<DORASection {...defaultProps} />);

      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.getByTestId('line-rate')).toBeInTheDocument();
    });

    it('should configure change failure line correctly', () => {
      render(<DORASection {...defaultProps} />);

      const failureRateLine = screen.getByTestId('line-rate');
      expect(failureRateLine).toHaveAttribute('data-name', 'Failure Rate %');
      expect(failureRateLine).toHaveAttribute('data-stroke', '#ef4444');
      expect(failureRateLine).toHaveAttribute('data-stroke-width', '3');
    });

    it('should display change failure rate subtitle and target', () => {
      render(<DORASection {...defaultProps} />);

      expect(
        screen.getByText('% of deployments causing failures — Elite target: 0-5%')
      ).toBeInTheDocument();
    });

    it('should include CI/CD and monitoring source', () => {
      render(<DORASection {...defaultProps} />);

      // Text is split across elements
      expect(screen.getAllByText('Fuente:')).toHaveLength(4);
      expect(screen.getByText(/CI\/CD Pipeline \+ Production monitoring/)).toBeInTheDocument();
    });
  });

  describe('MTTR Chart', () => {
    it('should render MTTR bar chart', () => {
      render(<DORASection {...defaultProps} />);

      const mttrBar = screen.getByTestId('bar-hours');
      expect(mttrBar).toBeInTheDocument();
    });

    it('should configure MTTR bar correctly', () => {
      render(<DORASection {...defaultProps} />);

      const mttrBar = screen.getByTestId('bar-hours');
      expect(mttrBar).toHaveAttribute('data-name', 'Hours');
      expect(mttrBar).toHaveAttribute('data-fill', '#f59e0b');
    });

    it('should display MTTR subtitle and target', () => {
      render(<DORASection {...defaultProps} />);

      expect(
        screen.getByText('Hours to restore service — Elite target: < 1 hour')
      ).toBeInTheDocument();
    });

    it('should include incident management source', () => {
      render(<DORASection {...defaultProps} />);

      // Text is split across elements
      expect(screen.getAllByText('Fuente:')).toHaveLength(4);
      expect(screen.getByText(/Incident management \+ Monitoring alerts/)).toBeInTheDocument();
    });
  });

  describe('DORA Classification Table', () => {
    it('should render table headers', () => {
      render(<DORASection {...defaultProps} />);

      expect(screen.getByText('Metric')).toBeInTheDocument();
      expect(screen.getByText('Elite')).toBeInTheDocument();
      expect(screen.getByText('High')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('Low')).toBeInTheDocument();
      expect(screen.getByText('Current')).toBeInTheDocument();
    });

    it('should render all DORA metrics in table', () => {
      render(<DORASection {...defaultProps} />);

      // These texts appear both in chart titles and table rows, use getAllByText
      expect(screen.getAllByText('Deployment Frequency')).toHaveLength(2);
      expect(screen.getAllByText('Lead Time for Changes')).toHaveLength(2);
      expect(screen.getAllByText('Change Failure Rate')).toHaveLength(2);
      expect(screen.getByText('Mean Time to Recovery')).toBeInTheDocument();
    });

    it('should display current performance values', () => {
      render(<DORASection {...defaultProps} />);

      expect(screen.getAllByText('High range')).toHaveLength(3);
      expect(screen.getByText('Elite range')).toBeInTheDocument();
    });

    it('should display current performance levels', () => {
      render(<DORASection {...defaultProps} />);

      expect(screen.getAllByText('HIGH')).toHaveLength(3);
      expect(screen.getAllByText('ELITE')).toHaveLength(1);
    });

    it('should render elite targets correctly', () => {
      render(<DORASection {...defaultProps} />);

      expect(screen.getByText('On demand (multiple/day)')).toBeInTheDocument();
      expect(screen.getAllByText('< 1 hora')).toHaveLength(2); // Appears twice in table
      expect(screen.getByText('0-5%')).toBeInTheDocument();
    });

    it('should have proper table structure', () => {
      render(<DORASection {...defaultProps} />);

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();

      // Should have proper headers
      expect(screen.getByRole('columnheader', { name: 'Metric' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Current' })).toBeInTheDocument();
    });
  });

  describe('Performance Summary', () => {
    it('should render performance summary section', () => {
      render(<DORASection {...defaultProps} />);

      expect(screen.getByText('Resumen de Performance DORA')).toBeInTheDocument();
    });

    it('should display overall DORA maturity assessment', () => {
      render(<DORASection {...defaultProps} />);

      expect(screen.getByText('Overall DORA Maturity:')).toBeInTheDocument();
      expect(
        screen.getByText('High Performing (3/4 metrics at High or Elite level)')
      ).toBeInTheDocument();
    });

    it('should render performance indicators for each metric', () => {
      render(<DORASection {...defaultProps} />);

      // Should show abbreviated metric names (first word of metric.metric.split(' ')[0])
      expect(screen.getByText('Deployment')).toBeInTheDocument();
      expect(screen.getByText('Lead')).toBeInTheDocument();
      expect(screen.getByText('Change')).toBeInTheDocument();
      expect(screen.getByText('Mean')).toBeInTheDocument();
    });

    it('should show current levels for each metric', () => {
      render(<DORASection {...defaultProps} />);

      const highLevels = screen.getAllByText('high');
      const eliteLevels = screen.getAllByText('elite');

      expect(highLevels).toHaveLength(3);
      expect(eliteLevels).toHaveLength(1);
    });
  });

  describe('Chart configuration', () => {
    it('should configure responsive containers correctly', () => {
      render(<DORASection {...defaultProps} />);

      const responsiveContainers = screen.getAllByTestId('responsive-container');

      // Should have 4 responsive containers for the 4 DORA metrics
      expect(responsiveContainers).toHaveLength(4);

      responsiveContainers.forEach((container) => {
        expect(container).toHaveAttribute('data-width', '100%');
        expect(container).toHaveAttribute('data-height', '260');
      });
    });

    it('should configure chart grids consistently', () => {
      render(<DORASection {...defaultProps} />);

      const grids = screen.getAllByTestId('cartesian-grid');
      expect(grids).toHaveLength(4);

      grids.forEach((grid) => {
        expect(grid).toHaveAttribute('data-stroke', '#f1f5f9');
      });
    });

    it('should configure tooltips with consistent styling', () => {
      render(<DORASection {...defaultProps} />);

      const tooltips = screen.getAllByTestId('tooltip');
      tooltips.forEach((tooltip) => {
        const style = JSON.parse(tooltip.getAttribute('data-style') || '{}');
        expect(style.fontSize).toBe('12px');
        expect(style.borderRadius).toBe('8px');
      });
    });
  });

  describe('Color scheme', () => {
    it('should use semantic colors for different metrics', () => {
      render(<DORASection {...defaultProps} />);

      // Deployment frequency - green (positive)
      const deploysBar = screen.getByTestId('bar-deploys');
      expect(deploysBar).toHaveAttribute('data-fill', '#10b981');

      // Lead time - blue (neutral)
      const leadTimeArea = screen.getByTestId('area-days');
      expect(leadTimeArea).toHaveAttribute('data-stroke', '#3b82f6');

      // Change failure rate - red (negative)
      const failureLine = screen.getByTestId('line-rate');
      expect(failureLine).toHaveAttribute('data-stroke', '#ef4444');

      // MTTR - amber (warning)
      const mttrBar = screen.getByTestId('bar-hours');
      expect(mttrBar).toHaveAttribute('data-fill', '#f59e0b');
    });

    it('should use correct colors for performance levels in table', () => {
      render(<DORASection {...defaultProps} />);

      // Table headers should have semantic colors
      const eliteHeader = screen.getByRole('columnheader', { name: 'Elite' });
      expect(eliteHeader).toHaveClass('text-emerald-700');

      const highHeader = screen.getByRole('columnheader', { name: 'High' });
      expect(highHeader).toHaveClass('text-blue-700');
    });

    it('should apply level colors to performance badges', () => {
      render(<DORASection {...defaultProps} />);

      // Current level badges should have appropriate styling
      const highBadges = screen.getAllByText('HIGH');
      const eliteBadges = screen.getAllByText('ELITE');

      expect(highBadges.length).toBeGreaterThan(0);
      expect(eliteBadges.length).toBeGreaterThan(0);
    });
  });

  describe('Data integration', () => {
    it('should pass correct data to charts', () => {
      render(<DORASection {...defaultProps} />);

      const areaChart = screen.getByTestId('area-chart');
      const chartData = JSON.parse(areaChart.getAttribute('data-chart-data') || '[]');

      expect(chartData).toHaveLength(6);
      expect(chartData[0]).toMatchObject({
        month: 'Oct',
        days: 28,
      });
    });

    it('should use client config for tracking tool', () => {
      render(<DORASection {...defaultProps} />);

      // Text is split across elements
      expect(screen.getAllByText('Fuente:')).toHaveLength(4);
      expect(screen.getByText(/Jira \+ GitHub API \(commit → deploy time\)/)).toBeInTheDocument();
    });

    it('should handle different tracking tools', () => {
      const customConfig = { ...mockClientConfig, trackingTool: 'Azure DevOps' };
      render(<DORASection clientConfig={customConfig} />);

      // Text is split across elements
      expect(screen.getAllByText('Fuente:')).toHaveLength(4);
      expect(
        screen.getByText(/Azure DevOps \+ GitHub API \(commit → deploy time\)/)
      ).toBeInTheDocument();
    });
  });

  describe('Layout and styling', () => {
    it('should have correct grid layout', () => {
      render(<DORASection {...defaultProps} />);

      // Use querySelector for the main container with space-y-6 class
      const container = document.querySelector('.space-y-6');
      expect(container).toBeInTheDocument();
    });

    it('should use responsive grid for DORA metrics', () => {
      render(<DORASection {...defaultProps} />);

      // Use querySelector for the grid container
      const gridContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2');
      expect(gridContainer).toBeInTheDocument();
    });

    it('should have overflow handling for table', () => {
      render(<DORASection {...defaultProps} />);

      const tableContainer = screen.getByRole('table').closest('div');
      expect(tableContainer).toHaveClass('overflow-x-auto');
    });
  });

  describe('Accessibility', () => {
    it('should have proper table structure for screen readers', () => {
      render(<DORASection {...defaultProps} />);

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();

      // Should have proper table headers
      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(6);

      // Should have proper table cells
      const cells = screen.getAllByRole('cell');
      expect(cells.length).toBeGreaterThan(0);
    });

    it('should provide clear performance level indicators', () => {
      render(<DORASection {...defaultProps} />);

      // Level indicators should be clearly labeled
      expect(screen.getAllByText('HIGH')).toHaveLength(3);
      expect(screen.getAllByText('ELITE')).toHaveLength(1);
    });
  });

  describe('Error handling', () => {
    it('should handle missing data gracefully', () => {
      expect(() => {
        render(<DORASection {...defaultProps} />);
      }).not.toThrow();
    });

    it('should handle missing client config properties', () => {
      const incompleteConfig = { ...mockClientConfig, trackingTool: '' };

      expect(() => {
        render(<DORASection clientConfig={incompleteConfig} />);
      }).not.toThrow();
    });
  });
});
