-- Editorial workflow, related-content overrides, library downloads, album people.

ALTER TABLE "programs" ADD COLUMN "publication_status" TEXT NOT NULL DEFAULT 'draft';
ALTER TABLE "programs" ADD COLUMN "scheduled_at" TIMESTAMP(3);
ALTER TABLE "programs" ADD COLUMN "related_pinned" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "programs" ADD COLUMN "related_hidden" JSONB NOT NULL DEFAULT '{}';
UPDATE "programs" SET "publication_status" = CASE WHEN "published" THEN 'published' ELSE 'draft' END;

ALTER TABLE "events" ADD COLUMN "publication_status" TEXT NOT NULL DEFAULT 'draft';
ALTER TABLE "events" ADD COLUMN "scheduled_at" TIMESTAMP(3);
ALTER TABLE "events" ADD COLUMN "related_pinned" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "events" ADD COLUMN "related_hidden" JSONB NOT NULL DEFAULT '{}';
UPDATE "events" SET "publication_status" = CASE WHEN "published" THEN 'published' ELSE 'draft' END;

ALTER TABLE "people" ADD COLUMN "publication_status" TEXT NOT NULL DEFAULT 'draft';
ALTER TABLE "people" ADD COLUMN "scheduled_at" TIMESTAMP(3);
ALTER TABLE "people" ADD COLUMN "related_pinned" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "people" ADD COLUMN "related_hidden" JSONB NOT NULL DEFAULT '{}';
UPDATE "people" SET "publication_status" = CASE WHEN "published" THEN 'published' ELSE 'draft' END;

ALTER TABLE "library_items" ADD COLUMN "download_media_id" TEXT;
ALTER TABLE "library_items" ADD COLUMN "download_url" TEXT NOT NULL DEFAULT '';
ALTER TABLE "library_items" ADD COLUMN "publication_status" TEXT NOT NULL DEFAULT 'draft';
ALTER TABLE "library_items" ADD COLUMN "scheduled_at" TIMESTAMP(3);
ALTER TABLE "library_items" ADD COLUMN "related_pinned" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "library_items" ADD COLUMN "related_hidden" JSONB NOT NULL DEFAULT '{}';
UPDATE "library_items" SET "publication_status" = CASE WHEN "published" THEN 'published' ELSE 'draft' END;

ALTER TABLE "photo_albums" ADD COLUMN "publication_status" TEXT NOT NULL DEFAULT 'draft';
ALTER TABLE "photo_albums" ADD COLUMN "scheduled_at" TIMESTAMP(3);
ALTER TABLE "photo_albums" ADD COLUMN "related_pinned" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "photo_albums" ADD COLUMN "related_hidden" JSONB NOT NULL DEFAULT '{}';
UPDATE "photo_albums" SET "publication_status" = CASE WHEN "published" THEN 'published' ELSE 'draft' END;

ALTER TABLE "news_posts" ADD COLUMN "publication_status" TEXT NOT NULL DEFAULT 'draft';
ALTER TABLE "news_posts" ADD COLUMN "scheduled_at" TIMESTAMP(3);
ALTER TABLE "news_posts" ADD COLUMN "related_pinned" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "news_posts" ADD COLUMN "related_hidden" JSONB NOT NULL DEFAULT '{}';
UPDATE "news_posts" SET "publication_status" = CASE WHEN "published" THEN 'published' ELSE 'draft' END;

CREATE TABLE "photo_album_people" (
    "album_id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    CONSTRAINT "photo_album_people_pkey" PRIMARY KEY ("album_id","person_id")
);

CREATE INDEX "programs_publication_status_scheduled_at_idx" ON "programs"("publication_status", "scheduled_at");
CREATE INDEX "events_publication_status_scheduled_at_idx" ON "events"("publication_status", "scheduled_at");
CREATE INDEX "people_publication_status_scheduled_at_idx" ON "people"("publication_status", "scheduled_at");
CREATE INDEX "library_items_publication_status_scheduled_at_idx" ON "library_items"("publication_status", "scheduled_at");
CREATE INDEX "photo_albums_publication_status_scheduled_at_idx" ON "photo_albums"("publication_status", "scheduled_at");
CREATE INDEX "news_posts_publication_status_scheduled_at_idx" ON "news_posts"("publication_status", "scheduled_at");
CREATE INDEX "photo_album_people_person_id_idx" ON "photo_album_people"("person_id");

ALTER TABLE "library_items" ADD CONSTRAINT "library_items_download_media_id_fkey" FOREIGN KEY ("download_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "photo_album_people" ADD CONSTRAINT "photo_album_people_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "photo_albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "photo_album_people" ADD CONSTRAINT "photo_album_people_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;
