"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { getUserDisplayName, getUserInitial } from "@/lib/auth/getUser";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { user } = useAuth();
    const router = useRouter();
    const displayName = getUserDisplayName(user);
    const initial = getUserInitial(user);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-lg space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

                {/* Avatar card */}
                <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-2xl font-bold text-white select-none">
                        {initial}
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-gray-900">{displayName}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                </div>

                {/* Account actions */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-100">
                        <button className="w-full px-6 py-4 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Edit Profile
                        </button>
                        <button className="w-full px-6 py-4 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Change Password
                        </button>
                        <button className="w-full px-6 py-4 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Notification Preferences
                        </button>
                    </div>
                </div>

                {/* Danger zone */}
                <div className="rounded-xl border border-red-100 bg-white shadow-sm overflow-hidden">
                    <div className="divide-y divide-red-50">
                        <button
                            onClick={handleLogout}
                            className="w-full px-6 py-4 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                            Sign Out
                        </button>
                        <a
                            href="/account-deletion"
                            className="block px-6 py-4 text-sm font-medium text-red-400 hover:bg-red-50"
                        >
                            Delete Account
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
