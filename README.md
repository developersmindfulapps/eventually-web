# EventUally Web App

The official web application for **EventUally** — a group-based event planning app. This repository now serves as both the public marketing site and the fully authenticated web dashboard for users.

Built with **Next.js 15 App Router**, **TypeScript**, **Tailwind CSS**, **Supabase Auth**, and **React Query**.

## 🚀 Features

-   **Authenticated Dashboard**: A comprehensive home for users to manage their events and groups.
-   **Event Management**: View upcoming events, RSVP status, and event details.
-   **Group Management**: Browse and access user groups.
-   **Real-time Chat**: Quick access to recent messages via a floating chat widget.
-   **Privacy-First**: Minimal data collection, secure authentication via Supabase.

## 🌐 Live URL

[https://eventuallyapp.in](https://eventuallyapp.in)

## 📄 Pages & Routes

### Authenticated App
-   `/`: **Dashboard (Private)** - Requires login. Redirects to `/auth/login` if unauthenticated.
    -   Displays: Welcome message, stats, featured events, event list, reminders.
-   `/auth/login`: Login page (managed by Supabase Auth UI or custom implementation).

### Public / Legal Pages
-   `/support`: Support Form + FAQ.
-   `/privacy`: Privacy Policy.
-   `/terms`: Terms of Service.
-   `/account-deletion`: Account deletion instructions (App Store compliant).

### Auth Transaction Pages
-   `/auth/confirm`: Email confirmation redirect.
-   `/auth/verified`: Email verified success screen.
-   `/auth/reset`: Password reset form.
-   `/auth/error`: Fallback for auth errors.

## 🧱 Tech Stack

-   **Framework**: Next.js 15 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS (v4)
-   **State Management**: React Query (`@tanstack/react-query`)
-   **Icons**: Lucide React
-   **Utilities**: `date-fns`, `clsx`, `tailwind-merge`
-   **Backend / Auth**: Supabase
-   **Email**: Resend

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/          # Next.js API Routes (e.g., /api/support)
│   ├── auth/         # Auth callback pages
│   ├── layout.tsx    # Root layout with QueryProvider
│   └── page.tsx      # Main Authenticated Dashboard
├── components/
│   ├── layout/       # Header, LeftSidebar, RightSidebar
│   ├── events/       # EventCard, EventList, EventCarousel
│   ├── chat/         # ChatWidget, ChatModal
│   └── ui/           # Generic UI components
├── hooks/            # Custom React Query hooks (useData.ts)
├── lib/
│   ├── api.ts        # Typed API Client with Auth Interceptor
│   └── cn.ts         # Class merging utility
└── types/            # TypeScript interfaces (User, Event, Group)
```

## 🔐 Environment Variables

Configure in `.env.local` or Vercel Project Settings.

### Required for App Functionality
```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<public-anon-key>
NEXT_PUBLIC_API_URL=<backend-api-url> # e.g., https://api.eventually.app
```

### Optional / Support Form
```bash
NEXT_PUBLIC_SITE_URL=https://eventuallyapp.in
SUPPORT_DELIVERY_MODE=resend # or supabase
RESEND_API_KEY=...
SUPPORT_FROM_EMAIL=...
SUPPORT_TO_EMAIL=...
SUPABASE_SERVICE_ROLE_KEY=... # Only for server-side support storage
```

## 💻 Local Development

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run development server**:
    ```bash
    npm run dev
    ```

3.  **Open**: [http://localhost:3000](http://localhost:3000)

## 📱 Mobile App

The EventUally mobile app is built with Expo and shares the same Supabase backend. This repository is specifically for the web interface.

## 📜 License

Proprietary — All rights reserved © EventUally