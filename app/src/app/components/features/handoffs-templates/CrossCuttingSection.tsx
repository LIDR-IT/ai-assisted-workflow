/**
 * @file CrossCuttingSection Component
 * @description Cross-cutting AI artifacts that support the entire SDLC
 */

import { Brain } from 'lucide-react';
import type { CrossCuttingArtifact } from '@/data/features/handoffsTemplates';

interface CrossCuttingSectionProps {
  artifacts: CrossCuttingArtifact[];
}

export function CrossCuttingSection({ artifacts }: CrossCuttingSectionProps) {
  return (
    <div className="bg-violet-50 border border-violet-200 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Brain className="text-violet-600" size={20} />
        <h3 className="text-lg font-semibold text-slate-800">
          Artefactos de IA Transversales Estructura .claude/
        </h3>
      </div>

      <p className="text-sm text-slate-600 mb-4">
        Estos artefactos no pertenecen a una fase específica sino que son la infraestructura IA
        compartida por todo el equipo.{' '}
        <code className="bg-violet-100 px-1 rounded text-violet-700">CLAUDE.md</code> los orquesta
        como índice central.
      </p>

      <div className="grid grid-cols-7 gap-3">
        {artifacts.map((artifact, index) => (
          <div key={index} className="bg-white rounded-lg p-3 border border-violet-100 text-center">
            <div className="text-lg font-semibold text-violet-700">{artifact.category}</div>
            <div className="text-xs font-medium text-slate-600 mt-1">{artifact.title}</div>
            <div className="text-xs text-slate-500 mt-1">{artifact.desc}</div>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500 mt-4">
        Inventario completo de rules, skills, commands, hooks y MCPs en{' '}
        <span className="font-semibold text-violet-600">Sitemap - Estructura .claude/</span>
      </p>
    </div>
  );
}
