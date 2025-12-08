-- Create the posts table
CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  message TEXT NOT NULL,
  images TEXT[],
  codename TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_posts_is_deleted ON posts(is_deleted);

-- Enable Row Level Security (optional, but recommended)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can read approved posts" ON posts;
DROP POLICY IF EXISTS "Anyone can insert posts" ON posts;
DROP POLICY IF EXISTS "Allow updates" ON posts;
DROP POLICY IF EXISTS "Allow deletes" ON posts;
DROP POLICY IF EXISTS "Allow reading all posts for admin" ON posts;

-- Create policies with explicit role specification
-- Allow anyone to read approved posts
CREATE POLICY "Anyone can read approved posts"
  ON posts FOR SELECT
  TO anon, authenticated
  USING (is_approved = true);

-- Allow anyone to insert posts (FIXED: explicitly allows anon role)
CREATE POLICY "Anyone can insert posts"
  ON posts FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow updates (for admin approval)
-- Note: In production, you should restrict this to authenticated admin users
CREATE POLICY "Allow updates"
  ON posts FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Allow deletes (for admin rejection)
-- Note: In production, you should restrict this to authenticated admin users
CREATE POLICY "Allow deletes"
  ON posts FOR DELETE
  TO anon, authenticated
  USING (true);

-- Allow reading all posts for admin panel (needed to see pending posts)
CREATE POLICY "Allow reading all posts for admin"
  ON posts FOR SELECT
  TO anon, authenticated
  USING (true);

