-- Track outbound email campaigns. One row per campaign send.
-- recipientCount: how many subscribers were targeted at send time (snapshot).
-- sentCount/failedCount: tally of Resend per-email send results.
-- segment: optional filter applied (NULL = sent to all active subscribers).

CREATE TABLE `email_campaigns` (
  `id` int AUTO_INCREMENT NOT NULL,
  `subject` varchar(512) NOT NULL,
  `html` text NOT NULL,
  `text` text,
  `segment` varchar(128),
  `recipientCount` int DEFAULT 0 NOT NULL,
  `sentCount` int DEFAULT 0 NOT NULL,
  `failedCount` int DEFAULT 0 NOT NULL,
  `status` varchar(32) DEFAULT 'draft' NOT NULL,
  `sentAt` timestamp NULL,
  `sentByUserId` int,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `email_campaigns_id` PRIMARY KEY(`id`)
);
