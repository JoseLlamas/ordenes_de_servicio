import { db } from '..';
import { observaciones } from '../schema';

/**
 * @import { DbOrTx } from './types';
 */

/**
 * @param {{
 *  ordenServicioId: number,
 *  tipo: 'SEGUIMIENTO' | 'PENDIENTE' | 'SOLUCION' | 'CIERRE' | 'CANCELACION',
 *  observacion: string,
 *  creadoEn: Date,
 *  creadorId: number
 * }} data
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<number>}
 */
export async function registrarObservacion (data, dbOrTx = db) {
  const [{ id }] = await dbOrTx
    .insert(observaciones)
    .values(data)
    .$returningId();
  return id;
}
