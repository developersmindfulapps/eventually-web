import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import { ThemeProvider, ThemeScript } from "@/components/theme/ThemeProvider";
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
    default: "EventUally — Make Plans. Find People. Actually Go.",
    template: "%s • EventUally",
  },
  description:
    "EventUally helps you discover events, join groups, plan with friends and turn ideas into real moments without messy group chats.",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "EventUally",
    title: "EventUally — Make Plans. Find People. Actually Go.",
    description:
      "EventUally helps you discover events, join groups, plan with friends and turn ideas into real moments.",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "EventUally — Make Plans. Find People. Actually Go.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EventUally — Make Plans. Find People. Actually Go.",
    description:
      "EventUally helps you discover events, join groups, plan with friends and turn ideas into real moments.",
    images: ["/og.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        className={`${dmSans.variable} ${inter.variable} min-h-dvh bg-background text-text-primary antialiased selection:bg-teal-500/20`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
