import { registrarEmpleado, existeEmpleadoPorNumero } from '$lib/server/db/queries';
import { BusinessRuleException, BusinessRules, ForbiddenException } from '$lib/server/exceptions';

/**
 * @param {NonNullable<App.Locals['usuario']>} usuario
 * @param {NonNullable<App.Locals['authorize']>} authorize
 * @returns
 */
export function createRegistrarEmpleadoUseCase (usuario, authorize) {
  /**
  *
  * @param {Omit<Parameters<typeof registrarEmpleado>[0], 'activo'>} dataRegistroEmpleado
  * @throws {BusinessRuleException} En caso de numero de empleado ya registrado
  * @return {Promise<number>}
  */
  return async (dataRegistroEmpleado) => {
    if (authorize.cannot('create', 'Empleado')) {
      throw new ForbiddenException;
    }
    if (dataRegistroEmpleado.numeroEmpleado != null && await existeEmpleadoPorNumero(dataRegistroEmpleado.numeroEmpleado)) {
      throw new BusinessRuleException('Número de empleado ya registrado', BusinessRules.EMPLEADO_REGISTRAR_NUMERO_EMPLEADO_DUPLICADO);
    }
    return registrarEmpleado({
      ...dataRegistroEmpleado,
      activo: true
    });
  };
}
