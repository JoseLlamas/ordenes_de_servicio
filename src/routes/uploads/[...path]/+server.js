import { readFile } from 'fs/promises';
import { join } from 'path';
import { error } from '@sveltejs/kit';

const UPLOADS_DIR = 'uploads';

export async function GET ({ params }) {
  const filepath = join(UPLOADS_DIR, params.path);

  try {
    const file = await readFile(filepath);

    const ext = params.path.split('.').pop();
    const contentType = {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      gif: 'image/gif',
      webp: 'image/webp'
    }[ext] || 'application/octet-stream';

    return new Response(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (err) {
    throw error(404, 'Archivo no encontrado');
  }
}
