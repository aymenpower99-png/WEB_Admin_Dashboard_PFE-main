// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react({
//       babel: {
//         plugins: [['babel-plugin-react-compiler']],
//       },
//     }),
//   ],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:3000',
//         changeOrigin: true,
//         // NO rewrite — backend expects /api prefix
//       },
//     },
//   },
// })
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const enableML =
    (env.VITE_ENABLE_ML ?? "").toLowerCase() === "true" ||
    env.VITE_ENABLE_ML === "1";

  const proxy: Record<string, any> = {
    "/api/v1": { target: "http://localhost:3000", changeOrigin: true },
    "/api/dashboard": { target: "http://localhost:3000", changeOrigin: true },
    "/api/vehicles": { target: "http://localhost:3000", changeOrigin: true },
    "/api/drivers": { target: "http://localhost:3000", changeOrigin: true },
    "/api/support": { target: "http://localhost:3000", changeOrigin: true },
    "/api/auth": { target: "http://localhost:3000", changeOrigin: true },
    "/api/rides": { target: "http://localhost:3000", changeOrigin: true },
    "/api/billing": { target: "http://localhost:3000", changeOrigin: true },
    "/api/admin": { target: "http://localhost:3000", changeOrigin: true },
    "/api/ratings": { target: "http://localhost:3000", changeOrigin: true },
    "/api/places": { target: "http://localhost:3000", changeOrigin: true },
    "/api/trips": { target: "http://localhost:3000", changeOrigin: true },
    "/api/classes": { target: "http://localhost:3000", changeOrigin: true },
    "/api/commissions": { target: "http://localhost:3000", changeOrigin: true },
    "/api/membership": { target: "http://localhost:3000", changeOrigin: true },
    "/api/work-areas": { target: "http://localhost:3000", changeOrigin: true },
    "/api/help-center": { target: "http://localhost:3000", changeOrigin: true },
    "/api/upload": { target: "http://localhost:3000", changeOrigin: true },
    // ML pricing config API (Flask, deployed on Railway)
    "/api/pricing-config": {
      target: "https://harmonious-renewal-production-db7e.up.railway.app",
      changeOrigin: true,
      secure: true,
      rewrite: (path: string) => path.replace(/^\/api\/pricing-config/, "/api"),
    },
    // Catch-all for any other /api routes to main backend
    "/api": { target: "http://localhost:3000", changeOrigin: true },
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