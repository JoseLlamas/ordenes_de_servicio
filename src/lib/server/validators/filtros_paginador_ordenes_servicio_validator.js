import Joi from 'joi';
import { createValidator } from '../../validators/validator';

/**
 * @import { Validator } from '../../validators/validator';
 */

const schema = Joi.object({
  fecha: Joi
    .string()
    .empty(['', null]),
  estado: Joi
    .string()
    .empty(['', null])
    .valid('NUEVO', 'PROCESO', 'PENDIENTE', 'RESUELTO', 'CERRADO', 'CANCELADO'),
  prioridad: Joi
    .string()
    .empty(['', null])
    .valid('BAJA', 'MEDIA', 'ALTA', 'CRITICA'),
  areaAsignadaId: Joi
    .number()
    .empty(['', null]),
  pagina: Joi
    .number()
    .empty(['', null])
    .default(1),
  porPagina: Joi
    .number()
    .empty(['', null])
    .default(10)
});

/**
 * @type {Validator<{
 *  fecha?: string,
 *  estado?: 'NUEVO' | 'PROCESO' | 'PENDIENTE' | 'RESUELTO' | 'CERRADO' | 'CANCELADO',
 *  prioridad?: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA',
 *  areaAsignadaId?: number,
 *  pagina: number,
 *  porPagina: number
 * }>}
 */
export const validateFiltrosPaginadorOrdenesServicio = createValidator(schema);
