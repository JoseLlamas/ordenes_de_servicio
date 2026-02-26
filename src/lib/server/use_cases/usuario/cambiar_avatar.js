import { db } from '$lib/server/db';
import { guardarAvatar, procesarAvatar, borrarArchivo } from '$lib/server/utils';
import { patchUsuario } from '$lib/server/db/queries';

/**
 * @param {NonNullable<App.Locals['usuario']>} usuario
 */
export function createCambiarAvatarUseCase (usuario) {
  /**
   * @param {File} file
   */
  return (file) => {
    return db.transaction(async (tx) => {
      const avatarAnterior = usuario.avatar;
      const buffer = await procesarAvatar(file);
      const avatarNuevo = `${crypto.randomUUID()}.webp`;
      const relativePath = await guardarAvatar(buffer, avatarNuevo);
      await patchUsuario({ avatar: relativePath }, usuario.id, tx);
      if (avatarAnterior != null) {
        await borrarArchivo(avatarAnterior);
      }
    });
  };
}
