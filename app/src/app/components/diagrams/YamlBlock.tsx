import { useState } from 'react';
import {
  Settings2,
  Hash,
  FileCode,
  List,
  Tag,
  Calendar,
  User,
  Shield,
  Layers,
  Link2,
  Clock,
  Eye,
} from 'lucide-react';

/* ═══════════════════════════════════════════
   YAML PARSER (lightweight, no dependencies)
   ═══════════════════════════════════════════ */

interface YamlEntry {
  key: string;
  value: string;
  comment: string;
  children: string[]; // array items
  indent: number;
}

function parseYaml(code: string): YamlEntry[] {
  const lines = code.trim().split('\n');
  const entries: YamlEntry[] = [];
  let current: YamlEntry | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip frontmatter delimiters
    if (trimmed === '---' || trimmed === '...') {
      continue;
    }
    if (!trimmed) {
      continue;
    }

    // Array item (child of current entry)
    const arrayMatch = line.match(/^(\s+)-\s*(.+)$/);
    if (arrayMatch && arrayMatch[2] !== undefined && current) {
      const val = arrayMatch[2].trim();
      // Strip inline comment from array item
      const commentIdx = val.indexOf(' #');
      if (commentIdx >= 0) {
        current.children.push(
          val
            .substring(0, commentIdx)
            .trim()
            .replace(/^["']|["']$/g, '')
        );
      } else {
        current.children.push(val.replace(/^["']|["']$/g, ''));
      }
      continue;
    }

    // Key-value pair
    const kvMatch = line.match(/^(\s*)([^#:]+?):\s*(.*?)$/);
    if (
      kvMatch &&
      kvMatch[1] !== undefined &&
      kvMatch[2] !== undefined &&
      kvMatch[3] !== undefined
    ) {
      if (current) {
        entries.push(current);
      }

      const indent = kvMatch[1].length;
      const key = kvMatch[2].trim();
      let rawValue = kvMatch[3].trim();
      let comment = '';

      // Extract inline comment
      const commentMatch = rawValue.match(/^(.*?)\s+#\s*(.+)$/);
      if (commentMatch && commentMatch[1] !== undefined && commentMatch[2] !== undefined) {
        rawValue = commentMatch[1].trim();
        comment = commentMatch[2].trim();
      }

      // Strip quotes
      const value = rawValue.replace(/^["']|["']$/g, '');

      current = { key, value, comment, children: [], indent };
      continue;
    }
  }
  if (current) {
    entries.push(current);
  }

  return entries;
}

/* ═══════════════════════════════════════════
   ICON MAPPING
   ═══════════════════════════════════════════ */

function getKeyIcon(key: string) {
  const k = key.toLowerCase();
  if (k === 'id' || k === 'name') {
    return <Hash size={11} className="text-indigo-400" />;
  }
  if (k === 'version') {
    return <Tag size={11} className="text-violet-400" />;
  }
  if (
    k.includes('date') ||
    k.includes('updated') ||
    k.includes('review') ||
    k.includes('created')
  ) {
    return <Calendar size={11} className="text-sky-400" />;
  }
  if (k.includes('by') || k.includes('role') || k.includes('author') || k.includes('owner')) {
    return <User size={11} className="text-emerald-400" />;
  }
  if (k === 'status') {
    return <Eye size={11} className="text-amber-400" />;
  }
  if (k.includes('scope') || k.includes('type') || k.includes('tier') || k === 'phase') {
    return <Layers size={11} className="text-orange-400" />;
  }
  if (k.includes('reference') || k.includes('link') || k.includes('url')) {
    return <Link2 size={11} className="text-cyan-400" />;
  }
  if (k.includes('cycle') || k.includes('interval')) {
    return <Clock size={11} className="text-rose-400" />;
  }
  if (k.includes('security') || k.includes('auth') || k.includes('permission')) {
    return <Shield size={11} className="text-red-400" />;
  }
  if (k.includes('tool') || k.includes('allowed')) {
    return <Settings2 size={11} className="text-slate-400" />;
  }
  if (k.includes('file') || k.includes('path')) {
    return <FileCode size={11} className="text-teal-400" />;
  }
  if (k.includes('list') || k.includes('items')) {
    return <List size={11} className="text-slate-400" />;
  }
  return <Settings2 size={11} className="text-slate-400" />;
}

/* ═══════════════════════════════════════════
   VALUE RENDERING
   ═══════════════════════════════════════════ */

function renderValue(value: string) {
  if (!value) {
    return null;
  }

  // Pipe-separated options: "draft | active | deprecated"
  if (value.includes(' | ')) {
    const options = value.split(/\s*\|\s*/);
    return (
      <div className="flex flex-wrap gap-1">
        {options.map((opt, i) => (
          <span
            key={i}
            className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono border border-slate-200"
          >
            {opt}
          </span>
        ))}
      </div>
    );
  }

  // Numeric
  if (/^\d+(-\d+)?$/.test(value)) {
    return (
      <span className="px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-mono font-semibold border border-indigo-100">
        {value}
      </span>
    );
  }

  // Placeholder: {something}
  if (value.includes('{') && value.includes('}')) {
    const parts = value.split(/(\{[^}]+\})/g);
    return (
      <span className="text-[11px] font-mono text-slate-600">
        {parts.map((part, i) =>
          part.startsWith('{') ? (
            <span
              key={i}
              className="px-1 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200/60"
            >
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  }

  // Date pattern
  if (/^\d{4}-\d{2}-\d{2}/.test(value) || value === 'YYYY-MM-DD') {
    return (
      <span className="px-1.5 py-0.5 rounded-md bg-sky-50 text-sky-700 text-[11px] font-mono border border-sky-100">
        {value}
      </span>
    );
  }

  // @ references
  if (value.startsWith('@')) {
    return (
      <span className="text-[11px] font-mono text-cyan-700 underline decoration-cyan-300 underline-offset-2">
        {value}
      </span>
    );
  }

  // Boolean-like
  if (value === 'true' || value === 'false') {
    return (
      <span
        className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${
          value === 'true'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-rose-50 text-rose-700 border border-rose-200'
        }`}
      >
        {value}
      </span>
    );
  }

  return <span className="text-[11px] text-slate-700 font-mono">{value}</span>;
}

/* ═══════════════════════════════════════════
   STATUS BADGE
   ═══════════════════════════════════════════ */

function StatusBadge({ value }: { value: string }) {
  const v = value.toLowerCase();
  if (v === 'active' || v === 'stable' || v === 'enabled' || v === 'true') {
    return (
      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-semibold">
        {value}
      </span>
    );
  }
  if (v === 'draft' || v === 'beta' || v === 'experimental') {
    return (
      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-semibold">
        {value}
      </span>
    );
  }
  if (v === 'deprecated' || v === 'disabled' || v === 'false' || v === 'archived') {
    return (
      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-semibold">
        {value}
      </span>
    );
  }
  return null;
}

/* ═══════════════════════════════════════════
   MAIN YAML BLOCK COMPONENT
   ═══════════════════════════════════════════ */

export function YamlBlock({ code }: { code: string }) {
  const [showSource, setShowSource] = useState(false);
  const entries = parseYaml(code);

  // Detect if it's a frontmatter block (starts/ends with ---)
  const isFrontmatter = code.trim().startsWith('---');

  return (
    <div className="my-4 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-violet-50 to-indigo-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded flex items-center justify-center bg-gradient-to-br from-violet-500 to-indigo-500">
            <FileCode size={11} className="text-white" />
          </div>
          <span className="text-[11px] font-semibold text-slate-600">
            {isFrontmatter ? 'Frontmatter Schema' : 'Configuraci\u00f3n YAML'}
          </span>
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
        {showSource ? (
          <pre className="bg-slate-900 text-slate-100 rounded-lg p-3 overflow-x-auto text-xs leading-relaxed">
            <code>{code}</code>
          </pre>
        ) : (
          <div className="space-y-0">
            {entries.map((entry, i) => (
              <div
                key={i}
                className="group flex items-start gap-3 px-2.5 py-2 rounded-lg hover:bg-slate-50/80 transition-colors border-b border-slate-100/60 last:border-0"
              >
                {/* Icon */}
                <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                  {getKeyIcon(entry.key)}
                </div>

                {/* Key */}
                <div className="flex-shrink-0 w-28 min-w-0">
                  <span className="text-[11px] font-semibold text-slate-500 font-mono truncate block">
                    {entry.key}
                  </span>
                </div>

                {/* Value */}
                <div className="flex-1 min-w-0">
                  {entry.key.toLowerCase() === 'status' &&
                  entry.value &&
                  !entry.value.includes('|') ? (
                    <StatusBadge value={entry.value} />
                  ) : (
                    renderValue(entry.value)
                  )}

                  {/* Array children */}
                  {entry.children.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {entry.children.map((child, j) => (
                        <span
                          key={j}
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono border ${
                            child.startsWith('@')
                              ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}
                        >
                          {child.startsWith('@') && (
                            <Link2 size={8} className="mr-1 text-cyan-400" />
                          )}
                          {child}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Comment / hint */}
                  {entry.comment && (
                    <p className="mt-0.5 text-[10px] text-slate-400 italic leading-tight">
                      {entry.comment}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
