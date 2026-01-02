// src/lib/server/exceptions/ApplicationException.js

/**
 * Excepción base de la aplicación
 */
export class ApplicationException extends Error {

  /**
   * @type {string}
   */
  #name;

  /**
   * @type {number}
   */
  #statusCode;

  /**
   * @param {string} message
   * @param {number} [statusCode]
   */
  constructor (message, statusCode = 500) {
    super(message);
    this.#name = this.constructor.name;
    this.#statusCode = statusCode;

    // Mantener stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  get name () {
    return this.#name;
  }

  get statusCode () {
    return this.#statusCode;
  }

}
