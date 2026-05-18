/**
 * SINGLE SOURCE OF TRUTH - Skills Registry
 * Centralizes all skills data to eliminate duplication across components
 */

export interface Skill {
  id: string;
  name: string;
  phase: string;
  phaseNum: number;
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
  // Fase 0 — Preparación (2)
  {
    id: 'project-classifier',
    name: 'project-classifier',
    phase: 'Fase 0 — Preparación',
    phaseNum: 0,
    description:
      'Auto-classify project type (Web App, Mobile, Backend, etc.) with confidence scoring and tech stack detection',
    triggers: ['classify project', 'determine project type', 'auto-categorize'],
    roles: ['TL', 'PME'],
    gateContribution: 'Pre-Gate 0',
    docPath: '.claude/skills/project-classifier/SKILL.md',
    automated: true,
  },
  {
    id: 'document-discovery',
    name: 'document-discovery',
    phase: 'Fase 0 — Preparación',
    phaseNum: 0,
    description: 'LIDR SDLC document discovery and inventory with intelligent categorization',
    triggers: ['discover documents', 'inventory docs', 'document audit'],
    roles: ['TL', 'PME'],
    docPath: '.claude/skills/document-discovery/SKILL.md',
  },

  // Fase 1 — Originación (6)
  {
    id: 'business-case',
    name: 'business-case',
    phase: 'Fase 1 — Originación',
    phaseNum: 1,
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
    description:
      'Tracking Integration — Adaptive Project Kickstart for any tracking tool (Jira, Linear, Notion, etc.)',
    triggers: ['create epic', 'tracking setup', 'project tracking', 'initialize tracking'],
    roles: ['PME', 'PO'],
    gateContribution: 'Gate 0',
    docPath: '.claude/skills/tracking-integration/SKILL.md',
  },
  {
    id: 'business-model',
    name: 'business-model',
    phase: 'Fase 1 — Originación',
    phaseNum: 1,
    description:
      'Generate Business Model section with system description, competitive advantages, feature inventory, and Lean Canvas',
    triggers: ['business model', 'lean canvas', 'competitive analysis', 'product model'],
    roles: ['PO'],
    gateContribution: 'Gate 0',
    docPath: '.claude/skills/business-model/SKILL.md',
  },

  // Fase 2 — Discovery (9)
  {
    id: 'prd-tecnico',
    name: 'prd-tecnico',
    phase: 'Fase 2 — Discovery',
    phaseNum: 2,
    description:
      'Essential for technical feasibility documentation in software projects. Critical for documenting architecture, NFRs, integrations, and risks.',
    triggers: ['technical PRD', 'architecture analysis', 'technical feasibility'],
    roles: ['Tech Lead', 'TL'],
    gateContribution: 'Gate 1',
    docPath: '.claude/skills/prd-tecnico/SKILL.md',
  },
  {
    id: 'prd-funcional',
    name: 'prd-funcional',
    phase: 'Fase 2 — Discovery',
    phaseNum: 2,
    description:
      'Essential for functional product specification in software projects. Critical for documenting user journeys, personas, business requirements.',
    triggers: ['functional PRD', 'user journeys', 'product requirements'],
    roles: ['PO'],
    gateContribution: 'Gate 1',
    docPath: '.claude/skills/prd-funcional/SKILL.md',
  },
  {
    id: 'review-cruzado',
    name: 'review-cruzado',
    phase: 'Fase 2 — Discovery',
    phaseNum: 2,
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
    description:
      'Essential for software project risk management. Critical for identifying compliance failures, technical accuracy risks, and operational challenges.',
    triggers: ['risk management', 'identify risks', 'risk log'],
    roles: ['PO', 'TL', 'PME'],
    gateContribution: 'Gate 1',
    docPath: '.claude/skills/risk-log/SKILL.md',
  },
  {
    id: 'poc-report',
    name: 'poc-report',
    phase: 'Fase 2 — Discovery',
    phaseNum: 2,
    description:
      'Essential for technical feasibility validation before committing resources. Critical for algorithm validation, performance testing, and technical proof of concepts.',
    triggers: ['POC report', 'proof of concept', 'technical validation'],
    roles: ['Tech Lead', 'TL'],
    gateContribution: 'Gate 1',
    docPath: '.claude/skills/poc-report/SKILL.md',
  },
  {
    id: 'use-cases',
    name: 'use-cases',
    phase: 'Fase 2 — Discovery',
    phaseNum: 2,
    description:
      'Generate the 3 main use cases for any software system with descriptions and Mermaid flowchart diagrams',
    triggers: ['use cases', 'system interactions', 'user flows', 'system usage'],
    roles: ['PO'],
    gateContribution: 'Gate 1',
    docPath: '.claude/skills/use-cases/SKILL.md',
  },
  {
    id: 'design-doc',
    name: 'design-doc',
    phase: 'Fase 2 — Discovery',
    phaseNum: 2,
    description:
      'Orchestrate generation of complete Software Design Document combining business model, use cases, data model, and system architecture',
    triggers: [
      'design document',
      'software design',
      'comprehensive design',
      'design orchestration',
    ],
    roles: ['TL'],
    gateContribution: 'Gate 1',
    docPath: '.claude/skills/design-doc/SKILL.md',
  },

