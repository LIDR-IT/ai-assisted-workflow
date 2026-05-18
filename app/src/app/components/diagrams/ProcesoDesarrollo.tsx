import { Users, Bot, CheckCircle2, ArrowRight } from 'lucide-react';
import { DiagramCard, PageHeader, SectionBox } from '@/app/components/shared/FlowComponents';
import { DiagramRenderer } from '@/app/components/shared/DiagramRenderer';
import { Link } from 'react-router';
import { useCurrentClient } from '@/hooks';
import { useClientPath } from '@/hooks/useClientPath';

export function ProcesoDesarrollo() {
  const { client } = useCurrentClient();
  const { path } = useClientPath();

  // Dynamic content based on client
  const trackingTool =
    client?.domainTerms?.tracking_tool || (client?.name === 'Docline' ? 'Linear' : 'Jira');
  return (
    <div>
      <PageHeader
        title="Proceso de Desarrollo"
        subtitle={
          client?.name === 'Docline'
            ? 'Flujo informal efectivo: Sprints Miércoles-Miércoles, Planning Martes, Dual Tech Leads'
            : client?.name === 'Aramis'
              ? 'Scrumban híbrido: Sprints 2 semanas inicia lunes, Tribes Compras/Ventas, Redmine + GitLab'
              : 'Estrategia de branching, flujo de PR, asignación de tareas y Definition of Done'
        }
      />
      <div className="mt-6 space-y-6">
        <DiagramCard>
          <h2 className="text-lg font-semibold text-slate-700 mb-4 text-center">
            Flujo de Pull Request
          </h2>

          {/* JSON-driven diagram renderer */}
          <DiagramRenderer
            diagramId="proceso-desarrollo"
            showLegend={true}
            showMetadata={false}
            height={500}
            exportName="Flujo_de_Pull_Request"
            onLoad={(data) =>
              console.warn('ProcesoDesarrollo diagram loaded:', data.metadata.title)
            }
            onError={(error) => console.error('ProcesoDesarrollo diagram error:', error)}
          />
        </DiagramCard>

        <DiagramCard>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-700">
              Flujo de Estados en {trackingTool}
            </h2>
            <Link
              to={path('gobernanza')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-semibold"
            >
              Ver flujos completos <ArrowRight size={14} />
            </Link>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
            <p className="text-sm text-indigo-800">
              Los flujos de estados completos (HU/Evolutivo, Tareas y Bugs) se gestionan desde la
              sección de <strong>Gobernanza del Workflow</strong>, donde se definen todas las
              transiciones, estados intermedios y reglas de cada tipo de item.
            </p>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-indigo-600">
              <span className="px-2 py-1 bg-blue-500 text-white rounded">TO DO</span>
              <ArrowRight size={12} />
              <span className="px-2 py-1 bg-blue-600 text-white rounded">IN PROGRESS</span>
              <ArrowRight size={12} />
              <span className="px-2 py-1 bg-indigo-400 text-white rounded">PENDING DEPLOY</span>
              <ArrowRight size={12} />
              <span className="px-2 py-1 bg-cyan-500 text-white rounded">READY TO QA</span>
              <ArrowRight size={12} />
              <span className="px-2 py-1 bg-emerald-200 text-emerald-800 rounded">FINISHED</span>
              <ArrowRight size={12} />
              <span className="px-2 py-1 bg-green-500 text-white rounded">CLOSED</span>
            </div>
          </div>
          <div className="mt-3 bg-amber-50 rounded p-2 border border-amber-200 text-xs text-amber-700 text-center">
            <strong>Nota:</strong> El estado "Ready for QA" señaliza cuándo QA puede comenzar la
            validación
          </div>
        </DiagramCard>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DiagramCard>
            <SectionBox
              title="Asignación de Tareas"
              borderColor="border-orange-200"
              bgColor="bg-orange-50"
              icon={<Users className="text-orange-600" size={20} />}
            >
              <div className="space-y-2">
                {(client?.name === 'Docline'
                  ? [
                      {
                        title: 'Planning Martes',
                        desc: 'Sprint planning day antes del inicio (miércoles)',
                      },
                      {
                        title: 'Equipo Horizontal',
                        desc: 'Todo el equipo hace todo según necesidad del sprint',
                      },
                      {
                        title: 'Dual Tech Leads',
                        desc: 'Héctor (Frontend) · David (Backend) — Especialización + flexibilidad',
                      },
                      {
                        title: 'Autonomía Total',
                        desc: '"Les damos potestad para que generen sus tareas" — Self-organization',
                      },
                    ]
                  : client?.name === 'Aramis'
                    ? [
                        {
                          title: 'Scrumban · Sprint inicia lunes',
                          desc: 'Planning siempre formal (1–2h), Daily + Retro — sin Sprint Review',
                        },
                        {
                          title: 'Estructura por Tribus',
                          desc: 'Tribe Compras (Adrián Louro TL) + Tribe Ventas (David/Reme/Ramón/Alberto)',
                        },
                        {
                          title: 'Tickets desde Redmine',
                          desc: 'Gherkin/BDD como criterios — sin DoD formal de salida',
                        },
                        {
                          title: 'Code review dual',
                          desc: 'Calidad técnica + cumplimiento de criterios de aceptación (inconsistente)',
                        },
                      ]
                    : [
                        {
                          title: 'Tech Lead asigna',
                          desc: 'Tareas a partir de tickets priorizados',
                        },
                        {
                          title: 'Devs generan sub-tareas',
                          desc: 'Autonomía técnica en descomposición de trabajo',
                        },
                        {
                          title: 'Criterios = Contrato',
                          desc: 'Criterios de aceptación del PO como acuerdo formal',
                        },
                      ]
                ).map((item, i) => (
                  <div key={i} className="bg-white rounded p-3 border border-orange-200">
                    <div className="font-semibold text-sm text-orange-800">{item.title}</div>
                    <div className="text-xs text-orange-600 mt-1">{item.desc}</div>
                  </div>
                ))}
              </div>
            </SectionBox>
          </DiagramCard>

          <DiagramCard>
            <SectionBox
              title="Definition of Done"
              borderColor="border-emerald-200"
              bgColor="bg-emerald-50"
              icon={<CheckCircle2 className="text-emerald-600" size={20} />}
            >
              <div className="bg-white rounded p-4 border border-emerald-200">
                <div className="text-sm text-slate-700 space-y-2">
                  {client?.name === 'Docline' ? (
                    <>
                      <p className="font-semibold text-emerald-800">Primera vez con DoD formal:</p>
                      <ul className="space-y-1 list-disc ml-4 text-slate-600 text-xs">
                        <li>
                          La User Story <strong>no se cierra</strong> hasta que QA la valide
                          completamente
                        </li>
                        <li>Transición de QA reactivo ("QA live") a validación sistemática</li>
                        <li>El estado "Ready for QA" señaliza cuándo QA puede comenzar</li>
                        <li>Proceso en evolución: de informal efectivo a formal documentado</li>
                      </ul>
                    </>
                  ) : client?.name === 'Aramis' ? (
                    <>
                      <p className="font-semibold text-amber-800">Sin DoD formal — gap crítico:</p>
                      <ul className="space-y-1 list-disc ml-4 text-slate-600 text-xs">
                        <li>
                          Gherkin/BDD presente <strong>sin gate formal de salida</strong> —
                          criterios existen pero no se aplican sistemáticamente
                        </li>
                        <li>PHPStan en CI (análisis estático) — fortaleza activa ✅</li>
                        <li>Cypress E2E en repo separado — no bloquea CI ⚠️</li>
                        <li>
                          Code review dual: técnico + criterios de aceptación (según reviewer)
                        </li>
                      </ul>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-emerald-800">
                        Definition of Done establecida:
                      </p>
                      <ul className="space-y-1 list-disc ml-4 text-slate-600 text-xs">
                        <li>Code review aprobado por peer + Tech Lead</li>
                        <li>Tests unitarios pasan con cobertura ≥80%</li>
                        <li>SAST/SCA sin vulnerabilidades críticas/altas</li>
                        <li>Documentation actualizada</li>
                      </ul>
                    </>
                  )}
                </div>
              </div>
              <div className="mt-3">
                <div className="bg-white rounded p-3 border border-slate-200">
                  <div className="font-semibold text-sm text-slate-800 flex items-center gap-1">
                    <Bot size={14} /> Uso de IA por Dev
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {client?.name === 'Aramis' ? (
                      <>
                        Claude Code + JetBrains: frecuente pero sin estandarización. Casos
                        avanzados: Luis Marco (~70% automatizado), Pedro (MCP Redmine), Ramón. VMAT
                        (Adrián Louro) como punto de partida.
                      </>
                    ) : (
                      'Estado actual desconocido. QA y Producto sí usan IA; Desarrollo no confirmado.'
                    )}
                  </div>
                </div>
              </div>
            </SectionBox>
          </DiagramCard>
        </div>
      </div>
    </div>
  );
}
