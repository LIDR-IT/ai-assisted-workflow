/**
 * @file StatsBar Component
 * @description Summary statistics bar showing phases, handoffs, and template counts
 */

interface StatsBarProps {
  phases: number;
  stages: number;
  handoffs: number;
  templatesTotal: number;
  mandatory: number;
  withAI: number;
}

export function StatsBar({
  phases,
  stages,
  handoffs,
  templatesTotal,
  mandatory,
  withAI,
}: StatsBarProps) {
  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-blue-700">
          {phases} <span className="text-base font-semibold text-blue-500">· {stages}</span>
        </div>
        <div className="text-sm text-blue-600">Fases · Etapas</div>
      </div>
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-orange-700">{handoffs}</div>
        <div className="text-sm text-orange-600">Handoffs (G0–G7)</div>
      </div>
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-purple-700">{templatesTotal}</div>
        <div className="text-sm text-purple-600">Templates Total</div>
      </div>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-red-700">{mandatory}</div>
        <div className="text-sm text-red-600">Evidencia required</div>
      </div>
      <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-violet-700">{withAI}</div>
        <div className="text-sm text-violet-600">Con asistencia IA</div>
      </div>
    </div>
  );
}
