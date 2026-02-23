import { and, asc, count, desc, eq, exists, gte, inArray, lte, ne, sql } from 'drizzle-orm';
import { db } from '..';
import * as schemas from '../schema';
import { alias } from 'drizzle-orm/mysql-core';

/**
 * @import { DbOrTx } from './types';
 * @import { OrdenServicioDetalleDTO, OrdenServicioResumenDTO } from '$lib/types';
 */

/**
 * @typedef {{
 *  id: number,
 *  nombreUsuario: string,
 *  estaOcupado: boolean
 * }} AgenteParaCambiarEstado
 *
 */

/**
 * @param {{
 *  id: number,
 *  descripcion: string,
 *  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA',
 *  tipoEntrada: 'PRESENCIAL' | 'OFICIO' | 'LLAMADA_TELEFONICA' | 'INDICACION_SUPERIOR',
 *  numeroOficio: string | null,
 *  categoriaOrdenId: number,
 *  otroCategoriaOrden: string | null,
 *  empleadoSolicitanteId: number,
 *  areaSolicitanteId: number,
 *  telefonoSolicitante: string,
 *  areaAsignadaId: number,
 *  encargadoAreaAsignadaId: number,
 *  creadoPorId: number,
 *  creadoEn: Date,
 *  ordenServicioRelacionadoId: number | null
 * }} data
 * @param {DbOrTx} [dbOrTx = db]
 */
export async function registrarOrdenServicio (data, dbOrTx = db) {
  await dbOrTx
    .insert(schemas.ordenesServicio)
    .values({
      ...data,
      estado: 'NUEVO'
    });
}

/**
 * @param {object} opciones
 * @param {number} opciones.pagina
 * @param {number} opciones.porPagina
 * @param {{
 *  rangoFechas?: [Date, Date],
 *  estado?: 'NUEVO' | 'PROCESO' | 'PENDIENTE' | 'RESUELTO' | 'CERRADO' | 'CANCELADO',
 *  prioridad?: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA',
 *  agenteId?: number,
 *  areasAsignadasId?: number[]
 * }} opciones.filtros
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<{
 *  ordenesServicio: OrdenServicioResumenDTO[],
 *  paginacion: {
 *    totalRegistros: number,
 *    totalPaginas: number
 *  }
 * }>}
 */
