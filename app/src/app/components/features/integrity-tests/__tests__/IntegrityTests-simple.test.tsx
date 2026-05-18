/**
 * @file Simple IntegrityTests Test
 * @description Minimal test to verify the useTestExecution mock is working
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IntegrityTests } from '../IntegrityTests';

// Mock ALL lucide-react icons to avoid missing export errors
vi.mock('lucide-react', async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  const MockIcon = ({ className, size, 'data-testid': testId }: any) => (
    <div className={className} data-testid={testId || 'mock-icon'} data-size={size}>
      MockIcon
    </div>
  );

  return {
    ...actual,
    ArrowRight: MockIcon,
    ArrowLeft: MockIcon,
    ArrowUp: MockIcon,
    ArrowDown: MockIcon,
    Play: MockIcon,
    Pause: MockIcon,
    RefreshCw: MockIcon,
    CheckCircle: MockIcon,
    XCircle: MockIcon,
    AlertCircle: MockIcon,
    TestTube: MockIcon,
    Zap: MockIcon,
    Clock: MockIcon,
    Settings: MockIcon,
    BarChart3: MockIcon,
  };
});

// Mock shared components
vi.mock('@/app/components/shared/FlowComponents', () => ({
  PageHeader: ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div data-testid="page-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  ),
  SectionBox: ({ title, children }: { title: string; children?: React.ReactNode }) => (
    <div data-testid="section-box">
      <h3>{title}</h3>
      {children}
    </div>
  ),
}));

// Mock child components
vi.mock('../TestRunner', () => ({
  TestRunner: () => <div data-testid="test-runner">Mock TestRunner</div>,
}));

vi.mock('../TestSuite', () => ({
  TestSuite: () => <div data-testid="test-suite">Mock TestSuite</div>,
}));

vi.mock('../TestResults', () => ({
  TestResults: () => <div data-testid="test-results">Mock TestResults</div>,
}));

// Mock the useTestExecution hook
vi.mock('../useTestExecution');

import { useTestExecution } from '../useTestExecution';
const mockUseTestExecution = vi.mocked(useTestExecution);

describe('IntegrityTests - Simple Mock Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Set up the mock to return a proper structure
    mockUseTestExecution.mockReturnValue({
      // State
      testResults: {},
      isRunning: false,
      currentPage: 1,
      selectedCategory: null,
      executionStartTime: null,

      // Computed
      filteredTests: [],
      paginatedTests: [],
      totalPages: 1,
      summary: { total: 0, pass: 0, fail: 0, warn: 0, totalDuration: 0 },

      // Actions
      runAllTests: vi.fn(),
      runSingleTest: vi.fn(),
      clearResults: vi.fn(),
      setCurrentPage: vi.fn(),
      setSelectedCategory: vi.fn(),

      // Data
      testCategories: [],
      testDefinitions: [],
      config: {
        PLACEHOLDER_COUNT: 32,
        TESTS_PER_PAGE: 10,
        ASYNC_TEST_TIMEOUT: 5000,
        REAL_TIME_CATEGORIES: ['data-integrity', 'counters', 'coverage'],
        MAX_DETAILS_ITEMS: 50,
      },
    });
  });

  it('renders without crashing with mocked hook', () => {
    expect(() => render(<IntegrityTests />)).not.toThrow();
  });

  it('calls useTestExecution hook', () => {
    render(<IntegrityTests />);
    expect(mockUseTestExecution).toHaveBeenCalled();
  });

  it('renders basic components', () => {
    render(<IntegrityTests />);

    expect(screen.getByTestId('page-header')).toBeInTheDocument();
    expect(screen.getByTestId('test-runner')).toBeInTheDocument();
    expect(screen.getByTestId('test-suite')).toBeInTheDocument();
    expect(screen.getByTestId('test-results')).toBeInTheDocument();
  });
});
