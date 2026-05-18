/**
 * @file ChartCard Component - Extracted from legacy MetricsDashboard
 * @description Reusable chart wrapper with consistent styling
 */

interface ChartCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ title, subtitle, children, className = '' }: ChartCardProps) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-5 shadow-sm ${className}`}>
      <div className="mb-4">
        <div className="font-semibold text-slate-700 text-sm">{title}</div>
        <div className="text-[11px] text-slate-400 mt-0.5">{subtitle}</div>
      </div>
      {children}
    </div>
  );
}