export async function paginarOrdenesServicioResumen ({
  pagina,
  porPagina,
  filtros = {}
}, dbOrTx = db) {
  const areaAsignadaAlias = alias(schemas.areas, 'areaAsignada');
  const areaSolicitanteAlias = alias(schemas.areas, 'areaSolicitante');
  let query = dbOrTx
    .select({
      id: schemas.ordenesServicio.id,
      descripcion: schemas.ordenesServicio.descripcion,
      estado: schemas.ordenesServicio.estado,
      prioridad: schemas.ordenesServicio.prioridad,
      tipoEntrada: schemas.ordenesServicio.tipoEntrada,
      numeroOficio: schemas.ordenesServicio.numeroOficio,
      creadoEn: schemas.ordenesServicio.creadoEn,
      cerradoEn: schemas.ordenesServicio.cerradoEn,
      canceladoEn: schemas.ordenesServicio.canceladoEn,
      'categoriaOrden.id': schemas.categoriasOrden.id,
      'categoriasOrden.descripcion': schemas.categoriasOrden.descripcion,
      otroCategoriaOrden: schemas.ordenesServicio.otroCategoriaOrden,
      telefonoSolicitante: schemas.ordenesServicio.telefonoSolicitante,
      'areaSolicitante.id': areaSolicitanteAlias.id,
      'areaSolicitante.nombre': areaSolicitanteAlias.nombre,
      'empleadoSolicitante.id': schemas.empleados.id,
      'empleadoSolicitante.nombre': schemas.empleados.nombre,
      'empleadoSolicitante.primerApellido': schemas.empleados.primerApellido,
      'empleadoSolicitante.segundoApellido': schemas.empleados.segundoApellido,
      'empleadoSolicitante.cargo': schemas.empleados.cargo,
      'areaAsignada.id': areaAsignadaAlias.id,
      'areaAsignada.nombre': areaAsignadaAlias.nombre
    })
    .from(schemas.ordenesServicio)
    .innerJoin(schemas.categoriasOrden, eq(schemas.ordenesServicio.categoriaOrdenId, schemas.categoriasOrden.id))
    .innerJoin(schemas.empleados, eq(schemas.ordenesServicio.empleadoSolicitanteId, schemas.empleados.id))
    .innerJoin(areaSolicitanteAlias, eq(schemas.ordenesServicio.areaSolicitanteId, areaSolicitanteAlias.id))
    .innerJoin(areaAsignadaAlias, eq(schemas.ordenesServicio.areaAsignadaId, areaAsignadaAlias.id));
  const params = [];
  if (filtros.agenteId != null) {
    params.push(
      exists(
        dbOrTx
          .select()
          .from(schemas.asignaciones)
          .where(
            and(
              eq(schemas.asignaciones.ordenServicioId, schemas.ordenesServicio.id),
              eq(schemas.asignaciones.agenteId, filtros.agenteId)
            )
          )
      )
    );
  }
  if (filtros.areasAsignadasId != null) {
    params.push(inArray(schemas.ordenesServicio.areaAsignadaId, filtros.areasAsignadasId));
  }
  if (filtros.rangoFechas != null) {
    params.push(
      and(
        gte(schemas.ordenesServicio.creadoEn, filtros.rangoFechas[0]),
        lte(schemas.ordenesServicio.creadoEn, filtros.rangoFechas[1])
      )
    );
  }
  if (filtros.estado != null) {
    params.push(eq(schemas.ordenesServicio.estado, filtros.estado));
  }
  if (filtros.prioridad != null) {
    params.push(eq(schemas.ordenesServicio.prioridad, filtros.prioridad));
  }
  if (params.length > 0) {
    query.where(and(...params));
  }
  let offset = (pagina - 1) * porPagina;
  const [rows, [{ total }]] = await Promise.all([
    query
      .where(params.length > 0 ? and(...params) : undefined)
      .limit(porPagina)
      .offset(offset)
      .orderBy(desc(schemas.ordenesServicio.creadoEn)),
    dbOrTx
      .select({ total: count() })
      .from(schemas.ordenesServicio)
      .where(params.length > 0 ? and(...params) : undefined)
  ]);
  const totalPaginas = Math.ceil(total / porPagina);
  return {
    ordenesServicio: rows.map(ordenServicio => ({
      id: ordenServicio.id,
      descripcion: ordenServicio.descripcion,
      estado: ordenServicio.estado,
      prioridad: ordenServicio.prioridad,
      tipoEntrada: ordenServicio.tipoEntrada,
      numeroOficio: ordenServicio.numeroOficio,
      categoriaOrden: {
        id: ordenServicio['categoriaOrden.id'],
        descripcion: ordenServicio['categoriasOrden.descripcion']
      },
      otroCategoriaOrden: ordenServicio.otroCategoriaOrden,
      areaSolicitante: {
        id: ordenServicio['areaSolicitante.id'],
        nombre: ordenServicio['areaSolicitante.nombre']
      },
      empleadoSolicitante: {
        id: ordenServicio['empleadoSolicitante.id'],
        nombre: ordenServicio['empleadoSolicitante.nombre'],
        primerApellido: ordenServicio['empleadoSolicitante.primerApellido'],
        segundoApellido: ordenServicio['empleadoSolicitante.segundoApellido'],
        cargo: ordenServicio['empleadoSolicitante.cargo']
      },
      telefonoSolicitante: ordenServicio.telefonoSolicitante,
      areaAsignada: {
        id: ordenServicio['areaAsignada.id'],
        nombre: ordenServicio['areaAsignada.nombre']
      },
      creadoEn: ordenServicio.creadoEn,
      canceladoEn: ordenServicio.canceladoEn,
      cerradoEn: ordenServicio.cerradoEn
    })),
    paginacion: {
      totalRegistros: total,
      totalPaginas
    }
  };
}

/**
 * @param {number} id
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<OrdenServicioDetalleDTO | null>}
 */
