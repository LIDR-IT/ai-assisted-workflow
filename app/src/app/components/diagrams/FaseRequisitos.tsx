import { memo, useMemo } from 'react';
import { Cpu, FileText, MessageSquare, AlertTriangle } from 'lucide-react';
import {
  DiagramCard,
  PageHeader,
  SectionBox,
  InfoTable,
} from '@/app/components/shared/FlowComponents';
import { DiagramRenderer } from '@/app/components/shared/DiagramRenderer';
import { useCurrentClient } from '@/hooks';

function FaseRequisitosComponent() {
  const { client } = useCurrentClient();

  // Memoize dynamic tools computation to prevent recalculation on every render
  const { docTool, trackingTool, communicationTool } = useMemo(
    () => ({
      docTool:
        client?.domainTerms?.doc_system ||
        (client?.name === 'Docline' ? 'Linear + Docs locales' : 'Confluence'),
      trackingTool:
        client?.domainTerms?.tracking_tool || (client?.name === 'Docline' ? 'Linear' : 'Jira'),
      communicationTool: client?.name === 'Docline' ? 'Slack + Teams' : 'Correo/Chat',
    }),
    [client?.domainTerms?.doc_system, client?.domainTerms?.tracking_tool, client?.name]
  );

  return (
    <div>
      <PageHeader
        title="Fase de Requisitos"
        subtitle="Origen, procesamiento y transformación de requisitos desde las fuentes de negocio y tecnología"
      />

      <div className="mt-6 space-y-6">
        <DiagramCard>
          <h2 className="text-lg font-semibold text-slate-700 mb-4 text-center">
            Flujo de la Fase de Requisitos
          </h2>

          {/* New JSON-driven diagram renderer */}
          <DiagramRenderer
            diagramId="fase-requisitos"
            showLegend={true}
            showMetadata={false}
            height={650}
            onLoad={(data) => console.warn('FaseRequisitos diagram loaded:', data.metadata.title)}
            onError={(error) => console.error('FaseRequisitos diagram error:', error)}
          />
        </DiagramCard>

        {/* Details - keeping the same additional content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DiagramCard>
            <SectionBox
              title="Involucramiento de R&D"
              borderColor="border-blue-200"
              bgColor="bg-blue-50"
              icon={<Cpu className="text-blue-600" size={20} />}
            >
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">1.</span> CTO canaliza solicitudes a R&D
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">2.</span> Investigación de capacidades
                  técnicas
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">3.</span> Evaluación de algoritmos y
                  viabilidad
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">4.</span> Propuestas de soluciones técnicas
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">5.</span> Formalización en PRD (técnico)
                </li>
              </ul>
            </SectionBox>
          </DiagramCard>

          <DiagramCard>
            <SectionBox
              title="Dos secciones del PRD unificado"
              borderColor="border-cyan-200"
              bgColor="bg-cyan-50"
              icon={<FileText className="text-cyan-600" size={20} />}
            >
              <div className="space-y-3">
                <div className="bg-blue-50 rounded p-3 border border-blue-200">
                  <div className="font-semibold text-sm text-blue-800">PRD (técnico)</div>
                  <div className="text-xs text-blue-600 mt-1">
                    R&D / Core · Algoritmos, prototipos, viabilidad
                  </div>
                  <div className="text-xs text-blue-500 mt-1">Define el "techo" técnico</div>
                </div>
                <div className="bg-green-50 rounded p-3 border border-green-200">
                  <div className="font-semibold text-sm text-green-800">PRD (funcional)</div>
                  <div className="text-xs text-green-600 mt-1">
                    Producto · Overview, alcance, RFs, roadmap
                  </div>
                  <div className="text-xs text-green-500 mt-1">Define QUÉ y CÓMO se comporta</div>
                </div>
              </div>
            </SectionBox>
          </DiagramCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DiagramCard>
            <SectionBox
              title="Herramientas de Comunicación"
              borderColor="border-slate-200"
              bgColor="bg-slate-50"
              icon={<MessageSquare className="text-slate-600" size={20} />}
            >
              <InfoTable
                rows={[
                  { label: 'Reuniones', value: 'Captura de requisitos con stakeholders' },
                  { label: docTool, value: 'Documentación central de PRDs y RFs' },
                  { label: trackingTool, value: 'Trazabilidad de User Stories y tickets' },
                  { label: communicationTool, value: 'Comunicación ad-hoc entre equipos' },
                ]}
              />
            </SectionBox>
          </DiagramCard>

          <DiagramCard>
            <SectionBox
              title="Pain Point: Documentación Retroactiva"
              borderColor="border-amber-200"
              bgColor="bg-amber-50"
              icon={<AlertTriangle className="text-amber-600" size={20} />}
            >
              <div className="text-sm text-slate-600 space-y-2">
                <p>
                  Parte del desarrollo comenzó antes de tener documentación completa. Esto genera:
                </p>
                <ul className="space-y-1 ml-4 list-disc text-amber-700">
                  <li>Documentar retroactivamente funcionalidades en desarrollo/producción</li>
                  <li>Reconstruir lógica de decisiones informales</li>
                  <li>Asegurar que la documentación refleje lo construido</li>
                </ul>
              </div>
            </SectionBox>
          </DiagramCard>
        </div>
      </div>
    </div>
  );
}

// Memoize React Flow diagram component to prevent unnecessary re-renders
// Only re-renders when client configuration changes
export const FaseRequisitos = memo(FaseRequisitosComponent);
