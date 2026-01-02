import type { EmpleadoDTO } from "./empleado";
import type { AreaDTO } from './area';
import type { DireccionGeneralDTO } from "./direccion_general";
import type { RolDTO } from "./rol";
import type { PermisoDTO } from "./permiso";

export interface UsuarioDTO {

  id: number;
  nombreUsuario: string;
  password: string;
  activo: boolean;
  avatar: string | null;
  areasAccesoId: number[] | null;

}

export type UsuarioLoginDTO = Omit<UsuarioDTO, 'areasAccesoId' | 'avatar'>;

export interface UsuarioDetalleDTO {

  id: number;
  nombreUsuario: string;
  areasAcceso: AreaDTO[] | null;
  activo: boolean;
  avatar: string | null;
  empleado: Omit<EmpleadoDTO, 'activo'> & { area: AreaDTO, direccionGeneral: DireccionGeneralDTO };
  rol: Omit<RolDTO, 'descripcion'> & { permisos: PermisoDTO[] };

}

export interface UsuarioResumenDTO {

  id: number;
  nombreUsuario: string;
  activo: boolean;
  avatar: string | null;
  empleado: Omit<EmpleadoDTO, 'activo'> & { area: AreaDTO };
  rol: Omit<RolDTO, 'descripcion'>;

}