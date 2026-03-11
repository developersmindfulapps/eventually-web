import { supabase } from "@/lib/supabase/client";

export async function getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export function getUserDisplayName(user: { user_metadata?: { name?: string }; email?: string } | null): string {
    if (!user) return "Friend";
    return user.user_metadata?.name || user.email?.split("@")[0] || "Friend";
}

export function getUserInitial(user: { user_metadata?: { name?: string }; email?: string } | null): string {
    const name = getUserDisplayName(user);
    return name.charAt(0).toUpperCase();
}

export function getGreeting(name: string): string {
    const hour = new Date().getHours();
    let greeting: string;
    if (hour >= 5 && hour < 12) greeting = "Good morning";
    else if (hour >= 12 && hour < 17) greeting = "Good afternoon";
    else if (hour >= 17 && hour < 22) greeting = "Good evening";
    else greeting = "Hello";
    return `${greeting}, ${name}`;
}
