import Joi from 'joi';
import { createValidator } from '$lib/server/validators/validator';

/**
 * @import { Validator } from '$lib/server/validators/validator';
 */

const schema = Joi.object({
  areaParaAsignarId: Joi
    .number()
    .integer()
    .empty(['', null])
    .required()
    .messages({
      'any.required': 'El area para asignar es requerido'
    }),
  empleadoSolicitanteId: Joi
    .number()
    .integer()
    .empty([null, ''])
    .required()
    .messages({
      'any.required': 'El empleado que solicita es requerido'
    }),
  telefonoSolicitante: Joi
    .string()
    .empty(['', null])
    .max(12)
    .pattern(/^\d{2}[- ]?\d{4}[- ]?\d{4}$/)
    .required()
    .messages({
      'any.required': 'El teléfono del solicitante es requerido',
      'max.string': 'El teléfono no puede tener más de 12 carácteres',
      'string.pattern.base': 'El teléfono debe tener el formato 00-0000-0000'
    }),
  categoriaOrdenId: Joi
    .number()
    .integer()
    .empty(['', null])
    .required()
    .messages({
      'any.required': 'La categoría de la orden es requerida'
    }),
  categoriaOrdenText: Joi
    .string()
    .empty(['', null])
    .required()
    .strip(),
  otroCategoriaOrden: Joi
    .string()
    .empty(['', null])
    .max(100)
    .trim()
    .uppercase()
    .when('categoriaOrdenText', {
      is: Joi.valid('OTRO'),
      then: Joi.required(),
      otherwise: Joi.forbidden()
    })
    .messages({
      'any.required': 'Si se escoge "OTRO" en categoría, se debe ingresar manualmente la categoría',
      'string.max': 'La otra categoría no puede tener más de 100 carácteres',
      'any.unknown': 'Sólo se puede ingregar otra categoría cuando se selecciona "OTRO"'
    }),
  prioridad: Joi
    .string()
    .empty(['', null])
    .valid('BAJA', 'MEDIA', 'ALTA', 'CRITICA')
    .required()
    .messages({
      'any.required': 'La prioridad es requerida'
    }),
  descripcion: Joi
    .string()
    .max(2000)
    .empty(['', null])
    .trim()
    .uppercase()
    .required()
    .messages({
      'any.required': 'La descripción es requerida',
      'string.max': 'La descripción no puede tener más de 2000 carácteres'
    }),
  ordenServicioRelacionadoId: Joi
    .number()
    .integer()
    .empty(['', null])
    .default(null)
    .optional(),
  tipoEntrada: Joi
    .string()
    .empty(['', null])
    .valid('PRESENCIAL', 'LLAMADA_TELEFONICA', 'OFICIO', 'INDICACION_SUPERIOR')
    .required()
    .messages({
      'any.required': 'Debe seleccionar como es que llega la solicitud para generar la orden'
    }),
  numeroOficio: Joi
    .string()
    .empty(['', null])
    .uppercase()
    .trim()
    .max(100)
    .when('tipoEntrada', {
      is: Joi.valid('OFICIO'),
      then: Joi.required(),
      otherwise: Joi.optional().default(null)
    })
    .messages({
      'any.required': 'Cuando la solicitud de la orden es por oficio, debe ingresar el número de ese oficio',
      'string.max': 'El número de oficio no puede tener más de 100 carácteres'
    })
});

/**
 * @type {Validator<{
 *  areaParaAsignarId: number
 *  empleadoSolicitanteId: number,
 *  telefonoSolicitante: string,
 *  categoriaOrdenId: number,
 *  otroCategoriaOrden: string | null,
 *  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA',
 *  descripcion: string,
 *  orderServicioRelacionadoId: number | null,
 *  tipoEntrada: 'PRESENCIAL' | 'LLAMADA_TELEFONICA' | 'OFICIO' | 'INDICACION_SUPERIOR',
 *  numeroOficio: string | null
 * }>}
 */
export const validateRegistroOrdenServicio = createValidator(schema);
