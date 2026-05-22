CREATE TABLE IF NOT EXISTS "news_posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "body" TEXT NOT NULL DEFAULT '',
    "date_label" TEXT NOT NULL DEFAULT '',
    "link_href" TEXT NOT NULL DEFAULT '',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_posts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "news_posts_slug_key" ON "news_posts"("slug");
CREATE INDEX IF NOT EXISTS "news_posts_published_sort_order_idx" ON "news_posts"("published", "sort_order");
