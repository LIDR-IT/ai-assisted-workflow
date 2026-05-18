/**
 * @file OverviewSection - Extracted from legacy MetricsDashboard
 * @description Overview section with KPI cards and DORA radar chart
 * @performance Memoized to prevent expensive chart re-computations
 */

import { memo, useMemo } from 'react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { createMetricCard } from './MetricCard';
import { ChartCard } from './ChartCard';
import {
  getOverviewMetrics,
  doraRadarData,
  type MetricsConfig,
} from '@/data/features/metrics/metricsData';

interface OverviewSectionProps {
  clientConfig: MetricsConfig;
}

function OverviewSectionComponent({ clientConfig }: OverviewSectionProps) {
  // Memoize expensive metric computations to prevent re-calculation on every render
  const overviewMetrics = useMemo(() => {
    try {
      return getOverviewMetrics(clientConfig) || [];
    } catch (error) {
      console.warn('Failed to get overview metrics:', error);
      return [];
    }
  }, [clientConfig]);

  // Memoize all metrics combination to prevent array creation on every render
  const allMetrics = useMemo(() => {
    const baseMetrics = Array.isArray(overviewMetrics) ? overviewMetrics : [];
    const customMetrics = Array.isArray(clientConfig?.customMetrics)
      ? clientConfig.customMetrics
      : [];

    return customMetrics.length > 0 ? [...baseMetrics, ...customMetrics] : baseMetrics;
  }, [overviewMetrics, clientConfig?.customMetrics]);

  return (
    <div className="space-y-6">
      {/* KPI Cards - Cliente-agnostic metrics extractable from tools */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {allMetrics.map((metric, index) => createMetricCard(metric, `metric-${index}`))}
      </div>

      {/* DORA Maturity Radar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="DORA Maturity Radar" subtitle="Posición actual vs Elite performance">
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={doraRadarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#64748b' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
              <Radar
                name="Current"
                dataKey="current"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Radar
                name="Elite"
                dataKey="elite"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.1}
                strokeWidth={1}
                strokeDasharray="5 5"
              />
            </RadarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-indigo-600 rounded-sm opacity-80"></div>
              <span className="text-slate-600">Estado Actual</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border border-emerald-600 rounded-sm border-dashed"></div>
              <span className="text-slate-600">Elite Performance</span>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

// Memoize component to prevent expensive chart re-computations
// Custom comparison focuses on clientConfig changes
export const OverviewSection = memo(OverviewSectionComponent, (prevProps, nextProps) => {
  // Only re-render if clientConfig deeply changes
  return JSON.stringify(prevProps.clientConfig) === JSON.stringify(nextProps.clientConfig);
});
