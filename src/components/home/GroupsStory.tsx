"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Users, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PhoneMockup } from "@/components/ui/PhoneMockup";

const groupBenefits = [
  "Public and private groups",
  "Interest-based communities",
  "Group events, discussions and updates",
];

export function GroupsStory() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="features" className="relative overflow-hidden scroll-mt-20 py-16 sm:py-24 lg:py-28">
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
              <Users className="h-3.5 w-3.5" />
              <span>GROUPS</span>
            </div>

            <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
              Find your people.
            </h2>

            <p className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg">
              Join existing groups or create your own. From hobby groups to neighborhood communities, EventUally makes it easy to connect with people who share your interests.
            </p>

            {/* Checklist */}
            <ul className="mt-8 space-y-3.5">
              {groupBenefits.map((benefit) => (
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[320px] w-[320px] rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <PhoneMockup
                screenType="groups"
                placeholderLabel="Mobile screenshot — Groups"
              />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
