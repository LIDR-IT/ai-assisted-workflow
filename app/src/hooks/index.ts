/**
 * Hooks Index — Centralized export for all React hooks
 *
 * This module provides a single point of access to all React hooks
 * used throughout the multi-client architecture, enabling easy imports
 * and consistent hook usage patterns.
 *
 * Features:
 * - All client management hooks
 * - All diagram data hooks
 * - All configuration hooks
 * - Type exports for hook interfaces
 * - Convenience re-exports
 *
 * Part of the Phase 1 infrastructure for multi-client JSON architecture.
 */

// Client Registry Hooks
export { useClientRegistry, useCurrentClient, useAvailableClients } from './useClientRegistry';

export type { UseClientRegistryReturn, UseClientRegistryOptions } from './useClientRegistry';

// Diagram Data Hooks
export {
  useDiagramData,
  useCurrentClientDiagram,
  useMultipleDiagrams,
  usePreloadDiagram,
} from './useDiagramData';

export type {
  DiagramLoadingState,
  UseDiagramDataReturn,
  UseDiagramDataOptions,
} from './useDiagramData';

// Propuesta Content Hooks (JSON-driven Diagnóstico / Mejoras / Flujo)
export { usePropuestaContent } from './usePropuestaContent';
export type { UsePropuestaContentReturn, UsePropuestaContentOptions } from './usePropuestaContent';

// Navigation Hooks
export { useNavEntries } from './useNavEntries';
export type { NavItem, NavSeparator, NavEntry } from './useNavEntries';

// Client Configuration Hooks
export {
  useClientConfig,
  useClientBranding,
  useClientComputed,
  useClientChecks,
  useTemplateVariables,
} from './useClientConfig';

export type {
  ComputedClientInfo,
  ClientBranding,
  TemplateVariableAccess,
  UseClientConfigReturn,
} from './useClientConfig';

// ---------------------------------------------------------------------------
// Convenience Re-exports
// ---------------------------------------------------------------------------

// Note: Hook objects temporarily commented out to resolve export issues
// TODO: Re-enable after fixing circular dependencies

// /**
//  * Most commonly used hooks for quick access
//  */
// export const CommonHooks = {
//   useCurrentClient,
//   useClientConfig,
//   useDiagramData,
// } as const;

// ---------------------------------------------------------------------------
// Hook Utilities
// ---------------------------------------------------------------------------

/** List of all available hook names */
export const AVAILABLE_HOOKS = [
  'useClientRegistry',
  'useCurrentClient',
  'useAvailableClients',
  'useNavEntries',
  'useDiagramData',
  'useCurrentClientDiagram',
  'useMultipleDiagrams',
  'usePreloadDiagram',
  'useClientConfig',
  'useClientBranding',
  'useClientComputed',
  'useClientChecks',
  'useTemplateVariables',
] as const;

/** Type for hook names */
export type HookName = (typeof AVAILABLE_HOOKS)[number];

/**
 * Check if a string is a valid hook name
 */
export function isValidHookName(name: string): name is HookName {
  return AVAILABLE_HOOKS.includes(name as HookName);
}

/**
 * Get hook category by name
 */
export function getHookCategory(hookName: HookName): 'client' | 'diagram' | 'config' {
  if (hookName.includes('Client') && !hookName.includes('Diagram')) {
    return 'client';
  }
  if (hookName.includes('Diagram')) {
    return 'diagram';
  }
  return 'config';
}

/**
 * Get hooks by category
 */
export function getHooksByCategory(category: 'client' | 'diagram' | 'config'): HookName[] {
  return AVAILABLE_HOOKS.filter((hookName) => getHookCategory(hookName) === category);
}
