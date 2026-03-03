CREATE TABLE `blogs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`title` text NOT NULL,
	`description` text NOT NULL,
	`read_time` text NOT NULL,
	`type` text NOT NULL,
	`image_url` text NOT NULL
);
