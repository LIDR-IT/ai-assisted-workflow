/**
 * InfoTableBlock — Information table block component
 *
 * This component renders a structured information table with configurable styling.
 * It wraps the existing InfoTable component from shared components while adding
 * JSON configuration support for colors and icons.
 *
 * Features:
 * - Key-value data presentation in table format
 * - Custom color schemes for background, border, text, and accents
 * - Dynamic icon support via Lucide icons
 * - Integration with existing InfoTable component
 * - Template variable resolution
 * - Responsive design
 *
 * Part of the JSON-driven content system infrastructure.
 */

import { type JSX } from 'react';
import type { InfoTableBlock as InfoTableBlockType } from '@/data/schemas/content-schema';
import { SectionBox, InfoTable } from '@/app/components/shared/FlowComponents';
import { getIconComponent } from '@/app/components/content/utils/iconUtils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InfoTableBlockProps {
  /** The info table block data */
  readonly block: InfoTableBlockType;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Renders an information table block with custom styling.
 *
 * This component displays structured key-value information in a table format
 * using the existing InfoTable component while adding configurable styling
 * and icon support through JSON configuration.
 */
export function InfoTableBlock({ block }: InfoTableBlockProps): JSX.Element {
  const IconComponent = getIconComponent(block.config?.icon);
  const colors = block.config?.colors || {};

  // Prepare table data for InfoTable component
  const tableRows = block.content.rows.map((row) => ({
    label: row.label,
    value: row.value,
  }));

  return (
    <SectionBox
      title={block.title || 'Information'}
      borderColor={colors.border || 'border-green-200'}
      bgColor={colors.background || 'bg-green-50'}
      icon={
        IconComponent ? (
          <IconComponent className={colors.accent || 'text-green-600'} size={20} />
        ) : undefined
      }
    >
      <div className="overflow-hidden">
        <InfoTable rows={tableRows} />
      </div>
    </SectionBox>
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export default InfoTableBlock;
