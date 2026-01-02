import { obtenerUsuarioDetalle } from '$lib/server/db/queries';
import { NotFoundException, BusinessRuleException, ForbiddenException, BusinessRules } from '$lib/server/exceptions';

/**
 * @param {NonNullable<App.Locals['usuario']>} usuario
 * @param {NonNullable<App.Locals['authorize']>} authorize
 */
export function createObtenerUsuarioUseCase (usuario, authorize) {

  /**
   * @param {number} id
   * @return {Promise<import('$lib/types').UsuarioDetalleDTO>}
   */
  return async (id) => {
    if (usuario.id === id) {
      throw new BusinessRuleException('Para ver el detalle del usuario, para eso está el perfil', BusinessRules.USUARIO_NO_CONSULTAR_DETALLE_USUARIO_LOGUEADO);
    }
    const usuarioDetalle = await obtenerUsuarioDetalle(id);
    if (usuarioDetalle == null) {
      throw new NotFoundException('Usuario');
    }
    if (authorize.cannot('read', 'Usuario', { areaId: usuarioDetalle.empleado.area.id })) {
      throw new ForbiddenException('Sin permisos para gestionar este usuario');
    }
    return usuarioDetalle;
  };
}
