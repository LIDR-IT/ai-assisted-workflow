/**
 * SummaryCards Component
 *
 * Displays summary statistics for phases, handoffs, and templates.
 * Extracted from HandoffsTemplates.tsx for better maintainability.
 */

interface SummaryCardsProps {
  phases: number;
  handoffs: number;
  totalTemplates: number;
  mandatoryTemplates: number;
  aiTemplates: number;
}

export function SummaryCards({
  phases,
  handoffs,
  totalTemplates,
  mandatoryTemplates,
  aiTemplates,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
      <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm text-center">
        <div className="text-2xl font-bold text-indigo-700">{phases}</div>
        <div className="text-xs text-slate-500">Fases</div>
      </div>
      <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm text-center">
        <div className="text-2xl font-bold text-amber-700">{handoffs}</div>
        <div className="text-xs text-slate-500">Handoffs</div>
      </div>
      <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm text-center">
        <div className="text-2xl font-bold text-emerald-700">{totalTemplates}</div>
        <div className="text-xs text-slate-500">Templates Total</div>
      </div>
      <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm text-center">
        <div className="text-2xl font-bold text-red-700">{mandatoryTemplates}</div>
        <div className="text-xs text-slate-500">Obligatorios</div>
      </div>
      <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm text-center">
        <div className="text-2xl font-bold text-violet-700">{aiTemplates}</div>
        <div className="text-xs text-slate-500">Con asistencia IA</div>
      </div>
    </div>
  );
}
