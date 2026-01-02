import { estados } from './estados';

const estadosConTexto = [
  estados.CANCELADO,
  estados.CERRADO,
  estados.PENDIENTE,
  estados.RESUELTO
];

/**
 * @type {Record<number, 'CANCELADO' | 'CERRADO' | 'SOLUCION' | 'PENDIENTE'>}
 */
const tipos = {
  [estados.CANCELADO]: 'CANCELADO',
  [estados.CERRADO]: 'CERRADO',
  [estados.RESUELTO]: 'SOLUCION',
  [estados.PENDIENTE]: 'PENDIENTE'
};

/**
 *
 * @param {number} estado
 * @returns {boolean}
 */
export function esEstadoConTexto (estado) {
  return estadosConTexto.includes(estado);
}

/**
 *
 * @param {number} estado
 * @returns {'CANCELADO' | 'CERRADO' | 'SOLUCION' | 'PENDIENTE' | null}
 */
export function obtenerTipoSegunEstado (estado) {
  return tipos[estado] ?? null;
}
