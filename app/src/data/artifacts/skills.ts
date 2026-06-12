/**
 * SINGLE SOURCE OF TRUTH - Skills Registry
 * Centralizes all skills data to eliminate duplication across components
 *
 * Naming + taxonomy: every entry uses the real prefixed skill name (`lidr-*` /
 * `bmad-*`) matching `.agents/skills/` on the filesystem. Phases follow the
 * unified BMad × LIDR model — Phase 0 (Context & Anytime), 1 (Analysis),
 * 2 (Planning), 3 (Solutioning), 4 (Implementation) — with a `stage` slug for
 * the granular ex-LIDR phase.
 */

export type SkillSource = 'lidr' | 'bmad' | 'anytime';

/**
 * Unified stage slug (granular ex-LIDR phase) within a unified phase.
 */
export type SkillStage =
  | 'context'
  | 'anytime'
  | 'analysis'
  | 'planning'
  | 'specification'
  | 'sprint-planning'
  | 'development'
  | 'qa'
  | 'security'
  | 'release';

/**
 * Criticality of a LIDR skill relative to BMad base flow:
 * - 'required'    → BMad does NOT cover this; skipping leaves a real gap (mandatory in flow)
 * - 'recommended' → BMad covers partially; LIDR adds automation/Spanish/Gate-binding (skip degrades quality)
 * - 'optional'    → Niche use case (consultancy, multi-tool, Claude Code extension); skip is fine
 */
export type SkillCriticality = 'required' | 'recommended' | 'optional';

export interface Skill {
  id: string;
  name: string;
  phase: string;
  phaseNum: number;
  stage?: SkillStage;
  source: SkillSource;
  criticality?: SkillCriticality;
  description: string;
  triggers?: string[];
  roles?: string[];
  gateContribution?: string;
  docPath?: string;
  tier?: string;
  precondition?: string;
  relatedSkills?: string[];
  relatedCommands?: string[];
  automated?: boolean;
}

