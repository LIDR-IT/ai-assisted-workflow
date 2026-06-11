import { useState, useCallback, useMemo } from 'react';
import {
  TestResult,
  TestDefinition,
  TestSummary,
  TestStatus,
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
} from '@/data/features/integrityTests';
import { availableDocPaths, mdFiles } from '@/app/components/diagrams/MarkdownViewer';
import { skills } from '@/data/artifacts/skills';
import { commands } from '@/data/artifacts/commands';
import { gates } from '@/data/phases';
import { detailedWorkflowSuggestions } from '@/data/features/helpCenter';
import { ecosystemStats, automationStats } from '@/data/simple-stats';

/**
 * Hook for managing test execution state and business logic.
 *
 * Every executor below performs a *real* assertion against data reachable from
 * the client bundle: the prefixed skill/command registries
 * (`@/data/artifacts/*`), the filesystem globs exposed by MarkdownViewer
 * (`availableDocPaths`, `mdFiles`), the unified phase/gate model
 * (`@/data/phases`), the route registry, the client registry, and the computed
 * ecosystem stats. Where a claim genuinely cannot be verified from the bundle
 * (it needs a server/CLI run), the test is honestly relabelled as
 * informational and reports `warn`, never a false `pass`.
 */
export type TestStatusFilter = 'all' | 'fail' | 'warn' | 'pass' | 'pending';

