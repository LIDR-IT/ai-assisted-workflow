import { useState, useMemo, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import type { TreeNode } from '@/data/features/sitemapView';

interface NavigationPanelProps {
  tree: TreeNode[];
  onSearchChange?: (query: string) => void;
}

interface FilterState {
  showCompleted: boolean;
  showPending: boolean;
  fileTypes: Set<string>;
  phases: Set<string>;
}

const FILE_TYPES = ['skill', 'command', 'rule', 'hook', 'template', 'doc'];
// Unified phase model (BMad × LIDR): 5 phases; legacy phases 0-8 survive as stages inside them
const PHASES = [
  'Fase 0 — Context & Anytime',
  'Fase 1 — Analysis',
  'Fase 2 — Planning',
  'Fase 3 — Solutioning',
  'Fase 4 — Implementation',
];

export function NavigationPanel({ tree, onSearchChange }: NavigationPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    showCompleted: true,
    showPending: true,
    fileTypes: new Set(FILE_TYPES),
    phases: new Set(PHASES),
  });

  // Handle search
  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      onSearchChange?.(query);
    },
    [onSearchChange]
  );

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    onSearchChange?.('');
  }, [onSearchChange]);

  // Update filter state
  const updateFilter = useCallback((key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Toggle file type filter
  const toggleFileType = useCallback((type: string) => {
    setFilters((prev) => {
      const newFileTypes = new Set(prev.fileTypes);
      if (newFileTypes.has(type)) {
        newFileTypes.delete(type);
      } else {
        newFileTypes.add(type);
      }
      return { ...prev, fileTypes: newFileTypes };
    });
  }, []);

  // Count stats from tree
  const stats = useMemo(() => {
    let total = 0;
    let completed = 0;
    let skills = 0;
    let commands = 0;

    function countNodes(nodes: TreeNode[]) {
      nodes.forEach((node) => {
        if (node.type === 'file') {
          total++;
          if (node.docPath || node.linkTo) {
            completed++;
          }
          if (node.badge?.label === 'Skill' || node.desc?.includes('skill')) {
            skills++;
          }
          if (node.badge?.label === 'Command' || node.desc?.includes('command')) {
            commands++;
          }
        }
        if (node.children) {
          countNodes(node.children);
        }
      });
    }

    countNodes(tree);
    return { total, completed, skills, commands };
  }, [tree]);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <div className="text-lg font-semibold text-slate-900">{stats.completed}</div>
          <div className="text-xs text-slate-600">Completed</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <div className="text-lg font-semibold text-slate-900">{stats.total}</div>
          <div className="text-xs text-slate-600">Total Files</div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <div className="text-lg font-semibold text-emerald-700">{stats.skills}</div>
          <div className="text-xs text-emerald-600">Skills</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-lg font-semibold text-blue-700">{stats.commands}</div>
          <div className="text-xs text-blue-600">Commands</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="space-y-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
          {/* Completion Status */}
          <div>
            <div className="text-xs font-medium text-slate-700 mb-2">Status</div>
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={filters.showCompleted}
                  onChange={(e) => updateFilter('showCompleted', e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Completed</span>
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={filters.showPending}
                  onChange={(e) => updateFilter('showPending', e.target.checked)}
                  className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                />
                <span>Pending</span>
              </label>
            </div>
          </div>

          {/* File Types */}
          <div>
            <div className="text-xs font-medium text-slate-700 mb-2">File Types</div>
            <div className="grid grid-cols-2 gap-1">
              {FILE_TYPES.map((type) => (
                <label key={type} className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={filters.fileTypes.has(type)}
                    onChange={() => toggleFileType(type)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() =>
              setFilters({
                showCompleted: true,
                showPending: true,
                fileTypes: new Set(FILE_TYPES),
                phases: new Set(PHASES),
              })
            }
            className="w-full px-2 py-1 text-xs text-slate-600 border border-slate-200 rounded hover:bg-white transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
