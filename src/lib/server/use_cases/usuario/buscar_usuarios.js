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
  * @param {{areaId: number, soloActivos: boolean}} filters
  * @return {Promise<UsuarioResumenDTO[]>}
  * @throws {ForbiddenException}
  */
  return (filters) => {
    if (authorize.cannot('read', 'Usuario', { areaId: filters.areaId })) {
      throw new ForbiddenException('No puede buscar usuarios del area que está consultando');
    }
    return obtenerUsuariosResumenes({ areaId: filters.areaId, soloActivos: filters.soloActivos });
  };
}
