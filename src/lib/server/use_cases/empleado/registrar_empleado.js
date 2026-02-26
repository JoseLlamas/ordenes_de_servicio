import { registrarEmpleado } from '$lib/server/db/queries';
import { ForbiddenException } from '$lib/server/exceptions';

/**
 * @param {NonNullable<App.Locals['usuario']>} usuario
 * @param {NonNullable<App.Locals['authorize']>} authorize
 */
export function createRegistrarEmpleadoUseCase (usuario, authorize) {
  /**
  *
  * @param {{
  *  nombre: string,
  *  primerApellido: string,
  *  segundoApellido: string | null,
  *  cargo: string | null,
  *  direccionGeneralId: number,
  *  areaId: number
  * }} dataRegistroEmpleado
  * @return {Promise<number>}
  */
  return async (dataRegistroEmpleado) => {
    if (authorize.cannot('create', 'Empleado')) {
      throw new ForbiddenException('No tiene permiso para crear un empleado');
    }
    return registrarEmpleado({
      ...dataRegistroEmpleado,
      activo: true
    });
  };
}
