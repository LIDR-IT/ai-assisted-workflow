import { useMemo } from 'react';
import type { Node, Edge } from '@xyflow/react';
import { Legend, DiagramCard, SectionBox } from '@/app/components/shared/FlowComponents';
import { FlowDiagram, edgeStyles } from '@/app/components/shared/ReactFlowDiagram';
import type { Flujo } from '@/data/schemas/propuesta-schema';

interface FlujoRendererProps {
  readonly content: Flujo;
}

const edgeStyleMap: Record<string, Partial<Edge>> = {
  red: { ...edgeStyles.red },
  green: { ...edgeStyles.green },
  purple: { ...edgeStyles.purple },
  dashed: { ...edgeStyles.dashed() },
};

function toReactFlowNode(n: Flujo['diagram']['nodes'][number]): Node {
  return {
    id: n.id,
    type: 'status',
    position: { x: n.x, y: n.y },
    data: {
      label: n.label,
      variant: n.variant,
      subtitle: n.subtitle,
      isJiraState: n.isJiraState ?? false,
    },
  };
}

function toReactFlowEdge(e: Flujo['diagram']['edges'][number]): Edge {
  const base: Edge = {
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    type: 'smoothstep',
  };
  if (e.sourceHandle) {
    base.sourceHandle = e.sourceHandle;
  }
  if (e.targetHandle) {
    base.targetHandle = e.targetHandle;
  }
  if (e.style && edgeStyleMap[e.style]) {
    Object.assign(base, edgeStyleMap[e.style]);
  }
  return base;
}

export function FlujoRenderer({ content }: FlujoRendererProps) {
  const { diagram, gatesSummary } = content;

  const nodes = useMemo(() => diagram.nodes.map(toReactFlowNode), [diagram.nodes]);
  const edges = useMemo(() => diagram.edges.map(toReactFlowEdge), [diagram.edges]);
  const legend = useMemo(
    () =>
      diagram.legend.map((l) => ({
        color: `${l.color} border-${l.color.replace(/^bg-/, '').replace(/-\d+$/, '')}-300`,
        label: l.label,
        isJiraState: false,
      })),
    [diagram.legend]
  );

  return (
    <div className="space-y-6">
      <Legend items={legend} title="Leyenda — Flujo General Obligatorio (TO-BE)" />

      <DiagramCard>
        <h2 className="text-lg font-semibold text-slate-700 mb-2">{diagram.metadata.title}</h2>
        <p className="text-sm text-slate-600 mb-4">{diagram.metadata.description}</p>
        <FlowDiagram nodes={nodes} edges={edges} height={diagram.configuration.height} />
      </DiagramCard>

      <SectionBox
        title="Resumen de Quality Gates"
        icon={<span>🚦</span>}
        bgColor="bg-amber-50"
        borderColor="border-amber-200"
      >
        <div className="grid gap-4">
          {gatesSummary.map((gate, idx) => (
            <div
              key={`${gate.gate}-${idx}`}
              className="flex items-start justify-between p-4 bg-white rounded-lg border border-amber-200 shadow-sm"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded">
                    {gate.gate}
                  </span>
                  <span className="font-semibold text-gray-900">{gate.name}</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{gate.criteria}</p>
              </div>
              <div className="ml-4 text-right">
                <span className="text-sm font-medium text-blue-600">{gate.owner}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionBox>
    </div>
  );
}
