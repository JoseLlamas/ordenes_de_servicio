import { obtenerUsuarioLogin, crearSesion } from '$lib/server/db/queries';
import { compareHashPassword } from '$lib/server/utils';
import { Temporal } from 'temporal-polyfill/impl';
import { UnauthorizedException } from '$lib/server/exceptions';

/**
 *
 * @param {string} nombreUsuario
 * @param {string} password
 * @return {Promise<{ sesionId: string, maxAge: number }>}
 *
 * @throws {UnauthorizedException} Cuando las credenciales son inválidas o no existe el usuario
 */
export async function iniciarSesion (nombreUsuario, password) {
  const usuario = await obtenerUsuarioLogin(nombreUsuario);
  if (usuario == null || !usuario.activo) {
    throw new UnauthorizedException('Usuario no encontrado');
  }
  if (!await compareHashPassword(password, usuario.password)) {
    throw new UnauthorizedException('Usuario o contraseña incorrectos');
  }
  const sesionId = crypto.randomUUID();
  const seconds = 60 * 60 * 24;//24 horas
  const expiresAt = Temporal.Now.instant().add(Temporal.Duration.from({ seconds }));
  await crearSesion({
    id: sesionId,
    usuarioId: usuario.id,
    expiresAt: new Date(expiresAt.epochMilliseconds)
  });
  return { sesionId, maxAge: seconds };
}
