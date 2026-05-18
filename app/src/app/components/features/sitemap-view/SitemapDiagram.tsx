import { ReactFlow, Node, Edge, Handle, Position } from '@xyflow/react';
import { useMemo } from 'react';
import { pageRoutes } from '@/data/features/sitemapView';

const nodeTypes = {
  sitemapPage: SitemapPageNode,
};

interface SitemapPageNodeProps {
  data: {
    title: string;
    description: string;
    completed: boolean;
    path: string;
    targetPosition: Position;
    sourcePosition: Position;
  };
}

function SitemapPageNode({ data }: SitemapPageNodeProps) {
  const { title, description, completed, path, targetPosition, sourcePosition } = data;

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-white min-w-[200px] ${
        completed ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-slate-50'
      }`}
    >
      <Handle type="target" position={targetPosition} className="w-2 h-2 opacity-0" />

      <div className="text-center">
        <div className="font-medium text-slate-900 mb-1">{title}</div>
        <div className="text-xs text-slate-600 leading-relaxed">{description}</div>
        <div className="mt-2">
          <code className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
            {path}
          </code>
        </div>
        <div
          className={`w-2 h-2 rounded-full mx-auto mt-2 ${
            completed ? 'bg-emerald-500' : 'bg-slate-400'
          }`}
        />
      </div>

      <Handle type="source" position={sourcePosition} className="w-2 h-2 opacity-0" />
    </div>
  );
}

export function SitemapDiagram() {
  const { nodes, edges } = useMemo(() => {
    const nodeColors = [
      '#3b82f6',
      '#6366f1',
      '#8b5cf6',
      '#d946ef',
      '#ec4899',
      '#f43f5e',
      '#f97316',
      '#f59e0b',
      '#84cc16',
      '#10b981',
      '#14b8a6',
      '#06b6d4',
      '#0ea5e9',
      '#3b82f6',
      '#6366f1',
      '#8b5cf6',
      '#d946ef',
    ];

    const nodes: Node[] = pageRoutes.map((route, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      const isLtoR = row % 2 === 0;

      const x = isLtoR ? col * 260 : (3 - col) * 260;
      const y = row * 160;

      let targetPos = Position.Left;
      if (index === 0) {
        targetPos = Position.Left;
      } else if (col === 0) {
        targetPos = Position.Top;
      } else if (isLtoR) {
        targetPos = Position.Left;
      } else {
        targetPos = Position.Right;
      }

      let sourcePos = Position.Right;
      if (col === 3 || index === pageRoutes.length - 1) {
        sourcePos = Position.Bottom;
      } else if (isLtoR) {
        sourcePos = Position.Right;
      } else {
        sourcePos = Position.Left;
      }

      return {
        id: route.path,
        type: 'sitemapPage',
        position: { x, y },
        data: {
          title: route.title,
          description: route.description,
          completed: route.completed,
          path: route.path,
          targetPosition: targetPos,
          sourcePosition: sourcePos,
        },
      };
    });

    const edges: Edge[] = [];
    for (let i = 0; i < pageRoutes.length - 1; i++) {
      const currentRoute = pageRoutes[i];
      const nextRoute = pageRoutes[i + 1];

      if (currentRoute && nextRoute) {
        edges.push({
          id: `${currentRoute.path}-${nextRoute.path}`,
          source: currentRoute.path,
          target: nextRoute.path,
          type: 'smoothstep',
          animated: true,
          style: { stroke: nodeColors[i % nodeColors.length], strokeWidth: 2 },
        });
      }
    }

    return { nodes, edges };
  }, []);

  return (
    <div className="h-[600px] w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        panOnScroll={false}
        zoomOnDoubleClick={false}
      />
    </div>
  );
}
