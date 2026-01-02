import { obtenerUsuariosResumenes } from '$lib/server/db/queries';
import { ForbiddenException } from '$lib/server/exceptions';

/**
 * @import { UsuarioResumenDTO } from '$lib/types';
 */

/**
 *
 * @param {NonNullable<App.Locals['authorize']>} authorize
 * @returns
 */
export function createBuscarUsuariosUseCase (authorize) {
  /**
  *
  * @param {{areaId: number, soloActivos?: boolean}} filters
  * @return {Promise<UsuarioResumenDTO[]>}
  * @throws {ForbiddenException}
  */
  return async (filters) => {
    if (authorize.cannot('read', 'Usuario', { areaId: filters.areaId })) {
      throw new ForbiddenException;
    }
    const params = {
      areaId: filters.areaId
    };
    if (typeof filters.soloActivos !== 'undefined') {
      params.activo = filters.soloActivos;
    }
    return await obtenerUsuariosResumenes(params);
  };
}
