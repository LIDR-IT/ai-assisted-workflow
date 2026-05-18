import { useCallback } from 'react';
import { useParams } from 'react-router';

/**
 * Returns helpers to build URLs scoped to the current client (from `:clientId`).
 *
 * - `path(routeId)` builds `/<clientId>/<routeId>` (or `/<clientId>` when called with '' / 'home').
 * - `pathFor(clientId, routeId)` builds a path for an explicit client (used by the client switcher).
 * - `clientId` exposes the current client id from the URL.
 */
export function useClientPath() {
  const params = useParams();
  const clientId = params.clientId ?? '';

  const path = useCallback(
    (routeId: string) => {
      const id = routeId === 'home' ? '' : routeId.replace(/^\/+/, '');
      return id ? `/${clientId}/${id}` : `/${clientId}`;
    },
    [clientId]
  );

  return { clientId, path };
}

/**
 * Build a path for an explicit client. Useful when switching clients while
 * preserving the current sub-route.
 */
export function buildClientPath(clientId: string, routeId: string): string {
  const id = routeId === 'home' ? '' : routeId.replace(/^\/+/, '');
  return id ? `/${clientId}/${id}` : `/${clientId}`;
}
