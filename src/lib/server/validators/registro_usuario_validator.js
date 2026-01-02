import Joi from 'joi';
import { createValidator } from '../../validators/validator';

/**
 * @import { Validator } from '../../validators/validator';
 */

const schema = Joi.object({
  token: Joi
    .string()
    .empty(['', null])
    .trim()
    .length(10)
    .label('token')
    .required()
    .messages({
      'any.required': '{{#label}} es requerido',
      'string.length': 'el {{#label}} debe tener un tamaño de 10 carácteres'
    }),
  nombreUsuario: Joi
    .string()
    .empty(['', null])
    .min(6)
    .max(25)
    .trim()
    .required()
    .messages({
      'any.required': 'El nombre de usuario es requerido',
      'string.min': 'El usuario debe tener mínimo 6 carácteres',
      'string.max': 'El nombre de usuario debe tener máximo 25 carácteres'
    }),
  password: Joi
    .string()
    .empty(['', null])
    .min(8)
    .trim()
    .required()
    .messages({
      'any.required': 'La contraseña es requerida',
      'string.min': 'La contraseña debe tener mínimo 8 carácteres'
    }),
  confirmPassword: Joi
    .string()
    .empty(['', null])
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.required': 'La confirmación de la contraseña es requerida',
      'any.only': 'La contraseña no coincide'
    })
});

/**
 * @type {Validator<{
 *  token: string,
 *  nombreUsuario: string,
 *  password: string,
 *  confirmPassword: string
 * }>}
 */
export const validateRegistroUsuario = createValidator(schema);
