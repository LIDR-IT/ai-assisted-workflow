/**
 * Content Schema — Zod schemas for validating content block JSON data
 *
 * This module provides TypeScript schemas for validating content JSON files
 * and ensuring data integrity throughout the multi-client content architecture.
 *
 * Features:
 * - Comprehensive validation for all content block types
 * - Flexible color system supporting Tailwind, CSS properties, and hex values
 * - Discriminated unions for type-safe block content
 * - Template variable integration
 * - Extensible block type system
 * - Error reporting for invalid data
 *
 * Part of the JSON-driven content system infrastructure.
 */

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Base Schemas
// ---------------------------------------------------------------------------

/** Schema for content metadata */
export const ContentMetadataSchema = z.object({
  id: z
    .string()
    .min(1, 'Content ID cannot be empty')
    .regex(/^[a-z0-9-]+$/, 'Content ID must be lowercase alphanumeric with hyphens'),
  title: z.string().min(1, 'Title cannot be empty'),
  description: z.string().optional(),
  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, 'Version must follow semantic versioning (e.g., 1.0.0)'),
  client: z.string().min(1, 'Client cannot be empty'),
  industry: z.string().min(1, 'Industry cannot be empty'),
  tags: z.array(z.string()).optional().default([]),
  lastUpdated: z.string().optional(),
  author: z.string().optional(),
});

/** Schema for page header */
export const PageHeaderSchema = z.object({
  title: z.string().min(1, 'Header title cannot be empty'),
  subtitle: z.string().optional(),
});

/** Schema for color configuration supporting multiple formats */
export const ColorConfigSchema = z
  .object({
    background: z.string().optional(), // bg-violet-50, bg-[#ffffff], bg-[--primary-color]
    border: z.string().optional(), // border-violet-200, border-[#abc123]
    text: z.string().optional(), // text-violet-800, text-gray-600
    accent: z.string().optional(), // For icons, badges, highlights
    hover: z.string().optional(), // Interactive states
  })
  .optional();

/** Schema for layout configuration */
export const LayoutConfigSchema = z
  .object({
    columns: z.number().int().min(1).max(12).optional(), // Grid columns (1-12)
    spacing: z.enum(['tight', 'normal', 'loose', 'extra-loose']).optional().default('normal'),
    alignment: z.enum(['left', 'center', 'right']).optional().default('left'),
    direction: z.enum(['horizontal', 'vertical']).optional().default('vertical'),
  })
  .optional();

/** Schema for behavior configuration */
export const BehaviorConfigSchema = z
  .object({
    collapsible: z.boolean().optional().default(false),
    expanded: z.boolean().optional().default(true), // Only relevant if collapsible
    interactive: z.boolean().optional().default(false),
    showIcons: z.boolean().optional().default(true),
    showBorders: z.boolean().optional().default(true),
  })
  .optional();

/** Schema for base block configuration */
export const BlockConfigSchema = z.object({
  colors: ColorConfigSchema,
  layout: LayoutConfigSchema,
  behavior: BehaviorConfigSchema,
  icon: z.string().optional(), // Lucide icon name
  customClasses: z.string().optional(), // Additional CSS classes
});

// ---------------------------------------------------------------------------
// Block Content Schemas
// ---------------------------------------------------------------------------

/** Schema for tool/technology items */
export const ToolItemSchema = z.object({
  name: z.string().min(1, 'Tool name cannot be empty'),
  description: z.string().min(1, 'Tool description cannot be empty'),
  category: z.enum(['primary', 'secondary', 'optional']).optional().default('primary'),
  url: z.string().url().optional(), // Optional link
  icon: z.string().optional(), // Override icon for this specific tool
  status: z.enum(['active', 'deprecated', 'planned']).optional().default('active'),
});

/** Schema for tool list block content */
export const ToolListContentSchema = z.object({
  tools: z.array(ToolItemSchema).min(1, 'Tool list must contain at least one tool'),
  groupByCategory: z.boolean().optional().default(false),
  showStatus: z.boolean().optional().default(false),
});

