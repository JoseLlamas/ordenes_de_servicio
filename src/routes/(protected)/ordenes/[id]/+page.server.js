import { assertAuthenticated } from '$lib/server/auth/guards';
import { BusinessRuleException, ForbiddenException } from '$lib/server/exceptions';
import { createObtenerDetalleOrdenServicioUseCase } from '$lib/server/use_cases/orden_servicio';
import { obtenerHistorialOrden } from '$lib/server/db/queries';
import { error, redirect } from '@sveltejs/kit';
import Joi from 'joi';

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

  agregarAgente: async ({ request }) => {
    const form = await request.formData();
    const schema = Joi.object({
      ticketId: Joi.number().empty('').required(),
      usuarioId: Joi.number().empty('').required()
    });
    return {};
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
