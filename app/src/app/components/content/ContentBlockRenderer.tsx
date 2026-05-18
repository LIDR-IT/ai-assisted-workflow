/**
 * ContentBlockRenderer — Router component for rendering individual content blocks
 *
 * This component acts as a router that delegates to specialized block components
 * based on the block type. It provides a unified interface for rendering all
 * content block types defined in the content schema.
 *
 * Features:
 * - Type-safe routing to specialized block components
 * - Error handling for unknown block types
 * - Error boundaries for individual blocks
 * - Fallback rendering for unsupported blocks
 *
 * Part of the JSON-driven content system infrastructure.
 */

import { useEffect, useState, type ComponentType, type JSX } from 'react';
import { AlertCircle } from 'lucide-react';
import type { ContentBlock } from '@/data/schemas/content-schema';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { getBlockComponent } from './blocks';

// ---------------------------------------------------------------------------
// Main Content Block Renderer
// ---------------------------------------------------------------------------

/**
 * Props for ContentBlockRenderer
 */
export interface ContentBlockRendererProps {
  /** The content block to render */
  readonly block: ContentBlock;
}

/**
 * Main component for rendering individual content blocks.
 *
 * This component dynamically loads and renders content blocks using the
 * auto-registration system. It supports both built-in and custom blocks.
 */
export function ContentBlockRenderer({ block }: ContentBlockRendererProps): JSX.Element {
  const [BlockComponent, setBlockComponent] = useState<ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadBlockComponent() {
      try {
        setIsLoading(true);
        setError(null);

        const component = await getBlockComponent(block.type);
        setBlockComponent(() => component); // Use function to avoid re-render issues
      } catch (err) {
        console.error(`Failed to load block component '${block.type}':`, err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }

    loadBlockComponent();
  }, [block.type]);

  // Loading state
  if (isLoading) {
    return <LoadingBlockRenderer block={block} />;
  }

  // Error during component loading
  if (error) {
    console.error(`Failed to load content block '${block.id}':`, error);
    return <ErrorBlockRenderer block={block} error={error} />;
  }

  // Block type not found
  if (!BlockComponent) {
    return <UnsupportedBlockRenderer block={block} />;
  }

  // Render the block component with error boundary
  try {
    return <BlockComponent block={block} />;
  } catch (renderError) {
    console.error(`Failed to render content block '${block.id}':`, renderError);
    return <ErrorBlockRenderer block={block} error={renderError} />;
  }
}

// ---------------------------------------------------------------------------
// State Handling Components
// ---------------------------------------------------------------------------

/**
 * Loading Block Renderer (shown while loading custom blocks)
 */
function LoadingBlockRenderer({ block }: { block: any }): JSX.Element {
  return (
    <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex items-center space-x-2 text-gray-600">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
        <span className="text-sm">Loading block '{block.type}'...</span>
      </div>
    </div>
  );
}

/**
 * Unsupported Block Type Renderer
 */
function UnsupportedBlockRenderer({ block }: { block: any }): JSX.Element {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Unsupported block type: '{block.type}' for block '{block.id}'. Add a custom block component
        at blocks/custom/{block.type.charAt(0).toUpperCase() + block.type.slice(1)}Block.tsx
      </AlertDescription>
    </Alert>
  );
}

/**
 * Error Block Renderer (for when individual blocks fail)
 */
function ErrorBlockRenderer({ block, error }: { block: any; error: any }): JSX.Element {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Failed to render block '{block.id}':{' '}
        {error instanceof Error ? error.message : 'Unknown error'}
      </AlertDescription>
    </Alert>
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export default ContentBlockRenderer;
