import { db } from '$lib/server/db';
import { guardarArchivo, procesarAvatar, borrarArchivo } from '$lib/server/utils';
import { patchUsuario } from '$lib/server/db/queries';

/**
 * @param {NonNullable<App.Locals['usuario']>} usuario
 */
export function createCambiarAvatarUseCase (usuario) {
  /**
   * @param {File} file
   */
  return async (file) => {
    await db.transaction(async (tx) => {
      const avatarAnterios = usuario.avatar;
      const buffer = await procesarAvatar(file);
      const avatarNuevo = `${crypto.randomUUID()}.webp`;
      const relativePath = await guardarArchivo(buffer, avatarNuevo, 'avatares');
      await patchUsuario({ avatar: relativePath }, usuario.id, tx);
      if (avatarAnterios != null) {
        await borrarArchivo(avatarAnterios);
      }
    });
  };
}
