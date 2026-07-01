import { PermisoDTO } from "./permiso";

export interface RolDTO {

  id: number;
  nombre: string;
  descripcion: string;

}

export type RolDetalle = RolDTO & { permisos: PermisoDTO[] };