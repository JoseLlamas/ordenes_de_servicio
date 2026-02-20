import { eq, and, inArray, isNotNull, like, not, exists } from 'drizzle-orm';
import { db } from '../index';
import {
  usuarios,
  empleados,
  areas,
  invitaciones,
  asignaciones,
  ordenesServicio,
  roles
} from '../schema';
import { sql, asc } from 'drizzle-orm';

/**
 * @import { DbOrTx} from './types';
 * @import { UsuarioLoginDTO, UsuarioDetalleDTO, UsuarioResumenDTO, InvitacionDTO, AgenteDTO } from '$lib/types';
 */

/**
 *
 * @param {{ nombreUsuario: string,
 *  activo: boolean,
 *  password: string,
 *  empleadoId: number,
 *  rolId: number,
 *  avatar: string | null,
 *  areasAccesoId: number[] | null
 * }} data
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<number>}
 */
export async function registrarUsuario (data, dbOrTx = db) {
  const values = {
    ...data,
    areasAccesoId: data.areasAccesoId !== null ? JSON.stringify(data.areasAccesoId) : null
  };
  const [{ id }] = await dbOrTx
    .insert(usuarios)
    .values(values)
    .$returningId();
  return id;
}

/**
 *
 * @param {{ areaId?: number, soloActivos?: boolean}} [filters]
 * @param {DbOrTx} [dbOrTx=db]
 * @return {Promise<UsuarioResumenDTO[]>}
 */
export async function obtenerUsuariosResumenes (filters = {}, dbOrTx = db) {
  const conditions = [];
  if (filters.areaId != null) {
    conditions.push(eq(empleados.areaId, filters.areaId));
  }
  if (filters.soloActivos != null && filters.soloActivos) {
    conditions.push(eq(usuarios.activo, true));
  }
  const query = dbOrTx
    .select({
      id: usuarios.id,
      nombreUsuario: usuarios.nombreUsuario,
      activo: usuarios.activo,
      avatar: usuarios.avatar,
      areasAccesoId: usuarios.areasAccesoId,
      'empleado.id': empleados.id,
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
  if (conditions.length > 0) {
    query.where(and(...conditions));
  }
  const rows = await query.orderBy(asc(empleados.nombre), asc(empleados.primerApellido));
  return rows.map(row => ({
    id: row.id,
    nombreUsuario: row.nombreUsuario,
    activo: row.activo,
    avatar: row.avatar,
    areasAccesoId: row.areasAccesoId != null ? JSON.parse(row.areasAccesoId) : null,
    empleado: {
      id: row['empleado.id'],
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
            columns: {},
            with: {
              permiso: true
            }
          }
        }
      }
    },
    where: eq(usuarios.id, id)
  });
  if (row != null) {
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
      areasAccesoId: invitacion.areasAccesoId != null ? JSON.parse(invitacion.areasAccesoId) : null
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
 * @param {{ nombre?: string, areasId?: number[] }} [filters = {}]
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<AgenteDTO[]>}
 */
export async function obtenerAgentes (filters = {}, dbOrTx = db) {
  const subquery = dbOrTx
    .select({
      ordenServicioId: ordenesServicio.id
    })
    .from(asignaciones)
    .innerJoin(ordenesServicio, eq(asignaciones.ordenServicioId, ordenesServicio.id))
    .where(
      and(
        eq(asignaciones.agenteId, usuarios.id),
        eq(ordenesServicio.estado, 'PROCESO')
      )
    )
    .limit(1)
    .as('a');
  const params = [
    eq(roles.nombre, 'Agente'),
    eq(usuarios.activo, true),
    isNotNull(usuarios.areasAccesoId)
  ];
  if (filters.nombre != null) {
    params.push(like(empleados.nombre, `%${filters.nombre}%`));
  }
  if (filters.areasId != null && filters.areasId.length > 0) {
    params.push(sql`JSON_CONTAINS(${usuarios.areasAccesoId}, ${JSON.stringify(filters.areasId)}, '$')`);
  }
  const query = dbOrTx
    .select({
      id: usuarios.id,
      nombreUsuario: usuarios.nombreUsuario,
      activo: usuarios.activo,
      avatar: usuarios.avatar,
      areasAccesoId: usuarios.areasAccesoId,
      'empleado.id': empleados.id,
      'empleado.nombre': empleados.nombre,
      'empleado.primerApellido': empleados.primerApellido,
      'empleado.segundoApellido': empleados.segundoApellido,
      'empleado.cargo': empleados.cargo,
      'empleado.area.id': areas.id,
      'empleado.area.nombre': areas.nombre,
      'rol.id': roles.id,
      'rol.nombre': roles.nombre,
      'ordenServicioId': sql`${subquery}`
    })
    .from(usuarios)
    .innerJoin(empleados, eq(usuarios.empleadoId, empleados.id))
    .innerJoin(areas, eq(empleados.areaId, areas.id))
    .innerJoin(roles, eq(usuarios.rolId, roles.id))
    .where(and(...params))
    .orderBy(asc(empleados.nombre), asc(empleados.primerApellido));
  const rows = await query;
  return rows.map(row => ({
    id: row.id,
    nombreUsuario: row.nombreUsuario,
    activo: row.activo,
    avatar: row.avatar,
    areasAccesoId: row.areasAccesoId != null ? JSON.parse(row.areasAccesoId) : null,
    ordenServicioId: /** @type {number | null} */ (row.ordenServicioId),
    empleado: {
      id: row['empleado.id'],
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
 * @param {number} ordenServicioId
 * @param {number[]} usuariosId
 * @param {DbOrTx} [dbOrTx = db]
 */
export async function obtenerUsuariosParaAsignarAgentes (ordenServicioId, usuariosId, dbOrTx = db) {
  const subquery = dbOrTx
    .select({
      a: sql`1`
    })
    .from(asignaciones)
    .innerJoin(ordenesServicio, eq(ordenesServicio.id, asignaciones.ordenServicioId))
    .where(
      and(
        eq(asignaciones.agenteId, usuarios.id),
        eq(ordenesServicio.estado, 'PROCESO'),
        not(eq(ordenesServicio.id, ordenServicioId))
      )
    );
  const users = await dbOrTx
    .select({
      id: usuarios.id,
      areasAccesoId: usuarios.areasAccesoId,
      activo: usuarios.activo,
      rol: roles.nombre,
      estadoOcupado: exists(subquery)
    })
    .from(usuarios)
    .innerJoin(roles, eq(usuarios.rolId, roles.id))
    .where(inArray(usuarios.id, usuariosId));
  return users.map(user => ({
    id: user.id,
    activo: user.activo,
    areasAccesoId: /** @type {number[] | null} */ (user.areasAccesoId != null ? JSON.parse(user.areasAccesoId) : null),
    rol: user.rol,
    estadoOcupado: Boolean(/** @type {boolean} */ (user.estadoOcupado))
  }));
}
