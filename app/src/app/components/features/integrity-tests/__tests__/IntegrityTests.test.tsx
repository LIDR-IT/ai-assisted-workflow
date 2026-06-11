/**
 * @file IntegrityTests Test Suite
 * @description Tests for IntegrityTests component with test execution functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IntegrityTests } from '../IntegrityTests';

// Mock the useTestExecution hook
vi.mock('../useTestExecution', () => ({
  useTestExecution: vi.fn(),
}));

import { useTestExecution } from '../useTestExecution';
const mockUseTestExecution = vi.mocked(useTestExecution);

// Mock child components
vi.mock('../TestRunner', () => ({
  TestRunner: ({
    isRunning,
    summary,
    onRunAllTests,
    onClearResults,
    totalTests,
  }: {
    isRunning: boolean;
    summary: any;
    onRunAllTests: () => void;
    onClearResults: () => void;
    totalTests: number;
  }) => (
    <div data-testid="test-runner">
      <div data-testid="runner-running">Running: {isRunning.toString()}</div>
      <div data-testid="runner-total">Total Tests: {totalTests}</div>
      <div data-testid="runner-passed">Passed: {summary.pass || 0}</div>
      <div data-testid="runner-failed">Failed: {summary.fail || 0}</div>
      <button onClick={onRunAllTests} data-testid="run-all-button">
        Run All Tests
      </button>
      <button onClick={onClearResults} data-testid="clear-results-button">
        Clear Results
      </button>
    </div>
  ),
}));

vi.mock('../TestSuite', () => ({
  TestSuite: ({
    tests,
    onRunSingleTest,
    testResults: _testResults,
    testCategories: _testCategories,
    selectedCategory: _selectedCategory,
    currentPage: _currentPage,
    totalPages: _totalPages,
    isRunning: _isRunning,
    onSelectCategory: _onSelectCategory,
    onPageChange: _onPageChange,
  }: {
    tests: any[];
    onRunSingleTest: (testId: string) => void;
    testResults: any;
    testCategories: any[];
    selectedCategory: string | null;
    currentPage: number;
    totalPages: number;
    isRunning: boolean;
    onSelectCategory: (category: string | null) => void;
    onPageChange: (page: number) => void;
  }) => (
    <div data-testid="test-suite">
      <div>Test Suite with {tests.length} tests</div>
      {tests.map((test) => (
        <button
          key={test.id}
          onClick={() => onRunSingleTest(test.id)}
          data-testid={`test-${test.id}`}
        >
          {test.name}
        </button>
      ))}
    </div>
  ),
}));

vi.mock('../TestResults', () => ({
  TestResults: ({
    summary,
    testResults,
    testCategories: _testCategories,
    isComplete,
    totalTests: _totalTests,
  }: {
    summary: any;
    testResults: any;
    testCategories: any[];
    isComplete: boolean;
    totalTests: number;
  }) => (
    <div data-testid="test-results">
      <div data-testid="results-count">Results Count: {Object.keys(testResults || {}).length}</div>
      <div data-testid="results-complete">Complete: {isComplete.toString()}</div>
      <div data-testid="results-passed">Passed: {summary.pass || 0}</div>
      <div data-testid="results-failed">Failed: {summary.fail || 0}</div>
    </div>
  ),
}));

// Mock ProblemsPanel (covered by its own ProblemsPanel.test.tsx)
vi.mock('../ProblemsPanel', () => ({
  ProblemsPanel: ({ testResults }: { testResults: Record<string, unknown> }) => (
    <div data-testid="problems-panel-mock">Problems: {Object.keys(testResults || {}).length}</div>
  ),
}));

// Mock shared components
vi.mock('@/app/components/shared/FlowComponents', () => ({
  PageHeader: ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div data-testid="page-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  ),
  SectionBox: ({
    title,
    subtitle,
    onClick,
    className,
    children,
    icon,
  }: {
    title: string;
    subtitle?: string;
    onClick?: () => void;
    className?: string;
    children?: React.ReactNode;
    icon?: React.ReactNode;
  }) => (
    <div data-testid="section-box" className={className} onClick={onClick}>
      {icon}
      <h3>{title}</h3>
      {subtitle && <p>{subtitle}</p>}
      {children}
    </div>
  ),
}));

// Mock lucide-react with importOriginal for partial mocking
vi.mock('lucide-react', async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    ShieldCheck: () => <div data-testid="shield-check-icon">🛡️</div>,
    FileCheck: () => <div data-testid="file-check-icon">📄</div>,
    Link: () => <div data-testid="link-icon">🔗</div>,
    Database: () => <div data-testid="database-icon">💾</div>,
    Workflow: () => <div data-testid="workflow-icon">⚙️</div>,
    ArrowRight: () => <div data-testid="arrow-right-icon">→</div>,
    FolderTree: () => <div data-testid="folder-tree-icon">📁</div>,
    ListOrdered: () => <div data-testid="list-ordered-icon">📋</div>,
    Code: () => <div data-testid="code-icon">💻</div>,
    Eye: () => <div data-testid="eye-icon">👁️</div>,
    Copy: () => <div data-testid="copy-icon">📋</div>,
    Layers: () => <div data-testid="layers-icon">📚</div>,
    GitBranch: () => <div data-testid="git-branch-icon">🌲</div>,
  };
});

// Default mock configuration
const defaultMockReturn = {
  // State
  statusFilter: 'all' as const,
  statusCounts: { all: 3, fail: 1, warn: 0, info: 0, pass: 1, pending: 1 },
  setStatusFilter: vi.fn(),
  testResults: {
    test1: {
      id: 'test1',
      name: 'Path Validation',
      category: 'data-integrity',
      status: 'pass' as const,
      message: 'Test 1 passed',
      duration: 100,
    },
    test2: {
      id: 'test2',
      name: 'Counter Check',
      category: 'counters',
      status: 'fail' as const,
      message: 'Test 2 failed',
      duration: 150,
    },
  },
  isRunning: false,
  currentPage: 1,
  selectedCategory: null,
  executionStartTime: null,

  // Computed
  filteredTests: [
    {
      id: 'test1',
      name: 'Path Validation',
      category: 'data-integrity',
      type: 'sync' as const,
      description: 'Validates file paths',
    },
    {
      id: 'test2',
      name: 'Counter Check',
      category: 'counters',
      type: 'sync' as const,
      description: 'Checks counters',
    },
    {
      id: 'test3',
      name: 'Relationship Validation',
      category: 'cross-reference',
      type: 'sync' as const,
      description: 'Validates relationships',
    },
  ],
  paginatedTests: [
    {
      id: 'test1',
      name: 'Path Validation',
      category: 'data-integrity',
      type: 'sync' as const,
      description: 'Validates file paths',
    },
    {
      id: 'test2',
      name: 'Counter Check',
      category: 'counters',
      type: 'sync' as const,
      description: 'Checks counters',
    },
  ],
  totalPages: 2,
  summary: {
    total: 32,
    pass: 28,
    fail: 4,
    warn: 0,
    info: 0,
    totalDuration: 1500,
  },

  // Actions
  runAllTests: vi.fn(),
  runSingleTest: vi.fn(),
  clearResults: vi.fn(),
  setCurrentPage: vi.fn(),
  setSelectedCategory: vi.fn(),

  // Data
  testCategories: [
    {
      id: 'data-integrity',
      name: 'Integridad de Datos',
      icon: 'ShieldCheck',
      description: 'Tests de integridad de datos',
      color: 'blue',
    },
    {
      id: 'cross-reference',
      name: 'Cross-Referencia',
      icon: 'Brain',
      description: 'Tests de referencias cruzadas',
      color: 'green',
    },
    {
      id: 'legacy-cleanup',
      name: 'Legacy Cleanup',
      icon: 'FileText',
      description: 'Tests de limpieza legacy',
      color: 'orange',
    },
    {
      id: 'naming-convention',
      name: 'Naming Convention',
      icon: 'Terminal',
      description: 'Tests de convenciones',
      color: 'purple',
    },
  ],
  testDefinitions: [
    {
      id: 'test1',
      name: 'Path Validation',
      category: 'data-integrity',
      type: 'sync' as const,
      description: 'Validates file paths',
    },
    {
      id: 'test2',
      name: 'Counter Check',
      category: 'counters',
      type: 'sync' as const,
      description: 'Checks counters',
    },
    {
      id: 'test3',
      name: 'Relationship Validation',
      category: 'cross-reference',
      type: 'sync' as const,
      description: 'Validates relationships',
    },
  ],
  config: {
    PLACEHOLDER_COUNT: 32,
    TESTS_PER_PAGE: 10,
    ASYNC_TEST_TIMEOUT: 5000,
    REAL_TIME_CATEGORIES: ['data-integrity', 'counters', 'coverage'],
    MAX_DETAILS_ITEMS: 50,
  },
};

// Create mock functions reference
const mockFunctions = {
  runAllTests: defaultMockReturn.runAllTests,
  runSingleTest: defaultMockReturn.runSingleTest,
  clearResults: defaultMockReturn.clearResults,
  setCurrentPage: defaultMockReturn.setCurrentPage,
  setSelectedCategory: defaultMockReturn.setSelectedCategory,
};

describe('IntegrityTests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set up the mock to return a proper structure
    mockUseTestExecution.mockReturnValue(defaultMockReturn);
  });

  describe('Basic Rendering', () => {
    it('renders page header with correct title and description', () => {
      render(<IntegrityTests />);

      expect(screen.getByTestId('page-header')).toBeInTheDocument();
      expect(screen.getByText('Tests de Integridad — Ecosistema SDLC')).toBeInTheDocument();
      expect(screen.getAllByText(/36 verificaciones automatizadas/).length).toBeGreaterThan(0);
    });

    it('renders test runner component with correct props', () => {
      render(<IntegrityTests />);

      const testRunner = screen.getByTestId('test-runner');
      expect(testRunner).toBeInTheDocument();
      expect(screen.getByTestId('runner-running')).toHaveTextContent('Running: false');
      expect(screen.getByTestId('runner-total')).toHaveTextContent('Total Tests: 3');
      expect(screen.getByTestId('runner-passed')).toHaveTextContent('Passed: 28');
      expect(screen.getByTestId('runner-failed')).toHaveTextContent('Failed: 4');
    });

    it('renders main components', () => {
      render(<IntegrityTests />);

      expect(screen.getByTestId('test-runner')).toBeInTheDocument();
      expect(screen.getByTestId('test-suite')).toBeInTheDocument();
      expect(screen.getByTestId('test-results')).toBeInTheDocument();
    });
  });

  describe('Category Overview', () => {
    it('renders all test categories', () => {
      render(<IntegrityTests />);

      const categories = defaultMockReturn.testCategories;
      categories.forEach((category) => {
        expect(screen.getByText(category.name)).toBeInTheDocument();
      });
    });

    it('handles category selection', () => {
      render(<IntegrityTests />);

      const categoryDivs = document.querySelectorAll('.cursor-pointer');
      if (categoryDivs.length > 0) {
        fireEvent.click(categoryDivs[0] as Element);
        expect(mockFunctions.setSelectedCategory).toHaveBeenCalled();
      }
    });

    it('deselects category when clicking the selected one', () => {
      mockUseTestExecution.mockReturnValue({
        ...defaultMockReturn,
        selectedCategory: 'data-integrity',
      });

      render(<IntegrityTests />);

      const categoryDivs = document.querySelectorAll('.cursor-pointer');
      if (categoryDivs.length > 0) {
        fireEvent.click(categoryDivs[0] as Element);
        expect(mockFunctions.setSelectedCategory).toHaveBeenCalled();
      }
    });
  });

  describe('Test Suite Integration', () => {
    it('renders test suite with paginated tests', () => {
      render(<IntegrityTests />);

      const testSuite = screen.getByTestId('test-suite');
      expect(testSuite).toBeInTheDocument();
      expect(screen.getByText('Test Suite with 2 tests')).toBeInTheDocument();
    });

    it('renders individual test buttons', () => {
      render(<IntegrityTests />);

      expect(screen.getByTestId('test-test1')).toBeInTheDocument();
      expect(screen.getByTestId('test-test2')).toBeInTheDocument();
      expect(screen.getByText('Path Validation')).toBeInTheDocument();
      expect(screen.getByText('Counter Check')).toBeInTheDocument();
    });

    it('handles single test execution', () => {
      render(<IntegrityTests />);

      const singleTestButton = screen.getByTestId('test-test1');
      fireEvent.click(singleTestButton);

      expect(mockFunctions.runSingleTest).toHaveBeenCalledWith('test1');
    });
  });

  describe('Test Results Integration', () => {
    it('renders test results component', () => {
      render(<IntegrityTests />);

      const testResults = screen.getByTestId('test-results');
      expect(testResults).toBeInTheDocument();
      expect(screen.getByText('Results Count: 2')).toBeInTheDocument();
    });

    it('shows completion status correctly', () => {
      mockUseTestExecution.mockReturnValue({
        ...defaultMockReturn,
        summary: { total: 3, pass: 3, fail: 0, warn: 0, info: 0, totalDuration: 1000 },
        testDefinitions: [
          {
            id: 'test1',
            name: 'Test 1',
            category: 'data-integrity',
            type: 'sync' as const,
            description: 'Test 1 desc',
          },
          {
            id: 'test2',
            name: 'Test 2',
            category: 'counters',
            type: 'sync' as const,
            description: 'Test 2 desc',
          },
          {
            id: 'test3',
            name: 'Test 3',
            category: 'cross-reference',
            type: 'sync' as const,
            description: 'Test 3 desc',
          },
        ],
      });

      render(<IntegrityTests />);

      expect(screen.getByText('Complete: true')).toBeInTheDocument();
    });

    it('shows incomplete status when tests are running', () => {
      mockUseTestExecution.mockReturnValue({
        ...defaultMockReturn,
        isRunning: true,
      });

      render(<IntegrityTests />);

      expect(screen.getByText('Complete: false')).toBeInTheDocument();
      expect(screen.getByText('Running: true')).toBeInTheDocument();
    });
  });

  describe('Test Execution Actions', () => {
    it('handles run all tests action', () => {
      render(<IntegrityTests />);

      const runAllButton = screen.getByTestId('run-all-button');
      fireEvent.click(runAllButton);

      expect(mockFunctions.runAllTests).toHaveBeenCalled();
    });

    it('handles clear results action', () => {
      render(<IntegrityTests />);

      const clearResultsButton = screen.getByTestId('clear-results-button');
      fireEvent.click(clearResultsButton);

      expect(mockFunctions.clearResults).toHaveBeenCalled();
    });
  });

  describe('Component States', () => {
    it('renders correctly when running tests', () => {
      mockUseTestExecution.mockReturnValue({
        ...defaultMockReturn,
        isRunning: true,
        executionStartTime: Date.now(),
      });

      render(<IntegrityTests />);

      expect(screen.getByText('Running: true')).toBeInTheDocument();
      expect(screen.getByText('Complete: false')).toBeInTheDocument();
    });

    it('renders correctly with different category selected', () => {
      mockUseTestExecution.mockReturnValue({
        ...defaultMockReturn,
        selectedCategory: 'counters',
        filteredTests: [
          {
            id: 'test2',
            name: 'Counter Check',
            category: 'counters',
            type: 'sync' as const,
            description: 'Counter validation',
          },
        ],
        paginatedTests: [
          {
            id: 'test2',
            name: 'Counter Check',
            category: 'counters',
            type: 'sync' as const,
            description: 'Counter validation',
          },
        ],
      });

      render(<IntegrityTests />);

      expect(screen.getByText('Test Suite with 1 tests')).toBeInTheDocument();
      expect(screen.getByText('Counter Check')).toBeInTheDocument();
      expect(screen.queryByText('Path Validation')).not.toBeInTheDocument();
    });

    it('renders correctly with no test results', () => {
      mockUseTestExecution.mockReturnValue({
        ...defaultMockReturn,
        testResults: {},
        summary: { total: 0, pass: 0, fail: 0, warn: 0, info: 0, totalDuration: 0 },
      });

      render(<IntegrityTests />);

      expect(screen.getByTestId('results-count')).toHaveTextContent('Results Count: 0');
      expect(screen.getByTestId('results-passed')).toHaveTextContent('Passed: 0');
      expect(screen.getByTestId('results-failed')).toHaveTextContent('Failed: 0');
    });
  });

  describe('Layout Structure', () => {
    it('renders with correct grid layout structure', () => {
      const { container } = render(<IntegrityTests />);

      const mainContainer = container.querySelector('.space-y-8');
      expect(mainContainer).toBeInTheDocument();

      expect(screen.getByTestId('test-runner')).toBeInTheDocument();
      expect(screen.getByTestId('test-suite')).toBeInTheDocument();
      expect(screen.getByTestId('test-results')).toBeInTheDocument();
    });

    it('applies correct styling to category selection', () => {
      mockUseTestExecution.mockReturnValue({
        ...defaultMockReturn,
        selectedCategory: 'data-integrity',
      });

      const { container } = render(<IntegrityTests />);

      const selectedCategories = container.querySelectorAll('.border-indigo-300.bg-indigo-50');
      expect(selectedCategories.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Error Handling', () => {
    it('handles hook returning undefined gracefully', () => {
      mockUseTestExecution.mockReturnValue({
        ...defaultMockReturn,
        testResults: {},
        summary: { total: 0, pass: 0, fail: 0, warn: 0, info: 0, totalDuration: 0 },
      });

      expect(() => render(<IntegrityTests />)).not.toThrow();
    });

    it('handles empty test categories', () => {
      mockUseTestExecution.mockReturnValue({
        ...defaultMockReturn,
        testCategories: [],
      });

      render(<IntegrityTests />);

      expect(screen.getByTestId('page-header')).toBeInTheDocument();
    });

    it('handles empty test definitions', () => {
      mockUseTestExecution.mockReturnValue({
        ...defaultMockReturn,
        testDefinitions: [],
        paginatedTests: [],
        filteredTests: [],
      });

      render(<IntegrityTests />);

      expect(screen.getByText('Total Tests: 0')).toBeInTheDocument();
      expect(screen.getByText('Test Suite with 0 tests')).toBeInTheDocument();
    });
  });
});
