import { assertAuthenticated } from '$lib/server/auth/guards';
import { obtenerAgentes, obtenerAreasParaAsignar } from '$lib/server/db/queries';
import { fail, redirect } from '@sveltejs/kit';

/**
 * @type {import('./$types').PageServerLoad}
 */
export async function load ({ locals }) {
  assertAuthenticated(locals);
  if (!['Encargado', 'Administrador'].includes(locals.usuario.rol.nombre)) {
    redirect(303, '/');
  }
  const areas = await obtenerAreasParaAsignar();
  let areasParaAsignar = areas;
  if (locals.usuario.areasAcceso != null) {
    let areasAcceso = locals.usuario.areasAcceso.map((a) => a.id);
    areasParaAsignar = areas.filter((area) => areasAcceso.includes(area.id));
  }
  return {
    areasParaAsignar
  };
}

/**
 * @type {import('./$types').Actions}
 */
export const actions = {

  async obtenerAgentesPorArea ({ request, locals }) {
    assertAuthenticated(locals);
    const formData = await request.formData();
    const areaParaAsignarId = Number.parseInt(formData.get('areaParaAsignarId')?.toString() ?? '');
    if (areaParaAsignarId && areaParaAsignarId > 0) {
      const agentes = await obtenerAgentes({ areaId: areaParaAsignarId });
      return {
        agentes
      };
    } else {
      return fail(422, {
        errorObtenerAgentePorArea: 'Debe seleccionar un area'
      });
    }
  }

};
