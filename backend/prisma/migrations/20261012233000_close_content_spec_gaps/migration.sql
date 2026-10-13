-- Close content-spec gaps: summaries, keywords, share images, indexing,
-- original dates, multi-program insights, event insights, photo alt text.

ALTER TABLE "programs" ADD COLUMN "summary" TEXT NOT NULL DEFAULT '';
ALTER TABLE "programs" ADD COLUMN "keywords" TEXT NOT NULL DEFAULT '';
ALTER TABLE "programs" ADD COLUMN "noindex" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "programs" ADD COLUMN "share_media_id" TEXT;

ALTER TABLE "events" ADD COLUMN "keywords" TEXT NOT NULL DEFAULT '';
ALTER TABLE "events" ADD COLUMN "noindex" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "events" ADD COLUMN "share_media_id" TEXT;

ALTER TABLE "people" ADD COLUMN "expertise_topics" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "people" ADD COLUMN "keywords" TEXT NOT NULL DEFAULT '';
ALTER TABLE "people" ADD COLUMN "noindex" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "people" ADD COLUMN "share_media_id" TEXT;

ALTER TABLE "library_items" ADD COLUMN "original_at" TIMESTAMP(3);
ALTER TABLE "library_items" ADD COLUMN "noindex" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "library_items" ADD COLUMN "share_media_id" TEXT;

ALTER TABLE "photo_albums" ADD COLUMN "keywords" TEXT NOT NULL DEFAULT '';
ALTER TABLE "photo_albums" ADD COLUMN "noindex" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "photo_albums" ADD COLUMN "share_media_id" TEXT;

ALTER TABLE "photo_album_images" ADD COLUMN "alt_text" TEXT NOT NULL DEFAULT '';

ALTER TABLE "news_posts" ADD COLUMN "primary_topic" TEXT NOT NULL DEFAULT '';
ALTER TABLE "news_posts" ADD COLUMN "keywords" TEXT NOT NULL DEFAULT '';
ALTER TABLE "news_posts" ADD COLUMN "noindex" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "news_posts" ADD COLUMN "share_media_id" TEXT;

CREATE TABLE "insight_programs" (
    "news_post_id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    CONSTRAINT "insight_programs_pkey" PRIMARY KEY ("news_post_id","program_id")
);

CREATE TABLE "event_insights" (
    "event_id" TEXT NOT NULL,
    "news_post_id" TEXT NOT NULL,
    CONSTRAINT "event_insights_pkey" PRIMARY KEY ("event_id","news_post_id")
);

CREATE INDEX "programs_share_media_id_idx" ON "programs"("share_media_id");
CREATE INDEX "events_share_media_id_idx" ON "events"("share_media_id");
CREATE INDEX "people_share_media_id_idx" ON "people"("share_media_id");
CREATE INDEX "library_items_share_media_id_idx" ON "library_items"("share_media_id");
CREATE INDEX "photo_albums_share_media_id_idx" ON "photo_albums"("share_media_id");
CREATE INDEX "news_posts_share_media_id_idx" ON "news_posts"("share_media_id");
CREATE INDEX "insight_programs_program_id_idx" ON "insight_programs"("program_id");
CREATE INDEX "event_insights_news_post_id_idx" ON "event_insights"("news_post_id");

ALTER TABLE "programs" ADD CONSTRAINT "programs_share_media_id_fkey" FOREIGN KEY ("share_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "events" ADD CONSTRAINT "events_share_media_id_fkey" FOREIGN KEY ("share_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "people" ADD CONSTRAINT "people_share_media_id_fkey" FOREIGN KEY ("share_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "library_items" ADD CONSTRAINT "library_items_share_media_id_fkey" FOREIGN KEY ("share_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "photo_albums" ADD CONSTRAINT "photo_albums_share_media_id_fkey" FOREIGN KEY ("share_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "news_posts" ADD CONSTRAINT "news_posts_share_media_id_fkey" FOREIGN KEY ("share_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "insight_programs" ADD CONSTRAINT "insight_programs_news_post_id_fkey" FOREIGN KEY ("news_post_id") REFERENCES "news_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "insight_programs" ADD CONSTRAINT "insight_programs_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "event_insights" ADD CONSTRAINT "event_insights_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "event_insights" ADD CONSTRAINT "event_insights_news_post_id_fkey" FOREIGN KEY ("news_post_id") REFERENCES "news_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
