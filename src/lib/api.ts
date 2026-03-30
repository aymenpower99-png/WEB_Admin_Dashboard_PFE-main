const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000/api';

export interface LoginPayload { email: string; password: string; }

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string; email: string;
    firstName: string; lastName: string;
    role: string; status: string;
  };
}

export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(data.message ?? `Login failed (${res.status})`);
  }
  return res.json() as Promise<LoginResponse>;
}