import { useState } from 'react';
import { Brain, Zap, CheckCircle2, FileCode2, ChevronDown, ChevronUp } from 'lucide-react';
import { SectionBox, DiagramCard } from '@/app/components/shared/FlowComponents';
import { FlowDiagram, n, e } from '@/app/components/shared/ReactFlowDiagram';
import { mejorasIntroData } from '@/data/features/propuestaMejora';
import { crossCuttingArtifacts } from '@/data/features/handoffsTemplates';
import { CrossCuttingSection } from '@/app/components/features/handoffs-templates/CrossCuttingSection';
import { useCurrentClient } from '@/hooks';
import { automationStats, ecosystemStats, summaryStrings } from '@/data';

const createIAFlowNodes = (client: any) => [
  n('human', 50, 200, '👤 Humano', 'blue', 'Contexto de negocio, juicio, decisiones'),
  n('claude', 550, 200, '🤖 Claude Code', 'purple', 'Copiloto IA: genera, valida, automatiza'),
  n(
    'skills',
    1100,
    50,
    `📚 Skills (${ecosystemStats.skills})`,
    'green',
    'Templates especializados por fase'
  ),
  n('rules', 1100, 250, '⚙️ Rules (5)', 'orange', 'Contexto organizacional y técnico'),
  n('memory', 550, 450, '🧠 Memory Graph', 'cyan', 'Conocimiento persistente entre sesiones'),
  n(
    'tools',
    50,
    450,
    `🔧 MCPs (${ecosystemStats.mcps})`,
    'red',
    `${client?.domainTerms?.tracking_tool || 'Jira'}, ${client?.domainTerms?.vcs_tool || 'GitHub'}, FS, Browser automation`
  ),
];

const iaFlowEdges = [
  e('human-claude', 'human', 'claude', 'Solicita skill/command', {
    sourceHandle: 'right',
    targetHandle: 'left',
  }),
  e('claude-skills', 'claude', 'skills', 'Carga template', {
    sourceHandle: 'right',
    targetHandle: 'left',
  }),
  e('claude-rules', 'claude', 'rules', 'Aplica contexto', {
    sourceHandle: 'right',
    targetHandle: 'left',
  }),
  e('claude-memory', 'claude', 'memory', 'Persiste conocimiento', {
    sourceHandle: 'source-left-bottom',
    targetHandle: 'source-top',
  }),
  e('claude-tools', 'claude', 'tools', 'Ejecuta acciones', {
    sourceHandle: 'source-left',
    targetHandle: 'right',
  }),
  e('memory-claude', 'memory', 'claude', 'Recupera historial', {
    sourceHandle: 'right',
    targetHandle: 'target-bottom',
  }),
  e('tools-claude', 'tools', 'claude', 'Retroalimentación', {
    sourceHandle: 'source-right-top',
    targetHandle: 'target-left-bottom',
  }),
];

