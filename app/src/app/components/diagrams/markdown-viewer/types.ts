/**
 * MarkdownViewer Types - Shared interfaces for the modular architecture
 */

export interface FrontmatterData {
  [key: string]: string | string[] | undefined;
}

export interface MarkdownFile {
  path: string;
  content: string;
  frontmatter: FrontmatterData | null;
  body: string;
  exists: boolean;
}

export interface PhaseInfo {
  label: string;
  color: string;
}

export interface MermaidBlockProps {
  code: string;
  id?: string;
}

export interface CodeBlockProps {
  children: string;
  className?: string;
  inline?: boolean;
}

export interface NavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export interface MarkdownHeaderProps {
  file: MarkdownFile;
  phase?: PhaseInfo | null;
}

export interface FrontmatterDisplayProps {
  frontmatter: FrontmatterData;
}

export interface MarkdownRendererProps {
  content: string;
  frontmatter?: FrontmatterData | null;
}