  // Fase 3 — Especificación (4)
  {
    id: 'generate-rf',
    name: 'generate-rf',
    phase: 'Fase 3 — Especificación',
    phaseNum: 3,
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
    description:
      'AUTOMATED cross-validation of RFs and NFRs against PRDs. Executes 5-pass validation in <5 minutes vs 6+ hours manual.',
    triggers: ['validate requirements', 'check traceability', 'RTM validation'],
    roles: ['PO', 'TL', 'QA'],
    gateContribution: 'Gate 2',
    docPath: '.claude/skills/validate-requirements/SKILL.md',
    automated: true,
  },
  {
    id: 'epic-breakdown',
    name: 'epic-breakdown',
    phase: 'Fase 3 — Especificación',
    phaseNum: 3,
    description:
      'Essential for Phase 3→4 transition. Critical for Sprint Planning success. Decomposes master epic into feature sub-epics with dependencies.',
    triggers: ['break down epic', 'epic decomposition', 'feature planning'],
    roles: ['PO', 'TL'],
    gateContribution: 'Gate 2',
    docPath: '.claude/skills/epic-breakdown/SKILL.md',
  },

  // Fase 4 — Planning (3)
  {
    id: 'user-stories',
    name: 'user-stories',
    phase: 'Fase 4 — Planning',
    phaseNum: 4,
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
    description: 'Generate Dev-to-QA handoff document for Ready for QA transitions',
    triggers: ['handoff to QA', 'development complete', 'QA transition'],
    roles: ['Dev', 'TL'],
    gateContribution: 'Gate 4',
    docPath: '.claude/skills/dev-handoff-qa/SKILL.md',
  },

  // Fase 6 — QA (5)
  {
    id: 'test-plan',
    name: 'test-plan',
    phase: 'Fase 6 — QA',
    phaseNum: 6,
    description: 'AUTOMATED test plan generation with risk-based approach using Python automation.',
    triggers: ['test plan', 'test strategy', 'QA planning'],
    roles: ['QA', 'QA Lead'],
    gateContribution: 'Gate 5',
    docPath: '.claude/skills/test-plan/SKILL.md',
    automated: true,
  },
  {
    id: 'create-test-cases',
    name: 'create-test-cases',
    phase: 'Fase 6 — QA',
    phaseNum: 6,
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
    description: 'Essential for QA sign-off - consolidates test execution results',
    triggers: ['test execution', 'QA report', 'test results'],
    roles: ['QA Lead'],
    gateContribution: 'Gate 5',
    docPath: '.claude/skills/test-execution-report/SKILL.md',
  },
  {
    id: 'regression-suite',
    name: 'regression-suite',
    phase: 'Fase 6 — QA',
    phaseNum: 6,
    description:
      'Manage regression test suite selection and prioritization based on code change impact analysis',
    triggers: ['regression tests', 'impact analysis', 'select tests'],
    roles: ['QA'],
    gateContribution: 'Gate 5',
    docPath: '.claude/skills/regression-suite/SKILL.md',
    automated: true,
  },

  // Fase 7 — Seguridad (4)
  {
    id: 'vuln-assessment',
    name: 'vuln-assessment',
    phase: 'Fase 7 — Seguridad',
    phaseNum: 7,
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
    description:
      'AUTOMATED release notes generation with business impact analysis using Python automation',
    triggers: ['release notes', 'changelog', 'release communication'],
    roles: ['DevOps'],
    gateContribution: 'Gate 7',
    docPath: '.claude/skills/release-notes/SKILL.md',
    automated: true,
  },
  {
    id: 'retrospective',
    name: 'retrospective',
    phase: 'Fase 8 — Despliegue',
    phaseNum: 8,
    description: 'Structure data-driven retrospective with metrics from Jira, GitHub, and QA',
    triggers: ['retrospective', 'sprint retro', 'lessons learned'],
    roles: ['SM'],
    gateContribution: 'Post-Gate 7',
    docPath: '.claude/skills/retrospective/SKILL.md',
  },
  {
    id: 'postmortem',
    name: 'postmortem',
    phase: 'Fase 8 — Despliegue',
    phaseNum: 8,
    description: 'Structure blameless incident postmortem using Five Whys root cause analysis',
    triggers: ['postmortem', 'incident analysis', 'root cause'],
    roles: ['TL', 'DevOps'],
    gateContribution: 'Post-incident',
    docPath: '.claude/skills/postmortem/SKILL.md',
  },

