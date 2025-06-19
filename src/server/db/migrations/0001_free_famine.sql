CREATE TABLE `carta_clients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`company_name` text,
	`contact_name` text,
	`phone` text,
	`email` text,
	`address` text,
	`created_at` integer DEFAULT '"2025-06-19T10:34:50.638Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-06-19T10:34:50.638Z"' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `client_idx` ON `carta_clients` (`company_name`,`contact_name`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_carta_documents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text(64),
	`content` text,
	`created_at` integer DEFAULT '"2025-06-19T10:34:50.637Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-06-19T10:34:50.637Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_carta_documents`("id", "title", "content", "created_at", "updated_at") SELECT "id", "title", "content", "created_at", "updated_at" FROM `carta_documents`;--> statement-breakpoint
DROP TABLE `carta_documents`;--> statement-breakpoint
ALTER TABLE `__new_carta_documents` RENAME TO `carta_documents`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `title_idx` ON `carta_documents` (`title`);