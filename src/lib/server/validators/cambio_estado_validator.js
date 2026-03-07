import Joi from 'joi';
import { createValidator } from './validator';

/**
 * @import { Validator } from './validator';
 */

const schema = Joi.object({
  ordenServicioId: Joi
    .number()
    .integer()
    .empty(['', null])
    .required(),
  nuevoEstado: Joi
    .string()
    .empty(['', null])
    .valid('PROCESO', 'PENDIENTE', 'RESUELTO', 'CERRADO', 'CANCELADO')
    .required(),
  firmaEmpleadoSolicitante: Joi
    .string()
    .empty(['', null])
    .trim(),
  firmaUsuarioAtendio: Joi
    .string()
    .empty(['', null])
    .trim(),
  observacion: Joi
    .string()
    .empty(['', null])
    .trim()
    .max(1000)
    .uppercase()
    .default(null)
    .messages({
      'string.max': 'La observación no puede tener más de 1000 carácteres'
    })
});

/**
 * @type {Validator<{
 *  ordenServicioId: number,
 *  nuevoEstado: 'PROCESO' | 'PENDIENTE' | 'RESUELTO' | 'CERRADO' | 'CANCELADO',
 *  observacion: string | null,
 *  firmaEmpleadoSolicitante?: string,
 *  firmaUsuarioAtendio?: string
 * }>}
 */
export const validateCambioEstado = createValidator(schema);
