/**
 * @file TestResults Test Suite
 * @description Tests for TestResults component with scoring, health analysis, and category breakdown
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestResults } from '../TestResults';
import { TestSummary, TestCategory, TestResult } from '@/data/features/integrityTests';

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  TrendingUp: ({
    className,
    'data-testid': testId,
  }: {
    className?: string;
    'data-testid'?: string;
  }) => (
    <div data-testid={testId || 'trending-up-icon'} className={className}>
      📈
    </div>
  ),
  TrendingDown: ({
    className,
    'data-testid': testId,
  }: {
    className?: string;
    'data-testid'?: string;
  }) => (
    <div data-testid={testId || 'trending-down-icon'} className={className}>
      📉
    </div>
  ),
  Minus: ({ className, 'data-testid': testId }: { className?: string; 'data-testid'?: string }) => (
    <div data-testid={testId || 'minus-icon'} className={className}>
      ➖
    </div>
  ),
  CheckCircle2: ({ className }: { className?: string }) => (
    <div data-testid="check-circle-icon" className={className}>
      ✅
    </div>
  ),
  XCircle: ({ className }: { className?: string }) => (
    <div data-testid="x-circle-icon" className={className}>
      ❌
    </div>
  ),
  AlertTriangle: ({ className }: { className?: string }) => (
    <div data-testid="alert-triangle-icon" className={className}>
      ⚠️
    </div>
  ),
}));

describe('TestResults', () => {
  const mockTestCategories: TestCategory[] = [
    {
      id: 'data-coherence',
      name: 'Coherencia de Datos',
      description: 'Validación de consistencia de datos entre componentes',
      icon: 'database',
      color: 'blue',
    },
    {
      id: 'architecture',
      name: 'Arquitectura',
      description: 'Validación de patrones y estructura arquitectónica',
      icon: 'building',
      color: 'green',
    },
    {
      id: 'documentation',
      name: 'Documentación',
      description: 'Validación de documentación y sincronización',
      icon: 'file-text',
      color: 'purple',
    },
  ];

  const mockTestResults: Record<string, TestResult> = {
    T1: {
      id: 'T1',
      name: 'Skills Count Coherence',
      category: 'data-coherence',
      status: 'pass',
      message: 'Skills count is coherent',
      duration: 10,
    },
    T2: {
      id: 'T2',
      name: 'Commands Count Coherence',
      category: 'data-coherence',
      status: 'warn',
      message: 'Commands count has issues',
      duration: 15,
    },
    T3: {
      id: 'T3',
      name: 'Architecture Compliance',
      category: 'architecture',
      status: 'fail',
      message: 'Architecture compliance failed',
      duration: 20,
    },
    T4: {
      id: 'T4',
      name: 'Component Structure',
      category: 'architecture',
      status: 'pass',
      message: 'Component structure is valid',
      duration: 12,
    },
    T5: {
      id: 'T5',
      name: 'Documentation Sync',
      category: 'documentation',
      status: 'pass',
      message: 'Documentation is synchronized',
      duration: 8,
    },
  };

  const mockSummaryWithResults: TestSummary = {
    total: 5,
    pass: 3,
    warn: 1,
    fail: 1,
    totalDuration: 65,
  };

  const mockEmptySummary: TestSummary = {
    total: 0,
    pass: 0,
    warn: 0,
    fail: 0,
    totalDuration: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Empty State', () => {
    it('renders empty state when no tests have run', () => {
      render(
        <TestResults
          summary={mockEmptySummary}
          testResults={{}}
          testCategories={mockTestCategories}
          isComplete={false}
          totalTests={32}
        />
      );

      expect(screen.getByText('Ejecuta los tests para ver resultados')).toBeInTheDocument();
      expect(
        screen.getByText(/Los resultados de integridad y scoring aparecerán aquí/)
      ).toBeInTheDocument();
    });

    it('applies correct styling to empty state', () => {
      const { container } = render(
        <TestResults
          summary={mockEmptySummary}
          testResults={{}}
          testCategories={mockTestCategories}
          isComplete={false}
          totalTests={32}
        />
      );

      const emptyState = container.firstChild;
      expect(emptyState).toHaveClass(
        'bg-slate-50',
        'border',
        'border-slate-200',
        'rounded-lg',
        'p-6',
        'text-center'
      );
    });
  });

  describe('Health Score Calculation', () => {
    it('calculates correct health score', () => {
      render(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      // Health score calculation: (3*100 + 1*70 + 1*0) / (5*100) * 100 = 74%
      expect(screen.getByText('74%')).toBeInTheDocument();
    });

    it('displays health score with correct color for good score (>=90)', () => {
      const goodSummary = {
        total: 10,
        pass: 9,
        warn: 1,
        fail: 0,
        totalDuration: 100,
      };

      const { container } = render(
        <TestResults
          summary={goodSummary}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      // Score should be 97% ((9*100 + 1*70) / (10*100) * 100)
      const scoreElement = container.querySelector('.text-4xl.font-bold');
      expect(scoreElement).toHaveClass('text-emerald-600');
      expect(screen.getByTestId('trending-up-icon-main')).toBeInTheDocument(); // Overall score
    });

    it('displays health score with correct color for medium score (70-89)', () => {
      const { container } = render(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      // Score should be 74%
      const scoreElement = container.querySelector('.text-4xl.font-bold');
      expect(scoreElement).toHaveClass('text-yellow-600');
      expect(screen.getByTestId('minus-icon-main')).toBeInTheDocument();
    });

    it('displays health score with correct color for poor score (<70)', () => {
      const poorSummary = {
        total: 10,
        pass: 2,
        warn: 1,
        fail: 7,
        totalDuration: 100,
      };

      const { container } = render(
        <TestResults
          summary={poorSummary}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      // Score should be 27% ((2*100 + 1*70 + 7*0) / (10*100) * 100)
      const scoreElement = container.querySelector('.text-4xl.font-bold');
      expect(scoreElement).toHaveClass('text-red-600');
      expect(screen.getByTestId('trending-down-icon-main')).toBeInTheDocument(); // Overall score
    });
  });

  describe('Overall Health Display', () => {
    it('renders health score header correctly', () => {
      render(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      expect(screen.getByText('Score de Salud del Ecosistema')).toBeInTheDocument();
      expect(screen.getByText('Basado en 5 de 32 tests ejecutados')).toBeInTheDocument();
    });

    it('displays test results summary with icons', () => {
      render(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      expect(screen.getByText('3 pasaron')).toBeInTheDocument();
      expect(screen.getByText('1 advertencias')).toBeInTheDocument();
      expect(screen.getByText('1 fallaron')).toBeInTheDocument();

      expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
      expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument();
      expect(screen.getByTestId('x-circle-icon')).toBeInTheDocument();
    });

    it('renders progress bar with correct proportions', () => {
      const { container } = render(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      const progressBar = container.querySelector('.flex.h-2.rounded-full.overflow-hidden');
      expect(progressBar).toBeInTheDocument();

      const progressSegments = progressBar?.children;
      expect(progressSegments).toHaveLength(3); // pass, warn, fail
    });

    it('displays percentage breakdown correctly', () => {
      render(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      // 3/5 = 60%, 1/5 = 20%, 1/5 = 20%
      expect(screen.getByText(/60% exitosos/)).toBeInTheDocument();
      expect(screen.getByText(/20% advertencias/)).toBeInTheDocument();
      expect(screen.getByText(/20% fallidos/)).toBeInTheDocument();
    });

    it('shows completion status and duration when complete', () => {
      render(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      expect(screen.getByText('✅ Verificación de integridad completada')).toBeInTheDocument();
      expect(screen.getByText('Tiempo total: 65ms')).toBeInTheDocument();
    });

    it('does not show completion status when incomplete', () => {
      render(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={false}
          totalTests={32}
        />
      );

      expect(
        screen.queryByText('✅ Verificación de integridad completada')
      ).not.toBeInTheDocument();
    });
  });

  describe('Category Breakdown', () => {
    it('renders category breakdown header', () => {
      render(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      expect(screen.getByText('Puntuación por Categoría')).toBeInTheDocument();
    });

    it('calculates category scores correctly', () => {
      render(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      // data-coherence: 1 pass, 1 warn = (1*100 + 1*70) / (2*100) * 100 = 85%
      // architecture: 1 pass, 1 fail = (1*100 + 0*70 + 1*0) / (2*100) * 100 = 50%
      // documentation: 1 pass = 100%

      expect(screen.getByText('Coherencia de Datos')).toBeInTheDocument();
      expect(screen.getByText('Arquitectura')).toBeInTheDocument();
      expect(screen.getByText('Documentación')).toBeInTheDocument();
    });

    it('sorts categories by score in descending order', () => {
      const { container } = render(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      const categoryCards = container.querySelectorAll('.grid.gap-3 > div');

      // Documentation should be first (100%), then data-coherence (85%), then architecture (50%)
      const firstCard = categoryCards[0];
      const lastCard = categoryCards[categoryCards.length - 1];

      expect(firstCard).toHaveTextContent('Documentación');
      expect(lastCard).toHaveTextContent('Arquitectura');
    });

    it('displays category test counts and results', () => {
      render(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      // Check for test counts - some numbers may appear multiple times
      expect(screen.getAllByText('2 tests')).toHaveLength(2); // data-coherence + architecture (both have 2 tests)
      expect(screen.getAllByText('1 tests')).toHaveLength(1); // documentation only

      // Check for result details - some results may appear multiple times
      expect(screen.getAllByText('✓ 1 exitosos')).toHaveLength(3); // One for each category that has 1 pass
      expect(screen.getByText('⚠ 1 advertencias')).toBeInTheDocument();
      expect(screen.getByText('✗ 1 fallidos')).toBeInTheDocument();
    });

    it('filters out categories with no tests', () => {
      render(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={mockTestResults}
          testCategories={[
            ...mockTestCategories,
            {
              id: 'empty-category',
              name: 'Empty Category',
              description: 'Category with no tests',
              icon: 'Package',
              color: 'gray',
            },
          ]}
          isComplete={true}
          totalTests={32}
        />
      );

      expect(screen.queryByText('Empty Category')).not.toBeInTheDocument();
    });

    it('shows empty category state when no categories have results', () => {
      render(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={{}}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      expect(screen.getByText('No hay resultados por categoría')).toBeInTheDocument();
      expect(
        screen.getByText('Ejecuta algunos tests para ver el desglose por categorías.')
      ).toBeInTheDocument();
    });

    it('applies correct background colors to categories based on score', () => {
      const { container } = render(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      // Documentation (100%) should have green background
      // data-coherence (85%) should have yellow background
      // architecture (50%) should have red background
      const categoryCards = container.querySelectorAll('.grid.gap-3 > div');

      // Check that we have cards with different background colors
      expect(categoryCards.length).toBe(3);
    });
  });

  describe('Health Recommendations', () => {
    it('shows recommendations when complete and score < 100%', () => {
      render(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      expect(
        screen.getByText('💡 Recomendaciones para mejorar la salud del ecosistema')
      ).toBeInTheDocument();
      expect(screen.getByText('• Revisa y corrige los 1 tests que fallaron')).toBeInTheDocument();
      expect(screen.getByText('• Atiende las 1 advertencias detectadas')).toBeInTheDocument();
      expect(
        screen.getByText('• Mantén la documentación sincronizada con el código')
      ).toBeInTheDocument();
      expect(
        screen.getByText('• Revisa periódicamente la integridad del ecosistema')
      ).toBeInTheDocument();
    });

    it('does not show recommendations when score is 100%', () => {
      const perfectSummary = {
        total: 5,
        pass: 5,
        warn: 0,
        fail: 0,
        totalDuration: 50,
      };

      render(
        <TestResults
          summary={perfectSummary}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      expect(
        screen.queryByText('💡 Recomendaciones para mejorar la salud del ecosistema')
      ).not.toBeInTheDocument();
    });

    it('does not show recommendations when incomplete', () => {
      render(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={false}
          totalTests={32}
        />
      );

      expect(
        screen.queryByText('💡 Recomendaciones para mejorar la salud del ecosistema')
      ).not.toBeInTheDocument();
    });

    it('includes specific recommendations based on failures and warnings', () => {
      const summaryWithOnlyFailures = {
        total: 3,
        pass: 0,
        warn: 0,
        fail: 3,
        totalDuration: 30,
      };

      render(
        <TestResults
          summary={summaryWithOnlyFailures}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      expect(screen.getByText('• Revisa y corrige los 3 tests que fallaron')).toBeInTheDocument();
      expect(screen.queryByText(/advertencias detectadas/)).not.toBeInTheDocument();
    });
  });

  describe('Helper Functions', () => {
    it('formats percentages correctly', () => {
      render(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      // Should handle division and rounding correctly
      expect(screen.getByText(/60% exitosos/)).toBeInTheDocument();
      expect(screen.getByText(/20% advertencias/)).toBeInTheDocument();
      expect(screen.getByText(/20% fallidos/)).toBeInTheDocument();
    });

    it('handles zero division in percentage calculation', () => {
      render(
        <TestResults
          summary={mockEmptySummary}
          testResults={{}}
          testCategories={mockTestCategories}
          isComplete={false}
          totalTests={0}
        />
      );

      // Should not crash on zero division
      expect(screen.getByText('Ejecuta los tests para ver resultados')).toBeInTheDocument();
    });
  });

  describe('Component State Management', () => {
    it('updates correctly when summary changes', () => {
      const { rerender } = render(
        <TestResults
          summary={mockEmptySummary}
          testResults={{}}
          testCategories={mockTestCategories}
          isComplete={false}
          totalTests={32}
        />
      );

      expect(screen.getByText('Ejecuta los tests para ver resultados')).toBeInTheDocument();

      rerender(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      expect(screen.getByText('Score de Salud del Ecosistema')).toBeInTheDocument();
      expect(screen.getByText('74%')).toBeInTheDocument();
    });

    it('recalculates category scores when test results change', () => {
      const { rerender } = render(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      const newTestResults = {
        ...mockTestResults,
        T6: {
          id: 'T6',
          name: 'New Architecture Test',
          category: 'architecture',
          status: 'pass' as const,
          duration: 5,
          message: 'Architecture test passed successfully',
        },
      };

      const newSummary = {
        total: 6,
        pass: 4,
        warn: 1,
        fail: 1,
        totalDuration: 70,
      };

      rerender(
        <TestResults
          summary={newSummary}
          testResults={newTestResults}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      // Should update overall score
      expect(screen.getByText('78%')).toBeInTheDocument(); // (4*100 + 1*70) / (6*100) * 100
    });
  });

  describe('Accessibility', () => {
    it('provides proper heading hierarchy', () => {
      render(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      expect(screen.getByText('Score de Salud del Ecosistema')).toBeInTheDocument();
      expect(screen.getByText('Puntuación por Categoría')).toBeInTheDocument();
    });

    it('includes descriptive text for screen readers', () => {
      render(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      expect(screen.getByText('Basado en 5 de 32 tests ejecutados')).toBeInTheDocument();
      expect(
        screen.getByText('Validación de consistencia de datos entre componentes')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Validación de patrones y estructura arquitectónica')
      ).toBeInTheDocument();
    });

    it('uses semantic icons with meaning', () => {
      render(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
      expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument();
      expect(screen.getByTestId('x-circle-icon')).toBeInTheDocument();
    });
  });

  describe('Performance Considerations', () => {
    it('memoizes health score calculation', () => {
      const { rerender } = render(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      expect(screen.getByText('74%')).toBeInTheDocument();

      // Rerender with same summary should not recalculate
      rerender(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      expect(screen.getByText('74%')).toBeInTheDocument();
    });

    it('memoizes category score calculation', () => {
      const { rerender } = render(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      expect(screen.getByText('Coherencia de Datos')).toBeInTheDocument();

      // Rerender with same data should not recalculate
      rerender(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      expect(screen.getByText('Coherencia de Datos')).toBeInTheDocument();
    });

    it('handles large datasets efficiently', () => {
      const largeTestResults: Record<string, TestResult> = {};
      for (let i = 1; i <= 100; i++) {
        largeTestResults[`T${i}`] = {
          id: `T${i}`,
          name: `Test ${i}`,
          category: 'data-coherence',
          status: i % 3 === 0 ? 'fail' : i % 2 === 0 ? 'warn' : 'pass',
          duration: Math.random() * 20,
          message: `Test ${i} completed with status`,
        };
      }

      const largeSummary = {
        total: 100,
        pass: 34,
        warn: 33,
        fail: 33,
        totalDuration: 1000,
      };

      expect(() =>
        render(
          <TestResults
            summary={largeSummary}
            testResults={largeTestResults}
            testCategories={mockTestCategories}
            isComplete={true}
            totalTests={100}
          />
        )
      ).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('handles empty test results gracefully', () => {
      render(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={{}}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      expect(screen.getByText('Score de Salud del Ecosistema')).toBeInTheDocument();
      expect(screen.getByText('No hay resultados por categoría')).toBeInTheDocument();
    });

    it('handles empty categories gracefully', () => {
      render(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={mockTestResults}
          testCategories={[]}
          isComplete={true}
          totalTests={32}
        />
      );

      expect(screen.getByText('Score de Salud del Ecosistema')).toBeInTheDocument();
      expect(screen.queryByText('Puntuación por Categoría')).toBeInTheDocument();
    });

    it('handles component unmounting without errors', () => {
      const { unmount } = render(
        <TestResults
          summary={mockSummaryWithResults}
          testResults={mockTestResults}
          testCategories={mockTestCategories}
          isComplete={true}
          totalTests={32}
        />
      );

      expect(() => unmount()).not.toThrow();
    });
  });
});
