import { useEffect } from 'react';
import { useParams } from 'react-router';
import { clientRegistry } from '@/data/client-registry';

/**
 * Bridges the URL `:clientId` param with the in-memory client registry.
 *
 * Temporary scaffold for the URL-driven client refactor (step 4 of the plan).
 * Once `useCurrentClient` derives directly from `useParams` (step 8), this
 * component is removed.
 */
export function ClientSyncer() {
  const { clientId } = useParams();

  useEffect(() => {
    if (clientId && clientRegistry.hasClient(clientId)) {
      try {
        clientRegistry.setCurrentClient(clientId);
      } catch {
        // setCurrentClient throws if id is invalid; the loader already 404s in
        // that case, so this is defensive only.
      }
    }
  }, [clientId]);

  return null;
}
