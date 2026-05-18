/**
 * RouteLoadingSpinner - Loading component for route-based code splitting
 *
 * Displays a loading state while lazy-loaded route components are being fetched.
 * Provides a smooth UX during code splitting transitions.
 */

import { Loader2 } from 'lucide-react';

interface RouteLoadingSpinnerProps {
  /** Custom loading message */
  message?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show the message */
  showMessage?: boolean;
}

export function RouteLoadingSpinner({
  message = 'Cargando página...',
  size = 'md',
  showMessage = true,
}: RouteLoadingSpinnerProps) {
  const sizeClasses = {
    sm: {
      spinner: 'w-4 h-4',
      text: 'text-xs',
      gap: 'gap-2',
      container: 'p-4',
    },
    md: {
      spinner: 'w-6 h-6',
      text: 'text-sm',
      gap: 'gap-3',
      container: 'p-8',
    },
    lg: {
      spinner: 'w-8 h-8',
      text: 'text-base',
      gap: 'gap-4',
      container: 'p-12',
    },
  };

  const styles = sizeClasses[size];

  return (
    <div className={`flex flex-col items-center justify-center ${styles.container}`}>
      <div className={`flex items-center ${styles.gap} text-slate-600`}>
        <Loader2 className={`${styles.spinner} animate-spin text-indigo-600`} />
        {showMessage && <span className={`${styles.text} font-medium`}>{message}</span>}
      </div>
    </div>
  );
}

/**
 * Minimal loading spinner for small spaces
 */
export function MinimalRouteSpinner() {
  return (
    <div className="flex items-center justify-center p-2">
      <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
    </div>
  );
}

/**
 * Full page loading spinner with branding
 */
export function FullPageRouteSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="flex items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <div className="text-lg font-semibold text-slate-700">LIDR SDLC</div>
      </div>
      <div className="text-sm text-slate-500">Cargando componente...</div>
    </div>
  );
}

/**
 * Error boundary fallback for failed lazy loads
 */
export function RouteLoadError({ error, retry }: { error?: Error; retry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="text-red-600 text-center">
        <div className="text-lg font-semibold mb-2">Error al cargar la página</div>
        <div className="text-sm text-slate-600 mb-4">
          {error?.message || 'No se pudo cargar el componente'}
        </div>
        {retry && (
          <button
            onClick={retry}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
          >
            Intentar de nuevo
          </button>
        )}
      </div>
    </div>
  );
}
