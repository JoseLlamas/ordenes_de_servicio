import { api } from './client';

/**
 *
 * @param {number} areaId
 * @param {AbortSignal} [signal]
 * @return {Promise<import('$lib/types').EmpleadoDTO[]>}
 */
export async function obtenerEmpleadosSinUsuarioPorArea (areaId, signal) {
  const queryString = new URLSearchParams();
  queryString.append('activo', '');
  return api(`/api/areas/${areaId}/empleados/sin-usuario?${queryString.toString()}`, { signal });
}


/**
 *
 * @param {number} areaId
 * @param {AbortSignal} [signal]
 * @return {Promise<import('$lib/types').EmpleadoDTO[]>}
 */
export async function obtenerEmpleadosPorArea (areaId, signal) {
  const queryString = new URLSearchParams();
  queryString.append('activo', '');
  return api(`/api/areas/${areaId}/empleados?${queryString.toString()}`, { signal });
}
