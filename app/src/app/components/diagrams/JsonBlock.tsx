import { useState } from 'react';
import { FileJson, ChevronDown, ChevronRight } from 'lucide-react';

interface JsonNodeProps {
  nodeKey?: string;
  value: any;
  isLast: boolean;
}

function JsonNode({ nodeKey, value, isLast }: JsonNodeProps) {
  const [expanded, setExpanded] = useState(true);

  const getType = (val: any) => {
    if (val === null) {
      return 'null';
    }
    if (Array.isArray(val)) {
      return 'array';
    }
    return typeof val;
  };

  const type = getType(value);

  const renderKey = () => {
    if (nodeKey === undefined) {
      return null;
    }
    return (
      <span className="text-[11px] font-semibold text-indigo-700 font-mono">"{nodeKey}": </span>
    );
  };

  if (type === 'object' || type === 'array') {
    const isArray = type === 'array';
    const items = isArray ? value : Object.entries(value);
    const isEmpty = items.length === 0;

    if (isEmpty) {
      return (
        <div className="font-mono text-[11px] leading-relaxed">
          {renderKey()}
          <span className="text-slate-400 font-medium">{isArray ? '[]' : '{}'}</span>
          {!isLast && <span className="text-slate-400">,</span>}
        </div>
      );
    }

    return (
      <div className="font-mono text-[11px] leading-relaxed">
        <div
          className="flex items-center cursor-pointer select-none hover:bg-slate-50 rounded px-1 -ml-1"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="w-3 h-3 flex items-center justify-center text-slate-400 mr-1">
            {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </span>
          {renderKey()}
          <span className="text-slate-500 font-medium">{isArray ? '[' : '{'}</span>
          {!expanded && (
            <>
              <span className="text-slate-400 text-[10px] italic px-1.5 bg-slate-100 rounded mx-1">
                {isArray ? `${items.length} items` : `${items.length} keys`}
              </span>
              <span className="text-slate-500 font-medium">{isArray ? ']' : '}'}</span>
              {!isLast && <span className="text-slate-400">,</span>}
            </>
          )}
        </div>

        {expanded && (
          <div className="pl-4 border-l border-slate-200/60 ml-1.5 my-0.5 space-y-0.5">
            {isArray
              ? items.map((item: any, i: number) => (
                  <div key={i}>
                    <JsonNode value={item} isLast={i === items.length - 1} />
                  </div>
                ))
              : items.map(([k, v]: [string, any], i: number) => (
                  <div key={k}>
                    <JsonNode nodeKey={k} value={v} isLast={i === items.length - 1} />
                  </div>
                ))}
          </div>
        )}
        {expanded && (
          <div className="ml-1">
            <span className="text-slate-500 font-medium">{isArray ? ']' : '}'}</span>
            {!isLast && <span className="text-slate-400">,</span>}
          </div>
        )}
      </div>
    );
  }

  // Primitive values
  const renderValue = () => {
    if (type === 'string') {
      return <span className="text-emerald-600 break-all">"{value}"</span>;
    }
    if (type === 'number') {
      return (
        <span className="px-1.5 py-0.5 rounded text-sky-700 bg-sky-50 border border-sky-100/50 font-semibold font-mono">
          {value}
        </span>
      );
    }
    if (type === 'boolean') {
      return (
        <span
          className={`px-1.5 py-0.5 rounded font-semibold font-mono border ${
            value
              ? 'bg-teal-50 text-teal-700 border-teal-100'
              : 'bg-rose-50 text-rose-700 border-rose-100'
          }`}
        >
          {value ? 'true' : 'false'}
        </span>
      );
    }
    if (type === 'null') {
      return (
        <span className="px-1.5 py-0.5 rounded text-slate-500 bg-slate-100 border border-slate-200 font-semibold font-mono italic">
          null
        </span>
      );
    }
    return <span className="text-slate-600">{String(value)}</span>;
  };

  return (
    <div className="font-mono text-[11px] leading-relaxed flex flex-wrap items-center gap-1">
      {renderKey()}
      <div className="break-all flex items-center">
        {renderValue()}
        {!isLast && <span className="text-slate-400">,</span>}
      </div>
    </div>
  );
}

export function JsonBlock({ code }: { code: string }) {
  const [showSource, setShowSource] = useState(false);

  let data: any = null;
  let error: string | null = null;

  try {
    data = JSON.parse(code);
  } catch (e: any) {
    error = e.message || 'Invalid JSON';
  }

  return (
    <div className="my-4 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded flex items-center justify-center bg-gradient-to-br from-sky-500 to-indigo-500">
            <FileJson size={11} className="text-white" />
          </div>
          <span className="text-[11px] font-semibold text-slate-600">Objeto JSON</span>
        </div>
        <button
          onClick={() => setShowSource(!showSource)}
          className="text-[10px] px-2 py-0.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors font-medium"
        >
          {showSource ? 'Visual' : 'Fuente'}
        </button>
      </div>

      {/* Body */}
      <div className="p-3">
        {showSource || error ? (
          <div>
            {error && !showSource && (
              <div className="mb-2 px-3 py-2 bg-red-50 border border-red-100 rounded-md text-red-600 text-[11px] font-mono">
                Error parseando JSON: {error}
              </div>
            )}
            <pre className="bg-slate-900 text-slate-100 rounded-lg p-3 overflow-x-auto text-xs leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        ) : (
          <div className="overflow-x-auto p-1">
            <JsonNode value={data} isLast={true} />
          </div>
        )}
      </div>
    </div>
  );
}
