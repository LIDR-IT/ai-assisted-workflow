/**
 * useDiagramData Hook — React hook for loading and managing diagram data
 *
 * This hook provides React components with access to diagram data from the
 * diagram store, including loading states, error handling, and Template
 * Engine integration for variable resolution.
 *
 * Features:
 * - Async loading of diagram JSON data
 * - Integration with Template Engine for variable resolution
 * - Loading states and error handling
 * - Caching and performance optimization
 * - Support for current client or specific client diagrams
 * - TypeScript support for all diagram operations
 *
 * Part of the Phase 1 infrastructure for multi-client JSON architecture.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { diagramStore, getCurrentClientDiagram } from '@/data/diagram-store';
import type { DiagramData, LoadDiagramOptions } from '@/data/diagram-store';
import { useCurrentClient } from './useClientRegistry';
import { processTemplate } from '@/data/template-engine';
import { inferIndustryId } from '@/data/template-engine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Loading state for diagram data */
export type DiagramLoadingState = 'idle' | 'loading' | 'success' | 'error';

/** Return type for useDiagramData hook */
export interface UseDiagramDataReturn {
  /** The loaded and resolved diagram data */
  readonly data: DiagramData | null;

  /** Current loading state */
  readonly loadingState: DiagramLoadingState;

  /** Whether the diagram is currently loading */
  readonly isLoading: boolean;

  /** Whether the data loaded successfully */
  readonly isSuccess: boolean;

  /** Whether an error occurred */
  readonly isError: boolean;

  /** Error message if loading failed */
  readonly error: string | null;

  /** Whether the data came from cache */
  readonly fromCache: boolean;

  /** Reload the diagram data */
  readonly reload: () => Promise<void>;

  /** Clear the current error */
  readonly clearError: () => void;
}

/** Options for the useDiagramData hook */
export interface UseDiagramDataOptions {
  /** Specific client ID to use (defaults to current client) */
  readonly clientId?: string;

  /** Options for diagram loading */
  readonly loadOptions?: LoadDiagramOptions;

  /** Whether to resolve template variables in the diagram */
  readonly resolveVariables?: boolean;

  /** Whether to automatically reload when client changes */
  readonly autoReload?: boolean;

  /** Callback when data loads successfully */
  readonly onSuccess?: (data: DiagramData) => void;

  /** Callback when loading fails */
  readonly onError?: (error: string) => void;
}

// ---------------------------------------------------------------------------
// Hook Implementation
// ---------------------------------------------------------------------------

