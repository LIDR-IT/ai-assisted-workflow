/**
 * @file MetricCard Component - Extracted from legacy MetricsDashboard
 * @description Reusable metric card with trend indicators and theming support
 */

import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  TrendingUp,
  Activity,
  Bug,
  Rocket,
  Timer,
  Gauge,
} from 'lucide-react';
import type { MetricCardData } from '@/data/features/metrics/metricsData';
import { ICON_COLORS } from '@/fixtures';

interface MetricCardProps {
  title: string;
  value: string;
  target: string;
  trend: 'up' | 'down' | 'stable';
  trendGood: boolean;
  delta: string;
  icon: React.ReactNode;
  source: string;
}

// Icon mapping for type-safe icon selection
const iconMap = {
  'trending-up': TrendingUp,
  activity: Activity,
  bug: Bug,
  rocket: Rocket,
  timer: Timer,
  gauge: Gauge,
};

export function MetricCard({
  title,
  value,
  target,
  trend,
  trendGood,
  delta,
  icon,
  source,
}: MetricCardProps) {
  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;
  const trendColor =
    trend === 'stable' ? 'text-slate-500' : trendGood ? 'text-emerald-600' : 'text-red-500';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="p-2 rounded-lg bg-slate-50">{icon}</div>
        <div className={`flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
          <TrendIcon size={14} />
          {delta}
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-800 mt-2">{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{title}</div>
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
        <span className="text-[10px] text-slate-400">Target: {target}</span>
        <span className="text-[10px] text-violet-500 font-mono">{source}</span>
      </div>
    </div>
  );
}

/**
 * Factory function to create MetricCard from data object
 */
export function createMetricCard(data: MetricCardData, key?: string) {
  const IconComponent = iconMap[data.iconType];
  const iconColor = ICON_COLORS[data.iconType];

  return (
    <MetricCard
      key={key}
      title={data.title}
      value={data.value}
      target={data.target}
      trend={data.trend}
      trendGood={data.trendGood}
      delta={data.delta}
      icon={<IconComponent size={18} className={iconColor} />}
      source={data.source}
    />
  );
}
