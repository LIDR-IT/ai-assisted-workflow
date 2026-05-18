/**
 * @file UsageSection - IA Usage Metrics Source
 */

import { ChartCard } from './ChartCard';
import { type MetricsConfig } from '@/data/features/metrics/metricsData';
import { AlertCircle, Monitor, BarChart3 } from 'lucide-react';

interface UsageSectionProps {
  clientConfig: MetricsConfig;
}

export function UsageSection({ clientConfig: _clientConfig }: UsageSectionProps) {
  return (
    <div className="space-y-6">
      <ChartCard title="Métricas de Uso de IA" subtitle="Fuente de datos y acceso">
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg">
            <AlertCircle className="text-emerald-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="space-y-2">
              <div className="text-sm font-semibold text-emerald-800">Métricas de Uso IDE/CLI</div>
              <div className="text-sm text-emerald-700">
                Las métricas de uso se obtienen directamente del IDE y Claude Code CLI. Los reportes
                y análisis se visualizan en sus respectivos dashboards.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-lg p-4 bg-gradient-to-b from-slate-50 to-white">
              <div className="flex items-center gap-2 mb-3">
                <Monitor className="text-slate-600" size={16} />
                <div className="font-semibold text-sm text-slate-800">IDE Integration</div>
              </div>
              <div className="text-xs text-slate-600">
                Métricas de uso disponibles en el IDE (VS Code extension, etc.)
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-4 bg-gradient-to-b from-slate-50 to-white">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="text-slate-600" size={16} />
                <div className="font-semibold text-sm text-slate-800">Claude Code CLI</div>
              </div>
              <div className="text-xs text-slate-600">
                Reportes de uso y comandos ejecutados via CLI
              </div>
            </div>
          </div>
        </div>
      </ChartCard>
    </div>
  );
}
