import {
  Shield,
  Scan,
  AlertTriangle,
  XCircle,
  BookOpen,
  ExternalLink,
  Lightbulb,
  Lock,
  Package,
  Bot,
  KeyRound,
  Eye,
} from 'lucide-react';
import {
  Legend,
  DiagramCard,
  PageHeader,
  SectionBox,
  InfoTable,
} from '@/app/components/shared/FlowComponents';
import { FlowDiagram, n, e } from '@/app/components/shared/ReactFlowDiagram';
import type { Node, Edge } from '@xyflow/react';
import { useCurrentClient } from '@/hooks';
import { getPhaseColor } from '@/data/phases';

// Security SDLC Legend
const legendItems = [
  { color: `bg-${getPhaseColor(5)}-200`, label: 'Desarrollo' },
  { color: `bg-${getPhaseColor(7)}-200`, label: 'Seguridad (SAST/SCA)' },
  { color: `bg-${getPhaseColor(7)}-200`, label: 'Seguridad Dinámica (DAST)' },
  { color: `bg-${getPhaseColor(6)}-200`, label: 'Testing Manual' },
  { color: 'bg-green-200', label: 'Aprobación' },
  { color: `bg-${getPhaseColor(8)}-200`, label: 'Despliegue' },
];

// Security SDLC Nodes
const nodes: Node[] = [
  n('dev', 250, 0, 'Desarrollo', getPhaseColor(5), 'Pull Request'),
  n('sast', 100, 120, 'SAST', getPhaseColor(7), 'Análisis Estático'),
  n('sca', 400, 120, 'SCA', getPhaseColor(7), 'Dependencias'),
  n('code-review', 250, 240, 'Code Review', getPhaseColor(5), 'Revisión'),
  n('merge', 250, 360, 'Merge to Main', 'green', 'Integración'),
  n('dast', 250, 480, 'DAST', getPhaseColor(7), 'Análisis Dinámico'),
  n('pentest', 250, 600, 'Pen Testing', getPhaseColor(6), 'Testing Manual'),
  n('security-approval', 250, 720, 'Security Approval', getPhaseColor(7), 'Gate de Seguridad'),
  n('deploy', 250, 840, 'Deploy', getPhaseColor(8), 'Producción'),
];

// Security SDLC Edges
const edges: Edge[] = [
  e('e1', 'dev', 'sast', 'Pipeline automático'),
  e('e2', 'dev', 'sca', 'Scanner dependencias'),
  e('e3', 'sast', 'code-review', 'Pasa validación'),
  e('e4', 'sca', 'code-review', 'Sin vulnerabilidades'),
  e('e5', 'code-review', 'merge', 'Aprobado'),
  e('e6', 'merge', 'dast', 'Deploy a staging'),
  e('e7', 'dast', 'pentest', 'Pasa DAST'),
  e('e8', 'pentest', 'security-approval', 'Testing manual'),
  e('e9', 'security-approval', 'deploy', 'Gate seguridad OK'),
];

