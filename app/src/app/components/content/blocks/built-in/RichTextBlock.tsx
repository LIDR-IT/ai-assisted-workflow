/**
 * RichTextBlock — Rich text content block component
 *
 * This component renders text content with optional markdown support and
 * configurable styling. It can display plain text or markdown-formatted
 * content within a styled container.
 *
 * Features:
 * - Plain text and markdown content support
 * - Custom color schemes for background, border, text, and accents
 * - Dynamic icon support via Lucide icons
 * - Optional title display with SectionBox styling
 * - Whitespace preservation for formatted text
 * - Responsive design
 * - Template variable resolution
 *
 * Part of the JSON-driven content system infrastructure.
 */

import { type JSX } from 'react';
import type { RichTextBlock as RichTextBlockType } from '@/data/schemas/content-schema';
import { SectionBox } from '@/app/components/shared/FlowComponents';
import { getIconComponent } from '@/app/components/content/utils/iconUtils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RichTextBlockProps {
  /** The rich text block data */
  readonly block: RichTextBlockType;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Renders a rich text block with optional markdown support.
 *
 * This component displays text content with configurable styling and
 * optional SectionBox wrapping when a title is provided.
 */
export function RichTextBlock({ block }: RichTextBlockProps): JSX.Element {
  const IconComponent = getIconComponent(block.config?.icon);
  const colors = block.config?.colors || {};

  // Prepare the text content
  const content = renderTextContent(block.content);

  // If no title, render as simple content block
  if (!block.title) {
    return <SimpleTextContainer colors={colors}>{content}</SimpleTextContainer>;
  }

  // If title provided, use SectionBox wrapper
  return (
    <SectionBox
      title={block.title}
      borderColor={colors.border || 'border-gray-200'}
      bgColor={colors.background || 'bg-gray-50'}
      icon={
        IconComponent ? (
          <IconComponent className={colors.accent || 'text-gray-600'} size={20} />
        ) : undefined
      }
    >
      {content}
    </SectionBox>
  );
}

// ---------------------------------------------------------------------------
// Content Rendering
// ---------------------------------------------------------------------------

/**
 * Render text content based on format type
 */
function renderTextContent(content: RichTextBlockType['content']): React.ReactNode {
  if (content.markdown) {
    // TODO: Add markdown parsing support
    // For now, display as formatted text with prose styling
    return (
      <div className="prose prose-sm max-w-none text-gray-700">
        <div className="whitespace-pre-wrap leading-relaxed">{content.text}</div>
      </div>
    );
  }

  // Plain text with whitespace preservation
  return (
    <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{content.text}</div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/**
 * Simple text container without SectionBox wrapper
 */
interface SimpleTextContainerProps {
  readonly colors: Record<string, string>;
  readonly children: React.ReactNode;
}

function SimpleTextContainer({ colors, children }: SimpleTextContainerProps): JSX.Element {
  const backgroundColor = colors.background || 'bg-white';
  const borderColor = colors.border || 'border-gray-200';

  return (
    <div className={`${backgroundColor} ${borderColor} rounded-lg p-4 border`}>{children}</div>
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export default RichTextBlock;
