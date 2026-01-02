import { redirect } from '@sveltejs/kit';
import { deleteAuthCookies, getAuthCookies } from '$lib/server/utils';
import { eliminarSesion } from '$lib/server/db/queries';

/**
 * @type {import('./$types').Actions}
 */
export const actions = {
  default: async ({ cookies }) => {
    const sesionId = getAuthCookies(cookies);
    deleteAuthCookies(cookies);
    if (sesionId != null) {
      await eliminarSesion(sesionId);
    }
    redirect(303, '/login');
  }
};

