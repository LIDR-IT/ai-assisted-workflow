/**
 * DiagramBlock — Diagram integration block component
 *
 * This component provides seamless integration between the content system
 * and the existing DiagramRenderer. It renders interactive diagrams within
 * the JSON-driven content blocks while maintaining all DiagramRenderer
 * functionality including template variable resolution and export capabilities.
 *
 * Features:
 * - Full integration with existing DiagramRenderer
 * - Template variable resolution for diagram content
 * - Optional title display above diagram
 * - Export functionality (PNG, PDF) pass-through
 * - Legend and metadata display options
 * - Responsive design and proper sizing
 * - Multi-client support via clientId parameter
 *
 * Part of the JSON-driven content system infrastructure.
 */

import { type JSX } from 'react';
import type { DiagramBlock as DiagramBlockType } from '@/data/schemas/content-schema';
import { DiagramRenderer } from '@/app/components/shared/DiagramRenderer';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DiagramBlockProps {
  /** The diagram block data */
  readonly block: DiagramBlockType;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Renders a diagram block using the existing DiagramRenderer.
 *
 * This component acts as a bridge between the JSON content system and
 * the DiagramRenderer, preserving all existing functionality while
 * providing a consistent interface for JSON configuration.
 */
export function DiagramBlock({ block }: DiagramBlockProps): JSX.Element {
  return (
    <div className="w-full">
      {/* Optional title */}
      {block.title && <DiagramTitle title={block.title} />}

      {/* Diagram renderer */}
      <DiagramContainer>
        <DiagramRenderer
          diagramId={block.content.diagramId}
          clientId={block.content.clientId}
          height={block.content.height}
          exportName={block.content.exportName}
          showLegend={block.content.showLegend}
          showMetadata={block.content.showMetadata}
          resolveVariables={block.content.resolveVariables}
        />
      </DiagramContainer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/**
 * Diagram title component
 */
interface DiagramTitleProps {
  readonly title: string;
}

function DiagramTitle({ title }: DiagramTitleProps): JSX.Element {
  return <h2 className="text-lg font-semibold text-slate-700 mb-4 text-center">{title}</h2>;
}

/**
 * Diagram container with responsive behavior
 */
interface DiagramContainerProps {
  readonly children: React.ReactNode;
}

function DiagramContainer({ children }: DiagramContainerProps): JSX.Element {
  return (
    <div className="w-full overflow-hidden rounded-lg bg-white border border-gray-200">
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export default DiagramBlock;
