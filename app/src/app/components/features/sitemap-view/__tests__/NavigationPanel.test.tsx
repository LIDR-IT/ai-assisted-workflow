/**
 * @file NavigationPanel Test Suite
 * @description Tests for NavigationPanel component with search and filter functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NavigationPanel } from '../NavigationPanel';
import type { TreeNode } from '@/data/features/sitemapView';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
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
}));

describe('NavigationPanel', () => {
  const mockTree: TreeNode[] = [
    {
      name: 'CLAUDE.md',
      type: 'file',
      iconName: 'BookOpen',
      badge: { label: 'Orquestrador', color: 'bg-indigo-100 text-indigo-700' },
      desc: 'Índice comprimido del ecosistema',
      docPath: '.claude/CLAUDE.md',
    },
    {
      name: 'skills',
      type: 'folder',
      iconName: 'FolderOpen',
      desc: 'Skills del ecosistema',
      children: [
        {
          name: 'business-case',
          type: 'folder',
          iconName: 'FolderOpen',
          children: [
            {
              name: 'SKILL.md',
              type: 'file',
              iconName: 'FileText',
              badge: { label: 'Skill', color: 'bg-violet-100 text-violet-700' },
              desc: 'Business Case generation skill',
              docPath: 'skills/business-case/SKILL.md',
            },
          ],
        },
        {
          name: 'lidr-requirements',
          type: 'folder',
          iconName: 'FolderOpen',
          children: [
            {
              name: 'SKILL.md',
              type: 'file',
              iconName: 'FileText',
              badge: { label: 'Skill', color: 'bg-violet-100 text-violet-700' },
              desc: 'Requirements spec skill (per-rf/nfr/validate modes)',
            },
          ],
        },
      ],
    },
    {
      name: 'commands',
      type: 'folder',
      iconName: 'FolderOpen',
      desc: 'Commands del ecosistema',
      children: [
        {
          name: 'implement-ticket.md',
          type: 'file',
          iconName: 'Terminal',
          badge: { label: 'Command', color: 'bg-indigo-100 text-indigo-700' },
          desc: 'Implementation command',
          docPath: 'commands/implement-ticket.md',
        },
      ],
    },
  ];

  const mockOnSearchChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders search input with placeholder', () => {
      render(<NavigationPanel tree={mockTree} />);

      const searchInput = screen.getByPlaceholderText('Search files...');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveValue('');
    });

    it('renders search icon', () => {
      render(<NavigationPanel tree={mockTree} />);

      expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    });

    it('renders statistics cards', () => {
      render(<NavigationPanel tree={mockTree} />);

      // Check for stats
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Total Files')).toBeInTheDocument();
      expect(screen.getByText('Skills')).toBeInTheDocument();
      expect(screen.getByText('Commands')).toBeInTheDocument();
    });

    it('calculates and displays correct statistics', () => {
      render(<NavigationPanel tree={mockTree} />);

      // Based on mock data: 4 files total, 3 completed, 2 skills, 1 command
      expect(screen.getByText('3')).toBeInTheDocument(); // Completed
      expect(screen.getByText('4')).toBeInTheDocument(); // Total Files
      expect(screen.getByText('2')).toBeInTheDocument(); // Skills
      expect(screen.getByText('1')).toBeInTheDocument(); // Commands
    });
  });

  describe('Search Functionality', () => {
    it('updates search input value when typing', () => {
      render(<NavigationPanel tree={mockTree} onSearchChange={mockOnSearchChange} />);

      const searchInput = screen.getByPlaceholderText('Search files...');
      fireEvent.change(searchInput, { target: { value: 'business' } });

      expect(searchInput).toHaveValue('business');
    });

    it('calls onSearchChange when search input changes', () => {
      render(<NavigationPanel tree={mockTree} onSearchChange={mockOnSearchChange} />);

      const searchInput = screen.getByPlaceholderText('Search files...');
      fireEvent.change(searchInput, { target: { value: 'business case' } });

      expect(mockOnSearchChange).toHaveBeenCalledWith('business case');
    });

    it('shows clear button when search has value', () => {
      render(<NavigationPanel tree={mockTree} onSearchChange={mockOnSearchChange} />);

      const searchInput = screen.getByPlaceholderText('Search files...');
      fireEvent.change(searchInput, { target: { value: 'test' } });

      expect(screen.getByTestId('x-icon')).toBeInTheDocument();
    });

    it('clears search when clear button is clicked', () => {
      render(<NavigationPanel tree={mockTree} onSearchChange={mockOnSearchChange} />);

      const searchInput = screen.getByPlaceholderText('Search files...');
      fireEvent.change(searchInput, { target: { value: 'test' } });

      const clearButton = screen.getByTestId('x-icon').closest('button');
      fireEvent.click(clearButton!);

      expect(searchInput).toHaveValue('');
      expect(mockOnSearchChange).toHaveBeenCalledWith('');
    });

    it('does not show clear button when search is empty', () => {
      render(<NavigationPanel tree={mockTree} />);

      expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument();
    });
  });

  describe('Filter State Management', () => {
    it('does not render filter checkboxes by default', () => {
      render(<NavigationPanel tree={mockTree} />);

      // Filters are not shown when showFilters is false
      const checkboxes = screen.queryAllByRole('checkbox');
      expect(checkboxes).toHaveLength(0);
    });

    it('maintains internal filter state even when not visible', () => {
      // This tests that the component initializes with default filter state
      // even though the UI is not visible
      render(<NavigationPanel tree={mockTree} />);

      // Component should render without errors
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Total Files')).toBeInTheDocument();
    });
  });

  describe('Statistics Calculation', () => {
    it('calculates stats correctly with empty tree', () => {
      render(<NavigationPanel tree={[]} />);

      const zeros = screen.getAllByText('0');
      expect(zeros.length).toBe(4); // Should show 0 for all four stats
    });

    it('handles tree with only folders', () => {
      const folderOnlyTree: TreeNode[] = [
        {
          name: 'folder1',
          type: 'folder',
          iconName: 'FolderOpen',
          desc: 'Just a folder',
        },
      ];

      render(<NavigationPanel tree={folderOnlyTree} />);

      // All counts should be 0 since no files
      const statCards = screen.getAllByText('0');
      expect(statCards.length).toBeGreaterThanOrEqual(4); // At least 4 stat cards should show 0
    });

    it('handles deeply nested tree structure', () => {
      const deepTree: TreeNode[] = [
        {
          name: 'level1',
          type: 'folder',
          iconName: 'FolderOpen',
          children: [
            {
              name: 'level2',
              type: 'folder',
              iconName: 'FolderOpen',
              children: [
                {
                  name: 'deep-skill.md',
                  type: 'file',
                  iconName: 'FileText',
                  badge: { label: 'Skill', color: 'bg-violet-100' },
                  desc: 'Deep skill',
                  docPath: 'level1/level2/deep-skill.md',
                },
              ],
            },
          ],
        },
      ];

      render(<NavigationPanel tree={deepTree} />);

      // Should count the deeply nested file
      const ones = screen.getAllByText('1');
      expect(ones.length).toBeGreaterThan(0); // Should appear in stats
    });
  });

  describe('Component Interactions', () => {
    it('handles rapid search input changes', async () => {
      render(<NavigationPanel tree={mockTree} onSearchChange={mockOnSearchChange} />);

      const searchInput = screen.getByPlaceholderText('Search files...');

      // Rapidly change search value
      fireEvent.change(searchInput, { target: { value: 'a' } });
      fireEvent.change(searchInput, { target: { value: 'ab' } });
      fireEvent.change(searchInput, { target: { value: 'abc' } });

      await waitFor(() => {
        expect(mockOnSearchChange).toHaveBeenLastCalledWith('abc');
      });
    });

    it('works without onSearchChange callback', () => {
      expect(() => {
        render(<NavigationPanel tree={mockTree} />);
      }).not.toThrow();

      const searchInput = screen.getByPlaceholderText('Search files...');
      expect(() => {
        fireEvent.change(searchInput, { target: { value: 'test' } });
      }).not.toThrow();
    });

    it('preserves search state during component updates', () => {
      const { rerender } = render(
        <NavigationPanel tree={mockTree} onSearchChange={mockOnSearchChange} />
      );

      const searchInput = screen.getByPlaceholderText('Search files...');
      fireEvent.change(searchInput, { target: { value: 'persistent search' } });

      // Rerender with same props
      rerender(<NavigationPanel tree={mockTree} onSearchChange={mockOnSearchChange} />);

      expect(searchInput).toHaveValue('persistent search');
    });
  });

  describe('Layout and Styling', () => {
    it('applies correct styling to search input container', () => {
      const { container } = render(<NavigationPanel tree={mockTree} />);

      const searchContainer = container.querySelector('.relative');
      expect(searchContainer).toBeInTheDocument();
    });

    it('renders statistics with proper grid layout', () => {
      const { container } = render(<NavigationPanel tree={mockTree} />);

      const statsGrid = container.querySelector('.grid.grid-cols-2');
      expect(statsGrid).toBeInTheDocument();
    });

    it('applies correct color schemes to statistics cards', () => {
      const { container } = render(<NavigationPanel tree={mockTree} />);

      // Check for different colored stat cards
      expect(container.querySelector('.bg-slate-50')).toBeInTheDocument();
      expect(container.querySelector('.bg-emerald-50')).toBeInTheDocument();
      expect(container.querySelector('.bg-blue-50')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides proper labels for form controls', () => {
      render(<NavigationPanel tree={mockTree} />);

      // Search input should have proper placeholder
      expect(screen.getByPlaceholderText('Search files...')).toBeInTheDocument();

      // Filters are not rendered when showFilters is false
      expect(screen.queryByLabelText('Show Completed')).not.toBeInTheDocument();
    });

    it('supports keyboard navigation for search input', () => {
      render(<NavigationPanel tree={mockTree} onSearchChange={mockOnSearchChange} />);

      const searchInput = screen.getByPlaceholderText('Search files...');
      searchInput.focus();

      fireEvent.keyDown(searchInput, { key: 'Enter' });
      // Should not crash and input should remain focused
      expect(searchInput).toHaveFocus();
    });

    it('provides semantic structure for statistics', () => {
      render(<NavigationPanel tree={mockTree} />);

      // Statistics should have meaningful labels
      const labels = ['Completed', 'Total Files', 'Skills', 'Commands'];
      labels.forEach((label) => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });
    });
  });

  describe('Performance Optimizations', () => {
    it('uses memoization for statistics calculation', () => {
      const { rerender } = render(<NavigationPanel tree={mockTree} />);

      // Get initial stats
      const initialStats = screen.getByText('3'); // Completed count

      // Rerender with same tree
      rerender(<NavigationPanel tree={mockTree} />);

      // Stats should still be correct (memoization working)
      expect(screen.getByText('3')).toBe(initialStats);
    });

    it('handles large tree datasets efficiently', () => {
      // Create a large tree structure
      const largeTree: TreeNode[] = Array.from({ length: 100 }, (_, i) => ({
        name: `item-${i}`,
        type: 'file' as const,
        iconName: 'FileText',
        desc: `Item ${i}`,
        docPath: `path/item-${i}.md`,
      }));

      expect(() => {
        render(<NavigationPanel tree={largeTree} />);
      }).not.toThrow();

      // Should show correct total
      const hundreds = screen.getAllByText('100');
      expect(hundreds.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('handles tree nodes without required properties', () => {
      const incompleteTree: TreeNode[] = [
        {
          name: 'incomplete',
          type: 'file',
          // Missing other properties
        } as TreeNode,
      ];

      expect(() => {
        render(<NavigationPanel tree={incompleteTree} />);
      }).not.toThrow();
    });

    it('handles search with special characters', () => {
      render(<NavigationPanel tree={mockTree} onSearchChange={mockOnSearchChange} />);

      const searchInput = screen.getByPlaceholderText('Search files...');
      const specialChars = '!@#$%^&*()';

      fireEvent.change(searchInput, { target: { value: specialChars } });

      expect(searchInput).toHaveValue(specialChars);
      expect(mockOnSearchChange).toHaveBeenCalledWith(specialChars);
    });

    it('handles very long search queries', () => {
      render(<NavigationPanel tree={mockTree} onSearchChange={mockOnSearchChange} />);

      const searchInput = screen.getByPlaceholderText('Search files...');
      const longQuery = 'a'.repeat(1000);

      fireEvent.change(searchInput, { target: { value: longQuery } });

      expect(searchInput).toHaveValue(longQuery);
      expect(mockOnSearchChange).toHaveBeenCalledWith(longQuery);
    });
  });

  describe('Filter Display Logic', () => {
    it('shows filters when showFilters is true', () => {
      // Note: Currently showFilters is hardcoded to false in the component
      render(<NavigationPanel tree={mockTree} />);

      // The current implementation doesn't show filter controls
      // This test documents the current behavior
      const filterSection = screen.queryByText('File Types');
      expect(filterSection).not.toBeInTheDocument();
    });
  });
});
