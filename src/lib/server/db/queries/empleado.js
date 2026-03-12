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
export function obtenerEmpleadosPorArea (areaId, filters = { activo: true }, dbOrTx = db) {
  const params = [
    eq(empleados.areaId, areaId)
  ];
  if (filters.activo != null) {
    params.push(eq(empleados.activo, filters.activo));
  }
  return dbOrTx.query.empleados.findMany({
    columns: {
      id: true,
      nombre: true,
      primerApellido: true,
      segundoApellido: true,
      cargo: true,
      activo: true
    },
    where: and(...params),
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
 *
 * @param {number} id
 * @param {DbOrTx} [dbOrTx = db]
 */
export async function obtenerEmpleadoParaPrellenadoPorId (id, dbOrTx = db) {
  return (await dbOrTx.query.empleados.findFirst({
    columns: {
      id: true,
      activo: true,
      areaId: true,
      direccionGeneralId: true
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
export function obtenerEmpleadoPorNombre (nombre, primerApellido, segundoApellido, dbOrTx = db) {
  const conditions = [
    eq(empleados.nombre, nombre),
    eq(empleados.primerApellido, primerApellido)
  ];
  if (segundoApellido != null) {
    conditions.push(eq(empleados.segundoApellido, segundoApellido));
  }
  return dbOrTx.query.empleados.findMany({
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
export function obtenerEmpleadosSinUsuario (filters = { activo: true }, dbOrTx = db) {
  const conditions = [];
  if (filters.areaId != null) {
    conditions.push(eq(empleados.areaId, filters.areaId));
  }
  if (filters.activo != null) {
    conditions.push(eq(empleados.activo, filters.activo));
  }
  conditions.push(notExists(dbOrTx.select().from(invitaciones).where(eq(invitaciones.empleadoId, empleados.id))));
  conditions.push(notExists(dbOrTx.select().from(usuarios).where(eq(usuarios.empleadoId, empleados.id))));
  return dbOrTx.query.empleados.findMany({
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
  if (filters.activo != null) {
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

/**
 *
 * @param {{ activo?: boolean }} data
 * @param {number} empleadoId
 * @param {DbOrTx} dbOrTx
 */
export async function patchEmpleado (data, empleadoId, dbOrTx = db) {
  await dbOrTx
    .update(empleados)
    .set(data)
    .where(eq(empleados.id, empleadoId));
}