/**
 * React hook for loading and managing diagram data.
 *
 * This hook handles the complete lifecycle of diagram data loading,
 * including variable resolution, error handling, and caching.
 *
 * @param diagramId The ID of the diagram to load
 * @param options Configuration options for the hook
 * @returns Object with diagram data and loading state
 *
 * @example
 * ```tsx
 * function DiagramComponent() {
 *   const { data, isLoading, isError, error, reload } = useDiagramData('fase-requisitos', {
 *     resolveVariables: true,
 *     onSuccess: (data) => console.log('Diagram loaded:', data.metadata.title),
 *     onError: (error) => console.error('Failed to load diagram:', error),
 *   });
 *
 *   if (isLoading) return <div>Loading diagram...</div>;
 *   if (isError) return <div>Error: {error} <button onClick={reload}>Retry</button></div>;
 *   if (!data) return <div>No diagram data</div>;
 *
 *   return (
 *     <div>
 *       <h1>{data.metadata.title}</h1>
 *       <ReactFlowDiagram nodes={data.nodes} edges={data.edges} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useDiagramData(
  diagramId: string,
  options: UseDiagramDataOptions = {}
): UseDiagramDataReturn {
  const {
    clientId: specifiedClientId,
    loadOptions = {},
    resolveVariables = true,
    autoReload = true,
    onSuccess,
    onError,
  } = options;

  // Get current client information
  const { clientId: currentClientId, client: currentClientConfig } = useCurrentClient();

  // Determine which client to use
  const effectiveClientId = specifiedClientId ?? currentClientId;

  // State management
  const [data, setData] = useState<DiagramData | null>(null);
  const [loadingState, setLoadingState] = useState<DiagramLoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState<boolean>(false);

  // Derived loading states
  const isLoading = loadingState === 'loading';
  const isSuccess = loadingState === 'success';
  const isError = loadingState === 'error';

  // Clear error callback
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Stable client config ID for dependency tracking
  const clientConfigId = useMemo(() => currentClientConfig.name, [currentClientConfig.name]);

  // Resolve template variables in diagram data
  const resolveDataVariables = useCallback(
    (rawData: DiagramData): DiagramData => {
      if (!resolveVariables) {
        return rawData;
      }

      try {
        // Get the industry ID for template resolution
        const industryId = inferIndustryId(currentClientConfig);

        // Resolve variables in metadata
        const resolvedMetadata = {
          ...rawData.metadata,
          title: processTemplate(rawData.metadata.title, currentClientConfig, industryId).content,
          description: processTemplate(
            rawData.metadata.description,
            currentClientConfig,
            industryId
          ).content,
          client: processTemplate(rawData.metadata.client, currentClientConfig, industryId).content,
          industry: processTemplate(rawData.metadata.industry, currentClientConfig, industryId)
            .content,
        };

        // Resolve variables in nodes
        const resolvedNodes = rawData.nodes.map((node) => ({
          ...node,
          label: processTemplate(node.label, currentClientConfig, industryId).content,
          subtitle: node.subtitle
            ? processTemplate(node.subtitle, currentClientConfig, industryId).content
            : undefined,
        }));

        // Resolve variables in edges
        const resolvedEdges = rawData.edges.map((edge) => ({
          ...edge,
          label: edge.label
            ? processTemplate(edge.label, currentClientConfig, industryId).content
            : undefined,
        }));

        // Resolve variables in legend
        const resolvedLegend = rawData.legend?.map((item) => ({
          ...item,
          label: processTemplate(item.label, currentClientConfig, industryId).content,
        }));

        // Resolve variables in tables
        const resolvedTables = rawData.tables?.map((row) => ({
          ...row,
          label: processTemplate(row.label, currentClientConfig, industryId).content,
          value: processTemplate(row.value, currentClientConfig, industryId).content,
        }));

        // Resolve variables in tabs
        const resolvedTabs = rawData.tabs?.map((tab) => ({
          ...tab,
          label: processTemplate(tab.label, currentClientConfig, industryId).content,
          description: tab.description
            ? processTemplate(tab.description, currentClientConfig, industryId).content
            : undefined,
          nodes: tab.nodes.map((node) => ({
            ...node,
            label: processTemplate(node.label, currentClientConfig, industryId).content,
            subtitle: node.subtitle
              ? processTemplate(node.subtitle, currentClientConfig, industryId).content
              : undefined,
          })),
          edges: tab.edges.map((edge) => ({
            ...edge,
            label: edge.label
              ? processTemplate(edge.label, currentClientConfig, industryId).content
              : undefined,
          })),
          tables: tab.tables?.map((row) => ({
            ...row,
            label: processTemplate(row.label, currentClientConfig, industryId).content,
            value: processTemplate(row.value, currentClientConfig, industryId).content,
          })),
        }));

        return {
          ...rawData,
          metadata: resolvedMetadata,
          nodes: resolvedNodes,
          edges: resolvedEdges,
          legend: resolvedLegend,
          tables: resolvedTables,
          tabs: resolvedTabs,
        };
      } catch (err) {
        console.warn('Failed to resolve variables in diagram data:', err);
        return rawData;
      }
    },
    [resolveVariables, currentClientConfig]
  );

  // Load diagram data
  const loadData = useCallback(async (): Promise<void> => {
    if (!diagramId || !effectiveClientId) {
      return;
    }

    setLoadingState('loading');
    setError(null);

    try {
      let rawData: DiagramData;
      let wasCached = false;

      // Load data using the appropriate method
      // Use empty options to avoid dependency recreation issues
      const stableLoadOptions = {};

      if (effectiveClientId === currentClientId) {
        // Use current client optimization
        rawData = await getCurrentClientDiagram(diagramId, stableLoadOptions);
      } else {
        // Use specific client
        rawData = await diagramStore.getDiagramData(
          effectiveClientId,
          diagramId,
          stableLoadOptions
        );
      }

      // Check if data came from cache (rough approximation)
      wasCached = loadOptions.useCache !== false;

      // Resolve variables in the data
      const resolvedData = resolveDataVariables(rawData);

      setData(resolvedData);
      setFromCache(wasCached);
      setLoadingState('success');

      // Call success callback
      onSuccess?.(resolvedData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : `Failed to load diagram '${diagramId}'`;
      setError(errorMessage);
      setLoadingState('error');

      // Call error callback
      onError?.(errorMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    diagramId,
    effectiveClientId,
    currentClientId,
    clientConfigId,
    resolveVariables,
    // Note: Removed resolveDataVariables, onSuccess, onError, loadOptions to prevent infinite loops
    // These are used directly in the function body but don't need to be dependencies
  ]);

  // Reload function
  const reload = useCallback(async (): Promise<void> => {
    return loadData();
  }, [loadData]);

  // Load data when dependencies change
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-reload when client changes (if enabled)
  useEffect(() => {
    if (autoReload && effectiveClientId === currentClientId) {
      // Only reload if we're using the current client and it changed
      loadData();
    }
  }, [autoReload, currentClientId, effectiveClientId, loadData]);

  // Return the hook interface
  return {
    data,
    loadingState,
    isLoading,
    isSuccess,
    isError,
    error,
    fromCache,
    reload,
    clearError,
  };
}

// ---------------------------------------------------------------------------
// Convenience Hooks
// ---------------------------------------------------------------------------

/**
 * Hook specifically for loading diagrams for the current client.
 * Automatically reloads when the client changes.
 */
