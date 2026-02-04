import { asignarAgentes, obtenerOrdenServicioParaAsignarAgente, obtenerUsuariosParaAsignarAgentes } from '$lib/server/db/queries';
import { db } from '$lib/server/db';
import { BusinessRuleException, ForbiddenException, BusinessRules } from '$lib/server/exceptions';

/**
 *
 * @param {NonNullable<App.Locals['usuario']>} usuario
 * @param {NonNullable<App.Locals['authorize']>} authorize
 */
export function createAsignarAgentesUseCase (usuario, authorize) {
  /**
   * @param {number} ordenServicioId
   * @param {number[]} agentesId
   */
  return async (ordenServicioId, agentesId) => {
    return db.transaction(async (tx) => {
      const ordenServicio = await obtenerOrdenServicioParaAsignarAgente(ordenServicioId, tx);
      if (ordenServicio == null) {
        throw new BusinessRuleException(
          'Orden no encontrada',
          BusinessRules.ORDEN_DE_SERVICIO_NO_ENCONTRADA
        );
      }
      if (authorize.cannot('assign', 'Orden', { areaId: ordenServicio.areaAsignadaId })) {
        throw new ForbiddenException('No puede asignar agentes a esta orden de servicio');
      }
      if (!['NUEVO', 'PROCESO', 'PENDIENTE'].includes(ordenServicio.estado)) {
        throw new BusinessRuleException(
          'Ya no se puede asignar (sólo en nuevo, proceso y pendiente)',
          BusinessRules.ASIGNACION_FUERA_DE_ESTADO
        );
      }
      const usuarios = await obtenerUsuariosParaAsignarAgentes(ordenServicio.id, agentesId, tx);
      const hayUsuarioSinPermiso = usuarios.some(usuario => {
        const areasAccesoId = usuario.areasAccesoId != null ? usuario.areasAccesoId : [];
        return !usuario.activo || usuario.rol !== 'Agente' || !areasAccesoId.some(areaId => areaId === ordenServicio.areaAsignadaId);
      });
      if (hayUsuarioSinPermiso) {
        throw new BusinessRuleException(
          'Hay un usuario que no es agente o no puede ser asignado a esta OS',
          BusinessRules.NO_SE_PUEDE_ASIGNAR_USUARIO_COMO_AGENTE
        );
      }
      if (ordenServicio.estado === 'PROCESO' && usuarios.some(usuario => usuario.estadoOcupado)) {
        throw new BusinessRuleException(
          'Mientras la OS esté en PROCESO, no se le puede agregar un agente que está asignado a otro OS en PROCESO',
          BusinessRules.AGENTE_OCUPADO_EN_OTRO_OS_EN_PROCESO
        );
      }
      await asignarAgentes(ordenServicio.id, agentesId, tx);
    });
  };
}
