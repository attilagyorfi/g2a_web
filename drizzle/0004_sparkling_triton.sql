CREATE TABLE `ai_jobs` (
	`id` varchar(36) NOT NULL,
	`type` varchar(32) NOT NULL,
	`status` enum('pending','running','completed','failed') NOT NULL DEFAULT 'pending',
	`phase` varchar(64),
	`completedSteps` int NOT NULL DEFAULT 0,
	`totalSteps` int NOT NULL DEFAULT 6,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ai_jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `email_campaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subject` varchar(512) NOT NULL,
	`html` text NOT NULL,
	`text` text,
	`segment` varchar(128),
	`recipientCount` int NOT NULL DEFAULT 0,
	`sentCount` int NOT NULL DEFAULT 0,
	`failedCount` int NOT NULL DEFAULT 0,
	`status` varchar(32) NOT NULL DEFAULT 'draft',
	`sentAt` timestamp,
	`sentByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `email_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaignId` int,
	`recipient` varchar(320) NOT NULL,
	`eventType` varchar(64) NOT NULL,
	`resendMessageId` varchar(128),
	`rawData` text,
	`receivedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rate_limit_hits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bucketKey` varchar(192) NOT NULL,
	`hitAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rate_limit_hits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `social_accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`platform` enum('linkedin','facebook','instagram') NOT NULL,
	`accountName` varchar(256),
	`accountId` varchar(256),
	`accessToken` text,
	`refreshToken` text,
	`expiresAt` timestamp,
	`scope` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `social_accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `social_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`platform` enum('linkedin','facebook','instagram') NOT NULL,
	`copy` text NOT NULL,
	`status` enum('draft','published','failed') NOT NULL DEFAULT 'draft',
	`externalPostId` varchar(256),
	`externalUrl` text,
	`error` text,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `social_posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `case_studies` ADD `titleEn` varchar(512);--> statement-breakpoint
ALTER TABLE `case_studies` ADD `titleZh` varchar(512);--> statement-breakpoint
ALTER TABLE `case_studies` ADD `clientEn` varchar(256);--> statement-breakpoint
ALTER TABLE `case_studies` ADD `clientZh` varchar(256);--> statement-breakpoint
ALTER TABLE `case_studies` ADD `industryEn` varchar(256);--> statement-breakpoint
ALTER TABLE `case_studies` ADD `industryZh` varchar(256);--> statement-breakpoint
ALTER TABLE `case_studies` ADD `challengeEn` text;--> statement-breakpoint
ALTER TABLE `case_studies` ADD `challengeZh` text;--> statement-breakpoint
ALTER TABLE `case_studies` ADD `solutionEn` text;--> statement-breakpoint
ALTER TABLE `case_studies` ADD `solutionZh` text;--> statement-breakpoint
ALTER TABLE `case_studies` ADD `resultsEn` text;--> statement-breakpoint
ALTER TABLE `case_studies` ADD `resultsZh` text;--> statement-breakpoint
ALTER TABLE `case_studies` ADD `logoImage` text;--> statement-breakpoint
ALTER TABLE `case_studies` ADD `logoImageAlt` varchar(512);--> statement-breakpoint
ALTER TABLE `case_studies` ADD `gallery` text;--> statement-breakpoint
ALTER TABLE `case_studies` ADD `externalLinks` text;--> statement-breakpoint
ALTER TABLE `case_studies` ADD `projectYear` varchar(16);--> statement-breakpoint
ALTER TABLE `case_studies` ADD `metaTitleEn` varchar(512);--> statement-breakpoint
ALTER TABLE `case_studies` ADD `metaTitleZh` varchar(512);--> statement-breakpoint
ALTER TABLE `case_studies` ADD `metaDescriptionEn` text;--> statement-breakpoint
ALTER TABLE `case_studies` ADD `metaDescriptionZh` text;--> statement-breakpoint
ALTER TABLE `categories` ADD `nameEn` varchar(256);--> statement-breakpoint
ALTER TABLE `categories` ADD `nameZh` varchar(256);--> statement-breakpoint
ALTER TABLE `categories` ADD `descriptionEn` text;--> statement-breakpoint
ALTER TABLE `categories` ADD `descriptionZh` text;--> statement-breakpoint
ALTER TABLE `hero_slides` ADD `subtitleEn` varchar(512);--> statement-breakpoint
ALTER TABLE `hero_slides` ADD `subtitleZh` varchar(512);--> statement-breakpoint
ALTER TABLE `hero_slides` ADD `titleEn` varchar(512);--> statement-breakpoint
ALTER TABLE `hero_slides` ADD `titleZh` varchar(512);--> statement-breakpoint
ALTER TABLE `hero_slides` ADD `ctaPrimaryTextEn` varchar(256);--> statement-breakpoint
ALTER TABLE `hero_slides` ADD `ctaPrimaryTextZh` varchar(256);--> statement-breakpoint
ALTER TABLE `hero_slides` ADD `ctaSecondaryTextEn` varchar(256);--> statement-breakpoint
ALTER TABLE `hero_slides` ADD `ctaSecondaryTextZh` varchar(256);--> statement-breakpoint
ALTER TABLE `industries` ADD `nameEn` varchar(256);--> statement-breakpoint
ALTER TABLE `industries` ADD `nameZh` varchar(256);--> statement-breakpoint
ALTER TABLE `industries` ADD `descriptionEn` text;--> statement-breakpoint
ALTER TABLE `industries` ADD `descriptionZh` text;--> statement-breakpoint
ALTER TABLE `newsletter_subscribers` ADD `unsubscribeToken` varchar(64);--> statement-breakpoint
ALTER TABLE `newsletter_subscribers` ADD `confirmedAt` timestamp;--> statement-breakpoint
ALTER TABLE `pages` ADD `titleEn` varchar(512);--> statement-breakpoint
ALTER TABLE `pages` ADD `titleZh` varchar(512);--> statement-breakpoint
ALTER TABLE `pages` ADD `metaTitleEn` varchar(512);--> statement-breakpoint
ALTER TABLE `pages` ADD `metaTitleZh` varchar(512);--> statement-breakpoint
ALTER TABLE `pages` ADD `metaDescriptionEn` text;--> statement-breakpoint
ALTER TABLE `pages` ADD `metaDescriptionZh` text;--> statement-breakpoint
ALTER TABLE `pages` ADD `ogTitleEn` varchar(512);--> statement-breakpoint
ALTER TABLE `pages` ADD `ogTitleZh` varchar(512);--> statement-breakpoint
ALTER TABLE `pages` ADD `ogDescriptionEn` text;--> statement-breakpoint
ALTER TABLE `pages` ADD `ogDescriptionZh` text;--> statement-breakpoint
ALTER TABLE `pages` ADD `keywordsEn` text;--> statement-breakpoint
ALTER TABLE `pages` ADD `keywordsZh` text;--> statement-breakpoint
ALTER TABLE `partners` ADD `descriptionEn` text;--> statement-breakpoint
ALTER TABLE `partners` ADD `descriptionZh` text;--> statement-breakpoint
ALTER TABLE `posts` ADD `titleEn` varchar(512);--> statement-breakpoint
ALTER TABLE `posts` ADD `titleZh` varchar(512);--> statement-breakpoint
ALTER TABLE `posts` ADD `excerptEn` text;--> statement-breakpoint
ALTER TABLE `posts` ADD `excerptZh` text;--> statement-breakpoint
ALTER TABLE `posts` ADD `contentEn` text;--> statement-breakpoint
ALTER TABLE `posts` ADD `contentZh` text;--> statement-breakpoint
ALTER TABLE `posts` ADD `metaTitleEn` varchar(512);--> statement-breakpoint
ALTER TABLE `posts` ADD `metaTitleZh` varchar(512);--> statement-breakpoint
ALTER TABLE `posts` ADD `metaDescriptionEn` text;--> statement-breakpoint
ALTER TABLE `posts` ADD `metaDescriptionZh` text;--> statement-breakpoint
ALTER TABLE `services` ADD `titleEn` varchar(256);--> statement-breakpoint
ALTER TABLE `services` ADD `titleZh` varchar(256);--> statement-breakpoint
ALTER TABLE `services` ADD `shortDescriptionEn` text;--> statement-breakpoint
ALTER TABLE `services` ADD `shortDescriptionZh` text;--> statement-breakpoint
ALTER TABLE `services` ADD `heroTitleEn` varchar(512);--> statement-breakpoint
ALTER TABLE `services` ADD `heroTitleZh` varchar(512);--> statement-breakpoint
ALTER TABLE `services` ADD `heroSubtitleEn` text;--> statement-breakpoint
ALTER TABLE `services` ADD `heroSubtitleZh` text;--> statement-breakpoint
ALTER TABLE `services` ADD `contentEn` text;--> statement-breakpoint
ALTER TABLE `services` ADD `contentZh` text;--> statement-breakpoint
ALTER TABLE `services` ADD `metaTitleEn` varchar(512);--> statement-breakpoint
ALTER TABLE `services` ADD `metaTitleZh` varchar(512);--> statement-breakpoint
ALTER TABLE `services` ADD `metaDescriptionEn` text;--> statement-breakpoint
ALTER TABLE `services` ADD `metaDescriptionZh` text;--> statement-breakpoint
ALTER TABLE `technologies` ADD `descriptionEn` text;--> statement-breakpoint
ALTER TABLE `technologies` ADD `descriptionZh` text;--> statement-breakpoint
ALTER TABLE `testimonials` ADD `quoteEn` text;--> statement-breakpoint
ALTER TABLE `testimonials` ADD `quoteZh` text;--> statement-breakpoint
ALTER TABLE `testimonials` ADD `authorTitleEn` varchar(256);--> statement-breakpoint
ALTER TABLE `testimonials` ADD `authorTitleZh` varchar(256);--> statement-breakpoint
ALTER TABLE `values` ADD `titleEn` varchar(256);--> statement-breakpoint
ALTER TABLE `values` ADD `titleZh` varchar(256);--> statement-breakpoint
ALTER TABLE `values` ADD `descriptionEn` text;--> statement-breakpoint
ALTER TABLE `values` ADD `descriptionZh` text;--> statement-breakpoint
ALTER TABLE `newsletter_subscribers` ADD CONSTRAINT `newsletter_subscribers_unsubscribeToken_unique` UNIQUE(`unsubscribeToken`);