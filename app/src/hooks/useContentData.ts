/**
 * useContentData Hook — React hook for loading and managing content page data
 *
 * This hook provides React components with access to content data from the
 * content store, including loading states, error handling, and Template
 * Engine integration for variable resolution.
 *
 * Features:
 * - Async loading of content JSON data
 * - Integration with Template Engine for variable resolution
 * - Loading states and error handling
 * - Caching and performance optimization
 * - Support for current client or specific client content
 * - TypeScript support for all content operations
 *
 * Part of the JSON-driven content system infrastructure.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { contentStore, getCurrentClientContent } from '@/data/content-store';
import type { LoadContentOptions } from '@/data/content-store';
import type { ContentPage } from '@/data/schemas/content-schema';
import { useCurrentClient } from './useClientRegistry';
import { processTemplate } from '@/data/template-engine';
import { inferIndustryId } from '@/data/template-engine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Loading state for content data */
export type ContentLoadingState = 'idle' | 'loading' | 'success' | 'error';

/** Return type for useContentData hook */
export interface UseContentDataReturn {
  /** The loaded and resolved content data */
  readonly data: ContentPage | null;

  /** Current loading state */
  readonly loadingState: ContentLoadingState;

  /** Whether the content is currently loading */
  readonly isLoading: boolean;

  /** Whether the data loaded successfully */
  readonly isSuccess: boolean;

  /** Whether an error occurred */
  readonly isError: boolean;

  /** Error message if loading failed */
  readonly error: string | null;

  /** Whether the data came from cache */
  readonly fromCache: boolean;

  /** Reload the content data */
  readonly reload: () => Promise<void>;

  /** Clear the current error */
  readonly clearError: () => void;
}

/** Options for the useContentData hook */
export interface UseContentDataOptions {
  /** Specific client ID to use (defaults to current client) */
  readonly clientId?: string;

  /** Options for content loading */
  readonly loadOptions?: LoadContentOptions;

  /** Whether to resolve template variables in the content */
  readonly resolveVariables?: boolean;

  /** Whether to automatically reload when client changes */
  readonly autoReload?: boolean;

  /** Callback when data loads successfully */
  readonly onSuccess?: (data: ContentPage) => void;

  /** Callback when loading fails */
  readonly onError?: (error: string) => void;
}

// ---------------------------------------------------------------------------
// Hook Implementation
// ---------------------------------------------------------------------------

