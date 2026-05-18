/**
 * useClientRegistry Hook — React hook for client state management
 *
 * This hook provides React components with access to the client registry
 * system, enabling client switching and state management with proper
 * React state updates and side effects.
 *
 * Features:
 * - Current client state and configuration access
 * - Client switching with automatic re-renders
 * - Available clients list
 * - Event listeners for client registry changes
 * - Error handling for invalid client operations
 * - TypeScript support for all client operations
 *
 * Part of the Phase 1 infrastructure for multi-client JSON architecture.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router';
import {
  clientRegistry,
  getCurrentClient,
  setCurrentClient,
  getAvailableClients,
  hasClient,
  registerClient,
} from '@/data/client-registry';
import type {
  ClientConfig,
  ClientRegistryEvent,
  ClientRegistryListener,
} from '@/data/client-registry';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Return type for useClientRegistry hook */
export interface UseClientRegistryReturn {
  /** Current active client ID */
  readonly currentClientId: string;

  /** Current client configuration */
  readonly currentClient: ClientConfig;

  /** List of available client IDs */
  readonly availableClients: readonly string[];

  /** Whether the registry is currently changing clients */
  readonly isChanging: boolean;

  /** Switch to a different client */
  readonly setClient: (clientId: string) => Promise<void>;

  /** Register a new client configuration */
  readonly registerNewClient: (clientId: string, config: ClientConfig) => Promise<void>;

  /** Check if a client exists */
  readonly hasClient: (clientId: string) => boolean;

  /** Refresh the available clients list */
  readonly refresh: () => void;

  /** Last error that occurred during client operations */
  readonly error: string | null;

  /** Clear the current error */
  readonly clearError: () => void;
}

/** Options for the useClientRegistry hook */
export interface UseClientRegistryOptions {
  /** Whether to automatically refresh when clients are added/removed */
  readonly autoRefresh?: boolean;

  /** Callback when client changes successfully */
  readonly onClientChange?: (fromClientId: string, toClientId: string) => void;

  /** Callback when client registration occurs */
  readonly onClientRegistered?: (clientId: string, config: ClientConfig) => void;

  /** Callback when errors occur */
  readonly onError?: (error: string) => void;
}

// ---------------------------------------------------------------------------
// Hook Implementation
// ---------------------------------------------------------------------------

