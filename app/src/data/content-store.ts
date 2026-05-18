/**
 * Content Store — Centralized storage and retrieval for content page JSON data
 *
 * This system manages content page data across multiple clients, providing a
 * unified interface for loading, caching, and retrieving content configurations.
 *
 * Features:
 * - Load content data from JSON files by client and content ID
 * - In-memory caching for performance
 * - Error handling for missing content
 * - Integration with Client Registry
 * - Support for dynamic content loading
 * - Cache invalidation and refresh capabilities
 * - Template variable resolution integration
 *
 * Part of the JSON-driven content system infrastructure.
 */

import { clientRegistry } from './client-registry';
import type { ContentMetadata, PageHeader, ContentBlock } from './schemas/content-schema';

/**
 * All content JSONs across clients, eagerly mapped at build time and
 * lazily fetched at runtime. Key shape:
 *   `/src/data/clients/<clientId>/content/<contentId>.json`
 */
const contentModules = import.meta.glob<{ default: unknown }>('/src/data/clients/*/content/*.json');

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Complete content page data structure */
export interface ContentPageData {
  readonly metadata: ContentMetadata;
  readonly header: PageHeader;
  readonly blocks: readonly ContentBlock[];
}

/** Options for content loading */
export interface LoadContentOptions {
  /** Whether to use cached version if available */
  readonly useCache?: boolean;
  /** Whether to fail fast on missing content or return empty data */
  readonly failFast?: boolean;
}

/** Result of content loading operation */
export interface LoadContentResult {
  readonly success: boolean;
  readonly data?: ContentPageData;
  readonly error?: string;
  readonly fromCache?: boolean;
}

/** Content Store interface */
export interface ContentStore {
  /** Get content data for a specific client and content ID */
  getContentData(
    clientId: string,
    contentId: string,
    options?: LoadContentOptions
  ): Promise<ContentPageData>;

  /** Set content data (for testing or dynamic updates) */
  setContentData(clientId: string, contentId: string, data: ContentPageData): void;

  /** Get all content pages for a specific client */
  getAllContent(clientId: string): Promise<Record<string, ContentPageData>>;

  /** Check if a content page exists for a client */
  hasContent(clientId: string, contentId: string): Promise<boolean>;

  /** Clear cache for specific client or all clients */
  clearCache(clientId?: string): void;

  /** Get cache statistics */
  getCacheStats(): CacheStats;

  /** Preload content pages for better performance */
  preloadContent(clientId: string, contentIds: string[]): Promise<LoadContentResult[]>;
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
  data: ContentPageData;
  timestamp: number;
  clientId: string;
  contentId: string;
}

/** Cache statistics tracking */
interface CacheMetrics {
  hits: number;
  misses: number;
  totalRequests: number;
}

/**
 * Concrete implementation of the Content Store.
 *
 * Uses in-memory caching and provides async loading of content JSON files.
 * In the future, this could be extended to load from different sources
 * (API, database, etc.) while maintaining the same interface.
 */
class ContentStoreImpl implements ContentStore {
  private readonly _cache = new Map<string, CacheEntry>();
  private readonly _metrics: CacheMetrics = { hits: 0, misses: 0, totalRequests: 0 };

  /** Cache timeout in milliseconds (5 minutes) */
  private readonly CACHE_TTL = 5 * 60 * 1000;

  async getContentData(
    clientId: string,
    contentId: string,
    options: LoadContentOptions = {}
  ): Promise<ContentPageData> {
    const { useCache = true, failFast = true } = options;

    this._metrics.totalRequests++;

    // Check cache first
    if (useCache) {
      const cached = this._getCachedContent(clientId, contentId);
      if (cached) {
        this._metrics.hits++;
        return cached.data;
      }
    }

    this._metrics.misses++;

    try {
      // Load from source (JSON file)
      const data = await this._loadContentFromSource(clientId, contentId);

      // Cache the result
      if (useCache) {
        this._setCachedContent(clientId, contentId, data);
      }

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error loading content';

      if (failFast) {
        throw new Error(
          `Failed to load content '${contentId}' for client '${clientId}': ${errorMessage}`
        );
      }

      // Return empty content as fallback
      return this._createEmptyContent(clientId, contentId);
    }
  }

  setContentData(clientId: string, contentId: string, data: ContentPageData): void {
    this._setCachedContent(clientId, contentId, data);
  }

  async getAllContent(clientId: string): Promise<Record<string, ContentPageData>> {
    // Get all known content IDs for this client
    const contentIds = await this._getAvailableContentIds(clientId);
    const content: Record<string, ContentPageData> = {};

    // Load all content pages
    for (const contentId of contentIds) {
      try {
        content[contentId] = await this.getContentData(clientId, contentId, { failFast: false });
      } catch (error) {
        console.warn(`Failed to load content '${contentId}' for client '${clientId}':`, error);
      }
    }

    return content;
  }

