import { obtenerOrdenServicioResumenPorId } from '$lib/server/db/queries';
import { db } from '$lib/server/db';

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
    });
  };
}