export async function obtenerOrdenServicioDetallePorId (id, dbOrTx = db) {
  const result = await dbOrTx.query.ordenesServicio.findFirst({
    where: eq(schemas.ordenesServicio.id, id),
    columns: {
      id: true,
      descripcion: true,
      estado: true,
      prioridad: true,
      tipoEntrada: true,
      numeroOficio: true,
      otroCategoriaOrden: true,
      telefonoSolicitante: true,
      ordenServicioRelacionadoId: true,
      firmaEmpleadoSolicitante: true,
      creadoEn: true,
      canceladoEn: true,
      cerradoEn: true
    },
    with: {
      categoriaOrden: {
        columns: {
          id: true,
          descripcion: true
        }
      },
      empleadoSolicitante: {
        columns: {
          id: true,
          nombre: true,
          primerApellido: true,
          segundoApellido: true,
          cargo: true
        }
      },
      areaAsignada: {
        columns: {
          id: true,
          nombre: true
        }
      },
      areaSolicitante: {
        columns: {
          id: true,
          nombre: true
        }
      },
      encargadoAreaAsignada: {
        columns: {
          id: true,
          nombre: true,
          primerApellido: true,
          segundoApellido: true,
          cargo: true
        }
      },
      creadoPor: {
        columns: {
          id: true,
          nombreUsuario: true,
          avatar: true
        },
        with: {
          rol: {
            columns: {
              id: true,
              nombre: true
            }
          },
          empleado: {
            columns: {
              id: true,
              nombre: true,
              primerApellido: true,
              segundoApellido: true,
              cargo: true
            }
          }
        }
      },
      cerradoPor: {
        columns: {
          id: true,
          nombreUsuario: true,
          avatar: true
        },
        with: {
          rol: {
            columns: {
              id: true,
              nombre: true
            }
          },
          empleado: {
            columns: {
              id: true,
              nombre: true,
              primerApellido: true,
              segundoApellido: true,
              cargo: true
            }
          }
        }
      },
      canceladoPor: {
        columns: {
          id: true,
          nombreUsuario: true,
          avatar: true
        },
        with: {
          rol: {
            columns: {
              id: true,
              nombre: true
            }
          },
          empleado: {
            columns: {
              id: true,
              nombre: true,
              primerApellido: true,
              segundoApellido: true,
              cargo: true
            }
          }
        }
      },
      activos: {
        columns: {
          id: true,
          numeroInventario: true,
          numeroSerie: true,
          marca: true,
          modelo: true,
          observaciones: true
        },
        with: {
          categoriaActivo: {
            columns: {
              id: true,
              descripcion: true
            }
          }
        }
      },
      asignaciones: {
        columns: {},
        with: {
          agente: {
            columns: {
              id: true,
              nombreUsuario: true,
              avatar: true
            },
            with: {
              empleado: {
                columns: {
                  id: true,
                  nombre: true,
                  primerApellido: true,
                  segundoApellido: true,
                  cargo: true
                }
              }
            }
          }
        }
      },
      observaciones: {
        orderBy: asc(schemas.observaciones.creadoEn),
        columns: {
          id: true,
          tipo: true,
          observacion: true,
          creadoEn: true
        },
        with: {
          creadoPor: {
            columns: {
              id: true,
              nombreUsuario: true,
              avatar: true
            },
            with: {
              rol: {
                columns: {
                  id: true,
                  nombre: true
                }
              },
              empleado: {
                columns: {
                  id: true,
                  nombre: true,
                  primerApellido: true,
                  segundoApellido: true,
                  cargo: true
                }
              }
            }
          }
        }
      }
    }
  });
  if (!result) {
    return null;
  }
  const {
    asignaciones: _,
    ...ordenServicioResult
  } = result;
  return {
    ...ordenServicioResult,
    agentes: _.map(asignacion => asignacion.agente)
  };
}

/**
 *
 * @param {number} ordenServicioId
 * @param {number[]} agentesId
 * @param {DbOrTx} [dbOrTx = db]
 */
export async function asignarAgentes (ordenServicioId, agentesId, dbOrTx = db) {
  const values = agentesId.map(agenteId => ({
    agenteId,
    ordenServicioId
  }));
  return (await dbOrTx
    .insert(schemas.asignaciones)
    .values(values)
    .onDuplicateKeyUpdate({
      set: { agenteId: sql`VALUES(agente_id)` }
    })
    .$returningId())
    .map(id => id.id);
}

/**
 *
 * @param {number} ordenServicioId
 * @param {number} agenteId
 * @param {DbOrTx} [dbOrTx = db]
 */
export async function desasignarAgente (ordenServicioId, agenteId, dbOrTx = db) {
  await dbOrTx
    .delete(schemas.asignaciones)
    .where(
      and(
        eq(schemas.asignaciones.ordenServicioId, ordenServicioId),
        eq(schemas.asignaciones.agenteId, agenteId)
      )
    );
}

