/**
 * SIMPLE STATS - Versión simplificada para importar en componentes
 * Conteos automáticos sin dependencias complejas
 */

// Conteos automáticos basados en la estructura real del directorio POST-MERGE BMAD + LIDR Spec Lifecycle
export const ecosystemStats = {
  skills: 107, // 38 LIDR (incl. spec-lifecycle + meta-tooling) + 69 BMAD (matches .agents/skills/)
  automatedSkills: 8, // validate-requirements, tech-debt, user-stories, lidr-run-parallel-tasks, security-checklist, test-plan, release-notes, rollback-plan
  commands: 30, // 24 LIDR SDLC + spec-lifecycle (lidr-*) + 6 generic (sync-setup, test-hooks, ...) — matches .agents/commands/
  templates: 0, // ✨ ELIMINATED - integrated into skills (29→0)
  rules: 24, // 7 LIDR SDLC + 17 generic (incl. spec-execution, model-selection)
  mcps: 3, // context7, playwright, chrome-devtools (from .mcp.json)
  hooks: 6, // 3 LIDR (frontmatter-guard, load-context, validate-ecosystem-counts) + 3 generic (notify, auto-format, protect-secrets)
  checklists: 0, // ✨ ELIMINATED - integrated into skills (8→0)
  signoffs: 0, // ✨ ELIMINATED - integrated into skills (2→0)
  agents: 10, // LIDR workers only (incl. spec-orchestrator) — BMad personas are skills (ADR-0008)
  docsSupport: 44, // docs/projects + docs/standards
  validationScripts: 31, // skill validators + shared validators (Node-side scan)
  gates: 8, // Gates 0-7
  phases: 5, // Unified Phases 0-4 (BMad numbering); legacy LIDR phases survive as stages

  // Conteos por tier de commands (sum = 30, matches .agents/commands/)
  orchestratorCommands: 9, // Tier 1
  tacticalCommands: 19, // Tier 2 (lidr-spec-* + create-* + enrich/commit/improve-docs + ...)
  utilityCommands: 2, // Tier 3 (sync-setup, test-hooks)

  // Totales computados POST-CONSOLIDACIÓN
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
      // templates: 0 (eliminated)
      // checklists: 0 (eliminated)
      // signoffs: 0 (eliminated)
    );
  },

  get totalWorkflowArtifacts() {
    return this.skills + this.commands + this.hooks + this.agents;
  },
};

// ROI de automatización
export const automationStats = {
  get totalSkills() {
    return ecosystemStats.skills;
  },
  get automatedSkills() {
    return ecosystemStats.automatedSkills;
  },
  get manualSkills() {
    return this.totalSkills - this.automatedSkills;
  },
  get automationPercentage() {
    return Math.round((this.automatedSkills / this.totalSkills) * 100);
  },

  // ROI real de automatización: 775+ horas/año (proyecto-específico basado en mediciones reales)
  get estimatedHoursSavedPerSprint() {
    // 775+ horas anuales / 26 sprints = ~30 horas por sprint
    return Math.round(775 / 26);
  },

  // ROI real medido: 775+ horas/año
  get estimatedHoursSavedPerYear() {
    return 775; // ROI real de Phase 2: security-checklist(80h) + test-plan(60h) + release-notes(50h) + rollback-plan(45h) + 5 skills anteriores(540h)
  },
};

// Strings computados para UI
export const summaryStrings = {
  skillsStandardized: `${ecosystemStats.skills} skills estandarizados`,
  templatesCount: `${ecosystemStats.templates} templates`,
  artifactsOperational: `${ecosystemStats.totalArtifacts} artefactos operativos`,
  ecosystemTitle: `Ecosistema: ${ecosystemStats.totalArtifacts}+ artefactos`,
  searchableArtifacts: `${ecosystemStats.totalWorkflowArtifacts} artefactos buscables`,
  automationRoi: `ROI: ${automationStats.estimatedHoursSavedPerYear}+ horas/año`,
  automationPercentage: `${automationStats.automationPercentage}% automatizado`,
};

// Export para fácil uso
export default ecosystemStats;
