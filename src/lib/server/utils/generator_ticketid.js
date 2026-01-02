/**
 *
 * @param {number} anio
 * @param {number} consecutivo
 * @param {number} identificadorFolio
 * @returns
 */
export function generateTicketId (anio, consecutivo, identificadorFolio) {
  const ticketId = Number(`${anio.toString().substring(2)}${String(consecutivo).padStart(5, '0')}${String(identificadorFolio).padStart(2, '0')}`);
  return ticketId;
}
