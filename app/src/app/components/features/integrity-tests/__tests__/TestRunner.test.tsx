import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TestRunner } from '../TestRunner';
import { TestSummary } from '@/data/features/integrityTests';

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  Play: ({ className, 'data-testid': testId }: any) => (
    <div className={className} data-testid={testId || 'play-icon'}>
      Play
    </div>
  ),
  RefreshCw: ({ className, 'data-testid': testId }: any) => (
    <div className={className} data-testid={testId || 'refresh-cw-icon'}>
      RefreshCw
    </div>
  ),
  Trash2: ({ className, 'data-testid': testId }: any) => (
    <div className={className} data-testid={testId || 'trash2-icon'}>
      Trash2
    </div>
  ),
}));

// Mock data
const createMockSummary = (overrides: Partial<TestSummary> = {}): TestSummary => ({
  total: 0,
  pass: 0,
  fail: 0,
  warn: 0,
  info: 0,
  totalDuration: 0,
  ...overrides,
});

const defaultProps = {
  isRunning: false,
  summary: createMockSummary(),
  executionStartTime: null,
  onRunAllTests: vi.fn(),
  onClearResults: vi.fn(),
  totalTests: 32,
};

describe('TestRunner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Basic rendering', () => {
    it('should render main execution button', () => {
      render(<TestRunner {...defaultProps} />);

      expect(screen.getByRole('button', { name: /Ejecutar 32 tests/ })).toBeInTheDocument();
    });

    it('should render play icon when not running', () => {
      render(<TestRunner {...defaultProps} />);

      expect(screen.getByTestId('play-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('refresh-cw-icon')).not.toBeInTheDocument();
    });

    it('should call onRunAllTests when execution button clicked', () => {
      const mockRunTests = vi.fn();
      render(<TestRunner {...defaultProps} onRunAllTests={mockRunTests} />);

      const executeButton = screen.getByRole('button', { name: /Ejecutar 32 tests/ });
      fireEvent.click(executeButton);

      expect(mockRunTests).toHaveBeenCalledTimes(1);
    });
  });

  describe('Running state', () => {
    it('should show refresh icon when running', () => {
      render(<TestRunner {...defaultProps} isRunning={true} />);

      expect(screen.getByTestId('refresh-cw-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('play-icon')).not.toBeInTheDocument();
    });

    it('should disable button when running', () => {
      render(<TestRunner {...defaultProps} isRunning={true} />);

      const executeButton = screen.getByRole('button');
      expect(executeButton).toBeDisabled();
    });

    it('should show running status text', () => {
      const runningSummary = createMockSummary({ total: 5 });
      render(<TestRunner {...defaultProps} isRunning={true} summary={runningSummary} />);

      expect(screen.getByText('Ejecutando tests... (5/32)')).toBeInTheDocument();
    });

    it('should apply spinning animation to refresh icon', () => {
      render(<TestRunner {...defaultProps} isRunning={true} />);

      const refreshIcon = screen.getByTestId('refresh-cw-icon');
      expect(refreshIcon).toHaveClass('animate-spin');
    });

    it('should show blue status color when running', () => {
      render(<TestRunner {...defaultProps} isRunning={true} />);

      const executeButton = screen.getByRole('button');
      expect(executeButton).toHaveClass('bg-blue-500', 'hover:bg-blue-600');
    });
  });

  describe('Progress tracking', () => {
    it('should show progress bar when running', () => {
      const runningSummary = createMockSummary({ total: 10 });
      render(
        <TestRunner {...defaultProps} isRunning={true} summary={runningSummary} totalTests={32} />
      );

      const progressBar = screen.getByRole('progressbar', { hidden: true });
      expect(progressBar).toBeInTheDocument();
    });

    it('should calculate progress percentage correctly', () => {
      const runningSummary = createMockSummary({ total: 16 });
      render(
        <TestRunner {...defaultProps} isRunning={true} summary={runningSummary} totalTests={32} />
      );

      const progressBar = screen.getByRole('progressbar', { hidden: true });
      expect(progressBar).toHaveStyle('width: 50%');
    });

    it('should not show progress bar when not running', () => {
      render(<TestRunner {...defaultProps} isRunning={false} />);

      expect(screen.queryByRole('progressbar', { hidden: true })).not.toBeInTheDocument();
    });

    it('should show real-time execution status when running', () => {
      render(<TestRunner {...defaultProps} isRunning={true} />);

      expect(screen.getByText('Ejecutando verificaciones de integridad...')).toBeInTheDocument();
      expect(screen.getByText(/Validando paths, contadores, relaciones/)).toBeInTheDocument();
    });
  });

  describe('Summary statistics', () => {
    it('should display pass count', () => {
      const summaryWithPass = createMockSummary({ total: 10, pass: 8 });
      render(<TestRunner {...defaultProps} summary={summaryWithPass} />);

      expect(screen.getByText('Pasaron: 8')).toBeInTheDocument();
    });

    it('should display warn count when present', () => {
      const summaryWithWarn = createMockSummary({ total: 10, pass: 7, warn: 2 });
      render(<TestRunner {...defaultProps} summary={summaryWithWarn} />);

      expect(screen.getByText('Advertencias: 2')).toBeInTheDocument();
    });

    it('should display fail count when present', () => {
      const summaryWithFail = createMockSummary({ total: 10, pass: 6, fail: 3 });
      render(<TestRunner {...defaultProps} summary={summaryWithFail} />);

      expect(screen.getByText('Fallaron: 3')).toBeInTheDocument();
    });

    it('should always display total count', () => {
      const summaryWithTotal = createMockSummary({ total: 15 });
      render(<TestRunner {...defaultProps} summary={summaryWithTotal} />);

      expect(screen.getByText('Total: 15')).toBeInTheDocument();
    });

    it('should not show warn count when zero', () => {
      const summaryWithoutWarn = createMockSummary({ total: 10, pass: 8, warn: 0 });
      render(<TestRunner {...defaultProps} summary={summaryWithoutWarn} />);

      expect(screen.queryByText(/Advertencias:/)).not.toBeInTheDocument();
    });

    it('should not show fail count when zero', () => {
      const summaryWithoutFail = createMockSummary({ total: 10, pass: 8, fail: 0 });
      render(<TestRunner {...defaultProps} summary={summaryWithoutFail} />);

      expect(screen.queryByText(/Fallaron:/)).not.toBeInTheDocument();
    });

    it('should show execution duration when available', () => {
      const summaryWithDuration = createMockSummary({ total: 10, totalDuration: 2500 });
      render(<TestRunner {...defaultProps} summary={summaryWithDuration} />);

      expect(screen.getByText('Tiempo: 2.5s')).toBeInTheDocument();
    });

    it('should not show duration when zero', () => {
      const summaryWithoutDuration = createMockSummary({ total: 10, totalDuration: 0 });
      render(<TestRunner {...defaultProps} summary={summaryWithoutDuration} />);

      expect(screen.queryByText(/Tiempo:/)).not.toBeInTheDocument();
    });
  });

  describe('Status colors', () => {
    it('should show red color when tests failed', () => {
      const failedSummary = createMockSummary({ total: 10, fail: 3 });
      render(<TestRunner {...defaultProps} summary={failedSummary} />);

      const executeButton = screen.getByRole('button', { name: /Ejecutar 32 tests/ });
      expect(executeButton).toHaveClass('bg-red-500', 'hover:bg-red-600');
    });

    it('should show yellow color when tests have warnings', () => {
      const warningSummary = createMockSummary({ total: 10, warn: 2, fail: 0 });
      render(<TestRunner {...defaultProps} summary={warningSummary} />);

      const executeButton = screen.getByRole('button', { name: /Ejecutar 32 tests/ });
      expect(executeButton).toHaveClass('bg-yellow-500', 'hover:bg-yellow-600');
    });

    it('should show green color when all tests passed', () => {
      const passedSummary = createMockSummary({ total: 10, pass: 10 });
      render(<TestRunner {...defaultProps} summary={passedSummary} />);

      const executeButton = screen.getByRole('button', { name: /Ejecutar 32 tests/ });
      expect(executeButton).toHaveClass('bg-emerald-500', 'hover:bg-emerald-600');
    });

    it('should show indigo color when no results', () => {
      const emptySummary = createMockSummary({ total: 0 });
      render(<TestRunner {...defaultProps} summary={emptySummary} />);

      const executeButton = screen.getByRole('button');
      expect(executeButton).toHaveClass('bg-indigo-600', 'hover:bg-indigo-700');
    });

    it('should prioritize fail over warn in colors', () => {
      const mixedSummary = createMockSummary({ total: 10, pass: 5, warn: 3, fail: 2 });
      render(<TestRunner {...defaultProps} summary={mixedSummary} />);

      const executeButton = screen.getByRole('button', { name: /Ejecutar 32 tests/ });
      expect(executeButton).toHaveClass('bg-red-500', 'hover:bg-red-600');
    });
  });

  describe('Clear results functionality', () => {
    it('should show clear button when has results and not running', () => {
      const resultsAvailable = createMockSummary({ total: 10, pass: 8 });
      render(<TestRunner {...defaultProps} summary={resultsAvailable} isRunning={false} />);

      expect(screen.getByRole('button', { name: /Limpiar resultados/ })).toBeInTheDocument();
    });

    it('should not show clear button when running', () => {
      const resultsAvailable = createMockSummary({ total: 10, pass: 8 });
      render(<TestRunner {...defaultProps} summary={resultsAvailable} isRunning={true} />);

      expect(screen.queryByRole('button', { name: /Limpiar resultados/ })).not.toBeInTheDocument();
    });

    it('should not show clear button when no results', () => {
      const noResults = createMockSummary({ total: 0 });
      render(<TestRunner {...defaultProps} summary={noResults} isRunning={false} />);

      expect(screen.queryByRole('button', { name: /Limpiar resultados/ })).not.toBeInTheDocument();
    });

    it('should call onClearResults when clear button clicked', () => {
      const mockClearResults = vi.fn();
      const resultsAvailable = createMockSummary({ total: 10, pass: 8 });
      render(
        <TestRunner
          {...defaultProps}
          summary={resultsAvailable}
          onClearResults={mockClearResults}
        />
      );

      const clearButton = screen.getByRole('button', { name: /Limpiar resultados/ });
      fireEvent.click(clearButton);

      expect(mockClearResults).toHaveBeenCalledTimes(1);
    });

    it('should render trash icon in clear button', () => {
      const resultsAvailable = createMockSummary({ total: 10, pass: 8 });
      render(<TestRunner {...defaultProps} summary={resultsAvailable} />);

      expect(screen.getByTestId('trash2-icon')).toBeInTheDocument();
    });
  });

  describe('Completion status', () => {
    it('should show success completion when all tests pass', () => {
      const successSummary = createMockSummary({ total: 32, pass: 32, totalDuration: 1500 });
      render(<TestRunner {...defaultProps} summary={successSummary} totalTests={32} />);

      expect(screen.getByText('✅ Todos los tests pasaron correctamente')).toBeInTheDocument();
      expect(screen.getByText('Verificación de integridad completada en 1.5s')).toBeInTheDocument();
    });

    it('should show warning completion when tests have warnings', () => {
      const warningSummary = createMockSummary({
        total: 32,
        pass: 29,
        warn: 3,
        info: 0,
        totalDuration: 2000,
      });
      render(<TestRunner {...defaultProps} summary={warningSummary} totalTests={32} />);

      expect(screen.getByText('⚠️ 3 tests con advertencias')).toBeInTheDocument();
    });

    it('should show failure completion when tests fail', () => {
      const failureSummary = createMockSummary({
        total: 32,
        pass: 25,
        fail: 7,
        totalDuration: 1800,
      });
      render(<TestRunner {...defaultProps} summary={failureSummary} totalTests={32} />);

      expect(screen.getByText('❌ 7 tests fallaron')).toBeInTheDocument();
    });

    it('should not show completion status when tests are incomplete', () => {
      const incompleteSummary = createMockSummary({ total: 20, pass: 18 }); // Not all 32 tests
      render(<TestRunner {...defaultProps} summary={incompleteSummary} totalTests={32} />);

      expect(screen.queryByText(/Verificación de integridad completada/)).not.toBeInTheDocument();
    });

    it('should not show completion status when running', () => {
      const completeSummary = createMockSummary({ total: 32, pass: 32 });
      render(
        <TestRunner {...defaultProps} summary={completeSummary} totalTests={32} isRunning={true} />
      );

      expect(screen.queryByText(/Todos los tests pasaron/)).not.toBeInTheDocument();
    });

    it('should apply correct styling for success completion', () => {
      const successSummary = createMockSummary({ total: 32, pass: 32 });
      render(<TestRunner {...defaultProps} summary={successSummary} totalTests={32} />);

      const completionStatus = screen.getByText('✅ Todos los tests pasaron correctamente');
      expect(completionStatus).toHaveClass('text-emerald-800');
    });

    it('should apply correct styling for failure completion', () => {
      const failureSummary = createMockSummary({ total: 32, fail: 5, pass: 27 });
      render(<TestRunner {...defaultProps} summary={failureSummary} totalTests={32} />);

      const completionStatus = screen.getByText('❌ 5 tests fallaron');
      expect(completionStatus).toHaveClass('text-red-800');
    });
  });

  describe('Time formatting', () => {
    it('should format milliseconds correctly', () => {
      const summary = createMockSummary({ total: 10, totalDuration: 750 });
      render(<TestRunner {...defaultProps} summary={summary} />);

      expect(screen.getByText('Tiempo: 750ms')).toBeInTheDocument();
    });

    it('should format seconds correctly', () => {
      const summary = createMockSummary({ total: 10, totalDuration: 2350 });
      render(<TestRunner {...defaultProps} summary={summary} />);

      expect(screen.getByText('Tiempo: 2.4s')).toBeInTheDocument();
    });

    it('should format exactly 1 second correctly', () => {
      const summary = createMockSummary({ total: 10, totalDuration: 1000 });
      render(<TestRunner {...defaultProps} summary={summary} />);

      expect(screen.getByText('Tiempo: 1.0s')).toBeInTheDocument();
    });

    it('should format sub-second durations correctly', () => {
      const summary = createMockSummary({ total: 10, totalDuration: 999 });
      render(<TestRunner {...defaultProps} summary={summary} />);

      expect(screen.getByText('Tiempo: 999ms')).toBeInTheDocument();
    });
  });

  describe('Real-time execution tracking', () => {
    it('should show execution time when running', () => {
      const startTime = Date.now() - 5000; // Started 5 seconds ago
      vi.setSystemTime(Date.now()); // Mock current time
      render(<TestRunner {...defaultProps} isRunning={true} executionStartTime={startTime} />);

      expect(screen.getByText('5.0s')).toBeInTheDocument();
    });

    it('should not show execution time when start time is null', () => {
      render(<TestRunner {...defaultProps} isRunning={true} executionStartTime={null} />);

      expect(screen.queryByText(/\ds$/)).not.toBeInTheDocument();
    });

    it('should format real-time execution time correctly', () => {
      const startTime = Date.now() - 500; // Started 500ms ago
      vi.setSystemTime(Date.now());
      render(<TestRunner {...defaultProps} isRunning={true} executionStartTime={startTime} />);

      expect(screen.getByText('500ms')).toBeInTheDocument();
    });
  });

  describe('Conditional rendering', () => {
    it('should not show summary stats when no results', () => {
      const noResults = createMockSummary({ total: 0 });
      render(<TestRunner {...defaultProps} summary={noResults} />);

      expect(screen.queryByText(/Pasaron:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Total:/)).not.toBeInTheDocument();
    });

    it('should show summary stats when results available', () => {
      const withResults = createMockSummary({ total: 10, pass: 8 });
      render(<TestRunner {...defaultProps} summary={withResults} />);

      expect(screen.getByText('Pasaron: 8')).toBeInTheDocument();
      expect(screen.getByText('Total: 10')).toBeInTheDocument();
    });

    it('should show summary stats when running with partial results', () => {
      const runningWithPartial = createMockSummary({ total: 5, pass: 4 });
      render(<TestRunner {...defaultProps} summary={runningWithPartial} isRunning={true} />);

      expect(screen.getByText('Pasaron: 4')).toBeInTheDocument();
      expect(screen.getByText('Total: 5')).toBeInTheDocument();
    });
  });

  describe('Status text variations', () => {
    it('should show execute text when no results', () => {
      const noResults = createMockSummary({ total: 0 });
      render(<TestRunner {...defaultProps} summary={noResults} />);

      expect(screen.getByText('Ejecutar 32 tests')).toBeInTheDocument();
    });

    it('should show execute text when results incomplete', () => {
      const partialResults = createMockSummary({ total: 15 });
      render(<TestRunner {...defaultProps} summary={partialResults} totalTests={32} />);

      expect(screen.getByText('Ejecutar 32 tests')).toBeInTheDocument();
    });

    it('should show execute text when all tests completed', () => {
      const completeResults = createMockSummary({ total: 32 });
      render(<TestRunner {...defaultProps} summary={completeResults} totalTests={32} />);

      expect(screen.getByText('Ejecutar 32 tests')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles', () => {
      const withResults = createMockSummary({ total: 10, pass: 8 });
      render(<TestRunner {...defaultProps} summary={withResults} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should disable button appropriately', () => {
      render(<TestRunner {...defaultProps} isRunning={true} />);

      const executeButton = screen.getByRole('button');
      expect(executeButton).toHaveAttribute('disabled');
    });

    it('should have descriptive button text', () => {
      render(<TestRunner {...defaultProps} />);

      expect(screen.getByRole('button', { name: /Ejecutar 32 tests/ })).toBeInTheDocument();
    });

    it('should provide clear status indicators', () => {
      const mixedResults = createMockSummary({ total: 32, pass: 28, warn: 2, fail: 2 });
      render(<TestRunner {...defaultProps} summary={mixedResults} totalTests={32} />);

      expect(screen.getByText('❌ 2 tests fallaron')).toBeInTheDocument();
    });
  });

  describe('Visual indicators', () => {
    it('should show colored dots for pass status', () => {
      const withPass = createMockSummary({ total: 10, pass: 8 });
      render(<TestRunner {...defaultProps} summary={withPass} />);

      const passIndicator = screen.getByText('Pasaron: 8').previousElementSibling;
      expect(passIndicator).toHaveClass('bg-emerald-500');
    });

    it('should show colored dots for warn status', () => {
      const withWarn = createMockSummary({ total: 10, warn: 2 });
      render(<TestRunner {...defaultProps} summary={withWarn} />);

      const warnIndicator = screen.getByText('Advertencias: 2').previousElementSibling;
      expect(warnIndicator).toHaveClass('bg-yellow-500');
    });

    it('should show colored dots for fail status', () => {
      const withFail = createMockSummary({ total: 10, fail: 3 });
      render(<TestRunner {...defaultProps} summary={withFail} />);

      const failIndicator = screen.getByText('Fallaron: 3').previousElementSibling;
      expect(failIndicator).toHaveClass('bg-red-500');
    });
  });

  describe('Error handling', () => {
    it('should handle zero total tests gracefully', () => {
      expect(() => {
        render(<TestRunner {...defaultProps} totalTests={0} />);
      }).not.toThrow();
    });

    it('should handle missing callback functions', () => {
      expect(() => {
        render(
          <TestRunner
            {...defaultProps}
            onRunAllTests={undefined as any}
            onClearResults={undefined as any}
          />
        );
      }).not.toThrow();
    });

    it('should handle negative values in summary', () => {
      const invalidSummary = createMockSummary({ total: -1, pass: -5, fail: -2 });

      expect(() => {
        render(<TestRunner {...defaultProps} summary={invalidSummary} />);
      }).not.toThrow();
    });
  });
});
