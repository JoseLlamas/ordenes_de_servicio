import { error, json } from '@sveltejs/kit';
import { obtenerCategoriasActivoPorArea } from '$lib/server/db/queries';

/**
 *
 * @type {import('./$types').RequestHandler}
 */
export async function GET ({ url }) {
  const areaId = url.searchParams.get('areaId');
  if (areaId == null || Number.isNaN(areaId)) {
    error(404, 'Recurso no encontrado');
  }
  const categoriasActivo = await obtenerCategoriasActivoPorArea(Number(areaId));
  return json(categoriasActivo);
};
