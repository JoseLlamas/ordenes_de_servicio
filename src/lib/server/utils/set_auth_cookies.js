/**
 *
 * @param {import('@sveltejs/kit').Cookies} cookies
 * @param {string} sesionId
 * @param {number} maxAge
 *
 * @returns {void}
 */
export function setAuthCookies (cookies, sesionId, maxAge) {
  cookies.set(getAuthTokenName(), sesionId, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge
  });
}

/**
 * @param {import('@sveltejs/kit').Cookies} cookies
 * @returns {string | null}
 */
export function getAuthCookies (cookies) {
  return cookies.get(getAuthTokenName()) ?? null;
}

/**
 *
 * @param {import('@sveltejs/kit').Cookies} cookies
 * @returns {void}
 */
export function deleteAuthCookies (cookies) {
  cookies.delete(getAuthTokenName(), {
    path: '/',
    secure: false
  });
}

/**
 *
 * @returns {string}
 */
function getAuthTokenName () {
  return 'ORDENES_DE_SERVICIO_AUTH_TOKEN';
}
