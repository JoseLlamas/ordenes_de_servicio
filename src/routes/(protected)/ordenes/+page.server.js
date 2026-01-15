import { assertAuthenticated } from '$lib/server/auth/guards';
import { obtenerAreasParaAsignar, paginarOrdenesServicioResumen } from '$lib/server/db/queries';
import { redirect } from '@sveltejs/kit';

/**
 * @type {import('./$types').PageServerLoad}
 */
export async function load ({ locals }) {
  assertAuthenticated(locals);
  if (!locals.authorize.has('read', 'Orden')) {
    redirect(403, '/sin-acceso');
  }
  let filtros = {};
  const rolNombre = locals.usuario.rol.nombre;
  if (rolNombre === 'Agente') {
    filtros.agenteId = locals.usuario.id;
  } else if (rolNombre === 'Encargado' || rolNombre === 'Capturista') {
    filtros.areasAsignadasId = locals.usuario.areasAcceso?.map(area => area.id);
  }
  const [paginacion, areasParaAsignar] = await Promise.all([paginarOrdenesServicioResumen({
    filtros,
    pagina: 1,
    porPagina: 10,
    orden: 'desc'
  }), obtenerAreasParaAsignar()]);
  return {
    paginacion: paginacion.paginacion,
    ordenesServicio: paginacion.ordenesServicio,
    areasParaAsignar: areasParaAsignar.filter(area => locals.authorize.can('read', 'Orden', { areaId: area.id }))
  };
}
