## EventUally Website

Minimal, premium product website for **EventUally** (Next.js App Router + Tailwind), deployed on **Vercel**.

### Pages

- `/` Home
- `/support` Support + FAQ + Support Form
- `/privacy` Privacy Policy
- `/terms` Terms of Service
- `/account-deletion` Account deletion instructions (App Store friendly)
- `/auth/confirm` and `/auth/error` (email verification redirect pages)
- `/auth/verified` Email verified redirect target (Supabase)

### Tech stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS (v4 template)
- Framer Motion (subtle motion)
- Optional: Resend (email delivery), Supabase (persist support requests)

## Local development

```bash
cd /Users/sumeetkour/Downloads/eventUally-web
npm install
npm run dev
```

Open `http://localhost:3000`.

### Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Support form (frontend + backend)

The Support Form on `/support` posts to:

- `POST /api/support` → `src/app/api/support/route.ts`

### What it collects (privacy-first)

- `email` (required)
- `name` (optional)
- `message` (required)
- `company` (honeypot — should remain empty)

No IP is stored by this project by default.

### Delivery options

You can deliver support requests via **email** (Resend) or **database** (Supabase).

The API handler supports 3 modes via `SUPPORT_DELIVERY_MODE`:

- `resend` → send an email
- `supabase` → insert into a Supabase table
- unset → auto (prefers Resend if configured, otherwise Supabase)

## Environment variables (Vercel)

Set these in **Vercel → Project → Settings → Environment Variables**.

### Optional (recommended)

- `NEXT_PUBLIC_SITE_URL` (example: `https://eventually.app`)  
  Used for correct absolute OpenGraph URLs.

### Option A: Resend (email)

- `SUPPORT_DELIVERY_MODE=resend`
- `RESEND_API_KEY`
- `SUPPORT_FROM_EMAIL` (example: `EventUally Support <support@your-domain.com>`)
- `SUPPORT_TO_EMAIL` (the inbox that receives support requests)

#### Local setup

This repo includes a local template file:

- `env.local` → copy to `.env.local` and paste your real `RESEND_API_KEY`

### Option B: Supabase (persist)

- `SUPPORT_DELIVERY_MODE=supabase`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; never expose to client)
- `SUPPORT_SUPABASE_TABLE` (optional; default: `support_requests`)

#### Suggested Supabase table schema

Create a table (example: `support_requests`) with columns:

- `id` (uuid, primary key, default `gen_random_uuid()`)
- `created_at` (timestamp, default `now()`)
- `email` (text, not null)
- `name` (text, nullable)
- `message` (text, not null)
- `source` (text, not null; store `"website"`)

## Security & abuse prevention

- **Honeypot**: `company` blocks basic bots.
- **Rate limiting**: the API includes a best-effort in-memory throttle (useful locally).  
  For real rate limiting on Vercel, use a shared store (e.g., Upstash Redis) keyed by an email hash or short-lived fingerprint. Prefer not storing raw IP unless necessary.
- **No sensitive data leaks**: the API returns generic error messages and logs details server-side.

## Deploy on Vercel

Vercel auto-detects Next.js. Typical flow:

1. Push this repo to GitHub
2. Import in Vercel
3. Add env vars (if using the Support Form backend)
4. Deploy

## Supabase Auth redirect URLs

Add these to **Supabase → Authentication → URL Configuration → Redirect URLs**:

- `https://eventuallyapp.in/auth/confirm`
- `https://eventuallyapp.in/auth/verified`
- (local dev) `http://localhost:3000/auth/verified`
 - `https://eventuallyapp.in/auth/reset`
 - `https://eventuallyapp.in/auth/reset/success`
 - (local dev) `http://localhost:3000/auth/reset`
 - (local dev) `http://localhost:3000/auth/reset/success`
 - (local dev) `http://localhost:3000/auth/confirm`

### What should redirect here

- **Email verification**: after the user confirms their email
- **Magic link login**: after the user clicks the login link
- **Password reset**: after the user clicks the reset email link (lands on `/auth/reset`)
- **Password reset completion**: after they set a new password (redirects to `/auth/reset/success`)

This page is intentionally minimal, `noindex`, and only intended for auth flows.

### Password reset flow (Supabase)

1. User taps “Forgot password?” in the app.
2. Supabase sends a password reset email.
3. User clicks the email link.
4. Supabase redirects to `https://eventuallyapp.in/auth/reset` with tokens in the URL hash (never sent to your server).
5. The website:
   - Reads tokens from the hash on the client
   - Sets a temporary Supabase session
   - Removes tokens from the address bar immediately
6. User sets a new password.
7. On success, the website signs out and redirects to `/auth/reset/success`.

#### Invalid/expired links

If tokens are missing/invalid/expired, `/auth/reset` shows a safe message (“link is invalid or expired”) and a CTA to Support, without exposing token details.

### App/client snippets (use your production domain)

#### Signup / email confirmation

```ts
await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: "https://eventuallyapp.in/auth/confirm",
  },
});
```

#### Password reset

```ts
await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: "https://eventuallyapp.in/auth/reset",
});
```
