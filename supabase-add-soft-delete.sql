-- Add is_deleted column for soft delete functionality
-- Run this in Supabase SQL Editor

ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_posts_is_deleted ON posts(is_deleted);

