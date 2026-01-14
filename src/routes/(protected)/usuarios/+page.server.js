import { obtenerAreasParaAsignar } from '$lib/server/db/queries';
import { createBuscarUsuariosUseCase } from '$lib/server/use_cases/usuario';
import { validateBuscarUsuarios } from '$lib/server/validators';
import { fail, redirect } from '@sveltejs/kit';
import { assertAuthenticated } from '$lib/server/auth/guards';
import { ForbiddenException } from '$lib/server/exceptions';

/**
 * @type {import('./$types').PageServerLoad}
 */
export async function load ({ locals }) {
  assertAuthenticated(locals);
  if (!locals.authorize.has('read', 'Usuario')) {
    redirect(303, '/sin-acceso');
  }
  const areasParaAsignar = (await obtenerAreasParaAsignar()).filter(area => locals.authorize.can('read', 'Usuario', { areaId: area.id }));
  return {
    areasParaAsignar
  };
}

/**
 * @type {import('./$types').Actions}
 */
export const actions = {
  default: async ({ request, locals }) => {
    assertAuthenticated(locals);
    const data = Object.fromEntries(await request.formData());
    const resultValidator = await validateBuscarUsuarios(data);
    if ('errors' in resultValidator) {
      return fail(422, { errors: resultValidator.errors });
    }
    try {
      const buscarUsuariosResumenes = createBuscarUsuariosUseCase(locals.authorize);
      const usuariosResumenes = await buscarUsuariosResumenes(resultValidator.values);
      return {
        usuariosResumenes
      };
    } catch (exc) {
      if (exc instanceof ForbiddenException) {
        return fail(403, {
          error: exc.message
        });
      }
      throw exc;
    }
  }
};
