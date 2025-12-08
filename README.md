# Freedom Wall

A modern freedom wall website built with Next.js, Supabase, and Tailwind CSS. Users can submit messages with optional images, and admins can approve or reject posts before they appear on the wall.

## Features

- 🎨 Beautiful, modern UI with Tailwind CSS
- 📝 Submit messages with optional images
- 👤 Anonymous posting with codenames
- 🔐 Admin panel for post approval
- ⚡ Fast and responsive design
- 🚀 Ready for Vercel deployment

## Tech Stack

- **Frontend**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Hosting**: Vercel (ready to deploy)

## Prerequisites

- Node.js 18+ installed
- A Supabase account and project

## Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the SQL from `supabase-setup.sql` file (or copy-paste the contents)
3. Get your Supabase URL and anon key from Settings > API

### 3. Configure Environment Variables

1. Copy `env.example` to `.env.local`:
```bash
cp env.example .env.local
```

2. Fill in your Supabase credentials and admin password:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_PASSWORD=your_secure_admin_password_here
```

**Important:** Set a strong password for `ADMIN_PASSWORD` to protect your admin panel. This password is required to access `/admin`.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The `posts` table has the following columns:

- `id` (BIGSERIAL, Primary Key) - Auto-incrementing unique identifier
- `created_at` (TIMESTAMPTZ) - Timestamp of when the post was created (default: now())
- `message` (TEXT) - The post message content
- `images` (TEXT[]) - Array of image URLs (optional)
- `codename` (TEXT) - The anonymous codename of the poster
- `is_approved` (BOOLEAN) - Whether the post has been approved by admin (default: false)

## Project Structure

```
├── app/
│   ├── api/
│   │   └── posts/          # API routes for posts
│   ├── admin/              # Admin panel page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main freedom wall page
├── components/
│   ├── PostCard.tsx        # Post display component
│   └── PostForm.tsx        # Post submission form
├── lib/
│   └── supabase.ts         # Supabase client configuration
└── types/
    └── database.ts         # TypeScript types for database
```

## Deployment to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD` (set a strong password for admin access)
4. Deploy!

## Security Notes

- **Admin Panel Protection**: The admin panel is password-protected. Set `ADMIN_PASSWORD` in your `.env.local` file. The password is verified server-side.
- The current implementation uses the anon key for all operations. For production:
  - Set up proper Row Level Security (RLS) policies in Supabase
  - Use a strong, unique password for `ADMIN_PASSWORD`
  - Consider using environment variables in Vercel for production
  - Use Supabase Storage for image uploads instead of storing URLs directly
  - Implement rate limiting for API routes

## Image Upload

Images are currently stored as base64 data URLs in the database. This ensures images work across all browsers and sessions. 

**Note:** Base64 encoding increases the data size by about 33%. For production with many images, consider:

1. Setting up Supabase Storage
2. Uploading images to a storage bucket
3. Storing the returned URLs in the database

**Current limitations:**
- Maximum image size: 5MB per image
- Images are embedded in the database (increases database size)

## License

MIT
