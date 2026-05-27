-- Social media integration: connected accounts + per-post share drafts.
-- LinkedIn, Facebook, Instagram. One row per platform in `social_accounts`
-- holds the OAuth tokens; `social_posts` is the per-blog-post share copy
-- with the publishing status the admin UI surfaces.

CREATE TABLE IF NOT EXISTS `social_accounts` (
  `id` int AUTO_INCREMENT NOT NULL,
  `platform` enum('linkedin','facebook','instagram') NOT NULL,
  `accountName` varchar(256),
  `accountId` varchar(256),
  `accessToken` text,
  `refreshToken` text,
  `expiresAt` timestamp NULL,
  `scope` text,
  `isActive` boolean NOT NULL DEFAULT true,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_social_accounts_platform` (`platform`)
);

CREATE TABLE IF NOT EXISTS `social_posts` (
  `id` int AUTO_INCREMENT NOT NULL,
  `postId` int NOT NULL,
  `platform` enum('linkedin','facebook','instagram') NOT NULL,
  `copy` text NOT NULL,
  `status` enum('draft','published','failed') NOT NULL DEFAULT 'draft',
  `externalPostId` varchar(256),
  `externalUrl` text,
  `error` text,
  `publishedAt` timestamp NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_social_posts_post_platform` (`postId`, `platform`),
  KEY `idx_social_posts_status` (`status`)
);
