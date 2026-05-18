/**
 * Diagram Schema — Zod schemas for validating diagram JSON data
 *
 * This module provides TypeScript schemas for validating diagram JSON files
 * and ensuring data integrity throughout the multi-client architecture.
 *
 * Features:
 * - Comprehensive validation for all diagram data structures
 * - Integration with existing n() and e() helpers
 * - Support for simple and complex diagram types
 * - Error reporting for invalid data
 * - Type inference from schemas
 *
 * Part of the Phase 1 infrastructure for multi-client JSON architecture.
 */

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Base Schemas
// ---------------------------------------------------------------------------

/** Implementation status for reality vs aspiration tracking */
export const ImplementationStatusSchema = z.object({
  level: z.enum(['implemented', 'partial', 'absent']),
  description: z.string().min(1, 'Status description cannot be empty'),
  evidence: z.string().optional(), // Reference to transcription evidence
});

/** Schema for diagram metadata */
export const DiagramMetadataSchema = z.object({
  id: z
    .string()
    .min(1, 'Diagram ID cannot be empty')
    .regex(/^[a-z0-9-]+$/, 'Diagram ID must be lowercase alphanumeric with hyphens'),
  title: z.string().min(1, 'Title cannot be empty'),
  description: z.string().min(1, 'Description cannot be empty'),
  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, 'Version must follow semantic versioning (e.g., 1.0.0)'),
  client: z.string().min(1, 'Client cannot be empty'),
  industry: z.string().min(1, 'Industry cannot be empty'),
  tags: z.array(z.string()).optional().default([]),
  implementation_status: ImplementationStatusSchema.optional(),
});

/** Schema for diagram configuration */
export const DiagramConfigurationSchema = z.object({
  height: z.number().positive().optional().default(600),
  exportName: z.string().optional(),
  layout: z.enum(['TB', 'LR', 'RL']).optional().default('TB'),
  spacing: z.number().positive().optional().default(50),
});

/** Schema for React Flow diagram nodes */
export const DiagramNodeSchema = z.object({
  id: z.string().min(1, 'Node ID cannot be empty'),
  x: z.number().min(0, 'X position must be non-negative'),
  y: z.number().min(0, 'Y position must be non-negative'),
  label: z.string().min(1, 'Node label cannot be empty'),
  variant: z
    .string()
    .regex(
      /^(purple|blue|green|cyan|teal|indigo|violet|orange|red|amber|emerald|sky|slate|yellow)(-solid|-dark)?$/,
      'Variant must be a valid Tailwind color variant'
    ),
  subtitle: z.string().optional(),
  isJiraState: z.boolean().optional().default(false),
});

/** Schema for React Flow diagram edges */
export const DiagramEdgeSchema = z.object({
  id: z.string().min(1, 'Edge ID cannot be empty'),
  source: z.string().min(1, 'Source node ID cannot be empty'),
  target: z.string().min(1, 'Target node ID cannot be empty'),
  label: z.string().optional(),
  style: z.enum(['dashed', 'red', 'green', 'purple']).optional(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
  markerEnd: z.boolean().optional(),
});

/** Schema for legend items */
export const LegendItemSchema = z.object({
  color: z
    .string()
    .regex(
      /^bg-(purple|blue|green|cyan|teal|indigo|violet|orange|red|amber|emerald|sky|slate|yellow)-(50|100|200|300|400|500|600|700|800|900)$/,
      'Color must be a valid Tailwind background color class'
    ),
  label: z.string().min(1, 'Legend label cannot be empty'),
});

/** Schema for table rows */
export const TableRowSchema = z.object({
  label: z.string().min(1, 'Table label cannot be empty'),
  value: z.string().min(1, 'Table value cannot be empty'),
});

/** Schema for tab data (multi-tab diagrams) */
export const TabDataSchema = z.object({
  id: z.string().min(1, 'Tab ID cannot be empty'),
  label: z.string().min(1, 'Tab label cannot be empty'),
  nodes: z.array(DiagramNodeSchema),
  edges: z.array(DiagramEdgeSchema),
  tables: z.array(TableRowSchema).optional().default([]),
  description: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Sprint Planning Specific Schemas
// ---------------------------------------------------------------------------

/** Configuration section for sprint planning */
export const ConfiguracionSectionSchema = z.object({
  duracion: z.string().min(1, 'Duration cannot be empty'),
  metodologia: z.string().min(1, 'Methodology cannot be empty'),
  estimacion: z.string().min(1, 'Estimation method cannot be empty'),
  herramienta: z.string().min(1, 'Tool cannot be empty'),
  herramientas_adicionales: z.array(z.string()).optional().default([]),
});

/** Role separation section for sprint planning */
export const SeparacionRolesSectionSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty'),
  po_define: z.array(z.string()).min(1, 'PO defines list cannot be empty'),
  dev_define: z.array(z.string()).min(1, 'Dev defines list cannot be empty'),
  nota_aramis: z.string().optional(),
});

/** Management levels section for sprint planning */
export const NivelesGestionSectionSchema = z.object({
  po_gestiona: z.array(z.string()).min(1, 'PO manages list cannot be empty'),
  dev_gestiona: z.array(z.string()).min(1, 'Dev manages list cannot be empty'),
});

/** Individual additional process item */
export const ProcesoAdicionalItemSchema = z.object({
  title: z.string().min(1, 'Process item title cannot be empty'),
  desc: z.string().min(1, 'Process item description cannot be empty'),
  timestamp: z.string().optional(),
  impact: z.enum(['critical', 'high', 'medium', 'low']).optional(),
});

/** Additional process section for sprint planning */
export const ProcesoAdicionalSectionSchema = z.object({
  tipo: z.enum(['carryover', 'innovaciones_aramis', 'problemas_aramis']),
  title: z.string().min(1, 'Section title cannot be empty'),
  impacto: z.array(z.string()).optional().default([]),
  mitigacion: z.array(z.string()).optional().default([]),
  items: z.array(ProcesoAdicionalItemSchema).optional().default([]),
});

/** Sprint planning sections container */
export const SprintPlanningSectionsSchema = z.object({
  configuracion: ConfiguracionSectionSchema.optional(),
  separacion_roles: SeparacionRolesSectionSchema.optional(),
  niveles_gestion: NivelesGestionSectionSchema.optional(),
  procesos_adicionales: z.array(ProcesoAdicionalSectionSchema).optional().default([]),
});

/** Complete diagram data schema */
export const DiagramDataSchema = z.object({
  metadata: DiagramMetadataSchema,
  configuration: DiagramConfigurationSchema,
  nodes: z.array(DiagramNodeSchema),
  edges: z.array(DiagramEdgeSchema),
  legend: z.array(LegendItemSchema).optional().default([]),
  tables: z.array(TableRowSchema).optional().default([]),
  tabs: z.array(TabDataSchema).optional().default([]),
  sections: SprintPlanningSectionsSchema.optional(),
});

// ---------------------------------------------------------------------------
// Validation Functions
// ---------------------------------------------------------------------------

/** Result of diagram validation */
export interface ValidationResult<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly errors?: string[];
}

