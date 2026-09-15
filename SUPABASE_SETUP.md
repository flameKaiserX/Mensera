# Supabase setup

## 1. Create the project

Create a Supabase project, then copy its public project URL and anon key into `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Never put a Supabase service-role key in this Vite app or commit `.env`.

## 2. Create the tables

Run the SQL in `supabase/migrations/202609130001_initial_schema.sql` from the Supabase SQL Editor. The migration enables row-level security so authenticated users can access only their own profile and cycle logs.

## 3. Configure authentication

In Supabase Authentication settings:

- Enable Email provider.
- Enable Google provider and add the Google OAuth client credentials.
- Add these redirect URLs:
  - `http://localhost:5173`
  - Your Vercel production URL

The Google OAuth callback is handled by Supabase; the app redirects back to the current site origin.

## 4. Run locally

```powershell
npm install
npm run dev
```

Without Supabase variables, the app stays in guest mode and keeps using local storage. With variables configured, Profile contains email/password and Google sign-in, and profile plus cycle logs are merged and synced after authentication.

## Data behavior

- Passwords are stored and hashed by Supabase Auth, never by this app.
- Local guest data is merged by log date on first sign-in.
- For overlapping logs, local fields take precedence and symptoms are merged.
- Notifications and dark-mode preference remain local.
