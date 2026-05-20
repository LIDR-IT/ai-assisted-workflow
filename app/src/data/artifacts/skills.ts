/**
 * SINGLE SOURCE OF TRUTH - Skills Registry
 * Centralizes all skills data to eliminate duplication across components
 */

export type SkillSource = 'lidr' | 'bmad' | 'anytime';

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
  // Fase 0 — Preparación (1)
  {
    id: 'project-classifier',
    name: 'project-classifier',
    phase: 'Fase 0 — Preparación',
    phaseNum: 0,
    source: 'lidr',
    criticality: 'recommended',
    description:
      'Auto-classify project type (Web App, Mobile, Backend, etc.) with confidence scoring and tech stack detection',
    triggers: ['classify project', 'determine project type', 'auto-categorize'],
    roles: ['TL', 'PME'],
    gateContribution: 'Pre-Gate 0',
    docPath: '.claude/skills/project-classifier/SKILL.md',
    automated: true,
  },

  // Fase 1 — Originación (6)
  {
    id: 'business-case',
    name: 'business-case',
    phase: 'Fase 1 — Originación',
    phaseNum: 1,
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
    docPath: '.claude/skills/business-case/SKILL.md',
  },
  {
    id: 'kickoff',
    name: 'kickoff',
    phase: 'Fase 1 — Originación',
    phaseNum: 1,
    source: 'lidr',
    criticality: 'required',
    description:
      'Project Kickoff Meeting Orchestrator - structures kickoff meetings with stakeholder alignment',
    triggers: ['project kickoff', 'start project', 'initial meeting'],
    roles: ['PME', 'PO'],
    gateContribution: 'Gate 0',
    docPath: '.claude/skills/kickoff/SKILL.md',
  },
  {
    id: 'stakeholder-map',
    name: 'stakeholder-map',
    phase: 'Fase 1 — Originación',
    phaseNum: 1,
    source: 'lidr',
    criticality: 'required',
    description: 'Generate stakeholder map with power/interest matrix and communication plan',
    triggers: ['map stakeholders', 'identify stakeholders', 'communication plan'],
    roles: ['PME', 'PO'],
    gateContribution: 'Gate 0',
    docPath: '.claude/skills/stakeholder-map/SKILL.md',
  },
  {
    id: 'tracking-integration',
    name: 'tracking-integration',
    phase: 'Fase 1 — Originación',
    phaseNum: 1,
    source: 'lidr',
    criticality: 'required',
    description:
      'Tracking Integration — Adaptive Project Kickstart for any tracking tool (Jira, Linear, Notion, etc.)',
    triggers: ['create epic', 'tracking setup', 'project tracking', 'initialize tracking'],
    roles: ['PME', 'PO'],
    gateContribution: 'Gate 0',
    docPath: '.claude/skills/tracking-integration/SKILL.md',
  },

  // Fase 2 — Discovery (4)
  {
    id: 'review-cruzado',
    name: 'review-cruzado',
    phase: 'Fase 2 — Discovery',
    phaseNum: 2,
    source: 'lidr',
    criticality: 'required',
    description:
      'Essential for PRD alignment validation in software projects. Critical for ensuring functional and technical PRDs alignment.',
    triggers: ['cross review', 'PRD review', 'validate alignment'],
    roles: ['PO', 'TL'],
    gateContribution: 'Gate 1',
    docPath: '.claude/skills/review-cruzado/SKILL.md',
  },
  {
    id: 'risk-log',
    name: 'risk-log',
    phase: 'Fase 2 — Discovery',
    phaseNum: 2,
    source: 'lidr',
    criticality: 'recommended',
    description:
      'Essential for software project risk management. Critical for identifying compliance failures, technical accuracy risks, and operational challenges.',
    triggers: ['risk management', 'identify risks', 'risk log'],
    roles: ['PO', 'TL', 'PME'],
    gateContribution: 'Gate 1',
    docPath: '.claude/skills/risk-log/SKILL.md',
  },
  {
    id: 'propuesta-builder',
    name: 'propuesta-builder',
    phase: 'Fase 2 — Discovery',
    phaseNum: 2,
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

  // Fase 3 — Especificación (3)
  {
    id: 'generate-rf',
    name: 'generate-rf',
    phase: 'Fase 3 — Especificación',
    phaseNum: 3,
    source: 'lidr',
    criticality: 'required',
    description: 'Functional Requirements Generator with BDD criteria from PRDs',
    triggers: ['generate requirements', 'create RFs', 'functional requirements'],
    roles: ['PO'],
    gateContribution: 'Gate 2',
    docPath: '.claude/skills/generate-rf/SKILL.md',
  },
  {
    id: 'generate-nfr',
    name: 'generate-nfr',
    phase: 'Fase 3 — Especificación',
    phaseNum: 3,
    source: 'lidr',
    criticality: 'required',
    description: 'Non-Functional Requirements Generator with measurable metrics',
    triggers: ['generate NFRs', 'non-functional requirements', 'performance requirements'],
    roles: ['TL', 'Tech Lead'],
    gateContribution: 'Gate 2',
    docPath: '.claude/skills/generate-nfr/SKILL.md',
  },
  {
    id: 'validate-requirements',
    name: 'validate-requirements',
    phase: 'Fase 3 — Especificación',
    phaseNum: 3,
    source: 'lidr',
    criticality: 'required',
    description:
      'AUTOMATED cross-validation of RFs and NFRs against PRDs. Executes 5-pass validation in <5 minutes vs 6+ hours manual.',
    triggers: ['validate requirements', 'check traceability', 'RTM validation'],
    roles: ['PO', 'TL', 'QA'],
    gateContribution: 'Gate 2',
    docPath: '.claude/skills/validate-requirements/SKILL.md',
    automated: true,
  },

  // Fase 4 — Planning (3)
  {
    id: 'user-stories',
    name: 'user-stories',
    phase: 'Fase 4 — Planning',
    phaseNum: 4,
    source: 'lidr',
    criticality: 'required',
    description:
      'AUTOMATED User Story generation with intelligent RF slicing using 8 proven patterns. Transforms 2-4 hour manual slicing.',
    triggers: ['generate user stories', 'create stories', 'story slicing'],
    roles: ['PO'],
    gateContribution: 'Gate 3',
    docPath: '.claude/skills/user-stories/SKILL.md',
    automated: true,
  },
  {
    id: 'sprint-capacity',
    name: 'sprint-capacity',
    phase: 'Fase 4 — Planning',
    phaseNum: 4,
    source: 'lidr',
    criticality: 'recommended',
    description:
      'Essential for software project sprint planning. Critical for accurately planning feature development and capacity estimation.',
    triggers: ['sprint planning', 'capacity planning', 'team velocity'],
    roles: ['SM', 'TL'],
    gateContribution: 'Gate 3',
    docPath: '.claude/skills/sprint-capacity/SKILL.md',
  },
  {
    id: 'refinement-notes',
    name: 'refinement-notes',
    phase: 'Fase 4 — Planning',
    phaseNum: 4,
    source: 'lidr',
    criticality: 'recommended',
    description: 'Essential for user story refinement during backlog grooming sessions',
    triggers: ['refinement session', 'backlog grooming', 'story refinement'],
    roles: ['SM', 'PO', 'TL'],
    gateContribution: 'Gate 3',
    docPath: '.claude/skills/refinement-notes/SKILL.md',
  },

  // Fase 5 — Desarrollo (4)
  {
    id: 'pr-description',
    name: 'pr-description',
    phase: 'Fase 5 — Desarrollo',
    phaseNum: 5,
    source: 'lidr',
    criticality: 'required',
    description:
      'Generate structured Pull Request description from git diff and Jira ticket context',
    triggers: ['PR description', 'pull request', 'code review prep'],
    roles: ['Dev', 'TL'],
    gateContribution: 'Gate 4',
    docPath: '.claude/skills/pr-description/SKILL.md',
  },
  {
    id: 'adr',
    name: 'adr',
    phase: 'Fase 5 — Desarrollo',
    phaseNum: 5,
    source: 'lidr',
    criticality: 'required',
    description: 'Generate Architecture Decision Record in MADR format for technical choices',
    triggers: ['architecture decision', 'technical decision', 'ADR'],
    roles: ['TL', 'Tech Lead'],
    gateContribution: 'Gate 4',
    docPath: '.claude/skills/adr/SKILL.md',
  },
  {
    id: 'tech-debt',
    name: 'tech-debt',
    phase: 'Fase 5 — Desarrollo',
    phaseNum: 5,
    source: 'lidr',
    criticality: 'recommended',
    description:
      'AUTOMATED technical debt identification using SonarQube integration. Transforms 6+ hour analysis.',
    triggers: ['tech debt', 'code quality', 'sonar analysis'],
    roles: ['TL', 'Dev'],
    gateContribution: 'Gate 4',
    docPath: '.claude/skills/tech-debt/SKILL.md',
    automated: true,
  },
  {
    id: 'dev-handoff-qa',
    name: 'dev-handoff-qa',
    phase: 'Fase 5 — Desarrollo',
    phaseNum: 5,
    source: 'lidr',
    criticality: 'required',
    description: 'Generate Dev-to-QA handoff document for Ready for QA transitions',
    triggers: ['handoff to QA', 'development complete', 'QA transition'],
    roles: ['Dev', 'TL'],
    gateContribution: 'Gate 4',
    docPath: '.claude/skills/dev-handoff-qa/SKILL.md',
  },

  // Fase 6 — QA (3)
  {
    id: 'create-test-cases',
    name: 'create-test-cases',
    phase: 'Fase 6 — QA',
    phaseNum: 6,
    source: 'lidr',
    criticality: 'required',
    description:
      'Generate executable BDD test cases with concrete data from tickets in Ready for QA',
    triggers: ['create test cases', 'generate TCs', 'BDD scenarios'],
    roles: ['QA'],
    gateContribution: 'Gate 5',
    docPath: '.claude/skills/create-test-cases/SKILL.md',
  },
  {
    id: 'bug-report',
    name: 'bug-report',
    phase: 'Fase 6 — QA',
    phaseNum: 6,
    source: 'lidr',
    criticality: 'recommended',
    description:
      'Structure comprehensive bug reports that enable developers to reproduce issues in under 5 minutes',
    triggers: ['report bug', 'create bug report', 'file issue'],
    roles: ['QA'],
    gateContribution: 'Gate 5',
    docPath: '.claude/skills/bug-report/SKILL.md',
  },
  {
    id: 'test-execution-report',
    name: 'test-execution-report',
    phase: 'Fase 6 — QA',
    phaseNum: 6,
    source: 'lidr',
    criticality: 'required',
    description: 'Essential for QA sign-off - consolidates test execution results',
    triggers: ['test execution', 'QA report', 'test results'],
    roles: ['QA Lead'],
    gateContribution: 'Gate 5',
    docPath: '.claude/skills/test-execution-report/SKILL.md',
  },

  // Fase 7 — Seguridad (4)
  {
    id: 'vuln-assessment',
    name: 'vuln-assessment',
    phase: 'Fase 7 — Seguridad',
    phaseNum: 7,
    source: 'lidr',
    criticality: 'required',
    description: 'Essential for platform security assessment - interpret SAST/SCA scanner results',
    triggers: ['security scan', 'vulnerability assessment', 'SAST results'],
    roles: ['Security'],
    gateContribution: 'Gate 6',
    docPath: '.claude/skills/vuln-assessment/SKILL.md',
  },
  {
    id: 'dast-interpretation',
    name: 'dast-interpretation',
    phase: 'Fase 7 — Seguridad',
    phaseNum: 7,
    source: 'lidr',
    criticality: 'required',
    description:
      'Interpret DAST scan reports from OWASP ZAP, Burp Suite, or Nuclei against running applications',
    triggers: ['DAST results', 'ZAP scan', 'runtime security'],
    roles: ['Security'],
    gateContribution: 'Gate 6',
    docPath: '.claude/skills/dast-interpretation/SKILL.md',
  },
  {
    id: 'pentest-report',
    name: 'pentest-report',
    phase: 'Fase 7 — Seguridad',
    phaseNum: 7,
    source: 'lidr',
    criticality: 'required',
    description:
      'Essential for platform security validation - transforms pen testing findings into reports',
    triggers: ['pen test', 'penetration testing', 'security report'],
    roles: ['Security'],
    gateContribution: 'Gate 6',
    docPath: '.claude/skills/pentest-report/SKILL.md',
  },
  {
    id: 'security-checklist',
    name: 'security-checklist',
    phase: 'Fase 7 — Seguridad',
    phaseNum: 7,
    source: 'lidr',
    criticality: 'required',
    description: 'Essential for platform security validation - OWASP Top 10 and compliance checks',
    triggers: ['security checklist', 'OWASP validation', 'security review'],
    roles: ['Security'],
    gateContribution: 'Gate 6',
    docPath: '.claude/skills/security-checklist/SKILL.md',
    automated: true,
  },

  // Fase 8 — Despliegue (5)
  {
    id: 'change-request',
    name: 'change-request',
    phase: 'Fase 8 — Despliegue',
    phaseNum: 8,
    source: 'lidr',
    criticality: 'required',
    description:
      'Generate Change Request for production deployment following ITIL Change Management',
    triggers: ['change request', 'deploy request', 'CAB approval'],
    roles: ['DevOps'],
    gateContribution: 'Gate 7',
    docPath: '.claude/skills/change-request/SKILL.md',
  },
  {
    id: 'rollback-plan',
    name: 'rollback-plan',
    phase: 'Fase 8 — Despliegue',
    phaseNum: 8,
    source: 'lidr',
    criticality: 'required',
    description:
      'AUTOMATED rollback plan generation with deployment risk analysis using Python automation',
    triggers: ['rollback plan', 'deployment risk', 'recovery plan'],
    roles: ['DevOps'],
    gateContribution: 'Gate 7',
    docPath: '.claude/skills/rollback-plan/SKILL.md',
    automated: true,
  },
  {
    id: 'release-notes',
    name: 'release-notes',
    phase: 'Fase 8 — Despliegue',
    phaseNum: 8,
    source: 'lidr',
    criticality: 'required',
    description:
      'AUTOMATED release notes generation with business impact analysis using Python automation',
    triggers: ['release notes', 'changelog', 'release communication'],
    roles: ['DevOps'],
    gateContribution: 'Gate 7',
    docPath: '.claude/skills/release-notes/SKILL.md',
    automated: true,
  },
  {
    id: 'postmortem',
    name: 'postmortem',
    phase: 'Fase 8 — Despliegue',
    phaseNum: 8,
    source: 'lidr',
    criticality: 'required',
    description: 'Structure blameless incident postmortem using Five Whys root cause analysis',
    triggers: ['postmortem', 'incident analysis', 'root cause'],
    roles: ['TL', 'DevOps'],
    gateContribution: 'Post-incident',
    docPath: '.claude/skills/postmortem/SKILL.md',
  },

  // Cross-cutting (5 in this section; total Cross-cutting incl. additional below = 9)
  {
    id: 'claude-generate-rule',
    name: 'claude-generate-rule',
    phase: 'Cross-cutting',
    phaseNum: 99,
    source: 'anytime',
    criticality: 'optional',
    description: 'Generate Claude Code rule files with correct frontmatter and content structure',
    triggers: ['generate rule', 'create rule', 'project rule'],
    roles: ['TL'],
    docPath: '.claude/skills/claude-generate-rule/SKILL.md',
  },
  {
    id: 'gate-evaluation',
    name: 'gate-evaluation',
    phase: 'Cross-cutting',
    phaseNum: 99,
    source: 'lidr',
    criticality: 'required',
    description:
      'Generate standardized gate evaluation reports for SDLC phase transitions with weighted scoring',
    triggers: ['gate evaluation', 'phase transition', 'gate assessment', 'handoff package'],
    roles: ['PME', 'PO', 'TL', 'QA', 'Security'],
    gateContribution: 'All Gates',
    docPath: '.claude/skills/gate-evaluation/SKILL.md',
  },
  {
    id: 'commit-management',
    name: 'commit-management',
    phase: 'Cross-cutting',
    phaseNum: 99,
    source: 'anytime',
    criticality: 'optional',
    description:
      'Git commit best practices: conventional commits, fix/amend/rebase/squash, atomic commits, commit history management',
    triggers: [
      'conventional commits',
      'fix commit',
      'amend commit',
      'rewrite history',
      'rebase squash',
    ],
    roles: ['Dev', 'TL', 'DevOps'],
    docPath: '.claude/skills/commit-management/SKILL.md',
  },
  {
    id: 'ticket-validation',
    name: 'ticket-validation',
    phase: 'Cross-cutting',
    phaseNum: 99,
    source: 'anytime',
    criticality: 'optional',
    description:
      'Validate ticket structure: YAML frontmatter, acceptance criteria specificity, Definition of Done, BDD scenarios. Used pre-refinement and pre-PR.',
    triggers: [
      'validate ticket',
      'check YAML frontmatter',
      'verify acceptance criteria',
      'validate DoD',
      'validate BDD',
    ],
    roles: ['PO', 'QA', 'Dev'],
    docPath: '.claude/skills/ticket-validation/SKILL.md',
  },

  // Development (4)
  {
    id: 'claude-agents-architecture',
    name: 'claude-agents-architecture',
    phase: 'Development',
    phaseNum: 100,
    source: 'anytime',
    criticality: 'optional',
    description:
      'Meta-skill entry-point for .agents/ ecosystem authoring: create skills/commands/subagents with automatic sync across 5 AI platforms (Cursor, Claude Code, Gemini, Antigravity, Copilot)',
    triggers: [
      'create a skill',
      'create a subagent',
      'add command to .agents',
      'agents architecture',
    ],
    roles: ['TL'],
    docPath: '.claude/skills/claude-agents-architecture/SKILL.md',
  },
  {
    id: 'claude-command-development',
    name: 'claude-command-development',
    phase: 'Development',
    phaseNum: 100,
    source: 'anytime',
    criticality: 'optional',
    description:
      'Design and implement slash commands for Claude Code with YAML frontmatter structure',
    triggers: ['command development', 'slash command', 'create command'],
    roles: ['TL'],
    docPath: '.claude/skills/claude-command-development/SKILL.md',
  },
  {
    id: 'claude-hook-development',
    name: 'claude-hook-development',
    phase: 'Development',
    phaseNum: 100,
    source: 'anytime',
    criticality: 'optional',
    description: 'Design Claude Code hooks for event-driven workflow automation and quality gates',
    triggers: ['hook development', 'event automation', 'quality guard'],
    roles: ['TL'],
    docPath: '.claude/skills/claude-hook-development/SKILL.md',
  },
  {
    id: 'claude-mcp-integration',
    name: 'claude-mcp-integration',
    phase: 'Development',
    phaseNum: 100,
    source: 'anytime',
    criticality: 'optional',
    description: 'Configure Model Context Protocol servers for external service integration',
    triggers: ['MCP integration', 'external services', 'protocol setup'],
    roles: ['TL'],
    docPath: '.claude/skills/claude-mcp-integration/SKILL.md',
  },

  // Additional skills found in filesystem but missing in data (SDLC-360 remediation)
  {
    id: 'audit-standards',
    name: 'audit-standards',
    phase: 'Fase 0 — Preparación',
    phaseNum: 0,
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
    docPath: '.claude/skills/audit-standards/SKILL.md',
  },
  {
    id: 'playwright-cli',
    name: 'playwright-cli',
    phase: 'Cross-cutting',
    phaseNum: 99,
    source: 'lidr',
    criticality: 'optional',
    description:
      'Browser automation with Playwright CLI for web testing, form filling, screenshots, and data extraction. Use when needing to navigate websites, interact with web pages, fill forms, take screenshots, test web applications.',
    triggers: ['playwright', 'browser automation', 'web testing', 'screenshot', 'form filling'],
    roles: ['QA', 'Dev'],
    docPath: '.claude/skills/playwright-cli/SKILL.md',
  },
  {
    id: 'automated-handoffs',
    name: 'automated-handoffs',
    phase: 'Cross-cutting',
    phaseNum: 0,
    source: 'lidr',
    criticality: 'recommended',
    description: 'Automated creation of phase transition handoffs',
    triggers: ['automated handoffs', 'handoff automation', 'phase transition'],
    roles: ['Tech Lead', 'QA Lead', 'Security Lead', 'DevOps'],
    gateContribution: 'Gates 4-7',
    docPath: '.claude/skills/automated-handoffs/SKILL.md',
    tier: 'Cross-cutting',
    relatedCommands: ['create-pr-enhanced', 'advance-gate'],
  },
  {
    id: 'external-sync',
    name: 'external-sync',
    phase: 'Cross-cutting',
    phaseNum: 0,
    source: 'lidr',
    criticality: 'optional',
    description: 'Bidirectional synchronization between SDLC tracking and external tools',
    triggers: ['external sync', 'tool integration', 'portfolio sync'],
    roles: ['PME', 'TL', 'DevOps'],
    gateContribution: 'All Gates',
    docPath: '.claude/skills/external-sync/SKILL.md',
    tier: 'Cross-cutting',
    relatedSkills: ['sdlc-tracking'],
    relatedCommands: ['track-sdlc'],
  },
  {
    id: 'sdlc-tracking',
    name: 'sdlc-tracking',
    phase: 'Cross-cutting',
    phaseNum: 0,
    source: 'lidr',
    criticality: 'recommended',
    description: 'Centralized SDLC tracking system with sdlc-tracking.yaml management',
    triggers: ['sdlc tracking', 'project tracking', 'phase tracking', 'portfolio dashboard'],
    roles: ['PME', 'SM', 'TL'],
    gateContribution: 'All Gates',
    docPath: '.claude/skills/sdlc-tracking/SKILL.md',
    tier: 'Cross-cutting',
    relatedSkills: ['external-sync'],
    relatedCommands: ['track-sdlc'],
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
    phase: 'BMad — Test Architect',
    phaseNum: 200,
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
    phase: 'BMad — Test Architect',
    phaseNum: 200,
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
    source: 'bmad',
    description:
      'Assess NFRs like performance security and reliability. Use when the user says "lets assess NFRs" or "I want to evaluate non-functional requirements".',
    triggers: ['assess NFRs', 'non-functional requirements', 'evaluate NFRs'],
    roles: ['QA'],
    docPath: '.agents/skills/bmad-testarch-nfr/SKILL.md',
  },
  {
    id: 'bmad-testarch-test-design',
    name: 'bmad-testarch-test-design',
    phase: 'BMad — Test Architect',
    phaseNum: 200,
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
    phase: 'BMad — Architecture & Stories',
    phaseNum: 200,
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
    source: 'bmad',
    description:
      'Creates a dedicated story file with all the context the agent will need to implement it later. Use when the user says "create the next story" or "create story [id]".',
    triggers: ['create the next story', 'create story', 'story file'],
    roles: ['PO'],
    docPath: '.agents/skills/bmad-create-story/SKILL.md',
  },
  {
    id: 'bmad-create-ux-design',
    name: 'bmad-create-ux-design',
    phase: 'BMad — Architecture & Stories',
    phaseNum: 200,
    source: 'bmad',
    description:
      'Plan UX patterns and design specifications. Use when the user says "lets create UX design" or "create UX specifications".',
    triggers: ['create UX design', 'UX specifications', 'plan the UX'],
    roles: ['TL'],
    docPath: '.agents/skills/bmad-create-ux-design/SKILL.md',
  },
  {
    id: 'bmad-dev-story',
    name: 'bmad-dev-story',
    phase: 'BMad — Architecture & Stories',
    phaseNum: 200,
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
    source: 'bmad',
    description:
      'LLM-assisted human-in-the-loop review. Make sense of a change, focus attention where it matters, test. Use when the user says "checkpoint".',
    triggers: ['checkpoint', 'human review', 'walk me through this change'],
    roles: ['QA'],
    docPath: '.agents/skills/bmad-checkpoint-preview/SKILL.md',
  },
  {
    id: 'bmad-distillator',
    name: 'bmad-distillator',
    phase: 'BMad — Utilities',
    phaseNum: 200,
    source: 'bmad',
    description:
      'Lossless LLM-optimized compression of source documents. Use when the user requests to distill documents or create a distillate.',
    triggers: ['distill documents', 'create a distillate', 'document compression'],
    roles: ['TL'],
    docPath: '.agents/skills/bmad-distillator/SKILL.md',
  },
  {
    id: 'bmad-domain-research',
    name: 'bmad-domain-research',
    phase: 'BMad — Utilities',
    phaseNum: 200,
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
    phase: 'BMad — Utilities',
    phaseNum: 200,
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
