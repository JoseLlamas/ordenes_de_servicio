import { api } from './client';

/**
 *
 * @param {number} areaId
 * @param {AbortSignal} [signal]
 * @return {Promise<import('$lib/types').EmpleadoDTO[]>}
 */
export function obtenerEmpleadosSinUsuarioPorArea (areaId, signal) {
  return api(`/api/areas/${areaId}/empleados/sin-usuario`, { signal });
}


/**
 *
 * @param {number} areaId
 * @param {AbortSignal} [signal]
 * @return {Promise<import('$lib/types').EmpleadoDTO[]>}
 */
export function obtenerEmpleadosPorArea (areaId, signal) {
  return api(`/api/areas/${areaId}/empleados`, { signal });
}
