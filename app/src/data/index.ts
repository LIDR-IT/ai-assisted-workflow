/**
 * Centralized Data API — Single import point for LIDR SDLC Methodology
 *
 * This module provides a unified interface for all data systems in the application,
 * eliminating hardcoded values and ensuring consistency across components.
 *
 * Features:
 * - Skills and Commands metadata with computed statistics
 * - Phase and Gate definitions with color schemes
 * - Multi-client configuration management
 * - Template processing and variable substitution
 * - Diagram data management and caching
 * - Industry-specific customization packs
 * - Real-time validation and integrity checking
 *
 * Usage:
 * ```typescript
 * import { ecosystemStats, getSkillsByPhase, getCurrentClient } from '@/data';
 *
 * const stats = ecosystemStats; // Auto-computed ecosystem statistics
 * const phase1Skills = getSkillsByPhase(1); // Skills for specific phase
 * const client = getCurrentClient(); // Current client configuration
 * ```
 *
 * Architecture:
 * - Centralized data eliminates hardcoded values and duplication
 * - Auto-computed statistics prevent manual count maintenance
 * - Multi-client system supports different industries and configurations
 * - Template engine enables dynamic content generation
 *
 * Part of the LIDR SDLC Methodology v1.0.0 framework.
 */

// ---------------------------------------------------------------------------
// Core Data Systems - Re-export all types and utilities
// ---------------------------------------------------------------------------

/** Skills and Commands metadata with phase organization */
export * from './artifacts/skills';
export * from './artifacts/commands';

/** SDLC phases, gates, colors, and workflow definitions */
export * from './phases';

/** Multi-client configuration management and switching */
export * from './client-registry';

/** Diagram data management, caching, and metadata */
export * from './diagram-store';

/** LIDR SDLC Methodology framework definitions */
export * from './methodology';

/** Industry-specific customization packs and domain terms */
export * from './industries';

/** Template processing engine for dynamic content generation */
export * from './template-engine';

/** JSON schemas and validation utilities */
export * from './schemas';

/** Auto-computed statistics and ecosystem metrics */
export * from './computed/stats';

// ---------------------------------------------------------------------------
// Skills Management API
// ---------------------------------------------------------------------------

/**
 * Skills management utilities for querying and organizing SDLC skills.
 *
 * Skills are organized by phase (0-8) and include metadata for automation
 * status, requirements, and integration patterns.
 */
export {
  /** Get all skills for a specific SDLC phase */
  getSkillsByPhase,
  /** Get skill details by ID */
  getSkillById,
  /** Get list of automated skills (with 🤖 indicator) */
  getAutomatedSkills,
  /** Total count of skills in ecosystem */
  skillsCount,
  /** Count of automated skills */
  automatedSkillsCount,
} from './artifacts/skills';

// ---------------------------------------------------------------------------
// Commands Management API
// ---------------------------------------------------------------------------

/**
 * Commands management utilities for slash command orchestration.
 *
 * Commands are organized by tier: T1 (Orchestrators), T2 (Tactical), T3 (Utility).
 * Each command has role-based authorization and workflow integration.
 */
export {
  /** Get commands by tier (1=Orchestrators, 2=Tactical, 3=Utility) */
  getCommandsByTier,
  /** Get command details by ID */
  getCommandById,
  /** Get T1 orchestrator commands */
  getOrchestratorCommands,
  /** Get T2 tactical commands */
  getTacticalCommands,
  /** Get T3 utility commands */
  getUtilityCommands,
  /** Total count of commands in ecosystem */
  commandsCount,
} from './artifacts/commands';

// ---------------------------------------------------------------------------
// SDLC Phases and Gates API
// ---------------------------------------------------------------------------

/**
 * Phase and gate management for the 8-phase SDLC workflow.
 *
 * Provides utilities for phase navigation, color schemes, and gate validation.
 * Each phase has associated colors, gates, artifacts, and workflows.
 */
export {
  /** Get phase details by ID (0-8) */
  getPhaseById,
  /** Get gate details by ID (0-7) */
  getGateById,
  /** Get phase-specific color scheme */
  getPhaseColor,
  /** Get Tailwind CSS classes for phase colors */
  getPhaseColorClass,
  /** Get component-specific color from phase */
  getComponentColor,
  /** Get next phase in sequence */
  getNextPhase,
  /** Get previous phase in sequence */
  getPreviousPhase,
  /** Total number of SDLC phases */
  totalPhases,
  /** Total number of quality gates */
  totalGates,
  /** Phase color mappings */
  phaseColors,
  /** Phase Tailwind CSS class mappings */
  phaseColorClasses,
  /** Component color mappings */
  componentColors,
} from './phases';

// ---------------------------------------------------------------------------
// Statistics and Analytics API
// ---------------------------------------------------------------------------

/**
 * Auto-computed ecosystem statistics and summary strings.
 *
 * Eliminates hardcoded values by automatically calculating counts and metrics
 * from the source data. Updates automatically when skills/commands change.
 */
export {
  /** Comprehensive ecosystem statistics (skills, commands, automation rates) */
  ecosystemStats,
  /** Pre-computed summary strings for UI display */
  summaryStrings,
  /** Automation-specific statistics and ROI metrics */
  automationStats,
  /** Distribution of skills/commands across phases */
  phaseDistribution,
  /** Detailed skills breakdown by phase with metadata */
  skillsByPhaseDetailed as skillsByPhaseComputed,
  /** Validate data consistency and detect count mismatches */
  validateCounts,
} from './computed/stats';

// Type exports for consumers
export type { Skill } from './artifacts/skills';
export type { Command } from './artifacts/commands';
export type { Phase, Gate } from './phases';
// ClientConfig type is already exported via './client-registry' → './schemas/client-schema'
export type {
  ClientRegistry,
  ClientRegistryEvent,
  ClientRegistryListener,
} from './client-registry';
export type {
  DiagramMetadata,
  DiagramConfiguration,
  DiagramNode,
  DiagramEdge,
  LegendItem,
  TableRow,
  TabData,
  DiagramData,
  LoadDiagramOptions,
  LoadDiagramResult,
  DiagramStore,
  CacheStats,
} from './diagram-store';
export type { Methodology } from './methodology';
export type { IndustryPack, IndustryDomainTerms } from './industries';
export type {
  TemplateVariables,
  TemplateValidationResult,
  ProcessingResult,
} from './template-engine';
