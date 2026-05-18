/**
 * Handoff Diagram Data
 *
 * Static data for the handoff flow diagram showing the 8 phases and their connections.
 * Extracted from HandoffsTemplates.tsx for better maintainability.
 */

import type { Node, Edge } from '@xyflow/react';
import { n, e } from '@/app/components/shared/ReactFlowDiagram';

export const handoffNodes: Node[] = [
  n('f1', -70, 0, 'FASE 1: Originación', 'purple'),
  n('h1', 210, 0, '📦 Handoff 1', 'amber', 'Business Case + Kick-off'),
  n('f2', 420, 0, 'FASE 2: Discovery & PRD', 'blue'),
  n('h2', 700, 0, '📦 Handoff 2', 'amber', 'PRDs aprobados'),
  n('f3', -70, 120, 'FASE 3: Especificación', 'cyan'),
  n('h3', 210, 120, '📦 Handoff 3', 'amber', 'RFs + NFRs + RTM'),
  n('f4', 420, 120, 'FASE 4: Planning', 'violet'),
  n('h4', 700, 120, '📦 Handoff 4', 'amber', 'Sprint Committed'),
  n('f5', -70, 240, 'FASE 5: Desarrollo', 'orange'),
  n('h5', 210, 240, '📦 Handoff 5', 'amber', 'Código Integrado'),
  n('f6', 420, 240, 'FASE 6: QA', 'sky'),
  n('h6', 700, 240, '📦 Handoff 6', 'amber', 'QA Sign-off'),
  n('f7', -70, 360, 'FASE 7: Seguridad', 'red'),
  n('h7', 210, 360, '📦 Handoff 7', 'amber', 'Security Sign-off'),
  n('f8', 420, 360, 'FASE 8: Despliegue', 'emerald'),
  n('h8', 700, 360, '📦 Handoff 8', 'amber', 'Release a PROD'),
];

export const handoffEdges: Edge[] = [
  e('e1', 'f1', 'h1', '', { sourceHandle: 'right', targetHandle: 'left' }),
  e('e2', 'h1', 'f2', '', { sourceHandle: 'right', targetHandle: 'left' }),
  e('e3', 'f2', 'h2', '', { sourceHandle: 'right', targetHandle: 'left' }),
  e('e4', 'h2', 'f3', '', { targetHandle: 'left' }),
  e('e5', 'f3', 'h3', '', { sourceHandle: 'right', targetHandle: 'left' }),
  e('e6', 'h3', 'f4', '', { sourceHandle: 'right', targetHandle: 'left' }),
  e('e7', 'f4', 'h4', '', { sourceHandle: 'right', targetHandle: 'left' }),
  e('e8', 'h4', 'f5', '', { targetHandle: 'left' }),
  e('e9', 'f5', 'h5', '', { sourceHandle: 'right', targetHandle: 'left' }),
  e('e10', 'h5', 'f6', '', { sourceHandle: 'right', targetHandle: 'left' }),
  e('e11', 'f6', 'h6', '', { sourceHandle: 'right', targetHandle: 'left' }),
  e('e12', 'h6', 'f7', '', { targetHandle: 'left' }),
  e('e13', 'f7', 'h7', '', { sourceHandle: 'right', targetHandle: 'left' }),
  e('e14', 'h7', 'f8', '', { sourceHandle: 'right', targetHandle: 'left' }),
  e('e15', 'f8', 'h8', '', { sourceHandle: 'right', targetHandle: 'left' }),
];
