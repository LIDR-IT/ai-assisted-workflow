/**
 * ToolListBlock — Configurable tool/technology listings block
 *
 * This component renders a list of tools or technologies with configurable styling,
 * categories, descriptions, and links. Supports custom color schemes from JSON config.
 *
 * Features:
 * - Configurable tool listings with name, description, category
 * - Support for external links
 * - Custom color schemes for background, border, text, and accents
 * - Category badges with different styles
 * - Dynamic icon support via Lucide icons
 * - Template variable resolution
 *
 * Part of the JSON-driven content system infrastructure.
 */

import { type JSX } from 'react';
import type { ToolListBlock as ToolListBlockType } from '@/data/schemas/content-schema';
import { SectionBox } from '@/app/components/shared/FlowComponents';
import { getIconComponent } from '@/app/components/content/utils/iconUtils';
import { useColorConfig } from '@/app/components/content/hooks/useColorConfig';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ToolListBlockProps {
  /** The tool list block data */
  readonly block: ToolListBlockType;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Renders a configurable tool/technology listing block.
 *
 * This component displays a collection of tools or technologies with rich
 * formatting including categories, descriptions, and external links.
 * All styling is configurable through the block's config object.
 */
export function ToolListBlock({ block }: ToolListBlockProps): JSX.Element {
  const IconComponent = getIconComponent(block.config?.icon);
  const { colors, elementRef } = useColorConfig(block.config?.colors, {
    fallbackTheme: 'primary',
    validate: true,
    applyCustomProperties: true,
  });

  return (
    <div ref={elementRef}>
      <SectionBox
        title={block.title || 'Tools'}
        borderColor={colors.border}
        bgColor={colors.background}
        icon={IconComponent ? <IconComponent className={colors.accent} size={20} /> : undefined}
      >
        <div className="space-y-3">
          {block.content.tools.map((tool, index) => (
            <ToolItem key={tool.name + index} tool={tool} />
          ))}
        </div>
      </SectionBox>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/**
 * Individual tool item component
 */
interface ToolItemProps {
  readonly tool: {
    readonly name: string;
    readonly description: string;
    readonly category?: string;
    readonly url?: string;
  };
}

function ToolItem({ tool }: ToolItemProps): JSX.Element {
  return (
    <div className="bg-white rounded p-3 border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="font-semibold text-sm text-gray-800">{tool.name}</div>
          <div className="text-xs text-gray-600 mt-1">{tool.description}</div>
        </div>
        {tool.category && <CategoryBadge category={tool.category} />}
      </div>
      {tool.url && <ExternalLink url={tool.url} />}
    </div>
  );
}

/**
 * Category badge component with predefined styles
 */
interface CategoryBadgeProps {
  readonly category: string;
}

function CategoryBadge({ category }: CategoryBadgeProps): JSX.Element {
  const getCategoryStyle = (cat: string): string => {
    switch (cat.toLowerCase()) {
      case 'primary':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'secondary':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'optional':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'deprecated':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`ml-2 px-2 py-1 text-xs rounded-full border ${getCategoryStyle(category)}`}>
      {category}
    </span>
  );
}

/**
 * External link component
 */
interface ExternalLinkProps {
  readonly url: string;
}

function ExternalLink({ url }: ExternalLinkProps): JSX.Element {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block mt-2 text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors"
    >
      Learn more →
    </a>
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export default ToolListBlock;
