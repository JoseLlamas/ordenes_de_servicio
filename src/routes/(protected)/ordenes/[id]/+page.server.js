import { assertAuthenticated } from '$lib/server/auth/guards';
import { BusinessRuleException, ForbiddenException } from '$lib/server/exceptions';
import {
  createAsignarAgentesUseCase,
  createCambiarEstadoUseCase,
  createDesasignarAgenteUseCase,
  createObtenerDetalleOrdenServicioUseCase
} from '$lib/server/use_cases/orden_servicio';
import { fail, redirect } from '@sveltejs/kit';
import {
  validateAsignacionAgentes,
  validateDesasignacionAgente,
  validateCambioEstado
} from '$lib/server/validators';

/**
 *
 * @type {import('./$types').PageServerLoad}
 */
export async function load ({ params, locals }) {
  assertAuthenticated(locals);
  if (!locals.authorize.has('read', 'Orden')) {
    redirect(303, '/sin-acceso');
  }
  const ordenServicioId = parseInt(params.id);
  if (Number.isNaN(ordenServicioId)) {
    redirect(303, '/no-encontrado');
  }
  try {
    const obtenerOrdenServicioDetalle = createObtenerDetalleOrdenServicioUseCase(locals.usuario, locals.authorize);
    const ordenServicio = await obtenerOrdenServicioDetalle(ordenServicioId);
    return {
      ordenServicio
    };
  } catch (exc) {
    if (exc instanceof BusinessRuleException) {
      redirect(303, '/no-encontrado');
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

  cambiarEstado: async ({ request, locals }) => {
    assertAuthenticated(locals);
    const data = Object.fromEntries(await request.formData());
    const resultValidation = await validateCambioEstado(data);
    if ('errors' in resultValidation) {
      return fail(422, {
        errorsCambiarEstado: resultValidation.errors
      });
    }
    const cambiarEstado = createCambiarEstadoUseCase(locals.usuario, locals.authorize);
    try {
      await cambiarEstado(resultValidation.values);
      return {
        messageCambiarEstado: 'El estado de la orden ha sido actualizado.'
      };
    } catch (exc) {
      if (exc instanceof ForbiddenException) {
        return fail(403, {
          errorCambiarEstado: exc.message
        });
      }
      if (exc instanceof BusinessRuleException) {
        return fail(422, {
          errorCambiarEstado: exc.message
        });
      }
      throw exc;
    }
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
          errorDesasignacionAgente: exc.message
        });
      }
      throw exc;
    }
  },

  async agregarActivo ({ request, locals }) {
    assertAuthenticated(locals);
  }

};
