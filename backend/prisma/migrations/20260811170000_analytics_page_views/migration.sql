-- CreateTable
CREATE TABLE "analytics_page_views" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "referrer" TEXT NOT NULL DEFAULT '',
    "session_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_page_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "analytics_page_views_created_at_idx" ON "analytics_page_views"("created_at");

-- CreateIndex
CREATE INDEX "analytics_page_views_path_created_at_idx" ON "analytics_page_views"("path", "created_at");

-- CreateIndex
CREATE INDEX "analytics_page_views_session_id_created_at_idx" ON "analytics_page_views"("session_id", "created_at");
