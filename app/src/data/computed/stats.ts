/**
 * COMPUTED STATISTICS - Auto-generated counts and metrics
 * This file provides automatically computed statistics to eliminate hardcoded numbers
 * Phase 2: Enhanced with filesystem scanning for real-time accuracy
 */

import { skills, skillsCount, automatedSkillsCount } from '@/data/artifacts/skills';
import {
  commandsCount,
  getOrchestratorCommands,
  getTacticalCommands,
  getUtilityCommands,
} from '@/data/artifacts/commands';
import { unifiedPhases, totalPhases, totalGates } from '@/data/phases';
import fs from 'fs';
import path from 'path';

// Filesystem scanning utilities for dynamic counts
const scanDirectory = (dirPath: string, extension: string): number => {
  try {
    if (!fs.existsSync(dirPath)) {
      return 0;
    }
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    let count = 0;

    for (const file of files) {
      if (file.isDirectory()) {
        // Recursively scan subdirectories
        count += scanDirectory(path.join(dirPath, file.name), extension);
      } else if (file.isFile() && file.name.endsWith(extension)) {
        count++;
      }
    }

    return count;
  } catch (error) {
    console.warn(`Failed to scan ${dirPath}:`, error);
    return 0;
  }
};

const getMCPCount = (): number => {
  try {
    // Try local .mcp.json first (legacy LIDR layout), then repo-root one level up
    // (lidr-ecosystem monorepo: app/ is subdir, .mcp.json lives at repo root)
    const candidates = ['.mcp.json', '../.mcp.json'];
    const mcpConfigPath = candidates.find((p) => fs.existsSync(p));
    if (!mcpConfigPath) {
      return 0;
    }
    const mcpConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
    return Object.keys(mcpConfig.mcpServers || {}).length;
  } catch (error) {
    console.warn('Failed to read .mcp.json:', error);
    return 0;
  }
};

// Runtime environment detection.
// `fs` and `path` are Node-only. In the browser (Vite dev/build), they are
// externalized stubs that THROW on property access. Every filesystem helper
// below short-circuits to a safe fallback when not running in Node.
const IS_NODE =
  typeof process !== 'undefined' &&
  typeof process.versions !== 'undefined' &&
  typeof process.versions.node === 'string';

// Hardcoded fallbacks for the browser (where filesystem scanning is impossible).
// These reflect the LIDR SDLC ecosystem state captured at merge time
// (2026-05-18). The Vitest/Node side uses real scans and overrides this.
const BROWSER_FALLBACK_COUNTS = {
  rules: 24, // 7 LIDR SDLC + 17 generic (path-scoped)
  hooks: 6, // 3 LIDR (frontmatter-guard, load-context, validate-ecosystem-counts) + 3 generic (notify, auto-format, protect-secrets)
  agents: 10, // .agents/subagents/lidr-*.md (qa, release, security, onboarding, docs, metrics, doc-improver, pr-validator, ticket-enricher, spec-orchestrator)
  docsSupport: 33, // Snapshot count of LIDR docs (pre-merge state, 2026-05-18)
  validationScripts: 55, // skill validators + shared validators
  mcps: 4, // .mcp.json servers
} as const;

// Wrap a Node-only computation: returns BROWSER_FALLBACK_COUNTS[key] in the
// browser, the result of `fn()` (with try/catch) in Node, 0 on any error.
const nodeOnly = <K extends keyof typeof BROWSER_FALLBACK_COUNTS>(
  key: K,
  fn: () => number
): number => {
  if (!IS_NODE) {
    return BROWSER_FALLBACK_COUNTS[key];
  }
  try {
    return fn();
  } catch {
    return BROWSER_FALLBACK_COUNTS[key];
  }
};

// Try a list of candidate paths and use the first that exists. Node-only.
const scanFirstExisting = (candidates: string[], extension: string): number => {
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        return scanDirectory(p, extension);
      }
    } catch {
      // fs externalized in browser → try the next candidate (will also throw,
      // but the wrapping nodeOnly() catches at the top level)
    }
  }
  return 0;
};

