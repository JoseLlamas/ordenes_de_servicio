import { registrarEmpleado } from '$lib/server/db/queries';
import { ForbiddenException } from '$lib/server/exceptions';

/**
 * @param {NonNullable<App.Locals['usuario']>} usuario
 * @param {NonNullable<App.Locals['authorize']>} authorize
 * @returns
 */
export function createRegistrarEmpleadoUseCase (usuario, authorize) {
  /**
  *
  * @param {Omit<Parameters<typeof registrarEmpleado>[0], 'activo'>} dataRegistroEmpleado
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
