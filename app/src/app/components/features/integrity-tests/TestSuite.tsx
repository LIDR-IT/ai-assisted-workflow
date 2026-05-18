import {
  Play,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import {
  TestDefinition,
  TestResult,
  TestCategory,
  getStatusColor,
} from '@/data/features/integrityTests';

interface TestSuiteProps {
  tests: TestDefinition[];
  testResults: Record<string, TestResult>;
  testCategories: TestCategory[];
  selectedCategory: string | null;
  currentPage: number;
  totalPages: number;
  isRunning: boolean;
  onSelectCategory: (categoryId: string | null) => void;
  onRunSingleTest: (testId: string) => void;
  onPageChange: (page: number) => void;
}

/**
 * Test suite display component with pagination
 * Shows list of tests, their status, and category filtering
 */
export function TestSuite({
  tests,
  testResults,
  testCategories,
  selectedCategory,
  currentPage,
  totalPages,
  isRunning,
  onSelectCategory,
  onRunSingleTest,
  onPageChange,
}: TestSuiteProps) {
  const getStatusIcon = (testId: string) => {
    const result = testResults[testId];
    if (!result) {
      return <Clock className="w-4 h-4 text-slate-400" />;
    }

    switch (result.status) {
      case 'pass':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'fail':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warn':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'running':
        return <Clock className="w-4 h-4 text-blue-600 animate-pulse" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getLucideIcon = (iconName: string) => {
    const iconProps = { className: 'w-4 h-4' };

    switch (iconName) {
      case 'ShieldCheck':
        return <CheckCircle2 {...iconProps} />;
      case 'Brain':
        return <Play {...iconProps} />;
      case 'FileText':
        return <CheckCircle2 {...iconProps} />;
      case 'Terminal':
        return <Play {...iconProps} />;
      case 'Zap':
        return <CheckCircle2 {...iconProps} />;
      case 'Cable':
        return <Play {...iconProps} />;
      case 'Link2':
        return <CheckCircle2 {...iconProps} />;
      case 'Users':
        return <Play {...iconProps} />;
      default:
        return <CheckCircle2 {...iconProps} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
            ${
              !selectedCategory
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }
          `}
        >
          Todos los tests
        </button>

        {testCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
              transition-colors duration-200
              ${
                selectedCategory === category.id
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }
            `}
          >
            {getLucideIcon(category.icon)}
            {category.name}
          </button>
        ))}
      </div>

      {/* Tests list */}
      <div className="space-y-2">
        {tests.map((test) => {
          const result = testResults[test.id];
          const hasResult = !!result;

          return (
            <div
              key={test.id}
              className={`
                border rounded-lg p-4 transition-all duration-200
                ${hasResult ? getStatusColor(result.status) : 'bg-white border-slate-200'}
                hover:shadow-md
              `}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Test info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(test.id)}
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                        {test.id.toUpperCase()}
                      </span>
                      <span className="text-sm font-medium text-slate-900">{test.name}</span>
                    </div>
                  </div>

                  <div className="text-sm text-slate-600 mb-2">{test.description}</div>

                  {/* Test result message */}
                  {result && (
                    <div className="text-sm">
                      <div
                        className={`
                          font-medium
                          ${
                            result.status === 'pass'
                              ? 'text-emerald-700'
                              : result.status === 'warn'
                                ? 'text-yellow-700'
                                : result.status === 'fail'
                                  ? 'text-red-700'
                                  : 'text-blue-700'
                          }
                        `}
                      >
                        {result.message}
                      </div>

                      {/* Test details */}
                      {result.details && result.details.length > 0 && (
                        <div className="mt-2 text-xs text-slate-600">
                          <details className="cursor-pointer">
                            <summary className="hover:text-slate-800">
                              Ver detalles ({result.details.length} items)
                            </summary>
                            <div className="mt-2 ml-4 space-y-1">
                              {result.details.slice(0, 10).map((detail, idx) => (
                                <div key={idx} className="font-mono text-xs">
                                  {detail}
                                </div>
                              ))}
                              {result.details.length > 10 && (
                                <div className="text-xs italic">
                                  ...y {result.details.length - 10} más
                                </div>
                              )}
                            </div>
                          </details>
                        </div>
                      )}

                      {/* Duration */}
                      {result.duration !== undefined && (
                        <div className="mt-1 text-xs text-slate-500">
                          Ejecutado en {result.duration}ms
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Run test button */}
                <button
                  onClick={() => onRunSingleTest(test.id)}
                  disabled={isRunning}
                  className="
                    flex items-center gap-2 px-3 py-2 text-sm
                    bg-slate-100 hover:bg-slate-200 text-slate-700
                    rounded-lg transition-colors duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    shrink-0
                  "
                >
                  <Play className="w-3 h-3" />
                  Ejecutar
                </button>
              </div>
            </div>
          );
        })}

        {tests.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <div className="text-lg font-medium mb-2">No hay tests en esta categoría</div>
            <div className="text-sm">
              Selecciona otra categoría o "Todos los tests" para ver los tests disponibles.
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <span className="text-slate-400">•</span>
            <span>{tests.length} tests</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="
                p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50
                disabled:cursor-not-allowed transition-colors duration-200
              "
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`
                  px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200
                  ${
                    page === currentPage
                      ? 'bg-indigo-600 text-white'
                      : 'hover:bg-slate-100 text-slate-600'
                  }
                `}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="
                p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50
                disabled:cursor-not-allowed transition-colors duration-200
              "
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
