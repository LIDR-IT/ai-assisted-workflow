/**
 * useColorConfig Hook — React hook for managing color configurations
 *
 * This hook provides a convenient interface for processing and applying
 * color configurations in content blocks with validation and fallbacks.
 *
 * Features:
 * - Color processing with multiple format support
 * - Validation and error reporting
 * - CSS custom property generation
 * - Theme-based color schemes
 * - Performance optimization with memoization
 *
 * Part of the JSON-driven content system infrastructure.
 */

import { useMemo, useEffect, useRef } from 'react';
import type { ColorConfig } from '@/app/components/content/utils/colorUtils';
import {
  processColorConfig,
  validateColorConfig,
  generateCSSCustomProperties,
  applyCSSCustomProperties,
  getColorTheme,
  COLOR_THEMES,
} from '@/app/components/content/utils/colorUtils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseColorConfigOptions {
  /** Fallback color theme to use */
  fallbackTheme?: keyof typeof COLOR_THEMES;
  /** Whether to validate colors and log warnings */
  validate?: boolean;
  /** Whether to apply CSS custom properties to a DOM element */
  applyCustomProperties?: boolean;
}

export interface UseColorConfigReturn {
  /** Processed color classes ready for use */
  colors: {
    readonly background: string;
    readonly border: string;
    readonly text: string;
    readonly accent: string;
  };
  /** Whether the color config is valid */
  isValid: boolean;
  /** Validation errors (empty if valid) */
  errors: readonly string[];
  /** Validation warnings */
  warnings: readonly string[];
  /** CSS custom properties object */
  customProperties: Record<string, string>;
  /** Ref to attach to DOM element for custom properties */
  elementRef: React.RefObject<HTMLDivElement | null>;
}

// ---------------------------------------------------------------------------
// Hook Implementation
// ---------------------------------------------------------------------------

/**
 * React hook for managing color configurations in content blocks.
 *
 * This hook processes color configurations, validates them, and provides
 * ready-to-use CSS classes and custom properties.
 *
 * @param config The color configuration object
 * @param options Configuration options for the hook
 * @returns Processed colors and validation results
 *
 * @example
 * ```tsx
 * function MyBlock({ block }: { block: ContentBlock }) {
 *   const { colors, isValid, elementRef } = useColorConfig(block.config?.colors, {
 *     fallbackTheme: 'primary',
 *     validate: true,
 *     applyCustomProperties: true,
 *   });
 *
 *   return (
 *     <div
 *       ref={elementRef}
 *       className={`${colors.background} ${colors.border} ${colors.text} border rounded`}
 *     >
 *       Content here
 *     </div>
 *   );
 * }
 * ```
 */
export function useColorConfig(
  config: ColorConfig = {},
  options: UseColorConfigOptions = {}
): UseColorConfigReturn {
  const {
    fallbackTheme = 'neutral',
    validate = import.meta.env.DEV,
    applyCustomProperties = false,
  } = options;

  const elementRef = useRef<HTMLDivElement>(null);

  // Get fallback colors from theme
  const fallbackColors = useMemo(() => {
    return getColorTheme(fallbackTheme);
  }, [fallbackTheme]);

  // Process colors with memoization
  const processedColors = useMemo(() => {
    return processColorConfig(config, fallbackColors);
  }, [config, fallbackColors]);

  // Validate colors if enabled
  const validation = useMemo(() => {
    if (!validate) {
      return { isValid: true, errors: [], warnings: [] };
    }
    return validateColorConfig(config);
  }, [config, validate]);

  // Generate CSS custom properties
  const customProperties = useMemo(() => {
    return generateCSSCustomProperties(config);
  }, [config]);

  // Apply custom properties to DOM element
  useEffect(() => {
    if (applyCustomProperties && elementRef.current && Object.keys(customProperties).length > 0) {
      applyCSSCustomProperties(elementRef.current, customProperties);
    }
  }, [applyCustomProperties, customProperties]);

  // Log validation results in development
  useEffect(() => {
    if (validate && import.meta.env.DEV) {
      if (validation.errors.length > 0) {
        console.error('Color configuration errors:', validation.errors);
      }
      if (validation.warnings.length > 0) {
        console.warn('Color configuration warnings:', validation.warnings);
      }
    }
  }, [validate, validation]);

  return {
    colors: processedColors,
    isValid: validation.isValid,
    errors: validation.errors,
    warnings: validation.warnings,
    customProperties,
    elementRef,
  };
}

// ---------------------------------------------------------------------------
// Convenience Hooks
// ---------------------------------------------------------------------------

/**
 * Hook for using predefined color themes
 */
export function useColorTheme(
  themeName: keyof typeof COLOR_THEMES
): UseColorConfigReturn['colors'] {
  return useMemo(() => {
    return getColorTheme(themeName);
  }, [themeName]);
}

/**
 * Hook for dynamic color generation from a base color
 */
export function useDynamicColors(
  baseColor: string,
  options: Pick<UseColorConfigOptions, 'validate'> = {}
): UseColorConfigReturn {
  const config = useMemo(() => {
    return { background: baseColor };
  }, [baseColor]);

  return useColorConfig(config, {
    ...options,
    applyCustomProperties: true,
  });
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

// Types are already exported above inline with their definitions
