import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ClientConfig } from '../schemas/client-schema';

// Mock client configs
vi.mock('../clients/docline/config', () => ({
  doclineClientConfig: {
    id: 'docline',
    name: 'Docline',
    domain: 'healthcare',
    branding: {
      primaryColor: '#2563eb',
      logoPath: '/logos/docline.svg',
    },
  } as ClientConfig,
}));

vi.mock('../clients/facephi/config', () => ({
  facePhiClientConfig: {
    id: 'facephi',
    name: 'FacePhi',
    domain: 'biometric',
    branding: {
      primaryColor: '#7c3aed',
      logoPath: '/logos/facephi.svg',
    },
  } as ClientConfig,
}));

import {
  clientRegistry,
  getCurrentClient,
  getClientById,
  setCurrentClient,
  registerClient,
  getAvailableClients,
  hasClient,
} from '../client-registry';

describe('ClientRegistry', () => {
  beforeEach(() => {
    // Reset to default state before each test
    clientRegistry.setCurrentClient('facephi');
  });

  describe('Basic functionality', () => {
    it('initializes with default clients', () => {
      const availableClients = clientRegistry.getAvailableClients();

      expect(availableClients).toContain('docline');
      expect(availableClients).toContain('facephi');
      expect(availableClients.length).toBeGreaterThanOrEqual(2);
    });

    it('has facephi as default current client', () => {
      expect(clientRegistry.currentClientId).toBe('facephi');
    });

    it('returns map of clients', () => {
      const clients = clientRegistry.clients;

      expect(clients.has('docline')).toBe(true);
      expect(clients.has('facephi')).toBe(true);
      expect(clients.size).toBeGreaterThanOrEqual(2);
    });
  });

  describe('registerClient()', () => {
    const mockConfig: ClientConfig = {
      id: 'testclient',
      name: 'Test Client',
      domain: 'testing',
      branding: {
        primaryColor: '#ff0000',
        logoPath: '/test.svg',
      },
    } as ClientConfig;

    afterEach(() => {
      // Clean up test client if it was registered
      if (clientRegistry.hasClient('testclient')) {
        try {
          clientRegistry.unregisterClient('testclient');
        } catch {
          // Ignore errors during cleanup
        }
      }
    });

    it('registers a new client', () => {
      clientRegistry.registerClient('testclient', mockConfig);

      expect(clientRegistry.hasClient('testclient')).toBe(true);
      expect(clientRegistry.getClient('testclient')).toEqual(mockConfig);
    });

    it('normalizes client ID to lowercase', () => {
      clientRegistry.registerClient('TESTCLIENT', mockConfig);

      expect(clientRegistry.hasClient('testclient')).toBe(true);
      expect(clientRegistry.hasClient('TESTCLIENT')).toBe(true);
    });

    it('throws error for empty client ID', () => {
      expect(() => {
        clientRegistry.registerClient('', mockConfig);
      }).toThrow('Client ID cannot be empty');
    });

    it('throws error for whitespace-only client ID', () => {
      expect(() => {
        clientRegistry.registerClient('   ', mockConfig);
      }).toThrow('Client ID cannot be empty');
    });

    it('notifies listeners when client is registered', () => {
      const listener = vi.fn();
      clientRegistry.addEventListener(listener);

      clientRegistry.registerClient('testclient', mockConfig);

      expect(listener).toHaveBeenCalledWith({
        type: 'CLIENT_REGISTERED',
        clientId: 'testclient',
        config: mockConfig,
      });

      clientRegistry.removeEventListener(listener);
    });
  });

  describe('setCurrentClient()', () => {
    it('switches to an existing client', () => {
      clientRegistry.setCurrentClient('docline');

      expect(clientRegistry.currentClientId).toBe('docline');
    });

    it('normalizes client ID to lowercase', () => {
      clientRegistry.setCurrentClient('DOCLINE');

      expect(clientRegistry.currentClientId).toBe('docline');
    });

    it('throws error for non-existent client', () => {
      expect(() => {
        clientRegistry.setCurrentClient('nonexistent');
      }).toThrow("Client 'nonexistent' is not registered");
    });

    it('includes available clients in error message', () => {
      expect(() => {
        clientRegistry.setCurrentClient('nonexistent');
      }).toThrow(/Available clients:/);
    });

    it('notifies listeners when client is switched', () => {
      const listener = vi.fn();
      clientRegistry.addEventListener(listener);

      const previousClient = clientRegistry.currentClientId;
      clientRegistry.setCurrentClient('docline');

      expect(listener).toHaveBeenCalledWith({
        type: 'CLIENT_SWITCHED',
        fromClientId: previousClient,
        toClientId: 'docline',
      });

      clientRegistry.removeEventListener(listener);
    });

    it('does not notify listeners when switching to same client', () => {
      const listener = vi.fn();
      clientRegistry.addEventListener(listener);

      const currentClient = clientRegistry.currentClientId;
      clientRegistry.setCurrentClient(currentClient);

      expect(listener).not.toHaveBeenCalled();

      clientRegistry.removeEventListener(listener);
    });
  });

  describe('getClient()', () => {
    it('returns current client when no ID provided', () => {
      clientRegistry.setCurrentClient('docline');
      const client = clientRegistry.getClient();

      expect(client.id).toBe('docline');
    });

    it('returns specific client by ID', () => {
      const client = clientRegistry.getClient('facephi');

      expect(client.id).toBe('facephi');
    });

    it('normalizes client ID to lowercase', () => {
      const client = clientRegistry.getClient('DOCLINE');

      expect(client.id).toBe('docline');
    });

    it('throws error for non-existent client', () => {
      expect(() => {
        clientRegistry.getClient('nonexistent');
      }).toThrow("Client 'nonexistent' is not registered");
    });
  });

  describe('getAvailableClients()', () => {
    it('returns sorted list of client IDs', () => {
      const clients = clientRegistry.getAvailableClients();

      expect(Array.isArray(clients)).toBe(true);
      expect(clients).toContain('docline');
      expect(clients).toContain('facephi');

      // Should be sorted
      const sorted = [...clients].sort();
      expect(clients).toEqual(sorted);
    });
  });

  describe('hasClient()', () => {
    it('returns true for existing client', () => {
      expect(clientRegistry.hasClient('docline')).toBe(true);
      expect(clientRegistry.hasClient('facephi')).toBe(true);
    });

    it('returns false for non-existing client', () => {
      expect(clientRegistry.hasClient('nonexistent')).toBe(false);
    });

    it('normalizes client ID to lowercase', () => {
      expect(clientRegistry.hasClient('DOCLINE')).toBe(true);
      expect(clientRegistry.hasClient('FACEPHI')).toBe(true);
    });
  });

  describe('unregisterClient()', () => {
    const mockConfig: ClientConfig = {
      id: 'temptest',
      name: 'Temp Test',
      domain: 'testing',
      branding: {
        primaryColor: '#00ff00',
        logoPath: '/temp.svg',
      },
    } as ClientConfig;

    beforeEach(() => {
      // Register a temporary client for testing unregistration
      clientRegistry.registerClient('temptest', mockConfig);
    });

    afterEach(() => {
      // Clean up
      if (clientRegistry.hasClient('temptest')) {
        try {
          clientRegistry.unregisterClient('temptest');
        } catch {
          // Ignore cleanup errors
        }
      }
    });

    it('unregisters an existing client', () => {
      expect(clientRegistry.hasClient('temptest')).toBe(true);

      clientRegistry.unregisterClient('temptest');

      expect(clientRegistry.hasClient('temptest')).toBe(false);
    });

    it('throws error when trying to unregister current client', () => {
      clientRegistry.setCurrentClient('temptest');

      expect(() => {
        clientRegistry.unregisterClient('temptest');
      }).toThrow("Cannot unregister current client 'temptest'");
    });

    it('notifies listeners when client is unregistered', () => {
      const listener = vi.fn();
      clientRegistry.addEventListener(listener);

      clientRegistry.unregisterClient('temptest');

      expect(listener).toHaveBeenCalledWith({
        type: 'CLIENT_UNREGISTERED',
        clientId: 'temptest',
      });

      clientRegistry.removeEventListener(listener);
    });

    it('does nothing silently for non-existent client', () => {
      const listener = vi.fn();
      clientRegistry.addEventListener(listener);

      clientRegistry.unregisterClient('nonexistent');

      expect(listener).not.toHaveBeenCalled();
      clientRegistry.removeEventListener(listener);
    });
  });

  describe('Event system', () => {
    it('adds and removes event listeners', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      clientRegistry.addEventListener(listener1);
      clientRegistry.addEventListener(listener2);

      clientRegistry.setCurrentClient('docline');

      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();

      listener1.mockClear();
      listener2.mockClear();

      clientRegistry.removeEventListener(listener1);
      clientRegistry.setCurrentClient('facephi');

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();

      clientRegistry.removeEventListener(listener2);
    });

    it('handles errors in listeners gracefully', () => {
      const badListener = vi.fn().mockImplementation(() => {
        throw new Error('Listener error');
      });
      const goodListener = vi.fn();

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      clientRegistry.addEventListener(badListener);
      clientRegistry.addEventListener(goodListener);

      clientRegistry.setCurrentClient('docline');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error in client registry listener:',
        expect.any(Error)
      );
      expect(goodListener).toHaveBeenCalled();

      consoleSpy.mockRestore();
      clientRegistry.removeEventListener(badListener);
      clientRegistry.removeEventListener(goodListener);
    });
  });

  describe('Convenience functions', () => {
    it('getCurrentClient() returns current client config', () => {
      clientRegistry.setCurrentClient('docline');
      const client = getCurrentClient();

      expect(client.id).toBe('docline');
    });

    it('getClientById() returns specific client config', () => {
      const client = getClientById('facephi');

      expect(client.id).toBe('facephi');
    });

    it('setCurrentClient() sets current client', () => {
      setCurrentClient('docline');

      expect(clientRegistry.currentClientId).toBe('docline');
    });

    it('registerClient() registers a new client', () => {
      const config: ClientConfig = {
        id: 'convenience-test',
        name: 'Convenience Test',
        domain: 'testing',
        branding: { primaryColor: '#123456', logoPath: '/test.svg' },
      } as ClientConfig;

      registerClient('convenience-test', config);

      expect(hasClient('convenience-test')).toBe(true);

      // Cleanup
      clientRegistry.unregisterClient('convenience-test');
    });

    it('getAvailableClients() returns available clients', () => {
      const clients = getAvailableClients();

      expect(clients).toContain('docline');
      expect(clients).toContain('facephi');
    });

    it('hasClient() checks client existence', () => {
      expect(hasClient('docline')).toBe(true);
      expect(hasClient('nonexistent')).toBe(false);
    });
  });
});
