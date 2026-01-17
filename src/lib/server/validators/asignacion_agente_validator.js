import Joi from 'joi';
import { createValidator } from '../../validators/validator';

/**
 * @import { Validator } from '../../validators/validator';
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
  agentesId: Joi
    .array()
    .empty(['', null])
    .items(Joi.number().integer())
    .min(1)
    .required()
    .messages({
      'array.min': 'Debe seleccionar aunque sea un agente'
    })
});

/**
 * @type {Validator<{ ordenServicioId: number, agentesId: number[] }>}
 */
export const validateAsignacionAgentes = createValidator(schema);
