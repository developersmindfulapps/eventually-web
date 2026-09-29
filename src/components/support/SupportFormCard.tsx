"use client";

import { useMemo, useState } from "react";

type FormValues = {
  email: string;
  name: string;
  message: string;
  company: string; // honeypot
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;

function isValidEmail(email: string) {
  if (email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function SupportFormCard() {
  const [values, setValues] = useState<FormValues>({
    email: "",
    name: "",
    message: "",
    company: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");

  const isDisabled = status === "submitting";

  const canSubmit = useMemo(() => {
    return (
      values.email.trim().length > 0 &&
      values.message.trim().length >= 10 &&
      values.message.length <= 350
    );
  }, [values.email, values.message]);

  function validate(v: FormValues): FieldErrors {
    const next: FieldErrors = {};
    const email = v.email.trim();
    const message = v.message.trim();

    if (!email) {
      next.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      next.email = "Please enter a valid email.";
    }

    if (v.name.trim().length > 120) {
      next.name = "Name is too long (maximum 120 characters).";
    }

    if (!message) {
      next.message = "Message is required.";
    } else if (message.length < 10) {
      next.message = "Message is too short (minimum 10 characters).";
    } else if (message.length > 350 || [...message].length > 350) {
      next.message = "Message is too long (maximum 350 characters).";
    }

    return next;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatusMessage("");

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      setStatusMessage("Please fix the highlighted fields.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error || "Something went wrong.");
      }

      setStatus("success");
      setStatusMessage("Thanks — your message was sent. We’ll reply by email.");
      setErrors({});
      setValues({ email: "", name: "", message: "", company: "" });
    } catch {
      setStatus("error");
      setStatusMessage(
        "We couldn’t send your message. Please try again or email support@eventuallyapp.in.",
      );
    }
  }

  return (
    <section aria-label="Support form" className="rounded-3xl border border-border bg-surface p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] sm:p-8">
      <header>
        <h2 className="font-heading text-[20px] font-bold tracking-tight text-text-primary">
          Contact Support
        </h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          We’ll only use your email to respond. No ads. No tracking.
        </p>
      </header>

      <form
        className="mt-7 grid gap-4"
        aria-label="Support request form"
        onSubmit={onSubmit}
      >
        {/* Honeypot (spam prevention). Must remain empty. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="support_company">Company</label>
          <input
            id="support_company"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={values.company}
            onChange={(e) =>
              setValues((s) => ({ ...s, company: e.target.value }))
            }
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-3">
            <label
              htmlFor="support_email"
              className="text-sm font-semibold text-text-primary"
            >
              Email
            </label>
            <span className="text-xs font-medium text-text-secondary">
              Required
            </span>
          </div>
          <input
            id="support_email"
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={254}
            placeholder="you@example.com"
            value={values.email}
            onChange={(e) => setValues((s) => ({ ...s, email: e.target.value }))}
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "support_email_error" : "support_email_help"}
            disabled={isDisabled}
            className={[
              "mt-2 h-11 w-full rounded-2xl border bg-surface px-4 text-[15px] text-text-primary outline-none transition-colors duration-150 ease-out placeholder:text-text-secondary/70 hover:border-border/80 focus:ring-2",
              errors.email
                ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20"
                : "border-border focus:border-primary/60 focus:ring-primary/25",
              isDisabled ? "opacity-90" : "",
            ].join(" ")}
          />
          <p id="support_email_help" className="mt-1.5 text-xs text-text-secondary">
            We use this only for support follow-up.
          </p>
          {errors.email ? (
            <p
              id="support_email_error"
              className="mt-1.5 text-xs font-medium text-red-600"
              role="alert"
            >
              {errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-3">
            <label
              htmlFor="support_name"
              className="text-sm font-semibold text-text-primary"
            >
              Name
            </label>
            <span className="text-xs font-medium text-text-secondary">
              Optional
            </span>
          </div>
          <input
            id="support_name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={120}
            placeholder="Your name"
            value={values.name}
            onChange={(e) => setValues((s) => ({ ...s, name: e.target.value }))}
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "support_name_error" : undefined}
            disabled={isDisabled}
            className={[
              "mt-2 h-11 w-full rounded-2xl border bg-surface px-4 text-[15px] text-text-primary outline-none transition-colors duration-150 ease-out placeholder:text-text-secondary/70 hover:border-border/80 focus:ring-2",
              errors.name
                ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20"
                : "border-border focus:border-primary/60 focus:ring-primary/25",
              isDisabled ? "opacity-90" : "",
            ].join(" ")}
          />
          {errors.name ? (
            <p
              id="support_name_error"
              className="mt-1.5 text-xs font-medium text-red-600"
              role="alert"
            >
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-3">
            <label
              htmlFor="support_message"
              className="text-sm font-semibold text-text-primary"
            >
              Issue / Message
            </label>
            <span className="text-xs font-medium text-text-secondary">
              Required
            </span>
          </div>
          <textarea
            id="support_message"
            name="message"
            required
            maxLength={350}
            placeholder="Tell us what happened (steps, device, etc.)"
            value={values.message}
            onChange={(e) =>
              setValues((s) => ({ ...s, message: e.target.value }))
            }
            aria-invalid={errors.message ? "true" : "false"}
            aria-describedby={
              errors.message ? "support_message_error" : "support_message_help"
            }
            disabled={isDisabled}
            className={[
              "mt-2 min-h-[140px] w-full resize-y rounded-2xl border bg-surface px-4 py-3 text-[15px] leading-[1.65] text-text-primary outline-none transition-colors duration-150 ease-out placeholder:text-text-secondary/70 hover:border-border/80 focus:ring-2",
              errors.message
                ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20"
                : "border-border focus:border-primary/60 focus:ring-primary/25",
              isDisabled ? "opacity-90" : "",
            ].join(" ")}
          />
          <p
            id="support_message_help"
            className="mt-1.5 text-xs text-text-secondary"
          >
            Avoid sharing sensitive info (passwords, one-time codes).
          </p>
          {errors.message ? (
            <p
              id="support_message_error"
              className="mt-1.5 text-xs font-medium text-red-600"
              role="alert"
            >
              {errors.message}
            </p>
          ) : null}
        </div>

        <div aria-live="polite" className="mt-1 text-sm">
          {statusMessage ? (
            <p
              className={
                status === "success"
                  ? "text-text-primary"
                  : status === "error"
                    ? "text-red-600"
                    : "text-text-secondary"
              }
            >
              {statusMessage}
            </p>
          ) : null}
        </div>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-text-secondary">
            Privacy-first: messages are used only to resolve your request.
          </p>

          <button
            type="submit"
            disabled={isDisabled || !canSubmit}
            className="h-12 rounded-full bg-primary px-6 text-[16px] font-semibold text-white shadow-[0_4px_14px_rgba(107,124,255,0.22)] transition-colors duration-150 ease-out hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Submit support request"
          >
            {status === "submitting" ? "Sending…" : "Send message"}
          </button>
        </div>
      </form>
    </section>
  );
}
