import { db } from '$lib/server/db';
import { obtenerOrdenServicioSimple, pathOrdenServicio } from '$lib/server/db/queries';
import { BusinessRuleException, BusinessRules, ForbiddenException } from '$lib/server/exceptions';

/**
 *
 * @param {NonNullable<App.Locals['usuario']>} usuario
 * @param {NonNullable<App.Locals['authorize']>} authorize
 */
export function createModificarOrdenServicioUseCase (usuario, authorize) {
  /**
   * @param {number} ordenServicioId
   * @param {{
   *  telefonoSolicitante: string,
   *  categoriaOrdenId: number,
   *  otroCategoriaOrden: string | null,
   *  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA',
   *  descripcion: string,
   *  tipoEntrada: 'PRESENCIAL' | 'LLAMADA_TELEFONICA' | 'OFICIO' | 'INDICACION_SUPERIOR',
   *  numeroOficio: string | null
   * }} data
   */
  return (ordenServicioId, data) => {
    return db.transaction(async tx => {
      const ordenServicio = await obtenerOrdenServicioSimple(ordenServicioId, tx);
      if (ordenServicio == null) {
        throw new BusinessRuleException(
          'Orden de servicio no encontrada',
          BusinessRules.ORDEN_DE_SERVICIO_NO_ENCONTRADA
        );
      }
      if (authorize.cannot('update', 'Orden', { areaId: ordenServicio.areaAsignadaId })) {
        throw new ForbiddenException('No puede realizar esta operación');
      }
      if (!['NUEVO', 'PROCESO', 'PENDIENTE'].includes(ordenServicio.estado)) {
        throw new BusinessRuleException(
          'Sólo se puede modificar la orden en "NUEVO", "PROCESO" Y "PENDIENTE"',
          BusinessRules.MODIFICACION_DE_ORDEN_FUERA_DE_ESTADO
        );
      }
      await pathOrdenServicio(ordenServicio.id, data, tx);
    });
  };
}
