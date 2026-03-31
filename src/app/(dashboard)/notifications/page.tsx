"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

// TODO: Re-enable once backend endpoint /api/notifications is implemented in eventually-app repo.
// TEMPORARILY DISABLED — previously called useReminders() → /api/notifications.
// That endpoint does not exist on Railway yet, causing 404 and runtime crash.

export default function NotificationsPage() {
    // TEMPORARILY DISABLED
    // const { data: notifications, isLoading } = useReminders();

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-2xl space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-sm text-gray-400">Stay up to date with your events and groups.</p>
                </div>

                {/* Static empty state — no API call made */}
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-20 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                        <Bell className="h-8 w-8 text-gray-300" />
                    </div>
                    <h3 className="font-semibold text-gray-700">All caught up!</h3>
                    <p className="mt-1 text-sm text-gray-400">Notifications will appear here once available.</p>
                    {/* TODO: render notifications list once /api/notifications exists
                        {Array.isArray(notifications) && notifications.map((notif) => (
                            <div key={notif.id}>...</div>
                        ))}
                    */}
                    <Link
                        href="/dashboard"
                        className="mt-6 rounded-xl bg-[#1F7A63] px-5 py-2 text-sm font-semibold text-white hover:bg-[#16614F]"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
