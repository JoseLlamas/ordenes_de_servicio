import { error, redirect } from '@sveltejs/kit';
import { createObtenerUsuarioUseCase } from '$lib/server/use_cases/usuario';
import { BusinessRuleException, BusinessRules, NotFoundException, ForbiddenException } from '$lib/server/exceptions';
import { assertAuthenticated } from '$lib/server/auth/guards';

/**
 * @type {import('./$types').PageServerLoad}
 */
export async function load ({ params, locals }) {
  assertAuthenticated(locals);
  if (!locals.authorize.has('read', 'Usuario')) {
    redirect(303, '/sin-acceso');
  }
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    error(404, 'Recurso no encontrado');
  }
  const obtenerUsuario = createObtenerUsuarioUseCase(locals.usuario, locals.authorize);
  try {
    const usuarioDetalle = await obtenerUsuario(Number(id));
    return {
      usuarioDetalle
    };
  } catch (exc) {
    if (exc instanceof NotFoundException) {
      error(404, exc.message);
    }
    if (exc instanceof BusinessRuleException && exc.rule === BusinessRules.USUARIO_NO_CONSULTAR_DETALLE_USUARIO_LOGUEADO) {
      redirect(303, '/perfil');
    }
    if (exc instanceof ForbiddenException) {
      error(exc.statusCode, exc.message);
    }
    throw exc;
  }
}
