import { activos } from './../schema';
import { db } from '..';

/**
 * @import { DbOrTx } from './types';
 */

/**
 * @param {{
 *  ordenServicioId: number,
 *  categoriaActivoId: number,
 *  numeroInventario: string | null,
 *  numeroSerie: string | null,
 *  marca: string | null,
 *  modelo: string | null
 * }[]} data
 * @param {DbOrTx} [dbOrTx = db]
 */
export async function registrarActivos (data, dbOrTx = db) {
  const ids = await dbOrTx
    .insert(activos)
    .values(data)
    .$returningId();
  return ids;
}
