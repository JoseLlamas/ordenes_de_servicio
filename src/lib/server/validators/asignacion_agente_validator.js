import Joi from 'joi';
import { createValidator } from '../../validators/validator';

/**
 * @import { Validator } from '../../validators/validator';
 */

const schema = Joi.object({
  orderServicioId: Joi
    .number()
    .empty(['', null])
    .required()
    .messages({
      'any.required': 'El orden de servicio es requerido'
    }),
  agentesId: Joi
    .array()
    .empty(['', null])
    .items(Joi.number())
    .min(1)
    .required()
    .messages({
      'array.min': 'Debe seleccionar aunque sea un agente'
    })
});

/**
 * @type {Validator<{ orderServicioId: number, agentesId: number[] }>}
 */
export const validateAsignacionAgentes = createValidator(schema);
