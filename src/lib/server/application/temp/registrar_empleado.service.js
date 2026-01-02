import { EmplRepository } from '$lib/repositories/empl.repository';
import { EmpleadoRepository } from '$lib/repositories/empleado.repository';
import { Model } from '$lib/db/connection';

export class RegistrarEmpleadoService {

  /**
   *
   * @param {number} numeroEmpleado
   * @param {number} areaId
   * @param {string | null} cargo
   * @returns {Promise<number>}
   */
  async registrar (numeroEmpleado, areaId, cargo) {
    return await Model.transaction(async (trx) => {
      const emplRepository = (new EmplRepository)
        .useTransaction(trx);
      const empleadoRepository = (new EmpleadoRepository)
        .useTransaction(trx);

      const empl = await emplRepository
        .findById(numeroEmpleado);

      await emplRepository.path(empl.numeroEmpleado, { en_tabla: true });

      return await empleadoRepository.add({
        numero_empleado: empl.numeroEmpleado,
        nombre: empl.nombre,
        segundo_apellido: empl.segundoApellido,
        primer_apellido: empl.primerApellido,
        activo: true,
        cargo: cargo,
        area_id: areaId
      });
    });
  }

}
