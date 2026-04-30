-- i18n support: add EN/ZH columns to all public-facing tables.
-- HU remains the default/fallback via the existing columns.
-- All new columns are nullable; client falls back to HU when null.

-- pages
ALTER TABLE `pages` ADD COLUMN `titleEn` VARCHAR(512);
--> statement-breakpoint
ALTER TABLE `pages` ADD COLUMN `titleZh` VARCHAR(512);
--> statement-breakpoint
ALTER TABLE `pages` ADD COLUMN `metaTitleEn` VARCHAR(512);
--> statement-breakpoint
ALTER TABLE `pages` ADD COLUMN `metaTitleZh` VARCHAR(512);
--> statement-breakpoint
ALTER TABLE `pages` ADD COLUMN `metaDescriptionEn` TEXT;
--> statement-breakpoint
ALTER TABLE `pages` ADD COLUMN `metaDescriptionZh` TEXT;
--> statement-breakpoint
ALTER TABLE `pages` ADD COLUMN `ogTitleEn` VARCHAR(512);
--> statement-breakpoint
ALTER TABLE `pages` ADD COLUMN `ogTitleZh` VARCHAR(512);
--> statement-breakpoint
ALTER TABLE `pages` ADD COLUMN `ogDescriptionEn` TEXT;
--> statement-breakpoint
ALTER TABLE `pages` ADD COLUMN `ogDescriptionZh` TEXT;
--> statement-breakpoint
ALTER TABLE `pages` ADD COLUMN `keywordsEn` TEXT;
--> statement-breakpoint
ALTER TABLE `pages` ADD COLUMN `keywordsZh` TEXT;
--> statement-breakpoint

-- categories
ALTER TABLE `categories` ADD COLUMN `nameEn` VARCHAR(256);
--> statement-breakpoint
ALTER TABLE `categories` ADD COLUMN `nameZh` VARCHAR(256);
--> statement-breakpoint
ALTER TABLE `categories` ADD COLUMN `descriptionEn` TEXT;
--> statement-breakpoint
ALTER TABLE `categories` ADD COLUMN `descriptionZh` TEXT;
--> statement-breakpoint

-- posts
ALTER TABLE `posts` ADD COLUMN `titleEn` VARCHAR(512);
--> statement-breakpoint
ALTER TABLE `posts` ADD COLUMN `titleZh` VARCHAR(512);
--> statement-breakpoint
ALTER TABLE `posts` ADD COLUMN `excerptEn` TEXT;
--> statement-breakpoint
ALTER TABLE `posts` ADD COLUMN `excerptZh` TEXT;
--> statement-breakpoint
ALTER TABLE `posts` ADD COLUMN `contentEn` TEXT;
--> statement-breakpoint
ALTER TABLE `posts` ADD COLUMN `contentZh` TEXT;
--> statement-breakpoint
ALTER TABLE `posts` ADD COLUMN `metaTitleEn` VARCHAR(512);
--> statement-breakpoint
ALTER TABLE `posts` ADD COLUMN `metaTitleZh` VARCHAR(512);
--> statement-breakpoint
ALTER TABLE `posts` ADD COLUMN `metaDescriptionEn` TEXT;
--> statement-breakpoint
ALTER TABLE `posts` ADD COLUMN `metaDescriptionZh` TEXT;
--> statement-breakpoint

-- services
ALTER TABLE `services` ADD COLUMN `titleEn` VARCHAR(256);
--> statement-breakpoint
ALTER TABLE `services` ADD COLUMN `titleZh` VARCHAR(256);
--> statement-breakpoint
ALTER TABLE `services` ADD COLUMN `shortDescriptionEn` TEXT;
--> statement-breakpoint
ALTER TABLE `services` ADD COLUMN `shortDescriptionZh` TEXT;
--> statement-breakpoint
ALTER TABLE `services` ADD COLUMN `heroTitleEn` VARCHAR(512);
--> statement-breakpoint
ALTER TABLE `services` ADD COLUMN `heroTitleZh` VARCHAR(512);
--> statement-breakpoint
ALTER TABLE `services` ADD COLUMN `heroSubtitleEn` TEXT;
--> statement-breakpoint
ALTER TABLE `services` ADD COLUMN `heroSubtitleZh` TEXT;
--> statement-breakpoint
ALTER TABLE `services` ADD COLUMN `contentEn` TEXT;
--> statement-breakpoint
ALTER TABLE `services` ADD COLUMN `contentZh` TEXT;
--> statement-breakpoint
ALTER TABLE `services` ADD COLUMN `metaTitleEn` VARCHAR(512);
--> statement-breakpoint
ALTER TABLE `services` ADD COLUMN `metaTitleZh` VARCHAR(512);
--> statement-breakpoint
ALTER TABLE `services` ADD COLUMN `metaDescriptionEn` TEXT;
--> statement-breakpoint
ALTER TABLE `services` ADD COLUMN `metaDescriptionZh` TEXT;
--> statement-breakpoint

