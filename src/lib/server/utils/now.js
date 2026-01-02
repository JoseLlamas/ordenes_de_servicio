import { Temporal } from 'temporal-polyfill/impl';

/**
 *
 * @returns {Date}
 */
export function now () {
  return new Date(Temporal.Now.zonedDateTimeISO('America/Mexico_City').epochMilliseconds);
}
