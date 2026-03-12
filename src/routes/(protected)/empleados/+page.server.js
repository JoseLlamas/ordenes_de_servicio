import { assertAuthenticated } from '$lib/server/auth/guards';
import { patchEmpleado } from '$lib/server/db/queries';
import { ForbiddenException } from '$lib/server/exceptions';
import { createBuscarEmpleadosUseCase, createDarDeBajaEmpleadoUseCase } from '$lib/server/use_cases/empleado';
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
      const buscarEmpleados = createBuscarEmpleadosUseCase(locals.authorize);
      const empleados = await buscarEmpleados(resultValidation.values);
      return {
        empleados
      };
    } catch (exc) {
      if (exc instanceof ForbiddenException) {
        error (403, exc.message);
      }
      throw exc;
    }
  },

  async darDeBaja ({ locals, request }) {
    assertAuthenticated(locals);
    const data = await request.formData();
    const empleadoId = Number.parseInt(data.get('empleadoId')?.toString() ?? '');
    if (empleadoId && empleadoId > 0) {
      const darDeBaja = createDarDeBajaEmpleadoUseCase(locals.authorize);
      try {
        await darDeBaja(empleadoId);
        return {
          messageDarDeBaja: 'Empleado dado de baja'
        };
      } catch (exc) {
        if (exc instanceof ForbiddenException) {
          return fail(403, {
            errorDarDeBaja: exc.message
          });
        }
        throw exc;
      }
    } else {
      return fail(422, {
        errorDarDeBaja: 'Error al enviar el empleadoId'
      });
    }
  }

};
