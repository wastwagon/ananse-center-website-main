-- LinkedIn and WhatsApp on site settings. Empty until ANANSE supplies the URLs.
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "social_linkedin" TEXT NOT NULL DEFAULT '';
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "social_whatsapp" TEXT NOT NULL DEFAULT '';
