import { API_BASE_URL, handleResponse } from './api';
import { LoginCredentials, AuthResponse, User, UserPermissions } from '../types/auth.types';

const TOKEN_KEY = 'sasfo_token';
const USER_KEY = 'sasfo_user';
const PERMISSIONS_KEY = 'sasfo_permissions';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/AuthApi/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await handleResponse<AuthResponse>(response);

    // Guardar token y usuario en localStorage
    this.setToken(data.Token);
    this.setUser(data.User);

    return data;
  },

  async logout(): Promise<void> {
    try {
      const token = this.getToken();
      if (token) {
        await fetch(`${API_BASE_URL}/api/AuthApi/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      this.clearAuth();
    }
  },

  async validateToken(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/AuthApi/validate`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        this.clearAuth();
        return null;
      }

      const user = await response.json();
      this.setUser(user);
      return user;
    } catch (error) {
      this.clearAuth();
      return null;
    }
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  clearAuth(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(PERMISSIONS_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  async getPermissions(): Promise<UserPermissions | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/AuthApi/permissions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return null;
      }

      const permissions = await response.json();
      this.setPermissions(permissions);
      return permissions;
    } catch (error) {
      console.error('Error getting permissions:', error);
      return null;
    }
  },

  setPermissions(permissions: UserPermissions): void {
    localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions));
  },

  getStoredPermissions(): UserPermissions | null {
    const permissionsStr = localStorage.getItem(PERMISSIONS_KEY);
    if (!permissionsStr) return null;
    try {
      return JSON.parse(permissionsStr);
    } catch {
      return null;
    }
  },
};
