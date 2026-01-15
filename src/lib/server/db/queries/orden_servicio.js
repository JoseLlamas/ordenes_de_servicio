import { and, asc, count, desc, eq, exists, inArray, sql } from 'drizzle-orm';
import { db } from '..';
import * as schemas from '../schema';
import { alias } from 'drizzle-orm/mysql-core';

/**
 * @import { DbOrTx } from './types';
 * @import { OrdenServicioDetalleDTO, OrdenServicioResumenDTO } from '$lib/types';
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
 * @param {'asc' | 'desc'} opciones.orden
 * @param {{} | { agenteId: number } | { areasAsignadasId: number[] }} opciones.filtros
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<{
 *  ordenesServicio: OrdenServicioResumenDTO[],
 *  paginacion: {
 *    paginaActual: number,
 *    porPagina: number,
 *    totalRegistros: number,
 *    totalPaginas: number,
 *    tienePaginaAnterior: boolean,
 *    tienePaginaSiguiente: boolean
 *  }
 * }>}
 */
export async function paginarOrdenesServicioResumen ({
  pagina = 1,
  porPagina = 10,
  orden = 'desc',
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
  if ('agenteId' in filtros) {
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
  if ('areasAsignadasId' in filtros) {
    params.push(inArray(schemas.ordenesServicio.areaAsignadaId, filtros.areasAsignadasId));
  }
  if (params.length > 0) {
    query.where(and(...params));
  }
  if (orden === 'desc') {
    query.orderBy(desc(schemas.ordenesServicio.id));
  } else {
    query.orderBy(asc(schemas.ordenesServicio.id));
  }
  let offset = (pagina - 1) * porPagina;
  const rows = await query.limit(porPagina).offset(offset);
  const [{ total }] = await dbOrTx.select({
    total: count()
  })
    .from(schemas.ordenesServicio)
    .where(params.length > 0 ? and(...params) : undefined);
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
      paginaActual: pagina,
      porPagina,
      totalRegistros: total,
      totalPaginas,
      tienePaginaAnterior: pagina > 1,
      tienePaginaSiguiente: pagina < totalPaginas
    }
  };
}

/**
 *
 * @param {number} ordenServicioId
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<OrdenServicioResumenDTO | null>}
 */
export async function obtenerOrdenServicioResumenPorId (ordenServicioId, dbOrTx = db) {
  return await dbOrTx.query.ordenesServicio.findFirst({
    where: eq(schemas.ordenesServicio.id, ordenServicioId),
    columns: {
      id: true,
      descripcion: true,
      estado: true,
      prioridad: true,
      tipoEntrada: true,
      numeroOficio: true,
      otroCategoriaOrden: true,
      telefonoSolicitante: true,
      creadoEn: true,
      cerradoEn: true,
      canceladoEn: true
    },
    with: {
      categoriaOrden: {
        columns: {
          id: true,
          descripcion: true
        }
      },
      areaSolicitante: {
        columns: {
          id: true,
          nombre: true
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
      }
    }
  }) ?? null;
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
  return await dbOrTx
    .insert(schemas.asignaciones)
    .values(values)
    .onDuplicateKeyUpdate({
      set: { agenteId: sql`VALUES(agente_id)` }
    })
    .$returningId();
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
 *
 * @param {number} ordenServicioId
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<number>}
 */
export async function obtenerCantidadAgentes (ordenServicioId, dbOrTx = db) {
  return dbOrTx.$count(schemas.asignaciones, eq(schemas.asignaciones.ordenServicioId, ordenServicioId));
}

