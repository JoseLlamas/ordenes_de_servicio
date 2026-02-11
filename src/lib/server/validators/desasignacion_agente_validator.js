
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
      'any.required': 'El orden de servicio es requerido'
    }),
  agenteId: Joi
    .number()
    .integer()
    .empty(['', null])
    .required()
    .messages({
      'any.required': 'Debe seleccionar aunque sea un agente'
    })
});

/**
 * @type {Validator<{ ordenServicioId: number, agenteId: number }>}
 */
export const validateDesasignacionAgente = createValidator(schema);
