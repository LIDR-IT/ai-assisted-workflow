import { useLocation, useParams } from 'react-router';
import { AlertTriangle, CheckCircle2, Lightbulb, ShieldAlert, Info } from 'lucide-react';
import {
  getNavConfig,
  getSectionKindFor,
  type SectionKind,
  type RouteStatus,
} from '@/data/nav-config';
import { KNOWN_ROUTE_IDS } from '@/app/route-registry';

interface BannerStyle {
  container: string;
  iconColor: string;
  Icon: typeof AlertTriangle;
  title: string;
}

function pickStyle(kind: SectionKind | undefined, status: RouteStatus): BannerStyle | null {
  // Hidden routes never render; the loader 404s before reaching here.
  if (status === 'hidden') {
    return null;
  }

  if (kind === 'gap' || status === 'warning') {
    return {
      container: 'bg-amber-50 border-amber-200 text-amber-900',
      iconColor: 'text-amber-600',
      Icon: AlertTriangle,
      title: 'Proceso con gaps',
    };
  }

  if (kind === 'risk') {
    return {
      container: 'bg-rose-50 border-rose-200 text-rose-900',
      iconColor: 'text-rose-600',
      Icon: ShieldAlert,
      title: 'Riesgo crítico',
    };
  }

  if (kind === 'solution') {
    return {
      container: 'bg-indigo-50 border-indigo-200 text-indigo-900',
      iconColor: 'text-indigo-600',
      Icon: Lightbulb,
      title: 'Propuesta LIDR',
    };
  }

  if (kind === 'current') {
    return {
      container: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      iconColor: 'text-emerald-600',
      Icon: CheckCircle2,
      title: 'Proceso establecido',
    };
  }

  // 'support' or unknown → neutral info banner only if there's a note
  return {
    container: 'bg-slate-50 border-slate-200 text-slate-700',
    iconColor: 'text-slate-500',
    Icon: Info,
    title: '',
  };
}

/**
 * Derive the active route id from `location.pathname` (e.g. `/aramis/sprint` →
 * `sprint`, `/aramis` → `home`, `/aramis/doc/foo` → `doc`).
 */
function deriveRouteId(pathname: string, clientId: string | undefined): string | null {
  if (!clientId) {
    return null;
  }
  const prefix = `/${clientId}`;
  if (pathname === prefix || pathname === `${prefix}/`) {
    return 'home';
  }
  if (!pathname.startsWith(`${prefix}/`)) {
    return null;
  }
  const rest = pathname.slice(prefix.length + 1);
  const first = rest.split('/')[0];
  if (first && KNOWN_ROUTE_IDS.has(first)) {
    return first;
  }
  return null;
}

/**
 * In-page status banner driven by the current client's nav config.
 * Renders nothing when the route has no status note and no relevant section
 * kind — pages with neutral status (e.g. home) stay clean.
 */
export function RouteStatusBanner() {
  const { clientId } = useParams();
  const location = useLocation();

  const routeId = deriveRouteId(location.pathname, clientId);
  if (!routeId || !clientId) {
    return null;
  }

  const navConfig = getNavConfig(clientId);
  const override = navConfig?.routes[routeId];
  if (!override) {
    return null;
  }

  const kind = getSectionKindFor(navConfig, routeId);
  const style = pickStyle(kind, override.status);
  if (!style) {
    return null;
  }

  // For neutral "support" routes, only show the banner if there's a note.
  if (!style.title && !override.note) {
    return null;
  }

  // For "current" + ok with no note, suppress the banner (keeps home/support clean).
  if (kind === 'current' && override.status === 'ok' && !override.note) {
    return null;
  }

  const { Icon } = style;

  return (
    <div
      className={`mb-6 flex items-start gap-3 rounded-lg border px-4 py-3 ${style.container}`}
      role="status"
    >
      <Icon size={20} className={`mt-0.5 flex-shrink-0 ${style.iconColor}`} />
      <div className="min-w-0">
        {style.title && <p className="text-sm font-semibold leading-tight">{style.title}</p>}
        {override.note && (
          <p className={`${style.title ? 'mt-1 ' : ''}text-sm leading-snug`}>{override.note}</p>
        )}
      </div>
    </div>
  );
}
