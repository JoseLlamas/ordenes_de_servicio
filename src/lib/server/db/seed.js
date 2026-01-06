import * as schema from './schema.js';
import { generateHashPassword } from './../utils/hash_password.js';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import jsonCategoriasActivos from './cat_tipo.json' with { type: 'json' };
import jsonDireccionesGenerales from './direcciones_generales_202511061058.json' with { type: 'json' };
import jsonAreas from './areas_202511061102.json' with { type: 'json' };
import jsonEmpleadosInformatica from './empleados_informatica.json' with { type: 'json' };
import { eq } from 'drizzle-orm';

const uri = `mysql://${process.env.MYSQL_USER}:${process.env.MYSQL_PASSWORD}@${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}/${process.env.MYSQL_DATABASE}`;

const client = mysql.createPool({
  uri,
  timezone: '+00:00',
  charset: 'utf8mb4'
});

const db = drizzle(client, { schema, mode: 'default' });

const permisos = [
  // ========== ÓRDENES DE SERVICIO (10) ==========
  { id: 1, accion: 'create', sujeto: 'Orden', texto: 'REGISTRAR ORDEN DE SERVICIO' },
  { id: 2, accion: 'read', sujeto: 'Orden', texto: 'VER ORDEN DE SERVICIO' },
  { id: 3, accion: 'update', sujeto: 'Orden', texto: 'EDITAR ORDEN DE SERVICIO' },
  { id: 4, accion: 'assign', sujeto: 'Orden', texto: 'ASIGNAR ORDEN DE SERVICIO' },
  { id: 5, accion: 'start', sujeto: 'Orden', texto: 'INICIAR ORDEN DE SERVICIO' },
  { id: 6, accion: 'pending', sujeto: 'Orden', texto: 'PONER EN PENDIENTE ORDEN DE SERVICIO' },
  { id: 7, accion: 'resolve', sujeto: 'Orden', texto: 'RESOLVER ORDEN DE SERVICIO' },
  { id: 8, accion: 'close', sujeto: 'Orden', texto: 'CERRAR ORDEN DE SERVICIO' },
  { id: 9, accion: 'cancel', sujeto: 'Orden', texto: 'CANCELAR ORDEN DE SERVICIO' },
  { id: 10, accion: 'print', sujeto: 'Orden', texto: 'IMPRIMIR ORDEN DE SERVICIO' },

  // ========== EMPLEADOS (4) ==========
  { id: 11, accion: 'create', sujeto: 'Empleado', texto: 'REGISTRAR EMPLEADOS' },
  { id: 12, accion: 'read', sujeto: 'Empleado', texto: 'VER EMPLEADOS' },
  { id: 13, accion: 'update', sujeto: 'Empleado', texto: 'EDITAR EMPLEADOS' },
  { id: 14, accion: 'delete', sujeto: 'Empleado', texto: 'ELIMINAR EMPLEADOS' },

  // ========== INVITACIONES (3) ==========
  { id: 15, accion: 'create', sujeto: 'Invitacion', texto: 'CREAR INVITACIONES' },
  { id: 16, accion: 'read', sujeto: 'Invitacion', texto: 'VER INVITACIONES' },
  { id: 17, accion: 'delete', sujeto: 'Invitacion', texto: 'CANCELAR INVITACIONES' },

  // ========== USUARIOS (3) ==========
  { id: 18, accion: 'read', sujeto: 'Usuario', texto: 'VER USUARIOS' },
  { id: 19, accion: 'assign-areas', sujeto: 'Usuario', texto: 'ASIGNAR ÁREAS A USUARIOS' },
  { id: 20, accion: 'delete', sujeto: 'Usuario', texto: 'ELIMINAR USUARIOS' },

  // ========== CATÁLOGOS (4) ==========
  { id: 21, accion: 'read', sujeto: 'Catalogo', texto: 'VER CATÁLOGOS' },
  { id: 22, accion: 'update', sujeto: 'Catalogo', texto: 'EDITAR CATÁLOGOS' },

  // ========== REPORTES (2 - opcional) ==========
  { id: 23, accion: 'read', sujeto: 'Reporte', texto: 'VER REPORTES' },
  { id: 24, accion: 'export', sujeto: 'Reporte', texto: 'EXPORTAR REPORTES' }
];

const roles = [
  { id: 1, nombre: 'Capturista', descripcion: 'Puede crear y leer órdenes' },
  { id: 2, nombre: 'Agente', descripcion: 'Puede atender órdenes de servicio' },
  { id: 3, nombre: 'Encargado', descripcion: 'Puede gestionar todo lo relevante a su área' },
  { id: 4, nombre: 'Administrador', descripcion: 'Acceso total' }
];

const rolesPermisos = [
  { rolId: 1, permisos: [1,2,3,4,8,9,10,11,12,13,14,21,22] },
  { rolId: 2, permisos: [2,5,6,7,10] },
  { rolId: 3, permisos: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24] },
  { rolId: 4, permisos: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24] }
];