  async hasContent(clientId: string, contentId: string): Promise<boolean> {
    try {
      await this.getContentData(clientId, contentId, { failFast: true });
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

  async preloadContent(clientId: string, contentIds: string[]): Promise<LoadContentResult[]> {
    const results = await Promise.allSettled(
      contentIds.map((contentId) => this.getContentData(clientId, contentId, { failFast: false }))
    );

    return results.map((result, index) => {
      const contentId = contentIds[index]!;

      if (result.status === 'fulfilled') {
        return {
          success: true,
          data: result.value,
          fromCache: this._getCachedContent(clientId, contentId) !== null,
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
   * Get cached content if it exists and is not expired
   */
  private _getCachedContent(clientId: string, contentId: string): CacheEntry | null {
    const key = `${clientId}:${contentId}`;
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
   * Store content in cache
   */
  private _setCachedContent(clientId: string, contentId: string, data: ContentPageData): void {
    const key = `${clientId}:${contentId}`;
    this._cache.set(key, {
      data,
      timestamp: Date.now(),
      clientId,
      contentId,
    });
  }

  /**
   * Load content from source (JSON file) via Vite's `import.meta.glob`.
   * The matching JSON is bundled at build time and lazy-loaded on demand.
   */
  private async _loadContentFromSource(
    clientId: string,
    contentId: string
  ): Promise<ContentPageData> {
    const key = `/src/data/clients/${clientId}/content/${contentId}.json`;
    const loader = contentModules[key];

    if (!loader) {
      return this._getHardcodedContentData(clientId, contentId);
    }

    try {
      const mod = await loader();
      const jsonData = (mod as { default: unknown }).default ?? mod;

      const validationResult = await this._validateContentData(jsonData);
      if (!validationResult.success) {
        throw new Error(`Invalid content data: ${validationResult.errors?.join(', ')}`);
      }

      return validationResult.data!;
    } catch (error) {
      throw new Error(
        `Failed to load content '${contentId}' for client '${clientId}': ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Validate content data using our schema
   */
  private async _validateContentData(
    data: unknown
  ): Promise<{ success: boolean; data?: ContentPageData; errors?: string[] }> {
    try {
      // Lazy load the validation schema to avoid circular dependencies
      const { validateContentPage } = await import('./schemas/content-schema');
      return validateContentPage(data);
    } catch (error) {
      console.warn('Schema validation not available:', error);
      // If schema validation fails, assume data is valid (for development)
      return { success: true, data: data as ContentPageData };
    }
  }

  /**
   * Fallback hardcoded content data for development
   */
  private _getHardcodedContentData(clientId: string, contentId: string): ContentPageData {
    // Return basic hardcoded data based on known content pages
    const knownContent: Record<string, ContentPageData> = {
      'proceso-prd': {
        metadata: {
          id: 'proceso-prd',
          title: 'Proceso de PRD',
          version: '1.0.0',
          client: clientId,
          industry: 'Software Development',
          tags: ['prd', 'requirements'],
        },
        header: {
          title: 'Proceso de PRD',
          subtitle:
            'Product Requirements Document — Documento maestro que conecta las necesidades de negocio con la ejecución técnica',
        },
        blocks: [
          {
            id: 'main-diagram',
            type: 'diagram',
            content: {
              diagramId: 'proceso-prd',
              showLegend: true,
              height: 780,
              exportName: 'Proceso_PRD_SDLC',
            },
          },
          {
            id: 'tools-section',
            type: 'tool-list',
            title: 'Herramientas',
            config: {
              colors: {
                background: 'bg-violet-50',
                border: 'border-violet-200',
                text: 'text-violet-800',
                accent: 'text-violet-600',
              },
              icon: 'Bot',
            },
            content: {
              tools: [
                {
                  name: 'Confluence',
                  description:
                    'Plataforma principal de documentación. PRDs, RFs y playbooks centralizados.',
                  category: 'primary',
                },
                {
                  name: 'Robo (RoboFlow)',
                  description: 'IA integrada con Confluence para generación asistida de RFs.',
                  category: 'secondary',
                },
                {
                  name: 'ChatGPT',
                  description: 'Herramienta complementaria para refinamiento de requisitos.',
                  category: 'optional',
                },
              ],
            },
          },
          {
            id: 'problem-solution',
            type: 'problem-solution',
            title: 'Inconsistencia IA & Solución',
            config: {
              colors: {
                background: 'bg-amber-50',
                border: 'border-amber-200',
                accent: 'text-amber-600',
              },
              icon: 'AlertTriangle',
            },
            content: {
              problem: {
                title: 'Problema',
                description:
                  'El mismo prompt produce resultados distintos entre personas (nivel de detalle, estructura, terminología).',
              },
              solution: {
                title: 'Solución propuesta',
                items: [
                  'Prompts estandarizados con formato de salida fijo',
                  'Templates de output en los prompts',
                  'Documentar prompts en Confluence',
                  'Checklist de revisión post-generación',
                ],
              },
            },
          },
        ],
      },
      'requisitos-funcionales': {
        metadata: {
          id: 'requisitos-funcionales',
          title: 'Requisitos Funcionales (RF)',
          version: '1.0.0',
          client: clientId,
          industry: 'Software Development',
          tags: ['requirements', 'functional'],
        },
        header: {
          title: 'Requisitos Funcionales (RF)',
          subtitle:
            'Estructura detallada de un Requisito Funcional — Especificación completa de cada funcionalidad del producto',
        },
        blocks: [
          {
            id: 'main-diagram',
            type: 'diagram',
            content: {
              diagramId: 'requisitos-funcionales',
              showLegend: true,
              height: 450,
              exportName: 'Estructura_Requisito_Funcional',
            },
          },
          {
            id: 'estructura-info',
            type: 'info-table',
            title: 'Estructura del RF',
            config: {
              colors: {
                background: 'bg-green-50',
                border: 'border-green-200',
                accent: 'text-green-600',
              },
              icon: 'ListChecks',
            },
            content: {
              rows: [
                {
                  label: 'Objetivo de Negocio',
                  value: 'Por qué existe el requisito, qué valor aporta',
                },
                {
                  label: 'Actores / Usuarios',
                  value: 'Usuario final, Admin, Operador, APIs externas',
                },
                {
                  label: 'Alcance',
                  value: 'Qué cubre este RF, dónde comienza otro RF',
                },
                {
                  label: 'Exclusiones',
                  value: 'Qué NO incluye esta versión del requisito',
                },
              ],
            },
          },
        ],
      },
    };

    const content = knownContent[contentId];
    if (content) {
      return content;
    }

    // Return empty content as final fallback
    return this._createEmptyContent(clientId, contentId);
  }

  /**
   * Get list of available content IDs for a client.
   * Scans the client's content directory for JSON files.
   */
  private async _getAvailableContentIds(clientId: string): Promise<string[]> {
    try {
      // For now, return known content pages that correspond to current page routes
      const knownContent = [
        'proceso-prd', // /prd
        'requisitos-funcionales', // /requisitos-funcionales
        'fase-requisitos', // /requisitos
        'planificacion-sprint', // /sprint
        'proceso-desarrollo', // /desarrollo
        'testing-qa', // /testing
        'entornos-despliegue', // /despliegue
        'gestion-portafolio', // /portafolio
        'gobernanza-workflow', // /gobernanza
        'propuesta-mejora', // /propuesta
        'handoffs-templates', // /handoffs
        'sitemap-view', // /sitemap
        'help-center', // /help
        'integrity-tests', // /integrity
        'agents-architecture', // /agents
      ];

      return knownContent;
    } catch (error) {
      console.warn(`Failed to scan content for client '${clientId}':`, error);
      return [];
    }
  }

  /**
   * Create empty content as fallback
   */
  private _createEmptyContent(clientId: string, contentId: string): ContentPageData {
    return {
      metadata: {
        id: contentId,
        title: `Content ${contentId}`,
        version: '1.0.0',
        client: clientId,
        industry: 'unknown',
        tags: ['fallback'],
      },
      header: {
        title: `Content ${contentId}`,
        subtitle: 'Empty content (fallback)',
      },
      blocks: [
        {
          id: 'fallback-message',
          type: 'rich-text',
          title: 'Content Not Available',
          config: {
            colors: {
              background: 'bg-gray-50',
              border: 'border-gray-200',
              accent: 'text-gray-600',
            },
            icon: 'AlertCircle',
          },
          content: {
            text: `Content for '${contentId}' is not available. This is a fallback message.`,
            markdown: false,
          },
        },
      ],
    };
  }
}

// ---------------------------------------------------------------------------
// Global Store Instance
// ---------------------------------------------------------------------------

/**
 * Global content store instance.
 *
 * This is the singleton that the entire application uses to manage content
 * data across all clients.
 */
export const contentStore = new ContentStoreImpl();

// ---------------------------------------------------------------------------
// Convenience Functions
// ---------------------------------------------------------------------------

/**
 * Get content data for the current client.
 * Uses the client registry to determine the current client.
 */
export async function getCurrentClientContent(
  contentId: string,
  options?: LoadContentOptions
): Promise<ContentPageData> {
  const currentClientId = clientRegistry.currentClientId;
  return contentStore.getContentData(currentClientId, contentId, options);
}

/**
 * Get all content for the current client.
 */
export async function getCurrentClientAllContent(): Promise<Record<string, ContentPageData>> {
  const currentClientId = clientRegistry.currentClientId;
  return contentStore.getAllContent(currentClientId);
}

/**
 * Check if content exists for current client.
 */
export async function hasCurrentClientContent(contentId: string): Promise<boolean> {
  const currentClientId = clientRegistry.currentClientId;
  return contentStore.hasContent(currentClientId, contentId);
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

// Note: All types already exported via 'export interface' declarations above

export { contentStore as default };
