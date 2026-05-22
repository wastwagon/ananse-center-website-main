-- Roadmap: integrations, registrations, community submissions
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "lms_portal_url" TEXT NOT NULL DEFAULT '';
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "google_analytics_id" TEXT NOT NULL DEFAULT '';
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "legacy_redirect_host" TEXT NOT NULL DEFAULT 'anansecenter.oceancyber.site';

CREATE TABLE IF NOT EXISTS "event_registrations" (
    "id" TEXT NOT NULL,
    "event_slug" TEXT NOT NULL DEFAULT '',
    "event_title" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "event_registrations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "community_submissions" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'story',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "community_submissions_pkey" PRIMARY KEY ("id")
);
