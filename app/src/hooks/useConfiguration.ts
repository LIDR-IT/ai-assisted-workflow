/**
 * useConfiguration — React hook for accessing hierarchical configuration
 *
 * This hook provides easy access to the resolved configuration hierarchy
 * and integrates seamlessly with the existing client system.
 *
 * Features:
 * - Automatic configuration resolution
 * - Integration with existing useCurrentClient hook
 * - Caching and performance optimization
 * - TypeScript support with full type safety
 * - Development-time configuration debugging
 *
 * Usage:
 *   const { config, colors, templateVariables, isLoading } = useConfiguration();
 *   const { blockConfig } = useConfiguration('chart', { customColors: {...} });
 */

import { useState, useEffect, useCallback } from 'react';
import { useCurrentClient } from '@/hooks/useClientRegistry';
import { useColorConfig } from '../app/components/content/hooks/useColorConfig';
import {
  resolveConfig,
  resolveBlockConfig,
  resolveColors,
  getTemplateVariables,
  clearConfigCacheFor,
  type ResolvedConfig,
  type ColorConfig,
} from '@/data/config-resolver';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UseConfigurationResult {
  readonly config: ResolvedConfig | null;
  readonly colors: ColorConfig | null;
  readonly templateVariables: Record<string, string>;
  readonly isLoading: boolean;
  readonly error: Error | null;
  readonly refreshConfig: () => void;
}

interface UseBlockConfigurationResult {
  readonly blockConfig: any;
  readonly colors: ColorConfig | null;
  readonly templateVariables: Record<string, string>;
  readonly isLoading: boolean;
  readonly error: Error | null;
}

interface UseConfigurationOptions {
  readonly projectId?: string;
  readonly skipCache?: boolean;
  readonly enableDebug?: boolean;
}

interface UseBlockConfigurationOptions extends UseConfigurationOptions {
  readonly customColors?: Record<string, string>;
  readonly customConfig?: Record<string, any>;
}

// ---------------------------------------------------------------------------
// Main Configuration Hook
// ---------------------------------------------------------------------------

/**
 * Main hook for accessing resolved configuration
 */
