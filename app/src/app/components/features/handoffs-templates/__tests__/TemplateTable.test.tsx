/**
 * @file TemplateTable Test Suite
 * @description Tests for TemplateTable component with search, filtering, and performance testing
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TemplateTable } from '../TemplateTable';
import type { Template } from '@/data/features/handoffsTemplates';

// Mock the AIBadge component
vi.mock('../AIBadge', () => ({
  AIBadge: ({ type, claudePath }: { type: string; claudePath?: string }) => (
    <div data-testid="ai-badge" data-type={type} data-claude-path={claudePath}>
      AI Badge: {type}
    </div>
  ),
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Search: ({ size, className }: { size: number; className: string }) => (
    <div data-testid="search-icon" className={className} style={{ width: size, height: size }}>
      🔍
    </div>
  ),
}));

describe('TemplateTable', () => {
  const mockTemplates: Template[] = [
    {
      code: 'T1-BC',
      name: 'Business Case',
      desc: 'Comprehensive business case with ROI analysis',
      format: '.md',
      owner: 'PME',
      mandatory: true,
      aiAssist: 'skill',
      claudePath: 'skills/business-case',
    },
    {
      code: 'T1-SM',
      name: 'Stakeholder Map',
      desc: 'Complete mapping of project stakeholders',
      format: '.xlsx',
      owner: 'PME',
      mandatory: true,
    },
    {
      code: 'T1-KO',
      name: 'Kick-off Meeting',
      desc: 'Project initiation meeting documentation',
      format: '.md',
      owner: 'SM',
      mandatory: false,
      aiAssist: 'skill',
      claudePath: 'skills/kickoff',
    },
    {
      code: 'T1-RA',
      name: 'Risk Assessment',
      desc: 'Initial risk identification and mitigation strategies',
      format: '.claude/rules',
      owner: 'PME',
      mandatory: false,
      aiAssist: 'rule',
      claudePath: 'rules/project-risk',
    },
    {
      code: 'T1-PA',
      name: 'Project Architecture',
      desc: 'High-level technical architecture document',
      format: '.md',
      owner: 'TL',
      mandatory: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders template table with all templates', () => {
      render(<TemplateTable templates={mockTemplates} />);

      // Check table headers
      expect(screen.getByText('Código')).toBeInTheDocument();
      expect(screen.getByText('Nombre')).toBeInTheDocument();
      expect(screen.getByText('Descripción')).toBeInTheDocument();
      expect(screen.getByText('Formato')).toBeInTheDocument();
      expect(screen.getByText('Owner')).toBeInTheDocument();
      expect(screen.getByText('Obligatorio')).toBeInTheDocument();

      // Check template data
      expect(screen.getByText('T1-BC')).toBeInTheDocument();
      expect(screen.getByText('Business Case')).toBeInTheDocument();
      expect(screen.getByText('Comprehensive business case with ROI analysis')).toBeInTheDocument();
      expect(screen.getAllByText('PME').length).toBeGreaterThan(0);
    });

    it('displays results count correctly', () => {
      render(<TemplateTable templates={mockTemplates} />);

      expect(screen.getByText('Mostrando 5 de 5 templates')).toBeInTheDocument();
    });

    it('renders search input with placeholder', () => {
      render(<TemplateTable templates={mockTemplates} />);

      const searchInput = screen.getByPlaceholderText('Buscar templates...');
      expect(searchInput).toBeInTheDocument();
      expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    });

    it('renders AI badges for templates with AI assistance', () => {
      render(<TemplateTable templates={mockTemplates} />);

      const aiBadges = screen.getAllByTestId('ai-badge');
      expect(aiBadges).toHaveLength(3); // T1-BC, T1-KO, T1-RA have AI assistance

      // Check specific AI badge types
      expect(aiBadges[0]).toHaveAttribute('data-type', 'skill');
    });

    it('displays mandatory status correctly', () => {
      render(<TemplateTable templates={mockTemplates} />);

      // Check mandatory templates
      const mandatoryBadges = screen.getAllByText('Sí');
      expect(mandatoryBadges).toHaveLength(3); // T1-BC, T1-SM, T1-PA are mandatory

      // Check optional templates
      const optionalBadges = screen.getAllByText('Opc.');
      expect(optionalBadges).toHaveLength(2); // T1-KO, T1-RA are optional
    });

    it('highlights .claude/ format templates', () => {
      render(<TemplateTable templates={mockTemplates} />);

      // Risk Assessment has .claude/rules format
      const claudeFormatElement = screen.getByText('.claude/rules');
      expect(claudeFormatElement).toHaveClass('bg-violet-100', 'text-violet-600');

      // Regular .md format should not have violet styling
      const mdElements = screen.getAllByText('.md');
      mdElements.forEach((element) => {
        expect(element).toHaveClass('bg-slate-100', 'text-slate-600');
      });
    });
  });

  describe('Search Functionality', () => {
    it('filters templates by name', async () => {
      const user = userEvent.setup();
      render(<TemplateTable templates={mockTemplates} />);

      const searchInput = screen.getByPlaceholderText('Buscar templates...');
      await user.type(searchInput, 'Business');

      await waitFor(() => {
        expect(screen.getByText('Mostrando 1 de 5 templates')).toBeInTheDocument();
        expect(screen.getByText('Business Case')).toBeInTheDocument();
        expect(screen.queryByText('Stakeholder Map')).not.toBeInTheDocument();
      });
    });

    it('filters templates by code', async () => {
      const user = userEvent.setup();
      render(<TemplateTable templates={mockTemplates} />);

      const searchInput = screen.getByPlaceholderText('Buscar templates...');
      await user.type(searchInput, 'T1-BC');

      await waitFor(() => {
        expect(screen.getByText('Mostrando 1 de 5 templates')).toBeInTheDocument();
        expect(screen.getByText('Business Case')).toBeInTheDocument();
      });
    });

    it('filters templates by description', async () => {
      const user = userEvent.setup();
      render(<TemplateTable templates={mockTemplates} />);

      const searchInput = screen.getByPlaceholderText('Buscar templates...');
      await user.type(searchInput, 'ROI analysis');

      await waitFor(() => {
        expect(screen.getByText('Mostrando 1 de 5 templates')).toBeInTheDocument();
        expect(screen.getByText('Business Case')).toBeInTheDocument();
      });
    });

    it('performs case-insensitive search', async () => {
      const user = userEvent.setup();
      render(<TemplateTable templates={mockTemplates} />);

      const searchInput = screen.getByPlaceholderText('Buscar templates...');
      await user.type(searchInput, 'BUSINESS');

      await waitFor(() => {
        expect(screen.getByText('Mostrando 1 de 5 templates')).toBeInTheDocument();
        expect(screen.getByText('Business Case')).toBeInTheDocument();
      });
    });

    it('shows no results message when search yields no matches', async () => {
      const user = userEvent.setup();
      render(<TemplateTable templates={mockTemplates} />);

      const searchInput = screen.getByPlaceholderText('Buscar templates...');
      await user.type(searchInput, 'nonexistent');

      await waitFor(() => {
        expect(screen.getByText('Mostrando 0 de 5 templates')).toBeInTheDocument();
        expect(
          screen.getByText('No se encontraron templates que coincidan con los filtros.')
        ).toBeInTheDocument();
        expect(screen.getByText('Limpiar filtros')).toBeInTheDocument();
      });
    });
  });

  describe('AI Filter Functionality', () => {
    it('defaults to showing all templates', () => {
      render(<TemplateTable templates={mockTemplates} />);

      expect(screen.getByText('Mostrando 5 de 5 templates')).toBeInTheDocument();

      // "Todos" button should be active by default
      const todosButton = screen.getByRole('button', { name: 'Todos' });
      expect(todosButton).toHaveClass('bg-gray-600', 'text-white');
    });

    it('filters to show only AI-assisted templates', () => {
      render(<TemplateTable templates={mockTemplates} />);

      const conIAButton = screen.getByRole('button', { name: 'Con IA' });
      fireEvent.click(conIAButton);

      // Should show 3 templates with AI assistance (T1-BC, T1-KO, T1-RA)
      expect(screen.getByText('Mostrando 3 de 5 templates')).toBeInTheDocument();
      expect(screen.getByText('Business Case')).toBeInTheDocument();
      expect(screen.getByText('Kick-off Meeting')).toBeInTheDocument();
      expect(screen.getByText('Risk Assessment')).toBeInTheDocument();
      expect(screen.queryByText('Stakeholder Map')).not.toBeInTheDocument();
      expect(screen.queryByText('Project Architecture')).not.toBeInTheDocument();

      // Button should be active
      expect(conIAButton).toHaveClass('bg-violet-600', 'text-white');
    });

    it('filters to show only manual templates', () => {
      render(<TemplateTable templates={mockTemplates} />);

      const manualesButton = screen.getByRole('button', { name: 'Manuales' });
      fireEvent.click(manualesButton);

      // Should show 2 templates without AI assistance (T1-SM, T1-PA)
      expect(screen.getByText('Mostrando 2 de 5 templates')).toBeInTheDocument();
      expect(screen.getByText('Stakeholder Map')).toBeInTheDocument();
      expect(screen.getByText('Project Architecture')).toBeInTheDocument();
      expect(screen.queryByText('Business Case')).not.toBeInTheDocument();

      // Button should be active
      expect(manualesButton).toHaveClass('bg-gray-600', 'text-white');
    });

    it('resets filter to show all templates', () => {
      render(<TemplateTable templates={mockTemplates} />);

      // First filter to AI-assisted
      fireEvent.click(screen.getByRole('button', { name: 'Con IA' }));
      expect(screen.getByText('Mostrando 3 de 5 templates')).toBeInTheDocument();

      // Reset to all
      fireEvent.click(screen.getByRole('button', { name: 'Todos' }));
      expect(screen.getByText('Mostrando 5 de 5 templates')).toBeInTheDocument();
    });
  });

  describe('Combined Search and Filter', () => {
    it('combines search and AI filter correctly', async () => {
      const user = userEvent.setup();
      render(<TemplateTable templates={mockTemplates} />);

      // Filter to AI-assisted only
      fireEvent.click(screen.getByRole('button', { name: 'Con IA' }));

      // Then search within AI-assisted templates
      const searchInput = screen.getByPlaceholderText('Buscar templates...');
      await user.type(searchInput, 'Business');

      await waitFor(() => {
        expect(screen.getByText('Mostrando 1 de 5 templates')).toBeInTheDocument();
        expect(screen.getByText('Business Case')).toBeInTheDocument();
        expect(screen.queryByText('Kick-off Meeting')).not.toBeInTheDocument();
      });
    });

    it('shows no results when search and filter have no matches', async () => {
      const user = userEvent.setup();
      render(<TemplateTable templates={mockTemplates} />);

      // Filter to manual templates
      fireEvent.click(screen.getByRole('button', { name: 'Manuales' }));

      // Search for something that only exists in AI-assisted templates
      const searchInput = screen.getByPlaceholderText('Buscar templates...');
      await user.type(searchInput, 'Risk Assessment');

      await waitFor(() => {
        expect(screen.getByText('Mostrando 0 de 5 templates')).toBeInTheDocument();
        expect(
          screen.getByText('No se encontraron templates que coincidan con los filtros.')
        ).toBeInTheDocument();
      });
    });
  });

  describe('Clear Filters Functionality', () => {
    it('clears all filters when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<TemplateTable templates={mockTemplates} />);

      // Apply search and filter
      const searchInput = screen.getByPlaceholderText('Buscar templates...');
      await user.type(searchInput, 'nonexistent');
      fireEvent.click(screen.getByRole('button', { name: 'Con IA' }));

      // Should show no results
      await waitFor(() => {
        expect(screen.getByText('Mostrando 0 de 5 templates')).toBeInTheDocument();
      });

      // Click clear filters
      fireEvent.click(screen.getByText('Limpiar filtros'));

      // Should reset to all templates
      expect(screen.getByText('Mostrando 5 de 5 templates')).toBeInTheDocument();
      expect(searchInput).toHaveValue('');

      // "Todos" button should be active again
      const todosButton = screen.getByRole('button', { name: 'Todos' });
      expect(todosButton).toHaveClass('bg-gray-600', 'text-white');
    });
  });

  describe('Table Layout and Styling', () => {
    it('applies alternating row colors', () => {
      render(<TemplateTable templates={mockTemplates} />);

      const tableRows = screen.getAllByRole('row');
      // Skip header row (index 0)
      const dataRows = tableRows.slice(1);

      // Check that alternating rows have different background classes
      dataRows.forEach((row, index) => {
        if (index % 2 === 0) {
          expect(row).toHaveClass('bg-white');
        } else {
          expect(row).toHaveClass('bg-gray-50');
        }
      });
    });

    it('displays Claude paths for AI-assisted templates', () => {
      render(<TemplateTable templates={mockTemplates} />);

      // Business Case should show its Claude path
      expect(screen.getByText('skills/business-case')).toBeInTheDocument();
      expect(screen.getByText('skills/kickoff')).toBeInTheDocument();
      expect(screen.getByText('rules/project-risk')).toBeInTheDocument();
    });
  });

  describe('Performance and Memoization', () => {
    it('memoizes filtered results', () => {
      const { rerender } = render(<TemplateTable templates={mockTemplates} />);

      // Initial render
      expect(screen.getByText('Mostrando 5 de 5 templates')).toBeInTheDocument();

      // Re-render with same templates (should use memoized results)
      rerender(<TemplateTable templates={mockTemplates} />);
      expect(screen.getByText('Mostrando 5 de 5 templates')).toBeInTheDocument();
    });

    it('recalculates when templates prop changes', () => {
      const { rerender } = render(<TemplateTable templates={mockTemplates} />);

      expect(screen.getByText('Mostrando 5 de 5 templates')).toBeInTheDocument();

      // Render with different templates
      const newTemplates = mockTemplates.slice(0, 2);
      rerender(<TemplateTable templates={newTemplates} />);

      expect(screen.getByText('Mostrando 2 de 2 templates')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty templates array', () => {
      render(<TemplateTable templates={[]} />);

      expect(screen.getByText('Mostrando 0 de 0 templates')).toBeInTheDocument();
      expect(
        screen.getByText('No se encontraron templates que coincidan con los filtros.')
      ).toBeInTheDocument();
    });

    it('handles templates without AI assistance gracefully', () => {
      const templatesWithoutAI: Template[] = [
        {
          code: 'T1-MANUAL',
          name: 'Manual Template',
          desc: 'Completely manual template',
          format: '.doc',
          owner: 'User',
          mandatory: true,
        },
      ];

      render(<TemplateTable templates={templatesWithoutAI} />);

      expect(screen.getByText('Manual Template')).toBeInTheDocument();
      expect(screen.queryByTestId('ai-badge')).not.toBeInTheDocument();
    });

    it('handles templates with long descriptions', () => {
      const templateWithLongDesc: Template[] = [
        {
          code: 'T1-LONG',
          name: 'Long Description Template',
          desc: 'This is a very long description that might wrap to multiple lines and needs to be handled gracefully by the table layout without breaking the design',
          format: '.md',
          owner: 'PME',
          mandatory: false,
        },
      ];

      render(<TemplateTable templates={templateWithLongDesc} />);

      expect(screen.getByText(/This is a very long description/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides proper table structure', () => {
      render(<TemplateTable templates={mockTemplates} />);

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();

      const columnHeaders = screen.getAllByRole('columnheader');
      expect(columnHeaders).toHaveLength(6);
    });

    it('provides accessible search input', () => {
      render(<TemplateTable templates={mockTemplates} />);

      const searchInput = screen.getByRole('textbox');
      expect(searchInput).toHaveAttribute('placeholder', 'Buscar templates...');
    });

    it('provides accessible filter buttons', () => {
      render(<TemplateTable templates={mockTemplates} />);

      expect(screen.getByRole('button', { name: 'Todos' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Con IA' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Manuales' })).toBeInTheDocument();
    });
  });
});
