# Deploying to Vercel

This guide will walk you through deploying your Freedom Wall project to Vercel.

## Prerequisites

- A GitHub account
- A Vercel account (free tier is fine)
- Your project code ready to deploy

## Step 1: Prepare Your Project

### 1.1 Make sure your code is ready

1. Test your project locally:
   ```bash
   npm run dev
   ```
   Make sure everything works on `http://localhost:3000`

2. Build your project to check for errors:
   ```bash
   npm run build
   ```
   If there are any build errors, fix them before deploying.

### 1.2 Push to GitHub

If you haven't already, push your code to GitHub:

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create a GitHub repository**:
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it (e.g., "freedom-wall")
   - Don't initialize with README (you already have one)
   - Click "Create repository"

3. **Push your code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/freedom-wall.git
   git branch -M main
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your GitHub username.

## Step 2: Deploy to Vercel

### 2.1 Sign up / Log in to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" or "Log In"
3. Sign up with GitHub (recommended - makes deployment easier)

### 2.2 Import Your Project

1. Once logged in, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find your "freedom-wall" repository and click **"Import"**

### 2.3 Configure Your Project

Vercel will auto-detect Next.js, but you can verify:

- **Framework Preset**: Next.js (should be auto-detected)
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run build` (should be auto-filled)
- **Output Directory**: `.next` (should be auto-filled)
- **Install Command**: `npm install` (should be auto-filled)

Click **"Deploy"** - but wait! You need to add environment variables first.

## Step 3: Add Environment Variables

**IMPORTANT**: Before clicking "Deploy", add your environment variables!

1. In the project configuration page, scroll down to **"Environment Variables"**
2. Add the following variables one by one:

   **Variable 1:**
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Your Supabase project URL (from Supabase dashboard → Settings → API)
   - **Environment**: Production, Preview, Development (select all)

   **Variable 2:**
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: Your Supabase anon key (from Supabase dashboard → Settings → API)
   - **Environment**: Production, Preview, Development (select all)

   **Variable 3:**
   - **Name**: `ADMIN_PASSWORD`
   - **Value**: Your admin password (the one you set in `.env.local`)
   - **Environment**: Production, Preview, Development (select all)

3. Click **"Save"** after adding each variable

### 3.1 Where to Find Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **Settings** (gear icon) → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 4: Deploy!

1. After adding all environment variables, click **"Deploy"**
2. Vercel will:
   - Install dependencies
   - Build your project
   - Deploy it
3. This usually takes 1-3 minutes

## Step 5: Access Your Deployed Site

1. Once deployment is complete, you'll see:
   - ✅ "Ready" status
   - A URL like: `https://freedom-wall.vercel.app`

2. Click the URL to visit your live site!

3. **Test your deployment**:
   - Visit the main page
   - Try submitting a post
   - Test the admin panel (use your admin password)
   - Check if images display correctly

## Step 6: Custom Domain (Optional)

If you want a custom domain:

1. In your Vercel project dashboard, go to **Settings** → **Domains**
2. Enter your domain name
3. Follow Vercel's instructions to configure DNS

## Troubleshooting

### Build Fails

- Check the build logs in Vercel dashboard
- Make sure all environment variables are set
- Verify `npm run build` works locally

### Environment Variables Not Working

- Make sure you selected all environments (Production, Preview, Development)
- Check that variable names match exactly (case-sensitive)
- Redeploy after adding/changing variables

### Database Connection Issues

- Verify your Supabase URL and key are correct
- Check Supabase project is active (not paused)
- Make sure RLS policies are set up correctly

### Images Not Displaying

- Base64 images should work, but they increase database size
- Consider migrating to Supabase Storage for production

## Updating Your Site

Every time you push to GitHub:

1. Push your changes:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```

2. Vercel will automatically:
   - Detect the push
   - Build and deploy the new version
   - You'll see the new deployment in your Vercel dashboard

## Vercel Dashboard Features

- **Deployments**: See all your deployments
- **Analytics**: View site traffic (on paid plans)
- **Logs**: Check server logs for debugging
- **Settings**: Manage environment variables, domains, etc.

## Security Notes

- Never commit `.env.local` to GitHub (it's in `.gitignore`)
- Always set environment variables in Vercel dashboard
- Use strong passwords for `ADMIN_PASSWORD`
- Consider enabling Vercel's security features

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- Check Vercel deployment logs for specific errors

---

**Congratulations!** Your Freedom Wall is now live on the internet! 🎉

