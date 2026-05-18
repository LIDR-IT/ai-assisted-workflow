import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { SectionBox } from '@/app/components/shared/FlowComponents';
import type { Diagnostico } from '@/data/schemas/propuesta-schema';

interface DiagnosticoRendererProps {
  readonly clientName: string;
  readonly content: Diagnostico;
}

const impactColor = (impacto: string) => {
  switch (impacto) {
    case 'Crítico':
      return 'bg-red-50 border-red-300 text-red-800';
    case 'Alto':
      return 'bg-orange-50 border-orange-300 text-orange-800';
    case 'Medio':
      return 'bg-yellow-50 border-yellow-300 text-yellow-800';
    case 'Bajo':
      return 'bg-blue-50 border-blue-300 text-blue-800';
    default:
      return 'bg-gray-50 border-gray-300 text-gray-800';
  }
};

export function DiagnosticoRenderer({ clientName, content }: DiagnosticoRendererProps) {
  const { summary, painPoints } = content;

  return (
    <div className="space-y-6">
      <SectionBox
        title={`Ecosistema SDLC ${clientName} — Estado Actual`}
        bgColor="bg-blue-50"
        borderColor="border-blue-200"
        icon={<span>📊</span>}
      >
        <p className="text-sm text-gray-600 mb-4">{summary.executiveSummary}</p>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle2 className="text-green-600" size={20} />
              <span className="font-semibold text-green-800">Fortalezas</span>
            </div>
            <ul className="text-sm text-gray-700 space-y-1">
              {summary.fortalezas.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="text-orange-600" size={20} />
              <span className="font-semibold text-orange-800">Oportunidades</span>
            </div>
            <ul className="text-sm text-gray-700 space-y-1">
              {summary.oportunidades.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="text-red-600" size={20} />
              <span className="font-semibold text-red-800">Gaps Críticos</span>
            </div>
            <ul className="text-sm text-gray-700 space-y-1">
              {summary.gapsCriticos.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </SectionBox>

      <SectionBox
        title="Análisis de Pain Points por Fase"
        icon={<span>🔍</span>}
        bgColor="bg-orange-50"
        borderColor="border-orange-200"
      >
        <p className="text-sm text-gray-600 mb-4">
          Identificación de problemas críticos y propuestas de mejora
        </p>
        <div className="grid gap-4">
          {painPoints.map((point, idx) => (
            <div
              key={point.id ?? idx}
              className="bg-white p-4 rounded-lg border border-orange-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{point.fase}</h4>
                  <p className="text-sm text-red-700 mb-2">
                    <span className="font-medium">Problema:</span> {point.problema}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded border ${impactColor(point.impacto)}`}
                >
                  {point.impacto}
                </span>
              </div>
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <div className="font-medium text-green-800 text-sm mb-1">Solución propuesta:</div>
                <p className="text-sm text-green-700 whitespace-pre-line leading-relaxed">
                  {point.mejora}
                </p>
              </div>
              {point.evidence && (
                <p className="text-xs text-gray-500 mt-2 italic">Evidencia: {point.evidence}</p>
              )}
            </div>
          ))}
        </div>
      </SectionBox>
    </div>
  );
}
