# Adding Environment Variables to Vercel

You need to add your Clerk keys to Vercel for production. Here are your values:

## Your Environment Variables

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_b2JsaWdpbmctY3JpY2tldC04OS5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_95Cnw3xENUj0jyKYq6xGs4JSFFJhJrOavocC5Naf1L
CLERK_JWKS_URL=https://obliging-cricket-89.clerk.accounts.dev/.well-known/jwks.json
```

## Option 1: Using Vercel CLI (Recommended)

Run these commands one by one in your terminal:

```bash
cd /Users/ishaangosain/Desktop/projects/saas

# Add Publishable Key
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# When prompted, paste: pk_test_b2JsaWdpbmctY3JpY2tldC04OS5jbGVyay5hY2NvdW50cy5kZXYk
# Select: Production, Preview, and Development (all three)

# Add Secret Key
vercel env add CLERK_SECRET_KEY
# When prompted, paste: sk_test_95Cnw3xENUj0jyKYq6xGs4JSFFJhJrOavocC5Naf1L
# Select: Production, Preview, and Development (all three)
# Mark as sensitive: Yes (y)

# Add JWKS URL
vercel env add CLERK_JWKS_URL
# When prompted, paste: https://obliging-cricket-89.clerk.accounts.dev/.well-known/jwks.json
# Select: Production, Preview, and Development (all three)
```

## Option 2: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - **Name:** `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
     **Value:** `pk_test_b2JsaWdpbmctY3JpY2tldC04OS5jbGVyay5hY2NvdW50cy5kZXYk`
     **Environments:** Production, Preview, Development (select all)
   
   - **Name:** `CLERK_SECRET_KEY`
     **Value:** `sk_test_95Cnw3xENUj0jyKYq6xGs4JSFFJhJrOavocC5Naf1L`
     **Environments:** Production, Preview, Development (select all)
     **Mark as sensitive:** Yes
   
   - **Name:** `CLERK_JWKS_URL`
     **Value:** `https://obliging-cricket-89.clerk.accounts.dev/.well-known/jwks.json`
     **Environments:** Production, Preview, Development (select all)

## After Adding Variables

1. Redeploy your application:
   ```bash
   vercel --prod
   ```

2. The environment variables will be available in your production deployment

## Verify

After deploying, check that your app works:
- Sign in should work
- Subscription flow should work
- API calls should work (with proper authentication)

