/**
 * ProblemasIdentificados — Componente especializado para mostrar problemas específicos
 *
 * Muestra los problemas críticos identificados en discovery sessions con timestamps
 * verificados y enlaces a transcripciones originales.
 */

import { ProcesoAdicionalSection } from '@/data/schemas/diagram-schema';

interface ProblemasIdentificadosProps {
  problemas: ProcesoAdicionalSection[];
  client: string;
}

export function ProblemasIdentificados({ problemas, client }: ProblemasIdentificadosProps) {
  const problemasReales = problemas.filter((p) => p.tipo === 'problemas_aramis');

  if (problemasReales.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
          <svg
            className="w-4 h-4 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-red-900">
          Problemas Identificados en Discovery — {client}
        </h3>
      </div>

      <p className="text-red-800 text-sm mb-6">
        Estos problemas fueron identificados específicamente durante las sesiones de discovery con
        timestamps verificados en la transcripción.
      </p>

      <div className="space-y-6">
        {problemasReales.map((seccion, sectionIndex) => (
          <div key={sectionIndex}>
            <h4 className="font-semibold text-red-900 mb-4">{seccion.title}</h4>
            <div className="space-y-4">
              {seccion.items?.map((problema, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 border border-red-200 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="font-semibold text-gray-900 flex-1">{problema.title}</h5>
                    <div className="flex gap-2 ml-4">
                      {problema.impact && (
                        <span
                          className={`px-2 py-1 text-xs rounded font-medium ${
                            problema.impact === 'critical'
                              ? 'bg-red-100 text-red-800'
                              : problema.impact === 'high'
                                ? 'bg-orange-100 text-orange-800'
                                : problema.impact === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {problema.impact.toUpperCase()}
                        </span>
                      )}
                      {problema.timestamp && (
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded font-medium">
                          📍 {problema.timestamp}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-3 leading-relaxed">{problema.desc}</p>

                  {problema.timestamp && (
                    <div className="bg-purple-50 border border-purple-200 rounded p-3">
                      <p className="text-purple-800 text-xs">
                        <strong>Fuente verificada:</strong> Transcripción discovery session -
                        timestamp {problema.timestamp}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded p-4">
        <div className="flex items-start">
          <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
            <svg
              className="w-3 h-3 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h5 className="font-semibold text-blue-900 mb-1">Próximos pasos recomendados</h5>
            <p className="text-blue-800 text-sm">
              Estos problemas han sido documentados para ser abordados en la implementación del
              framework LIDR SDLC. Cada problema incluye timestamp de verificación para trazabilidad
              completa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemasIdentificados;
