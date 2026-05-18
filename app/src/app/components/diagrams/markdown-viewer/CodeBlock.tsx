/**
 * CodeBlock Component - Enhanced code display with copy functionality
 *
 * Provides syntax highlighting and copy-to-clipboard functionality for code blocks
 * in markdown content. Supports both inline and block code formats.
 */

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import type { CodeBlockProps } from './types';

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.warn('Failed to copy text:', error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
      title="Copiar código"
      type="button"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

export function CodeBlock({ children, className, inline }: CodeBlockProps) {
  const code = String(children).replace(/\n$/, '');

  // Handle inline code - return only span/code elements that can be inside p tags
  if (inline) {
    return (
      <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 text-sm font-mono">
        {code}
      </code>
    );
  }

  // Extract language from className (e.g., "language-javascript")
  const language = className?.replace('language-', '') || 'text';

  // For block code, return the complete styled code block
  // This will now be properly wrapped by the pre component in MarkdownViewer
  return (
    <div className="bg-slate-900 rounded-lg overflow-hidden">
      {/* Header with language indicator */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <span className="text-xs font-semibold text-slate-300 uppercase">{language}</span>
        <CopyButton text={code} />
      </div>

      {/* Code content */}
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm text-slate-100 font-mono leading-relaxed">{code}</code>
      </pre>
    </div>
  );
}

/**
 * Simple code component for basic markdown rendering
 */
export function SimpleCode({ children, inline }: { children: React.ReactNode; inline?: boolean }) {
  if (inline) {
    return (
      <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 text-sm font-mono">
        {children}
      </code>
    );
  }

  const code = String(children).replace(/\n$/, '');

  return (
    <div className="relative group my-4">
      <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto">
        <code className="text-sm font-mono leading-relaxed">{code}</code>
      </pre>
      <CopyButton text={code} />
    </div>
  );
}
