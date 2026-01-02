import { TicketRepository } from '$lib/repositories/ticket.repository';
import { Model } from '$lib/db/connection';
import { ErrorAddAgente } from './exceptions/ErrorAddAgente';
import { estados } from '$lib/utils/estados';
import { ErrorAgenteYaRegistradoEnTicket } from './exceptions/ErrorAgenteYaRegistroEnTicket';

export class AgregarAgenteService {


  /**
   *
   * @param {number} ticketId
   * @param {number[]} agentesId
   * @returns {Promise<void>}
   */
  async agregar (ticketId, ...agentesId) {
    await Model.transaction(async (tsx) => {
      const ticketRepository = new TicketRepository;
      ticketRepository.useTransaction(tsx);
      let ticket = await ticketRepository
        .withJoined('[estado, agentes]')
        .findById(ticketId);
      if ([estados.RESUELTO, estados.CERRADO, estados.CANCELADO].includes(ticket.estado.id)) {
        throw new ErrorAddAgente;
      }
      if (agentesId.length === 0) {
        throw new Error('Hay que agregar Agentes');
      }
      const agentesRegistrados = ticket.agentes.map((agente) => agente.id);
      if (agentesId.length > 1) {
        for (let i = 0; agentesId.length; i++){;}
      } else {
        if (agentesRegistrados.includes(agentesId[0])) {
          throw new ErrorAgenteYaRegistradoEnTicket;
        }
      }
      await ticketRepository.addAgentes(ticketId, agentesId);
      if (ticket.estado.id === estados.NUEVO) {
        await ticketRepository.path(ticketId, {
          estado_id: estados.ASIGNADO
        });
      }
    });
  }

}
