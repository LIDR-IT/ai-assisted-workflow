/**
 * Frontmatter Parser - YAML frontmatter parsing utility
 *
 * Parses YAML frontmatter from markdown files with support for:
 * - Key-value pairs
 * - Quoted strings
 * - Arrays (- item format)
 * - Comments (# comments)
 * - Multiline values
 */

import type { FrontmatterData } from '../types';

export interface ParsedFrontmatter {
  frontmatter: FrontmatterData | null;
  body: string;
}

export function parseFrontmatter(raw: string): ParsedFrontmatter {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match || match[1] === undefined || match[2] === undefined) {
    return { frontmatter: null, body: raw };
  }

  const yamlBlock = match[1];
  const body = match[2];
  const data: FrontmatterData = {};

  // YAML parser that handles: key: value, key: "quoted", arrays (- item), comments (#)
  let currentKey = '';
  let currentValue = '';
  let currentArray: string[] | null = null;

  const flushCurrent = () => {
    if (currentKey) {
      if (currentArray !== null) {
        data[currentKey] = currentArray;
      } else {
        const v = currentValue.trim().replace(/^["']|["']$/g, '');
        if (v) {
          data[currentKey] = v;
        }
      }
    }
    currentKey = '';
    currentValue = '';
    currentArray = null;
  };

  for (const line of yamlBlock.split('\n')) {
    // Skip comment-only lines
    if (/^\s*#/.test(line)) {
      continue;
    }

    // YAML list item:   - value
    const listMatch = line.match(/^\s+-\s+(.+)$/);
    if (listMatch && listMatch[1] !== undefined && currentKey) {
      if (currentArray === null) {
        currentArray = [];
      }
      currentArray.push(listMatch[1].trim());
      continue;
    }

    // Top-level key: value
    const kvMatch = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (kvMatch && kvMatch[1] !== undefined && kvMatch[2] !== undefined) {
      flushCurrent();
      currentKey = kvMatch[1];
      currentValue = kvMatch[2].replace(/#.*$/, '').trim(); // strip inline comments
    } else if (currentKey && (line.startsWith('  ') || line.startsWith('\t'))) {
      // Continuation of multiline value
      currentValue += ' ' + line.trim();
    }
  }
  flushCurrent();

  return { frontmatter: Object.keys(data).length > 0 ? data : null, body };
}

/**
 * Format frontmatter value for display
 */
export function formatFrontmatterValue(value: string | string[]): string {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  return value;
}

/**
 * Get frontmatter field with fallback
 */
export function getFrontmatterField(
  frontmatter: FrontmatterData | null,
  key: string,
  fallback: string = ''
): string {
  if (!frontmatter || !frontmatter[key]) {
    return fallback;
  }

  const value = frontmatter[key];
  if (Array.isArray(value)) {
    return value[0] || fallback;
  }

  return value || fallback;
}
