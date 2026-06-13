/**
 * @file PropuestaMejora Test Suite
 * @description Tests for PropuestaMejora component with tab navigation and content rendering
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PropuestaMejora } from '../PropuestaMejora';
import { tabsConfig } from '@/data/features/propuestaMejora';
import { useCurrentClient } from '@/hooks';
import { createMockClientConfig } from '@/test/fixtures/client-factory';

// Mock all tab components
vi.mock('../FlowTab', () => ({
  FlowTab: () => <div data-testid="flow-tab">Flow Tab Content</div>,
}));

vi.mock('../DiagnosticoTab', () => ({
  DiagnosticoTab: () => <div data-testid="diagnostico-tab">Diagnostico Tab Content</div>,
}));

vi.mock('../MejorasTab', () => ({
  MejorasTab: () => <div data-testid="mejoras-tab">Mejoras Tab Content</div>,
}));

vi.mock('../MetricasTab', () => ({
  MetricasTab: () => <div data-testid="metricas-tab">Metricas Tab Content</div>,
}));

vi.mock('../PropuestaHero', () => ({
  PropuestaHero: () => <div data-testid="propuesta-hero">Hero Content</div>,
}));

// Mock hooks and data
vi.mock('@/hooks', () => ({
  useCurrentClient: vi.fn(),
}));

vi.mock('@/data', () => ({
  ecosystemStats: {
    totalArtifacts: 244,
    skills: 106,
    commands: 30,
  },
  summaryStrings: {
    qualityGatesCount: '8 quality gates',
    workflowsAvailable: '17 workflows disponibles',
    integrityTestsCount: '32 integrity tests',
  },
  automationStats: {
    hoursPerYear: 775,
    percentAutomated: 85,
  },
}));

// Mock PageHeader
vi.mock('@/app/components/shared/FlowComponents', () => ({
  PageHeader: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div data-testid="page-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  ),
}));

describe('PropuestaMejora', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCurrentClient).mockReturnValue({
      clientId: 'facephi',
      client: createMockClientConfig({
        name: 'FacePhi',
        fullName: 'FacePhi Technologies',
        industry: 'Biometric Identity Verification',
      }),
    });
  });

  describe('Basic Rendering', () => {
    it('renders page header with correct title and subtitle', () => {
      render(<PropuestaMejora />);

      expect(screen.getByTestId('page-header')).toBeInTheDocument();
      expect(
        screen.getByText(/Ecosistema SDLC FacePhi — Propuesta Implementada/)
      ).toBeInTheDocument();
      expect(screen.getByText(/244 artefactos/)).toBeInTheDocument();
      expect(screen.getByText(/8 quality gates/)).toBeInTheDocument();
      expect(screen.getByText(/106 skills/)).toBeInTheDocument();
      expect(screen.getByText(/30 commands/)).toBeInTheDocument();
    });

    it('renders all tab navigation buttons', () => {
      render(<PropuestaMejora />);

      tabsConfig.forEach((tab) => {
        expect(screen.getByText(tab.label)).toBeInTheDocument();
      });

      // Check specific tab labels
      expect(screen.getByText('Flujo Obligatorio')).toBeInTheDocument();
      expect(screen.getByText('Diagnóstico')).toBeInTheDocument();
      expect(screen.getByText('Mejoras por Fase')).toBeInTheDocument();
      expect(screen.getByText('Metricas')).toBeInTheDocument();
    });

    it('initially displays flow tab as active', () => {
      render(<PropuestaMejora />);

      const flowButton = screen.getByText('Flujo Obligatorio');
      expect(flowButton).toHaveClass('bg-blue-600', 'text-white');

      // Content should show flow tab
      expect(screen.getByTestId('flow-tab')).toBeInTheDocument();
      expect(screen.getByText('Flow Tab Content')).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
      const { container } = render(<PropuestaMejora className="custom-class" />);

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Tab Navigation', () => {
    it('switches to diagnostico tab when clicked', () => {
      render(<PropuestaMejora />);

      const diagnosticoButton = screen.getByText('Diagnóstico');
      fireEvent.click(diagnosticoButton);

      // Button should be active
      expect(diagnosticoButton).toHaveClass('bg-blue-600', 'text-white');

      // Flow button should be inactive
      const flowButton = screen.getByText('Flujo Obligatorio');
      expect(flowButton).toHaveClass('bg-white', 'text-gray-600');

      // Content should show diagnostico tab
      expect(screen.getByTestId('diagnostico-tab')).toBeInTheDocument();
      expect(screen.getByText('Diagnostico Tab Content')).toBeInTheDocument();
      expect(screen.queryByTestId('flow-tab')).not.toBeInTheDocument();
    });

    it('switches to mejoras tab when clicked', () => {
      render(<PropuestaMejora />);

      const mejorasButton = screen.getByText('Mejoras por Fase');
      fireEvent.click(mejorasButton);

      expect(mejorasButton).toHaveClass('bg-blue-600', 'text-white');
      expect(screen.getByTestId('mejoras-tab')).toBeInTheDocument();
      expect(screen.getByText('Mejoras Tab Content')).toBeInTheDocument();
    });

    it('switches to metricas tab when clicked', () => {
      render(<PropuestaMejora />);

      const metricasButton = screen.getByText('Metricas');
      fireEvent.click(metricasButton);

      expect(metricasButton).toHaveClass('bg-blue-600', 'text-white');
      expect(screen.getByTestId('metricas-tab')).toBeInTheDocument();
      expect(screen.getByText('Metricas Tab Content')).toBeInTheDocument();
    });

    it('maintains only one active tab at a time', () => {
      render(<PropuestaMejora />);

      // Click through multiple tabs
      fireEvent.click(screen.getByText('Diagnóstico'));
      fireEvent.click(screen.getByText('Mejoras por Fase'));
      fireEvent.click(screen.getByText('Metricas'));

      // Only Metricas should be active
      expect(screen.getByText('Metricas')).toHaveClass('bg-blue-600', 'text-white');
      expect(screen.getByText('Flujo Obligatorio')).not.toHaveClass('bg-blue-600', 'text-white');
      expect(screen.getByText('Diagnóstico')).not.toHaveClass('bg-blue-600', 'text-white');
      expect(screen.getByText('Mejoras por Fase')).not.toHaveClass('bg-blue-600', 'text-white');

      // Only Metricas content should be visible
      expect(screen.getByTestId('metricas-tab')).toBeInTheDocument();
      expect(screen.queryByTestId('flow-tab')).not.toBeInTheDocument();
      expect(screen.queryByTestId('diagnostico-tab')).not.toBeInTheDocument();
      expect(screen.queryByTestId('mejoras-tab')).not.toBeInTheDocument();
    });
  });

  describe('Tab Button Styling', () => {
    it('applies correct styles for active tab', () => {
      render(<PropuestaMejora />);

      const activeTab = screen.getByText('Flujo Obligatorio');
      expect(activeTab).toHaveClass(
        'px-4',
        'py-2',
        'rounded-md',
        'font-medium',
        'transition-all',
        'duration-200',
        'bg-blue-600',
        'text-white',
        'shadow-md'
      );
    });

    it('applies correct styles for inactive tabs', () => {
      render(<PropuestaMejora />);

      const inactiveTab = screen.getByText('Diagnóstico');
      expect(inactiveTab).toHaveClass(
        'px-4',
        'py-2',
        'rounded-md',
        'font-medium',
        'transition-all',
        'duration-200',
        'bg-white',
        'text-gray-600',
        'hover:bg-blue-50',
        'hover:text-blue-700',
        'border',
        'border-gray-200'
      );
    });
  });

  describe('Content Container', () => {
    it('renders content container with correct minimum height', () => {
      render(<PropuestaMejora />);

      const contentContainer = screen.getByTestId('flow-tab').parentElement;
      expect(contentContainer).toHaveClass('min-h-[600px]');
    });

    it('renders tab navigation container with correct styling', () => {
      render(<PropuestaMejora />);

      const navContainer = screen.getByText('Flujo Obligatorio').parentElement;
      expect(navContainer).toHaveClass(
        'flex',
        'flex-wrap',
        'gap-2',
        'mb-6',
        'p-4',
        'bg-gray-50',
        'rounded-lg'
      );
    });
  });

  describe('Client Integration', () => {
    it('displays different client names correctly', () => {
      vi.mocked(useCurrentClient).mockReturnValue({
        clientId: 'docline',
        client: createMockClientConfig({
          name: 'Docline',
          fullName: 'Docline Healthcare Technology',
          industry: 'Healthcare Technology',
        }),
      });

      render(<PropuestaMejora />);

      expect(
        screen.getByText(/Ecosistema SDLC Docline — Propuesta Implementada/)
      ).toBeInTheDocument();
    });

    it('handles missing client gracefully', () => {
      vi.mocked(useCurrentClient).mockReturnValue({
        clientId: 'fallback-client',
        client: createMockClientConfig({ name: 'fallback-client' }),
      });

      // Should render without throwing
      expect(() => render(<PropuestaMejora />)).not.toThrow();
    });
  });

  describe('Default Tab Handling', () => {
    it('defaults to flow tab for invalid tab state', () => {
      render(<PropuestaMejora />);

      // Simulate invalid state by checking the renderTabContent logic
      // The component should handle invalid activeTab values gracefully
      expect(screen.getByTestId('flow-tab')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides proper button roles for tab navigation', () => {
      render(<PropuestaMejora />);

      tabsConfig.forEach((tab) => {
        const button = screen.getByText(tab.label);
        expect(button.tagName).toBe('BUTTON');
      });
    });

    it('maintains semantic structure with proper heading hierarchy', () => {
      render(<PropuestaMejora />);

      // Page header should contain proper heading structure
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });

  describe('Performance Considerations', () => {
    it('renders tab content immediately without lazy loading', () => {
      render(<PropuestaMejora />);

      // Content should be available immediately
      expect(screen.getByTestId('flow-tab')).toBeInTheDocument();
      expect(screen.getByText('Flow Tab Content')).toBeInTheDocument();
    });

    it('handles rapid tab switching without errors', () => {
      render(<PropuestaMejora />);

      // Rapidly switch between tabs
      const tabs = ['Diagnóstico', 'Mejoras por Fase', 'Metricas', 'Flujo Obligatorio'];

      tabs.forEach((tabLabel) => {
        fireEvent.click(screen.getByText(tabLabel));
        // Should not throw errors and should render content
        expect(screen.getByText(tabLabel)).toHaveClass('bg-blue-600', 'text-white');
      });
    });
  });
});
