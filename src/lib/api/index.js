import { api } from './client';

export * from './areas';
export * from './empleados';

/**
 *
 * @param {number} areaId
 * @param {AbortSignal} [signal]
 * @returns {Promise<import('$lib/types').CategoriaOrdenDTO[]>}
 */
export async function obtenerCategoriasOrdenPorArea (areaId, signal) {
  const queryString = new URLSearchParams();
  queryString.append('areaId', String(areaId));
  return await api(`/api/categorias-orden?${queryString.toString()}`, { signal });
}

/**
 *
 * @param {number} areaId
 * @returns {Promise<import('$lib/types').CategoriaActivoDTO[]>}
 */
export async function obtenerCategoriasActivoPorArea (areaId) {
  const queryString = new URLSearchParams();
  queryString.append('areaId', String(areaId));
  return api(`/api/categorias-activo?${queryString.toString()}`);
}

