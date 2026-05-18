import { useState } from 'react';
import { Link, useParams } from 'react-router';
import {
  Bot,
  Brain,
  Terminal,
  Cable,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Eye,
  Workflow,
  FolderTree,
  ArrowRightLeft,
  ClipboardList,
  Settings,
  FolderOpen,
} from 'lucide-react';
import { DiagramCard, PageHeader, SectionBox } from '@/app/components/shared/FlowComponents';
import { DiagramRenderer } from '@/app/components/shared/DiagramRenderer';
import type { AgentDefinition } from './AgentsArchitecture';

interface AgentsArchitectureViewProps {
  agents: AgentDefinition[];
  delegateYes: { task: string; agent: string; reason: string }[];
  delegateNo: { task: string; owner: string; reason: string }[];
  workflowCapabilities: { capability: string; canDo: boolean; detail: string }[];
}

const tabs = [
  { id: 'overview', label: 'Vision General', icon: Eye },
  { id: 'subagents', label: 'Catalogo de Subagentes', icon: Bot },
  { id: 'delegation', label: 'Que Delegar', icon: ArrowRightLeft },
  { id: 'espec', label: 'Especificacion', icon: ClipboardList },
  { id: 'oper', label: 'Operacion', icon: Workflow },
] as const;
type TabId = (typeof tabs)[number]['id'];

