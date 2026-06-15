import axios from "axios";
import { getToken, setToken, clearToken } from "../lib/auth";

const apiClient = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// ─── Shared hook so AuthContext can register its updater ──────────────────────
let _updateAccessToken: ((token: string) => void) | null = null;

export function registerTokenUpdater(fn: (token: string) => void) {
  _updateAccessToken = fn;
}

// ─── Request: attach access token ────────────────────────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Response: auto-refresh on 401 ───────────────────────────────────────────
let isRefreshing = false;
let isRedirecting = false; // ✅ guard: only redirect once
let queue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

function processQueue(err: unknown, token: string | null) {
  queue.forEach((p) => (err ? p.reject(err) : p.resolve(token!)));
  queue = [];
}

function doRedirect() {
  // ✅ Prevents multiple simultaneous 401s from each firing window.location.href
  if (isRedirecting) return;
  isRedirecting = true;
  clearToken();
  window.location.href = "/";
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Don't retry the refresh endpoint itself to avoid infinite loops
    if (original.url?.includes("/auth/refresh")) {
      doRedirect();
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      doRedirect();
      return Promise.reject(error);
    }

    // ✅ If a refresh is already in-flight, queue this request — don't redirect
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: (token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(original));
          },
          reject,
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const res = await axios.post<{ accessToken: string; refreshToken?: string }>(
        "/api/auth/refresh",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      const newAccess = res.data.accessToken;
      setToken(newAccess);

      // Sync React state so isAuthenticated stays true
      _updateAccessToken?.(newAccess);

      // Store the new rotated refresh token if provided
      if (res.data.refreshToken) {
        localStorage.setItem("refreshToken", res.data.refreshToken);
      }

      processQueue(null, newAccess);
      original.headers.Authorization = `Bearer ${newAccess}`;
      return apiClient(original);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      doRedirect();
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;