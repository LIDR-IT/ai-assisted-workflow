import { Navigate } from 'react-router';
import { clientRegistry } from '@/data/client-registry';

const LAST_CLIENT_STORAGE_KEY = 'lidr-last-client';
const DEFAULT_CLIENT_ID = 'facephi';

function readLastClient(): string {
  try {
    const stored = window.localStorage.getItem(LAST_CLIENT_STORAGE_KEY);
    if (stored && clientRegistry.hasClient(stored)) {
      return stored;
    }
  } catch {
    // localStorage may be unavailable (Safari private mode, SSR). Fall through.
  }
  return DEFAULT_CLIENT_ID;
}

export function RootRedirect() {
  const clientId = readLastClient();
  return <Navigate to={`/${clientId}`} replace />;
}

export { LAST_CLIENT_STORAGE_KEY, DEFAULT_CLIENT_ID };
