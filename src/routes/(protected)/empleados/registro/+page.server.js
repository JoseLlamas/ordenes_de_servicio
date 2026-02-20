import { fail, redirect } from '@sveltejs/kit';
import { validateRegistroEmpleado } from '$lib/server/validators';
import { createRegistrarEmpleadoUseCase } from '$lib/server/use_cases/empleado';
import { ForbiddenException } from '$lib/server/exceptions';
import { obtenerDireccionesGenerales } from '$lib/server/db/queries';
import { assertAuthenticated } from '$lib/server/auth/guards';

/**
 *
 * @type {import('./$types').PageServerLoad}
 */
export async function load ({ locals }) {
  assertAuthenticated(locals);
  if (!locals.authorize.has('create', 'Empleado')) {
    redirect(303, '/sin-acceso');
  }
  const direccionesGenerales = await obtenerDireccionesGenerales();
  return {
    direccionesGenerales
  };
}

/**
 * @type {import('./$types').Actions}
 */
export const actions = {
  default: async ({ request, locals }) => {
    assertAuthenticated(locals);
    const formData = Object.fromEntries(await request.formData());
    const resultValidation = await validateRegistroEmpleado(formData);
    if ('errors' in resultValidation) {
      return fail(422, {
        errors: resultValidation.errors
      });
    }
    try {
      const id = await createRegistrarEmpleadoUseCase(locals.usuario, locals.authorize)(resultValidation.values);
      return {
        mensaje: `Empleado registrado ${id}`
      };
    } catch (exc) {
      if (exc instanceof ForbiddenException) {
        return fail(exc.statusCode, {
          error: exc.message
        });
      }
      throw exc;
    }
  }
};
