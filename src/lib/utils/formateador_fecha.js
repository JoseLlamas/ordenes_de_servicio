import { Temporal } from 'temporal-polyfill/impl';

/**
 * @param {Date} fecha
 * @returns {string}
 */
export function formatearFecha (fecha) {
  return Temporal.Instant.fromEpochMilliseconds(fecha.getTime())
    .toZonedDateTimeISO('America/Mexico_City')
    .toLocaleString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    }).toUpperCase();
}


/**
 * Formatear fecha relativa
 * @param {Date} fecha
 * @returns {string} - "hace 2 horas", "ayer", etc.
 */
export function formatearFechaRelativa (fecha) {
  const ahora = new Date();
  const diffMs = ahora - fecha;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {return 'Justo ahora';}
  if (diffMins < 60) {return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;}
  if (diffHours < 24) {return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;}
  if (diffDays < 7) {return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;}

  return formatearFecha(fecha);
}
