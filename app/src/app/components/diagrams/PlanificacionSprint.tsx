import { useState } from 'react';
import { Users, AlertTriangle, Star, Zap, Settings } from 'lucide-react';
import {
  DiagramCard,
  PageHeader,
  SectionBox,
  InfoTable,
} from '@/app/components/shared/FlowComponents';
import { DiagramRenderer } from '@/app/components/shared/DiagramRenderer';
import { ConfigurableSection } from './sections/ConfigurableSection';
import { ProblemasIdentificados } from './sections/ProblemasIdentificados';
import { useCurrentClient } from '@/hooks';
import type { DiagramData, SprintPlanningSections } from '@/data/schemas/diagram-schema';

export function PlanificacionSprint() {
  const { client } = useCurrentClient();
  const [diagramData, setDiagramData] = useState<DiagramData | null>(null);

  // Dynamic content based on client
  const isDocline = client?.name === 'Docline';
  const isAramis = client?.name === 'Aramis';
  const trackingTool = client?.domainTerms?.tracking_tool || (isDocline ? 'Linear' : 'Jira');
  const sprintDuration = isDocline ? '2 semanas (futuro: 3 semanas)' : '2 semanas';
  const estimationMethod = 'Horas (no Story Points)'; // Both clients use hours

  // Determine which diagram to load
  const diagramId = isAramis ? 'planificacion-sprint-enhanced' : 'planificacion-sprint';

  // Check if we have configurable sections
  const hasConfigurableSections =
    diagramData?.sections && Object.keys(diagramData.sections).length > 0;
  const sections = diagramData?.sections as SprintPlanningSections;

  return (
    <div>
      <PageHeader
        title="Planificación de Sprint"
        subtitle={
          isDocline
            ? 'Configuración Docline: Planning Martes, Sprint Miércoles-Miércoles, estimación en horas con equipo horizontal'
            : isAramis
              ? 'Realidad ARAMIS: 2 tribus especializadas (Compras/Ventas) con problemas identificados en discovery session'
              : 'Configuración, roles, proceso y gestión de la planificación de sprints de 2 semanas con estimación en horas'
        }
      />
      <div className="mt-6 space-y-8">
        <DiagramCard>
          <h2 className="text-lg font-semibold text-slate-700 mb-4 text-center">
            {isAramis ? 'Proceso Actual con Problemas Identificados' : 'Proceso de Planificación'}
          </h2>

          {/* JSON-driven diagram renderer */}
          <DiagramRenderer
            diagramId={diagramId}
            showLegend={true}
            showMetadata={false}
            height={680}
            exportName={
              isAramis ? 'ARAMIS_Sprint_Planning_Enhanced' : 'Proceso_de_Planificacion_de_Sprint'
            }
            onLoad={(data) => {
              console.warn('PlanificacionSprint diagram loaded:', data.metadata.title);
              setDiagramData(data as DiagramData);
            }}
            onError={(error) => console.error('PlanificacionSprint diagram error:', error)}
          />
        </DiagramCard>

        {/* Configurable Sections (if available) */}
        {hasConfigurableSections ? (
          <div className="space-y-8">
            {/* Configuration Section */}
            {sections.configuracion && (
              <DiagramCard>
                <ConfigurableSection section={sections.configuracion} variant="configuracion" />
              </DiagramCard>
            )}

            {/* Role Separation and Management Levels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sections.separacion_roles && (
                <DiagramCard>
                  <ConfigurableSection
                    section={sections.separacion_roles}
                    variant="separacion_roles"
                  />
                </DiagramCard>
              )}

              {sections.niveles_gestion && (
                <DiagramCard>
                  <ConfigurableSection
                    section={sections.niveles_gestion}
                    variant="niveles_gestion"
                  />
                </DiagramCard>
              )}
            </div>

            {/* Additional Processes */}
            {sections.procesos_adicionales && sections.procesos_adicionales.length > 0 && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {sections.procesos_adicionales
                    .filter((p) => p.tipo !== 'problemas_aramis')
                    .map((proceso, index) => (
                      <DiagramCard key={index}>
                        <ConfigurableSection section={proceso} variant="proceso_adicional" />
                      </DiagramCard>
                    ))}
                </div>

                {/* Problems Section (ARAMIS specific) */}
                {isAramis && (
                  <DiagramCard>
                    <ProblemasIdentificados
                      problemas={sections.procesos_adicionales}
                      client={client?.name || 'Cliente'}
                    />
                  </DiagramCard>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Fallback to hardcoded sections for backward compatibility */
          <div className="space-y-8">
            {/* Configuration */}
            <DiagramCard>
              <SectionBox
                title="Configuración del Sprint"
                borderColor="border-slate-200"
                bgColor="bg-slate-50"
                icon={<Settings className="text-slate-600" size={20} />}
              >
                <InfoTable
                  rows={[
                    { label: 'Duración', value: sprintDuration },
                    { label: 'Metodología', value: 'Scrum' },
                    { label: 'Estimación', value: estimationMethod },
                    { label: 'Herramienta', value: trackingTool },
                  ]}
                />
              </SectionBox>
            </DiagramCard>

            {/* Roles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <DiagramCard>
                <SectionBox
                  title="Separación QUÉ vs CÓMO"
                  borderColor="border-violet-200"
                  bgColor="bg-violet-50"
                  icon={<Zap className="text-violet-600" size={20} />}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200 text-center">
                      <div className="font-semibold text-green-800 text-sm">PO define el QUÉ</div>
                      <div className="text-xs text-green-600 mt-2">
                        Qué funcionalidades construir
                      </div>
                      <div className="text-xs text-green-600">Qué valor aportar</div>
                      <div className="text-xs text-green-600">Qué priorizar</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 text-center">
                      <div className="font-semibold text-orange-800 text-sm">
                        Dev define el CÓMO
                      </div>
                      <div className="text-xs text-orange-600 mt-2">Cómo implementar</div>
                      <div className="text-xs text-orange-600">Qué arquitectura usar</div>
                      <div className="text-xs text-orange-600">Qué sub-tareas crear</div>
                    </div>
                  </div>
                  {!isDocline && (
                    <div className="mt-3 bg-white rounded p-2 border border-violet-200 text-xs text-violet-700 text-center italic">
                      "Es la primera vez que separamos estos roles"
                    </div>
                  )}
                </SectionBox>
              </DiagramCard>

              <DiagramCard>
                <SectionBox
                  title="Niveles de Gestión"
                  borderColor="border-blue-200"
                  bgColor="bg-blue-50"
                  icon={<Users className="text-blue-600" size={20} />}
                >
                  <div className="font-mono text-sm text-slate-700 bg-white rounded-lg p-4 border border-blue-200">
                    <div className="text-green-700 font-semibold">Product Owner gestiona:</div>
                    <div className="ml-4">├── Épicas (agrupación)</div>
                    <div className="ml-4">├── Historias de Usuario (valor)</div>
                    <div className="ml-4">└── Tareas (trabajo visible)</div>
                    <div className="mt-3 text-orange-700 font-semibold">Equipo Dev gestiona:</div>
                    <div className="ml-4">└── Sub-tareas (papel de trabajo)</div>
                    <div className="ml-8">├── Sub-tarea técnica 1</div>
                    <div className="ml-8">├── Sub-tarea técnica 2</div>
                    <div className="ml-8">└── Sub-tarea técnica 3</div>
                  </div>
                </SectionBox>
              </DiagramCard>
            </div>

            {/* Carryover & Innovations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <DiagramCard>
                <SectionBox
                  title="Gestión de Carryover"
                  borderColor="border-amber-200"
                  bgColor="bg-amber-50"
                  icon={<AlertTriangle className="text-amber-600" size={20} />}
                >
                  <div className="space-y-3 text-sm">
                    <div className="bg-white rounded p-3 border border-amber-200">
                      <div className="font-semibold text-amber-800">Impacto</div>
                      <ul className="text-xs text-amber-600 mt-1 space-y-1 list-disc ml-4">
                        <li>Reduce capacidad del siguiente sprint</li>
                        <li>Incertidumbre en velocidad real</li>
                        <li>Acumula deuda técnica y funcional</li>
                        {!isDocline && <li>Riesgo para fechas planificadas</li>}
                      </ul>
                    </div>
                    <div className="bg-white rounded p-3 border border-green-200">
                      <div className="font-semibold text-green-800">Mitigación</div>
                      <ul className="text-xs text-green-600 mt-1 space-y-1 list-disc ml-4">
                        <li>Estimación conservadora</li>
                        <li>Identificación temprana de bloqueos</li>
                        <li>{isDocline ? 'Gestión informal colaborativa' : 'Governance activa'}</li>
                        <li>Ajuste de scope ante riesgo</li>
                      </ul>
                    </div>
                  </div>
                </SectionBox>
              </DiagramCard>

              <DiagramCard>
                <SectionBox
                  title="Innovaciones del Proceso"
                  borderColor="border-emerald-200"
                  bgColor="bg-emerald-50"
                  icon={<Star className="text-emerald-600" size={20} />}
                >
                  <div className="space-y-2">
                    {[
                      {
                        title: 'Recursos Dedicados 100%',
                        desc: 'Mayor predictibilidad, menor cambio de contexto',
                      },
                      {
                        title: 'Roles Bien Definidos',
                        desc: 'PO (QUÉ) vs Dev (CÓMO) — separación clara',
                      },
                      {
                        title: isDocline ? 'Gestión Colaborativa' : 'Governance Formal',
                        desc: isDocline
                          ? 'Equipo facilita y elimina blockers de manera informal'
                          : 'PME + PO facilitan y eliminan blockers',
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="bg-white rounded p-3 border border-emerald-200 flex items-start gap-2"
                      >
                        <Star size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-sm text-emerald-800">{item.title}</div>
                          <div className="text-xs text-emerald-600">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionBox>
              </DiagramCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
