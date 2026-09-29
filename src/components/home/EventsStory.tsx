"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Calendar, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PhoneMockup } from "@/components/ui/PhoneMockup";

const eventBenefits = [
  "Create and manage events",
  "Venue suggestions and polls",
  "Track RSVPs and attendees",
  "Share all event details in one place",
];

export function EventsStory() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-t border-border/70 bg-surface/30 py-16 sm:py-24 lg:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Screenshot Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6 flex justify-center lg:justify-start order-2 lg:order-1 relative"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[320px] w-[320px] rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <PhoneMockup
                screenType="create-event"
                placeholderLabel="Mobile screenshot — Create Event"
              />
            </div>
          </motion.div>

          {/* Right Text Column */}
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6 order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full border border-badge-border bg-badge-bg px-3 py-1 text-xs font-semibold text-badge-text">
              <Calendar className="h-3.5 w-3.5" />
              <span>EVENTS</span>
            </div>

            <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
              Plan events, your way.
            </h2>

            <p className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg">
              Organize anything from casual meetups to special occasions. Invite your group, suggest venues, get RSVPs and keep everyone in the loop.
            </p>

            {/* Checklist */}
            <ul className="mt-8 space-y-3.5">
              {eventBenefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-sm font-medium text-text-primary sm:text-base">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
