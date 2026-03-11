import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import QueryProvider from "@/providers/QueryProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http")
    ? process.env.NEXT_PUBLIC_SITE_URL
    : "https://eventually.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "EventUally",
    template: "%s • EventUally",
  },
  description:
    "The simplest way to plan events without messy group chats. Create groups, schedule, vote on venues, and bring people together—calmly.",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "EventUally",
    title: "EventUally",
    description:
      "The simplest way to plan events without messy group chats. Create groups, schedule, and vote on venues—calmly.",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "EventUally — Plan events, effortlessly.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EventUally",
    description:
      "The simplest way to plan events without messy group chats. Create groups, schedule, and vote on venues—calmly.",
    images: ["/og.svg"],
  },
};

// Root layout — providers only.
// Navbar + Footer are added by (marketing)/layout.tsx for marketing pages.
// Dashboard pages use (dashboard)/layout.tsx which has no marketing chrome.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${inter.variable} min-h-dvh bg-background text-text-primary antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
