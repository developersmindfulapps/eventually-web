"use client";

import Image from "next/image";

import { motion, useReducedMotion } from "framer-motion";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Hero() {
  const reduceMotion = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-surface">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary blur-3xl opacity-[0.06]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-44 -left-28 h-[560px] w-[560px] rounded-full bg-primary-soft blur-3xl opacity-[0.10]"
      />

      <Container className="pt-16 pb-10 sm:pt-20 sm:pb-12">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="font-heading text-4xl font-bold leading-tight tracking-tight text-text-primary sm:text-5xl"
            >
              Plan events with your friends,
              <br />
              effortlessly.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.55, delay: 0.06, ease: "easeOut" }}
              className="mt-3 max-w-xl text-sm font-medium text-text-primary/80 sm:text-base"
            >
              The simplest way to plan events without messy group chats.
            </motion.p>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
              className="mt-4 max-w-xl text-base leading-7 text-text-secondary sm:text-lg"
            >
              Create groups, plan events, vote on venues, and bring people
              together — without the chaos of group chats.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.55, delay: 0.18, ease: "easeOut" }}
              className="mt-7 flex flex-col gap-3 sm:flex-row"
            >
              <ButtonLink
                href="/#download"
                variant="primary"
                size="lg"
                aria-label="Download the EventUally app"
              >
                Download App
              </ButtonLink>
              <ButtonLink
                href="/support"
                variant="secondary"
                size="lg"
                aria-label="Contact EventUally support"
              >
                Contact Support
              </ButtonLink>
            </motion.div>

            <motion.ul
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.55, delay: 0.26, ease: "easeOut" }}
              className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-secondary"
            >
              <li className="inline-flex items-center gap-2">
                <span aria-hidden="true">✔</span> Free to use
              </li>
              <li className="inline-flex items-center gap-2">
                <span aria-hidden="true">✔</span> No ads
              </li>
              <li className="inline-flex items-center gap-2">
                <span aria-hidden="true">✔</span> Privacy focused
              </li>
            </motion.ul>
          </div>

          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-6 rounded-[2rem] bg-primary-soft blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <Image
                  src="/app-mockup.svg"
                  alt="EventUally app mockup"
                  width={800}
                  height={1000}
                  priority
                  className="h-auto w-full"
                />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-10 border-t border-border/70 pt-6">
          <p className="text-center text-sm text-text-secondary">
            <span aria-hidden="true">⭐</span>{" "}
            Loved by early users planning meetups, trips, and hangouts
          </p>
        </div>
      </Container>
    </section>
  );
}


