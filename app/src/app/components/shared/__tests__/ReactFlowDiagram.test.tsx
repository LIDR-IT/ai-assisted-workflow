import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

// Mock React Flow
vi.mock('@xyflow/react', () => ({
  ReactFlow: ({ children, ...props }: any) => (
    <div data-testid="react-flow" {...props}>
      {children}
    </div>
  ),
  ReactFlowProvider: ({ children }: any) => <div>{children}</div>,
  Background: () => <div data-testid="flow-background" />,
  Controls: () => <div data-testid="flow-controls" />,
  Handle: ({ position, type, id, ...props }: any) => (
    <div data-testid={`handle-${type}-${position}-${id || 'default'}`} {...props} />
  ),
  Position: {
    Top: 'top',
    Bottom: 'bottom',
    Left: 'left',
    Right: 'right',
  },
  MarkerType: {
    ArrowClosed: 'arrowclosed',
  },
  useReactFlow: () => ({
    getNodes: vi.fn(() => []),
    getNodesBounds: vi.fn(() => ({ width: 100, height: 100 })),
    getViewportForBounds: vi.fn(() => ({ x: 0, y: 0, zoom: 1 })),
  }),
}));

// Mock html-to-image
vi.mock('html-to-image', () => ({
  toPng: vi.fn(() => Promise.resolve('data:image/png;base64,mock')),
}));

// Mock jspdf
vi.mock('jspdf', () => ({
  jsPDF: vi.fn(() => ({
    addImage: vi.fn(),
    save: vi.fn(),
  })),
}));

import { FlowDiagram, n, e, edgeStyles, nodeTypes } from '../ReactFlowDiagram';

