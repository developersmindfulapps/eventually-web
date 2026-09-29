"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Search, Users, Calendar, Sparkles, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

const steps = [
  {
    step: "01",
    title: "Discover",
    description: "Find events around you or explore groups that match your interests.",
    icon: Search,
    colorBg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/40",
    badgeBorder: "border-emerald-200 dark:border-emerald-800/60",
  },
  {
    step: "02",
    title: "Join",
    description: "Join public or private groups and connect with like-minded people.",
    icon: Users,
    colorBg: "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800/40",
    badgeBorder: "border-teal-200 dark:border-teal-800/60",
  },
  {
    step: "03",
    title: "Plan",
    description: "Create events, choose venues, invite people and get RSVPs.",
    icon: Calendar,
    colorBg: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/40",
    badgeBorder: "border-cyan-200 dark:border-cyan-800/60",
  },
  {
    step: "04",
    title: "Actually go",
    description: "Turn online plans into real life moments.",
    icon: Sparkles,
    colorBg: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/40",
    badgeBorder: "border-amber-200 dark:border-amber-800/60",
  },
];

export function HowItWorks() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="how-it-works" className="relative scroll-mt-20 border-y border-border/70 bg-surface/50 py-16 sm:py-24">
      <Container>
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-badge-border bg-badge-bg px-3 py-1 text-xs font-semibold text-badge-text">
            <Sparkles className="h-3.5 w-3.5" />
            <span>HOW IT WORKS</span>
          </div>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            From idea to real plans, in a few taps.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
            No messy group chats, no missed updates. A clear, four-step journey to getting together.
          </p>
        </div>

        {/* 4 Steps Journey Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Step Card */}
                <div className="w-full h-full rounded-3xl border border-border bg-surface p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/40 flex flex-col items-center">
                  {/* Step Icon in Color Badge */}
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border shadow-inner transition-transform duration-300 group-hover:scale-110 ${item.colorBg} ${item.badgeBorder}`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-5 font-heading text-lg font-bold text-text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-text-secondary sm:text-sm">
                    {item.description}
                  </p>
                </div>

                {/* Connector Arrow for Desktop (between items 1->2, 2->3, 3->4) */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-teal-400 dark:text-teal-600 pointer-events-none">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
