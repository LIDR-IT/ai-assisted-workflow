/**
 * Color utilities for content blocks
 *
 * This module provides advanced color handling for content blocks including
 * support for Tailwind classes, CSS custom properties, and hex values.
 *
 * Features:
 * - Tailwind class validation and normalization
 * - CSS custom property support (--color-name)
 * - Hex color value support (#abc123)
 * - Color contrast checking
 * - Fallback color handling
 *
 * Part of the JSON-driven content system infrastructure.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ColorValue = string;

export interface ColorConfig {
  readonly background?: ColorValue;
  readonly border?: ColorValue;
  readonly text?: ColorValue;
  readonly accent?: ColorValue;
}

export interface ProcessedColorConfig {
  readonly background: string;
  readonly border: string;
  readonly text: string;
  readonly accent: string;
}

export type ColorType = 'tailwind' | 'css-custom' | 'hex' | 'rgb' | 'hsl' | 'unknown';

// ---------------------------------------------------------------------------
// Color Detection
// ---------------------------------------------------------------------------

/**
 * Detect the type of color value
 */
export function detectColorType(color: string): ColorType {
  if (!color || typeof color !== 'string') {
    return 'unknown';
  }

  const trimmed = color.trim();

  // CSS custom property
  if (trimmed.startsWith('--')) {
    return 'css-custom';
  }

  // Hex color
  if (trimmed.startsWith('#')) {
    return 'hex';
  }

  // RGB/RGBA
  if (trimmed.startsWith('rgb')) {
    return 'rgb';
  }

  // HSL/HSLA
  if (trimmed.startsWith('hsl')) {
    return 'hsl';
  }

  // Tailwind class (bg-, text-, border-, etc.)
  if (isTailwindColorClass(trimmed)) {
    return 'tailwind';
  }

  return 'unknown';
}

/**
 * Check if a string is a valid Tailwind color class
 */
export function isTailwindColorClass(value: string): boolean {
  const tailwindPrefixes = [
    'bg-',
    'text-',
    'border-',
    'ring-',
    'outline-',
    'shadow-',
    'from-',
    'via-',
    'to-',
    'decoration-',
    'accent-',
    'caret-',
  ];

  return tailwindPrefixes.some((prefix) => value.startsWith(prefix));
}

// ---------------------------------------------------------------------------
// Color Processing
// ---------------------------------------------------------------------------

/**
 * Process a color value into a CSS-compatible format
 */
export function processColorValue(value: ColorValue): string {
  if (!value) {
    return '';
  }

  const type = detectColorType(value);

  switch (type) {
    case 'tailwind':
      return value; // Tailwind classes are used as-is

    case 'css-custom':
      return `var(${value})`; // Convert --color-name to var(--color-name)

    case 'hex':
    case 'rgb':
    case 'hsl':
      // For non-Tailwind colors, we need to use arbitrary value syntax
      return `[${value}]`; // Tailwind arbitrary value syntax

    default:
      return value; // Return as-is for unknown types
  }
}

/**
 * Process a complete color configuration with fallbacks
 */
export function processColorConfig(
  config: ColorConfig = {},
  fallbacks: Partial<ProcessedColorConfig> = {}
): ProcessedColorConfig {
  return {
    background: config.background
      ? processColorValue(config.background)
      : fallbacks.background || 'bg-white',
    border: config.border
      ? processColorValue(config.border)
      : fallbacks.border || 'border-gray-200',
    text: config.text ? processColorValue(config.text) : fallbacks.text || 'text-gray-900',
    accent: config.accent ? processColorValue(config.accent) : fallbacks.accent || 'text-blue-600',
  };
}

// ---------------------------------------------------------------------------
// Tailwind Class Utilities
// ---------------------------------------------------------------------------

/**
 * Validate that a Tailwind class exists (basic validation)
 */
export function isValidTailwindClass(className: string): boolean {
  // This is a basic validation - in a real app you might want to check
  // against the actual Tailwind config or use a more comprehensive list
  const validPatterns = [
    /^bg-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)$/,
    /^text-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)$/,
    /^border-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)$/,
    /^bg-(white|black|transparent|current|inherit)$/,
    /^text-(white|black|transparent|current|inherit)$/,
    /^border-(white|black|transparent|current|inherit)$/,
    /^\[(#[0-9a-fA-F]{3,8}|rgb\(.*\)|hsl\(.*\)|--[a-zA-Z0-9-]+)\]$/, // Arbitrary values
  ];

  return validPatterns.some((pattern) => pattern.test(className));
}

/**
 * Extract color intensity from Tailwind class (50-950)
 */
