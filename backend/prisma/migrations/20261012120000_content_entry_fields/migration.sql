-- Content-entry fields, per-record SEO, and slug redirects.

ALTER TABLE "programs" ADD COLUMN "tagline" TEXT NOT NULL DEFAULT '';
ALTER TABLE "programs" ADD COLUMN "cta_label" TEXT NOT NULL DEFAULT '';
ALTER TABLE "programs" ADD COLUMN "cta_href" TEXT NOT NULL DEFAULT '';
ALTER TABLE "programs" ADD COLUMN "topics" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "programs" ADD COLUMN "seo_title" TEXT NOT NULL DEFAULT '';
ALTER TABLE "programs" ADD COLUMN "seo_description" TEXT NOT NULL DEFAULT '';
ALTER TABLE "programs" ADD COLUMN "lead_person_id" TEXT;

ALTER TABLE "events" ADD COLUMN "cost" TEXT NOT NULL DEFAULT '';
ALTER TABLE "events" ADD COLUMN "registration_url" TEXT NOT NULL DEFAULT '';
ALTER TABLE "events" ADD COLUMN "organizer" TEXT NOT NULL DEFAULT '';
ALTER TABLE "events" ADD COLUMN "time_zone" TEXT NOT NULL DEFAULT '';
ALTER TABLE "events" ADD COLUMN "seo_title" TEXT NOT NULL DEFAULT '';
ALTER TABLE "events" ADD COLUMN "seo_description" TEXT NOT NULL DEFAULT '';

ALTER TABLE "people" ADD COLUMN "preferred_name" TEXT NOT NULL DEFAULT '';
ALTER TABLE "people" ADD COLUMN "full_bio" TEXT NOT NULL DEFAULT '';
ALTER TABLE "people" ADD COLUMN "consent_confirmed" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "people" ADD COLUMN "social_links" TEXT NOT NULL DEFAULT '';
ALTER TABLE "people" ADD COLUMN "seo_title" TEXT NOT NULL DEFAULT '';
ALTER TABLE "people" ADD COLUMN "seo_description" TEXT NOT NULL DEFAULT '';

ALTER TABLE "library_items" ADD COLUMN "duration" TEXT NOT NULL DEFAULT '';
ALTER TABLE "library_items" ADD COLUMN "rights_note" TEXT NOT NULL DEFAULT '';
ALTER TABLE "library_items" ADD COLUMN "seo_title" TEXT NOT NULL DEFAULT '';
ALTER TABLE "library_items" ADD COLUMN "seo_description" TEXT NOT NULL DEFAULT '';

ALTER TABLE "photo_albums" ADD COLUMN "photographer" TEXT NOT NULL DEFAULT '';
ALTER TABLE "photo_albums" ADD COLUMN "rights_note" TEXT NOT NULL DEFAULT '';
ALTER TABLE "photo_albums" ADD COLUMN "seo_title" TEXT NOT NULL DEFAULT '';
ALTER TABLE "photo_albums" ADD COLUMN "seo_description" TEXT NOT NULL DEFAULT '';

ALTER TABLE "news_posts" ADD COLUMN "image_credit" TEXT NOT NULL DEFAULT '';
ALTER TABLE "news_posts" ADD COLUMN "pull_quote" TEXT NOT NULL DEFAULT '';
ALTER TABLE "news_posts" ADD COLUMN "seo_title" TEXT NOT NULL DEFAULT '';
ALTER TABLE "news_posts" ADD COLUMN "seo_description" TEXT NOT NULL DEFAULT '';

CREATE TABLE "path_redirects" (
    "id" TEXT NOT NULL,
    "from_path" TEXT NOT NULL,
    "to_path" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "path_redirects_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "path_redirects_from_path_key" ON "path_redirects"("from_path");
CREATE INDEX "path_redirects_to_path_idx" ON "path_redirects"("to_path");
CREATE INDEX "programs_lead_person_id_idx" ON "programs"("lead_person_id");

ALTER TABLE "programs" ADD CONSTRAINT "programs_lead_person_id_fkey" FOREIGN KEY ("lead_person_id") REFERENCES "people"("id") ON DELETE SET NULL ON UPDATE CASCADE;
