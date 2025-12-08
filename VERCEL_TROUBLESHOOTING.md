# Vercel Deployment Troubleshooting

## Error: "Unexpected token 'R', "Request En"... is not valid JSON"

This error means the API is returning HTML (an error page) instead of JSON. This usually happens when:

### 1. Environment Variables Not Set

**Most Common Cause**: Missing or incorrect environment variables in Vercel.

**Solution**:
1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Verify these variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD`

4. **Important**: Make sure you selected all environments:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

5. **After adding/changing variables**: You MUST redeploy!
   - Go to **Deployments** tab
   - Click the three dots (⋯) on the latest deployment
   - Click **Redeploy**

### 2. Check Variable Values

Make sure your values are correct:

- **NEXT_PUBLIC_SUPABASE_URL**: Should look like `https://xxxxx.supabase.co`
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Should be a long JWT token starting with `eyJ...`

**To get these values**:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Settings → API
4. Copy the exact values (no extra spaces!)

### 3. Verify Supabase Project is Active

Free tier Supabase projects pause after inactivity.

1. Check if your project is paused
2. If paused, click "Resume" to reactivate it
3. Wait a minute for it to start

### 4. Check Vercel Build Logs

1. Go to Vercel dashboard → Your project
2. Click on the failed deployment
3. Check the **Build Logs** for errors
4. Look for messages about missing environment variables

### 5. Test Environment Variables

After setting variables and redeploying:

1. Visit your deployed site
2. Open browser console (F12)
3. Try submitting a post
4. Check the Network tab for the API request
5. Look at the response - it should be JSON, not HTML

### 6. Common Mistakes

- ❌ Adding variables but not redeploying
- ❌ Typos in variable names (case-sensitive!)
- ❌ Extra spaces in variable values
- ❌ Using wrong Supabase project credentials
- ❌ Not selecting all environments (Production, Preview, Development)

### 7. Quick Fix Steps

1. **Double-check environment variables in Vercel**
2. **Redeploy** (this is crucial!)
3. **Test again** after deployment completes
4. **Check Vercel function logs** for detailed errors

### 8. Check Vercel Function Logs

1. Vercel dashboard → Your project
2. Click **Functions** tab
3. Click on `/api/posts` function
4. Check the logs for detailed error messages

### 9. Verify Database Setup

Make sure you've run all SQL migrations in Supabase:

1. `supabase-setup.sql` - Creates posts table
2. `supabase-add-soft-delete.sql` - Adds is_deleted column (if using soft delete)
3. `supabase-add-likes-comments.sql` - Creates likes and comments tables (if using those features)
4. `supabase-fix-rls.sql` - Fixes RLS policies (if you had RLS errors)

### 10. Still Not Working?

If the error persists:

1. Check Vercel deployment logs for the exact error
2. Verify Supabase RLS policies allow inserts
3. Test the Supabase connection directly
4. Make sure your Supabase project isn't paused

---

**Remember**: After changing environment variables, you MUST redeploy for changes to take effect!