export function useConfiguration(options: UseConfigurationOptions = {}): UseConfigurationResult {
  const { client } = useCurrentClient();
  const [config, setConfig] = useState<ResolvedConfig | null>(null);
  const [colors, setColors] = useState<ColorConfig | null>(null);
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadConfiguration = useCallback(async () => {
    if (!client?.name) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [resolvedConfig, resolvedColors, resolvedVariables] = await Promise.all([
        resolveConfig(client.name, options.projectId, {
          skipCache: options.skipCache,
        }),
        resolveColors(client.name, options.projectId),
        getTemplateVariables(client.name, options.projectId),
      ]);

      setConfig(resolvedConfig);
      setColors(resolvedColors);
      setTemplateVariables(resolvedVariables);

      // Debug output in development
      if (options.enableDebug && process.env.NODE_ENV === 'development') {
        console.warn('🔧 Configuration Loaded');
        console.warn('Client:', client.name);
        console.warn('Project:', options.projectId);
        console.warn('Hierarchy:', resolvedConfig.hierarchy);
        console.warn('Template Variables:', resolvedVariables);
        console.warn('Resolved Colors:', resolvedColors);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load configuration');
      setError(error);
      console.error('Configuration loading error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [client?.name, options.projectId, options.skipCache, options.enableDebug]);

  const refreshConfig = useCallback(() => {
    if (client?.name) {
      clearConfigCacheFor(client.name, options.projectId);
      loadConfiguration();
    }
  }, [client?.name, options.projectId, loadConfiguration]);

  useEffect(() => {
    loadConfiguration();
  }, [loadConfiguration]);

  return {
    config,
    colors,
    templateVariables,
    isLoading,
    error,
    refreshConfig,
  };
}

// ---------------------------------------------------------------------------
// Block-Specific Configuration Hook
// ---------------------------------------------------------------------------

/**
 * Hook for accessing block-specific configuration
 */
export function useBlockConfiguration(
  blockType: string,
  options: UseBlockConfigurationOptions = {}
): UseBlockConfigurationResult {
  const { client } = useCurrentClient();
  const [blockConfig, setBlockConfig] = useState<any>(null);
  const [colors, setColors] = useState<ColorConfig | null>(null);
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadBlockConfiguration = useCallback(async () => {
    if (!client?.name || !blockType) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [resolvedBlockConfig, resolvedColors, resolvedVariables] = await Promise.all([
        resolveBlockConfig(client.name, options.projectId, blockType, options.customConfig),
        resolveColors(client.name, options.projectId, options.customColors),
        getTemplateVariables(client.name, options.projectId),
      ]);

      setBlockConfig(resolvedBlockConfig);
      setColors(resolvedColors);
      setTemplateVariables(resolvedVariables);

      // Debug output in development
      if (options.enableDebug && process.env.NODE_ENV === 'development') {
        console.warn(`🎨 Block Configuration - ${blockType}`);
        console.warn('Client:', client.name);
        console.warn('Project:', options.projectId);
        console.warn('Block Config:', resolvedBlockConfig);
        console.warn('Colors:', resolvedColors);
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error(`Failed to load ${blockType} configuration`);
      setError(error);
      console.error(`Block configuration loading error (${blockType}):`, error);
    } finally {
      setIsLoading(false);
    }
  }, [
    client?.name,
    blockType,
    options.projectId,
    options.customConfig,
    options.customColors,
    options.enableDebug,
  ]);

  useEffect(() => {
    loadBlockConfiguration();
  }, [loadBlockConfiguration]);

  return {
    blockConfig,
    colors,
    templateVariables,
    isLoading,
    error,
  };
}

// ---------------------------------------------------------------------------
// Specialized Hooks
// ---------------------------------------------------------------------------

/**
 * Hook for accessing only template variables (lightweight)
 */
export function useTemplateVariables(projectId?: string) {
  const { client } = useCurrentClient();
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadVariables() {
      if (!client?.name) {
        setIsLoading(false);
        return;
      }

      try {
        const resolvedVariables = await getTemplateVariables(client.name, projectId);
        setVariables(resolvedVariables);
      } catch (error) {
        console.error('Failed to load template variables:', error);
        setVariables({});
      } finally {
        setIsLoading(false);
      }
    }

    loadVariables();
  }, [client?.name, projectId]);

  return { variables, isLoading };
}

/**
 * Hook for accessing only colors (lightweight)
 */
export function useConfigurationColors(projectId?: string, customColors?: Record<string, string>) {
  const { client } = useCurrentClient();
  const [colors, setColors] = useState<ColorConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadColors() {
      if (!client?.name) {
        setIsLoading(false);
        return;
      }

      try {
        const resolvedColors = await resolveColors(client.name, projectId, customColors);
        setColors(resolvedColors);
      } catch (error) {
        console.error('Failed to load colors:', error);
        setColors(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadColors();
  }, [client?.name, projectId, customColors]);

  return { colors, isLoading };
}

// ---------------------------------------------------------------------------
// Development Helpers
// ---------------------------------------------------------------------------

/**
 * Development hook for testing different configurations
 */
export function useConfigurationDebugger() {
  const { client } = useCurrentClient();

  const testConfiguration = useCallback(async (clientId: string, projectId?: string) => {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('Configuration debugger only available in development');
      return;
    }

    try {
      const config = await resolveConfig(clientId, projectId, { skipCache: true });

      console.warn(`🔍 Configuration Test - ${clientId}/${projectId || 'default'}`);
      console.warn('Template Variables:', config.templateVariables);
      console.warn('Full Config:', config);

      return config;
    } catch (error) {
      console.error('Configuration test failed:', error);
      return null;
    }
  }, []);

  const testCurrentConfiguration = useCallback(() => {
    if (client?.name) {
      return testConfiguration(client.name);
    }
    return null;
  }, [client?.name, testConfiguration]);

  return {
    testConfiguration,
    testCurrentConfiguration,
  };
}

// ---------------------------------------------------------------------------
// Enhanced useColorConfig Integration
// ---------------------------------------------------------------------------

/**
 * Enhanced version of useColorConfig that integrates with configuration system
 */
export function useEnhancedColorConfig(
  blockColors?: Record<string, string>,
  options: {
    readonly fallbackTheme?: string;
    readonly validate?: boolean;
    readonly applyCustomProperties?: boolean;
    readonly projectId?: string;
  } = {}
) {
  const { colors: configColors } = useConfigurationColors(options.projectId);

  // Use the imported useColorConfig

  // Merge configuration colors with block colors
  const mergedColors = {
    ...configColors,
    ...blockColors,
  };

  return useColorConfig(mergedColors, {
    fallbackTheme: options.fallbackTheme as
      | 'primary'
      | 'success'
      | 'warning'
      | 'neutral'
      | 'danger'
      | 'info'
      | undefined,
    validate: options.validate,
    applyCustomProperties: options.applyCustomProperties,
  });
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export type {
  UseConfigurationResult,
  UseBlockConfigurationResult,
  UseConfigurationOptions,
  UseBlockConfigurationOptions,
};

// Default export for convenience
export default useConfiguration;
