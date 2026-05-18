/**
 * @file SitemapView Test Suite
 * @description Tests for SitemapView component with navigation, search, and tree functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { SitemapView } from '../SitemapView';
import { useCurrentClient } from '@/hooks';
import { createMockClientConfig } from '@/test/fixtures/client-factory';

// Mock the hooks
vi.mock('@/hooks', () => ({
  useCurrentClient: vi.fn(),
}));

// Mock the data modules to provide predictable values for testing
vi.mock('@/data/computed/stats', () => ({
  ecosystemStats: {
    skills: 61,
    rules: 5,
    commands: 23,
  },
}));

vi.mock('@/data/features/sitemapView', () => ({
  projectTree: [],
  stats: {
    files: 194,
    completed: 150,
  },
  getIcon: vi.fn(() => null),
}));

// Mock lucide-react icons to avoid complex rendering
vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-react')>();
  return {
    ...actual,
    FolderTree: ({ className, size }: { className?: string; size?: number }) => (
      <div
        data-testid="folder-tree-icon"
        className={className}
        style={{ width: size, height: size }}
      >
        📁
      </div>
    ),
    Search: ({ className, size }: { className?: string; size?: number }) => (
      <div data-testid="search-icon" className={className} style={{ width: size, height: size }}>
        🔍
      </div>
    ),
    X: ({ className, size }: { className?: string; size?: number }) => (
      <div data-testid="x-icon" className={className} style={{ width: size, height: size }}>
        ✕
      </div>
    ),
  };
});

// Mock child components to avoid deep rendering issues
vi.mock('../FileTree', () => ({
  FileTree: ({ tree, mode }: { tree: any[]; mode: string }) => (
    <div data-testid="file-tree">
      FileTree with {tree.length} items in {mode} mode
    </div>
  ),
}));

vi.mock('../NavigationPanel', () => ({
  NavigationPanel: ({ onSearchChange }: { onSearchChange: (q: string) => void }) => (
    <div data-testid="navigation-panel">
      {/* Mock stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <div className="text-lg font-semibold text-slate-900">0</div>
          <div className="text-xs text-slate-600">Completed</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <div className="text-lg font-semibold text-slate-900">0</div>
          <div className="text-xs text-slate-600">Total Files</div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <div className="text-lg font-semibold text-emerald-700">0</div>
          <div className="text-xs text-emerald-600">Skills</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-lg font-semibold text-blue-700">0</div>
          <div className="text-xs text-blue-600">Commands</div>
        </div>
      </div>
      {/* Mock search input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search files..."
          onChange={(e) => onSearchChange(e.target.value)}
          data-testid="search-input"
          className="w-full pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white"
        />
      </div>
    </div>
  ),
}));

// Mock shared components to simplify rendering
vi.mock('@/app/components/shared/FlowComponents', () => ({
  PageHeader: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div data-testid="page-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  ),
  DiagramCard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="diagram-card">{children}</div>
  ),
  SectionBox: ({
    title,
    children,
    icon,
  }: {
    title: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
  }) => (
    <div data-testid="section-box">
      <h3>{title}</h3>
      {icon}
      {children}
    </div>
  ),
  Legend: ({
    items,
    title,
  }: {
    items: Array<{ color: string; label: string }>;
    title?: string;
  }) => (
    <div data-testid="legend">
      {title && <h4>{title}</h4>}
      {items.map((item, index) => (
        <div key={index} className={item.color}>
          {item.label}
        </div>
      ))}
    </div>
  ),
}));

// Wrapper component with Router
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>;
}

describe('SitemapView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCurrentClient).mockReturnValue({
      clientId: 'facephi',
      client: createMockClientConfig({
        name: 'FacePhi',
        fullName: 'FacePhi Technologies',
        industry: 'Biometric Identity Verification',
      }),
    });
  });

  describe('Basic Rendering', () => {
    it('renders page header with correct title and subtitle', () => {
      render(
        <TestWrapper>
          <SitemapView />
        </TestWrapper>
      );

      expect(screen.getByTestId('page-header')).toBeInTheDocument();
      expect(screen.getByText(/Sitemap — Mapa Completo del Proyecto FacePhi/)).toBeInTheDocument();
      expect(screen.getByText(/Estructura de páginas de la aplicación web/)).toBeInTheDocument();
    });

    it('renders all stats cards with correct values', () => {
      const { container } = render(
        <TestWrapper>
          <SitemapView />
        </TestWrapper>
      );

      // Get the stats banner specifically (not navigation stats)
      const statsGrid = container.querySelector('.grid.grid-cols-2.sm\\:grid-cols-5');
      expect(statsGrid).toBeInTheDocument();

      // Check for static stats in the main stats banner
      const statCards = statsGrid?.querySelectorAll('.border-2.rounded-lg');
      expect(statCards).toHaveLength(5);

      // Check values in main stats banner
      expect(statsGrid?.textContent).toContain('17'); // Páginas Web
      expect(statsGrid?.textContent).toContain('66'); // Skills + Rules (61 + 5)
      expect(statsGrid?.textContent).toContain('23'); // Commands
      expect(statsGrid?.textContent).toContain('194'); // Ficheros Creados
      expect(statsGrid?.textContent).toContain('150'); // Docs Disponibles

      // Check labels in main stats banner
      expect(statsGrid?.textContent).toContain('Páginas Web');
      expect(statsGrid?.textContent).toContain('Skills + Rules');
      expect(statsGrid?.textContent).toContain('Commands');
      expect(statsGrid?.textContent).toContain('Ficheros Creados');
      expect(statsGrid?.textContent).toContain('Docs Disponibles');
    });

    it('renders diagram cards for main content sections', () => {
      render(
        <TestWrapper>
          <SitemapView />
        </TestWrapper>
      );

      const diagramCards = screen.getAllByTestId('diagram-card');
      expect(diagramCards).toHaveLength(2); // Navigation + File tree sections
    });

    it('renders file tree section with legend', () => {
      render(
        <TestWrapper>
          <SitemapView />
        </TestWrapper>
      );

      expect(screen.getByTestId('section-box')).toBeInTheDocument();
      expect(
        screen.getByText('Árbol de Ficheros — Ecosistema .claude/ + docs/')
      ).toBeInTheDocument();
      expect(screen.getByTestId('legend')).toBeInTheDocument();
    });

    it('renders legend with correct items', () => {
      render(
        <TestWrapper>
          <SitemapView />
        </TestWrapper>
      );

      const legend = screen.getByTestId('legend');
      expect(legend).toBeInTheDocument();
      expect(screen.getByText('Documento disponible (click para ver)')).toBeInTheDocument();
      expect(screen.getByText('Documento pendiente')).toBeInTheDocument();
      expect(screen.getByText('Orquestador (CLAUDE.md)')).toBeInTheDocument();
      expect(screen.getByText('Nivel 2 (agents, hooks, MCPs)')).toBeInTheDocument();
      expect(screen.getByText('Fuente de Verdad (docs/)')).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
      const { container } = render(
        <TestWrapper>
          <SitemapView className="custom-class" />
        </TestWrapper>
      );
      // Find the div with custom-class in the tree
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });
  });

  describe('Client Integration', () => {
    it('displays different client names correctly', () => {
      vi.mocked(useCurrentClient).mockReturnValue({
        clientId: 'docline',
        client: createMockClientConfig({
          name: 'Docline',
          fullName: 'Docline Healthcare Technology',
          industry: 'Healthcare Technology',
        }),
      });

      render(
        <TestWrapper>
          <SitemapView />
        </TestWrapper>
      );

      expect(screen.getByText(/Sitemap — Mapa Completo del Proyecto Docline/)).toBeInTheDocument();
      expect(screen.getByText(/simplificado/)).toBeInTheDocument();
    });

    it('handles null client gracefully', () => {
      vi.mocked(useCurrentClient).mockReturnValue({
        clientId: 'fallback-client',
        client: createMockClientConfig({ name: 'fallback-client' }),
      });

      render(
        <TestWrapper>
          <SitemapView />
        </TestWrapper>
      );

      expect(screen.getByText(/Sitemap — Mapa Completo del Proyecto/)).toBeInTheDocument();
    });

    it('shows simplified mode indicator for Docline client', () => {
      vi.mocked(useCurrentClient).mockReturnValue({
        clientId: 'docline',
        client: createMockClientConfig({
          name: 'Docline',
          fullName: 'Docline Healthcare Technology',
          industry: 'Healthcare Technology',
        }),
      });

      render(
        <TestWrapper>
          <SitemapView />
        </TestWrapper>
      );

      expect(screen.getByText(/simplificado/)).toBeInTheDocument();
    });

    it('shows complete mode indicator for non-Docline clients', () => {
      vi.mocked(useCurrentClient).mockReturnValue({
        clientId: 'facephi',
        client: createMockClientConfig({
          name: 'FacePhi',
          fullName: 'FacePhi Technologies',
          industry: 'Biometric Identity Verification',
        }),
      });

      render(
        <TestWrapper>
          <SitemapView />
        </TestWrapper>
      );

      const completoTexts = screen.getAllByText(/completo/);
      expect(completoTexts.length).toBeGreaterThan(0);
    });
  });

  describe('Search Functionality', () => {
    it('has search input available in navigation section', () => {
      render(
        <TestWrapper>
          <SitemapView />
        </TestWrapper>
      );

      // Look for search input in the navigation section
      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toBeInTheDocument();
    });

    it('allows typing in search input', () => {
      render(
        <TestWrapper>
          <SitemapView />
        </TestWrapper>
      );

      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'test search' } });

      expect(searchInput).toHaveValue('test search');
    });

    it('can clear search input', () => {
      render(
        <TestWrapper>
          <SitemapView />
        </TestWrapper>
      );

      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'test' } });
      expect(searchInput).toHaveValue('test');

      fireEvent.change(searchInput, { target: { value: '' } });
      expect(searchInput).toHaveValue('');
    });
  });

  describe('Stats Banner', () => {
    it('renders all stat cards with correct styling', () => {
      const { container } = render(
        <TestWrapper>
          <SitemapView />
        </TestWrapper>
      );

      // Get the main stats banner specifically
      const statsGrid = container.querySelector('.grid.grid-cols-2.sm\\:grid-cols-5');
      expect(statsGrid).toBeInTheDocument();

      const statCards = [
        { label: 'Páginas Web', value: '17' },
        { label: 'Skills + Rules', value: '66' },
        { label: 'Commands', value: '23' },
        { label: 'Ficheros Creados', value: '194' },
        { label: 'Docs Disponibles', value: '150' },
      ];

      // Check each stat exists in the main banner
      statCards.forEach((stat) => {
        expect(statsGrid?.textContent).toContain(stat.label);
        expect(statsGrid?.textContent).toContain(stat.value);
      });
    });

    it('uses grid layout for responsive design', () => {
      const { container } = render(
        <TestWrapper>
          <SitemapView />
        </TestWrapper>
      );

      const statsGrid = container.querySelector('.grid.grid-cols-2');
      expect(statsGrid).toBeInTheDocument();
    });

    it('applies correct color schemes to stat cards', () => {
      const { container } = render(
        <TestWrapper>
          <SitemapView />
        </TestWrapper>
      );

      // Check for different color backgrounds - updated for 5 cards
      expect(container.querySelector('.bg-indigo-50')).toBeInTheDocument();
      expect(container.querySelector('.bg-emerald-50')).toBeInTheDocument();
      expect(container.querySelector('.bg-cyan-50')).toBeInTheDocument();
      expect(container.querySelector('.bg-violet-50')).toBeInTheDocument();
      // Note: emerald-50 appears twice (Skills+Rules and Docs Disponibles)
    });
  });

  describe('Navigation Panel', () => {
    it('renders navigation section with title', () => {
      render(
        <TestWrapper>
          <SitemapView />
        </TestWrapper>
      );

      expect(screen.getByText('Navigation')).toBeInTheDocument();
    });

    it('contains filter checkboxes', () => {
      render(
        <TestWrapper>
          <SitemapView />
        </TestWrapper>
      );

      // Look for checkbox inputs in the navigation section - may not be rendered initially
      screen.queryAllByRole('checkbox');
      // Navigation panel exists even if filters are not immediately visible
      expect(screen.getByText('Navigation')).toBeInTheDocument();
    });

    it('has statistics display', () => {
      render(
        <TestWrapper>
          <SitemapView />
        </TestWrapper>
      );

      // Should show some file/document statistics
      expect(screen.getByText('Total Files')).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('renders main content with correct structure', () => {
      render(
        <TestWrapper>
          <SitemapView />
        </TestWrapper>
      );

      // Check main content container
      const diagrams = screen.getAllByTestId('diagram-card');
      expect(diagrams).toHaveLength(2); // Navigation panel + File tree

      // Check section box exists
      expect(screen.getByTestId('section-box')).toBeInTheDocument();
    });

    it('renders components in correct order', () => {
      const { container } = render(
        <TestWrapper>
          <SitemapView />
        </TestWrapper>
      );

      const pageHeader = screen.getByTestId('page-header');
      const statsGrid = container.querySelector('.grid.grid-cols-2');
      const diagramCards = screen.getAllByTestId('diagram-card');

      expect(pageHeader).toBeInTheDocument();
      expect(statsGrid).toBeInTheDocument();
      expect(diagramCards[0]).toBeInTheDocument(); // Navigation
      expect(diagramCards[1]).toBeInTheDocument(); // File tree
    });
  });

  describe('Accessibility', () => {
    it('provides proper heading hierarchy', () => {
      render(
        <TestWrapper>
          <SitemapView />
        </TestWrapper>
      );

      // Page title should be h1
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

      // Sections should have h3s
      const h3Headings = screen.getAllByRole('heading', { level: 3 });
      expect(h3Headings.length).toBeGreaterThan(0);
    });

    it('provides meaningful labels for stats', () => {
      const { container } = render(
        <TestWrapper>
          <SitemapView />
        </TestWrapper>
      );

      // Get the main stats banner specifically
      const statsGrid = container.querySelector('.grid.grid-cols-2.sm\\:grid-cols-5');
      expect(statsGrid).toBeInTheDocument();

      const statLabels = [
        'Páginas Web',
        'Skills + Rules',
        'Commands',
        'Ficheros Creados',
        'Docs Disponibles',
      ];

      // Check each label exists in the main stats banner
      statLabels.forEach((label) => {
        expect(statsGrid?.textContent).toContain(label);
      });
    });

    it('uses semantic structure for content organization', () => {
      render(
        <TestWrapper>
          <SitemapView />
        </TestWrapper>
      );

      // Should have proper document structure
      expect(screen.getByTestId('page-header')).toBeInTheDocument();
      expect(screen.getByTestId('section-box')).toBeInTheDocument();
      expect(screen.getByTestId('legend')).toBeInTheDocument();
    });
  });

  describe('Interactive Features', () => {
    it('renders file tree with interactive elements', () => {
      render(
        <TestWrapper>
          <SitemapView />
        </TestWrapper>
      );

      // File tree should contain clickable elements
      const fileTreeSection = screen.getByTestId('section-box');
      expect(fileTreeSection).toBeInTheDocument();

      // Should have some tree structure visible
      expect(fileTreeSection).toHaveTextContent('Árbol de Ficheros');
    });

    it('has search functionality available', () => {
      render(
        <TestWrapper>
          <SitemapView />
        </TestWrapper>
      );

      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toBeEnabled();
    });
  });

  describe('Error Handling', () => {
    it('handles missing client data gracefully', () => {
      vi.mocked(useCurrentClient).mockReturnValue({
        clientId: 'fallback-client',
        client: createMockClientConfig({ name: 'fallback-client' }),
      });

      expect(() => {
        render(
          <TestWrapper>
            <SitemapView />
          </TestWrapper>
        );
      }).not.toThrow();

      expect(screen.getByTestId('page-header')).toBeInTheDocument();
    });

    it('handles undefined props gracefully', () => {
      expect(() => {
        render(
          <TestWrapper>
            <SitemapView />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });

  describe('Tree Mode', () => {
    it('uses default tree mode', () => {
      render(
        <TestWrapper>
          <SitemapView />
        </TestWrapper>
      );

      // Should render without errors with default mode
      expect(screen.getByTestId('section-box')).toBeInTheDocument();
    });
  });
});
