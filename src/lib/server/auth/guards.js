import { redirect } from '@sveltejs/kit';

/**
 * Assert que el usuario está autenticado
 * @param {App.Locals} locals
 * @param {string} [redirectTo='/login']
 * @returns {asserts locals is AuthenticatedLocals}
 */
export function assertAuthenticated (locals, redirectTo = '/login') {
  if (locals.usuario == null || locals.authorize == null) {
    redirect(303, redirectTo);
  }
}

/**
 * Assert que el usuario NO está autenticado
 * @param {App.Locals} locals
 * @param {string} [redirectTo='/dashboard']
 * @returns {asserts locals is UnauthenticatedLocals}
 */
export function assertUnauthenticated (locals, redirectTo = '/dashboard') {
  if (locals.usuario != null || locals.authorize != null) {
    redirect(303, redirectTo);
  }
}

/**
 * @typedef {Object} AuthenticatedLocals
 * @property {import('$lib/types').UsuarioDetalleDTO} usuario
 * @property {ReturnType<typeof import('.').createValidateAuthorization>} authorize
 */

/**
 * @typedef {Object} UnauthenticatedLocals
 * @property {undefined} usuario
 * @property {undefined} authorize
 */
