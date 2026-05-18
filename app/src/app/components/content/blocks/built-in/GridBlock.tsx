/**
 * GridBlock — Grid layout container block component
 *
 * This component renders a responsive grid layout that can contain other
 * content blocks. It supports configurable columns, spacing, and responsive
 * behavior to create flexible multi-column layouts.
 *
 * Features:
 * - Configurable column count (1-6 columns)
 * - Responsive grid behavior with breakpoint overrides
 * - Adjustable gap spacing (small, medium, large)
 * - Recursive content block rendering within grid cells
 * - Optional title display
 * - Automatic content block wrapping
 * - Mobile-first responsive design
 *
 * Part of the JSON-driven content system infrastructure.
 */

import { type JSX } from 'react';
import type { GridBlock as GridBlockData } from '@/data/schemas/content-schema';
import { ContentBlockRenderer } from '@/app/components/content/ContentBlockRenderer';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GridBlockProps {
  /** The grid block data */
  readonly block: GridBlockData;
}

type GapSize = 'small' | 'medium' | 'large';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Renders a grid layout containing other content blocks.
 *
 * This component creates a responsive grid system that can display
 * multiple content blocks in a structured layout with configurable
 * columns and spacing.
 */
export function GridBlock({ block }: GridBlockProps): JSX.Element {
  const columns = Math.min(Math.max(block.content.columns || 2, 1), 6); // Clamp between 1-6
  const gap = (block.content.gap || 'medium') as GapSize;
  const responsive = block.content.responsive !== false; // Default to true

  return (
    <div className="w-full">
      {/* Optional title */}
      {block.title && <GridTitle title={block.title} />}

      {/* Grid container */}
      <GridContainer columns={columns} gap={gap} responsive={responsive}>
        {block.content.blocks.map((gridBlock, index) => (
          <GridCell key={gridBlock.id || `cell-${index}`} index={index}>
            <ContentBlockRenderer block={gridBlock} />
          </GridCell>
        ))}
      </GridContainer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/**
 * Grid title component
 */
interface GridTitleProps {
  readonly title: string;
}

function GridTitle({ title }: GridTitleProps): JSX.Element {
  return <h2 className="text-lg font-semibold text-slate-700 mb-6">{title}</h2>;
}

/**
 * Grid container with responsive columns and spacing
 */
interface GridContainerProps {
  readonly columns: number;
  readonly gap: GapSize;
  readonly responsive: boolean;
  readonly children: React.ReactNode;
}

function GridContainer({ columns, gap, responsive, children }: GridContainerProps): JSX.Element {
  const gapClasses = getGapClasses(gap);
  const columnClasses = getColumnClasses(columns, responsive);

  return <div className={`grid ${gapClasses} ${columnClasses}`}>{children}</div>;
}

/**
 * Individual grid cell wrapper
 */
interface GridCellProps {
  readonly index: number;
  readonly children: React.ReactNode;
}

function GridCell({ index, children }: GridCellProps): JSX.Element {
  return (
    <div className="w-full" data-grid-index={index}>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Utility Functions
// ---------------------------------------------------------------------------

/**
 * Get CSS classes for gap spacing
 */
function getGapClasses(gap: GapSize): string {
  const gapMap: Record<GapSize, string> = {
    small: 'gap-3',
    medium: 'gap-6',
    large: 'gap-8',
  };

  return gapMap[gap] || gapMap.medium;
}

/**
 * Get CSS classes for grid columns with optional responsive behavior
 */
function getColumnClasses(columns: number, responsive: boolean): string {
  if (!responsive) {
    return `grid-cols-${columns}`;
  }

  // Responsive behavior: start with 1 column on mobile, scale up on larger screens

  if (columns === 1) {
    return 'grid-cols-1';
  }

  if (columns === 2) {
    return 'grid-cols-1 md:grid-cols-2';
  }

  if (columns === 3) {
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  }

  if (columns === 4) {
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  }

  if (columns === 5) {
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5';
  }

  // 6 columns
  return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6';
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export default GridBlock;