export const skills: Skill[] = [
  // Phase 1 — Analysis · analysis (ex-Fase 1 Originación) (4)
  {
    id: 'lidr-business-case',
    name: 'lidr-business-case',
    phase: 'Phase 1 — Analysis · analysis',
    phaseNum: 1,
    stage: 'analysis',
    source: 'lidr',
    criticality: 'required',
    description:
      'Generate a Business Case document from a business problem or initiative request. Essential for budget justification, project approval, ROI analysis.',
    triggers: [
      'create business case',
      'justify this project',
      'new initiative',
      'Gate 0 preparation',
    ],
    roles: ['PME', 'PO'],
    gateContribution: 'Gate 0',
    docPath: '.claude/skills/lidr-business-case/SKILL.md',
  },
  {
    id: 'lidr-kickoff',
    name: 'lidr-kickoff',
    phase: 'Phase 1 — Analysis · analysis',
    phaseNum: 1,
    stage: 'analysis',
    source: 'lidr',
    criticality: 'required',
    description:
      'Project Kickoff Meeting Orchestrator - structures kickoff meetings with stakeholder alignment',
    triggers: ['project kickoff', 'start project', 'initial meeting'],
    roles: ['PME', 'PO'],
    gateContribution: 'Gate 0',
    docPath: '.claude/skills/lidr-kickoff/SKILL.md',
  },
  {
    id: 'lidr-stakeholder-map',
    name: 'lidr-stakeholder-map',
    phase: 'Phase 1 — Analysis · analysis',
    phaseNum: 1,
    stage: 'analysis',
    source: 'lidr',
    criticality: 'required',
    description: 'Generate stakeholder map with power/interest matrix and communication plan',
    triggers: ['map stakeholders', 'identify stakeholders', 'communication plan'],
    roles: ['PME', 'PO'],
    gateContribution: 'Gate 0',
    docPath: '.claude/skills/lidr-stakeholder-map/SKILL.md',
  },
  {
    id: 'lidr-tracking-integration',
    name: 'lidr-tracking-integration',
    phase: 'Phase 1 — Analysis · analysis',
    phaseNum: 1,
    stage: 'analysis',
    source: 'lidr',
    criticality: 'required',
    description:
      'Tracking Integration — Adaptive Project Kickstart for any tracking tool (Jira, Linear, Notion, etc.)',
    triggers: ['create epic', 'tracking setup', 'project tracking', 'initialize tracking'],
    roles: ['PME', 'PO'],
    gateContribution: 'Gate 0',
    docPath: '.claude/skills/lidr-tracking-integration/SKILL.md',
  },

  // Phase 2 — Planning · planning (ex-Fase 2 Discovery) (3)
  {
    id: 'lidr-review-cruzado',
    name: 'lidr-review-cruzado',
    phase: 'Phase 2 — Planning · planning',
    phaseNum: 2,
    stage: 'planning',
    source: 'lidr',
    criticality: 'required',
    description:
      'Essential for PRD alignment validation in software projects. Critical for ensuring functional and technical PRDs alignment.',
    triggers: ['cross review', 'PRD review', 'validate alignment'],
    roles: ['PO', 'TL'],
    gateContribution: 'Gate 1',
    docPath: '.claude/skills/lidr-review-cruzado/SKILL.md',
  },
  {
    id: 'lidr-risk-log',
    name: 'lidr-risk-log',
    phase: 'Phase 2 — Planning · planning',
    phaseNum: 2,
    stage: 'planning',
    source: 'lidr',
    criticality: 'recommended',
    description:
      'Essential for software project risk management. Critical for identifying compliance failures, technical accuracy risks, and operational challenges.',
    triggers: ['risk management', 'identify risks', 'risk log'],
    roles: ['PO', 'TL', 'PME'],
    gateContribution: 'Gate 1',
    docPath: '.claude/skills/lidr-risk-log/SKILL.md',
  },
  {
    id: 'lidr-propuesta-builder',
    name: 'lidr-propuesta-builder',
    phase: 'Phase 2 — Planning · planning',
    phaseNum: 2,
    stage: 'planning',
    source: 'lidr',
    criticality: 'optional',
    description:
      'Generate the three JSON artifacts (diagnostico.json, mejoras.json, flujo.json) that power the Propuesta de Mejora UI for a new client from a structured discovery report markdown. Consultancy onboarding pipeline.',
    triggers: [
      'build propuesta',
      'generate propuesta JSONs',
      'onboard new client',
      'discovery to UI',
    ],
    roles: ['PME', 'TL', 'PO'],
    gateContribution: 'Gate 1',
    docPath: '.claude/skills/lidr-propuesta-builder/SKILL.md',
  },

  // Phase 3 — Solutioning · specification (ex-Fase 3 Especificación) (3)
  {
    id: 'lidr-generate-rf',
    name: 'lidr-generate-rf',
    phase: 'Phase 3 — Solutioning · specification',
    phaseNum: 3,
    stage: 'specification',
    source: 'lidr',
    criticality: 'required',
    description: 'Functional Requirements Generator with BDD criteria from PRDs',
    triggers: ['generate requirements', 'create RFs', 'functional requirements'],
    roles: ['PO'],
    gateContribution: 'Gate 2',
    docPath: '.claude/skills/lidr-generate-rf/SKILL.md',
  },
  {
    id: 'lidr-generate-nfr',
    name: 'lidr-generate-nfr',
    phase: 'Phase 3 — Solutioning · specification',
    phaseNum: 3,
    stage: 'specification',
    source: 'lidr',
    criticality: 'required',
    description: 'Non-Functional Requirements Generator with measurable metrics',
    triggers: ['generate NFRs', 'non-functional requirements', 'performance requirements'],
    roles: ['TL', 'Tech Lead'],
    gateContribution: 'Gate 2',
    docPath: '.claude/skills/lidr-generate-nfr/SKILL.md',
  },
  {
    id: 'lidr-validate-requirements',
    name: 'lidr-validate-requirements',
    phase: 'Phase 3 — Solutioning · specification',
    phaseNum: 3,
    stage: 'specification',
    source: 'lidr',
    criticality: 'required',
    description:
      'AUTOMATED cross-validation of RFs and NFRs against PRDs. Executes 5-pass validation in <5 minutes vs 6+ hours manual.',
    triggers: ['validate requirements', 'check traceability', 'RTM validation'],
    roles: ['PO', 'TL', 'QA'],
    gateContribution: 'Gate 2',
    docPath: '.claude/skills/lidr-validate-requirements/SKILL.md',
    automated: true,
  },

  // Phase 3 — Solutioning · sprint-planning (ex-Fase 4 Sprint Planning) (3)
  {
    id: 'lidr-user-stories',
    name: 'lidr-user-stories',
    phase: 'Phase 3 — Solutioning · sprint-planning',
    phaseNum: 4,
    stage: 'sprint-planning',
    source: 'lidr',
    criticality: 'required',
    description:
      'AUTOMATED User Story generation with intelligent RF slicing using 8 proven patterns. Transforms 2-4 hour manual slicing.',
    triggers: ['generate user stories', 'create stories', 'story slicing'],
    roles: ['PO'],
    gateContribution: 'Gate 3',
    docPath: '.claude/skills/lidr-user-stories/SKILL.md',
    automated: true,
  },
  {
    id: 'lidr-sprint-capacity',
    name: 'lidr-sprint-capacity',
    phase: 'Phase 3 — Solutioning · sprint-planning',
    phaseNum: 4,
    stage: 'sprint-planning',
    source: 'lidr',
    criticality: 'recommended',
    description:
      'Essential for software project sprint planning. Critical for accurately planning feature development and capacity estimation.',
    triggers: ['sprint planning', 'capacity planning', 'team velocity'],
    roles: ['SM', 'TL'],
    gateContribution: 'Gate 3',
    docPath: '.claude/skills/lidr-sprint-capacity/SKILL.md',
  },
  {
    id: 'lidr-refinement-notes',
    name: 'lidr-refinement-notes',
    phase: 'Phase 3 — Solutioning · sprint-planning',
    phaseNum: 4,
    stage: 'sprint-planning',
    source: 'lidr',
    criticality: 'recommended',
    description: 'Essential for user story refinement during backlog grooming sessions',
    triggers: ['refinement session', 'backlog grooming', 'story refinement'],
    roles: ['SM', 'PO', 'TL'],
    gateContribution: 'Gate 3',
    docPath: '.claude/skills/lidr-refinement-notes/SKILL.md',
  },

  // Phase 4 — Implementation · development (ex-Fase 5 Desarrollo) (7)
  {
    id: 'lidr-using-git-worktrees',
    name: 'lidr-using-git-worktrees',
    phase: 'Phase 4 — Implementation · development',
    phaseNum: 5,
    stage: 'development',
    source: 'lidr',
    criticality: 'recommended',
    description:
      'Create, use, and clean up isolated git worktrees so an agent can work on multiple features in parallel without contaminating the main checkout. Prerequisite of lidr-run-parallel-tasks.',
    triggers: ['use a worktree', 'isolate this work', 'run the change in a worktree'],
    roles: ['Dev', 'TL'],
    gateContribution: 'Gate 4',
    docPath: '.claude/skills/lidr-using-git-worktrees/SKILL.md',
    relatedSkills: ['lidr-run-parallel-tasks'],
  },
  {
    id: 'lidr-run-parallel-tasks',
    name: 'lidr-run-parallel-tasks',
    phase: 'Phase 4 — Implementation · development',
    phaseNum: 5,
    stage: 'development',
    source: 'lidr',
    criticality: 'optional',
    description:
      'Run N change-driven features in parallel, each in its own git worktree, following the full LIDR spec lifecycle (enrich → new → ff → apply → verify). Requires Opus high reasoning.',
    triggers: ['run parallel-tasks.md', 'run the parallel changes', 'lanza los tasks en paralelo'],
    roles: ['TL'],
    gateContribution: 'Gate 4',
    docPath: '.claude/skills/lidr-run-parallel-tasks/SKILL.md',
    automated: true,
    relatedSkills: ['lidr-using-git-worktrees'],
    relatedCommands: ['lidr-spec-new', 'lidr-spec-ff', 'lidr-spec-apply', 'lidr-spec-verify'],
  },
  {
    id: 'lidr-pr-description',
    name: 'lidr-pr-description',
    phase: 'Phase 4 — Implementation · development',
    phaseNum: 5,
    stage: 'development',
    source: 'lidr',
    criticality: 'required',
    description:
      'Generate structured Pull Request description from git diff and Jira ticket context',
    triggers: ['PR description', 'pull request', 'code review prep'],
    roles: ['Dev', 'TL'],
    gateContribution: 'Gate 4',
    docPath: '.claude/skills/lidr-pr-description/SKILL.md',
  },
  {
    id: 'lidr-adr',
    name: 'lidr-adr',
    phase: 'Phase 4 — Implementation · development',
    phaseNum: 5,
    stage: 'development',
    source: 'lidr',
    criticality: 'required',
    description: 'Generate Architecture Decision Record in MADR format for technical choices',
    triggers: ['architecture decision', 'technical decision', 'ADR'],
    roles: ['TL', 'Tech Lead'],
    gateContribution: 'Gate 4',
    docPath: '.claude/skills/lidr-adr/SKILL.md',
  },
  {
    id: 'lidr-tech-debt',
    name: 'lidr-tech-debt',
    phase: 'Phase 4 — Implementation · development',
    phaseNum: 5,
    stage: 'development',
    source: 'lidr',
    criticality: 'recommended',
    description:
      'AUTOMATED technical debt identification using SonarQube integration. Transforms 6+ hour analysis.',
    triggers: ['tech debt', 'code quality', 'sonar analysis'],
    roles: ['TL', 'Dev'],
    gateContribution: 'Gate 4',
    docPath: '.claude/skills/lidr-tech-debt/SKILL.md',
    automated: true,
  },
  {
    id: 'lidr-impact-analysis',
    name: 'lidr-impact-analysis',
    phase: 'Phase 4 — Implementation · development',
    phaseNum: 4,
    stage: 'development',
    source: 'lidr',
    criticality: 'recommended',
    description:
      'Analyze the impact of a proposed change (RF, diff, PRD delta) against client-maintained registries: contract catalogs (contract-impact mode, Gate 4) and variant/configuration matrices (variant-compatibility mode, Gate 2). Emits impact report with severity and SAFE/REVIEW REQUIRED/BLOCKING verdict; degrades to a guided manual checklist without registries.',
    triggers: [
      'analyze change impact',
      'check contract impact',
      'validate variant compatibility',
      'what does this change break',
    ],
    roles: ['TL', 'Dev'],
    gateContribution: 'Gate 4',
    docPath: '.claude/skills/lidr-impact-analysis/SKILL.md',
    relatedSkills: ['lidr-generate-rf', 'lidr-risk-log'],
    relatedCommands: ['lidr-spec-verify', 'lidr-advance-gate'],
  },
  {
    id: 'lidr-dev-handoff-qa',
    name: 'lidr-dev-handoff-qa',
    phase: 'Phase 4 — Implementation · development',
    phaseNum: 5,
    stage: 'development',
    source: 'lidr',
    criticality: 'required',
    description: 'Generate Dev-to-QA handoff document for Ready for QA transitions',
    triggers: ['handoff to QA', 'development complete', 'QA transition'],
    roles: ['Dev', 'TL'],
    gateContribution: 'Gate 4',
    docPath: '.claude/skills/lidr-dev-handoff-qa/SKILL.md',
  },

  // Phase 4 — Implementation · qa (ex-Fase 6 QA) (3)
  {
    id: 'lidr-create-test-cases',
    name: 'lidr-create-test-cases',
    phase: 'Phase 4 — Implementation · qa',
    phaseNum: 6,
    stage: 'qa',
    source: 'lidr',
    criticality: 'required',
    description:
      'Generate executable BDD test cases with concrete data from tickets in Ready for QA',
    triggers: ['create test cases', 'generate TCs', 'BDD scenarios'],
    roles: ['QA'],
    gateContribution: 'Gate 5',
    docPath: '.claude/skills/lidr-create-test-cases/SKILL.md',
  },
  {
    id: 'lidr-bug-report',
    name: 'lidr-bug-report',
    phase: 'Phase 4 — Implementation · qa',
    phaseNum: 6,
    stage: 'qa',
    source: 'lidr',
    criticality: 'recommended',
    description:
      'Structure comprehensive bug reports that enable developers to reproduce issues in under 5 minutes',
    triggers: ['report bug', 'create bug report', 'file issue'],
    roles: ['QA'],
    gateContribution: 'Gate 5',
    docPath: '.claude/skills/lidr-bug-report/SKILL.md',
  },
  {
    id: 'lidr-test-execution-report',
    name: 'lidr-test-execution-report',
    phase: 'Phase 4 — Implementation · qa',
    phaseNum: 6,
    stage: 'qa',
    source: 'lidr',
    criticality: 'required',
    description: 'Essential for QA sign-off - consolidates test execution results',
    triggers: ['test execution', 'QA report', 'test results'],
    roles: ['QA Lead'],
    gateContribution: 'Gate 5',
    docPath: '.claude/skills/lidr-test-execution-report/SKILL.md',
  },

  // Phase 4 — Implementation · security (ex-Fase 7 Seguridad) (4)
  {
    id: 'lidr-vuln-assessment',
    name: 'lidr-vuln-assessment',
    phase: 'Phase 4 — Implementation · security',
    phaseNum: 7,
    stage: 'security',
    source: 'lidr',
    criticality: 'required',
    description: 'Essential for platform security assessment - interpret SAST/SCA scanner results',
    triggers: ['security scan', 'vulnerability assessment', 'SAST results'],
    roles: ['Security'],
    gateContribution: 'Gate 6',
    docPath: '.claude/skills/lidr-vuln-assessment/SKILL.md',
  },
  {
    id: 'lidr-dast-interpretation',
    name: 'lidr-dast-interpretation',
    phase: 'Phase 4 — Implementation · security',
    phaseNum: 7,
    stage: 'security',
    source: 'lidr',
    criticality: 'required',
    description:
      'Interpret DAST scan reports from OWASP ZAP, Burp Suite, or Nuclei against running applications',
    triggers: ['DAST results', 'ZAP scan', 'runtime security'],
    roles: ['Security'],
    gateContribution: 'Gate 6',
    docPath: '.claude/skills/lidr-dast-interpretation/SKILL.md',
  },
  {
    id: 'lidr-pentest-report',
    name: 'lidr-pentest-report',
    phase: 'Phase 4 — Implementation · security',
    phaseNum: 7,
    stage: 'security',
    source: 'lidr',
    criticality: 'required',
    description:
      'Essential for platform security validation - transforms pen testing findings into reports',
    triggers: ['pen test', 'penetration testing', 'security report'],
    roles: ['Security'],
    gateContribution: 'Gate 6',
    docPath: '.claude/skills/lidr-pentest-report/SKILL.md',
  },
  {
    id: 'lidr-security-checklist',
    name: 'lidr-security-checklist',
    phase: 'Phase 4 — Implementation · security',
    phaseNum: 7,
    stage: 'security',
    source: 'lidr',
    criticality: 'required',
    description: 'Essential for platform security validation - OWASP Top 10 and compliance checks',
    triggers: ['security checklist', 'OWASP validation', 'security review'],
    roles: ['Security'],
    gateContribution: 'Gate 6',
    docPath: '.claude/skills/lidr-security-checklist/SKILL.md',
    automated: true,
  },

  // Phase 4 — Implementation · release (ex-Fase 8 Despliegue) (4)
  {
    id: 'lidr-change-request',
    name: 'lidr-change-request',
    phase: 'Phase 4 — Implementation · release',
    phaseNum: 8,
    stage: 'release',
    source: 'lidr',
    criticality: 'required',
    description:
      'Generate Change Request for production deployment following ITIL Change Management',
    triggers: ['change request', 'deploy request', 'CAB approval'],
    roles: ['DevOps'],
    gateContribution: 'Gate 7',
    docPath: '.claude/skills/lidr-change-request/SKILL.md',
  },
  {
    id: 'lidr-rollback-plan',
    name: 'lidr-rollback-plan',
    phase: 'Phase 4 — Implementation · release',
    phaseNum: 8,
    stage: 'release',
    source: 'lidr',
    criticality: 'required',
    description:
      'AUTOMATED rollback plan generation with deployment risk analysis using Python automation',
    triggers: ['rollback plan', 'deployment risk', 'recovery plan'],
    roles: ['DevOps'],
    gateContribution: 'Gate 7',
    docPath: '.claude/skills/lidr-rollback-plan/SKILL.md',
    automated: true,
  },
  {
    id: 'lidr-release-notes',
    name: 'lidr-release-notes',
    phase: 'Phase 4 — Implementation · release',
    phaseNum: 8,
    stage: 'release',
    source: 'lidr',
    criticality: 'required',
    description:
      'AUTOMATED release notes generation with business impact analysis using Python automation',
    triggers: ['release notes', 'changelog', 'release communication'],
    roles: ['DevOps'],
    gateContribution: 'Gate 7',
    docPath: '.claude/skills/lidr-release-notes/SKILL.md',
    automated: true,
  },
  {
    id: 'lidr-postmortem',
    name: 'lidr-postmortem',
    phase: 'Phase 4 — Implementation · release',
    phaseNum: 8,
    stage: 'release',
    source: 'lidr',
    criticality: 'required',
    description: 'Structure blameless incident postmortem using Five Whys root cause analysis',
    triggers: ['postmortem', 'incident analysis', 'root cause'],
    roles: ['TL', 'DevOps'],
    gateContribution: 'Post-incident',
    docPath: '.claude/skills/lidr-postmortem/SKILL.md',
  },

  // Phase 0 — Context · context (ex-Fase 0 Preparación) (1)
  {
    id: 'lidr-audit-standards',
    name: 'lidr-audit-standards',
    phase: 'Phase 0 — Context · context',
    phaseNum: 0,
    stage: 'context',
    source: 'lidr',
    criticality: 'recommended',
    description:
      'Comprehensive audit skill for validating that all skills comply with established SDLC ecosystem standards. CRITICAL for ensuring frontmatter consistency, domain-agnostic content, methodology uniformity, and structural integrity across the ecosystem.',
    triggers: [
      'audit skills',
      'validate standards',
      'compliance check',
      'skill quality review',
      'ecosystem health assessment',
    ],
    roles: ['TL'],
    gateContribution: 'Pre-Gate 0',
    docPath: '.claude/skills/lidr-audit-standards/SKILL.md',
  },

  // Phase 0 — Context & Anytime · anytime (cross-cutting + meta-tooling) (10)
  {
    id: 'lidr-help',
    name: 'lidr-help',
    phase: 'Anytime · anytime',
    phaseNum: 99,
    stage: 'anytime',
    source: 'lidr',
    criticality: 'recommended',
    description:
      'Answer questions about the LIDR SDLC ecosystem and recommend the next skill, command, workflow, or doc. Wraps the BMad help layer with the LIDR SDLC governance layer (phases, gates, RACI).',
    triggers: [
      'what can you do',
      'how do I',
      'which command should I use',
      'which gate',
      'lidr help',
    ],
    roles: ['PME', 'PO', 'TL', 'Dev', 'QA', 'Sec', 'DevOps', 'SM'],
    docPath: '.claude/skills/lidr-help/SKILL.md',
  },
  {
    id: 'lidr-gate-evaluation',
    name: 'lidr-gate-evaluation',
    phase: 'Anytime · anytime',
    phaseNum: 99,
    stage: 'anytime',
    source: 'lidr',
    criticality: 'required',
    description:
      'Generate standardized gate evaluation reports for SDLC phase transitions with weighted scoring',
    triggers: ['gate evaluation', 'phase transition', 'gate assessment', 'handoff package'],
    roles: ['PME', 'PO', 'TL', 'QA', 'Security'],
    gateContribution: 'All Gates',
    docPath: '.claude/skills/lidr-gate-evaluation/SKILL.md',
  },
  {
    id: 'lidr-agents-architecture',
    name: 'lidr-agents-architecture',
    phase: 'Anytime · anytime',
    phaseNum: 100,
    stage: 'anytime',
    source: 'anytime',
    criticality: 'optional',
    description:
      'Umbrella meta-skill for .agents/ ecosystem authoring: create skills/commands/subagents/hooks/MCP servers/rules with automatic sync across 5 AI platforms (Cursor, Claude Code, Gemini, Antigravity, Copilot). Command, hook, MCP, and rule authoring live in its references/.',
    triggers: [
      'create a skill',
      'create a subagent',
      'add command to .agents',
      'create a hook',
      'add an MCP server',
      'generate rule',
      'agents architecture',
    ],
    roles: ['TL'],
    docPath: '.claude/skills/lidr-agents-architecture/SKILL.md',
  },
  {
    id: 'lidr-playwright-cli',
    name: 'lidr-playwright-cli',
    phase: 'Anytime · anytime',
    phaseNum: 99,
    stage: 'anytime',
    source: 'lidr',
    criticality: 'optional',
    description:
      'Browser automation with Playwright CLI for web testing, form filling, screenshots, and data extraction. Use when needing to navigate websites, interact with web pages, fill forms, take screenshots, test web applications.',
    triggers: ['playwright', 'browser automation', 'web testing', 'screenshot', 'form filling'],
    roles: ['QA', 'Dev'],
    docPath: '.claude/skills/lidr-playwright-cli/SKILL.md',
  },
  {
    id: 'lidr-external-sync',
    name: 'lidr-external-sync',
    phase: 'Anytime · anytime',
    phaseNum: 0,
    stage: 'anytime',
    source: 'lidr',
    criticality: 'optional',
    description: 'Bidirectional synchronization between SDLC tracking and external tools',
    triggers: ['external sync', 'tool integration', 'portfolio sync'],
    roles: ['PME', 'TL', 'DevOps'],
    gateContribution: 'All Gates',
    docPath: '.claude/skills/lidr-external-sync/SKILL.md',
    tier: 'Cross-cutting',
    relatedSkills: ['lidr-sdlc-tracking'],
    relatedCommands: ['lidr-track-sdlc'],
  },
  {
    id: 'lidr-sdlc-tracking',
    name: 'lidr-sdlc-tracking',
    phase: 'Anytime · anytime',
    phaseNum: 0,
    stage: 'anytime',
    source: 'lidr',
    criticality: 'recommended',
    description: 'Centralized SDLC tracking system with sdlc-tracking.yaml management',
    triggers: ['sdlc tracking', 'track project progress', 'phase tracking', 'portfolio dashboard'],
    roles: ['PME', 'SM', 'TL'],
    gateContribution: 'All Gates',
    docPath: '.claude/skills/lidr-sdlc-tracking/SKILL.md',
    tier: 'Cross-cutting',
    relatedSkills: ['lidr-external-sync'],
    relatedCommands: ['lidr-track-sdlc'],
  },

  // ═══════════════════════════════════════════════════════════════════
  // BMad Library (69 skills) — full BMad Method framework integration
  // ═══════════════════════════════════════════════════════════════════

  // BMad — Agents (6)
  {
    id: 'bmad-agent-analyst',
    name: 'bmad-agent-analyst',
    phase: 'BMad — Agents',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Strategic business analyst and requirements expert. Use when the user asks to talk to Mary or requests the business analyst.',
    triggers: ['talk to Mary', 'business analyst', 'requirements expert'],
    roles: ['PO'],
    docPath: '.agents/skills/bmad-agent-analyst/SKILL.md',
  },
  {
    id: 'bmad-agent-architect',
    name: 'bmad-agent-architect',
    phase: 'BMad — Agents',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'System architect and technical design leader. Use when the user asks to talk to Winston or requests the architect.',
    triggers: ['talk to Winston', 'architect', 'system architect'],
    roles: ['TL'],
    docPath: '.agents/skills/bmad-agent-architect/SKILL.md',
  },
  {
    id: 'bmad-agent-dev',
    name: 'bmad-agent-dev',
    phase: 'BMad — Agents',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Senior software engineer for story execution and code implementation. Use when the user asks to talk to Amelia or requests the developer agent.',
    triggers: ['talk to Amelia', 'developer agent', 'code implementation'],
    roles: ['Dev'],
    docPath: '.agents/skills/bmad-agent-dev/SKILL.md',
  },
  {
    id: 'bmad-agent-pm',
    name: 'bmad-agent-pm',
    phase: 'BMad — Agents',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Product manager for PRD creation and requirements discovery. Use when the user asks to talk to John or requests the product manager.',
    triggers: ['talk to John', 'product manager', 'PRD creation'],
    roles: ['PO'],
    docPath: '.agents/skills/bmad-agent-pm/SKILL.md',
  },
  {
    id: 'bmad-agent-tech-writer',
    name: 'bmad-agent-tech-writer',
    phase: 'BMad — Agents',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Technical documentation specialist and knowledge curator. Use when the user asks to talk to Paige or requests the tech writer.',
    triggers: ['talk to Paige', 'tech writer', 'documentation specialist'],
    roles: ['TL'],
    docPath: '.agents/skills/bmad-agent-tech-writer/SKILL.md',
  },
  {
    id: 'bmad-agent-ux-designer',
    name: 'bmad-agent-ux-designer',
    phase: 'BMad — Agents',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'UX designer and UI specialist. Use when the user asks to talk to Sally or requests the UX designer.',
    triggers: ['talk to Sally', 'UX designer', 'UI specialist'],
    roles: ['TL'],
    docPath: '.agents/skills/bmad-agent-ux-designer/SKILL.md',
  },

  // BMad — CIS (Innovation) (10)
  {
    id: 'bmad-cis-agent-brainstorming-coach',
    name: 'bmad-cis-agent-brainstorming-coach',
    phase: 'BMad — CIS (Innovation)',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Elite brainstorming specialist for facilitated ideation sessions. Use when the user asks to talk to Carson or requests the Brainstorming Specialist.',
    triggers: ['talk to Carson', 'brainstorming', 'ideation sessions'],
    roles: ['PO', 'TL'],
    docPath: '.agents/skills/bmad-cis-agent-brainstorming-coach/SKILL.md',
  },
  {
    id: 'bmad-cis-agent-creative-problem-solver',
    name: 'bmad-cis-agent-creative-problem-solver',
    phase: 'BMad — CIS (Innovation)',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Master problem solver for systematic problem-solving methodologies. Use when the user asks to talk to Dr. Quinn or requests the Master Problem Solver.',
    triggers: ['talk to Dr. Quinn', 'problem solver', 'problem-solving'],
    roles: ['PO', 'TL'],
    docPath: '.agents/skills/bmad-cis-agent-creative-problem-solver/SKILL.md',
  },
  {
    id: 'bmad-cis-agent-design-thinking-coach',
    name: 'bmad-cis-agent-design-thinking-coach',
    phase: 'BMad — CIS (Innovation)',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Design thinking maestro for human-centered design processes. Use when the user asks to talk to Maya or requests the Design Thinking Maestro.',
    triggers: ['talk to Maya', 'design thinking', 'human-centered design'],
    roles: ['PO', 'TL'],
    docPath: '.agents/skills/bmad-cis-agent-design-thinking-coach/SKILL.md',
  },
  {
    id: 'bmad-cis-agent-innovation-strategist',
    name: 'bmad-cis-agent-innovation-strategist',
    phase: 'BMad — CIS (Innovation)',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Disruptive innovation oracle for business model innovation and strategic disruption. Use when the user asks to talk to Victor or requests the Disruptive Innovation Oracle.',
    triggers: ['talk to Victor', 'innovation oracle', 'business model'],
    roles: ['PO', 'TL'],
    docPath: '.agents/skills/bmad-cis-agent-innovation-strategist/SKILL.md',
  },
  {
    id: 'bmad-cis-agent-presentation-master',
    name: 'bmad-cis-agent-presentation-master',
    phase: 'BMad — CIS (Innovation)',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Visual communication and presentation expert for slide decks, pitch decks, and visual storytelling. Use when the user asks to talk to Caravaggio.',
    triggers: ['talk to Caravaggio', 'presentation expert', 'visual storytelling'],
    roles: ['PO', 'TL'],
    docPath: '.agents/skills/bmad-cis-agent-presentation-master/SKILL.md',
  },
  {
    id: 'bmad-cis-agent-storyteller',
    name: 'bmad-cis-agent-storyteller',
    phase: 'BMad — CIS (Innovation)',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Master storyteller for compelling narratives using proven frameworks. Use when the user asks to talk to Sophia or requests the Master Storyteller.',
    triggers: ['talk to Sophia', 'storyteller', 'compelling narratives'],
    roles: ['PO', 'TL'],
    docPath: '.agents/skills/bmad-cis-agent-storyteller/SKILL.md',
  },
  {
    id: 'bmad-cis-design-thinking',
    name: 'bmad-cis-design-thinking',
    phase: 'BMad — CIS (Innovation)',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Guide human-centered design processes using empathy-driven methodologies. Use when the user says "lets run design thinking".',
    triggers: ['run design thinking', 'apply design thinking', 'human-centered design'],
    roles: ['PO', 'TL'],
    docPath: '.agents/skills/bmad-cis-design-thinking/SKILL.md',
  },
  {
    id: 'bmad-cis-innovation-strategy',
    name: 'bmad-cis-innovation-strategy',
    phase: 'BMad — CIS (Innovation)',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Identify disruption opportunities and architect business model innovation. Use when the user says "lets create an innovation strategy".',
    triggers: ['innovation strategy', 'disruption opportunities', 'business model'],
    roles: ['PO', 'TL'],
    docPath: '.agents/skills/bmad-cis-innovation-strategy/SKILL.md',
  },
  {
    id: 'bmad-cis-problem-solving',
    name: 'bmad-cis-problem-solving',
    phase: 'BMad — CIS (Innovation)',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Apply systematic problem-solving methodologies to complex challenges. Use when the user says "guide me through structured problem solving".',
    triggers: ['structured problem solving', 'guided problem solving', 'crack this challenge'],
    roles: ['PO', 'TL'],
    docPath: '.agents/skills/bmad-cis-problem-solving/SKILL.md',
  },
  {
    id: 'bmad-cis-storytelling',
    name: 'bmad-cis-storytelling',
    phase: 'BMad — CIS (Innovation)',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Craft compelling narratives using story frameworks. Use when the user says "help me with storytelling".',
    triggers: ['storytelling', 'compelling narratives', 'story frameworks'],
    roles: ['PO', 'TL'],
    docPath: '.agents/skills/bmad-cis-storytelling/SKILL.md',
  },

  // BMad — Test Architect (11)
  {
    id: 'bmad-tea',
    name: 'bmad-tea',
    phase: 'Anytime · anytime',
    phaseNum: 0,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Master Test Architect and Quality Advisor. Use when the user asks to talk to Murat or requests the Test Architect.',
    triggers: ['talk to Murat', 'Test Architect', 'quality advisor'],
    roles: ['QA'],
    docPath: '.agents/skills/bmad-tea/SKILL.md',
  },
  {
    id: 'bmad-qa-generate-e2e-tests',
    name: 'bmad-qa-generate-e2e-tests',
    phase: 'BMad — Test Architect',
    phaseNum: 200,
    stage: 'qa',
    source: 'bmad',
    description:
      'Generate end to end automated tests for existing features. Use when the user says "create qa automated tests for [feature]".',
    triggers: ['create qa automated tests', 'e2e tests', 'automated tests'],
    roles: ['QA'],
    docPath: '.agents/skills/bmad-qa-generate-e2e-tests/SKILL.md',
  },
  {
    id: 'bmad-teach-me-testing',
    name: 'bmad-teach-me-testing',
    phase: 'Anytime · anytime',
    phaseNum: 0,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Teach testing progressively through structured sessions. Use when user says "lets learn testing" or "I want to study test practices".',
    triggers: ['learn testing', 'study test practices', 'teach testing'],
    roles: ['QA'],
    docPath: '.agents/skills/bmad-teach-me-testing/SKILL.md',
  },
  {
    id: 'bmad-testarch-atdd',
    name: 'bmad-testarch-atdd',
    phase: 'BMad — Test Architect',
    phaseNum: 200,
    stage: 'qa',
    source: 'bmad',
    description:
      'Generate red-phase acceptance test scaffolds using the TDD cycle. Use when the user says "lets write acceptance tests" or "I want to do ATDD".',
    triggers: ['write acceptance tests', 'ATDD', 'TDD cycle'],
    roles: ['QA'],
    docPath: '.agents/skills/bmad-testarch-atdd/SKILL.md',
  },
  {
    id: 'bmad-testarch-automate',
    name: 'bmad-testarch-automate',
    phase: 'BMad — Test Architect',
    phaseNum: 200,
    stage: 'qa',
    source: 'bmad',
    description:
      'Expand test automation coverage for codebase. Use when user says "lets expand test coverage" or "I want to automate tests".',
    triggers: ['expand test coverage', 'automate tests', 'test automation'],
    roles: ['QA'],
    docPath: '.agents/skills/bmad-testarch-automate/SKILL.md',
  },
  {
    id: 'bmad-testarch-ci',
    name: 'bmad-testarch-ci',
    phase: 'BMad — Test Architect',
    phaseNum: 200,
    stage: 'specification',
    source: 'bmad',
    description:
      'Scaffold CI/CD quality pipeline with test execution. Use when the user says "lets setup CI pipeline" or "I want to create quality gates".',
    triggers: ['setup CI pipeline', 'quality gates', 'CI/CD pipeline'],
    roles: ['QA'],
    docPath: '.agents/skills/bmad-testarch-ci/SKILL.md',
  },
  {
    id: 'bmad-testarch-framework',
    name: 'bmad-testarch-framework',
    phase: 'BMad — Test Architect',
    phaseNum: 200,
    stage: 'specification',
    source: 'bmad',
    description:
      'Initialize test framework with Playwright or Cypress. Use when the user says "lets setup test framework" or "I want to initialize testing framework".',
    triggers: ['setup test framework', 'initialize testing framework', 'Playwright Cypress'],
    roles: ['QA'],
    docPath: '.agents/skills/bmad-testarch-framework/SKILL.md',
  },
  {
    id: 'bmad-testarch-nfr',
    name: 'bmad-testarch-nfr',
    phase: 'BMad — Test Architect',
    phaseNum: 200,
    stage: 'qa',
    source: 'bmad',
    description:
      'Audit NFR evidence for performance, security, reliability, and scalability (post-implementation). Use when implementation evidence exists and the user says "audit NFR evidence" or "audit NFRs".',
    triggers: ['audit NFR evidence', 'audit NFRs', 'evaluate non-functional requirements'],
    roles: ['QA'],
    docPath: '.agents/skills/bmad-testarch-nfr/SKILL.md',
  },
  {
    id: 'bmad-testarch-test-design',
    name: 'bmad-testarch-test-design',
    phase: 'BMad — Test Architect',
    phaseNum: 200,
    stage: 'specification',
    source: 'bmad',
    description:
      'Create system-level or epic-level test plans. Use when the user says "lets design test plan" or "I want to create test strategy".',
    triggers: ['design test plan', 'create test strategy', 'test plans'],
    roles: ['QA'],
    docPath: '.agents/skills/bmad-testarch-test-design/SKILL.md',
  },
  {
    id: 'bmad-testarch-test-review',
    name: 'bmad-testarch-test-review',
    phase: 'BMad — Test Architect',
    phaseNum: 200,
    stage: 'qa',
    source: 'bmad',
    description:
      'Review test quality using best practices validation. Use when user says "lets review tests" or "I want to evaluate test quality".',
    triggers: ['review tests', 'evaluate test quality', 'test quality'],
    roles: ['QA'],
    docPath: '.agents/skills/bmad-testarch-test-review/SKILL.md',
  },
  {
    id: 'bmad-testarch-trace',
    name: 'bmad-testarch-trace',
    phase: 'BMad — Test Architect',
    phaseNum: 200,
    stage: 'qa',
    source: 'bmad',
    description:
      'Generate traceability matrix and quality gate decision. Use when the user says "lets create traceability matrix" or "I want to analyze test coverage".',
    triggers: ['traceability matrix', 'analyze test coverage', 'quality gate'],
    roles: ['QA'],
    docPath: '.agents/skills/bmad-testarch-trace/SKILL.md',
  },

  // BMad — PRD & Product (6)
  {
    id: 'bmad-create-prd',
    name: 'bmad-create-prd',
    phase: 'BMad — PRD & Product',
    phaseNum: 200,
    stage: 'planning',
    source: 'bmad',
    description:
      'DEPRECATED — consolidated into bmad-prd create intent. Will be removed in v7 in favor of bmad-prd.',
    triggers: ['create PRD', 'deprecated PRD', 'bmad-prd create'],
    roles: ['PO'],
    docPath: '.agents/skills/bmad-create-prd/SKILL.md',
  },
  {
    id: 'bmad-edit-prd',
    name: 'bmad-edit-prd',
    phase: 'BMad — PRD & Product',
    phaseNum: 200,
    stage: 'planning',
    source: 'bmad',
    description:
      'DEPRECATED — consolidated into bmad-prd update intent. Will be removed in v7 in favor of bmad-prd.',
    triggers: ['edit PRD', 'update PRD', 'bmad-prd update'],
    roles: ['PO'],
    docPath: '.agents/skills/bmad-edit-prd/SKILL.md',
  },
  {
    id: 'bmad-prd',
    name: 'bmad-prd',
    phase: 'BMad — PRD & Product',
    phaseNum: 200,
    stage: 'planning',
    source: 'bmad',
    description:
      'Create, update, or validate a PRD. Use when the user wants help producing, editing, or validating a PRD.',
    triggers: ['create PRD', 'update PRD', 'validate PRD'],
    roles: ['PO'],
    docPath: '.agents/skills/bmad-prd/SKILL.md',
  },
  {
    id: 'bmad-prfaq',
    name: 'bmad-prfaq',
    phase: 'BMad — PRD & Product',
    phaseNum: 200,
    stage: 'analysis',
    source: 'bmad',
    description:
      'Working Backwards PRFAQ challenge to forge product concepts. Use when the user requests to create a PRFAQ or run the PRFAQ challenge.',
    triggers: ['create PRFAQ', 'work backwards', 'PRFAQ challenge'],
    roles: ['PO'],
    docPath: '.agents/skills/bmad-prfaq/SKILL.md',
  },
  {
    id: 'bmad-product-brief',
    name: 'bmad-product-brief',
    phase: 'BMad — PRD & Product',
    phaseNum: 200,
    stage: 'analysis',
    source: 'bmad',
    description:
      'Create, update, or validate a product brief. Use when the user wants help producing, editing, or validating a brief.',
    triggers: ['create product brief', 'update product brief', 'validate brief'],
    roles: ['PO'],
    docPath: '.agents/skills/bmad-product-brief/SKILL.md',
  },
  {
    id: 'bmad-validate-prd',
    name: 'bmad-validate-prd',
    phase: 'BMad — PRD & Product',
    phaseNum: 200,
    stage: 'planning',
    source: 'bmad',
    description:
      'DEPRECATED — consolidated into bmad-prd validate intent. Will be removed in v7 in favor of bmad-prd.',
    triggers: ['validate PRD', 'deprecated validate', 'bmad-prd validate'],
    roles: ['PO'],
    docPath: '.agents/skills/bmad-validate-prd/SKILL.md',
  },

  // BMad — Architecture & Stories (8)
  {
    id: 'bmad-create-architecture',
    name: 'bmad-create-architecture',
    phase: 'Phase 3 — Solutioning · specification',
    phaseNum: 3,
    stage: 'specification',
    source: 'bmad',
    description:
      'Create architecture solution design decisions for AI agent consistency. Use when the user says "lets create architecture" or "create technical architecture".',
    triggers: ['create architecture', 'technical architecture', 'solution design'],
    roles: ['TL'],
    docPath: '.agents/skills/bmad-create-architecture/SKILL.md',
  },
  {
    id: 'bmad-create-epics-and-stories',
    name: 'bmad-create-epics-and-stories',
    phase: 'BMad — Architecture & Stories',
    phaseNum: 200,
    stage: 'specification',
    source: 'bmad',
    description:
      'Break requirements into epics and user stories. Use when the user says "create the epics and stories list".',
    triggers: ['create epics and stories', 'break requirements', 'user stories'],
    roles: ['PO'],
    docPath: '.agents/skills/bmad-create-epics-and-stories/SKILL.md',
  },
  {
    id: 'bmad-create-story',
    name: 'bmad-create-story',
    phase: 'BMad — Architecture & Stories',
    phaseNum: 200,
    stage: 'development',
    source: 'bmad',
    description:
      'Creates a dedicated story file with all the context the agent will need to implement it later. Use when the user says "create the next story" or "create story [id]".',
    triggers: ['create the next story', 'create story', 'story file'],
    roles: ['PO'],
    docPath: '.agents/skills/bmad-create-story/SKILL.md',
  },
  {
    id: 'bmad-ux',
    name: 'bmad-ux',
    phase: 'BMad — Architecture & Stories',
    phaseNum: 200,
    stage: 'planning',
    source: 'bmad',
    description:
      'Plan UX patterns and design specifications. Use when the user says "lets create UX design" or "create UX specifications".',
    triggers: ['create UX design', 'UX specifications', 'plan the UX'],
    roles: ['TL'],
    docPath: '.agents/skills/bmad-ux/SKILL.md',
  },
  {
    id: 'bmad-dev-story',
    name: 'bmad-dev-story',
    phase: 'BMad — Architecture & Stories',
    phaseNum: 200,
    stage: 'development',
    source: 'bmad',
    description:
      'Execute story implementation following a context filled story spec file. Use when the user says "dev this story [story file]".',
    triggers: ['dev this story', 'implement the next story', 'story implementation'],
    roles: ['Dev'],
    docPath: '.agents/skills/bmad-dev-story/SKILL.md',
  },
  {
    id: 'bmad-document-project',
    name: 'bmad-document-project',
    phase: 'BMad — Architecture & Stories',
    phaseNum: 200,
    stage: 'context',
    source: 'bmad',
    description:
      'Document brownfield projects for AI context. Use when the user says "document this project" or "generate project docs".',
    triggers: ['document this project', 'generate project docs', 'brownfield docs'],
    roles: ['TL'],
    docPath: '.agents/skills/bmad-document-project/SKILL.md',
  },
  {
    id: 'bmad-generate-project-context',
    name: 'bmad-generate-project-context',
    phase: 'BMad — Architecture & Stories',
    phaseNum: 200,
    stage: 'context',
    source: 'bmad',
    description:
      'Create project-context.md with AI rules. Use when the user says "generate project context" or "create project context".',
    triggers: ['generate project context', 'create project context', 'project-context.md'],
    roles: ['TL'],
    docPath: '.agents/skills/bmad-generate-project-context/SKILL.md',
  },
  {
    id: 'bmad-quick-dev',
    name: 'bmad-quick-dev',
    phase: 'BMad — Architecture & Stories',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Implements any user intent, requirement, story, bug fix or change request by producing clean working code artifacts following project conventions.',
    triggers: ['build code', 'refactor code', 'implement feature', 'modify component'],
    roles: ['Dev'],
    docPath: '.agents/skills/bmad-quick-dev/SKILL.md',
  },

  // BMad — Sprint & Process (5)
  {
    id: 'bmad-check-implementation-readiness',
    name: 'bmad-check-implementation-readiness',
    phase: 'BMad — Sprint & Process',
    phaseNum: 200,
    stage: 'sprint-planning',
    source: 'bmad',
    description:
      'Validate PRD, UX, Architecture and Epics specs are complete. Use when the user says "check implementation readiness".',
    triggers: ['check implementation readiness', 'validate specs', 'readiness check'],
    roles: ['PME', 'SM'],
    docPath: '.agents/skills/bmad-check-implementation-readiness/SKILL.md',
  },
  {
    id: 'bmad-correct-course',
    name: 'bmad-correct-course',
    phase: 'BMad — Sprint & Process',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Manage significant changes during sprint execution. Use when the user says "correct course" or "propose sprint change".',
    triggers: ['correct course', 'propose sprint change', 'sprint execution'],
    roles: ['PME', 'SM'],
    docPath: '.agents/skills/bmad-correct-course/SKILL.md',
  },
  {
    id: 'bmad-retrospective',
    name: 'bmad-retrospective',
    phase: 'BMad — Sprint & Process',
    phaseNum: 200,
    stage: 'release',
    source: 'bmad',
    description:
      'Post-epic review to extract lessons and assess success. Use when the user says "run a retrospective" or "lets retro the epic".',
    triggers: ['run a retrospective', 'retro the epic', 'post-epic review'],
    roles: ['PME', 'SM'],
    docPath: '.agents/skills/bmad-retrospective/SKILL.md',
  },
  {
    id: 'bmad-sprint-planning',
    name: 'bmad-sprint-planning',
    phase: 'BMad — Sprint & Process',
    phaseNum: 200,
    stage: 'sprint-planning',
    source: 'bmad',
    description:
      'Generate sprint status tracking from epics. Use when the user says "run sprint planning" or "generate sprint plan".',
    triggers: ['run sprint planning', 'generate sprint plan', 'sprint tracking'],
    roles: ['PME', 'SM'],
    docPath: '.agents/skills/bmad-sprint-planning/SKILL.md',
  },
  {
    id: 'bmad-sprint-status',
    name: 'bmad-sprint-status',
    phase: 'BMad — Sprint & Process',
    phaseNum: 200,
    stage: 'development',
    source: 'bmad',
    description:
      'Summarize sprint status and surface risks. Use when the user says "check sprint status" or "show sprint status".',
    triggers: ['check sprint status', 'show sprint status', 'sprint risks'],
    roles: ['PME', 'SM'],
    docPath: '.agents/skills/bmad-sprint-status/SKILL.md',
  },

  // BMad — Review (5)
  {
    id: 'bmad-code-review',
    name: 'bmad-code-review',
    phase: 'BMad — Review',
    phaseNum: 200,
    stage: 'development',
    source: 'bmad',
    description:
      'Review code changes adversarially using parallel review layers (Blind Hunter, Edge Case Hunter, Acceptance Auditor) with structured triage. Use when the user says "run code review".',
    triggers: ['run code review', 'review this code', 'adversarial review'],
    roles: ['Dev'],
    docPath: '.agents/skills/bmad-code-review/SKILL.md',
  },
  {
    id: 'bmad-editorial-review-prose',
    name: 'bmad-editorial-review-prose',
    phase: 'BMad — Review',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Clinical copy-editor that reviews text for communication issues. Use when user says review for prose or improve the prose.',
    triggers: ['review for prose', 'improve the prose', 'copy-edit'],
    roles: ['TL'],
    docPath: '.agents/skills/bmad-editorial-review-prose/SKILL.md',
  },
  {
    id: 'bmad-editorial-review-structure',
    name: 'bmad-editorial-review-structure',
    phase: 'BMad — Review',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Structural editor that proposes cuts, reorganization, and simplification while preserving comprehension. Use when user requests structural review.',
    triggers: ['structural review', 'editorial review structure', 'reorganize content'],
    roles: ['TL'],
    docPath: '.agents/skills/bmad-editorial-review-structure/SKILL.md',
  },
  {
    id: 'bmad-review-adversarial-general',
    name: 'bmad-review-adversarial-general',
    phase: 'BMad — Review',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Perform a Cynical Review and produce a findings report. Use when the user requests a critical review of something.',
    triggers: ['critical review', 'cynical review', 'findings report'],
    roles: ['TL'],
    docPath: '.agents/skills/bmad-review-adversarial-general/SKILL.md',
  },
  {
    id: 'bmad-review-edge-case-hunter',
    name: 'bmad-review-edge-case-hunter',
    phase: 'BMad — Review',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Walk every branching path and boundary condition in content, report only unhandled edge cases. Use when you need exhaustive edge-case analysis.',
    triggers: ['edge-case analysis', 'unhandled edge cases', 'boundary conditions'],
    roles: ['QA'],
    docPath: '.agents/skills/bmad-review-edge-case-hunter/SKILL.md',
  },

  // BMad — Meta (6)
  {
    id: 'bmad-agent-builder',
    name: 'bmad-agent-builder',
    phase: 'BMad — Meta',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Builds, edits or analyzes Agent Skills through conversational discovery. Use when the user requests to "Create an Agent" or "Analyze an Agent".',
    triggers: ['create an agent', 'analyze an agent', 'edit an agent'],
    roles: ['TL'],
    docPath: '.agents/skills/bmad-agent-builder/SKILL.md',
  },
  {
    id: 'bmad-bmb-setup',
    name: 'bmad-bmb-setup',
    phase: 'BMad — Meta',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Sets up BMad Builder module in a project. Use when the user requests to install bmb module or setup BMad Builder.',
    triggers: ['install bmb module', 'configure BMad Builder', 'setup BMad Builder'],
    roles: ['TL'],
    docPath: '.agents/skills/bmad-bmb-setup/SKILL.md',
  },
  {
    id: 'bmad-customize',
    name: 'bmad-customize',
    phase: 'BMad — Meta',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Authors and updates customization overrides for installed BMad skills. Use when the user says customize bmad or override a skill.',
    triggers: ['customize bmad', 'override a skill', 'change agent behavior'],
    roles: ['TL'],
    docPath: '.agents/skills/bmad-customize/SKILL.md',
  },
  {
    id: 'bmad-eval-runner',
    name: 'bmad-eval-runner',
    phase: 'BMad — Meta',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Run a skill evals in a clean, isolated environment (Docker) and report results with parallel grader subagents. Use when evaluating a skill or running evals.',
    triggers: ['evaluate a skill', 'run evals', 'benchmark a skill'],
    roles: ['QA'],
    docPath: '.agents/skills/bmad-eval-runner/SKILL.md',
  },
  {
    id: 'bmad-module-builder',
    name: 'bmad-module-builder',
    phase: 'BMad — Meta',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Plans, creates, and validates BMad modules. Use when the user requests to create module, build a module, or validate module.',
    triggers: ['create module', 'build a module', 'validate module'],
    roles: ['TL'],
    docPath: '.agents/skills/bmad-module-builder/SKILL.md',
  },
  {
    id: 'bmad-workflow-builder',
    name: 'bmad-workflow-builder',
    phase: 'BMad — Meta',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Builds, edits, and analyzes workflows and skills. Use when the user requests to build a workflow, modify a workflow, or analyze skill.',
    triggers: ['build a workflow', 'modify a workflow', 'analyze skill'],
    roles: ['TL'],
    docPath: '.agents/skills/bmad-workflow-builder/SKILL.md',
  },

  // BMad — Utilities (12)
  {
    id: 'bmad-advanced-elicitation',
    name: 'bmad-advanced-elicitation',
    phase: 'BMad — Utilities',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Push the LLM to reconsider, refine, and improve its recent output. Use for deeper critique (socratic, first principles, pre-mortem, red team).',
    triggers: ['deeper critique', 'socratic method', 'pre-mortem', 'red team'],
    roles: ['TL'],
    docPath: '.agents/skills/bmad-advanced-elicitation/SKILL.md',
  },
  {
    id: 'bmad-brainstorming',
    name: 'bmad-brainstorming',
    phase: 'BMad — Utilities',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Facilitate interactive brainstorming sessions using diverse creative techniques and ideation methods. Use when the user says help me brainstorm.',
    triggers: ['help me brainstorm', 'help me ideate', 'brainstorming session'],
    roles: ['PO', 'TL'],
    docPath: '.agents/skills/bmad-brainstorming/SKILL.md',
  },
  {
    id: 'bmad-checkpoint-preview',
    name: 'bmad-checkpoint-preview',
    phase: 'BMad — Utilities',
    phaseNum: 200,
    stage: 'qa',
    source: 'bmad',
    description:
      'LLM-assisted human-in-the-loop review. Make sense of a change, focus attention where it matters, test. Use when the user says "checkpoint".',
    triggers: ['checkpoint', 'human review', 'walk me through this change'],
    roles: ['QA'],
    docPath: '.agents/skills/bmad-checkpoint-preview/SKILL.md',
  },
  {
    id: 'bmad-spec',
    name: 'bmad-spec',
    phase: 'BMad — Utilities',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Distill any intent input into a SPEC.md kernel + companions — the canonical, preservation-validated contract downstream work derives from. Locks the WHAT before the HOW.',
    triggers: ['create a spec', 'distill this into a spec', 'validate this spec'],
    roles: ['TL'],
    docPath: '.agents/skills/bmad-spec/SKILL.md',
  },
  {
    id: 'bmad-domain-research',
    name: 'bmad-domain-research',
    phase: 'BMad — Utilities',
    phaseNum: 200,
    stage: 'analysis',
    source: 'bmad',
    description:
      'Conduct domain and industry research. Use when the user wants to do domain research for a topic or industry.',
    triggers: ['domain research', 'industry research', 'research topic'],
    roles: ['TL'],
    docPath: '.agents/skills/bmad-domain-research/SKILL.md',
  },
  {
    id: 'bmad-help',
    name: 'bmad-help',
    phase: 'BMad — Utilities',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Analyzes current state and user query to answer BMad questions or recommend the next skill(s) to use. Use when user asks for bmad help.',
    triggers: ['bmad help', 'what to do next', 'recommend next skill'],
    roles: ['TL'],
    docPath: '.agents/skills/bmad-help/SKILL.md',
  },
  {
    id: 'bmad-index-docs',
    name: 'bmad-index-docs',
    phase: 'BMad — Utilities',
    phaseNum: 200,
    stage: 'context',
    source: 'bmad',
    description:
      'Generates or updates an index.md to reference all docs in the folder. Use if user requests to create or update an index of all files.',
    triggers: ['create an index', 'update index', 'index.md generator'],
    roles: ['TL'],
    docPath: '.agents/skills/bmad-index-docs/SKILL.md',
  },
  {
    id: 'bmad-investigate',
    name: 'bmad-investigate',
    phase: 'BMad — Utilities',
    phaseNum: 200,
    stage: 'development',
    source: 'bmad',
    description:
      'Forensic case investigation with evidence-graded findings. Use to investigate a bug, trace what caused an incident, or build mental model of a code area.',
    triggers: ['investigate a bug', 'trace incident', 'mental model of code'],
    roles: ['Dev'],
    docPath: '.agents/skills/bmad-investigate/SKILL.md',
  },
  {
    id: 'bmad-market-research',
    name: 'bmad-market-research',
    phase: 'BMad — Utilities',
    phaseNum: 200,
    stage: 'analysis',
    source: 'bmad',
    description:
      'Conduct market research on competition and customers. Use when the user says they need market research.',
    triggers: ['market research', 'competition research', 'customer research'],
    roles: ['PO'],
    docPath: '.agents/skills/bmad-market-research/SKILL.md',
  },
  {
    id: 'bmad-party-mode',
    name: 'bmad-party-mode',
    phase: 'BMad — Utilities',
    phaseNum: 200,
    stage: 'anytime',
    source: 'bmad',
    description:
      'Orchestrates group discussions between installed BMAD agents, enabling multi-agent conversations where each agent has independent thinking. Use for roundtable.',
    triggers: ['party mode', 'group discussion', 'multi-agent conversation'],
    roles: ['TL'],
    docPath: '.agents/skills/bmad-party-mode/SKILL.md',
  },
  {
    id: 'bmad-shard-doc',
    name: 'bmad-shard-doc',
    phase: 'BMad — Utilities',
    phaseNum: 200,
    stage: 'context',
    source: 'bmad',
    description:
      'Splits large markdown documents into smaller, organized files based on level 2 (default) sections. Use if the user says perform shard document.',
    triggers: ['shard document', 'split markdown', 'organize sections'],
    roles: ['TL'],
    docPath: '.agents/skills/bmad-shard-doc/SKILL.md',
  },
  {
    id: 'bmad-technical-research',
    name: 'bmad-technical-research',
    phase: 'Phase 1 — Analysis · analysis',
    phaseNum: 1,
    stage: 'analysis',
    source: 'bmad',
    description:
      'Conduct technical research on technologies and architecture. Use when the user wants to produce a technical research report.',
    triggers: ['technical research', 'research report', 'technology research'],
    roles: ['TL'],
    docPath: '.agents/skills/bmad-technical-research/SKILL.md',
  },
];

// Export computed values
export const skillsCount = skills.length;
export const automatedSkillsCount = skills.filter((s) => s.automated).length;
export const skillsByPhase = skills.reduce(
  (acc, skill) => {
    const phase = skill.phaseNum;
    if (!acc[phase]) {
      acc[phase] = [];
    }
    acc[phase].push(skill);
    return acc;
  },
  {} as Record<number, Skill[]>
);

export const getSkillsByPhase = (phaseNum: number) => skillsByPhase[phaseNum] || [];
export const getSkillById = (id: string) => skills.find((s) => s.id === id);
export const getAutomatedSkills = () => skills.filter((s) => s.automated);
