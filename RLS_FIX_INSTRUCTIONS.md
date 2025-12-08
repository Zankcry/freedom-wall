# Fix Row Level Security (RLS) Policy Error

If you're getting the error: **"new row violates row-level security policy for table 'posts'"**, follow these steps:

## Quick Fix (Recommended)

1. Go to your Supabase project dashboard
2. Click on **"SQL Editor"** in the left sidebar
3. Click **"New query"**
4. Open the file `supabase-fix-rls.sql` from this project
5. Copy **ALL** the SQL code from that file
6. Paste it into the Supabase SQL Editor
7. Click **"Run"** (or press `Ctrl+Enter` / `Cmd+Enter`)
8. You should see success messages for each policy

## What This Does

The fix script will:
- Drop any existing conflicting policies
- Recreate all policies with explicit role permissions (`TO anon, authenticated`)
- This ensures that anonymous users (using the anon key) can insert posts

## Alternative: Update Original Setup

If you haven't set up your database yet, you can use the updated `supabase-setup.sql` file which now includes the correct policies from the start.

## Verify It Worked

After running the fix:
1. Try submitting a post again on your website
2. It should work without the RLS error
3. Check Supabase Table Editor - you should see the new post

## Why This Happened

The original RLS policies didn't explicitly specify which roles (`anon` or `authenticated`) could perform operations. Supabase requires explicit role specification for RLS policies to work correctly with the anon key.

## Still Having Issues?

If you're still getting errors after running the fix:
1. Make sure you ran the **entire** SQL script (all policies)
2. Check Supabase logs: Dashboard > Logs > Postgres Logs
3. Verify RLS is enabled: Table Editor > posts table > should show "RLS enabled"

