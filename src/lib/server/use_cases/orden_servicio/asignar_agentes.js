import { obtenerOrdenServicioResumenPorId, asignarAgentes } from '$lib/server/db/queries';
import { db } from '$lib/server/db';
import { BusinessRuleException } from '$lib/server/exceptions';
import { Temporal } from 'temporal-polyfill';

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
      if (!['NUEVO', 'PROCESO', 'PENDIENTE'].includes(ordenServicio.estado)) {
        throw new BusinessRuleException('Ya no se puede asignar (sólo en nuevo, proceso y pendiente)');
      }
      await asignarAgentes({
        usuariosId: agentesId,
        fechaAsignacion: new Date(Temporal.Now.instant().epochMilliseconds)
      }, ordenServicio.id, tx);
    });
  };
}
