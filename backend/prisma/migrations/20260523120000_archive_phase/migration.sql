-- Phase P5: searchable archives + spotlight org field
ALTER TABLE "community_submissions" ADD COLUMN IF NOT EXISTS "org" TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS "archive_records" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "culture" TEXT NOT NULL DEFAULT '',
    "era" TEXT NOT NULL DEFAULT '',
    "rights_note" TEXT NOT NULL DEFAULT '',
    "tags" JSONB NOT NULL DEFAULT '[]',
    "media_url" TEXT NOT NULL DEFAULT '',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "archive_records_pkey" PRIMARY KEY ("id")
);
