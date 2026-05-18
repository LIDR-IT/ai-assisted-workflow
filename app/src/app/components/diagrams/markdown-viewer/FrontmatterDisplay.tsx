/**
 * FrontmatterDisplay Component - YAML frontmatter visualization
 *
 * Displays parsed frontmatter in a clean, structured format with:
 * - Key-value pairs
 * - Array values
 * - Proper styling and icons
 * - Type detection
 */

import { Tag, Calendar, User, FileText, GitBranch } from 'lucide-react';
import { formatFrontmatterValue } from './utils/frontmatterParser';
import type { FrontmatterDisplayProps } from './types';

const iconMap: Record<string, React.ComponentType<any>> = {
  id: Tag,
  version: GitBranch,
  last_updated: Calendar,
  updated_by: User,
  status: FileText,
  phase: Tag,
  owner_role: User,
  tier: Tag,
  type: FileText,
  review_cycle: Calendar,
  next_review: Calendar,
  scope: Tag,
};

const importantFields = ['id', 'version', 'status', 'phase', 'tier', 'type'];

export function FrontmatterDisplay({ frontmatter }: FrontmatterDisplayProps) {
  if (!frontmatter || Object.keys(frontmatter).length === 0) {
    return null;
  }

  const entries = Object.entries(frontmatter).filter(([, value]) => value !== undefined) as [
    string,
    string | string[],
  ][];
  const importantEntries = entries.filter(([key]) => importantFields.includes(key));
  const otherEntries = entries.filter(([key]) => !importantFields.includes(key));

  const renderEntry = ([key, value]: [string, string | string[]]) => {
    const IconComponent = iconMap[key] || Tag;
    const formattedValue = formatFrontmatterValue(value);
    const isImportant = importantFields.includes(key);

    return (
      <div
        key={key}
        className={`flex items-start gap-3 ${
          isImportant ? 'border-l-2 border-indigo-200 pl-3' : ''
        }`}
      >
        <div className="flex-shrink-0 mt-0.5">
          <IconComponent size={14} className={isImportant ? 'text-indigo-600' : 'text-slate-400'} />
        </div>
        <div className="flex-1 min-w-0">
          <dt className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            {key.replace(/_/g, ' ')}
          </dt>
          <dd className="text-sm text-slate-800 mt-0.5 break-words">
            {Array.isArray(value) ? (
              <div className="space-y-1">
                {value.map((item, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-700 mr-1"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <span
                className={
                  key === 'status'
                    ? getStatusColor(value)
                    : key === 'version'
                      ? 'font-mono text-indigo-600'
                      : ''
                }
              >
                {formattedValue}
              </span>
            )}
          </dd>
        </div>
      </div>
    );
  };

  return (
    <div className="border border-slate-200 rounded-lg bg-slate-50/50 p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <FileText size={16} className="text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-700">Metadatos del documento</h3>
      </div>

      <dl className="space-y-4">
        {/* Important fields first */}
        {importantEntries.length > 0 && (
          <div className="space-y-3">{importantEntries.map(renderEntry)}</div>
        )}

        {/* Other fields */}
        {otherEntries.length > 0 && importantEntries.length > 0 && (
          <div className="border-t border-slate-200 pt-4">
            <div className="space-y-3">{otherEntries.map(renderEntry)}</div>
          </div>
        )}

        {/* Only other fields if no important ones */}
        {importantEntries.length === 0 && (
          <div className="space-y-3">{otherEntries.map(renderEntry)}</div>
        )}
      </dl>
    </div>
  );
}

function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
      return 'text-green-700 font-medium';
    case 'draft':
      return 'text-yellow-700 font-medium';
    case 'deprecated':
      return 'text-red-700 font-medium';
    case 'completed':
      return 'text-blue-700 font-medium';
    case 'in_progress':
      return 'text-purple-700 font-medium';
    default:
      return 'text-slate-700';
  }
}
