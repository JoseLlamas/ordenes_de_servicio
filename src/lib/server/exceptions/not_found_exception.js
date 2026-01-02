// src/lib/server/exceptions/NotFoundException.js

import { ApplicationException } from './application_exception';

/**
 * Excepción cuando no se encuentra un recurso
 */
export class NotFoundException extends ApplicationException {

  /**
   * @param {string} resource - Nombre del recurso
   * @param {string |number | null} [id] - ID del recurso
   */
  constructor (resource, id = null) {
    const message = id != null
      ? `${resource} con ID ${id} no encontrado`
      : `${resource} no encontrado`;

    super(message, 404);
  }
}
