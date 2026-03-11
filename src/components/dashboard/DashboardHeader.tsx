"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/AuthProvider";
import { getUserDisplayName, getUserInitial } from "@/lib/auth/getUser";

export function DashboardHeader() {
    const { user } = useAuth();
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const displayName = getUserDisplayName(user);
    const initial = getUserInitial(user);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    const menuItems = [
        { label: "Profile", href: "/profile" },
        { label: "My Groups", href: "/groups" },
        { label: "My Events", href: "/events" },
        { label: "Notifications", href: "/notifications" },
        { label: "Settings", href: "/settings" },
        { label: "Delete Account", href: "/account-deletion" },
    ];

    return (
        <header className="sticky top-0 z-40 flex h-13 items-center justify-between border-b border-gray-100 bg-white px-4 sm:px-6">
            {/* Left — app wordmark */}
            <Link href="/dashboard" className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1F7A63] font-bold text-white text-sm select-none">
                    E
                </div>
                <span className="hidden font-bold text-gray-900 text-sm sm:block tracking-tight">
                    EventUally
                </span>
            </Link>

            {/* Right — Bell + Avatar */}
            <div className="flex items-center gap-2">
                {/* Notification Bell */}
                <Link
                    href="/notifications"
                    className="relative rounded-full p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                    aria-label="Notifications"
                >
                    <Bell className="h-5 w-5" />
                </Link>

                {/* Avatar + Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen((o) => !o)}
                        className="flex items-center gap-1.5 rounded-full p-1 hover:bg-gray-50 focus:outline-none"
                        aria-label="User menu"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1F7A63] font-bold text-white text-sm select-none">
                            {initial}
                        </div>
                        <ChevronDown className="h-3.5 w-3.5 text-gray-400 hidden sm:block" />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-black/5 z-50">
                            {/* User info */}
                            <div className="border-b border-gray-100 px-4 py-3">
                                <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                            </div>

                            {menuItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setDropdownOpen(false)}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    {item.label}
                                </Link>
                            ))}

                            <div className="border-t border-gray-100 mt-1">
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
