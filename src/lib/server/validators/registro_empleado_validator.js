import Joi from 'joi';
import { createValidator } from '../../validators/validator';

/**
 * @import {Validator} from '../../validators/validator';
 */

const schemaRegistroEmpleado = Joi.object({
  direccionGeneralId: Joi
    .number()
    .integer()
    .empty(['', null])
    .required()
    .messages({
      'any.required': 'La direccion general es requerida'
    }),
  areaId: Joi
    .number()
    .integer()
    .empty(['', null])
    .required()
    .messages({
      'any.required': 'El area es requerida'
    }),
  nombre: Joi
    .string()
    .empty(['', null])
    .max(100)
    .trim()
    .uppercase()
    .required()
    .messages({
      'any.required': 'El nombre es requerido',
      'string.max': 'Un máximo de 100 caracteres'
    }),
  primerApellido: Joi
    .string()
    .empty(['', null])
    .max(100)
    .trim()
    .uppercase()
    .required()
    .messages({
      'any.required': 'El primer apellido es requerido',
      'string.max': 'Un máximo de 100 caracteres'
    }),
  segundoApellido: Joi
    .string()
    .empty(['', null])
    .max(100)
    .trim()
    .uppercase()
    .default(null)
    .messages({
      'string.max': 'Un máximo de 100 carácteres'
    }),
  cargo: Joi
    .string()
    .empty(['', null])
    .trim()
    .uppercase()
    .max(100)
    .default(null)
    .messages({
      'string.max': 'Un máximo de 100 caracteres'
    })
});

/**
 * @type {Validator<{
 *  nombre: string,
 *  primerApellido: string,
 *  segundoApellido: string | null,
 *  cargo: string | null,
 *  direccionGeneralId: number,
 *  areaId: number
 * }>}
 */
export const validateRegistroEmpleado = createValidator(schemaRegistroEmpleado);
