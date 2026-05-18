/**
 * Propuesta Store — JSON loader for "Propuesta de Mejora" content per client.
 *
 * Three content kinds per client:
 *   - diagnostico → DiagnosticoSchema
 *   - mejoras     → MejorasSchema
 *   - flujo       → FlujoSchema
 *
 * Each lives at: `/src/data/clients/<clientId>/propuesta/<kind>.json`
 *
 * Uses Vite's `import.meta.glob` to bundle all JSONs at build time and lazy-load
 * them on demand. No caching layer — the bundler already caches modules.
 */

import {
  validateDiagnostico,
  validateMejoras,
  validateFlujo,
  type Diagnostico,
  type Mejoras,
  type Flujo,
} from './schemas/propuesta-schema';

export type PropuestaKind = 'diagnostico' | 'mejoras' | 'flujo';

export type PropuestaContent<K extends PropuestaKind> = K extends 'diagnostico'
  ? Diagnostico
  : K extends 'mejoras'
    ? Mejoras
    : Flujo;

const propuestaModules = import.meta.glob<{ default: unknown }>(
  '/src/data/clients/*/propuesta/*.json'
);

/** Resolution hierarchy: try clientId first, then 'base' as fallback. */
const BASE_CLIENT_ID = 'base';

async function loadAndValidate<K extends PropuestaKind>(
  clientId: string,
  kind: K
): Promise<PropuestaContent<K> | null> {
  const key = `/src/data/clients/${clientId}/propuesta/${kind}.json`;
  const loader = propuestaModules[key];
  if (!loader) {
    return null;
  }

  const mod = await loader();
  const raw = (mod as { default: unknown }).default ?? mod;

  const result =
    kind === 'diagnostico'
      ? validateDiagnostico(raw)
      : kind === 'mejoras'
        ? validateMejoras(raw)
        : validateFlujo(raw);

  if (!result.success) {
    throw new Error(`Invalid ${kind}.json for client '${clientId}': ${result.errors?.join('; ')}`);
  }
  return result.data as PropuestaContent<K>;
}

/**
 * Load a propuesta JSON for a given client and kind.
 * Resolution order: clients/<clientId>/propuesta/<kind>.json → clients/base/propuesta/<kind>.json → null.
 * Throws if the JSON exists but fails schema validation.
 */
export async function loadPropuestaContent<K extends PropuestaKind>(
  clientId: string,
  kind: K
): Promise<PropuestaContent<K> | null> {
  const own = await loadAndValidate(clientId, kind);
  if (own) {
    return own;
  }
  if (clientId === BASE_CLIENT_ID) {
    return null;
  }
  return await loadAndValidate(BASE_CLIENT_ID, kind);
}

/** Returns the list of clients that have at least one propuesta JSON. */
export function listClientsWithPropuesta(): string[] {
  const clients = new Set<string>();
  for (const key of Object.keys(propuestaModules)) {
    const match = key.match(/\/clients\/([^/]+)\/propuesta\//);
    if (match) {
      clients.add(match[1]!);
    }
  }
  return Array.from(clients).sort();
}

/** Returns which kinds are available for a given client. */
export function listAvailableKinds(clientId: string): PropuestaKind[] {
  const kinds: PropuestaKind[] = [];
  for (const k of ['diagnostico', 'mejoras', 'flujo'] as const) {
    if (propuestaModules[`/src/data/clients/${clientId}/propuesta/${k}.json`]) {
      kinds.push(k);
    }
  }
  return kinds;
}
