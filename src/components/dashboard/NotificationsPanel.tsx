"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useReminders } from "@/hooks/useData";

export function NotificationsPanel() {
    const { data: notifications } = useReminders();
    const latest = notifications?.slice(0, 5);

    return (
        <aside className="hidden w-[260px] flex-shrink-0 flex-col overflow-y-auto border-l border-gray-100 bg-white p-5 xl:flex">
            {/* Header — single "View All" link. No duplicate at bottom. */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-gray-400" />
                    <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                </div>
                <Link
                    href="/notifications"
                    className="text-xs font-semibold text-[#1F7A63] hover:text-[#16614F]"
                >
                    View All
                </Link>
            </div>

            {/* Notification list */}
            <div className="flex-1 space-y-2">
                {latest?.map((notif) => (
                    <div key={notif.id} className="flex gap-3 rounded-xl bg-gray-50 p-3">
                        <div
                            className={`mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full ${notif.type === "rsvp" ? "bg-orange-400" : "bg-[#1F7A63]"
                                }`}
                        />
                        <div className="min-w-0">
                            <h4 className="truncate text-sm font-medium text-gray-900">{notif.title}</h4>
                            <p className="text-xs text-gray-400">{notif.timeAgo}</p>
                        </div>
                    </div>
                ))}

                {(!latest || latest.length === 0) && (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <Bell className="mb-2 h-7 w-7 text-gray-200" />
                        <p className="text-sm text-gray-400">All caught up!</p>
                    </div>
                )}
            </div>
            {/* No bottom "View All Notifications" redundant link */}
        </aside>
    );
}
