import Joi from 'joi';

export const schemaTicketId = Joi.object({
  ticketId: Joi.number().empty('').integer().positive().required()
});
