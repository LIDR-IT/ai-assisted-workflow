import { describe, it, expect } from 'vitest';
import { tabsConfig, type TabId } from '@/data/features/propuestaMejora';

describe('PropuestaMejora Data Layer', () => {
  describe('tabsConfig', () => {
    it('has all required tabs', () => {
      const expectedTabIds = ['flujo', 'pain', 'mejoras', 'metricas'];
      const actualTabIds = tabsConfig.map((tab) => tab.id);

      expectedTabIds.forEach((expectedId) => {
        expect(actualTabIds).toContain(expectedId);
      });
    });

    it('has correct structure for each tab', () => {
      tabsConfig.forEach((tab) => {
        expect(tab).toHaveProperty('id');
        expect(tab).toHaveProperty('label');
        expect(typeof tab.id).toBe('string');
        expect(typeof tab.label).toBe('string');
      });
    });

    it('has unique tab IDs', () => {
      const ids = tabsConfig.map((tab) => tab.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('has non-empty labels', () => {
      tabsConfig.forEach((tab) => {
        expect(tab.label.trim()).not.toBe('');
      });
    });

    it('contains expected tab configurations', () => {
      const tabMap = new Map(tabsConfig.map((tab) => [tab.id, tab]));

      expect(tabMap.get('flujo')).toEqual({
        id: 'flujo',
        label: expect.any(String),
      });

      expect(tabMap.get('pain')).toEqual({
        id: 'pain',
        label: expect.any(String),
      });

      expect(tabMap.get('mejoras')).toEqual({
        id: 'mejoras',
        label: expect.any(String),
      });

      expect(tabMap.get('metricas')).toEqual({
        id: 'metricas',
        label: expect.any(String),
      });
    });

    it('maintains consistent ordering', () => {
      const expectedOrder = ['flujo', 'pain', 'mejoras', 'metricas'];
      const actualOrder = tabsConfig.map((tab) => tab.id);

      expect(actualOrder).toEqual(expectedOrder);
    });
  });

  describe('TabId Type', () => {
    it('accepts valid tab IDs', () => {
      const validIds: TabId[] = ['flujo', 'pain', 'mejoras', 'metricas'];

      validIds.forEach((id) => {
        expect(tabsConfig.some((tab) => tab.id === id)).toBe(true);
      });
    });
  });

  describe('Data Integrity', () => {
    it('has exactly 4 tabs', () => {
      expect(tabsConfig).toHaveLength(4);
    });

    it('follows naming conventions', () => {
      tabsConfig.forEach((tab) => {
        // ID should be lowercase and descriptive
        expect(tab.id).toMatch(/^[a-z]+$/);

        // Label should start with capital letter or emoji
        expect(tab.label).toMatch(/^[A-ZÀ-ÖØ-ÝÀ-ɏ]/);
      });
    });

    it('maintains referential integrity with component expectations', () => {
      const componentsExpected = ['FlowTab', 'DiagnosticoTab', 'MejorasTab', 'MetricasTab'];

      expect(tabsConfig).toHaveLength(componentsExpected.length);
    });

    it('provides complete metadata for UI rendering', () => {
      tabsConfig.forEach((tab) => {
        expect(tab.id).toBeDefined();
        expect(tab.label).toBeDefined();

        // Labels should be reasonably short for UI
        expect(tab.label.length).toBeLessThan(30);
        expect(tab.label.length).toBeGreaterThan(2);
      });
    });
  });

  describe('Immutability', () => {
    it('should not be accidentally modified', () => {
      const originalLength = tabsConfig.length;
      const originalFirstTab = { ...tabsConfig[0] };

      expect(() => {
        const modifiedConfig = [...tabsConfig];
        modifiedConfig.push({ id: 'invalid' as TabId, label: 'Invalid' });
      }).not.toThrow();

      expect(tabsConfig).toHaveLength(originalLength);
      expect(tabsConfig[0]).toEqual(originalFirstTab);
    });
  });

  describe('Performance Characteristics', () => {
    it('should be efficient for lookups', () => {
      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        tabsConfig.find((tab) => tab.id === 'flujo');
        tabsConfig.find((tab) => tab.id === 'metricas');
      }

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      expect(executionTime).toBeLessThan(10);
    });

    it('should have reasonable memory footprint', () => {
      const jsonString = JSON.stringify(tabsConfig);
      expect(jsonString.length).toBeLessThan(2000);
    });
  });
});
