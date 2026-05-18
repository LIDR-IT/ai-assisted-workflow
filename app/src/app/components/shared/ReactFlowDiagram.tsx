import { memo, useRef, useState, useCallback, useMemo, useLayoutEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeTypes,
  Handle,
  Position,
  MarkerType,
  ReactFlowProvider,
  useReactFlow,
  getViewportForBounds,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Download, Image as ImageIcon, FileText, Loader2 } from 'lucide-react';

/* ─────────── Color map ─────────── */
const colorMap: Record<string, string> = {
  purple: 'bg-purple-100 border-purple-300 text-purple-800',
  blue: 'bg-blue-100 border-blue-300 text-blue-800',
  green: 'bg-green-100 border-green-300 text-green-800',
  cyan: 'bg-cyan-100 border-cyan-300 text-cyan-800',
  teal: 'bg-teal-100 border-teal-300 text-teal-800',
  indigo: 'bg-indigo-100 border-indigo-300 text-indigo-800',
  violet: 'bg-violet-100 border-violet-300 text-violet-800',
  orange: 'bg-orange-100 border-orange-300 text-orange-800',
  red: 'bg-red-100 border-red-300 text-red-800',
  amber: 'bg-amber-100 border-amber-300 text-amber-800',
  emerald: 'bg-emerald-100 border-emerald-300 text-emerald-800',
  sky: 'bg-sky-100 border-sky-300 text-sky-800',
  slate: 'bg-slate-100 border-slate-300 text-slate-700',
  'slate-solid': 'bg-slate-500 border-slate-600 text-white',
  yellow: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  'blue-solid': 'bg-blue-500 border-blue-600 text-white',
  'blue-dark': 'bg-blue-600 border-blue-700 text-white',
  'red-solid': 'bg-red-600 border-red-700 text-white',
  'green-solid': 'bg-green-500 border-green-600 text-white',
  'emerald-solid': 'bg-emerald-200 border-emerald-400 text-emerald-800',
  'purple-solid': 'bg-purple-400 border-purple-500 text-white',
  'cyan-solid': 'bg-cyan-500 border-cyan-600 text-white',
  'indigo-solid': 'bg-indigo-400 border-indigo-500 text-white',
  'amber-solid': 'bg-amber-400 border-amber-500 text-amber-900',
  'orange-solid': 'bg-orange-500 border-orange-600 text-white',
  'green-dark': 'bg-green-600 border-green-700 text-white',
  'teal-solid': 'bg-teal-200 border-teal-400 text-teal-800',
  'yellow-solid': 'bg-yellow-200 border-yellow-400 text-yellow-800',
  'red-gate': 'bg-red-200 border-red-400 text-red-800',
  'section-red': 'bg-red-50 border-red-300 text-red-800',
  'section-emerald': 'bg-emerald-50 border-emerald-300 text-emerald-800',
};

/* ─────────── Custom Node ─────────── */
interface StatusNodeData {
  readonly label: string;
  readonly variant: string;
  readonly subtitle?: string;
  readonly icon?: string;
  readonly isJiraState?: boolean;
}

