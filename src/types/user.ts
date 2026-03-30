export type UserRole   = 'admin' | 'passenger' | 'driver';
export type UserStatus = 'active' | 'pending' | 'blocked';

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  is2faEnabled?: boolean;
  totpEnabled?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
}