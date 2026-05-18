import { useState } from 'react';
import { PageHeader } from '@/app/components/shared/FlowComponents';
import { tabsConfig, type TabId } from '@/data/features/propuestaMejora';
import { useCurrentClient } from '@/hooks';
import { ecosystemStats, summaryStrings } from '@/data';

// Import tab components directly (avoid lazy loading for now to simplify debugging)
import { FlowTab } from './FlowTab';
import { DiagnosticoTab } from './DiagnosticoTab';
import { MejorasTab } from './MejorasTab';
import { MetricasTab } from './MetricasTab';
import { PropuestaHero } from './PropuestaHero';

interface PropuestaMejoraProps {
  className?: string;
}

export function PropuestaMejora({ className }: PropuestaMejoraProps) {
  const { client } = useCurrentClient();
  const [activeTab, setActiveTab] = useState<TabId>('flujo');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'flujo':
        return <FlowTab />;
      case 'pain':
        return <DiagnosticoTab />;
      case 'mejoras':
        return <MejorasTab />;
      case 'metricas':
        return <MetricasTab />;
      default:
        return <FlowTab />;
    }
  };

  return (
    <div className={className}>
      <PageHeader
        title={`Ecosistema SDLC ${client.name} — Propuesta Implementada`}
        subtitle={`${ecosystemStats.totalArtifacts} artefactos · ${summaryStrings.qualityGatesCount} · ${ecosystemStats.skills} skills · ${ecosystemStats.commands} commands · ${summaryStrings.workflowsAvailable} · ${summaryStrings.integrityTestsCount} · Spec-Driven Development con Claude Code`}
      />

      {/* Metodological hero — collapsible context visible on all tabs */}
      <PropuestaHero />

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 p-4 bg-gray-50 rounded-lg">
        {tabsConfig.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-700 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">{renderTabContent()}</div>
    </div>
  );
}