-- hero_slides
ALTER TABLE `hero_slides` ADD COLUMN `titleEn` VARCHAR(512);
--> statement-breakpoint
ALTER TABLE `hero_slides` ADD COLUMN `titleZh` VARCHAR(512);
--> statement-breakpoint
ALTER TABLE `hero_slides` ADD COLUMN `subtitleEn` VARCHAR(512);
--> statement-breakpoint
ALTER TABLE `hero_slides` ADD COLUMN `subtitleZh` VARCHAR(512);
--> statement-breakpoint
ALTER TABLE `hero_slides` ADD COLUMN `ctaPrimaryTextEn` VARCHAR(256);
--> statement-breakpoint
ALTER TABLE `hero_slides` ADD COLUMN `ctaPrimaryTextZh` VARCHAR(256);
--> statement-breakpoint
ALTER TABLE `hero_slides` ADD COLUMN `ctaSecondaryTextEn` VARCHAR(256);
--> statement-breakpoint
ALTER TABLE `hero_slides` ADD COLUMN `ctaSecondaryTextZh` VARCHAR(256);
--> statement-breakpoint

-- testimonials
ALTER TABLE `testimonials` ADD COLUMN `quoteEn` TEXT;
--> statement-breakpoint
ALTER TABLE `testimonials` ADD COLUMN `quoteZh` TEXT;
--> statement-breakpoint
ALTER TABLE `testimonials` ADD COLUMN `authorTitleEn` VARCHAR(256);
--> statement-breakpoint
ALTER TABLE `testimonials` ADD COLUMN `authorTitleZh` VARCHAR(256);
--> statement-breakpoint

-- partners
ALTER TABLE `partners` ADD COLUMN `descriptionEn` TEXT;
--> statement-breakpoint
ALTER TABLE `partners` ADD COLUMN `descriptionZh` TEXT;
--> statement-breakpoint

-- industries
ALTER TABLE `industries` ADD COLUMN `nameEn` VARCHAR(256);
--> statement-breakpoint
ALTER TABLE `industries` ADD COLUMN `nameZh` VARCHAR(256);
--> statement-breakpoint
ALTER TABLE `industries` ADD COLUMN `descriptionEn` TEXT;
--> statement-breakpoint
ALTER TABLE `industries` ADD COLUMN `descriptionZh` TEXT;
--> statement-breakpoint

-- technologies
ALTER TABLE `technologies` ADD COLUMN `descriptionEn` TEXT;
--> statement-breakpoint
ALTER TABLE `technologies` ADD COLUMN `descriptionZh` TEXT;
--> statement-breakpoint

-- values
ALTER TABLE `values` ADD COLUMN `titleEn` VARCHAR(256);
--> statement-breakpoint
ALTER TABLE `values` ADD COLUMN `titleZh` VARCHAR(256);
--> statement-breakpoint
ALTER TABLE `values` ADD COLUMN `descriptionEn` TEXT;
--> statement-breakpoint
ALTER TABLE `values` ADD COLUMN `descriptionZh` TEXT;
--> statement-breakpoint

-- case_studies
ALTER TABLE `case_studies` ADD COLUMN `titleEn` VARCHAR(512);
--> statement-breakpoint
ALTER TABLE `case_studies` ADD COLUMN `titleZh` VARCHAR(512);
--> statement-breakpoint
ALTER TABLE `case_studies` ADD COLUMN `clientEn` VARCHAR(256);
--> statement-breakpoint
ALTER TABLE `case_studies` ADD COLUMN `clientZh` VARCHAR(256);
--> statement-breakpoint
ALTER TABLE `case_studies` ADD COLUMN `industryEn` VARCHAR(256);
--> statement-breakpoint
ALTER TABLE `case_studies` ADD COLUMN `industryZh` VARCHAR(256);
--> statement-breakpoint
ALTER TABLE `case_studies` ADD COLUMN `challengeEn` TEXT;
--> statement-breakpoint
ALTER TABLE `case_studies` ADD COLUMN `challengeZh` TEXT;
--> statement-breakpoint
ALTER TABLE `case_studies` ADD COLUMN `solutionEn` TEXT;
--> statement-breakpoint
ALTER TABLE `case_studies` ADD COLUMN `solutionZh` TEXT;
--> statement-breakpoint
ALTER TABLE `case_studies` ADD COLUMN `resultsEn` TEXT;
--> statement-breakpoint
ALTER TABLE `case_studies` ADD COLUMN `resultsZh` TEXT;
--> statement-breakpoint
ALTER TABLE `case_studies` ADD COLUMN `metaTitleEn` VARCHAR(512);
--> statement-breakpoint
ALTER TABLE `case_studies` ADD COLUMN `metaTitleZh` VARCHAR(512);
--> statement-breakpoint
ALTER TABLE `case_studies` ADD COLUMN `metaDescriptionEn` TEXT;
--> statement-breakpoint
ALTER TABLE `case_studies` ADD COLUMN `metaDescriptionZh` TEXT;
