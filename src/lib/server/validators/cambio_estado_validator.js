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
  tipoEntrada: Joi
    .string()
    .valid('PRESENCIAL', 'OFICIO', 'LLAMADA_TELEFONICA', 'INDICACION_SUPERIOR')
    .when('nuevoEstado', {
      is: Joi.valid('RESUELTO'),
      then: Joi.required(),
      otherwise: Joi.forbidden()
    })
    .strip(true),
  firmaEmpleadoSolicitante: Joi
    .string()
    .empty(['', null])
    .trim()
    .when('nuevoEstado', {
      is: Joi.valid('RESUELTO'),
      then: Joi.when('tipoEntrada', {
        is: 'PRESENCIAL',
        then: Joi.required(),
        otherwise: Joi.optional()
      }),
      otherwise: Joi.optional()
    })
    .messages({
      'any.required': 'La firma del solicitante es requerida'
    }),
  firmaUsuarioAtendio: Joi
    .string()
    .empty(['', null])
    .trim()
    .when('nuevoEstado', {
      is: Joi.valid('RESUELTO'),
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .messages({
      'any.required': 'La firma del usuario que atendio es requerida'
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
 *  firmaEmpleadoSolicitante?: string,
 *  firmaUsuarioAtendio?: string
 * }>}
 */
export const validateCambioEstado = createValidator(schema);