  // Cross-cutting (6)
  {
    id: 'generate-rule',
    name: 'generate-rule',
    phase: 'Cross-cutting',
    phaseNum: 99,
    description: 'Generate Claude Code rule files with correct frontmatter and content structure',
    triggers: ['generate rule', 'create rule', 'project rule'],
    roles: ['TL'],
    docPath: '.claude/skills/generate-rule/SKILL.md',
  },
  {
    id: 'architecture-doc',
    name: 'architecture-doc',
    phase: 'Cross-cutting',
    phaseNum: 99,
    description:
      'Generate comprehensive technical architecture documentation at 5 levels using project templates',
    triggers: ['architecture doc', 'system design', 'tech documentation'],
    roles: ['TL'],
    docPath: '.claude/skills/architecture-doc/SKILL.md',
  },
  {
    id: 'ux-design-spec',
    name: 'ux-design-spec',
    phase: 'Cross-cutting',
    phaseNum: 99,
    description:
      'Generate UX Design Specification from PRD Funcional with user flows and interaction patterns',
    triggers: ['UX spec', 'design specification', 'user flows'],
    roles: ['UX', 'PO'],
    docPath: '.claude/skills/ux-design-spec/SKILL.md',
  },
  {
    id: 'implementation-phases',
    name: 'implementation-phases',
    phase: 'Cross-cutting',
    phaseNum: 99,
    description:
      'Decompose project into incremental implementation phases with milestones and dependencies',
    triggers: ['implementation plan', 'project phases', 'milestone planning'],
    roles: ['TL', 'PME'],
    docPath: '.claude/skills/implementation-phases/SKILL.md',
  },
  {
    id: 'epic-review',
    name: 'epic-review',
    phase: 'Cross-cutting',
    phaseNum: 99,
    description: 'Review epic execution vs original plan after delivery with lessons learned',
    triggers: ['epic review', 'delivery review', 'project closure'],
    roles: ['PME', 'PO'],
    docPath: '.claude/skills/epic-review/SKILL.md',
  },
  {
    id: 'gate-evaluation',
    name: 'gate-evaluation',
    phase: 'Cross-cutting',
    phaseNum: 99,
    description:
      'Generate standardized gate evaluation reports for SDLC phase transitions with weighted scoring',
    triggers: ['gate evaluation', 'phase transition', 'gate assessment', 'handoff package'],
    roles: ['PME', 'PO', 'TL', 'QA', 'Security'],
    gateContribution: 'All Gates',
    docPath: '.claude/skills/gate-evaluation/SKILL.md',
  },

  // Development (6)
  {
    id: 'skill-creator',
    name: 'skill-creator',
    phase: 'Development',
    phaseNum: 100,
    description:
      'Build, evaluate, and iteratively improve Claude Code skills through test-driven development',
    triggers: ['create skill', 'skill development', 'new skill'],
    roles: ['TL'],
    docPath: '.claude/skills/skill-creator/SKILL.md',
  },
  {
    id: 'skill-development',
    name: 'skill-development',
    phase: 'Development',
    phaseNum: 100,
    description:
      'Guidance for creating effective Claude Code plugin skills with progressive disclosure',
    triggers: ['skill guidance', 'plugin development', 'skill best practices'],
    roles: ['TL'],
    docPath: '.claude/skills/skill-development/SKILL.md',
  },
  {
    id: 'command-development',
    name: 'command-development',
    phase: 'Development',
    phaseNum: 100,
    description:
      'Design and implement slash commands for Claude Code with YAML frontmatter structure',
    triggers: ['command development', 'slash command', 'create command'],
    roles: ['TL'],
    docPath: '.claude/skills/command-development/SKILL.md',
  },
  {
    id: 'hook-development',
    name: 'hook-development',
    phase: 'Development',
    phaseNum: 100,
    description: 'Design Claude Code hooks for event-driven workflow automation and quality gates',
    triggers: ['hook development', 'event automation', 'quality guard'],
    roles: ['TL'],
    docPath: '.claude/skills/hook-development/SKILL.md',
  },
  {
    id: 'agent-development',
    name: 'agent-development',
    phase: 'Development',
    phaseNum: 100,
    description:
      'Design autonomous Claude Code agents with system prompts and triggering conditions',
    triggers: ['agent development', 'autonomous agent', 'agent design'],
    roles: ['TL'],
    docPath: '.claude/skills/agent-development/SKILL.md',
  },
  {
    id: 'mcp-integration',
    name: 'mcp-integration',
    phase: 'Development',
    phaseNum: 100,
    description: 'Configure Model Context Protocol servers for external service integration',
    triggers: ['MCP integration', 'external services', 'protocol setup'],
    roles: ['TL'],
    docPath: '.claude/skills/mcp-integration/SKILL.md',
  },

