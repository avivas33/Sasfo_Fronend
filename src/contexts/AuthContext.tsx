import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { User, LoginCredentials, AuthState, UserPermissions } from '../types/auth.types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (opcionMenu: string) => boolean;
  hasOperation: (opcionMenu: string, operacion: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    permissions: null,
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();
      const user = authService.getUser();

      if (token && user) {
        // Validar el token con el servidor
        const validUser = await authService.validateToken();
        if (validUser) {
          // Obtener permisos
          const permissions = await authService.getPermissions();
          setState({
            user: validUser,
            token,
            isAuthenticated: true,
            isLoading: false,
            permissions,
          });
        } else {
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            permissions: null,
          });
        }
      } else {
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          permissions: null,
        });
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    // Obtener permisos después del login
    const permissions = await authService.getPermissions();
    setState({
      user: response.User,
      token: response.Token,
      isAuthenticated: true,
      isLoading: false,
      permissions,
    });
  };

  const logout = async () => {
    await authService.logout();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      permissions: null,
    });
  };

  // Verificar si el usuario tiene acceso a una opción de menú
  const hasPermission = (opcionMenu: string): boolean => {
    if (!state.permissions) return false;
    if (state.permissions.EsAdmin) return true;

    return state.permissions.Modulos.some(modulo =>
      modulo.OpcionesMenu.some(om =>
        om.Nombre.toLowerCase() === opcionMenu.toLowerCase()
      )
    );
  };

  // Verificar si el usuario tiene una operación específica en una opción de menú
  const hasOperation = (opcionMenu: string, operacion: string): boolean => {
    if (!state.permissions) return false;
    if (state.permissions.EsAdmin) return true;

    for (const modulo of state.permissions.Modulos) {
      for (const om of modulo.OpcionesMenu) {
        if (om.Nombre.toLowerCase() === opcionMenu.toLowerCase()) {
          return om.Operaciones.some(op =>
            op.toLowerCase() === operacion.toLowerCase()
          );
        }
      }
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, hasPermission, hasOperation }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
