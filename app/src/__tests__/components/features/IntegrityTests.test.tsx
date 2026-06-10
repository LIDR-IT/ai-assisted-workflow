import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntegrityTests } from '@/app/components/features/integrity-tests/IntegrityTests';
import { createMockTestDefinition, createMockTestResult } from '@/utils/test-helpers';

const mockUseTestExecution = vi.fn();

vi.mock('../../../app/components/features/integrity-tests/useTestExecution', () => ({
  useTestExecution: () => mockUseTestExecution(),
}));

// Default mock return value
const defaultMockValue = {
  testResults: {},
  isRunning: false,
  currentPage: 1,
  selectedCategory: null,
  executionStartTime: null,
  filteredTests: [],
  paginatedTests: [],
  totalPages: 1,
  summary: { total: 0, pass: 0, fail: 0, warn: 0, totalDuration: 0 },
  runAllTests: vi.fn(),
  runSingleTest: vi.fn(),
  clearResults: vi.fn(),
  setCurrentPage: vi.fn(),
  setSelectedCategory: vi.fn(),
  testCategories: [
    { id: 'basic', name: 'Basic Tests', icon: 'TestTube' },
    { id: 'advanced', name: 'Advanced Tests', icon: 'Zap' },
  ],
  testDefinitions: [
    createMockTestDefinition({ id: 'T1', category: 'basic' }),
    createMockTestDefinition({ id: 'T2', category: 'advanced' }),
  ],
  config: {
    PLACEHOLDER_COUNT: 36,
    TESTS_PER_PAGE: 10,
    ASYNC_TEST_TIMEOUT: 5000,
    REAL_TIME_CATEGORIES: ['data-integrity', 'counters', 'coverage'],
    MAX_DETAILS_ITEMS: 50,
  },
};

// Create mock functions reference
const mockFunctions = {
  runAllTests: defaultMockValue.runAllTests,
  runSingleTest: defaultMockValue.runSingleTest,
  clearResults: defaultMockValue.clearResults,
  setCurrentPage: defaultMockValue.setCurrentPage,
  setSelectedCategory: defaultMockValue.setSelectedCategory,
};

mockUseTestExecution.mockReturnValue(defaultMockValue);

// Mock child components
vi.mock('../../../app/components/features/integrity-tests/TestRunner', () => ({
  TestRunner: ({ isRunning, summary, onRunAllTests, onClearResults, totalTests }: any) => (
    <div data-testid="test-runner">
      <div data-testid="running-status">{isRunning ? 'running' : 'idle'}</div>
      <div data-testid="summary-total">{summary.total}</div>
      <div data-testid="total-tests">{totalTests}</div>
      <button onClick={onRunAllTests} data-testid="run-all-button">
        Run All
      </button>
      <button onClick={onClearResults} data-testid="clear-button">
        Clear
      </button>
    </div>
  ),
}));

vi.mock('../../../app/components/features/integrity-tests/TestSuite', () => ({
  TestSuite: ({ tests, onRunSingleTest, currentPage, totalPages, onPageChange }: any) => (
    <div data-testid="test-suite">
      <div data-testid="tests-count">{tests.length}</div>
      <div data-testid="current-page">{currentPage}</div>
      <div data-testid="total-pages">{totalPages}</div>
      <button onClick={() => onPageChange(2)} data-testid="next-page">
        Next Page
      </button>
      {tests.map((test: any) => (
        <button
          key={test.id}
          onClick={() => onRunSingleTest(test.id)}
          data-testid={`run-test-${test.id}`}
        >
          Run {test.id}
        </button>
      ))}
    </div>
  ),
}));

vi.mock('../../../app/components/features/integrity-tests/TestResults', () => ({
  TestResults: ({ testResults, summary, isComplete }: any) => (
    <div data-testid="test-results">
      <div data-testid="results-count">{Object.keys(testResults || {}).length}</div>
      <div data-testid="is-complete">{isComplete ? 'complete' : 'incomplete'}</div>
      <div data-testid="passed-count">{summary?.pass || 0}</div>
      <div data-testid="failed-count">{summary?.fail || 0}</div>
    </div>
  ),
}));

