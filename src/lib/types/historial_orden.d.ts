import type { AreaDTO } from './area';

interface UsuarioHistorialOrden {

  id: number;
  nombreUsuario: string;
  empleado: {
    nombre: string;
    primerApellido: string;
    segundoApellido: string | null;
  }

}

type AgenteHistorialOrden = UsuarioHistorialOrden;

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
    agentesAsignados: AgenteHistorialOrden[],
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
    agenteDesasignado: AgenteHistorialOrden,
    estado: string
  }

}

export type DataRegistroHistorialOrden =
  CreacionHistorialOrden |
  CambioEstadoHistorialOrden |
  AsignacionHistorialOrden |
  DesasignacionHistorialOrden;
