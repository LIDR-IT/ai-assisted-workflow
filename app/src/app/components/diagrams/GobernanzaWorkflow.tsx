import { useState } from 'react';
import { GitPullRequest, Bug, ClipboardList } from 'lucide-react';
import { DiagramCard, PageHeader } from '@/app/components/shared/FlowComponents';
import { DiagramRenderer } from '@/app/components/shared/DiagramRenderer';
import { useCurrentClient } from '@/hooks';

const tabs = [
  { id: 'hu', label: 'HU / Evolutivo', icon: ClipboardList },
  { id: 'tarea', label: 'Tareas', icon: GitPullRequest },
  { id: 'bugs', label: 'Bugs IDV', icon: Bug },
] as const;
type TabId = (typeof tabs)[number]['id'];

/* ═══════ Tab Contents ═══════ */
function FlujoHU({ trackingTool }: { trackingTool: string }) {
  return (
    <div className="space-y-4">
      <DiagramCard>
        <DiagramRenderer
          diagramId="gobernanza-workflow-hu"
          showLegend={true}
          showMetadata={false}
          height={700}
          exportName={`Flujo HU Evolutivo - Gobernanza ${trackingTool}`}
          onLoad={(data) => console.warn('Workflow HU diagram loaded:', data.metadata.title)}
          onError={(error) => console.error('Workflow HU diagram error:', error)}
        />
      </DiagramCard>
    </div>
  );
}

function FlujoTarea({ trackingTool }: { trackingTool: string }) {
  return (
    <div className="space-y-4">
      <DiagramCard>
        <DiagramRenderer
          diagramId="gobernanza-workflow-tarea"
          showLegend={true}
          showMetadata={false}
          height={450}
          exportName={`Flujo Tarea - Gobernanza ${trackingTool}`}
          onLoad={(data) => console.warn('Workflow Tarea diagram loaded:', data.metadata.title)}
          onError={(error) => console.error('Workflow Tarea diagram error:', error)}
        />
      </DiagramCard>
    </div>
  );
}

function FlujoBugs({ trackingTool }: { trackingTool: string }) {
  return (
    <div className="space-y-4">
      <DiagramCard>
        <DiagramRenderer
          diagramId="gobernanza-workflow-bugs"
          showLegend={true}
          showMetadata={false}
          height={620}
          exportName={`Flujo Bugs IDV - Gobernanza ${trackingTool}`}
          onLoad={(data) => console.warn('Workflow Bugs diagram loaded:', data.metadata.title)}
          onError={(error) => console.error('Workflow Bugs diagram error:', error)}
        />
      </DiagramCard>
    </div>
  );
}

/* ═══════ MAIN ═══════ */
export function GobernanzaWorkflow() {
  const { client } = useCurrentClient();
  const [activeTab, setActiveTab] = useState<TabId>('hu');
  const trackingTool =
    client?.domainTerms?.tracking_tool || (client?.name === 'Docline' ? 'Linear' : 'Jira');

  return (
    <div>
      <PageHeader
        title="Gobernanza del Workflow"
        subtitle={`Flujos de estados en ${trackingTool} para Historias de Usuario, Tareas y Bugs — Definen cómo cada tipo de item de trabajo transiciona entre estados`}
      />

      <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm border border-slate-200 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'hu' && <FlujoHU trackingTool={trackingTool} />}
      {activeTab === 'tarea' && <FlujoTarea trackingTool={trackingTool} />}
      {activeTab === 'bugs' && <FlujoBugs trackingTool={trackingTool} />}
    </div>
  );
}
