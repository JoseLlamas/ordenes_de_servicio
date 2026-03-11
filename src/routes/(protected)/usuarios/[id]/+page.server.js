import { error, fail, redirect } from '@sveltejs/kit';
import { createObtenerUsuarioUseCase } from '$lib/server/use_cases/usuario';
import { BusinessRuleException, BusinessRules, NotFoundException, ForbiddenException } from '$lib/server/exceptions';
import { assertAuthenticated } from '$lib/server/auth/guards';
import { patchUsuario } from '$lib/server/db/queries';
import { generarPasswordAleatoria, generateHashPassword } from '$lib/server/utils';

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
    redirect(303, '/no-encontrado');
  }
  const obtenerUsuario = createObtenerUsuarioUseCase(locals.usuario, locals.authorize);
  try {
    const usuarioDetalle = await obtenerUsuario(Number(id));
    return {
      usuarioDetalle
    };
  } catch (exc) {
    if (exc instanceof NotFoundException) {
      redirect(303, '/no-encontrado');
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

/**
 * @type {import('./$types').Actions}
 */
export const actions = {

  async darDeBaja ({ request, locals }) {
    assertAuthenticated(locals);
    const data = await request.formData();
    const usuarioId = Number.parseInt(data.get('usuarioId')?.toString() ?? '');
    if (usuarioId && usuarioId > 0) {
      await patchUsuario({ activo: false }, usuarioId);
      return {
        messageDarDeBaja: 'Usuario dado de baja'
      };
    } else {
      return fail(422, {
        errorDarDeBaja: 'Error al enviar el usuarioId'
      });
    }
  },

  async resetPassword ({ request, locals }) {
    assertAuthenticated(locals);
    const data = await request.formData();
    const usuarioId = Number.parseInt(data.get('usuarioId')?.toString() ?? '');
    if (usuarioId && usuarioId > 0) {
      const nuevoPassword = generarPasswordAleatoria();
      await patchUsuario({ password: await generateHashPassword(nuevoPassword) }, usuarioId);
      return {
        nuevoPassword
      };
    } else {
      return fail(422, {
        errorResetPassword: 'Error al enviar el usuarioId'
      });
    }
  }

};