  // Additional skills found in filesystem but missing in data (SDLC-360 remediation)
  {
    id: 'audit-standards',
    name: 'audit-standards',
    phase: 'Fase 0 — Preparación',
    phaseNum: 0,
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
    id: 'brainstorming',
    name: 'brainstorming',
    phase: 'Fase 0 — Preparación',
    phaseNum: 0,
    description:
      'LIDR SDLC methodology-based structured innovation and problem-solving skill for any domain. Critical for all creative work - features, components, solutions, architecture decisions.',
    triggers: ['brainstorming', 'ideation', 'creative solutions', 'innovation session'],
    roles: ['PO', 'TL', 'Tech Lead'],
    gateContribution: 'Pre-Gate 0',
    docPath: '.claude/skills/brainstorming/SKILL.md',
  },
  {
    id: 'multi-agent-audit',
    name: 'multi-agent-audit',
    phase: 'Fase 0 — Preparación',
    phaseNum: 0,
    description:
      'Comprehensive multi-agent audit coordinator that spawns 10 parallel agents to validate all 49 skills against SDLC compliance standards. ALWAYS use when conducting ecosystem-wide quality assessments.',
    triggers: [
      'multi agent audit',
      'parallel validation',
      'ecosystem audit',
      'comprehensive skill review',
    ],
    roles: ['TL'],
    gateContribution: 'Pre-Gate 0',
    docPath: '.claude/skills/multi-agent-audit/SKILL.md',
  },
  {
    id: 'domain-research',
    name: 'domain-research',
    phase: 'Fase 2 — Discovery',
    phaseNum: 2,
    description:
      'Systematic domain exploration for Discovery phase projects. Use when researching domain, analyzing market patterns, investigating competitors, studying industry best practices, or conducting competitive analysis.',
    triggers: [
      'research domain',
      'analyze market patterns',
      'investigate competitors',
      'study best practices',
      'competitive analysis',
    ],
    roles: ['PO', 'Tech Lead'],
    gateContribution: 'Gate 1',
    docPath: '.claude/skills/domain-research/SKILL.md',
  },
  {
    id: 'technical-research',
    name: 'technical-research',
    phase: 'Fase 2 — Discovery',
    phaseNum: 2,
    description:
      'Systematic technical feasibility investigation for complex engineering decisions. Use when evaluating architecture patterns, performance analysis, integration complexity, technology evaluation.',
    triggers: [
      'technical research',
      'feasibility study',
      'technology evaluation',
      'architecture analysis',
    ],
    roles: ['Tech Lead', 'TL'],
    gateContribution: 'Gate 1',
    docPath: '.claude/skills/technical-research/SKILL.md',
  },
  {
    id: 'bdd-patterns',
    name: 'bdd-patterns',
    phase: 'Fase 3 — Especificación',
    phaseNum: 3,
    description:
      'BDD patterns and Gherkin syntax validation. Use when validating Given-When-Then patterns, writing BDD scenarios, checking Gherkin syntax, creating acceptance criteria, or formatting BDD patterns.',
    triggers: [
      'validate Given-When-Then',
      'write BDD scenarios',
      'check Gherkin syntax',
      'create acceptance criteria',
      'format BDD patterns',
    ],
    roles: ['QA', 'PO'],
    gateContribution: 'Gate 2',
    docPath: '.claude/skills/bdd-patterns/SKILL.md',
  },
  {
    id: 'playwright-cli',
    name: 'playwright-cli',
    phase: 'Cross-cutting',
    phaseNum: 99,
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
    description: 'Centralized SDLC tracking system with sdlc-tracking.yaml management',
    triggers: ['sdlc tracking', 'project tracking', 'phase tracking', 'portfolio dashboard'],
    roles: ['PME', 'SM', 'TL'],
    gateContribution: 'All Gates',
    docPath: '.claude/skills/sdlc-tracking/SKILL.md',
    tier: 'Cross-cutting',
    relatedSkills: ['external-sync'],
    relatedCommands: ['track-sdlc'],
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
