import {
  mysqlTable,
  timestamp,
  int,
  varchar,
  boolean,
  year,
  foreignKey,
  mysqlEnum,
  primaryKey,
  uniqueIndex,
  text
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

export const direccionesGenerales = mysqlTable('direcciones_generales', {
  id: int('id', { unsigned: true }).primaryKey(),
  nombre: varchar('nombre', { length: 100 }).notNull()
});

export const areas = mysqlTable('areas', {
  id: int('id', { unsigned: true }).primaryKey(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  direccionGeneralId: int('direccion_general_id', { unsigned: true }).notNull().references(() => direccionesGenerales.id, { onDelete: 'restrict' }),
  activo: boolean('activo').default(true)
});

export const folios = mysqlTable('folios', {
  id: int('id', { unsigned: true }).autoincrement().primaryKey(),
  anio: year('anio').notNull(),
  consecutivo: int('consecutivo', { unsigned: true }).notNull(),
  areaId: int('area_id', { unsigned: true }).notNull().references(() => areas.id, { onDelete: 'restrict' }),
  identificadorArea: int('identificador_area', { unsigned: true }).notNull()
});

export const categoriasActivo = mysqlTable('categorias_activo', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement(),
  descripcion: varchar('descripcion', { length: 100 }).notNull(),
  areaId: int('area_id', { unsigned: true }).notNull().references(() => areas.id, { onDelete: 'restrict' })
});

export const empleados = mysqlTable('empleados', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement(),
  numeroEmpleado: int('numero_empleado', { unsigned: true }).unique(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  primerApellido: varchar('primer_apellido', { length: 100 }).notNull(),
  segundoApellido: varchar('segundo_apellido', { length: 100 }),
  direccionGeneralId: int('direccion_general_id', { unsigned: true }).notNull().references(() => direccionesGenerales.id, { onDelete: 'restrict' }),
  areaId: int('area_id', { unsigned: true }).notNull().references(() => areas.id, { onDelete: 'restrict' }),
  cargo: varchar('cargo', { length: 100 }),
  activo: boolean('activo').default(true).notNull()
});

export const categoriasOrden = mysqlTable('categorias_orden', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement(),
  descripcion: varchar('descripcion', { length: 100 }).notNull(),
  areaId: int('area_id', { unsigned: true }).notNull().references(() => areas.id, { onDelete: 'restrict' })
});

export const roles = mysqlTable('roles', {
  id: int('id', { unsigned: true }).primaryKey(),
  nombre: varchar('nombre', { length: 50 }).notNull().unique(),
  descripcion: varchar('descripcion', { length: 100 }).notNull()
});

export const permisos = mysqlTable('permisos', {
  id: int('id', { unsigned: true }).primaryKey(),
  accion: varchar('accion', { length: 50 }).notNull(),
  sujeto: varchar('sujeto', { length: 50 }).notNull(),
  texto: varchar('texto', { length: 50 }).notNull()
});

export const rolesPermisos = mysqlTable('roles_permisos', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement(),
  rolId: int('rol_id', { unsigned: true }).notNull().references(() => roles.id, { onDelete: 'restrict' }),
  permisoId: int('permiso_id', { unsigned: true }).notNull().references(() => permisos.id, { onDelete: 'restrict' })
});

