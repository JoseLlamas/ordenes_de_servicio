import { assertAuthenticated } from '$lib/server/auth/guards';

/**
 *
 * @type {import('./$types').LayoutServerLoad}
 */
export async function load ({ locals }) {
  assertAuthenticated(locals);
  return {
    usuario: locals.usuario
  };
}
