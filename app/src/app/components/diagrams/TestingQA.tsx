import { memo, useMemo } from 'react';
import { TestTube2, ClipboardList, AlertTriangle, Lightbulb, ArrowRight } from 'lucide-react';
import { DiagramCard, PageHeader, SectionBox } from '@/app/components/shared/FlowComponents';
import { DiagramRenderer } from '@/app/components/shared/DiagramRenderer';
import { useCurrentClient } from '@/hooks';
import {
  getTestingTool,
  getTestingApproachDescription,
  getTestingActionDescription,
  getTestingReportingDescription,
} from '@/utils/clientContent';

// Data now comes from JSON: src/data/clients/{client}/diagrams/testing-qa.json

function TestingQAComponent() {
  const { client } = useCurrentClient();

  // Memoize client-dependent values to prevent recalculation on every render
  const testingConfig = useMemo(
    () => ({
      testingTool: getTestingTool(client),
      testingApproach: getTestingApproachDescription(client),
      testingAction: getTestingActionDescription(client),
      testingReporting: getTestingReportingDescription(client),
    }),
    [client]
  );

  return (
    <div>
      <PageHeader
        title="Testing y QA"
        subtitle={
          client?.name === 'Docline'
            ? 'QA Live reactivo: testing en vivo, primera vez con DoD formal, transición de informal a sistemático'
            : `Metodología BDD, ${testingConfig.testingApproach}, flujo de trabajo QA y ciclo de vida de bugs`
        }
      />
      <div className="mt-6 space-y-6">
        <DiagramCard>
          <h2 className="text-lg font-semibold text-slate-700 mb-4 text-center">
            Flujo de Trabajo QA
          </h2>

          {/* JSON-driven diagram renderer */}
          <DiagramRenderer
            diagramId="testing-qa"
            showLegend={true}
            showMetadata={false}
            height={620}
            exportName="Flujo_Trabajo_QA_SDLC"
            onLoad={(data) => console.warn('TestingQA diagram loaded:', data.metadata.title)}
            onError={(error) => console.error('TestingQA diagram error:', error)}
          />
        </DiagramCard>

        {/* Testing types */}
        <DiagramCard>
          <SectionBox
            title="Tipos de Testing"
            borderColor="border-sky-200"
            bgColor="bg-sky-50"
            icon={<TestTube2 className="text-sky-600" size={20} />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  title: 'Funcional',
                  desc: 'Basado en criterios de aceptación de US',
                  color: 'border-green-200 bg-green-50',
                },
                {
                  title: 'Escenarios BDD',
                  desc: 'Given/When/Then derivados de criterios',
                  color: 'border-violet-200 bg-violet-50',
                },
                {
                  title: 'Regresión',
                  desc: 'Verificar que lo existente no se rompa',
                  color: 'border-blue-200 bg-blue-50',
                },
                {
                  title: 'Seguridad',
                  desc: 'Coordinado con Sec Lead',
                  color: 'border-red-200 bg-red-50',
                },
              ].map((item) => (
                <div key={item.title} className={`rounded-lg p-3 border ${item.color}`}>
                  <div className="font-semibold text-sm text-slate-800">{item.title}</div>
                  <div className="text-xs text-slate-600 mt-1">{item.desc}</div>
                </div>
              ))}
            </div>
          </SectionBox>
        </DiagramCard>

        {/* BDD */}
        <DiagramCard>
          <SectionBox
            title="Metodología BDD"
            borderColor="border-violet-200"
            bgColor="bg-violet-50"
            icon={<ClipboardList className="text-violet-600" size={20} />}
          >
            <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
              <div className="text-slate-500"># Escenario derivado de criterios de aceptación</div>
              <div className="mt-2">
                <span className="text-cyan-400">Escenario:</span> Validación funcional de US
              </div>
              <div className="ml-2 text-yellow-300">Given</div>
              <div className="ml-4">los criterios de aceptación están definidos en el RF</div>
              <div className="ml-2 text-yellow-300">When</div>
              <div className="ml-4">{testingConfig.testingAction}</div>
              <div className="ml-2 text-yellow-300">Then</div>
              <div className="ml-4">
                los escenarios se ejecutan sobre la funcionalidad desplegada
              </div>
              <div className="ml-2 text-yellow-300">And</div>
              <div className="ml-4">{testingConfig.testingReporting}</div>
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-violet-700">
              <div className="bg-violet-100 rounded px-2 py-1 border border-violet-300">
                Equipo: QA Team
              </div>
              <div className="bg-violet-100 rounded px-2 py-1 border border-violet-300">
                Herramienta: {testingConfig.testingTool}
              </div>
            </div>
          </SectionBox>
        </DiagramCard>

        {/* Pain Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DiagramCard>
            <SectionBox
              title='Pain Point: "Nos encontramos con sorpresas"'
              borderColor="border-red-200"
              bgColor="bg-red-50"
              icon={<AlertTriangle className="text-red-600" size={20} />}
            >
              <div className="space-y-2 text-sm">
                <ul className="space-y-2 text-red-700">
                  <li className="flex items-start gap-2">
                    <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" /> Desarrolladores{' '}
                    <strong>no ven</strong> los test cases
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" /> Desarrollo{' '}
                    <strong>no respeta</strong> lo que QA espera
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" /> Pruebas y
                    desarrollo ocurren en paralelo pero <strong>desconectados</strong>
                  </li>
                </ul>
              </div>
            </SectionBox>
          </DiagramCard>

          <DiagramCard>
            <SectionBox
              title="Mejora Deseada: Shift-Left"
              borderColor="border-emerald-200"
              bgColor="bg-emerald-50"
              icon={<Lightbulb className="text-emerald-600" size={20} />}
            >
              <div className="bg-white rounded p-4 border border-emerald-200 text-sm text-slate-700">
                <p className="italic text-emerald-700 mb-3">
                  "Sería buenísimo que esos test cases fueran aprovechados desde el primer momento"
                </p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <div className="bg-sky-100 rounded px-3 py-2 text-sky-800 text-xs font-semibold border border-sky-200">
                    Test Cases QA
                  </div>
                  <ArrowRight className="text-emerald-400" size={16} />
                  <div className="bg-orange-100 rounded px-3 py-2 text-orange-800 text-xs font-semibold border border-orange-200">
                    Compartir con Devs
                  </div>
                  <ArrowRight className="text-emerald-400" size={16} />
                  <div className="bg-emerald-100 rounded px-3 py-2 text-emerald-800 text-xs font-semibold border border-emerald-200">
                    Antes de codificar
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

// Memoize component to prevent expensive client config re-computations
// Only re-renders when client configuration or domain terms change
export const TestingQA = memo(TestingQAComponent);
