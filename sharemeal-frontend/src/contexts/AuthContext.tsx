import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import * as authService from '../services/authService';
import type { AuthUser, LoginRequest, RegisterRequest } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (payload: LoginRequest) => Promise<AuthUser>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const TOKEN_KEY = 'shareMealToken';
const USER_KEY = 'shareMealUser';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser) as AuthUser);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }

    setIsInitializing(false);
  }, []);

  const persistSession = (newToken: string, newUser: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const login = async (payload: LoginRequest): Promise<AuthUser> => {

    const authResponse = await authService.login(payload);

    localStorage.setItem(TOKEN_KEY, authResponse.token);
    setToken(authResponse.token);
    const profile = await authService.getProfile();

    const authUser: AuthUser = {
      id: profile.id,
      fullName: profile.fullName,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
      role: profile.role,
    };

    persistSession(authResponse.token, authUser);
    return authUser;
  };

  const register = async (payload: RegisterRequest): Promise<void> => {
    await authService.register(payload);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isInitializing,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
