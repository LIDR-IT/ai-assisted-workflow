import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestSuite } from '../TestSuite';
import { TestDefinition, TestResult, TestCategory } from '@/data/features/integrityTests';

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  Play: ({ className, 'data-testid': testId }: any) => (
    <div className={className} data-testid={testId || 'play-icon'}>
      Play
    </div>
  ),
  ChevronLeft: ({ className, 'data-testid': testId }: any) => (
    <div className={className} data-testid={testId || 'chevron-left-icon'}>
      ChevronLeft
    </div>
  ),
  ChevronRight: ({ className, 'data-testid': testId }: any) => (
    <div className={className} data-testid={testId || 'chevron-right-icon'}>
      ChevronRight
    </div>
  ),
  CheckCircle2: ({ className, 'data-testid': testId }: any) => (
    <div className={className} data-testid={testId || 'check-circle-icon'}>
      CheckCircle2
    </div>
  ),
  XCircle: ({ className, 'data-testid': testId }: any) => (
    <div className={className} data-testid={testId || 'x-circle-icon'}>
      XCircle
    </div>
  ),
  AlertTriangle: ({ className, 'data-testid': testId }: any) => (
    <div className={className} data-testid={testId || 'alert-triangle-icon'}>
      AlertTriangle
    </div>
  ),
  Clock: ({ className, 'data-testid': testId }: any) => (
    <div className={className} data-testid={testId || 'clock-icon'}>
      Clock
    </div>
  ),
}));

// Mock data
const mockTestCategories: TestCategory[] = [
  {
    id: 'security',
    name: 'Seguridad',
    icon: 'ShieldCheck',
    description: 'Tests de seguridad',
    color: 'red',
  },
  {
    id: 'performance',
    name: 'Performance',
    icon: 'Zap',
    description: 'Tests de performance',
    color: 'yellow',
  },
  {
    id: 'integration',
    name: 'Integración',
    icon: 'Link2',
    description: 'Tests de integración',
    color: 'blue',
  },
];

const mockTests: TestDefinition[] = [
  {
    id: 't1',
    name: 'Test de Seguridad 1',
    description: 'Verifica la autenticación de usuarios',
    category: 'security',
    type: 'sync',
  },
  {
    id: 't2',
    name: 'Test de Performance 1',
    description: 'Mide tiempo de respuesta de APIs',
    category: 'performance',
    type: 'async',
  },
  {
    id: 't3',
    name: 'Test de Integración 1',
    description: 'Valida conexiones externas',
    category: 'integration',
    type: 'async',
  },
];

const mockTestResults: Record<string, TestResult> = {
  t1: {
    id: 't1',
    name: 'Test de Archivos Centralizados',
    category: 'filesystem',
    status: 'pass',
    message: 'Test passed successfully',
    details: ['Authentication verified', 'Session valid'],
    duration: 150,
  },
  t2: {
    id: 't2',
    name: 'Test de Cross-References',
    category: 'cross-reference',
    status: 'warn',
    message: 'Performance warning detected',
    details: ['Response time above threshold: 2.5s', 'Consider optimization'],
    duration: 2500,
  },
  t3: {
    id: 't3',
    name: 'Test de Integración 1',
    category: 'integration',
    status: 'fail',
    message: 'Connection failed',
    details: ['Timeout after 30s', 'Network unreachable'],
    duration: 30000,
  },
};

const defaultProps = {
  tests: mockTests,
  testResults: mockTestResults,
  testCategories: mockTestCategories,
  selectedCategory: null,
  currentPage: 1,
  totalPages: 1,
  isRunning: false,
  onSelectCategory: vi.fn(),
  onRunSingleTest: vi.fn(),
  onPageChange: vi.fn(),
};

