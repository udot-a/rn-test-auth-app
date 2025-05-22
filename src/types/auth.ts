export type GenderType = 'male' | 'female';

export interface LoginApiResponse {
  id: number;
  email: string;
  name: string;
  image?: string;
  username?: string;
  firstName: string;
  lastName: string;
  gender: GenderType;
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  image?: string;
  username?: string;
  firstName: string;
  lastName: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
  expiresInMins?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  expiresInMins: number;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  removeError: () => void;
}
