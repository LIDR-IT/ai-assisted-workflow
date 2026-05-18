/**
 * @file MetricsDashboard - Refactored from legacy 975-line monolith
 * @description Main container component (~150 lines) orchestrating modular metrics sections
 * @target <200 lines, clean separation of concerns
 */

import { useState } from 'react';
import { BarChart3, AlertTriangle, Cable } from 'lucide-react';
import { useCurrentClient } from '@/hooks/useClientRegistry';
import {
  sections,
  getClientMetricsConfig,
  type Section,
} from '@/data/features/metrics/metricsData';

// Modular section imports
import { OverviewSection } from './OverviewSection';
import { SprintSection } from './SprintSection';
import { DORASection } from './DORASection';
import { AdoptionSection } from './AdoptionSection';
import { UsageSection } from './UsageSection';

export function MetricsDashboard() {
  const { clientId, client } = useCurrentClient();
  const [activeSection, setActiveSection] = useState<Section>('overview');

  // Get client-specific configuration
  const clientConfig = getClientMetricsConfig(clientId);

  return (
    <div className="space-y-6">
      {/* Header with client-aware messaging */}
      <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border-2 border-indigo-200 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="text-indigo-600" size={24} />
          <div className="font-semibold text-indigo-800 text-lg">
            Dashboard Unificado de Métricas - {client?.name || 'Cliente'}
          </div>
        </div>
        <div className="text-xs text-indigo-600">
          Métricas Sprint y DORA con datos mock. En producción:{' '}
          <strong>{clientConfig.trackingTool} MCP</strong> (velocity, carryover, bugs),{' '}
          <strong>GitHub CLI</strong> (lead time, PRs, deploys), <strong>CI/CD pipeline</strong>{' '}
          (deploy freq, MTTR, change failure rate).
          {clientId === 'docline' ? (
            <>
              {' '}
              Adopción IA vía encuestas en <strong>ai-assessment.lidr.co</strong>. Uso IA vía
              telemetría del IDE/CLI.
            </>
          ) : (
            <>
              {' '}
              Adopción IA via encuestas en <strong>ai-assessment.lidr.co</strong>. Uso IA via
              telemetría del IDE/CLI.
            </>
          )}
        </div>

        <div className="flex gap-2 mt-3 flex-wrap">
          <span className="bg-amber-100 border border-amber-300 rounded px-2 py-1 text-[10px] text-amber-800 font-semibold flex items-center gap-1">
            <AlertTriangle size={10} />
            Datos de ejemplo — no representan métricas reales del proyecto
          </span>
          <span className="bg-violet-100 border border-violet-300 rounded px-2 py-1 text-[10px] text-violet-800 font-semibold flex items-center gap-1">
            <Cable size={10} />
            Fuentes: {clientConfig.trackingTool} + GitHub + CI/CD + LIDR + IDE/CLI
          </span>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex-1 px-3 py-2 rounded-md text-xs transition-colors ${
              activeSection === section.id
                ? 'bg-white text-indigo-700 font-semibold shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Modular Section Content */}
      <div className="space-y-6">
        {activeSection === 'overview' && <OverviewSection clientConfig={clientConfig} />}

        {activeSection === 'sprint' && <SprintSection clientConfig={clientConfig} />}

        {activeSection === 'dora' && <DORASection clientConfig={clientConfig} />}

        {activeSection === 'adoption' && <AdoptionSection clientConfig={clientConfig} />}

        {activeSection === 'uso-ia' && <UsageSection clientConfig={clientConfig} />}
      </div>
    </div>
  );
}
