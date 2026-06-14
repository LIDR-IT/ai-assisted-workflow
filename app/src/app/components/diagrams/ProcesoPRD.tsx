import { memo } from 'react';
import { Bot, ClipboardList, AlertTriangle, Lightbulb, FileText } from 'lucide-react';
import {
  DiagramCard,
  PageHeader,
  SectionBox,
  InfoTable,
} from '@/app/components/shared/FlowComponents';
import { DiagramRenderer } from '@/app/components/shared/DiagramRenderer';

function ProcesoPRDComponent() {
  return (
    <div>
      <PageHeader
        title="Proceso de PRD"
        subtitle="Product Requirements Document — Documento maestro que conecta las necesidades de negocio con la ejecución técnica"
      />
      <div className="mt-6 space-y-6">
        <DiagramCard>
          <h2 className="text-lg font-semibold text-slate-700 mb-4 text-center">
            Ciclo de Vida del PRD
          </h2>

          {/* JSON-driven diagram renderer */}
          <DiagramRenderer
            diagramId="proceso-prd"
            showLegend={true}
            showMetadata={false}
            height={780}
            exportName="Proceso_PRD_SDLC"
            onLoad={(data) => console.warn('ProcesoPRD diagram loaded:', data.metadata.title)}
            onError={(error) => console.error('ProcesoPRD diagram error:', error)}
          />
        </DiagramCard>

        {/* PRD Structure */}
        <DiagramCard>
          <SectionBox
            title="Estructura del PRD (scope funcional)"
            borderColor="border-cyan-200"
            bgColor="bg-cyan-50"
            icon={<FileText className="text-cyan-600" size={20} />}
          >
            <InfoTable
              rows={[
                {
                  label: 'Overview',
                  value: 'Visión general del producto, contexto de negocio, objetivos estratégicos',
                },
                { label: 'Alcance', value: 'Límites del proyecto, qué incluye y qué queda fuera' },
                { label: 'Funcionalidades', value: 'Lista de capacidades clave del producto' },
                { label: 'RFs', value: 'Especificaciones detalladas de cada funcionalidad' },
                { label: 'Roadmap', value: 'Cronograma de entregas, fases e hitos' },
                { label: 'Dependencias', value: 'Relaciones y dependencias entre RFs y módulos' },
              ]}
            />
          </SectionBox>
        </DiagramCard>

        {/* Hierarchy */}
        <DiagramCard>
          <SectionBox
            title="Relación Jerárquica: PRD → RF → User Story"
            borderColor="border-teal-200"
            bgColor="bg-teal-50"
            icon={<ClipboardList className="text-teal-600" size={20} />}
          >
            <div className="bg-white rounded-lg p-4 border border-teal-200 font-mono text-sm text-slate-700 overflow-x-auto">
              <div className="font-semibold text-teal-800">PRD (funcional)</div>
              <div className="ml-4 mt-2">
                <div className="text-blue-700">├── RF-360-001: Pantalla de Login Biométrico</div>
                <div className="ml-8 text-slate-500">├── US-001: Autenticación facial</div>
                <div className="ml-8 text-slate-500">├── US-002: Feedback de captura</div>
                <div className="ml-8 text-slate-500">└── US-003: Configurar umbral</div>
              </div>
              <div className="ml-4 mt-2">
                <div className="text-blue-700">├── RF-360-002: Dashboard de Administración</div>
                <div className="ml-8 text-slate-500">├── US-004: Métricas en tiempo real</div>
                <div className="ml-8 text-slate-500">└── US-005: Exportar reportes</div>
              </div>
              <div className="ml-4 mt-2">
                <div className="text-blue-700">└── RF-360-003: Gestión de Usuarios</div>
                <div className="ml-8 text-slate-500">├── US-006: Crear usuarios</div>
                <div className="ml-8 text-slate-500">├── US-007: Asignar roles</div>
                <div className="ml-8 text-slate-500">└── US-008: Desactivar usuarios</div>
              </div>
            </div>
          </SectionBox>
        </DiagramCard>

        {/* Tools and AI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DiagramCard>
            <SectionBox
              title="Herramientas"
              borderColor="border-violet-200"
              bgColor="bg-violet-50"
              icon={<Bot className="text-violet-600" size={20} />}
            >
              <div className="space-y-3">
                {[
                  {
                    name: 'Confluence',
                    desc: 'Plataforma principal de documentación. PRDs, RFs y playbooks centralizados.',
                  },
                  {
                    name: 'Robo (RoboFlow)',
                    desc: 'IA integrada con Confluence para generación asistida de RFs.',
                  },
                  {
                    name: 'ChatGPT',
                    desc: 'Herramienta complementaria para refinamiento de requisitos.',
                  },
                ].map((t) => (
                  <div key={t.name} className="bg-white rounded p-3 border border-violet-200">
                    <div className="font-semibold text-sm text-violet-800">{t.name}</div>
                    <div className="text-xs text-violet-600 mt-1">{t.desc}</div>
                  </div>
                ))}
              </div>
            </SectionBox>
          </DiagramCard>

          <DiagramCard>
            <SectionBox
              title="Inconsistencia IA & Solución"
              borderColor="border-amber-200"
              bgColor="bg-amber-50"
              icon={<AlertTriangle className="text-amber-600" size={20} />}
            >
              <div className="space-y-3">
                <div className="bg-red-50 rounded p-3 border border-red-200">
                  <div className="font-semibold text-sm text-red-800 flex items-center gap-1">
                    <AlertTriangle size={14} /> Problema
                  </div>
                  <div className="text-xs text-red-600 mt-1">
                    El mismo prompt produce resultados distintos entre personas (nivel de detalle,
                    estructura, terminología).
                  </div>
                </div>
                <div className="bg-green-50 rounded p-3 border border-green-200">
                  <div className="font-semibold text-sm text-green-800 flex items-center gap-1">
                    <Lightbulb size={14} /> Solución propuesta
                  </div>
                  <ul className="text-xs text-green-600 mt-1 space-y-1 list-disc ml-4">
                    <li>Prompts estandarizados con formato de salida fijo</li>
                    <li>Templates de output en los prompts</li>
                    <li>Documentar prompts en Confluence</li>
                    <li>Checklist de revisión post-generación</li>
                  </ul>
                </div>
              </div>
            </SectionBox>
          </DiagramCard>
        </div>
      </div>
    </div>
  );
}

// Memoize React Flow diagram component to prevent unnecessary re-renders
export const ProcesoPRD = memo(ProcesoPRDComponent);
