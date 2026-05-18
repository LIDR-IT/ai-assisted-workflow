import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdoptionSection } from '../AdoptionSection';
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
  ExternalLink: ({ size }: { size?: number }) => (
    <div data-testid="external-link-icon" style={{ width: size, height: size }}>
      🔗
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

describe('AdoptionSection', () => {
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
      render(<AdoptionSection clientConfig={clientConfig} />);

      expect(screen.getByTestId('chart-card')).toBeInTheDocument();
      expect(screen.getByText('Métricas de Adopción de IA')).toBeInTheDocument();
      expect(screen.getByText('Fuente de datos y acceso')).toBeInTheDocument();
    });

    it('should render assessment information', () => {
      render(<AdoptionSection clientConfig={clientConfig} />);

      expect(screen.getByText('Assessment de Adopción')).toBeInTheDocument();
      expect(
        screen.getByText(/Las métricas de adopción de IA se obtienen mediante evaluaciones/)
      ).toBeInTheDocument();
    });

    it('should render platform information', () => {
      render(<AdoptionSection clientConfig={clientConfig} />);

      expect(screen.getByText('Plataforma de Assessment')).toBeInTheDocument();
      expect(
        screen.getByText('Ver métricas y resultados directamente en la herramienta')
      ).toBeInTheDocument();
    });

    it('should render external link to assessment platform', () => {
      render(<AdoptionSection clientConfig={clientConfig} />);

      const link = screen.getByRole('link', { name: /ai-assessment.lidr.co/ });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://ai-assessment.lidr.co/');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should render icons correctly', () => {
      render(<AdoptionSection clientConfig={clientConfig} />);

      expect(screen.getByTestId('alert-circle-icon')).toBeInTheDocument();
      expect(screen.getByTestId('external-link-icon')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper link attributes', () => {
      render(<AdoptionSection clientConfig={clientConfig} />);

      const externalLink = screen.getByRole('link');
      expect(externalLink).toHaveAttribute('target', '_blank');
      expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should have informative text content', () => {
      render(<AdoptionSection clientConfig={clientConfig} />);

      expect(screen.getAllByText(/plataforma de assessment/i)).toHaveLength(2);
      expect(screen.getByText(/métricas y resultados/i)).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply correct styling classes', () => {
      const { container } = render(<AdoptionSection clientConfig={clientConfig} />);

      // Should have space-y-6 for main container
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('space-y-6');
    });

    it('should have gradient background for info section', () => {
      const { container } = render(<AdoptionSection clientConfig={clientConfig} />);

      const gradientDiv = container.querySelector('.bg-gradient-to-r');
      expect(gradientDiv).toBeInTheDocument();
      expect(gradientDiv).toHaveClass('from-blue-50', 'to-indigo-50');
    });

    it('should have correct button styling', () => {
      render(<AdoptionSection clientConfig={clientConfig} />);

      const link = screen.getByRole('link');
      expect(link).toHaveClass('bg-blue-600', 'text-white', 'hover:bg-blue-700');
    });
  });
});
