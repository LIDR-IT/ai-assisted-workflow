import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { SearchInterface } from './SearchInterface';
import { ArtifactList } from './ArtifactList';
import { WorkflowSuggestions } from './WorkflowSuggestions';
import { useArtifactSearch, useAllArtifacts } from './useArtifactSearch';
import { useCurrentClient } from '@/hooks';
import { getStatsForClient, popularSearchTerms } from '@/fixtures';

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

  const [query, setQuery] = useState(initialQuery);
  const allArtifacts = useAllArtifacts();
  const { artifacts: searchResults, workflows } = useArtifactSearch(query);

  // Memoize client-specific statistics to prevent recalculation
  const clientStats = useMemo(() => getStatsForClient(client?.name || 'facephi'), [client?.name]);

  // Sync URL params with search query
  useEffect(() => {
    if (query.trim()) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
  }, [query, setSearchParams]);

  // Memoize query change handler to prevent unnecessary re-renders of SearchInterface
  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  const hasResults = searchResults.length > 0 || workflows.length > 0;
  const showEmptyState = query.trim() && !hasResults;
  const showInitialState = !query.trim();

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

        {/* Results */}
        {hasResults && (
          <div className="space-y-8">
            <ArtifactList
              artifacts={searchResults}
              totalCount={allArtifacts.length}
              itemsPerPage={20}
            />

            <WorkflowSuggestions workflows={workflows} />
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
