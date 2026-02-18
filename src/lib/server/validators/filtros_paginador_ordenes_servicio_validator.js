import Joi from 'joi';
import { createValidator } from './validator';

/**
 * @import { Validator } from './validator';
 */

const schema = Joi.object({
  fecha: Joi
    .string()
    .pattern(/\d{4}-\d{2}-\d{2}/)
    .empty(['', null])
    .default(null),
  estado: Joi
    .string()
    .empty(['', null])
    .valid('NUEVO', 'PROCESO', 'PENDIENTE', 'RESUELTO', 'CERRADO', 'CANCELADO')
    .default(null),
  prioridad: Joi
    .string()
    .empty(['', null])
    .valid('BAJA', 'MEDIA', 'ALTA', 'CRITICA')
    .default(null),
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
 *  fecha: string | null,
 *  estado: 'NUEVO' | 'PROCESO' | 'PENDIENTE' | 'RESUELTO' | 'CERRADO' | 'CANCELADO' | null,
 *  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA' | null,
 *  pagina: number,
 *  porPagina: number
 * }>}
 */
export const validateFiltrosPaginadorOrdenesServicio = createValidator(schema);