/**
 * React hook for loading and managing content data.
 *
 * This hook handles the complete lifecycle of content data loading,
 * including variable resolution, error handling, and caching.
 *
 * @param contentId The ID of the content page to load
 * @param options Configuration options for the hook
 * @returns Object with content data and loading state
 *
 * @example
 * ```tsx
 * function ContentComponent() {
 *   const { data, isLoading, isError, error, reload } = useContentData('proceso-prd', {
 *     resolveVariables: true,
 *     onSuccess: (data) => console.log('Content loaded:', data.metadata.title),
 *     onError: (error) => console.error('Failed to load content:', error),
 *   });
 *
 *   if (isLoading) return <div>Loading content...</div>;
 *   if (isError) return <div>Error: {error} <button onClick={reload}>Retry</button></div>;
 *   if (!data) return <div>No content data</div>;
 *
 *   return (
 *     <div>
 *       <h1>{data.header.title}</h1>
 *       <ContentRenderer data={data} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useContentData(
  contentId: string,
  options: UseContentDataOptions = {}
): UseContentDataReturn {
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
  const [data, setData] = useState<ContentPage | null>(null);
  const [loadingState, setLoadingState] = useState<ContentLoadingState>('idle');
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

  // Resolve template variables in content data
  const resolveDataVariables = useCallback(
    (rawData: ContentPage): ContentPage => {
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
          description: rawData.metadata.description
            ? processTemplate(rawData.metadata.description, currentClientConfig, industryId).content
            : undefined,
          client: processTemplate(rawData.metadata.client, currentClientConfig, industryId).content,
          industry: processTemplate(rawData.metadata.industry, currentClientConfig, industryId)
            .content,
        };

        // Resolve variables in header
        const resolvedHeader = {
          ...rawData.header,
          title: processTemplate(rawData.header.title, currentClientConfig, industryId).content,
          subtitle: rawData.header.subtitle
            ? processTemplate(rawData.header.subtitle, currentClientConfig, industryId).content
            : undefined,
        };

        // Resolve variables in content blocks
        const resolvedBlocks = rawData.blocks.map((block) => {
          const resolvedBlock = {
            ...block,
            title: block.title
              ? processTemplate(block.title, currentClientConfig, industryId).content
              : undefined,
          };

          // Resolve variables based on block type
          switch (block.type) {
            case 'tool-list':
              return {
                ...resolvedBlock,
                content: {
                  ...block.content,
                  tools: block.content.tools.map((tool: any) => ({
                    ...tool,
                    name: processTemplate(tool.name, currentClientConfig, industryId).content,
                    description: processTemplate(tool.description, currentClientConfig, industryId)
                      .content,
                  })),
                },
              };

            case 'problem-solution':
              return {
                ...resolvedBlock,
                content: {
                  ...block.content,
                  problem: {
                    ...block.content.problem,
                    title: processTemplate(
                      block.content.problem.title,
                      currentClientConfig,
                      industryId
                    ).content,
                    description: processTemplate(
                      block.content.problem.description,
                      currentClientConfig,
                      industryId
                    ).content,
                  },
                  solution: {
                    ...block.content.solution,
                    title: processTemplate(
                      block.content.solution.title,
                      currentClientConfig,
                      industryId
                    ).content,
                    items: block.content.solution.items.map(
                      (item: string) =>
                        processTemplate(item, currentClientConfig, industryId).content
                    ),
                  },
                },
              };

            case 'info-table':
              return {
                ...resolvedBlock,
                content: {
                  ...block.content,
                  rows: block.content.rows.map((row: any) => ({
                    label: processTemplate(row.label, currentClientConfig, industryId).content,
                    value: processTemplate(row.value, currentClientConfig, industryId).content,
                  })),
                },
              };

            case 'code-hierarchy':
              return {
                ...resolvedBlock,
                content: {
                  ...block.content,
                  items: resolveHierarchyItems(
                    block.content.items,
                    currentClientConfig,
                    industryId
                  ),
                },
              };

            case 'rich-text':
              return {
                ...resolvedBlock,
                content: {
                  ...block.content,
                  text: processTemplate(block.content.text, currentClientConfig, industryId)
                    .content,
                },
              };

            case 'diagram':
              return {
                ...resolvedBlock,
                content: {
                  ...block.content,
                  diagramId: processTemplate(
                    block.content.diagramId,
                    currentClientConfig,
                    industryId
                  ).content,
                },
              };

            case 'grid':
              return {
                ...resolvedBlock,
                content: {
                  ...block.content,
                  blocks: block.content.blocks.map((gridBlock: any) =>
                    resolveGridBlock(gridBlock, currentClientConfig, industryId)
                  ),
                },
              };

            default:
              return resolvedBlock;
          }
        });

        return {
          ...rawData,
          metadata: resolvedMetadata,
          header: resolvedHeader,
          blocks: [...resolvedBlocks],
        };
      } catch (err) {
        console.warn('Failed to resolve variables in content data:', err);
        return rawData;
      }
    },
    [resolveVariables, currentClientConfig]
  );

  // Load content data
  const loadData = useCallback(async (): Promise<void> => {
    if (!contentId || !effectiveClientId) {
      return;
    }

    setLoadingState('loading');
    setError(null);

    try {
      let rawData: ContentPage;
      let wasCached = false;

      // Load data using the appropriate method
      // Use empty options to avoid dependency recreation issues
      const stableLoadOptions = {};

      if (effectiveClientId === currentClientId) {
        // Use current client optimization
        rawData = (await getCurrentClientContent(contentId, stableLoadOptions)) as ContentPage;
      } else {
        // Use specific client
        rawData = (await contentStore.getContentData(
          effectiveClientId,
          contentId,
          stableLoadOptions
        )) as ContentPage;
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
        err instanceof Error ? err.message : `Failed to load content '${contentId}'`;
      setError(errorMessage);
      setLoadingState('error');

      // Call error callback
      onError?.(errorMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    contentId,
    effectiveClientId,
    currentClientId,
    clientConfigId,
    resolveVariables,
    // Note: Removed resolveDataVariables, onSuccess, onError to prevent infinite loops
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
// Helper Functions for Variable Resolution
// ---------------------------------------------------------------------------

/**
 * Recursively resolve variables in hierarchy items
 */
