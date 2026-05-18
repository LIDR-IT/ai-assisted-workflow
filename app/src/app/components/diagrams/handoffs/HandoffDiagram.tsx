/**
 * HandoffDiagram Component
 *
 * Displays the handoff flow diagram showing the 8 phases and their connections.
 * Extracted from HandoffsTemplates.tsx for better maintainability.
 */

import { DiagramCard } from '@/app/components/shared/FlowComponents';
import { FlowDiagram } from '@/app/components/shared/ReactFlowDiagram';
import { handoffNodes, handoffEdges } from './handoffDiagramData';

export function HandoffDiagram() {
  return (
    <DiagramCard>
      <h2 className="text-lg font-semibold text-slate-700 mb-2 text-center">
        Mapa de Handoffs entre Fases
      </h2>
      <p className="text-xs text-slate-500 text-center mb-4">
        Cada Handoff es un punto formal de transferencia con entregables y criterios específicos
      </p>
      <FlowDiagram
        nodes={handoffNodes}
        edges={handoffEdges}
        height={400}
        exportName="Mapa de Handoffs entre Fases"
      />
    </DiagramCard>
  );
}
