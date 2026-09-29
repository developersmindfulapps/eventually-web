import { NextResponse } from "next/server";

type SupportRequestBody = {
  email?: unknown;
  name?: unknown;
  message?: unknown;
  company?: unknown; // honeypot
};

const MAX_BODY_BYTES = 10 * 1024; // 10 KB
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 350;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_IP = 5;
const MAX_REQUESTS_PER_EMAIL = 3;

function isValidEmail(email: string): boolean {
  if (email.length > MAX_EMAIL_LENGTH) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function payloadTooLarge() {
  return NextResponse.json(
    { error: "Payload too large (maximum 10 KB)." },
    { status: 413 },
  );
}

function tooManyRequests() {
  return NextResponse.json(
    { error: "Please wait a moment and try again." },
    { status: 429 },
  );
}

// In-memory rate limiting stores
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const ipThrottle = new Map<string, RateLimitEntry>();
const emailThrottle = new Map<string, RateLimitEntry>();

function cleanExpiredEntries(store: Map<string, RateLimitEntry>, now: number) {
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function checkRateLimit(
  ip: string,
  normalizedEmail: string,
  now = Date.now(),
): { allowed: boolean } {
  // Prune expired entries to prevent memory accumulation
  cleanExpiredEntries(ipThrottle, now);
  cleanExpiredEntries(emailThrottle, now);

  // Check IP limit
  if (ip) {
    const ipEntry = ipThrottle.get(ip);
    if (ipEntry && ipEntry.resetAt > now) {
      if (ipEntry.count >= MAX_REQUESTS_PER_IP) {
        return { allowed: false };
      }
    }
  }

  // Check Email limit
  if (normalizedEmail) {
    const emailEntry = emailThrottle.get(normalizedEmail);
    if (emailEntry && emailEntry.resetAt > now) {
      if (emailEntry.count >= MAX_REQUESTS_PER_EMAIL) {
        return { allowed: false };
      }
    }
  }

  // Increment IP usage
  if (ip) {
    const ipEntry = ipThrottle.get(ip);
    if (!ipEntry || ipEntry.resetAt <= now) {
      ipThrottle.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    } else {
      ipEntry.count += 1;
    }
  }

  // Increment Email usage
  if (normalizedEmail) {
    const emailEntry = emailThrottle.get(normalizedEmail);
    if (!emailEntry || emailEntry.resetAt <= now) {
      emailThrottle.set(normalizedEmail, {
        count: 1,
        resetAt: now + RATE_LIMIT_WINDOW_MS,
      });
    } else {
      emailEntry.count += 1;
    }
  }

  return { allowed: true };
}

export function getClientIp(req: Request): string {
  // Cloudflare trusted client IP
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  // Vercel / reverse-proxy trusted client IP
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  // Standard x-forwarded-for header (first entry is original client)
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",").map((item) => item.trim());
    if (ips.length > 0 && ips[0]) return ips[0];
  }

  return "127.0.0.1";
}

// Reset rate limits for test environments
export function resetRateLimits() {
  ipThrottle.clear();
  emailThrottle.clear();
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

  const from =
    rawFrom.includes("<") && rawFrom.includes(">")
      ? rawFrom
      : `EventUAlly Support <${rawFrom}>`;

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
  // 1. Early request-size guard using Content-Length header if present
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
    return payloadTooLarge();
  }

  // 2. Parse JSON body
  let body: SupportRequestBody;
  try {
    const rawText = await req.text();
    if (rawText.length > MAX_BODY_BYTES) {
      return payloadTooLarge();
    }
    body = JSON.parse(rawText) as SupportRequestBody;
  } catch {
    return badRequest("Invalid JSON.");
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const company = typeof body.company === "string" ? body.company.trim() : "";

  // 3. Honeypot check: silently accept bots without executing delivery
  if (company) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // 4. Strict field validations
  if (!email) {
    return badRequest("Email is required.");
  }
  if (!isValidEmail(email)) {
    return badRequest("Please enter a valid email address.");
  }
  if (name.length > MAX_NAME_LENGTH) {
    return badRequest(`Name is too long (maximum ${MAX_NAME_LENGTH} characters).`);
  }

  // 5. Message validation (min 10, max 350 characters, Unicode-safe)
  if (!message) {
    return badRequest("Message is required.");
  }
  if (message.length < MIN_MESSAGE_LENGTH) {
    return badRequest(`Message is too short (minimum ${MIN_MESSAGE_LENGTH} characters).`);
  }
  // Check both UTF-16 code units and Unicode grapheme cluster/codepoint length
  const unicodeLength = [...message].length;
  if (message.length > MAX_MESSAGE_LENGTH || unicodeLength > MAX_MESSAGE_LENGTH) {
    return badRequest(`Message is too long (maximum ${MAX_MESSAGE_LENGTH} characters).`);
  }

  // 6. Rate limiting (IP + Normalized Email)
  const clientIp = getClientIp(req);
  const normalizedEmail = email.toLowerCase();
  const rateLimitResult = checkRateLimit(clientIp, normalizedEmail);

  if (!rateLimitResult.allowed) {
    return tooManyRequests();
  }

  // 7. Delivery execution
  const mode = (process.env.SUPPORT_DELIVERY_MODE || "").toLowerCase();
  try {
    if (mode === "test" || process.env.NODE_ENV === "test") {
      return NextResponse.json({ ok: true }, { status: 200 });
    } else if (mode === "supabase") {
      await deliverViaSupabase({ email, name: name || undefined, message });
    } else if (mode === "resend") {
      await deliverViaResend({ email, name: name || undefined, message });
    } else {
      // Auto mode: prefer Resend if key exists, otherwise Supabase
      if (process.env.RESEND_API_KEY) {
        await deliverViaResend({ email, name: name || undefined, message });
      } else if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        await deliverViaSupabase({ email, name: name || undefined, message });
      } else {
        throw new Error("No delivery service configured.");
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    // Avoid leaking stack traces or internal errors to client
    console.error("Support form delivery failed", err);
    return NextResponse.json(
      { error: "Unable to send message right now. Please try again later." },
      { status: 500 },
    );
  }
}
