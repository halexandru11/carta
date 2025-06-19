CREATE TABLE `carta_templates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text(64),
	`content` text,
	`created_at` integer DEFAULT '"2025-06-19T11:10:11.292Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-06-19T11:10:11.292Z"' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `template_title_idx` ON `carta_templates` (`title`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_carta_clients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`company_name` text,
	`contact_name` text,
	`phone` text,
	`email` text,
	`address` text,
	`created_at` integer DEFAULT '"2025-06-19T11:10:11.292Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-06-19T11:10:11.292Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_carta_clients`("id", "company_name", "contact_name", "phone", "email", "address", "created_at", "updated_at") SELECT "id", "company_name", "contact_name", "phone", "email", "address", "created_at", "updated_at" FROM `carta_clients`;--> statement-breakpoint
DROP TABLE `carta_clients`;--> statement-breakpoint
ALTER TABLE `__new_carta_clients` RENAME TO `carta_clients`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `client_idx` ON `carta_clients` (`company_name`,`contact_name`);--> statement-breakpoint
CREATE TABLE `__new_carta_documents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text(64),
	`content` text,
	`created_at` integer DEFAULT '"2025-06-19T11:10:11.291Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-06-19T11:10:11.291Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_carta_documents`("id", "title", "content", "created_at", "updated_at") SELECT "id", "title", "content", "created_at", "updated_at" FROM `carta_documents`;--> statement-breakpoint
DROP TABLE `carta_documents`;--> statement-breakpoint
ALTER TABLE `__new_carta_documents` RENAME TO `carta_documents`;--> statement-breakpoint
CREATE INDEX `title_idx` ON `carta_documents` (`title`);