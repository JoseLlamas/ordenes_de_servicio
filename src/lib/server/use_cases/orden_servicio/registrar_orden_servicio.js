import { db } from '$lib/server/db';
import {
  registrarOrdenServicio,
  obtenerFolioSiguiente,
  obtenerEmpleadoPorId,
  obtenerEncargadoArea
} from '$lib/server/db/queries';
import { BusinessRuleException, BusinessRules, ForbiddenException } from '$lib/server/exceptions';
import { Temporal } from 'temporal-polyfill/impl';

/**
 *
 * @param {NonNullable<App.Locals['usuario']>} usuario
 * @param {NonNullable<App.Locals['authorize']>} authorize
 */
export function createRegistrarOrdenServicioUseCase (usuario, authorize) {
  /**
   * @param {{
   *  areaParaAsignarId: number,
   *  empleadoSolicitanteId: number,
   *  telefonoSolicitante: string,
   *  categoriaOrdenId: number,
   *  otroCategoriaOrden: string | null,
   *  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA',
   *  descripcion: string,
   *  ordenServicioRelacionadoId: number | null,
   *  numeroOficio: string | null,
   *  tipoEntrada: 'PRESENCIAL' | 'LLAMADA_TELEFONICA' | 'OFICIO' | 'INDICACION_SUPERIOR'
   * }} data
   * @return {Promise<number>}
   * @throws {BusinessRuleException}
   * @throws {ForbiddenException}
   */
  return (data) => {
    return db.transaction(async tx => {
      if (authorize.cannot('create', 'Orden', { areaId: data.areaParaAsignarId })) {
        throw new ForbiddenException('No tiene permiso o alcance para crear una orden de servicio');
      }
      const anioActual = Temporal.Now.zonedDateTimeISO('America/Mexico_City').year;
      const folio = await obtenerFolioSiguiente(anioActual, data.areaParaAsignarId, tx);
      const empleadoSolicitante = await obtenerEmpleadoPorId(data.empleadoSolicitanteId, tx);
      if (empleadoSolicitante == null) {
        throw new BusinessRuleException('Empleado no encontrado', BusinessRules.EMPLEADO_NO_ENCONTRADO);
      }
      const encargadoAreaAsignada = await obtenerEncargadoArea(data.areaParaAsignarId, { activo: true }, tx);
      if (encargadoAreaAsignada == null) {
        throw new BusinessRuleException('El area asignada no tiene encargado', BusinessRules.AREA_SIN_ENCARGADO);
      }
      const creadoEn = new Date(Temporal.Now.instant().epochMilliseconds);
      await registrarOrdenServicio({
        id: folio,
        descripcion: data.descripcion,
        prioridad: data.prioridad,
        tipoEntrada: data.tipoEntrada,
        numeroOficio: data.numeroOficio,
        categoriaOrdenId: data.categoriaOrdenId,
        otroCategoriaOrden: data.otroCategoriaOrden,
        empleadoSolicitanteId: empleadoSolicitante.id,
        areaSolicitanteId: empleadoSolicitante.area.id,
        telefonoSolicitante: data.telefonoSolicitante,
        areaAsignadaId: data.areaParaAsignarId,
        encargadoAreaAsignadaId: encargadoAreaAsignada.id,
        creadoPorId: usuario.id,
        ordenServicioRelacionadoId: data.ordenServicioRelacionadoId,
        creadoEn: creadoEn
      }, tx);
      return folio;
    });
  };
}
