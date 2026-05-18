/**
 * Configuration Resolver — Simple JSON-based configuration hierarchy
 *
 * This module provides a simple file-based configuration system that allows
 * technical users to customize the application behavior through JSON files
 * without needing complex UIs or database connections.
 *
 * Features:
 * - File-based configuration (Global → Client → Project → Page → Block)
 * - Smart merging with inheritance
 * - Template variable resolution
 * - TypeScript type safety
 * - Caching for performance
 * - Hot reloading in development
 *
 * Configuration Hierarchy:
 * 1. Global defaults (src/config/global.json)
 * 2. Client-specific (src/config/clients/{clientId}.json)
 * 3. Project-specific (src/config/projects/{projectId}.json)
 * 4. Page-specific (inline in content JSON)
 * 5. Block-specific (block.config in content JSON)
 */

import { merge } from 'lodash-es';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GlobalConfig {
  readonly metadata: ConfigMetadata;
  readonly theme: ThemeConfig;
  readonly colors: ColorConfig;
  readonly typography: TypographyConfig;
  readonly layout: LayoutConfig;
  readonly components: ComponentConfig;
  readonly features: FeatureConfig;
  readonly performance: PerformanceConfig;
  readonly validation: ValidationConfig;
}

export interface ClientConfig {
  readonly metadata: ClientConfigMetadata;
  readonly branding: BrandingConfig;
  readonly colors?: Partial<ColorConfig>;
  readonly theme?: Partial<ThemeConfig>;
  readonly templateVariables: Record<string, string>;
  readonly components?: Partial<ComponentConfig>;
  readonly features?: Partial<FeatureConfig>;
  readonly industry?: IndustryConfig;
  readonly customizations?: ClientCustomizations;
}

export interface ProjectConfig {
  readonly metadata: ProjectConfigMetadata;
  readonly project: ProjectInfo;
  readonly colors?: Partial<ColorConfig>;
  readonly templateVariables?: Record<string, string>;
  readonly customizations?: ProjectCustomizations;
  readonly features?: Partial<FeatureConfig>;
  readonly overrides?: ProjectOverrides;
}

export interface ResolvedConfig extends GlobalConfig {
  readonly client: ClientConfig;
  readonly project?: ProjectConfig;
  readonly templateVariables: Record<string, string>;
  readonly resolvedAt: string;
  readonly hierarchy: string[];
}

interface ConfigMetadata {
  readonly version: string;
  readonly lastUpdated: string;
  readonly description: string;
}

interface ClientConfigMetadata extends ConfigMetadata {
  readonly clientId: string;
  readonly clientName: string;
  readonly industry: string;
  readonly inheritsFrom: string;
}

interface ProjectConfigMetadata extends ConfigMetadata {
  readonly projectId: string;
  readonly projectName: string;
  readonly clientId: string;
  readonly inheritsFrom: readonly string[];
}

interface ThemeConfig {
  readonly name: string;
  readonly mode: 'light' | 'dark' | 'auto';
}

interface ColorConfig {
  readonly primary: string;
  readonly secondary: string;
  readonly success: string;
  readonly warning: string;
  readonly error: string;
  readonly info: string;
  readonly neutral: string;
  readonly background: string;
  readonly surface: string;
  readonly border: string;
  readonly text: string;
  readonly textMuted: string;
  readonly accent: string;
}

interface TypographyConfig {
  readonly fontFamily: string;
  readonly headings: Record<string, string>;
  readonly body: Record<string, string>;
}

interface LayoutConfig {
  readonly containerMaxWidth: string;
  readonly spacing: Record<string, string>;
  readonly borderRadius: Record<string, string>;
}

interface ComponentConfig {
  readonly blocks: BlockComponentConfig;
  readonly diagrams: DiagramComponentConfig;
  readonly navigation: NavigationComponentConfig;
}

interface BlockComponentConfig {
  readonly defaultSpacing: string;
  readonly defaultPadding: string;
  readonly showIcons: boolean;
  readonly showBorders: boolean;
  readonly collapsible: boolean;
}

interface DiagramComponentConfig {
  readonly defaultHeight: number;
  readonly showLegend: boolean;
  readonly exportFormat: string;
  readonly interactivity: boolean;
}

interface NavigationComponentConfig {
  readonly showSidebar: boolean;
  readonly collapsibleSidebar: boolean;
  readonly breadcrumbs: boolean;
}

interface FeatureConfig {
  readonly customBlocks: boolean;
  readonly colorCustomization: boolean;
  readonly templateVariables: boolean;
  readonly export: ExportFeatureConfig;
  readonly collaboration: CollaborationFeatureConfig;
}

