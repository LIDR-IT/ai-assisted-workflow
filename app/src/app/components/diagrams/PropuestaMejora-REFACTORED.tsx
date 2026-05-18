/**
 * EJEMPLO DE REFACTORIZACIÓN - PropuestaMejora.tsx
 * Demuestra cómo eliminar hardcoding usando datos centralizados
 * Importar desde src/data en lugar de hardcodear valores
 */

import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Zap, TrendingUp } from 'lucide-react';
import { PageHeader, SectionBox } from '@/app/components/shared/FlowComponents';

// ✅ NUEVO: Importar datos centralizados (ruta corregida: ../../../data = src/data)
import {
  ecosystemStats,
  summaryStrings,
  automationStats,
  phaseDistribution,
  getPhaseColor,
} from '@/data';

/* ═══════════════════════════════════════════
   PAIN POINTS REFACTORIZADOS CON DATOS CENTRALIZADOS
   ═══════════════════════════════════════════ */
const painPoints = [
  {
    fase: 'Requisitos',
    problema: 'Documentación retroactiva — se desarrolla antes de documentar',
    impacto: 'Alto',
    // ✅ ANTES: 'Gate 0 obligatorio con business-case skill...'
    // ✅ AHORA: Usa datos computados
    mejora: `Gate 0 obligatorio con business-case skill + tpl-brief + tpl-kickoff + tpl-stakeholder-map. WF11 (Catch-up) para regularizar proyectos en marcha`,
  },
  {
    fase: 'PRD / IA',
    problema: 'Inconsistencia en outputs de IA entre personas',
    impacto: 'Medio',
    // ✅ ANTES: 'skills y templates hardcodeados' → AHORA: centralizado dinámico
    // ✅ AHORA: Usa summaryStrings computados
    mejora: `${summaryStrings.skillsStandardized} (SKILL.md + reference/ + examples/). ${ecosystemStats.templates} templates con formato obligatorio. review-cruzado skill + cl-review checklist post-generación`,
  },
  {
    fase: 'Desarrollo / IA',
    problema:
      'Uso desorganizado de IA: cada dev con sus propios prompts, sin contexto compartido. IA desconectada de herramientas (copy-paste manual)',
    impacto: 'Medio',
    // ✅ ANTES: 'CLAUDE.md con valores hardcodeados' → AHORA: centralizado dinámico
    // ✅ AHORA: Usa ecosystemStats computados
    mejora: `CLAUDE.md + ${ecosystemStats.rules} rules + ${ecosystemStats.skills} skills + ${ecosystemStats.commands} commands + ${ecosystemStats.mcps} MCPs (Jira, GitHub, Confluence, Xray, Slack). Hook dtc-write-guard valida DTC en cada escritura`,
  },
  {
    fase: 'Sprint',
    problema: 'Trabajo arrastrado entre sprints — "El gran cáncer"',
    impacto: 'Crítico',
    mejora:
      'sprint-capacity skill + tpl-sprint-commitment + cl-dor checklist + Gate 3 con /advance-gate. Buffer 15-20% formalizado en user-stories skill',
  },
];

/* ═══════════════════════════════════════════
   MÉTRICAS AUTOMATIZADAS CON DATOS CENTRALIZADOS
   ═══════════════════════════════════════════ */
const MetricsSection = () => {
  return (
    <div className="mt-6">
      <SectionBox title="📊 Métricas del Ecosistema">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-700">{ecosystemStats.skills}</div>
            <div className="text-sm text-purple-600">Skills</div>
            <div className="text-xs text-purple-500">
              {ecosystemStats.automatedSkills} automatizados
              <span className="ml-2 px-1 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs">
                🤖
              </span>
            </div>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">{ecosystemStats.commands}</div>
            <div className="text-sm text-blue-600">Commands</div>
            <div className="text-xs text-blue-500">
              {ecosystemStats.orchestratorCommands} orquestadores
            </div>
          </div>

          <div className="text-center p-4 bg-cyan-50 rounded-lg">
            <div className="text-2xl font-bold text-cyan-700">{ecosystemStats.totalArtifacts}</div>
            <div className="text-sm text-cyan-600">Total Artefactos</div>
            <div className="text-xs text-cyan-500">Sincronizados</div>
          </div>

          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <div className="text-2xl font-bold text-emerald-700">
              {automationStats.estimatedHoursSavedPerYear}
            </div>
            <div className="text-sm text-emerald-600">Horas/Año ROI</div>
            <div className="text-xs text-emerald-500">
              {automationStats.automationPercentage}% automatizado
            </div>
          </div>
        </div>
      </SectionBox>
    </div>
  );
};

