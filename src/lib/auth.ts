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

const TOKEN_KEY = "admin_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

const USER_KEY = "admin_user";

export function saveSession(user: AdminUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(USER_KEY);
  clearToken();
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
