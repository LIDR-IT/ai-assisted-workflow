import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Artifact } from '@/data/features/helpCenter';
import { usePagination } from './usePagination';

interface ArtifactListProps {
  artifacts: Artifact[];
  totalCount: number;
  itemsPerPage?: number;
}

export function ArtifactList({ artifacts, itemsPerPage = 20 }: ArtifactListProps) {
  const pagination = usePagination<Artifact>({
    totalItems: artifacts.length,
    itemsPerPage,
  });

  const paginatedArtifacts = pagination.getPaginatedData(artifacts);

  if (artifacts.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">
          Artefactos encontrados ({artifacts.length})
        </h2>

        {pagination.totalPages > 1 && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>
              {pagination.startIndex + 1}-{pagination.endIndex} de {artifacts.length}
            </span>
            <div className="flex gap-1 ml-2">
              <button
                onClick={pagination.previousPage}
                disabled={!pagination.hasPreviousPage}
                className="p-1 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 py-1 text-xs bg-slate-100 rounded">
                {pagination.currentPage} / {pagination.totalPages}
              </span>
              <button
                onClick={pagination.nextPage}
                disabled={!pagination.hasNextPage}
                className="p-1 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Página siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {paginatedArtifacts.map((artifact) => (
          <div
            key={artifact.id}
            data-testid="artifact-item"
            className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 flex flex-col gap-1">
                <span className="inline-block px-2 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-800">
                  {artifact.type}
                </span>
                <span
                  className={`inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wider rounded-md ${
                    artifact.source === 'bmad'
                      ? 'bg-amber-100 text-amber-800'
                      : artifact.source === 'anytime'
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-emerald-100 text-emerald-800'
                  }`}
                  title={`Skill source: ${artifact.source ?? 'lidr'}`}
                >
                  {(artifact.source ?? 'lidr').toUpperCase()}
                </span>
                {artifact.criticality && (
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wider rounded-md ${
                      artifact.criticality === 'required'
                        ? 'bg-rose-100 text-rose-800'
                        : artifact.criticality === 'recommended'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-slate-100 text-slate-600'
                    }`}
                    title={`Criticality: ${artifact.criticality} — ${
                      artifact.criticality === 'required'
                        ? 'BMad does not cover this. Skipping leaves a real gap.'
                        : artifact.criticality === 'recommended'
                          ? 'BMad covers partially. LIDR adds automation/Spanish/Gate-binding.'
                          : 'Niche use case (consultancy, multi-tool, Claude Code extension). Skip is fine.'
                    }`}
                  >
                    {artifact.criticality === 'required'
                      ? 'OBLIGATORIO'
                      : artifact.criticality === 'recommended'
                        ? 'RECOMENDABLE'
                        : 'OPCIONAL'}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-slate-900 mb-1">{artifact.name}</h3>
                <p className="text-sm text-slate-600 mb-2">{artifact.description}</p>

                {artifact.phase && (
                  <div className="mb-2">
                    <span className="inline-block px-2 py-0.5 text-xs rounded-md bg-purple-100 text-purple-700">
                      {artifact.phase}
                    </span>
                  </div>
                )}

                {artifact.roles && artifact.roles.length > 0 && (
                  <div className="mb-2">
                    <span className="text-xs text-slate-500 mr-1">Roles:</span>
                    {artifact.roles.map((role, index) => (
                      <span key={role} className="text-xs text-slate-600">
                        {role}
                        {index < artifact.roles!.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                )}

                {artifact.triggers && artifact.triggers.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {artifact.triggers.slice(0, 3).map((trigger) => (
                      <span
                        key={trigger}
                        className="inline-block px-2 py-0.5 text-xs rounded-md bg-slate-100 text-slate-600"
                      >
                        {trigger}
                      </span>
                    ))}
                    {artifact.triggers.length > 3 && (
                      <span className="text-xs text-slate-500">
                        +{artifact.triggers.length - 3} más
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2">
            <button
              onClick={pagination.previousPage}
              disabled={!pagination.hasPreviousPage}
              className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>

            <div className="flex gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => pagination.goToPage(pageNum)}
                  className={`px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-50 ${
                    pageNum === pagination.currentPage
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : ''
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={pagination.nextPage}
              disabled={!pagination.hasNextPage}
              className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