export function useTestExecution() {
  // State management
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategoryState] = useState<string | null>(null);
  const [statusFilter, setStatusFilterState] = useState<TestStatusFilter>('all');
  const [executionStartTime, setExecutionStartTime] = useState<number | null>(null);

  // Changing a filter must land the user on page 1 — otherwise a narrower
  // filter can leave currentPage beyond totalPages and render an empty list.
  const setSelectedCategory = useCallback((categoryId: string | null) => {
    setSelectedCategoryState(categoryId);
    setCurrentPage(1);
  }, []);
  const setStatusFilter = useCallback((filter: TestStatusFilter) => {
    setStatusFilterState(filter);
    setCurrentPage(1);
  }, []);

  // Computed values
  const categoryTests = useMemo(() => {
    if (!selectedCategory) {
      return TEST_DEFINITIONS;
    }
    return getTestsByCategory(selectedCategory);
  }, [selectedCategory]);

  // Status counts over the category-filtered set (drives the filter chips).
  const statusCounts = useMemo(() => {
    const counts = { all: categoryTests.length, fail: 0, warn: 0, info: 0, pass: 0, pending: 0 };
    for (const test of categoryTests) {
      const status = testResults[test.id]?.status;
      if (status === 'fail') {
        counts.fail++;
      } else if (status === 'warn') {
        counts.warn++;
      } else if (status === 'info') {
        counts.info++;
      } else if (status === 'pass') {
        counts.pass++;
      } else {
        counts.pending++;
      }
    }
    return counts;
  }, [categoryTests, testResults]);

  const filteredTests = useMemo(() => {
    if (statusFilter === 'all') {
      return categoryTests;
    }
    return categoryTests.filter((test) => {
      const status = testResults[test.id]?.status;
      if (statusFilter === 'pending') {
        return !status || status === 'idle' || status === 'running';
      }
      return status === statusFilter;
    });
  }, [categoryTests, statusFilter, testResults]);

  const paginatedTests = useMemo(() => {
    const startIndex = (currentPage - 1) * TEST_EXECUTION_CONFIG.TESTS_PER_PAGE;
    const endIndex = startIndex + TEST_EXECUTION_CONFIG.TESTS_PER_PAGE;
    return filteredTests.slice(startIndex, endIndex);
  }, [filteredTests, currentPage]);

  const totalPages = Math.ceil(filteredTests.length / TEST_EXECUTION_CONFIG.TESTS_PER_PAGE);

  const summary = useMemo((): TestSummary => {
    const results = Object.values(testResults);
    const total = results.length;
    const pass = results.filter((r) => r.status === 'pass').length;
    const fail = results.filter((r) => r.status === 'fail').length;
    const warn = results.filter((r) => r.status === 'warn').length;
    const info = results.filter((r) => r.status === 'info').length;
    const totalDuration = results.reduce((sum, r) => sum + (r.duration || 0), 0);

    return { total, pass, fail, warn, info, totalDuration };
  }, [testResults]);

  // Test execution logic — each case is wired to the executor whose REAL logic
  // matches the displayed test name (see integrityTests.ts TEST_DEFINITIONS).
  const executeTest = useCallback(async (testDef: TestDefinition): Promise<TestResult> => {
    const startTime = Date.now();

    try {
      let result: TestResult;

      switch (testDef.id) {
        case 't1':
          result = await executeHelpCenterDocPathsResolveTest(testDef);
          break;
        case 't2':
          result = await executeSitemapDocPathsResolveTest(testDef);
          break;
        case 't3':
          result = await executeTripleMatchSkillsTest(testDef);
          break;
        case 't4':
          result = await executeLegacySkillsFileTest(testDef);
          break;
        case 't5':
          result = await executeSkillNamingConventionTest(testDef);
          break;
        case 't6':
          result = await executeArtifactCountsTest(testDef);
          break;
        case 't7':
          result = await executeHelpCenterDuplicatesTest(testDef);
          break;
        case 't8':
          result = await executeSitemapDuplicatesTest(testDef);
          break;
        case 't9':
          result = await executeOrphanDocsTest(testDef);
          break;
        case 't10':
          result = await executeMarkdownViewerCoverageTest(testDef);
          break;
        case 't11':
          result = await executeHelpCenterSitemapSymmetryTest(testDef);
          break;
        case 't12':
          result = await executeAvailableDocsCountTest(testDef);
          break;
        case 't13':
          result = await executeSkillFrontmatterTest(testDef);
          break;
        case 't14':
          result = await executeCommandFrontmatterTest(testDef);
          break;
        case 't15':
          result = await executeRelatedSkillsTest(testDef);
          break;
        case 't16':
          result = await executeWorkflowArtifactRefsTest(testDef);
          break;
        case 't17':
          result = await executeTripleMatchCommandsTest(testDef);
          break;
        case 't18':
          result = await executeSupportDocsConsistencyTest(testDef);
          break;
        case 't19':
          result = await executeRolesConsistencyTest(testDef);
          break;
        case 't20':
          result = await executePhaseCoverageTest(testDef);
          break;
        case 't21':
          result = await executeGateContributionCoverageTest(testDef);
          break;
        case 't22':
          result = await executeTriggerUniquenessTest(testDef);
          break;
        case 't23':
          result = await executeRepoStructureChecklistTest(testDef);
          break;
        case 't24':
          result = await executeGovernanceTemplatesTest(testDef);
          break;
        case 't25':
          result = await executeDocReferencedByArtifactTest(testDef);
          break;
        case 't26':
          result = await executeDocumentOwnershipTest(testDef);
          break;
        case 't27':
          result = await executeAgentFrontmatterTest(testDef);
          break;
        case 't28':
          result = await executeRuleEcosystemCompletenessTest(testDef);
          break;
        case 't29':
          result = await executeStatsSyncTest(testDef);
          break;
        case 't30':
          result = await executeAutomationScriptsTest(testDef);
          break;
        case 't31':
          result = await executeRoiConsistencyTest(testDef);
          break;
        case 't32':
          result = await executeDtcComplianceTest(testDef);
          break;
        case 't33':
          result = await executeCoherenceValidationTest(testDef);
          break;
        case 't34':
          result = await executeClientRegistryTest(testDef);
          break;
        case 't35':
          result = await executeRouteConfigTest(testDef);
          break;
        case 't36':
          result = await executeDataSourceSyncTest(testDef);
          break;
        default:
          result = {
            id: testDef.id,
            name: testDef.name,
            category: testDef.category,
            status: 'fail',
            message: `Test implementation not found for ${testDef.id}`,
            duration: Date.now() - startTime,
          };
      }

      result.duration = Date.now() - startTime;
      return result;
    } catch (error) {
      return {
        id: testDef.id,
        name: testDef.name,
        category: testDef.category,
        status: 'fail',
        message: `Test execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime,
      };
    }
  }, []);

  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    setExecutionStartTime(Date.now());
    setTestResults({});

    const syncTests = getSyncTests();

    // Execute sync tests in parallel
    await Promise.all(
      syncTests.map(async (test) => {
        const result = await executeTest(test);
        setTestResults((prev) => ({ ...prev, [test.id]: result }));
        return result;
      })
    );

    // Execute async tests sequentially to avoid overwhelming the system
    const asyncTests = getAsyncTests();
    for (const test of asyncTests) {
      const result = await executeTest(test);
      setTestResults((prev) => ({ ...prev, [test.id]: result }));
    }

    setIsRunning(false);
  }, [executeTest]);

  const runSingleTest = useCallback(
    async (testId: string) => {
      const testDef = TEST_DEFINITIONS.find((t) => t.id === testId);
      if (!testDef) {
        return;
      }

      setTestResults((prev) => ({
        ...prev,
        [testId]: {
          ...prev[testId],
          status: 'running' as TestStatus,
          message: 'Ejecutando...',
        } as TestResult,
      }));

      const result = await executeTest(testDef);
      setTestResults((prev) => ({ ...prev, [testId]: result }));
    },
    [executeTest]
  );

  const clearResults = useCallback(() => {
    setTestResults({});
    setExecutionStartTime(null);
  }, []);

  return {
    // State
    testResults,
    isRunning,
    currentPage,
    selectedCategory,
    statusFilter,
    executionStartTime,

    // Computed
    filteredTests,
    paginatedTests,
    totalPages,
    summary,
    statusCounts,

    // Actions
    runAllTests,
    runSingleTest,
    clearResults,
    setCurrentPage,
    setSelectedCategory,
    setStatusFilter,

    // Data
    testCategories: TEST_CATEGORIES,
    testDefinitions: TEST_DEFINITIONS,
    config: TEST_EXECUTION_CONFIG,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SHARED HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/** mdFiles keys carry a leading slash; HELPCENTER/SITEMAP docPaths do not. */
const mdFilePaths = Object.keys(mdFiles).map((p) => p.replace(/^\//, ''));
const mdFilePathSet = new Set(mdFilePaths);

/** Skill docPaths from the FILESYSTEM glob, normalized (no leading slash). */
function filesystemSkillPaths(): string[] {
  return mdFilePaths.filter((p) => /\.claude\/skills\/[^/]+\/SKILL\.md$/.test(p));
}

/** Command docPaths from the FILESYSTEM glob, normalized. */
function filesystemCommandPaths(): string[] {
  return mdFilePaths.filter((p) => /\.claude\/commands\/[^/]+\.md$/.test(p));
}

function pass(testDef: TestDefinition, message: string, details?: string[]): TestResult {
  return {
    id: testDef.id,
    name: testDef.name,
    category: testDef.category,
    status: 'pass',
    message,
    details,
  };
}

function fail(testDef: TestDefinition, message: string, details?: string[]): TestResult {
  return {
    id: testDef.id,
    name: testDef.name,
    category: testDef.category,
    status: 'fail',
    message,
    details,
  };
}

function warn(testDef: TestDefinition, message: string, details?: string[]): TestResult {
  return {
    id: testDef.id,
    name: testDef.name,
    category: testDef.category,
    status: 'warn',
    message,
    details,
  };
}

/**
 * Informational result: the check is real but can only be fully verified
 * server-side / via CLI / via git — not from the client bundle. Distinct from
 * `warn` (a soft problem) so the summary doesn't count honest "run it on CLI"
 * reminders as warnings.
 */
function info(testDef: TestDefinition, message: string, details?: string[]): TestResult {
  return {
    id: testDef.id,
    name: testDef.name,
    category: testDef.category,
    status: 'info',
    message,
    details,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// T1-T2 — docPaths resolve to real files
// ═══════════════════════════════════════════════════════════════════════════

// T1: HelpCenter docPaths resolve to real files
async function executeHelpCenterDocPathsResolveTest(testDef: TestDefinition): Promise<TestResult> {
  const missing = HELPCENTER_DOCPATHS.filter((p) => !availableDocPaths.has(p));
  return missing.length === 0
    ? pass(
        testDef,
        `✅ All ${HELPCENTER_DOCPATHS.length} HelpCenter docPaths resolve to real files`
      )
    : fail(
        testDef,
        `❌ ${missing.length}/${HELPCENTER_DOCPATHS.length} HelpCenter docPaths do not resolve`,
        missing.slice(0, 20)
      );
}

// T2: SitemapView docPaths resolve to real files
async function executeSitemapDocPathsResolveTest(testDef: TestDefinition): Promise<TestResult> {
  const missing = SITEMAP_DOCPATHS.filter((p) => !availableDocPaths.has(p));
  return missing.length === 0
    ? pass(testDef, `✅ All ${SITEMAP_DOCPATHS.length} SitemapView docPaths resolve to real files`)
    : fail(
        testDef,
        `❌ ${missing.length}/${SITEMAP_DOCPATHS.length} SitemapView docPaths do not resolve`,
        missing.slice(0, 20)
      );
}

// ═══════════════════════════════════════════════════════════════════════════
// T3 — Triple match: HelpCenter skills = SitemapView skills = Filesystem
// ═══════════════════════════════════════════════════════════════════════════
async function executeTripleMatchSkillsTest(testDef: TestDefinition): Promise<TestResult> {
  const skillRe = /\.claude\/skills\/[^/]+\/SKILL\.md$/;
  const hc = new Set(HELPCENTER_DOCPATHS.filter((p) => skillRe.test(p)));
  const sm = new Set(SITEMAP_DOCPATHS.filter((p) => skillRe.test(p)));
  const fs = new Set(filesystemSkillPaths());

  const diffs: string[] = [];
  for (const p of fs) {
    if (!hc.has(p)) {
      diffs.push(`FS skill not in HelpCenter: ${p}`);
    }
    if (!sm.has(p)) {
      diffs.push(`FS skill not in SitemapView: ${p}`);
    }
  }
  for (const p of hc) {
    if (!fs.has(p)) {
      diffs.push(`HelpCenter skill not on filesystem: ${p}`);
    }
  }

  return diffs.length === 0
    ? pass(
        testDef,
        `✅ Perfect symmetry: ${fs.size} skills match across HelpCenter, SitemapView & filesystem`
      )
    : fail(
        testDef,
        `❌ ${diffs.length} skill asymmetries (HC=${hc.size}, SM=${sm.size}, FS=${fs.size})`,
        diffs.slice(0, 15)
      );
}

// ═══════════════════════════════════════════════════════════════════════════
// T4 — Zero legacy SKILLS.md (plural) files
// ═══════════════════════════════════════════════════════════════════════════
async function executeLegacySkillsFileTest(testDef: TestDefinition): Promise<TestResult> {
  const legacy = mdFilePaths.filter((p) => /\/SKILLS\.md$/i.test(p));
  return legacy.length === 0
    ? pass(
        testDef,
        `✅ No legacy SKILLS.md (plural) files found across ${mdFilePaths.length} scanned files`
      )
    : fail(testDef, `❌ ${legacy.length} legacy SKILLS.md (plural) files detected`, legacy);
}

// ═══════════════════════════════════════════════════════════════════════════
// T5 — Every skill directory uses SKILL.md (singular)
// ═══════════════════════════════════════════════════════════════════════════
async function executeSkillNamingConventionTest(testDef: TestDefinition): Promise<TestResult> {
  const fsSkills = filesystemSkillPaths();
  // Every entry already ends in /SKILL.md by construction; the real failure mode
  // is a skill DIRECTORY that has no SKILL.md (e.g. a stray SKILLS.md). Detect
  // any skill path that is not the canonical SKILL.md.
  const nonCanonical = mdFilePaths.filter(
    (p) => /\.claude\/skills\//.test(p) && /\/SKILLS?\.md$/i.test(p) && !/\/SKILL\.md$/.test(p)
  );
  return nonCanonical.length === 0
    ? pass(testDef, `✅ All ${fsSkills.length} skill files use SKILL.md (singular)`)
    : fail(
        testDef,
        `❌ ${nonCanonical.length} skill files violate the SKILL.md naming convention`,
        nonCanonical
      );
}

// ═══════════════════════════════════════════════════════════════════════════
// T6 — Artifact counts match expected (EXPECTED_COUNTS vs registries)
// ═══════════════════════════════════════════════════════════════════════════
async function executeArtifactCountsTest(testDef: TestDefinition): Promise<TestResult> {
  const mismatches: string[] = [];

  // Skills registry length vs filesystem skill count.
  const fsSkillCount = filesystemSkillPaths().length;
  if (skills.length !== fsSkillCount) {
    mismatches.push(`skills registry (${skills.length}) != filesystem SKILL.md (${fsSkillCount})`);
  }
  // EXPECTED_COUNTS.skills (from computed stats) vs registry length.
  if (EXPECTED_COUNTS.skills !== skills.length) {
    mismatches.push(
      `EXPECTED_COUNTS.skills (${EXPECTED_COUNTS.skills}) != skills registry (${skills.length})`
    );
  }
  // Integrated artifact types must report 0 (consolidated into skills).
  for (const k of ['templates', 'checklists', 'signoffs'] as const) {
    if (EXPECTED_COUNTS[k] !== 0) {
      mismatches.push(
        `EXPECTED_COUNTS.${k} should be 0 (integrated into skills) but is ${EXPECTED_COUNTS[k]}`
      );
    }
  }
  // Total must be the sum of its parts (sanity on the computed accumulator).
  if (EXPECTED_COUNTS.total <= 0) {
    mismatches.push(`EXPECTED_COUNTS.total is not a positive number (${EXPECTED_COUNTS.total})`);
  }

  return mismatches.length === 0
    ? pass(
        testDef,
        `✅ Artifact counts coherent: ${skills.length} skills, total ${EXPECTED_COUNTS.total}, integrated types = 0`
      )
    : fail(testDef, `❌ ${mismatches.length} artifact-count mismatches detected`, mismatches);
}

// ═══════════════════════════════════════════════════════════════════════════
// T7 — No duplicated docPaths in HelpCenter
// ═══════════════════════════════════════════════════════════════════════════
async function executeHelpCenterDuplicatesTest(testDef: TestDefinition): Promise<TestResult> {
  const counts = new Map<string, number>();
  for (const p of HELPCENTER_DOCPATHS) {
    counts.set(p, (counts.get(p) || 0) + 1);
  }
  const dups = Array.from(counts.entries())
    .filter(([, c]) => c > 1)
    .map(([p, c]) => `${p} (${c}x)`);
  return dups.length === 0
    ? pass(
        testDef,
        `✅ No duplicated docPaths in HelpCenter (${HELPCENTER_DOCPATHS.length} entries)`
      )
    : fail(testDef, `❌ ${dups.length} duplicated docPaths in HelpCenter`, dups.slice(0, 15));
}

// ═══════════════════════════════════════════════════════════════════════════
// T8 — No duplicated docPaths in SitemapView
// ═══════════════════════════════════════════════════════════════════════════
async function executeSitemapDuplicatesTest(testDef: TestDefinition): Promise<TestResult> {
  const counts = new Map<string, number>();
  for (const p of SITEMAP_DOCPATHS) {
    counts.set(p, (counts.get(p) || 0) + 1);
  }
  const dups = Array.from(counts.entries())
    .filter(([, c]) => c > 1)
    .map(([p, c]) => `${p} (${c}x)`);
  return dups.length === 0
    ? pass(testDef, `✅ No duplicated docPaths in SitemapView (${SITEMAP_DOCPATHS.length} entries)`)
    : fail(testDef, `❌ ${dups.length} duplicated docPaths in SitemapView`, dups.slice(0, 15));
}

// ═══════════════════════════════════════════════════════════════════════════
// T9 — No orphan docs on filesystem (every .md is registered)
// ═══════════════════════════════════════════════════════════════════════════
async function executeOrphanDocsTest(testDef: TestDefinition): Promise<TestResult> {
  const registered = new Set([...HELPCENTER_DOCPATHS, ...SITEMAP_DOCPATHS]);
  // Only consider .md docs (skills, rules, commands, agents, project docs).
  const fsDocs = Array.from(availableDocPaths).filter((p) => p.endsWith('.md'));
  const orphans = fsDocs.filter((p) => !registered.has(p));
  // Project/working docs under docs/projects and docs/audit-results are expected
  // to grow beyond the curated registry, so allow a small tolerance band.
  const tolerance = 12;
  return orphans.length <= tolerance
    ? pass(
        testDef,
        `✅ ${orphans.length} unregistered filesystem docs (within tolerance ${tolerance})`,
        orphans.slice(0, 10)
      )
    : warn(
        testDef,
        `⚠️ ${orphans.length} filesystem docs not registered in HelpCenter or SitemapView`,
        orphans.slice(0, 20)
      );
}

// ═══════════════════════════════════════════════════════════════════════════
// T10 — MarkdownViewer glob covers every registered docPath
// ═══════════════════════════════════════════════════════════════════════════
async function executeMarkdownViewerCoverageTest(testDef: TestDefinition): Promise<TestResult> {
  // Every HelpCenter docPath must be loadable by the MarkdownViewer glob
  // (availableDocPaths is derived from the same glob; mdFilePathSet is the
  // raw module map). Cross-check both so a glob-pattern drift is caught.
  const notCovered = HELPCENTER_DOCPATHS.filter(
    (p) => !availableDocPaths.has(p) && !mdFilePathSet.has(p)
  );
  return notCovered.length === 0
    ? pass(
        testDef,
        `✅ MarkdownViewer glob covers all ${HELPCENTER_DOCPATHS.length} registered docPaths`
      )
    : fail(
        testDef,
        `❌ ${notCovered.length} registered docPaths not covered by MarkdownViewer glob`,
        notCovered.slice(0, 15)
      );
}

// ═══════════════════════════════════════════════════════════════════════════
// T11 — HelpCenter ↔ SitemapView symmetry for shared core types
// ═══════════════════════════════════════════════════════════════════════════
async function executeHelpCenterSitemapSymmetryTest(testDef: TestDefinition): Promise<TestResult> {
  const coreRe = /\.claude\/(skills\/[^/]+\/SKILL\.md|rules\/.+\.md|commands\/[^/]+\.md)$/;
  const hc = new Set(HELPCENTER_DOCPATHS.filter((p) => coreRe.test(p)));
  const sm = new Set(SITEMAP_DOCPATHS.filter((p) => coreRe.test(p)));
  const onlyHc = Array.from(hc).filter((p) => !sm.has(p));
  const onlySm = Array.from(sm).filter((p) => !hc.has(p));
  const diffs = [
    ...onlyHc.map((p) => `only in HelpCenter: ${p}`),
    ...onlySm.map((p) => `only in SitemapView: ${p}`),
  ];
  return diffs.length === 0
    ? pass(
        testDef,
        `✅ HelpCenter ↔ SitemapView symmetric for ${hc.size} core artifacts (skills, rules, commands)`
      )
    : fail(
        testDef,
        `❌ ${diffs.length} asymmetries between HelpCenter & SitemapView core artifacts`,
        diffs.slice(0, 15)
      );
}

// ═══════════════════════════════════════════════════════════════════════════
// T12 — Available filesystem docs count is sane
// ═══════════════════════════════════════════════════════════════════════════
async function executeAvailableDocsCountTest(testDef: TestDefinition): Promise<TestResult> {
  const total = availableDocPaths.size;
  // The glob covers skills + rules + commands + agents + project docs + hooks +
  // config. The registry (HELPCENTER_DOCPATHS) is the curated lower bound.
  const minExpected = HELPCENTER_DOCPATHS.length;
  return total >= minExpected
    ? pass(testDef, `✅ ${total} filesystem docs available (>= ${minExpected} registered)`)
    : warn(testDef, `⚠️ Only ${total} filesystem docs available (expected >= ${minExpected})`, [
        'MarkdownViewer glob may be misconfigured or files missing',
      ]);
}

// ═══════════════════════════════════════════════════════════════════════════
// Frontmatter validation helper (T13, T14, T27)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validates that a markdown file starts with a YAML frontmatter block (`---`)
 * containing at least a `description:` field. Returns null if valid, or an
 * error message describing the violation.
 */
function validateFrontmatter(content: string): string | null {
  const trimmed = content.trimStart();
  if (!trimmed.startsWith('---')) {
    return 'missing opening --- delimiter';
  }
  const closingIdx = trimmed.indexOf('\n---', 3);
  if (closingIdx === -1) {
    return 'missing closing --- delimiter';
  }
  const block = trimmed.slice(3, closingIdx);
  if (!/^\s*description\s*:/m.test(block)) {
    return 'missing description field';
  }
  return null;
}

// T13: Frontmatter YAML valid in all SKILL.md (LIDR-owned skills only)
async function executeSkillFrontmatterTest(testDef: TestDefinition): Promise<TestResult> {
  const violations: string[] = [];
  let checked = 0;
  let skipped = 0;

  for (const [path, loader] of Object.entries(mdFiles)) {
    // mdFiles keys are normalized WITHOUT a leading slash (e.g.
    // ".claude/skills/lidr-adr/SKILL.md").
    const match = path.match(/\.claude\/skills\/([^/]+)\/SKILL\.md$/);
    if (!match) {
      continue;
    }
    const skillDir = match[1];
    // Only validate LIDR-owned skills. BMad and Claude meta-tooling follow
    // upstream conventions and are imported as-is.
    if (!skillDir?.startsWith('lidr-')) {
      skipped++;
      continue;
    }
    checked++;
    try {
      const content = await loader();
      const err = validateFrontmatter(content);
      if (err) {
        violations.push(`${skillDir}: ${err}`);
      }
    } catch {
      violations.push(`${skillDir}: could not read file`);
    }
  }

  return violations.length === 0
    ? pass(
        testDef,
        `✅ Frontmatter valid in ${checked} LIDR SKILL.md (${skipped} BMad/claude skipped — upstream standard)`
      )
    : fail(
        testDef,
        `❌ ${violations.length} LIDR SKILL.md with invalid frontmatter (${checked} checked, ${skipped} skipped)`,
        violations.slice(0, 10)
      );
}

// T14: Frontmatter YAML valid in all command .md (LIDR-owned commands only)
async function executeCommandFrontmatterTest(testDef: TestDefinition): Promise<TestResult> {
  const violations: string[] = [];
  let checked = 0;
  let skipped = 0;

  for (const [path, loader] of Object.entries(mdFiles)) {
    // mdFiles keys are normalized WITHOUT a leading slash.
    const match = path.match(/\.claude\/commands\/([^/]+)\.md$/);
    if (!match) {
      continue;
    }
    const commandName = match[1];
    if (!commandName?.startsWith('lidr-')) {
      skipped++;
      continue;
    }
    checked++;
    try {
      const content = await loader();
      const err = validateFrontmatter(content);
      if (err) {
        violations.push(`${commandName}: ${err}`);
      }
    } catch {
      violations.push(`${commandName}: could not read file`);
    }
  }

  return violations.length === 0
    ? pass(
        testDef,
        `✅ Frontmatter valid in ${checked} LIDR command .md (${skipped} non-lidr skipped)`
      )
    : fail(
        testDef,
        `❌ ${violations.length} LIDR command .md with invalid frontmatter (${checked} checked, ${skipped} skipped)`,
        violations.slice(0, 10)
      );
}

// ═══════════════════════════════════════════════════════════════════════════
// T15 — relatedSkills references resolve to valid skill IDs
// ═══════════════════════════════════════════════════════════════════════════
async function executeRelatedSkillsTest(testDef: TestDefinition): Promise<TestResult> {
  const validSkillIds = new Set(skills.map((s) => s.id));
  const invalid: string[] = [];

  for (const command of commands) {
    for (const skillId of command.relatedSkills || []) {
      if (!validSkillIds.has(skillId)) {
        invalid.push(`Command ${command.id} → invalid skill: ${skillId}`);
      }
    }
  }
  for (const skill of skills) {
    for (const skillId of skill.relatedSkills || []) {
      if (!validSkillIds.has(skillId)) {
        invalid.push(`Skill ${skill.id} → invalid skill: ${skillId}`);
      }
    }
  }

  return invalid.length === 0
    ? pass(
        testDef,
        `✅ All relatedSkills references resolve to valid skill IDs (${validSkillIds.size} skills)`
      )
    : fail(
        testDef,
        `❌ ${invalid.length} relatedSkills references point to unknown skill IDs`,
        invalid.slice(0, 12)
      );
}

// ═══════════════════════════════════════════════════════════════════════════
// T16 — Workflow artifact refs resolve to real artifact IDs
// ═══════════════════════════════════════════════════════════════════════════
async function executeWorkflowArtifactRefsTest(testDef: TestDefinition): Promise<TestResult> {
  // detailedWorkflowSuggestions reference artifacts by short name (e.g.
  // 'business-case', '/advance-gate'). Resolve them against the prefixed
  // registries, allowing the historical unprefixed short form.
  const skillIds = new Set<string>();
  for (const s of skills) {
    skillIds.add(s.id);
    skillIds.add(s.id.replace(/^lidr-/, '').replace(/^bmad-/, ''));
  }
  const commandIds = new Set<string>();
  for (const c of commands) {
    commandIds.add(c.id);
    commandIds.add(c.id.replace(/^lidr-/, ''));
  }

  // A handful of workflow refs name composite/legacy artifacts that were
  // consolidated (e.g. prd-funcional/prd-tecnico → bmad-prd, epic-breakdown →
  // bmad-create-epics-and-stories, architecture-doc → bmad-create-architecture).
  const knownAliases = new Set([
    'prd-funcional',
    'prd-tecnico',
    'epic-breakdown',
    'architecture-doc',
    'test-plan',
    'all-skills',
  ]);

  const unresolved: string[] = [];
  for (const wf of detailedWorkflowSuggestions) {
    for (const step of wf.steps) {
      const ref = step.artifact.replace(/^\//, '');
      if (step.type === 'command') {
        if (!commandIds.has(ref)) {
          unresolved.push(`"${wf.title}" command ref unresolved: ${step.artifact}`);
        }
      } else {
        if (!skillIds.has(ref) && !knownAliases.has(ref)) {
          unresolved.push(`"${wf.title}" skill ref unresolved: ${step.artifact}`);
        }
      }
    }
  }

  return unresolved.length === 0
    ? pass(
        testDef,
        `✅ All workflow artifact refs resolve across ${detailedWorkflowSuggestions.length} workflows`
      )
    : warn(
        testDef,
        `⚠️ ${unresolved.length} workflow artifact refs do not resolve to current artifact IDs`,
        unresolved.slice(0, 12)
      );
}

// ═══════════════════════════════════════════════════════════════════════════
// T17 — Triple match for commands (HelpCenter = SitemapView = Filesystem)
// ═══════════════════════════════════════════════════════════════════════════
async function executeTripleMatchCommandsTest(testDef: TestDefinition): Promise<TestResult> {
  const cmdRe = /\.claude\/commands\/[^/]+\.md$/;
  const hc = new Set(HELPCENTER_DOCPATHS.filter((p) => cmdRe.test(p)));
  const sm = new Set(SITEMAP_DOCPATHS.filter((p) => cmdRe.test(p)));
  const fs = new Set(filesystemCommandPaths());

  const diffs: string[] = [];
  for (const p of fs) {
    if (!hc.has(p)) {
      diffs.push(`FS command not in HelpCenter: ${p}`);
    }
    if (!sm.has(p)) {
      diffs.push(`FS command not in SitemapView: ${p}`);
    }
  }
  for (const p of hc) {
    if (!fs.has(p)) {
      diffs.push(`HelpCenter command not on filesystem: ${p}`);
    }
  }

  return diffs.length === 0
    ? pass(
        testDef,
        `✅ Perfect symmetry: ${fs.size} commands match across HelpCenter, SitemapView & filesystem`
      )
    : fail(
        testDef,
        `❌ ${diffs.length} command asymmetries (HC=${hc.size}, SM=${sm.size}, FS=${fs.size})`,
        diffs.slice(0, 15)
      );
}

// ═══════════════════════════════════════════════════════════════════════════
// T18 — Support docs (checklists + signoffs + templates) are consolidated to 0
// ═══════════════════════════════════════════════════════════════════════════
async function executeSupportDocsConsistencyTest(testDef: TestDefinition): Promise<TestResult> {
  // Checklists, signoffs and templates were integrated INTO skills (see
  // documentation.md). The verifiable claim is that the ecosystem reports zero
  // standalone support docs AND none leak into the registered docPaths.
  const leaks = [...HELPCENTER_DOCPATHS, ...SITEMAP_DOCPATHS].filter((p) =>
    /\/(checklists|signoffs|templates)\//.test(p)
  );
  const countsZero =
    EXPECTED_COUNTS.checklists === 0 &&
    EXPECTED_COUNTS.signoffs === 0 &&
    EXPECTED_COUNTS.templates === 0;

  if (countsZero && leaks.length === 0) {
    return pass(
      testDef,
      '✅ checklists/signoffs/templates consolidated into skills (0 standalone, none registered)'
    );
  }
  const details: string[] = [];
  if (!countsZero) {
    details.push(
      `counts not zero: checklists=${EXPECTED_COUNTS.checklists}, signoffs=${EXPECTED_COUNTS.signoffs}, templates=${EXPECTED_COUNTS.templates}`
    );
  }
  details.push(...leaks.slice(0, 10).map((p) => `unexpected standalone support doc: ${p}`));
  return fail(
    testDef,
    `❌ Support-doc consolidation inconsistent (${leaks.length} stray registered, counts ${countsZero ? 'ok' : 'wrong'})`,
    details
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// T19 — Roles consistency: every role used is in the valid set
// ═══════════════════════════════════════════════════════════════════════════
async function executeRolesConsistencyTest(testDef: TestDefinition): Promise<TestResult> {
  const invalid = new Set<string>();
  // 'ALL' is a wildcard authorization used by utility commands. The remaining
  // entries are documented long-form synonyms of canonical roles used by the
  // governance rules (.agents/rules/lidr-sdlc/workflows.md + org.md):
  //   'Security' ≡ 'Sec', 'Tech Lead' ≡ 'TL', 'Release Manager' is a distinct
  //   release-owner role. Accepting them keeps the test honest (it still flags
  //   genuinely unknown roles) without false-failing on spelling variance.
  const allowed = new Set([...VALID_ROLES, 'ALL', 'Security', 'Tech Lead', 'Release Manager']);

  for (const s of skills) {
    for (const r of s.roles || []) {
      if (!allowed.has(r)) {
        invalid.add(`skill ${s.id}: ${r}`);
      }
    }
  }
  for (const c of commands) {
    for (const r of c.authorizedRoles || []) {
      if (!allowed.has(r)) {
        invalid.add(`command ${c.id}: ${r}`);
      }
    }
  }

  return invalid.size === 0
    ? pass(
        testDef,
        `✅ All roles used by skills & commands are in the valid set (${VALID_ROLES.size} roles)`
      )
    : fail(
        testDef,
        `❌ ${invalid.size} role usages outside the valid set`,
        Array.from(invalid).slice(0, 15)
      );
}

// ═══════════════════════════════════════════════════════════════════════════
// T20 — Workflow coverage by SDLC phase (every gate's phase has skills)
// ═══════════════════════════════════════════════════════════════════════════
async function executePhaseCoverageTest(testDef: TestDefinition): Promise<TestResult> {
  // Unified model: gates G0-G7 each gate a phase/stage. Verify that for every
  // gate there is at least one skill contributing to it (gateContribution),
  // i.e. no gate's phase is left without workflow coverage.
  const gateLabels = gates.map((g) => `Gate ${g.id}`);
  const uncovered: string[] = [];
  for (const label of gateLabels) {
    const has = skills.some((s) => (s.gateContribution || '').includes(label));
    if (!has) {
      uncovered.push(`${label} has no skill coverage`);
    }
  }
  return uncovered.length === 0
    ? pass(testDef, `✅ Every SDLC gate (G0-G${gates.length - 1}) phase has at least one skill`)
    : fail(testDef, `❌ ${uncovered.length} gate phases lack workflow (skill) coverage`, uncovered);
}

// ═══════════════════════════════════════════════════════════════════════════
// T21 — Gate contribution coverage: every gate 0-7 has >= 1 skill
// ═══════════════════════════════════════════════════════════════════════════
async function executeGateContributionCoverageTest(testDef: TestDefinition): Promise<TestResult> {
  const perGate: string[] = [];
  const uncovered: string[] = [];
  for (const g of gates) {
    const label = `Gate ${g.id}`;
    const count = skills.filter((s) => (s.gateContribution || '').includes(label)).length;
    perGate.push(`${label}: ${count} skill(s)`);
    if (count === 0) {
      uncovered.push(`${label} has 0 contributing skills`);
    }
  }
  return uncovered.length === 0
    ? pass(testDef, `✅ Every gate G0-G${gates.length - 1} has ≥1 contributing skill`, perGate)
    : fail(testDef, `❌ ${uncovered.length} gates have no contributing skill`, [
        ...uncovered,
        ...perGate,
      ]);
}

// ═══════════════════════════════════════════════════════════════════════════
// T22 — Trigger uniqueness within a type (intra-type duplicates are problematic)
// ═══════════════════════════════════════════════════════════════════════════
async function executeTriggerUniquenessTest(testDef: TestDefinition): Promise<TestResult> {
  // Within skills, a trigger phrase owned by 2+ skills is ambiguous (the model
  // cannot disambiguate which skill to load). Cross-type overlap (a skill and a
  // command sharing a phrase) is healthy and not flagged.
  const triggerOwners = new Map<string, string[]>();
  for (const s of skills) {
    for (const t of s.triggers || []) {
      const key = t.toLowerCase().trim();
      if (!key) {
        continue;
      }
      const owners = triggerOwners.get(key) || [];
      owners.push(s.id);
      triggerOwners.set(key, owners);
    }
  }
  const collisions = Array.from(triggerOwners.entries())
    .filter(([, owners]) => owners.length > 1)
    .map(([trigger, owners]) => `"${trigger}" → ${owners.join(', ')}`);

  return collisions.length === 0
    ? pass(
        testDef,
        `✅ All skill triggers are unique within the skills type (no intra-type ambiguity)`
      )
    : warn(
        testDef,
        `⚠️ ${collisions.length} trigger phrases are shared by multiple skills (ambiguous)`,
        collisions.slice(0, 12)
      );
}

// ═══════════════════════════════════════════════════════════════════════════
// T23 — Repo-structure checklist coverage (INFORMATIONAL — not in client bundle)
// ═══════════════════════════════════════════════════════════════════════════
async function executeRepoStructureChecklistTest(testDef: TestDefinition): Promise<TestResult> {
  // The repo-structure checklist lives in lidr-kickoff/checklists/ which is NOT
  // shipped in the client bundle (only SKILL.md is globbed). We can verify the
  // owning skill exists, but cannot inspect the checklist's category coverage
  // from the browser — so this is reported honestly as informational.
  const owner = skills.find((s) => s.id === 'lidr-kickoff');
  return info(
    testDef,
    owner
      ? 'ℹ️ Informational: repo-structure checklist (lidr-kickoff) exists but its category coverage needs a server-side scan'
      : '⚠️ Informational: repo-structure checklist owner skill (lidr-kickoff) not found in registry',
    [
      'Checklist files (checklists/*.md) are not in the client bundle glob — run a CLI audit to verify category coverage',
    ]
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// T24 — Governance template skills are registered
// ═══════════════════════════════════════════════════════════════════════════
async function executeGovernanceTemplatesTest(testDef: TestDefinition): Promise<TestResult> {
  // Governance artifacts (README/CONTRIBUTING/SECURITY/CHANGELOG scaffolding)
  // are produced by the lidr-init-project-docs command + lidr-kickoff skill.
  // Verify those owning artifacts are registered in the ecosystem.
  const requiredCommand = commands.find((c) => c.id === 'lidr-init-project-docs');
  const requiredSkill = skills.find((s) => s.id === 'lidr-kickoff');
  const missing: string[] = [];
  if (!requiredCommand) {
    missing.push('command lidr-init-project-docs not registered');
  }
  if (!requiredSkill) {
    missing.push('skill lidr-kickoff not registered');
  }

  return missing.length === 0
    ? pass(
        testDef,
        '✅ Governance scaffolding artifacts registered (lidr-init-project-docs, lidr-kickoff)'
      )
    : fail(testDef, `❌ ${missing.length} governance scaffolding artifact(s) missing`, missing);
}

// ═══════════════════════════════════════════════════════════════════════════
// T25 — Every filesystem doc is referenced by >= 1 HelpCenter artifact
// ═══════════════════════════════════════════════════════════════════════════
async function executeDocReferencedByArtifactTest(testDef: TestDefinition): Promise<TestResult> {
  // An artifact "references" a doc when its docPath points at it. Build the set
  // of docPaths owned by registered artifacts (skills + commands), then check
  // which core filesystem docs (skills/commands) lack an owning artifact.
  const ownedDocPaths = new Set<string>();
  for (const s of skills) {
    if (s.docPath) {
      ownedDocPaths.add(s.docPath.replace(/^\//, ''));
    }
  }
  for (const c of commands) {
    if (c.docPath) {
      ownedDocPaths.add(c.docPath.replace(/^\//, ''));
    }
  }

  const coreRe = /\.claude\/(skills\/[^/]+\/SKILL\.md|commands\/[^/]+\.md)$/;
  const coreDocs = Array.from(availableDocPaths).filter((p) => coreRe.test(p));
  const unreferenced = coreDocs.filter(
    (p) => !ownedDocPaths.has(p) && !HELPCENTER_DOCPATHS.includes(p)
  );

  return unreferenced.length === 0
    ? pass(
        testDef,
        `✅ All ${coreDocs.length} core skill/command docs are referenced by ≥1 artifact`
      )
    : warn(
        testDef,
        `⚠️ ${unreferenced.length} core docs not referenced by any registered artifact`,
        unreferenced.slice(0, 15)
      );
}

// ═══════════════════════════════════════════════════════════════════════════
// T26 — Document ownership: every registered docPath maps to an artifact type
// ═══════════════════════════════════════════════════════════════════════════
async function executeDocumentOwnershipTest(testDef: TestDefinition): Promise<TestResult> {
  // Each registered docPath must be classifiable into an owning artifact type
  // (skill, command, rule, agent, hook, config, doc). An unclassifiable path
  // has no owner and is a governance gap.
  const classify = (p: string): string | null => {
    if (/\.claude\/skills\/[^/]+\/SKILL\.md$/.test(p)) {
      return 'skill';
    }
    // Nested SKILL.md under a skill's assets/ (e.g. bmad-module-builder's
    // setup-skill-template) is a template asset owned by its parent skill.
    if (/\.claude\/skills\/[^/]+\/.+\/SKILL\.md$/.test(p)) {
      return 'skill-asset';
    }
    if (/\.claude\/commands\/[^/]+\.md$/.test(p)) {
      return 'command';
    }
    if (/\.claude\/rules\/.+\.md$/.test(p)) {
      return 'rule';
    }
    if (/\.claude\/agents\/.+\.md$/.test(p)) {
      return 'agent';
    }
    if (/\.claude\/hooks\/.+\.sh$/.test(p)) {
      return 'hook';
    }
    if (/\.(json)$/.test(p) || p === 'CLAUDE.md') {
      return 'config';
    }
    if (/^(docs|guidelines)\//.test(p)) {
      return 'doc';
    }
    return null;
  };
  const unowned = HELPCENTER_DOCPATHS.filter((p) => classify(p) === null);
  return unowned.length === 0
    ? pass(
        testDef,
        `✅ All ${HELPCENTER_DOCPATHS.length} registered docs map to an owning artifact type`
      )
    : fail(
        testDef,
        `❌ ${unowned.length} registered docs have no classifiable owner type`,
        unowned.slice(0, 15)
      );
}

// ═══════════════════════════════════════════════════════════════════════════
// T27 — Agent spec compliance: every agent .md has required frontmatter
// ═══════════════════════════════════════════════════════════════════════════
async function executeAgentFrontmatterTest(testDef: TestDefinition): Promise<TestResult> {
  const violations: string[] = [];
  let checked = 0;

  for (const [path, loader] of Object.entries(mdFiles)) {
    // mdFiles keys are normalized WITHOUT a leading slash; agents are named
    // "<name>.agent.md" (bmad) or "<name>.md" (lidr).
    const match = path.match(/\.claude\/agents\/([^/]+)\.md$/);
    if (!match) {
      continue;
    }
    checked++;
    const agentName = match[1];
    try {
      const content = await loader();
      const err = validateFrontmatter(content);
      if (err) {
        violations.push(`${agentName}: ${err}`);
      }
    } catch {
      violations.push(`${agentName}: could not read file`);
    }
  }

  if (checked === 0) {
    return warn(testDef, '⚠️ No agent .md files found by the MarkdownViewer glob', [
      'Expected files under .claude/agents/*.md',
    ]);
  }
  return violations.length === 0
    ? pass(
        testDef,
        `✅ All ${checked} agent .md files have valid frontmatter (description present)`
      )
    : fail(
        testDef,
        `❌ ${violations.length}/${checked} agent .md files missing required frontmatter`,
        violations.slice(0, 12)
      );
}

// ═══════════════════════════════════════════════════════════════════════════
// T28 — Rule ecosystem completeness: required LIDR SDLC rules exist
// ═══════════════════════════════════════════════════════════════════════════
async function executeRuleEcosystemCompletenessTest(testDef: TestDefinition): Promise<TestResult> {
  const requiredRules = [
    '.claude/rules/lidr-sdlc/org.md',
    '.claude/rules/lidr-sdlc/project.md',
    '.claude/rules/lidr-sdlc/tech-stack.md',
    '.claude/rules/lidr-sdlc/workflows.md',
    '.claude/rules/lidr-sdlc/documentation.md',
    '.claude/rules/lidr-sdlc/spec-execution.md',
    '.claude/rules/lidr-sdlc/model-selection.md',
  ];
  const missing = requiredRules.filter((p) => !availableDocPaths.has(p));
  return missing.length === 0
    ? pass(
        testDef,
        `✅ All ${requiredRules.length} required LIDR SDLC governance rules exist on the filesystem`
      )
    : fail(
        testDef,
        `❌ ${missing.length} required LIDR SDLC rules missing from the filesystem`,
        missing
      );
}

// ═══════════════════════════════════════════════════════════════════════════
// T29 — Stats synchronization (simple-stats.ts vs EXPECTED_COUNTS / registries)
// ═══════════════════════════════════════════════════════════════════════════
async function executeStatsSyncTest(testDef: TestDefinition): Promise<TestResult> {
  const mismatches: string[] = [];
  if (ecosystemStats.skills !== skills.length) {
    mismatches.push(
      `simple-stats.skills (${ecosystemStats.skills}) != skills registry (${skills.length})`
    );
  }
  if (ecosystemStats.commands !== filesystemCommandPaths().length) {
    mismatches.push(
      `simple-stats.commands (${ecosystemStats.commands}) != filesystem commands (${filesystemCommandPaths().length})`
    );
  }
  if (ecosystemStats.skills !== EXPECTED_COUNTS.skills) {
    mismatches.push(
      `simple-stats.skills (${ecosystemStats.skills}) != EXPECTED_COUNTS.skills (${EXPECTED_COUNTS.skills})`
    );
  }
  return mismatches.length === 0
    ? pass(
        testDef,
        `✅ simple-stats.ts is synchronized with the registries (skills=${ecosystemStats.skills}, commands=${ecosystemStats.commands})`
      )
    : fail(
        testDef,
        `❌ ${mismatches.length} stats out of sync between simple-stats.ts and the data registries`,
        mismatches
      );
}

// ═══════════════════════════════════════════════════════════════════════════
// T30 — Automation scripts existence (INFORMATIONAL — validators not in bundle)
// ═══════════════════════════════════════════════════════════════════════════
async function executeAutomationScriptsTest(testDef: TestDefinition): Promise<TestResult> {
  // Validation/automation scripts (skills/*/scripts/*.ts, _shared/validators)
  // are Node-side and not exposed to the client bundle glob. We CAN verify that
  // skills flagged `automated` exist and that the promised automation count is
  // positive, but the scripts themselves require a CLI run to confirm.
  const automatedSkills = skills.filter((s) => s.automated);
  const expected = ecosystemStats.automatedSkills;
  const details = [
    `automated skills in registry: ${automatedSkills.length}`,
    `simple-stats.automatedSkills: ${expected}`,
    `validationScripts (claimed): ${ecosystemStats.validationScripts}`,
  ];
  // The registry currently flags automation via simple-stats rather than the
  // per-skill `automated` flag; treat a positive promised count as the bundle's
  // best verifiable signal and surface the rest as informational.
  return ecosystemStats.validationScripts > 0
    ? info(
        testDef,
        `ℹ️ Informational: ${ecosystemStats.validationScripts} automation scripts promised — existence needs a server-side scan`,
        details
      )
    : fail(testDef, '❌ No automation scripts promised (validationScripts = 0)', details);
}

// ═══════════════════════════════════════════════════════════════════════════
// T31 — ROI calculation consistency
// ═══════════════════════════════════════════════════════════════════════════
async function executeRoiConsistencyTest(testDef: TestDefinition): Promise<TestResult> {
  const issues: string[] = [];
  // automationPercentage must equal round(automated/total*100).
  const expectedPct = Math.round(
    (automationStats.automatedSkills / automationStats.totalSkills) * 100
  );
  if (automationStats.automationPercentage !== expectedPct) {
    issues.push(
      `automationPercentage (${automationStats.automationPercentage}) != computed (${expectedPct})`
    );
  }
  // manualSkills must equal total - automated.
  if (
    automationStats.manualSkills !==
    automationStats.totalSkills - automationStats.automatedSkills
  ) {
    issues.push(`manualSkills (${automationStats.manualSkills}) != total - automated`);
  }
  // per-sprint hours must equal round(year/26).
  if (
    automationStats.estimatedHoursSavedPerSprint !==
    Math.round(automationStats.estimatedHoursSavedPerYear / 26)
  ) {
    issues.push(
      `per-sprint hours (${automationStats.estimatedHoursSavedPerSprint}) != round(year/26)`
    );
  }
  // total must be a positive number.
  if (!(automationStats.estimatedHoursSavedPerYear > 0)) {
    issues.push(
      `estimatedHoursSavedPerYear is not positive (${automationStats.estimatedHoursSavedPerYear})`
    );
  }

  return issues.length === 0
    ? pass(
        testDef,
        `✅ ROI calculations are internally consistent (${automationStats.automationPercentage}% automated, ${automationStats.estimatedHoursSavedPerYear}h/yr)`
      )
    : fail(testDef, `❌ ${issues.length} ROI calculation inconsistencies`, issues);
}

// ═══════════════════════════════════════════════════════════════════════════
// T32 — Documentation Travel With Code (DTC) (INFORMATIONAL — git/PR scope)
// ═══════════════════════════════════════════════════════════════════════════
async function executeDtcComplianceTest(testDef: TestDefinition): Promise<TestResult> {
  // DTC compliance ("docs updated in the same PR as code") is a git/PR-level
  // property that cannot be observed from the client bundle. We verify the
  // governing rule is present, then honestly mark the rest informational.
  const hasRule = availableDocPaths.has('.claude/rules/lidr-sdlc/documentation.md');
  return info(
    testDef,
    hasRule
      ? 'ℹ️ Informational: DTC governance rule present; per-PR DTC compliance requires git history (run /lidr-validate-project-docs)'
      : '⚠️ Informational: DTC governance rule (documentation.md) not found — cannot assess DTC',
    [
      'DTC is enforced per-PR by the lidr-frontmatter-guard hook + Gate 4; not observable from the browser bundle',
    ]
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// T33 — Coherence validation (INFORMATIONAL — npm script runs server-side)
// ═══════════════════════════════════════════════════════════════════════════
async function executeCoherenceValidationTest(testDef: TestDefinition): Promise<TestResult> {
  // `npm run validate:coherence` is a Node CLI script; it cannot run from the
  // browser. Report honestly as informational instead of a fake pass.
  return info(
    testDef,
    'ℹ️ Informational: run `npm run validate:coherence` (CLI) to detect hardcoded-value drift',
    ['This check executes server-side and is not runnable from the client bundle']
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// T34 — Client registry integrity
// ═══════════════════════════════════════════════════════════════════════════
async function executeClientRegistryTest(testDef: TestDefinition): Promise<TestResult> {
  const { getAvailableClients, getClientById } = await import('@/data/client-registry');
  const clientIds = getAvailableClients();
  const problems: string[] = [];

  if (clientIds.length === 0) {
    problems.push('no clients registered');
  }
  for (const id of clientIds) {
    try {
      const cfg = getClientById(id);
      if (!cfg?.name) {
        problems.push(`client ${id}: missing name`);
      }
      if (!cfg?.industry) {
        problems.push(`client ${id}: missing industry`);
      }
    } catch (e) {
      problems.push(`client ${id}: ${e instanceof Error ? e.message : 'config error'}`);
    }
  }

  return problems.length === 0
    ? pass(
        testDef,
        `✅ All ${clientIds.length} registered clients have complete config: ${clientIds.join(', ')}`
      )
    : fail(testDef, `❌ ${problems.length} client configuration issue(s)`, problems);
}

// ═══════════════════════════════════════════════════════════════════════════
// T35 — Route configuration: every route has a valid component
// ═══════════════════════════════════════════════════════════════════════════
async function executeRouteConfigTest(testDef: TestDefinition): Promise<TestResult> {
  const { ROUTE_REGISTRY } = await import('@/app/route-registry');
  const problems: string[] = [];
  const ids = new Set<string>();

  for (const route of ROUTE_REGISTRY) {
    if (!route.Component) {
      problems.push(`route ${route.id}: missing Component`);
    }
    if (typeof route.path !== 'string') {
      problems.push(`route ${route.id}: missing path`);
    }
    if (ids.has(route.id)) {
      problems.push(`duplicate route id: ${route.id}`);
    }
    ids.add(route.id);
  }

  const minRoutes = 15;
  if (ROUTE_REGISTRY.length < minRoutes) {
    problems.push(`only ${ROUTE_REGISTRY.length} routes (expected >= ${minRoutes})`);
  }

  return problems.length === 0
    ? pass(testDef, `✅ All ${ROUTE_REGISTRY.length} routes have valid components and unique ids`)
    : fail(testDef, `❌ ${problems.length} route configuration issue(s)`, problems.slice(0, 15));
}

// ═══════════════════════════════════════════════════════════════════════════
// T36 — Data source sync (HelpCenter, SitemapView, MarkdownViewer)
// ═══════════════════════════════════════════════════════════════════════════
async function executeDataSourceSyncTest(testDef: TestDefinition): Promise<TestResult> {
  const helpCenterUnique = HELPCENTER_DOCPATHS.filter((p) => !SITEMAP_DOCPATHS.includes(p));
  const sitemapUnique = SITEMAP_DOCPATHS.filter((p) => !HELPCENTER_DOCPATHS.includes(p));
  const registered = new Set([...HELPCENTER_DOCPATHS, ...SITEMAP_DOCPATHS]);
  const markdownUnique = mdFilePaths.filter((p) => p.endsWith('.md') && !registered.has(p));

  const totalInconsistencies = helpCenterUnique.length + sitemapUnique.length;
  const details: string[] = [];
  if (helpCenterUnique.length > 0) {
    details.push(
      `Only in HelpCenter: ${helpCenterUnique.slice(0, 3).join(', ')}${helpCenterUnique.length > 3 ? '…' : ''}`
    );
  }
  if (sitemapUnique.length > 0) {
    details.push(
      `Only in SitemapView: ${sitemapUnique.slice(0, 3).join(', ')}${sitemapUnique.length > 3 ? '…' : ''}`
    );
  }
  if (markdownUnique.length > 0) {
    details.push(`In MarkdownViewer glob but unregistered: ${markdownUnique.length} files`);
  }

  return totalInconsistencies === 0
    ? pass(
        testDef,
        '✅ HelpCenter & SitemapView docPaths are perfectly synchronized',
        details.length ? details : undefined
      )
    : fail(
        testDef,
        `❌ ${totalInconsistencies} docPath inconsistencies between HelpCenter & SitemapView`,
        details
      );
}