/** Schema for problem-solution block content */
export const ProblemSolutionContentSchema = z.object({
  problem: z.object({
    title: z.string().min(1, 'Problem title cannot be empty'),
    description: z.string().min(1, 'Problem description cannot be empty'),
    icon: z.string().optional(), // Override icon for problem
  }),
  solution: z.object({
    title: z.string().min(1, 'Solution title cannot be empty'),
    items: z.array(z.string().min(1)).min(1, 'Solution must contain at least one item'),
    icon: z.string().optional(), // Override icon for solution
  }),
});

/** Schema for info table block content (reusing existing TableRow) */
export const InfoTableContentSchema = z.object({
  rows: z
    .array(
      z.object({
        label: z.string().min(1, 'Table label cannot be empty'),
        value: z.string().min(1, 'Table value cannot be empty'),
      })
    )
    .min(1, 'Info table must contain at least one row'),
  striped: z.boolean().optional().default(false),
  compact: z.boolean().optional().default(false),
});

/** Schema for code hierarchy items */
export const CodeHierarchyItemSchema: z.ZodType<{
  id: string;
  label: string;
  level: number;
  children?: any[];
  color?: string;
  expandable?: boolean;
  expanded?: boolean;
}> = z.object({
  id: z.string().min(1, 'Hierarchy item ID cannot be empty'),
  label: z.string().min(1, 'Hierarchy item label cannot be empty'),
  level: z.number().int().min(0).max(5), // Indentation level (0-5)
  children: z
    .array(z.lazy(() => CodeHierarchyItemSchema))
    .optional()
    .default([]),
  color: z.string().optional(), // Override color for this item
  expandable: z.boolean().optional().default(false),
  expanded: z.boolean().optional().default(true),
});

/** Schema for code hierarchy block content */
export const CodeHierarchyContentSchema = z.object({
  items: z.array(CodeHierarchyItemSchema).min(1, 'Code hierarchy must contain at least one item'),
  fontFamily: z.enum(['mono', 'sans']).optional().default('mono'),
  showLines: z.boolean().optional().default(true), // Show connecting lines
  indentSize: z.number().int().min(2).max(8).optional().default(4), // Spaces per level
});

/** Schema for diagram block content (integration with existing DiagramRenderer) */
export const DiagramContentSchema = z.object({
  diagramId: z.string().min(1, 'Diagram ID cannot be empty'),
  clientId: z.string().optional(), // Override client for this diagram
  height: z.number().positive().optional(),
  exportName: z.string().optional(),
  showLegend: z.boolean().optional().default(true),
  showMetadata: z.boolean().optional().default(false),
  resolveVariables: z.boolean().optional().default(true),
});

/** Schema for grid block content */
export const GridContentSchema = z.object({
  blocks: z.array(z.lazy(() => ContentBlockSchema)).min(1, 'Grid must contain at least one block'),
  columns: z.number().int().min(1).max(6).optional().default(2),
  gap: z.enum(['small', 'medium', 'large']).optional().default('medium'),
  responsive: z.boolean().optional().default(true),
});

// ---------------------------------------------------------------------------
// Content Block Schema with Discriminated Union
// ---------------------------------------------------------------------------

/** Base schema for all content blocks */
const BaseContentBlockSchema = z.object({
  id: z.string().min(1, 'Block ID cannot be empty'),
  title: z.string().optional(),
  config: BlockConfigSchema.optional(),
});

/** Tool list block schema */
export const ToolListBlockSchema = BaseContentBlockSchema.extend({
  type: z.literal('tool-list'),
  content: ToolListContentSchema,
});

/** Problem solution block schema */
export const ProblemSolutionBlockSchema = BaseContentBlockSchema.extend({
  type: z.literal('problem-solution'),
  content: ProblemSolutionContentSchema,
});

/** Info table block schema */
export const InfoTableBlockSchema = BaseContentBlockSchema.extend({
  type: z.literal('info-table'),
  content: InfoTableContentSchema,
});

/** Code hierarchy block schema */
export const CodeHierarchyBlockSchema = BaseContentBlockSchema.extend({
  type: z.literal('code-hierarchy'),
  content: CodeHierarchyContentSchema,
});

