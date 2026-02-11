/**
 * @typedef {Object} ValidationDetail
 * @property {string[]} path - Ruta de la propiedad con error
 * @property {string} message - Mensaje de error
 */

/**
 * @typedef {Object} JoiError
 * @property {ValidationDetail[]} details - Detalles de los errores de validación
 */

/**
 * @template T
 * @typedef {{ errors: {[P in keyof T]?: string} } | { values: T }} ValidationResult
 */

/**
 * @param {JoiError} errors - Errores de Joi
 */
function normalizeErrors (errors) {
  return errors.details.reduce((accu, detail) => {
    accu[detail.path.join('.')] = detail.message;
    return accu;
  }, {});
}

/**
 * @template T
 * @typedef {(data: any) => Promise<ValidationResult<T>>} Validator
 */

/**
  * Crea una función validadora reutilizable
  * @template T
  * @param {import('joi').Schema} schema - Esquema de Joi
  * @returns {Validator<T>}
*/
export function createValidator (schema) {
  /**
   * @param {any} data
   * @returns {Promise<ValidationResult<T>>}
   */
  return async (data) => {
    try {
      const values = /** @type {T} */ (await schema.validateAsync(data, { abortEarly: false, stripUnknown: true }));
      return { values };
    } catch (er) {
      const e = /** @type {JoiError} */ (er);
      const errors = normalizeErrors(e);
      return { errors };
    }
  };
}
