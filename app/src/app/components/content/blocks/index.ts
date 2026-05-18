/**
 * Content blocks auto-registration system
 *
 * This module provides automatic registration of content block components
 * from both built-in and custom block directories. Developers can drop
 * new block components into the /custom/ folder and they will be
 * automatically registered without modifying any core files.
 *
 * Features:
 * - Auto-discovery of built-in blocks
 * - Auto-registration of custom blocks via file convention
 * - Type-safe block registry
 * - Error handling for invalid blocks
 *
 * Part of the JSON-driven content system infrastructure.
 */

import type { ComponentType } from 'react';

// ---------------------------------------------------------------------------
// Built-in Block Exports (moved to built-in/ directory)
// ---------------------------------------------------------------------------

// Component exports - using named imports to match named exports
import { ToolListBlock } from './built-in/ToolListBlock';
import { ProblemSolutionBlock } from './built-in/ProblemSolutionBlock';
import { InfoTableBlock } from './built-in/InfoTableBlock';
import { CodeHierarchyBlock } from './built-in/CodeHierarchyBlock';
import { DiagramBlock } from './built-in/DiagramBlock';
import { RichTextBlock } from './built-in/RichTextBlock';
import { GridBlock } from './built-in/GridBlock';

export {
  ToolListBlock,
  ProblemSolutionBlock,
  InfoTableBlock,
  CodeHierarchyBlock,
  DiagramBlock,
  RichTextBlock,
  GridBlock,
};

// Note: Type re-exports commented out due to isolatedModules compatibility issues
// Components can import types directly from their respective files if needed

// ---------------------------------------------------------------------------
// Block Registry Types
// ---------------------------------------------------------------------------

export interface BlockComponentInfo {
  readonly name: string;
  readonly type: string;
  readonly component: ComponentType<any>;
  readonly source: 'built-in' | 'custom';
}

export interface BlockRegistry {
  [blockType: string]: BlockComponentInfo;
}

// ---------------------------------------------------------------------------
// Auto-Registration Functions
// ---------------------------------------------------------------------------

/**
 * Loads custom blocks from the /custom/ directory using dynamic imports
 * Blocks are registered based on their filename (e.g., ChartBlock.tsx → 'chart')
 */
async function loadCustomBlocks(): Promise<BlockRegistry> {
  const customBlocks: BlockRegistry = {};

  try {
    // Use import.meta.glob to dynamically import all custom block files
    const blockFiles = import.meta.glob('./custom/*.tsx', { eager: false });

    for (const [path, moduleLoader] of Object.entries(blockFiles)) {
      const blockName = path.match(/\/([^/]+)\.tsx$/)?.[1];
      if (blockName) {
        try {
          const module = await (moduleLoader as () => Promise<any>)();
          const component = module.default || module[blockName];

          if (component) {
            const blockType = blockName.toLowerCase().replace(/block$/, '');
            customBlocks[blockType] = {
              name: blockName,
              type: blockType,
              component,
              source: 'custom',
            };
          } else {
            console.warn(`Custom block ${blockName} does not export a default component`);
          }
        } catch (error) {
          console.error(`Failed to load custom block ${blockName}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Failed to load custom blocks:', error);
  }

  return customBlocks;
}

/**
 * Loads built-in blocks using dynamic imports
 */
async function loadBuiltInBlocks(): Promise<BlockRegistry> {
  const builtInBlocks: BlockRegistry = {};

  const builtInBlocksConfig = [
    { type: 'tool-list', name: 'ToolListBlock', path: './built-in/ToolListBlock' },
    {
      type: 'problem-solution',
      name: 'ProblemSolutionBlock',
      path: './built-in/ProblemSolutionBlock',
    },
    { type: 'info-table', name: 'InfoTableBlock', path: './built-in/InfoTableBlock' },
    { type: 'code-hierarchy', name: 'CodeHierarchyBlock', path: './built-in/CodeHierarchyBlock' },
    { type: 'diagram', name: 'DiagramBlock', path: './built-in/DiagramBlock' },
    { type: 'rich-text', name: 'RichTextBlock', path: './built-in/RichTextBlock' },
    { type: 'grid', name: 'GridBlock', path: './built-in/GridBlock' },
  ];

  for (const blockConfig of builtInBlocksConfig) {
    try {
      const module = await import(blockConfig.path);
      const component = module.default;

      if (component) {
        builtInBlocks[blockConfig.type] = {
          name: blockConfig.name,
          type: blockConfig.type,
          component,
          source: 'built-in',
        };
      } else {
        console.warn(`Built-in block ${blockConfig.name} does not export a default component`);
      }
    } catch (error) {
      console.error(`Failed to load built-in block ${blockConfig.name}:`, error);
    }
  }

  return builtInBlocks;
}

/**
 * Combined registry of all blocks (built-in + custom)
 * Custom blocks can override built-in blocks
 */
let blockRegistry: BlockRegistry | null = null;

export async function getBlockRegistry(): Promise<BlockRegistry> {
  if (!blockRegistry) {
    const [builtInBlocks, customBlocks] = await Promise.all([
      loadBuiltInBlocks(),
      loadCustomBlocks(),
    ]);

    // Custom blocks override built-in blocks if they have the same type
    blockRegistry = { ...builtInBlocks, ...customBlocks };

    console.warn('Loaded blocks:', Object.keys(blockRegistry));
    if (Object.keys(customBlocks).length > 0) {
      console.warn('Custom blocks loaded:', Object.keys(customBlocks));
    }
  }

  return blockRegistry;
}

/**
 * Gets a specific block component by type
 */
export async function getBlockComponent(blockType: string): Promise<ComponentType<any> | null> {
  const registry = await getBlockRegistry();
  const blockInfo = registry[blockType];
  return blockInfo ? blockInfo.component : null;
}

/**
 * Checks if a block type is registered
 */
export async function isBlockTypeRegistered(blockType: string): Promise<boolean> {
  const registry = await getBlockRegistry();
  return blockType in registry;
}

/**
 * Gets all registered block types
 */
export async function getRegisteredBlockTypes(): Promise<string[]> {
  const registry = await getBlockRegistry();
  return Object.keys(registry);
}