/** Diagram block schema */
export const DiagramBlockSchema = BaseContentBlockSchema.extend({
  type: z.literal('diagram'),
  content: DiagramContentSchema,
});

/** Grid block schema */
export const GridBlockSchema = BaseContentBlockSchema.extend({
  type: z.literal('grid'),
  content: GridContentSchema,
});

/** Rich text block schema for simple text content */
export const RichTextBlockSchema = BaseContentBlockSchema.extend({
  type: z.literal('rich-text'),
  content: z.object({
    text: z.string().min(1, 'Rich text content cannot be empty'),
    markdown: z.boolean().optional().default(false), // Support markdown formatting
  }),
});

/** Discriminated union of all content block types */
export const ContentBlockSchema: z.ZodType<any> = z.discriminatedUnion('type', [
  ToolListBlockSchema,
  ProblemSolutionBlockSchema,
  InfoTableBlockSchema,
  CodeHierarchyBlockSchema,
  DiagramBlockSchema,
  GridBlockSchema,
  RichTextBlockSchema,
]);

// ---------------------------------------------------------------------------
// Complete Content Page Schema
// ---------------------------------------------------------------------------

/** Complete content page schema */
export const ContentPageSchema = z.object({
  metadata: ContentMetadataSchema,
  header: PageHeaderSchema,
  blocks: z.array(ContentBlockSchema).min(1, 'Content page must contain at least one block'),
});

// ---------------------------------------------------------------------------
// Validation Functions
// ---------------------------------------------------------------------------

/** Result of content validation */
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
 * Validate content page data against the schema
 */
