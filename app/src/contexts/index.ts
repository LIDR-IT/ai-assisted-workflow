/**
 * Contexts barrel export
 *
 * Centralized export for all React contexts and related hooks.
 */

// App Context
export {
  AppProvider,
  useApp,
  useAppClient,
  useAppTheme,
  useAppUI,
  useAppError,
  useAppLoading,
  type AppState,
  type AppAction,
  type AppContextValue,
  type ThemeConfig,
  type UIPreferences,
  type AppSettings,
} from './AppContext';

// Re-export types for convenience
export type { ClientConfig } from '@/data/client-registry';