// Dynamic filesystem-based counts.
// Each entry counts only the LIDR-specific artifacts (the methodology this app
// documents). After the 2026-05-18 merge into lidr-ecosystem, LIDR artifacts
// live under ../.agents/{rules/lidr-sdlc,subagents/lidr-*,hooks/lidr,
// skills/lidr-*,_shared/lidr/validators}. The legacy `.claude/...` paths are
// kept as fallback so the original repo continues to work standalone.
const dynamicCounts = {
  rules: () =>
    nodeOnly('rules', () =>
      scanFirstExisting(['.claude/rules', '../.agents/rules/lidr-sdlc'], '.md')
    ),
  hooks: () =>
    nodeOnly('hooks', () => scanFirstExisting(['.claude/hooks', '../.agents/hooks/lidr'], '.sh')),
  agents: () =>
    nodeOnly('agents', () => {
      if (fs.existsSync('.claude/agents')) {
        return scanDirectory('.claude/agents', '.md');
      }
      const subagentsDir = '../.agents/subagents';
      if (!fs.existsSync(subagentsDir)) {
        return 0;
      }
      return fs.readdirSync(subagentsDir).filter((f) => f.startsWith('lidr-') && f.endsWith('.md'))
        .length;
    }),
  docsSupport: () => nodeOnly('docsSupport', () => scanFirstExisting(['docs', '../docs'], '.md')),
  validationScripts: () =>
    nodeOnly('validationScripts', () => {
      // Legacy: .claude/_shared/validators/*.ts + .claude/skills/**/validate-examples.ts
      if (fs.existsSync('.claude/_shared/validators') || fs.existsSync('.claude/skills')) {
        const sharedValidators = scanDirectory('.claude/_shared/validators', '.ts') - 2;
        const skillValidators = scanDirectory('.claude/skills', 'validate-examples.ts');
        return Math.max(0, sharedValidators) + skillValidators;
      }
      // Monorepo: ../.agents/_shared/lidr/validators + ../.agents/skills/lidr-*/scripts/validate-examples.ts
      const sharedDir = '../.agents/_shared/lidr/validators';
      const skillsDir = '../.agents/skills';
      let shared = 0;
      if (fs.existsSync(sharedDir)) {
        shared = Math.max(0, scanDirectory(sharedDir, '.ts') - 2);
      }
      let skillValidators = 0;
      if (fs.existsSync(skillsDir)) {
        for (const d of fs.readdirSync(skillsDir)) {
          if (!d.startsWith('lidr-')) {
            continue;
          }
          skillValidators += scanDirectory(path.join(skillsDir, d), 'validate-examples.ts');
        }
      }
      return shared + skillValidators;
    }),
  mcps: () => nodeOnly('mcps', getMCPCount),
};

// Artifact Counts (automatically computed)
export const ecosystemStats = {
  skills: skillsCount,
  automatedSkills: automatedSkillsCount,
  commands: commandsCount,
  phases: totalPhases,
  gates: totalGates,

  // Commands by tier
  orchestratorCommands: getOrchestratorCommands().length,
  tacticalCommands: getTacticalCommands().length,
  utilityCommands: getUtilityCommands().length,

  // Additional counts (dynamically computed from filesystem)
  rules: dynamicCounts.rules(), // Auto-scanned from .claude/rules/*.md
  mcps: dynamicCounts.mcps(), // Auto-scanned from .mcp.json
  hooks: dynamicCounts.hooks(), // Auto-scanned from .claude/hooks/*.sh
  checklists: 0, // ✨ ELIMINATED - integrated into skills (8→0)
  signoffs: 0, // ✨ ELIMINATED - integrated into skills (2→0)
  agents: dynamicCounts.agents(), // Auto-scanned from .claude/agents/*.md
  docsSupport: dynamicCounts.docsSupport(), // Auto-scanned from docs/**/*.md
  templates: 0, // ✨ ELIMINATED - integrated into skills (29→0)
  validationScripts: dynamicCounts.validationScripts(), // Auto-computed: skill validators + shared validators

  // Workflow and process metrics
  workflows: 17, // TODO: Compute from actual workflow documentation
  workflowSteps: 129, // TODO: Compute from workflow step analysis
  integrityTests: 36, // T1-T36 integrity tests (added T33-T36 for enhanced coverage)
  sourcesOfTruth: 8, // Sources that need to stay synchronized

  // Computed totals
  get totalArtifacts() {
    return (
      this.skills +
      this.commands +
      this.rules +
      this.mcps +
      this.hooks +
      this.agents +
      this.docsSupport +
      this.validationScripts
      // checklists: 0 (eliminated)
      // signoffs: 0 (eliminated)
      // templates: 0 (eliminated)
    );
  },

  get totalWorkflowArtifacts() {
    return this.skills + this.commands + this.hooks + this.agents;
  },
};

