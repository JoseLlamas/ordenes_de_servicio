import Joi from 'joi';
import { createValidator } from '../../validators/validator';

/**
 * @import { Validator } from '../../validators/validator';
 */

const schema = Joi.object({
  fecha: Joi
    .string()
    .pattern(/\d{4}-\d{2}-\d{2}/)
    .empty(['', null]),
  estado: Joi
    .string()
    .empty(['', null])
    .valid('NUEVO', 'PROCESO', 'PENDIENTE', 'RESUELTO', 'CERRADO', 'CANCELADO'),
  prioridad: Joi
    .string()
    .empty(['', null])
    .valid('BAJA', 'MEDIA', 'ALTA', 'CRITICA'),
  pagina: Joi
    .number()
    .integer()
    .min(1)
    .empty(['', null])
    .default(1),
  porPagina: Joi
    .number()
    .integer()
    .min(1)
    .max(20)
    .empty(['', null])
    .default(5)
});

/**
 * @type {Validator<{
 *  fecha?: string,
 *  estado?: 'NUEVO' | 'PROCESO' | 'PENDIENTE' | 'RESUELTO' | 'CERRADO' | 'CANCELADO',
 *  prioridad?: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA',
 *  pagina: number,
 *  porPagina: number
 * }>}
 */
export const validateFiltrosPaginadorOrdenesServicio = createValidator(schema);
