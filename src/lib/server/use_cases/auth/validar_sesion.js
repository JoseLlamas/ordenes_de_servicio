import { obtenerSesionPorId, eliminarSesion, obtenerUsuarioDetalle } from '$lib/server/db/queries';
import { Temporal } from 'temporal-polyfill/impl';

/**
 *
 * @param {string} sesionId
 * @return {ReturnType<typeof obtenerUsuarioDetalle>}
 */
export async function validarSesion (sesionId) {
  const sesion = await obtenerSesionPorId(sesionId);
  if (sesion == null) {
    return null;
  }
  const expiresAt = Temporal.Instant.fromEpochMilliseconds(sesion.expiresAt.getTime());
  const now = Temporal.Now.instant();
  if (Temporal.Instant.compare(now, expiresAt) > 0) {
    await eliminarSesion(sesionId);
    return null;
  }
  return obtenerUsuarioDetalle(sesion.usuarioId);
}
