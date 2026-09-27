-- Template fields that connect programs, events, people, insights, and library items.

ALTER TABLE "events" ADD COLUMN "audio_url" TEXT NOT NULL DEFAULT '';
ALTER TABLE "events" ADD COLUMN "transcript" TEXT NOT NULL DEFAULT '';
ALTER TABLE "events" ADD COLUMN "subtitle" TEXT NOT NULL DEFAULT '';

ALTER TABLE "people" ADD COLUMN "expertise" TEXT NOT NULL DEFAULT '';
ALTER TABLE "people" ADD COLUMN "cohort_label" TEXT NOT NULL DEFAULT '';

ALTER TABLE "library_items" ADD COLUMN "keywords" TEXT NOT NULL DEFAULT '';
ALTER TABLE "library_items" ADD COLUMN "event_id" TEXT;

ALTER TABLE "news_posts" ADD COLUMN "subtitle" TEXT NOT NULL DEFAULT '';
ALTER TABLE "news_posts" ADD COLUMN "author_person_id" TEXT;
ALTER TABLE "news_posts" ADD COLUMN "program_id" TEXT;

CREATE TABLE "event_speakers" (
    "event_id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Speaker',
    CONSTRAINT "event_speakers_pkey" PRIMARY KEY ("event_id","person_id")
);

CREATE TABLE "person_programs" (
    "person_id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    CONSTRAINT "person_programs_pkey" PRIMARY KEY ("person_id","program_id")
);

CREATE INDEX "library_items_event_id_idx" ON "library_items"("event_id");
CREATE INDEX "event_speakers_person_id_idx" ON "event_speakers"("person_id");
CREATE INDEX "person_programs_program_id_idx" ON "person_programs"("program_id");
CREATE INDEX "news_posts_program_id_idx" ON "news_posts"("program_id");
CREATE INDEX "news_posts_author_person_id_idx" ON "news_posts"("author_person_id");

ALTER TABLE "library_items" ADD CONSTRAINT "library_items_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "event_speakers" ADD CONSTRAINT "event_speakers_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "event_speakers" ADD CONSTRAINT "event_speakers_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "person_programs" ADD CONSTRAINT "person_programs_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "person_programs" ADD CONSTRAINT "person_programs_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "news_posts" ADD CONSTRAINT "news_posts_author_person_id_fkey" FOREIGN KEY ("author_person_id") REFERENCES "people"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "news_posts" ADD CONSTRAINT "news_posts_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
