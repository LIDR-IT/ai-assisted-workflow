import { ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { vi } from 'vitest';

// Global type declarations for testing environment
declare global {
  interface Window {
    HTMLCanvasElement: any;
  }
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      performance: any;
      console: any;
    }
  }
}

/**
 * Test utilities for React Flow diagrams
 */
export const mockReactFlowProps = {
  nodes: [],
  edges: [],
  onNodesChange: vi.fn(),
  onEdgesChange: vi.fn(),
  fitView: true,
  className: 'w-full h-96',
};

export const createMockReactFlow = () => ({
  ...mockReactFlowProps,
  getNodes: vi.fn(() => []),
  getEdges: vi.fn(() => []),
  setNodes: vi.fn(),
  setEdges: vi.fn(),
  addNodes: vi.fn(),
  addEdges: vi.fn(),
  toObject: vi.fn(() => ({ nodes: [], edges: [] })),
});

/**
 * Mock HTML-to-image for export functionality
 */
export const mockHtmlToImage = {
  toPng: vi.fn(() => Promise.resolve('data:image/png;base64,mock')),
  toJpeg: vi.fn(() => Promise.resolve('data:image/jpeg;base64,mock')),
  toSvg: vi.fn(() => Promise.resolve('<svg>mock</svg>')),
};

/**
 * Mock jsPDF for PDF export functionality
 */
export const mockJsPDF = {
  addImage: vi.fn(),
  save: vi.fn(),
  setFontSize: vi.fn(),
  text: vi.fn(),
  addPage: vi.fn(),
  getImageProperties: vi.fn(() => ({ width: 100, height: 100 })),
};

/**
 * Router wrapper for components that need routing context
 */
interface RouterWrapperProps {
  children: ReactNode;
  initialEntries?: string[];
  routes?: Array<{
    path: string;
    element: ReactNode;
    children?: Array<{
      index?: boolean;
      path?: string;
      element: ReactNode;
    }>;
  }>;
}

export const RouterWrapper = ({
  children,
  initialEntries = ['/'],
  routes = [{ path: '*', element: children }],
}: RouterWrapperProps) => {
  const router = createMemoryRouter(routes, {
    initialEntries,
  });

  return <RouterProvider router={router} />;
};

/**
 * Custom render that includes common providers
 */
export const renderWithRouter = (
  ui: ReactNode,
  options: {
    initialEntries?: string[];
    routes?: RouterWrapperProps['routes'];
    renderOptions?: Omit<RenderOptions, 'wrapper'>;
  } = {}
) => {
  const { initialEntries, routes, renderOptions } = options;

  return render(ui, {
    wrapper: ({ children }) => (
      <RouterWrapper initialEntries={initialEntries} routes={routes}>
        {children}
      </RouterWrapper>
    ),
    ...renderOptions,
  });
};

/**
 * Wait for async operations in tests
 */
export const waitForAsyncOperation = (ms: number = 100) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock intersection observer for lazy loading tests
 */
export const mockIntersectionObserver = () => {
  globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    root: null,
    rootMargin: '',
    thresholds: [],
  }));
};

/**
 * Mock performance API for performance tests
 */
export const mockPerformanceAPI = () => {
  const mockPerformance = {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByType: vi.fn(() => []),
    getEntriesByName: vi.fn(() => []),
    clearMarks: vi.fn(),
    clearMeasures: vi.fn(),
  };

  Object.defineProperty(globalThis, 'performance', {
    value: mockPerformance,
    writable: true,
  });

  return mockPerformance;
};

/**
 * Mock console methods for cleaner test output
 */
export const mockConsole = () => {
  const originalConsole = globalThis.console;

  globalThis.console = {
    ...originalConsole,
    log: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  };

  return {
    restore: () => {
      globalThis.console = originalConsole;
    },
    mocks: {
      log: globalThis.console.log,
      warn: globalThis.console.warn,
      error: globalThis.console.error,
      info: globalThis.console.info,
    },
  };
};

/**
 * Create mock data for tests
 */
export const createMockTabConfig = () => [
  { id: 'test1' as const, label: 'Test Tab 1', description: 'Test description 1' },
  { id: 'test2' as const, label: 'Test Tab 2', description: 'Test description 2' },
];

export const createMockTestDefinition = (overrides = {}) => ({
  id: 'T1',
  name: 'Test Example',
  category: 'basic',
  description: 'Example test description',
  implementation: vi.fn(() => ({ status: 'pass' as const, message: 'Test passed', details: [] })),
  ...overrides,
});

export const createMockTestResult = (overrides = {}) => ({
  status: 'pass' as const,
  message: 'Test passed',
  details: [],
  executionTime: 100,
  timestamp: Date.now(),
  ...overrides,
});
