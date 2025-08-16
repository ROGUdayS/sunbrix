# Environment Variables Setup

Follow these steps to set up your Supabase environment variables:

## 1. Get Your Supabase Credentials

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Select your project (or create a new one)
3. Go to **Settings** → **API** in the left sidebar

## 2. Copy the Required Values

From the API settings page, copy these values:

- **Project URL**: `https://your-project-id.supabase.co`
- **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **service_role secret key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 3. Create Environment File

Create a `.env.local` file in your `sunr-next-app` directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 4. Replace Placeholder Values

Replace the placeholder values with your actual credentials:

```bash
# Example (replace with your actual values)
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjQ5NjAwMCwiZXhwIjoxOTUyMDcyMDAwfQ.example
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjM2NDk2MDAwLCJleHAiOjE5NTIwNzIwMDB9.example
```

## 5. Verify Setup

After creating the `.env.local` file, restart your development server:

```bash
npm run dev
```

## 6. Test the Upload Script

Now you can run the image upload script:

```bash
npm run upload-images
```

## ⚠️ Important Notes

- **Never commit** `.env.local` to version control
- **Keep your service role key secret** - it has admin privileges
- The `anon` key is safe to expose in client-side code
- Restart your dev server after changing environment variables

## 🔍 Troubleshooting

If you get "supabaseUrl is required" error:

1. Check that `.env.local` exists in the correct location
2. Verify the variable names are exactly as shown
3. Restart your terminal/development server
4. Check for typos in the URLs and keys
