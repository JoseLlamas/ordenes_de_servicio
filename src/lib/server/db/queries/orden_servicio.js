import { eq, sql } from 'drizzle-orm';
import { db } from '..';
import * as schemas from '../schema';

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
      telefonoSolicitante: true
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
          numeroEmpleado: true,
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
          numeroEmpleado: true,
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
          numeroEmpleado: true,
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
              numeroEmpleado: true,
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
          empleado: {
            columns: {
              id: true,
              numeroEmpleado: true,
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
          empleado: {
            columns: {
              id: true,
              numeroEmpleado: true,
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
                  numeroEmpleado: true,
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

