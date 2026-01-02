// src/lib/server/exceptions/ForbiddenException.js

import { ApplicationException } from './application_exception';

/**
 * Excepción cuando el usuario no tiene permisos
 */
export class ForbiddenException extends ApplicationException {
  /**
   * @param {string | null} [permiso] - Permiso requerido
   */
  constructor (permiso = null) {
    const message = permiso
      ? `No tienes permiso: ${permiso}`
      : 'No tienes permisos para realizar esta acción';

    super(message, 403);
  }
}
