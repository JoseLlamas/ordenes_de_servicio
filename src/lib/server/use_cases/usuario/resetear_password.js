import { db } from '$lib/server/db';
import { obtenerUsuarioParaCambioPassword, patchUsuario } from '$lib/server/db/queries';
import { BusinessRuleException } from '$lib/server/exceptions';
import { generarPasswordAleatoria, generateHashPassword } from '$lib/server/utils';

/**
 *
 * @param {NonNullable<App.Locals['usuario']>} usuario
 * @param {NonNullable<App.Locals['authorize']>} authorize
 */
export function createResetearPasswordUseCase (usuario, authorize) {
  /**
   * @param {number} usuarioId
   */
  return (usuarioId) => {
    return db.transaction(async (tx) => {
      const us = await obtenerUsuarioParaCambioPassword(usuarioId, tx);
      if (us == null) {
        throw new BusinessRuleException(
          'Usuario no encontrado'
        );
      }
      if (!us.activo) {
        throw new BusinessRuleException(
          'No se puede resetear la contraseña a un usuario dado de baja'
        );
      }
      if (us.id === usuario.id) {
        throw new BusinessRuleException(
          'No puede ejecutar esta acción sobre su propio usuario'
        );
      }
      const nuevoPassword = generarPasswordAleatoria();
      await patchUsuario({ password: await generateHashPassword(nuevoPassword) }, us.id, tx);
      return nuevoPassword;
    });
  };
}
