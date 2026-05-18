import { CheckCircle2 } from 'lucide-react';
import { SectionBox } from '@/app/components/shared/FlowComponents';
import type { Mejoras } from '@/data/schemas/propuesta-schema';

interface MejorasRendererProps {
  readonly content: Mejoras;
}

export function MejorasRenderer({ content }: MejorasRendererProps) {
  const ordered = [...content.fases].sort((a, b) => a.phaseNumber - b.phaseNumber);

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {ordered.map((mejora) => (
          <SectionBox
            key={mejora.id}
            title={mejora.title}
            icon={null}
            bgColor={mejora.bg}
            borderColor={mejora.border}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  <span>Estado Actual (AS-IS)</span>
                </h4>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">{mejora.actual}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Estado Propuesto (TO-BE)</span>
                </h4>
                <div className="space-y-2">
                  {mejora.propuesta.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start space-x-2 bg-green-50 border border-green-200 rounded-lg p-3"
                    >
                      <CheckCircle2 className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
                      <span className="text-sm text-green-800">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionBox>
        ))}
      </div>
    </div>
  );
}
