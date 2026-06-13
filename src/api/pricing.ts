import { useState, useEffect, useCallback, useRef } from "react";

const BASE_URL = import.meta.env.VITE_ML_CONFIG_URL
  ? String(import.meta.env.VITE_ML_CONFIG_URL).replace(/\/$/, "")
  : "";

const API_PREFIX = `${BASE_URL}/api/rides/pricing`;

export interface PricingConfig {
  BASE_FARE: number;
  RATE_PER_KM: number;
  RATE_PER_MIN: number;
  MIN_FARE: number;
  W_XGB: number;
  W_LGBM: number;
  MULT_TRAFFIC: Record<string, number>;
  MULT_WEATHER: Record<string, number>;
  MULT_DEMAND: Record<string, number>;
  MULT_NIGHT: number;
  MULT_CAR: Record<string, number>;
  MULT_FRIDAY_JUMUAH: number;
  MULT_RAMADAN: Record<string, number>;
  MULT_BEACH: Record<string, number>;
  MULT_ZONE: Record<string, number>;
  MULT_SPECIAL_EVENT: Record<string, number>;
  ENABLE_TRAFFIC: boolean;
  ENABLE_WEATHER: boolean;
  ENABLE_DEMAND: boolean;
  ENABLE_NIGHT: boolean;
  ENABLE_FRIDAY_JUMUAH: boolean;
  ENABLE_RAMADAN: boolean;
  ENABLE_BEACH: boolean;
  ENABLE_ZONE: boolean;
  ENABLE_SPECIAL_EVENT: boolean;
  ENABLE_SEASON: boolean;
  XGB_PARAMS: Record<string, number | string>;
  LGBM_PARAMS: Record<string, number | string>;
}

export interface PricingConfigResponse {
  status?: string;
  config: PricingConfig;
}

export type PricingStatus = "idle" | "loading" | "saving" | "saved" | "error";

export interface UsePricingConfigResult {
  config: PricingConfig | null;
  status: PricingStatus;
  errorMsg: string;
  fetchConfig: () => void;
  saveConfig: (cfg: PricingConfig) => Promise<boolean>;
  resetConfig: () => Promise<boolean>;
  setConfigField: <K extends keyof PricingConfig>(key: K, val: PricingConfig[K]) => void;
  setNestedNum: <K extends keyof PricingConfig>(sectionKey: K, itemKey: string, val: number) => void;
  setNestedVal: <K extends keyof PricingConfig>(sectionKey: K, itemKey: string, val: number | string) => void;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? body.detail ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

function getHeaders(): Record<string, string> {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function usePricingConfig(): UsePricingConfigResult {
  const [config, setConfig] = useState<PricingConfig | null>(null);
  const [status, setStatus] = useState<PricingStatus>("loading");
  const [errorMsg, setErrorMsg] = useState("");

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const fetchConfig = useCallback(async () => {
    if (!mountedRef.current) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch(`${API_PREFIX}/config`, { headers: getHeaders() });
      const data = await handleResponse<PricingConfigResponse>(res);
      if (mountedRef.current) {
        setConfig(data.config ?? data);
        setStatus("idle");
      }
    } catch (err: unknown) {
      if (mountedRef.current) {
        setErrorMsg(err instanceof Error ? err.message : "Failed to load pricing config");
        setStatus("error");
      }
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const saveConfig = useCallback(async (cfg: PricingConfig): Promise<boolean> => {
    if (!mountedRef.current) return false;
    setStatus("saving");
    setErrorMsg("");
    try {
      const res = await fetch(`${API_PREFIX}/config`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(cfg),
      });
      const data = await handleResponse<PricingConfigResponse>(res);
      if (mountedRef.current) {
        if (data.config) setConfig(data.config);
        setStatus("saved");
        setTimeout(() => {
          if (mountedRef.current) setStatus((s) => (s === "saved" ? "idle" : s));
        }, 2500);
      }
      return true;
    } catch (err: unknown) {
      if (mountedRef.current) {
        setErrorMsg(err instanceof Error ? err.message : "Save failed");
        setStatus("error");
      }
      return false;
    }
  }, []);

  const resetConfig = useCallback(async (): Promise<boolean> => {
    if (!mountedRef.current) return false;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch(`${API_PREFIX}/config/reset`, {
        method: "POST",
        headers: getHeaders(),
      });
      const data = await handleResponse<PricingConfigResponse>(res);
      if (mountedRef.current) {
        if (data.config) setConfig(data.config);
        setStatus("idle");
      }
      return true;
    } catch (err: unknown) {
      if (mountedRef.current) {
        setErrorMsg(err instanceof Error ? err.message : "Reset failed");
        setStatus("error");
      }
      return false;
    }
  }, []);

  const setConfigField = useCallback(<K extends keyof PricingConfig>(key: K, val: PricingConfig[K]) => {
    setConfig((prev) => (prev ? { ...prev, [key]: val } : prev));
  }, []);

  const setNestedNum = useCallback(<K extends keyof PricingConfig>(sectionKey: K, itemKey: string, val: number) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const section = prev[sectionKey] as Record<string, number>;
      return { ...prev, [sectionKey]: { ...section, [itemKey]: val } };
    });
  }, []);

  const setNestedVal = useCallback(<K extends keyof PricingConfig>(sectionKey: K, itemKey: string, val: number | string) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const section = prev[sectionKey] as Record<string, number | string>;
      return { ...prev, [sectionKey]: { ...section, [itemKey]: val } };
    });
  }, []);

  return {
    config,
    status,
    errorMsg,
    fetchConfig,
    saveConfig,
    resetConfig,
    setConfigField,
    setNestedNum,
    setNestedVal,
  };
}