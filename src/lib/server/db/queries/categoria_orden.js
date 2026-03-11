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
export function obtenerCategoriasOrdenPorArea (areaId, dbOrTx = db) {
  return dbOrTx
    .select({
      id: categoriasOrden.id,
      descripcion: categoriasOrden.descripcion
    })
    .from(categoriasOrden)
    .where(eq(categoriasOrden.areaId, areaId))
    .orderBy(asc(categoriasOrden.id));
}

/**
 *
 * @param {number} id
 * @param {DbOrTx} dbOrTx
 * @return {Promise<CategoriaOrdenDTO | null>}
 */
export async function obtenerCategoriaOrdenPorId (id, dbOrTx = db) {
  const [categoriaOrden] = await dbOrTx
    .select({
      id: categoriasOrden.id,
      descripcion: categoriasOrden.descripcion
    })
    .from(categoriasOrden)
    .where(eq(categoriasOrden.id, id));
  return categoriaOrden ?? null;
}
