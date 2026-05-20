/**
 * MarkdownViewer - Refactored main component with modular architecture
 *
 * Simplified main container that coordinates between specialized components.
 * Reduced from 994 lines to focused responsibility patterns.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, FileText, Loader2, AlertTriangle } from 'lucide-react';
import { DiagramBlock } from '../DiagramBlock';
import { YamlBlock } from '../YamlBlock';
import { JsonBlock } from '../JsonBlock';
import { MermaidBlock } from './MermaidBlock';
import { FrontmatterDisplay } from './FrontmatterDisplay';
import { CodeBlock } from './CodeBlock';
import { parseFrontmatter } from './utils/frontmatterParser';
import { getPhaseFromPath } from './utils/phaseMapping';
import type { MarkdownFile, PhaseInfo } from './types';

// File glob pattern for all markdown files
export const mdFiles = import.meta.glob<string>(
  [
    '/.claude/skills/**/SKILL.md',
    '/.claude/rules/**/*.md',
    '/docs/**/*.md',
    '/.claude/commands/*.md',
    '/guidelines/*.md',
    '/.claude/agents/*.md',
    '/CLAUDE.md',
    '/.claude/settings.json',
    '/.mcp.json',
    '/.claude/hooks/**/*.sh',
  ],
  { query: '?raw', import: 'default' }
);

export function MarkdownViewer() {
  const { '*': filePath } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState<MarkdownFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<PhaseInfo | null>(null);

  useEffect(() => {
    if (!filePath) {
      setError('No file path specified');
      setLoading(false);
      return;
    }

    loadMarkdownFile(filePath);
  }, [filePath]);

  const loadMarkdownFile = async (path: string) => {
    setLoading(true);
    setError(null);

    try {
      // Find matching file in glob patterns
      const matchingKey = Object.keys(mdFiles).find(
        (key) => key.includes(path) || key.endsWith(path) || path.includes(key.replace(/^\//, ''))
      );

      if (!matchingKey) {
        setError(`File not found: ${path}`);
        setFile(null);
        setLoading(false);
        return;
      }

      const content = await mdFiles[matchingKey]!();
      const { frontmatter, body } = parseFrontmatter(content);
      const phaseInfo = getPhaseFromPath(path);

      setFile({
        path,
        content,
        frontmatter,
        body,
        exists: true,
      });
      setPhase(phaseInfo);
    } catch (err) {
      console.error('Error loading file:', err);
      setError(`Failed to load file: ${path}`);
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={24} className="animate-spin text-indigo-600" />
        <span className="ml-3 text-slate-600">Cargando documento...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Error</h2>
        <p className="text-slate-600 mb-4">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver
        </button>
      </div>
    );
  }

  if (!file) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver
        </button>
        {phase && (
          <span className={`px-2 py-1 rounded text-xs font-semibold ${phase.color}`}>
            {phase.label}
          </span>
        )}
      </div>

      {/* File Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <FileText size={20} className="text-slate-500" />
          <h1 className="text-2xl font-bold text-slate-800">
            {file.path
              .split('/')
              .pop()
              ?.replace(/\.(md|json|sh)$/, '') || 'Document'}
          </h1>
        </div>
        <p className="text-sm text-slate-500 font-mono">{file.path}</p>
      </div>

      {/* Frontmatter */}
      {file.frontmatter && <FrontmatterDisplay frontmatter={file.frontmatter} />}

      {/* Document Content */}
      <div className="prose prose-slate max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Code blocks
            code({ children, className, ...props }) {
              const inline = 'inline' in props ? Boolean(props.inline) : false;

              // For block code, we need to prevent it from being wrapped in p tags
              // Return null here and let the pre component handle it
              if (!inline) {
                return null;
              }

              return (
                <CodeBlock children={String(children)} className={className} inline={inline} />
              );
            },

            // Pre blocks - ensure block-level rendering for non-inline code
            pre({ children, ...props }) {
              // Check if this is a mermaid diagram first
              const childArray = Array.isArray(children) ? children : [children];
              const child = childArray[0];
              if (
                child &&
                typeof child === 'object' &&
                'props' in child &&
                child.props?.className === 'language-mermaid'
              ) {
                return <MermaidBlock code={String(child.props.children)} />;
              }

              // Extract the code content for block code
              if (child && typeof child === 'object' && 'props' in child) {
                const code = String(child.props.children).replace(/\n$/, '');
                const className = child.props.className || '';

                return (
                  <div className="relative group my-4">
                    <CodeBlock children={code} className={className} inline={false} />
                  </div>
                );
              }

              // Fallback for other pre content
              return (
                <pre
                  className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto my-4"
                  {...props}
                >
                  {children}
                </pre>
              );
            },

            // Custom block handling
            div({ className, children }) {
              if (className?.includes('diagram-block')) {
                return <DiagramBlock code={String(children)} />;
              }
              if (className?.includes('yaml-block')) {
                return <YamlBlock code={String(children)} />;
              }
              if (className?.includes('json-block')) {
                return <JsonBlock code={String(children)} />;
              }
              return <div className={className}>{children}</div>;
            },

            // Typography
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">{children}</h3>
            ),

            // Links
            a: ({ href, children }) => (
              <a
                href={href}
                className="text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),

            // Lists
            ul: ({ children }) => (
              <ul className="list-disc list-outside ml-5 mb-3 space-y-1 text-sm text-slate-700">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-outside ml-5 mb-3 space-y-1 text-sm text-slate-700">
                {children}
              </ol>
            ),

            // Tables
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table className="w-full text-sm border-collapse border border-slate-300">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border border-slate-300 px-3 py-2 bg-slate-100 text-left font-semibold">
                {children}
              </th>
            ),
            td: ({ children }) => <td className="border border-slate-300 px-3 py-2">{children}</td>,
          }}
        >
          {file.body}
        </ReactMarkdown>
      </div>
    </div>
  );
}
