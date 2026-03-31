import { supabase } from "@/lib/supabase/client";

// ─── Base URL ────────────────────────────────────────────────────────────────
const envUrl = process.env.NEXT_PUBLIC_API_URL;

// Store the resolved base URL, or an empty string if missing
const baseURL = envUrl ? envUrl.replace(/\/+$/, "") : "";
if (baseURL) {
    console.log('API URL:', baseURL);
}

// Standardize so every apiFetch(/events) hits baseURL/api/events
const API_URL = baseURL ? (baseURL.endsWith("/api") ? baseURL : `${baseURL}/api`) : "";

// ─── Auth headers ────────────────────────────────────────────────────────────
async function getAuthHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    try {
        const {
            data: { session },
            error,
        } = await supabase.auth.getSession();

        if (error) {
            console.warn("[api] Supabase getSession error:", error.message);
            return headers;
        }

        if (!session?.access_token) {
            console.warn("[api] No active session — request will be unauthenticated");
            return headers;
        }

        headers["Authorization"] = `Bearer ${session.access_token}`;
    } catch (err) {
        console.error("[api] Failed to retrieve auth session:", err);
    }

    return headers;
}

// ─── Fetch wrapper ───────────────────────────────────────────────────────────
export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    if (!API_URL) {
        throw new Error("CRITICAL: NEXT_PUBLIC_API_URL is not defined in environment variables. All requests must route to external backend.");
    }

    const headers = await getAuthHeaders();
    const url = `${API_URL}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            ...headers,
            ...(options.headers as Record<string, string>),
        },
    });

    if (!response.ok) {
        const errorBody = await response.text().catch(() => "{}");
        const msg = `API ${response.status} ${response.statusText} — ${options.method ?? "GET"} ${url}\n${errorBody}`;
        console.error("[api]", msg);
        throw new Error(msg);
    }

    // 204 No Content
    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}
