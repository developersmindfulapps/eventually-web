"use client";

import React from "react";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-border bg-footer-bg text-text-secondary transition-colors duration-200">
      <Container className="py-12 sm:py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          {/* Brand & Tagline */}
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label="EventUally Home"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                <Calendar className="h-4 w-4" />
              </div>
              <span className="font-heading text-lg font-bold tracking-tight text-text-primary">
                EventUally
              </span>
            </Link>
            <p className="text-sm text-text-secondary font-medium">
              Make plans. Find people. Actually go.
            </p>
          </div>

          {/* Nav Links */}
          <nav
            aria-label="Footer Navigation"
            className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium"
          >
            <Link href="/#features" className="hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="/#how-it-works" className="hover:text-primary transition-colors">
              How it works
            </Link>
            <Link href="/#faq" className="hover:text-primary transition-colors">
              FAQ
            </Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Use
            </Link>
            <Link href="/community-guidelines" className="hover:text-primary transition-colors">
              Community Guidelines
            </Link>
            <Link href="/support" className="hover:text-primary transition-colors">
              Support
            </Link>
            <Link href="/account-deletion" className="hover:text-primary transition-colors">
              Account Deletion
            </Link>
          </nav>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-border/80 pt-8 text-xs text-text-muted gap-4">
          <p>© {new Date().getFullYear()} EventUally. All rights reserved.</p>
          <p className="text-text-muted">
            Built for real-world connections. Safe, private, and ad-free.
          </p>
        </div>
      </Container>
    </footer>
  );
}
