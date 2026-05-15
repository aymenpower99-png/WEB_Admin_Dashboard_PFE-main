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
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:4173",
        process.env.FRONTEND_URL ?? "",
      ].filter(Boolean),
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Accept"],
      credentials: true,
    },
    proxy: {
      "/api/intelligence": {
        target: "http://localhost:8002",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/api\/intelligence/, "/intelligence"),
      },
      "/api/demand-forecast": {
        target: "http://localhost:8002",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/api\/demand-forecast/, "/demand-forecast"),
      },
      "/api/anomalies": {
        target: "http://localhost:8002",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/anomalies/, "/anomalies"),
      },
      "/api/model-registry": {
        target: "http://localhost:8002",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/api\/model-registry/, "/model-registry"),
      },

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
      // Catch-all for any other /api routes to main backend
      "/api": { target: "http://localhost:3000", changeOrigin: true },
    },
  },
});
