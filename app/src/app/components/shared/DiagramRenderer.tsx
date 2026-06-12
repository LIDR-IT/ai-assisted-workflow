/**
 * DiagramRenderer — Generic JSON-driven diagram renderer
 *
 * This component provides a unified interface for rendering diagrams from JSON
 * data across all clients and diagram types. It integrates with the diagram
 * store, Template Engine, and existing React Flow infrastructure.
 *
 * Features:
 * - JSON to React Flow node/edge conversion
 * - Integration with existing n() and e() helpers
 * - Template variable resolution
 * - Loading states and error handling
 * - Support for all diagram types (simple flows, complex data, tabs)
 * - Export capabilities (PNG, PDF)
 * - Legend and table rendering
 * - Multi-tab diagram support
 *
 * Part of the Phase 1 infrastructure for multi-client JSON architecture.
 */

import React, { type JSX } from 'react';
import { AlertCircle, Loader2, FileText } from 'lucide-react';
import { FlowDiagram, n, e, edgeStyles } from './ReactFlowDiagram';
import type { Node, Edge } from '@xyflow/react';
import { InfoTable, Legend } from './FlowComponents';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Button } from '@/app/components/ui/button';
import { useDiagramData } from '@/hooks';
import type { DiagramData, DiagramNode, DiagramEdge, LegendItem, TabData } from '@/data';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Props for the DiagramRenderer component */
export interface DiagramRendererProps {
  /** ID of the diagram to render */
  readonly diagramId: string;

  /** Specific client ID to use (defaults to current client) */
  readonly clientId?: string;

  /** Height of the diagram */
  readonly height?: number;

  /** Name for exported files */
  readonly exportName?: string;

  /** Additional CSS classes */
  readonly className?: string;

  /** Whether to show the legend */
  readonly showLegend?: boolean;

  /** Whether to show metadata info */
  readonly showMetadata?: boolean;

  /** Whether to resolve template variables */
  readonly resolveVariables?: boolean;

  /** Loading placeholder component */
  readonly LoadingComponent?: React.ComponentType;

  /** Error component */
  readonly ErrorComponent?: React.ComponentType<{ error: string; retry: () => void }>;

  /** Callback when diagram loads successfully */
  readonly onLoad?: (data: DiagramData) => void;

  /** Callback when error occurs */
  readonly onError?: (error: string) => void;
}

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Convert JSON diagram nodes to React Flow nodes using n() helper
 */
function convertNodesToReactFlow(nodes: readonly DiagramNode[]): Node[] {
  return nodes.map((node) =>
    n(node.id, node.x, node.y, node.label, node.variant, node.subtitle, node.isJiraState)
  );
}

/**
 * Convert JSON diagram edges to React Flow edges using e() helper
 */
function convertEdgesToReactFlow(edges: readonly DiagramEdge[]): Edge[] {
  return edges.map((edge) => {
    // Apply style based on edge style property
    let edgeOpts: Partial<Edge> = {};

    if (edge.style) {
      switch (edge.style) {
        case 'dashed':
          edgeOpts = edgeStyles.dashed();
          break;
        case 'red':
          edgeOpts = edgeStyles.red;
          break;
        case 'green':
          edgeOpts = edgeStyles.green;
          break;
        case 'purple':
          edgeOpts = edgeStyles.purple;
          break;
        default:
          edgeOpts = {};
      }
    }

    // Preserve edge handles and custom styles from JSON
    if (edge.sourceHandle) {
      edgeOpts.sourceHandle = edge.sourceHandle;
    }
    if (edge.targetHandle) {
      edgeOpts.targetHandle = edge.targetHandle;
    }

    // Allow custom stroke overrides
    if (edge.strokeDasharray || edge.stroke) {
      edgeOpts.style = {
        ...(edgeOpts.style || {}),
        ...(edge.strokeDasharray ? { strokeDasharray: edge.strokeDasharray } : {}),
        ...(edge.stroke ? { stroke: String(edge.stroke) } : {}),
      };
    }

    return e(edge.id, edge.source, edge.target, edge.label, edgeOpts);
  });
}

/**
 * Render the diagram legend using the shared `Legend` component.
 *
 * Maps the (readonly) diagram legend items into the shape `Legend` expects and
 * lays them out in a two-column grid — readable even with 10+ entries. Returns
 * null for an empty legend so callers don't render an empty box.
 */
function renderLegend(legend: readonly LegendItem[]): JSX.Element | null {
  if (legend.length === 0) {
    return null;
  }

  return (
    <Legend items={legend.map((item) => ({ color: item.color, label: item.label }))} columns={2} />
  );
}

/**
 * Render metadata information
 */
