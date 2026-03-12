import { db } from '$lib/server/db';
import { obtenerUsuarioParaBajaDeEmpleado, patchEmpleado, patchUsuario } from '$lib/server/db/queries';
import { ForbiddenException } from '$lib/server/exceptions';

/**
 *
 * @param {NonNullable<App.Locals['authorize']>} authorize
 */
export function createDarDeBajaEmpleadoUseCase (authorize) {
  /**
   * @param {number} empleadoId
   */
  return (empleadoId) => {
    return db.transaction(async (tx) => {
      if (authorize.cannot('delete', 'Empleado')) {
        throw new ForbiddenException('No puede dar de baja empleados');
      }
      const us = await obtenerUsuarioParaBajaDeEmpleado(empleadoId, tx);
      if (us != null && us.activo) {
        await patchUsuario({ activo: false }, us.id, tx);
      }
      await patchEmpleado({ activo: false }, empleadoId, tx);
    });
  };
}