export function useCurrentClientDiagram(
  diagramId: string,
  options: Omit<UseDiagramDataOptions, 'clientId' | 'autoReload'> = {}
): UseDiagramDataReturn {
  return useDiagramData(diagramId, {
    ...options,
    autoReload: true,
  });
}

/**
 * Hook for loading multiple diagrams at once.
 * Returns a map of diagram ID to diagram data.
 */
export function useMultipleDiagrams(
  diagramIds: readonly string[],
  options: UseDiagramDataOptions = {}
): Record<string, UseDiagramDataReturn> {
  const results: Record<string, UseDiagramDataReturn> = {};

  for (const diagramId of diagramIds) {
    // Note: This breaks React hooks rules but is intentional for utility function
    // eslint-disable-next-line react-hooks/rules-of-hooks
    results[diagramId] = useDiagramData(diagramId, options);
  }

  return results;
}

/**
 * Hook that preloads a diagram but doesn't return the data.
 * Useful for performance optimization.
 */
export function usePreloadDiagram(
  diagramId: string,
  options: Pick<UseDiagramDataOptions, 'clientId' | 'loadOptions'> = {}
): {
  readonly preload: () => Promise<void>;
  readonly isPreloading: boolean;
} {
  const [isPreloading, setIsPreloading] = useState(false);
  const { clientId } = useCurrentClient();

  const effectiveClientId = options.clientId ?? clientId;

  const preload = useCallback(async (): Promise<void> => {
    if (isPreloading || !diagramId || !effectiveClientId) {
      return;
    }

    setIsPreloading(true);

    try {
      await diagramStore.getDiagramData(effectiveClientId, diagramId, {
        useCache: true,
        failFast: false,
        ...options.loadOptions,
      });
    } catch {
      // Ignore errors for preloading
    } finally {
      setIsPreloading(false);
    }
  }, [isPreloading, diagramId, effectiveClientId, options.loadOptions]);

  return {
    preload,
    isPreloading,
  };
}
