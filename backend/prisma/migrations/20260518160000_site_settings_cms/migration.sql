-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "maintenance_mode" BOOLEAN NOT NULL DEFAULT false,
    "maintenance_title" TEXT NOT NULL DEFAULT 'We''ll be back soon',
    "maintenance_message" TEXT NOT NULL DEFAULT 'The Ananse Center website is undergoing scheduled updates. Thank you for your patience.',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_blocks" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "section" TEXT NOT NULL DEFAULT 'general',
    "body" TEXT NOT NULL,
    "format" TEXT NOT NULL DEFAULT 'plain',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "content_blocks_key_key" ON "content_blocks"("key");
