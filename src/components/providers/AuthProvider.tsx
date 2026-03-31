"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

const AuthContext = createContext<{ user: User | null; loading: boolean }>({
    user: null,
    loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // getSession() reads the locally stored token — works on refresh without
        // a network round-trip (unlike getUser() which requires a server call).
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log("[Auth] session on load:", session?.user?.id ?? "none");
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Keep state in sync whenever the session changes (login, logout, token
        // refresh, tab focus, etc.).
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                console.log("[Auth] onAuthStateChange:", _event, session?.user?.id ?? "none");
                setUser(session?.user ?? null);
                // Ensure loading is cleared even if getSession hadn't fired yet
                setLoading(false);
            }
        );

        return () => listener.subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
