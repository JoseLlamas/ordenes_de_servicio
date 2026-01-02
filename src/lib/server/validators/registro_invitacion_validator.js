/**
 * @import { Validator } from '../../validators/validator';
 */

import Joi from 'joi';
import { createValidator } from '../../validators/validator';

const schemaLogin = Joi.object({
  empleadoId: Joi
    .number()
    .empty(['', null])
    .required()
    .messages({
      'any.required': 'El empleado es requerido'
    }),
  rolId: Joi
    .number()
    .empty(['', null])
    .required()
    .messages({
      'any.required': 'El rol es requerido'
    }),
  areasAccesoId: Joi
    .array()
    .empty(['', null])
    .items(Joi.number().empty(['', null]))
    .messages({
      'array.max': 'Cuando se selecciona el rol de administrador, no debe agregar ninguna area de alcalce',
      'any.required': 'El alcalce de rol es requerido'
    })
});

/**
 * @type {Validator<{ empleadoId: number, rolId: number, areasAccesoId: number[] }>}
 */
export const validateRegistroInvitacion = createValidator(schemaLogin);
