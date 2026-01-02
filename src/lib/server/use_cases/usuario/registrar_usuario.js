import { db } from '$lib/server/db';
import { obtenerInvitacion, tieneUsuario, patchInvitacion, existeNombreUsuario, registrarUsuario as registrarUsuarioDB, obtenerAreaEmpleado } from '$lib/server/db/queries';
import { BusinessRuleException, BusinessRules } from '$lib/server/exceptions';
import { generateHashPassword } from '$lib/server/utils';

/**
 *
 * @param {{
 *  token: string,
 *  nombreUsuario: string,
 *  password: string
 * }} data
 */
export async function registrarUsuario (data) {
  await db.transaction(async tx => {
    const invitacion = await obtenerInvitacion(data.token, tx);
    if (invitacion === null) {
      throw new BusinessRuleException('Token no registrado', BusinessRules.TOKEN_NO_REGISTRADO_PARA_REGISTRO_USUARIO);
    }
    if (invitacion.usado) {
      throw new BusinessRuleException('Token ya usado', BusinessRules.TOKEN_YA_USADA_PARA_REGISTRO_USUARIO);
    }
    if (await tieneUsuario(invitacion.empleadoId, tx)) {
      throw new BusinessRuleException('Este empleado ya tiene usuario', BusinessRules.EMPLEADO_YA_TIENE_USUARIO_O_INVITACION);
    }
    if (await existeNombreUsuario(data.nombreUsuario, tx)) {
      throw new BusinessRuleException('Nombre de usuario ya ocupado', BusinessRules.NOMBRE_USUARIO_NO_DISPONIBLE);
    }
    await patchInvitacion({ usado: true }, invitacion.id, tx);
    const area = await obtenerAreaEmpleado(invitacion.empleadoId, tx);
    if (area === null) {
      throw new BusinessRuleException('El empleado no tiene area');
    }
    return await registrarUsuarioDB({
      nombreUsuario: data.nombreUsuario,
      password: await generateHashPassword(data.password),
      activo: true,
      empleadoId: invitacion.empleadoId,
      areaId: area.id,
      rolId: invitacion.rolId,
      avatar: null,
      areasAccesoId: invitacion.areasAccesoId
    }, tx);
  });
}
