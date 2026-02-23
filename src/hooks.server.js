import { getAuthCookies, deleteAuthCookies } from '$lib/server/utils';
import { validarSesion } from '$lib/server/use_cases/auth';
import { createValidateAuthorization, defineAbilitiesFor } from '$lib/server/auth';
import { registrarLog } from '$lib/server/db/queries';
import { Temporal } from 'temporal-polyfill/impl';

/**
 * @type {import('@sveltejs/kit').Handle}
 */
async function handleAuth ({ event, resolve }) {
  const sessionId = getAuthCookies(event.cookies);
  if (sessionId != null) {
    try {
      const usuario = await validarSesion(sessionId);
      if (usuario !== null && usuario.activo) {
        const ability = defineAbilitiesFor(usuario);
        event.locals.usuario = usuario;
        event.locals.authorize = createValidateAuthorization(usuario, ability);
      } else {
        deleteAuthCookies(event.cookies);
      }
    } catch (exc) {
      deleteAuthCookies(event.cookies);
      throw exc;
    }
  }
  return resolve(event);
}

export const handle = handleAuth;

/**
 * @type {import('@sveltejs/kit').HandleServerError}
 */
export async function handleError ({ error }) {
  let message = '';
  if (error instanceof Error) {
    try {
      await registrarLog({
        mensaje: error.message,
        stackTrace: error.stack ?? null,
        createdAt: new Date(Temporal.Now.instant().epochMilliseconds)
      });
      console.error(error);
    } catch (exc) {
      console.error(exc);
    }
  }
  return {
    message
  };
}
