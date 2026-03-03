CREATE TABLE `messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`is_read` integer DEFAULT false,
	`created_at` integer DEFAULT (strftime('%s', 'now'))
);
