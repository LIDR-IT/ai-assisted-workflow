import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { SearchInterface } from './SearchInterface';
import { ArtifactList } from './ArtifactList';
import { WorkflowSuggestions } from './WorkflowSuggestions';
import { useArtifactSearch, useAllArtifacts } from './useArtifactSearch';
import { useCurrentClient } from '@/hooks';
import { getStatsForClient, popularSearchTerms } from '@/fixtures';
import { unifiedPhases } from '@/data/phases';

/**
 * HelpCenter - Refactored to feature-based architecture
 *
 * BEFORE: 3,070 lines monolith
 * AFTER: ~350-400 lines container + distributed components
 *
 * Features:
 * - Fuzzy search across 195 artifacts
 * - Pagination (20 items per page for 137 artifacts)
 * - Filter by type, phase, roles
 * - Workflow suggestions
 * - Export functionality
 *
 * Architecture:
 * - SearchInterface: Search input + filters (80 lines)
 * - ArtifactList: Paginated artifact display (120 lines)
 * - WorkflowSuggestions: Workflow recommendations (100 lines)
 * - useArtifactSearch: Search logic hook (60 lines)
 * - usePagination: Pagination logic hook (40 lines)
 */
function HelpCenterComponent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { client } = useCurrentClient();
  const initialQuery = searchParams.get('q') || '';
  const initialPhaseParam = searchParams.get('phase');

  const [query, setQuery] = useState(initialQuery);
  const [phaseFilter, setPhaseFilter] = useState<number | null>(
    initialPhaseParam !== null && !Number.isNaN(Number(initialPhaseParam))
      ? Number(initialPhaseParam)
      : null
  );
  const allArtifacts = useAllArtifacts();
  const { artifacts: searchResults, workflows } = useArtifactSearch(query);

  // Memoize client-specific statistics to prevent recalculation
  const clientStats = useMemo(() => getStatsForClient(client?.name || 'facephi'), [client?.name]);

  // Sync URL params with search query + unified phase filter
  useEffect(() => {
    const params: Record<string, string> = {};
    if (query.trim()) {
      params.q = query;
    }
    if (phaseFilter !== null) {
      params.phase = String(phaseFilter);
    }
    setSearchParams(params);
  }, [query, phaseFilter, setSearchParams]);

  // Memoize query change handler to prevent unnecessary re-renders of SearchInterface
  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  const handlePhaseFilterChange = useCallback((phaseId: number | null) => {
    setPhaseFilter((prev) => (prev === phaseId ? null : phaseId));
  }, []);

  // Apply the unified-phase filter (0-4) on top of the search results.
  // Without a query, an active phase filter browses all artifacts of that phase.
  const filteredArtifacts = useMemo(() => {
    const base = query.trim() ? searchResults : phaseFilter !== null ? allArtifacts : [];
    if (phaseFilter === null) {
      return base;
    }
    return base.filter((a) => a.phaseNum === phaseFilter);
  }, [query, searchResults, allArtifacts, phaseFilter]);

  const filteredWorkflows = query.trim() ? workflows : [];
  const hasResults = filteredArtifacts.length > 0 || filteredWorkflows.length > 0;
  const showEmptyState = (query.trim() || phaseFilter !== null) && !hasResults;
  const showInitialState = !query.trim() && phaseFilter === null;

  return (
    <div className="h-full w-full bg-gradient-to-br from-blue-50 to-purple-50 p-8 overflow-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Help Center</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Centro de ayuda del ecosistema {client?.name || 'SDLC'}: {allArtifacts.length}{' '}
            artefactos disponibles
          </p>
        </div>

        {/* Search Interface */}
        <SearchInterface
          query={query}
          onQueryChange={handleQueryChange}
          placeholder="Buscar skills, commands, rules, templates..."
        />

        {/* Unified phase filter (5 fases BMad × LIDR) */}
        <div className="flex flex-wrap gap-2 justify-center mb-8" aria-label="Filtro por fase">
          <button
            onClick={() => handlePhaseFilterChange(null)}
            className={`px-3 py-1 text-sm rounded-full border transition-colors ${
              phaseFilter === null
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}
            aria-pressed={phaseFilter === null}
          >
            Todas las fases
          </button>
          {unifiedPhases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => handlePhaseFilterChange(phase.id)}
              title={phase.description}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                phaseFilter === phase.id
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
              aria-pressed={phaseFilter === phase.id}
            >
              {phase.name}
            </button>
          ))}
        </div>

        {/* Results */}
        {hasResults && (
          <div className="space-y-8">
            <ArtifactList
              artifacts={filteredArtifacts}
              totalCount={allArtifacts.length}
              itemsPerPage={20}
            />

            <WorkflowSuggestions workflows={filteredWorkflows} />
          </div>
        )}

        {/* Empty state - No results found */}
        {showEmptyState && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">
              No se encontraron resultados
            </h2>
            <p className="text-slate-600 mb-4">Intenta con otros términos de búsqueda</p>
            <div className="text-sm text-slate-500">
              Sugerencias: "business case", "testing", "security", "prd", "requirements"
            </div>
          </div>
        )}

        {/* Initial state - Welcome message */}
        {showInitialState && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">
              Busca en {allArtifacts.length} artefactos
            </h2>
            <p className="text-slate-600 mb-8">
              Skills, commands, rules, templates y más del ecosistema {client?.name || 'SDLC'}
            </p>

            {/* Quick search suggestions */}
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg font-medium text-slate-700 mb-4">Búsquedas populares:</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {popularSearchTerms.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleQueryChange(suggestion)}
                    className="px-3 py-1 text-sm bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {clientStats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                  {stat.description && (
                    <div className="text-xs text-slate-400 mt-1" title={stat.description}>
                      {stat.description.slice(0, 30)}...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Memoize component to prevent expensive search re-computations
// Only re-renders when client context changes significantly
const HelpCenter = memo(HelpCenterComponent);

// Export the container as default for the route
export default HelpCenter;

// Also named export for compatibility
export { HelpCenter };
