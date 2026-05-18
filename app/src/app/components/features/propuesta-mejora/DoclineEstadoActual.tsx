/**
 * DoclineEstadoActual Component
 *
 * Component showing Docline's current SDLC process status based on meeting transcript analysis.
 * Shows maturity score and implementation recommendations.
 */

import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';
import { SectionBox } from '@/app/components/shared/FlowComponents';

interface ProcessStatus {
  readonly phase: string;
  readonly status: 'FUNCIONANDO' | 'PARCIAL' | 'ROTO' | 'AUSENTE';
  readonly description: string;
  readonly evidence?: string;
  readonly improvement: string;
}

const doclineProcesses: readonly ProcessStatus[] = [
  {
    phase: 'Phase 1: Originación',
    status: 'AUSENTE',
    description: 'No se menciona proceso de Business Case o stakeholder mapping',
    evidence: 'No evidencia en reunión',
    improvement: 'business-case + stakeholder-map + kickoff skills',
  },
  {
    phase: 'Phase 2: Discovery & PRD',
    status: 'ROTO',
    description: 'PRDs inconsistentes, falta estandarización',
    evidence: '"No siempre lo conseguimos más o menos detallado"',
    improvement: 'prd-funcional + prd-tecnico skills con templates',
  },
  {
    phase: 'Phase 3: Requisitos',
    status: 'ROTO',
    description: 'RFs mezclados en PRD, sin separación formal',
    evidence: '"Los requisitos funcionales son partes del prd"',
    improvement: 'generate-rf + generate-nfr skills con trazabilidad',
  },
  {
    phase: 'Phase 4: Sprint Planning',
    status: 'FUNCIONANDO',
    description: 'Ciclo establecido 2 semanas, refinamiento martes',
    evidence: '"Sprint de dos semanas", "martes refinamiento"',
    improvement: 'Formalizar DoD, user-stories skill',
  },
  {
    phase: 'Phase 5: Desarrollo',
    status: 'FUNCIONANDO',
    description: 'Teams organizados, Tech Leads, subtareas definidas',
    evidence: '"Dos figuras teli de front y teli de back"',
    improvement: 'Handoffs dev→QA, DoD enforcement',
  },
  {
    phase: 'Phase 6: QA',
    status: 'PARCIAL',
    description: 'QA presente pero reactivo, ad-hoc',
    evidence: '"A veces saltan problemas", "no siempre caemos en la cuenta"',
    improvement: 'test-plan + create-test-cases + bug-report skills',
  },
  {
    phase: 'Phase 7: Seguridad',
    status: 'AUSENTE',
    description: 'Existe equipo de seguridad, pero sin proceso/gates de seguridad formalizados',
    evidence: '"Tiene un equipo de seguridad", "la seguridad va entre fases"',
    improvement: 'security-checklist + vuln-assessment skills',
  },
  {
    phase: 'Phase 8: Despliegue',
    status: 'AUSENTE',
    description: 'Se menciona post-despliegue, pero sin proceso formal de deploy/change/rollback',
    evidence: '"Fase después de despliegue", monitoreo básico con Grafana y logs',
    improvement: 'change-request + rollback-plan + release-notes skills',
  },
];

const getStatusIcon = (status: ProcessStatus['status']) => {
  switch (status) {
    case 'FUNCIONANDO':
      return <CheckCircle2 className="text-green-600" size={20} />;
    case 'PARCIAL':
      return <AlertTriangle className="text-yellow-600" size={20} />;
    case 'ROTO':
      return <XCircle className="text-red-600" size={20} />;
    case 'AUSENTE':
      return <HelpCircle className="text-gray-600" size={20} />;
  }
};

const getStatusColor = (status: ProcessStatus['status']) => {
  switch (status) {
    case 'FUNCIONANDO':
      return 'bg-green-50 border-green-300';
    case 'PARCIAL':
      return 'bg-yellow-50 border-yellow-300';
    case 'ROTO':
      return 'bg-red-50 border-red-300';
    case 'AUSENTE':
      return 'bg-gray-50 border-gray-300';
  }
};

export function DoclineEstadoActual() {
  const funcionando = doclineProcesses.filter((p) => p.status === 'FUNCIONANDO').length;
  const parcial = doclineProcesses.filter((p) => p.status === 'PARCIAL').length;
  const roto = doclineProcesses.filter((p) => p.status === 'ROTO').length;
  const ausente = doclineProcesses.filter((p) => p.status === 'AUSENTE').length;

  return (
    <div className="space-y-6">
      {/* Executive Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle2 className="text-green-600" size={20} />
            <span className="font-semibold text-green-800">FUNCIONANDO</span>
          </div>
          <div className="text-2xl font-bold text-green-700">{funcionando}</div>
          <div className="text-sm text-green-600">Base sólida existente</div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="text-yellow-600" size={20} />
            <span className="font-semibold text-yellow-800">PARCIAL</span>
          </div>
          <div className="text-2xl font-bold text-yellow-700">{parcial}</div>
          <div className="text-sm text-yellow-600">Necesita mejoras</div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center space-x-2 mb-2">
            <XCircle className="text-red-600" size={20} />
            <span className="font-semibold text-red-800">ROTO</span>
          </div>
          <div className="text-2xl font-bold text-red-700">{roto}</div>
          <div className="text-sm text-red-600">Requiere refactoring</div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <HelpCircle className="text-gray-600" size={20} />
            <span className="font-semibold text-gray-800">AUSENTE</span>
          </div>
          <div className="text-2xl font-bold text-gray-700">{ausente}</div>
          <div className="text-sm text-gray-600">Implementar desde cero</div>
        </div>
      </div>

      {/* Process Status Analysis */}
      <SectionBox
        title="Estado Actual por Fase SDLC"
        subtitle="Basado en reunión 2026-04-06"
        icon={<span>📊</span>}
        bgColor="bg-blue-50"
        borderColor="border-blue-200"
      >
        <div className="space-y-4">
          {doclineProcesses.map((process, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-all hover:shadow-md ${getStatusColor(process.status)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {getStatusIcon(process.status)}
                    <h4 className="font-semibold text-gray-900">{process.phase}</h4>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        process.status === 'FUNCIONANDO'
                          ? 'bg-green-200 text-green-800'
                          : process.status === 'PARCIAL'
                            ? 'bg-yellow-200 text-yellow-800'
                            : process.status === 'ROTO'
                              ? 'bg-red-200 text-red-800'
                              : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {process.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{process.description}</p>
                  {process.evidence && (
                    <p className="text-xs text-gray-600 italic mb-2">
                      📝 Evidencia: {process.evidence}
                    </p>
                  )}
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-sm text-blue-700">
                  <span className="font-medium text-blue-800">Implementación LIDR:</span>{' '}
                  {process.improvement}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionBox>

      {/* Maturity Score */}
      <SectionBox
        title="Overall Maturity Score"
        icon={<span>🎯</span>}
        bgColor="bg-orange-50"
        borderColor="border-orange-200"
      >
        <div className="text-center">
          <div className="text-4xl font-bold text-orange-700 mb-2">23/100</div>
          <div className="text-lg text-orange-600 mb-4">Needs Significant Improvement</div>
          <div className="text-sm text-gray-600">
            2 de 8 fases funcionando completamente • 2 parciales • 2 rotas • 2 ausentes
          </div>
        </div>
      </SectionBox>
    </div>
  );
}
