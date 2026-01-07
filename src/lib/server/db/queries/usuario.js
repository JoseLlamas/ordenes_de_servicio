import { eq, and, inArray, isNotNull, like } from 'drizzle-orm';
import { db } from '../index';
import {
  usuarios,
  empleados,
  areas,
  invitaciones,
  roles,
  rolesPermisos,
  permisos
} from '../schema';
import { sql, asc } from 'drizzle-orm';

/**
 * @import { DbOrTx} from './types';
 * @import { UsuarioLoginDTO, UsuarioDetalleDTO, UsuarioResumenDTO, InvitacionDTO } from '$lib/types';
 */

/**
 * @param {DbOrTx} [dbOrTx = db]
 */
function createQueryParaUsuarioResumen (dbOrTx = db) {
  const query = dbOrTx
    .select({
      id: usuarios.id,
      nombreUsuario: usuarios.nombreUsuario,
      activo: usuarios.activo,
      avatar: usuarios.avatar,
      'empleado.id': empleados.id,
      'empleado.numeroEmpleado': empleados.numeroEmpleado,
      'empleado.nombre': empleados.nombre,
      'empleado.primerApellido': empleados.primerApellido,
      'empleado.segundoApellido': empleados.segundoApellido,
      'empleado.cargo': empleados.cargo,
      'empleado.area.id': areas.id,
      'empleado.area.nombre': areas.nombre,
      'rol.id': roles.id,
      'rol.nombre': roles.nombre
    })
    .from(usuarios)
    .innerJoin(empleados, eq(usuarios.empleadoId, empleados.id))
    .innerJoin(areas, eq(empleados.areaId, areas.id))
    .innerJoin(roles, eq(usuarios.rolId, roles.id));
  return query;
}



/**
 *
 * @param {{ nombreUsuario: string,
 *  activo: boolean,
 *  password: string,
 *  empleadoId: number,
 *  areaId: number,
 *  rolId: number,
 *  avatar: string | null,
 *  areasAccesoId: number[] | null
 * }} data
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<number>}
 */
export async function registrarUsuario (data, dbOrTx = db) {
  const [{ id }] = await dbOrTx
    .insert(usuarios)
    .values({
      ...data,
      areasAccesoId: data.areasAccesoId !== null ? JSON.stringify(data.areasAccesoId) : null
    })
    .$returningId();
  return id;
}

/**
 *
 * @param {{ areaId?: number, activo?: boolean }} [filters]
 * @param {DbOrTx} [dbOrTx=db]
 * @return {Promise<UsuarioResumenDTO[]>}
 */
export async function obtenerUsuariosResumenes (filters = {}, dbOrTx = db) {
  const conditions = [
    typeof filters.areaId !== 'undefined' ? eq(empleados.areaId, filters.areaId) : undefined,
    typeof filters.activo !== 'undefined' ? eq(usuarios.activo, filters.activo) : undefined
  ].filter(Boolean);
  const query = createQueryParaUsuarioResumen(dbOrTx);
  if (conditions.length > 0) {
    query.where(and(...conditions));
  }
  const rows = await query.orderBy(asc(empleados.nombre), asc(empleados.primerApellido));
  return rows.map(row => ({
    id: row.id,
    nombreUsuario: row.nombreUsuario,
    activo: row.activo,
    avatar: row.avatar,
    empleado: {
      id: row['empleado.id'],
      numeroEmpleado: row['empleado.numeroEmpleado'],
      nombre: row['empleado.nombre'],
      primerApellido: row['empleado.primerApellido'],
      segundoApellido: row['empleado.segundoApellido'],
      cargo: row['empleado.cargo'],
      area: {
        id: row['empleado.area.id'],
        nombre: row['empleado.area.nombre']
      }
    },
    rol: {
      id: row['rol.id'],
      nombre: row['rol.nombre']
    }
  }));
}

/**
 *
 * @param {string} nombreUsuario
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<UsuarioLoginDTO | null>}
 */
export async function obtenerUsuarioLogin (nombreUsuario, dbOrTx = db) {
  const [row] = await dbOrTx
    .select({
      id: usuarios.id,
      nombreUsuario: usuarios.nombreUsuario,
      password: usuarios.password,
      activo: usuarios.activo
    })
    .from(usuarios)
    .where(eq(sql`lower(${usuarios.nombreUsuario})`, nombreUsuario.toLowerCase()))
    .limit(1);
  return row ?? null;
}

/**
 *
 * @param {number} id
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<string | null>}
 */
export async function obtenerPasswordUsuario (id, dbOrTx = db) {
  const [row] = await dbOrTx
    .select({ password: usuarios.password })
    .from(usuarios)
    .where(eq(usuarios.id, id));
  return row?.password ?? null;
}

/**
 *
 * @param {number} id
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<UsuarioDetalleDTO | null>}
 */
export async function obtenerUsuarioDetalle (id, dbOrTx = db) {
  const row = await dbOrTx.query.usuarios.findFirst({
    columns: {
      id: true,
      nombreUsuario: true,
      areasAccesoId: true,
      activo: true,
      avatar: true
    },
    with: {
      empleado: {
        columns: {
          id: true,
          numeroEmpleado: true,
          nombre: true,
          primerApellido: true,
          segundoApellido: true,
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
        }
      },
      rol: {
        columns: {
          id: true,
          nombre: true
        },
        with: {
          rolesPermisos: {
            with: {
              permiso: true
            }
          }
        }
      }
    },
    where: eq(usuarios.id, id)
  });
  if (typeof row !== 'undefined') {
    let areasAcceso;
    if (row.areasAccesoId != null) {
      areasAcceso = await dbOrTx.query.areas.findMany({
        columns: {
          id: true,
          nombre: true
        },
        where: inArray(areas.id, JSON.parse(row.areasAccesoId))
      });
    } else {
      areasAcceso = null;
    }
    const permisos = row.rol.rolesPermisos.map(rp => rp.permiso);
    return {
      id: row.id,
      areasAcceso: areasAcceso,
      nombreUsuario: row.nombreUsuario,
      activo: row.activo,
      avatar: row.avatar,
      empleado: row.empleado,
      rol: {
        id: row.rol.id,
        nombre: row.rol.nombre,
        permisos: permisos
      }
    };
  }
  return null;
}

