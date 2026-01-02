import { EmplRepository } from '$lib/repositories/empl.repository';

export class BusquedaEmplService {

  /**
   *
   * @param {{
   *    numeroEmpleado: number
   *  } | {
   *  nombre: string,
   *  primerApellido: string,
   *  segundoApellido: string | null
   * }} data
   * @returns {Promise<import('$lib/transformers/types').Empl[]>}
   */
  async buscar (data) {
    let repository = new EmplRepository;
    repository.where({ en_tabla: false });
    if ('numeroEmpleado' in data) {
      repository.where({ numero_empleado: data.numeroEmpleado });
    } else {
      const where = {
        nombre: data.nombre,
        primer_apellido: data.primerApellido
      };
      if (data.segundoApellido !== null) {
        where.segundo_apellido = data.segundoApellido;
      }
      repository.where(where);
    }
    return await repository.findAll({ orderBy: ['primer_apellido', 'segundo_apellido'] });
  }

}
