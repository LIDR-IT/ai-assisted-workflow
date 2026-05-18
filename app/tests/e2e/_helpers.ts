/**
 * Default client used by e2e specs when no client is explicitly named.
 * Matches the production default in `src/data/client-registry.ts` and the
 * fallback in `RootRedirect`.
 */
export const DEFAULT_E2E_CLIENT = 'facephi';

/**
 * Build a client-scoped URL path. Mirrors `useClientPath` from the app code
 * but in plain string form so it can be used inside Playwright specs.
 *
 * @example
 *   clientPath('propuesta')              // '/facephi/propuesta'
 *   clientPath('sprint', 'aramis')       // '/aramis/sprint'
 *   clientPath('home', 'docline')        // '/docline'
 */
export function clientPath(routeId: string, clientId: string = DEFAULT_E2E_CLIENT): string {
  const id = routeId === 'home' || routeId === '' ? '' : routeId.replace(/^\/+/, '');
  return id ? `/${clientId}/${id}` : `/${clientId}`;
}
