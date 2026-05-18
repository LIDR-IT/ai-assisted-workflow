/**
 * usePropuestaContent — React hook that loads "Propuesta de Mejora" JSON for the
 * current (or specified) client. Returns loading/error state and the validated
 * content. If the JSON does not exist, `data` is null and `notFound` is true —
 * the caller can then fall back to legacy TSX data.
 */

import { useEffect, useState, useCallback } from 'react';
import { useCurrentClient } from './useClientRegistry';
import {
  loadPropuestaContent,
  type PropuestaContent,
  type PropuestaKind,
} from '@/data/propuesta-store';

export interface UsePropuestaContentReturn<K extends PropuestaKind> {
  readonly data: PropuestaContent<K> | null;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly error: string | null;
  /** True when no JSON exists for this client+kind (caller should fall back). */
  readonly notFound: boolean;
  readonly reload: () => void;
}

export interface UsePropuestaContentOptions {
  readonly clientId?: string;
}

export function usePropuestaContent<K extends PropuestaKind>(
  kind: K,
  options: UsePropuestaContentOptions = {}
): UsePropuestaContentReturn<K> {
  const { clientId: overrideClientId } = options;
  const { clientId: currentClientId } = useCurrentClient();
  const effectiveClientId = (overrideClientId ?? currentClientId).toLowerCase();

  const [data, setData] = useState<PropuestaContent<K> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  const reload = useCallback(() => setReloadToken((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    setNotFound(false);

    loadPropuestaContent(effectiveClientId, kind)
      .then((content) => {
        if (cancelled) {
          return;
        }
        if (content === null) {
          setData(null);
          setNotFound(true);
        } else {
          setData(content);
        }
      })
      .catch((err: unknown) => {
        if (cancelled) {
          return;
        }
        setError(err instanceof Error ? err.message : `Failed to load ${kind}.json`);
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [effectiveClientId, kind, reloadToken]);

  return {
    data,
    isLoading,
    isError: error !== null,
    error,
    notFound,
    reload,
  };
}
