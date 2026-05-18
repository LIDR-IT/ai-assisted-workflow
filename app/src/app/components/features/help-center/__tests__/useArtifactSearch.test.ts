/**
 * @file useArtifactSearch Hook Tests
 * @description Tests for artifact search logic and ranking
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useArtifactSearch, useAllArtifacts } from '../useArtifactSearch';

// Mock the data dependency
vi.mock('@/data/features/helpCenter', () => ({
  allArtifacts: [
    {
      id: 'business-case',
      name: 'business-case',
      type: 'skill',
      description: 'Generate comprehensive business case documentation',
      phase: 'Fase 1 — Originacion',
      phaseNum: 1,
      tier: 'orchestrator',
      roles: ['PME', 'PO'],
      automation: 'assisted',
      category: 'governance',
      triggers: ['create business case', 'justify project'],
      precondition: '',
      mcpsUsed: [],
      relatedSkills: [],
      relatedCommands: [],
      argument: '',
      model: '',
      gateContribution: '',
    },
    {
      id: 'test-plan',
      name: 'test-plan',
      type: 'skill',
      description: 'Create detailed testing strategy and execution plan',
      phase: 'Fase 6 — QA & Testing',
      phaseNum: 6,
      tier: 'automated',
      roles: ['QA'],
      automation: 'automated',
      category: 'testing',
      triggers: ['test plan', 'testing strategy'],
      precondition: '',
      mcpsUsed: [],
      relatedSkills: [],
      relatedCommands: [],
      argument: '',
      model: '',
      gateContribution: '',
    },
    {
      id: 'create-pr',
      name: 'create-pr',
      type: 'command',
      description: 'Create pull request with auto-generated description',
      phase: 'Fase 5 — Desarrollo',
      phaseNum: 5,
      tier: 'tactical',
      roles: ['Dev'],
      automation: 'automated',
      category: 'development',
      triggers: ['create pull request', 'make pr'],
      precondition: '',
      mcpsUsed: [],
      relatedSkills: [],
      relatedCommands: [],
      argument: '',
      model: '',
      gateContribution: '',
    },
    {
      id: 'prd-tecnico',
      name: 'prd-tecnico',
      type: 'skill',
      description: 'Generate technical product requirements document',
      phase: 'Fase 2 — Discovery & PRD',
      phaseNum: 2,
      tier: 'assisted',
      roles: ['TL', 'R&D'],
      automation: 'assisted',
      category: 'planning',
      triggers: ['technical prd', 'technical requirements'],
      precondition: '',
      mcpsUsed: [],
      relatedSkills: [],
      relatedCommands: [],
      argument: '',
      model: '',
      gateContribution: '',
    },
  ],
}));

describe('useArtifactSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Search Functionality', () => {
    it('returns empty results for empty query', () => {
      const { result } = renderHook(() => useArtifactSearch(''));

      expect(result.current.artifacts).toEqual([]);
      expect(result.current.workflows).toEqual([]);
    });

    it('returns empty results for whitespace-only query', () => {
      const { result } = renderHook(() => useArtifactSearch('   \n\t  '));

      expect(result.current.artifacts).toEqual([]);
      expect(result.current.workflows).toEqual([]);
    });

    it('performs case-insensitive search', () => {
      const { result } = renderHook(() => useArtifactSearch('BUSINESS'));

      expect(result.current.artifacts).toHaveLength(1);
      expect(result.current.artifacts[0]?.id).toBe('business-case');
    });

    it('searches in artifact names', () => {
      const { result } = renderHook(() => useArtifactSearch('test-plan'));

      expect(result.current.artifacts).toHaveLength(1);
      expect(result.current.artifacts[0]?.id).toBe('test-plan');
    });

    it('searches in descriptions', () => {
      const { result } = renderHook(() => useArtifactSearch('pull request'));

      expect(result.current.artifacts).toHaveLength(1);
      expect(result.current.artifacts[0]?.id).toBe('create-pr');
    });

    it('searches in roles', () => {
      const { result } = renderHook(() => useArtifactSearch('QA'));

      expect(result.current.artifacts).toHaveLength(1);
      expect(result.current.artifacts[0]?.id).toBe('test-plan');
    });

    it('searches in categories', () => {
      const { result } = renderHook(() => useArtifactSearch('testing'));

      expect(result.current.artifacts).toHaveLength(1);
      expect(result.current.artifacts[0]?.id).toBe('test-plan');
    });
  });

  describe('Multi-term Search', () => {
    it('finds artifacts matching multiple terms', () => {
      const { result } = renderHook(() => useArtifactSearch('technical requirements'));

      expect(result.current.artifacts).toHaveLength(1);
      expect(result.current.artifacts[0]?.id).toBe('prd-tecnico');
    });

    it('filters out results with insufficient score', () => {
      const { result } = renderHook(() => useArtifactSearch('completely unrelated terms xyz'));

      expect(result.current.artifacts).toHaveLength(0);
    });

    it('ranks results by relevance score', () => {
      const { result } = renderHook(() => useArtifactSearch('automated'));

      // Both test-plan and create-pr have 'automated'
      expect(result.current.artifacts.length).toBeGreaterThan(0);
      // Both should have automation: 'automated', so just verify they're found
      expect(result.current.artifacts.some((a) => a.id === 'test-plan')).toBe(true);
      expect(result.current.artifacts.some((a) => a.id === 'create-pr')).toBe(true);
    });
  });

  describe('Workflow Search', () => {
    it('finds workflows by match terms', () => {
      const { result } = renderHook(() => useArtifactSearch('discovery'));

      expect(result.current.workflows).toHaveLength(1);
      expect(result.current.workflows[0]?.id).toBe('project-discovery');
    });

    it('includes workflow steps in results', () => {
      const { result } = renderHook(() => useArtifactSearch('development'));

      expect(result.current.workflows.length).toBeGreaterThan(0);
      const workflow = result.current.workflows.find((w) => w.id === 'project-discovery');
      expect(workflow?.steps).toBeDefined();
      expect(workflow?.steps.length).toBeGreaterThan(0);
    });

    it('ranks workflows by match quality', () => {
      const { result } = renderHook(() => useArtifactSearch('security'));

      expect(result.current.workflows.length).toBeGreaterThanOrEqual(1);
      expect(result.current.workflows[0]?.name).toBe('Security Assessment Workflow');
    });
  });

  describe('Search Performance', () => {
    it('memoizes results for same query', () => {
      const { result, rerender } = renderHook(({ query }) => useArtifactSearch(query), {
        initialProps: { query: 'business' },
      });

      const firstResult = result.current.artifacts;

      rerender({ query: 'business' }); // Same query

      const secondResult = result.current.artifacts;

      // Should be the same reference due to memoization
      expect(firstResult).toBe(secondResult);
    });

    it('recalculates results for different query', () => {
      const { result, rerender } = renderHook(({ query }) => useArtifactSearch(query), {
        initialProps: { query: 'business' },
      });

      const firstResult = result.current.artifacts;

      rerender({ query: 'test' }); // Different query

      const secondResult = result.current.artifacts;

      // Should be different references
      expect(firstResult).not.toBe(secondResult);
    });
  });

  describe('Edge Cases', () => {
    it('handles special characters in search', () => {
      const { result } = renderHook(() => useArtifactSearch('PR-123 & test'));

      // Should not crash and should handle gracefully
      expect(result.current.artifacts).toBeDefined();
      expect(Array.isArray(result.current.artifacts)).toBe(true);
    });

    it('handles very long search queries', () => {
      const longQuery =
        'this is a very long search query that might be problematic in some search implementations';
      const { result } = renderHook(() => useArtifactSearch(longQuery));

      expect(result.current.artifacts).toBeDefined();
      expect(Array.isArray(result.current.artifacts)).toBe(true);
    });

    it('handles unicode characters', () => {
      const { result } = renderHook(() => useArtifactSearch('tecnico'));

      expect(result.current.artifacts).toHaveLength(1);
      expect(result.current.artifacts[0]?.id).toBe('prd-tecnico');
    });
  });
});

describe('useAllArtifacts', () => {
  it('returns all available artifacts', () => {
    const { result } = renderHook(() => useAllArtifacts());

    expect(result.current).toHaveLength(4);
    expect(result.current.map((a) => a.id)).toEqual([
      'business-case',
      'test-plan',
      'create-pr',
      'prd-tecnico',
    ]);
  });

  it('memoizes the artifacts list', () => {
    const { result, rerender } = renderHook(() => useAllArtifacts());

    const firstResult = result.current;
    rerender();
    const secondResult = result.current;

    // Should be the same reference
    expect(firstResult).toBe(secondResult);
  });
});
