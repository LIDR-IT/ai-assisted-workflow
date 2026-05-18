/**
 * ChartBlock — Example custom block for charts and visualizations
 *
 * This is an example of how to create a custom content block that will be
 * automatically registered by the plugin system. Simply drop this file in
 * the /custom/ folder and it becomes available for use in JSON content.
 *
 * Features:
 * - Auto-registration via file convention (ChartBlock.tsx → 'chart' type)
 * - Full integration with color configuration system
 * - TypeScript support with proper interfaces
 * - Example of different chart types
 *
 * Usage in JSON:
 * {
 *   "type": "chart",
 *   "config": {
 *     "colors": { "background": "bg-blue-50" }
 *   },
 *   "content": {
 *     "chartType": "bar",
 *     "title": "My Chart",
 *     "data": { "labels": ["Q1", "Q2"], "values": [100, 200] }
 *   }
 * }
 */

import { type JSX } from 'react';
import { BarChart3, TrendingUp, PieChart } from 'lucide-react';
import { SectionBox } from '@/app/components/shared/FlowComponents';
import { useColorConfig } from '@/app/components/content/hooks/useColorConfig';
import { useBlockConfiguration } from '@/hooks/useConfiguration';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChartData {
  readonly labels: readonly string[];
  readonly values: readonly number[];
  readonly colors?: readonly string[];
}

interface ChartContent {
  readonly chartType: 'bar' | 'line' | 'pie';
  readonly title: string;
  readonly data: ChartData;
  readonly showLegend?: boolean;
  readonly height?: number;
}

interface ChartBlockProps {
  readonly block: {
    readonly type: 'chart';
    readonly id: string;
    readonly title?: string;
    readonly content: ChartContent;
    readonly config?: {
      readonly colors?: {
        readonly background?: string;
        readonly border?: string;
        readonly text?: string;
        readonly accent?: string;
      };
      readonly icon?: string;
    };
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Custom Chart Block Component
 *
 * This example shows how to create a custom block that:
 * - Uses the standard block interface
 * - Integrates with the hierarchical configuration system
 * - Automatically inherits client and project configurations
 * - Provides a good user experience with loading states
 * - Follows TypeScript best practices
 */
export default function ChartBlock({ block }: ChartBlockProps): JSX.Element {
  // Get hierarchical configuration specific to this block type
  const { blockConfig, templateVariables, isLoading } = useBlockConfiguration('chart', {
    customColors: block.config?.colors,
    customConfig: {
      height: block.content.height,
      showLegend: block.content.showLegend,
    },
  });

  // Use enhanced color config with hierarchical support
  const { colors, elementRef } = useColorConfig(block.config?.colors, {
    fallbackTheme: 'primary',
    validate: true,
    applyCustomProperties: true,
  });

  // Show loading state while configuration resolves
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 border border-gray-200 rounded-lg">
        <div className="flex items-center space-x-2 text-gray-600">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-sm">Loading chart configuration...</span>
        </div>
      </div>
    );
  }

  // Get configuration values with hierarchy fallbacks
  const chartHeight = blockConfig?.defaultHeight || block.content.height || 200;
  const showBranding = blockConfig?.showProjectBranding || false;
  const primaryColor = blockConfig?.colors?.primary || '#3b82f6';
  const secondaryColor = blockConfig?.colors?.secondary || '#8b5cf6';

  const getChartIcon = () => {
    switch (block.content.chartType) {
      case 'bar':
        return <BarChart3 className={colors.accent} size={20} />;
      case 'line':
        return <TrendingUp className={colors.accent} size={20} />;
      case 'pie':
        return <PieChart className={colors.accent} size={20} />;
      default:
        return <BarChart3 className={colors.accent} size={20} />;
    }
  };

  return (
    <div ref={elementRef}>
      <SectionBox
        title={block.title || block.content.title || 'Chart'}
        borderColor={colors.border}
        bgColor={colors.background}
        icon={getChartIcon()}
      >
        <div className="space-y-4">
          {/* Chart Title */}
          <div className={`font-semibold text-lg ${colors.text}`}>{block.content.title}</div>

          {/* Simulated Chart Area */}
          <div
            className={`relative border-2 ${colors.border} rounded-lg p-4`}
            style={{ height: chartHeight }}
          >
            {/* Chart Type Indicator with client branding */}
            <div className={`absolute top-2 right-2 text-xs ${colors.accent} font-medium`}>
              {block.content.chartType.toUpperCase()} CHART
              {showBranding && templateVariables.PROJECT_CODE && (
                <div className="text-xs text-gray-500 mt-0.5">{templateVariables.PROJECT_CODE}</div>
              )}
            </div>

            {/* Client-specific header if configured */}
            {templateVariables.CLIENT_NAME && showBranding && (
              <div className={`absolute top-2 left-2 text-xs ${colors.text} font-medium`}>
                {templateVariables.CLIENT_NAME}
              </div>
            )}

            {/* Simulated Chart Content with hierarchical colors */}
            <div className="h-full flex items-end justify-around space-x-2 pt-8">
              {block.content.data.labels.map((label, index) => {
                const value = block.content.data.values[index] || 0;
                const maxValue = Math.max(...block.content.data.values);
                const height = (value / maxValue) * 100;

                return (
                  <div key={label} className="flex flex-col items-center space-y-1 flex-1">
                    {/* Simulated Bar/Data Point with hierarchical colors */}
                    <div
                      className="w-full rounded-t min-h-4"
                      style={{
                        height: `${height}%`,
                        background: `linear-gradient(to top, ${primaryColor}, ${secondaryColor})`,
                      }}
                      title={`${label}: ${value}`}
                    />

                    {/* Label */}
                    <div className={`text-xs ${colors.text} text-center`}>{label}</div>

                    {/* Value */}
                    <div className={`text-xs ${colors.accent} font-semibold`}>{value}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend (if enabled) */}
          {block.content.showLegend && (
            <div className="flex flex-wrap gap-2 text-sm">
              <div className={`flex items-center space-x-1 ${colors.text}`}>
                <div className="w-3 h-3 bg-blue-600 rounded-sm" />
                <span>Data Series</span>
              </div>
            </div>
          )}

          {/* Enhanced Chart Info with configuration details */}
          <div className={`text-xs ${colors.text} opacity-75 space-y-1`}>
            <div>
              Chart Type: {block.content.chartType} • Data Points:{' '}
              {block.content.data.labels.length} • Total:{' '}
              {block.content.data.values.reduce((sum, val) => sum + val, 0)}
            </div>
            {templateVariables.CLIENT_NAME && (
              <div>
                Client: {templateVariables.CLIENT_NAME}
                {templateVariables.INDUSTRY && ` • Industry: ${templateVariables.INDUSTRY}`}
              </div>
            )}
            {import.meta.env.DEV && blockConfig && (
              <div className="text-xs text-gray-400 border-t pt-1 mt-1">
                Config Height: {chartHeight}px • Branding: {showBranding ? 'On' : 'Off'} • Theme:{' '}
                {primaryColor}
              </div>
            )}
          </div>
        </div>
      </SectionBox>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Development Notes
// ---------------------------------------------------------------------------

/**
 * How to use this custom block:
 *
 * 1. This file is automatically registered as 'chart' block type
 * 2. Use in JSON like any other block type
 * 3. Full TypeScript support and validation
 * 4. Integrates with color system and theme inheritance
 *
 * To create your own custom block:
 * 1. Copy this file and rename (e.g., TableBlock.tsx)
 * 2. Update the interfaces and component logic
 * 3. Export as default function
 * 4. Block type is auto-detected from filename
 */
