import { api } from './client';

/**
 *
 * @param {number} areaId
 * @param {AbortSignal} [signal]
 * @return {Promise<import('$lib/types').EmpleadoDTO[]>}
 */
export async function obtenerEmpleadosSinUsuarioPorArea (areaId, signal) {
  return api(`/api/areas/${areaId}/empleados/sin-usuario`, { signal });
}


/**
 *
 * @param {number} areaId
 * @param {AbortSignal} [signal]
 * @return {Promise<import('$lib/types').EmpleadoDTO[]>}
 */
export async function obtenerEmpleadosPorArea (areaId, signal) {
  return api(`/api/areas/${areaId}/empleados`, { signal });
}
