import { db } from '$lib/server/db';
import {
  registrarOrdenServicio,
  obtenerFolioSiguiente,
  obtenerEmpleadoPorId,
  obtenerEncargadoArea,
  registrarActivos,
  registrarHistorialOrden
} from '$lib/server/db/queries';
import { BusinessRuleException, BusinessRules, ForbiddenException } from '$lib/server/exceptions';
import { Temporal } from 'temporal-polyfill/impl';

/**
 * @typedef {Extract<Awaited<ReturnType<typeof import('$lib/server/validators').validateRegistroOrdenServicio>>, { values: any }>['values']} Data
 */

/**
 *
 * @param {NonNullable<App.Locals['usuario']>} usuario
 * @param {NonNullable<App.Locals['authorize']>} authorize
 */
export function createRegistrarOrdenServicioUseCase (usuario, authorize) {
  /**
   * @param {Data} data
   * @return {Promise<number>}
   * @throws {BusinessRuleException}
   * @throws {ForbiddenException}
   */
  return async (data) => {
    if (authorize.cannot('create', 'Orden', { areaId: data.areaParaAsignarId })) {
      throw new ForbiddenException('No tiene permiso o alcance para crear una orden de servicio');
    }
    return await db.transaction(async tx => {
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
        ordenServicioRelacionadoId: data.orderServicioRelacionadoId,
        creadoEn: creadoEn
      }, tx);
      if (data.activos.length > 0) {
        await registrarActivos(data.activos.map(activo => ({ ordenServicioId: folio, ...activo })), tx);
      }
      await registrarHistorialOrden({
        ordenServicioId: folio,
        tipo: 'CREACION',
        descripcion: `SE CREA UNA NUEVA ORDEN DE SERVICIO CON FOLIO ${folio}`,
        creadoEn: creadoEn,
        datosAdicionales: {
          creadoPor: {
            id: usuario.id,
            nombreUsuario: usuario.nombreUsuario,
            areasAcceso: usuario.areasAcceso,
            rol: usuario.rol.nombre,
            empleado: {
              id: usuario.empleado.id,
              nombre: usuario.empleado.nombre,
              primerApellido: usuario.empleado.primerApellido,
              segundoApellido: usuario.empleado.segundoApellido,
              area: {
                id: usuario.empleado.area.id,
                nombre: usuario.empleado.area.nombre
              }
            }
          }
        }
      }, tx);
      return folio;
    });
  };
}
