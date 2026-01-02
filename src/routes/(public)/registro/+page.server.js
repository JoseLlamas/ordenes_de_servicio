import { validateRegistroUsuario } from '$lib/server/validators';
import { fail } from '@sveltejs/kit';
import { registrarUsuario } from '$lib/server/use_cases/usuario/registrar_usuario';
import { BusinessRuleException } from '$lib/server/exceptions';

/**
 * @type {import('./$types').Actions}
 */
export const actions = {

  async registro ({ request }) {
    const data = Object.fromEntries(await request.formData());
    const resultValidation = await validateRegistroUsuario(data);
    if ('errors' in resultValidation) {
      return fail(422, {
        errors: resultValidation.errors
      });
    }
    try {
      await registrarUsuario(resultValidation.values);
      return {
        info: 'Registrado correctamente, ahora puede iniciar sesión'
      };
    } catch (ex) {
      if (ex instanceof BusinessRuleException) {
        return fail(422, {
          error: ex.message
        });
      }
      throw ex;
    }
  }

};
