import { obtenerOrdenServicioDetallePorId } from '$lib/server/db/queries';
import { BusinessRuleException, ForbiddenException } from '$lib/server/exceptions';

/**
 *
 * @param {NonNullable<App.Locals['usuario']>} usuario
 * @param {NonNullable<App.Locals['authorize']>} authorize
 */
export function createObtenerDetalleOrdenServicioUseCase (usuario, authorize) {

  /**
   * @param {number} ordenServicioId
   */
  return async (ordenServicioId) => {
    const ordenServicio = await obtenerOrdenServicioDetallePorId(ordenServicioId);
    if (ordenServicio == null) {
      throw new BusinessRuleException('Orden de servicio no encontrada');
    }
    if (authorize.cannot('read', 'Orden', { areaId: ordenServicio.areaAsignada.id })) {
      throw new ForbiddenException('No tiene permisos para ver esta orden de servicio');
    }
    if (usuario.rol.nombre === 'Agente' && !ordenServicio.agentes.some(agente => agente.id === usuario.id)) {
      throw new ForbiddenException('No es agente de esta orden de servicio');
    }
    return ordenServicio;
  };
}
