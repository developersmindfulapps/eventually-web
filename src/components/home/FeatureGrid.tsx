"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import {
  GroupPlanningIcon,
  SmartSchedulingIcon,
  VenueVotingIcon,
} from "@/components/home/FeatureIcons";

const features = [
  {
    title: "Group Planning",
    description:
      "Create circles for your different friend groups. Keep plans organized and separate.",
    Icon: GroupPlanningIcon,
  },
  {
    title: "Smart Scheduling",
    description:
      "Find a time that works for everyone without back-and-forth messaging.",
    Icon: SmartSchedulingIcon,
  },
  {
    title: "Venue Voting",
    description:
      "Can’t decide where to go? Let the group vote and settle it in seconds.",
    Icon: VenueVotingIcon,
  },
];

export function FeatureGrid() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-label="Features"
      className="border-y border-border/70 bg-surface"
    >
      <Container className="py-12 sm:py-16">
        <div className="mb-7">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-text-primary">
            Features
          </h2>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Everything you need to plan without friction.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {features.map(({ title, description, Icon }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: idx * 0.06, ease: "easeOut" }}
            >
              <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(0,0,0,0.06)] focus-within:shadow-[0_6px_22px_rgba(0,0,0,0.06)]">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-primary-soft p-3 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-text-primary">
                      {title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-text-secondary">
                      {description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}


