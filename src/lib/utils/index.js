import { normalizePalabras } from './normalize_palabras';

export * from './normalize_palabras';
export * from './formateador_fecha';

/**
 *
 * @param {string} nombre
 */
export function obtenerInicialesParaAvatar (nombre) {
  const ignore = ['de', 'del', 'la', 'las', 'los', 'y', 'the', 'da', 'do', 'dos'];

  const parts = nombre.trim().split(/\s+/).filter(word => !ignore.includes(word.toLowerCase()));

  if (parts.length === 0) {
    return '';
  }

  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}


/**
  * Mapeo de estados a colores
  * @param {'NUEVO' | 'PROCESO' | 'PENDIENTE' | 'RESUELTO' | 'CERRADO' | 'CANCELADO'} estado
  * @return {string}
*/
export function getEstadoColor (estado) {
  const colores = {
    'NUEVO': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    'PROCESO': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    'PENDIENTE': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
    'RESUELTO': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
    'CERRADO': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    'CANCELADO': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800'
  };
  return colores[estado] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
}


/**
  * Mapeo de prioridades a colores
  * @param {'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA'} prioridad
  * @return {string}
*/
export function getPrioridadColor (prioridad) {
  const colores = {
    'BAJA': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-700',
    'MEDIA': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    'ALTA': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    'CRITICA': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800'
  };
  return colores[prioridad] || colores.MEDIA;
}


/**
  * Formatear nombre completo
  * @param {{ nombre: string, primerApellido: string, segundoApellido?: string | null }} persona
*/
export function escribirNombreCompleto (persona) {
  return normalizePalabras(persona.nombre, persona.primerApellido, persona.segundoApellido ?? '');
}

/**
 *
 * @param {URL} url
 * @param {string} key
 * @param {string | null} [value]
 */
export function setValueQueryString (url, key, value) {
  if (value != null && value.length > 0) {
    url.searchParams.set(key, value);
  } else {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key);
    }
  }
}

const ESTADOS = {
  'NUEVO': ['PROCESO', 'CANCELADO'],
  'PROCESO': ['PENDIENTE', 'RESUELTO', 'CANCELADO'],
  'PENDIENTE': ['PROCESO', 'CANCELADO'],
  'RESUELTO': ['PROCESO', 'CERRADO']
};

/**
 *
 * @param {'NUEVO' | 'PROCESO' | 'PENDIENTE' | 'RESUELTO' | 'CERRADO' | 'CANCELADO'} estado
 * @param {'PROCESO' | 'PENDIENTE' | 'RESUELTO' | 'CERRADO' | 'CANCELADO'} estadoNuevo
 */
export function verificarCambioEstado (estado, estadoNuevo) {
  if (estado === 'CANCELADO' || estado === 'CERRADO') {
    return false;;
  }
  return ESTADOS[estado].includes(estadoNuevo);
}

/**
 * @param {'PROCESO' | 'PENDIENTE' | 'RESUELTO' | 'CERRADO' | 'CANCELADO'} estado
 * @return {'SEGUIMIENTO' | 'PENDIENTE' | 'SOLUCION' | 'CIERRE' | 'CANCELACION'}
 */
export function fromEstadoOrdenATipoObservacion (estado) {
  if (estado === 'PROCESO') {
    return 'SEGUIMIENTO';
  } else if (estado === 'PENDIENTE') {
    return 'PENDIENTE';
  } else if (estado === 'RESUELTO') {
    return 'SOLUCION';
  } else if (estado === 'CERRADO') {
    return 'CIERRE';
  } else {
    return 'CANCELACION';
  }
}

/**
 *
 * @param {string} texto
 * @param {number} [longitudMaxima = 300]
 */
export function recortarTexto (texto, longitudMaxima = 300) {
  if (texto.length <= longitudMaxima) {
    return texto;
  }
  return texto.slice(0, longitudMaxima) + '...';
}
