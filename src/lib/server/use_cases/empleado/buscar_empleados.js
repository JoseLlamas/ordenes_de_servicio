import { obtenerEmpleadoPorNombre } from '$lib/server/db/queries';
import { ForbiddenException } from '$lib/server/exceptions';

/**
 * @import { EmpleadoDetalleDTO } from '$lib/types';
 */

/**
 *
 * @param {NonNullable<App.Locals['authorize']>} authorize
 *
 */
export function createBuscarEmpleadosUseCase (authorize) {
  /**
   * @param {{ nombre: string, primerApellido: string, segundoApellido?: string | null }} filterData
   * @return {Promise<EmpleadoDetalleDTO[]>}
   */
  return async (filterData) => {
    if (authorize.cannot('read', 'Empleado')) {
      throw new ForbiddenException('No tiene permisos para ver empleados');
    }
    return await obtenerEmpleadoPorNombre(
      filterData.nombre,
      filterData.primerApellido,
      filterData.segundoApellido
    );
  };
}
