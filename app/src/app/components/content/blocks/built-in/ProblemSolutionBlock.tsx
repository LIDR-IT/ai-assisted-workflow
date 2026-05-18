/**
 * ProblemSolutionBlock — Problem statement with solution items block
 *
 * This component renders a problem-solution pair with custom styling.
 * The problem is displayed with a warning/alert style, and the solution
 * contains a list of actionable items.
 *
 * Features:
 * - Problem statement with alert-style presentation
 * - Solution items as bulleted list
 * - Custom color schemes for background, border, text, and accents
 * - Dynamic icon support via Lucide icons
 * - Template variable resolution
 * - Configurable problem/solution titles
 *
 * Part of the JSON-driven content system infrastructure.
 */

import { type JSX } from 'react';
import { AlertTriangle, ListChecks } from 'lucide-react';
import type { ProblemSolutionBlock as ProblemSolutionBlockType } from '@/data/schemas/content-schema';
import { SectionBox } from '@/app/components/shared/FlowComponents';
import { getIconComponent } from '@/app/components/content/utils/iconUtils';
import { useColorConfig } from '@/app/components/content/hooks/useColorConfig';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProblemSolutionBlockProps {
  /** The problem-solution block data */
  readonly block: ProblemSolutionBlockType;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Renders a problem-solution block with custom styling.
 *
 * This component displays a problem statement followed by a structured
 * solution with actionable items. The styling emphasizes the problem-solution
 * contrast with different color schemes.
 */
export function ProblemSolutionBlock({ block }: ProblemSolutionBlockProps): JSX.Element {
  const IconComponent = getIconComponent(block.config?.icon);
  const { colors, elementRef } = useColorConfig(block.config?.colors, {
    fallbackTheme: 'warning',
    validate: true,
    applyCustomProperties: true,
  });

  return (
    <div ref={elementRef}>
      <SectionBox
        title={block.title || 'Problem & Solution'}
        borderColor={colors.border}
        bgColor={colors.background}
        icon={IconComponent ? <IconComponent className={colors.accent} size={20} /> : undefined}
      >
        <div className="space-y-4">
          <ProblemSection problem={block.content.problem} />
          <SolutionSection solution={block.content.solution} />
        </div>
      </SectionBox>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/**
 * Problem section component
 */
interface ProblemSectionProps {
  readonly problem: {
    readonly title: string;
    readonly description: string;
  };
}

function ProblemSection({ problem }: ProblemSectionProps): JSX.Element {
  return (
    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
      <div className="font-semibold text-sm text-red-800 flex items-center gap-2 mb-2">
        <AlertTriangle size={16} className="flex-shrink-0" />
        {problem.title}
      </div>
      <div className="text-sm text-red-700 leading-relaxed">{problem.description}</div>
    </div>
  );
}

/**
 * Solution section component
 */
interface SolutionSectionProps {
  readonly solution: {
    readonly title: string;
    readonly items: readonly string[];
  };
}

function SolutionSection({ solution }: SolutionSectionProps): JSX.Element {
  return (
    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
      <div className="font-semibold text-sm text-green-800 flex items-center gap-2 mb-3">
        <ListChecks size={16} className="flex-shrink-0" />
        {solution.title}
      </div>
      <SolutionItemsList items={solution.items} />
    </div>
  );
}

/**
 * Solution items list component
 */
interface SolutionItemsListProps {
  readonly items: readonly string[];
}

function SolutionItemsList({ items }: SolutionItemsListProps): JSX.Element {
  return (
    <ul className="text-sm text-green-700 space-y-2">
      {items.map((item, index) => (
        <SolutionItem key={index} item={item} />
      ))}
    </ul>
  );
}

/**
 * Individual solution item component
 */
interface SolutionItemProps {
  readonly item: string;
}

function SolutionItem({ item }: SolutionItemProps): JSX.Element {
  return (
    <li className="flex items-start gap-2">
      <span className="text-green-600 font-semibold mt-0.5 flex-shrink-0">•</span>
      <span className="leading-relaxed">{item}</span>
    </li>
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export default ProblemSolutionBlock;
