import { createBrowserRouter, type LoaderFunctionArgs } from 'react-router';
import { ClientLayout } from './components/ClientLayout';
import { RouteErrorBoundary } from './components/RouteErrorBoundary';
import { RootRedirect, LAST_CLIENT_STORAGE_KEY } from './components/RootRedirect';
import { NotFound } from './components/NotFound';
import { ROUTE_REGISTRY } from './route-registry';
import { clientRegistry } from '@/data/client-registry';
import { getNavConfig } from '@/data/nav-config';

const HOME_ENTRY = ROUTE_REGISTRY.find((entry) => entry.id === 'home')!;
const CHILD_ENTRIES = ROUTE_REGISTRY.filter((entry) => entry.id !== 'home');

function clientLoader({ params }: LoaderFunctionArgs) {
  const id = params.clientId;
  if (!id || !clientRegistry.hasClient(id)) {
    throw new Response(null, { status: 404, statusText: 'Client not found' });
  }
  try {
    window.localStorage.setItem(LAST_CLIENT_STORAGE_KEY, id);
  } catch {
    // localStorage unavailable; non-fatal.
  }
  return null;
}

function makeRouteLoader(entryId: string) {
  return ({ params }: LoaderFunctionArgs) => {
    const clientId = params.clientId;
    if (!clientId) {
      return null;
    }
    const navConfig = getNavConfig(clientId);
    const status = navConfig?.routes[entryId]?.status;
    if (status === 'hidden') {
      throw new Response(null, { status: 404, statusText: 'Route hidden for client' });
    }
    return null;
  };
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootRedirect,
  },
  {
    path: ':clientId',
    Component: ClientLayout,
    loader: clientLoader,
    ErrorBoundary: RouteErrorBoundary,
    children: [
      {
        index: true,
        Component: HOME_ENTRY.Component,
        loader: makeRouteLoader('home'),
      },
      ...CHILD_ENTRIES.map((entry) => ({
        path: entry.path,
        Component: entry.Component,
        loader: makeRouteLoader(entry.id),
      })),
    ],
  },
  {
    path: '*',
    Component: NotFound,
  },
]);
