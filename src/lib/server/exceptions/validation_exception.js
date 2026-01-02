import { ApplicationException } from './application_exception';

/**
 * @template T
 */
export class ValidationException extends ApplicationException {

  /**
   * @type {{[P in keyof T]?: string}}
   */
  #errors;

  /**
   *
   * @param {string} message
   * @param {{[P in keyof T]?: string}} errors
   */
  constructor (message, errors) {
    super(message, 422);
    this.#errors = errors;
  }

  get errors () {
    return this.#errors;
  }

}
