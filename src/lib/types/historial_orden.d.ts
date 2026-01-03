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

interface DataRegistroCreacionHistorialOrden {

  ordenServicioId: number,
  tipo: 'CREACION',
  descripcion: string,
  datosAdicionales: {
    creadoPor: UsuarioHistorialOrden,
    creadoEn: Date,
  },

};

export type DataRegistroHistorialOrden =
  DataRegistroCreacionHistorialOrden;