import { db } from '..';
import { logs } from '../schema';

/**
 *
 * @param {{ mensaje: string, stackTrace: string | null }} data
 * @return {Promise<number>}
 */
export async function registrarLog (data) {
  const [{ id }] = await db.insert(logs).values(data).$returningId();
  return id;
}
