"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Layers, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";

const features = [
  {
    title: "Google Maps Integration",
    description: "Find and choose the perfect venue with accurate place details and search.",
    icon: MapPin,
    badgeBg: "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800/40",
  },
  {
    title: "Multiple Event Types",
    description: "Meetups, dining, sports, outdoors, shows, hobby groups, and more.",
    icon: Layers,
    badgeBg: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/40",
  },
  {
    title: "Simple RSVP Flow",
    description: "Let hosts and friends know your availability in seconds without awkward texts.",
    icon: HeartHandshake,
    badgeBg: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/40",
  },
  {
    title: "Safe & Private",
    description: "Control your visibility. Moderate group content and manage your experience safely.",
    icon: ShieldCheck,
    badgeBg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/40",
  },
];

export function FeatureGrid() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative border-t border-border/70 bg-surface/50 py-16 sm:py-24">
      <Container>
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-badge-border bg-badge-bg px-3 py-1 text-xs font-semibold text-badge-text">
            <Sparkles className="h-3.5 w-3.5" />
            <span>MORE TO EXPLORE</span>
          </div>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Everything you need to make plans happen.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
            Thoughtfully built for real-life gatherings, zero clutter.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
                className="group rounded-3xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/40 flex flex-col"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border shadow-inner transition-transform duration-300 group-hover:scale-105 ${feature.badgeBg}`}>
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-5 font-heading text-lg font-bold text-text-primary">
                  {feature.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-text-secondary sm:text-sm">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
