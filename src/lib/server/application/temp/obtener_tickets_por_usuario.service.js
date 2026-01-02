import { TicketRepository } from '$lib/repositories/ticket.repository';

export class ObtenerTicketsPorUsuario {

  /**
   * @param {import('$lib/transformers/types').User} usuario
   * @returns {Promise<import('$lib/transformers/types').Ticket[]>}
   *
   */
  async obtener (usuario) {
    const ticketRepository = new TicketRepository;
    ticketRepository.withJoined('[estado, categoria, solicitante, capturista, areaAsignada, areaSolicitante, agentes, entrada]');
    const tickets = await ticketRepository
      .withPagination(1, 10)
      .findByUsuario(usuario, [{ column: 'fecha_creacion', order: 'desc' }]);
    return tickets;
  }

}
