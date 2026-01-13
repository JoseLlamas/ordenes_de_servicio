import { obtenerOrdenServicioResumenPorId, desasignarAgente, obtenerCantidadAgentes } from '$lib/server/db/queries';
import { db } from '$lib/server/db';
import { BusinessRuleException, ForbiddenException } from '$lib/server/exceptions';
import { Temporal } from 'temporal-polyfill';
import { registrarHistorialOrden, obtenerAgentesParaHistorial } from '$lib/server/db/queries';
import { BusinessRules } from '$lib/server/exceptions';

/**
 *
 * @param {NonNullable<App.Locals['usuario']>} usuario
 * @param {NonNullable<App.Locals['authorize']>} authorize
 */
export function createDesasignarAgenteUseCase (usuario, authorize) {
  /**
   * @param {number} ordenServicioId
   * @param {number} agenteId
   */
  return async (ordenServicioId, agenteId) => {
    return db.transaction(async (tx) => {
      const ordenServicio = await obtenerOrdenServicioResumenPorId(ordenServicioId, tx);
      if (ordenServicio == null) {
        throw new BusinessRuleException('Orden no encontrada', BusinessRules.ORDEN_DE_SERVICIO_NO_ENCONTRADA);
      }
      if (authorize.cannot('assign', 'Orden', { areaId: ordenServicio.areaAsignada.id })) {
        throw new ForbiddenException('No puede asignar agentes');
      }
      if (!['NUEVO', 'PROCESO', 'PENDIENTE'].includes(ordenServicio.estado)) {
        throw new BusinessRuleException('Ya no se puede desasignar (sólo en nuevo, proceso y pendiente)', BusinessRules.DESASIGNACION_FUERA_DE_ESTADO);
      }
      const cantidadAgentes = await obtenerCantidadAgentes(ordenServicio.id, tx);
      if (cantidadAgentes === 1 && ['PROCESO', 'PENDIENTE'].includes(ordenServicio.estado)) {
        throw new BusinessRuleException('Mientas este en proceso o pendiente, no puede quitar a todos los agentes', BusinessRules.SIN_AGENTES_EN_ORDEN_SERVICIO);
      }
      await desasignarAgente(ordenServicio.id, agenteId, tx);
      const [agente] = await obtenerAgentesParaHistorial([agenteId], tx);
      await registrarHistorialOrden({
        ordenServicioId: ordenServicio.id,
        tipo: 'DESASIGNACION',
        descripcion: 'DESASIGNACIÓN DE AGENTES A ORDEN DE SERVICIO',
        creadoEn: new Date(Temporal.Now.instant().epochMilliseconds),
        datosAdicionales: {
          estado: ordenServicio.estado,
          desasignadoPor: {
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
          agenteDesasignado: agente
        }
      }, tx);
    });
  };
}
