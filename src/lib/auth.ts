export type UserRole = "super_admin" | "admin" | "support";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface InviteUserPayload {
  name: string;
  email: string;
  role: string;
  status: "active" | "pending" | "blocked";
  trips?: number;
  password: string;
}

export interface UpdateUserPayload {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  status?: "active" | "pending" | "blocked";
}

// ─── Token helpers ────────────────────────────────────────────────────────────
// Key must match what login.tsx stores: localStorage.setItem("accessToken", ...)

const TOKEN_KEY = "accessToken";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

// ─── Session helpers ──────────────────────────────────────────────────────────

const USER_KEY = "user"; // matches login.tsx: localStorage.setItem("user", ...)

export function saveSession(user: AdminUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  clearToken();
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): AdminUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}