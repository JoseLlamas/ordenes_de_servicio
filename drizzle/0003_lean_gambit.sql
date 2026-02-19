ALTER TABLE `observaciones` MODIFY COLUMN `creado_en` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `ordenes_servicio` ADD `firma_empleado_solicitante` text;