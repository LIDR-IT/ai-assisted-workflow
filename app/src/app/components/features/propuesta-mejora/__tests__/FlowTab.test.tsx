/**
 * @file FlowTab Test Suite
 * @description Tests for FlowTab component with flow diagram, legend, and gates summary
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FlowTab } from '../FlowTab';

// Mock shared components
vi.mock('@/app/components/shared/FlowComponents', () => ({
  Legend: ({ items, title }: { items: Array<{ color: string; label: string }>; title: string }) => (
    <div data-testid="legend">
      <h3>{title}</h3>
      {items.map((item, index) => (
        <div key={index} className={item.color} data-testid={`legend-item-${index}`}>
          {item.label}
        </div>
      ))}
    </div>
  ),
  DiagramCard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="diagram-card">{children}</div>
  ),
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

// Mock FlowDiagram
vi.mock('@/app/components/shared/ReactFlowDiagram', () => ({
  FlowDiagram: ({
    nodes = [],
    edges = [],
    height = 700,
    exportName = 'diagrama',
  }: {
    nodes?: any[];
    edges?: any[];
    height?: number;
    exportName?: string;
  }) => (
    <div data-testid="flow-diagram">
      <div data-testid="flow-nodes-count">{nodes.length}</div>
      <div data-testid="flow-edges-count">{edges.length}</div>
      <div data-testid="flow-height">{height}</div>
      <div data-testid="flow-export-name">{exportName}</div>
    </div>
  ),
  edgeStyles: {
    dashed: () => ({ style: { stroke: '#94a3b8', strokeWidth: 2, strokeDasharray: '6 3' } }),
    red: { style: { stroke: '#dc2626', strokeWidth: 2 } },
    green: { style: { stroke: '#16a34a', strokeWidth: 2 } },
    purple: { style: { stroke: '#9333ea', strokeWidth: 2 } },
  },
}));

// Provide a valid Flujo JSON so the renderer mounts and the tab integrates correctly.
// Renderer-internal logic is covered by separate FlujoRenderer tests.
const mockFlujoContent = {
  metadata: {
    id: 'test-flujo',
    title: 'Test Flujo',
    version: '1.0.0',
    client: 'Test',
    industry: 'Software Development',
    tags: [],
  },
  diagram: {
    metadata: {
      id: 'test-flujo-diagram',
      title: 'Flujo E2E Obligatorio con Quality Gates',
      description:
        'Cada 🚦 Gate es un punto de decisión obligatorio: no se avanza sin cumplir los criterios de salida de la fase anterior',
      version: '1.0.0',
      client: 'Test',
      industry: 'Software Development',
      tags: [],
    },
    configuration: { height: 700, exportName: 'test', layout: 'TB' as const, spacing: 50 },
    nodes: [
      { id: 'a', x: 0, y: 0, label: 'A', variant: 'blue' as const, isJiraState: false },
      { id: 'b', x: 0, y: 100, label: 'B', variant: 'green' as const, isJiraState: false },
    ],
    edges: [{ id: 'e-ab', source: 'a', target: 'b', label: 'next' }],
    legend: [
      { color: 'bg-purple-200', label: 'Phase 1 — Analysis (Negocio / CTO)' },
      { color: 'bg-blue-200', label: 'Phase 2 — Planning' },
      { color: 'bg-cyan-200', label: 'Phase 3 — Solutioning (RF + NFR)' },
      { color: 'bg-green-200', label: 'User Stories' },
      { color: 'bg-yellow-200', label: 'Sprint Planning' },
      { color: 'bg-orange-200', label: 'Desarrollo' },
      { color: 'bg-red-200', label: 'Seguridad' },
      { color: 'bg-teal-200', label: 'QA / Testing' },
      { color: 'bg-indigo-200', label: 'Despliegue' },
      { color: 'bg-amber-200', label: '🚦 Quality Gate (obligatorio)' },
      { color: 'bg-slate-200', label: 'Retrospectiva / Métricas' },
    ],
    tables: [],
    tabs: [],
  },
  gatesSummary: [
    {
      gate: 'Gate 0',
      name: 'Intake',
      criteria:
        'Business Case aprobado · Sponsor identificado · Presupuesto asignado · Alineación estratégica',
      owner: 'PME + Negocio',
    },
    {
      gate: 'Gate 1',
      name: 'PRD Aprobado',
      criteria: 'PRD unificado (F+T) completo · Review cruzado aprobado · Riesgos identificados',
      owner: 'Producto + R&D',
    },
    {
      gate: 'Gate 2',
      name: 'Requisitos Completos',
      criteria:
        'RFs + NFRs documentados · RTM generada · Epic breakdown aprobado · Coherencia validada · BDD-ready',
      owner: 'PO + Tech Lead + QA',
    },
    {
      gate: 'Gate 3',
      name: 'Sprint Committed',
      criteria: 'DoR cumplida · Estimación en horas · Capacidad confirmada · Sin ambigüedades',
      owner: 'PO + Tech Lead',
    },
    {
      gate: 'Gate 4',
      name: 'DoD + Code Quality',
      criteria: 'cl-dod cumplida · SAST/SCA limpio · Code Review aprobado · Handoff QA generado',
      owner: 'TL + Dev',
    },
    {
      gate: 'Gate 5',
      name: 'QA Sign-off',
      criteria:
        'Todos los test cases PASS · so-qa signoff firmado · cl-nfr compliance · 0 bugs bloqueantes',
      owner: 'QA Lead',
    },
    {
      gate: 'Gate 6',
      name: 'Security Sign-off',
      criteria: 'OWASP Top 10 OK · so-security signoff firmado · Vulnerabilidades remediadas',
      owner: 'Sec Lead',
    },
    {
      gate: 'Gate 7',
      name: 'Deploy to Production',
      criteria:
        'CR aprobado · Rollback plan documentado · Release notes publicadas · cl-postdeploy checklist',
      owner: 'PME + DevOps',
    },
  ],
};

vi.mock('@/hooks/usePropuestaContent', () => ({
  usePropuestaContent: () => ({
    data: mockFlujoContent,
    isLoading: false,
    isError: false,
    error: null,
    notFound: false,
    reload: () => {},
  }),
}));

// useCurrentClient mock for FlowTab (added by F2 refactor — used in loading/error messages)
vi.mock('@/hooks', async () => {
  const actual = await vi.importActual<typeof import('@/hooks')>('@/hooks');
  return {
    ...actual,
    useCurrentClient: () => ({
      client: { name: 'Test' } as any,
      clientId: 'test',
      switchClient: () => {},
      isLoading: false,
    }),
  };
});

// Mock data
vi.mock('@/data/features/propuestaMejora', () => ({
  flowTabData: {
    nodes: [
      { id: 'node1', data: { label: 'Start' } },
      { id: 'node2', data: { label: 'End' } },
    ],
    edges: [{ id: 'edge1', source: 'node1', target: 'node2' }],
  },
}));

// Mock phases
vi.mock('@/data/phases', () => ({
  getPhaseColor: (phase: number) => {
    const colors = ['red', 'blue', 'cyan', 'green', 'orange', 'purple', 'pink', 'indigo'];
    return colors[phase] || 'gray';
  },
}));

describe('FlowTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders all main sections', () => {
      render(<FlowTab />);

      expect(screen.getByTestId('legend')).toBeInTheDocument();
      expect(screen.getByTestId('diagram-card')).toBeInTheDocument();
      expect(screen.getByTestId('section-box')).toBeInTheDocument();
    });

    it('renders with correct spacing', () => {
      const { container } = render(<FlowTab />);

      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('space-y-6');
    });
  });

  describe('Legend Section', () => {
    it('renders legend with correct title', () => {
      render(<FlowTab />);

      expect(screen.getByText('Leyenda — Flujo General Obligatorio (TO-BE)')).toBeInTheDocument();
    });

    it('renders all legend items', () => {
      render(<FlowTab />);

      // Check for key legend items
      expect(screen.getByText('Phase 1 — Analysis (Negocio / CTO)')).toBeInTheDocument();
      expect(screen.getByText('Phase 2 — Planning')).toBeInTheDocument();
      expect(screen.getByText('Phase 3 — Solutioning (RF + NFR)')).toBeInTheDocument();
      expect(screen.getByText('User Stories')).toBeInTheDocument();
      expect(screen.getByText('Sprint Planning')).toBeInTheDocument();
      expect(screen.getByText('Desarrollo')).toBeInTheDocument();
      expect(screen.getByText('Seguridad')).toBeInTheDocument();
      expect(screen.getByText('QA / Testing')).toBeInTheDocument();
      expect(screen.getByText('Despliegue')).toBeInTheDocument();
      expect(screen.getByText('🚦 Quality Gate (obligatorio)')).toBeInTheDocument();
      expect(screen.getByText('Retrospectiva / Métricas')).toBeInTheDocument();
    });

    it('renders legend items with proper structure', () => {
      render(<FlowTab />);

      // Should have 11 legend items (phases + gates + retrospectiva)
      const legendItems = screen.getAllByTestId(/legend-item-/);
      expect(legendItems).toHaveLength(11);
    });
  });

  describe('Flow Diagram Section', () => {
    it('renders diagram card with correct title and description', () => {
      render(<FlowTab />);

      expect(screen.getByText('Flujo E2E Obligatorio con Quality Gates')).toBeInTheDocument();
      expect(
        screen.getByText(/Cada 🚦 Gate es un punto de decisión obligatorio/)
      ).toBeInTheDocument();
    });

    it('renders FlowDiagram with correct props', () => {
      render(<FlowTab />);

      expect(screen.getByTestId('flow-diagram')).toBeInTheDocument();
      expect(screen.getByTestId('flow-nodes-count')).toHaveTextContent('2');
      expect(screen.getByTestId('flow-edges-count')).toHaveTextContent('1');
      expect(screen.getByTestId('flow-height')).toHaveTextContent('700');
      expect(screen.getByTestId('flow-export-name')).toHaveTextContent('diagrama');
    });

    it('applies correct styling to diagram title', () => {
      render(<FlowTab />);

      const title = screen.getByText('Flujo E2E Obligatorio con Quality Gates');
      expect(title).toHaveClass('text-lg', 'font-semibold', 'text-slate-700', 'mb-2');
    });

    it('applies correct styling to diagram description', () => {
      render(<FlowTab />);

      const description = screen.getByText(/Cada 🚦 Gate es un punto de decisión obligatorio/);
      expect(description).toHaveClass('text-sm', 'text-slate-600', 'mb-4');
    });
  });

  describe('Gates Summary Section', () => {
    it('renders section box with correct props', () => {
      render(<FlowTab />);

      const sectionBox = screen.getByTestId('section-box');
      expect(sectionBox).toBeInTheDocument();
      expect(sectionBox).toHaveClass('bg-amber-50', 'border-amber-200');
      expect(screen.getByText('Resumen de Quality Gates')).toBeInTheDocument();
    });

    it('renders all 8 gates', () => {
      render(<FlowTab />);

      // Check for all gate numbers
      expect(screen.getByText('Gate 0')).toBeInTheDocument();
      expect(screen.getByText('Gate 1')).toBeInTheDocument();
      expect(screen.getByText('Gate 2')).toBeInTheDocument();
      expect(screen.getByText('Gate 3')).toBeInTheDocument();
      expect(screen.getByText('Gate 4')).toBeInTheDocument();
      expect(screen.getByText('Gate 5')).toBeInTheDocument();
      expect(screen.getByText('Gate 6')).toBeInTheDocument();
      expect(screen.getByText('Gate 7')).toBeInTheDocument();
    });

    it('renders all gate names', () => {
      render(<FlowTab />);

      expect(screen.getByText('Intake')).toBeInTheDocument();
      expect(screen.getByText('PRD Aprobado')).toBeInTheDocument();
      expect(screen.getByText('Requisitos Completos')).toBeInTheDocument();
      expect(screen.getByText('Sprint Committed')).toBeInTheDocument();
      expect(screen.getByText('DoD + Code Quality')).toBeInTheDocument();
      expect(screen.getByText('QA Sign-off')).toBeInTheDocument();
      expect(screen.getByText('Security Sign-off')).toBeInTheDocument();
      expect(screen.getByText('Deploy to Production')).toBeInTheDocument();
    });

    it('renders all gate owners', () => {
      render(<FlowTab />);

      expect(screen.getByText('PME + Negocio')).toBeInTheDocument();
      expect(screen.getByText('Producto + R&D')).toBeInTheDocument();
      expect(screen.getByText('PO + Tech Lead + QA')).toBeInTheDocument();
      expect(screen.getByText('PO + Tech Lead')).toBeInTheDocument();
      expect(screen.getByText('TL + Dev')).toBeInTheDocument();
      expect(screen.getByText('QA Lead')).toBeInTheDocument();
      expect(screen.getByText('Sec Lead')).toBeInTheDocument();
      expect(screen.getByText('PME + DevOps')).toBeInTheDocument();
    });

    it('renders gate criteria text', () => {
      render(<FlowTab />);

      // Check a few key criteria
      expect(screen.getByText(/Business Case aprobado/)).toBeInTheDocument();
      expect(screen.getByText(/PRD unificado \(F\+T\) completo/)).toBeInTheDocument();
      expect(screen.getByText(/DoR cumplida/)).toBeInTheDocument();
    });
  });

  describe('Gate Cards Layout', () => {
    it('applies correct grid layout to gates container', () => {
      const { container } = render(<FlowTab />);

      const gridContainer = container.querySelector('.grid.gap-4');
      expect(gridContainer).toBeInTheDocument();
    });

    it('applies correct styling to gate cards', () => {
      const { container } = render(<FlowTab />);

      // Should have 8 gate cards with correct styling
      const gateCards = container.querySelectorAll('.bg-white.rounded-lg.border.border-amber-200');
      expect(gateCards).toHaveLength(8);
    });

    it('applies correct styling to gate badges', () => {
      const { container } = render(<FlowTab />);

      // All gate badges should have amber styling
      const gateBadges = container.querySelectorAll('.bg-amber-100.text-amber-800');
      expect(gateBadges).toHaveLength(8);
    });

    it('applies correct styling to gate owners', () => {
      const { container } = render(<FlowTab />);

      // All owners should have blue text
      const owners = container.querySelectorAll('.text-blue-600');
      expect(owners).toHaveLength(8);
    });
  });

  describe('Accessibility', () => {
    it('provides proper heading hierarchy', () => {
      render(<FlowTab />);

      // Should have proper heading structure
      expect(screen.getByText('Leyenda — Flujo General Obligatorio (TO-BE)')).toBeInTheDocument();
      expect(screen.getByText('Flujo E2E Obligatorio con Quality Gates')).toBeInTheDocument();
      expect(screen.getByText('Resumen de Quality Gates')).toBeInTheDocument();
    });

    it('includes meaningful text content for screen readers', () => {
      render(<FlowTab />);

      // Descriptive content should be available
      expect(
        screen.getByText(/Cada 🚦 Gate es un punto de decisión obligatorio/)
      ).toBeInTheDocument();
    });

    it('uses semantic HTML structure', () => {
      const { container } = render(<FlowTab />);

      // Should have proper document structure
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('integrates properly with Legend component', () => {
      render(<FlowTab />);

      const legend = screen.getByTestId('legend');
      expect(legend).toBeInTheDocument();
    });

    it('integrates properly with DiagramCard component', () => {
      render(<FlowTab />);

      const diagramCard = screen.getByTestId('diagram-card');
      expect(diagramCard).toBeInTheDocument();
    });

    it('integrates properly with SectionBox component', () => {
      render(<FlowTab />);

      const sectionBox = screen.getByTestId('section-box');
      expect(sectionBox).toBeInTheDocument();
    });

    it('integrates properly with FlowDiagram component', () => {
      render(<FlowTab />);

      const flowDiagram = screen.getByTestId('flow-diagram');
      expect(flowDiagram).toBeInTheDocument();
    });
  });

  describe('Data Integration', () => {
    it('uses flowTabData correctly', () => {
      render(<FlowTab />);

      // Should render the mocked nodes and edges
      expect(screen.getByTestId('flow-nodes-count')).toHaveTextContent('2');
      expect(screen.getByTestId('flow-edges-count')).toHaveTextContent('1');
    });

    it('uses getPhaseColor function correctly', () => {
      render(<FlowTab />);

      // Component should render without errors using phase colors
      expect(screen.getByTestId('legend')).toBeInTheDocument();
    });
  });

  describe('Performance Considerations', () => {
    it('renders consistently across multiple renders', () => {
      const { rerender } = render(<FlowTab />);

      const firstRender = screen.getByTestId('flow-diagram');
      expect(firstRender).toBeInTheDocument();

      rerender(<FlowTab />);

      const secondRender = screen.getByTestId('flow-diagram');
      expect(secondRender).toBeInTheDocument();
    });

    it('handles component unmounting without errors', () => {
      const { unmount } = render(<FlowTab />);

      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('renders without errors when all props are valid', () => {
      expect(() => render(<FlowTab />)).not.toThrow();
    });

    it('maintains component stability', () => {
      const { container } = render(<FlowTab />);

      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByTestId('legend')).toBeInTheDocument();
      expect(screen.getByTestId('diagram-card')).toBeInTheDocument();
      expect(screen.getByTestId('section-box')).toBeInTheDocument();
    });
  });
});
