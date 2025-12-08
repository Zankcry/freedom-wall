# Likes and Comments Setup

This guide explains how to set up the likes and comments functionality for posts.

## Database Migration

To enable likes and comments, you need to create two new tables in your Supabase database.

### Steps:

1. Go to your Supabase project dashboard
2. Click on **"SQL Editor"** in the left sidebar
3. Click **"New query"**
4. Open the `supabase-add-likes-comments.sql` file from this project
5. Copy **ALL** the SQL code from that file
6. Paste it into the Supabase SQL Editor
7. Click **"Run"** (or press `Ctrl+Enter` / `Cmd+Enter`)
8. You should see success messages

The SQL will:
- Create a `likes` table to track post likes
- Create a `comments` table to store comments
- Set up Row Level Security (RLS) policies
- Create indexes for better performance

## Features

After running the migration, you'll have:

1. **Like Functionality**:
   - Users can like/unlike posts
   - Like count is displayed on each post
   - Users can only like once per post (tracked by browser localStorage)
   - Heart icon turns red when liked

2. **Comment Functionality**:
   - Users can comment on posts
   - Comments require a codename (similar to posts)
   - Comments are auto-approved
   - Comment count is displayed
   - Comments are shown in chronological order

## How It Works

### Likes
- Each like is tracked by a unique user identifier stored in browser localStorage
- Users can toggle likes (like/unlike)
- Like count updates in real-time
- Likes persist across page refreshes

### Comments
- Comments are stored in the database with post_id reference
- Comments include codename, message, and timestamp
- Comments are automatically approved (can be moderated later)
- Comments cascade delete when a post is deleted

## User Experience

- **Like Button**: Click the heart icon to like/unlike a post
- **Comments**: Click "Add Comment" to expand the comment form
- **Real-time Updates**: Like counts and comments update immediately
- **Anonymous**: No user accounts required - uses localStorage for tracking

## Admin Features

- Comments can be moderated (approve/reject) in the admin panel (future enhancement)
- All comments are visible to admins
- Deleted posts will also delete their comments (cascade delete)

## Notes

- User identification is based on browser localStorage (not IP-based)
- Users can clear localStorage to "reset" their like status
- Comments are public and visible to all users
- For production, consider adding comment moderation features

