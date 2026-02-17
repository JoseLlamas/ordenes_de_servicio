import { subject } from '@casl/ability';
import { AbilityBuilder, createMongoAbility } from '@casl/ability';

const SUJETOS_SIN_RESTRICCION_AREA = ['Empleado'];

/**
 * @param {import('$lib/types').UsuarioDetalleDTO} usuario
 */
export function defineAbilitiesFor (usuario) {
  const { can, build } = new AbilityBuilder(createMongoAbility);
  for (let permiso of usuario.rol.permisos) {
    if (usuario.areasAcceso == null ||
      SUJETOS_SIN_RESTRICCION_AREA.includes(permiso.sujeto)) {
      can(permiso.accion, permiso.sujeto);
    } else {
      can(permiso.accion, permiso.sujeto, {
        areaId: {
          $in: usuario.areasAcceso.map(areaAcceso => areaAcceso.id)
        }
      });
    }
  }
  return build();
}

/**
 *
 * @param {Parameters<typeof defineAbilitiesFor>[0]} usuario
 * @param {ReturnType<typeof defineAbilitiesFor>} ability
 */
export function createValidateAuthorization (usuario, ability) {

  return {

    tieneRestriccionesArea: usuario.areasAcceso != null,

    /**
     *
     * @param {string} accion
     * @param {string} sujeto
     * @param {{ areaId?: number }} [fields]
     */
    can (accion, sujeto, fields) {
      if (SUJETOS_SIN_RESTRICCION_AREA.includes(sujeto)) {
        return ability.can(accion, sujeto);
      }
      if (usuario.areasAcceso == null) {
        return ability.can(accion, sujeto);
      }
      if (fields?.areaId != null) {
        return ability.can(accion, subject(sujeto, fields));
      }
      return false;
    },

    /**
     *
     * @param {string} accion
     * @param {string} sujeto
     * @param {{ areaId?: number }} [fields]
     */
    cannot (accion, sujeto, fields) {
      return !this.can(accion, sujeto, fields);
    },

    /**
     *
     * @param {string} accion
     * @param {string} sujeto
     */
    has (accion, sujeto) {
      if (SUJETOS_SIN_RESTRICCION_AREA.includes(sujeto)) {
        return ability.can(accion, sujeto);
      }
      if (usuario.areasAcceso == null) {
        return ability.can(accion, sujeto);
      }
      return usuario.areasAcceso.some(area => ability.can(accion, subject(sujeto, { areaId: area.id })));
    }

  };
}
