import { json } from '@sveltejs/kit';
import { obtenerEmpleadosPorArea } from '$lib/server/db/queries';

/**
 *
 * @type {import('./$types').RequestHandler}
 */
export async function GET ({ url, params, locals }) {
  try {
    if (!locals.authorize) {
      return json({ message: 'No autorizado' }, { status: 401 });
    }
    const areaId = Number(params.id);
    const activo = url.searchParams.get('activo');
    const filters = {};
    if (!areaId || areaId < 1) {
      return json({ message: 'areaId requerido' }, { status: 400 });
    }
    if (activo != null) {
      filters.activo = true;
    }
    const areas = await obtenerEmpleadosPorArea(areaId, filters);
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
