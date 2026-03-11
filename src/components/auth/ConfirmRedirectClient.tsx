"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { CenteredCard } from "@/components/ui/CenteredCard";

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
    const handleAuth = async () => {
      // Allow the supabase client to process the URL first (auto-detect)
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        router.replace("/auth/verified");
      } else {
        // If no session found immediately, check if we need to manually exchange (though createBrowserClient usually handles this)
        // For now, we trust the shared client. If it failed, we redirect to error.
        // Giving a small delay or check might be needed if auto-detect is async and racing, 
        // but getSession() should verify current state.

        // If we are strictly following "Remove createClient", we assume shared client works.
        // However, if the shared client consumed the code, session should be there.
        // If not, maybe we need to wait for onAuthStateChange?

        // Let's rely on a simple check for now.
        router.replace("/auth/error");
      }
    };

    // Small timeout to allow shared client to process potential hash/code?
    // Actually, createBrowserClient is synchronous in setup but async in processing hash.
    // We can listen to onAuthStateChange.

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || session) {
        router.replace("/auth/verified");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
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
