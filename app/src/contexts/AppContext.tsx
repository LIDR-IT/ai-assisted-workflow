/**
 * AppContext - Central application state management using React Context
 *
 * This context provides centralized state management for:
 * - Client configuration and switching
 * - Theme and UI preferences
 * - Global app settings
 * - Error handling
 *
 * Replaces prop drilling and provides a single source of truth for app state.
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useClientRegistry } from '@/hooks/useClientRegistry';
import type { ClientConfig } from '@/data/client-registry';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Theme configuration */
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  accentColor: string;
  radius: 'none' | 'sm' | 'md' | 'lg';
  fontScale: 'sm' | 'md' | 'lg';
}

/** UI preferences */
export interface UIPreferences {
  sidebarCollapsed: boolean;
  sidebarOpen: boolean;
  animationsEnabled: boolean;
  soundEnabled: boolean;
  compactMode: boolean;
  showTooltips: boolean;
}

/** Global app settings */
export interface AppSettings {
  language: string;
  timezone: string;
  autoSave: boolean;
  debugMode: boolean;
}

/** Application state */
export interface AppState {
  // Client state
  currentClientId: string;
  currentClient: ClientConfig | null;
  availableClients: readonly string[];
  isClientChanging: boolean;

  // Theme state
  theme: ThemeConfig;

  // UI state
  ui: UIPreferences;

  // App settings
  settings: AppSettings;

  // Error state
  error: string | null;

  // Loading states
  isLoading: boolean;
  loadingMessage: string | null;
}

/** Action types for state reducer */
export type AppAction =
  | {
      type: 'SET_CLIENT';
      payload: { clientId: string; client: ClientConfig; availableClients: readonly string[] };
    }
  | { type: 'SET_CLIENT_CHANGING'; payload: boolean }
  | { type: 'SET_AVAILABLE_CLIENTS'; payload: readonly string[] }
  | { type: 'UPDATE_THEME'; payload: Partial<ThemeConfig> }
  | { type: 'UPDATE_UI'; payload: Partial<UIPreferences> }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LOADING'; payload: { isLoading: boolean; message?: string } }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR_COLLAPSED'; payload: boolean }
  | { type: 'SET_SIDEBAR_OPEN'; payload: boolean }
  | { type: 'RESET_STATE' };

/** Context value type */
export interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;

  // Convenience methods
  setClient: (clientId: string) => Promise<void>;
  updateTheme: (theme: Partial<ThemeConfig>) => void;
  updateUI: (ui: Partial<UIPreferences>) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setLoading: (loading: boolean, message?: string) => void;
}

// ---------------------------------------------------------------------------
// Default Values
// ---------------------------------------------------------------------------

const defaultTheme: ThemeConfig = {
  mode: 'light',
  primaryColor: '#4f46e5', // indigo-600
  accentColor: '#06b6d4', // cyan-500
  radius: 'md',
  fontScale: 'md',
};

const defaultUI: UIPreferences = {
  sidebarCollapsed: false,
  sidebarOpen: false,
  animationsEnabled: true,
  soundEnabled: false,
  compactMode: false,
  showTooltips: true,
};

const defaultSettings: AppSettings = {
  language: 'es',
  timezone: 'Europe/Madrid',
  autoSave: true,
  debugMode: false,
};

const defaultState: AppState = {
  currentClientId: '',
  currentClient: null,
  availableClients: [],
  isClientChanging: false,
  theme: defaultTheme,
  ui: defaultUI,
  settings: defaultSettings,
  error: null,
  isLoading: false,
  loadingMessage: null,
};

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CLIENT':
      return {
        ...state,
        currentClientId: action.payload.clientId,
        currentClient: action.payload.client,
        availableClients: action.payload.availableClients,
        isClientChanging: false,
        error: null,
      };

    case 'SET_CLIENT_CHANGING':
      return {
        ...state,
        isClientChanging: action.payload,
      };

    case 'SET_AVAILABLE_CLIENTS':
      return {
        ...state,
        availableClients: action.payload,
      };

    case 'UPDATE_THEME':
      return {
        ...state,
        theme: { ...state.theme, ...action.payload },
      };

    case 'UPDATE_UI':
      return {
        ...state,
        ui: { ...state.ui, ...action.payload },
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload.isLoading,
        loadingMessage: action.payload.message || null,
      };

    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarOpen: !state.ui.sidebarOpen,
        },
      };

    case 'SET_SIDEBAR_COLLAPSED':
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarCollapsed: action.payload,
        },
      };

    case 'SET_SIDEBAR_OPEN':
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarOpen: action.payload,
        },
      };

    case 'RESET_STATE':
      return defaultState;

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AppContext = createContext<AppContextValue | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider Component
// ---------------------------------------------------------------------------

interface AppProviderProps {
  children: ReactNode;
  /** Initial client ID to load */
  initialClientId?: string;
  /** Whether to persist state to localStorage */
  persistState?: boolean;
}

