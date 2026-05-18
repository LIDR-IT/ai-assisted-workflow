/**
 * Navigation Entries Hook — Dynamic navigation generation for multi-client setup
 *
 * Generates the sidebar entries for the current client by combining:
 *   - The global ROUTE_REGISTRY (path, icon, default labels)
 *   - The client-specific ClientNavConfig (sections, label overrides, status)
 */

import { useMemo } from 'react';
import type { LucideIcon } from 'lucide-react';
import { useCurrentClient } from './useClientRegistry';
import { getNavConfig, type RouteStatus } from '@/data/nav-config';
import { ROUTES_BY_ID } from '@/app/route-registry';

/** Navigation link item with route and display information */
export interface NavItem {
  type: 'link';
  /** Route id from the route registry (e.g. 'sprint', 'home'). */
  id: string;
  /** Full display label for the navigation item (override or registry default). */
  label: string;
  /** Lucide React icon component. */
  icon: LucideIcon;
  /** Shortened label for compact display modes. */
  shortLabel: string;
  /** Status for visual indicators (ok, warning). 'hidden' entries are filtered out. */
  status?: RouteStatus;
}

/** Navigation section separator for grouping related routes */
export interface NavSeparator {
  type: 'separator';
  label: string;
}

export type NavEntry = NavItem | NavSeparator;

export function useNavEntries(): NavEntry[] {
  const { clientId } = useCurrentClient();

  return useMemo(() => {
    const config = getNavConfig(clientId);
    const entries: NavEntry[] = [];

    if (!config) {
      return entries;
    }

    for (const section of config.sections) {
      entries.push({ type: 'separator', label: section.title });

      for (const routeId of section.routes) {
        const routeDef = ROUTES_BY_ID[routeId];
        if (!routeDef) {
          continue;
        }

        const override = config.routes[routeId];
        if (override?.status === 'hidden') {
          continue;
        }

        const label = override?.label ?? routeDef.defaultLabel;
        const shortLabel = override?.shortLabel ?? override?.label ?? routeDef.defaultShortLabel;

        entries.push({
          type: 'link',
          id: routeId,
          label,
          icon: routeDef.icon,
          shortLabel,
          status: override?.status,
        });
      }
    }

    return entries;
  }, [clientId]);
}
