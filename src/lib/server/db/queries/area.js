import { eq, asc, and, inArray, exists, sql } from 'drizzle-orm';
import { db } from '..';
import { areas, categoriasOrden } from '../schema';

/**
 * @import { DbOrTx } from './types';
 * @import { AreaDTO } from '$lib/types';
 */

/**
 * @param {{ direccionGeneralId?: number, ids?: number[] }} [filters]
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<AreaDTO[]>}
 */
export async function obtenerAreas (filters = {}, dbOrTx = db) {
  const conditions = [];
  if (typeof filters.direccionGeneralId !== 'undefined') {
    conditions.push(eq(areas.direccionGeneralId, filters.direccionGeneralId));
  }
  if (typeof filters.ids !== 'undefined' && filters.ids.length > 0) {
    conditions.push(inArray(areas.id, filters.ids));
  }
  const query = dbOrTx
    .select({
      id: areas.id,
      nombre: areas.nombre
    })
    .from(areas);
  if (conditions.length > 0) {
    query.where(and(...conditions));
  }
  return query.orderBy(asc(areas.nombre));
}

/**
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<AreaDTO[]>}
 */
export async function obtenerAreasParaAsignar (dbOrTx = db) {
  const subQuery = dbOrTx
    .select({
      a: sql`1`
    })
    .from(categoriasOrden)
    .where(eq(categoriasOrden.areaId, areas.id))
    .limit(1);
  return await dbOrTx
    .select({
      id: areas.id,
      nombre: areas.nombre
    })
    .from(areas)
    .where(exists(subQuery))
    .orderBy(asc(areas.nombre));
}