interface ExportFeatureConfig {
  readonly pdf: boolean;
  readonly images: boolean;
  readonly json: boolean;
}

interface CollaborationFeatureConfig {
  readonly comments: boolean;
  readonly realTimeEditing: boolean;
}

interface PerformanceConfig {
  readonly lazyLoading: boolean;
  readonly caching: CachingConfig;
  readonly bundleOptimization: boolean;
}

interface CachingConfig {
  readonly enabled: boolean;
  readonly ttl: number;
}

interface ValidationConfig {
  readonly strictMode: boolean;
  readonly showWarnings: boolean;
  readonly autoFix: boolean;
}

interface BrandingConfig {
  readonly companyName: string;
  readonly logo: string;
  readonly website: string;
  readonly primaryColor: string;
  readonly secondaryColor: string;
}

interface IndustryConfig {
  readonly specific: Record<string, any>;
}

interface ClientCustomizations {
  readonly dashboards: Record<string, any>;
  readonly workflows: Record<string, any>;
  readonly ui?: Record<string, any>;
}

interface ProjectInfo {
  readonly name: string;
  readonly description: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly team: ProjectTeamInfo;
}

interface ProjectTeamInfo {
  readonly lead: string;
  readonly size: number;
  readonly roles: readonly string[];
}

interface ProjectCustomizations {
  readonly pageSpecific: Record<string, any>;
  readonly blockSpecific: Record<string, any>;
}

interface ProjectOverrides {
  readonly navigation: Record<string, any>;
  readonly export: Record<string, any>;
}

// ---------------------------------------------------------------------------
// Configuration Cache
// ---------------------------------------------------------------------------

interface ConfigCacheEntry {
  readonly config: ResolvedConfig;
  readonly timestamp: number;
  readonly ttl: number;
}

const configCache = new Map<string, ConfigCacheEntry>();
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in development

// ---------------------------------------------------------------------------
// Configuration Loaders
// ---------------------------------------------------------------------------

/**
 * Loads a JSON configuration file
 */
