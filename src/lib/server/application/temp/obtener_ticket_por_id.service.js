import { TicketRepository } from '$lib/repositories/ticket.repository';
import { ErrorShowTicketforbidden } from './exceptions/ErrorShowTicketForbidden';
import { ComentarioRepository } from '$lib/repositories/comentario.repository';
import { ErrorTicketNotFound } from './exceptions/ticket_not_found.error';

export class ObtenerTicketPorIdService {

  /**
   *
   * @param {Number} ticketId
   * @param {import('$lib/transformers/types').User} usuario
   * @returns {Promise<import('$lib/transformers/types').Ticket>}
   */
  async obtener (ticketId, usuario) {

    const comentarioRepository = new ComentarioRepository;
    comentarioRepository
      .withJoined('[usuario.empleado]')
      .where({ ticket_id: ticketId });

    const ticketRepositorio = new TicketRepository;
    ticketRepositorio
      .withJoined('[areaAsignada, areaSolicitante, solicitante]')
      .withJoined('[prioridad, capturista.empleado, activos.tipo, estado, categoria]')
      .withFetched('[agentes.empleado, entrada]');

    const ticket = await ticketRepositorio.findById(ticketId);

    if (ticket === null) {
      throw new ErrorTicketNotFound;
    }

    ticket.comentarios = await comentarioRepository
      .findAll({ orderBy: 'fecha_comentario', direction: 'desc' });

    if (!(ticket.areaAsignada.id === usuario.empleado.area.id
      || ticket.areaSolicitante.id === usuario.empleado.area.id
      || ticket.capturista.id === usuario.id)
    ) {
      throw new ErrorShowTicketforbidden();
    }

    return ticket;
  }

}
