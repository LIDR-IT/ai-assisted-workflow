import { useMemo } from 'react';
import {
  allArtifacts,
  type Artifact,
  type ArtifactType,
  type WorkflowSuggestion,
} from '@/data/features/helpCenter';

interface WorkflowSuggestionForSearch extends WorkflowSuggestion {
  id: string;
  name: string;
  steps: Array<{ artifact: string; type: ArtifactType; action: string }>;
}

interface SearchResults {
  artifacts: Artifact[];
  workflows: WorkflowSuggestionForSearch[];
}

function searchArtifacts(query: string): Artifact[] {
  if (!query.trim()) {
    return [];
  }
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

  return allArtifacts
    .map((a) => {
      const searchable = [
        a.name,
        a.description,
        a.phase || '',
        a.tier || '',
        ...(a.triggers || []),
        ...(a.roles || []),
        a.precondition || '',
        ...(a.mcpsUsed || []),
        ...(a.relatedSkills || []),
        ...(a.relatedCommands || []),
        a.argument || '',
        a.category || '',
        a.model || '',
        a.gateContribution || '',
        a.automation || '',
      ]
        .join(' ')
        .toLowerCase();

      let score = 0;
      let exactMatch = false;

      for (const term of terms) {
        const termScore = searchable.includes(term) ? 1 : 0;
        if (a.name.toLowerCase().includes(term)) {
          score += 3; // Boost name matches
        }
        if (a.description.toLowerCase().includes(term)) {
          score += 2; // Boost description matches
        }
        if (termScore > 0) {
          score += termScore;
        }
        if (searchable.includes(term)) {
          exactMatch = true;
        }
      }

      return { artifact: a, score, exactMatch };
    })
    .filter((result) => result.exactMatch || result.score > 0)
    .sort((a, b) => {
      if (a.exactMatch && !b.exactMatch) {
        return -1;
      }
      if (!a.exactMatch && b.exactMatch) {
        return 1;
      }
      return b.score - a.score;
    })
    .map((result) => result.artifact);
}

