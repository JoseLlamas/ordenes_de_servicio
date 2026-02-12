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
    .required()
    .messages({
      'any.required': 'El id de la orden de servicio es requerido'
    }),
  activoId: Joi
    .number()
    .integer()
    .empty(['', null])
    .required()
    .messages({
      'any.required': 'El activo id es requerido'
    })
});

/**
 * @type {Validator<{ ordenServicioId: number, activoId: number }>}
 */
export const validateEliminacionActivo = createValidator(schema);
