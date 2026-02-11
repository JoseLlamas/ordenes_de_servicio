import { obtenerOrdenServicioParaAgregarActivo, registrarActivos } from '$lib/server/db/queries';
import { db } from '$lib/server/db';
import { BusinessRuleException, BusinessRules, ForbiddenException } from '$lib/server/exceptions';

/**
 *
 * @param {NonNullable<App.Locals['usuario']>} usuario
 * @param {NonNullable<App.Locals['authorize']>} authorize
 */
export function createAgregarActivoUseCase (usuario, authorize) {
  /**
   * @param {number} ordenServicioId
   * @param {Extract<Awaited<ReturnType<import('$lib/validators/registro_activo_validator')['validateRegistroActivo']>>, { values: any }>['values']} data
   */
  return async (ordenServicioId, data) => {
    return db.transaction(async tx => {
      const ordenServicio = await obtenerOrdenServicioParaAgregarActivo(ordenServicioId, tx);
      if (ordenServicio == null) {
        throw new BusinessRuleException(
          'Orden no encontrada',
          BusinessRules.ORDEN_DE_SERVICIO_NO_ENCONTRADA
        );
      }
      if (authorize.cannot('update', 'Orden', { areaId: ordenServicio.areaAsignadaId })) {
        throw new ForbiddenException('No tiene permisos para ejecutar esta acción');
      }
      if (!['NUEVO', 'PROCESO', 'PENDIENTE'].includes(ordenServicio.estado)) {
        throw new BusinessRuleException(
          'Sólo puedo agregar un activo en estado "NUEVO", "PROCESO", "PENDIENTE"',
          BusinessRules.AGREGACION_ACTIVO_FUERA_DE_ESTADO
        );
      }
      await registrarActivos([{
        ordenServicioId,
        ...data
      }], tx);
    });
  };
}
