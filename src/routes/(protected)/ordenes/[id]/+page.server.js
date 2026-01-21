import { assertAuthenticated } from '$lib/server/auth/guards';
import { BusinessRuleException, ForbiddenException } from '$lib/server/exceptions';
import {
  createAsignarAgentesUseCase,
  createDesasignarAgenteUseCase,
  createObtenerDetalleOrdenServicioUseCase
} from '$lib/server/use_cases/orden_servicio';
import { error, fail, redirect } from '@sveltejs/kit';
import { validateAsignacionAgentes } from '$lib/server/validators';
import { validateDesasignacionAgente } from '$lib/server/validators';

/**
 *
 * @type {import('./$types').PageServerLoad}
 */
export async function load ({ params, locals }) {
  assertAuthenticated(locals);
  if (!locals.authorize.has('read', 'Orden')) {
    redirect(303, '/sin-acceso');
  }
  const ordenServicioId = Number(params.id);
  if (Number.isNaN(ordenServicioId)) {
    error(404, 'Recurso no encontrado');
  }
  try {
    const obtenerOrdenServicioDetalle = createObtenerDetalleOrdenServicioUseCase(locals.usuario, locals.authorize);
    const ordenServicio = await obtenerOrdenServicioDetalle(ordenServicioId);
    return {
      ordenServicio
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

  asignarAgentes: async ({ request, locals }) => {
    assertAuthenticated(locals);
    const form = await request.formData();
    const validationResult = await validateAsignacionAgentes(JSON.parse(/** @type {string} */ (form.get('data') ?? '{}')));
    if ('errors' in validationResult) {
      return fail(422, {
        errorsAsignacionAgentes: validationResult.errors
      });
    }
    try {
      const agendarAgentes = createAsignarAgentesUseCase(locals.usuario, locals.authorize);
      await agendarAgentes(validationResult.values.ordenServicioId, validationResult.values.agentesId);
      return {
        messageAsignacionAgentes: 'Agentes asignados'
      };
    } catch (exc) {
      if (exc instanceof ForbiddenException) {
        return fail(403, {
          errorAsignacionAgentes: exc.message
        });
      }
      if (exc instanceof BusinessRuleException) {
        return fail(422, {
          errorAsignacionAgentes: exc.message
        });
      }
      throw exc;
    }
  },

  iniciar: async ({ request, locals }) => {
    const usuario = locals.usuario;
    return {};
  },

  desasignarAgente: async ({ request, locals }) => {
    assertAuthenticated(locals);
    const data = Object.fromEntries(await request.formData());
    try {
      const resultValidation = await validateDesasignacionAgente(data);
      if ('errors' in resultValidation) {
        return fail(422, {
          errorsDesasignacionAgente: resultValidation.errors
        });
      }
      const desasignarAgente = createDesasignarAgenteUseCase(locals.usuario, locals.authorize);
      await desasignarAgente(resultValidation.values.ordenServicioId, resultValidation.values.agenteId);
      return {
        messageDesasignacionAgente: 'Agente desasignado'
      };
    } catch (exc) {
      if (exc instanceof BusinessRuleException) {
        return fail(422, {
          errorDesasignacionAgente: exc.message
        });
      }
      if (exc instanceof ForbiddenException) {
        return fail(403, {
          errorAsignacionAgentes: exc.message
        });
      }
      throw exc;
    }
  }

};
