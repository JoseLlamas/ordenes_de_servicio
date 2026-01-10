import { obtenerOrdenServicioResumenPorId, asignarAgentes } from '$lib/server/db/queries';
import { db } from '$lib/server/db';
import { BusinessRuleException, ForbiddenException } from '$lib/server/exceptions';
import { Temporal } from 'temporal-polyfill';
import { registrarHistorialOrden } from '$lib/server/db/queries';

/**
 *
 * @param {NonNullable<App.Locals['usuario']>} usuario
 * @param {NonNullable<App.Locals['authorize']>} authorize
 */
export function createAsignarAgentesUseCase (usuario, authorize) {
  /**
   * @param {number} ordenServicioId
   * @param {number[]} agentesId
   */
  return async (ordenServicioId, agentesId) => {
    return db.transaction(async (tx) => {
      const ordenServicio = await obtenerOrdenServicioResumenPorId(ordenServicioId, tx);
      if (ordenServicio == null) {
        throw new BusinessRuleException('Orden no encontrada');
      }
      if (authorize.cannot('assign', 'Orden', { areaId: ordenServicio.areaAsignada.id })) {
        throw new ForbiddenException('No puede asignar agentes');
      }
      if (!['NUEVO', 'PROCESO', 'PENDIENTE'].includes(ordenServicio.estado)) {
        throw new BusinessRuleException('Ya no se puede asignar (sólo en nuevo, proceso y pendiente)');
      }
      await asignarAgentes(ordenServicio.id, agentesId, tx);
      await registrarHistorialOrden({
        ordenServicioId: ordenServicio.id,
        tipo: 'ASIGNACION',
        descripcion: 'SE ASIGNAN USUARIOS',
        creadoEn: new Date(Temporal.Now.instant().epochMilliseconds),
        datosAdicionales: {
          estado: ordenServicio.estado,
          asignadoPor: {
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
          },
          agentesAsignados: []
        }
      }, tx);
    });
  };
}