// Phase Distribution — grouped by the unified 5-phase model (0-4). skill.phaseNum
// is derived from stage (skills.ts), so this is BMad-inclusive and never legacy-bucketed.
export const phaseDistribution = unifiedPhases.map((phase) => ({
  id: phase.id,
  name: phase.name,
  shortName: `F${phase.id}`,
  skillCount: skills.filter((skill) => skill.phaseNum === phase.id).length,
  color: phase.color,
  duration: '',
}));

// Skills by Phase (computed) — unified 0-4 buckets
export const skillsByPhaseDetailed = unifiedPhases.map((phase) => ({
  phase: phase.name,
  phaseNum: phase.id,
  skills: skills.filter((skill) => skill.phaseNum === phase.id),
  count: skills.filter((skill) => skill.phaseNum === phase.id).length,
}));

// Automation Statistics
export const automationStats = {
  totalSkills: skillsCount,
  automatedSkills: automatedSkillsCount,
  manualSkills: skillsCount - automatedSkillsCount,
  automationPercentage: Math.round((automatedSkillsCount / skillsCount) * 100),

  // ROI calculation (from automated skills)
  get estimatedHoursSavedPerSprint() {
    // Each automated skill saves ~6 hours per use, used ~2 times per sprint
    return this.automatedSkills * 6 * 2;
  },

  get estimatedHoursSavedPerYear() {
    // Based on real measurements from automated skills (see simple-stats.ts for details)
    return 775; // ROI real de Phase 2: security-checklist(80h) + test-plan(60h) + release-notes(50h) + rollback-plan(45h) + 5 skills anteriores(540h)
  },
};

// Summary strings for UI components (eliminating hardcoded text)
export const summaryStrings = {
  // For PropuestaMejora.tsx
  skillsStandardized: `${ecosystemStats.skills} skills estandarizados`,
  templatesCount: `${ecosystemStats.templates} templates`,
  artifactsOperational: `${ecosystemStats.totalArtifacts} artefactos operativos`,

  // For CLAUDE.md
  ecosystemTitle: `Ecosistema: ${ecosystemStats.totalArtifacts}+ artefactos`,

  // For HelpCenter.tsx
  searchableArtifacts: `${ecosystemStats.totalWorkflowArtifacts} artefactos buscables`,
  workflowsAvailable: `${ecosystemStats.workflows} workflows`,

  // For various pain point descriptions
  automationRoi: `ROI: ${automationStats.estimatedHoursSavedPerYear}+ horas/año`,
  automationPercentage: `${automationStats.automationPercentage}% automatizado`,

  // Additional computed summaries
  workflowsWithSteps: `${ecosystemStats.workflows} workflows / ${ecosystemStats.workflowSteps} steps`,
  integrityTestsCount: `${ecosystemStats.integrityTests} integrity tests (T1-T${ecosystemStats.integrityTests})`,
  sourcesOfTruthSync: `${ecosystemStats.sourcesOfTruth} fuentes de verdad sincronizadas`,
  qualityGatesCount: `${ecosystemStats.gates} Quality Gates`,
};

// Validation helpers
export const validateCounts = () => {
  const issues: string[] = [];

  // Check for missing skills in phases
  const skillsWithoutPhase = skills.filter(
    (skill) => !unifiedPhases.find((phase) => phase.id === skill.phaseNum)
  );

  if (skillsWithoutPhase.length > 0) {
    issues.push(`${skillsWithoutPhase.length} skills with invalid phase assignment`);
  }

  // Check for empty phases
  const emptyPhases = unifiedPhases.filter(
    (phase) => !skills.find((skill) => skill.phaseNum === phase.id)
  );

  if (emptyPhases.length > 0) {
    issues.push(`${emptyPhases.length} phases with no skills assigned`);
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
};

// Export for easy consumption
export default ecosystemStats;