export const usuarios = mysqlTable('usuarios', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement(),
  nombreUsuario: varchar('nombre_usuario', { length: 50 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  activo: boolean('activo').default(true).notNull(),
  empleadoId: int('empleado_id', { unsigned: true }).unique().notNull().references(() => empleados.id, { onDelete: 'restrict' }),
  rolId: int('rol_id', { unsigned: true }).notNull().references(() => roles.id, { onDelete: 'restrict' }),
  avatar: varchar('avatar', { length: 255 }),
  areasAccesoId: text('areas_acceso_id')
});

export const ordenesServicio = mysqlTable('ordenes_servicio', {
  id: int('id', { unsigned: true }).primaryKey(),
  descripcion: text('descripcion').notNull(),
  estado: mysqlEnum('estado', ['NUEVO', 'ASIGNADO', 'PROCESO', 'PENDIENTE', 'RESUELTO', 'CERRADO', 'CANCELADO']).notNull(),
  prioridad: mysqlEnum('prioridad', ['BAJA', 'MEDIA', 'ALTA', 'CRITICA']).notNull(),
  tipoEntrada: mysqlEnum('tipo_entrada', ['PRESENCIAL', 'OFICIO', 'LLAMADA_TELEFONICA', 'INDICACION_SUPERIOR']).notNull(),
  numeroOficio: varchar('numero_oficio', { length: 100 }),
  categoriaOrdenId: int('categoria_orden_id', { unsigned: true }).notNull().references(() => categoriasOrden.id, { onDelete: 'restrict' }),
  otroCategoriaOrden: varchar('otro_categoria_orden', { length: 100 }),
  empleadoSolicitanteId: int('empleado_solicitante_id', { unsigned: true }).notNull().references(() => empleados.id, { onDelete: 'restrict' }),
  areaSolicitanteId: int('area_solicitante_id', { unsigned: true }).notNull().references(() => areas.id, { onDelete: 'restrict' }),
  telefonoSolicitante: varchar('telefono_solicitante', { length: 12 }).notNull(),
  areaAsignadaId: int('area_asignada_id', { unsigned: true }).notNull().references(() => areas.id, { onDelete: 'restrict' }),
  encargadoAreaAsignadaId: int('encargado_area_asignada_id', { unsigned: true }).notNull().references(() => empleados.id, { onDelete: 'restrict' }),
  creadoEn: timestamp('creado_en').notNull().defaultNow(),
  creadoPorId: int('creado_por_id', { unsigned: true }).notNull().references(() => usuarios.id, { onDelete: 'restrict' }),
  cerradoEn: timestamp('cerrado_en'),
  cerradoPorId: int('cerrado_por_id', { unsigned: true }).references(() => usuarios.id, { onDelete: 'restrict' }),
  canceladoEn: timestamp('cancelado_en'),
  canceladoPorId: int('cancelado_por_id', { unsigned: true }).references(() => usuarios.id, { onDelete: 'restrict' }),
  ordenServicioRelacionadoId: int('orden_servicio_relacionado_id', { unsigned: true })
}, (table) => [
  foreignKey({
    columns: [table.ordenServicioRelacionadoId],
    foreignColumns: [table.id],
    name: 'orden_servicio_relacionado_id_fk'
  }).onDelete('restrict')
]);

export const activos = mysqlTable('activos', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement(),
  ordenServicioId: int('orden_servicio_id', { unsigned: true }).notNull().references(() => ordenesServicio.id, { onDelete: 'restrict' }),
  categoriaActivoId: int('categoria_activo_id', { unsigned: true }).notNull().references(() => categoriasActivo.id, { onDelete: 'restrict' }),
  numeroInventario: varchar('numero_inventario', { length: 50 }),
  numeroSerie: varchar('numero_serie', { length: 50 }),
  marca: varchar('marca', { length: 50 }),
  modelo: varchar('modelo', { length: 50 }),
  observaciones: text('observaciones')
});

export const encargadosAreas = mysqlTable('encargados_areas', {
  empleadoId: int('empleado_id', { unsigned: true }).notNull().references(() => empleados.id, { onDelete: 'restrict' }),
  areaId: int('area_id', { unsigned: true }).notNull().unique().references(() => areas.id, { onDelete: 'restrict' })
}, (table) => [
  primaryKey({ columns: [table.empleadoId, table.areaId] })
]);

export const asignaciones = mysqlTable('asignaciones', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement(),
  ordenServicioId: int('orden_servicio_id', { unsigned: true }).notNull().references(() => ordenesServicio.id, { onDelete: 'restrict' }),
  usuarioId: int('usuario_id', { unsigned: true }).notNull().references(() => usuarios.id, { onDelete: 'restrict' }),
  fechaAsignacion: timestamp('fecha_asignacion').notNull()
}, (table) => [
  uniqueIndex('asingaciones_orden_servicio_id_usuario_id').on(table.ordenServicioId, table.usuarioId)
]);

export const observaciones = mysqlTable('observaciones', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement(),
  ordenServicioId: int('orden_servicio_id', { unsigned: true }).notNull().references(() => ordenesServicio.id, { onDelete: 'restrict' }),
  tipo: mysqlEnum('tipo', ['SEGUIMIENTO', 'PENDIENTE', 'SOLUCION', 'CIERRE', 'CANCELACION']).notNull(),
  observacion: text('observacion').notNull(),
  creadoEn: timestamp('creado_en').defaultNow(),
  creadorId: int('creador_id', { unsigned: true }).notNull().references(() => usuarios.id, { onDelete: 'restrict' })
});

