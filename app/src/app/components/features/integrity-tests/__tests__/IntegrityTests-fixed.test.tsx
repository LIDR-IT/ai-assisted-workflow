/**
 * @file IntegrityTests Test Suite - Fixed Mock
 * @description Tests for IntegrityTests component with proper useTestExecution mock
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IntegrityTests } from '../IntegrityTests';

// Create a mock function
const mockUseTestExecution = vi.fn();

// Mock the useTestExecution hook with the same pattern as the working test
vi.mock('../useTestExecution', () => ({
  useTestExecution: () => mockUseTestExecution(),
}));

// Default mock return value
const defaultMockValue = {
  testResults: {},
  isRunning: false,
  currentPage: 1,
  selectedCategory: null,
  executionStartTime: null,
  filteredTests: [
    { id: 'test1', name: 'Path Validation', category: 'data-integrity' },
    { id: 'test2', name: 'Counter Check', category: 'counters' },
    { id: 'test3', name: 'Relationship Validation', category: 'cross-reference' },
  ],
  paginatedTests: [
    { id: 'test1', name: 'Path Validation', category: 'data-integrity' },
    { id: 'test2', name: 'Counter Check', category: 'counters' },
  ],
  totalPages: 2,
  summary: { total: 0, pass: 0, fail: 0, warn: 0, info: 0, totalDuration: 0 },
  runAllTests: vi.fn(),
  runSingleTest: vi.fn(),
  clearResults: vi.fn(),
  setCurrentPage: vi.fn(),
  setSelectedCategory: vi.fn(),
  testCategories: [
    { id: 'data-integrity', name: 'Integridad de Datos', icon: 'ShieldCheck' },
    { id: 'cross-reference', name: 'Cross-Referencia', icon: 'Brain' },
    { id: 'legacy-cleanup', name: 'Legacy Cleanup', icon: 'FileText' },
    { id: 'naming-convention', name: 'Naming Convention', icon: 'Terminal' },
  ],
  testDefinitions: [
    { id: 'test1', name: 'Path Validation', category: 'data-integrity' },
    { id: 'test2', name: 'Counter Check', category: 'counters' },
    { id: 'test3', name: 'Relationship Validation', category: 'cross-reference' },
  ],
  config: {
    PLACEHOLDER_COUNT: 32,
    TESTS_PER_PAGE: 10,
    ASYNC_TEST_TIMEOUT: 5000,
    REAL_TIME_CATEGORIES: ['data-integrity', 'counters', 'coverage'],
    MAX_DETAILS_ITEMS: 50,
  },
};

// Set initial mock return value
mockUseTestExecution.mockReturnValue(defaultMockValue);

// Mock child components
vi.mock('../TestRunner', () => ({
  TestRunner: ({ isRunning, summary, totalTests, onRunAllTests, onClearResults }: any) => (
    <div data-testid="test-runner">
      <div>Running: {isRunning.toString()}</div>
      <div>Total Tests: {totalTests}</div>
      <div>Summary: {summary.total} tests</div>
      <button onClick={onRunAllTests} data-testid="run-all-button">
        Run All
      </button>
      <button onClick={onClearResults} data-testid="clear-button">
        Clear
      </button>
    </div>
  ),
}));

vi.mock('../TestSuite', () => ({
  TestSuite: ({ tests }: any) => (
    <div data-testid="test-suite">
      <div>Test Suite with {tests.length} tests</div>
    </div>
  ),
}));

vi.mock('../TestResults', () => ({
  TestResults: ({ summary }: any) => (
    <div data-testid="test-results">
      <div>Results: {summary.total} total</div>
    </div>
  ),
}));

// Mock shared components
vi.mock('@/app/components/shared/FlowComponents', () => ({
  PageHeader: ({ title, subtitle }: any) => (
    <div data-testid="page-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  ),
  SectionBox: ({ title, children }: any) => (
    <div data-testid="section-box">
      <h3>{title}</h3>
      {children}
    </div>
  ),
}));

// Mock lucide-react
vi.mock('lucide-react', async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    ShieldCheck: () => <div data-testid="shield-check-icon">🛡️</div>,
  };
});

describe('IntegrityTests - Fixed Mock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTestExecution.mockReturnValue(defaultMockValue);
  });

  it('renders without crashing', () => {
    expect(() => render(<IntegrityTests />)).not.toThrow();
  });

  it('renders page header correctly', () => {
    render(<IntegrityTests />);

    expect(screen.getByTestId('page-header')).toBeInTheDocument();
    expect(screen.getByText('Tests de Integridad — Ecosistema SDLC')).toBeInTheDocument();
  });

  it('renders test components', () => {
    render(<IntegrityTests />);

    expect(screen.getByTestId('test-runner')).toBeInTheDocument();
    expect(screen.getByTestId('test-suite')).toBeInTheDocument();
    expect(screen.getByTestId('test-results')).toBeInTheDocument();
  });

  it('calls useTestExecution hook', () => {
    render(<IntegrityTests />);
    expect(mockUseTestExecution).toHaveBeenCalled();
  });

  it('passes correct props to child components', () => {
    render(<IntegrityTests />);

    // Check TestRunner receives correct props
    expect(screen.getByText('Running: false')).toBeInTheDocument();
    expect(screen.getByText('Total Tests: 3')).toBeInTheDocument();

    // Check TestSuite receives correct props
    expect(screen.getByText('Test Suite with 2 tests')).toBeInTheDocument();
  });
});
