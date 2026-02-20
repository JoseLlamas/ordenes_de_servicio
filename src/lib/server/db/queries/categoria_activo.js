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
export function obtenerCategoriasActivoPorArea (areaId, dbOrTx = db) {
  return dbOrTx
    .select({
      id: categoriasActivo.id,
      descripcion: categoriasActivo.descripcion
    })
    .from(categoriasActivo)
    .where(eq(categoriasActivo.areaId, areaId))
    .orderBy(asc(categoriasActivo.descripcion));
}
