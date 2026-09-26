-- Stage B: Event delivery/status/program, Insights topics, People, Library, Photo albums

-- Events
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "event_status" TEXT NOT NULL DEFAULT 'scheduled';
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "delivery_mode" TEXT NOT NULL DEFAULT 'in_person';
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "meeting_url" TEXT NOT NULL DEFAULT '';
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "recording_url" TEXT NOT NULL DEFAULT '';
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "gallery_media_ids" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "program_id" TEXT;
ALTER TABLE "events" ALTER COLUMN "image_emoji" SET DEFAULT '📅';

CREATE INDEX IF NOT EXISTS "events_published_starts_at_idx" ON "events"("published", "starts_at");
CREATE INDEX IF NOT EXISTS "events_program_id_idx" ON "events"("program_id");

DO $$ BEGIN
  ALTER TABLE "events" ADD CONSTRAINT "events_program_id_fkey"
    FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- News / Insights
ALTER TABLE "news_posts" ADD COLUMN IF NOT EXISTS "content_type" TEXT NOT NULL DEFAULT 'Articles';
ALTER TABLE "news_posts" ADD COLUMN IF NOT EXISTS "topics" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "news_posts" ADD COLUMN IF NOT EXISTS "show_in_library_read" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "news_posts" ALTER COLUMN "category" SET DEFAULT 'Articles';

-- People
CREATE TABLE IF NOT EXISTS "people" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "role_title" TEXT NOT NULL DEFAULT '',
  "bio" TEXT NOT NULL DEFAULT '',
  "groups" JSONB NOT NULL DEFAULT '[]',
  "is_organization" BOOLEAN NOT NULL DEFAULT false,
  "organization_name" TEXT NOT NULL DEFAULT '',
  "website_url" TEXT NOT NULL DEFAULT '',
  "photo_media_id" TEXT,
  "logo_media_id" TEXT,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "people_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "people_slug_key" ON "people"("slug");
CREATE INDEX IF NOT EXISTS "people_published_sort_order_idx" ON "people"("published", "sort_order");
CREATE INDEX IF NOT EXISTS "people_featured_published_idx" ON "people"("featured", "published");

DO $$ BEGIN
  ALTER TABLE "people" ADD CONSTRAINT "people_photo_media_id_fkey"
    FOREIGN KEY ("photo_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "people" ADD CONSTRAINT "people_logo_media_id_fkey"
    FOREIGN KEY ("logo_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Library items
CREATE TABLE IF NOT EXISTS "library_items" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT NOT NULL DEFAULT '',
  "shelf" TEXT NOT NULL,
  "collection" TEXT NOT NULL,
  "body" TEXT NOT NULL DEFAULT '',
  "transcript" TEXT NOT NULL DEFAULT '',
  "further_study" TEXT NOT NULL DEFAULT '',
  "wisdom_nugget" TEXT NOT NULL DEFAULT '',
  "scripture_theme" TEXT NOT NULL DEFAULT '',
  "episode_number" INTEGER,
  "date_label" TEXT NOT NULL DEFAULT '',
  "published_at" TIMESTAMP(3),
  "topics" JSONB NOT NULL DEFAULT '[]',
  "program_id" TEXT,
  "person_id" TEXT,
  "news_post_id" TEXT,
  "cover_media_id" TEXT,
  "audio_media_id" TEXT,
  "video_media_id" TEXT,
  "audio_url" TEXT NOT NULL DEFAULT '',
  "video_url" TEXT NOT NULL DEFAULT '',
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "library_items_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "library_items_slug_key" ON "library_items"("slug");
CREATE INDEX IF NOT EXISTS "library_items_shelf_published_sort_order_idx" ON "library_items"("shelf", "published", "sort_order");
CREATE INDEX IF NOT EXISTS "library_items_collection_published_idx" ON "library_items"("collection", "published");
CREATE INDEX IF NOT EXISTS "library_items_episode_number_idx" ON "library_items"("episode_number");

DO $$ BEGIN
  ALTER TABLE "library_items" ADD CONSTRAINT "library_items_program_id_fkey"
    FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "library_items" ADD CONSTRAINT "library_items_person_id_fkey"
    FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "library_items" ADD CONSTRAINT "library_items_news_post_id_fkey"
    FOREIGN KEY ("news_post_id") REFERENCES "news_posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "library_items" ADD CONSTRAINT "library_items_cover_media_id_fkey"
    FOREIGN KEY ("cover_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "library_items" ADD CONSTRAINT "library_items_audio_media_id_fkey"
    FOREIGN KEY ("audio_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "library_items" ADD CONSTRAINT "library_items_video_media_id_fkey"
    FOREIGN KEY ("video_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Photo albums
CREATE TABLE IF NOT EXISTS "photo_albums" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT NOT NULL DEFAULT '',
  "date_label" TEXT NOT NULL DEFAULT '',
  "place" TEXT NOT NULL DEFAULT '',
  "collection" TEXT NOT NULL DEFAULT 'Events',
  "program_id" TEXT,
  "event_id" TEXT,
  "cover_media_id" TEXT,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "photo_albums_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "photo_albums_slug_key" ON "photo_albums"("slug");
CREATE INDEX IF NOT EXISTS "photo_albums_collection_published_sort_order_idx" ON "photo_albums"("collection", "published", "sort_order");

DO $$ BEGIN
  ALTER TABLE "photo_albums" ADD CONSTRAINT "photo_albums_program_id_fkey"
    FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "photo_albums" ADD CONSTRAINT "photo_albums_event_id_fkey"
    FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "photo_albums" ADD CONSTRAINT "photo_albums_cover_media_id_fkey"
    FOREIGN KEY ("cover_media_id") REFERENCES "media_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "photo_album_images" (
  "id" TEXT NOT NULL,
  "album_id" TEXT NOT NULL,
  "media_id" TEXT NOT NULL,
  "caption" TEXT NOT NULL DEFAULT '',
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "photo_album_images_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "photo_album_images_album_id_sort_order_idx" ON "photo_album_images"("album_id", "sort_order");

DO $$ BEGIN
  ALTER TABLE "photo_album_images" ADD CONSTRAINT "photo_album_images_album_id_fkey"
    FOREIGN KEY ("album_id") REFERENCES "photo_albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "photo_album_images" ADD CONSTRAINT "photo_album_images_media_id_fkey"
    FOREIGN KEY ("media_id") REFERENCES "media_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
