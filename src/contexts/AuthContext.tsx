import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AuthUser } from '../types/user';
import { saveSession, clearSession, getStoredUser, getToken } from '../lib/auth';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,  setUser]  = useState<AuthUser | null>(getStoredUser);
  const [token, setToken] = useState<string | null>(getToken);

  function login(accessToken: string, authUser: AuthUser) {
    saveSession(accessToken, authUser);
    setToken(accessToken);
    setUser(authUser);
  }

  function logout() {
    clearSession();
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside <AuthProvider>');
  return ctx;
}