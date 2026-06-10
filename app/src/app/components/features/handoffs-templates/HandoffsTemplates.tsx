/**
 * @file HandoffsTemplates Main Component
 * @description Refactored template-based architecture for managing 57+ templates across SDLC phases
 * @target <500 lines main container
 */

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Brain } from 'lucide-react';
import { PageHeader, SectionBox } from '@/app/components/shared/FlowComponents';
import { FlowDiagram } from '@/app/components/shared/ReactFlowDiagram';
import {
  handoffNodes,
  handoffEdges,
  crossCuttingArtifacts,
  phases,
  getHandoffStats,
} from '@/data/features/handoffsTemplates';

// Local component imports
import { PhaseAccordion } from './PhaseAccordion';
import { CrossCuttingSection } from './CrossCuttingSection';
import { StatsBar } from './StatsBar';

export function HandoffsTemplates() {
  // State management
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set());
  const location = useLocation();

  // Computed values
  const stats = getHandoffStats();
  const allPhaseNums = phases.map((p) => p.faseNum);
  const allExpanded = allPhaseNums.every((num) => expandedPhases.has(num));

  // Deep-link support: when URL hash is #tpl-<CODE>, expand all phases so the
  // anchor is in the layout tree, then scroll the row into view.
  useEffect(() => {
    const hash = location.hash;
    if (!hash.startsWith('#tpl-')) {
      return;
    }
    setExpandedPhases(new Set(allPhaseNums));
    const id = hash.slice(1);
    // Wait a tick for accordions to render the rows
    const timer = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 120);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.hash]);

  // Event handlers
  const togglePhase = (faseNum: number) => {
    setExpandedPhases((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(faseNum)) {
        newSet.delete(faseNum);
      } else {
        newSet.add(faseNum);
      }
      return newSet;
    });
  };

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedPhases(new Set());
    } else {
      setExpandedPhases(new Set(allPhaseNums));
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Handoffs & Templates"
        subtitle="Modelo unificado BMad × LIDR: 5 fases · 9 etapas · 8 gates (G0–G7). Catálogo de templates alineado 1:1 con gate-evidence.yaml — BMad produce, LIDR verifica"
      />

      {/* Stats Summary */}
      <StatsBar
        phases={stats.totalPhases}
        stages={stats.totalStages}
        handoffs={stats.totalHandoffs}
        templatesTotal={stats.totalTemplates}
        mandatory={stats.mandatoryTemplates}
        withAI={stats.aiTemplates}
      />

      {/* Handoff Flow Diagram */}
      <SectionBox
        title="Mapa de Handoffs entre Fases"
        subtitle="Cada Handoff es un punto formal de transferencia con entregables y criterios específicos"
      >
        <FlowDiagram nodes={handoffNodes} edges={handoffEdges} height={400} />
      </SectionBox>

      {/* Cross-cutting AI Section */}
      <CrossCuttingSection artifacts={crossCuttingArtifacts} />

      {/* Phase-based Templates Section */}
      <SectionBox
        title="Fases SDLC: Handoffs, Gates y Templates"
        subtitle="Cada fase tiene 2 bloques conceptuales (Fase + Gate) y su catálogo de templates. Haz clic para expandir."
        icon={<Brain className="text-violet-600" size={20} />}
      >
        <div className="space-y-4">
          {/* Control buttons */}
          <div className="flex justify-end">
            <button
              className="px-4 py-2 text-sm text-violet-600 hover:text-violet-800 hover:bg-violet-50 rounded-md transition-colors"
              onClick={toggleAll}
            >
              {allExpanded ? 'Colapsar todos' : 'Expandir todos'}
            </button>
          </div>

          {/* Phase Accordion */}
          <PhaseAccordion
            phases={phases}
            expandedPhases={expandedPhases}
            onTogglePhase={togglePhase}
          />
        </div>
      </SectionBox>
    </div>
  );
}
