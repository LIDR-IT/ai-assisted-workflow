import { CheckCircle2, Clock, Rocket } from 'lucide-react';
import { SectionBox } from '@/app/components/shared/FlowComponents';
import { roadmapTabData } from '@/data/features/propuestaMejora';
import { useCurrentClient } from '@/hooks';

export function RoadmapTab() {
  const { client } = useCurrentClient();

  const getPhaseStatus = (fase: string) => {
    if (fase.includes('COMPLETADO ✓')) {
      return {
        icon: <CheckCircle2 className="text-green-600" size={20} />,
        status: 'Completado',
        statusColor: 'text-green-600 bg-green-100',
      };
    } else if (fase.includes('EN PROGRESO')) {
      return {
        icon: <Clock className="text-blue-600" size={20} />,
        status: 'En Progreso',
        statusColor: 'text-blue-600 bg-blue-100',
      };
    } else {
      return {
        icon: <Rocket className="text-gray-600" size={20} />,
        status: 'Planificado',
        statusColor: 'text-gray-600 bg-gray-100',
      };
    }
  };

  return (
    <div className="space-y-6">
      <SectionBox
        title={`Roadmap de Implementación SDLC ${client.name}`}
        icon={<span>🗺️</span>}
        bgColor="bg-blue-50"
        borderColor="border-blue-200"
      >
        <p className="text-sm text-gray-600 mb-4">
          Evolución del ecosistema desde estado actual hasta productización completa
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-blue-200 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">Fase 1-7</div>
            <div className="text-sm text-gray-600">Completadas</div>
            <div className="text-xs text-green-700 mt-1">195 artefactos operacionales</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-blue-200 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">Fase 8</div>
            <div className="text-sm text-gray-600">Piloto en progreso</div>
            <div className="text-xs text-blue-700 mt-1">Primer equipo real</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-blue-200 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">Fase 9</div>
            <div className="text-sm text-gray-600">Escalado planificado</div>
            <div className="text-xs text-purple-700 mt-1">Múltiples equipos</div>
          </div>
        </div>
      </SectionBox>

      <div className="space-y-6">
        {roadmapTabData.map((fase, index) => {
          const phaseInfo = getPhaseStatus(fase.fase);

          return (
            <SectionBox
              key={index}
              title={fase.fase}
              icon={phaseInfo.icon}
              bgColor={fase.color}
              borderColor="border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${phaseInfo.statusColor}`}
                >
                  {phaseInfo.status}
                </span>
                <span className="text-sm text-gray-500">
                  Fase {index + 1} de {roadmapTabData.length}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {fase.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="bg-white bg-opacity-70 p-3 rounded-lg border border-white border-opacity-50 shadow-sm"
                  >
                    <div className="flex items-start space-x-2">
                      {item.startsWith('✓') ? (
                        <CheckCircle2 className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
                      ) : item.startsWith('📋') || item.startsWith('🎯') ? (
                        <Clock className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
                      ) : (
                        <Rocket className="text-purple-600 mt-0.5 flex-shrink-0" size={16} />
                      )}
                      <span className="text-sm text-gray-800 leading-relaxed">{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionBox>
          );
        })}
      </div>

      {/* Implementation Timeline */}
      <SectionBox
        title="Timeline de Implementación"
        icon={<span>📅</span>}
        bgColor="bg-gray-50"
        borderColor="border-gray-200"
      >
        <p className="text-sm text-gray-600 mb-4">
          Cronograma estimado para completar la transformación SDLC
        </p>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <div>
                <div className="font-medium">Q1 2025 - Q2 2026</div>
                <div className="text-sm text-gray-600">Fases 0-7: Desarrollo del Ecosistema</div>
              </div>
            </div>
            <span className="text-green-600 font-semibold">COMPLETADO ✓</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <div>
                <div className="font-medium">Q3 2026</div>
                <div className="text-sm text-gray-600">Fase 8: Piloto con equipo real</div>
              </div>
            </div>
            <span className="text-blue-600 font-semibold">EN PROGRESO</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              <div>
                <div className="font-medium">Q4 2026</div>
                <div className="text-sm text-gray-600">Fase 9: Escalado a portafolio PME</div>
              </div>
            </div>
            <span className="text-purple-600 font-semibold">PLANIFICADO</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">🎯 Objetivo Final</h4>
          <p className="text-sm text-blue-800">
            Escalar la LIDR SDLC Methodology organizacionalmente, estableciendo
            {client.name} como referente en automatización de procesos SDLC con IA.
          </p>
        </div>
      </SectionBox>
    </div>
  );
}
