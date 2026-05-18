import { Server, Rocket, Star, Calendar, Users } from 'lucide-react';
import { DiagramCard, PageHeader, SectionBox } from '@/app/components/shared/FlowComponents';
import { DiagramRenderer } from '@/app/components/shared/DiagramRenderer';
import { useCurrentClient } from '@/hooks';

export function EntornosDespliegue() {
  const { client } = useCurrentClient();

  // Dynamic content based on client
  const isDocline = client?.name === 'Docline';
  const securityProcess = isDocline ? 'Code Quality' : 'DAST';
  const scanningProcess = isDocline ? 'Quality checks' : 'Escaneo semanal';
  const scanningDesc = isDocline
    ? 'Linting y validación básica'
    : 'Automatizado de endpoints en entornos desplegados';
  const trackingTool = isDocline ? 'Linear' : 'Jira';

  return (
    <div>
      <PageHeader
        title="Entornos y Despliegue"
        subtitle={`Pipeline de entornos de despliegue — Primer proyecto en ${client.name} con entornos y puertas de despliegue definidos`}
      />
      <div className="mt-6 space-y-6">
        {/* Banner */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 flex items-center gap-3">
          <Star className="text-amber-600 flex-shrink-0" size={24} />
          <div>
            <div className="font-semibold text-amber-800">
              Framework Implementation = Validation
            </div>
            <div className="text-xs text-amber-600 mt-0.5 italic">
              "Primera implementación del framework LIDR SDLC completo" — Validando la metodología
              para establecer patrones de escalamiento multi-cliente.
            </div>
          </div>
        </div>

        <DiagramCard>
          <h2 className="text-lg font-semibold text-slate-700 mb-4 text-center">
            Pipeline de Entornos + {securityProcess} por entorno
          </h2>

          {/* JSON-driven diagram renderer */}
          <DiagramRenderer
            diagramId="entornos-despliegue"
            showLegend={true}
            showMetadata={false}
            height={300}
            exportName="Pipeline_de_Entornos_y_Despliegue"
            onLoad={(data) =>
              console.warn('EntornosDespliegue diagram loaded:', data.metadata.title)
            }
            onError={(error) => console.error('EntornosDespliegue diagram error:', error)}
          />
        </DiagramCard>

        {/* Environment details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: 'Dev',
              desc: 'Entorno de desarrollo donde se realiza la codificación y pruebas iniciales.',
              color: 'border-blue-200 bg-blue-50',
              icon: <Server className="text-blue-600" size={20} />,
            },
            {
              name: 'Staging',
              desc: 'Entorno de integración donde se valida que los distintos componentes funcionan juntos.',
              color: 'border-cyan-200 bg-cyan-50',
              icon: <Server className="text-cyan-600" size={20} />,
            },
            {
              name: 'UAT',
              desc: 'Entorno donde los usuarios finales realizan sus pruebas de aceptación.',
              color: 'border-amber-200 bg-amber-50',
              icon: <Users className="text-amber-600" size={20} />,
            },
            {
              name: 'Pre-producción',
              desc: 'Entorno para configuraciones específicas de clientes y casos particulares. Espejo de producción.',
              color: 'border-orange-200 bg-orange-50',
              icon: <Server className="text-orange-600" size={20} />,
            },
            {
              name: 'Producción',
              desc: 'Entorno en vivo, accesible por usuarios reales. Último paso del pipeline.',
              color: 'border-emerald-200 bg-emerald-50',
              icon: <Rocket className="text-emerald-600" size={20} />,
            },
          ].map((env) => (
            <DiagramCard key={env.name}>
              <div className={`rounded-lg p-4 border ${env.color}`}>
                <div className="flex items-center gap-2 mb-2">
                  {env.icon}
                  <div className="font-semibold text-slate-800">{env.name}</div>
                </div>
                <div className="text-xs text-slate-600">{env.desc}</div>
              </div>
            </DiagramCard>
          ))}
        </div>

        {/* Process details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DiagramCard>
            <SectionBox
              title="Proceso de Despliegue"
              borderColor="border-emerald-200"
              bgColor="bg-emerald-50"
              icon={<Rocket className="text-emerald-600" size={20} />}
            >
              <div className="space-y-2">
                {[
                  { title: 'Cloud/Ops (DevOps)', desc: 'Se encarga de los despliegues' },
                  { title: 'Granularidad', desc: 'Despliegues por funcionalidad / User Story' },
                  {
                    title: 'Comunicación directa',
                    desc: 'Infraestructura ↔ Desarrolladores para coordinar',
                  },
                  {
                    title: scanningProcess,
                    desc: scanningDesc,
                  },
                ].map((item) => (
                  <div key={item.title} className="bg-white rounded p-3 border border-emerald-200">
                    <div className="font-semibold text-sm text-emerald-800">{item.title}</div>
                    <div className="text-xs text-emerald-600 mt-1">{item.desc}</div>
                  </div>
                ))}
              </div>
            </SectionBox>
          </DiagramCard>

          <DiagramCard>
            <SectionBox
              title="Planificación de Releases"
              borderColor="border-violet-200"
              bgColor="bg-violet-50"
              icon={<Calendar className="text-violet-600" size={20} />}
            >
              <div className="space-y-2">
                {[
                  { label: 'Roadmap', desc: 'Los releases se definen en el roadmap del proyecto' },
                  {
                    label: 'Dependencias',
                    desc: `Las dependencias entre US se rastrean en ${trackingTool}`,
                  },
                  {
                    label: 'Sprint → Release',
                    desc: 'El contenido de cada sprint se mapea a releases específicos',
                  },
                  {
                    label: 'Visibilidad',
                    desc: 'Qué funcionalidades estarán disponibles en cada versión',
                  },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded p-3 border border-violet-200">
                    <div className="font-semibold text-sm text-violet-800">{item.label}</div>
                    <div className="text-xs text-violet-600 mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
            </SectionBox>
          </DiagramCard>
        </div>
      </div>
    </div>
  );
}
