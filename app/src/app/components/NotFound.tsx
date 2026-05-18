import { Link, useParams } from 'react-router';
import { clientRegistry } from '@/data/client-registry';

export function NotFound() {
  const params = useParams();
  const homeTarget =
    params.clientId && clientRegistry.hasClient(params.clientId) ? `/${params.clientId}` : '/';

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-600 mb-2">404</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Página no encontrada</h1>
        <p className="text-slate-600 mb-6">
          La ruta que intentas abrir no existe o no está disponible para el cliente actual.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            to={homeTarget}
            className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