/** Validation options */
export interface ValidationOptions {
  /** Whether to return detailed error messages */
  readonly detailed?: boolean;
  /** Whether to perform strict validation (fail on warnings) */
  readonly strict?: boolean;
}

/**
 * Validate diagram data against the schema
 */
export function validateDiagramData(
  data: unknown,
  options: ValidationOptions = {}
): ValidationResult<z.infer<typeof DiagramDataSchema>> {
  const { detailed = true } = options;

  try {
    const validatedData = DiagramDataSchema.parse(data);

    // Additional validation logic
    const errors = performAdditionalValidation(validatedData);

    if (errors.length > 0) {
      return {
        success: false,
        errors: detailed ? errors : ['Validation failed'],
      };
    }

    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = detailed
        ? error.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`)
        : ['Schema validation failed'];

      return {
        success: false,
        errors,
      };
    }

    return {
      success: false,
      errors: ['Unknown validation error'],
    };
  }
}

/**
 * Validate diagram metadata only
 */
export function validateDiagramMetadata(
  data: unknown,
  options: ValidationOptions = {}
): ValidationResult<z.infer<typeof DiagramMetadataSchema>> {
  const { detailed = true } = options;

  try {
    const validatedData = DiagramMetadataSchema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = detailed
        ? error.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`)
        : ['Metadata validation failed'];

      return {
        success: false,
        errors,
      };
    }

    return {
      success: false,
      errors: ['Unknown validation error'],
    };
  }
}

/**
 * Validate individual nodes array
 */
export function validateDiagramNodes(
  data: unknown,
  options: ValidationOptions = {}
): ValidationResult<z.infer<typeof DiagramNodeSchema>[]> {
  const { detailed = true } = options;

  try {
    const validatedData = z.array(DiagramNodeSchema).parse(data);

    // Check for duplicate node IDs
    const nodeIds = validatedData.map((node) => node.id);
    const duplicateIds = nodeIds.filter((id, index) => nodeIds.indexOf(id) !== index);

    if (duplicateIds.length > 0) {
      return {
        success: false,
        errors: detailed
          ? [`Duplicate node IDs found: ${duplicateIds.join(', ')}`]
          : ['Duplicate node IDs'],
      };
    }

    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = detailed
        ? error.issues.map((e: z.ZodIssue) => `nodes.${e.path.join('.')}: ${e.message}`)
        : ['Nodes validation failed'];

      return {
        success: false,
        errors,
      };
    }

    return {
      success: false,
      errors: ['Unknown validation error'],
    };
  }
}

/**
 * Validate individual edges array
 */
