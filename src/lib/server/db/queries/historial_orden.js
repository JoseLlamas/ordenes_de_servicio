import { db } from '..';
import { historialOrdenes } from '../schema';

/**
 * @import { DbOrTx } from './types';
 * @import { DataRegistroHistorialOrden } from '$lib/types';
 *
 */

/**
 * @param {DataRegistroHistorialOrden} data
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<number>}
 */
export async function registrarHistorialOrden (data, dbOrTx = db) {
  const [{ id }] = await dbOrTx
    .insert(historialOrdenes)
    .values({
      ...data,
      datosAdicionales: JSON.stringify(data.datosAdicionales)
    })
    .$returningId();
  return id;
}
