/**
 * MermaidBlock Component - Mermaid diagram rendering with controls
 *
 * Renders Mermaid diagrams with:
 * - Loading states
 * - Error handling
 * - Fullscreen expansion
 * - Source code toggle
 * - Copy functionality
 * - SVG sanitization
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import mermaid from 'mermaid';
import { GitBranch, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import { sanitizeSVG } from '@/utils/security';
import { CopyButton } from './CodeBlock';
import type { MermaidBlockProps } from './types';

// Global initialization state
let mermaidInitialized = false;
let mermaidCounter = 0;

function initMermaid() {
  if (mermaidInitialized) {
    return;
  }

  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
      primaryColor: '#e0e7ff',
      primaryTextColor: '#312e81',
      primaryBorderColor: '#818cf8',
      lineColor: '#6366f1',
      secondaryColor: '#f5f3ff',
      tertiaryColor: '#faf5ff',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      fontSize: '13px',
      noteBkgColor: '#fef3c7',
      noteTextColor: '#92400e',
      noteBorderColor: '#fbbf24',
      actorBkg: '#e0e7ff',
      actorBorder: '#818cf8',
      actorTextColor: '#312e81',
      signalColor: '#4f46e5',
      signalTextColor: '#1e1b4b',
    },
    flowchart: { curve: 'basis', padding: 16 },
    sequence: { actorMargin: 60, messageMargin: 40 },
    gantt: { titleTopMargin: 15, barHeight: 24, barGap: 6 },
  });

  mermaidInitialized = true;
}

export function MermaidBlock({ code, id }: MermaidBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [showSource, setShowSource] = useState(false);

  const render = useCallback(async () => {
    initMermaid();
    setLoading(true);
    setError(null);

    try {
      const renderId = id || `mermaid-${Date.now()}-${mermaidCounter++}`;
      const { svg: renderedSvg } = await mermaid.render(renderId, code.trim());
      setSvg(renderedSvg);
    } catch (e: any) {
      setError(e?.message || 'Error renderizando diagrama Mermaid');
    } finally {
      setLoading(false);
    }
  }, [code, id]);

  useEffect(() => {
    render();
  }, [render]);

  // Detect diagram type for label
  const diagramType = code.trim().split(/[\s\n{]/)[0] || 'diagram';
  const typeLabels: Record<string, string> = {
    graph: 'Flowchart',
    flowchart: 'Flowchart',
    sequenceDiagram: 'Sequence',
    classDiagram: 'Class',
    stateDiagram: 'State',
    'stateDiagram-v2': 'State',
    erDiagram: 'ER Diagram',
    gantt: 'Gantt',
    pie: 'Pie Chart',
    gitgraph: 'Git Graph',
    journey: 'User Journey',
    mindmap: 'Mindmap',
    timeline: 'Timeline',
    C4Context: 'C4 Context',
  };
  const label = typeLabels[diagramType] || 'Mermaid';

  return (
    <div
      className={`my-5 rounded-xl border border-indigo-200/70 overflow-hidden bg-white shadow-sm transition-all ${
        expanded ? 'fixed inset-4 z-50 my-0 flex flex-col' : ''
      }`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-indigo-50 to-violet-50 border-b border-indigo-100">
        <div className="flex items-center gap-2">
          <GitBranch size={14} className="text-indigo-500" />
          <span className="text-[11px] font-semibold text-indigo-700">{label}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-600 font-mono">
            mermaid
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSource(!showSource)}
            className="text-[10px] px-2 py-0.5 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            type="button"
          >
            {showSource ? 'Diagrama' : 'Fuente'}
          </button>
          <CopyButton text={code.trim()} />
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors ml-1"
            title={expanded ? 'Minimizar' : 'Expandir'}
            type="button"
          >
            {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className={`${expanded ? 'flex-1 overflow-auto' : ''}`}>
        {loading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={18} className="animate-spin text-indigo-400" />
            <span className="ml-2 text-xs text-slate-400">Renderizando diagrama...</span>
          </div>
        )}

        {error && (
          <div className="p-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700 mb-2">
              <p className="font-semibold mb-1">Error de Mermaid</p>
              <p className="font-mono text-[11px]">{error}</p>
            </div>
            {/* Fallback: show source */}
            <pre className="bg-slate-900 text-slate-100 rounded-lg p-3 overflow-x-auto text-xs">
              <code>{code.trim()}</code>
            </pre>
          </div>
        )}

        {!loading && !error && !showSource && (
          <div
            ref={containerRef}
            className="flex items-center justify-center p-4 overflow-auto [&>svg]:max-w-full"
            dangerouslySetInnerHTML={{ __html: sanitizeSVG(svg) }}
          />
        )}

        {!loading && showSource && (
          <pre className="bg-slate-900 text-slate-100 p-4 overflow-x-auto text-xs leading-relaxed m-3 rounded-lg">
            <code>{code.trim()}</code>
          </pre>
        )}
      </div>

      {/* Fullscreen backdrop */}
      {expanded && (
        <div className="fixed inset-0 bg-black/40 -z-10" onClick={() => setExpanded(false)} />
      )}
    </div>
  );
}
