CREATE TABLE `carta_documents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text(64),
	`content` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `title_idx` ON `carta_documents` (`title`);