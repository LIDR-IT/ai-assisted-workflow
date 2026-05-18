/**
 * Handoff Types
 *
 * TypeScript interfaces for handoffs and templates data.
 * Extracted from HandoffsTemplates.tsx for better maintainability.
 */

export interface Template {
  code: string;
  name: string;
  desc: string;
  format: string;
  owner: string;
  mandatory: boolean;
  aiAssist?: 'skill' | 'rule' | 'command' | 'hook' | 'agent' | 'mcp';
  claudePath?: string;
}

export interface PhaseTemplates {
  fase: string;
  faseNum: number;
  color: string;
  borderColor: string;
  gate: string;
  /** Precondiciones de entrada (DoR) */
  dor: string[];
  /** Condiciones de salida unificadas (DoD + Criterios de Aceptacion fusionados) */
  exitCriteria: string[];
  /** Criterios especificos del Gate que no estan cubiertos por exitCriteria */
  gateSpecific?: string[];
  templates: Template[];
}
