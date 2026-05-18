/**
 * MarkdownViewer - Refactored entry point
 *
 * This component has been refactored from a 994-line monolith into a modular architecture.
 * The main implementation now lives in ./markdown-viewer/ with focused components.
 *
 * Original: 994 lines monolithic component
 * Current: 8 focused components totaling ~1,140 lines with enhanced functionality
 *
 * Components:
 * - MarkdownViewer.tsx (272 lines) - Main container
 * - MermaidBlock.tsx (191 lines) - Diagram rendering with controls
 * - FrontmatterDisplay.tsx (143 lines) - YAML metadata display
 * - CodeBlock.tsx (105 lines) - Code blocks with copy functionality
 * - Utils (361 lines) - Frontmatter parser and phase mapping
 * - Types (49 lines) - TypeScript interfaces
 * - Index (20 lines) - Barrel exports
 */

export { MarkdownViewer, mdFiles } from './markdown-viewer/MarkdownViewer';

// Compute available doc paths for integrity tests
export const availableDocPaths = new Set(
  Object.keys(
    import.meta.glob<string>(
      [
        '/.claude/skills/**/SKILL.md',
        '/.claude/rules/*.md',
        '/docs/**/*.md',
        '/.claude/commands/*.md',
        '/guidelines/*.md',
        '/.claude/agents/*.md',
        '/.claude/CLAUDE.md',
        '/.claude/settings.json',
        '/.mcp.json',
        '/.claude-env',
        '/.claude/hooks/*.sh',
      ],
      { query: '?raw', import: 'default' }
    )
  ).map((path) => path.replace(/^\//, ''))
);