async function seed () {

  await db.delete(schema.folios);
  await db.delete(schema.activos);
  await db.delete(schema.historialOrdenes);
  await db.delete(schema.ordenesServicio);
  await db.delete(schema.invitaciones);
  await db.delete(schema.categoriasOrden);
  await db.delete(schema.encargadosAreas);
  await db.delete(schema.sesiones);
  await db.delete(schema.usuarios);
  await db.delete(schema.empleados);
  await db.delete(schema.categoriasActivo);
  await db.delete(schema.rolesPermisos);
  await db.delete(schema.roles);
  await db.delete(schema.permisos);
  await db.delete(schema.areas);
  await db.delete(schema.direccionesGenerales);

  await db.insert(schema.permisos).values(permisos);
  await db.insert(schema.roles).values(roles);
  await db.insert(schema.rolesPermisos).values(rolesPermisos.map((rolPermiso) => {
    const a = [];
    for(const permiso of rolPermiso.permisos) {
      a.push({
        rolId: rolPermiso.rolId,
        permisoId: permiso
      });
    }
    return a;
  }).flat());

  await db.insert(schema.direccionesGenerales).values(jsonDireccionesGenerales.direcciones_generales);
  await db.insert(schema.areas).values(jsonAreas.areas.map(area => ({ ...area, activo: area.activo === 1, direccionGeneralId: area.direccion_general_id })));
  await db.insert(schema.categoriasActivo).values(jsonCategoriasActivos.data.filter((c) => c.tipo > 0).map(c => ({ descripcion: c.descripcion, areaId: 317 })));
  await db.insert(schema.empleados).values(jsonEmpleadosInformatica.map((empl) => ({ ...empl, direccionGeneralId: 21, activo: true })));

  await db.insert(schema.categoriasOrden).values([
    { descripcion: 'PROBLEMAS DE HARDWARE O SOFTWARE', areaId: 317 },
    { descripcion: 'FALLOS EN SISTEMAS OPERATIVOS', areaId: 317 },
    { descripcion: 'CONEXION A INTERNET O RED', areaId: 317 },
    { descripcion: 'SOLICITUDES DE ACCESO A APLICACIONES O RECURSOS', areaId: 317 },
    { descripcion: 'CAMBIOS O RECUPERACIÓN DE CONTRASEÑAS', areaId: 317 },
    { descripcion: 'INSTALACIÓN O CONFIGURACIÓN DE SOFTWARE', areaId: 317 },
    { descripcion: 'SOLICITUD DE NUEVOS EQUIPOS', areaId: 317 },
    { descripcion: 'INTERRUPCIONES EN SISTEMAS CRITICOS', areaId: 317 },
    { descripcion: 'OTRO', areaId: 317 },

    { descripcion: 'SOLICITUDES DE ACCESO A APLICACIONES O RECURSOS', areaId: 316 },
    { descripcion: 'CAMBIOS O RECUPERACIÓN DE CONTRASEÑAS', areaId: 316 },
    { descripcion: 'INSTALACIÓN O CONFIGURACIÓN DE SOFTWARE', areaId: 316 },
    { descripcion: 'INTERRUPCIONES EN SISTEMAS CRITICOS', areaId: 316 },
    { descripcion: 'CONSULTAS SOBRE PROCESOS INTERNOS', areaId: 316 },
    { descripcion: 'REQUERIMIENTOS DE DOCUMENTACION', areaId: 316 },
    { descripcion: 'OTRO', areaId: 316 },

    { descripcion: 'OTRO', areaId: 315 }
  ]);

  await db.insert(schema.empleados).values({
    numeroEmpleado: 1,
    nombre: 'ADMINISTRADOR',
    primerApellido: 'ADMINISTRADOR',
    direccionGeneralId: 21,
    areaId: 316,
    cargo: 'ADMINISTRADOR DEL SISTEMA',
    activo: true
  });

  const empleado = await db.select().from(schema.empleados).where(eq(schema.empleados.numeroEmpleado, 1)).limit(1);
  await db.insert(schema.usuarios).values({
    nombreUsuario: 'Administrador',
    password: await generateHashPassword('lobo@estepario044@administrador'),
    activo: true,
    empleadoId: empleado[0].id,
    rolId: 4,
    areasAccesoId: null
  });

  const oscar = await db.query.empleados.findFirst({ columns: { id: true }, where: eq(schema.empleados.numeroEmpleado, 983693) });
  const hugo = await db.query.empleados.findFirst({ columns: { id: true }, where: eq(schema.empleados.numeroEmpleado, 1137041) });
  const mauricio = await db.query.empleados.findFirst({ columns: { id: true }, where: eq(schema.empleados.numeroEmpleado, 1183787) });

  if (oscar && hugo && mauricio) {
    await db
      .insert(schema.encargadosAreas)
      .values([
        { empleadoId: oscar.id, areaId: 316 },
        { empleadoId: hugo.id, areaId: 317 },
        { empleadoId: mauricio.id, areaId: 315 }
      ]);
  }
  db.$client.end();
}

seed().then(() => {
  console.log('ok');
}).catch(error => {
  console.error('Error en seed:', error);
  process.exit(1);
});
