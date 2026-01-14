import { eq, notExists } from 'drizzle-orm';
import { db } from '..';
import { empleados, areas, usuarios, invitaciones, encargadosAreas } from '../schema';
import { and, asc } from 'drizzle-orm';

/**
 * @import { DbOrTx, } from './types';
 * @import { EmpleadoDetalleDTO, EmpleadoDTO, AreaDTO } from '$lib/types';
 *
 */

/**
 *
 * @param {number} areaId
 * @param {{ activo?: boolean }} [filters]
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<EmpleadoDTO[]>}
 */
export async function obtenerEmpleadosPorArea (areaId, filters = { activo: true }, dbOrTx = db) {
  return dbOrTx.query.empleados.findMany({
    columns: {
      id: true,
      nombre: true,
      primerApellido: true,
      segundoApellido: true,
      cargo: true,
      activo: true
    },
    where: and(
      eq(empleados.areaId, areaId),
      typeof filters.activo !== 'undefined' ? eq(empleados.activo, filters.activo) : undefined
    ),
    orderBy: [asc(empleados.primerApellido), asc(empleados.segundoApellido)]
  });
}

/**
 *
 * @param {number} empleadoId
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<AreaDTO | null>}
 */
export async function obtenerAreaEmpleado (empleadoId, dbOrTx = db) {
  const [area] = await dbOrTx.select({
    id: areas.id,
    nombre: areas.nombre
  })
    .from(empleados)
    .innerJoin(areas, eq(empleados.areaId, areas.id))
    .where(eq(empleados.id, empleadoId));
  return area ?? null;
}

/**
 * @param {number} id
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<EmpleadoDetalleDTO | null>}
 */
export async function obtenerEmpleadoPorId (id, dbOrTx = db) {
  return (await dbOrTx.query.empleados.findFirst({
    columns: {
      id: true,
      nombre: true,
      primerApellido: true,
      segundoApellido: true,
      activo: true,
      cargo: true
    },
    with: {
      area: {
        columns: {
          id: true,
          nombre: true
        }
      },
      direccionGeneral: {
        columns: {
          id: true,
          nombre: true
        }
      }
    },
    where: eq(empleados.id, id)
  })) ?? null;
}

/**
 * @param {string} nombre
 * @param {string} primerApellido
 * @param {string} [segundoApellido]
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<EmpleadoDetalleDTO[]>}
 */
export async function obtenerEmpleadoPorNombre (nombre, primerApellido, segundoApellido, dbOrTx = db) {
  const conditions = [
    eq(empleados.nombre, nombre),
    eq(empleados.primerApellido, primerApellido),
    typeof segundoApellido !== 'undefined' ? eq(empleados.segundoApellido, segundoApellido) : undefined
  ].filter(Boolean);
  return await dbOrTx.query.empleados.findMany({
    columns: {
      id: true,
      nombre: true,
      primerApellido: true,
      segundoApellido: true,
      activo: true,
      cargo: true
    },
    with: {
      area: {
        columns: {
          id: true,
          nombre: true
        }
      },
      direccionGeneral: {
        columns: {
          id: true,
          nombre: true
        }
      }
    },
    where: and(...conditions)
  });
}

/**
 * @param {{ areaId?: number, activo?: boolean }} [filters = {}]
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<EmpleadoDTO[]>}
 */
export async function obtenerEmpleadosSinUsuario (filters = { activo: true }, dbOrTx = db) {
  const conditions = [
    typeof filters.areaId !== 'undefined' ? eq(empleados.areaId, filters.areaId) : undefined,
    typeof filters.activo !== 'undefined' ? eq(empleados.activo, filters.activo) : undefined,
    notExists(dbOrTx.select().from(invitaciones).where(eq(invitaciones.empleadoId, empleados.id))),
    notExists(dbOrTx.select().from(usuarios).where(eq(usuarios.empleadoId, empleados.id)))
  ].filter(Boolean);
  return await dbOrTx.query.empleados.findMany({
    columns: {
      id: true,
      nombre: true,
      primerApellido: true,
      segundoApellido: true,
      cargo: true,
      activo: true
    },
    where: and (...conditions),
    orderBy: [asc(empleados.nombre), asc(empleados.primerApellido)]
  });
}

/**
 *
 * @param {{
 *  nombre: string,
 *  primerApellido: string,
 *  segundoApellido: string | null,
 *  cargo: string | null,
 *  areaId: number,
 *  direccionGeneralId: number,
 *  activo: boolean
 * }} dataRegistroEmpleado
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<number>}
 */
export async function registrarEmpleado (dataRegistroEmpleado, dbOrTx = db) {
  const [{ id }] = await dbOrTx.insert(empleados).values(dataRegistroEmpleado).$returningId();
  return id;
}

/**
 *
 * @param {number} areaId
 * @param {{ activo?: boolean }} [filters]
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<EmpleadoDTO | null>}
 */
export async function obtenerEncargadoArea (areaId, filters = { activo: true }, dbOrTx = db) {
  const conditions = [
    eq(encargadosAreas.areaId, areaId)
  ];
  if (typeof filters.activo !== 'undefined') {
    conditions.push(eq(empleados.activo, filters.activo));
  }
  const [encargado] = await dbOrTx
    .select({
      id: empleados.id,
      nombre: empleados.nombre,
      primerApellido: empleados.primerApellido,
      segundoApellido: empleados.segundoApellido,
      cargo: empleados.cargo,
      activo: empleados.activo
    })
    .from(empleados)
    .innerJoin(encargadosAreas, eq(empleados.id, encargadosAreas.empleadoId))
    .where(
      and(...conditions)
    )
    .limit(1);
  return encargado ?? null;
}
