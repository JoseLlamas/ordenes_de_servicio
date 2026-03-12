import { assertAuthenticated } from '$lib/server/auth/guards';
import { paginarOrdenesServicioResumen } from '$lib/server/db/queries';
import { redirect } from '@sveltejs/kit';
import { validateFiltrosPaginadorOrdenesServicio } from '$lib/server/validators';
import { createDesdeHastaUTC } from '$lib/utils';

/**
 * @type {import('./$types').PageServerLoad}
 */
export async function load ({ locals, url }) {
  assertAuthenticated(locals);
  if (!locals.authorize.has('read', 'Orden')) {
    redirect(403, '/sin-acceso');
  }
  /**
   * @type {Parameters<typeof paginarOrdenesServicioResumen>[0]}
   */
  const parameters = {
    pagina: 1,
    porPagina: 5,
    filtros: {}
  };
  const resultValidation = await validateFiltrosPaginadorOrdenesServicio(Object.fromEntries(url.searchParams));
  if ('values' in resultValidation) {
    parameters.pagina = resultValidation.values.pagina;
    parameters.porPagina = resultValidation.values.porPagina;
    if (resultValidation.values.fecha != null) {
      const fecha = resultValidation.values.fecha;
      parameters.filtros.rangoFechas = createDesdeHastaUTC(fecha, fecha);
    }
    if (resultValidation.values.estado != null) {
      parameters.filtros.estado = resultValidation.values.estado;
    }
    if (resultValidation.values.prioridad != null) {
      parameters.filtros.prioridad = resultValidation.values.prioridad;
    }
    if (resultValidation.values.empleadoSolicitanteId != null) {
      parameters.filtros.empleadoSolicitanteId = resultValidation.values.empleadoSolicitanteId;
    }
  }
  const rolNombre = locals.usuario.rol.nombre;
  if (rolNombre === 'Agente') {
    parameters.filtros.agenteId = locals.usuario.id;
  } else if (rolNombre === 'Encargado' || rolNombre === 'Capturista') {
    if (locals.usuario.areasAcceso != null) {
      parameters.filtros.areasAsignadasId = locals.usuario.areasAcceso.map(area => area.id);
    }
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
