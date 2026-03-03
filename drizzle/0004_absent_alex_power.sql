CREATE TABLE `experiences` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`company_name` text NOT NULL,
	`role` text NOT NULL,
	`duration` text NOT NULL,
	`location` text NOT NULL,
	`description` text NOT NULL,
	`skills` text NOT NULL,
	`order` integer DEFAULT 0,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
ALTER TABLE `blogs` ADD `updated_at` integer DEFAULT 0;
--> statement-breakpoint
UPDATE `blogs` SET `updated_at` = (strftime('%s', 'now')) WHERE `updated_at` = 0;