export function validateContentPage(
  data: unknown,
  options: ValidationOptions = {}
): ValidationResult<z.infer<typeof ContentPageSchema>> {
  const { detailed = true } = options;

  try {
    const validatedData = ContentPageSchema.parse(data);

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
 * Validate content metadata only
 */
export function validateContentMetadata(
  data: unknown,
  options: ValidationOptions = {}
): ValidationResult<z.infer<typeof ContentMetadataSchema>> {
  const { detailed = true } = options;

  try {
    const validatedData = ContentMetadataSchema.parse(data);
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
 * Validate individual content blocks array
 */
export function validateContentBlocks(
  data: unknown,
  options: ValidationOptions = {}
): ValidationResult<z.infer<typeof ContentBlockSchema>[]> {
  const { detailed = true } = options;

  try {
    const validatedData = z.array(ContentBlockSchema).parse(data);

    // Check for duplicate block IDs
    const blockIds = validatedData.map((block) => block.id);
    const duplicateIds = blockIds.filter((id, index) => blockIds.indexOf(id) !== index);

    if (duplicateIds.length > 0) {
      return {
        success: false,
        errors: detailed
          ? [`Duplicate block IDs found: ${duplicateIds.join(', ')}`]
          : ['Duplicate block IDs'],
      };
    }

    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = detailed
        ? error.issues.map((e: z.ZodIssue) => `blocks.${e.path.join('.')}: ${e.message}`)
        : ['Blocks validation failed'];

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
 * Validate content JSON string and return validated data
 */
export function validateContentJson(
  jsonString: string,
  options: ValidationOptions = {}
): ValidationResult<z.infer<typeof ContentPageSchema>> {
  // First parse JSON
  const parseResult = parseJsonString(jsonString);
  if (!parseResult.success) {
    return parseResult as ValidationResult<z.infer<typeof ContentPageSchema>>;
  }

  // Then validate against schema
  return validateContentPage(parseResult.data, options);
}

/**
 * Validate a single content block
 */
export function validateContentBlock(
  data: unknown,
  options: ValidationOptions = {}
): ValidationResult<z.infer<typeof ContentBlockSchema>> {
  const { detailed = true } = options;

  try {
    const validatedData = ContentBlockSchema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = detailed
        ? error.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`)
        : ['Block validation failed'];

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

// ---------------------------------------------------------------------------
// Additional Validation Logic
// ---------------------------------------------------------------------------

/**
 * Perform additional validation beyond schema checking
 */
function performAdditionalValidation(data: z.infer<typeof ContentPageSchema>): string[] {
  const errors: string[] = [];

  // Validate block IDs are unique
  const blockIds = data.blocks.map((block) => block.id);
  const duplicateIds = blockIds.filter((id, index) => blockIds.indexOf(id) !== index);

  if (duplicateIds.length > 0) {
    errors.push(`Duplicate block IDs found: ${duplicateIds.join(', ')}`);
  }

  // Validate that grid blocks don't reference themselves
  for (const block of data.blocks) {
    if (block.type === 'grid') {
      const gridBlockIds = block.content.blocks.map((b: any) => b.id);
      if (gridBlockIds.includes(block.id)) {
        errors.push(`Grid block '${block.id}' cannot contain itself`);
      }
    }
  }

  // Validate that diagram blocks reference valid diagram IDs (basic format check)
  for (const block of data.blocks) {
    if (block.type === 'diagram') {
      if (!/^[a-z0-9-]+$/.test(block.content.diagramId)) {
        errors.push(`Diagram block '${block.id}' has invalid diagram ID format`);
      }
    }
  }

  // Validate color format (basic check for common patterns)
  for (const block of data.blocks) {
    if (block.config?.colors) {
      const colors = block.config.colors;
      const colorProperties = ['background', 'border', 'text', 'accent', 'hover'];

      for (const prop of colorProperties) {
        const colorValue = colors[prop as keyof typeof colors];
        if (colorValue && !isValidColorFormat(colorValue)) {
          errors.push(`Block '${block.id}' has invalid color format for ${prop}: ${colorValue}`);
        }
      }
    }
  }

  return errors;
}

/**
 * Basic validation for color format
 */
function isValidColorFormat(color: string): boolean {
  // Check for Tailwind classes
  if (
    /^(bg|border|text)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)$/.test(
      color
    )
  ) {
    return true;
  }

  // Check for Tailwind arbitrary values
  if (/^(bg|border|text)-\[.*\]$/.test(color)) {
    return true;
  }

  // Check for hex colors
  if (/^#[0-9A-Fa-f]{3,6}$/.test(color)) {
    return true;
  }

  // Check for CSS custom properties
  if (/^var\(--[a-zA-Z-]+\)$/.test(color)) {
    return true;
  }

  return false;
}

// ---------------------------------------------------------------------------
// Type Exports
// ---------------------------------------------------------------------------

/** Type inference from schemas */
export type ContentMetadata = z.infer<typeof ContentMetadataSchema>;
export type PageHeader = z.infer<typeof PageHeaderSchema>;
export type ColorConfig = z.infer<typeof ColorConfigSchema>;
export type LayoutConfig = z.infer<typeof LayoutConfigSchema>;
export type BehaviorConfig = z.infer<typeof BehaviorConfigSchema>;
export type BlockConfig = z.infer<typeof BlockConfigSchema>;

export type ToolItem = z.infer<typeof ToolItemSchema>;
export type ToolListContent = z.infer<typeof ToolListContentSchema>;
export type ProblemSolutionContent = z.infer<typeof ProblemSolutionContentSchema>;
export type InfoTableContent = z.infer<typeof InfoTableContentSchema>;
export type CodeHierarchyItem = z.infer<typeof CodeHierarchyItemSchema>;
export type CodeHierarchyContent = z.infer<typeof CodeHierarchyContentSchema>;
export type DiagramContent = z.infer<typeof DiagramContentSchema>;
export type GridContent = z.infer<typeof GridContentSchema>;

export type ToolListBlock = z.infer<typeof ToolListBlockSchema>;
export type ProblemSolutionBlock = z.infer<typeof ProblemSolutionBlockSchema>;
export type InfoTableBlock = z.infer<typeof InfoTableBlockSchema>;
export type CodeHierarchyBlock = z.infer<typeof CodeHierarchyBlockSchema>;
export type DiagramBlock = z.infer<typeof DiagramBlockSchema>;
export type GridBlock = z.infer<typeof GridBlockSchema>;
export type RichTextBlock = z.infer<typeof RichTextBlockSchema>;

export type ContentBlock = z.infer<typeof ContentBlockSchema>;
export type ContentPage = z.infer<typeof ContentPageSchema>;

// Note: All types already exported via 'export interface' declarations above
