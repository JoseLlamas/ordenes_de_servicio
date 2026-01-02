import { json } from '@sveltejs/kit';
import { obtenerCategoriasOrdenPorArea } from '$lib/server/db/queries';

/**
 *
 * @type {import('./$types').RequestHandler}
 */
export async function GET ({ url, locals }) {
  try {
    if (typeof locals.authorize === 'undefined') {
      return json({ message: 'No autorizado' }, { status: 401 });
    }
    const areaId = Number(url.searchParams.get('areaId'));
    if (!areaId || areaId <= 0) {
      return json({ message: 'areaId requerido' }, { status: 400 });
    }
    const categoriasOrden = await obtenerCategoriasOrdenPorArea(areaId);
    return json(categoriasOrden);
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
