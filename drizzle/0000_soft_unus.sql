CREATE TABLE `activos` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`orden_servicio_id` int unsigned NOT NULL,
	`categoria_activo_id` int unsigned NOT NULL,
	`numero_inventario` varchar(50),
	`numero_serie` varchar(50),
	`marca` varchar(50),
	`modelo` varchar(50),
	`observaciones` text,
	CONSTRAINT `activos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `areas` (
	`id` int unsigned NOT NULL,
	`nombre` varchar(100) NOT NULL,
	`direccion_general_id` int unsigned NOT NULL,
	`activo` boolean DEFAULT true,
	CONSTRAINT `areas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `asignaciones` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`orden_servicio_id` int unsigned NOT NULL,
	`usuario_id` int unsigned NOT NULL,
	`fecha_asignacion` timestamp NOT NULL,
	CONSTRAINT `asignaciones_id` PRIMARY KEY(`id`),
	CONSTRAINT `asingaciones_orden_servicio_id_usuario_id` UNIQUE(`orden_servicio_id`,`usuario_id`)
);
--> statement-breakpoint
CREATE TABLE `categorias_activo` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`descripcion` varchar(100) NOT NULL,
	`area_id` int unsigned NOT NULL,
	CONSTRAINT `categorias_activo_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categorias_orden` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`descripcion` varchar(100) NOT NULL,
	`area_id` int unsigned NOT NULL,
	CONSTRAINT `categorias_orden_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `direcciones_generales` (
	`id` int unsigned NOT NULL,
	`nombre` varchar(100) NOT NULL,
	CONSTRAINT `direcciones_generales_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `empleados` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`numero_empleado` int unsigned,
	`nombre` varchar(100) NOT NULL,
	`primer_apellido` varchar(100) NOT NULL,
	`segundo_apellido` varchar(100),
	`direccion_general_id` int unsigned NOT NULL,
	`area_id` int unsigned NOT NULL,
	`cargo` varchar(100),
	`activo` boolean NOT NULL DEFAULT true,
	CONSTRAINT `empleados_id` PRIMARY KEY(`id`),
	CONSTRAINT `empleados_numero_empleado_unique` UNIQUE(`numero_empleado`)
);
--> statement-breakpoint
CREATE TABLE `encargados_areas` (
	`empleado_id` int unsigned NOT NULL,
	`area_id` int unsigned NOT NULL,
	CONSTRAINT `encargados_areas_empleado_id_area_id_pk` PRIMARY KEY(`empleado_id`,`area_id`),
	CONSTRAINT `encargados_areas_area_id_unique` UNIQUE(`area_id`)
);
--> statement-breakpoint
CREATE TABLE `folios` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`anio` year NOT NULL,
	`consecutivo` int unsigned NOT NULL,
	`area_id` int unsigned NOT NULL,
	`identificador_area` int unsigned NOT NULL,
	CONSTRAINT `folios_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `historial_ordenes` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`orden_servicio_id` int unsigned NOT NULL,
	`tipo` varchar(50) NOT NULL,
	`descripcion` text NOT NULL,
	`datos_adicionales` text NOT NULL,
	CONSTRAINT `historial_ordenes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invitaciones` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`token` varchar(255) NOT NULL,
	`empleado_id` int unsigned NOT NULL,
	`rol_id` int unsigned NOT NULL,
	`areas_acceso_id` text,
	`invitador_id` int unsigned NOT NULL,
	`usado` boolean NOT NULL DEFAULT false,
	CONSTRAINT `invitaciones_id` PRIMARY KEY(`id`),
	CONSTRAINT `invitaciones_token_unique` UNIQUE(`token`),
	CONSTRAINT `invitaciones_empleado_id_unique` UNIQUE(`empleado_id`)
);
--> statement-breakpoint
CREATE TABLE `logs` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`mensaje` text NOT NULL,
	`stack_trace` text,
	`created_at` timestamp NOT NULL,
	CONSTRAINT `logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `observaciones` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`orden_servicio_id` int unsigned NOT NULL,
	`tipo` enum('SEGUIMIENTO','PENDIENTE','SOLUCION','CIERRE','CANCELACION') NOT NULL,
	`observacion` text NOT NULL,
	`creado_en` timestamp,
	`creador_id` int unsigned NOT NULL,
	CONSTRAINT `observaciones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ordenes_servicio` (
	`id` int unsigned NOT NULL,
	`descripcion` text NOT NULL,
	`estado` enum('NUEVO','ASIGNADO','PROCESO','PENDIENTE','RESUELTO','CERRADO','CANCELADO') NOT NULL,
	`prioridad` enum('BAJA','MEDIA','ALTA','CRITICA') NOT NULL,
	`tipo_entrada` enum('PRESENCIAL','OFICIO','LLAMADA_TELEFONICA','INDICACION_SUPERIOR') NOT NULL,
	`numero_oficio` varchar(100),
	`categoria_orden_id` int unsigned NOT NULL,
	`otro_categoria_orden` varchar(100),
	`empleado_solicitante_id` int unsigned NOT NULL,
	`area_solicitante_id` int unsigned NOT NULL,
	`telefono_solicitante` varchar(12) NOT NULL,
	`area_asignada_id` int unsigned NOT NULL,
	`encargado_area_asignada_id` int unsigned NOT NULL,
	`creado_en` timestamp NOT NULL,
	`creado_por_id` int unsigned NOT NULL,
	`cerrado_en` timestamp,
	`cerrado_por_id` int unsigned,
	`cancelado_en` timestamp,
	`cancelado_por_id` int unsigned,
	`orden_servicio_relacionado_id` int unsigned,
	CONSTRAINT `ordenes_servicio_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `permisos` (
	`id` int unsigned NOT NULL,
	`accion` varchar(50) NOT NULL,
	`sujeto` varchar(50) NOT NULL,
	`texto` varchar(50) NOT NULL,
	CONSTRAINT `permisos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` int unsigned NOT NULL,
	`nombre` varchar(50) NOT NULL,
	`descripcion` varchar(100) NOT NULL,
	CONSTRAINT `roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `roles_nombre_unique` UNIQUE(`nombre`)
);
--> statement-breakpoint
CREATE TABLE `roles_permisos` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`rol_id` int unsigned NOT NULL,
	`permiso_id` int unsigned NOT NULL,
	CONSTRAINT `roles_permisos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sesiones` (
	`id` varchar(255) NOT NULL,
	`usuario_id` int unsigned NOT NULL,
	`expires_at` timestamp NOT NULL,
	`creado_en` timestamp NOT NULL,
	CONSTRAINT `sesiones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `usuarios` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`nombre_usuario` varchar(50) NOT NULL,
	`password` varchar(255) NOT NULL,
	`activo` boolean NOT NULL DEFAULT true,
	`empleado_id` int unsigned NOT NULL,
	`rol_id` int unsigned NOT NULL,
	`avatar` varchar(255),
	`areas_acceso_id` text,
	CONSTRAINT `usuarios_id` PRIMARY KEY(`id`),
	CONSTRAINT `usuarios_nombre_usuario_unique` UNIQUE(`nombre_usuario`),
	CONSTRAINT `usuarios_empleado_id_unique` UNIQUE(`empleado_id`)
);
--> statement-breakpoint
ALTER TABLE `activos` ADD CONSTRAINT `activos_orden_servicio_id_ordenes_servicio_id_fk` FOREIGN KEY (`orden_servicio_id`) REFERENCES `ordenes_servicio`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activos` ADD CONSTRAINT `activos_categoria_activo_id_categorias_activo_id_fk` FOREIGN KEY (`categoria_activo_id`) REFERENCES `categorias_activo`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `areas` ADD CONSTRAINT `areas_direccion_general_id_direcciones_generales_id_fk` FOREIGN KEY (`direccion_general_id`) REFERENCES `direcciones_generales`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `asignaciones` ADD CONSTRAINT `asignaciones_orden_servicio_id_ordenes_servicio_id_fk` FOREIGN KEY (`orden_servicio_id`) REFERENCES `ordenes_servicio`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `asignaciones` ADD CONSTRAINT `asignaciones_usuario_id_usuarios_id_fk` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `categorias_activo` ADD CONSTRAINT `categorias_activo_area_id_areas_id_fk` FOREIGN KEY (`area_id`) REFERENCES `areas`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `categorias_orden` ADD CONSTRAINT `categorias_orden_area_id_areas_id_fk` FOREIGN KEY (`area_id`) REFERENCES `areas`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `empleados` ADD CONSTRAINT `empleados_direccion_general_id_direcciones_generales_id_fk` FOREIGN KEY (`direccion_general_id`) REFERENCES `direcciones_generales`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `empleados` ADD CONSTRAINT `empleados_area_id_areas_id_fk` FOREIGN KEY (`area_id`) REFERENCES `areas`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `encargados_areas` ADD CONSTRAINT `encargados_areas_empleado_id_empleados_id_fk` FOREIGN KEY (`empleado_id`) REFERENCES `empleados`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `encargados_areas` ADD CONSTRAINT `encargados_areas_area_id_areas_id_fk` FOREIGN KEY (`area_id`) REFERENCES `areas`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `folios` ADD CONSTRAINT `folios_area_id_areas_id_fk` FOREIGN KEY (`area_id`) REFERENCES `areas`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `historial_ordenes` ADD CONSTRAINT `historial_ordenes_orden_servicio_id_ordenes_servicio_id_fk` FOREIGN KEY (`orden_servicio_id`) REFERENCES `ordenes_servicio`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invitaciones` ADD CONSTRAINT `invitaciones_empleado_id_empleados_id_fk` FOREIGN KEY (`empleado_id`) REFERENCES `empleados`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invitaciones` ADD CONSTRAINT `invitaciones_rol_id_roles_id_fk` FOREIGN KEY (`rol_id`) REFERENCES `roles`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invitaciones` ADD CONSTRAINT `invitaciones_invitador_id_usuarios_id_fk` FOREIGN KEY (`invitador_id`) REFERENCES `usuarios`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `observaciones` ADD CONSTRAINT `observaciones_orden_servicio_id_ordenes_servicio_id_fk` FOREIGN KEY (`orden_servicio_id`) REFERENCES `ordenes_servicio`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `observaciones` ADD CONSTRAINT `observaciones_creador_id_usuarios_id_fk` FOREIGN KEY (`creador_id`) REFERENCES `usuarios`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ordenes_servicio` ADD CONSTRAINT `ordenes_servicio_categoria_orden_id_categorias_orden_id_fk` FOREIGN KEY (`categoria_orden_id`) REFERENCES `categorias_orden`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ordenes_servicio` ADD CONSTRAINT `ordenes_servicio_empleado_solicitante_id_empleados_id_fk` FOREIGN KEY (`empleado_solicitante_id`) REFERENCES `empleados`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ordenes_servicio` ADD CONSTRAINT `ordenes_servicio_area_solicitante_id_areas_id_fk` FOREIGN KEY (`area_solicitante_id`) REFERENCES `areas`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ordenes_servicio` ADD CONSTRAINT `ordenes_servicio_area_asignada_id_areas_id_fk` FOREIGN KEY (`area_asignada_id`) REFERENCES `areas`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ordenes_servicio` ADD CONSTRAINT `ordenes_servicio_encargado_area_asignada_id_empleados_id_fk` FOREIGN KEY (`encargado_area_asignada_id`) REFERENCES `empleados`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ordenes_servicio` ADD CONSTRAINT `ordenes_servicio_creado_por_id_usuarios_id_fk` FOREIGN KEY (`creado_por_id`) REFERENCES `usuarios`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ordenes_servicio` ADD CONSTRAINT `ordenes_servicio_cerrado_por_id_usuarios_id_fk` FOREIGN KEY (`cerrado_por_id`) REFERENCES `usuarios`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ordenes_servicio` ADD CONSTRAINT `ordenes_servicio_cancelado_por_id_usuarios_id_fk` FOREIGN KEY (`cancelado_por_id`) REFERENCES `usuarios`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ordenes_servicio` ADD CONSTRAINT `orden_servicio_relacionado_id_fk` FOREIGN KEY (`orden_servicio_relacionado_id`) REFERENCES `ordenes_servicio`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `roles_permisos` ADD CONSTRAINT `roles_permisos_rol_id_roles_id_fk` FOREIGN KEY (`rol_id`) REFERENCES `roles`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `roles_permisos` ADD CONSTRAINT `roles_permisos_permiso_id_permisos_id_fk` FOREIGN KEY (`permiso_id`) REFERENCES `permisos`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sesiones` ADD CONSTRAINT `sesiones_usuario_id_usuarios_id_fk` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_empleado_id_empleados_id_fk` FOREIGN KEY (`empleado_id`) REFERENCES `empleados`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_rol_id_roles_id_fk` FOREIGN KEY (`rol_id`) REFERENCES `roles`(`id`) ON DELETE restrict ON UPDATE no action;