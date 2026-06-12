/**
 * Flow Components — Shared UI components for React Flow diagrams and workflows
 *
 * This module provides reusable components for building consistent flow diagrams
 * across the LIDR SDLC Methodology application, including nodes, arrows, legends,
 * and section layouts.
 *
 * Features:
 * - Flow nodes with standardized styling and color schemes
 * - Directional arrows for process flow visualization
 * - Legend components for diagram explanation
 * - Section boxes for content organization
 * - Client-specific badge integration
 * - Export capabilities for diagrams
 *
 * Used extensively in:
 * - SDLC phase diagrams
 * - Workflow visualization components
 * - Process flow documentation
 * - Architecture diagrams
 *
 * Part of the shared component library for LIDR SDLC visualization.
 */

import { ArrowDown, ArrowRight, Info } from 'lucide-react';
import { useCurrentClient } from '@/hooks';

// ---------------------------------------------------------------------------
// Flow Node Components
// ---------------------------------------------------------------------------

/** Props for FlowNode component */
export interface FlowNodeProps {
  /** Primary text displayed in the node */
  title: string;
  /** Optional secondary text displayed below title */
  subtitle?: string;
  /** Tailwind CSS background color class (e.g., 'bg-blue-100') */
  color: string;
  /** Optional icon element to display alongside title */
  icon?: React.ReactNode;
  /** Additional CSS classes for customization */
  className?: string;
}

/**
 * Standardized flow node component for diagrams and workflows.
 *
 * Provides consistent styling and layout for nodes in React Flow diagrams,
 * supporting icons, titles, subtitles, and customizable colors.
 *
 * @param props - FlowNode configuration
 * @returns Styled flow node component
 *
 * @example
 * ```typescript
 * <FlowNode
 *   title="Requirements Phase"
 *   subtitle="Define functional requirements"
 *   color="bg-blue-100"
 *   icon={<FileText size={16} />}
 * />
 * ```
 */
export function FlowNode({ title, subtitle, color, icon, className = '' }: FlowNodeProps) {
  return (
    <div
      className={`${color} rounded-lg p-4 shadow-md border border-black/10 min-w-[180px] flex items-center gap-3 ${className}`}
    >
      {icon && <div className="flex-shrink-0">{icon}</div>}
      <div>
        <div className="font-semibold text-slate-800 text-sm">{title}</div>
        {subtitle && <div className="text-xs text-slate-600 mt-0.5">{subtitle}</div>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Arrow Components
// ---------------------------------------------------------------------------

/**
 * Vertical arrow component for top-to-bottom flow indication.
 *
 * Provides consistent styling and spacing for vertical process flows.
 * Used between vertically stacked flow nodes.
 *
 * @returns Centered vertical arrow with appropriate spacing
 */
export function VerticalArrow() {
  return (
    <div className="flex justify-center py-2">
      <ArrowDown className="text-slate-400" size={22} />
    </div>
  );
}

/**
 * Horizontal arrow component for left-to-right flow indication.
 *
 * Provides consistent styling for horizontal process flows.
 * Used between horizontally arranged flow nodes.
 *
 * @returns Right-pointing arrow with shrink protection
 */
export function HorizontalArrow() {
  return <ArrowRight className="text-slate-400 flex-shrink-0" size={20} />;
}

// ---------------------------------------------------------------------------
// Legend Components
// ---------------------------------------------------------------------------

/** Configuration for legend items in diagram explanations */
export interface LegendItem {
  /** Tailwind CSS color class for the legend indicator */
  color: string;
  /** Text label for the legend item */
  label: string;
  /** Whether this represents a Jira state (adds special badge styling) */
  isJiraState?: boolean;
}

const TrackingBadge = () => {
  return (
    <span className="inline-flex items-center gap-0.5 bg-blue-50 border border-blue-200 rounded-full px-1.5 py-0">
      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
        <path d="M12 2L2 12l10 10 10-10L12 2z" fill="#2684FF" />
      </svg>
      <span className="text-[8px] font-bold text-blue-600 leading-none">Estado</span>
    </span>
  );
};

export function Legend({
  items,
  title = 'Leyenda',
  columns,
}: {
  items: LegendItem[];
  title?: string;
  /** When set, lay out flow steps in a fixed N-column grid instead of inline wrap (better for long legends) */
  columns?: 2 | 3;
}) {
  const { client } = useCurrentClient();
  const jiraStates = items.filter((i) => i.isJiraState);
  const flowSteps = items.filter((i) => !i.isJiraState);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Info className="text-slate-500" size={16} />
        <span className="text-sm font-semibold text-slate-700">{title}</span>
      </div>
      {jiraStates.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-2">
            <TrackingBadge />
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
              Estados {client?.domainTerms?.tracking_tool || 'Jira'} (transiciones configuradas)
            </span>
          </div>
          <div className="flex flex-wrap gap-3 ml-1">
            {jiraStates.map((item, i) => (
              <div key={`j-${i}`} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${item.color} border border-black/10`} />
                <span className="text-xs text-slate-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {flowSteps.length > 0 && (
        <div>
          {jiraStates.length > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                Etapas del flujo
              </span>
            </div>
          )}
          <div
            className={
              columns
                ? `grid grid-cols-1 ${
                    columns === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
                  } gap-x-6 gap-y-2 ml-1`
                : 'flex flex-wrap gap-3 ml-1'
            }
          >
            {flowSteps.map((item, i) => (
              <div key={`f-${i}`} className="flex items-start gap-2">
                <div
                  className={`mt-0.5 w-4 h-4 shrink-0 rounded ${item.color} border border-black/10`}
                />
                <span className="text-xs text-slate-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function SectionBox({
  children,
  title,
  subtitle,
  borderColor = 'border-slate-200',
  bgColor = 'bg-slate-50',
  icon,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  borderColor?: string;
  bgColor?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className={`${bgColor} border-2 ${borderColor} rounded-lg p-5`}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
      {subtitle && <p className="text-sm text-slate-600 mb-4">{subtitle}</p>}
      {children}
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
      {subtitle && <p className="text-slate-500 mt-1 text-sm">{subtitle}</p>}
    </div>
  );
}

export function DiagramCard({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">{children}</div>;
}

export function InfoTable({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
              <td className="px-4 py-2 font-semibold text-slate-700 whitespace-nowrap w-40">
                {row.label}
              </td>
              <td className="px-4 py-2 text-slate-600">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
