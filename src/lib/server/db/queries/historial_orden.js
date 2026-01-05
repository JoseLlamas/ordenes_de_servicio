import { eq } from 'drizzle-orm';
import { db } from '..';
import { historialOrdenes } from '../schema';

/**
 * @import { DbOrTx } from './types';
 * @import { DataRegistroHistorialOrden, HistorialOrdenDetalle } from '$lib/types';
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

/**
 *
 * @param {number} ordenServicioId
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<HistorialOrdenDetalle[]>}
 */
export async function obtenerHistorialOrden (ordenServicioId, dbOrTx = db) {
  const rows = await dbOrTx
    .select()
    .from(historialOrdenes)
    .where(eq(historialOrdenes.ordenServicioId, ordenServicioId))
    .orderBy(historialOrdenes.creadoEn);
  return rows.map((historial) => {

    if (historial.tipo === 'CREACION') {
      const a = {
        id: historial.id,
        ordenServicioId: historial.ordenServicioId,
        tipo: historial.tipo,
        creadoEn: historial.creadoEn,
        descripcion: historial.descripcion,
        datosAdicionales: /** @type {Extract<HistorialOrdenDetalle['datosAdicionales'], { creadoPor: any} >} */(JSON.parse(historial.datosAdicionales))
      };
      return a;
    } else if (historial.tipo === 'CAMBIO_ESTADO') {
      const a = {
        id: historial.id,
        ordenServicioId: historial.ordenServicioId,
        tipo: historial.tipo,
        creadoEn: historial.creadoEn,
        descripcion: historial.descripcion,
        datosAdicionales: /** @type {Extract<HistorialOrdenDetalle['datosAdicionales'], { estadoNuevo: any} >} */(JSON.parse(historial.datosAdicionales))
      };
      return a;
    } else if (historial.tipo === 'ASIGNACION') {
      const a = {
        id: historial.id,
        ordenServicioId: historial.ordenServicioId,
        tipo: historial.tipo,
        creadoEn: historial.creadoEn,
        descripcion: historial.descripcion,
        datosAdicionales: /** @type {Extract<HistorialOrdenDetalle['datosAdicionales'], { asignadoPor: any} >} */(JSON.parse(historial.datosAdicionales))
      };
      return a;
    } else {
      const a = {
        id: historial.id,
        ordenServicioId: historial.ordenServicioId,
        tipo: historial.tipo,
        creadoEn: historial.creadoEn,
        descripcion: historial.descripcion,
        datosAdicionales: /** @type {Extract<HistorialOrdenDetalle['datosAdicionales'], { desasignadoPor: any} >} */(JSON.parse(historial.datosAdicionales))
      };
      return a;
    }
  });
}
