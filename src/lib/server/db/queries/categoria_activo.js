import { eq, asc } from 'drizzle-orm';
import { db } from '..';
import { categoriasActivo } from '../schema';

/**
 * @import { DbOrTx } from './types';
 * @import { CategoriaActivoDTO } from '$lib/types';
 */

/**
 *
 * @param {number} areaId
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<CategoriaActivoDTO[]>}
 */
export async function obtenerCategoriasActivoPorArea (areaId, dbOrTx = db) {
  const co = await dbOrTx
    .select({
      id: categoriasActivo.id,
      descripcion: categoriasActivo.descripcion
    })
    .from(categoriasActivo)
    .where(eq(categoriasActivo.areaId, areaId))
    .orderBy(asc(categoriasActivo.descripcion));
  return co;
}
