-- Add likes and comments functionality
-- Run this in Supabase SQL Editor

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_identifier TEXT NOT NULL, -- Browser fingerprint or IP
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_identifier)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  codename TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_approved BOOLEAN DEFAULT TRUE -- Comments are auto-approved, but can be moderated
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_identifier ON likes(user_identifier);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- Enable Row Level Security
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policies for likes
CREATE POLICY "Anyone can read likes"
  ON likes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert likes"
  ON likes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can delete likes"
  ON likes FOR DELETE
  TO anon, authenticated
  USING (true);

-- Policies for comments
CREATE POLICY "Anyone can read approved comments"
  ON comments FOR SELECT
  TO anon, authenticated
  USING (is_approved = true);

CREATE POLICY "Anyone can insert comments"
  ON comments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow reading all comments for admin"
  ON comments FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow updates for admin"
  ON comments FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow deletes for admin"
  ON comments FOR DELETE
  TO anon, authenticated
  USING (true);

