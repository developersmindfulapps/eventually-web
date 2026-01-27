"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { motion, useReducedMotion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

import { CenteredCard } from "@/components/ui/CenteredCard";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const IS_CONFIGURED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

function sanitizeUrl() {
  if (typeof window === "undefined") return;
  // Remove query + hash (may contain auth params).
  window.history.replaceState(null, "", window.location.pathname);
}

function parseHashTokens(hash: string) {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  const params = new URLSearchParams(raw);
  return {
    access_token: params.get("access_token") || "",
    refresh_token: params.get("refresh_token") || "",
  };
}

function SpinnerIcon() {
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
        d="M21 12a9 9 0 1 1-9-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ConfirmRedirectClient() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    (async () => {
      if (!IS_CONFIGURED) {
        sanitizeUrl();
        router.replace("/auth/error");
        return;
      }

      const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      });

      // Supabase PKCE links often come with ?code=...
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        await supabase.auth.exchangeCodeForSession(code).catch(() => null);
        sanitizeUrl();
      } else {
        // Legacy hash token flow (#access_token=...&refresh_token=...)
        const { access_token, refresh_token } = parseHashTokens(
          window.location.hash,
        );
        if (access_token && refresh_token) {
          await supabase.auth
            .setSession({ access_token, refresh_token })
            .catch(() => null);
          sanitizeUrl();
        }
      }

      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace("/auth/verified");
      } else {
        router.replace("/auth/error");
      }
    })();
  }, [router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <CenteredCard>
        <SpinnerIcon />
        <h1 className="mt-4 font-heading text-2xl font-bold text-text-primary">
          Verifying…
        </h1>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Please wait while we confirm your link.
        </p>
      </CenteredCard>
    </motion.div>
  );
}


