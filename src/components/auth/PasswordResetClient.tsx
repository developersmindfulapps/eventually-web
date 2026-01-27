"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { motion, useReducedMotion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

import { ButtonLink } from "@/components/ui/Button";
import { CenteredCard } from "@/components/ui/CenteredCard";

type Status = "loading" | "ready" | "submitting" | "success" | "error";

function LockIcon() {
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
        d="M7 11V8a5 5 0 0 1 10 0v3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6 11h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function parseHashParams(hash: string) {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  const params = new URLSearchParams(raw);
  return {
    access_token: params.get("access_token") || "",
    refresh_token: params.get("refresh_token") || "",
    type: params.get("type") || "",
  };
}

function sanitizeUrl() {
  // Remove tokens from the address bar (query/hash may contain auth params).
  if (typeof window === "undefined") return;
  window.history.replaceState(null, "", window.location.pathname);
}

function validatePassword(pw: string) {
  if (!pw) return "Password is required.";
  if (pw.length < 8) return "Use at least 8 characters.";
  if (pw.length > 200) return "Password is too long.";
  return "";
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const IS_CONFIGURED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export function PasswordResetClient() {
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const [status, setStatus] = useState<Status>(IS_CONFIGURED ? "loading" : "error");
  const [message, setMessage] = useState<string>(
    IS_CONFIGURED ? "" : "This page is not configured yet.",
  );
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const canSubmit = useMemo(() => {
    return password.length > 0 && confirm.length > 0 && status !== "submitting";
  }, [password, confirm, status]);

  useEffect(() => {
    if (!IS_CONFIGURED) return;

    (async () => {
      const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      });

      // Supabase PKCE recovery links can arrive as ?code=...
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        sanitizeUrl();
        if (error) {
          setStatus("error");
          setMessage(
            "This password reset link is invalid or has expired. Please request a new password reset from the EventUally app.",
          );
          return;
        }
      } else {
        // Legacy hash token flow: #access_token=...&refresh_token=...&type=recovery
        const { access_token, refresh_token, type } = parseHashParams(
          window.location.hash,
        );
        if (type !== "recovery" || !access_token || !refresh_token) {
          sanitizeUrl();
          setStatus("error");
          setMessage(
            "This password reset link is invalid or has expired. Please request a new password reset from the EventUally app.",
          );
          return;
        }

        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        sanitizeUrl();

        if (error) {
          setStatus("error");
          setMessage(
            "This password reset link is invalid or has expired. Please request a new password reset from the EventUally app.",
          );
          return;
        }
      }

      setStatus("ready");
      setMessage("Set a new password to continue.");
    })();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    const pwErr = validatePassword(password);
    const cfErr = confirm !== password ? "Passwords do not match." : "";
    setPasswordError(pwErr);
    setConfirmError(cfErr);

    if (pwErr || cfErr) {
      setStatus("error");
      setMessage("Please fix the highlighted fields.");
      return;
    }

    if (!IS_CONFIGURED) {
      setStatus("error");
      setMessage("This page is not configured yet.");
      return;
    }

    setStatus("submitting");

    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      },
    );

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      // Do not leak details (token validity, etc.)
      setStatus("error");
      setMessage(
        "We couldn’t update your password. The link may be expired. Please request a new password reset from the EventUally app.",
      );
      return;
    }

    // Clear any session as a privacy-first default.
    await supabase.auth.signOut();

    setStatus("success");
    setMessage("Password updated successfully.");
    router.replace("/auth/reset/success");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <CenteredCard>
        <LockIcon />
        <h1 className="mt-4 font-heading text-2xl font-bold text-text-primary">
          Set a new password
        </h1>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          {status === "loading" ? "Preparing secure reset…" : message}
        </p>

        {status === "ready" || status === "submitting" || status === "error" ? (
          <form className="mt-6 grid gap-4 text-left" onSubmit={onSubmit}>
            <div>
              <label
                htmlFor="new_password"
                className="text-sm font-semibold text-text-primary"
              >
                New password
              </label>
              <input
                id="new_password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={passwordError ? "true" : "false"}
                aria-describedby={passwordError ? "new_password_error" : undefined}
                disabled={status === "submitting"}
                className={[
                  "mt-2 h-11 w-full rounded-2xl border bg-surface px-4 text-[15px] text-text-primary outline-none transition-colors duration-150 ease-out placeholder:text-text-secondary/70 hover:border-border/80 focus:ring-2",
                  passwordError
                    ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20"
                    : "border-border focus:border-primary/60 focus:ring-primary/25",
                ].join(" ")}
              />
              {passwordError ? (
                <p
                  id="new_password_error"
                  className="mt-1.5 text-xs font-medium text-red-600"
                  role="alert"
                >
                  {passwordError}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-text-secondary">
                  Use at least 8 characters.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirm_password"
                className="text-sm font-semibold text-text-primary"
              >
                Confirm password
              </label>
              <input
                id="confirm_password"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                aria-invalid={confirmError ? "true" : "false"}
                aria-describedby={
                  confirmError ? "confirm_password_error" : undefined
                }
                disabled={status === "submitting"}
                className={[
                  "mt-2 h-11 w-full rounded-2xl border bg-surface px-4 text-[15px] text-text-primary outline-none transition-colors duration-150 ease-out placeholder:text-text-secondary/70 hover:border-border/80 focus:ring-2",
                  confirmError
                    ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20"
                    : "border-border focus:border-primary/60 focus:ring-primary/25",
                ].join(" ")}
              />
              {confirmError ? (
                <p
                  id="confirm_password_error"
                  className="mt-1.5 text-xs font-medium text-red-600"
                  role="alert"
                >
                  {confirmError}
                </p>
              ) : null}
            </div>

            <div aria-live="polite" className="mt-1 text-sm">
              {status === "error" && message ? (
                <p className="text-red-600">{message}</p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-1 h-12 w-full rounded-full bg-primary px-6 text-[16px] font-semibold text-white shadow-[0_4px_14px_rgba(107,124,255,0.22)] transition-colors duration-150 ease-out hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Update password"
            >
              {status === "submitting" ? "Updating…" : "Update password"}
            </button>
          </form>
        ) : null}

        {status === "error" ? (
          <div className="mt-6 flex justify-center">
            <ButtonLink href="/support" variant="secondary" aria-label="Contact support">
              Contact support
            </ButtonLink>
          </div>
        ) : null}
      </CenteredCard>
    </motion.div>
  );
}


