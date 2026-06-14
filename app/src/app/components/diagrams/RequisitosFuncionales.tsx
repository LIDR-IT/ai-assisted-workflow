import { memo } from 'react';
import {
  ListChecks,
  GitBranch,
  CheckCircle2,
  AlertCircle,
  ArrowRightLeft,
  Bot,
} from 'lucide-react';
import { DiagramCard, PageHeader, SectionBox } from '@/app/components/shared/FlowComponents';
import { DiagramRenderer } from '@/app/components/shared/DiagramRenderer';

function RequisitosFuncionalesComponent() {
  return (
    <div>
      <PageHeader
        title="Requisitos Funcionales (RF)"
        subtitle="Estructura detallada de un Requisito Funcional — Especificación completa de cada funcionalidad del producto"
      />
      <div className="mt-6 space-y-6">
        <DiagramCard>
          <h2 className="text-lg font-semibold text-slate-700 mb-4 text-center">
            Estructura de un Requisito Funcional
          </h2>

          {/* JSON-driven diagram renderer */}
          <DiagramRenderer
            diagramId="requisitos-funcionales"
            showLegend={true}
            showMetadata={false}
            height={450}
            exportName="Estructura_Requisito_Funcional"
            onLoad={(data) =>
              console.warn('RequisitosFuncionales diagram loaded:', data.metadata.title)
            }
            onError={(error) => console.error('RequisitosFuncionales diagram error:', error)}
          />
        </DiagramCard>

        {/* Sections detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DiagramCard>
            <SectionBox
              title="1. Descripción"
              borderColor="border-green-200"
              bgColor="bg-green-50"
              icon={<ListChecks className="text-green-600" size={20} />}
            >
              <div className="space-y-2">
                {[
                  {
                    label: 'Objetivo de Negocio',
                    desc: 'Por qué existe el requisito, qué valor aporta',
                  },
                  {
                    label: 'Actores / Usuarios',
                    desc: 'Usuario final, Admin, Operador, APIs externas',
                  },
                  { label: 'Alcance', desc: 'Qué cubre este RF, dónde comienza otro RF' },
                  { label: 'Exclusiones', desc: 'Qué NO incluye esta versión del requisito' },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded p-3 border border-green-200">
                    <div className="font-semibold text-sm text-green-800">{item.label}</div>
                    <div className="text-xs text-green-600 mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
            </SectionBox>
          </DiagramCard>

          <DiagramCard>
            <SectionBox
              title="2. Comportamiento"
              borderColor="border-orange-200"
              bgColor="bg-orange-50"
              icon={<GitBranch className="text-orange-600" size={20} />}
            >
              <div className="space-y-2">
                {[
                  {
                    label: 'Flujo Principal (Happy Path)',
                    desc: 'Pantallas → Acciones → Respuestas → Transiciones',
                    color: 'border-emerald-200 bg-emerald-50 text-emerald-800',
                  },
                  {
                    label: 'Flujos Alternativos',
                    desc: 'Caminos válidos diferentes al principal',
                    color: 'border-blue-200 bg-blue-50 text-blue-800',
                  },
                  {
                    label: 'Flujos de Error',
                    desc: 'Validación, sistema, negocio + mensajes + recuperación',
                    color: 'border-red-200 bg-red-50 text-red-800',
                  },
                  {
                    label: 'Reglas de Negocio',
                    desc: 'Validaciones, permisos, límites, lógica condicional',
                    color: 'border-amber-200 bg-amber-50 text-amber-800',
                  },
                ].map((item, i) => (
                  <div key={i} className={`rounded p-3 border ${item.color}`}>
                    <div className="font-semibold text-sm">{item.label}</div>
                    <div className="text-xs mt-0.5 opacity-80">{item.desc}</div>
                  </div>
                ))}
              </div>
            </SectionBox>
          </DiagramCard>
        </div>

        {/* Acceptance Criteria */}
        <DiagramCard>
          <SectionBox
            title="3. Criterios de Aceptación"
            borderColor="border-violet-200"
            bgColor="bg-violet-50"
            icon={<CheckCircle2 className="text-violet-600" size={20} />}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="bg-white rounded p-3 border border-violet-200 text-center">
                <div className="font-semibold text-sm text-violet-800">Claridad</div>
                <div className="text-xs text-violet-600 mt-1">
                  Interpretación única, sin términos vagos
                </div>
              </div>
              <div className="bg-white rounded p-3 border border-violet-200 text-center">
                <div className="font-semibold text-sm text-violet-800">Madurez para QA</div>
                <div className="text-xs text-violet-600 mt-1">Generar test cases directamente</div>
              </div>
              <div className="bg-white rounded p-3 border border-violet-200 text-center">
                <div className="font-semibold text-sm text-violet-800">Formato BDD</div>
                <div className="text-xs text-violet-600 mt-1">Given / When / Then</div>
              </div>
            </div>
            <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
              <div className="text-slate-500"># Ejemplo BDD</div>
              <div className="mt-2">
                <span className="text-cyan-400">Escenario:</span> Autenticación de usuario exitosa
              </div>
              <div className="ml-2 text-yellow-300">Given</div>
              <div className="ml-4">el usuario tiene una cuenta activa en el sistema</div>
              <div className="ml-2 text-yellow-300">And</div>
              <div className="ml-4">el sistema de autenticación está operativo</div>
              <div className="ml-2 text-yellow-300">When</div>
              <div className="ml-4">el usuario selecciona "Iniciar Sesión"</div>
              <div className="ml-2 text-yellow-300">Then</div>
              <div className="ml-4">el sistema valida su identidad</div>
              <div className="ml-2 text-yellow-300">And</div>
              <div className="ml-4">el usuario es redirigido al dashboard</div>
            </div>
          </SectionBox>
        </DiagramCard>

        {/* Dependencies & AI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DiagramCard>
            <SectionBox
              title="4. Dependencias"
              borderColor="border-cyan-200"
              bgColor="bg-cyan-50"
              icon={<ArrowRightLeft className="text-cyan-600" size={20} />}
            >
              <div className="space-y-2">
                <div className="bg-white rounded p-3 border border-cyan-200">
                  <div className="font-semibold text-sm text-cyan-800">Depende de</div>
                  <div className="text-xs text-cyan-600">RFs que deben implementarse antes</div>
                </div>
                <div className="bg-white rounded p-3 border border-cyan-200">
                  <div className="font-semibold text-sm text-cyan-800">Es prerequisito de</div>
                  <div className="text-xs text-cyan-600">RFs que dependen de este</div>
                </div>
                <div className="bg-white rounded p-3 border border-cyan-200">
                  <div className="font-semibold text-sm text-cyan-800">Relacionado con</div>
                  <div className="text-xs text-cyan-600">
                    RFs con contexto compartido sin dependencia directa
                  </div>
                </div>
                <div className="bg-amber-50 rounded p-3 border border-amber-200 mt-3">
                  <div className="text-xs text-amber-700 flex items-start gap-1">
                    <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                    Las dependencias se mapean <strong>después</strong> de tener todos los RFs del
                    módulo completo
                  </div>
                </div>
              </div>
            </SectionBox>
          </DiagramCard>

          <DiagramCard>
            <SectionBox
              title="Generación con IA"
              borderColor="border-amber-200"
              bgColor="bg-amber-50"
              icon={<Bot className="text-amber-600" size={20} />}
            >
              <div className="space-y-2">
                {[
                  {
                    step: '1',
                    title: 'Preparación del Contexto',
                    desc: 'Pantallas, acciones, comportamiento deseado',
                  },
                  {
                    step: '2',
                    title: 'Solicitud Estructurada',
                    desc: 'Descripción + Comportamiento + Criterios',
                  },
                  {
                    step: '3',
                    title: 'Revisión de Coherencia',
                    desc: 'Interna, entre RFs, con la sección técnica del PRD',
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="bg-white rounded p-3 border border-amber-200 flex items-start gap-2"
                  >
                    <span className="bg-amber-200 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <div className="font-semibold text-sm text-slate-800">{item.title}</div>
                      <div className="text-xs text-slate-500">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionBox>
          </DiagramCard>
        </div>
      </div>
    </div>
  );
}

// Memoize React Flow diagram component to prevent unnecessary re-renders
export const RequisitosFuncionales = memo(RequisitosFuncionalesComponent);
