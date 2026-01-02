/**
 *
 * @param {string[]} palabras
 *
 * @returns {string}
 */
export function normalizePalabras (...palabras) {
  return palabras
    .filter(p => p && p.trim() !== '')
    .join(' ');
}
