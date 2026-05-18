/**
 * @file DORASection - Extracted from legacy MetricsDashboard
 * @description DORA metrics visualization with classification table
 */

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartCard } from './ChartCard';
import {
  deployFreqData,
  leadTimeData,
  changeFailureData,
  mttrData,
  DORA_CLASSIFICATION,
  LEVEL_COLORS,
  type MetricsConfig,
} from '@/data/features/metrics/metricsData';

interface DORASectionProps {
  clientConfig: MetricsConfig;
}

export function DORASection({ clientConfig }: DORASectionProps) {
  return (
    <div className="space-y-6">
      {/* DORA Metrics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deployment Frequency */}
        <ChartCard
          title="Deployment Frequency"
          subtitle="Deploys per month — Elite target: multiple per day"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={deployFreqData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
              <Bar dataKey="deploys" name="Deploys" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 text-xs text-slate-500">
            <strong>Fuente:</strong> CI/CD Pipeline + GitHub Actions
          </div>
        </ChartCard>

        {/* Lead Time for Changes */}
        <ChartCard
          title="Lead Time for Changes"
          subtitle="Days from commit to production — Elite target: < 1 hour"
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={leadTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
              <Area
                type="monotone"
                dataKey="days"
                name="Days"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-2 text-xs text-slate-500">
            <strong>Fuente:</strong> {clientConfig.trackingTool} + GitHub API (commit → deploy time)
          </div>
        </ChartCard>

        {/* Change Failure Rate */}
        <ChartCard
          title="Change Failure Rate"
          subtitle="% of deployments causing failures — Elite target: 0-5%"
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={changeFailureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
              <Line
                type="monotone"
                dataKey="rate"
                name="Failure Rate %"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 4, fill: '#ef4444' }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2 text-xs text-slate-500">
            <strong>Fuente:</strong> CI/CD Pipeline + Production monitoring
          </div>
        </ChartCard>

        {/* Mean Time to Recovery */}
        <ChartCard
          title="Mean Time to Recovery (MTTR)"
          subtitle="Hours to restore service — Elite target: < 1 hour"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={mttrData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
              <Bar dataKey="hours" name="Hours" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 text-xs text-slate-500">
            <strong>Fuente:</strong> Incident management + Monitoring alerts
          </div>
        </ChartCard>
      </div>

      {/* DORA Classification Table */}
      <ChartCard
        title="DORA Performance Classification"
        subtitle="Benchmarking actual performance against industry standards"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b-2 border-slate-300">
                <th className="text-left p-3 font-semibold text-slate-700">Metric</th>
                <th className="text-center p-3 font-semibold text-emerald-700">Elite</th>
                <th className="text-center p-3 font-semibold text-blue-700">High</th>
                <th className="text-center p-3 font-semibold text-amber-700">Medium</th>
                <th className="text-center p-3 font-semibold text-red-700">Low</th>
                <th className="text-center p-3 font-semibold text-slate-700 bg-slate-50">
                  Current
                </th>
              </tr>
            </thead>
            <tbody>
              {DORA_CLASSIFICATION.map((row, index) => (
                <tr key={index} className="border-b border-slate-200">
                  <td className="p-3 font-medium text-slate-700">{row.metric}</td>
                  <td className="p-3 text-center text-emerald-600 text-xs">{row.elite}</td>
                  <td className="p-3 text-center text-blue-600 text-xs">{row.high}</td>
                  <td className="p-3 text-center text-amber-600 text-xs">{row.medium}</td>
                  <td className="p-3 text-center text-red-600 text-xs">{row.low}</td>
                  <td className="p-3 text-center bg-slate-50">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-semibold text-slate-800">{row.current}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          LEVEL_COLORS[row.currentLevel]
                        }`}
                      >
                        {row.currentLevel.toUpperCase()}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Performance Summary */}
        <div className="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg">
          <div className="text-sm font-semibold text-indigo-800 mb-2">
            Resumen de Performance DORA
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            {DORA_CLASSIFICATION.map((metric) => (
              <div key={metric.metric} className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    metric.currentLevel === 'elite'
                      ? 'bg-emerald-500'
                      : metric.currentLevel === 'high'
                        ? 'bg-blue-500'
                        : metric.currentLevel === 'medium'
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                  }`}
                />
                <span className="text-slate-600">{metric.metric.split(' ')[0]}</span>
                <span className="font-semibold text-slate-800">{metric.currentLevel}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-indigo-600">
            <strong>Overall DORA Maturity:</strong> High Performing (3/4 metrics at High or Elite
            level)
          </div>
        </div>
      </ChartCard>
    </div>
  );
}
