"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useReminders } from "@/hooks/useData";

export default function NotificationsPage() {
    const { data: notifications, isLoading } = useReminders();

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-2xl space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-sm text-gray-500">Stay up to date with your events and groups.</p>
                </div>

                {isLoading && (
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-16 w-full animate-pulse rounded-xl bg-gray-100" />
                        ))}
                    </div>
                )}

                {!isLoading && notifications && notifications.length > 0 && (
                    <div className="space-y-3">
                        {notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className="flex gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                            >
                                <div
                                    className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${notif.type === "rsvp" ? "bg-orange-400" : "bg-indigo-500"
                                        }`}
                                />
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">{notif.title}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{notif.timeAgo}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && (!notifications || notifications.length === 0) && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                            <Bell className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="font-semibold text-gray-700">All caught up!</h3>
                        <p className="mt-1 text-sm text-gray-400">No new notifications right now.</p>
                        <Link
                            href="/dashboard"
                            className="mt-6 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
