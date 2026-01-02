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
