# Soft Delete Setup

This guide explains how to set up the soft delete functionality for posts.

## Database Migration

To enable soft delete functionality, you need to add an `is_deleted` column to your `posts` table.

### Steps:

1. Go to your Supabase project dashboard
2. Click on **"SQL Editor"** in the left sidebar
3. Click **"New query"**
4. Open the `supabase-add-soft-delete.sql` file from this project
5. Copy **ALL** the SQL code from that file
6. Paste it into the Supabase SQL Editor
7. Click **"Run"** (or press `Ctrl+Enter` / `Cmd+Enter`)
8. You should see a success message

The SQL will:
- Add an `is_deleted` column (BOOLEAN, default: FALSE) to the `posts` table
- Create an index for better query performance

## Features

After running the migration, you'll have:

1. **Soft Delete**: Posts are marked as deleted instead of being permanently removed
2. **Undo Functionality**: Deleted posts can be restored
3. **Deleted Posts Filter**: View all deleted posts in the admin panel
4. **Automatic Exclusion**: Deleted posts are automatically hidden from the public wall

## How It Works

- **Delete**: Sets `is_deleted = true` (post is hidden but not removed)
- **Undo**: Sets `is_deleted = false` (post is restored)
- **Public View**: Only shows posts where `is_deleted = false`
- **Admin View**: Can see all posts including deleted ones

## Admin Panel Features

- **Delete Button**: Available on approved posts
- **Undo Delete Button**: Available on deleted posts
- **Deleted Filter**: View all deleted posts
- **Visual Indicator**: Deleted posts appear with reduced opacity

## Notes

- Deleted posts are not permanently removed from the database
- You can restore deleted posts at any time
- For permanent deletion, you would need to manually delete from the database