function renderMetadata(data: DiagramData): JSX.Element {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center space-x-2">
          <FileText className="w-4 h-4" />
          <span>Diagram Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium">Title:</span> {data.metadata.title}
          </div>
          <div>
            <span className="font-medium">Client:</span> {data.metadata.client}
          </div>
          <div>
            <span className="font-medium">Industry:</span> {data.metadata.industry}
          </div>
          <div>
            <span className="font-medium">Version:</span> {data.metadata.version}
          </div>
          {data.metadata.tags && data.metadata.tags.length > 0 && (
            <div className="col-span-2">
              <span className="font-medium">Tags:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.metadata.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Default loading component
 */
function DefaultLoadingComponent(): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Loading diagram...</p>
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

// ---------------------------------------------------------------------------
// Component Implementation
// ---------------------------------------------------------------------------

/**
 * Generic diagram renderer that converts JSON data to React Flow diagrams.
 *
 * This component handles the complete lifecycle of diagram rendering from
 * JSON data, including loading, error states, and various diagram types.
 *
 * @param props Component props
 * @returns JSX element
 *
 * @example
 * ```tsx
 * // Basic usage
 * <DiagramRenderer diagramId="fase-requisitos" />
 *
 * // With custom options
 * <DiagramRenderer
 *   diagramId="proceso-prd"
 *   height={800}
 *   showLegend={true}
 *   showMetadata={true}
 *   onLoad={(data) => console.log('Diagram loaded:', data.metadata.title)}
 * />
 *
 * // For specific client
 * <DiagramRenderer
 *   diagramId="testing-qa"
 *   clientId="healthcare"
 *   exportName="Healthcare_Testing_QA"
 * />
 * ```
 */
export function DiagramRenderer({
  diagramId,
  clientId,
  height = 600,
  exportName,
  className,
  showLegend = true,
  showMetadata = false,
  resolveVariables = true,
  LoadingComponent = DefaultLoadingComponent,
  ErrorComponent = DefaultErrorComponent,
  onLoad,
  onError,
}: DiagramRendererProps): JSX.Element {
  const { data, isLoading, isError, error, reload } = useDiagramData(diagramId, {
    clientId,
    resolveVariables,
    onSuccess: onLoad,
    onError,
  });

  // Handle loading state
  if (isLoading) {
    return <LoadingComponent />;
  }

  // Handle error state
  if (isError || !data) {
    return <ErrorComponent error={error || 'Failed to load diagram'} retry={reload} />;
  }

  // Determine export name
  const finalExportName = exportName || data.configuration.exportName || data.metadata.id;

  // Render multi-tab diagram
  if (data.tabs && data.tabs.length > 0) {
    return (
      <div className={className}>
        {showMetadata && renderMetadata(data)}
        {showLegend && data.legend && renderLegend(data.legend)}

        <Tabs defaultValue={data.tabs[0]?.id} className="w-full">
          <TabsList
            className="grid w-full"
            style={{ gridTemplateColumns: `repeat(${data.tabs.length}, minmax(0, 1fr))` }}
          >
            {data.tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {data.tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <TabContentRenderer
                tab={tab}
                height={height}
                exportName={`${finalExportName}_${tab.id}`}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  }

  // Render single diagram
  const nodes = convertNodesToReactFlow(data.nodes);
  const edges = convertEdgesToReactFlow(data.edges);

  return (
    <div className={className}>
      {showMetadata && renderMetadata(data)}
      {showLegend && data.legend && renderLegend(data.legend)}

      <FlowDiagram nodes={nodes} edges={edges} height={height} exportName={finalExportName} />

      {data.tables && data.tables.length > 0 && (
        <div className="mt-4">
          <InfoTable
            rows={data.tables.map((table) => ({ label: table.label, value: table.value }))}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Component for rendering individual tab content
 */
function TabContentRenderer({
  tab,
  height,
  exportName,
}: {
  tab: TabData;
  height: number;
  exportName: string;
}): JSX.Element {
  const nodes = convertNodesToReactFlow(tab.nodes);
  const edges = convertEdgesToReactFlow(tab.edges);

  return (
    <div className="space-y-4">
      {tab.description && (
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">{tab.description}</p>
          </CardContent>
        </Card>
      )}

      <FlowDiagram nodes={nodes} edges={edges} height={height} exportName={exportName} />

      {tab.tables && tab.tables.length > 0 && (
        <InfoTable rows={tab.tables.map((table) => ({ label: table.label, value: table.value }))} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Convenience Components
// ---------------------------------------------------------------------------

/**
 * Diagram renderer specifically for current client diagrams.
 * Automatically uses the current client and reloads when client changes.
 */
export function CurrentClientDiagramRenderer(
  props: Omit<DiagramRendererProps, 'clientId'>
): JSX.Element {
  return <DiagramRenderer {...props} />;
}

/**
 * Compact diagram renderer without metadata or legend.
 * Useful for embeddings or previews.
 */
export function CompactDiagramRenderer(props: DiagramRendererProps): JSX.Element {
  return <DiagramRenderer {...props} showLegend={false} showMetadata={false} />;
}

/**
 * Full-featured diagram renderer with all information displayed.
 */
export function FullDiagramRenderer(props: DiagramRendererProps): JSX.Element {
  return (
    <DiagramRenderer
      {...props}
      showLegend={true}
      showMetadata={true}
      height={props.height || 800}
    />
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export default DiagramRenderer;
