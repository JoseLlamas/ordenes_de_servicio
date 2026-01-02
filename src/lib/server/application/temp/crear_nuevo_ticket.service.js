import { FolioRepository } from '$lib/repositories/folio.repository';
import { TicketRepository } from '$lib/repositories/ticket.repository';
import { AreaRepository } from '$lib/repositories/area.repository';
import { Model } from '$lib/db/connection';
import { Temporal } from 'temporal-polyfill/impl';
import { generateTicketId } from '$lib/utils/generator_ticketid';

export class CrearNuevoTicketService {

  /**
   * @typedef {object} ActivoParam
   * @property {number} tipoId
   * @property {string} numero
   *
   * @typedef {object} DataNuevoTicket
   * @property {string} descripcion
   * @property {number} prioridadId
   * @property {number} categoriaId
   * @property {number} solicitanteId
   * @property {number} areaSolicitanteId
   * @property {number | null} ticketRelacionadoId
   * @property {number} areaAsignadaId
   * @property {number} capturistaId
   * @property {string} telefono
   * @property {number} entradaId
   * @property {string | null} numeroOficio
   * @property {ActivoParam[]} activos
   *
   * @param {DataNuevoTicket} data
   * @returns {Promise<number>}
   */
  async crear (data) {
    return await Model.transaction(async (tsx) => {
      const anio = Temporal.Now.plainDateISO().year;
      const areaRepository = (new AreaRepository).useTransaction(tsx);
      const folioRepository = (new FolioRepository).useTransaction(tsx);
      const ticketRepository = (new TicketRepository).useTransaction(tsx);

      const areaAsignada = await areaRepository
        .useTransaction(tsx)
        .findById(data.areaAsignadaId);
      const consecutivo = await folioRepository
        .useTransaction(tsx)
        .next(anio, areaAsignada.id);
      const ticketId = generateTicketId(anio, consecutivo, areaAsignada.identificadorFolio);
      await ticketRepository.add({
        id: ticketId,
        descripcion: data.descripcion,
        prioridad_id: data.prioridadId,
        categoria_id: data.categoriaId,
        solicitante_id: data.solicitanteId,
        area_solicitante_id: data.areaSolicitanteId,
        ticket_relacionado_id: data.ticketRelacionadoId,
        area_asignada_id: areaAsignada.id,
        capturista_id: data.capturistaId,
        telefono: data.telefono,
        estado_id: 1,
        entrada_id: data.entradaId,
        numero_oficio: data.numeroOficio
      }, data.activos.map((activo) => ({
        tipo_id: activo.tipoId,
        numero: activo.numero
      })));
      return ticketId;
    });
  }

}
