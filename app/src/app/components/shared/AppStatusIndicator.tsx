/**
 * AppStatusIndicator - Displays current app context state
 *
 * Shows client, theme, and UI state information from the AppContext.
 * Useful for debugging and development to see the current context state.
 */

import { useApp } from '@/contexts';
import { Building2, Palette, Sidebar, AlertCircle } from 'lucide-react';

interface AppStatusIndicatorProps {
  /** Whether to show detailed information */
  detailed?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function AppStatusIndicator({ detailed = false, className = '' }: AppStatusIndicatorProps) {
  const { state } = useApp();

  if (!detailed) {
    // Simple status indicator
    return (
      <div className={`flex items-center gap-2 text-xs text-slate-500 ${className}`}>
        <Building2 size={12} />
        <span>{state.currentClient?.name || 'No Client'}</span>
        {state.isLoading && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span>Loading...</span>
          </div>
        )}
        {state.error && (
          <div className="flex items-center gap-1 text-red-500">
            <AlertCircle size={12} />
            <span>Error</span>
          </div>
        )}
      </div>
    );
  }

  // Detailed status display
  return (
    <div className={`space-y-3 p-4 bg-slate-50 rounded-lg border text-xs ${className}`}>
      {/* Client Status */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 font-semibold text-slate-700">
          <Building2 size={14} />
          <span>Client</span>
        </div>
        <div className="pl-5 space-y-1">
          <div>
            <span className="font-medium">Current:</span> {state.currentClient?.name || 'None'}
          </div>
          <div>
            <span className="font-medium">ID:</span> {state.currentClientId || 'None'}
          </div>
          <div>
            <span className="font-medium">Available:</span> {state.availableClients.length}
          </div>
          {state.isClientChanging && (
            <div className="text-blue-600 flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span>Changing client...</span>
            </div>
          )}
        </div>
      </div>

      {/* Theme Status */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 font-semibold text-slate-700">
          <Palette size={14} />
          <span>Theme</span>
        </div>
        <div className="pl-5 space-y-1">
          <div>
            <span className="font-medium">Mode:</span> {state.theme.mode}
          </div>
          <div>
            <span className="font-medium">Primary:</span>
            <span
              className="ml-1 inline-block w-3 h-3 rounded border"
              style={{ backgroundColor: state.theme.primaryColor }}
            />
            <span className="ml-1">{state.theme.primaryColor}</span>
          </div>
          <div>
            <span className="font-medium">Radius:</span> {state.theme.radius}
          </div>
        </div>
      </div>

      {/* UI Status */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 font-semibold text-slate-700">
          <Sidebar size={14} />
          <span>UI State</span>
        </div>
        <div className="pl-5 space-y-1">
          <div>
            <span className="font-medium">Sidebar Open:</span>
            <span className={`ml-1 ${state.ui.sidebarOpen ? 'text-green-600' : 'text-red-600'}`}>
              {state.ui.sidebarOpen ? 'Yes' : 'No'}
            </span>
          </div>
          <div>
            <span className="font-medium">Sidebar Collapsed:</span>
            <span
              className={`ml-1 ${state.ui.sidebarCollapsed ? 'text-green-600' : 'text-red-600'}`}
            >
              {state.ui.sidebarCollapsed ? 'Yes' : 'No'}
            </span>
          </div>
          <div>
            <span className="font-medium">Animations:</span>
            <span
              className={`ml-1 ${state.ui.animationsEnabled ? 'text-green-600' : 'text-red-600'}`}
            >
              {state.ui.animationsEnabled ? 'On' : 'Off'}
            </span>
          </div>
          <div>
            <span className="font-medium">Compact Mode:</span>
            <span className={`ml-1 ${state.ui.compactMode ? 'text-green-600' : 'text-red-600'}`}>
              {state.ui.compactMode ? 'On' : 'Off'}
            </span>
          </div>
        </div>
      </div>

      {/* Loading Status */}
      {state.isLoading && (
        <div className="space-y-2">
          <div className="font-semibold text-slate-700">Loading</div>
          <div className="pl-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span>{state.loadingMessage || 'Loading...'}</span>
          </div>
        </div>
      )}

      {/* Error Status */}
      {state.error && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-semibold text-red-700">
            <AlertCircle size={14} />
            <span>Error</span>
          </div>
          <div className="pl-5 text-red-600 text-xs break-words">{state.error}</div>
        </div>
      )}

      {/* Settings Status */}
      <div className="space-y-2">
        <div className="font-semibold text-slate-700">Settings</div>
        <div className="pl-2 space-y-1">
          <div>
            <span className="font-medium">Language:</span> {state.settings.language}
          </div>
          <div>
            <span className="font-medium">Auto Save:</span>
            <span className={`ml-1 ${state.settings.autoSave ? 'text-green-600' : 'text-red-600'}`}>
              {state.settings.autoSave ? 'On' : 'Off'}
            </span>
          </div>
          <div>
            <span className="font-medium">Debug Mode:</span>
            <span
              className={`ml-1 ${state.settings.debugMode ? 'text-yellow-600' : 'text-slate-500'}`}
            >
              {state.settings.debugMode ? 'On' : 'Off'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook for creating app status debugging components
 */
export function useAppStatus() {
  const { state } = useApp();

  return {
    isHealthy: !state.error && !state.isLoading,
    hasError: !!state.error,
    isLoading: state.isLoading,
    clientInfo: {
      id: state.currentClientId,
      name: state.currentClient?.name,
      industry: state.currentClient?.industry,
      isChanging: state.isClientChanging,
    },
    summary: {
      client: state.currentClient?.name || 'None',
      theme: state.theme.mode,
      sidebarOpen: state.ui.sidebarOpen,
      sidebarCollapsed: state.ui.sidebarCollapsed,
    },
  };
}