export function AppProvider({
  children,
  initialClientId: _initialClientId,
  persistState = true,
}: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, defaultState);

  // Initialize client registry hook
  const clientRegistry = useClientRegistry({
    onClientChange: (_fromClientId, toClientId) => {
      try {
        const client = clientRegistry.currentClient;
        const availableClients = clientRegistry.availableClients;

        dispatch({
          type: 'SET_CLIENT',
          payload: {
            clientId: toClientId,
            client,
            availableClients,
          },
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update client state';
        dispatch({ type: 'SET_ERROR', payload: message });
      }
    },
    onError: (error) => {
      dispatch({ type: 'SET_ERROR', payload: error });
    },
  });

  // Initialize state from client registry
  useEffect(() => {
    try {
      dispatch({
        type: 'SET_CLIENT',
        payload: {
          clientId: clientRegistry.currentClientId,
          client: clientRegistry.currentClient,
          availableClients: clientRegistry.availableClients,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to initialize client state';
      dispatch({ type: 'SET_ERROR', payload: message });
    }
  }, [
    clientRegistry.currentClientId,
    clientRegistry.currentClient,
    clientRegistry.availableClients,
  ]);

  // Persist state to localStorage
  useEffect(() => {
    if (!persistState) {
      return;
    }

    try {
      const persistedState = {
        theme: state.theme,
        ui: state.ui,
        settings: state.settings,
      };
      localStorage.setItem('lidr-app-state', JSON.stringify(persistedState));
    } catch (error) {
      console.warn('Failed to persist app state:', error);
    }
  }, [state.theme, state.ui, state.settings, persistState]);

  // Load persisted state
  useEffect(() => {
    if (!persistState) {
      return;
    }

    try {
      const persistedData = localStorage.getItem('lidr-app-state');
      if (persistedData) {
        const parsed = JSON.parse(persistedData);

        if (parsed.theme) {
          dispatch({ type: 'UPDATE_THEME', payload: parsed.theme });
        }
        if (parsed.ui) {
          dispatch({ type: 'UPDATE_UI', payload: parsed.ui });
        }
        if (parsed.settings) {
          dispatch({ type: 'UPDATE_SETTINGS', payload: parsed.settings });
        }
      }
    } catch (error) {
      console.warn('Failed to load persisted app state:', error);
    }
  }, [persistState]);

  // Convenience methods
  const setClient = async (clientId: string): Promise<void> => {
    dispatch({ type: 'SET_CLIENT_CHANGING', payload: true });
    try {
      await clientRegistry.setClient(clientId);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : `Failed to switch to client ${clientId}`;
      dispatch({ type: 'SET_ERROR', payload: message });
      dispatch({ type: 'SET_CLIENT_CHANGING', payload: false });
    }
  };

  const updateTheme = (theme: Partial<ThemeConfig>) => {
    dispatch({ type: 'UPDATE_THEME', payload: theme });
  };

  const updateUI = (ui: Partial<UIPreferences>) => {
    dispatch({ type: 'UPDATE_UI', payload: ui });
  };

  const updateSettings = (settings: Partial<AppSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const setSidebarCollapsed = (collapsed: boolean) => {
    dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: collapsed });
  };

  const setSidebarOpen = (open: boolean) => {
    dispatch({ type: 'SET_SIDEBAR_OPEN', payload: open });
  };

  const setLoading = (loading: boolean, message?: string) => {
    dispatch({ type: 'SET_LOADING', payload: { isLoading: loading, message } });
  };

  const contextValue: AppContextValue = {
    state,
    dispatch,
    setClient,
    updateTheme,
    updateUI,
    updateSettings,
    setError,
    clearError,
    toggleSidebar,
    setSidebarCollapsed,
    setSidebarOpen,
    setLoading,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Hook to access the app context.
 * Must be used within an AppProvider.
 */
export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// ---------------------------------------------------------------------------
// Convenience Hooks
// ---------------------------------------------------------------------------

/**
 * Hook for accessing only client state
 */
export function useAppClient() {
  const { state, setClient } = useApp();
  return {
    currentClientId: state.currentClientId,
    currentClient: state.currentClient,
    availableClients: state.availableClients,
    isChanging: state.isClientChanging,
    setClient,
  };
}

/**
 * Hook for accessing only theme state
 */
export function useAppTheme() {
  const { state, updateTheme } = useApp();
  return {
    theme: state.theme,
    updateTheme,
  };
}

/**
 * Hook for accessing only UI state
 */
export function useAppUI() {
  const { state, updateUI, toggleSidebar, setSidebarCollapsed, setSidebarOpen } = useApp();
  return {
    ui: state.ui,
    updateUI,
    toggleSidebar,
    setSidebarCollapsed,
    setSidebarOpen,
  };
}

/**
 * Hook for accessing only error state
 */
export function useAppError() {
  const { state, setError, clearError } = useApp();
  return {
    error: state.error,
    setError,
    clearError,
  };
}

/**
 * Hook for accessing loading state
 */
export function useAppLoading() {
  const { state, setLoading } = useApp();
  return {
    isLoading: state.isLoading,
    loadingMessage: state.loadingMessage,
    setLoading,
  };
}
