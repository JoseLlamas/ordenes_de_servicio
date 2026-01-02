import { asc } from 'drizzle-orm';
import { db } from '..';
import { direccionesGenerales } from '../schema';

/**
 * @import { DbOrTx } from './types';
 * @import { DireccionGeneralDTO } from '$lib/types';
 */

/**
*  @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<DireccionGeneralDTO[]>}
 */
export async function obtenerDireccionesGenerales (dbOrTx = db) {
  return await dbOrTx.select({
    id: direccionesGenerales.id,
    nombre: direccionesGenerales.nombre
  }).from(direccionesGenerales)
    .orderBy(asc(direccionesGenerales.nombre));
}
