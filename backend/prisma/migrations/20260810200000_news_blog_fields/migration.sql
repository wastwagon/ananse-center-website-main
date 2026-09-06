-- Full blog/news management fields
ALTER TABLE "news_posts" ADD COLUMN IF NOT EXISTS "author" TEXT NOT NULL DEFAULT '';
ALTER TABLE "news_posts" ADD COLUMN IF NOT EXISTS "category" TEXT NOT NULL DEFAULT 'News';
ALTER TABLE "news_posts" ADD COLUMN IF NOT EXISTS "featured" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "news_posts" ADD COLUMN IF NOT EXISTS "cover_media_id" TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'news_posts_cover_media_id_fkey'
  ) THEN
    ALTER TABLE "news_posts"
      ADD CONSTRAINT "news_posts_cover_media_id_fkey"
      FOREIGN KEY ("cover_media_id") REFERENCES "media_assets"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "news_posts_featured_published_idx" ON "news_posts"("featured", "published");
