"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Search, Menu, X, User as UserIcon, LogOut } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useAuth } from "@/components/providers/AuthProvider";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading } = useAuth();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push("/login");
    };

    const isDashboard = pathname?.startsWith("/dashboard") || pathname?.startsWith("/events") || pathname?.startsWith("/groups");

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <div className="flex items-center gap-8">
                    <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
                            E
                        </div>
                        <span className="text-xl font-bold text-gray-900">EventUally</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        {user && (
                            <Link
                                href="/dashboard"
                                className={`text-sm font-medium transition-colors hover:text-indigo-600 ${isDashboard ? "text-indigo-600" : "text-gray-600"
                                    }`}
                            >
                                Dashboard
                            </Link>
                        )}
                    </nav>
                </div>

                {/* Right Section */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <>
                            <div className="relative hidden lg:block">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                    className="h-9 w-64 rounded-full border-0 bg-gray-100 pl-9 pr-4 text-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                />
                            </div>
                            <button className="relative rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200">
                                <Bell className="h-5 w-5" />
                                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                            </button>

                            {/* User Dropdown / Profile */}
                            <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
                                <div className="text-right hidden lg:block">
                                    <p className="text-sm font-medium text-gray-900">{user.user_metadata.full_name || user.email}</p>
                                    <p className="text-xs text-gray-500">Member</p>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                                    {user.user_metadata.full_name ? user.user_metadata.full_name[0] : (user.email ? user.email[0].toUpperCase() : "U")}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="ml-2 text-gray-400 hover:text-gray-600"
                                    title="Sign Out"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        </>
                    ) : (
                        !loading && (
                            <div className="flex items-center gap-4">
                                <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                                    Log in
                                </Link>
                                <Link
                                    href="/signup"
                                    className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )
                    )}
                </div>

                {/* Mobile Menu Button  */}
                <button
                    className="md:hidden p-2 text-gray-600"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-4">
                    {user ? (
                        <>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                                    {user.user_metadata.full_name ? user.user_metadata.full_name[0] : (user.email ? user.email[0].toUpperCase() : "U")}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{user.user_metadata.full_name || user.email}</p>
                                </div>
                            </div>
                            <Link href="/dashboard" className="block text-base font-medium text-gray-900" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                            <button
                                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                className="block w-full text-left text-base font-medium text-red-600"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="block text-base font-medium text-gray-900" onClick={() => setIsMenuOpen(false)}>Log in</Link>
                            <Link href="/signup" className="block text-base font-medium text-indigo-600" onClick={() => setIsMenuOpen(false)}>Sign up</Link>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}
