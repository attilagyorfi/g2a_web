ALTER TABLE `newsletter_subscribers` ADD `segment` varchar(128);--> statement-breakpoint
ALTER TABLE `newsletter_subscribers` ADD `source` varchar(128);--> statement-breakpoint
ALTER TABLE `newsletter_subscribers` ADD `tags` text;--> statement-breakpoint
ALTER TABLE `pages` ADD `keywords` text;