-- Add unsubscribe + double-opt-in tokens to newsletter_subscribers.
-- unsubscribeToken: random URL-safe token; included in every campaign email's
--   one-click unsubscribe link (legally required for marketing emails in EU).
-- confirmedAt: timestamp set when user clicks confirmation link (NULL = pending).
--   Single-opt-in flows can leave this NULL forever, no harm.
--
-- TiDB note: UNIQUE constraint is added via separate CREATE UNIQUE INDEX
-- because TiDB doesn't support inline UNIQUE during ADD COLUMN.

ALTER TABLE `newsletter_subscribers` ADD COLUMN `unsubscribeToken` VARCHAR(64);
--> statement-breakpoint
ALTER TABLE `newsletter_subscribers` ADD COLUMN `confirmedAt` TIMESTAMP NULL;
--> statement-breakpoint
UPDATE `newsletter_subscribers` SET `unsubscribeToken` = SUBSTRING(MD5(CONCAT(id, RAND())), 1, 32) WHERE `unsubscribeToken` IS NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX `uniq_newsletter_unsub_token` ON `newsletter_subscribers` (`unsubscribeToken`);