export function SeguridadSDLC() {
  const { client } = useCurrentClient();

  return (
    <div>
      <PageHeader
        title="Seguridad y SDLC"
        subtitle={`Pipeline de seguridad del ciclo de vida del software — Primera implementacion en ${client.name}, liderada por el equipo de Seguridad`}
      />
      <div className="mt-6 space-y-6">
        {/* Banner */}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-center gap-3">
          <Shield className="text-red-600 flex-shrink-0" size={28} />
          <div>
            <div className="font-semibold text-red-800">
              {`Pipeline de Seguridad SDLC — ${client.name}`}
            </div>
            <div className="text-xs text-red-600 mt-0.5 italic">
              Implementación de controles de seguridad integrados en el ciclo de vida del software
            </div>
          </div>
        </div>

        <Legend items={legendItems} />
        <div className="mt-6">
          <DiagramCard>
            <h2 className="text-lg font-semibold text-slate-700 mb-4 text-center">
              Pipeline de Seguridad SDLC
            </h2>
            <FlowDiagram
              nodes={nodes}
              edges={edges}
              height={900}
              exportName="Pipeline_SDLC_Seguridad"
            />
          </DiagramCard>
        </div>

        {/* Automation & Thresholds */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DiagramCard>
            <SectionBox
              title="Automatizacion"
              borderColor="border-slate-200"
              bgColor="bg-slate-50"
              icon={<Scan className="text-slate-600" size={20} />}
            >
              <InfoTable
                rows={[
                  { label: 'SAST/SCA', value: 'Automatizado en cada Pull Request' },
                  {
                    label: 'Endpoints',
                    value: 'Escaneo semanal automatizado (frecuencia ajustable)',
                  },
                  { label: 'Post-deploy', value: 'Escaneo automatizado tras cada despliegue' },
                ]}
              />
            </SectionBox>
          </DiagramCard>

          <DiagramCard>
            <SectionBox
              title="Umbrales de Seguridad"
              borderColor="border-red-200"
              bgColor="bg-red-50"
              icon={<AlertTriangle className="text-red-600" size={20} />}
            >
              <div className="space-y-2">
                <div className="bg-red-100 rounded-lg p-3 border border-red-300 flex items-center gap-2">
                  <XCircle className="text-red-600 flex-shrink-0" size={18} />
                  <span className="text-sm text-red-800 font-semibold">
                    Critica &rarr; BLOQUEANTE
                  </span>
                </div>
                <div className="bg-red-100 rounded-lg p-3 border border-red-300 flex items-center gap-2">
                  <XCircle className="text-red-600 flex-shrink-0" size={18} />
                  <span className="text-sm text-red-800 font-semibold">Alta &rarr; BLOQUEANTE</span>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 flex items-center gap-2">
                  <AlertTriangle className="text-amber-600 flex-shrink-0" size={18} />
                  <span className="text-sm text-amber-800">
                    Media/Baja &rarr; Revision, no bloqueante
                  </span>
                </div>
              </div>
            </SectionBox>
          </DiagramCard>
        </div>

        {/* QA + Security */}
        <DiagramCard>
          <SectionBox
            title="Integracion QA + Seguridad"
            borderColor="border-violet-200"
            bgColor="bg-violet-50"
            icon={<Shield className="text-violet-600" size={20} />}
          >
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div
                className={`bg-${getPhaseColor(6)}-100 rounded-lg p-4 border border-${getPhaseColor(6)}-200 text-center w-40`}
              >
                <div className={`font-semibold text-sm text-${getPhaseColor(6)}-700`}>QA</div>
                <div className={`text-xs text-${getPhaseColor(6)}-600 mt-1`}>Testing funcional</div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="bg-violet-100 rounded-lg px-3 py-2 border border-violet-300 text-xs text-violet-800 font-semibold">
                  SAST/SCA Tools
                </div>
                <div className="text-xs text-violet-500">SonarQube (propuesta LIDR)</div>
              </div>
              <div
                className={`bg-${getPhaseColor(7)}-100 rounded-lg p-4 border border-${getPhaseColor(7)}-200 text-center w-40`}
              >
                <div className={`font-semibold text-sm text-${getPhaseColor(7)}-700`}>
                  Seguridad
                </div>
                <div className={`text-xs text-${getPhaseColor(7)}-600 mt-1`}>Sec Lead</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-center text-violet-600">
              QA y seguridad trabajan parcialmente en paralelo con superposicion en herramientas de
              deteccion
            </div>
          </SectionBox>
        </DiagramCard>

        {/* Glosario de Siglas */}
        <DiagramCard>
          <SectionBox
            title="Glosario de Siglas"
            borderColor="border-slate-200"
            bgColor="bg-slate-50"
            icon={<BookOpen className="text-slate-600" size={20} />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                {
                  sigla: 'SDLC',
                  expansion: 'Software Development Life Cycle',
                  desc: 'Ciclo de vida del desarrollo de software',
                },
                {
                  sigla: 'SAST',
                  expansion: 'Static Application Security Testing',
                  desc: 'Analisis de seguridad del codigo fuente sin ejecutarlo',
                },
                {
                  sigla: 'SCA',
                  expansion: 'Software Composition Analysis',
                  desc: 'Analisis de vulnerabilidades en dependencias de terceros',
                },
                {
                  sigla: 'DAST',
                  expansion: 'Dynamic Application Security Testing',
                  desc: 'Pruebas de seguridad sobre la aplicacion en ejecucion',
                },
                {
                  sigla: 'QA',
                  expansion: 'Quality Assurance',
                  desc: 'Aseguramiento de la calidad del software',
                },
                {
                  sigla: 'PR',
                  expansion: 'Pull Request',
                  desc: 'Solicitud de revision e integracion de codigo',
                },
                {
                  sigla: 'UAT',
                  expansion: 'User Acceptance Testing',
                  desc: 'Pruebas de aceptacion por el usuario final',
                },
                {
                  sigla: 'DevOps',
                  expansion: 'Development + Operations',
                  desc: 'Practicas que unifican desarrollo y operaciones de TI',
                },
              ].map((item) => (
                <div key={item.sigla} className="bg-white rounded-lg p-3 border border-slate-200">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-sm text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {item.sigla}
                    </span>
                    <span className="text-xs text-slate-500 italic">{item.expansion}</span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">{item.desc}</div>
                </div>
              ))}
            </div>
          </SectionBox>
        </DiagramCard>

        {/* Posibles Mejoras — Hooks de Seguridad */}
        <DiagramCard>
          <SectionBox
            title="Posibles Mejoras — Hooks de Seguridad para Agentes IA"
            borderColor="border-cyan-200"
            bgColor="bg-cyan-50"
            icon={<Lightbulb className="text-cyan-600" size={20} />}
          >
            {/* Disclaimer banner */}
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 mb-4 flex items-start gap-2">
              <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <div className="text-sm text-amber-800 font-semibold">
                  Fuera del alcance del proyecto actual
                </div>
                <div className="text-xs text-amber-700 mt-0.5">
                  Estas herramientas son recomendaciones de la{' '}
                  <a
                    href="https://cursor.com/es/docs/hooks"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold hover:text-amber-900"
                  >
                    documentacion oficial de Cursor
                  </a>
                  . Aunque usamos Claude Code, el concepto de hooks de seguridad es{' '}
                  <span className="font-semibold">transversal a cualquier agente de IA</span>. Los
                  expertos de seguridad deberan investigar en profundidad su aplicabilidad y
                  viabilidad para el ecosistema {client.name}.
                </div>
              </div>
            </div>

            {/* Intro */}
            <div className="text-xs text-slate-600 mb-4">
              Los hooks permiten interceptar acciones de agentes IA (generacion de codigo,
              instalacion de paquetes, invocacion de herramientas MCP, ejecucion de comandos) y
              aplicar politicas de seguridad <span className="font-semibold">antes</span> de que se
              ejecuten. Esto complementa las capas SAST/DAST del pipeline existente con una capa de
              proteccion en tiempo de desarrollo asistido por IA.
            </div>

            {/* Categories */}
            <div className="space-y-4">
              {HOOK_CATEGORIES.map((category) => {
                const colors = CATEGORY_COLORS[category.icon] ?? {
                  border: 'border-gray-200',
                  bg: 'bg-gray-50',
                  badge: 'bg-gray-100 text-gray-700',
                };
                return (
                  <div
                    key={category.title}
                    className={`rounded-lg border ${colors.border} ${colors.bg} p-3`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {CATEGORY_ICONS[category.icon]}
                      <span className="text-sm font-semibold text-slate-800">{category.title}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {category.partners.map((partner) => (
                        <div
                          key={partner.name}
                          className="bg-white rounded-lg p-3 border border-slate-200 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded ${colors.badge}`}
                              >
                                {partner.name}
                              </span>
                            </div>
                            <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                              {partner.description}
                            </div>
                          </div>
                          <a
                            href={partner.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            <ExternalLink size={12} />
                            Ver integracion
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary footer */}
            <div className="mt-4 bg-slate-100 rounded-lg p-3 border border-slate-200">
              <div className="text-xs text-slate-700">
                <span className="font-semibold">Resumen:</span> 5 categorias de proteccion, 8
                partners especializados. Estos hooks aportan capas de seguridad en tiempo real que
                complementan el pipeline SAST/SCA/DAST existente, cubriendo: gobernanza MCP,
                analisis de codigo IA, dependencias maliciosas, proteccion del agente y gestion
                segura de secretos.
              </div>
            </div>
          </SectionBox>
        </DiagramCard>
      </div>
    </div>
  );
}

const HOOK_CATEGORIES = [
  {
    title: 'Gobernanza y visibilidad de MCP',
    icon: 'eye' as const,
    partners: [
      {
        name: 'MintMCP',
        description:
          'Crear un inventario completo de servidores MCP, supervisar los patrones de uso de las herramientas y analizar las respuestas en busca de datos sensibles antes de que se envien al modelo de IA.',
        url: 'https://www.mintmcp.com/blog/mcp-governance-cursor-hooks',
      },
      {
        name: 'Oasis Security',
        description:
          'Aplicar politicas de minimo privilegio a las acciones de los agentes de IA y mantener registros de auditoria completos en todos los sistemas de la organizacion.',
        url: 'https://www.oasis.security/blog/cursor-oasis-governing-agentic-access',
      },
      {
        name: 'Runlayer',
        description:
          'Encapsular las herramientas MCP e integrarlas con su broker MCP para lograr un control centralizado y una visibilidad total de las interacciones entre agentes y herramientas.',
        url: 'https://www.runlayer.com/blog/cursor-hooks',
      },
    ],
  },
  {
    title: 'Seguridad del codigo y mejores practicas',
    icon: 'lock' as const,
    partners: [
      {
        name: 'Corridor',
        description:
          'Feedback en tiempo real sobre la implementacion del codigo y las decisiones de diseno de seguridad mientras se escribe codigo.',
        url: 'https://corridor.dev/blog/corridor-cursor-hooks/',
      },
      {
        name: 'Semgrep',
        description:
          'Analiza automaticamente el codigo generado por IA en busca de vulnerabilidades, con feedback en tiempo real para regenerar el codigo hasta que se resuelvan los problemas de seguridad.',
        url: 'https://semgrep.dev/blog/2025/cursor-hooks-mcp-server/',
      },
    ],
  },
  {
    title: 'Seguridad de dependencias',
    icon: 'package' as const,
    partners: [
      {
        name: 'Endor Labs',
        description:
          'Intercepta la instalacion de paquetes y analiza en busca de dependencias maliciosas, evitando ataques a la cadena de suministro antes de que lleguen a tu codigo.',
        url: 'https://www.endorlabs.com/learn/bringing-malware-detection-into-ai-coding-workflows-with-cursor-hooks',
      },
    ],
  },
  {
    title: 'Seguridad y proteccion del agente',
    icon: 'bot' as const,
    partners: [
      {
        name: 'Snyk',
        description:
          'Revisa en tiempo real las acciones del agente con Evo Agent Guard, que detecta y evita problemas como inyecciones de prompt e invocaciones peligrosas de herramientas.',
        url: 'https://snyk.io/es/blog/evo-agent-guard-cursor-integration/',
      },
    ],
  },
  {
    title: 'Gestion de secretos',
    icon: 'key' as const,
    partners: [
      {
        name: '1Password',
        description:
          'Valida que los archivos de entorno de 1Password Environments esten correctamente montados antes de ejecutar los comandos de shell, permitiendo el acceso a secretos justo a tiempo sin escribir credenciales en disco.',
        url: 'https://marketplace.1password.com/integration/cursor-hooks',
      },
    ],
  },
] as const;

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  eye: <Eye className="text-indigo-600 flex-shrink-0" size={18} />,
  lock: <Lock className="text-emerald-600 flex-shrink-0" size={18} />,
  package: <Package className="text-amber-600 flex-shrink-0" size={18} />,
  bot: <Bot className="text-red-600 flex-shrink-0" size={18} />,
  key: <KeyRound className="text-violet-600 flex-shrink-0" size={18} />,
};

const CATEGORY_COLORS: Record<string, { border: string; bg: string; badge: string }> = {
  eye: { border: 'border-indigo-200', bg: 'bg-indigo-50', badge: 'bg-indigo-100 text-indigo-700' },
  lock: {
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  package: { border: 'border-amber-200', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700' },
  bot: { border: 'border-red-200', bg: 'bg-red-50', badge: 'bg-red-100 text-red-700' },
  key: { border: 'border-violet-200', bg: 'bg-violet-50', badge: 'bg-violet-100 text-violet-700' },
};
