# Supabase Setup Guide

Follow these steps to set up your Supabase database for the Freedom Wall project.

## Step 1: Create a Supabase Account and Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign up"**
3. Sign up with GitHub, Google, or email
4. Once logged in, click **"New Project"**
5. Fill in the project details:
   - **Name**: Choose a name (e.g., "freedom-wall")
   - **Database Password**: Create a strong password (save this somewhere safe!)
   - **Region**: Choose the region closest to you
   - **Pricing Plan**: Free tier is fine for development
6. Click **"Create new project"**
7. Wait 2-3 minutes for your project to be provisioned

## Step 2: Create the Database Table

1. In your Supabase project dashboard, click on **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open the `supabase-setup.sql` file from this project and copy all its contents
4. Paste the SQL into the Supabase SQL Editor
5. Click **"Run"** (or press `Ctrl+Enter` / `Cmd+Enter`)
6. You should see a success message: "Success. No rows returned"

The SQL will:
- Create the `posts` table with all required columns
- Enable Row Level Security (RLS)
- Set up policies for reading, inserting, updating, and deleting posts

## Step 3: Get Your API Keys

1. In your Supabase project dashboard, click on **"Settings"** (gear icon) in the left sidebar
2. Click on **"API"** in the settings menu
3. You'll see two important values:
   - **Project URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Copy both of these values - you'll need them in the next step.

## Step 4: Configure Environment Variables

1. In your project root directory, create a file named `.env.local`
   - If `env.example` exists, you can copy it: `cp env.example .env.local`
   - Or create a new file manually

2. Open `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace:
- `https://your-project-id.supabase.co` with your actual Project URL
- `your-anon-key-here` with your actual anon public key

**Example:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTIzNDU2NywiZXhwIjoxOTYwODEwNTY3fQ.example
```

## Step 5: Verify the Setup

1. Make sure your `.env.local` file is in the project root (same level as `package.json`)
2. Restart your development server if it's running:
   ```bash
   # Stop the server (Ctrl+C) and restart:
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000)
4. Try submitting a test post - it should work!

## Step 6: Verify Database Table

You can verify your table was created correctly:

1. In Supabase dashboard, go to **"Table Editor"** in the left sidebar
2. You should see the `posts` table listed
3. Click on it to see the columns:
   - `id` (bigint)
   - `created_at` (timestamptz)
   - `message` (text)
   - `images` (text[])
   - `codename` (text)
   - `is_approved` (boolean)

## Troubleshooting

### "Invalid API key" error
- Double-check that you copied the **anon public key** (not the service_role key)
- Make sure there are no extra spaces in your `.env.local` file
- Restart your development server after changing `.env.local`

### "relation 'posts' does not exist" error
- Make sure you ran the SQL from `supabase-setup.sql` in the SQL Editor
- Check the SQL Editor for any error messages

### Can't see the table in Table Editor
- Refresh the page
- Make sure you're looking at the correct project

### Environment variables not loading
- Make sure the file is named exactly `.env.local` (not `.env.local.txt`)
- Make sure it's in the project root directory
- Restart your Next.js development server

## Next Steps

Once Supabase is set up:
1. Your app should be fully functional
2. Test submitting a post on the main page
3. Go to `/admin` to approve/reject posts
4. When ready, deploy to Vercel and add the same environment variables there

## Security Note

The current setup uses public policies for development. For production:
- Consider adding authentication for admin operations
- Restrict update/delete policies to authenticated admin users only
- Use Supabase Storage for image uploads instead of storing URLs directly

