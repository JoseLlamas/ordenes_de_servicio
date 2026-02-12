import { desasignarAgente, obtenerOrdenServicioParaDesasignacion } from '$lib/server/db/queries';
import { db } from '$lib/server/db';
import { BusinessRuleException, ForbiddenException, BusinessRules } from '$lib/server/exceptions';

/**
 *
 * @param {NonNullable<App.Locals['usuario']>} usuario
 * @param {NonNullable<App.Locals['authorize']>} authorize
 */
export function createDesasignarAgenteUseCase (usuario, authorize) {
  /**
   * @param {number} ordenServicioId
   * @param {number} agenteId
   */
  return (ordenServicioId, agenteId) => {
    return db.transaction(async (tx) => {
      const ordenServicio = await obtenerOrdenServicioParaDesasignacion(ordenServicioId, tx);
      if (ordenServicio == null) {
        throw new BusinessRuleException(
          'Orden no encontrada',
          BusinessRules.ORDEN_DE_SERVICIO_NO_ENCONTRADA
        );
      }
      if (authorize.cannot('assign', 'Orden', { areaId: ordenServicio.areaAsignadaId })) {
        throw new ForbiddenException('No puede desasignar agentes');
      }
      if (!['NUEVO', 'PROCESO', 'PENDIENTE'].includes(ordenServicio.estado)) {
        throw new BusinessRuleException(
          'Ya no se puede desasignar (sólo en nuevo, proceso y pendiente)',
          BusinessRules.DESASIGNACION_FUERA_DE_ESTADO
        );
      }
      if (ordenServicio.estado === 'PROCESO' && ordenServicio.agentesId.length === 1) {
        throw new BusinessRuleException(
          'Mientas este en proceso, no puede quitar a todos los agentes',
          BusinessRules.SIN_AGENTES_EN_ORDEN_SERVICIO
        );
      }
      await desasignarAgente(ordenServicio.id, agenteId, tx);
    });
  };
}