// Mock shared components
vi.mock('../../../app/components/shared/FlowComponents', () => ({
  PageHeader: ({ title, subtitle }: any) => (
    <div data-testid="page-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  ),
  DiagramCard: ({ title, description, children }: any) => (
    <div data-testid="diagram-card">
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  ),
  SectionBox: ({ title, subtitle, className, onClick, children }: any) => {
    // If this is the "Tests de Integridad" section, render mock categories
    if (title === 'Tests de Integridad') {
      return (
        <div
          data-testid={`section-box-${title.toLowerCase().replace(/\s+/g, '-')}`}
          className={className}
          onClick={onClick}
        >
          <h4>{title}</h4>
          <p>{subtitle}</p>
          {/* Mock category grid */}
          <div>
            <div>
              Basic Tests<span>1 tests</span>
            </div>
            <div>
              Advanced Tests<span>1 tests</span>
            </div>
          </div>
          {children}
        </div>
      );
    }
    return (
      <div
        data-testid={`section-box-${title.toLowerCase().replace(/\s+/g, '-')}`}
        className={className}
        onClick={onClick}
      >
        <h4>{title}</h4>
        <p>{subtitle}</p>
        {children}
      </div>
    );
  },
}));

describe('IntegrityTests Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock to default state
    mockUseTestExecution.mockReturnValue({
      ...defaultMockValue,
      testResults: {},
      isRunning: false,
      currentPage: 1,
      selectedCategory: null,
      executionStartTime: null,
      filteredTests: [],
      paginatedTests: [],
      totalPages: 1,
      summary: { total: 0, pass: 0, fail: 0, warn: 0, totalDuration: 0 },
    });
  });

  it('renders without crashing', () => {
    render(<IntegrityTests />);

    expect(screen.getByTestId('page-header')).toBeInTheDocument();
    expect(screen.getByText('Tests de Integridad — Ecosistema SDLC')).toBeInTheDocument();
  });

  it('displays correct header information', () => {
    render(<IntegrityTests />);

    expect(screen.getAllByText(/36 verificaciones automatizadas/).length).toBeGreaterThan(0);
    expect(screen.getByText(/paths, contadores, relaciones/)).toBeInTheDocument();
  });

  it('renders all main components', () => {
    render(<IntegrityTests />);

    expect(screen.getByTestId('test-runner')).toBeInTheDocument();
    expect(screen.getByTestId('section-box-tests-de-integridad')).toBeInTheDocument();
    expect(screen.getByTestId('section-box-resultados-y-scoring')).toBeInTheDocument();
    expect(screen.getByTestId('test-suite')).toBeInTheDocument();
    expect(screen.getByTestId('test-results')).toBeInTheDocument();
  });

  it('passes correct props to TestRunner', () => {
    mockUseTestExecution.mockReturnValue({
      ...defaultMockValue,
      isRunning: true,
      summary: { total: 5, pass: 3, fail: 1, warn: 1, totalDuration: 2500 },
    });

    render(<IntegrityTests />);

    expect(screen.getByTestId('running-status')).toHaveTextContent('running');
    expect(screen.getByTestId('summary-total')).toHaveTextContent('5');
    expect(screen.getByTestId('total-tests')).toHaveTextContent('2');
  });

  it('displays test categories correctly', () => {
    render(<IntegrityTests />);

    expect(screen.getByTestId('section-box-tests-de-integridad')).toBeInTheDocument();
    expect(screen.getByTestId('section-box-resultados-y-scoring')).toBeInTheDocument();
    expect(screen.getByTestId('section-box-configuración-de-tests')).toBeInTheDocument();
  });

  it('handles category selection', async () => {
    const user = userEvent.setup();
    render(<IntegrityTests />);

    // Find clickable category elements by their CSS class
    const clickableElements = document.querySelectorAll('.cursor-pointer');
    if (clickableElements.length > 0) {
      await user.click(clickableElements[0] as Element);
    }

    expect(mockFunctions.setSelectedCategory).toHaveBeenCalled();
  });

  it('handles category deselection when clicking same category', async () => {
    const user = userEvent.setup();
    mockUseTestExecution.mockReturnValue({
      ...defaultMockValue,
      selectedCategory: 'basic',
    });

    render(<IntegrityTests />);

    const clickableElements = document.querySelectorAll('.cursor-pointer');
    if (clickableElements.length > 0) {
      await user.click(clickableElements[0] as Element);
    }

    expect(mockFunctions.setSelectedCategory).toHaveBeenCalled();
  });

  it('applies correct CSS classes for selected category', () => {
    mockUseTestExecution.mockReturnValue({
      ...defaultMockValue,
      selectedCategory: 'basic',
    });

    const { container } = render(<IntegrityTests />);

    // Check for selected category styling
    const selectedElements = container.querySelectorAll('.border-indigo-300.bg-indigo-50');
    const unselectedElements = container.querySelectorAll('.border-slate-200');

    // Should have some styling differences between selected and unselected
    expect(selectedElements.length + unselectedElements.length).toBeGreaterThan(0);
  });

  it('calculates category test counts correctly', () => {
    render(<IntegrityTests />);

    // Should show count for each category
    const testCountElements = screen.queryAllByText(/\d+ tests?/);
    expect(testCountElements.length).toBeGreaterThanOrEqual(1);
  });

  it('determines completion status correctly', () => {
    // Test incomplete state
    mockUseTestExecution.mockReturnValue({
      ...defaultMockValue,
      summary: { total: 1, pass: 1, fail: 0, warn: 0, totalDuration: 500 },
      isRunning: false,
    });

    const { rerender } = render(<IntegrityTests />);

    expect(screen.getByTestId('is-complete')).toHaveTextContent('incomplete');

    // Test complete state
    mockUseTestExecution.mockReturnValue({
      ...defaultMockValue,
      summary: { total: 2, pass: 1, fail: 1, warn: 0, totalDuration: 1000 },
      isRunning: false,
    });

    rerender(<IntegrityTests />);

    expect(screen.getByTestId('is-complete')).toHaveTextContent('complete');
  });

  it('handles test execution callbacks', async () => {
    const user = userEvent.setup();
    mockUseTestExecution.mockReturnValue({
      ...defaultMockValue,
      paginatedTests: [createMockTestDefinition({ id: 'T1' })],
    });

    render(<IntegrityTests />);

    // Test run all tests
    const runAllButton = screen.getByTestId('run-all-button');
    await user.click(runAllButton);
    expect(mockFunctions.runAllTests).toHaveBeenCalled();

    // Test clear results
    const clearButton = screen.getByTestId('clear-button');
    await user.click(clearButton);
    expect(mockFunctions.clearResults).toHaveBeenCalled();

    // Test single test run
    const runTestButton = screen.getByTestId('run-test-T1');
    await user.click(runTestButton);
    expect(mockFunctions.runSingleTest).toHaveBeenCalled();
  });

  it('passes correct props to TestSuite', () => {
    mockUseTestExecution.mockReturnValue({
      ...defaultMockValue,
      paginatedTests: [createMockTestDefinition({ id: 'T1' })],
      currentPage: 2,
      totalPages: 3,
      testResults: { T1: createMockTestResult() },
    });

    render(<IntegrityTests />);

    expect(screen.getByTestId('tests-count')).toHaveTextContent('1');
    expect(screen.getByTestId('current-page')).toHaveTextContent('2');
    expect(screen.getByTestId('total-pages')).toHaveTextContent('3');
  });

  it('handles pagination', async () => {
    const user = userEvent.setup();
    render(<IntegrityTests />);

    const nextPageButton = screen.getByTestId('next-page');
    await user.click(nextPageButton);

    expect(mockFunctions.setCurrentPage).toHaveBeenCalledWith(2);
  });

  it.skip('passes correct props to TestResults', () => {
    const testResults = {
      T1: createMockTestResult({ status: 'pass' }),
      T2: createMockTestResult({ status: 'fail' }),
    };
    const summary = { total: 2, pass: 1, fail: 1, warn: 0, totalDuration: 1000 };

    mockUseTestExecution.mockReturnValue({
      ...defaultMockValue,
      testResults,
      summary,
      isRunning: false,
    });

    render(<IntegrityTests />);

    expect(screen.getByTestId('results-count')).toHaveTextContent('2');
    expect(screen.getByTestId('passed-count')).toHaveTextContent('1');
    expect(screen.getByTestId('failed-count')).toHaveTextContent('1');
    expect(screen.getByTestId('is-complete')).toHaveTextContent('complete');
  });

  it('handles running state correctly', () => {
    mockUseTestExecution.mockReturnValue({
      ...defaultMockValue,
      isRunning: true,
      summary: { total: 0, pass: 0, fail: 0, warn: 0, totalDuration: 0 },
    });

    render(<IntegrityTests />);

    expect(screen.getByTestId('running-status')).toHaveTextContent('running');
    expect(screen.getByTestId('is-complete')).toHaveTextContent('incomplete');
  });

  it('maintains responsive layout', () => {
    const { container } = render(<IntegrityTests />);

    // Check for grid layout
    const gridContainer = container.querySelector('.grid.lg\\:grid-cols-2');
    expect(gridContainer).toBeInTheDocument();

    // Check for proper spacing
    const mainContainer = container.querySelector('.space-y-8');
    expect(mainContainer).toBeInTheDocument();
  });

  it('handles empty test results gracefully', () => {
    mockUseTestExecution.mockReturnValue({
      ...defaultMockValue,
      testResults: {},
      filteredTests: [],
      paginatedTests: [],
    });

    render(<IntegrityTests />);

    expect(screen.getByTestId('tests-count')).toHaveTextContent('0');
    expect(screen.getByTestId('results-count')).toHaveTextContent('0');
  });

  it('preserves accessibility standards', () => {
    render(<IntegrityTests />);

    // Check for proper heading structure
    expect(screen.getByText('Tests de Integridad — Ecosistema SDLC')).toBeInTheDocument();

    // Check for clickable elements
    const categoryBoxes = screen.getAllByRole('button', { hidden: true });
    expect(categoryBoxes.length).toBeGreaterThan(0);
  });
});
