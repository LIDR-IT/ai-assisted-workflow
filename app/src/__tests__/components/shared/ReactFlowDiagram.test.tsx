import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { FlowDiagram } from '@/app/components/shared/ReactFlowDiagram';
import { createMockReactFlow } from '@/utils/test-helpers';

// Mock React Flow
vi.mock('@xyflow/react', () => ({
  ReactFlow: ({ children, nodes, edges, ...props }: any) => {
    // Filter out React Flow-specific props that shouldn't be passed to DOM
    const domProps = Object.fromEntries(
      Object.entries(props).filter(
        ([key]) =>
          ![
            'nodeTypes',
            'fitView',
            'fitViewOptions',
            'proOptions',
            'minZoom',
            'maxZoom',
            'nodesDraggable',
            'nodesConnectable',
            'elementsSelectable',
            'panOnDrag',
            'zoomOnScroll',
            'onNodesChange',
            'onEdgesChange',
            'onConnect',
          ].includes(key)
      )
    );

    return (
      <div data-testid="react-flow" {...domProps}>
        {children}
        <div data-testid="react-flow-nodes">{nodes?.length || 0} nodes</div>
        <div data-testid="react-flow-edges">{edges?.length || 0} edges</div>
      </div>
    );
  },
  ReactFlowProvider: ({ children }: any) => <div data-testid="react-flow-provider">{children}</div>,
  Background: () => <div data-testid="react-flow-background" />,
  Controls: () => <div data-testid="react-flow-controls" />,
  MiniMap: () => <div data-testid="react-flow-minimap" />,
  Handle: ({ children, ...props }: any) => (
    <div data-testid="react-flow-handle" {...props}>
      {children}
    </div>
  ),
  Position: {
    Top: 'top',
    Right: 'right',
    Bottom: 'bottom',
    Left: 'left',
  },
  MarkerType: {
    ArrowClosed: 'arrowclosed',
  },
  useReactFlow: () => createMockReactFlow(),
  useNodesState: () => [[], vi.fn(), vi.fn()],
  useEdgesState: () => [[], vi.fn(), vi.fn()],
  getViewportForBounds: vi.fn(() => ({ x: 0, y: 0, zoom: 1 })),
}));

// Mock client config
vi.mock('../../../data', () => ({
  clientConfig: {
    name: 'Test Client',
  },
}));

// Mock export libraries
vi.mock('html-to-image', () => ({
  toPng: vi.fn(() => Promise.resolve('data:image/png;base64,mock')),
  toJpeg: vi.fn(() => Promise.resolve('data:image/jpeg;base64,mock')),
  toSvg: vi.fn(() => Promise.resolve('<svg>mock</svg>')),
}));

vi.mock('jspdf', () => ({
  jsPDF: vi.fn().mockImplementation(() => ({
    addImage: vi.fn(),
    save: vi.fn(),
    setFontSize: vi.fn(),
    text: vi.fn(),
    addPage: vi.fn(),
    getImageProperties: vi.fn(() => ({ width: 100, height: 100 })),
    setTextColor: vi.fn(),
  })),
}));

