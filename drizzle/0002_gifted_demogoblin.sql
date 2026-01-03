ALTER TABLE `historial_ordenes` DROP FOREIGN KEY `historial_ordenes_creado_por_usuarios_id_fk`;
--> statement-breakpoint
ALTER TABLE `historial_ordenes` DROP COLUMN `creado_por`;--> statement-breakpoint
ALTER TABLE `historial_ordenes` DROP COLUMN `creado_en`;