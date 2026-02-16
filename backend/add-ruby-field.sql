-- Add content_ruby field to chapters table
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS content_ruby TEXT;
