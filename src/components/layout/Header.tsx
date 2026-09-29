"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Menu, X, ArrowDownToLine } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? "border-b border-border/80 bg-background/85 backdrop-blur-md shadow-sm"
          : "border-b border-transparent bg-background/60 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo / Brand */}
        <Link
          href="/"
          onClick={closeMenu}
          className="group flex items-center gap-2.5 rounded-lg px-1 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label="EventUally Home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-teal-500 text-white shadow-md shadow-teal-700/20 transition-transform group-hover:scale-105">
            <Calendar className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-lg font-bold tracking-tight text-text-primary">
              EventUally
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/#features"
            className="text-text-secondary transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-md px-1 py-1"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            className="text-text-secondary transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-md px-1 py-1"
          >
            How it works
          </Link>
          <Link
            href="/support"
            className="text-text-secondary transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-md px-1 py-1"
          >
            Support
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/#download"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(15,118,110,0.25)] transition-all hover:bg-primary-dark hover:shadow-[0_6px_20px_rgba(15,118,110,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-95"
          >
            <ArrowDownToLine className="h-4 w-4" />
            Get the App
          </Link>
        </div>

        {/* Mobile Hamburger & Theme Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface/95 backdrop-blur-lg px-4 py-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-4 text-base font-medium">
            <Link
              href="/#features"
              onClick={closeMenu}
              className="rounded-lg px-3 py-2 text-text-secondary hover:bg-surface-subtle hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              onClick={closeMenu}
              className="rounded-lg px-3 py-2 text-text-secondary hover:bg-surface-subtle hover:text-primary"
            >
              How it works
            </Link>
            <Link
              href="/support"
              onClick={closeMenu}
              className="rounded-lg px-3 py-2 text-text-secondary hover:bg-surface-subtle hover:text-primary"
            >
              Support
            </Link>
            <div className="pt-2">
              <Link
                href="/#download"
                onClick={closeMenu}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-semibold text-white shadow-md active:scale-95"
              >
                <ArrowDownToLine className="h-4 w-4" />
                Get the App
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
