"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Compass, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PhoneMockup } from "@/components/ui/PhoneMockup";

const discoverBenefits = [
  "Events near your location",
  "Filter by date, category and interests",
  "See event details, venue and participants",
  "Join with a single tap",
];

export function DiscoverStory() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="screenshots" className="relative overflow-hidden scroll-mt-20 border-t border-border/70 py-16 sm:py-24 lg:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full border border-badge-border bg-badge-bg px-3 py-1 text-xs font-semibold text-badge-text">
              <Compass className="h-3.5 w-3.5" />
              <span>DISCOVER</span>
            </div>

            <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
              See what&apos;s happening around you.
            </h2>

            <p className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg">
              Explore public events near your location and never miss out on what&apos;s happening in your city.
            </p>

            {/* Checklist */}
            <ul className="mt-8 space-y-3.5">
              {discoverBenefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-sm font-medium text-text-primary sm:text-base">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right Screenshot Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6 flex justify-center lg:justify-end relative"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[320px] w-[320px] rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <PhoneMockup
                screenType="around-you-map"
                placeholderLabel="Mobile screenshot — Around You"
              />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