export function PropuestaHero() {
  const { client } = useCurrentClient();
  const [expanded, setExpanded] = useState(false);

  const iaFlowNodes = createIAFlowNodes(client);
  const { automatedWorkflows, sddPrinciples } = mejorasIntroData;

  return (
    <div className="mb-6 border border-slate-200 rounded-lg bg-slate-50/50">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-100 transition-colors rounded-t-lg"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2">
          <Brain className="text-purple-600" size={18} />
          <span className="font-semibold text-slate-800">Enfoque metodológico LIDR</span>
          <span className="text-xs text-slate-500">
            · Objetivo · IA Copiloto · Arquitectura · ROI · Principios SDD
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="text-slate-500" size={18} />
        ) : (
          <ChevronDown className="text-slate-500" size={18} />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-6">
          {/* Objetivo */}
          <SectionBox
            title="Objetivo de Transformación"
            icon={<span>🎯</span>}
            bgColor="bg-green-50"
            borderColor="border-green-200"
          >
            <p className="text-sm text-green-800">
              Transformación del estado actual (AS-IS) al estado deseado (TO-BE) con Claude Code:
              automatizar procesos manuales repetitivos, estandarizar documentación con IA,
              implementar gates de calidad obligatorios y garantizar trazabilidad completa desde
              Business Case hasta Release Notes.
            </p>
          </SectionBox>

          {/* Enfoque IA */}
          <SectionBox
            title="Enfoque IA — Claude Code como Copiloto"
            icon={<Brain className="text-purple-600" size={20} />}
            bgColor="bg-purple-50"
            borderColor="border-purple-200"
          >
            <p className="text-sm text-gray-600 mb-4">
              La IA no reemplaza al humano, lo potencia: automatiza lo repetitivo, sugiere mejoras y
              garantiza consistencia
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-2 mb-3">
                  <Brain className="text-purple-600" size={18} />
                  <span className="font-semibold text-purple-800">IA Hace</span>
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Genera borradores estructurados</li>
                  <li>• Valida contra checklists</li>
                  <li>• Detecta inconsistencias</li>
                  <li>• Automatiza lo repetitivo</li>
                  <li>• Sugiere mejoras basadas en patrones</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-lg">👤</span>
                  <span className="font-semibold text-blue-800">Humano Hace</span>
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Aporta contexto de negocio</li>
                  <li>• Toma decisiones estratégicas</li>
                  <li>• Valida y firma artefactos</li>
                  <li>• Maneja excepciones</li>
                  <li>• Prioriza y negocia trade-offs</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-2 mb-3">
                  <Zap className="text-green-600" size={18} />
                  <span className="font-semibold text-green-800">Resultado</span>
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• {automationStats.estimatedHoursSavedPerYear}+ horas/año liberadas</li>
                  <li>• Consistencia garantizada</li>
                  <li>• Trazabilidad automática</li>
                  <li>• Calidad documentación</li>
                  <li>• Foco en valor estratégico</li>
                </ul>
              </div>
            </div>
          </SectionBox>

          {/* Arquitectura IA */}
          <DiagramCard>
            <h2 className="text-lg font-semibold text-slate-700 mb-2">
              Arquitectura de Integración IA
            </h2>
            <p className="text-sm text-slate-600 mb-4">
              Cómo Claude Code interactúa con el ecosistema SDLC
            </p>
            <FlowDiagram nodes={iaFlowNodes} edges={iaFlowEdges} height={420} />
            <div className="mt-4 p-3 bg-violet-50 rounded-lg border border-violet-200">
              <p className="text-sm text-violet-800">
                <strong>Ecosistema .claude/:</strong> {ecosystemStats.skills} skills,{' '}
                {ecosystemStats.rules} rules, {ecosystemStats.commands} commands,{' '}
                {ecosystemStats.agents} agents y {ecosystemStats.mcps} MCPs que automatizan el flujo
                mostrado arriba, con {summaryStrings.integrityTestsCount} validando coherencia entre
                artefactos.
                <span className="text-violet-600 font-medium">Portabilidad garantizada</span> — al
                copiar <code className="bg-violet-100 px-1 rounded">.claude/</code> → ecosistema
                completo funcional.
              </p>
            </div>
          </DiagramCard>

          <CrossCuttingSection artifacts={crossCuttingArtifacts} />

          {/* ROI */}
          <SectionBox
            title="Workflows Automatizados — ROI medido"
            icon={<Zap className="text-amber-600" size={20} />}
            bgColor="bg-amber-50"
            borderColor="border-amber-200"
          >
            <p className="text-sm text-gray-600 mb-4">
              Skills con scripts Python que reducen tareas manuales repetitivas a minutos
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm bg-white rounded-lg border border-amber-200">
                <thead className="bg-amber-100">
                  <tr>
                    <th className="text-left px-4 py-2 font-semibold text-amber-900">Skill</th>
                    <th className="text-left px-4 py-2 font-semibold text-amber-900">Antes</th>
                    <th className="text-left px-4 py-2 font-semibold text-amber-900">Después</th>
                    <th className="text-left px-4 py-2 font-semibold text-amber-900">ROI / año</th>
                  </tr>
                </thead>
                <tbody>
                  {automatedWorkflows.map((w, i) => (
                    <tr key={w.skill} className={i % 2 === 0 ? 'bg-white' : 'bg-amber-50'}>
                      <td className="px-4 py-2 font-mono text-xs text-purple-700">{w.skill}</td>
                      <td className="px-4 py-2 text-red-700">{w.before}</td>
                      <td className="px-4 py-2 text-green-700">{w.after}</td>
                      <td className="px-4 py-2 font-semibold text-amber-800">{w.roiAnual}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionBox>

          {/* Principios SDD */}
          <SectionBox
            title="Principios SDD (Spec-Driven Development)"
            icon={<FileCode2 className="text-blue-600" size={20} />}
            bgColor="bg-blue-50"
            borderColor="border-blue-200"
          >
            <p className="text-sm text-gray-600 mb-4">
              SDD complementa Agile: estructura el trabajo para escalar sin perder calidad
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {sddPrinciples.map((p) => (
                <div
                  key={p.title}
                  className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm"
                >
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
                    <CheckCircle2 className="text-blue-600" size={16} />
                    <span>{p.title}</span>
                  </h4>
                  <p className="text-sm text-gray-700">{p.description}</p>
                </div>
              ))}
            </div>
          </SectionBox>
        </div>
      )}
    </div>
  );
}
