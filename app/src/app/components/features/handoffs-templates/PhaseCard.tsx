/**
 * @file PhaseCard Component
 * @description Detailed view of a single phase with handoff info, gate criteria, and templates
 * @performance Memoized to prevent unnecessary re-renders when phase data hasn't changed
 */

import { useState, memo, useCallback } from 'react';
import type { PhaseTemplates } from '@/data/features/handoffsTemplates';
import { getHandoffByGateNumber } from '@/data/features/handoffsTemplates';
import { TemplateTable } from './TemplateTable';

interface PhaseCardProps {
  phase: PhaseTemplates;
}

function PhaseCardComponent({ phase }: PhaseCardProps) {
  const [showTemplates, setShowTemplates] = useState(false);
  const handoff = phase.gateNum !== undefined ? getHandoffByGateNumber(phase.gateNum) : undefined;

  // Memoize toggle handler to prevent unnecessary re-renders of TemplateTable
  const handleToggleTemplates = useCallback(() => {
    setShowTemplates((prev) => !prev);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Handoff Information */}
      {handoff && (
        <div className="grid grid-cols-2 gap-6">
          {/* Producer (Left) */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Productor (entrega)
            </h4>
            <div className="space-y-2">
              {handoff.producer.map((prod, idx) => (
                <div key={idx} className="text-sm">
                  <span className="font-medium text-green-700">{prod.role}:</span>
                  <span className="text-slate-600 ml-2">{prod.action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Receiver (Right) */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              Receptor (recibe)
            </h4>
            <div className="space-y-2">
              {handoff.receiver.map((rec, idx) => (
                <div key={idx} className="text-sm">
                  <span className="font-medium text-blue-700">{rec.role}:</span>
                  <span className="text-slate-600 ml-2">{rec.action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Gate Information */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
          {phase.gate}
        </h4>

        <div className="grid grid-cols-2 gap-6">
          {/* DoR (Definition of Ready) */}
          <div>
            <h5 className="font-medium text-slate-700 text-sm mb-2">DoR (Definition of Ready)</h5>
            <ul className="space-y-1">
              {phase.dor.map((item, idx) => (
                <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-green-600 flex-shrink-0 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Exit Criteria */}
          <div>
            <h5 className="font-medium text-slate-700 text-sm mb-2">Criterios de Salida</h5>
            <ul className="space-y-1">
              {phase.exitCriteria.map((item, idx) => (
                <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-blue-600 flex-shrink-0 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Gate-specific criteria */}
        {phase.gateSpecific && phase.gateSpecific.length > 0 && (
          <div className="mt-4 pt-4 border-t border-amber-200">
            <h5 className="font-medium text-slate-700 text-sm mb-2">
              Criterios específicos del Gate
            </h5>
            <ul className="space-y-1">
              {phase.gateSpecific.map((item, idx) => (
                <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-amber-600 flex-shrink-0 mt-0.5">⚡</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Templates Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-slate-800 flex items-center gap-2">
            <span className="text-violet-600">📋</span>
            Templates & Artefactos ({phase.templates.length})
          </h4>
          <button
            onClick={handleToggleTemplates}
            className="text-sm text-violet-600 hover:text-violet-800 transition-colors"
          >
            {showTemplates ? 'Ocultar' : 'Mostrar'} templates
          </button>
        </div>

        {showTemplates && <TemplateTable templates={phase.templates} />}
      </div>

      {/* AI Automation Summary */}
      {handoff?.aiAutomation && (
        <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
          <h5 className="font-medium text-violet-800 mb-2 flex items-center gap-2">
            <span className="text-violet-600">🤖</span>
            Automatización IA
          </h5>
          <p className="text-sm text-violet-700">{handoff.aiAutomation}</p>
        </div>
      )}
    </div>
  );
}

// Memoize component to prevent re-renders when phase data hasn't changed
// Uses shallow comparison by default which works well for PhaseTemplates objects
export const PhaseCard = memo(PhaseCardComponent);
