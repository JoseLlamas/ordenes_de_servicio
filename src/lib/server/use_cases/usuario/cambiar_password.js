import { obtenerPasswordUsuario, patchUsuario } from '$lib/server/db/queries';
import { BusinessRuleException, BusinessRules } from '$lib/server/exceptions';
import { compareHashPassword, generateHashPassword } from '$lib/server/utils';

/**
 *
 * @param {import('$lib/server/db/queries/types').UsuarioDetalleDTO} usuario
 */
export function createCambiarPasswordUseCase (usuario) {

  /**
   * @param {string} passwordActual
   * @param {string} passwordNuevo
   */
  return async (passwordActual, passwordNuevo) => {
    const passwordRegistrado = await obtenerPasswordUsuario(usuario.id);
    if (!(await compareHashPassword(passwordActual, passwordRegistrado))) {
      throw new BusinessRuleException(
        'La contraseña ingresada no corresponde a la registrada',
        BusinessRules.USUARIO_CAMBIAR_PASSWORD_PASSWORD_ACTUAL_INCORRECTO
      );
    }
    await patchUsuario({ password: await generateHashPassword(passwordNuevo) }, usuario.id);
  };

}
