import { ShieldCheck } from 'lucide-react';
import { PageHeader, SectionBox } from '@/app/components/shared/FlowComponents';
import { TestRunner } from './TestRunner';
import { TestSuite } from './TestSuite';
import { TestResults } from './TestResults';
import { ProblemsPanel } from './ProblemsPanel';
import { useTestExecution } from './useTestExecution';

/**
 * IntegrityTests - Main container component for test execution architecture
 * Refactored from 2,087 lines to ~350 lines through componentization
 *
 * Architecture:
 * - IntegrityTests.tsx (350 lines) - Container principal
 * - TestRunner.tsx (120 lines) - Ejecutor tests
 * - TestSuite.tsx (100 lines) - Lista de tests paginada
 * - TestResults.tsx (80 lines) - Resultados + scoring
 * - useTestExecution.ts (100 lines) - Hook ejecución + business logic
 */
export function IntegrityTests() {
  const {
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
    testCategories,
    testDefinitions,
    config,
  } = useTestExecution();

  const isComplete = summary.total === testDefinitions.length && !isRunning;
  const getCategoryTestCount = (categoryId: string) => {
    return testDefinitions.filter((test) => test.category === categoryId).length;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Tests de Integridad — Ecosistema SDLC"
        subtitle="36 verificaciones automatizadas: paths, contadores, relaciones, frontmatter, workflows, triggers, trazabilidad DTC, coherencia de datos y client registry integrity"
      />

      {/* Test Runner */}
      <TestRunner
        isRunning={isRunning}
        summary={summary}
        executionStartTime={executionStartTime}
        onRunAllTests={runAllTests}
        onClearResults={clearResults}
        totalTests={testDefinitions.length}
      />

      {/* Problems first: every failure/warning surfaced full-width, no pagination hunting */}
      <ProblemsPanel
        testResults={testResults}
        isRunning={isRunning}
        onRunSingleTest={runSingleTest}
      />

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Test Execution */}
        <div className="space-y-6">
          <SectionBox
            icon={<ShieldCheck className="text-indigo-600" size={20} />}
            title="Tests de Integridad"
            subtitle="Ejecuta 36 verificaciones automatizadas que comprueban la consistencia entre HelpCenter, SitemapView, MarkdownViewer, filesystem, contenido YAML, relaciones entre artefactos, trazabilidad DTC, agent spec compliance, coherencia de datos y salud del ecosistema."
          >
            {/* Category Overview */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {testCategories.map((category) => (
                <div
                  key={category.id}
                  className={`
                    cursor-pointer transition-all duration-200 border-2 rounded-lg p-4
                    ${
                      selectedCategory === category.id
                        ? 'border-indigo-300 bg-indigo-50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }
                  `}
                  onClick={() =>
                    setSelectedCategory(selectedCategory === category.id ? null : category.id)
                  }
                >
                  <div className="flex items-center gap-2 mb-1">
                    {category.icon}
                    <h4 className="font-semibold text-slate-800">{category.name}</h4>
                  </div>
                  <p className="text-sm text-slate-600">
                    {getCategoryTestCount(category.id)} tests
                  </p>
                </div>
              ))}
            </div>

            {/* Test Suite */}
            <TestSuite
              tests={paginatedTests}
              testResults={testResults}
              testCategories={testCategories}
              selectedCategory={selectedCategory}
              currentPage={currentPage}
              totalPages={totalPages}
              isRunning={isRunning}
              onSelectCategory={setSelectedCategory}
              onRunSingleTest={runSingleTest}
              onPageChange={setCurrentPage}
              statusFilter={statusFilter}
              statusCounts={statusCounts}
              onSelectStatus={setStatusFilter}
            />
          </SectionBox>
        </div>

        {/* Right Column - Results & Scoring */}
        <div className="space-y-6">
          <SectionBox
            icon={<ShieldCheck className="text-emerald-600" size={20} />}
            title="Resultados y Scoring"
            subtitle="Puntuación de salud del ecosistema basada en la ejecución de tests de integridad."
          >
            <TestResults
              summary={summary}
              testResults={testResults}
              testCategories={testCategories}
              isComplete={isComplete}
              totalTests={testDefinitions.length}
            />
          </SectionBox>

          {/* Test Configuration Info */}
          <SectionBox
            icon={<ShieldCheck className="text-blue-600" size={20} />}
            title="Configuración de Tests"
            subtitle="Configuración y estadísticas de la suite de tests."
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="font-medium text-slate-900">Tests por página</div>
                  <div className="text-slate-600">{config.TESTS_PER_PAGE}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="font-medium text-slate-900">Timeout async</div>
                  <div className="text-slate-600">{config.ASYNC_TEST_TIMEOUT}ms</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="font-medium text-slate-900">Max detalles</div>
                  <div className="text-slate-600">{config.MAX_DETAILS_ITEMS} items</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="font-medium text-slate-900">Categorías RT</div>
                  <div className="text-slate-600">{config.REAL_TIME_CATEGORIES.length}</div>
                </div>
              </div>

              <div className="text-sm text-slate-600">
                <div className="font-medium text-slate-900 mb-2">Categorías en tiempo real:</div>
                <div className="flex flex-wrap gap-2">
                  {config.REAL_TIME_CATEGORIES.map((category) => (
                    <span
                      key={category}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-sm text-slate-600">
                <div className="font-medium text-slate-900 mb-2">Estadísticas de tipos:</div>
                <div className="space-y-1">
                  <div>
                    • Tests síncronos: {testDefinitions.filter((t) => t.type === 'sync').length}
                  </div>
                  <div>
                    • Tests asíncronos: {testDefinitions.filter((t) => t.type === 'async').length}
                  </div>
                  <div>• Total categorías: {testCategories.length}</div>
                  <div>• Total tests: {testDefinitions.length}</div>
                </div>
              </div>
            </div>
          </SectionBox>
        </div>
      </div>

      {/* Debug Info (development only) */}
      {import.meta.env.DEV && (
        <details className="text-sm text-slate-500 border rounded p-4">
          <summary className="cursor-pointer font-medium">Debug Info</summary>
          <div className="mt-2 space-y-2">
            <div>Filtered tests: {filteredTests.length}</div>
            <div>
              Current page: {currentPage}/{totalPages}
            </div>
            <div>Selected category: {selectedCategory || 'None'}</div>
            <div>Running: {isRunning ? 'Yes' : 'No'}</div>
            <div>Results count: {Object.keys(testResults).length}</div>
            <div>Execution time: {executionStartTime ? Date.now() - executionStartTime : 0}ms</div>
          </div>
        </details>
      )}
    </div>
  );
}
