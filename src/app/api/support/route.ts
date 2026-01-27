import { NextResponse } from "next/server";

type SupportRequestBody = {
  email?: unknown;
  name?: unknown;
  message?: unknown;
  company?: unknown; // honeypot
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function tooManyRequests() {
  return NextResponse.json(
    { error: "Please wait a moment and try again." },
    { status: 429 },
  );
}

// Minimal, privacy-first throttling hint:
// For real production rate limiting on Vercel, use a shared store (e.g. Upstash)
// keyed by a short-lived fingerprint (or by email hash) rather than storing IP.
function naiveThrottleKey(email: string) {
  return email.trim().toLowerCase();
}

const throttle = new Map<string, { count: number; resetAt: number }>();
function naiveInMemoryRateLimit(key: string) {
  // NOTE: This is best-effort only; serverless instances don't share memory.
  const now = Date.now();
  const windowMs = 60_000; // 1 min
  const max = 5;

  const entry = throttle.get(key);
  if (!entry || entry.resetAt < now) {
    throttle.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count += 1;
  throttle.set(key, entry);
  return true;
}

async function deliverViaResend(input: {
  email: string;
  name?: string;
  message: string;
}) {
  const { Resend } = await import("resend");

  const apiKey = process.env.RESEND_API_KEY;
  const rawFrom = process.env.SUPPORT_FROM_EMAIL;
  const to = process.env.SUPPORT_TO_EMAIL;

  if (!apiKey || !rawFrom || !to) {
    throw new Error("Missing Resend env configuration.");
  }

  // Allow either:
  // - support@eventuallyapp.in
  // - EventUally Support <support@eventuallyapp.in>
  const from =
    rawFrom.includes("<") && rawFrom.includes(">")
      ? rawFrom
      : `EventUally Support <${rawFrom}>`;

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from,
    to,
    replyTo: input.email,
    subject: "New Support Request — EventUally",
    text:
      `New support request\n\n` +
      `From: ${input.email}\n` +
      `Name: ${input.name || "(not provided)"}\n\n` +
      `Message:\n${input.message}\n`,
  });
}

async function deliverViaSupabase(input: {
  email: string;
  name?: string;
  message: string;
}) {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const table = process.env.SUPPORT_SUPABASE_TABLE || "support_requests";

  if (!url || !serviceRoleKey) {
    throw new Error("Missing Supabase env configuration.");
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { error } = await supabase.from(table).insert({
    email: input.email,
    name: input.name || null,
    message: input.message,
    source: "website",
    created_at: new Date().toISOString(),
  });

  if (error) throw error;
}

export async function POST(req: Request) {
  let body: SupportRequestBody;
  try {
    body = (await req.json()) as SupportRequestBody;
  } catch {
    return badRequest("Invalid JSON.");
  }

  // Debug env pickup (dev-only). Do not log secrets.
  if (process.env.NODE_ENV !== "production") {
    console.log("DELIVERY MODE:", process.env.SUPPORT_DELIVERY_MODE);
    console.log("FROM:", process.env.SUPPORT_FROM_EMAIL);
    console.log("TO:", process.env.SUPPORT_TO_EMAIL);
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const company = typeof body.company === "string" ? body.company.trim() : "";

  // Honeypot triggered: pretend success to avoid training bots.
  if (company) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (!email || !isValidEmail(email)) return badRequest("Invalid email.");
  if (name.length > 120) return badRequest("Invalid name.");
  if (!message || message.length < 10 || message.length > 4000)
    return badRequest("Invalid message.");

  // Best-effort throttling without IP storage
  const key = naiveThrottleKey(email);
  if (!naiveInMemoryRateLimit(key)) return tooManyRequests();

  const mode = (process.env.SUPPORT_DELIVERY_MODE || "").toLowerCase();
  try {
    if (mode === "supabase") {
      await deliverViaSupabase({ email, name: name || undefined, message });
    } else if (mode === "resend") {
      await deliverViaResend({ email, name: name || undefined, message });
    } else {
      // Auto mode: prefer Resend if configured, otherwise Supabase.
      if (process.env.RESEND_API_KEY) {
        await deliverViaResend({ email, name: name || undefined, message });
      } else if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        await deliverViaSupabase({ email, name: name || undefined, message });
      } else {
        throw new Error("No delivery configured.");
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    // Avoid leaking sensitive details to client.
    console.error("Support form delivery failed", err);
    return NextResponse.json(
      { error: "Unable to send message right now. Please try again later." },
      { status: 500 },
    );
  }
}


