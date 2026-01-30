export interface Usuario {
  Id: string;
  UserName: string;
  Email: string;
  NombreCompleto: string;
  PhoneNumber?: string;
  EmailConfirmed: boolean;
  LockoutEnabled: boolean;
  LockoutEnd?: string | null;
  AccessFailedCount: number;
  OrganizationId: number;
  OrganizationName?: string;
  Roles: string[];
  IsActive: boolean;
}

export interface CreateUsuarioData {
  Email: string;
  NombreCompleto: string;
  Password: string;
  PhoneNumber?: string;
  OrganizationId: number;
  Roles: string[];
}

export interface UpdateUsuarioData {
  Email: string;
  UserName: string;
  NombreCompleto: string;
  PhoneNumber?: string;
  OrganizationId: number;
  Roles: string[];
  LockoutEnabled: boolean;
}

export interface ChangePasswordData {
  NewPassword: string;
}

export interface UsuariosStats {
  TotalUsers: number;
  ActiveUsers: number;
  LockedUsers: number;
  ConfirmedEmails: number;
  UnconfirmedEmails: number;
}

export interface AvailableRole {
  Id: string;
  Name: string;
}
