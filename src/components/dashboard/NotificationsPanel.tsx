"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

// TODO: Re-enable once backend endpoint /api/notifications is implemented in eventually-app repo.
// TEMPORARILY DISABLED — NotificationsPanel previously called useReminders() which fetches
// /api/notifications. That endpoint does not exist in the Railway backend yet, causing 404
// errors and a "TypeError: e.map is not a function" crash that broke the dashboard.

export function NotificationsPanel() {
    // TEMPORARILY DISABLED
    // const { data: notifications } = useReminders();
    // const latest = notifications?.slice(0, 5);

    return (
        <aside className="hidden w-[260px] flex-shrink-0 flex-col overflow-y-auto border-l border-gray-100 bg-white p-5 xl:flex">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-gray-400" />
                    <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                </div>
                {/* Single "View All" — no duplicate link at bottom */}
                <Link
                    href="/notifications"
                    className="text-xs font-semibold text-[#1F7A63] hover:text-[#16614F]"
                >
                    View All
                </Link>
            </div>

            {/* Static placeholder — no API call made */}
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <Bell className="mb-2 h-7 w-7 text-gray-200" />
                <p className="text-sm text-gray-400">All caught up!</p>
                {/* TODO: render notifications list once /api/notifications exists */}
            </div>
        </aside>
    );
}