export function AgentsArchitectureView({
  agents,
  delegateYes,
  delegateNo,
  workflowCapabilities,
}: AgentsArchitectureViewProps) {
  const params = useParams();
  const clientId = params.clientId ?? '';
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  return (
    <div>
      <PageHeader
        title="Arquitectura de Subagentes"
        subtitle="6 agentes autonomos con memoria persistente (scope: project) — evolucion de commands maduros para equipo grande"
      />

      {/* Tabs */}
      <div className="inline-flex gap-1 flex-wrap mb-6 bg-white rounded-lg p-1 border border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
              activeTab === tab.id
                ? 'bg-violet-100 text-violet-800 font-semibold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: VISION GENERAL */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key principle */}
          <div className="bg-violet-50 border-2 border-violet-200 rounded-lg p-4 flex items-start gap-3">
            <Bot className="text-violet-600 flex-shrink-0 mt-0.5" size={28} />
            <div>
              <div className="font-semibold text-violet-800">
                Principio: Los Agents nacen de Commands probados
              </div>
              <div className="text-xs text-violet-600 mt-1">
                Un agent es la evolucion autonoma de un command que ya demostro su valor. No se
                crean desde cero. Cada agent tiene{' '}
                <span className="font-semibold">memoria persistente a nivel de proyecto</span>{' '}
                (scope: project) porque somos un equipo grande y el conocimiento debe ser compartido
                via version control.
              </div>
            </div>
          </div>

          {/* Orchestration diagram */}
          <DiagramCard>
            <h2 className="text-lg font-semibold text-slate-700 mb-4 text-center">
              Diagrama de Orquestacion: Humano (CLI) → Subagentes → Outputs → Human Gates
            </h2>
            <DiagramRenderer
              diagramId="agents-architecture"
              showLegend={true}
              showMetadata={false}
              height={850}
              exportName="Agents Orchestration"
              onLoad={(data) =>
                console.warn('Agents Architecture diagram loaded:', data.metadata.title)
              }
              onError={(error) => console.error('Agents Architecture diagram error:', error)}
            />
          </DiagramCard>
        </div>
      )}

      {/* TAB: CATALOGO DE AGENTES */}
      {activeTab === 'subagents' && (
        <div className="space-y-4">
          {agents.map((agent) => (
            <DiagramCard key={agent.id}>
              <div
                className="cursor-pointer"
                onClick={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {agent.icon}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{agent.name}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            agent.triggerType === 'event-driven'
                              ? 'bg-sky-100 text-sky-700'
                              : agent.triggerType === 'scheduled'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {agent.triggerType === 'event-driven'
                            ? 'Event-driven'
                            : agent.triggerType === 'scheduled'
                              ? 'Scheduled'
                              : 'Manual'}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${agent.badgeColor}`}
                        >
                          Invocado via CLI
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{agent.description}</div>
                    </div>
                  </div>
                  <ArrowRight
                    size={16}
                    className={`text-slate-400 transition-transform ${expandedAgent === agent.id ? 'rotate-90' : ''}`}
                  />
                </div>
              </div>

              {expandedAgent === agent.id && (
                <div className="mt-4 space-y-4 border-t border-slate-200 pt-4">
                  {/* Frontmatter preview */}
                  <SectionBox
                    title="Archivo .md del Agent (frontmatter)"
                    borderColor="border-slate-200"
                    bgColor="bg-slate-50"
                    icon={<Settings size={16} className="text-slate-600" />}
                  >
                    <pre className="text-xs font-mono bg-slate-800 text-green-300 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
                      {`---
name: ${agent.name}
description: ${agent.whenToUse}
model: inherit
color: ${agent.agentColor}
tools: [${agent.tools.map((t) => `"${t}"`).join(', ')}]
skills:
${agent.preloadedSkills.map((s) => `  - ${s}`).join('\n')}
memory: project
---

${agent.agentInstructions}`}
                    </pre>
                    <div className="mt-2 bg-violet-50 border border-violet-200 rounded-lg p-2 flex items-start gap-2">
                      <Brain size={14} className="text-violet-600 flex-shrink-0 mt-0.5" />
                      <div className="text-[10px] text-violet-700">
                        <span className="font-semibold">skills:</span> El contenido completo de cada
                        skill se inyecta en el contexto del agent al arrancar (preloaded). No se
                        hereda de la conversacion padre — cada skill debe listarse explicitamente.
                        Esto es lo inverso de ejecutar un skill con{' '}
                        <code className="bg-violet-100 px-1 rounded">context: fork</code>.
                      </div>
                    </div>
                    <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-2 flex items-start gap-2">
                      <FolderOpen size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-[10px] text-amber-700">
                        <span className="font-semibold">memory: project</span> — Claude Code
                        auto-genera{' '}
                        <code className="bg-amber-100 px-1 rounded">
                          .claude/agent-memory/{agent.name}/MEMORY.md
                        </code>
                        . Las primeras 200 lineas de MEMORY.md se inyectan en el system prompt.
                        Read, Write y Edit se habilitan automaticamente. El agent acumula
                        conocimiento entre conversaciones (patrones, edge cases, decisiones).
                      </div>
                    </div>
                  </SectionBox>

                  {/* Grid: Skills + MCPs + Tools */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <SectionBox
                      title={`Skills Preloaded (${agent.preloadedSkills.length})`}
                      borderColor="border-emerald-200"
                      bgColor="bg-emerald-50"
                      icon={<Brain size={16} className="text-emerald-600" />}
                    >
                      <div className="space-y-1">
                        {agent.skills.map((s) => (
                          <div
                            key={s.name}
                            className={`flex items-center justify-between rounded px-2 py-1 border ${agent.preloadedSkills.includes(s.name) ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200'}`}
                          >
                            <div className="flex items-center gap-1.5">
                              {agent.preloadedSkills.includes(s.name) && (
                                <CheckCircle2 size={10} className="text-emerald-600" />
                              )}
                              <span className="text-xs text-slate-700">{s.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-400">{s.phase}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-1.5 text-[10px] text-emerald-600 font-semibold">
                        Contenido completo inyectado al arrancar via skills: en frontmatter
                      </div>
                    </SectionBox>

                    <SectionBox
                      title={`MCPs (${agent.mcps.length})`}
                      borderColor="border-violet-200"
                      bgColor="bg-violet-50"
                      icon={<Cable size={16} className="text-violet-600" />}
                    >
                      <div className="space-y-1">
                        {agent.mcps.map((m) => (
                          <div
                            key={m}
                            className="bg-white rounded px-2 py-1 border border-slate-200 text-xs text-slate-700"
                          >
                            {m}
                          </div>
                        ))}
                      </div>
                    </SectionBox>

                    <SectionBox
                      title={`Tools (${agent.tools.length})`}
                      borderColor="border-amber-200"
                      bgColor="bg-amber-50"
                      icon={<Terminal size={16} className="text-amber-600" />}
                    >
                      <div className="space-y-1">
                        {agent.tools.map((t) => (
                          <div
                            key={t}
                            className="bg-white rounded px-2 py-1 border border-slate-200 text-xs text-slate-700"
                          >
                            {t}
                          </div>
                        ))}
                      </div>
                    </SectionBox>
                  </div>

                  {/* Chain Steps */}
                  <SectionBox
                    title="Chain Steps (secuencia de ejecucion)"
                    borderColor="border-blue-200"
                    bgColor="bg-blue-50"
                    icon={<Workflow size={16} className="text-blue-600" />}
                  >
                    <div className="space-y-1">
                      {agent.chainSteps.map((step, i) => {
                        const isGuard = step.includes('GUARD');
                        const isValidate = step.includes('VALIDATE');
                        const isSpecial = isGuard || isValidate;
                        return (
                          <div
                            key={`${agent.id}-step-${i}`}
                            className={`flex items-start gap-2 ${isSpecial ? 'bg-red-50 border border-red-200 rounded-md px-2 py-1.5 -mx-1' : ''}`}
                          >
                            <span
                              className={`text-[10px] font-mono rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                isGuard
                                  ? 'bg-red-200 text-red-800'
                                  : isValidate
                                    ? 'bg-amber-200 text-amber-800'
                                    : 'bg-blue-200 text-blue-800'
                              }`}
                            >
                              {isGuard ? '!' : isValidate ? '\u2713' : i + 1}
                            </span>
                            <span
                              className={`text-xs ${isSpecial ? 'text-red-800 font-semibold' : 'text-slate-700'}`}
                            >
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </SectionBox>

                  {/* Templates */}
                  {agent.templates.length > 0 && (
                    <SectionBox
                      title="Templates"
                      borderColor="border-cyan-200"
                      bgColor="bg-cyan-50"
                      icon={<ClipboardList size={16} className="text-cyan-600" />}
                    >
                      <div className="space-y-1">
                        {agent.templates.map((t) => (
                          <Link
                            key={t.code}
                            to={`/${clientId}/handoffs#tpl-${t.code}`}
                            className="flex items-center justify-between bg-white rounded px-2 py-1.5 border border-slate-200 hover:border-violet-300 hover:bg-violet-50 transition-colors"
                            title={`Ver ${t.code} en el catálogo de templates`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono bg-slate-100 rounded px-1.5 py-0.5 text-slate-600 group-hover:bg-violet-100">
                                {t.code}
                              </span>
                              <span className="text-xs text-slate-700">{t.name}</span>
                            </div>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                t.role === 'produce'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {t.role === 'produce' ? 'Produce' : 'Consume'}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </SectionBox>
                  )}

                  {/* Memory Instructions */}
                  <SectionBox
                    title="Instrucciones de Memoria Persistente"
                    borderColor="border-violet-200"
                    bgColor="bg-violet-50"
                    icon={<FolderTree size={16} className="text-violet-600" />}
                  >
                    <div className="text-xs text-slate-700 leading-relaxed">
                      {agent.memoryInstructions}
                    </div>
                    <div className="mt-2 text-[10px] font-mono text-violet-500">
                      Ubicacion: .claude/agent-memory/{agent.name}/MEMORY.md
                    </div>
                  </SectionBox>

                  {/* Cannot do */}
                  <SectionBox
                    title="Limites — NO puede hacer"
                    borderColor="border-red-200"
                    bgColor="bg-red-50"
                    icon={<XCircle size={16} className="text-red-600" />}
                  >
                    <div className="space-y-1">
                      {agent.cannotDo.map((item, i) => (
                        <div
                          key={`${agent.id}-cant-${i}`}
                          className="flex items-start gap-2 bg-white rounded px-2 py-1.5 border border-red-200"
                        >
                          <XCircle size={12} className="text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </SectionBox>
                </div>
              )}
            </DiagramCard>
          ))}
        </div>
      )}

      {/* TAB: QUE DELEGAR */}
      {activeTab === 'delegation' && (
        <div className="space-y-6">
          <DiagramCard>
            <SectionBox
              title="SI delegar a Subagentes"
              borderColor="border-emerald-200"
              bgColor="bg-emerald-50"
              icon={<CheckCircle2 size={20} className="text-emerald-600" />}
            >
              <div className="text-xs text-slate-500 mb-3">
                Tareas repetitivas, alto volumen, formatos estandarizados, fuentes de datos claras
              </div>
              <div className="space-y-2">
                {delegateYes.map((item, i) => (
                  <div
                    key={`yes-${i}`}
                    className="bg-white rounded-lg p-3 border border-emerald-200 grid grid-cols-1 md:grid-cols-12 gap-2 items-start"
                  >
                    <div className="md:col-span-5 text-xs text-slate-800 font-semibold">
                      {item.task}
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                        {item.agent}
                      </span>
                    </div>
                    <div className="md:col-span-5 text-xs text-slate-500">{item.reason}</div>
                  </div>
                ))}
              </div>
            </SectionBox>
          </DiagramCard>

          <DiagramCard>
            <SectionBox
              title="NO delegar — Requiere juicio humano"
              borderColor="border-red-200"
              bgColor="bg-red-50"
              icon={<XCircle size={20} className="text-red-600" />}
            >
              <div className="text-xs text-slate-500 mb-3">
                Decisiones de negocio, responsabilidad legal, juicio cualitativo, creatividad,
                dinamica de equipo
              </div>
              <div className="space-y-2">
                {delegateNo.map((item, i) => (
                  <div
                    key={`no-${i}`}
                    className="bg-white rounded-lg p-3 border border-red-200 grid grid-cols-1 md:grid-cols-12 gap-2 items-start"
                  >
                    <div className="md:col-span-4 text-xs text-slate-800 font-semibold">
                      {item.task}
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-[10px] font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded">
                        {item.owner}
                      </span>
                    </div>
                    <div className="md:col-span-6 text-xs text-slate-500">{item.reason}</div>
                  </div>
                ))}
              </div>
            </SectionBox>
          </DiagramCard>

          {/* Rule of thumb */}
          <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <div className="text-sm text-amber-800 font-semibold">Regla de oro de delegacion</div>
              <div className="text-xs text-amber-700 mt-1 space-y-1">
                <div>
                  <span className="font-semibold">Delegar:</span> Si la tarea se puede describir
                  como un algoritmo con inputs y outputs claros.
                </div>
                <div>
                  <span className="font-semibold">No delegar:</span> Si la tarea requiere
                  &quot;sentido comun&quot;, contexto politico, o tiene implicaciones
                  legales/contractuales.
                </div>
                <div>
                  <span className="font-semibold">Regla practica:</span> Si el output del agent
                  necesita revision humana antes de ser final, es un buen candidato a delegacion (el
                  agent hace el 80%, el humano valida el 20%).
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: ESPECIFICACION — cómo se definen los agentes */}
      {activeTab === 'espec' && (
        <div className="space-y-6">
          {/* Memory scope explanation */}
          <DiagramCard>
            <SectionBox
              title="Memory Scope: project"
              borderColor="border-violet-200"
              bgColor="bg-violet-50"
              icon={<FolderTree className="text-violet-600" size={20} />}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  {
                    scope: 'user',
                    location: '~/.claude/agent-memory/',
                    use: 'Learnings personales cross-proyecto',
                    selected: false,
                  },
                  {
                    scope: 'project',
                    location: '.claude/agent-memory/',
                    use: 'Conocimiento del proyecto, compartible via Git',
                    selected: true,
                  },
                  {
                    scope: 'local',
                    location: '.claude/agent-memory-local/',
                    use: 'Proyecto-especifico, NO en version control',
                    selected: false,
                  },
                ].map((s) => (
                  <div
                    key={s.scope}
                    className={`rounded-lg p-3 border ${s.selected ? 'border-violet-400 bg-violet-100 ring-2 ring-violet-300' : 'border-slate-200 bg-white'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${s.selected ? 'bg-violet-200 text-violet-800' : 'bg-slate-100 text-slate-600'}`}
                      >
                        {s.scope}
                      </span>
                      {s.selected && <CheckCircle2 size={14} className="text-violet-600" />}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 mt-1">{s.location}</div>
                    <div className="text-xs text-slate-600 mt-1">{s.use}</div>
                    {s.selected && (
                      <div className="text-[10px] text-violet-700 mt-1 font-semibold">
                        Elegido: equipo grande, conocimiento compartido via Git
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </SectionBox>
          </DiagramCard>

          {/* Skills preloading explanation */}
          <DiagramCard>
            <SectionBox
              title="Skills Preloading (skills: en frontmatter)"
              borderColor="border-emerald-200"
              bgColor="bg-emerald-50"
              icon={<Brain className="text-emerald-600" size={20} />}
            >
              <div className="bg-white rounded-lg p-4 border border-emerald-200">
                <div className="text-xs text-slate-700 leading-relaxed space-y-2">
                  <div>
                    El campo{' '}
                    <code className="bg-emerald-100 px-1.5 py-0.5 rounded font-mono text-emerald-800">
                      skills:
                    </code>{' '}
                    en el frontmatter del agent{' '}
                    <span className="font-semibold">
                      inyecta el contenido completo de cada skill
                    </span>{' '}
                    en el contexto del agent al arrancar. No es una referencia — es una precarga
                    real del SKILL.md + reference/ + examples/.
                  </div>
                  <div>
                    Los subagentes{' '}
                    <span className="font-semibold">
                      NO heredan skills de la conversacion padre
                    </span>
                    . Cada skill debe listarse explicitamente en el frontmatter.
                  </div>
                  <div className="bg-slate-800 text-green-300 font-mono text-[11px] p-3 rounded-lg overflow-x-auto whitespace-pre">
                    {`# En el .md del agent:
---
name: qa-agent
skills:
  - test-plan          # Contenido COMPLETO inyectado
  - create-test-cases  # al arrancar el agent
  - regression-suite
---`}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-2">
                    Esto es lo inverso de{' '}
                    <code className="bg-slate-100 px-1 rounded">context: fork</code> en un skill.
                    Con <strong>skills en un subagente</strong>, el subagente controla el system
                    prompt y carga el contenido del skill. Con{' '}
                    <strong>context: fork en un skill</strong>, el contenido del skill se inyecta en
                    el agent que especifiques.
                  </div>
                </div>
              </div>
              {/* Preloaded skills per agent */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {agents.map((agent) => (
                  <div
                    key={`preload-${agent.id}`}
                    className={`${agent.color} rounded-lg p-2 border border-slate-200`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      {agent.icon}
                      <span className="text-xs font-semibold text-slate-800">{agent.name}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded ${agent.badgeColor}`}>
                        {agent.preloadedSkills.length} skills
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {agent.preloadedSkills.map((s) => (
                        <span
                          key={`${agent.id}-preload-${s}`}
                          className="text-[10px] font-mono bg-white rounded px-1.5 py-0.5 border border-emerald-200 text-emerald-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SectionBox>
          </DiagramCard>

          {/* Agent spec compliance */}
          <DiagramCard>
            <SectionBox
              title="Campos requeridos del .md (spec oficial)"
              borderColor="border-amber-200"
              bgColor="bg-amber-50"
              icon={<ClipboardList className="text-amber-600" size={20} />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  {
                    field: 'name',
                    required: true,
                    desc: 'Identificador unico: lowercase, hyphens, 3-50 chars',
                    example: 'qa-agent',
                  },
                  {
                    field: 'description',
                    required: true,
                    desc: 'Empieza con "Use this agent when..." + bloques <example>',
                    example: 'Use this agent when...',
                  },
                  {
                    field: 'model',
                    required: true,
                    desc: 'inherit | sonnet | opus | haiku',
                    example: 'inherit',
                  },
                  {
                    field: 'color',
                    required: true,
                    desc: 'blue | cyan | green | yellow | magenta | red',
                    example: 'green',
                  },
                  {
                    field: 'tools',
                    required: false,
                    desc: 'Array de tools permitidos. Si se omite, acceso total',
                    example: '["Read", "Grep", "Glob"]',
                  },
                  {
                    field: 'skills',
                    required: false,
                    desc: 'Skills precargados al arrancar — contenido completo inyectado',
                    example: '- test-plan\n- create-test-cases',
                  },
                  {
                    field: 'memory',
                    required: false,
                    desc: 'user | project | local — scope de memoria persistente',
                    example: 'project',
                  },
                ].map((f) => (
                  <div key={f.field} className="bg-white rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-xs font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                        {f.field}:
                      </code>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${f.required ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'}`}
                      >
                        {f.required ? 'Requerido' : 'Opcional'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">{f.desc}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1">{f.example}</div>
                  </div>
                ))}
              </div>
            </SectionBox>
          </DiagramCard>
        </div>
      )}

      {/* TAB: OPERACION — cómo operan los agentes en el día a día */}
      {activeTab === 'oper' && (
        <div className="space-y-6">
          {/* Can/cannot matrix */}
          <DiagramCard>
            <SectionBox
              title="Pueden los Subagentes ejecutar Workflows?"
              borderColor="border-blue-200"
              bgColor="bg-blue-50"
              icon={<Workflow size={20} className="text-blue-600" />}
            >
              <div className="space-y-2">
                {workflowCapabilities.map((item, i) => (
                  <div
                    key={`wf-${i}`}
                    className={`rounded-lg p-3 border ${item.canDo ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}
                  >
                    <div className="flex items-center gap-2">
                      {item.canDo ? (
                        <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                      ) : (
                        <XCircle size={16} className="text-red-600 flex-shrink-0" />
                      )}
                      <span className="text-sm text-slate-800 font-semibold">
                        {item.capability}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1 ml-6">{item.detail}</div>
                  </div>
                ))}
              </div>
            </SectionBox>
          </DiagramCard>

          {/* Chain patterns */}
          <DiagramCard>
            <SectionBox
              title="Chain Patterns — Encadenamiento de Subagentes"
              borderColor="border-violet-200"
              bgColor="bg-violet-50"
              icon={<Bot size={20} className="text-violet-600" />}
            >
              <div className="text-xs text-slate-600 mb-4">
                Los subagentes no pueden spawear otros subagentes, pero el{' '}
                <span className="font-semibold">agente orquestador</span> (conversacion principal)
                puede encadenarlos en secuencia. Cada subagente completa su tarea y retorna un
                resumen al orquestador, que lo pasa al siguiente. El detonante siempre es un humano
                invocando Claude Code CLI.
              </div>
              <div className="space-y-4">
                {/* Chain 1: Full QA pipeline */}
                <div className="bg-white rounded-lg p-3 border border-violet-200">
                  <div className="text-sm font-semibold text-violet-800 mb-2">
                    Chain 1: Pipeline QA completo
                  </div>
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="bg-sky-100 text-sky-700 px-2 py-1 rounded font-mono">
                      qa-agent
                    </span>
                    <ArrowRight size={14} className="text-slate-400" />
                    <span className="text-slate-500">retorna suite</span>
                    <ArrowRight size={14} className="text-slate-400" />
                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded italic">
                      QA Lead revisa + ejecuta
                    </span>
                    <ArrowRight size={14} className="text-slate-400" />
                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded italic">
                      /advance-gate 5 (humano)
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-2">
                    Invocado por: QA Lead via CLI cuando el ticket pasa a &quot;Ready for QA&quot;.
                    El subagente prepara, el humano valida y avanza el gate.
                  </div>
                </div>

                {/* Chain 2: Security + Release */}
                <div className="bg-white rounded-lg p-3 border border-violet-200">
                  <div className="text-sm font-semibold text-violet-800 mb-2">
                    {'Chain 2: Security -> Release'}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded font-mono">
                      security-agent
                    </span>
                    <ArrowRight size={14} className="text-slate-400" />
                    <span className="text-slate-500">retorna reporte</span>
                    <ArrowRight size={14} className="text-slate-400" />
                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded italic">
                      Sec Lead firma so-security
                    </span>
                    <ArrowRight size={14} className="text-slate-400" />
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-mono">
                      release-agent
                    </span>
                    <ArrowRight size={14} className="text-slate-400" />
                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded italic">
                      Comite aprueba CR
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-2">
                    Invocado por: Sec Lead via CLI para security-agent; PME via CLI para
                    release-agent tras la firma humana. Chain secuencial con intervencion humana
                    entre pasos.
                  </div>
                </div>

                {/* Chain 3: Sprint close */}
                <div className="bg-white rounded-lg p-3 border border-violet-200">
                  <div className="text-sm font-semibold text-violet-800 mb-2">
                    Chain 3: Cierre de Sprint
                  </div>
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded font-mono">
                      metrics-agent
                    </span>
                    <ArrowRight size={14} className="text-slate-400" />
                    <span className="text-slate-500">retorna metricas</span>
                    <ArrowRight size={14} className="text-slate-400" />
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-mono">
                      docs-agent
                    </span>
                    <ArrowRight size={14} className="text-slate-400" />
                    <span className="text-slate-500">sincroniza docs</span>
                    <ArrowRight size={14} className="text-slate-400" />
                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded italic">
                      Equipo: Retrospectiva
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-2">
                    Invocado por: Tech Lead via CLI al cierre de sprint. El orquestador puede
                    ejecutar metrics-agent y docs-agent en paralelo.
                  </div>
                </div>
              </div>
            </SectionBox>
          </DiagramCard>

          {/* Skills vs Subagents decision */}
          <DiagramCard>
            <SectionBox
              title="Skills vs Subagentes — Cuando usar cada uno"
              borderColor="border-emerald-200"
              bgColor="bg-emerald-50"
              icon={<Brain size={20} className="text-emerald-600" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3 border border-emerald-200">
                  <div className="text-sm font-semibold text-emerald-800 mb-2">
                    Usar Skills cuando...
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    <div>- La tarea necesita back-and-forth iterativo con el humano</div>
                    <div>- Multiples fases comparten contexto significativo</div>
                    <div>- Es un cambio rapido y targetizado</div>
                    <div>- La latencia importa (los subagentes arrancan desde cero)</div>
                    <div>- Quieres prompts reutilizables en el contexto de la conversacion</div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-violet-200">
                  <div className="text-sm font-semibold text-violet-800 mb-2">
                    Usar Subagentes cuando...
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    <div>- La tarea produce output verbose que no necesitas en tu contexto</div>
                    <div>- Quieres restringir tools/permisos especificos</div>
                    <div>- El trabajo es autocontenido y puede retornar un resumen</div>
                    <div>- Necesitas memoria persistente entre sesiones</div>
                    <div>
                      - El humano decide invocarlos en un momento concreto del flujo via CLI
                    </div>
                  </div>
                </div>
              </div>
            </SectionBox>
          </DiagramCard>

          {/* Memory management best practices */}
          <DiagramCard>
            <SectionBox
              title="Mejores Prácticas de Memoria Local"
              borderColor="border-indigo-200"
              bgColor="bg-indigo-50"
              icon={<FolderTree className="text-indigo-600" size={20} />}
            >
              <div className="space-y-4">
                {/* Key principle */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-amber-600 font-semibold text-sm">⚠️ Principio Clave</span>
                  </div>
                  <div className="text-xs text-amber-800">
                    La <strong>memoria auto</strong> es machine-local (~/.claude/projects/) y
                    personal.
                    <strong> NO compartir memoria en el proyecto</strong> - causa conflictos entre
                    miembros del equipo.
                  </div>
                </div>

                {/* Best practices */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-emerald-200">
                    <div className="text-sm font-semibold text-emerald-800 mb-2 flex items-center gap-1">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      Hacer (DO)
                    </div>
                    <div className="space-y-1 text-xs text-slate-600">
                      <div>• Mantener memoria local en ~/.claude/projects/</div>
                      <div>• Compartir insights valiosos con el equipo verbalmente</div>
                      <div>• Documentar patrones importantes en CLAUDE.md</div>
                      <div>• Actualizar rules/ basándose en aprendizajes</div>
                      <div>• Revisar agent-memory/ en reuniones 1:1</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-red-200">
                    <div className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-1">
                      <XCircle size={16} className="text-red-600" />
                      Evitar (DON'T)
                    </div>
                    <div className="space-y-1 text-xs text-slate-600">
                      <div>• Nunca commitear memoria en .claude/memory/</div>
                      <div>• No configurar autoMemoryDirectory en proyecto</div>
                      <div>• No compartir archivos de memoria directamente</div>
                      <div>• No asumir que otros tienen tu contexto</div>
                      <div>• No ignorar insights valiosos sin documentar</div>
                    </div>
                  </div>
                </div>

                {/* Workflow for knowledge sharing */}
                <div className="bg-white rounded-lg p-4 border border-indigo-200">
                  <div className="text-sm font-semibold text-indigo-800 mb-3">
                    🔄 Workflow de Conocimiento Compartido
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-xs">
                      <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-mono text-[10px] mt-0.5">
                        1
                      </span>
                      <div>
                        <strong>Memoria personal:</strong> Acumulas aprendizajes en agent-memory
                        local
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-mono text-[10px] mt-0.5">
                        2
                      </span>
                      <div>
                        <strong>Identificar patrones:</strong> Detectas insights valiosos o
                        repetitivos
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-mono text-[10px] mt-0.5">
                        3
                      </span>
                      <div>
                        <strong>Compartir contexto:</strong> Discutes hallazgos con equipo en
                        retrospectivas
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-mono text-[10px] mt-0.5">
                        4
                      </span>
                      <div>
                        <strong>Formalizar aprendizaje:</strong> Actualizas CLAUDE.md o
                        creas/modifica rules
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-mono text-[10px] mt-0.5">
                        5
                      </span>
                      <div>
                        <strong>Commit & PR:</strong> El conocimiento formalizado se vuelve estándar
                        del equipo
                      </div>
                    </div>
                  </div>
                </div>

                {/* Example scenarios */}
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <div className="text-xs font-semibold text-slate-700 mb-2">
                    💡 Ejemplos de Aplicación
                  </div>
                  <div className="space-y-2 text-xs text-slate-600">
                    <div>
                      <strong>Escenario 1:</strong> Descubres que ciertos skills fallan con
                      proyectos React → Documentas en rules/tech-stack.md las limitaciones
                      específicas
                    </div>
                    <div>
                      <strong>Escenario 2:</strong> Notas patrones de handoffs efectivos →
                      Actualizas CLAUDE.md con nuevas mejores prácticas
                    </div>
                    <div>
                      <strong>Escenario 3:</strong> Agent recuerda configuraciones específicas del
                      cliente → Creas rule específica en rules/project.md
                    </div>
                  </div>
                </div>
              </div>
            </SectionBox>
          </DiagramCard>
        </div>
      )}
    </div>
  );
}