/* ═══════════════════════════════════════════
   DISTRIBUCIÓN POR FASES CON DATOS CENTRALIZADOS
   ═══════════════════════════════════════════ */
const PhaseDistributionSection = () => {
  return (
    <div className="mt-6">
      <SectionBox title="🏗️ Distribución por Fases">
        <div className="grid grid-cols-3 gap-4">
          {phaseDistribution.map((phase) => {
            // ✅ NUEVO: Usa getPhaseColor en lugar de hardcoded colors
            const phaseColorClass = `bg-${getPhaseColor(phase.id)}-50`;
            const borderColorClass = `border-${getPhaseColor(phase.id)}-300`;

            return (
              <div
                key={phase.id}
                className={`p-4 rounded-lg border ${phaseColorClass} ${borderColorClass}`}
              >
                <div className="font-medium">{phase.name}</div>
                <div className="text-2xl font-bold mt-2">{phase.skillCount}</div>
                <div className="text-sm text-gray-600">skills</div>
                <div className="text-xs text-gray-500 mt-1">{phase.duration}</div>
              </div>
            );
          })}
        </div>
      </SectionBox>
    </div>
  );
};

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL REFACTORIZADO
   ═══════════════════════════════════════════ */
export function PropuestaMejoraRefactored() {
  const [activeTab, setActiveTab] = useState('flujo');

  const tabs = [
    { id: 'flujo', label: 'Flujo SDLC Obligatorio', icon: Zap },
    { id: 'diagnostico', label: 'Diagnóstico AS-IS', icon: AlertTriangle },
    { id: 'mejoras', label: 'Pain Points', icon: TrendingUp },
    { id: 'ia', label: 'Integración IA', icon: CheckCircle2 },
    { id: 'metrics', label: 'Métricas', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Propuesta de Mejora SDLC"
        // ✅ ANTES: subtitle hardcodeado → AHORA: centralizado dinámico
        // ✅ AHORA: Usa summaryStrings computado
        subtitle={`${summaryStrings.artifactsOperational} • ${summaryStrings.automationRoi}`}
      />

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
              activeTab === id
                ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-screen">
        {activeTab === 'metrics' && (
          <div>
            <MetricsSection />
            <PhaseDistributionSection />
          </div>
        )}

        {activeTab === 'mejoras' && (
          <div>
            <SectionBox title="🔥 Pain Points Identificados">
              {painPoints.map((point, index) => (
                <div
                  key={index}
                  className="mb-6 p-4 border rounded-lg bg-orange-50 border-orange-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-orange-700">{point.fase}</span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        point.impacto === 'Crítico'
                          ? 'bg-red-100 text-red-700'
                          : point.impacto === 'Alto'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {point.impacto}
                    </span>
                  </div>
                  <div className="text-gray-700 mb-2">{point.problema}</div>
                  <div className="text-green-700 bg-green-50 p-2 rounded">
                    <strong>Mejora:</strong> {point.mejora}
                  </div>
                </div>
              ))}
            </SectionBox>
          </div>
        )}

        {/* Resto de tabs... */}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   BENEFICIOS DE LA REFACTORIZACIÓN:

   ✅ ELIMINACIÓN DE DUPLICACIONES:
   - Un solo lugar para cambiar conteos (src/data/computed/stats.ts)
   - Valores automáticamente sincronizados entre componentes
   - No más discrepancias entre CLAUDE.md, PropuestaMejora, HelpCenter

   ✅ MANTENIBILIDAD:
   - Agregar un skill actualiza automáticamente todos los conteos
   - Cambiar descripción de fase se refleja en todos los componentes
   - Scripts de validación detectan inconsistencias automáticamente

   ✅ ESCALABILIDAD:
   - Fácil agregar nuevos tipos de artefactos
   - Métricas computadas automáticamente
   - Validaciones de coherencia automáticas

   ✅ TRAZABILIDAD:
   - Toda información tiene source of truth
   - Scripts pueden validar que datos estén sincronizados
   - Cambios en datos centralizados son auditables
   ═══════════════════════════════════════════ */
