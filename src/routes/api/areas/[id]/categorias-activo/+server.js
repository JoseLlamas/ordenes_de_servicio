import { json } from '@sveltejs/kit';
import { obtenerCategoriasActivoPorArea } from '$lib/server/db/queries';

/**
 *
 * @type {import('./$types').RequestHandler}
 */
export async function GET ({ params, locals }) {
  try {
    if (locals.authorize == null) {
      throw json({ mensaje: 'No autorizado' }, { status: 401 });
    }
    const areaId = Number(params.id);
    if (!areaId || areaId < 1) {
      return json({ message: 'areaId requerido' }, { status: 400 });
    }
    const categoriasActivo = await obtenerCategoriasActivoPorArea(Number(areaId));
    return json(categoriasActivo);
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
