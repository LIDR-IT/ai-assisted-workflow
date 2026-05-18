import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useState, useCallback } from 'react';

// Custom hook for tab navigation (extracted pattern from PropuestaMejora)
type TabId = 'flujo' | 'pain' | 'mejoras' | 'ia' | 'sdd' | 'metricas' | 'roadmap';

interface TabConfig {
  id: TabId;
  label: string;
  description: string;
}

function useTabNavigation(tabs: TabConfig[], defaultTab: TabId = 'flujo') {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);

  const switchToTab = useCallback(
    (tabId: TabId) => {
      if (tabs.some((tab) => tab.id === tabId)) {
        setActiveTab(tabId);
      }
    },
    [tabs]
  );

  const getActiveTabConfig = useCallback(() => {
    return tabs.find((tab) => tab.id === activeTab);
  }, [tabs, activeTab]);

  const getNextTab = useCallback(() => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    return tabs[nextIndex];
  }, [tabs, activeTab]);

  const getPreviousTab = useCallback(() => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const previousIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    return tabs[previousIndex];
  }, [tabs, activeTab]);

  const isFirstTab = useCallback(() => {
    return tabs.findIndex((tab) => tab.id === activeTab) === 0;
  }, [tabs, activeTab]);

  const isLastTab = useCallback(() => {
    return tabs.findIndex((tab) => tab.id === activeTab) === tabs.length - 1;
  }, [tabs, activeTab]);

  return {
    activeTab,
    setActiveTab,
    switchToTab,
    getActiveTabConfig,
    getNextTab,
    getPreviousTab,
    isFirstTab,
    isLastTab,
  };
}