export function validateDiagramEdges(
  data: unknown,
  nodes: z.infer<typeof DiagramNodeSchema>[] = [],
  options: ValidationOptions = {}
): ValidationResult<z.infer<typeof DiagramEdgeSchema>[]> {
  const { detailed = true } = options;

  try {
    const validatedData = z.array(DiagramEdgeSchema).parse(data);

    // Check for duplicate edge IDs
    const edgeIds = validatedData.map((edge) => edge.id);
    const duplicateIds = edgeIds.filter((id, index) => edgeIds.indexOf(id) !== index);

    if (duplicateIds.length > 0) {
      return {
        success: false,
        errors: detailed
          ? [`Duplicate edge IDs found: ${duplicateIds.join(', ')}`]
          : ['Duplicate edge IDs'],
      };
    }

    // Validate that all edge source/target nodes exist
    if (nodes && nodes.length > 0) {
      const nodeIds = new Set(nodes.map((node) => node.id));
      const invalidEdges = validatedData.filter(
        (edge) => !nodeIds.has(edge.source) || !nodeIds.has(edge.target)
      );

      if (invalidEdges.length > 0) {
        const errorMessages = invalidEdges.map(
          (edge) => `Edge '${edge.id}': references non-existent node(s)`
        );

        return {
          success: false,
          errors: detailed ? errorMessages : ['Invalid edge references'],
        };
      }
    }

    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = detailed
        ? error.issues.map((e: z.ZodIssue) => `edges.${e.path.join('.')}: ${e.message}`)
        : ['Edges validation failed'];

      return {
        success: false,
        errors,
      };
    }

    return {
      success: false,
      errors: ['Unknown validation error'],
    };
  }
}

/**
 * Check if a string is a valid JSON and return parsed data
 */
export function parseJsonString(jsonString: string): ValidationResult<unknown> {
  try {
    const data = JSON.parse(jsonString);
    return {
      success: true,
      data,
    };
  } catch {
    return {
      success: false,
      errors: ['Invalid JSON format'],
    };
  }
}

/**
 * Validate diagram JSON string and return validated data
 */
export function validateDiagramJson(
  jsonString: string,
  options: ValidationOptions = {}
): ValidationResult<z.infer<typeof DiagramDataSchema>> {
  // First parse JSON
  const parseResult = parseJsonString(jsonString);
  if (!parseResult.success) {
    return parseResult as ValidationResult<z.infer<typeof DiagramDataSchema>>;
  }

  // Then validate against schema
  return validateDiagramData(parseResult.data, options);
}

// ---------------------------------------------------------------------------
// Additional Validation Logic
// ---------------------------------------------------------------------------

/**
 * Perform additional validation beyond schema checking
 */
function performAdditionalValidation(data: z.infer<typeof DiagramDataSchema>): string[] {
  const errors: string[] = [];

  // Validate node/edge relationships
  const nodeIds = new Set((data.nodes || []).map((node) => node.id));
  const invalidEdges = (data.edges || []).filter(
    (edge) => !nodeIds.has(edge.source) || !nodeIds.has(edge.target)
  );

  if (invalidEdges.length > 0) {
    errors.push(`Invalid edge references: ${invalidEdges.map((e) => e.id).join(', ')}`);
  }

  // Validate that tab nodes/edges don't conflict with main diagram
  if (data.tabs && data.tabs.length > 0) {
    for (const tab of data.tabs) {
      const tabNodeIds = new Set((tab.nodes || []).map((node) => node.id));
      const tabInvalidEdges = (tab.edges || []).filter(
        (edge) => !tabNodeIds.has(edge.source) || !tabNodeIds.has(edge.target)
      );

      if (tabInvalidEdges.length > 0) {
        errors.push(
          `Tab '${tab.id}' has invalid edge references: ${tabInvalidEdges.map((e) => e.id).join(', ')}`
        );
      }
    }
  }

  // Validate diagram has content (nodes or tabs)
  if (data.nodes.length === 0 && (!data.tabs || data.tabs.length === 0)) {
    errors.push('Diagram must have either nodes or tabs with content');
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Type Exports
// ---------------------------------------------------------------------------

/** Type inference from schemas */
export type DiagramMetadata = z.infer<typeof DiagramMetadataSchema>;
export type DiagramConfiguration = z.infer<typeof DiagramConfigurationSchema>;
export type DiagramNode = z.infer<typeof DiagramNodeSchema>;
export type DiagramEdge = z.infer<typeof DiagramEdgeSchema>;
export type LegendItem = z.infer<typeof LegendItemSchema>;
export type TableRow = z.infer<typeof TableRowSchema>;
export type TabData = z.infer<typeof TabDataSchema>;
export type DiagramData = z.infer<typeof DiagramDataSchema>;

// Sprint Planning specific types
export type ConfiguracionSection = z.infer<typeof ConfiguracionSectionSchema>;
export type SeparacionRolesSection = z.infer<typeof SeparacionRolesSectionSchema>;
export type NivelesGestionSection = z.infer<typeof NivelesGestionSectionSchema>;
export type ProcesoAdicionalItem = z.infer<typeof ProcesoAdicionalItemSchema>;
export type ProcesoAdicionalSection = z.infer<typeof ProcesoAdicionalSectionSchema>;
export type SprintPlanningSections = z.infer<typeof SprintPlanningSectionsSchema>;

// Note: All types already exported via 'export interface' declarations above
