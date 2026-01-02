import Joi from 'joi';
import { createValidator } from '../../validators/validator';

/**
 * @import { Validator } from '../../validators/validator';
 */

const schemaBusquedaEmpleados = Joi.object({
  numeroEmpleado: Joi.number().empty(['', null]).optional(),

  nombre: Joi.string().empty(['', null]).trim().uppercase().when('numeroEmpleado', {
    is: Joi.exist(),
    then: Joi.forbidden(),
    otherwise: Joi.required()
  })
    .messages({
      'any.required': 'El nombre es requerido',
      'any.unknown': 'El nombre no es permitido si se ingresa el número de empleado'
    }),

  primerApellido: Joi.string().empty(['', null]).trim().uppercase().when('numeroEmpleado', {
    is: Joi.exist(),
    then: Joi.forbidden(),
    otherwise: Joi.required()
  })
    .messages({
      'any.required': 'El primer apellido es requerido',
      'any.unknown': 'El primer apellido no es permitido si se ingresa el número de empleado'
    }),

  segundoApellido: Joi.string().empty(['', null]).trim().uppercase().when('numeroEmpleado', {
    is: Joi.exist(),
    then: Joi.forbidden(),
    otherwise: Joi.optional()
  })
    .messages({
      'any.unknown': 'El segundo apellido no es permitido si se ingresa el número de empleado'
    })
})
  .xor('numeroEmpleado', 'nombre')
  .with('nombre', 'primerApellido');

/**
 * @type {Validator<{ numeroEmpleado: number } | { nombre: string, primerApellido: string, segundoApellido?: string }>}
 */
export const validatorBusquedaEmpleados = createValidator(schemaBusquedaEmpleados);
