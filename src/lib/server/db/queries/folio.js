import { db } from '..';
import { folios } from '$lib/server/db/schema';
import { and, desc, eq } from 'drizzle-orm';

/**
 * @import { DbOrTx } from './types';
 */

/**
 *
 * @param {number} anio
 * @param {number} areaId
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<number>}
 */
export async function obtenerFolioSiguiente (anio, areaId, dbOrTx = db) {
  const row = (await dbOrTx.query.folios.findFirst({
    where: and(eq(folios.anio, anio), eq(folios.areaId, areaId))
  })) ?? null;
  if (row == null) {
    const { identificadorArea } = await dbOrTx.query.folios.findFirst({
      columns: {
        identificadorArea: true
      },
      where: eq(folios.areaId, areaId),
      orderBy: desc(folios.anio)
    }) ?? {};
    let identificador;
    if (typeof identificadorArea === 'undefined') {
      const a = await dbOrTx.$count(dbOrTx.selectDistinct({ areaId: folios.areaId }).from(folios).as('a'));
      identificador = a + 1;
    } else {
      identificador = identificadorArea;
    }
    let consecutivo = 1;
    await dbOrTx
      .insert(folios)
      .values({
        anio,
        consecutivo,
        areaId,
        identificadorArea: identificador
      });
    return Number(`${identificador}${String(anio).slice(2)}${String(consecutivo).padStart(4, '0')}`);
  } else {
    const consecutivo = row.consecutivo + 1;
    await dbOrTx
      .update(folios)
      .set({
        consecutivo
      })
      .where(eq(folios.id, row.id));
    return Number(`${row.identificadorArea}${String(row.anio).slice(2)}${String(consecutivo).padStart(4, '0')}`);
  }
}
