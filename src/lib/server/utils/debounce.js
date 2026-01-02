/**
 * @template T
 * Ejecuta una función después de que ha pasado un tiempo desde la última vez que se llamó.
 * @param {((...args:T[]) => Promise<any>)} fn - La función que quieres ejecutar.
 * @param {number} [delay] - El tiempo en milisegundos a esperar.
 * @returns {((...args: T[]) => Promise<any>)}
 */
export function debounce (fn, delay = 500) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    return new Promise((resolve, reject) => {
      timeout = setTimeout(async () => {
        try {
          const result = await fn(...args);
          resolve(result);
        } catch (exc) {
          reject(exc);
        }
      }, delay);
    });
  };
}

/**
 * @typedef {Record<string, any>} QueryStringParams
 */

/**
 *
 * @template R
 *
 * Crea una función debounce con soporte para abortar fetchs anteriores.
 * @param {(signal: AbortSignal, values: QueryStringParams) => Promise<R[]>} callback
 * @param {number} delay
 * @returns {(values: QueryStringParams) => Promise<R[]>}
 */
export function debounceWithAbort (callback, delay = 300) {
  let timeout = null;
  let controller = null;

  return (values) => {
    clearTimeout(timeout);

    // Abortar solicitud anterior si existe
    if (controller) {
      controller.abort();
    }
    controller = new AbortController();

    return new Promise ((resolve, reject) => {
      timeout = setTimeout(async () => {
        try {
          const result = await callback(controller.signal, values);
          resolve(result);
        } catch (err) {
          if (err.name !== 'AbortError') {
            reject(err);
          }
        }
      }, delay);
    });
  };
}

