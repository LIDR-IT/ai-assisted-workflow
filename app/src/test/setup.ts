import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, vi } from 'vitest';

// Global type declarations for testing environment
// (ResizeObserver and IntersectionObserver are defined in beforeAll)

// Mock AppContext hooks globally (must be at top level)
vi.mock('@/contexts/AppContext', () => ({
  useApp: () => ({
    state: {
      currentClient: { id: 'docline', name: 'Docline' },
      theme: { mode: 'light', primaryColor: '#2563eb' },
      ui: { sidebarCollapsed: false, sidebarOpen: true },
      settings: { language: 'es', autoSave: true },
    },
    dispatch: vi.fn(),
  }),
  useAppUI: () => ({
    sidebarCollapsed: false,
    sidebarOpen: true,
    toggleSidebar: vi.fn(),
    setSidebarCollapsed: vi.fn(),
  }),
  AppProvider: ({ children }: any) => children,
}));

// Mock client registry hooks (must be at top level)
vi.mock('@/hooks/useClientRegistry', () => ({
  useClientRegistry: () => ({
    clientId: 'docline',
    clients: new Map(),
    setCurrentClient: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }),
  useCurrentClient: () => ({
    clientId: 'docline',
    client: {
      id: 'docline',
      name: 'Docline',
      industry: 'healthcare',
      domainTerms: { tracking_tool: 'Linear' },
    },
  }),
}));

// Mock react-router-dom (must be at top level)
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
  Link: vi.fn(({ children }) => children),
  Outlet: vi.fn(() => null),
}));

// Global test configuration
beforeAll(() => {
  // Mock console methods to avoid cluttering test output
  Object.defineProperty(window, 'console', {
    value: {
      ...console,
      // Uncomment to silence console methods in tests
      // log: vi.fn(),
      // warn: vi.fn(),
      // error: vi.fn(),
    },
  });

  // Mock window.matchMedia for tests that use responsive hooks
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock ResizeObserver for React Flow and other components that use it
  global.ResizeObserver = class ResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    constructor() {}
  };

  // Mock IntersectionObserver for components that use it
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Global test helpers can be added here
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Vi {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface TestUtils {
      // Add any global test utilities here
    }
  }
}
