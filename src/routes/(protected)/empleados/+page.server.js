import { assertAuthenticated } from '$lib/server/auth/guards';
import { ForbiddenException } from '$lib/server/exceptions';
import { createBuscarEmpleadosUseCase } from '$lib/server/use_cases/empleado';
import { validateBusquedaEmpleados } from '$lib/server/validators';
import { error, fail, redirect } from '@sveltejs/kit';

/**
 * @type {import('./$types').PageServerLoad}
 */
export async function load ({ locals }) {
  assertAuthenticated(locals);
  if (!locals.authorize.has('read', 'Empleado')) {
    redirect(303, '/sin-acceso');
  }
  return {};
}

export const actions = {

  buscar: async ({ request, locals }) => {
    assertAuthenticated(locals);
    const data = Object.fromEntries(await request.formData());
    const resultValidation = await validateBusquedaEmpleados(data);
    if ('errors' in resultValidation) {
      return fail(422, {
        errors: resultValidation.errors
      });
    }
    try {
      const empleados = await createBuscarEmpleadosUseCase(locals.authorize)(resultValidation.values);
      return {
        empleados
      };
    } catch (exc) {
      if (exc instanceof ForbiddenException) {
        error (403, exc.message);
      }
      throw exc;
    }
  }

};
