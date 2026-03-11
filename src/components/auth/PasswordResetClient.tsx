"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
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

function validatePassword(pw: string) {
  if (!pw) return "Password is required.";
  if (pw.length < 8) return "Use at least 8 characters.";
  if (pw.length > 200) return "Password is too long.";
  return "";
}

export function PasswordResetClient() {
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const canSubmit = useMemo(() => {
    return password.length > 0 && confirm.length > 0 && status !== "submitting";
  }, [password, confirm, status]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setStatus("ready");
        setMessage("Set a new password to continue.");
      } else {
        // Wait for auth state change in case it's processing
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (session) {
            setStatus("ready");
            setMessage("Set a new password to continue.");
          } else if (event === 'SIGNED_OUT') {
            setStatus("error");
            setMessage("Unable to verify session. Please request a new password reset.");
          }
        });
        return () => subscription.unsubscribe();
      }
    };
    checkSession();
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

    setStatus("submitting");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setStatus("error");
      setMessage("We couldn’t update your password. Please try again.");
      return;
    }

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
          {status === "loading" ? "Verifying link..." : message}
        </p>

        {status === "ready" || status === "submitting" || status === "error" ? (
          <form className="mt-6 grid gap-4 text-left" onSubmit={onSubmit}>
            <div>
              <label htmlFor="new_password" className="text-sm font-semibold text-text-primary">New password</label>
              <input
                id="new_password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={status === "submitting"}
                className="mt-2 h-11 w-full rounded-2xl border bg-surface px-4 text-[15px] text-text-primary"
              />
              {passwordError && <p className="mt-1.5 text-xs text-red-600">{passwordError}</p>}
            </div>

            <div>
              <label htmlFor="confirm_password" className="text-sm font-semibold text-text-primary">Confirm password</label>
              <input
                id="confirm_password"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={status === "submitting"}
                className="mt-2 h-11 w-full rounded-2xl border bg-surface px-4 text-[15px] text-text-primary"
              />
              {confirmError && <p className="mt-1.5 text-xs text-red-600">{confirmError}</p>}
            </div>

            <div className="mt-1 text-sm text-red-600">
              {status === "error" && message && !passwordError && !confirmError ? message : null}
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-1 h-12 w-full rounded-full bg-primary px-6 text-[16px] font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "submitting" ? "Updating…" : "Update password"}
            </button>
          </form>
        ) : null}

        {status === "success" && (
          <div className="mt-6 flex justify-center">
            <ButtonLink href="/login" variant="primary">Back to Login</ButtonLink>
          </div>
        )}
      </CenteredCard>
    </motion.div>
  );
}