/**
 *
 * @param {{ password?: string, activo?: boolean, avatar?: string }} data
 * @param {number} id
 * @param {DbOrTx} [dbOrTx = db]
 */
export async function patchUsuario (data, id, dbOrTx = db) {
  await dbOrTx.update(usuarios)
    .set(data)
    .where(eq(usuarios.id, id));
}

/**
 *
 * @param {{
 *  empleadoId: number,
 *  rolId: number,
 *  areasAccesoId: number[] | null,
 *  token: string,
 *  invitadorId: number,
 *  usado: boolean
 * }} values
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<number>}
 */
export async function registrarInvitacion (values, dbOrTx = db) {
  const [{ id }] = await dbOrTx
    .insert(invitaciones)
    .values({
      ...values,
      areasAccesoId: values.areasAccesoId != null ? JSON.stringify(values.areasAccesoId) : null
    })
    .$returningId();
  return id;
}

/**
 *
 * @param {string} token
 * @param {DbOrTx} [dbOrTx = db]
 * @returns {Promise<InvitacionDTO | null>}
 */
export async function obtenerInvitacion (token, dbOrTx = db) {
  const [invitacion] = await dbOrTx
    .select()
    .from(invitaciones)
    .where(eq(invitaciones.token, token));
  if (invitacion) {
    return {
      ...invitacion,
      areasAccesoId: invitacion.areasAccesoId !== null ? JSON.parse(invitacion.areasAccesoId) : null
    };
  }
  return null;
}

/**
 * @param {{ usado?: boolean }} data
 * @param {number} id
 * @param {DbOrTx} [dbOrTx = db]
 */
export async function patchInvitacion (data, id, dbOrTx = db) {
  await dbOrTx
    .update(invitaciones)
    .set(data)
    .where(eq(invitaciones.id, id));
}

/**
 * @param {number} empleadoId
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<boolean>}
 */
export async function tieneUsuario (empleadoId, dbOrTx = db) {
  const cantidad = await dbOrTx.$count(usuarios, eq(usuarios.empleadoId, empleadoId));
  return cantidad > 0;
}

/**
 * @param {number} empleadoId
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<boolean>}
 */
export async function tieneInvitacion (empleadoId, dbOrTx = db) {
  const cantidad = await dbOrTx.$count(invitaciones, eq(invitaciones.empleadoId, empleadoId));
  return cantidad > 0;
}

/**
 *
 * @param {string} nombreUsuario
 * @param {DbOrTx} [dbOrTx = db]
 */
export async function existeNombreUsuario (nombreUsuario, dbOrTx = db) {
  const cantidad = await dbOrTx
    .$count(usuarios, eq(sql`lower(${usuarios.nombreUsuario})`, nombreUsuario.toLowerCase()));
  return cantidad > 0;
}

/**
 * @param {number} areaId
 * @param {{ nombre?: string }} [filters = {}]
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<import('$lib/types').UsuarioResumenDTO[]>}
 */
export async function obtenerUsuariosConPermisoAgente (areaId, filters = {}, dbOrTx = db) {
  const subquery = dbOrTx
    .select({
      id: usuarios.id
    })
    .from(usuarios)
    .innerJoin(roles, eq(usuarios.rolId, roles.id))
    .innerJoin(rolesPermisos, eq(roles.id, rolesPermisos.rolId))
    .innerJoin(permisos, eq(rolesPermisos.permisoId, permisos.id))
    .where(
      and(
        eq(usuarios.activo, true),
        isNotNull(usuarios.areasAccesoId),
        eq(permisos.sujeto, 'Orden'),
        inArray(permisos.accion, ['read', 'start', 'resolve']),
        sql`JSON_CONTAINS(${usuarios.areasAccesoId}, ${JSON.stringify(areaId)}, '$')`
      )
    )
    .groupBy(usuarios.id)
    .having(sql`count(distinct ${permisos.accion}) = 3`)
    .orderBy(usuarios.id)
    .as('usuarios_con_permisos');
  const rows = await createQueryParaUsuarioResumen(dbOrTx)
    .where(
      and(
        sql`${usuarios.id} in (select id from ${subquery})`,
        typeof filters.nombre !== 'undefined' ? like(empleados.nombre, `%${filters.nombre}%`) : undefined
      )
    )
    .orderBy(asc(empleados.nombre), asc(empleados.primerApellido));
  return rows.map(row => ({
    id: row.id,
    nombreUsuario: row.nombreUsuario,
    activo: row.activo,
    avatar: row.avatar,
    empleado: {
      id: row['empleado.id'],
      numeroEmpleado: row['empleado.numeroEmpleado'],
      nombre: row['empleado.nombre'],
      primerApellido: row['empleado.primerApellido'],
      segundoApellido: row['empleado.segundoApellido'],
      cargo: row['empleado.cargo'],
      area: {
        id: row['empleado.area.id'],
        nombre: row['empleado.area.nombre']
      }
    },
    rol: {
      id: row['rol.id'],
      nombre: row['rol.nombre']
    }
  }));
}
