import { fail } from '@sveltejs/kit';
import { validateCambioPassword } from '$lib/server/validators';
import { validateCambioAvatar } from '$lib/server/validators';
import { createCambiarPasswordUseCase } from '$lib/server/use_cases/usuario';
import { BusinessRuleException } from '$lib/server/exceptions';
import { createCambiarAvatarUseCase } from '$lib/server/use_cases/usuario';
import { assertAuthenticated } from '$lib/server/auth/guards';

/**
 *
 * @type {import('./$types').PageServerLoad}
 */
export async function load ({ locals }) {
  assertAuthenticated(locals);
  return {};
}

/**
 * @type {import('./$types').Actions}
 */
export const actions = {

  async cambiarPassword ({ request, locals }) {
    assertAuthenticated(locals);
    const formData = Object.fromEntries(await request.formData());
    const resultValidate = await validateCambioPassword(formData);
    if ('errors' in resultValidate) {
      return fail(422, {
        errorsCambioPassword: resultValidate.errors
      });
    }
    try {
      await createCambiarPasswordUseCase(locals.usuario)(resultValidate.values.passwordActual, resultValidate.values.passwordNuevo);
      return {
        infoCambioPasword: 'Contraseña actualizada'
      };
    } catch (exc) {
      if (exc instanceof BusinessRuleException) {
        return fail(422, {
          errorCambioPassword: exc.message
        });
      }
      throw exc;
    }
  },

  async cambiarAvatar ({ request, locals }) {
    assertAuthenticated(locals);
    const formData = await request.formData();
    const file = formData.get('avatar');
    if (file != null && file instanceof File) {
      const resultValidate = await validateCambioAvatar({ name: file.name, type: file.type, size: file.size });
      if ('errors' in resultValidate) {
        return fail(422, { errorsCambioAvatar: resultValidate.errors });
      }
      const cambiarAvatar = createCambiarAvatarUseCase(locals.usuario);
      await cambiarAvatar(file);
      return {
        infoCambioAvatar: 'Avatar cambiado'
      };
    } else {
      return fail(422, { errorCambioAvatar: 'La imagen es requerida y debe ser un archivo' });
    }
  }

};