function searchWorkflows(query: string): WorkflowSuggestionForSearch[] {
  if (!query.trim()) {
    return [];
  }
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

  const workflows: WorkflowSuggestionForSearch[] = [
    {
      id: 'project-discovery',
      name: 'Project Discovery to Development',
      title: 'Project Discovery to Development',
      description: 'Complete workflow from business case to development handoff',
      steps: [
        { artifact: 'business-case', type: 'skill', action: 'Create Business Case document' },
        { artifact: 'stakeholder-map', type: 'skill', action: 'Map project stakeholders' },
        { artifact: 'prd-funcional', type: 'skill', action: 'Create Functional PRD' },
        { artifact: 'prd-tecnico', type: 'skill', action: 'Create Technical PRD' },
        { artifact: 'review-cruzado', type: 'skill', action: 'Cross-review PRDs' },
        {
          artifact: 'validate-requirements',
          type: 'skill',
          action: 'Generate and validate RFs+NFRs',
        },
        { artifact: '/advance-gate', type: 'command', action: 'Advance Gate 2 to Sprint Planning' },
      ],
      roles: ['PME', 'PO', 'TL', 'Dev'],
      tags: ['discovery', 'prd', 'requirements'],
    },
    {
      id: 'sprint-to-production',
      name: 'Sprint to Production Pipeline',
      title: 'Sprint to Production Pipeline',
      description: 'Development to production deployment workflow',
      steps: [
        { artifact: '/implement-ticket', type: 'command', action: 'Implement development tasks' },
        { artifact: '/prepare-testing', type: 'command', action: 'Generate QA test suite' },
        { artifact: 'test-execution-report', type: 'skill', action: 'Execute tests and report' },
        { artifact: 'security-checklist', type: 'skill', action: 'Security validation' },
        { artifact: 'change-request', type: 'skill', action: 'Generate change request' },
        { artifact: '/create-release-notes', type: 'command', action: 'Generate release notes' },
      ],
      roles: ['Dev', 'QA', 'Sec', 'DevOps'],
      tags: ['development', 'testing', 'deployment'],
    },
    {
      id: 'quick-feature',
      name: 'Quick Feature Development',
      title: 'Quick Feature Development',
      description: 'Agile workflow for small features (≤40h)',
      steps: [
        { artifact: '/quick-spec', type: 'command', action: 'Create lightweight spec' },
        { artifact: 'user-stories', type: 'skill', action: 'Generate user stories' },
        { artifact: '/create-branch', type: 'command', action: 'Create feature branch' },
        { artifact: '/implement-ticket', type: 'command', action: 'Implement feature' },
        { artifact: '/create-pr', type: 'command', action: 'Create pull request' },
      ],
      roles: ['Dev', 'PO', 'TL'],
      tags: ['agile', 'feature', 'quick'],
    },
    {
      id: 'security-assessment',
      name: 'Security Assessment Workflow',
      title: 'Security Assessment Workflow',
      description: 'Complete security validation process',
      steps: [
        { artifact: 'vuln-assessment', type: 'skill', action: 'Assess vulnerabilities' },
        { artifact: 'dast-interpretation', type: 'skill', action: 'Interpret DAST results' },
        { artifact: 'pentest-report', type: 'skill', action: 'Generate penetration test report' },
        { artifact: 'security-checklist', type: 'skill', action: 'Validate security checklist' },
        { artifact: '/advance-gate', type: 'command', action: 'Security gate approval' },
      ],
      roles: ['Sec', 'TL'],
      tags: ['security', 'assessment', 'compliance'],
    },
    {
      id: 'documentation-maintenance',
      name: 'Documentation Maintenance',
      title: 'Documentation Maintenance',
      description: 'Keep project documentation synchronized',
      steps: [
        { artifact: '/sync-docs', type: 'command', action: 'Synchronize documentation' },
        {
          artifact: '/validate-project-docs',
          type: 'command',
          action: 'Validate documentation quality',
        },
        {
          artifact: 'architecture-doc',
          type: 'skill',
          action: 'Update architecture documentation',
        },
        { artifact: 'adr', type: 'skill', action: 'Create architecture decisions' },
      ],
      roles: ['TL', 'Dev', 'QA'],
      tags: ['documentation', 'maintenance', 'sync'],
    },
    {
      id: 'requirements-specification',
      name: 'Requirements Specification & Validation',
      title: 'Requirements Specification & Validation',
      description:
        'Complete Specification Phase: generate and validate functional and non-functional requirements with BDD acceptance criteria',
      steps: [
        {
          artifact: 'generate-rf',
          type: 'skill',
          action: 'Generate Functional Requirements with BDD',
        },
        { artifact: 'generate-nfr', type: 'skill', action: 'Generate Non-Functional Requirements' },
        {
          artifact: 'validate-requirements',
          type: 'command',
          action: 'Validate RF+NFR coherence and traceability',
        },
        {
          artifact: 'epic-breakdown',
          type: 'skill',
          action: 'Decompose epic into implementable sub-epics',
        },
        {
          artifact: '/advance-gate',
          type: 'command',
          action: 'Advance to Sprint Planning (Gate 2)',
        },
      ],
      roles: ['PO', 'TL', 'QA'],
      tags: ['specification', 'RF', 'NFR', 'BDD', 'validate-requirements', 'especificacion'],
    },
  ];

  return workflows
    .map((w) => {
      const searchable = [
        w.name,
        w.description,
        ...w.roles,
        ...w.tags,
        ...w.steps.map((s) => s.artifact),
        ...w.steps.map((s) => s.action),
      ]
        .join(' ')
        .toLowerCase();

      let score = 0;
      let exactMatch = false;

      for (const term of terms) {
        if (searchable.includes(term)) {
          score += 1;
          exactMatch = true;
        }
        if (w.name.toLowerCase().includes(term)) {
          score += 2;
        }
        if (w.description.toLowerCase().includes(term)) {
          score += 1.5;
        }
      }

      return { workflow: w, score, exactMatch };
    })
    .filter((result) => result.exactMatch)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.workflow);
}

export function useArtifactSearch(query: string): SearchResults {
  return useMemo(() => {
    const artifacts = searchArtifacts(query);
    const workflows = searchWorkflows(query);

    return {
      artifacts,
      workflows,
    };
  }, [query]);
}

export function useAllArtifacts(): Artifact[] {
  return useMemo(() => allArtifacts, []);
}
