import axios from "axios";
import { getToken } from "../lib/auth";

const apiClient = axios.create({
  baseURL: (import.meta as { env: Record<string, string> }).env.VITE_API_URL ?? "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;