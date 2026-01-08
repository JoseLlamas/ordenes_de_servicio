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

});

/**
 * @type {Validator<{ orderServicioId: number, agentesId: number[] }>}
 */
export const validateAsignacionAgente = createValidator(schema);
