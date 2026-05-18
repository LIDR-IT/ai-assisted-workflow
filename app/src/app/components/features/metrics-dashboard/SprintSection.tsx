/**
 * @file SprintSection - Extracted from legacy MetricsDashboard
 * @description Sprint metrics with velocity, carryover, and bug escape charts
 */

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend as RLegend,
  ReferenceLine,
} from 'recharts';
import { ChartCard } from './ChartCard';
import {
  velocityData,
  carryoverData,
  bugEscapeData,
  type MetricsConfig,
} from '@/data/features/metrics/metricsData';

interface SprintSectionProps {
  clientConfig: MetricsConfig;
}

export function SprintSection({ clientConfig }: SprintSectionProps) {
  return (
    <div className="space-y-6">
      {/* Velocity and Carryover Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Velocity */}
        <ChartCard
          title="Velocity por Sprint"
          subtitle="Story points planificados vs completados — Target: estable +/-10%"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={velocityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="sprint" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
              <RLegend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="planned" name="Planificado" fill="#93c5fd" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" name="Completado" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <ReferenceLine
                y={31}
                stroke="#6366f1"
                strokeWidth={2}
                strokeDasharray="4 4"
                label={{ value: 'Promedio', position: 'right' }}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 text-xs text-slate-500">
            <strong>Fuente:</strong> {clientConfig.trackingTool} MCP - Story points por sprint
          </div>
        </ChartCard>

        {/* Carryover */}
        <ChartCard
          title="Trabajo Arrastrado por Sprint"
          subtitle="Story points no completados — Target: < 10% del sprint anterior"
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={carryoverData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="sprint" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
              <RLegend wrapperStyle={{ fontSize: '11px' }} />
              <Line
                type="monotone"
                dataKey="carryover"
                name="Carryover"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 4, fill: '#f59e0b' }}
              />
              <Line
                type="monotone"
                dataKey="target"
                name="Target (10%)"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 2, fill: '#ef4444' }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2 text-xs text-slate-500">
            <strong>Fuente:</strong> {clientConfig.trackingTool} MCP - Sprint burn down analysis
          </div>
        </ChartCard>
      </div>

      {/* Bug Escape Rate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard
          title="Bug Escape Rate por Sprint"
          subtitle="Bugs encontrados en QA vs escapados a producción — Target: < 5%"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={bugEscapeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="sprint" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
              <RLegend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="found_qa" name="Found in QA" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar
                dataKey="escaped_prod"
                name="Escaped to Prod"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 text-xs text-slate-500">
            <strong>Fuente:</strong> {clientConfig.trackingTool} MCP + Producción monitoring
          </div>
        </ChartCard>

        {/* Sprint Summary Table */}
        <ChartCard title="Resumen por Sprint" subtitle="Métricas clave consolidadas">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-2 font-semibold text-slate-700">Sprint</th>
                  <th className="text-right p-2 font-semibold text-slate-700">Velocity</th>
                  <th className="text-right p-2 font-semibold text-slate-700">Carryover%</th>
                  <th className="text-right p-2 font-semibold text-slate-700">Bug Escape%</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                {velocityData.map((sprint, index) => {
                  const carryover = carryoverData[index];
                  const bugEscape = bugEscapeData[index];
                  const velocityPercent = Math.round((sprint.completed / sprint.planned) * 100);
                  const carryoverPercent = Math.round(
                    ((carryover?.carryover ?? 0) / sprint.planned) * 100
                  );

                  return (
                    <tr key={sprint.sprint} className="border-b border-slate-100">
                      <td className="p-2 font-mono">{sprint.sprint}</td>
                      <td className="p-2 text-right">
                        <span
                          className={velocityPercent >= 90 ? 'text-emerald-600' : 'text-amber-600'}
                        >
                          {velocityPercent}%
                        </span>
                      </td>
                      <td className="p-2 text-right">
                        <span
                          className={carryoverPercent <= 10 ? 'text-emerald-600' : 'text-red-600'}
                        >
                          {carryoverPercent}%
                        </span>
                      </td>
                      <td className="p-2 text-right">
                        <span
                          className={
                            (bugEscape?.rate ?? 0) <= 5 ? 'text-emerald-600' : 'text-red-600'
                          }
                        >
                          {bugEscape?.rate ?? 0}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
