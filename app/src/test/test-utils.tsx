/**
 * Test Utilities - Common test helpers and providers
 *
 * Provides reusable test setup including context providers,
 * mock data, and rendering utilities.
 */

import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';

// ---------------------------------------------------------------------------
// Context Providers Mock
// ---------------------------------------------------------------------------

/** Mock AppProvider for tests that need app context */
export function MockAppProvider({ children }: { children: ReactNode }) {
  return <div data-testid="mock-app-provider">{children}</div>;
}

/** Mock client registry hooks */
export const mockUseClientRegistry = {
  clientId: 'docline',
  client: {
    id: 'docline',
    name: 'Docline',
    industry: 'healthcare',
    domainTerms: {
      tracking_tool: 'Linear',
      documentation_tool: 'Notion',
      communication_tool: 'Slack',
    },
    branding: {
      primaryColor: '#2563eb',
      logo: '/logos/docline.svg',
    },
  },
  clients: new Map(),
  setCurrentClient: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

export const mockUseCurrentClient = {
  clientId: 'docline',
  client: mockUseClientRegistry.client,
};

// ---------------------------------------------------------------------------
// Test Wrapper with Providers
// ---------------------------------------------------------------------------

interface AllTheProvidersProps {
  children: ReactNode;
}

/** Test wrapper that provides all necessary contexts */
function AllTheProviders({ children }: AllTheProvidersProps) {
  return <MockAppProvider>{children}</MockAppProvider>;
}

// ---------------------------------------------------------------------------
// Custom Render Function
// ---------------------------------------------------------------------------

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Whether to wrap with providers (default: true) */
  withProviders?: boolean;
}

/**
 * Custom render function that includes providers by default
 *
 * @param ui - React element to render
 * @param options - Render options
 * @returns Render result with additional utilities
 */
export function renderWithProviders(
  ui: ReactElement,
  { withProviders = true, ...renderOptions }: CustomRenderOptions = {}
) {
  const wrapper = withProviders ? AllTheProviders : undefined;

  return render(ui, { wrapper, ...renderOptions });
}

// ---------------------------------------------------------------------------
// Mock Data Generators
// ---------------------------------------------------------------------------

/** Generate mock test data */
export const mockData = {
  /** Mock test results */
  testResults: (passed = 5, failed = 2, warnings = 1) => ({
    summary: {
      total: passed + failed,
      passed,
      failed,
      warnings,
      percentage: Math.round((passed / (passed + failed)) * 100),
    },
    categories: [
      { name: 'Unit Tests', passed: passed - 1, failed: failed - 1, warnings },
      { name: 'Integration Tests', passed: 1, failed: 1, warnings: 0 },
    ],
  }),

  /** Mock chart data */
  chartData: (points = 5) =>
    Array.from({ length: points }, (_, i) => ({
      name: `Point ${i + 1}`,
      value: Math.floor(Math.random() * 100),
      percentage: Math.floor(Math.random() * 100),
    })),

  /** Mock metrics data */
  metricsData: {
    adoption: {
      totalTeams: 12,
      adoptedTeams: 8,
      adoptionRate: 67,
      roiCalculation: {
        hoursLiberated: 775,
        costPerHour: 50,
        annualSavings: 38750,
      },
    },
    dora: {
      leadTime: { value: 3.2, unit: 'days', trend: 'improving' },
      deploymentFreq: { value: 2.1, unit: 'per week', trend: 'stable' },
      changeFailure: { value: 8.5, unit: '%', trend: 'improving' },
      mttr: { value: 2.4, unit: 'hours', trend: 'stable' },
    },
  },
};

// ---------------------------------------------------------------------------
// Mock Hooks
// ---------------------------------------------------------------------------

/** Setup common hook mocks */
export function setupHookMocks() {
  // Mock useClientRegistry
  vi.mock('@/hooks/useClientRegistry', () => ({
    useClientRegistry: () => mockUseClientRegistry,
    useCurrentClient: () => mockUseCurrentClient,
  }));

  // Mock useNavEntries
  vi.mock('@/hooks/useNavEntries', () => ({
    useNavEntries: () => [
      { type: 'separator', label: 'Main' },
      { type: 'link', path: '/', label: 'Home', icon: vi.fn(), shortLabel: 'Home' },
    ],
  }));

  // Mock React Router
  vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' }),
    Link: ({ children, to, ...props }: any) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  }));
}

// Re-export testing library
export * from '@testing-library/react';
export { renderWithProviders as render };
