# Troubleshooting Guide

This guide helps you fix common errors when setting up the Freedom Wall project.

## Common Errors and Solutions

### 1. "Missing Supabase environment variables" Error

**Error Message:**
```
Missing Supabase environment variables. Please check your .env.local file...
```

**Solution:**
1. Make sure you have a `.env.local` file in the project root (same directory as `package.json`)
2. The file should contain:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_actual_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_key
   ```
3. Make sure there are NO spaces around the `=` sign
4. Make sure the file is named exactly `.env.local` (not `.env.local.txt` or `.env`)
5. Restart your development server after creating/modifying `.env.local`

**To create the file:**
```bash
# Windows PowerShell
Copy-Item env.example .env.local

# Or manually create .env.local and add your credentials
```

### 2. "Invalid API key" or "JWT expired" Error

**Error Message:**
```
Invalid API key
```
or
```
JWT expired
```

**Solution:**
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the **anon public** key (NOT the service_role key)
4. Make sure you copied the entire key (they're very long)
5. Update your `.env.local` file with the correct key
6. Restart your development server

### 3. "relation 'posts' does not exist" Error

**Error Message:**
```
relation "posts" does not exist
```

**Solution:**
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Open the `supabase-setup.sql` file from this project
4. Copy ALL the SQL code
5. Paste it into the SQL Editor
6. Click "Run" (or press Ctrl+Enter)
7. You should see "Success. No rows returned"
8. Verify the table exists by going to "Table Editor" - you should see the `posts` table

### 4. "Failed to fetch posts" Error in Browser

**Error Message:**
```
Failed to fetch posts
```

**Solution:**
1. Check your browser's developer console (F12) for detailed error messages
2. Check your terminal/command prompt where `npm run dev` is running for server errors
3. Verify your `.env.local` file has the correct values
4. Make sure your Supabase project is active (not paused)
5. Check if Row Level Security (RLS) policies are blocking access - you may need to adjust them

### 5. "Network Error" or CORS Issues

**Error Message:**
```
Network error
```
or
```
CORS policy blocked
```

**Solution:**
1. Make sure your Supabase project URL is correct (should start with `https://`)
2. Check if your Supabase project is paused (free tier projects pause after inactivity)
3. Restart your Supabase project if it's paused
4. Make sure you're using the correct anon key (not service_role key)

### 6. TypeScript/Compilation Errors

**Error Message:**
```
Cannot find module '@/lib/supabase'
```
or similar import errors

**Solution:**
1. Make sure all dependencies are installed:
   ```bash
   npm install
   ```
2. Restart your TypeScript server in your IDE
3. Make sure your `tsconfig.json` has the correct path aliases (should already be set up)

### 7. Posts Not Appearing After Approval

**Symptoms:**
- You approve a post in admin panel
- Post doesn't show on main page

**Solution:**
1. Check if the post's `is_approved` field is actually `true` in Supabase Table Editor
2. Make sure you're filtering by `approved=true` when fetching posts
3. Check browser console for any JavaScript errors
4. Try refreshing the page

### 8. Images Not Displaying

**Symptoms:**
- Images are uploaded but don't display

**Solution:**
1. Currently, the app stores image URLs as strings
2. For production, you should upload images to Supabase Storage
3. Make sure image URLs are valid and accessible
4. Check browser console for 404 errors on image URLs

### 9. "Cannot read property 'from' of undefined" Error

**Error Message:**
```
Cannot read property 'from' of undefined
```

**Solution:**
1. This means Supabase client is not initialized properly
2. Check your `.env.local` file exists and has correct values
3. Restart your development server
4. Make sure you're not importing Supabase client before environment variables are loaded

### 10. Port Already in Use Error

**Error Message:**
```
Port 3000 is already in use
```

**Solution:**
1. Find and stop the process using port 3000:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Or use a different port
   npm run dev -- -p 3001
   ```

## Quick Checklist

Before asking for help, make sure:

- [ ] `.env.local` file exists in project root
- [ ] `.env.local` contains `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Environment variables have no extra spaces
- [ ] Supabase project is created and active
- [ ] SQL from `supabase-setup.sql` has been run
- [ ] `posts` table exists in Supabase Table Editor
- [ ] Development server has been restarted after changing `.env.local`
- [ ] All npm packages are installed (`npm install`)

## Getting More Help

If you're still experiencing issues:

1. **Check the browser console** (F12 > Console tab) for client-side errors
2. **Check the terminal** where `npm run dev` is running for server-side errors
3. **Check Supabase logs**: Dashboard > Logs > API Logs
4. **Verify your setup**:
   - Run `npm run build` to check for build errors
   - Check that all files are in the correct locations

## Testing Your Setup

To verify everything is working:

1. **Test database connection:**
   - Go to `/admin` page
   - You should see "No posts found" (not an error)

2. **Test post creation:**
   - Go to main page (`/`)
   - Fill out the form and submit
   - Check Supabase Table Editor - you should see a new row

3. **Test approval:**
   - Go to `/admin`
   - Approve a post
   - Go back to main page - post should appear

If all three tests pass, your setup is correct!

