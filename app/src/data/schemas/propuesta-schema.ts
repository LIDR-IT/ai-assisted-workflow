/**
 * Propuesta Schema — Zod schemas for "Propuesta de Mejora" JSON content
 *
 * Three tabs, three JSONs per client:
 *   - diagnostico.json → executive summary + fortalezas/oportunidades/gaps + pain points
 *   - mejoras.json     → 8 SDLC phases with AS-IS vs TO-BE bullet lists
 *   - flujo.json       → React Flow diagram + Quality Gates summary
 *
 * Reuses DiagramDataSchema from diagram-schema.ts for the flujo diagram payload,
 * so existing DiagramRenderer can mount it without changes.
 */

import { z } from 'zod';
import { DiagramDataSchema } from './diagram-schema';

// ---------------------------------------------------------------------------
// Shared metadata
// ---------------------------------------------------------------------------

/** Standard metadata block for any propuesta JSON */
export const PropuestaMetadataSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'id must be lowercase alphanumeric with hyphens'),
  title: z.string().min(1),
  description: z.string().optional(),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'semver required (e.g., 1.0.0)'),
  client: z.string().min(1),
  industry: z.string().min(1),
  tags: z.array(z.string()).optional().default([]),
  lastUpdated: z.string().optional(),
  author: z.string().optional(),
  sourceReport: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Diagnóstico tab
// ---------------------------------------------------------------------------

export const ImpactLevelSchema = z.enum(['Crítico', 'Alto', 'Medio', 'Bajo']);

export const PainPointSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[A-Z]{2}-\d{2,}$/, 'pain point id must be like PP-01, PP-02')
    .optional(),
  fase: z.string().min(1),
  problema: z.string().min(1),
  impacto: ImpactLevelSchema,
  mejora: z.string().min(1),
  evidence: z.string().optional(),
});

export const DiagnosticoSummarySchema = z.object({
  executiveSummary: z.string().min(1),
  fortalezas: z.array(z.string().min(1)).min(1),
  oportunidades: z.array(z.string().min(1)).min(1),
  gapsCriticos: z.array(z.string().min(1)).min(1),
});

export const DiagnosticoSchema = z.object({
  metadata: PropuestaMetadataSchema,
  summary: DiagnosticoSummarySchema,
  painPoints: z.array(PainPointSchema).min(1),
});

// ---------------------------------------------------------------------------
// Mejoras por Fase tab
// ---------------------------------------------------------------------------

/** Single phase improvement (AS-IS vs TO-BE) */
export const MejoraFaseSchema = z.object({
  id: z.string().min(1),
  phaseNumber: z.number().int().min(0).max(8),
  gateNumber: z.number().int().min(0).max(7).optional(),
  title: z.string().min(1),
  border: z.string().min(1),
  bg: z.string().min(1),
  icon: z.string().nullable().optional(),
  actual: z.string().min(1),
  propuesta: z.array(z.string().min(1)).min(1),
});

export const MejorasSchema = z.object({
  metadata: PropuestaMetadataSchema,
  fases: z.array(MejoraFaseSchema).min(1),
});

// ---------------------------------------------------------------------------
// Flujo Obligatorio tab
// ---------------------------------------------------------------------------

export const QualityGateSchema = z.object({
  gate: z.string().min(1),
  name: z.string().min(1),
  criteria: z.string().min(1),
  owner: z.string().min(1),
});

export const FlujoSchema = z.object({
  metadata: PropuestaMetadataSchema,
  diagram: DiagramDataSchema,
  gatesSummary: z.array(QualityGateSchema).min(1),
});

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

export interface PropuestaValidationResult<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly errors?: string[];
}

function runValidator<T>(
  schema: z.ZodType<T>,
  data: unknown,
  label: string
): PropuestaValidationResult<T> {
  try {
    return { success: true, data: schema.parse(data) };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((e) => `${label}.${e.path.join('.')}: ${e.message}`),
      };
    }
    return { success: false, errors: [`${label}: unknown validation error`] };
  }
}

export const validateDiagnostico = (data: unknown) =>
  runValidator(DiagnosticoSchema, data, 'diagnostico');

export const validateMejoras = (data: unknown) => runValidator(MejorasSchema, data, 'mejoras');

export const validateFlujo = (data: unknown) => runValidator(FlujoSchema, data, 'flujo');

// ---------------------------------------------------------------------------
// Type exports
// ---------------------------------------------------------------------------

export type PropuestaMetadata = z.infer<typeof PropuestaMetadataSchema>;
export type ImpactLevel = z.infer<typeof ImpactLevelSchema>;
export type PainPoint = z.infer<typeof PainPointSchema>;
export type DiagnosticoSummary = z.infer<typeof DiagnosticoSummarySchema>;
export type Diagnostico = z.infer<typeof DiagnosticoSchema>;
export type MejoraFase = z.infer<typeof MejoraFaseSchema>;
export type Mejoras = z.infer<typeof MejorasSchema>;
export type QualityGate = z.infer<typeof QualityGateSchema>;
export type Flujo = z.infer<typeof FlujoSchema>;
