import { activos } from './../schema';
import { db } from '..';
import { and, eq } from 'drizzle-orm';

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
 * }} data
 * @param {DbOrTx} [dbOrTx = db]
 */
export async function registrarActivo (data, dbOrTx = db) {
  const [{ id }] = await dbOrTx
    .insert(activos)
    .values(data)
    .$returningId();
  return id;
}

/**
 *
 * @param {{ ordenServicioId: number, activoId: number }} data
 * @param {DbOrTx} [dbOrTx = db]
 */
export async function eliminarActivo (data, dbOrTx = db) {
  await dbOrTx
    .delete(activos)
    .where(
      and(
        eq(activos.id, data.activoId),
        eq(activos.ordenServicioId, data.ordenServicioId)
      )
    );
}
