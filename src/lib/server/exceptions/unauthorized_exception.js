// src/lib/server/exceptions/UnauthorizedException.js

import { ApplicationException } from './application_exception';

/**
 * Excepción para errores de autenticación
 */
export class UnauthorizedException extends ApplicationException {
  constructor (message = 'No autorizado') {
    super(message, 401);
  }
}
