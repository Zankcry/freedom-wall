-- Fix Row Level Security Policies for posts table
-- Run this in Supabase SQL Editor if you're getting RLS policy errors

-- First, drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can read approved posts" ON posts;
DROP POLICY IF EXISTS "Anyone can insert posts" ON posts;
DROP POLICY IF EXISTS "Allow updates" ON posts;
DROP POLICY IF EXISTS "Allow deletes" ON posts;

-- Recreate policies with correct syntax
-- Allow anyone to read approved posts
CREATE POLICY "Anyone can read approved posts"
  ON posts FOR SELECT
  TO anon, authenticated
  USING (is_approved = true);

-- Allow anyone to insert posts (this is the key fix)
CREATE POLICY "Anyone can insert posts"
  ON posts FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow updates (for admin approval)
CREATE POLICY "Allow updates"
  ON posts FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Allow deletes (for admin rejection)
CREATE POLICY "Allow deletes"
  ON posts FOR DELETE
  TO anon, authenticated
  USING (true);

-- Also allow reading all posts for admin panel (not just approved ones)
-- This is needed for the admin panel to see pending posts
CREATE POLICY "Allow reading all posts for admin"
  ON posts FOR SELECT
  TO anon, authenticated
  USING (true);

