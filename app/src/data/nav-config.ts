// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RouteStatus = 'ok' | 'warning' | 'hidden';

/**
 * Semantic role of a sidebar section. Drives the color/icon of the in-page
 * RouteStatusBanner so the same route can appear in different contexts per
 * client (e.g. `sprint` is `current` for FacePhi and Aramis, but `current` and
 * `support` are visually distinct).
 */
export type SectionKind =
  | 'current' // Established / working process for this client
  | 'gap' // Broken / informal / absent process
  | 'risk' // Critical risk surface (e.g. security, infra)
  | 'solution' // LIDR proposal / improvement
  | 'support'; // Help, docs, integrity tools

export interface RouteNavOverride {
  /** Sidebar label. Falls back to the registry's `defaultLabel`. */
  label?: string;
  /** Compact sidebar label. Falls back to `defaultShortLabel`. */
  shortLabel?: string;
  /** Visibility/status flag. `hidden` makes the route 404 for this client. */
  status: RouteStatus;
  /** Short explanatory note shown in the in-page status banner. */
  note?: string;
}

export interface NavSection {
  title: string;
  /** Route ids (e.g. 'sprint', 'home') as defined in route-registry. */
  routes: string[];
  /** Semantic role; drives banner color/icon for routes in this section. */
  kind?: SectionKind;
}

export interface ClientNavConfig {
  sections: NavSection[];
  /** Keyed by route id (e.g. 'sprint', 'home'). */
  routes: Record<string, RouteNavOverride>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Find the `SectionKind` for a route id within a client's nav config, by
 * scanning sections until the id is found. Returns `undefined` if no kind is
 * declared or the route is not listed.
 */
export function getSectionKindFor(
  config: ClientNavConfig | undefined,
  routeId: string
): SectionKind | undefined {
  if (!config) {
    return undefined;
  }
  for (const section of config.sections) {
    if (section.routes.includes(routeId)) {
      return section.kind;
    }
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

const navConfigRegistry: Record<string, ClientNavConfig> = {};

export function registerNavConfig(clientId: string, config: ClientNavConfig): void {
  navConfigRegistry[clientId] = config;
}

export function getNavConfig(clientId: string): ClientNavConfig | undefined {
  return navConfigRegistry[clientId];
}

// ---------------------------------------------------------------------------
// Real Client Nav Configs
// ---------------------------------------------------------------------------

import { facephiNavConfig } from './clients/facephi/nav';
import { doclineNavConfig } from './clients/docline/nav';
import { aramisNavConfig } from './clients/aramis/nav';

registerNavConfig('facephi', facephiNavConfig);
registerNavConfig('docline', doclineNavConfig);
registerNavConfig('aramis', aramisNavConfig);
