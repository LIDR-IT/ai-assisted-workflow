/**
 * ClientSelector — UI component for switching between clients
 *
 * This component provides a dropdown interface for users to switch between
 * different client configurations in the multi-client architecture. It
 * integrates with the client registry and provides visual feedback for
 * the current client state.
 *
 * Features:
 * - Dropdown selector with client list
 * - Current client indicator with branding
 * - Loading states during client switching
 * - Error handling and user feedback
 * - Responsive design for header integration
 * - Keyboard navigation support
 * - Accessibility compliance
 *
 * Part of the Phase 1 infrastructure for multi-client JSON architecture.
 */

import React from 'react';
import { Building2, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components/ui/tooltip';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { useClientRegistry, useClientConfig } from '@/hooks';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Props for the ClientSelector component */
export interface ClientSelectorProps {
  /** Additional CSS classes */
  readonly className?: string;

  /** Whether to show the client name or just the selector */
  readonly showLabel?: boolean;

  /** Size variant for the selector */
  readonly size?: 'sm' | 'md' | 'lg';

  /** Whether to show industry badge */
  readonly showIndustryBadge?: boolean;

  /** Whether to show team size indicator */
  readonly showTeamSize?: boolean;

  /** Callback when client changes */
  readonly onClientChange?: (fromClientId: string, toClientId: string) => void;

  /** Whether the selector is disabled */
  readonly disabled?: boolean;

  /** Placeholder text when no client is selected */
  readonly placeholder?: string;
}

// ---------------------------------------------------------------------------
// Component Implementation
// ---------------------------------------------------------------------------

/**
 * Client selector dropdown component for switching between clients.
 *
 * This component provides a user-friendly interface for switching between
 * registered clients, with visual indicators for the current client state.
 *
 * @param props Component props
 * @returns JSX element
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ClientSelector />
 *
 * // With custom styling and callbacks
 * <ClientSelector
 *   className="w-64"
 *   showLabel={true}
 *   showIndustryBadge={true}
 *   onClientChange={(from, to) => console.log(`Switched from ${from} to ${to}`)}
 * />
 *
 * // Compact version for mobile
 * <ClientSelector
 *   size="sm"
 *   showLabel={false}
 *   showIndustryBadge={false}
 * />
 * ```
 */
export function ClientSelector({
  className,
  showLabel = true,
  size = 'md',
  showIndustryBadge = true,
  showTeamSize = false,
  onClientChange,
  disabled = false,
  placeholder = 'Select client...',
}: ClientSelectorProps): React.JSX.Element {
  const {
    currentClientId,
    currentClient,
    availableClients,
    setClient,
    isChanging,
    error,
    clearError,
  } = useClientRegistry({
    onClientChange,
  });

  const { computed, branding } = useClientConfig();

  // Handle client selection
  const handleClientSelect = React.useCallback(
    async (clientId: string) => {
      if (clientId === currentClientId || isChanging || disabled) {
        return;
      }

      clearError();
      await setClient(clientId);
    },
    [currentClientId, isChanging, disabled, clearError, setClient]
  );

  // Size-based styling
  const sizeStyles = React.useMemo(() => {
    switch (size) {
      case 'sm':
        return {
          trigger: 'h-8 text-xs px-2',
          content: 'text-xs',
          badge: 'text-xs px-1.5 py-0.5',
        };
      case 'lg':
        return {
          trigger: 'h-12 text-base px-4',
          content: 'text-base',
          badge: 'text-sm px-2.5 py-1',
        };
      default: // md
        return {
          trigger: 'h-10 text-sm px-3',
          content: 'text-sm',
          badge: 'text-xs px-2 py-0.5',
        };
    }
  }, [size]);

  // Format client display name
  const formatClientDisplay = React.useCallback(
    (clientId: string): string => {
      if (clientId === currentClientId) {
        return currentClient.name;
      }

      // For other clients, use a capitalized version of the ID
      return clientId
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },
    [currentClientId, currentClient.name]
  );

  // Render client option with additional info
  const renderClientOption = React.useCallback(
    (clientId: string) => {
      const isCurrentClient = clientId === currentClientId;
      const displayName = formatClientDisplay(clientId);

      return (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4" />
            <span>{displayName}</span>
          </div>
          {isCurrentClient && (
            <div className="flex items-center space-x-1">
              <Badge variant="secondary" className={sizeStyles.badge}>
                Active
              </Badge>
            </div>
          )}
        </div>
      );
    },
    [currentClientId, formatClientDisplay, sizeStyles.badge]
  );

  // Error display
  if (error) {
    return (
      <div className={className}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button variant="outline" size="sm" onClick={clearError} className="ml-2">
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={`flex items-center space-x-2 ${className || ''}`}>
        {/* Client info display */}
        {showLabel && (
          <div className="flex items-center space-x-2">
            <Building2
              className="w-5 h-5"
              style={{ color: branding.colorVars['--primary-color'] }}
            />
            <div className="flex flex-col">
              <span className="font-medium text-sm">{currentClient.name}</span>
              <div className="flex items-center space-x-2">
                {showIndustryBadge && (
                  <Badge variant="outline" className={sizeStyles.badge}>
                    {currentClient.industry}
                  </Badge>
                )}
                {showTeamSize && (
                  <Badge variant="secondary" className={sizeStyles.badge}>
                    {computed.totalTeamSize} members
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Client selector */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Select
              value={currentClientId}
              onValueChange={handleClientSelect}
              disabled={disabled || isChanging}
            >
              <SelectTrigger className={`min-w-[180px] ${sizeStyles.trigger}`}>
                <div className="flex items-center space-x-2">
                  {isChanging && <Loader2 className="w-4 h-4 animate-spin" />}
                  {!showLabel && (
                    <>
                      <Building2 className="w-4 h-4" />
                      <SelectValue placeholder={placeholder} />
                    </>
                  )}
                  {showLabel && <ChevronDown className="w-4 h-4" />}
                </div>
              </SelectTrigger>

              <SelectContent className={sizeStyles.content}>
                {availableClients.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    No clients available
                  </div>
                ) : (
                  availableClients.map((clientId) => (
                    <SelectItem key={clientId} value={clientId} className="cursor-pointer">
                      {renderClientOption(clientId)}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </TooltipTrigger>

          <TooltipContent>
            <div className="text-sm">
              <div className="font-medium">Switch Client</div>
              <div className="text-muted-foreground">
                Current: {currentClient.name} ({currentClient.industry})
              </div>
              {availableClients.length > 1 && (
                <div className="text-muted-foreground">
                  {availableClients.length - 1} other client{availableClients.length > 2 ? 's' : ''}{' '}
                  available
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

// ---------------------------------------------------------------------------
// Convenience Components
// ---------------------------------------------------------------------------

/**
 * Compact client selector for use in mobile layouts or tight spaces.
 */
export function CompactClientSelector(props: Omit<ClientSelectorProps, 'showLabel' | 'size'>) {
  return <ClientSelector {...props} showLabel={false} size="sm" />;
}

/**
 * Full client selector with all information displayed.
 */
export function FullClientSelector(props: ClientSelectorProps) {
  return (
    <ClientSelector
      {...props}
      showLabel={true}
      showIndustryBadge={true}
      showTeamSize={true}
      size="lg"
    />
  );
}

/**
 * Header client selector optimized for use in navigation headers.
 */
export function HeaderClientSelector(
  props: Omit<ClientSelectorProps, 'size' | 'showIndustryBadge'>
) {
  return <ClientSelector {...props} size="md" showIndustryBadge={false} />;
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export default ClientSelector;
