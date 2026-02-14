import { json } from '@sveltejs/kit';
import { obtenerAgentes } from '$lib/server/db/queries';

/**
 *
 * @type {import('./$types').RequestHandler}
 */
export async function GET ({ params, locals, url }) {
  try {
    if (!locals.authorize) {
      return json({ message: 'No autorizado' }, { status: 401 });
    }
    const areaId = Number(params.id);
    if (!areaId || areaId < 1) {
      return json({ message: 'areaId requerido' }, { status: 400 });
    }
    const filters = {
      areasId: [areaId]
    };
    let nombre = url.searchParams.get('nombre')?.trim() ?? '';
    if (nombre.length >= 1) {
      filters.nombre = nombre.toUpperCase();
    }
    const usuarios = await obtenerAgentes(filters);
    return json(usuarios);
  } catch (err) {
    if (err instanceof Error) {
      return json({
        error: 'Error al obtener los usuarios con permiso de agente',
        message: err.message
      }, { status: 500 });
    }
    throw err;
  }
};