/**
 * @param {number} ordenServicioId
 * @param {{
 *  estado?: 'PROCESO' | 'PENDIENTE' | 'RESUELTO' | 'CERRADO' | 'CANCELADO',
 *  cerradoEn?: Date | null,
 *  cerradoPorId?: number | null,
 *  canceladoEn?: Date | null,
 *  canceladoPorId?: number | null,
 *  ordenServicioRelacionadoId?: number | null,
 *  telefonoSolicitante?: string,
 *  categoriaOrdenId?: number,
 *  otroCategoriaOrden?: string | null,
 *  descripcion?: string,
 *  numeroOficio?: string | null,
 *  prioridad?: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA',
 *  tipoEntrada?: 'PRESENCIAL' | 'LLAMADA_TELEFONICA' | 'OFICIO' | 'INDICACION_SUPERIOR',
 *  firmaEmpleadoSolicitante?: string | null
 * }} data
 * @param {DbOrTx} [dbOrTx = db]
 */
export async function patchOrdenServicio (ordenServicioId, data, dbOrTx = db) {
  await dbOrTx
    .update(schemas.ordenesServicio)
    .set(data)
    .where(eq(schemas.ordenesServicio.id, ordenServicioId));
}

/**
 *
 * @param {number} ordenServicioId
 * @param {DbOrTx} [dbOrTx = db]
 */
export async function obtenerOrdenServicioParaCambiarEstado (ordenServicioId, dbOrTx = db) {
  const [orden] = await dbOrTx
    .select({
      id: schemas.ordenesServicio.id,
      estado: schemas.ordenesServicio.estado,
      areaAsignadaId: schemas.ordenesServicio.areaAsignadaId,
      creadoEn: schemas.ordenesServicio.creadoEn
    })
    .from(schemas.ordenesServicio)
    .where(eq(schemas.ordenesServicio.id, ordenServicioId));
  if (orden == null) {
    return null;
  }
  const agentes = await dbOrTx
    .select({
      id: schemas.asignaciones.agenteId,
      nombreUsuario: schemas.usuarios.nombreUsuario,
      estaOcupado: exists(
        dbOrTx
          .select()
          .from(schemas.asignaciones)
          .innerJoin(schemas.ordenesServicio, eq(schemas.asignaciones.ordenServicioId, schemas.ordenesServicio.id))
          .where(
            and(
              eq(schemas.asignaciones.agenteId, schemas.usuarios.id),
              eq(schemas.ordenesServicio.estado, 'PROCESO'),
              ne(schemas.ordenesServicio.id, ordenServicioId)
            )
          )
      )
    })
    .from(schemas.usuarios)
    .innerJoin(schemas.asignaciones, eq(schemas.usuarios.id, schemas.asignaciones.agenteId))
    .where(eq(schemas.asignaciones.ordenServicioId, ordenServicioId));
  return {
    id: orden.id,
    estado: orden.estado,
    areaAsignadaId: orden.areaAsignadaId,
    creadoEn: orden.creadoEn,
    agentes: agentes.map(a => ({
      id: a.id,
      nombreUsuario: a.nombreUsuario,
      estaOcupado: Boolean(a.estaOcupado)
    }))
  };
}

/**
 *
 * @param {number} ordenServicioId
 * @param {DbOrTx} [dbOrTx = db]
 */
export async function obtenerOrdenServicioParaDesasignacion (ordenServicioId, dbOrTx = db) {
  const orden = await dbOrTx.query.ordenesServicio.findFirst({
    where: eq(schemas.ordenesServicio.id, ordenServicioId),
    columns: {
      id: true,
      estado: true,
      areaAsignadaId: true
    },
    with: {
      asignaciones: {
        columns: {
          agenteId: true
        }
      }
    }
  });
  if (orden) {
    return {
      id: orden.id,
      estado: orden.estado,
      areaAsignadaId: orden.areaAsignadaId,
      agentesId: orden.asignaciones.map(agente => agente.agenteId)
    };
  }
  return null;
}

/**
 *
 * @param {number} ordenServicioId
 * @param {DbOrTx} [dbOrTx = db]
 */
export async function obtenerOrdenServicioSimple (ordenServicioId, dbOrTx = db) {
  const row = await dbOrTx.query.ordenesServicio.findFirst({
    where: eq(schemas.ordenesServicio.id, ordenServicioId),
    columns: {
      areaAsignadaId: true,
      id: true,
      estado: true
    }
  });
  return row ?? null;
}
