/**
 * CodeHierarchyBlock — Hierarchical code structure display block
 *
 * This component renders hierarchical code structures, file trees, or nested
 * data with indentation and optional connecting lines. Supports custom
 * styling and colors for different hierarchy levels.
 *
 * Features:
 * - Recursive hierarchy rendering with proper indentation
 * - Optional connecting lines between hierarchy levels
 * - Custom colors for different items or levels
 * - Configurable indentation size
 * - Monospace font for code-like appearance
 * - Dark theme container with syntax highlighting feel
 * - Template variable resolution
 *
 * Part of the JSON-driven content system infrastructure.
 */

import { type JSX } from 'react';
import type { CodeHierarchyBlock as CodeHierarchyBlockType } from '@/data/schemas/content-schema';
import { SectionBox } from '@/app/components/shared/FlowComponents';
import { getIconComponent } from '@/app/components/content/utils/iconUtils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CodeHierarchyBlockProps {
  /** The code hierarchy block data */
  readonly block: CodeHierarchyBlockType;
}

interface HierarchyItem {
  readonly id: string;
  readonly label: string;
  readonly color?: string;
  readonly children?: readonly HierarchyItem[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Renders a hierarchical code structure block.
 *
 * This component displays nested data structures with proper indentation
 * and optional connecting lines, designed to look like code or file trees.
 */
export function CodeHierarchyBlock({ block }: CodeHierarchyBlockProps): JSX.Element {
  const IconComponent = getIconComponent(block.config?.icon);
  const colors = block.config?.colors || {};

  return (
    <SectionBox
      title={block.title || 'Code Hierarchy'}
      borderColor={colors.border || 'border-slate-200'}
      bgColor={colors.background || 'bg-slate-50'}
      icon={
        IconComponent ? (
          <IconComponent className={colors.accent || 'text-slate-600'} size={20} />
        ) : undefined
      }
    >
      <CodeContainer>
        <HierarchyList
          items={block.content.items}
          showLines={block.content.showLines}
          indentSize={block.content.indentSize || 20}
          textColor={colors.text || 'text-slate-100'}
        />
      </CodeContainer>
    </SectionBox>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/**
 * Dark-themed container that mimics code editor appearance
 */
interface CodeContainerProps {
  readonly children: React.ReactNode;
}

function CodeContainer({ children }: CodeContainerProps): JSX.Element {
  return (
    <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto border border-slate-700">
      <div className="font-mono text-sm">{children}</div>
    </div>
  );
}

/**
 * Hierarchy list component that renders items recursively
 */
interface HierarchyListProps {
  readonly items: readonly HierarchyItem[];
  readonly showLines?: boolean;
  readonly indentSize: number;
  readonly textColor: string;
  readonly level?: number;
}

function HierarchyList({
  items,
  showLines = true,
  indentSize,
  textColor,
  level = 0,
}: HierarchyListProps): JSX.Element {
  return (
    <div className="space-y-1">
      {items.map((item) => (
        <HierarchyItemComponent
          key={item.id}
          item={item}
          showLines={showLines}
          indentSize={indentSize}
          textColor={textColor}
          level={level}
        />
      ))}
    </div>
  );
}

/**
 * Individual hierarchy item component
 */
interface HierarchyItemProps {
  readonly item: HierarchyItem;
  readonly showLines: boolean;
  readonly indentSize: number;
  readonly textColor: string;
  readonly level: number;
}

function HierarchyItemComponent({
  item,
  showLines,
  indentSize,
  textColor,
  level,
}: HierarchyItemProps): JSX.Element {
  const indent = level * indentSize;
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div>
      {/* Current item */}
      <div className={`flex items-start ${textColor}`} style={{ marginLeft: `${indent}px` }}>
        {level > 0 && showLines && <TreeConnector />}
        <ItemLabel label={item.label} color={item.color} textColor={textColor} />
      </div>

      {/* Children */}
      {hasChildren && (
        <HierarchyList
          items={item.children!}
          showLines={showLines}
          indentSize={indentSize}
          textColor={textColor}
          level={level + 1}
        />
      )}
    </div>
  );
}

/**
 * Tree connector line component
 */
function TreeConnector(): JSX.Element {
  return <span className="text-slate-400 mr-2 select-none">├──</span>;
}

/**
 * Item label component with optional custom color
 */
interface ItemLabelProps {
  readonly label: string;
  readonly color?: string;
  readonly textColor: string;
}

function ItemLabel({ label, color, textColor }: ItemLabelProps): JSX.Element {
  // Use custom color if provided, otherwise fall back to default text color
  const labelClass = color || textColor;

  return <span className={`select-text ${labelClass}`}>{label}</span>;
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export default CodeHierarchyBlock;
