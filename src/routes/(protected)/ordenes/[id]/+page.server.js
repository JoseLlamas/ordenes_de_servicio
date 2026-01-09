import { assertAuthenticated } from '$lib/server/auth/guards';
import { BusinessRuleException, ForbiddenException } from '$lib/server/exceptions';
import { createObtenerDetalleOrdenServicioUseCase } from '$lib/server/use_cases/orden_servicio';
import { obtenerHistorialOrden } from '$lib/server/db/queries';
import { error, fail, redirect } from '@sveltejs/kit';
import { validateAsignacionAgentes } from '$lib/server/validators';

/**
 *
 * @type {import('./$types').PageServerLoad}
 */
export async function load ({ params, locals }) {
  assertAuthenticated(locals);
  const ordenServicioId = Number(params.id);
  if (Number.isNaN(ordenServicioId)) {
    error(404, 'Recurso no encontrado');
  }
  try {
    const ordenServicio = await createObtenerDetalleOrdenServicioUseCase(locals.usuario, locals.authorize)(ordenServicioId);
    const historialOrden = await obtenerHistorialOrden(ordenServicio.id);
    return {
      ordenServicio,
      historialOrden
    };
  } catch (exc) {
    if (exc instanceof BusinessRuleException) {
      error(404, 'Orden de servicio no encontrada');
    }
    if (exc instanceof ForbiddenException) {
      redirect(303, '/sin-acceso');
    }
    throw exc;
  }
}

/**
 * @type {import('./$types').Actions}
 */
export const actions = {

  asignarAgentes: async ({ request }) => {
    const form = await request.formData();
    const validationResult = await validateAsignacionAgentes(JSON.parse(/** @type {string} */ (form.get('data') ?? '{}')));
    if ('errors' in validationResult) {
      return fail(422, {
        errorsAsignacionAgentes: validationResult.errors
      });
    }
    return {
      message: 'ok'
    };
  },

  cambiarEstado: async ({ request, locals }) => {
    const usuario = locals.usuario;
    return {};
  },

  borrarAgente: async ({ request, locals }) => {
    const data = await request.formData();
    const usuario = locals.usuario;
    return {};
  }

};
