/**
 * @file MetricsDashboard Test Suite
 * @description Tests for MetricsDashboard component with section navigation and client integration
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MetricsDashboard } from '../MetricsDashboard';
import { useCurrentClient } from '@/hooks/useClientRegistry';
import { createMockClientConfig } from '@/test/fixtures/client-factory';

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  BarChart3: ({ className, size }: { className?: string; size?: number }) => (
    <div data-testid="bar-chart-icon" className={className} style={{ width: size, height: size }}>
      📊
    </div>
  ),
  AlertTriangle: ({ size }: { size?: number }) => (
    <div data-testid="alert-triangle-icon" style={{ width: size, height: size }}>
      ⚠️
    </div>
  ),
  Cable: ({ size }: { size?: number }) => (
    <div data-testid="cable-icon" style={{ width: size, height: size }}>
      🔌
    </div>
  ),
}));

// Mock hooks
vi.mock('@/hooks/useClientRegistry', () => ({
  useCurrentClient: vi.fn(),
}));

// Mock data
vi.mock('@/data/features/metrics/metricsData', () => ({
  sections: [
    { id: 'overview', label: 'Overview' },
    { id: 'sprint', label: 'Sprint' },
    { id: 'dora', label: 'DORA' },
    { id: 'adoption', label: 'Adopción IA' },
    { id: 'uso-ia', label: 'Uso IA' },
  ],
  getClientMetricsConfig: (clientId: string) => ({
    trackingTool: clientId === 'docline' ? 'Linear' : 'Jira',
    deploymentTool: 'GitHub Actions',
    metricsSource: 'GitHub + CI/CD',
  }),
}));

// Mock section components
vi.mock('../OverviewSection', () => ({
  OverviewSection: ({ clientConfig }: { clientConfig: any }) => (
    <div data-testid="overview-section">Overview Section - {clientConfig.trackingTool}</div>
  ),
}));

vi.mock('../SprintSection', () => ({
  SprintSection: ({ clientConfig }: { clientConfig: any }) => (
    <div data-testid="sprint-section">Sprint Section - {clientConfig.trackingTool}</div>
  ),
}));

vi.mock('../DORASection', () => ({
  DORASection: ({ clientConfig }: { clientConfig: any }) => (
    <div data-testid="dora-section">DORA Section - {clientConfig.trackingTool}</div>
  ),
}));

vi.mock('../AdoptionSection', () => ({
  AdoptionSection: ({ clientConfig }: { clientConfig: any }) => (
    <div data-testid="adoption-section">Adoption Section - {clientConfig.trackingTool}</div>
  ),
}));

vi.mock('../UsageSection', () => ({
  UsageSection: ({ clientConfig }: { clientConfig: any }) => (
    <div data-testid="usage-section">Usage Section - {clientConfig.trackingTool}</div>
  ),
}));

describe('MetricsDashboard', () => {
  const mockUseCurrentClient = vi.mocked(useCurrentClient);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCurrentClient.mockReturnValue({
      clientId: 'facephi',
      client: createMockClientConfig({
        name: 'FacePhi',
        fullName: 'FacePhi Technologies',
        industry: 'Biometric Identity Verification',
      }),
    });
  });

  describe('Basic Rendering', () => {
    it('renders all main sections', () => {
      render(<MetricsDashboard />);

      // Should have header, navigation, and content
      expect(screen.getByTestId('bar-chart-icon')).toBeInTheDocument();
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByTestId('overview-section')).toBeInTheDocument();
    });

    it('renders with correct spacing', () => {
      const { container } = render(<MetricsDashboard />);

      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('space-y-6');
    });
  });

  describe('Header Section', () => {
    it('renders header with client name', () => {
      render(<MetricsDashboard />);

      expect(screen.getByText('Dashboard Unificado de Métricas - FacePhi')).toBeInTheDocument();
    });

    it('handles missing client gracefully', () => {
      mockUseCurrentClient.mockReturnValue({
        clientId: '',
        client: null as any, // Intentionally null for testing error handling
      });

      render(<MetricsDashboard />);

      expect(screen.getByText('Dashboard Unificado de Métricas - Cliente')).toBeInTheDocument();
    });

    it('renders header icons', () => {
      render(<MetricsDashboard />);

      expect(screen.getByTestId('bar-chart-icon')).toBeInTheDocument();
      expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument();
      expect(screen.getByTestId('cable-icon')).toBeInTheDocument();
    });

    it('applies correct styling to header', () => {
      const { container } = render(<MetricsDashboard />);

      const header = container.querySelector('.bg-gradient-to-r.from-indigo-50.to-violet-50');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('border-2', 'border-indigo-200', 'rounded-xl', 'p-5');
    });

    it('renders data source information', () => {
      render(<MetricsDashboard />);

      expect(screen.getByText(/Jira MCP/)).toBeInTheDocument();
      expect(screen.getByText(/GitHub CLI/)).toBeInTheDocument();
      expect(screen.getByText(/CI\/CD pipeline/)).toBeInTheDocument();
    });

    it('shows warning badges', () => {
      render(<MetricsDashboard />);

      expect(
        screen.getByText(/Datos de ejemplo — no representan métricas reales del proyecto/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Fuentes: Jira \+ GitHub \+ CI\/CD \+ LIDR \+ IDE\/CLI/)
      ).toBeInTheDocument();
    });
  });

  describe('Client Integration', () => {
    it('handles FacePhi client configuration', () => {
      render(<MetricsDashboard />);

      expect(screen.getByText(/Jira MCP/)).toBeInTheDocument();
      expect(screen.getByText('Dashboard Unificado de Métricas - FacePhi')).toBeInTheDocument();
    });

    it('handles Docline client configuration', () => {
      mockUseCurrentClient.mockReturnValue({
        clientId: 'docline',
        client: createMockClientConfig({
          name: 'Docline',
          fullName: 'Docline Healthcare Technology',
          industry: 'Healthcare Technology',
        }),
      });

      render(<MetricsDashboard />);

      expect(screen.getByText(/Linear MCP/)).toBeInTheDocument();
      expect(screen.getByText('Dashboard Unificado de Métricas - Docline')).toBeInTheDocument();
    });

    it('shows client-specific IA assessment information', () => {
      mockUseCurrentClient.mockReturnValue({
        clientId: 'docline',
        client: createMockClientConfig({
          name: 'Docline',
          fullName: 'Docline Healthcare Technology',
          industry: 'Healthcare Technology',
        }),
      });

      render(<MetricsDashboard />);

      expect(screen.getByText(/ai-assessment\.lidr\.co/)).toBeInTheDocument();
    });
  });

  describe('Section Navigation', () => {
    it('renders all navigation tabs', () => {
      render(<MetricsDashboard />);

      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Sprint')).toBeInTheDocument();
      expect(screen.getByText('DORA')).toBeInTheDocument();
      expect(screen.getByText('Adopción IA')).toBeInTheDocument();
      expect(screen.getByText('Uso IA')).toBeInTheDocument();
    });

    it('shows overview section as active by default', () => {
      render(<MetricsDashboard />);

      const overviewButton = screen.getByText('Overview');
      expect(overviewButton).toHaveClass('bg-white', 'text-indigo-700', 'font-semibold');
      expect(screen.getByTestId('overview-section')).toBeInTheDocument();
    });

    it('applies correct styling to navigation container', () => {
      const { container } = render(<MetricsDashboard />);

      const navContainer = container.querySelector('.flex.gap-1.bg-slate-100.rounded-lg.p-1');
      expect(navContainer).toBeInTheDocument();
    });

    it('applies correct styling to active tab', () => {
      render(<MetricsDashboard />);

      const activeTab = screen.getByText('Overview');
      expect(activeTab).toHaveClass('bg-white', 'text-indigo-700', 'font-semibold', 'shadow-sm');
    });

    it('applies correct styling to inactive tabs', () => {
      render(<MetricsDashboard />);

      const inactiveTab = screen.getByText('Sprint');
      expect(inactiveTab).toHaveClass('text-slate-500', 'hover:text-slate-700');
    });
  });

  describe('Section Switching', () => {
    it('switches to sprint section when clicked', () => {
      render(<MetricsDashboard />);

      const sprintButton = screen.getByText('Sprint');
      fireEvent.click(sprintButton);

      expect(sprintButton).toHaveClass('bg-white', 'text-indigo-700', 'font-semibold');
      expect(screen.getByTestId('sprint-section')).toBeInTheDocument();
      expect(screen.queryByTestId('overview-section')).not.toBeInTheDocument();
    });

    it('switches to DORA section when clicked', () => {
      render(<MetricsDashboard />);

      const doraButton = screen.getByText('DORA');
      fireEvent.click(doraButton);

      expect(doraButton).toHaveClass('bg-white', 'text-indigo-700', 'font-semibold');
      expect(screen.getByTestId('dora-section')).toBeInTheDocument();
      expect(screen.queryByTestId('overview-section')).not.toBeInTheDocument();
    });

    it('switches to adoption section when clicked', () => {
      render(<MetricsDashboard />);

      const adoptionButton = screen.getByText('Adopción IA');
      fireEvent.click(adoptionButton);

      expect(adoptionButton).toHaveClass('bg-white', 'text-indigo-700', 'font-semibold');
      expect(screen.getByTestId('adoption-section')).toBeInTheDocument();
      expect(screen.queryByTestId('overview-section')).not.toBeInTheDocument();
    });

    it('switches to usage section when clicked', () => {
      render(<MetricsDashboard />);

      const usageButton = screen.getByText('Uso IA');
      fireEvent.click(usageButton);

      expect(usageButton).toHaveClass('bg-white', 'text-indigo-700', 'font-semibold');
      expect(screen.getByTestId('usage-section')).toBeInTheDocument();
      expect(screen.queryByTestId('overview-section')).not.toBeInTheDocument();
    });

    it('switches back to overview section', () => {
      render(<MetricsDashboard />);

      // Switch to another section first
      const sprintButton = screen.getByText('Sprint');
      fireEvent.click(sprintButton);
      expect(screen.getByTestId('sprint-section')).toBeInTheDocument();

      // Switch back to overview
      const overviewButton = screen.getByText('Overview');
      fireEvent.click(overviewButton);
      expect(screen.getByTestId('overview-section')).toBeInTheDocument();
      expect(screen.queryByTestId('sprint-section')).not.toBeInTheDocument();
    });

    it('maintains only one active section at a time', () => {
      render(<MetricsDashboard />);

      // Click through multiple sections
      fireEvent.click(screen.getByText('Sprint'));
      fireEvent.click(screen.getByText('DORA'));
      fireEvent.click(screen.getByText('Adopción IA'));

      // Only adoption should be active
      expect(screen.getByText('Adopción IA')).toHaveClass('bg-white', 'text-indigo-700');
      expect(screen.getByText('Overview')).not.toHaveClass('bg-white', 'text-indigo-700');
      expect(screen.getByText('Sprint')).not.toHaveClass('bg-white', 'text-indigo-700');
      expect(screen.getByText('DORA')).not.toHaveClass('bg-white', 'text-indigo-700');

      // Only adoption content should be visible
      expect(screen.getByTestId('adoption-section')).toBeInTheDocument();
      expect(screen.queryByTestId('overview-section')).not.toBeInTheDocument();
      expect(screen.queryByTestId('sprint-section')).not.toBeInTheDocument();
      expect(screen.queryByTestId('dora-section')).not.toBeInTheDocument();
    });
  });

  describe('Section Component Integration', () => {
    it('passes clientConfig to overview section', () => {
      render(<MetricsDashboard />);

      expect(screen.getByTestId('overview-section')).toHaveTextContent('Jira');
    });

    it('passes clientConfig to sprint section', () => {
      render(<MetricsDashboard />);

      fireEvent.click(screen.getByText('Sprint'));
      expect(screen.getByTestId('sprint-section')).toHaveTextContent('Jira');
    });

    it('passes clientConfig with Linear for Docline', () => {
      mockUseCurrentClient.mockReturnValue({
        clientId: 'docline',
        client: createMockClientConfig({
          name: 'Docline',
          fullName: 'Docline Healthcare Technology',
          industry: 'Healthcare Technology',
        }),
      });

      render(<MetricsDashboard />);

      expect(screen.getByTestId('overview-section')).toHaveTextContent('Linear');
    });
  });

  describe('Icons and Visual Elements', () => {
    it('renders all required icons', () => {
      render(<MetricsDashboard />);

      expect(screen.getByTestId('bar-chart-icon')).toBeInTheDocument();
      expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument();
      expect(screen.getByTestId('cable-icon')).toBeInTheDocument();
    });

    it('applies correct styling to main icon', () => {
      render(<MetricsDashboard />);

      const barChartIcon = screen.getByTestId('bar-chart-icon');
      expect(barChartIcon).toHaveClass('text-indigo-600');
      expect(barChartIcon).toHaveStyle({ width: '24px', height: '24px' });
    });

    it('renders small icons in badges', () => {
      render(<MetricsDashboard />);

      const alertIcon = screen.getByTestId('alert-triangle-icon');
      const cableIcon = screen.getByTestId('cable-icon');

      expect(alertIcon).toHaveStyle({ width: '10px', height: '10px' });
      expect(cableIcon).toHaveStyle({ width: '10px', height: '10px' });
    });
  });

  describe('Badge Styling', () => {
    it('applies correct styling to warning badge', () => {
      const { container } = render(<MetricsDashboard />);

      const warningBadge = container.querySelector('.bg-amber-100.border.border-amber-300');
      expect(warningBadge).toBeInTheDocument();
      expect(warningBadge).toHaveClass('text-amber-800');
    });

    it('applies correct styling to sources badge', () => {
      const { container } = render(<MetricsDashboard />);

      const sourcesBadge = container.querySelector('.bg-violet-100.border.border-violet-300');
      expect(sourcesBadge).toBeInTheDocument();
      expect(sourcesBadge).toHaveClass('text-violet-800');
    });
  });

  describe('Accessibility', () => {
    it('provides proper heading hierarchy', () => {
      render(<MetricsDashboard />);

      expect(screen.getByText('Dashboard Unificado de Métricas - FacePhi')).toBeInTheDocument();
    });

    it('provides meaningful button labels for navigation', () => {
      render(<MetricsDashboard />);

      const buttons = ['Overview', 'Sprint', 'DORA', 'Adopción IA', 'Uso IA'];
      buttons.forEach((buttonText) => {
        const button = screen.getByText(buttonText);
        expect(button.tagName).toBe('BUTTON');
      });
    });

    it('includes descriptive text for data sources', () => {
      render(<MetricsDashboard />);

      expect(screen.getByText(/Métricas Sprint y DORA con datos mock/)).toBeInTheDocument();
    });

    it('provides context about data limitations', () => {
      render(<MetricsDashboard />);

      expect(
        screen.getByText(/Datos de ejemplo — no representan métricas reales del proyecto/)
      ).toBeInTheDocument();
    });
  });

  describe('Performance and State Management', () => {
    it('maintains state correctly during navigation', () => {
      render(<MetricsDashboard />);

      // Start with overview
      expect(screen.getByTestId('overview-section')).toBeInTheDocument();

      // Switch sections multiple times
      fireEvent.click(screen.getByText('Sprint'));
      expect(screen.getByTestId('sprint-section')).toBeInTheDocument();

      fireEvent.click(screen.getByText('DORA'));
      expect(screen.getByTestId('dora-section')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Overview'));
      expect(screen.getByTestId('overview-section')).toBeInTheDocument();
    });

    it('handles rapid section switching without errors', () => {
      render(<MetricsDashboard />);

      // Rapidly switch between sections
      const sections = ['Sprint', 'DORA', 'Adopción IA', 'Uso IA', 'Overview'];

      sections.forEach((section) => {
        fireEvent.click(screen.getByText(section));
        expect(screen.getByText(section)).toHaveClass('bg-white', 'text-indigo-700');
      });
    });

    it('renders consistently across multiple renders', () => {
      const { rerender } = render(<MetricsDashboard />);

      const firstRender = screen.getByTestId('overview-section');
      expect(firstRender).toBeInTheDocument();

      rerender(<MetricsDashboard />);

      const secondRender = screen.getByTestId('overview-section');
      expect(secondRender).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles component rendering without errors', () => {
      expect(() => render(<MetricsDashboard />)).not.toThrow();
    });

    it('handles missing client ID gracefully', () => {
      mockUseCurrentClient.mockReturnValue({
        clientId: '', // Missing clientId for error handling test
        client: createMockClientConfig({
          name: 'Test Client',
          fullName: 'Test Client Organization',
        }),
      });

      expect(() => render(<MetricsDashboard />)).not.toThrow();
    });

    it('handles component unmounting without errors', () => {
      const { unmount } = render(<MetricsDashboard />);

      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Content Container', () => {
    it('renders content container with correct spacing', () => {
      render(<MetricsDashboard />);

      const contentContainer = screen.getByTestId('overview-section').parentElement;
      expect(contentContainer).toHaveClass('space-y-6');
    });

    it('shows only one section content at a time', () => {
      render(<MetricsDashboard />);

      // Initially only overview should be shown
      expect(screen.getByTestId('overview-section')).toBeInTheDocument();
      expect(screen.queryByTestId('sprint-section')).not.toBeInTheDocument();
      expect(screen.queryByTestId('dora-section')).not.toBeInTheDocument();
      expect(screen.queryByTestId('adoption-section')).not.toBeInTheDocument();
      expect(screen.queryByTestId('usage-section')).not.toBeInTheDocument();
    });
  });
});
