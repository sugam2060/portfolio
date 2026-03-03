CREATE TABLE `about_section` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`heading` text NOT NULL,
	`sub_heading` text NOT NULL,
	`focus_on` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
CREATE TABLE `expertise` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`heading` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
CREATE TABLE `hero_section` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`heading` text NOT NULL,
	`sub_heading` text NOT NULL,
	`img_text_heading` text NOT NULL,
	`img_text_sub_heading` text NOT NULL,
	`image_url` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
