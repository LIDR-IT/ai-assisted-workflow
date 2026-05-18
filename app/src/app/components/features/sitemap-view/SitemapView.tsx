import { useState, useMemo } from 'react';
import { FolderTree } from 'lucide-react';
import {
  PageHeader,
  DiagramCard,
  SectionBox,
  Legend,
} from '@/app/components/shared/FlowComponents';
import { FileTree } from './FileTree';
import { NavigationPanel } from './NavigationPanel';
import { useCurrentClient } from '@/hooks';
import { projectTree, stats, type TreeMode, type TreeNode } from '@/data/features/sitemapView';
import { ecosystemStats } from '@/data/computed/stats';

interface SitemapViewProps {
  className?: string;
}

export function SitemapView({ className }: SitemapViewProps = {}) {
  const { client } = useCurrentClient();
  const treeMode: TreeMode = 'default';
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tree based on search query
  const filteredTree = useMemo(() => {
    if (!searchQuery) {
      return projectTree;
    }

    function filterNodes(nodes: TreeNode[]): TreeNode[] {
      return nodes.reduce((acc: TreeNode[], node) => {
        const matchesSearch =
          node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.desc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.badge?.label.toLowerCase().includes(searchQuery.toLowerCase());

        if (matchesSearch) {
          acc.push(node);
        } else if (node.children) {
          const filteredChildren = filterNodes(node.children);
          if (filteredChildren.length > 0) {
            acc.push({
              ...node,
              children: filteredChildren,
            });
          }
        }

        return acc;
      }, []);
    }

    return filterNodes(projectTree);
  }, [searchQuery]);

  return (
    <div className={className}>
      <PageHeader
        title={`Sitemap — Mapa Completo del Proyecto ${client?.name || ''}`}
        subtitle={`Estructura de páginas de la aplicación web + árbol de ficheros del ecosistema ${client?.name === 'Docline' ? 'simplificado' : 'completo'} (.claude/ y docs/)`}
      />

      {/* Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          {
            label: 'Páginas Web',
            value: '17',
            color: 'bg-indigo-50 border-indigo-200 text-indigo-700',
          },
          {
            label: 'Skills + Rules',
            value: `${ecosystemStats.skills + ecosystemStats.rules}`,
            color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          },
          {
            label: 'Commands',
            value: `${ecosystemStats.commands}`,
            color: 'bg-cyan-50 border-cyan-200 text-cyan-700',
          },
          {
            label: 'Ficheros Creados',
            value: `${stats.files}`,
            color: 'bg-violet-50 border-violet-200 text-violet-700',
          },
          {
            label: 'Docs Disponibles',
            value: `${stats.completed}`,
            color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          },
        ].map((s) => (
          <div key={s.label} className={`${s.color} border-2 rounded-lg p-3 text-center`}>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-6">
        {/* Navigation Panel */}
        <DiagramCard>
          <div className="p-4">
            <h3 className="text-sm font-medium text-slate-900 mb-4">Navigation</h3>
            <NavigationPanel tree={filteredTree} onSearchChange={setSearchQuery} />
          </div>
        </DiagramCard>

        <DiagramCard>
          <SectionBox
            title="Árbol de Ficheros — Ecosistema .claude/ + docs/"
            borderColor="border-violet-200"
            bgColor="bg-violet-50"
            icon={<FolderTree className="text-violet-600" size={20} />}
          >
            <Legend
              items={[
                { color: 'bg-emerald-500', label: 'Documento disponible (click para ver)' },
                { color: 'bg-slate-300', label: 'Documento pendiente' },
                { color: 'bg-indigo-200', label: 'Orquestador (CLAUDE.md)' },
                { color: 'bg-violet-200', label: 'Nivel 2 (agents, hooks, MCPs)' },
                { color: 'bg-cyan-200', label: 'Fuente de Verdad (docs/)' },
              ]}
              title=""
            />

            <div className="mt-4">
              <FileTree tree={filteredTree} mode={treeMode} />
            </div>

            {searchQuery && (
              <div className="mt-3 text-sm text-slate-600">
                {filteredTree.length === 0 ? (
                  <>
                    No results found for "<span className="font-medium">{searchQuery}</span>"
                  </>
                ) : (
                  <>
                    Showing results for "<span className="font-medium">{searchQuery}</span>"
                  </>
                )}
              </div>
            )}
          </SectionBox>
        </DiagramCard>
      </div>
    </div>
  );
}