describe('useTabNavigation Hook', () => {
  const mockTabs: TabConfig[] = [
    { id: 'flujo', label: 'Flujo', description: 'Flow description' },
    { id: 'pain', label: 'Diagnóstico', description: 'Pain points' },
    { id: 'mejoras', label: 'Mejoras', description: 'Improvements' },
    { id: 'ia', label: 'IA Integration', description: 'AI integration' },
  ];

  beforeEach(() => {
    // Reset any mocks
  });

  it('initializes with default tab', () => {
    const { result } = renderHook(() => useTabNavigation(mockTabs));

    expect(result.current.activeTab).toBe('flujo');
  });

  it('initializes with custom default tab', () => {
    const { result } = renderHook(() => useTabNavigation(mockTabs, 'pain'));

    expect(result.current.activeTab).toBe('pain');
  });

  it('switches to valid tab', () => {
    const { result } = renderHook(() => useTabNavigation(mockTabs));

    act(() => {
      result.current.switchToTab('mejoras');
    });

    expect(result.current.activeTab).toBe('mejoras');
  });

  it('ignores invalid tab switches', () => {
    const { result } = renderHook(() => useTabNavigation(mockTabs));

    const initialTab = result.current.activeTab;

    act(() => {
      result.current.switchToTab('invalid' as TabId);
    });

    expect(result.current.activeTab).toBe(initialTab);
  });

  it('returns active tab configuration', () => {
    const { result } = renderHook(() => useTabNavigation(mockTabs, 'pain'));

    const activeConfig = result.current.getActiveTabConfig();

    expect(activeConfig).toEqual({
      id: 'pain',
      label: 'Diagnóstico',
      description: 'Pain points',
    });
  });

  it('returns undefined for invalid active tab', () => {
    // This simulates a corrupted state scenario
    const { result } = renderHook(() => useTabNavigation([]));

    const activeConfig = result.current.getActiveTabConfig();

    expect(activeConfig).toBeUndefined();
  });

  it('calculates next tab correctly', () => {
    const { result } = renderHook(() => useTabNavigation(mockTabs, 'flujo'));

    const nextTab = result.current.getNextTab();

    expect(nextTab?.id).toBe('pain');
  });

  it('wraps around to first tab when at end', () => {
    const { result } = renderHook(() => useTabNavigation(mockTabs, 'ia'));

    const nextTab = result.current.getNextTab();

    expect(nextTab?.id).toBe('flujo');
  });

  it('calculates previous tab correctly', () => {
    const { result } = renderHook(() => useTabNavigation(mockTabs, 'pain'));

    const previousTab = result.current.getPreviousTab();

    expect(previousTab?.id).toBe('flujo');
  });

  it('wraps around to last tab when at beginning', () => {
    const { result } = renderHook(() => useTabNavigation(mockTabs, 'flujo'));

    const previousTab = result.current.getPreviousTab();

    expect(previousTab?.id).toBe('ia');
  });

  it('identifies first tab correctly', () => {
    const { result } = renderHook(() => useTabNavigation(mockTabs, 'flujo'));

    expect(result.current.isFirstTab()).toBe(true);

    act(() => {
      result.current.switchToTab('pain');
    });

    expect(result.current.isFirstTab()).toBe(false);
  });

  it('identifies last tab correctly', () => {
    const { result } = renderHook(() => useTabNavigation(mockTabs, 'ia'));

    expect(result.current.isLastTab()).toBe(true);

    act(() => {
      result.current.switchToTab('flujo');
    });

    expect(result.current.isLastTab()).toBe(false);
  });

  it('handles empty tabs array', () => {
    const { result } = renderHook(() => useTabNavigation([]));

    expect(result.current.activeTab).toBe('flujo'); // default
    expect(result.current.getActiveTabConfig()).toBeUndefined();

    // Navigation methods should handle empty array gracefully
    act(() => {
      result.current.switchToTab('pain');
    });

    expect(result.current.activeTab).toBe('flujo'); // unchanged
  });

  it('updates when tabs array changes', () => {
    const initialTabs = mockTabs.slice(0, 1); // Just flujo
    const { result, rerender } = renderHook(({ tabs }) => useTabNavigation(tabs), {
      initialProps: { tabs: initialTabs },
    });

    expect(result.current.activeTab).toBe('flujo');

    // Try to switch to a tab that doesn't exist yet
    act(() => {
      result.current.switchToTab('pain');
    });

    expect(result.current.activeTab).toBe('flujo'); // unchanged

    // Update tabs array to include 'pain'
    rerender({ tabs: mockTabs });

    // Now switching should work
    act(() => {
      result.current.switchToTab('pain');
    });

    expect(result.current.activeTab).toBe('pain');
  });

  it('maintains state consistency during rapid changes', () => {
    const { result } = renderHook(() => useTabNavigation(mockTabs));

    // Rapid tab changes
    act(() => {
      result.current.switchToTab('pain');
      result.current.switchToTab('mejoras');
      result.current.switchToTab('ia');
      result.current.switchToTab('flujo');
    });

    expect(result.current.activeTab).toBe('flujo');
    expect(result.current.getActiveTabConfig()?.id).toBe('flujo');
  });

  it('provides stable callback references', () => {
    const { result, rerender } = renderHook(() => useTabNavigation(mockTabs));

    const initialCallbacks = {
      switchToTab: result.current.switchToTab,
      getActiveTabConfig: result.current.getActiveTabConfig,
      getNextTab: result.current.getNextTab,
      getPreviousTab: result.current.getPreviousTab,
      isFirstTab: result.current.isFirstTab,
      isLastTab: result.current.isLastTab,
    };

    // Re-render without changing tabs
    rerender();

    // Callbacks should be stable (memoized)
    expect(result.current.switchToTab).toBe(initialCallbacks.switchToTab);
    expect(result.current.getActiveTabConfig).toBe(initialCallbacks.getActiveTabConfig);
    expect(result.current.getNextTab).toBe(initialCallbacks.getNextTab);
    expect(result.current.getPreviousTab).toBe(initialCallbacks.getPreviousTab);
    expect(result.current.isFirstTab).toBe(initialCallbacks.isFirstTab);
    expect(result.current.isLastTab).toBe(initialCallbacks.isLastTab);
  });

  it('handles single tab scenario', () => {
    const singleTab = mockTabs.slice(0, 1);
    const { result } = renderHook(() => useTabNavigation(singleTab));

    expect(result.current.activeTab).toBe('flujo');
    expect(result.current.isFirstTab()).toBe(true);
    expect(result.current.isLastTab()).toBe(true);

    // Next and previous should be the same tab
    expect(result.current.getNextTab()?.id).toBe('flujo');
    expect(result.current.getPreviousTab()?.id).toBe('flujo');
  });

  describe('Performance', () => {
    it('handles large number of tabs efficiently', () => {
      const manyTabs: TabConfig[] = Array.from({ length: 100 }, (_, i) => ({
        id: `tab-${i}` as TabId,
        label: `Tab ${i}`,
        description: `Description ${i}`,
      }));

      const startTime = performance.now();

      const { result } = renderHook(() => useTabNavigation(manyTabs));

      // Perform various operations
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.getNextTab();
          result.current.getPreviousTab();
          result.current.isFirstTab();
          result.current.isLastTab();
        }
      });

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      expect(executionTime).toBeLessThan(50); // Should be fast
    });
  });
});
