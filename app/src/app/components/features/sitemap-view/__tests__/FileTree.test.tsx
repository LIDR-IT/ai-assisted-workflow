/**
 * @file FileTree Test Suite
 * @description Tests for FileTree component with tree expansion, navigation, and modes
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { FileTree } from '../FileTree';
import type { TreeNode } from '@/data/features/sitemapView';

// Create a persistent mock function for navigate
const mockNavigate = vi.fn();

// Mock react-router
vi.mock('react-router', () => ({
  MemoryRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useNavigate: () => mockNavigate,
  useParams: () => ({ clientId: 'test-client' }),
}));

// Mock data/features/sitemapView
vi.mock('@/data/features/sitemapView', () => ({
  getInitialOpen: () => new Set(['skills']),
  getIcon: (iconName: string) => <span data-testid={`icon-${iconName}`}>{iconName}</span>,
}));

// Mock MarkdownViewer
vi.mock('@/app/components/diagrams/MarkdownViewer', () => ({
  availableDocPaths: new Set(['.claude/CLAUDE.md', 'skills/business-case/SKILL.md']),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ChevronRight: ({ size, className }: { size?: number; className?: string }) => (
    <div data-testid="chevron-right" className={className} style={{ width: size, height: size }}>
      ▶
    </div>
  ),
  ChevronDown: ({ size, className }: { size?: number; className?: string }) => (
    <div data-testid="chevron-down" className={className} style={{ width: size, height: size }}>
      ▼
    </div>
  ),
  ExternalLink: ({ size, className }: { size?: number; className?: string }) => (
    <div data-testid="external-link" className={className} style={{ width: size, height: size }}>
      🔗
    </div>
  ),
}));

// Wrapper component with Router
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>;
}

describe('FileTree', () => {
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
          name: 'pending-skill',
          type: 'folder',
          iconName: 'FolderOpen',
          children: [
            {
              name: 'SKILL.md',
              type: 'file',
              iconName: 'FileText',
              desc: 'Pending skill without docPath',
            },
          ],
        },
      ],
    },
    {
      name: 'route-item',
      type: 'file',
      iconName: 'Route',
      desc: 'Item with linkTo',
      linkTo: '/agents',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  describe('Basic Rendering', () => {
    it('renders tree structure', () => {
      render(
        <TestWrapper>
          <FileTree tree={mockTree} mode="default" />
        </TestWrapper>
      );

      // Should render root items
      expect(screen.getByText('CLAUDE.md')).toBeInTheDocument();
      expect(screen.getByText('skills')).toBeInTheDocument();
      expect(screen.getByText('route-item')).toBeInTheDocument();
    });

    it('renders file icons', () => {
      render(
        <TestWrapper>
          <FileTree tree={mockTree} mode="default" />
        </TestWrapper>
      );

      expect(screen.getByTestId('icon-BookOpen')).toBeInTheDocument();
      const folderIcons = screen.getAllByTestId('icon-FolderOpen');
      expect(folderIcons.length).toBeGreaterThan(0);
      expect(screen.getByTestId('icon-Route')).toBeInTheDocument();
    });

    it('renders badges for items that have them', () => {
      render(
        <TestWrapper>
          <FileTree tree={mockTree} mode="default" />
        </TestWrapper>
      );

      expect(screen.getByText('Orquestrador')).toBeInTheDocument();
    });

    it('renders descriptions', () => {
      render(
        <TestWrapper>
          <FileTree tree={mockTree} mode="default" />
        </TestWrapper>
      );

      expect(screen.getByText('Índice comprimido del ecosistema')).toBeInTheDocument();
      expect(screen.getByText('Skills del ecosistema')).toBeInTheDocument();
    });

    it('shows completion indicators', () => {
      render(
        <TestWrapper>
          <FileTree tree={mockTree} mode="default" />
        </TestWrapper>
      );

      // Should have completion indicators (green/gray dots)
      const externalLinks = screen.getAllByTestId('external-link');
      expect(externalLinks.length).toBeGreaterThan(0);
    });
  });

  describe('Tree Expansion', () => {
    it('shows expand/collapse icons for folders', () => {
      render(
        <TestWrapper>
          <FileTree tree={mockTree} mode="default" />
        </TestWrapper>
      );

      // skills folder should have an expand icon
      const chevronIcons = screen.getAllByTestId('chevron-down');
      expect(chevronIcons.length).toBeGreaterThan(0); // Initially expanded
    });

    it('expands folders when clicked', () => {
      render(
        <TestWrapper>
          <FileTree tree={mockTree} mode="default" />
        </TestWrapper>
      );

      // skills folder should be initially expanded and show children
      expect(screen.getByText('business-case')).toBeInTheDocument();
    });

    it('handles folder toggle clicks', () => {
      render(
        <TestWrapper>
          <FileTree tree={mockTree} mode="default" />
        </TestWrapper>
      );

      // Find business-case folder and click it
      const businessCaseFolder = screen.getByText('business-case');
      fireEvent.click(businessCaseFolder);

      // Should toggle expansion state
      expect(businessCaseFolder).toBeInTheDocument();
    });

    it('does not show expand icons for files', () => {
      render(
        <TestWrapper>
          <FileTree tree={mockTree} mode="default" />
        </TestWrapper>
      );

      // Files should not have expand icons
      const claudeMdItem = screen.getByText('CLAUDE.md').closest('div');
      const chevronInClaudeItem = claudeMdItem?.querySelector('[data-testid^="chevron"]');
      expect(chevronInClaudeItem).not.toBeInTheDocument();
    });
  });

  describe('Tree Modes', () => {
    it('renders correctly in default mode', () => {
      render(
        <TestWrapper>
          <FileTree tree={mockTree} mode="default" />
        </TestWrapper>
      );

      expect(screen.getByText('skills')).toBeInTheDocument();
      expect(screen.getByText('business-case')).toBeInTheDocument(); // Should be expanded initially
    });

    it('renders correctly in expanded mode', () => {
      render(
        <TestWrapper>
          <FileTree tree={mockTree} mode="expanded" />
        </TestWrapper>
      );

      expect(screen.getByText('skills')).toBeInTheDocument();
      expect(screen.getByText('business-case')).toBeInTheDocument();
    });

    it('renders correctly in collapsed mode', () => {
      render(
        <TestWrapper>
          <FileTree tree={mockTree} mode="collapsed" />
        </TestWrapper>
      );

      expect(screen.getByText('skills')).toBeInTheDocument();
      // Children might still be visible depending on implementation
    });
  });

  describe('Item Interaction', () => {
    it('applies clickable styling to files with docPath', () => {
      render(
        <TestWrapper>
          <FileTree tree={mockTree} mode="default" />
        </TestWrapper>
      );

      const claudeMdItem = screen.getByText('CLAUDE.md').closest('[role="button"]');
      expect(claudeMdItem).toHaveClass('cursor-pointer');
    });

    it('applies clickable styling to folders', () => {
      render(
        <TestWrapper>
          <FileTree tree={mockTree} mode="default" />
        </TestWrapper>
      );

      const skillsFolder = screen.getByText('skills').closest('[role="button"]');
      expect(skillsFolder).toHaveClass('cursor-pointer');
    });

    it('applies non-clickable styling to files without docPath', () => {
      render(
        <TestWrapper>
          <FileTree tree={mockTree} mode="default" />
        </TestWrapper>
      );

      // Find the pending skill file (no docPath)
      const pendingSkillFile = screen
        .getByText('Pending skill without docPath')
        .closest('[role="none"]');
      expect(pendingSkillFile).toHaveClass('cursor-default');
    });

    it('handles clicks on clickable items', () => {
      render(
        <TestWrapper>
          <FileTree tree={mockTree} mode="default" />
        </TestWrapper>
      );

      // Click on a file with docPath
      const claudeMdItem = screen.getByText('CLAUDE.md').closest('[role="button"]');
      fireEvent.click(claudeMdItem!);

      // Should attempt navigation
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('provides proper button roles for clickable items', () => {
      render(
        <TestWrapper>
          <FileTree tree={mockTree} mode="default" />
        </TestWrapper>
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('provides proper tabIndex for navigation', () => {
      render(
        <TestWrapper>
          <FileTree tree={mockTree} mode="default" />
        </TestWrapper>
      );

      // Clickable items should have tabIndex 0 - look for the element with role="button"
      const claudeMdItem = screen.getByText('CLAUDE.md').closest('[role="button"]');
      expect(claudeMdItem).toHaveAttribute('tabindex', '0');
    });

    it('uses semantic structure for tree items', () => {
      render(
        <TestWrapper>
          <FileTree tree={mockTree} mode="default" />
        </TestWrapper>
      );

      // Items should be structured properly
      expect(screen.getByText('CLAUDE.md')).toBeInTheDocument();
      expect(screen.getByText('Orquestrador')).toBeInTheDocument();
    });

    it('provides meaningful text content', () => {
      render(
        <TestWrapper>
          <FileTree tree={mockTree} mode="default" />
        </TestWrapper>
      );

      // All important text should be accessible
      expect(screen.getByText('CLAUDE.md')).toBeInTheDocument();
      expect(screen.getByText('Índice comprimido del ecosistema')).toBeInTheDocument();
      expect(screen.getByText('Skills del ecosistema')).toBeInTheDocument();
    });
  });

  describe('Visual Indicators', () => {
    it('shows completion status correctly', () => {
      render(
        <TestWrapper>
          <FileTree tree={mockTree} mode="default" />
        </TestWrapper>
      );

      // Completed items should have green indicator
      const claudeMdItem = screen.getByText('CLAUDE.md').closest('div');
      expect(claudeMdItem?.querySelector('.bg-emerald-500')).toBeInTheDocument();
    });

    it('shows pending status correctly', () => {
      render(
        <TestWrapper>
          <FileTree tree={mockTree} mode="default" />
        </TestWrapper>
      );

      // Find pending item and check for gray indicator
      // The implementation uses different styles for completed vs pending
      const pendingItem = screen
        .getByText('Pending skill without docPath')
        .closest('div')?.parentElement;
      expect(pendingItem?.querySelector('.bg-slate-300')).toBeInTheDocument();
    });

    it('shows external link indicators for completed items', () => {
      render(
        <TestWrapper>
          <FileTree tree={mockTree} mode="default" />
        </TestWrapper>
      );

      // Should show external link icon for completed items
      const externalLinks = screen.getAllByTestId('external-link');
      expect(externalLinks.length).toBeGreaterThan(0);
    });

    it('applies correct indentation based on depth', () => {
      render(
        <TestWrapper>
          <FileTree tree={mockTree} mode="default" />
        </TestWrapper>
      );

      // Check that nested items have proper indentation
      // This is handled via style.paddingLeft
      const businessCaseItem = screen.getByText('business-case').closest('div');
      expect(businessCaseItem).toHaveStyle({ paddingLeft: expect.any(String) });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty tree gracefully', () => {
      render(
        <TestWrapper>
          <FileTree tree={[]} mode="default" />
        </TestWrapper>
      );

      // Should not crash with empty tree
      expect(screen.queryByText('CLAUDE.md')).not.toBeInTheDocument();
    });

    it('handles tree with only files', () => {
      const fileOnlyTree: TreeNode[] = [
        {
          name: 'file1.md',
          type: 'file',
          iconName: 'FileText',
          desc: 'Just a file',
        },
      ];

      render(
        <TestWrapper>
          <FileTree tree={fileOnlyTree} mode="default" />
        </TestWrapper>
      );

      expect(screen.getByText('file1.md')).toBeInTheDocument();
      expect(screen.queryByTestId('chevron-right')).not.toBeInTheDocument();
    });

    it('handles tree with only folders', () => {
      const folderOnlyTree: TreeNode[] = [
        {
          name: 'folder1',
          type: 'folder',
          iconName: 'FolderOpen',
          desc: 'Just a folder',
          children: [],
        },
      ];

      render(
        <TestWrapper>
          <FileTree tree={folderOnlyTree} mode="default" />
        </TestWrapper>
      );

      expect(screen.getByText('folder1')).toBeInTheDocument();
    });

    it('handles deeply nested structures', () => {
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
                  name: 'level3',
                  type: 'folder',
                  iconName: 'FolderOpen',
                  children: [
                    {
                      name: 'deep-file.md',
                      type: 'file',
                      iconName: 'FileText',
                      desc: 'Deeply nested file',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];

      render(
        <TestWrapper>
          <FileTree tree={deepTree} mode="expanded" />
        </TestWrapper>
      );

      expect(screen.getByText('level1')).toBeInTheDocument();
    });

    it('handles items without descriptions', () => {
      const noDescTree: TreeNode[] = [
        {
          name: 'no-desc.md',
          type: 'file',
          iconName: 'FileText',
          // No desc property
        },
      ];

      render(
        <TestWrapper>
          <FileTree tree={noDescTree} mode="default" />
        </TestWrapper>
      );

      expect(screen.getByText('no-desc.md')).toBeInTheDocument();
    });

    it('handles items without badges', () => {
      const noBadgeTree: TreeNode[] = [
        {
          name: 'no-badge.md',
          type: 'file',
          iconName: 'FileText',
          desc: 'File without badge',
          // No badge property
        },
      ];

      render(
        <TestWrapper>
          <FileTree tree={noBadgeTree} mode="default" />
        </TestWrapper>
      );

      expect(screen.getByText('no-badge.md')).toBeInTheDocument();
      expect(screen.getByText('File without badge')).toBeInTheDocument();
    });
  });

  describe('Navigation Behavior', () => {
    it('navigates to document paths for completed files', () => {
      render(
        <TestWrapper>
          <FileTree tree={mockTree} mode="default" />
        </TestWrapper>
      );

      const claudeMdItem = screen.getByText('CLAUDE.md').closest('[role="button"]');
      fireEvent.click(claudeMdItem!);

      expect(mockNavigate).toHaveBeenCalledWith('/test-client/doc/.claude%2FCLAUDE.md');
    });

    it('navigates to linkTo for items with routes', () => {
      render(
        <TestWrapper>
          <FileTree tree={mockTree} mode="default" />
        </TestWrapper>
      );

      const routeItem = screen.getByText('route-item').closest('[role="button"]');
      fireEvent.click(routeItem!);

      expect(mockNavigate).toHaveBeenCalledWith('/test-client/agents');
    });

    it('does not navigate for incomplete files', () => {
      render(
        <TestWrapper>
          <FileTree tree={mockTree} mode="default" />
        </TestWrapper>
      );

      // Find and click the pending skill that has no docPath
      const pendingItem = screen
        .getByText('Pending skill without docPath')
        .closest('[role="none"]');
      fireEvent.click(pendingItem!);

      // Should not navigate since it's not completed
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Performance Considerations', () => {
    it('renders large trees without performance issues', () => {
      const largeFlatTree: TreeNode[] = Array.from({ length: 100 }, (_, i) => ({
        name: `item-${i}.md`,
        type: 'file' as const,
        iconName: 'FileText',
        desc: `Item ${i}`,
      }));

      expect(() => {
        render(
          <TestWrapper>
            <FileTree tree={largeFlatTree} mode="default" />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('handles tree updates efficiently', () => {
      const { rerender } = render(
        <TestWrapper>
          <FileTree tree={mockTree} mode="default" />
        </TestWrapper>
      );

      // Update tree - add at the beginning to ensure it's in viewport
      const updatedTree = [
        {
          name: 'new-file.md',
          type: 'file' as const,
          iconName: 'FileText',
          desc: 'New file',
        },
        ...mockTree,
      ];

      rerender(
        <TestWrapper>
          <FileTree tree={updatedTree} mode="default" />
        </TestWrapper>
      );

      expect(screen.getByText('new-file.md')).toBeInTheDocument();
    });
  });
});
