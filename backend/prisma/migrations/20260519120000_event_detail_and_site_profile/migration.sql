-- Event detail CMS fields
ALTER TABLE "events" ADD COLUMN "venue" TEXT NOT NULL DEFAULT '';
ALTER TABLE "events" ADD COLUMN "story_title" TEXT;
ALTER TABLE "events" ADD COLUMN "story_body" TEXT;
ALTER TABLE "events" ADD COLUMN "highlights" JSONB NOT NULL DEFAULT '[]';

-- Site profile (contact & social) — not content blocks
ALTER TABLE "site_settings" ADD COLUMN "site_name" TEXT NOT NULL DEFAULT 'The Ananse Center for Arts and Culture';
ALTER TABLE "site_settings" ADD COLUMN "site_short_name" TEXT NOT NULL DEFAULT 'Ananse Center';
ALTER TABLE "site_settings" ADD COLUMN "site_tagline" TEXT NOT NULL DEFAULT 'Weaving wisdom into solutions';
ALTER TABLE "site_settings" ADD COLUMN "site_location" TEXT NOT NULL DEFAULT 'Accra, Ghana · West Africa';
ALTER TABLE "site_settings" ADD COLUMN "contact_phone" TEXT NOT NULL DEFAULT '+233 25 712 7205';
ALTER TABLE "site_settings" ADD COLUMN "contact_phone_href" TEXT NOT NULL DEFAULT 'tel:+233257127205';
ALTER TABLE "site_settings" ADD COLUMN "contact_email" TEXT NOT NULL DEFAULT 'info@anansecenter.org';
ALTER TABLE "site_settings" ADD COLUMN "programs_email" TEXT NOT NULL DEFAULT 'programs@anansecenter.org';
ALTER TABLE "site_settings" ADD COLUMN "contact_hours" TEXT NOT NULL DEFAULT 'Mon–Fri 9:00–17:00 · Sat 10:00–14:00';
ALTER TABLE "site_settings" ADD COLUMN "social_facebook" TEXT NOT NULL DEFAULT 'https://www.facebook.com/anansecenter';
ALTER TABLE "site_settings" ADD COLUMN "social_instagram" TEXT NOT NULL DEFAULT 'https://www.instagram.com/anansecenter';
ALTER TABLE "site_settings" ADD COLUMN "social_youtube" TEXT NOT NULL DEFAULT 'https://www.youtube.com/@anansecenter';
ALTER TABLE "site_settings" ADD COLUMN "social_twitter" TEXT NOT NULL DEFAULT 'https://twitter.com/anansecenter';
