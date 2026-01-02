import { eq } from 'drizzle-orm';
import { db } from '../index';
import { sesiones } from '../schema';

/**
 *
 * @typedef {object} DataCreateSesion
 * @property {string} id
 * @property {number} usuarioId
 * @property {Date} expiresAt
 */

/**
 * @import { DbOrTx } from './types';
 * @import { SesionDTO } from '$lib/types';
 */

/**
 *
 * @param {string} id
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<SesionDTO | null>}
 */
export async function obtenerSesionPorId (id, dbOrTx = db) {
  const [row] = await dbOrTx.select({
    id: sesiones.id,
    usuarioId: sesiones.usuarioId,
    expiresAt: sesiones.expiresAt,
    creadoEn: sesiones.creadoEn
  })
    .from(sesiones)
    .where(eq(sesiones.id, id));
  return row ?? null;
}

/**
 * @param {string} id
 * @param {DbOrTx} [dbOrTx = db]
 */
export async function eliminarSesion (id, dbOrTx = db) {
  await dbOrTx.delete(sesiones).where(eq(sesiones.id, id));
}

/**
 *
 * @param {number} usuarioId
 * @param {DbOrTx} [dbOrTx = db]
 */
export async function eliminarSesionPorUsuario (usuarioId, dbOrTx = db) {
  await dbOrTx.delete(sesiones).where(eq(sesiones.usuarioId, usuarioId));
}

/**
 * @param {DataCreateSesion} data
 * @param {DbOrTx} [dbOrTx = db]
 * @returns {Promise<string>}
 */
export async function crearSesion (data, dbOrTx = db) {
  await dbOrTx.insert(sesiones).values(data);
  return data.id;
}
