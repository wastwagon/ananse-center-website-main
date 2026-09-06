-- Event schedule, capacity, and registration status for full admin control
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "starts_at" TIMESTAMP(3);
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "ends_at" TIMESTAMP(3);
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "time_label" TEXT NOT NULL DEFAULT '';
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "capacity" INTEGER;
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "registration_status" TEXT NOT NULL DEFAULT 'auto';
