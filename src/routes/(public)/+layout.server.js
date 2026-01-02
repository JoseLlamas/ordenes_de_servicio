import { assertUnauthenticated } from '$lib/server/auth/guards';

/**
 *
 * @type {import('./$types').LayoutServerLoad}
 */
export async function load ({ locals }) {
  assertUnauthenticated(locals, '/');
}
