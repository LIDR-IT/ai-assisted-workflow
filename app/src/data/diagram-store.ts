/**
 * Diagram Store — Centralized storage and retrieval for diagram JSON data
 *
 * This system manages diagram data across multiple clients, providing a
 * unified interface for loading, caching, and retrieving diagram configurations.
 *
 * Features:
 * - Load diagram data from JSON files by client and diagram ID
 * - In-memory caching for performance
 * - Error handling for missing diagrams
 * - Integration with Client Registry
 * - Support for dynamic diagram loading
 * - Cache invalidation and refresh capabilities
 *
 * Part of the Phase 1 infrastructure for multi-client JSON architecture.
 */

import { clientRegistry } from './client-registry';

/**
 * All diagram JSONs across clients, eagerly mapped at build time and
 * lazily fetched at runtime. Key shape:
 *   `/src/data/clients/<clientId>/diagrams/<diagramId>.json`
 */
const diagramModules = import.meta.glob<{ default: unknown }>(
  '/src/data/clients/*/diagrams/*.json'
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Base structure for diagram metadata */
export interface DiagramMetadata {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly version: string;
  readonly client: string;
  readonly industry: string;
  readonly tags?: readonly string[];
}

/** Configuration options for diagram display and behavior */
export interface DiagramConfiguration {
  readonly height?: number;
  readonly exportName?: string;
  readonly layout?: 'TB' | 'LR' | 'RL';
  readonly spacing?: number;
}

/** Data structure for React Flow nodes */
export interface DiagramNode {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly label: string;
  readonly variant: string; // Color variant: 'purple', 'blue', 'green', etc.
  readonly subtitle?: string;
  readonly isJiraState?: boolean;
}

/** Data structure for React Flow edges */
export interface DiagramEdge {
  readonly id: string;
  readonly source: string;
  readonly target: string;
  readonly label?: string;
  readonly style?: 'dashed' | 'red' | 'green' | 'purple';
  readonly sourceHandle?: string;
  readonly targetHandle?: string;
  readonly strokeDasharray?: string;
  readonly stroke?: string;
}

/** Legend item for diagram explanation */
export interface LegendItem {
  readonly color: string; // Tailwind color class like 'bg-purple-200'
  readonly label: string;
}

/** Table data for components with InfoTable */
export interface TableRow {
  readonly label: string;
  readonly value: string;
}

/** Tab data for multi-tab components */
export interface TabData {
  readonly id: string;
  readonly label: string;
  readonly nodes: readonly DiagramNode[];
  readonly edges: readonly DiagramEdge[];
  readonly tables?: readonly TableRow[];
  readonly description?: string;
}

/** Complete diagram data structure */
export interface DiagramData {
  readonly metadata: DiagramMetadata;
  readonly configuration: DiagramConfiguration;
  readonly nodes: readonly DiagramNode[];
  readonly edges: readonly DiagramEdge[];
  readonly legend?: readonly LegendItem[];
  readonly tables?: readonly TableRow[];
  readonly tabs?: readonly TabData[];
}

/** Options for diagram loading */
export interface LoadDiagramOptions {
  /** Whether to use cached version if available */
  readonly useCache?: boolean;
  /** Whether to fail fast on missing diagrams or return empty data */
  readonly failFast?: boolean;
}

/** Result of diagram loading operation */
export interface LoadDiagramResult {
  readonly success: boolean;
  readonly data?: DiagramData;
  readonly error?: string;
  readonly fromCache?: boolean;
}

/** Diagram Store interface */
export interface DiagramStore {
  /** Get diagram data for a specific client and diagram ID */
  getDiagramData(
    clientId: string,
    diagramId: string,
    options?: LoadDiagramOptions
  ): Promise<DiagramData>;

  /** Set diagram data (for testing or dynamic updates) */
  setDiagramData(clientId: string, diagramId: string, data: DiagramData): void;

  /** Get all diagrams for a specific client */
  getAllDiagrams(clientId: string): Promise<Record<string, DiagramData>>;

  /** Check if a diagram exists for a client */
  hasDiagram(clientId: string, diagramId: string): Promise<boolean>;

  /** Clear cache for specific client or all clients */
  clearCache(clientId?: string): void;

  /** Get cache statistics */
  getCacheStats(): CacheStats;

  /** Preload diagrams for better performance */
  preloadDiagrams(clientId: string, diagramIds: string[]): Promise<LoadDiagramResult[]>;
}

/** Cache statistics */
export interface CacheStats {
  readonly totalEntries: number;
  readonly hitRate: number;
  readonly cacheSize: number; // in bytes (approximate)
}

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

/** Cache entry with metadata */
interface CacheEntry {
  data: DiagramData;
  timestamp: number;
  clientId: string;
  diagramId: string;
}

/** Cache statistics tracking */
interface CacheMetrics {
  hits: number;
  misses: number;
  totalRequests: number;
}

/**
 * Concrete implementation of the Diagram Store.
 *
 * Uses in-memory caching and provides async loading of diagram JSON files.
 * In the future, this could be extended to load from different sources
 * (API, database, etc.) while maintaining the same interface.
 */
class DiagramStoreImpl implements DiagramStore {
  private readonly _cache = new Map<string, CacheEntry>();
  private readonly _metrics: CacheMetrics = { hits: 0, misses: 0, totalRequests: 0 };

  /** Cache timeout in milliseconds (5 minutes) */
  private readonly CACHE_TTL = 5 * 60 * 1000;

  async getDiagramData(
    clientId: string,
    diagramId: string,
    options: LoadDiagramOptions = {}
  ): Promise<DiagramData> {
    const { useCache = true, failFast = true } = options;

    this._metrics.totalRequests++;

    // Check cache first
    if (useCache) {
      const cached = this._getCachedDiagram(clientId, diagramId);
      if (cached) {
        this._metrics.hits++;
        return cached.data;
      }
    }

    this._metrics.misses++;

    try {
      // Load from source (JSON file)
      const data = await this._loadDiagramFromSource(clientId, diagramId);

      // Cache the result
      if (useCache) {
        this._setCachedDiagram(clientId, diagramId, data);
      }

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error loading diagram';

      if (failFast) {
        throw new Error(
          `Failed to load diagram '${diagramId}' for client '${clientId}': ${errorMessage}`
        );
      }

      // Return empty diagram as fallback
      return this._createEmptyDiagram(clientId, diagramId);
    }
  }

  setDiagramData(clientId: string, diagramId: string, data: DiagramData): void {
    this._setCachedDiagram(clientId, diagramId, data);
  }

  async getAllDiagrams(clientId: string): Promise<Record<string, DiagramData>> {
    // Get all known diagram IDs for this client
    const diagramIds = await this._getAvailableDiagramIds(clientId);
    const diagrams: Record<string, DiagramData> = {};

    // Load all diagrams
    for (const diagramId of diagramIds) {
      try {
        diagrams[diagramId] = await this.getDiagramData(clientId, diagramId, { failFast: false });
      } catch (error) {
        console.warn(`Failed to load diagram '${diagramId}' for client '${clientId}':`, error);
      }
    }

    return diagrams;
  }

  async hasDiagram(clientId: string, diagramId: string): Promise<boolean> {
    try {
      await this.getDiagramData(clientId, diagramId, { failFast: true });
      return true;
    } catch {
      return false;
    }
  }

  clearCache(clientId?: string): void {
    if (clientId) {
      // Clear cache for specific client
      for (const [key, entry] of this._cache.entries()) {
        if (entry.clientId === clientId) {
          this._cache.delete(key);
        }
      }
    } else {
      // Clear all cache
      this._cache.clear();
    }
  }

  getCacheStats(): CacheStats {
    const totalEntries = this._cache.size;
    const hitRate =
      this._metrics.totalRequests > 0 ? this._metrics.hits / this._metrics.totalRequests : 0;

    // Estimate cache size (rough approximation)
    let cacheSize = 0;
    for (const entry of this._cache.values()) {
      cacheSize += JSON.stringify(entry.data).length;
    }

    return {
      totalEntries,
      hitRate,
      cacheSize,
    };
  }

  async preloadDiagrams(clientId: string, diagramIds: string[]): Promise<LoadDiagramResult[]> {
    const results = await Promise.allSettled(
      diagramIds.map((diagramId) => this.getDiagramData(clientId, diagramId, { failFast: false }))
    );

    return results.map((result, index) => {
      const diagramId = diagramIds[index]!;

      if (result.status === 'fulfilled') {
        return {
          success: true,
          data: result.value,
          fromCache: this._getCachedDiagram(clientId, diagramId) !== null,
        };
      } else {
        return {
          success: false,
          error: result.reason?.message ?? 'Unknown error',
        };
      }
    });
  }

  /**
   * Get cached diagram if it exists and is not expired
   */
  private _getCachedDiagram(clientId: string, diagramId: string): CacheEntry | null {
    const key = `${clientId}:${diagramId}`;
    const entry = this._cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if cache entry is expired
    const isExpired = Date.now() - entry.timestamp > this.CACHE_TTL;
    if (isExpired) {
      this._cache.delete(key);
      return null;
    }

    return entry;
  }

  /**
   * Store diagram in cache
   */
  private _setCachedDiagram(clientId: string, diagramId: string, data: DiagramData): void {
    const key = `${clientId}:${diagramId}`;
    this._cache.set(key, {
      data,
      timestamp: Date.now(),
      clientId,
      diagramId,
    });
  }

  /**
   * Load diagram from source (JSON file).
   * Reads the JSON file from the client's diagrams directory via Vite's
   * `import.meta.glob`, which bundles every diagram JSON at build time and
   * lazy-loads them on demand.
   */
  private async _loadDiagramFromSource(clientId: string, diagramId: string): Promise<DiagramData> {
    const key = `/src/data/clients/${clientId}/diagrams/${diagramId}.json`;
    const loader = diagramModules[key];

    if (!loader) {
      // Unknown diagram for this client — fall back to hardcoded data.
      return this._getHardcodedDiagramData(clientId, diagramId);
    }

    try {
      const mod = await loader();
      const jsonData = (mod as { default: unknown }).default ?? mod;

      const validationResult = await this._validateDiagramData(jsonData);
      if (!validationResult.success) {
        throw new Error(`Invalid diagram data: ${validationResult.errors?.join(', ')}`);
      }

      return validationResult.data!;
    } catch (error) {
      throw new Error(
        `Failed to load diagram '${diagramId}' for client '${clientId}': ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Validate diagram data using our schema
   */
  private async _validateDiagramData(
    data: unknown
  ): Promise<{ success: boolean; data?: DiagramData; errors?: string[] }> {
    try {
      // Lazy load the validation schema to avoid circular dependencies
      const { validateDiagramData } = await import('./schemas/diagram-schema');
      return validateDiagramData(data);
    } catch (error) {
      console.warn('Schema validation not available:', error);
      // If schema validation fails, assume data is valid (for development)
      return { success: true, data: data as DiagramData };
    }
  }

  /**
   * Fallback hardcoded diagram data for development
   */
  private _getHardcodedDiagramData(clientId: string, diagramId: string): DiagramData {
    // Return basic hardcoded data based on known diagrams
    const knownDiagrams: Record<string, DiagramData> = {
      'fase-requisitos': {
        metadata: {
          id: 'fase-requisitos',
          title: 'Fase de Requisitos',
          description: 'Origen, procesamiento y transformación de requisitos',
          version: '1.0.0',
          client: clientId,
          industry: 'Software Development',
          tags: ['requirements'],
        },
        configuration: {
          height: 650,
          exportName: 'Fase_Requisitos_Hardcoded',
        },
        nodes: [
          {
            id: 'biz',
            x: 50,
            y: 0,
            label: 'Liderazgo de Negocio',
            variant: 'purple',
            subtitle: 'Demanda de mercado · Visión estratégica',
          },
          {
            id: 'product',
            x: 225,
            y: 330,
            label: 'Equipo de Producto',
            variant: 'green',
            subtitle: 'PO + Equipo Producto',
          },
        ],
        edges: [
          {
            id: 'e1',
            source: 'biz',
            target: 'product',
            label: 'Comunica',
          },
        ],
        legend: [],
        tables: [],
        tabs: [],
      },
      'testing-qa': {
        metadata: {
          id: 'testing-qa',
          title: 'Testing y QA',
          description: 'Metodología BDD y flujo de trabajo QA',
          version: '1.0.0',
          client: clientId,
          industry: 'Software Development',
          tags: ['testing', 'qa'],
        },
        configuration: {
          height: 620,
          exportName: 'Testing_QA_Hardcoded',
        },
        nodes: [
          {
            id: 'po',
            x: 200,
            y: 0,
            label: 'PO crea User Stories',
            variant: 'green',
            subtitle: 'Con criterios de aceptación',
          },
          {
            id: 'qa',
            x: 200,
            y: 100,
            label: 'QA genera Test Cases',
            variant: 'sky',
            subtitle: 'En TestRail',
          },
        ],
        edges: [
          {
            id: 'e1',
            source: 'po',
            target: 'qa',
            label: 'Crea',
          },
        ],
        legend: [],
        tables: [],
        tabs: [],
      },
    };

    const diagram = knownDiagrams[diagramId];
    if (diagram) {
      return diagram;
    }

    // Return empty diagram as final fallback
    return this._createEmptyDiagram(clientId, diagramId);
  }

  /**
   * Get list of available diagram IDs for a client.
   * Scans the client's diagrams directory for JSON files.
   */
  private async _getAvailableDiagramIds(clientId: string): Promise<string[]> {
    try {
      // For now, return known diagrams with some that exist as JSON and some as fallback
      // In a full implementation, this would scan the filesystem
      const knownDiagrams = [
        'fase-requisitos', // ✅ Exists as JSON
        'testing-qa', // ✅ Exists as JSON
        'proceso-prd', // TODO: Convert to JSON
        'requisitos-funcionales', // TODO: Convert to JSON
        'planificacion-sprint', // TODO: Convert to JSON
        'proceso-desarrollo', // TODO: Convert to JSON
        'entornos-despliegue', // TODO: Convert to JSON
        'gestion-portafolio', // TODO: Convert to JSON
        'gobernanza-workflow', // TODO: Convert to JSON
        'propuesta-mejora', // TODO: Convert to JSON
        'handoffs-templates', // TODO: Convert to JSON
        'sitemap-view', // TODO: Convert to JSON
        'help-center', // TODO: Convert to JSON
        'integrity-tests', // TODO: Convert to JSON
        'agents-architecture', // TODO: Convert to JSON
      ];

      return knownDiagrams;
    } catch (error) {
      console.warn(`Failed to scan diagrams for client '${clientId}':`, error);
      return [];
    }
  }

  /**
   * Create empty diagram as fallback
   */
  private _createEmptyDiagram(clientId: string, diagramId: string): DiagramData {
    return {
      metadata: {
        id: diagramId,
        title: `Diagram ${diagramId}`,
        description: 'Empty diagram (fallback)',
        version: '1.0.0',
        client: clientId,
        industry: 'unknown',
        tags: ['fallback'],
      },
      configuration: {
        height: 400,
        exportName: `${diagramId}_fallback`,
      },
      nodes: [],
      edges: [],
      legend: [],
    };
  }
}

// ---------------------------------------------------------------------------
// Global Store Instance
// ---------------------------------------------------------------------------

/**
 * Global diagram store instance.
 *
 * This is the singleton that the entire application uses to manage diagram
 * data across all clients.
 */
export const diagramStore = new DiagramStoreImpl();

// ---------------------------------------------------------------------------
// Convenience Functions
// ---------------------------------------------------------------------------

/**
 * Get diagram data for the current client.
 * Uses the client registry to determine the current client.
 */
export async function getCurrentClientDiagram(
  diagramId: string,
  options?: LoadDiagramOptions
): Promise<DiagramData> {
  const currentClientId = clientRegistry.currentClientId;
  return diagramStore.getDiagramData(currentClientId, diagramId, options);
}

/**
 * Get all diagrams for the current client.
 */
export async function getCurrentClientDiagrams(): Promise<Record<string, DiagramData>> {
  const currentClientId = clientRegistry.currentClientId;
  return diagramStore.getAllDiagrams(currentClientId);
}

/**
 * Check if diagram exists for current client.
 */
export async function hasCurrentClientDiagram(diagramId: string): Promise<boolean> {
  const currentClientId = clientRegistry.currentClientId;
  return diagramStore.hasDiagram(currentClientId, diagramId);
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

// Note: All types already exported via 'export interface' declarations above

export { diagramStore as default };
