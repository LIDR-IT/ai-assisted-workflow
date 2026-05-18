import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  ChevronRight,
  ChevronDown,
  ArrowRight,
  GitBranch,
  ListOrdered,
  FolderTree,
  Code2,
  AlertTriangle,
  Layers,
} from 'lucide-react';

/* ═══════════════════════════════════════════
   DIAGRAM TYPE DETECTION
   ═══════════════════════════════════════════ */

type DiagramType = 'flow' | 'tree' | 'steps' | 'phases' | 'unknown';

function detectDiagramType(code: string): DiagramType {
  const lines = code.trim().split('\n');

  // Phases: FASE N: or PHASE N: headers (at least 2) — check FIRST
  // These are complex multi-level blocks that need a specialized renderer
  const phaseLines = lines.filter((l) => /^\s*(?:FASE|PHASE|ETAPA)\s+\d+\s*:/i.test(l));
  if (phaseLines.length >= 2) {
    return 'phases';
  }

  // Steps: numbered items (1. 2. 3.) — check BEFORE flow because sub-items
  // often contain → arrows that would false-positive as flow
  const numberedLines = lines.filter((l) => /^\s*\d+[.\\)]\s+/.test(l));
  if (numberedLines.length >= 2) {
    return 'steps';
  }

  // Tree: uses ├── └── │ characters — check BEFORE flow to avoid
  // false positives when tree nodes contain → descriptions
  const treeChars = /[├└│┌┐┘┤┬┴─]/;
  const treeLines = lines.filter((l) => treeChars.test(l));
  const hasTreeChars = treeLines.length >= 2;

  // ASCII art detection: extended dashes (─{4,}) indicate visual/ASCII art
  // diagrams that should be rendered as monospace, not parsed as tree
  const hasExtendedDashes = lines.some((l) => /─{4,}/.test(l));
  // Also detect connector-only lines (only │ and spaces) — another sign of ASCII art
  const hasConnectorLines = lines.some((l) => /^[\s│]+$/.test(l.trimEnd()) && /│/.test(l));

  // Flow: lines with -> or → chains (e.g. "Dev -> Staging -> UAT")
  const flowLines = lines.filter((l) => /\S+\s*(?:->|→)\s*\S+/.test(l));
  const hasFlowArrows =
    flowLines.length > 0 && flowLines.length >= lines.filter((l) => l.trim()).length * 0.3;

  // Mixed content (tree chars + flow arrows) — render as structured text
  // to preserve both the hierarchy and the descriptions
  if (hasTreeChars && hasFlowArrows) {
    return 'unknown';
  }

  // ASCII art with extended dashes or connector lines — render as monospace
  if (hasTreeChars && (hasExtendedDashes || hasConnectorLines)) {
    return 'unknown';
  }

  if (hasTreeChars) {
    return 'tree';
  }

  if (hasFlowArrows) {
    return 'flow';
  }

  return 'unknown';
}

/* ═══════════════════════════════════════════
   FLOW DIAGRAM
   A -> B -> C rendered as boxes with arrows
   ═══════════════════════════════════════════ */

type FlowLineItem =
  | { kind: 'chain'; nodes: string[] }
  | { kind: 'separator' } // ↓ or empty line
  | { kind: 'note'; text: string }; // parenthetical / other text

