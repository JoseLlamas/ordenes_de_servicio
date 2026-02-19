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
    .trim()
    .when('nuevoEstado', {
      is: Joi.valid('RESUELTO'),
      then: Joi.required(),
      otherwise: Joi.optional().default(null)
    }),
  observacion: Joi
    .string()
    .empty(['', null])
    .trim()
    .max(1000)
    .uppercase()
    .when('nuevoEstado', {
      is: Joi.valid('PENDIENTE', 'RESUELTO', 'CANCELADO'),
      then: Joi.required(),
      otherwise: Joi.optional().default(null)
    })
    .messages({
      'any.required': 'La observación es requerida en PENDIENTE, RESUELTO Y CANCELADO',
      'string.max': 'La observación no puede tener más de 1000 carácteres'
    })
});

/**
 * @type {Validator<{
 *  ordenServicioId: number,
 *  nuevoEstado: 'PROCESO' | 'PENDIENTE' | 'RESUELTO' | 'CERRADO' | 'CANCELADO',
 *  observacion: string | null,
 *  firmaEmpleadoSolicitante: string | null
 * }>}
 */
export const validateCambioEstado = createValidator(schema);
