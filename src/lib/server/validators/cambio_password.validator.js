import Joi from 'joi';
import { createValidator } from './validator';

/**
 * @import {Validator} from './validator';
 */

const schema = Joi.object({
  passwordActual: Joi.string().empty(['', null]).required().messages({
    'any.required': 'La contraseña que tiene actualmente es requerido'
  }),
  passwordNuevo: Joi.string().empty(['', null]).trim().min(8).required().messages({
    'any.required': 'El password es requerido',
    'string.min': 'Mínimo de 8 carácteres'
  }),
  passwordNuevoConfirmacion: Joi.string().empty(['', null]).valid(Joi.ref('passwordNuevo')).messages({
    'any.only': 'Las contraseñas no coinciden',
    'any.required': 'La confirmación del password es requerida'
  }).required()
});

/**
 * @type {Validator<{passwordActual: string, passwordNuevo: string, passwordNuevoConfirmacion: string}>}
 */
export const validateCambioPassword = createValidator(schema);
