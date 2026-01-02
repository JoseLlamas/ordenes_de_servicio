import { estados } from '$lib/utils/estados';
import Joi from 'joi';

export const schemaCambiarEstado = Joi.object({
  ticketId: Joi.number().required(),
  nuevoEstadoId: Joi.number().required(),
  texto: Joi.string().empty(['', null]).trim().max(1000).uppercase().when('nuevoEstadoId', {
    is: Joi.valid(estados.CANCELADO, estados.CERRADO, estados.PENDIENTE, estados.RESUELTO),
    then: Joi.required(),
    otherwise: Joi.forbidden().default(null)
  })
});