export const historialOrdenes = mysqlTable('historial_ordenes', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement(),
  ordenServicioId: int('orden_servicio_id', { unsigned: true }).references(() => ordenesServicio.id, { onDelete: 'restrict' }).notNull(),
  tipo: varchar('tipo', { length: 50 }).notNull(),
  descripcion: text('descripcion').notNull(),
  datosAdicionales: text('datos_adicionales').notNull()
});

export const logs = mysqlTable('logs', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement(),
  mensaje: text('mensaje').notNull(),
  stackTrace: text('stack_trace'),
  createdAt: timestamp('created_at').notNull()
});

export const sesiones = mysqlTable('sesiones', {
  id: varchar('id', { length: 255 }).primaryKey(),
  usuarioId: int('usuario_id', { unsigned: true }).notNull().references(() => usuarios.id, { onDelete: 'restrict' }),
  expiresAt: timestamp('expires_at').notNull(),
  creadoEn: timestamp('creado_en').notNull()
});

export const invitaciones = mysqlTable('invitaciones', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  empleadoId: int('empleado_id', { unsigned: true }).notNull().unique().references(() => empleados.id, { onDelete: 'restrict' }),
  rolId: int('rol_id', { unsigned: true }).references(() => roles.id, { onDelete: 'restrict' }).notNull(),
  areasAccesoId: text('areas_acceso_id'),
  invitadorId: int('invitador_id', { unsigned: true }).notNull().references(() => usuarios.id, { onDelete: 'restrict' }),
  usado: boolean('usado').default(false).notNull()
});

export const activosRelations = relations(activos, ({ one }) => ({
  ordenServicio: one(ordenesServicio, {
    fields: [activos.ordenServicioId],
    references: [ordenesServicio.id]
  }),
  categoriaActivo: one(categoriasActivo, {
    fields: [activos.categoriaActivoId],
    references: [categoriasActivo.id]
  })
}));

export const ordenesServicioRelations = relations(ordenesServicio, ({ one, many }) => ({
  categoriaOrden: one(categoriasOrden, {
    fields: [ordenesServicio.categoriaOrdenId],
    references: [categoriasOrden.id]
  }),
  empleadoSolicitante: one(empleados, {
    fields: [ordenesServicio.empleadoSolicitanteId],
    references: [empleados.id]
  }),
  areaAsignada: one(areas, {
    fields: [ordenesServicio.areaAsignadaId],
    references: [areas.id]
  }),
  areaSolicitante: one(areas, {
    fields: [ordenesServicio.areaSolicitanteId],
    references: [areas.id]
  }),
  encargadoAreaAsignada: one(empleados, {
    fields: [ordenesServicio.encargadoAreaAsignadaId],
    references: [empleados.id]
  }),
  creadoPor: one(usuarios, {
    fields: [ordenesServicio.creadoPorId],
    references: [usuarios.id]
  }),
  cerradoPor: one(usuarios, {
    fields: [ordenesServicio.cerradoPorId],
    references: [usuarios.id]
  }),
  canceladoPor: one(usuarios, {
    fields: [ordenesServicio.canceladoPorId],
    references: [usuarios.id]
  }),
  activos: many(activos)
}));

export const usuariosRelations = relations(usuarios, ({ one }) => ({
  empleado: one(empleados, {
    fields: [usuarios.empleadoId],
    references: [empleados.id]
  }),
  rol: one(roles, {
    fields: [usuarios.rolId],
    references: [roles.id]
  })
}));

export const empleadosRelations = relations(empleados, ({ one }) => ({
  area: one(areas, {
    fields: [empleados.areaId],
    references: [areas.id]
  }),
  direccionGeneral: one(direccionesGenerales, {
    fields: [empleados.direccionGeneralId],
    references: [direccionesGenerales.id]
  })
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  rolesPermisos: many(rolesPermisos)
}));

export const permisosRelations = relations(permisos, ({ many }) => ({
  rolesPermisos: many(rolesPermisos)
}));

export const rolesPermisosRelations = relations(rolesPermisos, ({ one }) => ({
  rol: one(roles, {
    fields: [rolesPermisos.rolId],
    references: [roles.id]
  }),
  permiso: one(permisos, {
    fields: [rolesPermisos.permisoId],
    references: [permisos.id]
  })
}));

export const encargadosAreasRelations = relations(encargadosAreas, ({ one }) => ({
  area: one(areas, {
    fields: [encargadosAreas.areaId],
    references: [areas.id]
  }),
  empleado: one(empleados, {
    fields: [encargadosAreas.empleadoId],
    references: [empleados.id]
  })
}));
