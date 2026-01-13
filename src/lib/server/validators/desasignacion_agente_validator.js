
import Joi from 'joi';
import { createValidator } from '../../validators/validator';

/**
 * @import { Validator } from '../../validators/validator';
 */

const schema = Joi.object({
  ordenServicioId: Joi
    .number()
    .empty(['', null])
    .required()
    .messages({
      'any.required': 'El orden de servicio es requerido'
    }),
  agenteId: Joi
    .number()
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
