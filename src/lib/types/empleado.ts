import type { DireccionGeneralDTO } from './direccion_general';
import type { AreaDTO } from './area';

export interface EmpleadoDTO {

  id: number;
  nombre: string;
  primerApellido: string;
  segundoApellido: string | null;
  cargo: string | null;
  activo: boolean;

}

export type EmpleadoDetalleDTO =
  EmpleadoDTO & {
    direccionGeneral: DireccionGeneralDTO,
    area: AreaDTO
  };