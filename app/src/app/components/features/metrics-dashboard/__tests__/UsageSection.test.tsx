import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UsageSection } from '../UsageSection';
import type { MetricsConfig } from '@/data/features/metrics/metricsData';

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  AlertCircle: ({ className, size }: { className?: string; size?: number }) => (
    <div
      data-testid="alert-circle-icon"
      className={className}
      style={{ width: size, height: size }}
    >
      ⚠️
    </div>
  ),
  Monitor: ({ size }: { size?: number }) => (
    <div data-testid="monitor-icon" style={{ width: size, height: size }}>
      🖥️
    </div>
  ),
  BarChart3: ({ size }: { size?: number }) => (
    <div data-testid="bar-chart-3-icon" style={{ width: size, height: size }}>
      📊
    </div>
  ),
}));

// Mock ChartCard component
vi.mock('../ChartCard', () => ({
  ChartCard: ({ title, subtitle, children }: any) => (
    <div data-testid="chart-card" data-title={title} data-subtitle={subtitle}>
      <h3>{title}</h3>
      {subtitle && <p>{subtitle}</p>}
      <div className="chart-content">{children}</div>
    </div>
  ),
}));

describe('UsageSection', () => {
  let clientConfig: MetricsConfig;

  beforeEach(() => {
    vi.clearAllMocks();
    clientConfig = {
      trackingTool: 'Jira',
      testingTool: 'TestRail',
      focusAreas: ['Code Quality', 'Security Compliance'],
      customMetrics: [],
    };
  });

  describe('Basic rendering', () => {
    it('should render main chart card', () => {
      render(<UsageSection clientConfig={clientConfig} />);

      expect(screen.getByTestId('chart-card')).toBeInTheDocument();
      expect(screen.getByText('Métricas de Uso de IA')).toBeInTheDocument();
      expect(screen.getByText('Fuente de datos y acceso')).toBeInTheDocument();
    });

    it('should render usage metrics information', () => {
      render(<UsageSection clientConfig={clientConfig} />);

      expect(screen.getByText('Métricas de Uso IDE/CLI')).toBeInTheDocument();
      expect(
        screen.getByText(/Las métricas de uso se obtienen directamente del IDE y Claude Code CLI/)
      ).toBeInTheDocument();
    });

    it('should render IDE metrics section', () => {
      render(<UsageSection clientConfig={clientConfig} />);

      expect(screen.getByText('IDE Integration')).toBeInTheDocument();
      expect(screen.getByText(/Métricas de uso disponibles en el IDE/)).toBeInTheDocument();
    });

    it('should render CLI metrics section', () => {
      render(<UsageSection clientConfig={clientConfig} />);

      expect(screen.getByText('Claude Code CLI')).toBeInTheDocument();
      expect(screen.getByText(/Reportes de uso y comandos ejecutados via CLI/)).toBeInTheDocument();
    });

    it('should render icons correctly', () => {
      render(<UsageSection clientConfig={clientConfig} />);

      expect(screen.getByTestId('alert-circle-icon')).toBeInTheDocument();
      expect(screen.getByTestId('monitor-icon')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart-3-icon')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have informative text content', () => {
      render(<UsageSection clientConfig={clientConfig} />);

      expect(screen.getAllByText(/métricas de uso/i)).toHaveLength(4); // Multiple instances expected
      expect(screen.getByText(/reportes de uso/i)).toBeInTheDocument();
    });

    it('should have proper headings hierarchy', () => {
      render(<UsageSection clientConfig={clientConfig} />);

      expect(screen.getByText('Métricas de Uso de IA')).toBeInTheDocument();
      expect(screen.getByText('Métricas de Uso IDE/CLI')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply correct styling classes', () => {
      const { container } = render(<UsageSection clientConfig={clientConfig} />);

      // Should have space-y-6 for main container
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('space-y-6');
    });

    it('should have gradient background for info section', () => {
      const { container } = render(<UsageSection clientConfig={clientConfig} />);

      const gradientDiv = container.querySelector('.bg-gradient-to-r');
      expect(gradientDiv).toBeInTheDocument();
      expect(gradientDiv).toHaveClass('from-emerald-50', 'to-green-50');
    });

    it('should have grid layout for metrics sections', () => {
      const { container } = render(<UsageSection clientConfig={clientConfig} />);

      const gridContainer = container.querySelector('.grid-cols-1.md\\:grid-cols-2');
      expect(gridContainer).toBeInTheDocument();
    });
  });
});
