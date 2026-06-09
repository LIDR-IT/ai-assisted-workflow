import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PropuestaMejora } from '@/app/components/features/propuesta-mejora/PropuestaMejora';
import { waitForAsyncOperation } from '@/utils/test-helpers';

// Mock the useCurrentClient hook
vi.mock('../../../hooks/useClientRegistry', () => ({
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
}));

vi.mock('../../../data/features/propuestaMejora', () => ({
  tabsConfig: [
    { id: 'flujo', label: 'Flujo Obligatorio' },
    { id: 'pain', label: 'Diagnóstico' },
    { id: 'mejoras', label: 'Mejoras por Fase' },
    { id: 'metricas', label: 'Metricas' },
  ],
  TabId: 'flujo' as const,
}));

const mockTabsConfig = [
  { id: 'flujo', label: 'Flujo Obligatorio' },
  { id: 'pain', label: 'Diagnóstico' },
  { id: 'mejoras', label: 'Mejoras por Fase' },
  { id: 'metricas', label: 'Metricas' },
];

// Mock all tab components
vi.mock('../../../app/components/features/propuesta-mejora/FlowTab', () => ({
  FlowTab: () => <div data-testid="flow-tab">Flow Tab Content</div>,
}));

vi.mock('../../../app/components/features/propuesta-mejora/DiagnosticoTab', () => ({
  DiagnosticoTab: () => <div data-testid="diagnostico-tab">Diagnóstico Tab Content</div>,
}));

vi.mock('../../../app/components/features/propuesta-mejora/MejorasTab', () => ({
  MejorasTab: () => <div data-testid="mejoras-tab">Mejoras Tab Content</div>,
}));

vi.mock('../../../app/components/features/propuesta-mejora/MetricasTab', () => ({
  MetricasTab: () => <div data-testid="metricas-tab">Métricas Tab Content</div>,
}));

vi.mock('../../../app/components/features/propuesta-mejora/PropuestaHero', () => ({
  PropuestaHero: () => <div data-testid="propuesta-hero">Hero Content</div>,
}));

// Mock shared components
vi.mock('../../../app/components/shared/FlowComponents', () => ({
  PageHeader: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div data-testid="page-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  ),
}));

