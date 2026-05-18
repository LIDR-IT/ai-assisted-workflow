import {
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { useMemo } from 'react';
import { TestSummary, TestCategory, TestResult } from '@/data/features/integrityTests';

interface CategoryWithStats extends TestCategory {
  readonly score: number;
  readonly tests: number;
  readonly pass: number;
  readonly warn: number;
  readonly fail: number;
}

interface TestResultsProps {
  summary: TestSummary;
  testResults: Record<string, TestResult>;
  testCategories: TestCategory[];
  isComplete: boolean;
  totalTests: number;
}

/**
 * Test results and scoring display component
 * Shows overall health score and category breakdowns
 */
export function TestResults({
  summary,
  testResults,
  testCategories,
  isComplete,
  totalTests,
}: TestResultsProps) {
  // Calculate overall health score
  const healthScore = useMemo(() => {
    if (summary.total === 0) {
      return 0;
    }

    const passScore = summary.pass * 100;
    const warnScore = summary.warn * 70;
    const failScore = summary.fail * 0;

    return Math.round(((passScore + warnScore + failScore) / (summary.total * 100)) * 100);
  }, [summary]);

  // Calculate category scores
  const categoryScores = useMemo((): CategoryWithStats[] => {
    return testCategories.map((category) => {
      const categoryTests = Object.values(testResults).filter(
        (result) => result.category === category.id
      );
      const total = categoryTests.length;

      if (total === 0) {
        return { ...category, score: 0, tests: 0, pass: 0, warn: 0, fail: 0 };
      }

      const pass = categoryTests.filter((t) => t.status === 'pass').length;
      const warn = categoryTests.filter((t) => t.status === 'warn').length;
      const fail = categoryTests.filter((t) => t.status === 'fail').length;

      const score = Math.round(((pass * 100 + warn * 70) / (total * 100)) * 100);

      return {
        ...category,
        score,
        tests: total,
        pass,
        warn,
        fail,
      };
    });
  }, [testCategories, testResults]);

  const getScoreColor = (score: number) => {
    if (score >= 90) {
      return 'text-emerald-600';
    }
    if (score >= 70) {
      return 'text-yellow-600';
    }
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) {
      return 'bg-emerald-50 border-emerald-200';
    }
    if (score >= 70) {
      return 'bg-yellow-50 border-yellow-200';
    }
    return 'bg-red-50 border-red-200';
  };

  const getScoreIcon = (score: number, id: string = 'main') => {
    if (score >= 90) {
      return (
        <TrendingUp className="w-5 h-5 text-emerald-600" data-testid={`trending-up-icon-${id}`} />
      );
    }
    if (score >= 70) {
      return <Minus className="w-5 h-5 text-yellow-600" data-testid={`minus-icon-${id}`} />;
    }
    return (
      <TrendingDown className="w-5 h-5 text-red-600" data-testid={`trending-down-icon-${id}`} />
    );
  };

  const formatPercentage = (value: number, total: number): string => {
    if (total === 0) {
      return '0%';
    }
    return `${Math.round((value / total) * 100)}%`;
  };

  if (summary.total === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
        <div className="text-slate-500 text-lg font-medium mb-2">
          Ejecuta los tests para ver resultados
        </div>
        <div className="text-slate-400 text-sm">
          Los resultados de integridad y scoring aparecerán aquí una vez que se ejecuten las
          verificaciones.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall health score */}
      <div className={`border rounded-lg p-6 ${getScoreBgColor(healthScore)}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Score de Salud del Ecosistema</h3>
            <div className="text-sm text-slate-600">
              Basado en {summary.total} de {totalTests} tests ejecutados
            </div>
          </div>
          {getScoreIcon(healthScore, 'main')}
        </div>

        <div className="flex items-end gap-4 mb-4">
          <div className={`text-4xl font-bold ${getScoreColor(healthScore)}`}>{healthScore}%</div>
          <div className="flex gap-4 text-sm text-slate-600 pb-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{summary.pass} pasaron</span>
            </div>
            {summary.warn > 0 && (
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span>{summary.warn} advertencias</span>
              </div>
            )}
            {summary.fail > 0 && (
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span>{summary.fail} fallaron</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div className="flex h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500"
              style={{ width: formatPercentage(summary.pass, summary.total) }}
            ></div>
            <div
              className="bg-yellow-500"
              style={{ width: formatPercentage(summary.warn, summary.total) }}
            ></div>
            <div
              className="bg-red-500"
              style={{ width: formatPercentage(summary.fail, summary.total) }}
            ></div>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          {formatPercentage(summary.pass, summary.total)} exitosos •{' '}
          {formatPercentage(summary.warn, summary.total)} advertencias •{' '}
          {formatPercentage(summary.fail, summary.total)} fallidos
        </div>

        {isComplete && (
          <div className="mt-4 text-sm text-slate-600">
            <div className="font-medium">✅ Verificación de integridad completada</div>
            <div className="text-xs mt-1">Tiempo total: {summary.totalDuration}ms</div>
          </div>
        )}
      </div>

      {/* Category breakdown */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Puntuación por Categoría</h3>

        <div className="grid gap-3">
          {categoryScores
            .filter((category) => category.tests > 0)
            .sort((a, b) => b.score - a.score)
            .map((category) => (
              <div
                key={category.id}
                className={`border rounded-lg p-4 ${getScoreBgColor(category.score)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`text-lg font-bold ${getScoreColor(category.score)}`}>
                        {category.score}%
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{category.name}</div>
                        <div className="text-sm text-slate-600">{category.description}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-600">
                      <span>{category.tests} tests</span>
                      {category.pass > 0 && (
                        <span className="text-emerald-600">✓ {category.pass} exitosos</span>
                      )}
                      {category.warn > 0 && (
                        <span className="text-yellow-600">⚠ {category.warn} advertencias</span>
                      )}
                      {category.fail > 0 && (
                        <span className="text-red-600">✗ {category.fail} fallidos</span>
                      )}
                    </div>
                  </div>

                  {getScoreIcon(category.score, category.id)}
                </div>

                {/* Category progress bar */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div className="flex h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500"
                        style={{ width: formatPercentage(category.pass, category.tests) }}
                      ></div>
                      <div
                        className="bg-yellow-500"
                        style={{ width: formatPercentage(category.warn, category.tests) }}
                      ></div>
                      <div
                        className="bg-red-500"
                        style={{ width: formatPercentage(category.fail, category.tests) }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {categoryScores.filter((c) => c.tests > 0).length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <div className="text-lg font-medium mb-2">No hay resultados por categoría</div>
            <div className="text-sm">
              Ejecuta algunos tests para ver el desglose por categorías.
            </div>
          </div>
        )}
      </div>

      {/* Health recommendations */}
      {isComplete && healthScore < 100 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">
            💡 Recomendaciones para mejorar la salud del ecosistema
          </h4>
          <div className="text-sm text-blue-800 space-y-1">
            {summary.fail > 0 && (
              <div>• Revisa y corrige los {summary.fail} tests que fallaron</div>
            )}
            {summary.warn > 0 && <div>• Atiende las {summary.warn} advertencias detectadas</div>}
            {!isComplete && <div>• Ejecuta todos los tests para una evaluación completa</div>}
            <div>• Mantén la documentación sincronizada con el código</div>
            <div>• Revisa periódicamente la integridad del ecosistema</div>
          </div>
        </div>
      )}
    </div>
  );
}