const StatusNode = memo(({ data }: { data: StatusNodeData }) => {
  const cls = colorMap[data.variant] || colorMap.slate;
  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        className="!bg-slate-400 !w-2 !h-2"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!bg-slate-400 !w-2 !h-2"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="target-left-top"
        className="!bg-slate-400 !w-2 !h-2"
        style={{ top: '25%' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="target-left-bottom"
        className="!bg-slate-400 !w-2 !h-2"
        style={{ top: '75%' }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="target-right"
        className="!bg-slate-400 !w-2 !h-2"
      />
      <Handle
        type="target"
        position={Position.Right}
        id="target-right-top"
        className="!bg-slate-400 !w-2 !h-2"
        style={{ top: '25%' }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="target-right-bottom"
        className="!bg-slate-400 !w-2 !h-2"
        style={{ top: '75%' }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="target-bottom"
        className="!bg-slate-400 !w-2 !h-2"
      />
      {data.isJiraState && (
        <div className="absolute -top-2.5 -right-2 z-10 flex items-center gap-0.5 bg-white border border-blue-300 rounded-full px-1.5 py-0.5 shadow-sm">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
            <path d="M12 2L2 12l10 10 10-10L12 2z" fill="#2684FF" />
            <path d="M12 2L2 12l10 10 10-10L12 2z" fill="url(#jiraGrad)" />
            <defs>
              <linearGradient id="jiraGrad" x1="2" y1="2" x2="22" y2="22">
                <stop offset="0%" stopColor="#2684FF" />
                <stop offset="100%" stopColor="#0052CC" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-[8px] font-bold text-blue-700 leading-none">Estado</span>
        </div>
      )}
      <div
        className={`rounded-lg px-4 py-2.5 border-2 shadow-md text-center min-w-[160px] max-w-[260px] ${cls}`}
      >
        <div className="font-semibold text-sm">{data.label}</div>
        {data.subtitle && <div className="text-[11px] opacity-80 mt-0.5">{data.subtitle}</div>}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="source-bottom"
        className="!bg-slate-400 !w-2 !h-2"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!bg-slate-400 !w-2 !h-2"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="source-right-top"
        className="!bg-slate-400 !w-2 !h-2"
        style={{ top: '25%' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="source-right-bottom"
        className="!bg-slate-400 !w-2 !h-2"
        style={{ top: '75%' }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="source-left"
        className="!bg-slate-400 !w-2 !h-2"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="source-left-top"
        className="!bg-slate-400 !w-2 !h-2"
        style={{ top: '25%' }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="source-left-bottom"
        className="!bg-slate-400 !w-2 !h-2"
        style={{ top: '75%' }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="source-top"
        className="!bg-slate-400 !w-2 !h-2"
      />
    </div>
  );
});
StatusNode.displayName = 'StatusNode';

/* ─────────── Waypoint Node (invisible routing point) ─────────── */
const WaypointNode = memo(() => (
  <div style={{ width: 1, height: 1, position: 'relative' }}>
    <Handle
      type="target"
      position={Position.Left}
      id="left"
      className="!bg-transparent !border-0 !w-0 !h-0 !min-w-0 !min-h-0"
    />
    <Handle
      type="target"
      position={Position.Bottom}
      id="target-bottom"
      className="!bg-transparent !border-0 !w-0 !h-0 !min-w-0 !min-h-0"
    />
    <Handle
      type="target"
      position={Position.Right}
      id="target-right"
      className="!bg-transparent !border-0 !w-0 !h-0 !min-w-0 !min-h-0"
    />
    <Handle
      type="source"
      position={Position.Left}
      id="source-left"
      className="!bg-transparent !border-0 !w-0 !h-0 !min-w-0 !min-h-0"
    />
    <Handle
      type="source"
      position={Position.Top}
      id="source-top"
      className="!bg-transparent !border-0 !w-0 !h-0 !min-w-0 !min-h-0"
    />
    <Handle
      type="source"
      position={Position.Right}
      id="source-right"
      className="!bg-transparent !border-0 !w-0 !h-0 !min-w-0 !min-h-0"
    />
  </div>
));
WaypointNode.displayName = 'WaypointNode';

export const nodeTypes: NodeTypes = { status: StatusNode, waypoint: WaypointNode };

/* ─────────── Default edge options ─────────── */
const defaultEdgeOptions = {
  style: { strokeWidth: 2 },
  markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14 },
};

/* ─────────── Export helpers ─────────── */
const EXPORT_SCALE = 4; // 4x for high-definition

function downloadFile(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function sanitizeFilename(name: string) {
  return name
    .replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

/* ─────────── Export Buttons (inside ReactFlow) ─────────── */
function ExportButtons({
  exportName,
  containerRef,
}: {
  exportName: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { getNodes, getNodesBounds } = useReactFlow();
  const [exporting, setExporting] = useState<'png' | 'pdf' | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  const doExport = useCallback(
    async (format: 'png' | 'pdf') => {
      setExporting(format);
      setShowMenu(false);

      try {
        // Find the viewport element within THIS specific flow container
        const container = containerRef.current;
        if (!container) {
          return;
        }
        const viewportEl = container.querySelector('.react-flow__viewport');
        if (!viewportEl) {
          return;
        }

        // Get the wrapper (the .react-flow container)
        const flowEl = viewportEl.closest('.react-flow');
        if (!flowEl) {
          return;
        }

        // Calculate bounds of all nodes for the image dimensions
        const currentNodes = getNodes();
        const bounds = getNodesBounds(currentNodes);
        const padding = 60;
        const imageWidth = (bounds.width + padding * 2) * EXPORT_SCALE;
        const imageHeight = (bounds.height + padding * 2) * EXPORT_SCALE;

        // Get viewport transform that fits all nodes
        const viewport = getViewportForBounds(
          bounds,
          bounds.width + padding * 2,
          bounds.height + padding * 2,
          0.5,
          2,
          padding
        );

        const dataUrl = await toPng(viewportEl as HTMLElement, {
          backgroundColor: '#f8fafc',
          width: bounds.width + padding * 2,
          height: bounds.height + padding * 2,
          pixelRatio: EXPORT_SCALE,
          style: {
            width: `${bounds.width + padding * 2}px`,
            height: `${bounds.height + padding * 2}px`,
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          },
        });

        const filename = sanitizeFilename(exportName || 'diagrama');

        if (format === 'png') {
          downloadFile(dataUrl, `${filename}-HD.png`);
        } else {
          // PDF
          const img = new Image();
          img.src = dataUrl;
          await new Promise<void>((resolve) => {
            img.onload = () => resolve();
          });

          const pxToMm = 0.264583;
          const pdfW = (imageWidth * pxToMm) / EXPORT_SCALE;
          const pdfH = (imageHeight * pxToMm) / EXPORT_SCALE;
          const orientation = pdfW > pdfH ? 'landscape' : 'portrait';

          const pdf = new jsPDF({
            orientation,
            unit: 'mm',
            format: [Math.max(pdfW, pdfH), Math.min(pdfW, pdfH)],
          });

          // Add title
          pdf.setFontSize(14);
          pdf.setTextColor(30, 41, 59);
          pdf.text(exportName || 'Diagrama', 10, 12);
          pdf.setFontSize(8);
          pdf.setTextColor(100, 116, 139);
          const methodologyName = 'LIDR SDLC Methodology';
          pdf.text(
            `Exportado: ${new Date().toLocaleDateString('es-ES')} — ${methodologyName}`,
            10,
            18
          );

          const titleOffset = 22;
          const availH =
            (orientation === 'portrait' ? Math.max(pdfW, pdfH) : Math.min(pdfW, pdfH)) -
            titleOffset -
            5;
          const availW =
            (orientation === 'portrait' ? Math.min(pdfW, pdfH) : Math.max(pdfW, pdfH)) - 10;

          // Fit image proportionally
          const imgAspect = imageWidth / imageHeight;
          let drawW = availW;
          let drawH = drawW / imgAspect;
          if (drawH > availH) {
            drawH = availH;
            drawW = drawH * imgAspect;
          }

          pdf.addImage(dataUrl, 'PNG', 5, titleOffset, drawW, drawH);
          pdf.save(`${filename}.pdf`);
        }
      } catch (err) {
        // Log error only in development mode for security
        if (import.meta.env.DEV) {
          console.error('Export failed:', err);
        }
        // TODO: Implement proper error tracking/logging system
        // e.g., Sentry, LogRocket, or custom error service
      } finally {
        setExporting(null);
      }
    },
    [getNodes, getNodesBounds, exportName, containerRef]
  );

  return (
    <div className="absolute top-2 right-2 z-10">
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          disabled={!!exporting}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-600 hover:text-slate-800 disabled:opacity-50"
        >
          {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          <span className="hidden sm:inline">Exportar</span>
        </button>

        {showMenu && !exporting && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden min-w-[180px]">
              <button
                onClick={() => doExport('png')}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-indigo-50 transition-colors text-left"
              >
                <ImageIcon size={16} className="text-indigo-500" />
                <div>
                  <div className="text-sm font-semibold text-slate-700">PNG Alta Definición</div>
                  <div className="text-[10px] text-slate-400">{EXPORT_SCALE}x resolución</div>
                </div>
              </button>
              <div className="h-px bg-slate-100" />
              <button
                onClick={() => doExport('pdf')}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-emerald-50 transition-colors text-left"
              >
                <FileText size={16} className="text-emerald-500" />
                <div>
                  <div className="text-sm font-semibold text-slate-700">PDF</div>
                  <div className="text-[10px] text-slate-400">Con título y fecha</div>
                </div>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────── Stable references for ReactFlow props ─────────── */
const fitViewOpts = { padding: 0.25 };
const proOpts = { hideAttribution: true };

/* ─────────── Inner Flow (uses useReactFlow) ─────────── */
function InnerFlow({
  nodes,
  edges,
  height,
  exportName,
}: {
  nodes: Node[];
  edges: Edge[];
  height: number;
  exportName: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number } | null>(
    null
  );

  const styledEdges = useMemo(
    () =>
      edges.map((e) => ({
        ...e,
        type: e.type || 'smoothstep',
        labelStyle: { fontSize: 10, fontWeight: 600, fill: '#475569' },
        labelBgStyle: { fill: '#f8fafc', fillOpacity: 0.92 },
        labelBgPadding: [6, 3] as [number, number],
        labelBgBorderRadius: 4,
        ...defaultEdgeOptions,
        style: { ...defaultEdgeOptions.style, stroke: '#94a3b8', ...e.style },
      })),
    [edges]
  );

  // Measure container dimensions and update React Flow when ready
  useLayoutEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setContainerSize({ width: rect.width, height: rect.height });
        }
      }
    };

    // Initial measurement
    const timer = setTimeout(updateSize, 0);

    // Setup ResizeObserver if available
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      resizeObserver?.disconnect();
    };
  }, [height]);

  return (
    <div
      ref={containerRef}
      style={{
        height: `${height}px`,
        width: '100%',
        minHeight: `${height}px`,
        minWidth: '100%',
      }}
      className="rounded-xl border border-slate-200 bg-slate-50/50 overflow-hidden relative"
    >
      <ExportButtons exportName={exportName} containerRef={containerRef} />
      {containerSize && (
        <div style={{ width: '100%', height: '100%' }}>
          <ReactFlow
            nodes={nodes}
            edges={styledEdges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={fitViewOpts}
            proOptions={proOpts}
            minZoom={0.2}
            maxZoom={1.8}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag
            zoomOnScroll
          >
            <Background color="#e2e8f0" gap={20} size={1} />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>
      )}
      {!containerSize && (
        <div className="flex items-center justify-center h-full text-slate-500">
          <Loader2 size={24} className="animate-spin" />
        </div>
      )}
    </div>
  );
}

/* ─────────── Flow Diagram Component (public) ─────────── */
export function FlowDiagram({
  nodes,
  edges,
  height = 700,
  exportName = 'diagrama',
}: {
  nodes?: Node[];
  edges?: Edge[];
  height?: number;
  exportName?: string;
}) {
  // Provide default values to handle undefined props gracefully
  const safeNodes = nodes || [];
  const safeEdges = edges || [];

  return (
    <ReactFlowProvider>
      <InnerFlow nodes={safeNodes} edges={safeEdges} height={height} exportName={exportName} />
    </ReactFlowProvider>
  );
}

/* ─────────── Helper to create a node ─────────── */
export function n(
  id: string,
  x: number,
  y: number,
  label: string,
  variant: string,
  subtitle?: string,
  isJiraState?: boolean
): Node {
  return {
    id,
    type: 'status',
    position: { x, y },
    data: { label, variant, subtitle, isJiraState },
  };
}

/* ─────────── Helper to create an edge ─────────── */
export function e(
  id: string,
  source: string,
  target: string,
  label?: string,
  opts?: Partial<Edge>
): Edge {
  return {
    id,
    source,
    target,
    label,
    type: 'smoothstep',
    ...opts,
  };
}

/* ─────────── Pre-built edge style helpers ─────────── */
export const edgeStyles = {
  dashed: (color = '#94a3b8') => ({
    style: { stroke: color, strokeWidth: 2, strokeDasharray: '6 3' },
  }),
  red: { style: { stroke: '#dc2626', strokeWidth: 2 } },
  green: { style: { stroke: '#16a34a', strokeWidth: 2 } },
  purple: { style: { stroke: '#9333ea', strokeWidth: 2 } },
  purpleDashed: { style: { stroke: '#9333ea', strokeWidth: 2, strokeDasharray: '6 3' } },
  redDashed: { style: { stroke: '#dc2626', strokeWidth: 2, strokeDasharray: '6 3' } },
  orange: { style: { stroke: '#ea580c', strokeWidth: 2 } },
};
