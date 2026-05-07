-- Resend webhook events.
-- One row per Resend event (email.delivered, email.opened, email.clicked,
-- email.bounced, email.complained, email.delivery_delayed). The webhook
-- handler attributes events to campaigns via the `campaign_id` tag set by
-- the campaign-send loop. Transactional emails (audit, contact, welcome)
-- get a NULL campaignId — still logged for deliverability monitoring.

CREATE TABLE IF NOT EXISTS `email_events` (
  `id` int AUTO_INCREMENT NOT NULL,
  `campaignId` int,
  `recipient` varchar(320) NOT NULL,
  `eventType` varchar(64) NOT NULL,
  `resendMessageId` varchar(128),
  `rawData` text,
  `receivedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email_events_campaign` (`campaignId`),
  KEY `idx_email_events_message` (`resendMessageId`),
  KEY `idx_email_events_recipient` (`recipient`)
);
