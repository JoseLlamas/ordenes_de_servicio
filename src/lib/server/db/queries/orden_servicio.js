import { eq } from 'drizzle-orm';
import { db } from '..';
import * as schemas from '../schema';

/**
 * @import { DbOrTx } from './types';
 * @import { OrdenServicioDetalleDTO } from '$lib/types';
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
 * @param {number} id
 * @param {DbOrTx} [dbOrTx = db]
 * @return {Promise<OrdenServicioDetalleDTO | null>}
 */
export async function obtenerOrdenServicioDetallePorId (id, dbOrTx = db) {
  return await dbOrTx.query.ordenesServicio.findFirst({
    where: eq(schemas.ordenesServicio.id, id),
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
      }
    }
  }) ?? null;
}