function FlowDiagram({ code }: { code: string }) {
  const lines = code.trim().split('\n');

  // Build an ordered list preserving the original sequence
  const items: FlowLineItem[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      // blank line → separator
      if (items.length > 0 && items[items.length - 1]?.kind !== 'separator') {
        items.push({ kind: 'separator' });
      }
      continue;
    }

    // ↓ lines are visual separators
    if (/^[↓⬇]+$/.test(trimmed)) {
      if (items.length > 0 && items[items.length - 1]?.kind !== 'separator') {
        items.push({ kind: 'separator' });
      }
      continue;
    }

    // Flow line: contains → or ->
    if (/\S+\s*(?:->|→)\s*\S+/.test(trimmed)) {
      const nodes = trimmed
        .split(/\s*(?:->|→)\s*/)
        .map((n) => n.trim())
        .filter(Boolean);
      items.push({ kind: 'chain', nodes });
    } else {
      items.push({ kind: 'note', text: trimmed });
    }
  }

  return (
    <div className="space-y-1.5">
      {items.map((item, i) => {
        if (item.kind === 'chain') {
          return (
            <div key={i} className="flex flex-wrap items-center gap-1.5">
              {item.nodes.map((node, ni) => (
                <div key={ni} className="flex items-center gap-1.5">
                  {ni > 0 && <ArrowRight size={14} className="text-indigo-400 flex-shrink-0" />}
                  <div className="px-3 py-1.5 rounded-lg bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200/70 text-xs font-medium text-indigo-800 whitespace-nowrap shadow-sm">
                    {node}
                  </div>
                </div>
              ))}
            </div>
          );
        }
        if (item.kind === 'separator') {
          return (
            <div key={i} className="flex justify-start pl-4 py-0.5">
              <ChevronRight size={14} className="text-indigo-300 rotate-90" />
            </div>
          );
        }
        // note
        return (
          <div key={i} className="pl-4 py-0.5">
            <span className="text-xs text-slate-500 italic">{item.text}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════
   TREE DIAGRAM
   ├── └── rendered as visual tree
   ═══════════════════════════════════════════ */

interface TreeNode {
  label: string;
  depth: number;
  isLast: boolean;
  connector: string;
}

function TreeDiagram({ code }: { code: string }) {
  const lines = code.trim().split('\n');

  const nodes: TreeNode[] = [];
  let rootLabel = '';

  for (const line of lines) {
    const trimmed = line.trimEnd();
    if (!trimmed) {
      continue;
    }

    // Detect tree connector
    const treeMatch = trimmed.match(/^([\s│]*)(├──|└──|├─|└─|├|└)\s*(.+)$/);
    if (
      treeMatch &&
      treeMatch[1] !== undefined &&
      treeMatch[2] !== undefined &&
      treeMatch[3] !== undefined
    ) {
      const prefix = treeMatch[1];
      const connector = treeMatch[2];
      const label = treeMatch[3].trim();
      // Depth based on prefix length (each level is ~4 chars: "│   ")
      const depth = Math.round(prefix.replace(/│/g, ' ').length / 4) + 1;
      nodes.push({ label, depth, isLast: connector.includes('└'), connector });
    } else if (nodes.length === 0) {
      // Root node
      rootLabel = trimmed;
    }
  }

  const getIcon = (label: string) => {
    if (label.match(/\.(md|txt|json|yml|yaml|ts|tsx|js|jsx|css|html)$/i)) {
      return <Code2 size={11} className="text-slate-400" />;
    }
    if (label.includes('/') || (!label.includes('.') && !label.includes(':'))) {
      return <FolderTree size={11} className="text-amber-500" />;
    }
    return <ChevronRight size={11} className="text-slate-400" />;
  };

  return (
    <div className="space-y-0.5">
      {rootLabel && (
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200">
          <FolderTree size={14} className="text-indigo-500" />
          <span className="text-sm font-semibold text-indigo-800">{rootLabel}</span>
        </div>
      )}
      <div className="font-mono text-xs space-y-px">
        {nodes.map((node, i) => (
          <div
            key={i}
            className="flex items-center group hover:bg-indigo-50/50 rounded px-1 py-0.5 transition-colors"
            style={{ paddingLeft: `${(node.depth - 1) * 20}px` }}
          >
            <span className="text-slate-300 mr-1.5 select-none w-5 text-center flex-shrink-0">
              {node.isLast ? '└─' : '├─'}
            </span>
            <span className="mr-1.5 flex-shrink-0">{getIcon(node.label)}</span>
            <span className="text-slate-700 group-hover:text-indigo-700 transition-colors">
              {node.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   STEPS DIAGRAM
   Numbered steps with sub-items
   ═══════════════════════════════════════════ */

interface Step {
  number: number;
  title: string;
  subItems: string[];
}

function parseSteps(code: string): Step[] {
  const lines = code.trim().split('\n');
  const steps: Step[] = [];
  let current: Step | null = null;
  const preamble: string[] = [];

  for (const line of lines) {
    const trimmed = line.trimEnd();
    if (!trimmed) {
      continue;
    }

    // Numbered step
    const stepMatch = trimmed.match(/^\s*(\d+)[.\\)]\s+(.+)$/);
    if (stepMatch && stepMatch[1] !== undefined && stepMatch[2] !== undefined) {
      if (current) {
        steps.push(current);
      }
      current = {
        number: parseInt(stepMatch[1]),
        title: stepMatch[2].trim(),
        subItems: [],
      };
      continue;
    }

    // Sub-item: indented with →, -, *, •, or just indentation
    if (current) {
      const arrowSub = trimmed.match(/^\s*→\s*(.+)$/);
      const bulletSub = trimmed.match(/^\s+[-*•]\s*(.+)$/);
      if (arrowSub && arrowSub[1] !== undefined) {
        current.subItems.push(`→ ${arrowSub[1].trim()}`);
      } else if (bulletSub && bulletSub[1] !== undefined) {
        current.subItems.push(bulletSub[1].trim());
      } else if (/^\s{2,}/.test(line)) {
        // Continuation line
        current.subItems.push(trimmed.trim());
      } else {
        // Non-indented line after a step — treat as sub-item of current
        current.subItems.push(trimmed.trim());
      }
    } else {
      // Lines before first numbered step — preamble
      preamble.push(trimmed.trim());
    }
  }
  if (current) {
    steps.push(current);
  }

  // If there's preamble text, prepend as a pseudo-step 0
  if (preamble.length > 0 && steps.length > 0) {
    steps.unshift({ number: 0, title: preamble.join(' '), subItems: [] });
  }

  return steps;
}

function StepsDiagram({ code }: { code: string }) {
  const steps = parseSteps(code);

  // Color palette for steps
  const stepColors = [
    {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      num: 'bg-indigo-500',
      text: 'text-indigo-800',
      sub: 'text-indigo-600',
      arrow: 'text-indigo-300',
      bullet: 'bg-indigo-300',
    },
    {
      bg: 'bg-violet-50',
      border: 'border-violet-200',
      num: 'bg-violet-500',
      text: 'text-violet-800',
      sub: 'text-violet-600',
      arrow: 'text-violet-300',
      bullet: 'bg-violet-300',
    },
    {
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      num: 'bg-sky-500',
      text: 'text-sky-800',
      sub: 'text-sky-600',
      arrow: 'text-sky-300',
      bullet: 'bg-sky-300',
    },
    {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      num: 'bg-emerald-500',
      text: 'text-emerald-800',
      sub: 'text-emerald-600',
      arrow: 'text-emerald-300',
      bullet: 'bg-emerald-300',
    },
    {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      num: 'bg-amber-500',
      text: 'text-amber-800',
      sub: 'text-amber-600',
      arrow: 'text-amber-300',
      bullet: 'bg-amber-300',
    },
    {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      num: 'bg-rose-500',
      text: 'text-rose-800',
      sub: 'text-rose-600',
      arrow: 'text-rose-300',
      bullet: 'bg-rose-300',
    },
  ];

  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const color = stepColors[
          (step.number === 0 ? 0 : i - (steps[0]?.number === 0 ? 1 : 0)) % stepColors.length
        ] ?? {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          num: 'bg-gray-500',
          text: 'text-gray-800',
          sub: 'text-gray-600',
          arrow: 'text-gray-300',
          bullet: 'bg-gray-300',
        };
        const isLast = i === steps.length - 1;

        // Preamble (step.number === 0) — render as context note, not numbered
        if (step.number === 0) {
          return (
            <div key={i} className="pl-1 pb-3">
              <span className="text-xs text-slate-500 italic">{highlightArrows(step.title)}</span>
            </div>
          );
        }

        return (
          <div key={i} className="relative">
            {/* Connecting line */}
            {!isLast && (
              <div className="absolute left-[15px] top-[36px] bottom-0 w-px bg-gradient-to-b from-slate-200 to-slate-100 z-0" />
            )}

            <div className={`relative z-10 flex gap-3 ${!isLast ? 'pb-3' : ''}`}>
              {/* Step number badge */}
              <div
                className={`w-[30px] h-[30px] rounded-full ${color.num} text-white text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-sm`}
              >
                {step.number}
              </div>

              {/* Step content */}
              <div
                className={`flex-1 rounded-lg ${color.bg} border ${color.border} px-3.5 py-2.5 min-w-0`}
              >
                <p className={`text-xs font-semibold ${color.text} leading-relaxed`}>
                  {highlightArrows(step.title)}
                </p>

                {step.subItems.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {step.subItems.map((item, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${color.bullet} mt-1 flex-shrink-0`}
                        />
                        <span className={`text-[11px] ${color.sub} leading-relaxed`}>
                          {highlightArrows(item)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Highlight → arrows and "WARN:" keywords in text */
function highlightArrows(text: string): ReactNode {
  // Split on → and WARN:
  const parts = text.split(/(→|WARN:|"[^"]+")/g);
  return parts.map((part, i) => {
    if (part === '→') {
      return (
        <span key={i} className="inline-flex mx-0.5 text-indigo-400 font-bold">
          →
        </span>
      );
    }
    if (part === 'WARN:') {
      return (
        <span
          key={i}
          className="inline-flex items-center gap-0.5 mx-0.5 px-1.5 py-0 rounded bg-amber-100 text-amber-700 font-semibold text-[10px]"
        >
          <AlertTriangle size={9} />
          WARN
        </span>
      );
    }
    if (part.startsWith('"') && part.endsWith('"')) {
      return (
        <span key={i} className="italic opacity-80">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/* ══════════════════════════════════════════
   UNKNOWN / FALLBACK — nice styled pre
   ═══════════════════════════════════════════ */

function UnknownDiagram({ code }: { code: string }) {
  // Render as nicely formatted pre with line highlighting
  const lines = code.split('\n');

  return (
    <div className="font-mono text-xs space-y-0">
      {lines.map((line, i) => {
        const trimmed = line.trimEnd();
        const indent = line.length - line.trimStart().length;
        const isEmpty = !trimmed;

        return (
          <div
            key={i}
            className={`px-3 py-0.5 ${!isEmpty ? 'hover:bg-indigo-50/50' : ''} transition-colors`}
            style={{ paddingLeft: `${12 + indent * 7}px` }}
          >
            {isEmpty ? (
              <span>&nbsp;</span>
            ) : (
              <span className="text-slate-700">{highlightArrows(trimmed)}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════
   PHASES DIAGRAM
   FASE N: headers with collapsible content
   ═══════════════════════════════════════════ */

interface Phase {
  number: number;
  title: string; // "ORIGINACIÓN", "DISCOVERY", etc.
  rawTitle: string; // Full header line
  contentLines: string[];
}

function parsePhases(code: string): { preamble: string[]; phases: Phase[] } {
  const lines = code.trim().split('\n');
  const phases: Phase[] = [];
  const preamble: string[] = [];
  let current: Phase | null = null;

  const phaseRegex = /^\s*(?:FASE|PHASE|ETAPA)\s+(\d+)\s*:\s*(.+)$/i;
  // Also match non-numbered sections like POST-DEPLOY
  const sectionRegex = /^([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ0-9 _-]+)$/;

  for (const line of lines) {
    const trimmed = line.trimEnd();

    const phaseMatch = trimmed.match(phaseRegex);
    if (phaseMatch && phaseMatch[1] !== undefined && phaseMatch[2] !== undefined) {
      if (current) {
        phases.push(current);
      }
      current = {
        number: parseInt(phaseMatch[1]),
        title: phaseMatch[2].trim(),
        rawTitle: trimmed.trim(),
        contentLines: [],
      };
      continue;
    }

    // Non-numbered uppercase section (like POST-DEPLOY)
    const sectionMatch = trimmed.trim().match(sectionRegex);
    if (
      sectionMatch &&
      sectionMatch[1] !== undefined &&
      current &&
      trimmed.trim().length > 3 &&
      !/^\s/.test(trimmed)
    ) {
      phases.push(current);
      current = {
        number: -1, // special: unnumbered section
        title: sectionMatch[1].trim(),
        rawTitle: trimmed.trim(),
        contentLines: [],
      };
      continue;
    }

    if (current) {
      current.contentLines.push(trimmed);
    } else if (trimmed.trim()) {
      preamble.push(trimmed.trim());
    }
  }
  if (current) {
    phases.push(current);
  }

  return { preamble, phases };
}

const PHASE_COLORS = [
  {
    accent: 'bg-indigo-500',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-800',
    light: 'text-indigo-600',
    badge: 'bg-indigo-100 text-indigo-700',
  },
  {
    accent: 'bg-violet-500',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-800',
    light: 'text-violet-600',
    badge: 'bg-violet-100 text-violet-700',
  },
  {
    accent: 'bg-sky-500',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    text: 'text-sky-800',
    light: 'text-sky-600',
    badge: 'bg-sky-100 text-sky-700',
  },
  {
    accent: 'bg-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    light: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  {
    accent: 'bg-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    light: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-700',
  },
  {
    accent: 'bg-rose-500',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-800',
    light: 'text-rose-600',
    badge: 'bg-rose-100 text-rose-700',
  },
  {
    accent: 'bg-teal-500',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-800',
    light: 'text-teal-600',
    badge: 'bg-teal-100 text-teal-700',
  },
  {
    accent: 'bg-fuchsia-500',
    bg: 'bg-fuchsia-50',
    border: 'border-fuchsia-200',
    text: 'text-fuchsia-800',
    light: 'text-fuchsia-600',
    badge: 'bg-fuchsia-100 text-fuchsia-700',
  },
  {
    accent: 'bg-slate-500',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-800',
    light: 'text-slate-600',
    badge: 'bg-slate-100 text-slate-700',
  },
];

function PhaseContentLine({ line }: { line: string }) {
  const trimmed = line.trim();
  if (!trimmed) {
    return null;
  }

  // Role header: "PO ejecuta:", "Dev ejecuta:", "PME + TL ejecutan:"
  const roleMatch = trimmed.match(/^(.+?)\s+ejecuta[n]?\s*:$/i);
  if (roleMatch) {
    return (
      <div className="flex items-center gap-1.5 mt-2 mb-1">
        <span className="px-2 py-0.5 rounded-md bg-slate-700 text-white text-[10px] font-semibold">
          {roleMatch[1]}
        </span>
        <span className="text-[10px] text-slate-400">ejecuta:</span>
      </div>
    );
  }

  // Skill/command line with → description
  const skillMatch = trimmed.match(/^(skills\/[\w-]+|\/[\w-]+(?:\s+\[[\w]+\])?)\s+→\s+(.+)$/);
  if (skillMatch) {
    return (
      <div className="flex items-start gap-2 ml-3 py-0.5">
        <code className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700 font-mono whitespace-nowrap flex-shrink-0">
          {skillMatch[1]}
        </code>
        <span className="text-indigo-400 flex-shrink-0 mt-0.5">→</span>
        <span className="text-[11px] text-slate-600">{skillMatch[2]}</span>
      </div>
    );
  }

  // Tree-style sub-items: ├── skill: ... → description
  const treeItemMatch = trimmed.match(/^[├└]──\s+(.+?)(?:\s+→\s+(.+))?$/);
  if (treeItemMatch) {
    const isLast = trimmed.startsWith('└');
    return (
      <div className="flex items-start gap-1.5 ml-6 py-0.5">
        <span className="text-slate-300 text-[10px] select-none flex-shrink-0 w-3 text-center">
          {isLast ? '└─' : '├─'}
        </span>
        <code className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700 font-mono whitespace-nowrap flex-shrink-0">
          {treeItemMatch[1]}
        </code>
        {treeItemMatch[2] && (
          <>
            <span className="text-indigo-400 flex-shrink-0 mt-0.5">→</span>
            <span className="text-[11px] text-slate-600">{treeItemMatch[2]}</span>
          </>
        )}
      </div>
    );
  }

  // AUTO: lines (indented continuation)
  const autoMatch = trimmed.match(/^→\s*AUTO\s*:\s*(.+)$/);
  if (autoMatch) {
    return (
      <div className="flex items-start gap-1.5 ml-6 py-0.5">
        <span className="px-1 py-0 rounded bg-emerald-100 text-emerald-700 text-[9px] font-semibold flex-shrink-0">
          AUTO
        </span>
        <span className="text-[11px] text-slate-500">{autoMatch[1]}</span>
      </div>
    );
  }

  // Gate / advance-gate lines with → description
  const gateMatch = trimmed.match(/^(\/advance-gate\s+\d+)\s+→\s+(.+)$/);
  if (gateMatch) {
    return (
      <div className="flex items-start gap-2 ml-3 py-0.5">
        <code className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-mono whitespace-nowrap flex-shrink-0">
          {gateMatch[1]}
        </code>
        <span className="text-indigo-400 flex-shrink-0 mt-0.5">→</span>
        <span className="text-[11px] text-slate-600">{gateMatch[2]}</span>
      </div>
    );
  }

  // Indented continuation with → (like "→ AUTO: ...")
  if (/^\s*→/.test(line)) {
    const content = trimmed.replace(/^→\s*/, '');
    return (
      <div className="flex items-start gap-1.5 ml-6 py-0.5">
        <span className="text-indigo-400 flex-shrink-0">→</span>
        <span className="text-[11px] text-slate-500">{content}</span>
      </div>
    );
  }

  // Parenthetical notes
  if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
    return (
      <div className="ml-6 py-0.5">
        <span className="text-[10px] text-slate-400 italic">{trimmed}</span>
      </div>
    );
  }

  // Default: indented content line
  const indent = line.length - line.trimStart().length;
  return (
    <div className="py-0.5" style={{ marginLeft: `${Math.min(indent, 6) * 4 + 12}px` }}>
      <span className="text-[11px] text-slate-600">{highlightArrows(trimmed)}</span>
    </div>
  );
}

function PhasesDiagram({ code }: { code: string }) {
  const { preamble, phases } = parsePhases(code);
  // Start with first phase expanded
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(() => new Set([0]));

  const togglePhase = (idx: number) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const expandAll = () => setExpandedPhases(new Set(phases.map((_, i) => i)));
  const collapseAll = () => setExpandedPhases(new Set());

  return (
    <div className="space-y-2">
      {/* Preamble */}
      {preamble.length > 0 && (
        <div className="pb-2">
          {preamble.map((line, i) => (
            <span key={i} className="text-xs text-slate-500 italic">
              {highlightArrows(line)}{' '}
            </span>
          ))}
        </div>
      )}

      {/* Expand / Collapse controls */}
      <div className="flex items-center gap-2 pb-1">
        <span className="text-[10px] text-slate-400">{phases.length} fases</span>
        <button
          onClick={expandAll}
          className="text-[10px] px-1.5 py-0.5 rounded text-indigo-500 hover:bg-indigo-50 transition-colors"
        >
          Expandir todas
        </button>
        <button
          onClick={collapseAll}
          className="text-[10px] px-1.5 py-0.5 rounded text-slate-400 hover:bg-slate-100 transition-colors"
        >
          Colapsar
        </button>
      </div>

      {/* Phases */}
      {phases.map((phase, idx) => {
        const color = PHASE_COLORS[idx % PHASE_COLORS.length] ?? {
          accent: 'bg-gray-500',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          light: 'text-gray-600',
          badge: 'bg-gray-100 text-gray-700',
        };
        const isExpanded = expandedPhases.has(idx);
        const nonEmptyLines = phase.contentLines.filter((l) => l.trim());

        return (
          <div
            key={idx}
            className={`rounded-lg border ${color.border} overflow-hidden transition-all`}
          >
            {/* Phase header — clickable */}
            <button
              onClick={() => togglePhase(idx)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 ${color.bg} hover:brightness-95 transition-all text-left`}
            >
              {/* Number badge */}
              {phase.number > 0 ? (
                <div
                  className={`w-7 h-7 rounded-full ${color.accent} text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 shadow-sm`}
                >
                  {phase.number}
                </div>
              ) : (
                <div
                  className={`w-7 h-7 rounded-full bg-slate-400 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 shadow-sm`}
                >
                  <Layers size={12} />
                </div>
              )}

              {/* Title */}
              <div className="flex-1 min-w-0">
                <span className={`text-xs font-semibold ${color.text}`}>
                  {phase.number > 0 ? `Fase ${phase.number}: ` : ''}
                  {phase.title}
                </span>
                {!isExpanded && nonEmptyLines.length > 0 && (
                  <span className="text-[10px] text-slate-400 ml-2">
                    ({nonEmptyLines.length} líneas)
                  </span>
                )}
              </div>

              {/* Expand chevron */}
              {isExpanded ? (
                <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />
              ) : (
                <ChevronRight size={14} className="text-slate-400 flex-shrink-0" />
              )}
            </button>

            {/* Phase content — collapsible */}
            {isExpanded && nonEmptyLines.length > 0 && (
              <div className="px-3 py-2 bg-white border-t border-slate-100">
                {phase.contentLines.map((line, li) => (
                  <PhaseContentLine key={li} line={line} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN DIAGRAM BLOCK COMPONENT
   ═══════════════════════════════════════════ */

const typeConfig: Record<DiagramType, { icon: typeof ListOrdered; label: string; color: string }> =
  {
    flow: { icon: ArrowRight, label: 'Secuencia', color: 'from-indigo-500 to-violet-500' },
    tree: { icon: FolderTree, label: 'Estructura', color: 'from-amber-500 to-orange-500' },
    steps: { icon: ListOrdered, label: 'Procedimiento', color: 'from-emerald-500 to-teal-500' },
    phases: { icon: Layers, label: 'Fases', color: 'from-purple-500 to-indigo-500' },
    unknown: { icon: GitBranch, label: 'Diagrama', color: 'from-slate-500 to-slate-600' },
  };

export function DiagramBlock({ code }: { code: string }) {
  const [showSource, setShowSource] = useState(false);
  const diagramType = detectDiagramType(code);
  const config = typeConfig[diagramType];
  const Icon = config.icon;

  return (
    <div className="my-4 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div
            className={`w-5 h-5 rounded flex items-center justify-center bg-gradient-to-br ${config.color}`}
          >
            <Icon size={11} className="text-white" />
          </div>
          <span className="text-[11px] font-semibold text-slate-600">{config.label}</span>
        </div>
        <button
          onClick={() => setShowSource(!showSource)}
          className="text-[10px] px-2 py-0.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors font-medium"
        >
          {showSource ? 'Visual' : 'Fuente'}
        </button>
      </div>

      {/* Body */}
      <div className="p-4">
        {showSource ? (
          <pre className="bg-slate-900 text-slate-100 rounded-lg p-3 overflow-x-auto text-xs leading-relaxed">
            <code>{code}</code>
          </pre>
        ) : (
          <>
            {diagramType === 'flow' && <FlowDiagram code={code} />}
            {diagramType === 'tree' && <TreeDiagram code={code} />}
            {diagramType === 'steps' && <StepsDiagram code={code} />}
            {diagramType === 'phases' && <PhasesDiagram code={code} />}
            {diagramType === 'unknown' && <UnknownDiagram code={code} />}
          </>
        )}
      </div>
    </div>
  );
}
