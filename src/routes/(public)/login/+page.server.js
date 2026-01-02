import { fail, redirect } from '@sveltejs/kit';
import { validateUsuarioLogin } from '$lib/server/validators';
import { iniciarSesion } from '$lib/server/use_cases/auth';
import { UnauthorizedException } from '$lib/server/exceptions';
import { setAuthCookies } from '$lib/server/utils';

/**
 * @type {import('./$types').Actions}
 */
export const actions = {

  default: async ({ request, cookies, url }) => {
    const formData = await request.formData();
    const username = formData.get('username')?.toString();
    const password = formData.get('password')?.toString();

    let resultValidation = await validateUsuarioLogin({ username, password });
    if ('errors' in resultValidation) {
      return fail(422, {
        errors: resultValidation.errors
      });
    }
    let values = resultValidation.values;
    let result;
    try {
      result = await iniciarSesion(values.username, values.password);
    } catch (ex) {
      if (ex instanceof UnauthorizedException) {
        return fail(422, { error: ex.message });
      }
      throw ex;
    }
    setAuthCookies(cookies, result.sesionId, result.maxAge);
    let redirectTo = '/';
    if (url.searchParams.has('redirectTo')) {
      redirectTo = /** @type {string} */ (url.searchParams.get('redirectTo'));
    }
    redirect(303, redirectTo);
  }

};
