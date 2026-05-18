/**
 * ContentRenderer — Main component for rendering JSON-driven content pages
 *
 * This component provides a unified interface for rendering content pages from JSON
 * data. It integrates with the content store, Template Engine, and existing UI components.
 *
 * Features:
 * - JSON to React component conversion
 * - Integration with existing shared components
 * - Template variable resolution
 * - Loading states and error handling
 * - Support for all content block types
 * - Dynamic icon resolution
 *
 * Part of the JSON-driven content system infrastructure.
 */

import { type JSX } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useContentData } from '@/hooks/useContentData';
import type { UseContentDataOptions } from '@/hooks/useContentData';
import type { ContentPage, ContentBlock } from '@/data/schemas/content-schema';
import { PageHeader, DiagramCard } from '@/app/components/shared/FlowComponents';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Button } from '@/app/components/ui/button';
import { ContentBlockRenderer } from './ContentBlockRenderer';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Props for the ContentRenderer component */
export interface ContentRendererProps {
  /** ID of the content page to render */
  readonly contentId: string;

  /** Specific client ID to use (defaults to current client) */
  readonly clientId?: string;

  /** Additional CSS classes */
  readonly className?: string;

  /** Whether to show metadata info */
  readonly showMetadata?: boolean;

  /** Whether to resolve template variables */
  readonly resolveVariables?: boolean;

  /** Loading placeholder component */
  readonly LoadingComponent?: React.ComponentType;

  /** Error component */
  readonly ErrorComponent?: React.ComponentType<{ error: string; retry: () => void }>;

  /** Callback when content loads successfully */
  readonly onLoad?: (data: ContentPage) => void;

  /** Callback when error occurs */
  readonly onError?: (error: string) => void;
}

// ---------------------------------------------------------------------------
// Default Components
// ---------------------------------------------------------------------------

/**
 * Default loading component
 */
function DefaultLoadingComponent(): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Loading content...</p>
    </div>
  );
}

/**
 * Default error component
 */
function DefaultErrorComponent({
  error,
  retry,
}: {
  error: string;
  retry: () => void;
}): JSX.Element {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>{error}</span>
        <Button variant="outline" size="sm" onClick={retry}>
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  );
}

/**
 * Content metadata display component
 */
function ContentMetadata({ data }: { data: ContentPage }): JSX.Element {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
      <h3 className="text-sm font-semibold text-slate-700 mb-2">Content Information</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="font-medium">ID:</span> {data.metadata.id}
        </div>
        <div>
          <span className="font-medium">Version:</span> {data.metadata.version}
        </div>
        <div>
          <span className="font-medium">Client:</span> {data.metadata.client}
        </div>
        <div>
          <span className="font-medium">Industry:</span> {data.metadata.industry}
        </div>
        {data.metadata.tags && data.metadata.tags.length > 0 && (
          <div className="col-span-2">
            <span className="font-medium">Tags:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {data.metadata.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

/**
 * Main content renderer component.
 *
 * This component handles the complete lifecycle of content rendering from
 * JSON data, including loading, error states, and rendering all block types.
 *
 * @param props Component props
 * @returns JSX element
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ContentRenderer contentId="proceso-prd" />
 *
 * // With custom options
 * <ContentRenderer
 *   contentId="requisitos-funcionales"
 *   showMetadata={true}
 *   resolveVariables={true}
 *   onLoad={(data) => console.log('Content loaded:', data.header.title)}
 * />
 *
 * // For specific client
 * <ContentRenderer
 *   contentId="testing-qa"
 *   clientId="healthcare"
 * />
 * ```
 */
export function ContentRenderer({
  contentId,
  clientId,
  className,
  showMetadata = false,
  resolveVariables = true,
  LoadingComponent = DefaultLoadingComponent,
  ErrorComponent = DefaultErrorComponent,
  onLoad,
  onError,
}: ContentRendererProps): JSX.Element {
  const contentOptions: UseContentDataOptions = {
    clientId,
    resolveVariables,
    onSuccess: onLoad,
    onError,
  };

  const { data, isLoading, isError, error, reload } = useContentData(contentId, contentOptions);

  // Handle loading state
  if (isLoading) {
    return (
      <div className={className}>
        <LoadingComponent />
      </div>
    );
  }

  // Handle error state
  if (isError || !data) {
    return (
      <div className={className}>
        <ErrorComponent error={error || 'Failed to load content'} retry={reload} />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Content metadata */}
      {showMetadata && <ContentMetadata data={data} />}

      {/* Page header */}
      <PageHeader title={data.header.title} subtitle={data.header.subtitle} />

      {/* Content blocks */}
      <div className="space-y-6">
        {data.blocks.map((block: ContentBlock, index: number) => (
          <ContentBlockWrapper key={block.id} block={block} index={index} />
        ))}
      </div>
    </div>
  );
}

/**
 * Wrapper component for individual content blocks
 */
function ContentBlockWrapper({
  block,
  index,
}: {
  block: ContentBlock;
  index: number;
}): JSX.Element {
  try {
    return (
      <DiagramCard key={`${block.id}-${index}`}>
        <ContentBlockRenderer block={block} />
      </DiagramCard>
    );
  } catch (error) {
    console.error(`Failed to render content block '${block.id}':`, error);

    return (
      <DiagramCard key={`${block.id}-${index}-error`}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to render block '{block.id}':{' '}
            {error instanceof Error ? error.message : 'Unknown error'}
          </AlertDescription>
        </Alert>
      </DiagramCard>
    );
  }
}

// ---------------------------------------------------------------------------
// Convenience Components
// ---------------------------------------------------------------------------

/**
 * Content renderer specifically for current client content.
 * Automatically uses the current client and reloads when client changes.
 */
export function CurrentClientContentRenderer(
  props: Omit<ContentRendererProps, 'clientId'>
): JSX.Element {
  return <ContentRenderer {...props} />;
}

/**
 * Compact content renderer without metadata.
 * Useful for embeddings or previews.
 */
export function CompactContentRenderer(props: ContentRendererProps): JSX.Element {
  return <ContentRenderer {...props} showMetadata={false} />;
}

/**
 * Full-featured content renderer with all information displayed.
 */
export function FullContentRenderer(props: ContentRendererProps): JSX.Element {
  return <ContentRenderer {...props} showMetadata={true} resolveVariables={true} />;
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export default ContentRenderer;
