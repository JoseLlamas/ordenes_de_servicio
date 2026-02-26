import { api } from './client';

export * from './areas';
export * from './empleados';

/**
 *
 * @param {number} areaId
 * @param {AbortSignal} [signal]
 * @returns {Promise<import('$lib/types').CategoriaOrdenDTO[]>}
 */
export function obtenerCategoriasOrdenPorArea (areaId, signal) {
  return api(`/api/areas/${areaId}/categorias-orden`, { signal });
}

/**
 *
 * @param {number} areaId
 * @param {AbortSignal} [signal]
 * @returns {Promise<import('$lib/types').CategoriaActivoDTO[]>}
 */
export function obtenerCategoriasActivoPorArea (areaId, signal) {
  return api(`/api/areas/${areaId}/categorias-activo`, { signal });
}

/**
 *
 * @param {number} areaId
 * @param {string} [nombre]
 * @param {AbortSignal} [signal]
 * @returns {Promise<import('$lib/types').AgenteDTO[]>}
 */
export function obtenerAgentes (areaId, nombre, signal) {
  const queryString = new URLSearchParams;
  if (nombre != null) {
    queryString.append('nombre', nombre);
  }
  return api(`/api/areas/${areaId}/agentes?${queryString}`, { signal });
}


