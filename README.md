EventUally Website

Minimal, privacy-first, premium product website for EventUally — a group-based event planning app.
Built with Next.js App Router + Tailwind CSS, deployed on Vercel.

This website serves as:

The public marketing site

Legal & compliance surface (App Store ready)

Auth transaction pages for Supabase

Support & account management interface

🌐 Live

https://eventuallyapp.in

📄 Pages & Routes
Public pages

/ — Home

/support — Support + FAQ + Support Form

/privacy — Privacy Policy

/terms — Terms of Service

/account-deletion — Account deletion instructions (App Store compliant)

Auth (Supabase redirect & transactional pages)

/auth/confirm — Email confirmation redirect

/auth/verified — Email verified success screen

/auth/reset — Password reset form (from email link)

/auth/reset/success — Password reset success

/auth/error — Fallback for invalid/expired auth flows

API

POST /api/support — Support form backend

🧱 Tech Stack

Next.js (App Router)

React + TypeScript

Tailwind CSS (v4 template)

Framer Motion (subtle motion & polish)

Supabase (Auth, optional persistence)

Resend (Email delivery)

Vercel (Hosting & CI)

🛡️ Product Philosophy

EventUally follows a privacy-first, minimalist, compliance-ready design approach:

No unnecessary user tracking

No IP storage by default

No client-side secrets exposed

All auth handled via Supabase

All legal & account deletion surfaces included

App Store friendly

🧩 Support Form (Frontend + Backend)

The Support Form on /support posts to:

POST /api/support


Location:

src/app/api/support/route.ts

Data collected (privacy-first)

email (required)

name (optional)

message (required)

company (honeypot — must remain empty)

👉 No IP, fingerprinting, or tracking stored by default.

📬 Delivery Options

Support requests can be delivered via email or database.

Controlled via:

SUPPORT_DELIVERY_MODE

Modes
Mode	Behavior
resend	Sends support emails via Resend
supabase	Stores requests in Supabase DB
unset	Auto → prefers Resend, else DB
🔐 Environment Variables (Production)

Configure in Vercel → Project → Settings → Environment Variables.

Required for Supabase Auth (frontend)
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<public anon key>


These are public-safe and used by the website only.

Optional (Recommended)
NEXT_PUBLIC_SITE_URL=https://eventuallyapp.in


Used for OpenGraph & absolute URLs.

Option A — Email via Resend
SUPPORT_DELIVERY_MODE=resend
RESEND_API_KEY=...
SUPPORT_FROM_EMAIL=EventUally Support <support@eventuallyapp.in>
SUPPORT_TO_EMAIL=developers.mindfulapps@gmail.com

Option B — Store in Supabase
SUPPORT_DELIVERY_MODE=supabase
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPPORT_SUPABASE_TABLE=support_requests


⚠️ SUPABASE_SERVICE_ROLE_KEY must never be exposed to the client.

Suggested Supabase Table Schema

Create a table support_requests:

Column	Type	Notes
id	uuid	PK, default gen_random_uuid()
created_at	timestamp	default now()
email	text	not null
name	text	nullable
message	text	not null
source	text	"website"
🔒 Security & Abuse Prevention

Honeypot field (company) blocks bots

Best-effort in-memory rate limiting

No sensitive data leaks in responses

Server logs only; client gets generic errors

Tokens never sent to backend during auth flows

🔁 Supabase Auth Redirect Configuration

Configure in:

Supabase → Authentication → URL Configuration → Redirect URLs


Add:

Production
https://eventuallyapp.in/auth/confirm
https://eventuallyapp.in/auth/verified
https://eventuallyapp.in/auth/reset
https://eventuallyapp.in/auth/reset/success
https://eventuallyapp.in/auth/error

Local Development
http://localhost:3000/auth/confirm
http://localhost:3000/auth/verified
http://localhost:3000/auth/reset
http://localhost:3000/auth/reset/success
http://localhost:3000/auth/error

🔐 Auth Flow Behavior
Email Verification / Magic Link

Supabase sends email

User clicks link

Redirects to /auth/confirm

Client validates session

Redirects to /auth/verified or /auth/error

Password Reset

User requests reset

Supabase emails link

Link opens /auth/reset with tokens in hash

Website:

Reads tokens client-side

Sets temp session

Clears hash immediately

User sets new password

Redirects to /auth/reset/success

Invalid/expired links safely route to /auth/error.

🔧 Client Integration Examples
Signup
await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: "https://eventuallyapp.in/auth/confirm",
  },
});

Password Reset
await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: "https://eventuallyapp.in/auth/reset",
});

🚀 Deployment (Vercel)

Push repository to GitHub

Import into Vercel

Add environment variables

Deploy

Vercel auto-detects Next.js.

💻 Local Development
npm install
npm run dev


Open: http://localhost:3000

Scripts
npm run dev
npm run build
npm run start
npm run lint

📱 Mobile App

This repository is only for the website.

The EventUally mobile app:

Uses Expo

Has its own environment variables

Shares the same Supabase backend

They are intentionally decoupled.

📜 License

Proprietary — All rights reserved © EventUally