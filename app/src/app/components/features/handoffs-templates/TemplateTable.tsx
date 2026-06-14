/**
 * @file TemplateTable Component
 * @description Virtualized table for displaying phase templates with search and filtering
 */

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import type { Template } from '@/data/features/handoffsTemplates';
import { AIBadge } from './AIBadge';

interface TemplateTableProps {
  templates: Template[];
}

export function TemplateTable({ templates }: TemplateTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterByAI, setFilterByAI] = useState<boolean | null>(null);

  // Filtered and searched templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch =
        searchTerm === '' ||
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (template.vsTip?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

      const matchesAI =
        filterByAI === null || (filterByAI ? template.aiAssist : !template.aiAssist);

      return matchesSearch && matchesAI;
    });
  }, [templates, searchTerm, filterByAI]);

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Buscar templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterByAI(null)}
            className={`px-3 py-2 text-xs rounded ${
              filterByAI === null
                ? 'bg-gray-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterByAI(true)}
            className={`px-3 py-2 text-xs rounded ${
              filterByAI === true
                ? 'bg-violet-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Con IA
          </button>
          <button
            onClick={() => setFilterByAI(false)}
            className={`px-3 py-2 text-xs rounded ${
              filterByAI === false
                ? 'bg-gray-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Manuales
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500">
        Mostrando {filteredTemplates.length} de {templates.length} templates
      </div>

      {/* Table */}
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Formato
                </th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Obligatorio
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTemplates.map((template, index) => (
                <tr
                  key={template.code}
                  id={`tpl-${template.code}`}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} target:bg-violet-50 target:ring-2 target:ring-violet-400 scroll-mt-24`}
                >
                  <td className="px-3 py-2 text-xs text-slate-600 border-b border-slate-100">
                    <div className="font-mono font-semibold text-slate-800">{template.code}</div>
                    {template.aiAssist && (
                      <div className="mt-1">
                        <AIBadge type={template.aiAssist} claudePath={template.claudePath} />
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 font-semibold text-slate-800 text-xs border-b border-slate-100">
                    {template.name}
                    {template.claudePath && (
                      <div className="font-mono text-[9px] text-violet-500 font-normal mt-0.5">
                        {template.claudePath}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-600 border-b border-slate-100">
                    {template.desc}
                    {template.vsTip && (
                      <div className="mt-1.5 flex items-start gap-1 rounded border border-amber-100 bg-amber-50 px-2 py-1 text-[11px] leading-snug text-amber-800">
                        <span aria-hidden>💡</span>
                        <span>{template.vsTip}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center border-b border-slate-100">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold ${
                        template.format.includes('.claude/')
                          ? 'bg-violet-100 text-violet-600'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {template.format}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center text-xs text-slate-600 border-b border-slate-100">
                    {template.owner}
                  </td>
                  <td className="px-3 py-2 text-center border-b border-slate-100">
                    {template.mandatory ? (
                      <span className="inline-block bg-red-100 text-red-700 rounded px-2 py-0.5 text-[10px] font-semibold">
                        Sí
                      </span>
                    ) : (
                      <span className="inline-block bg-slate-100 text-slate-500 rounded px-2 py-0.5 text-[10px]">
                        Opc.
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty state */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No se encontraron templates que coincidan con los filtros.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterByAI(null);
            }}
            className="mt-2 text-violet-600 hover:text-violet-800 text-sm underline"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
