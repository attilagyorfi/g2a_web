-- Sliding-window rate limit storage.
-- Each row is one submission attempt to a public form. The limiter counts
-- rows in a bucket (`bucketKey`) within a time window (`hitAt`). Used instead
-- of in-process memory because Vercel serverless cold starts wipe state, and
-- regional parallel instances each keep their own counter.

CREATE TABLE IF NOT EXISTS `rate_limit_hits` (
  `id` int AUTO_INCREMENT NOT NULL,
  `bucketKey` varchar(192) NOT NULL,
  `hitAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_rate_limit_bucket_time` (`bucketKey`, `hitAt`)
);
