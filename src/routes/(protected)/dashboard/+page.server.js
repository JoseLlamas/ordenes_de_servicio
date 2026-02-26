import { assertAuthenticated } from '$lib/server/auth/guards';
import { redirect } from '@sveltejs/kit';

/**
 * @type {import('./$types').PageServerLoad}
 */
export async function load ({ locals }) {
  assertAuthenticated(locals);
  if (!['Encargado', 'Administrador'].includes(locals.usuario.rol.nombre)) {
    redirect(303, '/');
  }
  return {};
}
