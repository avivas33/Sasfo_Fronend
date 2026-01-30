export interface Rol {
  Id: string;
  Name: string;
  UserCount: number;
  Operaciones?: RolOperacion[];
}

export interface RolOperacion {
  Id: number;
  IdOperacion: number;
  NombreOperacion: string;
  IdOpcionMenu?: number;
  NombreOpcionMenu?: string;
  Estado: boolean;
}

export interface CreateRolData {
  Name: string;
}

export interface UpdateRolData {
  Name: string;
}

export interface Modulo {
  ID: number;
  NombreModulo: string;
}

export interface OpcionMenu {
  ID: number;
  NombreMenu: string;
}

export interface RolesStats {
  TotalRoles: number;
  RolesByUsers: Array<{
    Name: string;
    UserCount: number;
  }>;
}
