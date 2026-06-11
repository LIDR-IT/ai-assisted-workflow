import { XCircle, AlertTriangle, Play } from 'lucide-react';
import { useMemo } from 'react';
import { TestResult } from '@/data/features/integrityTests';

interface ProblemsPanelProps {
  testResults: Record<string, TestResult>;
  isRunning: boolean;
  onRunSingleTest?: (testId: string) => void;
}

/** Numeric sort for test ids ("t3" < "t12"). */
const byTestId = (a: TestResult, b: TestResult) =>
  parseInt(a.id.replace(/\D/g, ''), 10) - parseInt(b.id.replace(/\D/g, ''), 10);

/**
 * ProblemsPanel — surfaces every failing/warning test in one prominent,
 * full-width block so problems never hide behind pagination.
 *
 * - Failures first (details expanded), warnings after (details collapsed).
 * - `aria-live="polite"` announces updates while the suite runs.
 * - Renders nothing when there are no problems (clean run stays clean).
 */
export function ProblemsPanel({ testResults, isRunning, onRunSingleTest }: ProblemsPanelProps) {
  const { failures, warnings } = useMemo(() => {
    const results = Object.values(testResults);
    return {
      failures: results.filter((r) => r.status === 'fail').sort(byTestId),
      warnings: results.filter((r) => r.status === 'warn').sort(byTestId),
    };
  }, [testResults]);

  const total = failures.length + warnings.length;

  // aria-live region must exist before results arrive for announcements to fire.
  if (total === 0) {
    return <div aria-live="polite" data-testid="problems-panel-empty" />;
  }

  const renderItem = (result: TestResult, isFailure: boolean) => (
    <li
      key={result.id}
      className={`rounded-lg border-2 p-4 ${
        isFailure ? 'border-red-300 bg-red-50' : 'border-amber-300 bg-amber-50'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {isFailure ? (
              <XCircle className="w-4 h-4 text-red-600 shrink-0" aria-hidden="true" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
            )}
            <span className="font-mono text-xs bg-white/70 px-2 py-0.5 rounded border border-slate-200">
              {result.id.toUpperCase()}
            </span>
            <span className="text-sm font-semibold text-slate-900 break-words">{result.name}</span>
          </div>

          <div
            className={`text-sm font-medium ${isFailure ? 'text-red-800' : 'text-amber-800'} break-words`}
          >
            {result.message}
          </div>

          {result.details && result.details.length > 0 && (
            <details className="mt-2 text-xs text-slate-700" open={isFailure}>
              <summary className="cursor-pointer font-medium hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 rounded">
                Detalles ({result.details.length} items)
              </summary>
              <ul className="mt-2 ml-4 space-y-1 list-disc">
                {result.details.slice(0, 10).map((detail, idx) => (
                  <li key={idx} className="font-mono break-all">
                    {detail}
                  </li>
                ))}
                {result.details.length > 10 && (
                  <li className="italic list-none">…y {result.details.length - 10} más</li>
                )}
              </ul>
            </details>
          )}
        </div>

        {onRunSingleTest && (
          <button
            onClick={() => onRunSingleTest(result.id)}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
          >
            <Play className="w-3 h-3" aria-hidden="true" />
            Re-ejecutar
          </button>
        )}
      </div>
    </li>
  );

  return (
    <section
      aria-live="polite"
      aria-label="Problemas detectados en los tests de integridad"
      data-testid="problems-panel"
      className={`rounded-xl border-2 p-5 ${
        failures.length > 0 ? 'border-red-300 bg-red-50/50' : 'border-amber-300 bg-amber-50/50'
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        {failures.length > 0 ? (
          <XCircle className="w-6 h-6 text-red-600" aria-hidden="true" />
        ) : (
          <AlertTriangle className="w-6 h-6 text-amber-600" aria-hidden="true" />
        )}
        <h3 className="text-lg font-bold text-slate-900">
          Problemas detectados
          <span className="ml-2 text-sm font-medium text-slate-600">
            {failures.length > 0 && (
              <span className="text-red-700">
                {failures.length} {failures.length === 1 ? 'fallo' : 'fallos'}
              </span>
            )}
            {failures.length > 0 && warnings.length > 0 && ' · '}
            {warnings.length > 0 && (
              <span className="text-amber-700">
                {warnings.length} {warnings.length === 1 ? 'advertencia' : 'advertencias'}
              </span>
            )}
          </span>
        </h3>
      </div>

      <ul className="space-y-3">
        {failures.map((r) => renderItem(r, true))}
        {warnings.map((r) => renderItem(r, false))}
      </ul>
    </section>
  );
}
