import { db } from '$lib/server/db';
import {
  obtenerOrdenServicioResumenPorId,
  pathOrdenServicio,
  registrarObservacion
} from '$lib/server/db/queries';
import { BusinessRuleException, BusinessRules, ForbiddenException } from '$lib/server/exceptions';
import { verificarCambioEstado, fromEstadoOrdenATipoObservacion } from '$lib/utils';
import { Temporal } from 'temporal-polyfill';

const PERMISOS = {
  'PROCESO': 'start',
  'PENDIENTE': 'pending',
  'RESUELTO': 'resolve',
  'CERRADO': 'close',
  'CANCELADO': 'cancel'
};

/**
 *
 * @param {NonNullable<App.Locals['usuario']>} usuario
 * @param {NonNullable<App.Locals['authorize']>} authorize
 */
export function createCambiarEstadoUseCase (usuario, authorize) {
  /**
   * @param {{
   *  ordenServicioId: number,
   *  nuevoEstado: 'PROCESO' | 'PENDIENTE' | 'RESUELTO' | 'CERRADO' | 'CANCELADO',
   *  observacion: string | null
   * }} data
   */
  return async (data) => {
    return db.transaction(async (tx) => {
      const ordenServicio = await obtenerOrdenServicioResumenPorId(data.ordenServicioId, tx);
      if (ordenServicio == null) {
        throw new BusinessRuleException(
          'Orden de servicio no encontrada',
          BusinessRules.ORDEN_DE_SERVICIO_NO_ENCONTRADA
        );
      }
      if (authorize.cannot(PERMISOS[data.nuevoEstado], 'Orden', { areaId: ordenServicio.areaAsignada.id })) {
        throw new ForbiddenException('No puede realizar esta operación');
      }
      if (!verificarCambioEstado(ordenServicio.estado, data.nuevoEstado)) {
        throw new BusinessRuleException(`No puede realizar esta operacion (${ordenServicio.estado}) -> (${data.nuevoEstado})`);
      }
      if (['PENDIENTE', 'CANCELADO', 'RESUELTO'].includes(data.nuevoEstado) && data.observacion == null) {
        throw new BusinessRuleException('En pendiente, cancelado o resuelto, la observación es obligatoria');
      }
      const dataUpdate = {
        estado: data.nuevoEstado
      };
      if (data.nuevoEstado === 'CANCELADO') {
        dataUpdate.canceladoEn = new Date(Temporal.Now.instant().epochMilliseconds);
        dataUpdate.canceladoPorId = usuario.id;
      } else if (data.nuevoEstado === 'CERRADO') {
        dataUpdate.cerradoEn = new Date(Temporal.Now.instant().epochMilliseconds);
        dataUpdate.cerradoPorId = usuario.id;
      }
      await pathOrdenServicio(data.ordenServicioId, dataUpdate, tx);
      if (data.observacion != null) {
        await registrarObservacion({
          ordenServicioId: ordenServicio.id,
          tipo: fromEstadoOrdenATipoObservacion(data.nuevoEstado),
          observacion: data.observacion,
          creadoEn: new Date(Temporal.Now.instant().epochMilliseconds),
          creadorId: usuario.id
        }, tx);
      }
    });
  };
}
