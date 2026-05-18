/**
 * Schemas Index — Centralized export for all validation schemas
 *
 * This module provides a single point of access to all Zod schemas
 * and validation functions used throughout the multi-client architecture.
 *
 * Features:
 * - All diagram validation schemas and functions
 * - All client configuration schemas and functions
 * - Type exports for schema inference
 * - Centralized validation utilities
 *
 * Part of the Phase 1 infrastructure for multi-client JSON architecture.
 */

// Re-export everything from diagram schema
export * from './diagram-schema';
// Alias for disambiguation when both schemas are used
export type { ValidationResult as DiagramValidationResult } from './diagram-schema';

// Re-export everything from client schema (excluding conflicting names)
export {
  clientConfigSchema,
  clientIdSchema,
  clientConfigExtendedSchema,
  validateClientConfig,
  validateClientId,
  isValidClientConfig,
  getValidationErrors,
  getConfigQualityReport,
} from './client-schema';
export type {
  ClientConfig,
  ClientId,
  ValidationResult as ClientValidationResult,
} from './client-schema';

// ---------------------------------------------------------------------------
// Convenience Aliases
// ---------------------------------------------------------------------------

// validateDiagram is already exported via `export * from './diagram-schema'`
// validateClientConfig and validateClientId are already exported above

// ---------------------------------------------------------------------------
// Schema Collections for Programmatic Access
// ---------------------------------------------------------------------------

/** All diagram-related schemas */
export const DIAGRAM_SCHEMAS = {
  DiagramData: () => import('./diagram-schema').then((m) => m.DiagramDataSchema),
  DiagramMetadata: () => import('./diagram-schema').then((m) => m.DiagramMetadataSchema),
  DiagramConfiguration: () => import('./diagram-schema').then((m) => m.DiagramConfigurationSchema),
  DiagramNode: () => import('./diagram-schema').then((m) => m.DiagramNodeSchema),
  DiagramEdge: () => import('./diagram-schema').then((m) => m.DiagramEdgeSchema),
  LegendItem: () => import('./diagram-schema').then((m) => m.LegendItemSchema),
  TableRow: () => import('./diagram-schema').then((m) => m.TableRowSchema),
  TabData: () => import('./diagram-schema').then((m) => m.TabDataSchema),
} as const;

/** All client-related schemas */
export const CLIENT_SCHEMAS = {
  ClientConfig: () => import('./client-schema').then((m) => m.clientConfigSchema),
  ClientId: () => import('./client-schema').then((m) => m.clientIdSchema),
  ClientConfigExtended: () => import('./client-schema').then((m) => m.clientConfigExtendedSchema),
} as const;

/** All available schemas for dynamic validation */
export const ALL_SCHEMAS = {
  ...DIAGRAM_SCHEMAS,
  ...CLIENT_SCHEMAS,
} as const;

// ---------------------------------------------------------------------------
// Utility Functions
// ---------------------------------------------------------------------------

/**
 * Get schema by name for dynamic validation
 */
export async function getSchemaByName(schemaName: keyof typeof ALL_SCHEMAS) {
  const schemaLoader = ALL_SCHEMAS[schemaName];
  return await schemaLoader();
}

/**
 * List all available schema names
 */
export function getAvailableSchemas(): string[] {
  return Object.keys(ALL_SCHEMAS);
}

/**
 * Check if a schema name is valid
 */
export function isValidSchemaName(name: string): name is keyof typeof ALL_SCHEMAS {
  return name in ALL_SCHEMAS;
}
