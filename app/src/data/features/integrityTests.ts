// ═══════════════════════════════════════════════════════════════════════════════
// IntegrityTests Data - Extracted from IntegrityTests.tsx component
// ═══════════════════════════════════════════════════════════════════════════════
//
// This module contains all hardcoded data extracted from IntegrityTests.tsx
// to enable the component refactoring into a test execution architecture:
// - IntegrityTests.tsx (350 lines) - Container principal
// - TestRunner.tsx (120 lines) - Ejecutor tests
// - TestSuite.tsx (100 lines) - Lista de tests paginada
// - TestResults.tsx (80 lines) - Resultados + scoring

import { ecosystemStats } from '@/data/computed/stats';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type TestStatus = 'idle' | 'running' | 'pass' | 'fail' | 'warn' | 'info';

export interface TestResult {
  id: string;
  name: string;
  category: string;
  status: TestStatus;
  message: string;
  details?: string[];
  duration?: number;
}

export interface TestDefinition {
  id: string;
  name: string;
  category: string;
  type: 'sync' | 'async';
  description: string;
  expectedData?: {
    paths?: string[];
    counts?: Record<string, number>;
    patterns?: string[];
  };
}

export interface TestCategory {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  color: string;
}

export interface TestSummary {
  total: number;
  pass: number;
  fail: number;
  warn: number;
  /** Informational checks that need a server-side/CLI run — not problems. */
  info: number;
  totalDuration: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPECTED COUNTS - Dynamic values from ecosystem stats (single source of truth)
// ═══════════════════════════════════════════════════════════════════════════════

export const EXPECTED_COUNTS = {
  // DYNAMIC VALUES FROM ecosystemStats (single source of truth)
  skills: ecosystemStats.skills, // 61 (filesystem reality)
  automatedSkills: ecosystemStats.automatedSkills, // 9
  commands: ecosystemStats.commands, // 23
  rules: ecosystemStats.rules, // 5
  hooks: ecosystemStats.hooks, // 4
  mcps: ecosystemStats.mcps, // 4
  checklists: ecosystemStats.checklists, // 0 - integrated into skills
  signoffs: ecosystemStats.signoffs, // 0 - integrated into skills
  templates: ecosystemStats.templates, // 0 - integrated into skills
  validationScripts: ecosystemStats.validationScripts, // 55
  agents: ecosystemStats.agents, // 6
  docs: ecosystemStats.docsSupport, // 41 (from docsSupport)
  total: ecosystemStats.totalArtifacts, // Dynamic computed total (195)
};

// ═══════════════════════════════════════════════════════════════════════════════
// VALID ROLES - Canonical set for the ecosystem
// ═══════════════════════════════════════════════════════════════════════════════

export const VALID_ROLES = new Set([
  'PME',
  'PO',
  'TL',
  'Dev',
  'QA',
  'QA Lead',
  'Sec',
  'Sec Lead',
  'DevOps',
  'SM',
  'UX',
]);

// ═══════════════════════════════════════════════════════════════════════════════
// DOCPATHS - Known document paths for validation
// ═══════════════════════════════════════════════════════════════════════════════

// HelpCenter docPaths - all docPaths registered in HelpCenter that should resolve to files
export const HELPCENTER_DOCPATHS: string[] = [
  // Core orchestrator (1)
  'CLAUDE.md',

  // Configuration files (2)
  '.claude/settings.json',
  '.mcp.json',

  // Rules (24)
  '.claude/rules/code/principles.md',
  '.claude/rules/code/style.md',
  '.claude/rules/content/copywriting.md',
  '.claude/rules/design/web-design.md',
  '.claude/rules/frameworks/react-native.md',
  '.claude/rules/lidr-sdlc/documentation.md',
  '.claude/rules/lidr-sdlc/model-selection.md',
  '.claude/rules/lidr-sdlc/org.md',
  '.claude/rules/lidr-sdlc/project.md',
  '.claude/rules/lidr-sdlc/spec-execution.md',
  '.claude/rules/lidr-sdlc/tech-stack.md',
  '.claude/rules/lidr-sdlc/workflows.md',
  '.claude/rules/process/ai-workflow-system.md',
  '.claude/rules/process/documentation.md',
  '.claude/rules/process/git-workflow.md',
  '.claude/rules/product/mission.md',
  '.claude/rules/product/roadmap.md',
  '.claude/rules/quality/protect-secrets.md',
  '.claude/rules/quality/testing-scripts.md',
  '.claude/rules/quality/testing.md',
  '.claude/rules/team/skills-management.md',
  '.claude/rules/team/third-party-security.md',
  '.claude/rules/tools/claude-code-extensions.md',
  '.claude/rules/tools/use-context7.md',

  // Agents (10 — LIDR workers; BMad personas are skills, ADR-0008)
  '.claude/agents/lidr-doc-improver.md',
  '.claude/agents/lidr-docs-agent.md',
  '.claude/agents/lidr-metrics-agent.md',
  '.claude/agents/lidr-onboarding-agent.md',
  '.claude/agents/lidr-pr-validator.md',
  '.claude/agents/lidr-qa-agent.md',
  '.claude/agents/lidr-release-agent.md',
  '.claude/agents/lidr-security-agent.md',
  '.claude/agents/lidr-spec-orchestrator.md',
  '.claude/agents/lidr-ticket-enricher.md',

  // Hooks (6)
  '.claude/hooks/scripts/auto-format.sh',
  '.claude/hooks/scripts/frontmatter-guard.sh',
  '.claude/hooks/scripts/load-context.sh',
  '.claude/hooks/scripts/notify.sh',
  '.claude/hooks/scripts/protect-secrets.sh',
  '.claude/hooks/scripts/validate-ecosystem-counts.sh',

  // Skills (108)
  '.claude/skills/bmad-advanced-elicitation/SKILL.md',
  '.claude/skills/bmad-agent-analyst/SKILL.md',
  '.claude/skills/bmad-agent-architect/SKILL.md',
  '.claude/skills/bmad-agent-builder/SKILL.md',
  '.claude/skills/bmad-agent-dev/SKILL.md',
  '.claude/skills/bmad-agent-pm/SKILL.md',
  '.claude/skills/bmad-agent-tech-writer/SKILL.md',
  '.claude/skills/bmad-agent-ux-designer/SKILL.md',
  '.claude/skills/bmad-bmb-setup/SKILL.md',
  '.claude/skills/bmad-brainstorming/SKILL.md',
  '.claude/skills/bmad-check-implementation-readiness/SKILL.md',
  '.claude/skills/bmad-checkpoint-preview/SKILL.md',
  '.claude/skills/bmad-cis-agent-brainstorming-coach/SKILL.md',
  '.claude/skills/bmad-cis-agent-creative-problem-solver/SKILL.md',
  '.claude/skills/bmad-cis-agent-design-thinking-coach/SKILL.md',
  '.claude/skills/bmad-cis-agent-innovation-strategist/SKILL.md',
  '.claude/skills/bmad-cis-agent-presentation-master/SKILL.md',
  '.claude/skills/bmad-cis-agent-storyteller/SKILL.md',
  '.claude/skills/bmad-cis-design-thinking/SKILL.md',
  '.claude/skills/bmad-cis-innovation-strategy/SKILL.md',
  '.claude/skills/bmad-cis-problem-solving/SKILL.md',
  '.claude/skills/bmad-cis-storytelling/SKILL.md',
  '.claude/skills/bmad-code-review/SKILL.md',
  '.claude/skills/bmad-correct-course/SKILL.md',
  '.claude/skills/bmad-create-architecture/SKILL.md',
  '.claude/skills/bmad-create-epics-and-stories/SKILL.md',
  '.claude/skills/bmad-create-prd/SKILL.md',
  '.claude/skills/bmad-create-story/SKILL.md',
  '.claude/skills/bmad-ux/SKILL.md',
  '.claude/skills/bmad-customize/SKILL.md',
  '.claude/skills/bmad-dev-story/SKILL.md',
  '.claude/skills/bmad-spec/SKILL.md',
  '.claude/skills/bmad-document-project/SKILL.md',
  '.claude/skills/bmad-domain-research/SKILL.md',
  '.claude/skills/bmad-edit-prd/SKILL.md',
  '.claude/skills/bmad-editorial-review-prose/SKILL.md',
  '.claude/skills/bmad-editorial-review-structure/SKILL.md',
  '.claude/skills/bmad-eval-runner/SKILL.md',
  '.claude/skills/bmad-generate-project-context/SKILL.md',
  '.claude/skills/bmad-help/SKILL.md',
  '.claude/skills/bmad-index-docs/SKILL.md',
  '.claude/skills/bmad-investigate/SKILL.md',
  '.claude/skills/bmad-market-research/SKILL.md',
  '.claude/skills/bmad-module-builder/SKILL.md',
  '.claude/skills/bmad-module-builder/assets/setup-skill-template/SKILL.md',
  '.claude/skills/bmad-party-mode/SKILL.md',
  '.claude/skills/bmad-prd/SKILL.md',
  '.claude/skills/bmad-prfaq/SKILL.md',
  '.claude/skills/bmad-product-brief/SKILL.md',
  '.claude/skills/bmad-qa-generate-e2e-tests/SKILL.md',
  '.claude/skills/bmad-quick-dev/SKILL.md',
  '.claude/skills/bmad-retrospective/SKILL.md',
  '.claude/skills/bmad-review-adversarial-general/SKILL.md',
  '.claude/skills/bmad-review-edge-case-hunter/SKILL.md',
  '.claude/skills/bmad-shard-doc/SKILL.md',
  '.claude/skills/bmad-sprint-planning/SKILL.md',
  '.claude/skills/bmad-sprint-status/SKILL.md',
  '.claude/skills/bmad-tea/SKILL.md',
  '.claude/skills/bmad-teach-me-testing/SKILL.md',
  '.claude/skills/bmad-technical-research/SKILL.md',
  '.claude/skills/bmad-testarch-atdd/SKILL.md',
  '.claude/skills/bmad-testarch-automate/SKILL.md',
  '.claude/skills/bmad-testarch-ci/SKILL.md',
  '.claude/skills/bmad-testarch-framework/SKILL.md',
  '.claude/skills/bmad-testarch-nfr/SKILL.md',
  '.claude/skills/bmad-testarch-test-design/SKILL.md',
  '.claude/skills/bmad-testarch-test-review/SKILL.md',
  '.claude/skills/bmad-testarch-trace/SKILL.md',
  '.claude/skills/bmad-validate-prd/SKILL.md',
  '.claude/skills/bmad-workflow-builder/SKILL.md',
  '.claude/skills/lidr-agents-architecture/SKILL.md',
  '.claude/skills/lidr-adr/SKILL.md',
  '.claude/skills/lidr-audit-standards/SKILL.md',
  '.claude/skills/lidr-bug-report/SKILL.md',
  '.claude/skills/lidr-business-case/SKILL.md',
  '.claude/skills/lidr-change-request/SKILL.md',
  '.claude/skills/lidr-create-test-cases/SKILL.md',
  '.claude/skills/lidr-dast-interpretation/SKILL.md',
  '.claude/skills/lidr-dev-handoff-qa/SKILL.md',
  '.claude/skills/lidr-external-sync/SKILL.md',
  '.claude/skills/lidr-gate-evaluation/SKILL.md',
  '.claude/skills/lidr-generate-nfr/SKILL.md',
  '.claude/skills/lidr-generate-rf/SKILL.md',
  '.claude/skills/lidr-help/SKILL.md',
  '.claude/skills/lidr-impact-analysis/SKILL.md',
  '.claude/skills/lidr-kickoff/SKILL.md',
  '.claude/skills/lidr-pentest-report/SKILL.md',
  '.claude/skills/lidr-playwright-cli/SKILL.md',
  '.claude/skills/lidr-postmortem/SKILL.md',
  '.claude/skills/lidr-pr-description/SKILL.md',
  '.claude/skills/lidr-propuesta-builder/SKILL.md',
  '.claude/skills/lidr-refinement-notes/SKILL.md',
  '.claude/skills/lidr-release-notes/SKILL.md',
  '.claude/skills/lidr-review-cruzado/SKILL.md',
  '.claude/skills/lidr-risk-log/SKILL.md',
  '.claude/skills/lidr-rollback-plan/SKILL.md',
  '.claude/skills/lidr-run-parallel-tasks/SKILL.md',
  '.claude/skills/lidr-sdlc-tracking/SKILL.md',
  '.claude/skills/lidr-security-checklist/SKILL.md',
  '.claude/skills/lidr-sprint-capacity/SKILL.md',
  '.claude/skills/lidr-stakeholder-map/SKILL.md',
  '.claude/skills/lidr-tech-debt/SKILL.md',
  '.claude/skills/lidr-test-execution-report/SKILL.md',
  '.claude/skills/lidr-tracking-integration/SKILL.md',
  '.claude/skills/lidr-user-stories/SKILL.md',
  '.claude/skills/lidr-using-git-worktrees/SKILL.md',
  '.claude/skills/lidr-validate-requirements/SKILL.md',
  '.claude/skills/lidr-vuln-assessment/SKILL.md',

  // Commands (30)
  '.claude/commands/lidr-advance-gate.md',
  '.claude/commands/lidr-commit.md',
  '.claude/commands/lidr-course-correct.md',
  '.claude/commands/lidr-create-branch.md',
  '.claude/commands/lidr-create-pr.md',
  '.claude/commands/lidr-create-release-notes.md',
  '.claude/commands/lidr-create-ticket.md',
  '.claude/commands/lidr-enrich-ticket.md',
  '.claude/commands/lidr-implement-ticket.md',
  '.claude/commands/lidr-improve-docs.md',
  '.claude/commands/lidr-init-project-docs.md',
  '.claude/commands/lidr-prepare-testing.md',
  '.claude/commands/lidr-quick-dev.md',
  '.claude/commands/lidr-quick-spec.md',
  '.claude/commands/lidr-spec-apply.md',
  '.claude/commands/lidr-spec-archive.md',
  '.claude/commands/lidr-spec-bulk-archive.md',
  '.claude/commands/lidr-spec-continue.md',
  '.claude/commands/lidr-spec-ff.md',
  '.claude/commands/lidr-spec-new.md',
  '.claude/commands/lidr-spec-verify.md',
  '.claude/commands/lidr-sprint-health.md',
  '.claude/commands/lidr-sync-docs.md',
  '.claude/commands/lidr-track-sdlc.md',
  '.claude/commands/lidr-update-changelog.md',
  '.claude/commands/lidr-validate-prd.md',
  '.claude/commands/lidr-validate-project-docs.md',
  '.claude/commands/lidr-validate-requirements.md',
  '.claude/commands/sync-setup.md',
  '.claude/commands/test-hooks.md',

  // Docs (35)
  'docs/README.md',
  'docs/adr/ADR-0001-context-loading-strategy.md',
  'docs/adr/ADR-0002-react-flow-interactive-diagrams.md',
  'docs/adr/ADR-0003-tailwind-css-v4-configuration.md',
  'docs/adr/ADR-0005-multi-client-architecture.md',
  'docs/adr/ADR-0006-test-strategy.md',
  'docs/audit-results/README.md',
  'docs/guides/claude-code/README.md',
  'docs/guides/claude-code/agent-development.md',
  'docs/guides/claude-code/command-development.md',
  'docs/guides/claude-code/hook-development.md',
  'docs/guides/claude-code/mcp-integration.md',
  'docs/guides/claude-code/rule-development.md',
  'docs/guides/claude-code/skill-development-guide.md',
  'docs/guides/claude-code/skill-template-architecture.md',
  'docs/guides/client-creation-guide.md',
  'docs/guides/developer-guide.md',
  'docs/guides/lidr-core/aramis-discovery-report.md',
  'docs/guides/lidr-core/client-discovery-interview-manual-en.md',
  'docs/guides/lidr-core/client-discovery-interview-manual.md',
  'docs/guides/user-setup-guide.md',
  'docs/hooks/README.md',
  'docs/hooks/dtc-write-guard.md',
  'docs/hooks/frontmatter-guard.md',
  'docs/hooks/load-context.md',
  'docs/hooks/notify.md',
  'docs/hooks/validate-ecosystem-counts.md',
  'docs/settings-reference.md',
  'docs/standards/hooks-strategy.md',
  'docs/standards/org.md',
  'docs/standards/sprint-commitment.md',
  'docs/standards/testing/README.md',
  'docs/standards/testing/unit-testing-guide.md',
  'docs/standards/testing/visual-regression-testing.md',
  'docs/standards/tool-integrations.md',

  // Guidelines (1)
  'guidelines/Guidelines.md',
];

// SitemapView docPaths - all docPaths in SitemapView
export const SITEMAP_DOCPATHS: string[] = [
  // Core orchestrator (1)
  'CLAUDE.md',

  // Configuration files (2)
  '.claude/settings.json',
  '.mcp.json',

  // Rules (24)
  '.claude/rules/code/principles.md',
  '.claude/rules/code/style.md',
  '.claude/rules/content/copywriting.md',
  '.claude/rules/design/web-design.md',
  '.claude/rules/frameworks/react-native.md',
  '.claude/rules/lidr-sdlc/documentation.md',
  '.claude/rules/lidr-sdlc/model-selection.md',
  '.claude/rules/lidr-sdlc/org.md',
  '.claude/rules/lidr-sdlc/project.md',
  '.claude/rules/lidr-sdlc/spec-execution.md',
  '.claude/rules/lidr-sdlc/tech-stack.md',
  '.claude/rules/lidr-sdlc/workflows.md',
  '.claude/rules/process/ai-workflow-system.md',
  '.claude/rules/process/documentation.md',
  '.claude/rules/process/git-workflow.md',
  '.claude/rules/product/mission.md',
  '.claude/rules/product/roadmap.md',
  '.claude/rules/quality/protect-secrets.md',
  '.claude/rules/quality/testing-scripts.md',
  '.claude/rules/quality/testing.md',
  '.claude/rules/team/skills-management.md',
  '.claude/rules/team/third-party-security.md',
  '.claude/rules/tools/claude-code-extensions.md',
  '.claude/rules/tools/use-context7.md',

  // Agents (23)
  '.claude/agents/lidr-doc-improver.md',
  '.claude/agents/lidr-docs-agent.md',
  '.claude/agents/lidr-metrics-agent.md',
  '.claude/agents/lidr-onboarding-agent.md',
  '.claude/agents/lidr-pr-validator.md',
  '.claude/agents/lidr-qa-agent.md',
  '.claude/agents/lidr-release-agent.md',
  '.claude/agents/lidr-security-agent.md',
  '.claude/agents/lidr-spec-orchestrator.md',
  '.claude/agents/lidr-ticket-enricher.md',

  // Hooks (6)
  '.claude/hooks/scripts/auto-format.sh',
  '.claude/hooks/scripts/frontmatter-guard.sh',
  '.claude/hooks/scripts/load-context.sh',
  '.claude/hooks/scripts/notify.sh',
  '.claude/hooks/scripts/protect-secrets.sh',
  '.claude/hooks/scripts/validate-ecosystem-counts.sh',

  // Skills (108)
  '.claude/skills/bmad-advanced-elicitation/SKILL.md',
  '.claude/skills/bmad-agent-analyst/SKILL.md',
  '.claude/skills/bmad-agent-architect/SKILL.md',
  '.claude/skills/bmad-agent-builder/SKILL.md',
  '.claude/skills/bmad-agent-dev/SKILL.md',
  '.claude/skills/bmad-agent-pm/SKILL.md',
  '.claude/skills/bmad-agent-tech-writer/SKILL.md',
  '.claude/skills/bmad-agent-ux-designer/SKILL.md',
  '.claude/skills/bmad-bmb-setup/SKILL.md',
  '.claude/skills/bmad-brainstorming/SKILL.md',
  '.claude/skills/bmad-check-implementation-readiness/SKILL.md',
  '.claude/skills/bmad-checkpoint-preview/SKILL.md',
  '.claude/skills/bmad-cis-agent-brainstorming-coach/SKILL.md',
  '.claude/skills/bmad-cis-agent-creative-problem-solver/SKILL.md',
  '.claude/skills/bmad-cis-agent-design-thinking-coach/SKILL.md',
  '.claude/skills/bmad-cis-agent-innovation-strategist/SKILL.md',
  '.claude/skills/bmad-cis-agent-presentation-master/SKILL.md',
  '.claude/skills/bmad-cis-agent-storyteller/SKILL.md',
  '.claude/skills/bmad-cis-design-thinking/SKILL.md',
  '.claude/skills/bmad-cis-innovation-strategy/SKILL.md',
  '.claude/skills/bmad-cis-problem-solving/SKILL.md',
  '.claude/skills/bmad-cis-storytelling/SKILL.md',
  '.claude/skills/bmad-code-review/SKILL.md',
  '.claude/skills/bmad-correct-course/SKILL.md',
  '.claude/skills/bmad-create-architecture/SKILL.md',
  '.claude/skills/bmad-create-epics-and-stories/SKILL.md',
  '.claude/skills/bmad-create-prd/SKILL.md',
  '.claude/skills/bmad-create-story/SKILL.md',
  '.claude/skills/bmad-ux/SKILL.md',
  '.claude/skills/bmad-customize/SKILL.md',
  '.claude/skills/bmad-dev-story/SKILL.md',
  '.claude/skills/bmad-spec/SKILL.md',
  '.claude/skills/bmad-document-project/SKILL.md',
  '.claude/skills/bmad-domain-research/SKILL.md',
  '.claude/skills/bmad-edit-prd/SKILL.md',
  '.claude/skills/bmad-editorial-review-prose/SKILL.md',
  '.claude/skills/bmad-editorial-review-structure/SKILL.md',
  '.claude/skills/bmad-eval-runner/SKILL.md',
  '.claude/skills/bmad-generate-project-context/SKILL.md',
  '.claude/skills/bmad-help/SKILL.md',
  '.claude/skills/bmad-index-docs/SKILL.md',
  '.claude/skills/bmad-investigate/SKILL.md',
  '.claude/skills/bmad-market-research/SKILL.md',
  '.claude/skills/bmad-module-builder/SKILL.md',
  '.claude/skills/bmad-module-builder/assets/setup-skill-template/SKILL.md',
  '.claude/skills/bmad-party-mode/SKILL.md',
  '.claude/skills/bmad-prd/SKILL.md',
  '.claude/skills/bmad-prfaq/SKILL.md',
  '.claude/skills/bmad-product-brief/SKILL.md',
  '.claude/skills/bmad-qa-generate-e2e-tests/SKILL.md',
  '.claude/skills/bmad-quick-dev/SKILL.md',
  '.claude/skills/bmad-retrospective/SKILL.md',
  '.claude/skills/bmad-review-adversarial-general/SKILL.md',
  '.claude/skills/bmad-review-edge-case-hunter/SKILL.md',
  '.claude/skills/bmad-shard-doc/SKILL.md',
  '.claude/skills/bmad-sprint-planning/SKILL.md',
  '.claude/skills/bmad-sprint-status/SKILL.md',
  '.claude/skills/bmad-tea/SKILL.md',
  '.claude/skills/bmad-teach-me-testing/SKILL.md',
  '.claude/skills/bmad-technical-research/SKILL.md',
  '.claude/skills/bmad-testarch-atdd/SKILL.md',
  '.claude/skills/bmad-testarch-automate/SKILL.md',
  '.claude/skills/bmad-testarch-ci/SKILL.md',
  '.claude/skills/bmad-testarch-framework/SKILL.md',
  '.claude/skills/bmad-testarch-nfr/SKILL.md',
  '.claude/skills/bmad-testarch-test-design/SKILL.md',
  '.claude/skills/bmad-testarch-test-review/SKILL.md',
  '.claude/skills/bmad-testarch-trace/SKILL.md',
  '.claude/skills/bmad-validate-prd/SKILL.md',
  '.claude/skills/bmad-workflow-builder/SKILL.md',
  '.claude/skills/lidr-agents-architecture/SKILL.md',
  '.claude/skills/lidr-adr/SKILL.md',
  '.claude/skills/lidr-audit-standards/SKILL.md',
  '.claude/skills/lidr-bug-report/SKILL.md',
  '.claude/skills/lidr-business-case/SKILL.md',
  '.claude/skills/lidr-change-request/SKILL.md',
  '.claude/skills/lidr-create-test-cases/SKILL.md',
  '.claude/skills/lidr-dast-interpretation/SKILL.md',
  '.claude/skills/lidr-dev-handoff-qa/SKILL.md',
  '.claude/skills/lidr-external-sync/SKILL.md',
  '.claude/skills/lidr-gate-evaluation/SKILL.md',
  '.claude/skills/lidr-generate-nfr/SKILL.md',
  '.claude/skills/lidr-generate-rf/SKILL.md',
  '.claude/skills/lidr-help/SKILL.md',
  '.claude/skills/lidr-impact-analysis/SKILL.md',
  '.claude/skills/lidr-kickoff/SKILL.md',
  '.claude/skills/lidr-pentest-report/SKILL.md',
  '.claude/skills/lidr-playwright-cli/SKILL.md',
  '.claude/skills/lidr-postmortem/SKILL.md',
  '.claude/skills/lidr-pr-description/SKILL.md',
  '.claude/skills/lidr-propuesta-builder/SKILL.md',
  '.claude/skills/lidr-refinement-notes/SKILL.md',
  '.claude/skills/lidr-release-notes/SKILL.md',
  '.claude/skills/lidr-review-cruzado/SKILL.md',
  '.claude/skills/lidr-risk-log/SKILL.md',
  '.claude/skills/lidr-rollback-plan/SKILL.md',
  '.claude/skills/lidr-run-parallel-tasks/SKILL.md',
  '.claude/skills/lidr-sdlc-tracking/SKILL.md',
  '.claude/skills/lidr-security-checklist/SKILL.md',
  '.claude/skills/lidr-sprint-capacity/SKILL.md',
  '.claude/skills/lidr-stakeholder-map/SKILL.md',
  '.claude/skills/lidr-tech-debt/SKILL.md',
  '.claude/skills/lidr-test-execution-report/SKILL.md',
  '.claude/skills/lidr-tracking-integration/SKILL.md',
  '.claude/skills/lidr-user-stories/SKILL.md',
  '.claude/skills/lidr-using-git-worktrees/SKILL.md',
  '.claude/skills/lidr-validate-requirements/SKILL.md',
  '.claude/skills/lidr-vuln-assessment/SKILL.md',

  // Commands (30)
  '.claude/commands/lidr-advance-gate.md',
  '.claude/commands/lidr-commit.md',
  '.claude/commands/lidr-course-correct.md',
  '.claude/commands/lidr-create-branch.md',
  '.claude/commands/lidr-create-pr.md',
  '.claude/commands/lidr-create-release-notes.md',
  '.claude/commands/lidr-create-ticket.md',
  '.claude/commands/lidr-enrich-ticket.md',
  '.claude/commands/lidr-implement-ticket.md',
  '.claude/commands/lidr-improve-docs.md',
  '.claude/commands/lidr-init-project-docs.md',
  '.claude/commands/lidr-prepare-testing.md',
  '.claude/commands/lidr-quick-dev.md',
  '.claude/commands/lidr-quick-spec.md',
  '.claude/commands/lidr-spec-apply.md',
  '.claude/commands/lidr-spec-archive.md',
  '.claude/commands/lidr-spec-bulk-archive.md',
  '.claude/commands/lidr-spec-continue.md',
  '.claude/commands/lidr-spec-ff.md',
  '.claude/commands/lidr-spec-new.md',
  '.claude/commands/lidr-spec-verify.md',
  '.claude/commands/lidr-sprint-health.md',
  '.claude/commands/lidr-sync-docs.md',
  '.claude/commands/lidr-track-sdlc.md',
  '.claude/commands/lidr-update-changelog.md',
  '.claude/commands/lidr-validate-prd.md',
  '.claude/commands/lidr-validate-project-docs.md',
  '.claude/commands/lidr-validate-requirements.md',
  '.claude/commands/sync-setup.md',
  '.claude/commands/test-hooks.md',

  // Docs (35)
  'docs/README.md',
  'docs/adr/ADR-0001-context-loading-strategy.md',
  'docs/adr/ADR-0002-react-flow-interactive-diagrams.md',
  'docs/adr/ADR-0003-tailwind-css-v4-configuration.md',
  'docs/adr/ADR-0005-multi-client-architecture.md',
  'docs/adr/ADR-0006-test-strategy.md',
  'docs/audit-results/README.md',
  'docs/guides/claude-code/README.md',
  'docs/guides/claude-code/agent-development.md',
  'docs/guides/claude-code/command-development.md',
  'docs/guides/claude-code/hook-development.md',
  'docs/guides/claude-code/mcp-integration.md',
  'docs/guides/claude-code/rule-development.md',
  'docs/guides/claude-code/skill-development-guide.md',
  'docs/guides/claude-code/skill-template-architecture.md',
  'docs/guides/client-creation-guide.md',
  'docs/guides/developer-guide.md',
  'docs/guides/lidr-core/aramis-discovery-report.md',
  'docs/guides/lidr-core/client-discovery-interview-manual-en.md',
  'docs/guides/lidr-core/client-discovery-interview-manual.md',
  'docs/guides/user-setup-guide.md',
  'docs/hooks/README.md',
  'docs/hooks/dtc-write-guard.md',
  'docs/hooks/frontmatter-guard.md',
  'docs/hooks/load-context.md',
  'docs/hooks/notify.md',
  'docs/hooks/validate-ecosystem-counts.md',
  'docs/settings-reference.md',
  'docs/standards/hooks-strategy.md',
  'docs/standards/org.md',
  'docs/standards/sprint-commitment.md',
  'docs/standards/testing/README.md',
  'docs/standards/testing/unit-testing-guide.md',
  'docs/standards/testing/visual-regression-testing.md',
  'docs/standards/tool-integrations.md',

  // Guidelines (1)
  'guidelines/Guidelines.md',
];

// ═══════════════════════════════════════════════════════════════════════════════
// TEST CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════════

export const TEST_CATEGORIES: TestCategory[] = [
  {
    id: 'data-integrity',
    name: 'Integridad de Datos',
    description: 'Verificación de que todos los paths documentados resuelven a archivos reales',
    icon: 'ShieldCheck',
    color: 'emerald',
  },
  {
    id: 'cross-reference',
    name: 'Cross-Referencia',
    description: 'Consistencia entre diferentes fuentes de datos del ecosistema',
    icon: 'Brain',
    color: 'blue',
  },
  {
    id: 'legacy-cleanup',
    name: 'Legacy Cleanup',
    description: 'Detección de archivos o patrones obsoletos que deben eliminarse',
    icon: 'FileText',
    color: 'amber',
  },
  {
    id: 'naming-convention',
    name: 'Naming Convention',
    description: 'Verificación de que todos los archivos siguen las convenciones de nomenclatura',
    icon: 'Terminal',
    color: 'purple',
  },
  {
    id: 'counters',
    name: 'Contadores',
    description: 'Validación de que los contadores de artefactos son correctos',
    icon: 'Zap',
    color: 'orange',
  },
  {
    id: 'coverage',
    name: 'Cobertura',
    description: 'Verificación de cobertura completa del ecosistema',
    icon: 'Cable',
    color: 'teal',
  },
  {
    id: 'relational-validation',
    name: 'Validacion Relacional',
    description: 'Validación de relaciones entre diferentes elementos del ecosistema',
    icon: 'Link2',
    color: 'indigo',
  },
  {
    id: 'content-validation',
    name: 'Validacion de Contenido',
    description: 'Verificación del contenido interno de los archivos',
    icon: 'Search',
    color: 'pink',
  },
  {
    id: 'ecosystem-health',
    name: 'Salud del Ecosistema',
    description: 'Métricas generales de salud y completitud del ecosistema',
    icon: 'Workflow',
    color: 'cyan',
  },
  {
    id: 'sanity-check',
    name: 'Sanity Check',
    description: 'Verificaciones básicas de consistencia y lógica',
    icon: 'Users',
    color: 'green',
  },
  {
    id: 'dtc-traceability',
    name: 'Trazabilidad DTC',
    description: 'Documentation Travel With Code compliance verification',
    icon: 'Link2',
    color: 'red',
  },
  {
    id: 'agents',
    name: 'Agents',
    description: 'Verificación de compliance de especificaciones de agents',
    icon: 'Users',
    color: 'slate',
  },
  {
    id: 'cross-cutting',
    name: 'Cross-cutting',
    description: 'Verificaciones transversales del ecosistema',
    icon: 'Link2',
    color: 'gray',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// TEST DEFINITIONS - 36 tests total (T1-T36)
// ═══════════════════════════════════════════════════════════════════════════════

export const TEST_DEFINITIONS: TestDefinition[] = [
  // Sync Tests (T1-T36)
  {
    id: 't1',
    name: 'HelpCenter docPaths resuelven a archivos reales',
    category: 'data-integrity',
    type: 'sync',
    description:
      'Verifica que todos los docPaths en HelpCenter resuelven a archivos del filesystem',
    expectedData: {
      paths: HELPCENTER_DOCPATHS,
    },
  },
  {
    id: 't2',
    name: 'SitemapView docPaths resuelven a archivos reales',
    category: 'data-integrity',
    type: 'sync',
    description:
      'Verifica que todos los docPaths en SitemapView resuelven a archivos del filesystem',
    expectedData: {
      paths: SITEMAP_DOCPATHS,
    },
  },
  {
    id: 't3',
    name: 'Triple match: HelpCenter skills = SitemapView skills = Filesystem',
    category: 'cross-reference',
    type: 'sync',
    description: 'Verifica simetría perfecta entre skills en HelpCenter, SitemapView y Filesystem',
  },
  {
    id: 't4',
    name: 'Cero archivos SKILLS.md legacy (plural)',
    category: 'legacy-cleanup',
    type: 'sync',
    description: 'Detecta y reporta archivos legacy con naming incorrecto',
    expectedData: {
      patterns: ['SKILLS.md'],
    },
  },
  {
    id: 't5',
    name: 'Todos los skills usan SKILL.md (singular)',
    category: 'naming-convention',
    type: 'sync',
    description: 'Verifica convención de nomenclatura para archivos de skills',
    expectedData: {
      patterns: ['**/skills/*/SKILL.md'],
    },
  },
  {
    id: 't6',
    name: 'Artifact counts coherent (registry = filesystem = EXPECTED_COUNTS)',
    category: 'counters',
    type: 'sync',
    description:
      'Valida que skills registry == filesystem SKILL.md == EXPECTED_COUNTS.skills, y que los tipos integrados (templates/checklists/signoffs) reportan 0',
    expectedData: {
      counts: EXPECTED_COUNTS,
    },
  },
  {
    id: 't7',
    name: 'Sin docPaths duplicados en HelpCenter',
    category: 'data-integrity',
    type: 'sync',
    description: 'Detecta docPaths duplicados que pueden causar inconsistencias',
  },
  {
    id: 't8',
    name: 'Sin docPaths duplicados en SitemapView',
    category: 'data-integrity',
    type: 'sync',
    description: 'Detecta docPaths duplicados en SitemapView',
  },
  {
    id: 't9',
    name: 'Sin documentos huerfanos en filesystem (no registrados)',
    category: 'coverage',
    type: 'sync',
    description:
      'Encuentra archivos .md en filesystem que no están registrados en HelpCenter ni SitemapView',
  },
  {
    id: 't10',
    name: 'MarkdownViewer glob coverage',
    category: 'coverage',
    type: 'sync',
    description:
      'Verifica que todos los archivos necesarios están cubiertos por los globs de MarkdownViewer',
  },
  {
    id: 't11',
    name: 'HelpCenter <-> SitemapView symmetry for shared docPaths',
    category: 'cross-reference',
    type: 'sync',
    description:
      'Valida simetría entre HelpCenter y SitemapView para tipos core (skills, rules, commands)',
  },
  {
    id: 't12',
    name: 'Available filesystem docs count',
    category: 'counters',
    type: 'sync',
    description: 'Cuenta y valida número total de documentos disponibles en filesystem',
  },
  {
    id: 't13',
    name: 'Frontmatter YAML valido en todos los SKILL.md',
    category: 'content-validation',
    type: 'async',
    description: 'Verifica que todos los archivos SKILL.md tienen frontmatter YAML válido',
  },
  {
    id: 't14',
    name: 'Frontmatter YAML valido en todos los command .md',
    category: 'content-validation',
    type: 'async',
    description:
      'Verifica que todos los archivos de commands tienen frontmatter YAML válido con description',
  },
  {
    id: 't15',
    name: 'relatedSkills ref to valid skill IDs',
    category: 'relational-validation',
    type: 'sync',
    description: 'Verifica que todas las referencias relatedSkills apuntan a skill IDs válidos',
  },
  {
    id: 't16',
    name: 'Workflow artifact refs resolve to real artifact IDs',
    category: 'relational-validation',
    type: 'sync',
    description: 'Valida que las referencias de artefactos en workflows existen realmente',
  },
  {
    id: 't17',
    name: 'Triple match for commands (HC = SM = FS)',
    category: 'cross-reference',
    type: 'sync',
    description:
      'Verifica simetría perfecta entre commands en HelpCenter, SitemapView y Filesystem',
  },
  {
    id: 't18',
    name: 'Triple match for docs (checklists + signoffs + templates)',
    category: 'cross-reference',
    type: 'sync',
    description: 'Verifica consistencia de documentos de apoyo entre fuentes',
  },
  {
    id: 't19',
    name: 'Roles consistency — all roles in valid set',
    category: 'sanity-check',
    type: 'sync',
    description: 'Verifica que todos los roles usados están en el set de roles válidos',
    expectedData: {
      patterns: Array.from(VALID_ROLES),
    },
  },
  {
    id: 't20',
    name: 'Workflow coverage by SDLC gate (G0-G7)',
    category: 'ecosystem-health',
    type: 'sync',
    description:
      'Verifica que cada gate del modelo unificado (G0-G7) tiene al menos un skill que cubre su fase (vía gateContribution)',
  },
  {
    id: 't21',
    name: 'Gate contribution coverage — every gate G0-G7 has >= 1 skill',
    category: 'ecosystem-health',
    type: 'sync',
    description:
      'Itera los 8 gates (G0-G7) y verifica que cada uno tiene >= 1 skill contribuyendo (gateContribution)',
  },
  {
    id: 't22',
    name: 'Trigger uniqueness — intra-type duplicates are problematic, cross-type are healthy',
    category: 'sanity-check',
    type: 'sync',
    description: 'Analiza unicidad de triggers y detecta problemas potenciales',
  },
  {
    id: 't23',
    name: 'Repo-structure checklist owner exists (informational — checklist not in bundle)',
    category: 'coverage',
    type: 'sync',
    description:
      'Verifica que el skill dueño del checklist repo-structure (lidr-kickoff) existe. La cobertura de categorías del checklist requiere un scan server-side (no está en el bundle del cliente).',
  },
  {
    id: 't24',
    name: 'Governance scaffolding artifacts (init-project-docs, kickoff) registered',
    category: 'coverage',
    type: 'sync',
    description:
      'Verifica que los artefactos que generan el scaffolding de governance (README/CONTRIBUTING/SECURITY/CHANGELOG) están registrados: lidr-init-project-docs + lidr-kickoff',
  },
  {
    id: 't25',
    name: 'Every filesystem doc is referenced by ≥1 HelpCenter artifact',
    category: 'coverage',
    type: 'sync',
    description: 'Detecta documentos en filesystem que no están referenciados',
  },
  {
    id: 't26',
    name: 'Document Ownership Matrix — every doc with docPath has owner via artifact type',
    category: 'sanity-check',
    type: 'sync',
    description:
      'Verifica que cada documento tiene un owner claro definido por su tipo de artefacto',
  },
  {
    id: 't27',
    name: 'Agent Spec Compliance — every agent .md has required frontmatter fields',
    category: 'agents',
    type: 'sync',
    description: 'Verifica que todos los agents tienen frontmatter completo según spec',
  },
  {
    id: 't28',
    name: 'Rule Ecosystem Completeness — required LIDR SDLC rules exist',
    category: 'cross-cutting',
    type: 'sync',
    description:
      'Verifica que las 7 rules de gobernanza LIDR SDLC (org, project, tech-stack, workflows, documentation, spec-execution, model-selection) existen en el filesystem',
  },
  {
    id: 't29',
    name: 'Stats Synchronization (simple-stats.ts vs EXPECTED_COUNTS)',
    category: 'counters',
    type: 'sync',
    description: 'Verifica sincronización entre simple-stats.ts y EXPECTED_COUNTS',
  },
  {
    id: 't30',
    name: 'Automation Scripts promised count (informational — scripts not in bundle)',
    category: 'cross-cutting',
    type: 'sync',
    description:
      'Reporta el número de scripts de automatización/validación prometidos. Los scripts son Node-side y no están en el bundle del cliente; su existencia requiere un scan CLI.',
  },
  {
    id: 't31',
    name: 'ROI Calculation Consistency',
    category: 'cross-cutting',
    type: 'sync',
    description: 'Valida consistencia en los cálculos de ROI reportados',
  },
  {
    id: 't32',
    name: 'DTC governance rule present (informational — per-PR DTC is git-scoped)',
    category: 'dtc-traceability',
    type: 'sync',
    description:
      'Verifica que la rule de gobernanza DTC (documentation.md) existe. El compliance DTC por PR es una propiedad git/PR no observable desde el bundle del cliente.',
  },
  {
    id: 't33',
    name: 'Coherence Validation (informational — runs server-side via npm script)',
    category: 'ecosystem-health',
    type: 'async',
    description:
      'Recuerda ejecutar `npm run validate:coherence` (CLI) para detectar drift en datos hardcodeados. El script corre server-side y no es ejecutable desde el bundle del cliente.',
  },
  {
    id: 't34',
    name: 'Client Registry Integrity Test',
    category: 'ecosystem-health',
    type: 'sync',
    description: 'Verifica configuración completa de todos los clientes registrados',
  },
  {
    id: 't35',
    name: 'Route Configuration Test',
    category: 'ecosystem-health',
    type: 'sync',
    description: 'Valida que todas las rutas tienen componentes válidos y funcionales',
  },
  {
    id: 't36',
    name: 'Data Source Sync Test',
    category: 'cross-reference',
    type: 'sync',
    description: 'Verifica sincronización entre HelpCenter, SitemapView y MarkdownViewer',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function getTestsByCategory(categoryId: string): TestDefinition[] {
  return TEST_DEFINITIONS.filter((test) => test.category === categoryId);
}

export function getTestById(id: string): TestDefinition | undefined {
  return TEST_DEFINITIONS.find((test) => test.id === id);
}

export function getSyncTests(): TestDefinition[] {
  return TEST_DEFINITIONS.filter((test) => test.type === 'sync');
}

export function getAsyncTests(): TestDefinition[] {
  return TEST_DEFINITIONS.filter((test) => test.type === 'async');
}

export function getCategoryById(id: string): TestCategory | undefined {
  return TEST_CATEGORIES.find((category) => category.id === id);
}

export function getStatusColor(status: TestStatus): string {
  switch (status) {
    case 'pass':
      return 'bg-emerald-50 border-emerald-200';
    case 'fail':
      return 'bg-red-50 border-red-200';
    case 'warn':
      return 'bg-amber-50 border-amber-200';
    case 'info':
      return 'bg-sky-50 border-sky-200';
    case 'running':
      return 'bg-blue-50 border-blue-200';
    default:
      return 'bg-slate-50 border-slate-200';
  }
}

export function getCategoryColor(categoryId: string): string {
  const category = getCategoryById(categoryId);
  return category?.color || 'slate';
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST EXECUTION CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

export const TEST_EXECUTION_CONFIG = {
  /** Number of tests shown in placeholder during loading */
  PLACEHOLDER_COUNT: 36,
  /** Page size for paginated test display */
  TESTS_PER_PAGE: 10,
  /** Default timeout for async tests in ms */
  ASYNC_TEST_TIMEOUT: 5000,
  /** Categories that support real-time execution */
  REAL_TIME_CATEGORIES: ['data-integrity', 'counters', 'coverage'],
  /** Maximum details items shown per test */
  MAX_DETAILS_ITEMS: 50,
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  TEST_DEFINITIONS,
  TEST_CATEGORIES,
  EXPECTED_COUNTS,
  VALID_ROLES,
  HELPCENTER_DOCPATHS,
  SITEMAP_DOCPATHS,
  TEST_EXECUTION_CONFIG,
};
