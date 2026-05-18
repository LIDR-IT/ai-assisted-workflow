/**
 * @file AIBadge Test Suite
 * @description Tests for AIBadge component with different AI assistance types
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AIBadge } from '../AIBadge';
import type { Template } from '@/data/features/handoffsTemplates';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Brain: ({ size }: { size: number }) => (
    <div data-testid="brain-icon" style={{ width: size, height: size }}>
      🧠
    </div>
  ),
  FileCode2: ({ size }: { size: number }) => (
    <div data-testid="file-code-icon" style={{ width: size, height: size }}>
      📄
    </div>
  ),
  Terminal: ({ size }: { size: number }) => (
    <div data-testid="terminal-icon" style={{ width: size, height: size }}>
      💻
    </div>
  ),
  Zap: ({ size }: { size: number }) => (
    <div data-testid="zap-icon" style={{ width: size, height: size }}>
      ⚡
    </div>
  ),
  Bot: ({ size }: { size: number }) => (
    <div data-testid="bot-icon" style={{ width: size, height: size }}>
      🤖
    </div>
  ),
  Cable: ({ size }: { size: number }) => (
    <div data-testid="cable-icon" style={{ width: size, height: size }}>
      🔌
    </div>
  ),
}));

describe('AIBadge', () => {
  describe('Skill Type Badge', () => {
    it('renders skill badge with correct icon and styling', () => {
      render(<AIBadge type="skill" claudePath="skills/business-case" />);

      const badge = screen.getByText('Skill').closest('span');
      expect(badge).toHaveClass('bg-violet-100', 'text-violet-700', 'border-violet-200');
      expect(screen.getByTestId('brain-icon')).toBeInTheDocument();
      expect(screen.getByText('Skill')).toBeInTheDocument();
    });

    it('shows tooltip with Claude path for skills', () => {
      render(<AIBadge type="skill" claudePath="skills/business-case" />);

      const badge = screen.getByText(/Skill|Rule|Command|Hook|Agent|MCP/).closest('span');
      expect(badge).toHaveAttribute('title', 'skills/business-case');
    });
  });

  describe('Rule Type Badge', () => {
    it('renders rule badge with correct icon and styling', () => {
      render(<AIBadge type="rule" claudePath="rules/org" />);

      const badge = screen.getByText(/Skill|Rule|Command|Hook|Agent|MCP/).closest('span');
      expect(badge).toHaveClass('bg-emerald-100', 'text-emerald-700', 'border-emerald-200');
      expect(screen.getByTestId('file-code-icon')).toBeInTheDocument();
      expect(screen.getByText('Rule')).toBeInTheDocument();
    });

    it('shows tooltip with Claude path for rules', () => {
      render(<AIBadge type="rule" claudePath="rules/org" />);

      const badge = screen.getByText(/Skill|Rule|Command|Hook|Agent|MCP/).closest('span');
      expect(badge).toHaveAttribute('title', 'rules/org');
    });
  });

  describe('Command Type Badge', () => {
    it('renders command badge with correct icon and styling', () => {
      render(<AIBadge type="command" claudePath="commands/implement-ticket" />);

      const badge = screen.getByText(/Skill|Rule|Command|Hook|Agent|MCP/).closest('span');
      expect(badge).toHaveClass('bg-indigo-100', 'text-indigo-700', 'border-indigo-200');
      expect(screen.getByTestId('terminal-icon')).toBeInTheDocument();
      expect(screen.getByText('Command')).toBeInTheDocument();
    });
  });

  describe('Hook Type Badge', () => {
    it('renders hook badge with correct icon and styling', () => {
      render(<AIBadge type="hook" claudePath="hooks/dtc-write-guard" />);

      const badge = screen.getByText(/Skill|Rule|Command|Hook|Agent|MCP/).closest('span');
      expect(badge).toHaveClass('bg-amber-100', 'text-amber-700', 'border-amber-200');
      expect(screen.getByTestId('zap-icon')).toBeInTheDocument();
      expect(screen.getByText('Hook')).toBeInTheDocument();
    });
  });

  describe('Agent Type Badge', () => {
    it('renders agent badge with correct icon and styling', () => {
      render(<AIBadge type="agent" claudePath="agents/qa-agent" />);

      const badge = screen.getByText(/Skill|Rule|Command|Hook|Agent|MCP/).closest('span');
      expect(badge).toHaveClass('bg-orange-100', 'text-orange-700', 'border-orange-200');
      expect(screen.getByTestId('bot-icon')).toBeInTheDocument();
      expect(screen.getByText('Agent')).toBeInTheDocument();
    });
  });

  describe('MCP Type Badge', () => {
    it('renders MCP badge with correct icon and styling', () => {
      render(<AIBadge type="mcp" claudePath="mcp/filesystem" />);

      const badge = screen.getByText(/Skill|Rule|Command|Hook|Agent|MCP/).closest('span');
      expect(badge).toHaveClass('bg-blue-100', 'text-blue-700', 'border-blue-200');
      expect(screen.getByTestId('cable-icon')).toBeInTheDocument();
      expect(screen.getByText('MCP')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('returns null when type is undefined', () => {
      const { container } = render(<AIBadge type={undefined} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders without Claude path', () => {
      render(<AIBadge type="skill" />);

      const badge = screen.getByText(/Skill|Rule|Command|Hook|Agent|MCP/).closest('span');
      expect(badge).not.toHaveAttribute('title');
      expect(screen.getByText('Skill')).toBeInTheDocument();
    });

    it('handles empty Claude path', () => {
      render(<AIBadge type="command" claudePath="" />);

      const badge = screen.getByText(/Skill|Rule|Command|Hook|Agent|MCP/).closest('span');
      expect(badge).toHaveAttribute('title', '');
      expect(screen.getByText('Command')).toBeInTheDocument();
    });
  });

  describe('Icon Size and Layout', () => {
    it('renders icons with correct size', () => {
      render(<AIBadge type="skill" />);

      const icon = screen.getByTestId('brain-icon');
      expect(icon).toHaveStyle({ width: '10px', height: '10px' });
    });

    it('applies correct CSS classes for layout', () => {
      render(<AIBadge type="rule" />);

      const badge = screen.getByText(/Skill|Rule|Command|Hook|Agent|MCP/).closest('span');
      expect(badge).toHaveClass(
        'inline-flex',
        'items-center',
        'gap-0.5',
        'px-1.5',
        'py-0.5',
        'rounded',
        'border',
        'text-[9px]',
        'font-semibold'
      );
    });
  });

  describe('Type Safety', () => {
    it('handles all valid Template aiAssist types', () => {
      const validTypes: NonNullable<Template['aiAssist']>[] = [
        'skill',
        'rule',
        'command',
        'hook',
        'agent',
        'mcp',
      ];

      validTypes.forEach((type) => {
        const { unmount } = render(<AIBadge type={type} />);

        // Handle special case for MCP which is fully capitalized
        const expectedText = type === 'mcp' ? 'MCP' : type.charAt(0).toUpperCase() + type.slice(1);
        expect(screen.getByText(expectedText)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Visual Consistency', () => {
    it('maintains consistent badge structure across all types', () => {
      const types: NonNullable<Template['aiAssist']>[] = [
        'skill',
        'rule',
        'command',
        'hook',
        'agent',
        'mcp',
      ];

      types.forEach((type) => {
        const { unmount } = render(<AIBadge type={type} claudePath={`path/${type}`} />);

        // Each badge should have consistent structure and tooltip
        const badge = screen.getByText(/Skill|Rule|Command|Hook|Agent|MCP/).closest('span');
        expect(badge).toHaveAttribute('title', `path/${type}`);

        // Badge should contain both icon and text
        const expectedText = type === 'mcp' ? 'MCP' : type.charAt(0).toUpperCase() + type.slice(1);
        expect(badge).toHaveTextContent(expectedText);

        unmount();
      });
    });

    it('uses distinct color schemes for each type', () => {
      const colorTests = [
        { type: 'skill' as const, colorClass: 'bg-violet-100' },
        { type: 'rule' as const, colorClass: 'bg-emerald-100' },
        { type: 'command' as const, colorClass: 'bg-indigo-100' },
        { type: 'hook' as const, colorClass: 'bg-amber-100' },
        { type: 'agent' as const, colorClass: 'bg-orange-100' },
        { type: 'mcp' as const, colorClass: 'bg-blue-100' },
      ];

      colorTests.forEach(({ type, colorClass }) => {
        const { unmount } = render(<AIBadge type={type} />);
        const badge = screen.getByText(/Skill|Rule|Command|Hook|Agent|MCP/).closest('span');
        expect(badge).toHaveClass(colorClass);
        unmount();
      });
    });
  });

  describe('Accessibility', () => {
    it('provides meaningful tooltip text', () => {
      render(<AIBadge type="skill" claudePath="skills/business-case" />);

      const badge = screen.getByText(/Skill|Rule|Command|Hook|Agent|MCP/).closest('span');
      expect(badge).toHaveAttribute('title', 'skills/business-case');
    });

    it('uses semantic markup with appropriate text content', () => {
      render(<AIBadge type="agent" />);

      // Text should be readable and meaningful
      expect(screen.getByText('Agent')).toBeInTheDocument();
    });

    it('maintains readable contrast with background colors', () => {
      render(<AIBadge type="skill" />);

      // Violet background should use violet text for good contrast
      const badge = screen.getByText(/Skill|Rule|Command|Hook|Agent|MCP/).closest('span');
      expect(badge).toHaveClass('bg-violet-100', 'text-violet-700');
    });
  });
});
