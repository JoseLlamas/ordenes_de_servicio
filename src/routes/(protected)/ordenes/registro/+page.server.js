import { assertAuthenticated } from '$lib/server/auth/guards';
import {
  obtenerAreasParaAsignar,
  obtenerDireccionesGenerales
} from '$lib/server/db/queries';
import { BusinessRuleException, ForbiddenException } from '$lib/server/exceptions';
import { createRegistrarOrdenServicioUseCase } from '$lib/server/use_cases/orden_servicio';
import { validateRegistroOrdenServicio } from '$lib/server/validators';
import { fail, redirect } from '@sveltejs/kit';

/**
 *
 * @type {import('./$types').PageServerLoad}
 */
export async function load ({ locals }) {
  assertAuthenticated(locals);
  if (!locals.authorize.has('create', 'Orden')) {
    redirect(303, '/sin-acceso');
  }
  const [
    areasParaAsignar,
    direccionesGenerales
  ] = await Promise.all([
    obtenerAreasParaAsignar(),
    obtenerDireccionesGenerales()
  ]);
  const areas = areasParaAsignar.filter(area => locals.authorize.can('create', 'Orden', { areaId: area.id }));
  return {
    areasParaAsignar: areas,
    direccionesGenerales
  };
}

/**
 * @type {import('./$types').Actions}
 */
export const actions = {

  default: async ({ request, locals }) => {
    assertAuthenticated(locals);
    const formData = await request.formData();
    const data = JSON.parse(/** @type {string} */ (formData.get('data')));
    const resultValidation = await validateRegistroOrdenServicio(data);
    if ('errors' in resultValidation) {
      return fail(422, {
        errors: resultValidation.errors
      });
    }
    try {
      const registrarOrdenServicio
        = createRegistrarOrdenServicioUseCase(locals.usuario, locals.authorize);
      const folio = await registrarOrdenServicio(resultValidation.values);
      return {
        folio
      };
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
