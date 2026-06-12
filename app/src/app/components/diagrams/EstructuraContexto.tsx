import { memo } from 'react';
import { FolderTree, Workflow, RefreshCw, Layers, GitBranch, Target, BookOpen } from 'lucide-react';
import { DiagramCard, PageHeader, SectionBox } from '@/app/components/shared/FlowComponents';
import { DiagramRenderer } from '@/app/components/shared/DiagramRenderer';

function EstructuraContextoComponent() {
  return (
    <div>
      <PageHeader
        title="Estructura de Contexto & Specs"
        subtitle="Propuesta LIDR de carpetas del repo (alineada con las rutas reales de BMad). Distingue project-context.md (archivo único global de reglas para la IA, bmad-generate-project-context) de docs/index.md (índice maestro que apunta a los deep-dives por funcionalidad, bmad-document-project). Más: analisis/ (Fase 1 por área), PRDs/ (planning-artifacts: 1 PRD por funcionalidad UJ+RF+NFR → épicas → stories/retro en implementation-artifacts) y arquitecture/."
      />

      <div className="mt-6 space-y-6">
        <DiagramCard>
          <SectionBox
            title="Glosario de siglas"
            borderColor="border-slate-200"
            bgColor="bg-slate-50"
            icon={<BookOpen className="text-slate-600" size={20} />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-600">
              {(
                [
                  ['PRD', 'Product Requirement Document (requisitos de producto)'],
                  ['PRFAQ', 'Press Release + FAQ (formato “Working Backwards”)'],
                  ['ADR', 'Architecture Decision Record (decisión arquitectónica)'],
                  ['UJ', 'User Journey (recorrido del usuario)'],
                  ['RF', 'Requisito Funcional'],
                  ['NFR', 'Non-Functional Requirement (requisito no funcional)'],
                  ['AC', 'Acceptance Criteria (criterios de aceptación)'],
                  ['TEA', 'Test Architect (módulo de pruebas de BMad · persona “Murat”)'],
                  ['ATDD', 'Acceptance Test-Driven Development'],
                  ['DTC', 'Docs Travel with Code (la doc viaja con el código)'],
                  ['CI', 'Continuous Integration (integración continua)'],
                  ['PR', 'Pull Request'],
                  ['KPI', 'Key Performance Indicator (indicador clave)'],
                  ['DoD', 'Definition of Done (definición de terminado)'],
                  ['SAST', 'Static Application Security Testing'],
                  ['SCA', 'Software Composition Analysis'],
                  ['CR', 'Change Request (solicitud de cambio)'],
                  ['P1', 'Prioridad 1 (riesgo/severidad alta)'],
                  [
                    'IA',
                    'Arquitectura de Información (UX) / Inteligencia Artificial (según contexto)',
                  ],
                  [
                    'BMad',
                    'el método/motor que genera los artefactos (PRD, arquitectura, stories…)',
                  ],
                ] as const
              ).map(([sigla, def]) => (
                <div key={sigla} className="flex gap-1.5">
                  <span className="font-semibold text-slate-800 whitespace-nowrap">{sigla}</span>
                  <span className="text-slate-400">—</span>
                  <span>{def}</span>
                </div>
              ))}
            </div>
          </SectionBox>
        </DiagramCard>

        <DiagramCard>
          <h2 className="text-lg font-semibold text-slate-700 mb-4 text-center">
            Árbol de carpetas: root/ → docs/ (index.md → deep-dives) · _bmad-output/ → analisis ·
            project-context.md · PRDs · arquitecture
          </h2>

          <DiagramRenderer
            diagramId="estructura-contexto"
            showLegend={true}
            showMetadata={false}
            height={900}
            onError={(error) => console.error('EstructuraContexto diagram error:', error)}
          />
        </DiagramCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DiagramCard>
            <SectionBox
              title="Árbol de carpetas del repo"
              borderColor="border-slate-200"
              bgColor="bg-slate-50"
              icon={<FolderTree className="text-slate-600" size={20} />}
            >
              <div className="text-sm text-slate-600 space-y-2">
                <p>
                  El <code className="text-xs bg-white px-1 rounded">root/</code> mantiene dos
                  carpetas:
                </p>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>
                    <code className="text-xs bg-white px-1 rounded">docs/</code> (
                    <code className="text-xs bg-white px-1 rounded">project_knowledge</code>) →{' '}
                    <code className="text-xs bg-white px-1 rounded">index.md</code>, el{' '}
                    <span className="font-medium">índice derivado</span> (este es el “project
                    context” que querías): se <span className="font-medium">alimenta</span> del
                    frontmatter + tags de PRDs, ADRs, research y deep-dives y se regenera — no se
                    edita a mano. Apunta a un{' '}
                    <span className="text-sky-700 font-medium">deep-dive por funcionalidad</span>{' '}
                    (las que se van profundizando), más los{' '}
                    <code className="text-xs bg-white px-1 rounded">adr</code>. Es el mapa que la IA
                    lee primero para cargar selectivamente.
                  </li>
                  <li>
                    <code className="text-xs bg-white px-1 rounded">_bmad-output/</code> (
                    <code className="text-xs bg-white px-1 rounded">output_folder</code>) → cuatro
                    entradas al mismo nivel:
                    <ul className="space-y-1 ml-4 mt-1 list-[circle]">
                      <li>
                        <code className="text-xs bg-white px-1 rounded">analisis/</code> —{' '}
                        <span className="text-slate-700 font-medium">Fase 1</span>, una carpeta por
                        área.{' '}
                        <span className="text-slate-700 font-medium">Iniciativa Whatsapp</span> va
                        de ejemplo: Brainstorming (
                        <code className="text-xs bg-white px-1 rounded">brainstorming/</code>),
                        Market &amp; Technical research (
                        <code className="text-xs bg-white px-1 rounded">
                          planning-artifacts/research/
                        </code>
                        ), Product brief y PRFAQ (
                        <code className="text-xs bg-white px-1 rounded">planning-artifacts/</code>).
                      </li>
                      <li>
                        <code className="text-xs bg-white px-1 rounded">project-context.md</code> —{' '}
                        <span className="font-medium">archivo único</span> con las reglas globales
                        para la IA (stack, patrones, convenciones). No es por funcionalidad ni un
                        índice.
                      </li>
                      <li>
                        <code className="text-xs bg-white px-1 rounded">PRDs/</code> —{' '}
                        <span className="text-indigo-700 font-medium">planning-artifacts/</span>: 1
                        PRD por funcionalidad (cada funcionalidad = un producto) que extiende UJ +
                        RF + NFR → épicas. Stories y retros en{' '}
                        <span className="font-medium">implementation-artifacts/</span>.
                      </li>
                      <li>
                        <code className="text-xs bg-white px-1 rounded">architecture.md</code> —{' '}
                        <span className="font-medium">1 centralizado / system-wide</span> que reusan
                        TODOS los PRDs (se fragmenta en{' '}
                        <code className="text-xs bg-white px-1 rounded">architecture/</code> con
                        index + secciones al crecer).
                      </li>
                      <li>
                        <code className="text-xs bg-white px-1 rounded">ux-designs/</code> —{' '}
                        <code className="text-xs bg-white px-1 rounded">DESIGN.md</code> (design
                        system · tokens, <span className="font-medium">compartido</span>) +{' '}
                        <code className="text-xs bg-white px-1 rounded">EXPERIENCE.md</code>{' '}
                        (flujos, <span className="font-medium">por feature</span>).
                      </li>
                    </ul>
                  </li>
                </ul>
                <p className="text-xs text-slate-500">
                  Dos herramientas distintas (verificado en{' '}
                  <code className="bg-white px-1 rounded">config.toml</code> + SKILL.md):{' '}
                  <code className="bg-white px-1 rounded">bmad-generate-project-context</code> →{' '}
                  <code className="bg-white px-1 rounded">_bmad-output/project-context.md</code> (1
                  archivo global);{' '}
                  <code className="bg-white px-1 rounded">bmad-document-project</code> →{' '}
                  <code className="bg-white px-1 rounded">docs/index.md</code> + un deep-dive por
                  feature/módulo (el “global, luego profundizar en una funcionalidad” → índice).
                </p>
              </div>
            </SectionBox>
          </DiagramCard>

          <DiagramCard>
            <SectionBox
              title="PRD por funcionalidad"
              borderColor="border-indigo-200"
              bgColor="bg-indigo-50"
              icon={<Workflow className="text-indigo-600" size={20} />}
            >
              <ol className="space-y-2 text-sm text-slate-600 list-none">
                <li>
                  <span className="text-indigo-500 font-medium mr-1">1.</span>
                  El análisis de cada iniciativa decide <span className="font-medium">
                    qué PRD
                  </span>{' '}
                  se crea o actualiza.
                </li>
                <li>
                  <span className="text-indigo-500 font-medium mr-1">2.</span>
                  Cada <code className="text-xs bg-slate-100 px-1 rounded">PRD</code> = una
                  funcionalidad tratada como producto (Whatsapp, Correos, Módulo preview, Otro…).
                </li>
                <li>
                  <span className="text-indigo-500 font-medium mr-1">3.</span>
                  Dentro del PRD se extienden <span className="font-medium">
                    UJ + RF + NFR
                  </span>{' '}
                  (venta / compra) y se crean y expanden{' '}
                  <span className="text-violet-700 font-medium">épicas</span>.
                </li>
                <li>
                  <span className="text-indigo-500 font-medium mr-1">4.</span>
                  Cada épica genera <span className="text-green-700 font-medium">stories</span> y
                  una <span className="text-amber-700 font-medium">retro</span>{' '}
                  (implementation-artifacts/). Al profundizar una funcionalidad, su deep-dive entra
                  en <code className="text-xs bg-slate-100 px-1 rounded">docs/index.md</code>.
                </li>
                <li>
                  <span className="text-indigo-500 font-medium mr-1">5.</span>
                  Las épicas de cada PRD reusan el mismo{' '}
                  <code className="text-xs bg-slate-100 px-1 rounded">architecture.md</code>{' '}
                  (centralizado) y el design system de UX (
                  <code className="text-xs bg-slate-100 px-1 rounded">DESIGN.md</code>, compartido);
                  solo la experiencia (
                  <code className="text-xs bg-slate-100 px-1 rounded">EXPERIENCE.md</code>) es por
                  feature.
                </li>
              </ol>
            </SectionBox>
          </DiagramCard>
        </div>

        <DiagramCard>
          <SectionBox
            title="¿Extender un PRD o crear uno nuevo?"
            borderColor="border-indigo-200"
            bgColor="bg-indigo-50"
            icon={<GitBranch className="text-indigo-600" size={20} />}
          >
            <div className="text-sm text-slate-600 space-y-2">
              <p>
                Regla: la pregunta no es “¿extiendo o creo?” sino{' '}
                <span className="font-medium">
                  ¿es la misma funcionalidad evolucionando, o una funcionalidad nueva?
                </span>{' '}
                Un PRD nunca está “terminado”: es <span className="font-medium">spec viva</span>{' '}
                (“estable v1”, no cerrado).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-md border border-green-200 bg-green-50 p-3">
                  <div className="font-semibold text-green-800 mb-1">Extender (por defecto)</div>
                  <ul className="space-y-1 ml-4 list-disc text-green-700">
                    <li>
                      Mismo User Journey / actor-objetivo (p. ej. otra plantilla en PRD Whatsapp).
                    </li>
                    <li>Comparte modelo de dominio, NFR y ciclo de release.</li>
                    <li>El PO lo ve como “la misma feature creciendo”.</li>
                  </ul>
                  <div className="text-xs text-green-700 mt-1">
                    → se añade un <span className="font-medium">epic nuevo</span> al mismo PRD.
                  </div>
                </div>
                <div className="rounded-md border border-cyan-200 bg-cyan-50 p-3">
                  <div className="font-semibold text-cyan-800 mb-1">Crear nuevo</div>
                  <ul className="space-y-1 ml-4 list-disc text-cyan-700">
                    <li>Otro UJ / objetivo / dueño / ciclo de release.</li>
                    <li>O si extender vuelve el PRD im-cargable por la IA (revienta contexto).</li>
                    <li>Funcionalidad genuinamente distinta = un producto nuevo (tu modelo).</li>
                  </ul>
                  <div className="text-xs text-cyan-700 mt-1">
                    → un PRD nuevo por funcionalidad.
                  </div>
                </div>
              </div>
              <p>
                Extender es seguro con 3 disciplinas: <span className="font-medium">(1)</span>{' '}
                crecer por epics + versionar (v1 → v1.1) y registrar en changelog/decision-log;{' '}
                <span className="font-medium">(2)</span> mover el detalle pesado a{' '}
                <code className="text-xs bg-white px-1 rounded">docs/</code> deep-dives e indexarlo
                (el PRD queda lean); <span className="font-medium">(3)</span> marcar lo nuevo con{' '}
                <code className="text-xs bg-white px-1 rounded">status</code> en frontmatter.
              </p>
              <p className="text-xs text-slate-500">
                BMad lo respalda: <code className="bg-white px-1 rounded">bmad-prd</code> tiene
                intent <span className="font-medium">Update</span> (reconcilia el PRD, lee el{' '}
                <code className="bg-white px-1 rounded">.decision-log.md</code> y avisa de
                conflictos antes de aplicar) además de <span className="font-medium">Create</span>.
                Evita los dos extremos: PRD-todo-en-uno (revienta contexto) y PRD-por-cada-cambio
                (fragmentación).
              </p>
            </div>
          </SectionBox>
        </DiagramCard>

        <DiagramCard>
          <SectionBox
            title="Loop de mejora continua (PRD-céntrico)"
            borderColor="border-amber-200"
            bgColor="bg-amber-50"
            icon={<RefreshCw className="text-amber-600" size={20} />}
          >
            <div className="text-sm text-slate-600 space-y-2">
              <p className="flex items-start gap-2">
                <RefreshCw className="mt-0.5 flex-shrink-0 text-amber-600" size={16} />
                <span>
                  El ciclo BMad:{' '}
                  <span className="font-medium">
                    analisis → PRD (planning) → épicas/stories (implementation) → retro → monitoring
                    (KPIs de la feature)
                  </span>
                  ; el monitoring genera <span className="font-medium">reportes</span> y{' '}
                  <span className="font-medium">mejoras</span>, y las mejoras{' '}
                  <span className="font-medium">alimentan el PRD</span> (siguiente ciclo).
                </span>
              </p>
              <p>
                Para evitar el problema de “actualizar PRD + docs + contexto a la vez”, el retro{' '}
                <span className="font-medium">no</span> reescribe todo: actualiza una fuente de
                verdad y propaga condicionalmente (regla DTC — Docs Travel with Code):
              </p>
              <ul className="space-y-1 ml-4 list-disc">
                <li>
                  <span className="font-medium">Siempre</span> → el{' '}
                  <code className="text-xs bg-white px-1 rounded">PRD</code> de la funcionalidad
                  (spec viva) y su backlog (épicas/stories del próximo ciclo).
                </li>
                <li>
                  <span className="font-medium">Solo si se profundizó una funcionalidad</span> → su
                  deep-dive en <code className="text-xs bg-white px-1 rounded">docs/</code> y la
                  entrada en <code className="text-xs bg-white px-1 rounded">docs/index.md</code>.
                </li>
                <li>
                  <span className="font-medium">Solo si cambió una decisión</span> →{' '}
                  <code className="text-xs bg-white px-1 rounded">adr</code>;{' '}
                  <span className="font-medium">solo si cambian reglas globales de la IA</span> →{' '}
                  <code className="text-xs bg-white px-1 rounded">project-context.md</code> (raro).
                </li>
              </ul>
              <p className="text-xs text-slate-500">
                Clave: <code className="bg-white px-1 rounded">project-context.md</code> son reglas
                globales (cambia poco) y{' '}
                <code className="bg-white px-1 rounded">docs/index.md</code> es el índice de
                deep-dives. Así nunca actualizas tres specs a la vez: editas el PRD, y el resto se
                toca solo cuando aplica.
              </p>
            </div>
          </SectionBox>
        </DiagramCard>

        <DiagramCard>
          <SectionBox
            title="rules/ vs project-context.md — ¿por qué no las convenciones en rules?"
            borderColor="border-slate-200"
            bgColor="bg-slate-50"
            icon={<Layers className="text-slate-600" size={20} />}
          >
            <div className="text-sm text-slate-600 space-y-2">
              <p>
                Son dos mecanismos distintos y <span className="font-medium">se complementan</span>;
                conviene no duplicar:
              </p>
              <ul className="space-y-1 ml-4 list-disc">
                <li>
                  <code className="text-xs bg-white px-1 rounded">rules/</code> (
                  <code className="text-xs bg-white px-1 rounded">.agents/rules</code>) →
                  convenciones <span className="font-medium">genéricas / de org + stack</span>{' '}
                  (TypeScript strict, conventional commits, estilo). Las carga la{' '}
                  <span className="font-medium">plataforma</span> (Claude/Cursor) en cada sesión,
                  aplican a <span className="font-medium">todos</span> los proyectos y se versionan
                  una sola vez. Cambian muy poco.
                </li>
                <li>
                  <code className="text-xs bg-white px-1 rounded">project-context.md</code> → reglas{' '}
                  <span className="font-medium">específicas de ESTE repo</span> y poco obvias (“el
                  auth vive en X”, “no llames Y directo”, “este módulo tiene la rareza Z”). Lo
                  genera{' '}
                  <code className="text-xs bg-white px-1 rounded">
                    bmad-generate-project-context
                  </code>{' '}
                  escaneando el código y BMad lo{' '}
                  <span className="font-medium">auto-carga al inicio de cada workflow</span>{' '}
                  (persistent_facts).
                </li>
              </ul>
              <p>
                Es decir:{' '}
                <span className="font-medium">rules = lo que vale en cualquier proyecto</span>;{' '}
                <span className="font-medium">
                  project-context.md = lo que solo vale en este repo
                </span>
                . Poner las convenciones de repo en rules las haría genéricas (y al revés, meter
                gotchas del repo en rules ensucia las reglas compartidas de todos los clientes).
              </p>
            </div>
          </SectionBox>
        </DiagramCard>

        <DiagramCard>
          <h2 className="text-lg font-semibold text-slate-700 mb-4 text-center">
            Ciclo de mantenimiento: qué se lee/actualiza y cada cuánto
          </h2>

          <DiagramRenderer
            diagramId="estructura-contexto-ciclo"
            showLegend={true}
            showMetadata={false}
            height={900}
            onError={(error) => console.error('EstructuraContexto ciclo diagram error:', error)}
          />
        </DiagramCard>

        <DiagramCard>
          <h2 className="text-lg font-semibold text-slate-700 mb-4 text-center">
            Flujo de ramas, PRs y release: 1 feature = 1 rama + 1 PR; el release genera el changelog
          </h2>

          <DiagramRenderer
            diagramId="estructura-contexto-git"
            showLegend={true}
            showMetadata={false}
            height={460}
            onError={(error) => console.error('EstructuraContexto git diagram error:', error)}
          />
        </DiagramCard>

        <DiagramCard>
          <h2 className="text-lg font-semibold text-slate-700 mb-4 text-center">
            La capa de verdad (TEA): el AC se vuelve test rojo → verde → trazado → gate
          </h2>

          <DiagramRenderer
            diagramId="estructura-contexto-verdad"
            showLegend={true}
            showMetadata={false}
            height={560}
            onError={(error) => console.error('EstructuraContexto verdad diagram error:', error)}
          />
        </DiagramCard>

        <DiagramCard>
          <SectionBox
            title="¿Dónde vive la verdad?"
            borderColor="border-emerald-200"
            bgColor="bg-emerald-50"
            icon={<Target className="text-emerald-600" size={20} />}
          >
            <div className="text-sm text-slate-600 space-y-3">
              <p>
                El centro de la verdad no es un documento: es el código vuelto{' '}
                <span className="font-medium">legible</span> por los docs derivados y vuelto{' '}
                <span className="font-medium">verificable</span> por la matriz de trazabilidad + el
                gate. El PRD aporta el AC; en cuanto el AC es test trazado, el PRD cumplió su
                función.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="border border-slate-200 px-2 py-1.5 text-left font-semibold">
                        Dimensión
                      </th>
                      <th className="border border-slate-200 px-2 py-1.5 text-left font-semibold">
                        Qué es
                      </th>
                      <th className="border border-slate-200 px-2 py-1.5 text-left font-semibold">
                        Vive en
                      </th>
                      <th className="border border-slate-200 px-2 py-1.5 text-left font-semibold">
                        Skills BMad
                      </th>
                    </tr>
                  </thead>
                  <tbody className="align-top">
                    <tr>
                      <td className="border border-slate-200 px-2 py-1.5 font-medium text-cyan-700">
                        Qué DEBE hacer (intención)
                      </td>
                      <td className="border border-slate-200 px-2 py-1.5">
                        AC / UJ → se vuelven tests
                      </td>
                      <td className="border border-slate-200 px-2 py-1.5">
                        <code className="bg-white px-1 rounded">prds/</code> (delta, se archiva) →
                        tests
                      </td>
                      <td className="border border-slate-200 px-2 py-1.5">
                        <code className="bg-white px-1 rounded">bmad-prd</code> ·{' '}
                        <code className="bg-white px-1 rounded">bmad-testarch-atdd</code>
                      </td>
                    </tr>
                    <tr className="bg-emerald-50/60">
                      <td className="border border-slate-200 px-2 py-1.5 font-medium text-emerald-700">
                        Qué HACE de verdad (presente)
                      </td>
                      <td className="border border-slate-200 px-2 py-1.5">
                        suite de tests + matriz + gate + deep-dives
                      </td>
                      <td className="border border-slate-200 px-2 py-1.5">
                        <code className="bg-white px-1 rounded">test-artifacts/</code> +{' '}
                        <code className="bg-white px-1 rounded">docs/</code> + código
                      </td>
                      <td className="border border-slate-200 px-2 py-1.5">
                        <code className="bg-white px-1 rounded">bmad-testarch-trace</code> ·{' '}
                        <code className="bg-white px-1 rounded">-test-design</code> ·{' '}
                        <code className="bg-white px-1 rounded">-automate</code> ·{' '}
                        <code className="bg-white px-1 rounded">-nfr</code> ·{' '}
                        <code className="bg-white px-1 rounded">bmad-document-project</code>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-200 px-2 py-1.5 font-medium text-orange-700">
                        Por qué (pasado)
                      </td>
                      <td className="border border-slate-200 px-2 py-1.5">decisiones</td>
                      <td className="border border-slate-200 px-2 py-1.5">
                        <code className="bg-white px-1 rounded">.decision-log.md</code> +{' '}
                        <code className="bg-white px-1 rounded">adr/</code>
                      </td>
                      <td className="border border-slate-200 px-2 py-1.5">
                        <code className="bg-white px-1 rounded">bmad-prd</code> (decision-log) ·{' '}
                        <code className="bg-white px-1 rounded">lidr-adr</code>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-200 px-2 py-1.5 font-medium text-slate-700">
                        Cómo construir (reglas)
                      </td>
                      <td className="border border-slate-200 px-2 py-1.5">reglas globales</td>
                      <td className="border border-slate-200 px-2 py-1.5">
                        <code className="bg-white px-1 rounded">project-context.md</code> +{' '}
                        <code className="bg-white px-1 rounded">rules/</code>
                      </td>
                      <td className="border border-slate-200 px-2 py-1.5">
                        <code className="bg-white px-1 rounded">bmad-generate-project-context</code>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-200 px-2 py-1.5 font-medium text-sky-700">
                        Puerta única
                      </td>
                      <td className="border border-slate-200 px-2 py-1.5">índice navegable</td>
                      <td className="border border-slate-200 px-2 py-1.5">
                        <code className="bg-white px-1 rounded">docs/index.md</code>
                      </td>
                      <td className="border border-slate-200 px-2 py-1.5">
                        <code className="bg-white px-1 rounded">bmad-document-project</code>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500">
                Corrección clave: <code className="bg-white px-1 rounded">PRDs/</code> dejó de ser
                el centro de la verdad — es la capa de{' '}
                <span className="font-medium">intake/cambio</span> (run-folder,{' '}
                <code className="bg-white px-1 rounded">status:final</code> → se archiva, se hornea
                en las stories). Lo durable de un PRD son sus AC, que se gradúan a tests.
              </p>
            </div>
          </SectionBox>
        </DiagramCard>

        <DiagramCard>
          <h2 className="text-lg font-semibold text-slate-700 mb-4 text-center">
            El hilo de trazabilidad: cada salto con su llave de enlace (el eslabón débil, en rojo)
          </h2>

          <DiagramRenderer
            diagramId="estructura-contexto-trazabilidad"
            showLegend={true}
            showMetadata={false}
            height={520}
            onError={(error) =>
              console.error('EstructuraContexto trazabilidad diagram error:', error)
            }
          />
        </DiagramCard>

        <DiagramCard>
          <SectionBox
            title="¿Tenemos trazabilidad de todo?"
            borderColor="border-cyan-200"
            bgColor="bg-cyan-50"
            icon={<GitBranch className="text-cyan-600" size={20} />}
          >
            <div className="text-sm text-slate-600 space-y-2">
              <p>
                <span className="font-medium">Del eje principal, sí</span> — y hay{' '}
                <span className="font-medium">dos matrices dedicadas</span> que lo materializan: la{' '}
                <span className="font-medium">RTM</span> (requisitos → épicas/stories,{' '}
                <code className="text-xs bg-white px-1 rounded">lidr-validate-requirements</code>) y
                la <span className="font-medium">matriz de tests + gate</span> (criterios de
                aceptación ↔ test,{' '}
                <code className="text-xs bg-white px-1 rounded">bmad-testarch-trace</code>
                ).
              </p>
              <p>
                Para que sea <span className="font-medium">de todo</span> hay que enforzar, no solo
                dibujar:
              </p>
              <ul className="space-y-1 ml-4 list-disc">
                <li>
                  <span className="font-medium">Identificadores estables</span> en frontmatter (
                  RF-NN · UJ-N · EPIC-N · STORY-N · ADR-NNNN · ticket). Sin identificadores no hay
                  hilo.
                </li>
                <li>
                  <span className="font-medium">Referencias cruzadas obligatorias</span> (PR →
                  ticket + change; story → requisito). LIDR ya trae los enforcers: Docs Travel with
                  Code, hook{' '}
                  <code className="text-xs bg-white px-1 rounded">frontmatter-guard</code>, Gate 4
                  (Definition of Done).
                </li>
                <li>
                  <span className="font-medium">Matrices vivas</span>: correr la matriz de tests por
                  cambio/gate y la RTM en los gates de Solutioning.
                </li>
                <li>
                  <span className="text-red-600 font-medium">Eslabón débil (rojo):</span> el
                  feedback Mejora → PRD-delta no lleva identificador. Es el único hueco real —
                  recomendado formalizar.
                </li>
              </ul>
              <p className="text-xs text-slate-500">
                Veredicto: trazabilidad end-to-end del eje (necesidad → requisito → story → código →
                test → release) con las dos matrices; el 100% se cierra formalizando el feedback y
                respetando identificadores + referencias.
              </p>
            </div>
          </SectionBox>
        </DiagramCard>
      </div>
    </div>
  );
}

export const EstructuraContexto = memo(EstructuraContextoComponent);
