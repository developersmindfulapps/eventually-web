# EventUally Web App

The official web application for **EventUally** — a group-based event planning app. This repository serves as both the public marketing site and the fully authenticated web dashboard for users.

Built with **Next.js 15 App Router**, **TypeScript**, **Tailwind CSS**, **Supabase Auth**, and **React Query**.

## 🚀 Features

-   **Authenticated Dashboard**: A comprehensive home for users to manage their events and groups.
-   **Event Management**: 
    - View your upcoming events and RSVP dynamically.
    - Participate in Potlucks (suggest and claim items).
    - Vote on Venues, with Admin controls to seamlessly finalize the selected location.
    - Event Chat for real-time collaboration.
-   **Explore Events**: A dedicated event discovery system with debounced search, silent infinite scrolling, and automatic exclusion of events you're already going to.
-   **Group Management**: Browse and access user groups.
-   **Privacy-First**: Minimal data collection, secure authentication via Supabase.

*Note: The Notifications feature is temporarily disabled in the UI while the `/api/notifications` endpoint is being implemented in the backend `Eventually-app` repository.*

## 🌐 Live URL

[https://eventuallyapp.in](https://eventuallyapp.in)

## 📄 Architecture & Routes

The application is split into distinct route groups to ensure the marketing layout (Navbar & Footer) never bleeds into the authenticated dashboard.

### `(dashboard)` — Authenticated App
Uses a minimal, app-like layout with a green-tinted brand system (`#1F7A63`).
-   `/dashboard`: Welcome message, your upcoming events, and an explore feed.
-   `/events`: All events list, filters, and debounced search.
-   `/events/[eventId]`: Event details, venue polls, potlucks, and chat.
-   `/groups`: User's groups with quick access.
-   `/profile`: User settings and display info.

### `(marketing)` — Public / Legal Pages
-   `/`: Public marketing landing page.
-   `/login`, `/signup`: Log in / Sign up flows.
-   `/support`: Support Form + FAQ.
-   `/privacy`: Privacy Policy.
-   `/terms`: Terms of Service.
-   `/account-deletion`: Account deletion instructions (App Store compliant).

## 🧱 Tech Stack

-   **Framework**: Next.js 15 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS (v4)
-   **State Management**: React Query (`@tanstack/react-query`)
-   **Icons**: Lucide React
-   **Backend / Auth**: Supabase Auth + External Express API (`Eventually-app`)

## 🔐 Environment Variables

Configure in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<public-anon-key>
NEXT_PUBLIC_API_URL=<backend-api-url> # e.g., http://localhost:8000/api
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

The EventUally mobile app is built with Expo and shares the same Supabase and backend API repository (`Eventually-app/backend`). This repository is specifically for the web interface.

## 📜 License

Proprietary — All rights reserved © EventUally