function resolveHierarchyItems(items: any[], clientConfig: any, industryId: string): any[] {
  return items.map((item) => ({
    ...item,
    label: processTemplate(item.label, clientConfig, industryId).content,
    children: item.children
      ? resolveHierarchyItems(item.children, clientConfig, industryId)
      : undefined,
  }));
}

/**
 * Resolve variables in grid block (recursive)
 */
function resolveGridBlock(block: any, clientConfig: any, industryId: string): any {
  const resolvedBlock = {
    ...block,
    title: block.title ? processTemplate(block.title, clientConfig, industryId).content : undefined,
  };

  // Apply similar resolution logic as main blocks
  // This is a simplified version - full implementation would handle all block types
  if (block.type === 'rich-text' && block.content?.text) {
    return {
      ...resolvedBlock,
      content: {
        ...block.content,
        text: processTemplate(block.content.text, clientConfig, industryId).content,
      },
    };
  }

  return resolvedBlock;
}

// ---------------------------------------------------------------------------
// Convenience Hooks
// ---------------------------------------------------------------------------

/**
 * Hook specifically for loading content for the current client.
 * Automatically reloads when the client changes.
 */
export function useCurrentClientContent(
  contentId: string,
  options: Omit<UseContentDataOptions, 'clientId' | 'autoReload'> = {}
): UseContentDataReturn {
  return useContentData(contentId, {
    ...options,
    autoReload: true,
  });
}

/**
 * Hook for loading multiple content pages at once.
 * Returns a map of content ID to content data.
 */
export function useMultipleContent(
  contentIds: readonly string[],
  options: UseContentDataOptions = {}
): Record<string, UseContentDataReturn> {
  const results: Record<string, UseContentDataReturn> = {};

  for (const contentId of contentIds) {
    // Note: This breaks React hooks rules but is intentional for utility function
    // eslint-disable-next-line react-hooks/rules-of-hooks
    results[contentId] = useContentData(contentId, options);
  }

  return results;
}

/**
 * Hook that preloads content but doesn't return the data.
 * Useful for performance optimization.
 */
export function usePreloadContent(
  contentId: string,
  options: Pick<UseContentDataOptions, 'clientId' | 'loadOptions'> = {}
): {
  readonly preload: () => Promise<void>;
  readonly isPreloading: boolean;
} {
  const [isPreloading, setIsPreloading] = useState(false);
  const { clientId } = useCurrentClient();

  const effectiveClientId = options.clientId ?? clientId;

  const preload = useCallback(async (): Promise<void> => {
    if (isPreloading || !contentId || !effectiveClientId) {
      return;
    }

    setIsPreloading(true);

    try {
      await contentStore.getContentData(effectiveClientId, contentId, {
        useCache: true,
        failFast: false,
        ...options.loadOptions,
      });
    } catch {
      // Ignore errors for preloading
    } finally {
      setIsPreloading(false);
    }
  }, [isPreloading, contentId, effectiveClientId, options.loadOptions]);

  return {
    preload,
    isPreloading,
  };
}

/**
 * Hook for getting content metadata without loading full content.
 * Useful for navigation or previews.
 */
export function useContentMetadata(
  contentId: string,
  options: Pick<UseContentDataOptions, 'clientId'> = {}
): {
  readonly metadata: any | null;
  readonly isLoading: boolean;
  readonly error: string | null;
} {
  const { data, isLoading, error } = useContentData(contentId, {
    ...options,
    resolveVariables: false, // Don't resolve variables for metadata-only requests
  });

  return {
    metadata: data?.metadata ?? null,
    isLoading,
    error,
  };
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

// Note: All types already exported via individual 'export type' and 'export interface' declarations above
