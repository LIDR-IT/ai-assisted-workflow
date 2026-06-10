/**
 * @file PhaseAccordion Component
 * @description Virtualized accordion for displaying phases with templates, gates, and handoffs
 */

import { ChevronDown, ChevronUp } from 'lucide-react';
import type { PhaseTemplates } from '@/data/features/handoffsTemplates';
import { PhaseCard } from './PhaseCard';

interface PhaseAccordionProps {
  phases: PhaseTemplates[];
  expandedPhases: Set<number>;
  onTogglePhase: (faseNum: number) => void;
}

export function PhaseAccordion({ phases, expandedPhases, onTogglePhase }: PhaseAccordionProps) {
  return (
    <div className="space-y-3">
      {phases.map((phase) => {
        const isExpanded = expandedPhases.has(phase.faseNum);
        const aiCount = phase.templates.filter((t) => t.aiAssist).length;

        return (
          <div key={phase.faseNum} className={`border rounded-lg ${phase.borderColor}`}>
            {/* Phase Header Button */}
            <button
              className="w-full text-left"
              onClick={() => onTogglePhase(phase.faseNum)}
              aria-expanded={isExpanded}
            >
              <div
                className={`${phase.color} p-4 rounded-lg hover:opacity-80 transition-opacity flex items-center justify-between`}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold text-slate-700">
                    {phase.unifiedPhase}
                  </div>
                  <div>
                    {/* phase.fase carries the unified phase label (e.g. "Fase 3 — Solutioning (specification)") */}
                    <div className="font-semibold text-slate-800">{phase.fase}</div>
                    <div className="text-sm text-slate-600 flex items-center gap-2">
                      <span>
                        {phase.templates.length} templates · {phase.gate}
                      </span>
                      {aiCount > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-violet-600">🧠</span>
                          <span className="text-violet-600 font-medium">{aiCount} IA</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-slate-500">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="border-t border-slate-200 bg-white">
                <PhaseCard phase={phase} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
