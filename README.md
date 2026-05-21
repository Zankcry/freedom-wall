# 🌟 Freedom Wall

A modern, interactive anonymous freedom wall website designed for communities. Express yourself freely, share thoughts, upload beautiful images, and connect through comments and real-time likes. 

Built with a cutting-edge tech stack featuring **Next.js 16 (App Router)**, **React 19**, **Supabase (PostgreSQL)**, and **Tailwind CSS v4.0**.

---

## ✨ Features

- **🎨 Premium, Responsive UI**: A breathtaking interface built on custom glassmorphism components, custom minimal scrollbars, and vibrant color gradients.
- **🌓 Adaptive Theme Modes**: Fully integrated light and dark modes with a gorgeous smooth-transitioning [ThemeToggle](file:///c:/Users/Zankcry/Documents/freedom-wall/components/ThemeToggle.tsx).
- **👤 Anonymous Posting**: Submit posts securely under custom anonymous codenames.
- **🖼️ Image Upload Support**: Share rich media with base64 embedded image uploads (supports file sizes up to 5MB).
- **❤️ Real-time Likes**: Dynamic like/unlike interactions with instant heart micro-animations, with tracking backed by browser `localStorage` to ensure fair voting.
- **💬 Nestable Comments**: Threaded comments under posts, featuring custom poster codenames and seamless updates.
- **🎈 Floating Stickers**: Whimsical, randomized [BackgroundStickers](file:///c:/Users/Zankcry/Documents/freedom-wall/components/BackgroundStickers.tsx) float gently across the layout, giving it a playful, modern aesthetic.
- **🔐 Secure Moderation Panel**: Password-protected Admin Panel with a server-side verified [AdminLogin](file:///c:/Users/Zankcry/Documents/freedom-wall/components/AdminLogin.tsx) system to approve, reject, or restore posts.
- **🔄 Administrative Soft-Deletes**: Posts can be soft-deleted by admins (removing them instantly from the public wall but preserving records in the DB) and easily recovered via an undo filter.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core**: [Next.js 16.0.7](https://nextjs.org/) (App Router) & [React 19.2.0](https://react.dev/)
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/) (Strictly-typed endpoints and database mappings)
- **Database & Serverless**: [Supabase PostgreSQL](https://supabase.com/)
- **Styling & Animations**: [Tailwind CSS v4.0](https://tailwindcss.com/) & Native CSS cubic-bezier micro-animations

---

## 🚀 Getting Started

### 1. Installation

Clone this repository and install the dependencies:

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in your project root folder by copying the example environment file:

```bash
cp env.example .env.local
```

Open `.env.local` and configure your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
ADMIN_PASSWORD=your-secure-admin-panel-password
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to experience the Freedom Wall!

---

## 🗄️ Database Schemas

The database leverages three primary tables in Supabase with integrated cascade deletes and optimized querying indexes.

### `posts` Table
Tracks public entries posted to the wall.
- `id` (BIGINT, PK) - Auto-incrementing unique identifier
- `created_at` (TIMESTAMPTZ) - Time of submission
- `message` (TEXT) - Content of the message
- `images` (TEXT[]) - Base64 media data URL array (optional)
- `codename` (TEXT) - Anonymous author signature
- `is_approved` (BOOLEAN) - Moderation status (default: `false`)
- `is_deleted` (BOOLEAN) - Soft delete state (default: `false`)

### `likes` Table
Maintains distinct post likes linked to unique client footprints.
- `id` (BIGINT, PK) - Unique key
- `post_id` (BIGINT, FK -> `posts.id`) - Reference to target post
- `user_identifier` (TEXT) - Persistent browser cookie / storage tracker
- `created_at` (TIMESTAMPTZ) - Time of action

### `comments` Table
Stores anonymous replies to approved posts.
- `id` (BIGINT, PK) - Unique key
- `post_id` (BIGINT, FK -> `posts.id`) - Cascades on post deletion
- `codename` (TEXT) - Replier signature
- `message` (TEXT) - Response body
- `created_at` (TIMESTAMPTZ) - Time of reply
- `is_approved` (BOOLEAN) - Status checker (default: `true`)

---

## 📂 Detailed Setup Guides

This project includes modular step-by-step documentation for configuring database migrations, security setups, and remote deployment:

* 🗃️ **Database Engine**: [Supabase Database & API Keys Guide](file:///c:/Users/Zankcry/Documents/freedom-wall/SUPABASE_SETUP.md)
* 🔐 **Policy Fixes**: [Row-Level Security (RLS) Policy Guide](file:///c:/Users/Zankcry/Documents/freedom-wall/RLS_FIX_INSTRUCTIONS.md)
* ❤️ **Interactive Engine**: [Likes & Comments Migrations](file:///c:/Users/Zankcry/Documents/freedom-wall/LIKES_COMMENTS_SETUP.md)
* 🔄 **Safety Deletes**: [Soft Delete Migration Guide](file:///c:/Users/Zankcry/Documents/freedom-wall/SOFT_DELETE_SETUP.md)
* 🚀 **Hosting**: [Vercel Continuous Integration & Deployment Guide](file:///c:/Users/Zankcry/Documents/freedom-wall/VERCEL_DEPLOYMENT.md)
* 🔧 **Maintenance**: [General Troubleshooting Instructions](file:///c:/Users/Zankcry/Documents/freedom-wall/TROUBLESHOOTING.md)

---

## 📐 Project Structure

```
├── app/
│   ├── api/
│   │   ├── posts/                  # API endpoints for fetching/submitting posts
│   │   │   ├── route.ts
│   │   │   └── [id]/               # Individual post operations (approval, soft delete)
│   │   │       └── route.ts
│   │   └── posts/comments          # API endpoints for comments
│   ├── admin/                      # Moderation interface dashboard
│   ├── submit/                     # Standalone post creation portal
│   ├── globals.css                 # Glassmorphic themes & custom animations
│   ├── layout.tsx                  # Root HTML wrapper
│   └── page.tsx                    # Main interactive wall feed
├── components/
│   ├── AdminLogin.tsx              # Secure gatekeeper login screen
│   ├── BackgroundStickers.tsx      # Fluid floating visual accents
│   ├── CommentButton.tsx           # Collapsible post comment triggers
│   ├── CommentSection.tsx          # Real-time comment submission and thread list
│   ├── LikeButton.tsx              # LocalStorage-backed reactive voting heart
│   ├── PostCard.tsx                # Dynamic glassmorphic item card
│   ├── PostForm.tsx                # Media-supported submission canvas
│   └── ThemeToggle.tsx             # Interactive Sun / Moon system toggler
├── lib/
│   └── supabase.ts                 # Safe Supabase client bootstrap loader
├── types/
│   └── database.ts                 # Type definition interfaces for PostgreSQL models
```

---

## 🔒 Security Practices & Notes

1. **Robust Admin Authorization**: The admin panel validates routes server-side checking the `ADMIN_PASSWORD` variable. Ensure a strong password is set in production.
2. **Explicit Row-Level Security**: Row-Level Security policies are strictly declared to allow standard users (`anon` and `authenticated` roles) to perform target query operations while preventing unauthorized alterations.
3. **Database Performance**: Appropriate indexes have been added to standard foreign key fields like `post_id` on the `likes` and `comments` tables to ensure high performance under load.

---

## 📄 License

This project is licensed under the [MIT License](file:///c:/Users/Zankcry/Documents/freedom-wall/LICENSE).

