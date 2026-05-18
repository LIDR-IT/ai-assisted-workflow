import { Legend, DiagramCard, PageHeader } from './shared/FlowComponents';
import { FlowDiagram, n, e } from './shared/ReactFlowDiagram';
import { useCurrentClient } from '@/hooks';
import { getTestingTool } from '@/utils/clientContent';
import { getPhaseColor } from '@/data/phases';
import type { Node, Edge } from '@xyflow/react';

export function WorkflowDiagram() {
  const { client } = useCurrentClient();
  const testingTool = getTestingTool(client);
  const trackingTool =
    client?.domainTerms?.tracking_tool || (client?.name === 'Docline' ? 'Linear' : 'Jira');

  // Dynamic legend items with client-specific tools
  const dynamicLegendItems =
    client?.name === 'Docline'
      ? [
          { color: `bg-${getPhaseColor(1)}-200`, label: 'Originación (Business/CTO)' },
          { color: `bg-${getPhaseColor(2)}-200`, label: 'Equipo Horizontal (Dual Tech Leads)' },
          { color: 'bg-teal-200', label: 'User Stories Informales' },
          { color: 'bg-indigo-200', label: 'Gestión Linear' },
          { color: 'bg-violet-200', label: 'Sprint Planning (Martes)' },
          { color: `bg-${getPhaseColor(5)}-200`, label: 'Desarrollo (Miércoles start)' },
          { color: `bg-${getPhaseColor(7)}-200`, label: 'Seguridad Integrada' },
          { color: `bg-${getPhaseColor(8)}-200`, label: 'Pipeline: Int → Demo → Prod' },
          { color: `bg-${getPhaseColor(6)}-200`, label: 'QA Live (Reactivo)' },
        ]
      : client?.name === 'Aramis'
        ? [
            { color: 'bg-green-200', label: 'Procesos Funcionales ✅' },
            { color: 'bg-amber-200', label: 'Parcial/Inconsistente ⚠️' },
            { color: 'bg-red-200', label: 'Crítico/Ausente ❌' },
            { color: 'bg-slate-300', label: 'Abandonado 🔒' },
            { color: 'bg-blue-200', label: 'Herramientas Técnicas 🔧' },
          ]
        : [
            { color: `bg-${getPhaseColor(1)}-200`, label: 'Originación (Business/CTO)' },
            { color: `bg-${getPhaseColor(2)}-200`, label: 'Análisis R&D' },
            { color: 'bg-green-200', label: 'Producto (PRD Funcional)' },
            { color: `bg-${getPhaseColor(3)}-200`, label: 'Requisitos Funcionales' },
            { color: `bg-${getPhaseColor(4)}-200`, label: 'User Stories' },
            { color: 'bg-indigo-200', label: `Gestión ${trackingTool}` },
            { color: 'bg-violet-200', label: 'Sprint Planning' },
            { color: `bg-${getPhaseColor(5)}-200`, label: 'Desarrollo' },
            { color: `bg-${getPhaseColor(7)}-200`, label: 'Seguridad' },
            { color: 'bg-amber-200', label: 'Comité de Cambios' },
            { color: `bg-${getPhaseColor(8)}-200`, label: 'Pipeline Despliegue' },
            { color: `bg-${getPhaseColor(6)}-200`, label: 'QA / Testing' },
            { color: 'bg-slate-200', label: 'Post-deploy' },
          ];

  // Dynamic edges based on client process
  const dynamicEdges: Edge[] =
    client?.name === 'Docline'
      ? [
          // Docline: Simplified informal flow
          e('e1', 'business', 'team', 'Requisitos de alto nivel'),
          e('e2', 'team', 'us', 'Define user stories informalmente'),
          e('e3', 'us', 'linear', 'Crea tickets en Linear'),
          e('e4', 'linear', 'sprint', 'Planning los martes'),
          e('e5', 'sprint', 'dev', 'Sprint inicia miércoles'),
          e('e6', 'dev', 'security', 'Seguridad integrada durante desarrollo'),
          e('e7', 'security', 'env-int', 'Deploy automático a Integration'),
          e('e8', 'env-int', 'env-demo', 'Promoción automática Int → Demo'),
          e('e9', 'env-demo', 'env-prod', 'Deploy manual Demo → Production'),
          e('e10', 'env-demo', 'qa-live', 'QA Live: testing reactivo en Demo'),
          e('e11', 'qa-live', 'env-prod', 'QA valida y aprueba para PROD', {
            sourceHandle: 'right',
            targetHandle: 'target-right',
            style: { stroke: '#10b981', strokeWidth: 2 },
          }),
        ]
      : client?.name === 'Aramis'
        ? [
            // Aramis AS-IS: Reality with gaps
            e('e1', 'iniciativa', 'notion', 'Teóricamente', { style: { strokeDasharray: '5,5' } }),
            e('e2', 'iniciativa', 'redmine', 'En realidad'),
            e('e3', 'notion', 'redmine', 'Criterios dispersos', {
              style: { strokeDasharray: '5,5' },
            }),
            e('e4', 'redmine', 'refinement', 'BDD/Gherkin'),
            e('e5', 'refinement', 'sprint', 'Planning 2 sem'),
            e('e6', 'sprint', 'dev-php', 'Backend'),
            e('e7', 'sprint', 'dev-js', 'Frontend'),
            e('e8', 'dev-php', 'phpstan', 'CI integrado ✅'),
            e('e9', 'dev-js', 'code-review', 'Pull Request'),
            e('e10', 'dev-php', 'code-review', 'Pull Request'),
            e('e11', 'code-review', 'merge', 'Aprobado (sin DoD)'),
            e('e12', 'dev-js', 'cypress', 'Manual separado', {
              style: { strokeDasharray: '5,5', stroke: '#ef4444' },
            }),
            e('e13', 'merge', 'bridge-risk', 'Sin verificar', {
              style: { strokeDasharray: '5,5', stroke: '#ef4444' },
            }),
            e('e14', 'merge', 'deploy', 'A producción'),
          ]
        : [
            // Other clients: Formal process
            e('e1', 'business', 'rnd', 'Solicita análisis'),
            e('e2', 'business', 'po', 'Comunica visión'),
            e('e3', 'rnd', 'rf', 'PRD Técnico', { sourceHandle: 'right' }),
            e('e4', 'po', 'rf', 'PRD Funcional', { sourceHandle: 'source-left' }),
            e('e5', 'rf', 'us', 'Derivar'),
            e('e6', 'us', 'jira', 'Crear tickets'),
            e('e7', 'jira', 'sprint', 'Priorizar'),
            e('e8', 'sprint', 'dev', 'Asignar'),
            e('e9', 'dev', 'sast', 'Pipeline seguridad'),
            e('e10', 'dev', 'sca'),
            e('e11', 'dev', 'dast'),
            e('e12', 'sast', 'sca', '', { sourceHandle: 'right', targetHandle: 'left' }),
            e('e13', 'sca', 'dast', '', { sourceHandle: 'right', targetHandle: 'left' }),
            e('e14', 'dast', 'pentest', '', { sourceHandle: 'right', targetHandle: 'left' }),
            e('e15', 'sca', 'comite', 'Gate seguridad'),
            e('e16', 'comite', 'env-dev', 'Aprobado'),
            e('e17', 'env-dev', 'env-stg', '', { sourceHandle: 'right', targetHandle: 'left' }),
            e('e18', 'env-stg', 'env-uat', '', { sourceHandle: 'right', targetHandle: 'left' }),
            e('e19', 'env-uat', 'env-pre', '', { sourceHandle: 'right', targetHandle: 'left' }),
            e('e20', 'env-pre', 'env-prod', '', { sourceHandle: 'right', targetHandle: 'left' }),
            e('e21', 'env-uat', 'qa', 'Validar'),
            e('e22', 'qa', 'scan', 'Post-deploy'),
          ];

  // Dynamic nodes with client-specific tools and process
  const dynamicNodes: Node[] =
    client?.name === 'Docline'
      ? [
          // Docline: Informal but effective process
          n('business', 250, 0, 'Business / Liderazgo', getPhaseColor(1), 'Requisitos Alto Nivel'),
          n(
            'team',
            250,
            110,
            'Equipo Horizontal',
            getPhaseColor(2),
            'Todo el equipo hace todo · Dual Tech Leads'
          ),
          n(
            'us',
            250,
            230,
            'User Stories Informales',
            getPhaseColor(4),
            'Descripción + criterios básicos'
          ),
          n('linear', 250, 340, 'Linear Tickets', getPhaseColor(4), 'Backlog priorizado'),
          n(
            'sprint',
            250,
            440,
            'Sprint Planning',
            getPhaseColor(4),
            'Martes · Sprints Miércoles-Miércoles'
          ),
          n('dev', 250, 540, 'Desarrollo', getPhaseColor(5), 'Héctor (FE) · David (BE) · PR flow'),
          n(
            'security',
            250,
            640,
            'Seguridad Integrada',
            getPhaseColor(7),
            'Infrastructure Lead + Equipo'
          ),
          n('env-int', 250, 750, 'Integration', getPhaseColor(8), 'Desarrollo colaborativo'),
          n('env-demo', 250, 900, 'Demo', getPhaseColor(8), 'UAT y demostración'),
          n('env-prod', 250, 1050, 'Production', getPhaseColor(8), 'Entorno final'),
          n('qa-live', 500, 900, 'QA Live', getPhaseColor(6), 'Testing en vivo · Reactivo'),
        ]
      : client?.name === 'Aramis'
        ? [
            // Aramis AS-IS: Reality with RAG color system
            n('iniciativa', 250, 0, 'Iniciativa Álvaro/David', 'blue', 'Business ideas 🔧'),
            n('notion', 30, 110, 'Notion', 'slate-solid', '"Gran fracaso" — abandonada 🔒'),
            n(
              'redmine',
              490,
              110,
              'Redmine Tickets',
              'amber',
              'Criterios dispersos + Gherkin BDD ⚠️'
            ),
            n('refinement', 250, 230, 'Refinement', 'amber', '"Sometimes, when there\'s time" ⚠️'),
            n(
              'sprint',
              250,
              330,
              'Sprint Planning',
              'amber',
              '2 sem — estimación pobre, meetings 3h ⚠️'
            ),
            n('dev-php', 150, 440, 'PHP Backend', 'green', 'Symfony + unit tests ✅'),
            n('dev-js', 350, 440, 'Frontend JS', 'amber', 'Angular/Nuxt — tests débiles ⚠️'),
            n('phpstan', 50, 540, 'PHPStan', 'green', 'CI integrado ✅'),
            n('code-review', 250, 540, 'Code Review', 'amber', 'Variable según reviewer ⚠️'),
            n(
              'cypress',
              450,
              540,
              'Cypress E2E',
              'red',
              'Repo separado — Sheila "ratos libres" ❌'
            ),
            n('merge', 250, 640, 'Merge Main', 'red', 'Sin DoD formal ❌'),
            n(
              'bridge-risk',
              450,
              640,
              'Bridge Risk',
              'red',
              'Sin verificar — roturas silenciosas ❌'
            ),
            n('deploy', 250, 740, 'Deploy Prod', 'blue', 'GitLab + DevOps 🔧'),
          ]
        : [
            // Other clients: Formal process
            n(
              'business',
              250,
              0,
              'Business / Liderazgo',
              getPhaseColor(1),
              'Requisitos Alto Nivel'
            ),
            n('rnd', 50, 110, 'R&D Analiza', getPhaseColor(2), 'PRD Técnico · Viabilidad'),
            n('po', 450, 110, 'Product Owners', getPhaseColor(2), 'PRD Funcional'),
            n(
              'rf',
              250,
              230,
              'Requisitos Funcionales (RF)',
              getPhaseColor(3),
              'Especificaciones detalladas'
            ),
            n('us', 250, 340, 'User Stories', getPhaseColor(4), 'Unidades de valor'),
            n('jira', 250, 440, `Tickets ${trackingTool}`, getPhaseColor(4), 'Backlog priorizado'),
            n(
              'sprint',
              250,
              540,
              'Sprint Planning',
              getPhaseColor(4),
              '2 semanas · Estimación en horas'
            ),
            n('dev', 250, 640, 'Desarrollo', getPhaseColor(5), 'Feature branches · PR flow'),
            n('sast', 50, 760, 'SAST', getPhaseColor(7), 'Análisis estático'),
            n('sca', 250, 760, 'SCA', getPhaseColor(7), 'Dependencias'),
            n('dast', 450, 760, 'DAST', getPhaseColor(7), 'Análisis dinámico'),
            n('pentest', 650, 760, 'Pen Testing', getPhaseColor(7), 'Manual'),
            n('comite', 250, 880, 'Comité de Cambios', getPhaseColor(8), 'Gate de aprobación'),
            n('env-dev', 0, 990, 'Dev', getPhaseColor(8)),
            n('env-stg', 150, 990, 'Staging', getPhaseColor(8)),
            n('env-uat', 300, 990, 'UAT', getPhaseColor(8)),
            n('env-pre', 450, 990, 'Pre-prod', getPhaseColor(8)),
            n('env-prod', 600, 990, 'Prod', getPhaseColor(8)),
            n('qa', 250, 1100, 'QA BDD', getPhaseColor(6), `${testingTool} · Given/When/Then`),
            n(
              'scan',
              250,
              1200,
              'Scanning Automatizado',
              getPhaseColor(8),
              'Post-deploy · Monitoreo continuo'
            ),
          ];

  return (
    <div>
      <PageHeader
        title="Flujo General End-to-End"
        subtitle="Visión completa del ciclo de desarrollo de software, desde los requisitos de negocio hasta el despliegue en producción"
      />
      <Legend items={dynamicLegendItems} />
      <div className="mt-6">
        <DiagramCard>
          <h2 className="text-lg font-semibold text-slate-700 mb-4 text-center">
            Diagrama de Flujo General SDLC
          </h2>
          <FlowDiagram
            nodes={dynamicNodes}
            edges={dynamicEdges}
            height={1200}
            exportName={
              client?.name === 'Docline'
                ? 'Flujo Informal SDLC - Docline'
                : client?.name === 'Aramis'
                  ? 'Flujo AS-IS Aramis - Con Gaps Documentados'
                  : 'Flujo General End-to-End SDLC'
            }
          />
        </DiagramCard>
      </div>
    </div>
  );
}
