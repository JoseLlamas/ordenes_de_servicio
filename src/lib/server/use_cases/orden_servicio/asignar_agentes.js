import { asignarAgentes } from '$lib/server/db/queries';
import * as schemas from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { BusinessRuleException, ForbiddenException, BusinessRules } from '$lib/server/exceptions';
import { eq, inArray } from 'drizzle-orm';

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
      const ordenServicio = await tx.query.ordenesServicio.findFirst({
        where: eq(schemas.ordenesServicio.id, ordenServicioId),
        columns: {
          areaAsignadaId: true,
          id: true,
          estado: true
        },
        with: {
          asignaciones: {
            columns: {
              agenteId: true
            }
          }
        }
      });
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
      const usuarios = await tx.query.usuarios.findMany({
        where: inArray(schemas.usuarios.id, agentesId),
        columns: {
          id: true,
          areasAccesoId: true,
          activo: true
        },
        with: {
          rol: {
            columns: {
              nombre: true
            }
          }
        }
      });
      const hayUsuarioSinPermiso = usuarios.some(usuario => {
        const areasAccesoId = usuario.areasAccesoId ? JSON.parse(usuario.areasAccesoId) : [];
        return !usuario.activo || usuario.rol.nombre !== 'Agente' || !areasAccesoId.some(areaId => areaId === ordenServicio.areaAsignadaId);
      });
      if (hayUsuarioSinPermiso) {
        throw new BusinessRuleException(
          'Hay un usuario que no es agente o no puede ser asignado a esta OS',
          BusinessRules.NO_SE_PUEDE_ASIGNAR_USUARIO_COMO_AGENTE
        );
      }
      await asignarAgentes(ordenServicio.id, agentesId, tx);
    });
  };
}
