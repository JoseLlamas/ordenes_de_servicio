import { db } from '$lib/server/db';
import { obtenerCategoriaOrdenPorId, obtenerOrdenServicioSimple, patchOrdenServicio } from '$lib/server/db/queries';
import { BusinessRuleException, BusinessRules, ForbiddenException } from '$lib/server/exceptions';

/**
 *
 * @param {NonNullable<App.Locals['usuario']>} usuario
 * @param {NonNullable<App.Locals['authorize']>} authorize
 */
export function createModificarOrdenServicioUseCase (usuario, authorize) {
  /**
   * @param {number} ordenServicioId
   * @param {{
   *  telefonoSolicitante: string,
   *  categoriaOrdenId: number,
   *  otroCategoriaOrden: string | null,
   *  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA',
   *  descripcion: string,
   *  tipoEntrada: 'PRESENCIAL' | 'LLAMADA_TELEFONICA' | 'OFICIO' | 'INDICACION_SUPERIOR',
   *  numeroOficio: string | null
   * }} data
   */
  return (ordenServicioId, data) => {
    return db.transaction(async tx => {
      const ordenServicio = await obtenerOrdenServicioSimple(ordenServicioId, tx);
      if (ordenServicio == null) {
        throw new BusinessRuleException(
          'Orden de servicio no encontrada',
          BusinessRules.ORDEN_DE_SERVICIO_NO_ENCONTRADA
        );
      }
      if (authorize.cannot('update', 'Orden', { areaId: ordenServicio.areaAsignadaId })) {
        throw new ForbiddenException('No puede realizar esta operación');
      }
      const categoriaOrden = await obtenerCategoriaOrdenPorId(data.categoriaOrdenId, tx);
      if (categoriaOrden == null) {
        throw new BusinessRuleException(
          'Categoria de orden no encontrada'
        );
      }
      if (categoriaOrden.descripcion === 'OTRO' && data.otroCategoriaOrden == null) {
        throw new BusinessRuleException(
          'Si selecciona "OTRO" como categoria, debe ingresar manualmente la categoria en otro',
          BusinessRules.SELECCIONAR_OTRO_SIN_INGRESAR_OTRO_MANUALMENTE
        );
      }
      if (categoriaOrden.descripcion !== 'OTRO' && data.otroCategoriaOrden != null) {
        throw new BusinessRuleException(
          'Sólo debe ingresar manualmente otra categoria si ingresa "OTRO" como categoria',
          BusinessRules.SELECCIONAR_DIFERENTE_A_OTRO_E_INGRESAR_OTRO_MANUALMENTE
        );
      }
      if (data.tipoEntrada === 'OFICIO' && data.numeroOficio == null) {
        throw new BusinessRuleException(
          'Si selecciona como tipo de entrada "OFICIO", debe ingresar le número de oficio',
          BusinessRules.SELECCIONAR_OFICIO_Y_NO_INGREGAR_NUMERO_OFICIO
        );
      }
      if (!['NUEVO', 'PROCESO', 'PENDIENTE'].includes(ordenServicio.estado)) {
        throw new BusinessRuleException(
          'Sólo se puede modificar la orden en "NUEVO", "PROCESO" Y "PENDIENTE"',
          BusinessRules.MODIFICACION_DE_ORDEN_FUERA_DE_ESTADO
        );
      }
      await patchOrdenServicio(ordenServicio.id, data, tx);
    });
  };
}
