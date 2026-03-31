import axios from "axios";
import { getToken, setToken, clearToken } from "../lib/auth";

const apiClient = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// ─── Request: attach access token ────────────────────────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Response: auto-refresh on 401 ───────────────────────────────────────────
let isRefreshing = false;
let queue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

function processQueue(err: unknown, token: string | null) {
  queue.forEach((p) => (err ? p.reject(err) : p.resolve(token!)));
  queue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Only intercept 401s that haven't already been retried
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      // No refresh token — clear session and let the app redirect to login
      clearToken();
      window.location.href = "/";
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Another refresh is in flight — queue this request
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

    original._retry   = true;
    isRefreshing      = true;

    try {
      const res = await axios.post<{ accessToken: string; refreshToken?: string }>(
        "/api/auth/refresh",
        { refreshToken },
        { headers: { "Content-Type": "application/json" } }
      );

      const newAccess = res.data.accessToken;
      setToken(newAccess);

      // If the backend also rotates the refresh token, save it
      if (res.data.refreshToken) {
        localStorage.setItem("refreshToken", res.data.refreshToken);
      }

      processQueue(null, newAccess);
      original.headers.Authorization = `Bearer ${newAccess}`;
      return apiClient(original);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      clearToken();
      window.location.href = "/";
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;