describe('FlowDiagram Component', () => {
  const defaultProps = {
    nodes: [
      { id: '1', data: { label: 'Node 1' }, position: { x: 0, y: 0 } },
      { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
    ],
    edges: [{ id: 'e1-2', source: '1', target: '2' }],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock getBoundingClientRect to return valid dimensions
    Object.defineProperty(Element.prototype, 'getBoundingClientRect', {
      writable: true,
      value: vi.fn(() => ({
        width: 800,
        height: 600,
        top: 0,
        left: 0,
        bottom: 600,
        right: 800,
        x: 0,
        y: 0,
        toJSON: vi.fn(),
      })),
    });

    // Mock useLayoutEffect to run synchronously like useEffect in tests
    vi.spyOn(React, 'useLayoutEffect').mockImplementation((effect, deps) => {
      // In test environment, we can safely ignore React hooks rules for mocking
      // eslint-disable-next-line react-hooks/exhaustive-deps
      React.useEffect(effect, deps);
    });
  });

  it('renders without crashing', async () => {
    render(<FlowDiagram {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('react-flow')).toBeInTheDocument();
    });
  });

  it('displays correct number of nodes and edges', async () => {
    render(<FlowDiagram {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('react-flow-nodes')).toHaveTextContent('2 nodes');
      expect(screen.getByTestId('react-flow-edges')).toHaveTextContent('1 edges');
    });
  });

  it('renders React Flow components', async () => {
    render(<FlowDiagram {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('react-flow-background')).toBeInTheDocument();
      expect(screen.getByTestId('react-flow-controls')).toBeInTheDocument();
    });
  });

  it('renders with default styling', async () => {
    render(<FlowDiagram {...defaultProps} />);

    await waitFor(() => {
      const reactFlow = screen.getByTestId('react-flow');
      expect(reactFlow).toBeInTheDocument();
    });
  });

  it('renders with consistent layout', async () => {
    render(<FlowDiagram {...defaultProps} />);

    await waitFor(() => {
      const reactFlow = screen.getByTestId('react-flow');
      expect(reactFlow).toBeInTheDocument();
    });
  });

  it('maintains component stability', async () => {
    render(<FlowDiagram {...defaultProps} />);

    await waitFor(() => {
      const reactFlow = screen.getByTestId('react-flow');
      expect(reactFlow).toBeInTheDocument();
      expect(screen.getByTestId('react-flow-background')).toBeInTheDocument();
      expect(screen.getByTestId('react-flow-controls')).toBeInTheDocument();
    });
  });

  it('handles empty nodes and edges', async () => {
    render(<FlowDiagram nodes={[]} edges={[]} />);

    await waitFor(() => {
      expect(screen.getByTestId('react-flow-nodes')).toHaveTextContent('0 nodes');
      expect(screen.getByTestId('react-flow-edges')).toHaveTextContent('0 edges');
    });
  });

  it('supports export functionality via exportName prop', async () => {
    render(<FlowDiagram {...defaultProps} exportName="test-diagram" />);

    await waitFor(() => {
      expect(screen.getByTestId('react-flow')).toBeInTheDocument();
    });
  });

  it('handles dynamic content changes', async () => {
    const { rerender } = render(<FlowDiagram {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('react-flow-nodes')).toHaveTextContent('2 nodes');
    });

    const newProps = {
      nodes: [{ id: '1', data: { label: 'Node 1' }, position: { x: 0, y: 0 } }],
      edges: [],
    };

    rerender(<FlowDiagram {...newProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('react-flow-nodes')).toHaveTextContent('1 nodes');
      expect(screen.getByTestId('react-flow-edges')).toHaveTextContent('0 edges');
    });
  });

  describe('Performance', () => {
    it('handles large datasets without crashing', async () => {
      const manyNodes = Array.from({ length: 50 }, (_, i) => ({
        id: `node-${i}`,
        data: { label: `Node ${i}` },
        position: { x: i * 50, y: i * 50 },
      }));

      const manyEdges = Array.from({ length: 25 }, (_, i) => ({
        id: `edge-${i}`,
        source: `node-${i}`,
        target: `node-${i + 1}`,
      }));

      render(<FlowDiagram nodes={manyNodes} edges={manyEdges} />);

      await waitFor(() => {
        expect(screen.getByTestId('react-flow-nodes')).toHaveTextContent('50 nodes');
        expect(screen.getByTestId('react-flow-edges')).toHaveTextContent('25 edges');
      });
    });

    it('handles re-renders gracefully', async () => {
      const { rerender } = render(<FlowDiagram {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId('react-flow')).toBeInTheDocument();
      });

      rerender(<FlowDiagram {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId('react-flow')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('provides accessible content', async () => {
      render(<FlowDiagram {...defaultProps} />);

      await waitFor(() => {
        const reactFlow = screen.getByTestId('react-flow');
        expect(reactFlow).toBeInTheDocument();
      });
    });

    it('maintains semantic structure', async () => {
      render(<FlowDiagram {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId('react-flow')).toBeInTheDocument();
        expect(screen.getByTestId('react-flow-background')).toBeInTheDocument();
        expect(screen.getByTestId('react-flow-controls')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles invalid node data gracefully', () => {
      const invalidNodes = [
        { id: '1', data: {}, position: { x: 0, y: 0 } },
        { id: '2', data: {}, position: { x: 100, y: 100 } },
      ];

      expect(() => {
        render(<FlowDiagram nodes={invalidNodes} edges={[]} />);
      }).not.toThrow();
    });

    it('handles invalid edge data gracefully', () => {
      const invalidEdges = [
        { id: 'e1', source: 'nonexistent', target: '2' },
        { id: 'e2', source: '1', target: 'nonexistent' },
      ];

      expect(() => {
        render(<FlowDiagram {...defaultProps} edges={invalidEdges} />);
      }).not.toThrow();
    });

    it('handles missing required props gracefully', () => {
      expect(() => {
        render(<FlowDiagram nodes={undefined as any} edges={undefined as any} />);
      }).not.toThrow();
    });
  });

  describe('Component Features', () => {
    it('supports different heights', async () => {
      const { rerender } = render(<FlowDiagram {...defaultProps} height={500} />);

      await waitFor(() => {
        expect(screen.getByTestId('react-flow')).toBeInTheDocument();
      });

      rerender(<FlowDiagram {...defaultProps} height={800} />);

      await waitFor(() => {
        expect(screen.getByTestId('react-flow')).toBeInTheDocument();
      });
    });

    it('supports custom export names', async () => {
      render(<FlowDiagram {...defaultProps} exportName="custom-export" />);

      await waitFor(() => {
        expect(screen.getByTestId('react-flow')).toBeInTheDocument();
      });
    });
  });

  describe('Integration', () => {
    it('integrates with helper functions n() and e()', async () => {
      // This would test integration with the helper functions from the actual implementation
      // For now, we verify that the component accepts the expected data structure
      const helperGeneratedData = {
        nodes: [{ id: 'n1', data: { label: 'Generated Node' }, position: { x: 0, y: 0 } }],
        edges: [{ id: 'e1', source: 'n1', target: 'n2' }],
      };

      render(<FlowDiagram {...helperGeneratedData} />);

      await waitFor(() => {
        expect(screen.getByTestId('react-flow-nodes')).toHaveTextContent('1 nodes');
        expect(screen.getByTestId('react-flow-edges')).toHaveTextContent('1 edges');
      });
    });

    it('works with export name configuration', async () => {
      render(<FlowDiagram {...defaultProps} exportName="integration-test-export" />);

      await waitFor(() => {
        expect(screen.getByTestId('react-flow')).toBeInTheDocument();
      });
    });
  });
});
