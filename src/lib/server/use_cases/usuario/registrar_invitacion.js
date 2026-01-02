import { nanoid } from 'nanoid';
import { db } from '$lib/server/db';
import { registrarInvitacion, obtenerEmpleadoPorId, obtenerRolPorId, tieneInvitacion, tieneUsuario } from '$lib/server/db/queries';
import { BusinessRuleException, BusinessRules, ForbiddenException } from '$lib/server/exceptions';

/**
 * @param { NonNullable<App.Locals['usuario']> } usuario
 * @param { NonNullable<App.Locals['authorize']> } authorize
 */
export function createRegistrarInvitacionUseCase (usuario, authorize) {
  /**
   * @param {{ empleadoId: number, rolId: number, areasAccesoId: number[] }} values
   */
  return async (values) => {
    const token = nanoid(10);
    return db.transaction(async tx => {
      const empleado = await obtenerEmpleadoPorId(values.empleadoId, tx);
      if (empleado == null || !empleado.activo) {
        throw new BusinessRuleException('Empleado no encontrado', BusinessRules.EMPLEADO_NO_ENCONTRADO_EN_INVITACION);
      }
      if (authorize.cannot('create', 'Invitacion', { areaId: empleado.area.id })) {
        throw new ForbiddenException('No puede realizar esta acción o intenta invitar a un usuario fuera de su alcance');
      }
      const rol = await obtenerRolPorId(values.rolId, tx);
      if (rol == null) {
        throw new BusinessRuleException('Rol no encontrado', BusinessRules.ROL_NO_ENCONTRADO_EN_INVITACION);
      }
      if (rol.nombre === 'Administrador' && usuario.rol.nombre !== 'Administrador') {
        throw new BusinessRuleException('Sólo el administrador puede registrar una invitación para administrador', BusinessRules.SOLO_ADMINISTRADOR_PUEDE_REGISTRAR_OTRO_ADMINISTRADOR);
      }
      if (await tieneInvitacion(empleado.id, tx)) {
        throw new BusinessRuleException('Este empleado ya tiene invitación', BusinessRules.EMPLEADO_YA_TIENE_USUARIO_O_INVITACION);
      }
      if (await tieneUsuario(empleado.id, tx)) {
        throw new BusinessRuleException('Este empleado ya tiene usuario', BusinessRules.EMPLEADO_YA_TIENE_USUARIO_O_INVITACION);
      }
      let areasAccesoId = values.areasAccesoId;
      if (rol.nombre === 'Administrador') {
        areasAccesoId = [];
      } else {
        if (areasAccesoId.findIndex((areaAccesoId) => areaAccesoId === empleado.area.id) === -1) {
          areasAccesoId.push(empleado.area.id);
        }
        if (usuario.areasAcceso !== null) {
          for (let i = 0; i < areasAccesoId.length; i++) {
            if (authorize.cannot('create', 'Invitacion', { areaId: areasAccesoId[i] })) {
              throw new BusinessRuleException('No puede agregar areas fuera de sus alcances', BusinessRules.NO_AGREGAR_AREAS_FUERA_DE_ALCANCE);
            }
          }
        }
      }
      await registrarInvitacion({
        empleadoId: empleado.id,
        rolId: rol.id,
        areasAccesoId: areasAccesoId.length > 0 ? areasAccesoId.toSorted() : null,
        token,
        invitadorId: usuario.id,
        usado: false
      }, tx);
      return token;
    });
  };
}
