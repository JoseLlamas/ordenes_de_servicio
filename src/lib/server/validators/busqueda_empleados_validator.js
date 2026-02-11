import Joi from 'joi';
import { createValidator } from './validator';

/**
 * @import { Validator } from './validator';
 */

const schemaBusquedaEmpleados = Joi.object({
  nombre: Joi
    .string()
    .empty(['', null])
    .trim()
    .uppercase()
    .required()
    .messages({
      'any.required': 'El nombre es requerido'
    }),
  primerApellido: Joi
    .string()
    .empty(['', null])
    .trim()
    .uppercase()
    .required()
    .messages({
      'any.required': 'El primer apellido es requerido'
    }),
  segundoApellido: Joi
    .string()
    .empty(['', null])
    .trim()
    .uppercase()
});

/**
 * @type {Validator<{ nombre: string, primerApellido: string, segundoApellido?: string }>}
 */
export const validatorBusquedaEmpleados = createValidator(schemaBusquedaEmpleados);
