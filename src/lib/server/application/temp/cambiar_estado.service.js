import { TicketRepository } from '$lib/repositories/ticket.repository';
import { Model } from '$lib/db/connection';
import { estados } from '$lib/utils/estados';
import { ErrorChangeEstadoForbidden } from './exceptions/ErrorChangeEstadoForbidden';
import { now } from '$lib/utils/now';
import { ErrorEstadosSinTexto } from './exceptions/ErrorEstadosSinTexto';
import { ComentarioRepository } from '$lib/repositories/comentario.repository';
import { esEstadoConTexto, obtenerTipoSegunEstado } from '$lib/utils/tiposComentarios';

const flujoEstados = {
  [estados.NUEVO]: [estados.CANCELADO],
  [estados.ASIGNADO]: [estados.PROCESO, estados.PENDIENTE, estados.CANCELADO],
  [estados.PROCESO]: [estados.PENDIENTE, estados.RESUELTO, estados.CANCELADO],
  [estados.PENDIENTE]: [estados.PROCESO, estados.CANCELADO],
  [estados.RESUELTO]: [estados.PROCESO, estados.CERRADO, estados.CANCELADO],
  [estados.CERRADO]: [],
  [estados.CANCELADO]: []
};

export class CambiarEstadoService {

  /**
   * @param {number} ticketId
   * @param {number} nuevoEstado
   * @param {string | null} texto
   * @param {import('$lib/transformers/types').User} usuario
   * @returns {Promise<void>}
   */
  async cambiarEstado (ticketId, nuevoEstado, texto, usuario) {
    if (esEstadoConTexto(nuevoEstado)
      && (texto === null || texto.trim().length === 0)) {
      throw new ErrorEstadosSinTexto;
    }
    await Model.transaction(async (trx) => {
      const ticketRepository = new TicketRepository;
      const comentarioRepository = new ComentarioRepository;
      ticketRepository.useTransaction(trx);
      comentarioRepository.useTransaction(trx);
      ticketRepository.withFetched('estado');
      const ticket = await ticketRepository.findById(ticketId);
      if(!flujoEstados[ticket.estado.id].includes(nuevoEstado)) {
        throw new ErrorChangeEstadoForbidden();
      }
      if (esEstadoConTexto(nuevoEstado)) {
        await comentarioRepository.add({
          ticket_id: ticketId,
          usuario_id: usuario.id,
          texto,
          tipo: obtenerTipoSegunEstado(nuevoEstado)
        });
      }
      let objAdd = {};
      switch (nuevoEstado) {
      case estados.CANCELADO:
        objAdd.fecha_cancelacion = now();
        break;
      case estados.CERRADO:
        objAdd.fecha_cierre = now();
        break;
      }
      await ticketRepository.path(ticketId, {
        estado_id: nuevoEstado,
        ...objAdd
      });
    });

  }

}
