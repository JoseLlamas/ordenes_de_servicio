import type { AreaDTO } from './area';

interface UsuarioHistorialOrden {

  id: number;
  nombreUsuario: string;
  areasAcceso: AreaDTO[] | null,
  rol: string,
  empleado: {
    id: number;
    nombre: string;
    primerApellido: string;
    segundoApellido: string | null;
    area: {
      id: number;
      nombre: string;
    }
  }

}

export interface AgenteHistorialOrdenDTO {

  id: number;
  nombreUsuario: string;
  rol: string,
  empleado: {
    id: number;
    nombre: string;
    primerApellido: string;
    segundoApellido: string | null;
    area: {
      id: number;
      nombre: string;
    }
  }

}

type CreacionHistorialOrden = {

  ordenServicioId: number;
  tipo: 'CREACION';
  descripcion: string;
  creadoEn: Date;
  datosAdicionales: {
    creadoPor: UsuarioHistorialOrden,
  }

};

type CambioEstadoHistorialOrden = {

  ordenServicioId: number;
  tipo: 'CAMBIO_ESTADO';
  descripcion: string;
  creadoEn: Date;
  datosAdicionales: {
    modificadoPor: UsuarioHistorialOrden,
    estadoPrevio: string,
    estadoNuevo: string
  }

}

type AsignacionHistorialOrden = {

  ordenServicioId: number;
  tipo: 'ASIGNACION';
  descripcion: string;
  creadoEn: Date;
  datosAdicionales: {
    asignadoPor: UsuarioHistorialOrden,
    agentesAsignados: AgenteHistorialOrdenDTO[],
    estado: string
  }

}

type DesasignacionHistorialOrden = {

  ordenServicioId: number;
  tipo: 'DESASIGNACION';
  descripcion: string;
  creadoEn: Date;
  datosAdicionales: {
    desasignadoPor: UsuarioHistorialOrden,
    agenteDesasignado: AgenteHistorialOrdenDTO,
    estado: string
  }

}

export type DataRegistroHistorialOrden =
  CreacionHistorialOrden |
  CambioEstadoHistorialOrden |
  AsignacionHistorialOrden |
  DesasignacionHistorialOrden;

export type HistorialOrdenDetalle =
  ({ id: number } & CreacionHistorialOrden) |
  ({ id: number } & AsignacionHistorialOrden) |
  ({ id: number } & CambioEstadoHistorialOrden) |
  ({ id: number } & DesasignacionHistorialOrden);