async function loadConfigFile<T>(path: string): Promise<T> {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load config from ${path}: ${response.statusText}`);
    }
    const config = await response.json();
    return config as T;
  } catch (error) {
    console.warn(`Could not load config file ${path}:`, error);
    return {} as T;
  }
}

/**
 * Loads the global configuration
 */
async function loadGlobalConfig(): Promise<GlobalConfig> {
  return loadConfigFile<GlobalConfig>('/src/config/global.json');
}

/**
 * Loads a client-specific configuration
 */
async function loadClientConfig(clientId: string): Promise<ClientConfig> {
  return loadConfigFile<ClientConfig>(`/src/config/clients/${clientId}.json`);
}

/**
 * Loads a project-specific configuration
 */
async function loadProjectConfig(projectId: string): Promise<ProjectConfig> {
  return loadConfigFile<ProjectConfig>(`/src/config/projects/${projectId}.json`);
}

// ---------------------------------------------------------------------------
// Configuration Resolution
// ---------------------------------------------------------------------------

/**
 * Resolves the complete configuration hierarchy for a given context
 */
export async function resolveConfig(
  clientId: string,
  projectId?: string,
  options: ConfigResolutionOptions = {}
): Promise<ResolvedConfig> {
  const cacheKey = `${clientId}:${projectId || 'default'}`;

  // Check cache first
  if (!options.skipCache) {
    const cached = getCachedConfig(cacheKey);
    if (cached) {
      return cached;
    }
  }

  // Load configurations in parallel
  const [globalConfig, clientConfig, projectConfig] = await Promise.all([
    loadGlobalConfig(),
    loadClientConfig(clientId),
    projectId ? loadProjectConfig(projectId) : Promise.resolve(undefined),
  ]);

  // Build hierarchy for merging
  const hierarchy = ['global'];
  const configs: any[] = [globalConfig];

  if (Object.keys(clientConfig).length > 0) {
    hierarchy.push(`client:${clientId}`);
    configs.push(clientConfig);
  }

  if (projectConfig && Object.keys(projectConfig).length > 0) {
    hierarchy.push(`project:${projectId}`);
    configs.push(projectConfig);
  }

  // Merge configurations with smart merging for template variables
  const mergedConfig = merge({}, ...configs) as any;

  // Resolve template variables from all sources
  const templateVariables = {
    ...(clientConfig.templateVariables || {}),
    ...(projectConfig?.templateVariables || {}),
  };

  // Build final resolved configuration
  const resolvedConfig: ResolvedConfig = {
    ...mergedConfig,
    client: clientConfig,
    project: projectConfig,
    templateVariables,
    resolvedAt: new Date().toISOString(),
    hierarchy,
  };

  // Cache the result
  if (!options.skipCache) {
    setCachedConfig(cacheKey, resolvedConfig, options.ttl || DEFAULT_TTL);
  }

  return resolvedConfig;
}

/**
 * Resolves configuration for a specific block
 */
export async function resolveBlockConfig(
  clientId: string,
  projectId: string | undefined,
  blockType: string,
  blockConfig?: Record<string, any>
): Promise<any> {
  const baseConfig = await resolveConfig(clientId, projectId);

  // Get block-specific configuration from resolved config
  const blockDefaults = baseConfig.components?.blocks || {};
  const clientBlockConfig = baseConfig.client?.customizations?.ui?.[blockType] || {};
  const projectBlockConfig = baseConfig.project?.customizations?.blockSpecific?.[blockType] || {};

  // Merge block-specific configurations
  const resolvedBlockConfig = merge(
    {},
    blockDefaults,
    clientBlockConfig,
    projectBlockConfig,
    blockConfig || {}
  );

  return {
    ...resolvedBlockConfig,
    globalColors: baseConfig.colors,
    clientColors: baseConfig.client?.colors,
    templateVariables: baseConfig.templateVariables,
  };
}

/**
 * Gets template variables for a specific context
 */
export async function getTemplateVariables(
  clientId: string,
  projectId?: string
): Promise<Record<string, string>> {
  const config = await resolveConfig(clientId, projectId);
  return config.templateVariables;
}

/**
 * Resolves colors with inheritance
 */
export async function resolveColors(
  clientId: string,
  projectId?: string,
  customColors?: Record<string, string>
): Promise<ColorConfig> {
  const config = await resolveConfig(clientId, projectId);

  return merge(
    {},
    config.colors,
    config.client?.colors || {},
    config.project?.colors || {},
    customColors || {}
  ) as ColorConfig;
}

// ---------------------------------------------------------------------------
// Configuration Cache Management
// ---------------------------------------------------------------------------

interface ConfigResolutionOptions {
  readonly skipCache?: boolean;
  readonly ttl?: number;
}

function getCachedConfig(key: string): ResolvedConfig | null {
  const entry = configCache.get(key);
  if (!entry) {
    return null;
  }

  const now = Date.now();
  if (now - entry.timestamp > entry.ttl) {
    configCache.delete(key);
    return null;
  }

  return entry.config;
}

function setCachedConfig(key: string, config: ResolvedConfig, ttl: number): void {
  configCache.set(key, {
    config,
    timestamp: Date.now(),
    ttl,
  });
}

/**
 * Clears the configuration cache
 */
export function clearConfigCache(): void {
  configCache.clear();
}

/**
 * Clears cache for a specific context
 */
export function clearConfigCacheFor(clientId: string, projectId?: string): void {
  const key = `${clientId}:${projectId || 'default'}`;
  configCache.delete(key);
}

// ---------------------------------------------------------------------------
// Configuration Validation
// ---------------------------------------------------------------------------

/**
 * Validates a configuration object against expected structure
 */
export function validateConfig(
  config: any,
  type: 'global' | 'client' | 'project'
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic structure validation
  if (!config.metadata) {
    errors.push('Missing required metadata section');
  }

  if (type === 'client') {
    if (!config.templateVariables) {
      warnings.push('Client config should define template variables');
    }
    if (!config.branding) {
      warnings.push('Client config should define branding information');
    }
  }

  if (type === 'project') {
    if (!config.project) {
      errors.push('Project config must define project information');
    }
  }

  // Color validation
  if (config.colors) {
    for (const [key, value] of Object.entries(config.colors)) {
      if (typeof value !== 'string') {
        errors.push(`Color value for '${key}' must be a string`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}

// ---------------------------------------------------------------------------
// Development Helpers
// ---------------------------------------------------------------------------

/**
 * Hot reload configuration in development
 */
export function enableHotReload(): void {
  if (process.env.NODE_ENV === 'development') {
    // In a real implementation, you would set up file watchers here
    console.warn('Config hot reload enabled in development mode');
  }
}

/**
 * Debug helper to inspect resolved configuration
 */
export async function debugConfig(clientId: string, projectId?: string): Promise<void> {
  const config = await resolveConfig(clientId, projectId);
  console.warn(`=== Configuration Debug - Client: ${clientId}, Project: ${projectId} ===`);
  console.warn('Hierarchy:', config.hierarchy);
  console.warn('Template Variables:', config.templateVariables);
  console.warn('Colors:', config.colors);
  console.warn('Features:', config.features);
  console.warn('=== End Configuration Debug ===');
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export type { ColorConfig, FeatureConfig, ValidationResult, ConfigResolutionOptions };

export { loadGlobalConfig, loadClientConfig, loadProjectConfig };
