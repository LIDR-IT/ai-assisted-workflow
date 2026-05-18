/**
 * Client Registry — Multi-client management system for LIDR SDLC Methodology
 *
 * This system enables the application to support multiple clients with their own
 * configurations, branding, and data while maintaining the same codebase.
 *
 * Features:
 * - Register and manage multiple client configurations
 * - Switch between clients at runtime
 * - Maintain current client state
 * - Integration with existing Template Engine
 * - Backward compatibility with single-client setup
 *
 * Part of the Phase 1 infrastructure for multi-client JSON architecture.
 */

import type { ClientConfig } from './schemas/client-schema';
import { doclineClientConfig } from './clients/docline/config';
import { facePhiClientConfig } from './clients/facephi/config';
import { aramisClientConfig } from './clients/aramis/config';
import { baseClientConfig } from './clients/base/config';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Client Registry interface for managing multiple client configurations */
export interface ClientRegistry {
  /** Map of client ID to client configuration */
  readonly clients: ReadonlyMap<string, ClientConfig>;

  /** Currently active client ID */
  readonly currentClientId: string;

  /** Register a new client configuration */
  registerClient(clientId: string, config: ClientConfig): void;

  /** Set the current active client */
  setCurrentClient(clientId: string): void;

  /** Get client configuration by ID, or current client if no ID provided */
  getClient(clientId?: string): ClientConfig;

  /** Get list of all registered client IDs */
  getAvailableClients(): string[];

  /** Check if a client is registered */
  hasClient(clientId: string): boolean;

  /** Remove a client from the registry */
  unregisterClient(clientId: string): void;
}

/** Event types for client registry changes */
export type ClientRegistryEvent =
  | { type: 'CLIENT_REGISTERED'; clientId: string; config: ClientConfig }
  | { type: 'CLIENT_SWITCHED'; fromClientId: string; toClientId: string }
  | { type: 'CLIENT_UNREGISTERED'; clientId: string };

/** Event listener for client registry changes */
export type ClientRegistryListener = (event: ClientRegistryEvent) => void;

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

/**
 * Concrete implementation of the Client Registry.
 *
 * Uses in-memory storage for client configurations and provides event
 * notifications for UI components that need to react to client changes.
 */
class ClientRegistryImpl implements ClientRegistry {
  private readonly _clients = new Map<string, ClientConfig>();
  private _currentClientId: string;
  private readonly _listeners = new Set<ClientRegistryListener>();

  constructor() {
    // Register real clients for multi-client demo
    this._clients.set('base', baseClientConfig);
    this._clients.set('docline', doclineClientConfig);
    this._clients.set('facephi', facePhiClientConfig);
    this._clients.set('aramis', aramisClientConfig);

    // Start with FacePhi as default (alphabetical first)
    this._currentClientId = 'facephi';
  }

  get clients(): ReadonlyMap<string, ClientConfig> {
    return this._clients;
  }

  get currentClientId(): string {
    return this._currentClientId;
  }

  registerClient(clientId: string, config: ClientConfig): void {
    if (!clientId || clientId.trim() === '') {
      throw new Error('Client ID cannot be empty');
    }

    // Normalize client ID to lowercase for consistency
    const normalizedId = clientId.toLowerCase();

    this._clients.set(normalizedId, config);

    // Notify listeners
    this._notifyListeners({
      type: 'CLIENT_REGISTERED',
      clientId: normalizedId,
      config,
    });
  }

  setCurrentClient(clientId: string): void {
    const normalizedId = clientId.toLowerCase();

    if (!this._clients.has(normalizedId)) {
      throw new Error(
        `Client '${normalizedId}' is not registered. Available clients: ${this.getAvailableClients().join(', ')}`
      );
    }

    const previousClientId = this._currentClientId;
    this._currentClientId = normalizedId;

    // Notify listeners only if client actually changed
    if (previousClientId !== normalizedId) {
      this._notifyListeners({
        type: 'CLIENT_SWITCHED',
        fromClientId: previousClientId,
        toClientId: normalizedId,
      });
    }
  }

  getClient(clientId?: string): ClientConfig {
    const targetClientId = clientId?.toLowerCase() ?? this._currentClientId;

    const config = this._clients.get(targetClientId);
    if (!config) {
      throw new Error(
        `Client '${targetClientId}' is not registered. Available clients: ${this.getAvailableClients().join(', ')}`
      );
    }

    return config;
  }

  getAvailableClients(): string[] {
    return Array.from(this._clients.keys()).sort();
  }

  hasClient(clientId: string): boolean {
    return this._clients.has(clientId.toLowerCase());
  }

  unregisterClient(clientId: string): void {
    const normalizedId = clientId.toLowerCase();

    // Prevent unregistering the current client
    if (normalizedId === this._currentClientId) {
      throw new Error(
        `Cannot unregister current client '${normalizedId}'. Switch to another client first.`
      );
    }

    // Prevent unregistering if it's the only client
    if (this._clients.size === 1) {
      throw new Error('Cannot unregister the last remaining client');
    }

    if (this._clients.delete(normalizedId)) {
      this._notifyListeners({
        type: 'CLIENT_UNREGISTERED',
        clientId: normalizedId,
      });
    }
  }

  /**
   * Add event listener for client registry changes
   */
  addEventListener(listener: ClientRegistryListener): void {
    this._listeners.add(listener);
  }

  /**
   * Remove event listener
   */
  removeEventListener(listener: ClientRegistryListener): void {
    this._listeners.delete(listener);
  }

  /**
   * Notify all listeners of a registry event
   */
  private _notifyListeners(event: ClientRegistryEvent): void {
    this._listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in client registry listener:', error);
      }
    });
  }
}

// ---------------------------------------------------------------------------
// Global Registry Instance
// ---------------------------------------------------------------------------

/**
 * Global client registry instance.
 *
 * This is the singleton that the entire application uses to manage client
 * configurations. Initialized with Docline as the primary client.
 */
export const clientRegistry = new ClientRegistryImpl();

// ---------------------------------------------------------------------------
// Convenience Functions
// ---------------------------------------------------------------------------

/**
 * Get the current client configuration.
 * Shorthand for clientRegistry.getClient()
 */
export function getCurrentClient(): ClientConfig {
  return clientRegistry.getClient();
}

/**
 * Get a specific client configuration by ID.
 * Shorthand for clientRegistry.getClient(clientId)
 */
export function getClientById(clientId: string): ClientConfig {
  return clientRegistry.getClient(clientId);
}

/**
 * Set the current active client.
 * Shorthand for clientRegistry.setCurrentClient(clientId)
 */
export function setCurrentClient(clientId: string): void {
  clientRegistry.setCurrentClient(clientId);
}

/**
 * Register a new client configuration.
 * Shorthand for clientRegistry.registerClient(clientId, config)
 */
export function registerClient(clientId: string, config: ClientConfig): void {
  clientRegistry.registerClient(clientId, config);
}

/**
 * Get list of all available client IDs.
 * Shorthand for clientRegistry.getAvailableClients()
 */
export function getAvailableClients(): string[] {
  return clientRegistry.getAvailableClients();
}

/**
 * Check if a client is registered.
 * Shorthand for clientRegistry.hasClient(clientId)
 */
export function hasClient(clientId: string): boolean {
  return clientRegistry.hasClient(clientId);
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export type { ClientConfig };
export { clientRegistry as default };
