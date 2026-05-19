-- AlterTable
ALTER TABLE "site_settings" ADD COLUMN "contact_address" TEXT NOT NULL DEFAULT 'The Ananse Center for Arts and Culture
P.O. Box AN 1234
Accra, Ghana';

ALTER TABLE "site_settings" ADD COLUMN "impact_stats" JSONB NOT NULL DEFAULT '[{"value":"500+","label":"Lives Impacted"},{"value":"50+","label":"Programs Delivered"},{"value":"15+","label":"Communities Reached"},{"value":"6","label":"Mission Pillars"}]';
