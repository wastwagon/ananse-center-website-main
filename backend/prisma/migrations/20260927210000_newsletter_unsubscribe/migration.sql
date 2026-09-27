-- Newsletter delivery: subscription status and a per-address unsubscribe token.
ALTER TABLE "newsletter_subscribers"
  ADD COLUMN "status" TEXT NOT NULL DEFAULT 'subscribed',
  ADD COLUMN "unsubscribe_token" TEXT,
  ADD COLUMN "unsubscribed_at" TIMESTAMP(3);

UPDATE "newsletter_subscribers"
SET "unsubscribe_token" = md5(random()::text || "id")
WHERE "unsubscribe_token" IS NULL;

ALTER TABLE "newsletter_subscribers"
  ALTER COLUMN "unsubscribe_token" SET NOT NULL;

CREATE UNIQUE INDEX "newsletter_subscribers_unsubscribe_token_key"
  ON "newsletter_subscribers"("unsubscribe_token");
