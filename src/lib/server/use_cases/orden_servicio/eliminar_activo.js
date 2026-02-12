import { db } from '$lib/server/db';
import { obtenerOrdenServicioSimple, eliminarActivo } from '$lib/server/db/queries';
import { BusinessRuleException, BusinessRules, ForbiddenException } from '$lib/server/exceptions';

/**
 *
 * @param {NonNullable<App.Locals['usuario']>} usuario
 * @param {NonNullable<App.Locals['authorize']>} authorize
 */
export function createEliminarActivoUseCase (usuario, authorize) {
  /**
   * @param {{ ordenServicioId: number, activoId: number }} data
   */
  return (data) => {
    return db.transaction(async tx => {
      const ordenServicio = await obtenerOrdenServicioSimple(data.ordenServicioId, tx);
      if (ordenServicio == null) {
        throw new BusinessRuleException(
          'Orden de servicio no encontrada',
          BusinessRules.ORDEN_DE_SERVICIO_NO_ENCONTRADA
        );
      }
      if (authorize.cannot('update', 'Orden', { areaId: ordenServicio.areaAsignadaId })) {
        throw new ForbiddenException(
          'No puede realizar esta operación'
        );
      }
      if (!['NUEVO', 'PROCESO', 'PENDIENTE'].includes(ordenServicio.estado)) {
        throw new BusinessRuleException(
          'Eliminación de activo fuera de estado, sólo en "NUEVO", "PROCESO" y "PENDIENTE"',
          BusinessRules.ELIMINACION_ACTIVO_FUERA_DE_ESTADO
        );
      }
      await eliminarActivo(data, tx);
    });
  };
}
