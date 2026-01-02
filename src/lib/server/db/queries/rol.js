import { eq } from 'drizzle-orm';
import { db } from '..';
import { roles } from '../schema';

/**
 * @import { DbOrTx } from './types';
 * @import { RolDetalle, RolDTO } from '$lib/types';
 */

/**
 *
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<RolDetalle[]>}
 */
export async function obtenerRolesDetalle (dbOrTx = db) {
  const roles = await dbOrTx.query.roles.findMany({
    with: {
      rolesPermisos: {
        columns: {},
        with: {
          permiso: {
            columns: {
              id: true,
              sujeto: true,
              accion: true,
              texto: true
            }
          }
        }
      }
    }
  });
  return roles.map(rol => ({
    id: rol.id,
    nombre: rol.nombre,
    descripcion: rol.descripcion,
    permisos: rol.rolesPermisos.map(rp => rp.permiso)
  }));
}

/**
 * @param {number} rolId
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<RolDTO | null>}
 */
export async function obtenerRolPorId (rolId, dbOrTx = db) {
  return (await dbOrTx.query.roles.findFirst({
    columns: {
      id: true,
      nombre: true,
      descripcion: true
    },
    where: eq(roles.id, rolId)
  })) ?? null;
}
