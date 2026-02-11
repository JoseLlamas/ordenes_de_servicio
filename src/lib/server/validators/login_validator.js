/**
 * @import { Validator } from './validator';
 */

import Joi from 'joi';
import { createValidator } from './validator';

const schemaLogin = Joi.object({
  username: Joi
    .string()
    .empty(['', null])
    .trim()
    .required()
    .messages({
      'any.required': 'El nombre de usuario es requerido'
    }),
  password: Joi
    .string()
    .empty(['', null])
    .trim()
    .required()
    .messages({
      'any.required': 'La contraseña es requerida'
    })
});

/**
 * @type {Validator<{ username: string, password: string }>}
 */
export const validateUsuarioLogin = createValidator(schemaLogin);
