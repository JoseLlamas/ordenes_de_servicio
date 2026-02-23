import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

/**
 * @param {Buffer} buffer
 * @param {string} fileName
 *
 * @return {Promise<string>}
 */
export async function guardarAvatar (buffer, fileName) {
  const dirPath = path.join('static', 'avatares');
  await fs.mkdir(dirPath, { recursive: true });
  const fullPath = path.join(dirPath, fileName);
  await fs.writeFile(fullPath, buffer);
  return path.join('avatares', fileName);
}

/**
 *
 * @param {string} base64
 * @param {number} year
 * @param {string} filename
 */
export async function guardarFirma (base64, year, filename) {
  const firmasDir = path.join('static', 'firmas', year.toString());
  await fs.mkdir(firmasDir, { recursive: true });
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  const filepath = path.join(firmasDir, `${filename}`);
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
    await fs.access(path.join('static', relativePath));
    await fs.unlink(path.join('static', relativePath));
  } catch { /* empty */ }
}
