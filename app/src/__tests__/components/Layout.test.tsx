import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { Layout } from '@/app/components/Layout';
import React from 'react';

// Mock the nav config
vi.mock('@/data/nav-config', () => ({
  getNavConfig: (clientId: string) => {
    if (clientId === 'test') {
      return {
        sections: [{ title: 'Procesos Establecidos ✅', routes: ['home'] }],
        routes: {
          home: { label: 'Flujo General ✅', shortLabel: 'Flujo', status: 'ok' as const },
        },
      };
    }
    return undefined;
  },
}));

// Mock the route registry to provide icons for the entries above.
vi.mock('@/app/route-registry', () => {
  const MockIcon = () => React.createElement('div', { 'data-testid': 'mock-icon' }, 'Icon');
  return {
    ROUTES_BY_ID: {
      home: {
        id: 'home',
        path: '',
        Component: () => null,
        icon: MockIcon,
        defaultLabel: 'Inicio',
        defaultShortLabel: 'Inicio',
        group: 'overview',
        phase: null,
        gate: null,
      },
    },
  };
});

// Mock the client registry hooks
vi.mock('@/hooks/useClientRegistry', () => ({
  useCurrentClient: () => ({
    clientId: 'test',
    client: {
      name: 'TestClient',
      fullName: 'Test Client Corp',
      industry: 'Testing',
      segment: 'QA',
      projectCode: 'TEST-001',
      projectName: 'Test Project',
      domain: 'Testing',
      mainProducts: ['Product1'],
      regulations: ['GDPR'],
      templateVars: {},
      domainTerms: {},
      team: {},
      colors: { primary: '#000', secondary: '#111', accent: '#222' },
      subdomain: 'test.example.com',
    },
  }),
  useClientRegistry: () => ({
    currentClientId: 'test',
    currentClient: {
      name: 'TestClient',
      fullName: 'Test Client Corp',
      industry: 'Testing',
      segment: 'QA',
      projectCode: 'TEST-001',
      projectName: 'Test Project',
      domain: 'Testing',
      mainProducts: ['Product1'],
      regulations: ['GDPR'],
      templateVars: {},
      domainTerms: {},
      team: {},
      colors: { primary: '#000', secondary: '#111', accent: '#222' },
      subdomain: 'test.example.com',
    },
    availableClients: ['test', 'demo'],
    isChanging: false,
    setClient: vi.fn(),
    registerNewClient: vi.fn(),
    hasClient: vi.fn(() => true),
    refresh: vi.fn(),
    error: null,
    clearError: vi.fn(),
  }),
}));

// Mock SimpleClientSelector to avoid complex dependency chain
vi.mock('../../app/components/shared/SimpleClientSelector', () => ({
  SimpleClientSelector: () => <div data-testid="client-selector">Client Selector</div>,
  SimpleClientIndicator: () => <div data-testid="client-indicator">Client Indicator</div>,
}));

// Mock the useAppUI context hook
vi.mock('@/contexts', () => ({
  AppProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAppUI: () => ({
    ui: {
      sidebarOpen: false,
      sidebarCollapsed: false,
      animationsEnabled: true,
      soundEnabled: false,
      compactMode: false,
      showTooltips: true,
    },
    setSidebarOpen: vi.fn(),
    setSidebarCollapsed: vi.fn(),
    updateUI: vi.fn(),
    toggleSidebar: vi.fn(),
  }),
}));

// Test helper to render Layout with proper router context
const renderLayout = () => {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        Component: Layout,
        children: [
          {
            index: true,
            element: <div data-testid="test-outlet">Test Content</div>,
          },
        ],
      },
    ],
    {
      initialEntries: ['/'],
    }
  );

  return render(<RouterProvider router={router} />);
};

describe('Layout Component', () => {
  it('renders without crashing', () => {
    renderLayout();

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByTestId('test-outlet')).toBeInTheDocument();
  });

  it('has proper semantic structure', () => {
    renderLayout();

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('p-4', 'md:p-8', 'max-w-6xl', 'mx-auto');
  });

  it('renders sidebar navigation', () => {
    renderLayout();

    const navigation = screen.getByRole('navigation');
    expect(navigation).toBeInTheDocument();
  });

  it('displays LIDR SDLC branding in header', () => {
    renderLayout();

    const brandElements = screen.getAllByText('LIDR SDLC');
    expect(brandElements.length).toBeGreaterThan(0);
    expect(brandElements[0]).toBeInTheDocument();
  });

  it('contains navigation links', () => {
    renderLayout();

    const navigation = screen.getByRole('navigation');
    expect(navigation).toBeInTheDocument();

    // The sidebar now renders shortLabel; the mock declares 'Flujo'.
    expect(screen.getByText('Flujo')).toBeInTheDocument();

    // Section header is still rendered verbatim.
    expect(screen.getByText('Procesos Establecidos ✅')).toBeInTheDocument();
  });

  it('renders outlet content', () => {
    renderLayout();

    expect(screen.getByTestId('test-outlet')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
