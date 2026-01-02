
import { json } from '@sveltejs/kit';
import { obtenerEmpleadosSinUsuario } from '$lib/server/db/queries';
import { error } from 'console';

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
    filters.areaId = areaId;
    if (activo != null) {
      filters.activo = true;
    }
    const areas = await obtenerEmpleadosSinUsuario(filters);
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
