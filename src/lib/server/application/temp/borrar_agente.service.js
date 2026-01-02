import { TicketRepository } from '$lib/repositories/ticket.repository';
import { Model } from '$lib/db/connection';
import { estados } from '$lib/utils/estados';
import { ErrorRemoverAgenteEstado } from './exceptions/ErrorRemoverAgenteEstado';
import { ErrorSinAgentes } from './exceptions/ErrorSinAgentes';

export class BorrarAgenteService {

  /**
   *
   * @param {number} ticketId
   * @param {number} agenteId
   * @param {import('$lib/transformers/types').User} usuario
   * @returns {Promise<void>}
   */
  async borrar (ticketId, agenteId, usuario) {
    await Model.transaction(async (trx) => {
      const repository = new TicketRepository;
      repository.useTransaction(trx);
      let ticket = await repository
        .withJoined('[estado]')
        .withFetched('[agentes]')
        .findById(ticketId);
      if (![estados.ASIGNADO, estados.PENDIENTE, estados.PROCESO].includes(ticket.estado.id)) {
        throw new ErrorRemoverAgenteEstado;
      } else {
        if ([estados.PENDIENTE, estados.PROCESO].includes(ticket.estado.id)) {
          if (ticket.agentes.length === 1) {
            throw new ErrorSinAgentes;
          }
        }
      }
      await repository.removeAgentes(ticket.id, agenteId);
      const cantidadAgentes = await repository.totalAgentes(ticket.id);
      if (cantidadAgentes === 0) {
        await repository.path(ticket.id, { estado_id: estados.NUEVO });
      }
    });
  }

}
