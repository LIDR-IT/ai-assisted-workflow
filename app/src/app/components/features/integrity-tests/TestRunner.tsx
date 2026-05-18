import { Play, RefreshCw, Trash2 } from 'lucide-react';
import { TestSummary } from '@/data/features/integrityTests';

interface TestRunnerProps {
  isRunning: boolean;
  summary: TestSummary;
  executionStartTime: number | null;
  onRunAllTests: () => void;
  onClearResults: () => void;
  totalTests: number;
}

/**
 * Test execution control component
 * Provides buttons and status for running tests
 */
export function TestRunner({
  isRunning,
  summary,
  executionStartTime,
  onRunAllTests,
  onClearResults,
  totalTests,
}: TestRunnerProps) {
  const hasResults = summary.total > 0;
  const executionTime = executionStartTime ? Date.now() - executionStartTime : 0;

  const formatExecutionTime = (ms: number): string => {
    if (ms < 1000) {
      return `${ms}ms`;
    }
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getStatusColor = () => {
    if (isRunning) {
      return 'bg-blue-500 hover:bg-blue-600';
    }
    if (summary.fail > 0) {
      return 'bg-red-500 hover:bg-red-600';
    }
    if (summary.warn > 0) {
      return 'bg-yellow-500 hover:bg-yellow-600';
    }
    if (summary.pass > 0) {
      return 'bg-emerald-500 hover:bg-emerald-600';
    }
    return 'bg-indigo-600 hover:bg-indigo-700';
  };

  const getStatusText = () => {
    if (isRunning) {
      return `Ejecutando tests... (${summary.total}/${totalTests})`;
    }
    if (hasResults && summary.total === totalTests) {
      return `Ejecutar ${totalTests} tests`;
    }
    return `Ejecutar ${totalTests} tests`;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main execution button */}
      <button
        onClick={onRunAllTests}
        disabled={isRunning}
        className={`
          flex items-center gap-3 px-6 py-3 rounded-lg text-white font-medium
          transition-all duration-200 shadow-md hover:shadow-lg
          disabled:opacity-70 disabled:cursor-not-allowed
          ${getStatusColor()}
        `}
      >
        {isRunning ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
        {getStatusText()}
      </button>

      {/* Execution status and controls */}
      {(hasResults || isRunning) && (
        <div className="flex flex-col gap-3">
          {/* Summary stats */}
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span>Pasaron: {summary.pass}</span>
            </div>

            {summary.warn > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Advertencias: {summary.warn}</span>
              </div>
            )}

            {summary.fail > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Fallaron: {summary.fail}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span>Total: {summary.total}</span>
            </div>

            {summary.totalDuration > 0 && (
              <div className="flex items-center gap-2">
                <span>Tiempo: {formatExecutionTime(summary.totalDuration)}</span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          {isRunning && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                role="progressbar"
                aria-valuenow={summary.total}
                aria-valuemin={0}
                aria-valuemax={totalTests}
                aria-label={`Progreso de tests: ${summary.total} de ${totalTests} completados`}
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(summary.total / totalTests) * 100}%`,
                }}
              ></div>
            </div>
          )}

          {/* Clear results button */}
          {hasResults && !isRunning && (
            <button
              onClick={onClearResults}
              className="
                flex items-center gap-2 px-4 py-2 text-sm text-slate-600
                hover:text-slate-800 hover:bg-slate-100 rounded-lg
                transition-colors duration-200 self-start
              "
            >
              <Trash2 className="w-4 h-4" />
              Limpiar resultados
            </button>
          )}
        </div>
      )}

      {/* Real-time execution status */}
      {isRunning && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-800 font-medium">
              Ejecutando verificaciones de integridad...
            </span>
            {executionTime > 0 && (
              <span className="text-blue-600">{formatExecutionTime(executionTime)}</span>
            )}
          </div>

          <div className="mt-2 text-xs text-blue-600">
            Validando paths, contadores, relaciones, frontmatter, workflows, triggers, trazabilidad
            DTC y agent spec compliance
          </div>
        </div>
      )}

      {/* Completion status */}
      {hasResults && !isRunning && summary.total === totalTests && (
        <div
          className={`
          border rounded-lg p-4 ${
            summary.fail > 0
              ? 'bg-red-50 border-red-200'
              : summary.warn > 0
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-emerald-50 border-emerald-200'
          }
        `}
        >
          <div
            className={`
            text-sm font-medium ${
              summary.fail > 0
                ? 'text-red-800'
                : summary.warn > 0
                  ? 'text-yellow-800'
                  : 'text-emerald-800'
            }
          `}
          >
            {summary.fail > 0
              ? `❌ ${summary.fail} tests fallaron`
              : summary.warn > 0
                ? `⚠️ ${summary.warn} tests con advertencias`
                : `✅ Todos los tests pasaron correctamente`}
          </div>

          <div
            className={`
            mt-1 text-xs ${
              summary.fail > 0
                ? 'text-red-600'
                : summary.warn > 0
                  ? 'text-yellow-600'
                  : 'text-emerald-600'
            }
          `}
          >
            Verificación de integridad completada en {formatExecutionTime(summary.totalDuration)}
          </div>
        </div>
      )}
    </div>
  );
}
