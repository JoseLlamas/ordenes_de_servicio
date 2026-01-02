import { obtenerEmpleadoPorNombre, obtenerEmpleadoPorNumeroEmpleado } from '$lib/server/db/queries';
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
   * @param {{ numeroEmpleado: number } | { nombre: string, primerApellido: string, segundoApellido?: string }} filterData
   * @return {Promise<EmpleadoDetalleDTO[]>}
   */
  return async (filterData) => {
    if (authorize.cannot('read', 'Empleado')) {
      throw new ForbiddenException('No tiene permisos para ver empleados');
    }
    if ('numeroEmpleado' in filterData) {
      const empl = await obtenerEmpleadoPorNumeroEmpleado(filterData.numeroEmpleado);
      if (empl != null) {
        return [empl];
      }
      return [];
    } else {
      return await obtenerEmpleadoPorNombre(
        filterData.nombre,
        filterData.primerApellido,
        filterData.segundoApellido
      );
    }
  };
}
