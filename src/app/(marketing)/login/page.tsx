"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { Provider } from "@supabase/supabase-js";

// ─── Inline SVG icons (no extra dependency) ───────────────────────────────────

function GoogleIcon() {
    return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
    );
}

function GitHubIcon() {
    return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0a12 12 0 0 0-3.794 23.396c.6.111.82-.261.82-.579 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.608-4.042-1.608-.546-1.386-1.333-1.756-1.333-1.756-1.089-.744.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.109-.776.419-1.305.762-1.605-2.665-.303-5.467-1.332-5.467-5.93 0-1.31.469-2.382 1.235-3.221-.123-.303-.535-1.524.118-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 0 1 3.003-.404c1.02.005 2.046.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.873.12 3.176.77.839 1.233 1.911 1.233 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.814 1.103.814 2.222 0 1.606-.015 2.899-.015 3.293 0 .321.217.696.825.578A12 12 0 0 0 12 0z" />
        </svg>
    );
}

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [oauthLoading, setOauthLoading] = useState<Provider | null>(null);
    const [errorMsg, setErrorMsg] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setErrorMsg(error.message);
            setLoading(false);
            return;
        }

        router.push("/dashboard");
        router.refresh();
    };

    const handleOAuth = async (provider: Provider) => {
        setOauthLoading(provider);
        setErrorMsg("");

        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/confirm`,
            },
        });

        if (error) {
            setErrorMsg(error.message);
            setOauthLoading(null);
        }
        // On success Supabase redirects the browser — no explicit navigation needed.
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">Sign in to your EventUally account</p>
                </div>

                {/* ── OAuth buttons ──────────────────────────────────────── */}
                <div className="space-y-3">
                    <button
                        id="login-google"
                        type="button"
                        onClick={() => handleOAuth("google")}
                        disabled={!!oauthLoading || loading}
                        className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60"
                    >
                        {oauthLoading === "google" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <GoogleIcon />
                        )}
                        Continue with Google
                    </button>

                    <button
                        id="login-github"
                        type="button"
                        onClick={() => handleOAuth("github")}
                        disabled={!!oauthLoading || loading}
                        className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60"
                    >
                        {oauthLoading === "github" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <GitHubIcon />
                        )}
                        Continue with GitHub
                    </button>
                </div>

                {/* ── Divider ────────────────────────────────────────────── */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-3 text-gray-400">or continue with email</span>
                    </div>
                </div>

                {/* ── Email / password form ──────────────────────────────── */}
                <form className="space-y-4" onSubmit={handleLogin}>
                    <input
                        id="login-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1F7A63] focus:outline-none focus:ring-1 focus:ring-[#1F7A63]"
                        placeholder="Email address"
                    />
                    <input
                        id="login-password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1F7A63] focus:outline-none focus:ring-1 focus:ring-[#1F7A63]"
                        placeholder="Password"
                    />

                    {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

                    <div className="flex items-center justify-end">
                        <Link
                            href="/auth/reset"
                            className="text-xs font-medium text-[#1F7A63] hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        id="login-submit"
                        type="submit"
                        disabled={loading || !!oauthLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F7A63] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#196652] disabled:opacity-60"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="font-semibold text-[#1F7A63] hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
