export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  Id: string;
  Username: string;
  Nombre: string;
  Email: string;
  RolId: string | null;
  RolNombre: string | null;
  Activo: boolean;
}

export interface AuthResponse {
  Token: string;
  User: User;
  ExpiresIn: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: UserPermissions | null;
}

export interface UserPermissions {
  RolNombre: string | null;
  EsAdmin: boolean;
  Modulos: ModuloPermission[];
}

export interface ModuloPermission {
  Id: number;
  Nombre: string;
  OpcionesMenu: OpcionMenuPermission[];
}

export interface OpcionMenuPermission {
  Id: number;
  Nombre: string;
  Operaciones: string[];
}
