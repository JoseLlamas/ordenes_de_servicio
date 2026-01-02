import { sequence } from '@sveltejs/kit/hooks';
import { getAuthCookies, deleteAuthCookies } from '$lib/server/utils';
import { validarSesion } from '$lib/server/use_cases/auth';
import { createValidateAuthorization, defineAbilitiesFor } from '$lib/server/auth';
import fs from 'node:fs/promises';
import path from 'node:path';
import { registrarLog } from '$lib/server/db/queries';

/**
 * @type {import('@sveltejs/kit').Handle}
 */
async function handleUploadsFiles ({ event, resolve }) {
  if (event.url.pathname.startsWith('/uploads/')) {
    const filePath = path.join('./uploads', event.url.pathname.replace('/uploads/', ''));
    try {
      const file = await fs.readFile(filePath);
      const ext = path.extname(filePath);
      const contentType = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.gif': 'image/gif'
      }[ext] ?? 'application/octet-stream';
      return new Response(file, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000'
        }
      });
    } catch {
      return new Response('Not Found', { status: 404 });
    }
  }
  return resolve(event);
}

/**
 * @type {import('@sveltejs/kit').Handle}
 */
async function handleAuth ({ event, resolve }) {
  const sessionId = getAuthCookies(event.cookies);
  if (sessionId != null) {
    try {
      const usuario = await validarSesion(sessionId);
      if (usuario !== null && usuario.activo) {
        const ability = defineAbilitiesFor(usuario);
        event.locals.usuario = usuario;
        event.locals.authorize = createValidateAuthorization(usuario, ability);
      } else {
        deleteAuthCookies(event.cookies);
      }
    } catch {
      deleteAuthCookies(event.cookies);
    }
  }
  return resolve(event);
}

export const handle = sequence(handleUploadsFiles, handleAuth);

/**
 * @type {import('@sveltejs/kit').HandleServerError}
 */
export async function handleError ({ error }) {
  let message = '';
  if (error instanceof Error) {
    try {
      await registrarLog({
        mensaje: error.message,
        stackTrace: error.stack ?? null
      });
      console.error(error);
    } catch (exc) {
      console.error(exc);
    }
  }
  return {
    message
  };
}
