import { eq, asc } from 'drizzle-orm';
import { db } from '..';
import { categoriasOrden } from '../schema';

/**
 * @import { DbOrTx } from './types';
 * @import { CategoriaOrdenDTO } from '$lib/types';
 */

/**
 *
 * @param {number} areaId
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<CategoriaOrdenDTO[]>}
 */
export async function obtenerCategoriasOrdenPorArea (areaId, dbOrTx = db) {
  const co = await dbOrTx
    .select({
      id: categoriasOrden.id,
      descripcion: categoriasOrden.descripcion
    })
    .from(categoriasOrden)
    .where(eq(categoriasOrden.areaId, areaId))
    .orderBy(asc(categoriasOrden.id));
  return co;
}
