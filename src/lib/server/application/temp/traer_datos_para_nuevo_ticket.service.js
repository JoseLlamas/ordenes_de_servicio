/**
 *  @import { TicketRelacionado, DataInicialRegistroTicket } from './types/traer_datos_para_nuevo_ticket.service.d';
 */

import { DireccionGeneralRepository } from '$lib/repositories/direccion_general.repository';
import { AreaRepository } from '$lib/repositories/area.repository';
import { PrioridadRepository } from '$lib/repositories/prioridad.repository';
import { TipoRepository } from '$lib/repositories/tipo.repository';
import { TicketRepository } from '$lib/repositories/ticket.repository';
import { estados } from '$lib/utils/estados';
import { EstadoTicketRelacionadoError } from './exceptions/estado_ticket_relacionado.error';
import { TicketNotFoundError } from './exceptions/ticket_not_found.error';
import { EntradaRepository } from '$lib/repositories/entrada.repository';

export class TraerDatosParaNuevoTicketService {

  /**
   *
   * @param {number | null} ticketRelacionadoId
   * @returns
   */
  async traerDatos (ticketRelacionadoId) {
    let ticketRelacionado = null;
    if (ticketRelacionadoId !== null) {
      /**
       * @type {TicketRelacionado}
       */
      ticketRelacionado = /** @type {any} */ (await (new TicketRepository)
        .withJoined('[estado]')
        .findById(ticketRelacionadoId));
      if (ticketRelacionado === null) {
        throw new TicketNotFoundError;
      }
      if (![estados.CANCELADO, estados.CERRADO].includes(ticketRelacionado.estado.id)) {
        throw new EstadoTicketRelacionadoError;
      }
    }
    const areasAsignar = await (new AreaRepository)
      .where({ 'areas.activo': true })
      .withFetched('[categorias]')
      .findAreasConCategorias();
    const direccionesGenerales = await (new DireccionGeneralRepository).findAll();
    const prioridades = await (new PrioridadRepository).findAll();
    const tipos = await (new TipoRepository).findAll();
    const entradas = await (new EntradaRepository).findAll();
    /**
     * @type {DataInicialRegistroTicket}
     */
    const dataInicial = {
      areasAsignar,
      direccionesGenerales,
      prioridades,
      tipos,
      entradas
    };
    if (ticketRelacionado != null) {
      dataInicial.ticketRelacionalId = ticketRelacionado.id;
    }
    return dataInicial;
  }

}