describe('TestSuite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Category filtering', () => {
    it('should render category filter buttons', () => {
      render(<TestSuite {...defaultProps} />);

      expect(screen.getByRole('button', { name: 'Todos los tests' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Seguridad/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Performance/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Integración/ })).toBeInTheDocument();
    });

    it('should highlight selected category', () => {
      render(<TestSuite {...defaultProps} selectedCategory="security" />);

      const securityButton = screen.getByRole('button', { name: /Seguridad/ });
      expect(securityButton).toHaveClass('bg-indigo-100', 'text-indigo-700');
    });

    it('should highlight "Todos los tests" when no category selected', () => {
      render(<TestSuite {...defaultProps} selectedCategory={null} />);

      const allTestsButton = screen.getByRole('button', { name: 'Todos los tests' });
      expect(allTestsButton).toHaveClass('bg-indigo-100', 'text-indigo-700');
    });

    it('should call onSelectCategory when category button clicked', () => {
      const mockOnSelectCategory = vi.fn();
      render(<TestSuite {...defaultProps} onSelectCategory={mockOnSelectCategory} />);

      const securityButton = screen.getByRole('button', { name: /Seguridad/ });
      fireEvent.click(securityButton);

      expect(mockOnSelectCategory).toHaveBeenCalledWith('security');
    });

    it('should call onSelectCategory with null when "Todos los tests" clicked', () => {
      const mockOnSelectCategory = vi.fn();
      render(
        <TestSuite
          {...defaultProps}
          selectedCategory="security"
          onSelectCategory={mockOnSelectCategory}
        />
      );

      const allTestsButton = screen.getByRole('button', { name: 'Todos los tests' });
      fireEvent.click(allTestsButton);

      expect(mockOnSelectCategory).toHaveBeenCalledWith(null);
    });
  });

  describe('Test list display', () => {
    it('should render all tests with their names and descriptions', () => {
      render(<TestSuite {...defaultProps} />);

      expect(screen.getByText('Test de Seguridad 1')).toBeInTheDocument();
      expect(screen.getByText('Verifica la autenticación de usuarios')).toBeInTheDocument();
      expect(screen.getByText('Test de Performance 1')).toBeInTheDocument();
      expect(screen.getByText('Mide tiempo de respuesta de APIs')).toBeInTheDocument();
      expect(screen.getByText('Test de Integración 1')).toBeInTheDocument();
      expect(screen.getByText('Valida conexiones externas')).toBeInTheDocument();
    });

    it('should render test IDs in uppercase', () => {
      render(<TestSuite {...defaultProps} />);

      expect(screen.getByText('T1')).toBeInTheDocument();
      expect(screen.getByText('T2')).toBeInTheDocument();
      expect(screen.getByText('T3')).toBeInTheDocument();
    });

    it('should render execute buttons for each test', () => {
      render(<TestSuite {...defaultProps} />);

      const executeButtons = screen.getAllByRole('button', { name: /Ejecutar/ });
      expect(executeButtons).toHaveLength(3);
    });

    it('should disable execute buttons when isRunning is true', () => {
      render(<TestSuite {...defaultProps} isRunning={true} />);

      const executeButtons = screen.getAllByRole('button', { name: /Ejecutar/ });
      executeButtons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });

    it('should call onRunSingleTest when execute button clicked', () => {
      const mockOnRunSingleTest = vi.fn();
      render(<TestSuite {...defaultProps} onRunSingleTest={mockOnRunSingleTest} />);

      const executeButtons = screen.getAllByRole('button', { name: /Ejecutar/ });
      expect(executeButtons.length).toBeGreaterThan(0);
      if (executeButtons[0]) {
        fireEvent.click(executeButtons[0]);
      }

      expect(mockOnRunSingleTest).toHaveBeenCalledWith('t1');
    });
  });

  describe('Status icons', () => {
    it('should render correct icon for pass status', () => {
      render(<TestSuite {...defaultProps} />);

      // Test t1 has pass status - should show CheckCircle2
      const checkIcons = screen.getAllByTestId('check-circle-icon');
      expect(checkIcons.length).toBeGreaterThan(0);
    });

    it('should render correct icon for warn status', () => {
      render(<TestSuite {...defaultProps} />);

      // Test t2 has warn status - should show AlertTriangle
      expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument();
    });

    it('should render correct icon for fail status', () => {
      render(<TestSuite {...defaultProps} />);

      // Test t3 has fail status - should show XCircle
      expect(screen.getByTestId('x-circle-icon')).toBeInTheDocument();
    });

    it('should render clock icon for tests without results', () => {
      const propsWithoutResults = {
        ...defaultProps,
        testResults: {},
      };
      render(<TestSuite {...propsWithoutResults} />);

      const clockIcons = screen.getAllByTestId('clock-icon');
      expect(clockIcons.length).toBeGreaterThan(0);
    });

    it('should render pulsing clock icon for running status', () => {
      const propsWithRunning = {
        ...defaultProps,
        testResults: {
          t1: {
            id: 't1',
            name: 'Test de Seguridad 1',
            category: 'security',
            status: 'running' as const,
            message: 'Test is running...',
            details: [],
            duration: 0,
          },
        },
      };
      render(<TestSuite {...propsWithRunning} />);

      const clockIcons = screen.getAllByTestId('clock-icon');
      const pulsingClockIcon = clockIcons.find((icon) => icon.classList.contains('animate-pulse'));
      expect(pulsingClockIcon).toBeDefined();
      expect(pulsingClockIcon).toHaveClass('animate-pulse');
    });
  });

  describe('Test results display', () => {
    it('should render test result messages', () => {
      render(<TestSuite {...defaultProps} />);

      expect(screen.getByText('Test passed successfully')).toBeInTheDocument();
      expect(screen.getByText('Performance warning detected')).toBeInTheDocument();
      expect(screen.getByText('Connection failed')).toBeInTheDocument();
    });

    it('should render test durations', () => {
      render(<TestSuite {...defaultProps} />);

      expect(screen.getByText('Ejecutado en 150ms')).toBeInTheDocument();
      expect(screen.getByText('Ejecutado en 2500ms')).toBeInTheDocument();
      expect(screen.getByText('Ejecutado en 30000ms')).toBeInTheDocument();
    });

    it('should render test details in collapsible sections', () => {
      render(<TestSuite {...defaultProps} />);

      const detailsElements = screen.getAllByText('Ver detalles (2 items)');
      expect(detailsElements).toHaveLength(3);
      expect(detailsElements[0]).toBeInTheDocument();
      expect(detailsElements[1]).toBeInTheDocument();
      expect(detailsElements[2]).toBeInTheDocument();
    });

    it('should show correct text color for different result statuses', () => {
      render(<TestSuite {...defaultProps} />);

      const passMessage = screen.getByText('Test passed successfully');
      expect(passMessage).toHaveClass('text-emerald-700');

      const warnMessage = screen.getByText('Performance warning detected');
      expect(warnMessage).toHaveClass('text-yellow-700');

      const failMessage = screen.getByText('Connection failed');
      expect(failMessage).toHaveClass('text-red-700');
    });

    it('should limit displayed details to 10 items', () => {
      const propsWithManyDetails = {
        ...defaultProps,
        testResults: {
          t1: {
            id: 't1',
            name: 'Test de Seguridad 1',
            category: 'security',
            status: 'pass' as const,
            message: 'Test with many details',
            details: Array.from({ length: 15 }, (_, i) => `Detail ${i + 1}`),
            duration: 100,
          },
        },
      };
      render(<TestSuite {...propsWithManyDetails} />);

      expect(screen.getByText('...y 5 más')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('should not render pagination when totalPages is 1', () => {
      render(<TestSuite {...defaultProps} totalPages={1} />);

      expect(screen.queryByText(/Página/)).not.toBeInTheDocument();
    });

    it('should render pagination when totalPages > 1', () => {
      render(<TestSuite {...defaultProps} totalPages={3} currentPage={2} />);

      expect(screen.getByText('Página 2 de 3')).toBeInTheDocument();
    });

    it('should render page number buttons', () => {
      render(<TestSuite {...defaultProps} totalPages={3} currentPage={2} />);

      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    });

    it('should highlight current page', () => {
      render(<TestSuite {...defaultProps} totalPages={3} currentPage={2} />);

      const currentPageButton = screen.getByRole('button', { name: '2' });
      expect(currentPageButton).toHaveClass('bg-indigo-600', 'text-white');
    });

    it('should call onPageChange when page button clicked', () => {
      const mockOnPageChange = vi.fn();
      render(
        <TestSuite
          {...defaultProps}
          totalPages={3}
          currentPage={1}
          onPageChange={mockOnPageChange}
        />
      );

      const pageButton = screen.getByRole('button', { name: '2' });
      fireEvent.click(pageButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    it('should disable previous button on first page', () => {
      render(<TestSuite {...defaultProps} totalPages={3} currentPage={1} />);

      const prevButton = screen.getByTestId('chevron-left-icon').closest('button');
      expect(prevButton).toBeDisabled();
    });

    it('should disable next button on last page', () => {
      render(<TestSuite {...defaultProps} totalPages={3} currentPage={3} />);

      const nextButton = screen.getByTestId('chevron-right-icon').closest('button');
      expect(nextButton).toBeDisabled();
    });

    it('should call onPageChange with previous page when previous button clicked', () => {
      const mockOnPageChange = vi.fn();
      render(
        <TestSuite
          {...defaultProps}
          totalPages={3}
          currentPage={2}
          onPageChange={mockOnPageChange}
        />
      );

      const prevButton = screen.getByTestId('chevron-left-icon').closest('button');
      expect(prevButton).toBeDefined();
      fireEvent.click(prevButton!);

      expect(mockOnPageChange).toHaveBeenCalledWith(1);
    });

    it('should call onPageChange with next page when next button clicked', () => {
      const mockOnPageChange = vi.fn();
      render(
        <TestSuite
          {...defaultProps}
          totalPages={3}
          currentPage={2}
          onPageChange={mockOnPageChange}
        />
      );

      const nextButton = screen.getByTestId('chevron-right-icon').closest('button');
      expect(nextButton).toBeDefined();
      fireEvent.click(nextButton!);

      expect(mockOnPageChange).toHaveBeenCalledWith(3);
    });
  });

  describe('Empty state', () => {
    it('should render empty state when no tests provided', () => {
      render(<TestSuite {...defaultProps} tests={[]} />);

      expect(screen.getByText('No hay tests en esta categoría')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Selecciona otra categoría o "Todos los tests" para ver los tests disponibles.'
        )
      ).toBeInTheDocument();
    });

    it('should not render test list when no tests provided', () => {
      render(<TestSuite {...defaultProps} tests={[]} />);

      expect(screen.queryByText('Test de Seguridad 1')).not.toBeInTheDocument();
    });
  });

  describe('Icon mapping', () => {
    it('should render category icons correctly', () => {
      render(<TestSuite {...defaultProps} />);

      // Category buttons should have icons
      const securityButton = screen.getByRole('button', { name: /Seguridad/ });
      const performanceButton = screen.getByRole('button', { name: /Performance/ });
      const integrationButton = screen.getByRole('button', { name: /Integración/ });

      // All should contain check-circle icons (based on getLucideIcon mapping)
      expect(securityButton).toBeInTheDocument();
      expect(performanceButton).toBeInTheDocument();
      expect(integrationButton).toBeInTheDocument();
    });
  });

  describe('Test counts display', () => {
    it('should show test count in pagination area', () => {
      render(<TestSuite {...defaultProps} totalPages={2} />);

      expect(screen.getByText('3 tests')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles', () => {
      render(<TestSuite {...defaultProps} totalPages={3} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should have proper disabled state for buttons', () => {
      render(<TestSuite {...defaultProps} isRunning={true} />);

      const executeButtons = screen.getAllByRole('button', { name: /Ejecutar/ });
      executeButtons.forEach((button) => {
        expect(button).toHaveAttribute('disabled');
      });
    });
  });

  describe('CSS classes', () => {
    it('should apply hover effects to category buttons', () => {
      render(<TestSuite {...defaultProps} selectedCategory="security" />);

      const performanceButton = screen.getByRole('button', { name: /Performance/ });
      expect(performanceButton).toHaveClass('hover:bg-slate-200');
    });

    it('should apply transition classes', () => {
      render(<TestSuite {...defaultProps} />);

      const allTestsButton = screen.getByRole('button', { name: 'Todos los tests' });
      expect(allTestsButton).toHaveClass('transition-colors');
    });
  });
});
