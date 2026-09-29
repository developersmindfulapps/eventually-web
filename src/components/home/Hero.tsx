"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Compass } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PhoneMockup } from "@/components/ui/PhoneMockup";
import { AppleAppStoreBadge, GooglePlayBadge } from "@/components/ui/StoreBadges";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 lg:pt-20 lg:pb-32">
      {/* Background Soft Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-teal-500/10 blur-3xl dark:bg-teal-400/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-20 h-[480px] w-[480px] rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-400/10"
      />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Headline, Copy & CTAs */}
          <div className="lg:col-span-6 lg:pr-4">
            {/* Top Pill Badge */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="inline-flex items-center gap-2 rounded-full border border-badge-border bg-badge-bg px-3.5 py-1.5 text-xs font-semibold text-badge-text shadow-sm"
            >
              <Compass className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              <span>Get together, for real</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
              className="mt-5 font-heading text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl lg:text-6xl"
            >
              Make plans.
              <br />
              Find people.
              <br />
              <span className="text-primary bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent dark:from-teal-400 dark:via-teal-300 dark:to-emerald-400">
                Actually go.
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.55, delay: 0.16, ease: "easeOut" }}
              className="mt-5 max-w-lg text-base leading-relaxed text-text-secondary sm:text-lg"
            >
              EventUally helps you discover events, join groups, plan with friends and turn ideas into real moments.
            </motion.p>

            {/* Download Badges */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.55, delay: 0.24, ease: "easeOut" }}
              className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <AppleAppStoreBadge />
              <GooglePlayBadge />
            </motion.div>

            {/* Micro Trust Proof */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.55, delay: 0.32, ease: "easeOut" }}
              className="mt-8 flex items-center gap-6 text-xs font-medium text-text-muted"
            >
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" /> Free to use
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" /> No ads or spam
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" /> Privacy first
              </span>
            </motion.div>
          </div>

          {/* Right Column: Hero Dual Phone Mockup Composition */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-6 relative flex justify-center lg:justify-end"
          >
            {/* Ambient Radial Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[340px] w-[340px] rounded-full bg-gradient-to-tr from-teal-500/20 via-emerald-400/20 to-teal-300/10 blur-3xl pointer-events-none" />

            <div className="relative flex items-center justify-center">
              {/* Primary Phone — Around You */}
              <div className="relative z-10">
                <PhoneMockup
                  screenType="hero-around-you"
                  placeholderLabel="Mobile screenshot — Around You"
                  priority
                />
              </div>

              {/* Secondary Tilted Phone — Event Details */}
              <div className="hidden sm:block absolute -right-10 md:-right-16 top-6 z-0 opacity-90 transition-transform hover:scale-105 hover:z-20">
                <PhoneMockup
                  screenType="hero-event-details"
                  placeholderLabel="Mobile screenshot — Event Details"
                  tilt="right"
                />
              </div>

              {/* Playful Handwritten Annotation & Arrow */}
              <div className="hidden xl:flex absolute -right-20 bottom-12 flex-col items-center z-20 text-teal-600 dark:text-teal-400 select-none animate-pulse">
                <span className="font-handwriting text-sm font-semibold tracking-wide text-center leading-tight rotate-6">
                  Discover<br />Join<br />Plan<br />Go!
                </span>
                <svg className="w-8 h-8 text-teal-500 -rotate-12 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12h12M11 6l6 6-6 6" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
