import { useState, useEffect, useCallback, useRef } from "react";

// ─────────────────────────────────────────────────────────────
// BASE URLS (PROPRE & STABLE)
// ─────────────────────────────────────────────────────────────

export const API2 = (path: string): string => `/api8002${path}`;
export const API5 = (path: string): string => `/api8005${path}`;

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface UseMLApiOptions {
  refreshInterval?: number;
  skip?: boolean;
}

export interface UseMLApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseMLPostResult<T> {
  loading: boolean;
  error: string | null;
  post: (body: unknown) => Promise<T | null>;
}

// ─────────────────────────────────────────────────────────────
// FETCH WRAPPER
// ─────────────────────────────────────────────────────────────

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} - ${text}`);
  }

  return res.json();
}

// ─────────────────────────────────────────────────────────────
// GET HOOK
// ─────────────────────────────────────────────────────────────

export function useMLApi<T>(
  endpoint: string,
  { refreshInterval = 0, skip = false }: UseMLApiOptions = {}
): UseMLApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (skip) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchJSON<T>(endpoint)
      .then((json) => {
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [endpoint, skip, tick]);

  useEffect(() => {
    if (refreshInterval <= 0 || skip) return;

    const timer = setInterval(refetch, refreshInterval);
    return () => clearInterval(timer);
  }, [refreshInterval, skip, refetch]);

  return { data, loading, error, refetch };
}

// ─────────────────────────────────────────────────────────────
// POST HOOK
// ─────────────────────────────────────────────────────────────

export function useMLPost<T>(endpoint: string): UseMLPostResult<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const post = useCallback(
    async (body: unknown): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetchJSON<T>(endpoint, {
          method: "POST",
          body: JSON.stringify(body),
        });

        setLoading(false);
        return res;
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
        return null;
      }
    },
    [endpoint]
  );

  return { loading, error, post };
}

// ─────────────────────────────────────────────────────────────
// AUTO POST HOOK
// ─────────────────────────────────────────────────────────────

export function useAutoPost<T>(
  endpoint: string,
  body: unknown,
  { refreshInterval = 0 }: UseMLApiOptions = {}
): UseMLApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const bodyRef = useRef(JSON.stringify(body));

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchJSON<T>(endpoint, {
      method: "POST",
      body: bodyRef.current,
    })
      .then((json) => {
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [endpoint, tick]);

  useEffect(() => {
    if (refreshInterval <= 0) return;
    const timer = setInterval(refetch, refreshInterval);
    return () => clearInterval(timer);
  }, [refreshInterval, refetch]);

  return { data, loading, error, refetch };
}