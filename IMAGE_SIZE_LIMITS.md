# Image Size Limits Explained

## Why the 2MB Limit?

The current 2MB limit per image exists because:

1. **Vercel Serverless Function Limit**: Vercel has a **4.5MB limit** for request bodies in serverless functions
2. **Base64 Encoding**: Base64 encoding increases file size by approximately **33%**
   - A 2MB image becomes ~2.67MB in base64
   - Multiple images quickly add up
3. **Safety Margin**: The limit ensures requests stay well under Vercel's limit

## Current Limits

- **Per Image**: 2MB (before compression)
- **Total Images**: 4 images maximum
- **Total Size**: ~3MB total (after compression) to stay under Vercel's 4.5MB limit

## How to Increase the Limit

### Option 1: Increase Per-Image Limit (Risky)

You can increase the limit, but be careful:

```typescript
// In components/PostForm.tsx
const maxSize = 3 * 1024 * 1024; // 3MB per image (risky!)
const maxTotalSize = 4 * 1024 * 1024; // 4MB total (very close to limit)
```

**Risks**:
- May still hit Vercel's 4.5MB limit with multiple images
- Users might get 413 errors
- Not recommended for production

### Option 2: Use Supabase Storage (Recommended)

The best solution is to upload images to Supabase Storage instead of storing base64 in the database:

**Benefits**:
- No size limits (within Supabase's limits)
- Faster page loads
- Smaller database
- Better performance
- Images stored as files, not in database

**Implementation**:
1. Set up Supabase Storage bucket
2. Upload images to storage
3. Store only the URLs in database
4. Much better scalability

### Option 3: Adjust Compression Settings

You can make images smaller by:
- Reducing max dimensions (currently 1920x1920)
- Lowering quality (currently 80%)

```typescript
// More aggressive compression
const compressImage = (file: File, maxWidth: number = 1200, maxHeight: number = 1200, quality: number = 0.7)
```

## Recommended Approach

For production, **use Supabase Storage**:
- No request size limits
- Better performance
- Scalable solution
- Industry standard approach

## Quick Fix: Increase Limit

If you want to increase the limit temporarily:

1. Edit `components/PostForm.tsx`
2. Change `maxSize` from `2 * 1024 * 1024` to `3 * 1024 * 1024` (3MB)
3. Change `maxTotalSize` from `3 * 1024 * 1024` to `4 * 1024 * 1024` (4MB)
4. **Warning**: Users with large images may still get 413 errors

