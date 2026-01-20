import type { AreaDTO, CategoriaOrdenDTO, EmpleadoDTO, ActivoDetalleDTO, RolDTO } from '.';

export interface OrdenServicioDTO {

  id: number;
  descripcion: string;
  estado : 'NUEVO' | 'PROCESO' | 'PENDIENTE' | 'RESUELTO' | 'CERRADO' | 'CANCELADO';
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  tipoEntrada: 'PRESENCIAL' | 'OFICIO' | 'LLAMADA_TELEFONICA' | 'INDICACION_SUPERIOR';
  numeroOficio: string | null;
  creadoEn: Date;
  cerradoEn: Date | null;
  canceladoEn: Date | null;
  ordenServicioRelacionadoId: number | null;

}

export interface OrdenServicioResumenDTO {

  id: number;
  descripcion: string;
  estado : 'NUEVO' | 'PROCESO' | 'PENDIENTE' | 'RESUELTO' | 'CERRADO' | 'CANCELADO';
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  tipoEntrada: 'PRESENCIAL' | 'OFICIO' | 'LLAMADA_TELEFONICA' | 'INDICACION_SUPERIOR';
  numeroOficio: string | null;
  categoriaOrden: CategoriaOrdenDTO,
  otroCategoriaOrden: string | null;
  areaSolicitante: AreaDTO;
  empleadoSolicitante: Omit<EmpleadoDTO, 'activo'>;
  telefonoSolicitante: string;
  areaAsignada: AreaDTO;
  creadoEn: Date;
  cerradoEn: Date | null;
  canceladoEn: Date | null;

}

export interface OrdenServicioDetalleDTO {

  id: number;
  descripcion: string;
  estado : 'NUEVO' | 'PROCESO' | 'PENDIENTE' | 'RESUELTO' | 'CERRADO' | 'CANCELADO';
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  tipoEntrada: 'PRESENCIAL' | 'OFICIO' | 'LLAMADA_TELEFONICA' | 'INDICACION_SUPERIOR';
  numeroOficio: string | null;
  categoriaOrden: CategoriaOrdenDTO,
  otroCategoriaOrden: string | null;
  areaSolicitante: AreaDTO;
  areaAsignada: AreaDTO;
  empleadoSolicitante: Omit<EmpleadoDTO, 'activo'>;
  telefonoSolicitante: string;
  encargadoAreaAsignada: Omit<EmpleadoDTO, 'activo'>;
  ordenServicioRelacionadoId: number | null;
  creadoEn: Date;
  cerradoEn: Date | null;
  canceladoEn: Date | null;
  creadoPor: {
    id: number;
    nombreUsuario: string;
    avatar: string | null;
    rol: Omit<RolDTO, 'descripcion'>;
    empleado: Omit<EmpleadoDTO, 'activo'>;
  };
  cerradoPor: {
    id: number;
    nombreUsuario: string;
    avatar: string | null;
    rol: Omit<RolDTO, 'descripcion'>;
    empleado: Omit<EmpleadoDTO, 'activo'>;
  } | null;
  canceladoPor: {
    id: number;
    nombreUsuario: string;
    avatar: string | null;
    rol: Omit<RolDTO, 'descripcion'>;
    empleado: Omit<EmpleadoDTO, 'activo'>
  } | null;
  activos: ActivoDetalleDTO[];
  agentes: {
    id: number;
    nombreUsuario: string;
    avatar: string | null,
    empleado: Omit<EmpleadoDTO, 'activo'>
  }[]
}