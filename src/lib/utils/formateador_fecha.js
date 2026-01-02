import { Temporal } from 'temporal-polyfill/impl';

/**
 * @param {Date} fecha
 * @returns {string}
 */
export function formatearFecha (fecha) {
  return Temporal.Instant.from(fecha.toISOString())
    .toZonedDateTimeISO('America/Mexico_City')
    .toLocaleString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).toUpperCase();
}
