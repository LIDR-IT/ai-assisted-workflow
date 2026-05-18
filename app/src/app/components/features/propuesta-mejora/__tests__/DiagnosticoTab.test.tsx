/**
 * @file DiagnosticoTab Test Suite
 * @description Tests for DiagnosticoTab component with diagnostic analysis and pain points
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DiagnosticoTab } from '../DiagnosticoTab';
import { useCurrentClient } from '@/hooks';
import { createMockClientConfig } from '@/test/fixtures/client-factory';

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  AlertTriangle: ({ className, size }: { className?: string; size?: number }) => (
    <div
      data-testid="alert-triangle-icon"
      className={className}
      style={{ width: size, height: size }}
    >
      ⚠️
    </div>
  ),
  CheckCircle2: ({ className, size }: { className?: string; size?: number }) => (
    <div
      data-testid="check-circle-icon"
      className={className}
      style={{ width: size, height: size }}
    >
      ✅
    </div>
  ),
  Loader2: ({ className, size }: { className?: string; size?: number }) => (
    <div data-testid="loader-icon" className={className} style={{ width: size, height: size }}>
      ⏳
    </div>
  ),
  AlertOctagon: ({ className, size }: { className?: string; size?: number }) => (
    <div
      data-testid="alert-octagon-icon"
      className={className}
      style={{ width: size, height: size }}
    >
      🛑
    </div>
  ),
}));

// Provide a valid Diagnostico JSON so the renderer mounts.
// Renderer-internal logic is covered by separate DiagnosticoRenderer tests.
const mockDiagnosticoContent = {
  metadata: {
    id: 'test-diagnostico',
    title: 'Test Diagnóstico',
    version: '1.0.0',
    client: 'Test',
    industry: 'Software Development',
    tags: [],
  },
  summary: {
    executiveSummary:
      'Análisis del estado actual del ecosistema SDLC con identificación de fortalezas y oportunidades de mejora.',
    fortalezas: [
      '• Sprint Planning establecido (2 semanas, refinamiento martes)',
      '• Teams front/back organizados con Tech Leads (Héctor/David)',
      '• Linear + Slack operativos, estimación Story Points',
      '• PO definido (Danny) y estructura horizontal funcional',
    ],
    oportunidades: [
      '• Formalizar PRDs con skills prd-funcional/prd-tecnico',
      '• Extraer RFs desde PRDs con skill generate-rf',
      '• QA proactivo con test-plan + create-test-cases',
      '• Adaptar Linear integration para commands LIDR',
    ],
    gapsCriticos: [
      '• PRDs inconsistentes: "No siempre lo conseguimos"',
      '• RFs mezclados en PRD, sin separación formal',
      '• QA reactivo: "A veces saltan problemas"',
      '• Procesos "artesanales", "no está estandarizado"',
    ],
  },
  painPoints: [
    {
      fase: 'Discovery & PRD',
      problema: 'Documentación dispersa entre diferentes herramientas',
      impacto: 'Crítico' as const,
      mejora: 'Centralización en Confluence con templates estándar',
    },
    {
      fase: 'Desarrollo',
      problema: 'Procesos manuales de handoff QA',
      impacto: 'Alto' as const,
      mejora: 'Automatización con skills y hooks de Claude Code',
    },
    {
      fase: 'Testing',
      problema: 'Test cases dispersos y sin trazabilidad',
      impacto: 'Medio' as const,
      mejora: 'Integración con Xray y BDD automático',
    },
    {
      fase: 'Despliegue',
      problema: 'Release notes manuales inconsistentes',
      impacto: 'Bajo' as const,
      mejora: 'Generación automática desde PRs',
    },
  ],
};

vi.mock('@/hooks/usePropuestaContent', () => ({
  usePropuestaContent: () => ({
    data: mockDiagnosticoContent,
    isLoading: false,
    isError: false,
    error: null,
    notFound: false,
    reload: () => {},
  }),
}));

// Mock shared components
vi.mock('@/app/components/shared/FlowComponents', () => ({
  SectionBox: ({
    title,
    icon,
    bgColor,
    borderColor,
    children,
  }: {
    title: string;
    icon: React.ReactNode;
    bgColor: string;
    borderColor: string;
    children: React.ReactNode;
  }) => (
    <div data-testid="section-box" className={`${bgColor} ${borderColor}`}>
      <h3>{title}</h3>
      {icon}
      {children}
    </div>
  ),
}));

// Mock hooks
vi.mock('@/hooks', () => ({
  useCurrentClient: vi.fn(),
}));

// Mock data
vi.mock('@/data/features/propuestaMejora', () => ({
  diagnosticoTabData: {
    executiveSummary:
      'Análisis del estado actual del ecosistema SDLC con identificación de fortalezas y oportunidades de mejora.',
    painPoints: [
      {
        fase: 'Discovery & PRD',
        problema: 'Documentación dispersa entre diferentes herramientas',
        impacto: 'Crítico',
        mejora: 'Centralización en Confluence con templates estándar',
      },
      {
        fase: 'Desarrollo',
        problema: 'Procesos manuales de handoff QA',
        impacto: 'Alto',
        mejora: 'Automatización con skills y hooks de Claude Code',
      },
      {
        fase: 'Testing',
        problema: 'Test cases dispersos y sin trazabilidad',
        impacto: 'Medio',
        mejora: 'Integración con Xray y BDD automático',
      },
      {
        fase: 'Despliegue',
        problema: 'Release notes manuales inconsistentes',
        impacto: 'Bajo',
        mejora: 'Generación automática desde PRs',
      },
    ],
  },
}));

describe('DiagnosticoTab', () => {
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
      render(<DiagnosticoTab />);

      const sectionBoxes = screen.getAllByTestId('section-box');
      expect(sectionBoxes).toHaveLength(2);
    });

    it('renders with correct spacing', () => {
      const { container } = render(<DiagnosticoTab />);

      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('space-y-6');
    });
  });

  describe('Executive Summary Section', () => {
    it('renders section with dynamic client name', () => {
      render(<DiagnosticoTab />);

      expect(screen.getByText('Ecosistema SDLC FacePhi — Estado Actual')).toBeInTheDocument();
    });

    it('renders executive summary text', () => {
      render(<DiagnosticoTab />);

      expect(
        screen.getByText(/Análisis del estado actual del ecosistema SDLC/)
      ).toBeInTheDocument();
    });

    it('renders all three analysis columns', () => {
      render(<DiagnosticoTab />);

      expect(screen.getByText('Fortalezas')).toBeInTheDocument();
      expect(screen.getByText('Oportunidades')).toBeInTheDocument();
      expect(screen.getByText('Gaps Críticos')).toBeInTheDocument();
    });

    it('renders fortalezas content', () => {
      render(<DiagnosticoTab />);

      expect(
        screen.getByText('• Sprint Planning establecido (2 semanas, refinamiento martes)')
      ).toBeInTheDocument();
      expect(
        screen.getByText('• Teams front/back organizados con Tech Leads (Héctor/David)')
      ).toBeInTheDocument();
      expect(
        screen.getByText('• Linear + Slack operativos, estimación Story Points')
      ).toBeInTheDocument();
      expect(
        screen.getByText('• PO definido (Danny) y estructura horizontal funcional')
      ).toBeInTheDocument();
    });

    it('renders oportunidades content', () => {
      render(<DiagnosticoTab />);

      expect(
        screen.getByText('• Formalizar PRDs con skills prd-funcional/prd-tecnico')
      ).toBeInTheDocument();
      expect(
        screen.getByText('• Extraer RFs desde PRDs con skill generate-rf')
      ).toBeInTheDocument();
      expect(
        screen.getByText('• QA proactivo con test-plan + create-test-cases')
      ).toBeInTheDocument();
      expect(
        screen.getByText('• Adaptar Linear integration para commands LIDR')
      ).toBeInTheDocument();
    });

    it('renders gaps críticos content', () => {
      render(<DiagnosticoTab />);

      expect(
        screen.getByText('• PRDs inconsistentes: "No siempre lo conseguimos"')
      ).toBeInTheDocument();
      expect(screen.getByText('• RFs mezclados en PRD, sin separación formal')).toBeInTheDocument();
      expect(screen.getByText('• QA reactivo: "A veces saltan problemas"')).toBeInTheDocument();
      expect(
        screen.getByText('• Procesos "artesanales", "no está estandarizado"')
      ).toBeInTheDocument();
    });

    it('renders icons for each column', () => {
      render(<DiagnosticoTab />);

      expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
      expect(screen.getAllByTestId('alert-triangle-icon')).toHaveLength(2); // Oportunidades + Gaps
    });

    it('applies correct styling to columns', () => {
      const { container } = render(<DiagnosticoTab />);

      const grid = container.querySelector('.grid.md\\:grid-cols-3');
      expect(grid).toBeInTheDocument();

      const whiteCards = container.querySelectorAll('.bg-white.p-4.rounded-lg');
      expect(whiteCards.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Pain Points Analysis Section', () => {
    it('renders section with correct title and description', () => {
      render(<DiagnosticoTab />);

      expect(screen.getByText('Análisis de Pain Points por Fase')).toBeInTheDocument();
      expect(
        screen.getByText(/Identificación de problemas críticos y propuestas de mejora/)
      ).toBeInTheDocument();
    });

    it('renders all pain points from data', () => {
      render(<DiagnosticoTab />);

      // Based on mock data
      expect(screen.getByText('Discovery & PRD')).toBeInTheDocument();
      expect(screen.getByText('Desarrollo')).toBeInTheDocument();
      expect(screen.getByText('Testing')).toBeInTheDocument();
      expect(screen.getByText('Despliegue')).toBeInTheDocument();
    });

    it('renders problem descriptions', () => {
      render(<DiagnosticoTab />);

      expect(
        screen.getByText('Documentación dispersa entre diferentes herramientas')
      ).toBeInTheDocument();
      expect(screen.getByText('Procesos manuales de handoff QA')).toBeInTheDocument();
      expect(screen.getByText('Test cases dispersos y sin trazabilidad')).toBeInTheDocument();
      expect(screen.getByText('Release notes manuales inconsistentes')).toBeInTheDocument();
    });

    it('renders solution proposals', () => {
      render(<DiagnosticoTab />);

      expect(
        screen.getByText('Centralización en Confluence con templates estándar')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Automatización con skills y hooks de Claude Code')
      ).toBeInTheDocument();
      expect(screen.getByText('Integración con Xray y BDD automático')).toBeInTheDocument();
      expect(screen.getByText('Generación automática desde PRs')).toBeInTheDocument();
    });

    it('renders impact badges with correct colors', () => {
      render(<DiagnosticoTab />);

      expect(screen.getByText('Crítico')).toBeInTheDocument();
      expect(screen.getByText('Alto')).toBeInTheDocument();
      expect(screen.getByText('Medio')).toBeInTheDocument();
      expect(screen.getByText('Bajo')).toBeInTheDocument();
    });

    it('applies hover effects to pain point cards', () => {
      const { container } = render(<DiagnosticoTab />);

      const painPointCards = container.querySelectorAll('.hover\\:shadow-md');
      expect(painPointCards.length).toBeGreaterThan(0);
    });
  });

  describe('Impact Color Function', () => {
    it('applies correct styling for Crítico impact', () => {
      render(<DiagnosticoTab />);

      const criticoBadge = screen.getByText('Crítico');
      expect(criticoBadge).toHaveClass('bg-red-50', 'border-red-300', 'text-red-800');
    });

    it('applies correct styling for Alto impact', () => {
      render(<DiagnosticoTab />);

      const altoBadge = screen.getByText('Alto');
      expect(altoBadge).toHaveClass('bg-orange-50', 'border-orange-300', 'text-orange-800');
    });

    it('applies correct styling for Medio impact', () => {
      render(<DiagnosticoTab />);

      const medioBadge = screen.getByText('Medio');
      expect(medioBadge).toHaveClass('bg-yellow-50', 'border-yellow-300', 'text-yellow-800');
    });

    it('applies correct styling for Bajo impact', () => {
      render(<DiagnosticoTab />);

      const bajoBadge = screen.getByText('Bajo');
      expect(bajoBadge).toHaveClass('bg-blue-50', 'border-blue-300', 'text-blue-800');
    });
  });

  describe('Client Integration', () => {
    it('handles different client names correctly', () => {
      mockUseCurrentClient.mockReturnValue({
        clientId: 'docline',
        client: createMockClientConfig({
          name: 'Docline',
          fullName: 'Docline Healthcare Technology',
          industry: 'Healthcare Technology',
        }),
      });

      render(<DiagnosticoTab />);

      expect(screen.getByText('Ecosistema SDLC Docline — Estado Actual')).toBeInTheDocument();
    });

    it('handles client with special characters', () => {
      mockUseCurrentClient.mockReturnValue({
        clientId: 'test-client',
        client: createMockClientConfig({
          name: 'Test Client & Co.',
          fullName: 'Test Client & Company Ltd.',
        }),
      });

      render(<DiagnosticoTab />);

      expect(
        screen.getByText('Ecosistema SDLC Test Client & Co. — Estado Actual')
      ).toBeInTheDocument();
    });

    it('handles missing client gracefully', () => {
      mockUseCurrentClient.mockReturnValue({
        clientId: 'fallback-client',
        client: createMockClientConfig({ name: 'fallback-client' }),
      });

      // Should render without throwing
      expect(() => render(<DiagnosticoTab />)).not.toThrow();
    });
  });

  describe('Icons and Visual Elements', () => {
    it('renders all required icons', () => {
      render(<DiagnosticoTab />);

      expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
      expect(screen.getAllByTestId('alert-triangle-icon')).toHaveLength(2);
    });

    it('applies correct colors to icons', () => {
      render(<DiagnosticoTab />);

      const checkIcon = screen.getByTestId('check-circle-icon');
      const alertIcons = screen.getAllByTestId('alert-triangle-icon');

      expect(checkIcon).toHaveClass('text-green-600');
      expect(alertIcons[0]).toHaveClass('text-orange-600'); // Oportunidades
      expect(alertIcons[1]).toHaveClass('text-red-600'); // Gaps Críticos
    });

    it('renders icons with correct sizes', () => {
      render(<DiagnosticoTab />);

      const checkIcon = screen.getByTestId('check-circle-icon');
      expect(checkIcon).toHaveStyle({ width: '20px', height: '20px' });
    });

    it('renders emoji icons correctly', () => {
      render(<DiagnosticoTab />);

      // Section icons are emoji spans
      const sections = screen.getAllByTestId('section-box');
      expect(sections[0]).toBeInTheDocument(); // Executive summary with 📊
      expect(sections[1]).toBeInTheDocument(); // Pain points with 🔍
    });
  });

  describe('Accessibility', () => {
    it('provides proper heading hierarchy', () => {
      render(<DiagnosticoTab />);

      expect(screen.getByText('Ecosistema SDLC FacePhi — Estado Actual')).toBeInTheDocument();
      expect(screen.getByText('Análisis de Pain Points por Fase')).toBeInTheDocument();
      expect(screen.getByText('Fortalezas')).toBeInTheDocument();
      expect(screen.getByText('Oportunidades')).toBeInTheDocument();
      expect(screen.getByText('Gaps Críticos')).toBeInTheDocument();
    });

    it('includes descriptive text for context', () => {
      render(<DiagnosticoTab />);

      expect(
        screen.getByText(/Análisis del estado actual del ecosistema SDLC/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Identificación de problemas críticos y propuestas de mejora/)
      ).toBeInTheDocument();
    });

    it('provides semantic structure for problem-solution pairs', () => {
      render(<DiagnosticoTab />);

      // Each pain point should have Problema: and Solución propuesta: labels
      const problemaLabels = screen.getAllByText(/Problema:/);
      const solucionLabels = screen.getAllByText(/Solución propuesta:/);

      expect(problemaLabels).toHaveLength(4); // Based on mock data
      expect(solucionLabels).toHaveLength(4);
    });

    it('uses semantic HTML structure', () => {
      const { container } = render(<DiagnosticoTab />);

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Performance and Error Handling', () => {
    it('renders consistently across multiple renders', () => {
      const { rerender } = render(<DiagnosticoTab />);

      const firstRender = screen.getByText('Fortalezas');
      expect(firstRender).toBeInTheDocument();

      rerender(<DiagnosticoTab />);

      const secondRender = screen.getByText('Fortalezas');
      expect(secondRender).toBeInTheDocument();
    });

    it('handles component unmounting without errors', () => {
      const { unmount } = render(<DiagnosticoTab />);

      expect(() => unmount()).not.toThrow();
    });

    it('maintains component stability', () => {
      const { container } = render(<DiagnosticoTab />);

      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getAllByTestId('section-box')).toHaveLength(2);
    });
  });

  describe('Data Integration', () => {
    it('integrates with diagnosticoTabData correctly', () => {
      render(<DiagnosticoTab />);

      // Should render executive summary from data
      expect(
        screen.getByText(/Análisis del estado actual del ecosistema SDLC/)
      ).toBeInTheDocument();

      // Should render all pain points phases
      expect(screen.getByText('Discovery & PRD')).toBeInTheDocument();
      expect(screen.getByText('Desarrollo')).toBeInTheDocument();
      expect(screen.getByText('Testing')).toBeInTheDocument();
      expect(screen.getByText('Despliegue')).toBeInTheDocument();
    });

    it('handles empty pain points gracefully', () => {
      // Mock empty data
      vi.doMock('@/data/features/propuestaMejora', () => ({
        diagnosticoTabData: {
          executiveSummary: 'Test summary',
          painPoints: [],
        },
      }));

      expect(() => render(<DiagnosticoTab />)).not.toThrow();
    });
  });

  describe('Styling and Layout', () => {
    it('applies correct background colors to sections', () => {
      render(<DiagnosticoTab />);

      const sectionBoxes = screen.getAllByTestId('section-box');
      expect(sectionBoxes[0]).toHaveClass('bg-blue-50', 'border-blue-200');
      expect(sectionBoxes[1]).toHaveClass('bg-orange-50', 'border-orange-200');
    });

    it('applies grid layout to executive summary', () => {
      const { container } = render(<DiagnosticoTab />);

      const grid = container.querySelector('.grid.md\\:grid-cols-3');
      expect(grid).toBeInTheDocument();
    });

    it('applies solution styling to green boxes', () => {
      const { container } = render(<DiagnosticoTab />);

      const greenBoxes = container.querySelectorAll('.bg-green-50.border.border-green-200');
      expect(greenBoxes.length).toBe(4); // One for each pain point solution
    });
  });
});
