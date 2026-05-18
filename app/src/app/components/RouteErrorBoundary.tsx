import { isRouteErrorResponse, Link, useRouteError } from 'react-router';
import { NotFound } from './NotFound';

type ErrorWithMessage = {
  message?: string;
  stack?: string;
};

export function RouteErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFound />;
  }

  let title = 'Algo salio mal';
  let message = 'No pudimos cargar esta vista. Intenta volver al inicio.';
  let details = '';

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`.trim();
    message = error.data?.message || message;
  } else if (error instanceof Error) {
    message = error.message || message;
    details = error.stack || '';
  } else if (error && typeof error === 'object') {
    const typedError = error as ErrorWithMessage;
    message = typedError.message || message;
    details = typedError.stack || '';
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-red-600 mb-2">Error</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
        <p className="text-slate-600 mb-6">{message}</p>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/"
            className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Volver al inicio
          </Link>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Recargar pagina
          </button>
        </div>

        {import.meta.env.DEV && details && (
          <pre className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700 overflow-x-auto">
            {details}
          </pre>
        )}
      </div>
    </div>
  );
}
