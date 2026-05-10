/**
 * hooks/useMLApi.ts
 *
 * Hook générique pour appeler l'API ML Moviroo.
 * Gère le chargement, les erreurs et le rafraîchissement automatique.
 *
 * Usage :
 *   const { data, loading, error, refetch } = useMLApi<OverviewResponse>("/intelligence/");
 */

import { useState, useEffect, useCallback, useRef } from "react";

// ── Base URL ───────────────────────────────────────────────────────────────────
// En développement : proxy Vite vers http://localhost:8000
// En production    : variable d'environnement VITE_API_URL
const BASE_URL = import.meta.env.VITE_API_URL
  ? String(import.meta.env.VITE_API_URL).replace(/\/api\/?$/, "").replace(/\/$/, "")
  : "";
// ── Types génériques ───────────────────────────────────────────────────────────

export interface UseMLApiResult<T> {
  data:    T | null;
  loading: boolean;
  error:   string | null;
  refetch: () => void;
}

export interface UseMLApiOptions {
  /** Intervalle de rafraîchissement automatique en ms (0 = désactivé) */
  refreshInterval?: number;
  /** Déclencher le fetch au montage (défaut : true) */
  immediate?: boolean;
}

// ── Hook principal ─────────────────────────────────────────────────────────────

export function useMLApi<T>(
  path: string,
  options: UseMLApiOptions = {},
): UseMLApiResult<T> {
  const { refreshInterval = 0, immediate = true } = options;

  const [data,    setData]    = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error,   setError]   = useState<string | null>(null);

  // Ref pour éviter les setState sur un composant démonté
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const fetchData = useCallback(async () => {
    if (!mountedRef.current) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        // Tente de lire le message d'erreur FastAPI (champ "detail")
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail ?? `HTTP ${res.status}`);
      }

      const json: T = await res.json();
      if (mountedRef.current) setData(json);

    } catch (err: unknown) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Erreur réseau inconnue");
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [path]);

  // Fetch initial
  useEffect(() => {
    if (immediate) fetchData();
  }, [fetchData, immediate]);

  // Rafraîchissement automatique
  useEffect(() => {
    if (!refreshInterval) return;
    const id = setInterval(fetchData, refreshInterval);
    return () => clearInterval(id);
  }, [fetchData, refreshInterval]);

  return { data, loading, error, refetch: fetchData };
}


// ── Hook POST (pour retrain, predict…) ────────────────────────────────────────

export interface UseMLPostResult<TRes> {
  data:    TRes | null;
  loading: boolean;
  error:   string | null;
  post:    (body: unknown) => Promise<TRes | null>;
}

export function useMLPost<TRes>(path: string): UseMLPostResult<TRes> {
  const [data,    setData]    = useState<TRes | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const post = useCallback(async (body: unknown): Promise<TRes | null> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });

      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.detail ?? `HTTP ${res.status}`);
      }

      const json: TRes = await res.json();
      setData(json);
      return json;

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur réseau inconnue");
      return null;
    } finally {
      setLoading(false);
    }
  }, [path]);

  return { data, loading, error, post };
}
