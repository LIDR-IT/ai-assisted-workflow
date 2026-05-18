/**
 * Simple Client Selector - Lightweight dropdown for switching clients
 *
 * This is a simplified version that doesn't depend on external UI libraries
 * and works directly with the existing design system.
 */

import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Building2, ChevronDown, CheckIcon } from 'lucide-react';
import { useAppClient } from '@/contexts';
import { clientRegistry } from '@/data/client-registry';

interface SimpleClientSelectorProps {
  /** Additional CSS classes */
  className?: string;
  /** Whether to show the full client info or just the selector */
  showClientInfo?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether it's collapsed (for sidebar) */
  collapsed?: boolean;
  /** Callback when client changes */
  onClientChange?: (clientId: string) => void;
}

export function SimpleClientSelector({
  className = '',
  showClientInfo = true,
  size = 'md',
  collapsed = false,
  onClientChange,
}: SimpleClientSelectorProps) {
  const { currentClientId, currentClient, availableClients, setClient } = useAppClient();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle client selection: preserve current sub-route while swapping the client segment.
  const handleClientSelect = async (clientId: string) => {
    if (clientId === currentClientId) {
      setIsOpen(false);
      return;
    }

    if (!clientRegistry.hasClient(clientId)) {
      console.error('Unknown client:', clientId);
      return;
    }

    try {
      // Replace the leading `/<oldClient>` segment with `/<newClient>`, keeping the rest.
      // If the path lacks a client segment (e.g. on `/`), navigate to the new client root.
      const rest = location.pathname.replace(/^\/[^/]+/, '');
      const target = `/${clientId}${rest || ''}`;
      navigate(target);
      // Keep the in-memory registry in sync until step 8 removes it altogether.
      await setClient(clientId);
      if (onClientChange) {
        onClientChange(clientId);
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to switch client:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Size-based styles
  const sizeStyles = {
    sm: {
      button: 'px-2 py-1 text-xs',
      icon: 'w-3 h-3',
      dropdown: 'text-xs',
    },
    md: {
      button: 'px-3 py-2 text-sm',
      icon: 'w-4 h-4',
      dropdown: 'text-sm',
    },
    lg: {
      button: 'px-4 py-3 text-base',
      icon: 'w-5 h-5',
      dropdown: 'text-base',
    },
  };

  const styles = sizeStyles[size];

  // Helper function to format client display name from ID
  const formatClientDisplayName = (clientId: string): string => {
    if (clientId === currentClientId && currentClient) {
      return currentClient.name;
    }

    // For other clients, create a formatted name from the ID
    return clientId
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper function to get industry for client (simplified for now)
  const getClientIndustry = (clientId: string): string => {
    if (clientId === currentClientId && currentClient) {
      return currentClient.industry;
    }
    // For demo clients, return generic industry
    return 'Software Development';
  };

  // If only one client available, don't show selector
  if (availableClients.length <= 1) {
    return showClientInfo ? (
      <div className={`flex items-center gap-2 ${className}`}>
        <Building2 className={`${styles.icon} text-slate-400 flex-shrink-0`} />
        {!collapsed && currentClient && (
          <div className="min-w-0">
            <div className={`font-medium text-slate-900 truncate ${styles.dropdown}`}>
              {currentClient.name}
            </div>
            <div className="text-xs text-slate-500 truncate">{currentClient.industry}</div>
          </div>
        )}
      </div>
    ) : null;
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Client Info Display */}
      {showClientInfo && !collapsed && currentClient && (
        <div className="mb-2 px-3">
          <div className="flex items-center gap-2">
            <Building2 className={`${styles.icon} text-indigo-600 flex-shrink-0`} />
            <div className="min-w-0 flex-1">
              <div className={`font-medium text-slate-900 truncate ${styles.dropdown}`}>
                {currentClient.name}
              </div>
              <div className="text-xs text-slate-500 truncate">{currentClient.industry}</div>
            </div>
          </div>
        </div>
      )}

      {/* Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          ${styles.button}
          w-full flex items-center justify-between gap-2
          bg-slate-50 border border-slate-200 rounded-md
          hover:bg-slate-100 hover:border-slate-300
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          transition-all duration-200
          ${collapsed ? 'justify-center px-2' : ''}
        `}
        title={collapsed && currentClient ? `Cliente: ${currentClient.name}` : undefined}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Building2 className={`${styles.icon} text-slate-600 flex-shrink-0`} />
          {!collapsed && (
            <span className="font-medium text-slate-700 truncate">Cambiar Cliente</span>
          )}
        </div>
        {!collapsed && (
          <ChevronDown
            className={`${styles.icon} text-slate-400 flex-shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`
          absolute top-full left-0 right-0 mt-1 z-50
          bg-white border border-slate-200 rounded-md shadow-lg
          max-h-64 overflow-y-auto
          ${styles.dropdown}
        `}
        >
          {availableClients.map((clientId) => (
            <button
              key={clientId}
              onClick={() => handleClientSelect(clientId)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 text-left
                hover:bg-slate-50 transition-colors duration-150
                ${currentClientId === clientId ? 'bg-indigo-50' : ''}
              `}
            >
              <Building2 className={`${styles.icon} text-slate-400 flex-shrink-0`} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`
                    font-medium truncate
                    ${currentClientId === clientId ? 'text-indigo-700' : 'text-slate-900'}
                  `}
                  >
                    {formatClientDisplayName(clientId)}
                  </span>
                  {currentClientId === clientId && (
                    <CheckIcon className="w-3 h-3 text-indigo-600 flex-shrink-0" />
                  )}
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-500 truncate">
                    {getClientIndustry(clientId)}
                  </span>
                </div>
              </div>
            </button>
          ))}

          {/* Footer */}
          <div className="border-t border-slate-200 px-3 py-2 bg-slate-50">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                {availableClients.length} cliente{availableClients.length !== 1 ? 's' : ''}{' '}
                disponible{availableClients.length !== 1 ? 's' : ''}
              </span>
              <span className="text-indigo-600">Multi-Client v1.0</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Simple client indicator for areas where space is limited
 */
export function SimpleClientIndicator({
  collapsed = false,
  size = 'sm',
}: {
  collapsed?: boolean;
  size?: 'sm' | 'md';
}) {
  const { currentClient } = useAppClient();

  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  if (!currentClient) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Building2 className={`${iconSize} text-indigo-600 flex-shrink-0`} />
      {!collapsed && (
        <div className="min-w-0 flex-1">
          <div
            className={`font-medium text-slate-900 truncate ${size === 'sm' ? 'text-sm' : 'text-base'}`}
          >
            {currentClient.name}
          </div>
          <div className="text-xs text-slate-500 truncate">{currentClient.industry}</div>
        </div>
      )}
    </div>
  );
}
