import { api } from './client';

/**
 *
 * @param {number} direccionGeneralId
 * @param {AbortSignal} [signal]
 * @return {Promise<import('$lib/types').AreaDTO[]>}
 */
export async function obtenerAreasPorDireccion (direccionGeneralId, signal) {
  const queryString = new URLSearchParams();
  queryString.append('direccionGeneralId', String(direccionGeneralId));
  queryString.append('activo', '');
  return api(`/api/areas?${queryString.toString()}`, { signal });
}
