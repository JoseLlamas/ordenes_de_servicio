import { fail, redirect } from '@sveltejs/kit';
import { obtenerAreasParaAsignar, obtenerRolesDetalle } from '$lib/server/db/queries';
import { validateRegistroInvitacion } from '$lib/server/validators';
import { BusinessRuleException, ForbiddenException } from '$lib/server/exceptions';
import { createRegistrarInvitacionUseCase } from '$lib/server/use_cases/usuario';
import { assertAuthenticated } from '$lib/server/auth/guards';

/**
 * @type {import('./$types').PageServerLoad}
 */
export async function load ({ locals }) {
  assertAuthenticated(locals);
  if (!locals.authorize.has('create', 'Invitacion')) {
    redirect(303, '/sin-acceso');
  }
  const [areasParaAsignar, roles] = await Promise.all([obtenerAreasParaAsignar(), obtenerRolesDetalle()]);
  const areas = areasParaAsignar.filter((areaParaAsignar => locals.authorize.can('create', 'Invitacion', { areaId: areaParaAsignar.id })));
  return {
    areasParaAsignar: areas,
    roles
  };
};

/**
 * @type {import('./$types').Actions}
 */
export const actions = {

  default: async ({ request, locals }) => {
    assertAuthenticated(locals);
    const formData = await request.formData();
    const data = JSON.parse(/** @type {string} */ (formData.get('data')));
    const validationResult = await validateRegistroInvitacion(data);
    if ('errors' in validationResult) {
      return fail(422, {
        errors: validationResult.errors
      });
    }
    const registrarInvitacion = createRegistrarInvitacionUseCase(locals.usuario, locals.authorize);
    try {
      const token = await registrarInvitacion(validationResult.values);
      return { token };
    } catch (exc) {
      if (exc instanceof BusinessRuleException) {
        return fail(422, {
          error: exc.message
        });
      }
      if (exc instanceof ForbiddenException) {
        return fail(403, {
          error: exc.message
        });
      }
      throw exc;
    }
  }

};
