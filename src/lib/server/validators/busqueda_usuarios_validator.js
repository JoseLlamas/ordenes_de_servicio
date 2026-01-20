/**
 * @import { Validator } from '../../validators/validator';
 */

import Joi from 'joi';
import { createValidator } from '../../validators/validator';

const schema = Joi.object({
  areaId: Joi.number().integer().empty(['', null]).required().messages({
    'any.required': 'El area es requerida'
  }),
  soloActivos: Joi.boolean().empty(['', null]).truthy('on')
});

/**
 * @type {Validator<{ areaId: number, soloActivos?: boolean }>}
 */
export const validateBuscarUsuarios = createValidator(schema);
