import { json } from '@sveltejs/kit';
import { obtenerAreas } from '$lib/server/db/queries';

/**
 *
 * @type {import('./$types').RequestHandler}
 */
export async function GET ({ url, locals }) {
  try {
    if (!locals.authorize) {
      return json({ message: 'No autorizado' }, { status: 401 });
    }
    const direccionGeneralId = Number(url.searchParams.get('direccionGeneralId'));
    const activo = url.searchParams.get('activo');
    const params = {};
    if (direccionGeneralId && direccionGeneralId > 0) {
      params.direccionGeneralId = direccionGeneralId;
    }
    if (activo != null) {
      params.activo = true;
    }
    const areas = await obtenerAreas(params);
    return json(areas);
  } catch (err) {
    if (err instanceof Error) {
      return json({
        error: 'Error al obtener las categorias',
        message: err.message
      }, { status: 500 });
    }
    throw err;
  }
};
