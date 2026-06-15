import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendTarget = env.VITE_BACKEND_URL || "http://localhost:3000";
  const enableML =
    (env.VITE_ENABLE_ML ?? "").toLowerCase() === "true" ||
    env.VITE_ENABLE_ML === "1";

  const proxy: Record<string, any> = {
    "/api/v1": { target: backendTarget, changeOrigin: true, headers: { "ngrok-skip-browser-warning": "true" } },
    "/api/dashboard": { target: backendTarget, changeOrigin: true, headers: { "ngrok-skip-browser-warning": "true" } },
    "/api/vehicles": { target: backendTarget, changeOrigin: true, headers: { "ngrok-skip-browser-warning": "true" } },
    "/api/drivers": { target: backendTarget, changeOrigin: true, headers: { "ngrok-skip-browser-warning": "true" } },
    "/api/support": { target: backendTarget, changeOrigin: true, headers: { "ngrok-skip-browser-warning": "true" } },
    "/api/auth": { target: backendTarget, changeOrigin: true, headers: { "ngrok-skip-browser-warning": "true" } },
    "/api/rides": { target: backendTarget, changeOrigin: true, headers: { "ngrok-skip-browser-warning": "true" } },
    "/api/billing": { target: backendTarget, changeOrigin: true, headers: { "ngrok-skip-browser-warning": "true" } },
    "/api/admin": { target: backendTarget, changeOrigin: true, headers: { "ngrok-skip-browser-warning": "true" } },
    "/api/ratings": { target: backendTarget, changeOrigin: true, headers: { "ngrok-skip-browser-warning": "true" } },
    "/api/places": { target: backendTarget, changeOrigin: true, headers: { "ngrok-skip-browser-warning": "true" } },
    "/api/trips": { target: backendTarget, changeOrigin: true, headers: { "ngrok-skip-browser-warning": "true" } },
    "/api/classes": { target: backendTarget, changeOrigin: true, headers: { "ngrok-skip-browser-warning": "true" } },
    "/api/commissions": { target: backendTarget, changeOrigin: true, headers: { "ngrok-skip-browser-warning": "true" } },
    "/api/membership": { target: backendTarget, changeOrigin: true, headers: { "ngrok-skip-browser-warning": "true" } },
    "/api/work-areas": { target: backendTarget, changeOrigin: true, headers: { "ngrok-skip-browser-warning": "true" } },
    "/api/help-center": { target: backendTarget, changeOrigin: true, headers: { "ngrok-skip-browser-warning": "true" } },
    "/api/upload": { target: backendTarget, changeOrigin: true, headers: { "ngrok-skip-browser-warning": "true" } },
    // ML pricing config API (Flask, deployed on Railway)
    "/api/pricing-config": {
      target: "https://harmonious-renewal-production-db7e.up.railway.app",
      changeOrigin: true,
      secure: true,
      rewrite: (path: string) => path.replace(/^\/api\/pricing-config/, "/api"),
    },
    // Catch-all for any other /api routes to main backend
    "/api": { target: backendTarget, changeOrigin: true, headers: { "ngrok-skip-browser-warning": "true" } },
  };

  if (enableML) {
    proxy["/api8002"] = {
      target: "http://localhost:8002",
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/api8002/, ""),
    };
    proxy["/api8005"] = {
      target: "http://localhost:8005",
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/api8005/, ""),
    };
  }

  return {
    plugins: [react()],
    server: {
      cors: {
        origin: [
          "http://localhost:5173",
          "http://localhost:4173",
          env.FRONTEND_URL ?? "",
        ].filter(Boolean),
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Accept"],
        credentials: true,
      },
      proxy,
    },
  };
});
