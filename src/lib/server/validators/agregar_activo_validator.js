import Joi from 'joi';
import { createValidator } from './validator';

/**
 * @import { Validator } from './validator';
 */

const schema = Joi.object({
  orderServicioId: Joi
    .number()
    .integer()
    .empty(['', null])
    .required(),
  numeroInventario: Joi
    .string()
    .empty(['', null])
    .trim()
    .max(50)
    .default(null)
    .messages({
      'string.max': 'El número de inventario sólo puede más de 50 carácteres'
    }),
  numeroSerie: Joi
    .string()
    .empty(['', null])
    .max(50)
    .trim()
    .when('numeroInventario', {
      is: Joi.valid(null),
      then: Joi.required(),
      otherwise: Joi.optional().default(null)
    })
    .messages({
      'any.required': 'El número de serie es requerido si no se ingresa el número de inventario',
      'string.max': 'El número de inventario no puede tener más de 50 carácteres'
    }),
  categoriaActivoId: Joi
    .number()
    .integer()
    .empty(['', null])
    .required()
    .messages({
      'any.required': 'La categoria es requerida'
    }),
  marca: Joi
    .string()
    .empty(['', null])
    .max(50)
    .trim()
    .default(null)
    .messages({
      'string.max': 'La marca no puede tener más de 50 carácteres'
    }),
  modelo: Joi
    .string()
    .empty(['', null])
    .max(50)
    .default(null)
    .messages({
      'string.max': 'El modelo no puede tener más de 50 carácteres'
    }),
  observaciones: Joi
    .string()
    .empty(['', null])
    .max(500)
    .uppercase()
    .default(null)
    .messages({
      'string.max': 'Las observaciones no pueden tener más de 500 carácteres'
    })
});

/**
 * @type {Validator<{
 *  ordenServicioId: number,
 *  numeroSerie: string | null,
 *  numeroInventario: string | null,
 *  categoriaActivoId: number,
 *  marca: string | null,
 *  modelo: string | null,
 *  observaciones: string | null
 * }>}
 */
export const validateRegistroActivo = createValidator(schema);
