import { assertAuthenticated } from '$lib/server/auth/guards';
import { paginarOrdenesServicioResumen } from '$lib/server/db/queries';
import { redirect } from '@sveltejs/kit';
import { validateFiltrosPaginadorOrdenesServicio } from '$lib/server/validators';
import { Temporal } from 'temporal-polyfill';

/**
 * @type {import('./$types').PageServerLoad}
 */
export async function load ({ locals, url }) {
  assertAuthenticated(locals);
  if (!locals.authorize.has('read', 'Orden')) {
    redirect(403, '/sin-acceso');
  }
  const parameters = {
    pagina: 1,
    porPagina: 10,
    filtros: {},
    orden: /** @type {'desc'} */ ('desc')
  };
  const resultValidation = await validateFiltrosPaginadorOrdenesServicio(Object.fromEntries(url.searchParams));
  if ('values' in resultValidation) {
    parameters.pagina = resultValidation.values.pagina;
    parameters.porPagina = resultValidation.values.porPagina;
  }
  const rolNombre = locals.usuario.rol.nombre;
  if (rolNombre === 'Agente') {
    parameters.filtros.agenteId = locals.usuario.id;
  } else if (rolNombre === 'Encargado' || rolNombre === 'Capturista') {
    parameters.filtros.areasAsignadasId = locals.usuario.areasAcceso?.map(area => area.id);
  }
  const paginacion = await paginarOrdenesServicioResumen(parameters);
  return {
    paginacion: {
      ...paginacion.paginacion,
      paginaActual: parameters.pagina,
      porPagina: parameters.porPagina
    },
    ordenesServicio: paginacion.ordenesServicio
  };
}
