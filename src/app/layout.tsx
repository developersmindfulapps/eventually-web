import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import Link from "next/link";
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

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          aria-label="EventUally home"
          className="font-heading text-lg font-semibold tracking-tight text-text-primary rounded-md px-1 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          EventUally
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-3">
          <Link
            href="/support"
            aria-label="Support"
            className="rounded-full px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            Support
          </Link>
          <Link
            href="/#download"
            aria-label="Download the EventUally app"
            className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            Download App
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-footer-bg">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-text-secondary">
            <span className="font-heading font-semibold text-text-primary">
              EventUally
            </span>{" "}
            — plan together, effortlessly.
          </div>
          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm"
          >
            <Link
              href="/support"
              className="text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-md px-1 py-1"
            >
              Support
            </Link>
            <Link
              href="/privacy"
              className="text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-md px-1 py-1"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-md px-1 py-1"
            >
              Terms of Service
            </Link>
            <Link
              href="/account-deletion"
              className="text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-md px-1 py-1"
            >
              Account Deletion
            </Link>
          </nav>
        </div>
        <div className="mt-8 text-xs text-text-secondary">
          © {new Date().getFullYear()} EventUally. All rights reserved.
          <span className="mx-2" aria-hidden="true">
            •
          </span>
          EventUally is built with modern security practices and encrypted
          infrastructure.
        </div>
      </div>
    </footer>
  );
}

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
        <Navbar />
        <main className="min-h-[calc(100dvh-4rem)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