export function getTailwindColorIntensity(className: string): number | null {
  const match = className.match(/-(\d+)$/);
  return match ? parseInt(match[1]!, 10) : null;
}

/**
 * Get a lighter or darker variant of a Tailwind color class
 */
export function adjustTailwindColorIntensity(className: string, adjustment: number): string {
  const currentIntensity = getTailwindColorIntensity(className);
  if (currentIntensity === null) {
    return className;
  }

  const newIntensity = Math.max(50, Math.min(950, currentIntensity + adjustment));
  const validIntensities = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  // Find the closest valid intensity
  const closestIntensity = validIntensities.reduce((prev, curr) => {
    return Math.abs(curr - newIntensity) < Math.abs(prev - newIntensity) ? curr : prev;
  });

  return className.replace(/-\d+$/, `-${closestIntensity}`);
}

// ---------------------------------------------------------------------------
// CSS Custom Properties
// ---------------------------------------------------------------------------

/**
 * Generate CSS custom property definitions from color config
 */
export function generateCSSCustomProperties(config: ColorConfig): Record<string, string> {
  const properties: Record<string, string> = {};

  Object.entries(config).forEach(([key, value]) => {
    if (value && detectColorType(value) !== 'tailwind') {
      // Convert non-Tailwind colors to CSS custom properties
      const propName = `--color-${key}`;
      properties[propName] = value.startsWith('#') ? value : value.replace(/^\[(.*)\]$/, '$1');
    }
  });

  return properties;
}

/**
 * Apply CSS custom properties to a DOM element
 */
export function applyCSSCustomProperties(
  element: HTMLElement,
  properties: Record<string, string>
): void {
  Object.entries(properties).forEach(([prop, value]) => {
    element.style.setProperty(prop, value);
  });
}

// ---------------------------------------------------------------------------
// Color Theme Utilities
// ---------------------------------------------------------------------------

/**
 * Generate a cohesive color theme from a base color
 */
export function generateColorTheme(baseColor: string): ProcessedColorConfig {
  const type = detectColorType(baseColor);

  if (type === 'tailwind') {
    // Extract the color name and generate variations
    const colorMatch = baseColor.match(/^(bg-|text-|border-)?(.*?)(-\d+)?$/);
    if (colorMatch) {
      const [, , colorName] = colorMatch;
      return {
        background: `bg-${colorName}-50`,
        border: `border-${colorName}-200`,
        text: `text-${colorName}-900`,
        accent: `text-${colorName}-600`,
      };
    }
  }

  // For non-Tailwind colors, use arbitrary value syntax
  const processedColor = processColorValue(baseColor);
  return {
    background: `bg-${processedColor}/10`, // 10% opacity background
    border: `border-${processedColor}/30`, // 30% opacity border
    text: `text-${processedColor}`, // Full color text
    accent: `text-${processedColor}/80`, // 80% opacity accent
  };
}

/**
 * Predefined color themes for common use cases
 */
export const COLOR_THEMES = {
  primary: {
    background: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-900',
    accent: 'text-blue-600',
  },
  success: {
    background: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-900',
    accent: 'text-green-600',
  },
  warning: {
    background: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-900',
    accent: 'text-amber-600',
  },
  danger: {
    background: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-900',
    accent: 'text-red-600',
  },
  info: {
    background: 'bg-cyan-50',
    border: 'border-cyan-200',
    text: 'text-cyan-900',
    accent: 'text-cyan-600',
  },
  neutral: {
    background: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-900',
    accent: 'text-gray-600',
  },
} as const satisfies Record<string, ProcessedColorConfig>;

/**
 * Get a predefined color theme by name
 */
export function getColorTheme(themeName: keyof typeof COLOR_THEMES): ProcessedColorConfig {
  return COLOR_THEMES[themeName];
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/**
 * Validate a color configuration
 */
export function validateColorConfig(config: ColorConfig): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  Object.entries(config).forEach(([key, value]) => {
    if (value) {
      const type = detectColorType(value);

      if (type === 'unknown') {
        warnings.push(`Unknown color format for ${key}: ${value}`);
      }

      if (type === 'tailwind' && !isValidTailwindClass(value)) {
        errors.push(`Invalid Tailwind class for ${key}: ${value}`);
      }

      if (type === 'hex' && !isValidHexColor(value)) {
        errors.push(`Invalid hex color for ${key}: ${value}`);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate hex color format
 */
export function isValidHexColor(color: string): boolean {
  return /^#([0-9A-F]{3}|[0-9A-F]{6}|[0-9A-F]{8})$/i.test(color);
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

// Types are already exported above inline with their definitions
