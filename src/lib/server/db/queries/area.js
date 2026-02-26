import { eq, asc, and, inArray, exists } from 'drizzle-orm';
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
export function obtenerAreas (filters = {}, dbOrTx = db) {
  const conditions = [];
  if (filters.direccionGeneralId != null) {
    conditions.push(eq(areas.direccionGeneralId, filters.direccionGeneralId));
  }
  if (filters.ids != null && filters.ids.length > 0) {
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
export function obtenerAreasParaAsignar (dbOrTx = db) {
  const subQuery = dbOrTx
    .select()
    .from(categoriasOrden)
    .where(eq(categoriasOrden.areaId, areas.id))
    .limit(1);
  return dbOrTx
    .select({
      id: areas.id,
      nombre: areas.nombre
    })
    .from(areas)
    .where(exists(subQuery))
    .orderBy(asc(areas.nombre));
}
