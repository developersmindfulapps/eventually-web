"use client";

import { motion, useReducedMotion } from "framer-motion";

import { ButtonLink } from "@/components/ui/Button";
import { CenteredCard } from "@/components/ui/CenteredCard";

function SuccessIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto text-primary"
    >
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function VerifiedPageClient() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <CenteredCard>
        <SuccessIcon />
        <h1 className="mt-4 font-heading text-2xl font-bold text-text-primary">
          Email verified
        </h1>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Your account is now active.
        </p>
        <div className="mt-6 flex justify-center">
          <ButtonLink href="/" variant="primary" aria-label="Back to home">
            Back to home
          </ButtonLink>
        </div>
      </CenteredCard>
    </motion.div>
  );
}


