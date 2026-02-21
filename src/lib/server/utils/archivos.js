import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const UPLOADS_DIRECTORY = './uploads';

/**
 * @param {Buffer} buffer
 * @param {string} fileName
 * @param {string} subdirectory
 *
 * @return {Promise<string>}
 */
export async function guardarArchivo (buffer, fileName, subdirectory) {
  const dirPath = path.join(UPLOADS_DIRECTORY, subdirectory);
  await fs.mkdir(dirPath, { recursive: true });
  const fullPath = path.join(dirPath, fileName);
  await fs.writeFile(fullPath, buffer);
  return path.join(subdirectory, fileName);
}

/**
 *
 * @param {string} base64
 * @param {'agente' | 'solicitante'} tipo
 * @param {number} ordenServicioId
 * @param {number} year
 */
export async function guardarFirma (base64, tipo, ordenServicioId, year) {
  const firmasDir = path.join('static', 'firmas', year.toString());
  await fs.mkdir(firmasDir, { recursive: true });
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  const filename = `${ordenServicioId}-${tipo}.png`;
  const filepath = path.join(firmasDir, filename);
  await fs.writeFile(filepath, buffer);
  return path.join('firmas', year.toString(), filename);
}

/**
 *
 * @param {File} file
 * @return {Promise<Buffer>}
 */
export async function procesarAvatar (file) {
  const buffer = await sharp(Buffer.from(await file.arrayBuffer()))
    .resize(400, 400, {
      fit: 'cover',
      position: 'center'
    })
    .toFormat('webp', { quality: 90 })
    .toBuffer();
  return buffer;
}

/**
 *
 * @param {string} relativePath
 */
export async function borrarArchivo (relativePath) {
  try {
    await fs.access(path.join(UPLOADS_DIRECTORY, relativePath));
    await fs.unlink(path.join(UPLOADS_DIRECTORY, relativePath));
  } catch { /* empty */ }
}
