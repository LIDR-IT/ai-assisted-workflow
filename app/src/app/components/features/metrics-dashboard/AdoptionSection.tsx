/**
 * @file AdoptionSection - IA Adoption Metrics Source
 */

import { ChartCard } from './ChartCard';
import { type MetricsConfig } from '@/data/features/metrics/metricsData';
import { AlertCircle, ExternalLink } from 'lucide-react';

interface AdoptionSectionProps {
  clientConfig: MetricsConfig;
}

export function AdoptionSection({ clientConfig: _clientConfig }: AdoptionSectionProps) {
  return (
    <div className="space-y-6">
      <ChartCard title="Métricas de Adopción de IA" subtitle="Fuente de datos y acceso">
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="space-y-2">
              <div className="text-sm font-semibold text-blue-800">Assessment de Adopción</div>
              <div className="text-sm text-blue-700">
                Las métricas de adopción de IA se obtienen mediante evaluaciones y encuestas
                especializadas. Los resultados y dashboards se visualizan directamente en la
                plataforma de assessment.
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm font-semibold text-slate-800">Plataforma de Assessment</div>
                <div className="text-xs text-slate-600">
                  Ver métricas y resultados directamente en la herramienta
                </div>
              </div>
              <a
                href="https://ai-assessment.lidr.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                <span>ai-assessment.lidr.co</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </ChartCard>
    </div>
  );
}
