import { db } from '$lib/server/db';
import {
  patchOrdenServicio,
  registrarObservacion,
  obtenerOrdenServicioParaCambiarEstado
} from '$lib/server/db/queries';
import { BusinessRuleException, BusinessRules, ForbiddenException } from '$lib/server/exceptions';
import { verificarCambioEstado, fromEstadoOrdenATipoObservacion } from '$lib/utils';
import { Temporal } from 'temporal-polyfill';
import { guardarFirma, borrarArchivo } from '$lib/server/utils';

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
   *  observacion: string | null,
   *  firmaEmpleadoSolicitante?: string,
   *  firmaUsuarioAtendio?: string
   * }} data
   */
  return (data) => {
    return db.transaction(async (tx) => {
      const ordenServicio = await obtenerOrdenServicioParaCambiarEstado(data.ordenServicioId, tx);
      if (ordenServicio == null) {
        throw new BusinessRuleException(
          'Orden de servicio no encontrada',
          BusinessRules.ORDEN_DE_SERVICIO_NO_ENCONTRADA
        );
      }
      if (authorize.cannot(PERMISOS[data.nuevoEstado], 'Orden', { areaId: ordenServicio.areaAsignadaId })) {
        throw new ForbiddenException('No puede realizar esta operación');
      }
      if (!verificarCambioEstado(ordenServicio.estado, data.nuevoEstado)) {
        throw new BusinessRuleException(
          `No puede realizar esta operacion (${ordenServicio.estado}) -> (${data.nuevoEstado})`,
          BusinessRules.FLUJO_CAMBIO_ESTADO_OS_INCORRECTO
        );
      }
      if (['PENDIENTE', 'CANCELADO', 'RESUELTO'].includes(data.nuevoEstado) && data.observacion == null) {
        throw new BusinessRuleException(
          'En pendiente, cancelado o resuelto, la observación es obligatoria',
          BusinessRules.CAMBIO_ESTADO_OS_OBSERVACION_OBLIGATORIA
        );
      }
      if (data.nuevoEstado === 'PROCESO') {
        if (ordenServicio.agentes.length === 0) {
          throw new BusinessRuleException(
            'No puede pasar a proceso si no tiene ningún agente asignado a esta orden',
            BusinessRules.SIN_AGENTES_EN_ORDEN_SERVICIO
          );
        }
        if (ordenServicio.agentes.some(agente => agente.estaOcupado)) {
          throw new BusinessRuleException(
            'No puede pasar a proceso debido a que hay agente asignados a esta OS ocupados en otra OS',
            BusinessRules.AGENTE_OCUPADO_EN_OTRO_OS_EN_PROCESO
          );
        }
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
      } else if (data.nuevoEstado === 'RESUELTO') {
        if (!ordenServicio.agentes.some((agente) => usuario.id === agente.id)) {
          throw new BusinessRuleException(
            'Sólo un agente asignado puede firmar',
            BusinessRules.SOLO_USUARIO_ASIGNADO_PUEDE_FIRMAR
          );
        }
        if (data.firmaUsuarioAtendio == null) {
          throw new BusinessRuleException(
            'Tu firma es requerida',
            BusinessRules.FIRMA_USUARIO_ATENDIO_REQUERIDA
          );
        }
        if (ordenServicio.tipoEntrada === 'PRESENCIAL' && data.firmaEmpleadoSolicitante == null) {
          throw new BusinessRuleException(
            'La firma del solicitante es requerida sí la entrada es presencial',
            BusinessRules.FIRMA_EMPLEADO_SOLICITANTE_REQUERIDA
          );
        }
        const time = Date.now();
        const pathFirmaUsuarioAtendio = await guardarFirma(
          data.firmaUsuarioAtendio,
          ordenServicio.creadoEn.getFullYear(),
          `${ordenServicio.id}-${time}-atendio.png`
        );
        dataUpdate.firmaUsuarioAtendio = pathFirmaUsuarioAtendio;
        dataUpdate.usuarioFirmaAtendioId = usuario.id;
        if (data.firmaEmpleadoSolicitante != null) {
          const pathFirmaSolicitante = await guardarFirma(
            data.firmaEmpleadoSolicitante,
            ordenServicio.creadoEn.getFullYear(),
            `${ordenServicio.id}-${time}-solicitante.png`
          );
          dataUpdate.firmaEmpleadoSolicitante = pathFirmaSolicitante;
        }
      } else {
        if (ordenServicio.firmaEmpleadoSolicitante != null) {
          dataUpdate.firmaEmpleadoSolicitante = null;
          await borrarArchivo(ordenServicio.firmaEmpleadoSolicitante);
        }
        if (ordenServicio.firmaUsuarioAtendio != null) {
          dataUpdate.firmaUsuarioAtendio = null;
          dataUpdate.usuarioFirmaAtendioId = null;
          await borrarArchivo(ordenServicio.firmaUsuarioAtendio);
        }
      }
      await patchOrdenServicio(data.ordenServicioId, dataUpdate, tx);
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
