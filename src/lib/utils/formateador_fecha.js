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

  const ahora = Temporal.Now.instant();
  const instant = Temporal.Instant.fromEpochMilliseconds(fecha.getTime());

  const esFuturo = Temporal.Instant.compare(instant, ahora) > 0;

  const duracion = esFuturo ? instant.since(ahora) : ahora.since(instant);

  const minutos = Math.floor(duracion.total('minutes'));
  const horas = Math.floor(duracion.total('hours'));
  const dias = Math.floor(duracion.total('days'));

  if (minutos < 1) {
    return 'Justo ahora';
  }

  if (esFuturo) {
    if (minutos < 60) {
      return `En ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
    }
    if (horas < 24) {
      return `En ${horas} hora${horas !== 1 ? 's' : ''}`;
    }
    if (dias < 7) {
      return `En ${dias} dia${dias !== 1 ? 's' : ''}`;
    }
  } else {
    if (minutos < 60) {
      return `Hace ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
    }
    if (horas < 24) {
      return `Hace ${horas} hora${horas !== 1 ? 's' : ''}`;
    }
    if (dias === 1) {
      return 'Ayer';
    }
    if (dias < 7) {
      return `Hace ${dias} días`;
    }
  }

  return formatearFecha(fecha);
}
