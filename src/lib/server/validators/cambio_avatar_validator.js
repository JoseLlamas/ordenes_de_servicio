import Joi from 'joi';
import { createValidator } from '../../validators/validator';

/**
 * @import { Validator } from '../../validators/validator';
 */

const schema = Joi.object({
  name: Joi
    .string()
    .empty(['', null])
    .pattern(/\.(jpg|jpeg|png|webp)$/i)
    .required()
    .messages({
      'string.pattern.base': 'Extensión inválida',
      'any.required': 'Archivo requerido'
    }),
  size: Joi
    .number()
    .empty(['', null])
    .min(1000)
    .max(5 * 1000 * 1000)
    .required()
    .messages({
      'number.min': 'La imagen debe tener mínimo 1KB',
      'number.max': 'La imagen debe tener máxico 5MB',
      'any.required': 'El tamaño del archivo es requerido'
    }),
  type: Joi
    .string()
    .empty(['', null])
    .valid('image/jpeg', 'image/jpg', 'image/png', 'image/webp')
    .required()
    .messages({
      'any.only': 'Sólo se permiten imágenes JPEG, PNG y WebP',
      'any.required': 'El tipo de archivo es requerido'
    })
});

/**
 * @type {Validator<{ name: string, type: string, size: number }>}
 */
export const validateCambioAvatar = createValidator(schema);