/**
 * React hook for managing client registry state and operations.
 *
 * This hook provides a React-friendly interface to the client registry,
 * handling state updates, side effects, and error management.
 *
 * @param options Configuration options for the hook
 * @returns Object with client state and operations
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const {
 *     currentClientId,
 *     currentClient,
 *     availableClients,
 *     setClient,
 *     isChanging,
 *     error
 *   } = useClientRegistry({
 *     onClientChange: (from, to) => console.log(`Switched from ${from} to ${to}`),
 *     onError: (error) => console.error('Client error:', error),
 *   });
 *
 *   return (
 *     <div>
 *       <h1>Current Client: {currentClient.name}</h1>
 *       <select
 *         value={currentClientId}
 *         onChange={(e) => setClient(e.target.value)}
 *         disabled={isChanging}
 *       >
 *         {availableClients.map(clientId => (
 *           <option key={clientId} value={clientId}>
 *             {clientId}
 *           </option>
 *         ))}
 *       </select>
 *       {error && <div>Error: {error}</div>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useClientRegistry(options: UseClientRegistryOptions = {}): UseClientRegistryReturn {
  const { autoRefresh = true, onClientChange, onClientRegistered, onError } = options;

  // State management
  const [currentClientId, setCurrentClientId] = useState<string>(
    () => clientRegistry.currentClientId
  );
  const [availableClients, setAvailableClients] = useState<readonly string[]>(() =>
    getAvailableClients()
  );
  const [isChanging, setIsChanging] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized current client configuration
  const currentClient = useMemo<ClientConfig>(() => {
    try {
      return getCurrentClient();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get current client';
      setError(errorMessage);
      onError?.(errorMessage);
      // Return a fallback configuration
      return {
        name: 'Unknown',
        fullName: 'Unknown Client',
        industry: 'Custom' as const,
        segment: 'Unknown',
        projectCode: 'UNKNOWN',
        projectName: 'Unknown Project',
        domain: 'Unknown',
        mainProducts: [],
        regulations: [],
        templateVars: {
          CLIENT_REGULATIONS: '',
          STAKEHOLDER_TYPES: '',
          DOMAIN_SYSTEMS: '',
          SENSITIVE_DATA_TYPE: '',
          COMPLIANCE_FRAMEWORK: '',
          GOVERNANCE_STYLE: '',
          TEAM_STRUCTURE: '',
          CRISIS_LANGUAGE: '',
          TOOL_ECOSYSTEM: '',
          PROCESS_MATURITY: '',
          DELIVERY_PRESSURE: '',
        },
        domainTerms: {},
        team: {
          pme: 0,
          productOwner: 0,
          techLead: 0,
          developers: 0,
          qaLead: 0,
          qaEngineers: 0,
          security: 0,
          devOps: 0,
          scrumMaster: 0,
        },
        colors: {
          primary: '#000000',
          secondary: '#666666',
          accent: '#888888',
        },
      } as const;
    }
  }, [onError]);

  // Clear error callback
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Refresh available clients
  const refresh = useCallback(() => {
    try {
      setAvailableClients(getAvailableClients());
      setCurrentClientId(clientRegistry.currentClientId);
      clearError();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh clients';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [clearError, onError]);

  // Set client with error handling
  const setClient = useCallback(
    async (clientId: string): Promise<void> => {
      if (isChanging) {
        return; // Prevent concurrent changes
      }

      setIsChanging(true);
      clearError();

      try {
        const previousClientId = currentClientId;
        setCurrentClient(clientId);
        setCurrentClientId(clientId);

        // Call success callback
        if (previousClientId !== clientId) {
          onClientChange?.(previousClientId, clientId);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : `Failed to switch to client '${clientId}'`;
        setError(errorMessage);
        onError?.(errorMessage);
      } finally {
        setIsChanging(false);
      }
    },
    [isChanging, currentClientId, clearError, onClientChange, onError]
  );

  // Register new client
  const registerNewClient = useCallback(
    async (clientId: string, config: ClientConfig): Promise<void> => {
      clearError();

      try {
        registerClient(clientId, config);

        // Refresh available clients if auto-refresh is enabled
        if (autoRefresh) {
          refresh();
        }

        // Call success callback
        onClientRegistered?.(clientId, config);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : `Failed to register client '${clientId}'`;
        setError(errorMessage);
        onError?.(errorMessage);
      }
    },
    [autoRefresh, refresh, clearError, onClientRegistered, onError]
  );

  // Check if client exists
  const checkHasClient = useCallback((clientId: string): boolean => {
    return hasClient(clientId);
  }, []);

  // Set up event listeners for registry changes
  useEffect(() => {
    if (!autoRefresh) {
      return;
    }

    const handleRegistryEvent: ClientRegistryListener = (event: ClientRegistryEvent) => {
      switch (event.type) {
        case 'CLIENT_REGISTERED':
        case 'CLIENT_UNREGISTERED':
          // Refresh available clients when the registry changes
          setAvailableClients(getAvailableClients());
          break;

        case 'CLIENT_SWITCHED':
          // Update current client ID when it changes elsewhere
          setCurrentClientId(event.toClientId);
          if (onClientChange) {
            onClientChange(event.fromClientId, event.toClientId);
          }
          break;
      }
    };

    clientRegistry.addEventListener(handleRegistryEvent);

    return () => {
      clientRegistry.removeEventListener(handleRegistryEvent);
    };
  }, [autoRefresh, onClientChange]);

  // Return the hook interface
  return {
    currentClientId,
    currentClient,
    availableClients,
    isChanging,
    setClient,
    registerNewClient,
    hasClient: checkHasClient,
    refresh,
    error,
    clearError,
  };
}

// ---------------------------------------------------------------------------
// Convenience Hooks
// ---------------------------------------------------------------------------

/**
 * Simple hook that only returns current client information.
 *
 * The URL is the source of truth: when rendered inside the `:clientId` route,
 * the client id comes from `useParams()`. The registry singleton is used as a
 * fallback for callers that mount outside the router (e.g. the root redirect).
 *
 * The full `useClientRegistry()` hook is still subscribed so that consumers
 * outside the route tree react to programmatic `setClient` calls.
 */
export function useCurrentClient(): {
  readonly clientId: string;
  readonly client: ClientConfig;
} {
  const params = useParams();
  const { currentClientId, currentClient } = useClientRegistry({
    autoRefresh: true,
  });

  const urlClientId = params.clientId;
  if (urlClientId && hasClient(urlClientId)) {
    return {
      clientId: urlClientId,
      client: clientRegistry.getClient(urlClientId),
    };
  }

  return {
    clientId: currentClientId,
    client: currentClient,
  };
}

/**
 * Hook that only returns available clients list.
 * Useful for client selector components.
 */
export function useAvailableClients(): {
  readonly clients: readonly string[];
  readonly refresh: () => void;
} {
  const { availableClients, refresh } = useClientRegistry({
    autoRefresh: true,
  });

  return {
    clients: availableClients,
    refresh,
  };
}