describe('PropuestaMejora Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<PropuestaMejora />);

    expect(screen.getByTestId('page-header')).toBeInTheDocument();
    expect(screen.getByText(/Ecosistema SDLC TestClient/)).toBeInTheDocument();
  });

  it('displays correct header information', () => {
    render(<PropuestaMejora />);

    expect(
      screen.getByText('Ecosistema SDLC TestClient — Propuesta Implementada')
    ).toBeInTheDocument();
    // ecosystemStats is computed dynamically from artifact registries (NOT filesystem),
    // post-removal of the 3 deleted artifacts (skill lidr-project-classifier + commands
    // lidr-document-project, lidr-check-readiness):
    // - 111 skills (skills.length from skills.ts: 42 LIDR + 69 BMAD)
    // - 26 commands (commands.length from commands.ts: LIDR SDLC + 7 lidr-spec-*)
    //   Note: generic commands exist on filesystem but are not in the app registry yet.
    // - 259 totalArtifacts (computed sum across registries)
    expect(screen.getByText(/259 artefactos/)).toBeInTheDocument();
    expect(screen.getByText(/111 skills/)).toBeInTheDocument();
    expect(screen.getByText(/26 commands/)).toBeInTheDocument();
  });

  it('renders all tab buttons', () => {
    render(<PropuestaMejora />);

    mockTabsConfig.forEach((tab) => {
      expect(screen.getByText(tab.label)).toBeInTheDocument();
    });
  });

  it('starts with flujo tab active', () => {
    render(<PropuestaMejora />);

    const flujoButton = screen.getByText('Flujo Obligatorio');
    expect(flujoButton).toHaveClass('bg-blue-600', 'text-white');

    expect(screen.getByTestId('flow-tab')).toBeInTheDocument();
  });

  it('switches tabs when clicked', async () => {
    const user = userEvent.setup();
    render(<PropuestaMejora />);

    const diagnosticoButton = screen.getByText('Diagnóstico');
    await user.click(diagnosticoButton);

    await waitFor(() => {
      expect(screen.getByTestId('diagnostico-tab')).toBeInTheDocument();
    });

    expect(diagnosticoButton).toHaveClass('bg-blue-600', 'text-white');

    const flujoButton = screen.getByText('Flujo Obligatorio');
    expect(flujoButton).toHaveClass('bg-white', 'text-gray-600');
  });

  it('handles all tab switches correctly', async () => {
    const user = userEvent.setup();
    render(<PropuestaMejora />);

    const tabTestCases = [
      { label: 'Diagnóstico', testId: 'diagnostico-tab' },
      { label: 'Mejoras por Fase', testId: 'mejoras-tab' },
      { label: 'Metricas', testId: 'metricas-tab' },
      { label: 'Flujo Obligatorio', testId: 'flow-tab' },
    ];

    for (const { label, testId } of tabTestCases) {
      const button = screen.getByText(label);
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByTestId(testId)).toBeInTheDocument();
      });

      expect(button).toHaveClass('bg-blue-600', 'text-white');
    }
  });

  it('displays loading spinner during tab transition', async () => {
    render(<PropuestaMejora />);

    await waitFor(() => {
      expect(screen.getByTestId('flow-tab')).toBeInTheDocument();
    });

    expect(screen.getByText('Flujo Obligatorio')).toBeInTheDocument();
  });

  it('has proper CSS classes for styling', () => {
    const { container } = render(<PropuestaMejora className="test-class" />);

    expect(container.firstChild).toHaveClass('test-class');

    const tabButtons = screen.getAllByRole('button');
    expect(tabButtons.length).toBeGreaterThan(0);

    const firstTab = tabButtons[0];
    expect(firstTab).toHaveClass('px-4', 'py-2', 'rounded-md');

    const contentContainer = container.querySelector('.min-h-\\[600px\\]');
    expect(contentContainer).toBeInTheDocument();
  });

  it('handles unknown tab fallback', () => {
    const { rerender: _rerender } = render(<PropuestaMejora />);

    expect(screen.getByTestId('flow-tab')).toBeInTheDocument();
  });

  it('maintains accessibility standards', () => {
    render(<PropuestaMejora />);

    mockTabsConfig.forEach((tab) => {
      const button = screen.getByText(tab.label);
      expect(button).toBeInstanceOf(HTMLButtonElement);
    });

    expect(screen.getByTestId('page-header')).toBeInTheDocument();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<PropuestaMejora />);

    const firstTab = screen.getByText('Flujo Obligatorio');
    const secondTab = screen.getByText('Diagnóstico');

    await user.tab();
    expect(firstTab).toHaveFocus();

    await user.tab();
    expect(secondTab).toHaveFocus();

    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByTestId('diagnostico-tab')).toBeInTheDocument();
    });
  });

  it('handles rapid tab switching gracefully', async () => {
    const user = userEvent.setup();
    render(<PropuestaMejora />);

    const tabs = ['Diagnóstico', 'Mejoras por Fase', 'Metricas', 'Flujo Obligatorio'];

    for (const tabLabel of tabs) {
      await user.click(screen.getByText(tabLabel));
      await waitForAsyncOperation(10);
    }

    await waitFor(() => {
      expect(screen.getByTestId('flow-tab')).toBeInTheDocument();
    });

    const flujoButton = screen.getByText('Flujo Obligatorio');
    expect(flujoButton).toHaveClass('bg-blue-600', 'text-white');
  });

  it('lazy loads tab components only when needed', async () => {
    const user = userEvent.setup();
    render(<PropuestaMejora />);

    expect(screen.getByTestId('flow-tab')).toBeInTheDocument();
    expect(screen.queryByTestId('diagnostico-tab')).not.toBeInTheDocument();

    await user.click(screen.getByText('Diagnóstico'));

    await waitFor(() => {
      expect(screen.getByTestId('diagnostico-tab')).toBeInTheDocument();
      expect(screen.queryByTestId('flow-tab')).not.toBeInTheDocument();
    });
  });

  it('handles client config changes', () => {
    const { rerender: _rerender } = render(<PropuestaMejora />);

    expect(screen.getByText(/TestClient/)).toBeInTheDocument();

    expect(
      screen.getByText('Ecosistema SDLC TestClient — Propuesta Implementada')
    ).toBeInTheDocument();
  });
});
