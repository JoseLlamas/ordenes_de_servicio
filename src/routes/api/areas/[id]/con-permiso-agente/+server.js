import { json } from '@sveltejs/kit';
import { obtenerUsuariosConPermisoAgente } from '$lib/server/db/queries';

/**
 *
 * @type {import('./$types').RequestHandler}
 */
export async function GET ({ params, locals }) {
  try {
    if (!locals.authorize) {
      return json({ message: 'No autorizado' }, { status: 401 });
    }
    const areaId = Number(params.id);
    if (!areaId || areaId < 1) {
      return json({ message: 'areaId requerido' }, { status: 400 });
    }
    const usuarios = await obtenerUsuariosConPermisoAgente(areaId);
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