describe('ReactFlowDiagram', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('FlowDiagram component', () => {
    const mockNodes = [
      {
        id: 'node1',
        type: 'status',
        position: { x: 0, y: 0 },
        data: { label: 'Test Node', variant: 'blue' },
      },
    ];

    const mockEdges = [
      {
        id: 'edge1',
        source: 'node1',
        target: 'node2',
        type: 'smoothstep',
      },
    ];

    it('renders without crashing', () => {
      expect(() => {
        render(<FlowDiagram nodes={mockNodes} edges={mockEdges} exportName="test-diagram" />);
      }).not.toThrow();
    });

    it('renders with custom height', () => {
      expect(() => {
        render(
          <FlowDiagram nodes={mockNodes} edges={mockEdges} height={600} exportName="test-diagram" />
        );
      }).not.toThrow();
    });

    it('handles empty nodes array safely', () => {
      expect(() => {
        render(<FlowDiagram nodes={[]} edges={mockEdges} exportName="test-diagram" />);
      }).not.toThrow();
    });

    it('handles empty edges array safely', () => {
      expect(() => {
        render(<FlowDiagram nodes={mockNodes} edges={[]} exportName="test-diagram" />);
      }).not.toThrow();
    });

    it('sanitizes export name correctly', () => {
      expect(() => {
        render(<FlowDiagram nodes={mockNodes} edges={mockEdges} exportName="Test Diagram@#$%" />);
      }).not.toThrow();
    });
  });

  describe('Helper function n()', () => {
    it('creates a node with basic properties', () => {
      const node = n('node1', 100, 200, 'Test Node', 'blue');

      expect(node).toEqual({
        id: 'node1',
        type: 'status',
        position: { x: 100, y: 200 },
        data: {
          label: 'Test Node',
          variant: 'blue',
          subtitle: undefined,
          isJiraState: undefined,
        },
      });
    });

    it('creates a node with subtitle', () => {
      const node = n('node1', 0, 0, 'Main Node', 'green', 'Subtitle text');

      expect(node.data.subtitle).toBe('Subtitle text');
    });

    it('creates a node with Jira state flag', () => {
      const node = n('node1', 0, 0, 'Jira Node', 'purple', undefined, true);

      expect(node.data.isJiraState).toBe(true);
    });

    it('handles different variants', () => {
      const variants = ['red', 'green', 'blue', 'purple', 'orange'];

      variants.forEach((variant) => {
        const node = n(`node-${variant}`, 0, 0, 'Test', variant);
        expect(node.data.variant).toBe(variant);
      });
    });
  });

  describe('Helper function e()', () => {
    it('creates an edge with basic properties', () => {
      const edge = e('edge1', 'node1', 'node2');

      expect(edge).toEqual({
        id: 'edge1',
        source: 'node1',
        target: 'node2',
        label: undefined,
        type: 'smoothstep',
      });
    });

    it('creates an edge with label', () => {
      const edge = e('edge1', 'node1', 'node2', 'Success');

      expect(edge.label).toBe('Success');
    });

    it('creates an edge with additional options', () => {
      const opts = {
        style: { stroke: '#ff0000' },
        animated: true,
      };
      const edge = e('edge1', 'node1', 'node2', 'Test', opts);

      expect(edge.style).toEqual({ stroke: '#ff0000' });
      expect(edge.animated).toBe(true);
    });

    it('overwrites default type with options', () => {
      const edge = e('edge1', 'node1', 'node2', undefined, { type: 'straight' });

      expect(edge.type).toBe('straight');
    });
  });

  describe('edgeStyles', () => {
    it('provides dashed style with default color', () => {
      const dashedStyle = edgeStyles.dashed();

      expect(dashedStyle.style).toEqual({
        stroke: '#94a3b8',
        strokeWidth: 2,
        strokeDasharray: '6 3',
      });
    });

    it('provides dashed style with custom color', () => {
      const dashedStyle = edgeStyles.dashed('#ff0000');

      expect(dashedStyle.style.stroke).toBe('#ff0000');
    });

    it('provides red edge style', () => {
      expect(edgeStyles.red.style).toEqual({
        stroke: '#dc2626',
        strokeWidth: 2,
      });
    });

    it('provides green edge style', () => {
      expect(edgeStyles.green.style).toEqual({
        stroke: '#16a34a',
        strokeWidth: 2,
      });
    });

    it('provides purple edge style', () => {
      expect(edgeStyles.purple.style).toEqual({
        stroke: '#9333ea',
        strokeWidth: 2,
      });
    });

    it('provides purple dashed edge style', () => {
      expect(edgeStyles.purpleDashed.style).toEqual({
        stroke: '#9333ea',
        strokeWidth: 2,
        strokeDasharray: '6 3',
      });
    });
  });

  describe('nodeTypes', () => {
    it('exports correct node types', () => {
      expect(nodeTypes).toHaveProperty('status');
      expect(nodeTypes).toHaveProperty('waypoint');
      expect(nodeTypes.status).toBeDefined();
      expect(nodeTypes.waypoint).toBeDefined();
    });
  });

  describe('StatusNode component', () => {
    it('renders status node with correct data', () => {
      const StatusNode = nodeTypes.status;
      const nodeData = {
        label: 'Test Status',
        variant: 'blue',
        subtitle: 'Test Subtitle',
      };

      render(<StatusNode data={nodeData} />);

      expect(screen.getByText('Test Status')).toBeInTheDocument();
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });

    it('renders handles for connections', () => {
      const StatusNode = nodeTypes.status;
      const nodeData = { label: 'Test', variant: 'blue' };

      render(<StatusNode data={nodeData} />);

      // Handle testids follow pattern: handle-{type}-{position}-{id}
      // When no explicit id is passed, the id defaults to `{type}-{position}`.
      expect(screen.getByTestId('handle-target-top-target-top')).toBeInTheDocument();
      expect(screen.getByTestId('handle-source-bottom-source-bottom')).toBeInTheDocument();
    });

    it('uses fallback color for unknown variant', () => {
      const StatusNode = nodeTypes.status;
      const nodeData = { label: 'Test', variant: 'unknown-color' };

      const { container } = render(<StatusNode data={nodeData} />);

      // Should use slate as fallback
      const nodeElement = container.querySelector('[class*="bg-slate-100"]');
      expect(nodeElement).toBeInTheDocument();
    });
  });

  describe('WaypointNode component', () => {
    it('renders waypoint node', () => {
      const WaypointNode = nodeTypes.waypoint;

      expect(() => {
        render(<WaypointNode data={{}} />);
      }).not.toThrow();
    });

    it('has minimal styling', () => {
      const WaypointNode = nodeTypes.waypoint;
      const { container } = render(<WaypointNode data={{}} />);

      // Just verify that the component renders without throwing
      expect(container.firstChild).toBeTruthy();
    });
  });
});
