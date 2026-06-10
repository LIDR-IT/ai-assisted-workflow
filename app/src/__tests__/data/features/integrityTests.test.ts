import { describe, it, expect } from 'vitest';
import {
  TEST_DEFINITIONS,
  TEST_CATEGORIES,
  EXPECTED_COUNTS,
  VALID_ROLES,
  HELPCENTER_DOCPATHS,
  SITEMAP_DOCPATHS,
  TEST_EXECUTION_CONFIG,
  getTestsByCategory,
  getSyncTests,
  getAsyncTests,
  type TestDefinition,
  type TestResult,
  type TestSummary,
  type TestStatus,
} from '@/data/features/integrityTests';

describe('IntegrityTests Data Layer', () => {
  describe('TEST_DEFINITIONS', () => {
    it('has 36 test definitions', () => {
      expect(TEST_DEFINITIONS).toHaveLength(36);
    });

    it('has correct structure for each test definition', () => {
      TEST_DEFINITIONS.forEach((test) => {
        expect(test).toHaveProperty('id');
        expect(test).toHaveProperty('name');
        expect(test).toHaveProperty('category');
        expect(test).toHaveProperty('type');
        expect(test).toHaveProperty('description');

        expect(typeof test.id).toBe('string');
        expect(typeof test.name).toBe('string');
        expect(typeof test.category).toBe('string');
        expect(typeof test.type).toBe('string');
        expect(['sync', 'async']).toContain(test.type);
        expect(typeof test.description).toBe('string');
      });
    });

    it('has unique test IDs', () => {
      const ids = TEST_DEFINITIONS.map((test) => test.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('follows ID naming convention (t1-t36)', () => {
      const expectedIds = Array.from({ length: 36 }, (_, i) => `t${i + 1}`);
      const actualIds = TEST_DEFINITIONS.map((test) => test.id).sort();
      expect(actualIds).toEqual(expectedIds.sort());
    });

    it('has valid category assignments', () => {
      const validCategories = TEST_CATEGORIES.map((cat) => cat.id);
      TEST_DEFINITIONS.forEach((test) => {
        expect(validCategories).toContain(test.category);
      });
    });

    it('has non-empty names and descriptions', () => {
      TEST_DEFINITIONS.forEach((test) => {
        expect(test.name.trim()).not.toBe('');
        expect(test.description.trim()).not.toBe('');
        expect(test.name.length).toBeGreaterThan(5);
        expect(test.description.length).toBeGreaterThan(10);
      });
    });
  });

  describe('TEST_CATEGORIES', () => {
    it('has expected categories', () => {
      const expectedCategories = [
        'data-integrity',
        'cross-reference',
        'legacy-cleanup',
        'naming-convention',
        'counters',
        'coverage',
        'relational-validation',
        'content-validation',
        'ecosystem-health',
        'sanity-check',
        'dtc-traceability',
        'agents',
        'cross-cutting',
      ];
      const actualCategories = TEST_CATEGORIES.map((cat) => cat.id);

      expectedCategories.forEach((expected) => {
        expect(actualCategories).toContain(expected);
      });
    });

    it('has correct structure for each category', () => {
      TEST_CATEGORIES.forEach((category) => {
        expect(category).toHaveProperty('id');
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('icon');

        expect(typeof category.id).toBe('string');
        expect(typeof category.name).toBe('string');
        expect(typeof category.icon).toBe('string');
      });
    });

    it('has unique category IDs', () => {
      const ids = TEST_CATEGORIES.map((cat) => cat.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('EXPECTED_COUNTS', () => {
    it('has all required count properties', () => {
      const requiredProps = [
        'skills',
        'automatedSkills',
        'commands',
        'rules',
        'docs',
        'validationScripts',
        'mcps',
        'hooks',
        'agents',
        'templates',
        'checklists',
        'signoffs',
        'total',
      ];

      requiredProps.forEach((prop) => {
        expect(EXPECTED_COUNTS).toHaveProperty(prop);
        expect(typeof EXPECTED_COUNTS[prop as keyof typeof EXPECTED_COUNTS]).toBe('number');
      });

      // Properties that should be greater than 0
      const nonZeroProps = [
        'skills',
        'automatedSkills',
        'commands',
        'rules',
        'docs',
        'validationScripts',
        'mcps',
        'hooks',
        'agents',
        'total',
      ];
      nonZeroProps.forEach((prop) => {
        expect(EXPECTED_COUNTS[prop as keyof typeof EXPECTED_COUNTS]).toBeGreaterThan(0);
      });

      // Properties that should be 0 (integrated into skills)
      expect(EXPECTED_COUNTS.templates).toBe(0);
      expect(EXPECTED_COUNTS.checklists).toBe(0);
      expect(EXPECTED_COUNTS.signoffs).toBe(0);
    });

    it('has realistic count values', () => {
      // Counts are derived from the data registries (skills.ts / commands.ts arrays),
      // post-removal of the 3 deleted artifacts:
      // - 113 skills - 1 (lidr-project-classifier) - 1 (lidr-automated-handoffs) = 111
      //   + 1 (lidr-impact-analysis, added 2026-06-10: contract impact G4 + variant compatibility G2) = 112
      // - 28 commands - 2 (lidr-document-project, lidr-check-readiness) = 26
      // - 22 rules pre-spec-lifecycle + 2 new (spec-execution, model-selection) = 24 (Node-side scans .claude/rules)
      // - validationScripts: 31 - 1 = 30 (lidr-project-classifier's validate-examples.ts removed with the skill)
      expect(EXPECTED_COUNTS.skills).toBe(112);
      expect(EXPECTED_COUNTS.commands).toBe(26);
      expect(EXPECTED_COUNTS.rules).toBe(24);
      expect(EXPECTED_COUNTS.validationScripts).toBe(30);
    });
  });

  describe('VALID_ROLES', () => {
    it('contains expected roles', () => {
      const expectedRoles = [
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
      ];

      expectedRoles.forEach((role) => {
        expect(VALID_ROLES.has(role)).toBe(true);
      });
    });

    it('has correct number of roles', () => {
      expect(VALID_ROLES.size).toBe(11);
    });

    it('contains only string values', () => {
      VALID_ROLES.forEach((role) => {
        expect(typeof role).toBe('string');
        expect(role.trim()).not.toBe('');
      });
    });
  });

  describe('Document Paths', () => {
    describe('HELPCENTER_DOCPATHS', () => {
      it('is an array of strings', () => {
        expect(Array.isArray(HELPCENTER_DOCPATHS)).toBe(true);
        HELPCENTER_DOCPATHS.forEach((path) => {
          expect(typeof path).toBe('string');
        });
      });

      it('has expected number of paths (225 artifacts)', () => {
        // 225 = 231 − 4 deleted artifacts (skills lidr-project-classifier + lidr-automated-handoffs
        // + commands lidr-document-project, lidr-check-readiness) − 2 consolidated command variants
        // (lidr-create-branch-enhanced, lidr-create-pr-enhanced → merged into the base
        // create-branch / create-pr). bmad-document-project SKILL.md is kept (real BMAD skill).
        expect(HELPCENTER_DOCPATHS).toHaveLength(225);
      });

      it('contains valid file paths', () => {
        HELPCENTER_DOCPATHS.forEach((path) => {
          expect(path).toMatch(/\.(md|ts|tsx|json|sh)$|\.claude-env$/);
          expect(path).not.toContain('..');
          expect(path.startsWith('/')).toBe(false); // Should be relative paths
        });
      });
    });

    describe('SITEMAP_DOCPATHS', () => {
      it('is an array of strings', () => {
        expect(Array.isArray(SITEMAP_DOCPATHS)).toBe(true);
        SITEMAP_DOCPATHS.forEach((path) => {
          expect(typeof path).toBe('string');
        });
      });

      it('contains valid file paths', () => {
        SITEMAP_DOCPATHS.forEach((path) => {
          expect(path).toMatch(/\.(md|ts|tsx|json|sh)$/);
          expect(path).not.toContain('..');
        });
      });
    });
  });

  describe('TEST_EXECUTION_CONFIG', () => {
    it('has all required configuration properties', () => {
      expect(TEST_EXECUTION_CONFIG).toHaveProperty('PLACEHOLDER_COUNT');
      expect(TEST_EXECUTION_CONFIG).toHaveProperty('TESTS_PER_PAGE');
      expect(TEST_EXECUTION_CONFIG).toHaveProperty('ASYNC_TEST_TIMEOUT');
      expect(TEST_EXECUTION_CONFIG).toHaveProperty('REAL_TIME_CATEGORIES');
      expect(TEST_EXECUTION_CONFIG).toHaveProperty('MAX_DETAILS_ITEMS');

      expect(typeof TEST_EXECUTION_CONFIG.PLACEHOLDER_COUNT).toBe('number');
      expect(typeof TEST_EXECUTION_CONFIG.TESTS_PER_PAGE).toBe('number');
      expect(typeof TEST_EXECUTION_CONFIG.ASYNC_TEST_TIMEOUT).toBe('number');
      expect(Array.isArray(TEST_EXECUTION_CONFIG.REAL_TIME_CATEGORIES)).toBe(true);
      expect(typeof TEST_EXECUTION_CONFIG.MAX_DETAILS_ITEMS).toBe('number');
    });

    it('has reasonable configuration values', () => {
      expect(TEST_EXECUTION_CONFIG.PLACEHOLDER_COUNT).toBeGreaterThan(0);
      expect(TEST_EXECUTION_CONFIG.PLACEHOLDER_COUNT).toBeLessThan(100);

      expect(TEST_EXECUTION_CONFIG.TESTS_PER_PAGE).toBeGreaterThan(0);
      expect(TEST_EXECUTION_CONFIG.TESTS_PER_PAGE).toBeLessThan(100);

      expect(TEST_EXECUTION_CONFIG.ASYNC_TEST_TIMEOUT).toBeGreaterThan(1000);
      expect(TEST_EXECUTION_CONFIG.ASYNC_TEST_TIMEOUT).toBeLessThan(120000);

      expect(TEST_EXECUTION_CONFIG.MAX_DETAILS_ITEMS).toBeGreaterThan(0);
      expect(TEST_EXECUTION_CONFIG.MAX_DETAILS_ITEMS).toBeLessThan(1000);

      expect(TEST_EXECUTION_CONFIG.REAL_TIME_CATEGORIES.length).toBeGreaterThan(0);
    });
  });

  describe('Utility Functions', () => {
    describe('getTestsByCategory', () => {
      it('returns tests for valid category', () => {
        const filesystemTests = getTestsByCategory('filesystem');
        expect(Array.isArray(filesystemTests)).toBe(true);

        filesystemTests.forEach((test) => {
          expect(test.category).toBe('filesystem');
        });
      });

      it('returns empty array for invalid category', () => {
        const invalidTests = getTestsByCategory('nonexistent');
        expect(invalidTests).toEqual([]);
      });

      it('returns subset of total tests', () => {
        const allCategories = TEST_CATEGORIES.map((cat) => cat.id);
        let totalFromCategories = 0;

        allCategories.forEach((categoryId) => {
          const categoryTests = getTestsByCategory(categoryId);
          totalFromCategories += categoryTests.length;
        });

        expect(totalFromCategories).toBe(TEST_DEFINITIONS.length);
      });
    });

    describe('getSyncTests', () => {
      it('returns array of test definitions', () => {
        const syncTests = getSyncTests();
        expect(Array.isArray(syncTests)).toBe(true);

        syncTests.forEach((test) => {
          expect(test).toHaveProperty('id');
          expect(test).toHaveProperty('type');
          expect(test.type).toBe('sync');
        });
      });

      it('returns subset of total tests', () => {
        const syncTests = getSyncTests();
        expect(syncTests.length).toBeLessThanOrEqual(TEST_DEFINITIONS.length);
        expect(syncTests.length).toBeGreaterThan(0);
      });
    });

    describe('getAsyncTests', () => {
      it('returns array of test definitions', () => {
        const asyncTests = getAsyncTests();
        expect(Array.isArray(asyncTests)).toBe(true);

        asyncTests.forEach((test) => {
          expect(test).toHaveProperty('id');
          expect(test).toHaveProperty('type');
          expect(test.type).toBe('async');
        });
      });

      it('returns subset of total tests', () => {
        const asyncTests = getAsyncTests();
        expect(asyncTests.length).toBeLessThanOrEqual(TEST_DEFINITIONS.length);
      });

      it('complements sync tests', () => {
        const syncTests = getSyncTests();
        const asyncTests = getAsyncTests();

        expect(syncTests.length + asyncTests.length).toBeLessThanOrEqual(TEST_DEFINITIONS.length);
      });
    });
  });

  describe('TypeScript Types', () => {
    it('TestStatus has correct values', () => {
      const validStatuses: TestStatus[] = ['idle', 'running', 'pass', 'fail', 'warn'];

      // Test that the type allows correct values
      validStatuses.forEach((status) => {
        const testResult: TestResult = {
          id: 'test-1',
          name: 'Test Name',
          category: 'test-category',
          status,
          message: 'Test message',
          details: ['detail 1'],
          duration: 100,
        };
        expect(testResult.status).toBe(status);
      });
    });

    it('TestDefinition has correct structure', () => {
      const testDef: TestDefinition = {
        id: 'T1',
        name: 'Test Name',
        category: 'filesystem',
        type: 'sync',
        description: 'Test description',
      };

      expect(testDef).toHaveProperty('id');
      expect(testDef).toHaveProperty('name');
      expect(testDef).toHaveProperty('category');
      expect(testDef).toHaveProperty('description');
      expect(testDef).toHaveProperty('type');
    });

    it('TestSummary has correct structure', () => {
      const summary: TestSummary = {
        total: 10,
        pass: 7,
        fail: 2,
        warn: 1,
        totalDuration: 5000,
      };

      expect(summary).toHaveProperty('total');
      expect(summary).toHaveProperty('pass');
      expect(summary).toHaveProperty('fail');
      expect(summary).toHaveProperty('warn');
      expect(summary).toHaveProperty('totalDuration');

      expect(typeof summary.total).toBe('number');
      expect(typeof summary.pass).toBe('number');
      expect(typeof summary.fail).toBe('number');
      expect(typeof summary.warn).toBe('number');
      expect(typeof summary.totalDuration).toBe('number');
    });
  });

  describe('Data Consistency', () => {
    it('all tests have valid categories', () => {
      const categoryIds = TEST_CATEGORIES.map((cat) => cat.id);

      TEST_DEFINITIONS.forEach((test) => {
        expect(categoryIds).toContain(test.category);
      });
    });

    it('categories have associated tests', () => {
      TEST_CATEGORIES.forEach((category) => {
        const testsInCategory = TEST_DEFINITIONS.filter((test) => test.category === category.id);
        expect(testsInCategory.length).toBeGreaterThan(0);
      });
    });

    it('test definitions have consistent data structure', () => {
      TEST_DEFINITIONS.forEach((test) => {
        expect(test).toHaveProperty('id');
        expect(test).toHaveProperty('name');
        expect(test).toHaveProperty('category');
        expect(test).toHaveProperty('type');
        expect(test).toHaveProperty('description');

        expect(['sync', 'async']).toContain(test.type);
        expect(typeof test.id).toBe('string');
        expect(typeof test.name).toBe('string');
        expect(typeof test.category).toBe('string');
        expect(typeof test.description).toBe('string');
      });
    });
  });

  describe('Performance', () => {
    it('category lookups are efficient', () => {
      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        getTestsByCategory('filesystem');
        getTestsByCategory('counts');
      }

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      expect(executionTime).toBeLessThan(50); // Should complete in under 50ms
    });

    it('data structures have reasonable memory footprint', () => {
      const jsonSize = JSON.stringify({
        definitions: TEST_DEFINITIONS.length,
        categories: TEST_CATEGORIES.length,
        expectedCounts: EXPECTED_COUNTS,
      }).length;

      expect(jsonSize).toBeLessThan(10000); // Should be under 10KB for metadata
    });
  });
});
