"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
      className="mx-auto animate-spin text-primary"
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

  useEffect(() => {
    const handleAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        // PKCE OAuth flow (Google, Reddit, etc.) — exchange the code for a session.
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          window.location.search
        );
        console.log("[Auth] exchangeCodeForSession:", data?.session?.user?.id ?? "none", error?.message ?? "ok");
        if (error || !data.session) {
          router.replace("/auth/error");
          return;
        }
        // Redirect all OAuth logins directly to the dashboard.
        router.replace("/dashboard");
        return;
      }

      // Magic-link / email OTP flow — token is in the URL hash, already handled
      // by detectSessionInUrl. Just wait for the session to materialise.
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" && session) {
          router.replace("/dashboard");
        } else if (event === "TOKEN_REFRESHED" && session) {
          router.replace("/dashboard");
        }
      });

      // Fallback: check if session already exists (e.g. hash was consumed synchronously).
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace("/dashboard");
        subscription.unsubscribe();
        return;
      }

      return () => subscription.unsubscribe();
    };

    handleAuth();
  }, [router]);

  return (
    <CenteredCard>
      <SpinnerIcon />
      <h1 className="mt-4 font-heading text-2xl font-bold text-text-primary">
        Signing you in…
      </h1>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        Please wait while we confirm your session.
      </p>
    </CenteredCard>
  );
}
