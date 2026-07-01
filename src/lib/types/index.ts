export type * from './area';
export type * from './direccion_general';
export type * from './empleado';
export type * from './permiso';
export type * from './rol';
export type * from './usuario';
export type * from './orden_servicio';
export type * from './historial_orden';

export interface CategoriaOrdenDTO {

  id: number;
  descripcion: string;

}

export interface CategoriaActivoDTO {

  id: number;
  descripcion: string;

}

export interface ActivoDTO {

  id: number;
  numeroInventario: string | null;
  numeroSerie: string | null;
  marca: string | null;
  modelo: string | null;
  observaciones: string | null;

}

export type ActivoDetalleDTO = ActivoDTO & { categoriaActivo: CategoriaActivoDTO };

export interface SesionDTO {

  id: string;
  usuarioId: number;
  expiresAt: Date;
  creadoEn: Date;

}

export interface InvitacionDTO {

  id: number;
  token: string;
  empleadoId: number;
  rolId: number;
  areasAccesoId: number[] | null;
  invitadorId: number;
  usado: boolean;

}
